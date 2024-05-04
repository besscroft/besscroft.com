---
title: "Next SSR 开发与实践"
date: 2024-05-05T00:24:00+08:00
tags: ["教程","Next","Next.js","SSR"]
categories: ["技术"]
---

## 前言

五一假期期间，我发布了 [PicImpact](https://github.com/besscroft/PicImpact) 的第一个公开版本，是 [Kamera]() 的下一代产品，使用 Next.js 开发，而 kamera 是用的 Nuxt3 开发的。前端的 SSR 框架，并不像后端的框架那么好用，后端的各种中间件、开发模型、面向切面编程（AOP）、统一异常处理等等，这些可以高度抽象且降低重复劳动的东西，基本上是别想太多。

Next.js 从 v12 开始 Beta 中间件，到我用的 v14 版本，已经趋于稳定了。但是它有一个最致命的限制：Middleware only supports the [Edge runtime](https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes). The Node.js runtime cannot be used.在这一点上，Nuxt3 的中间件，是要比 Next 好用许多的。但 Nuxt3 也有很多不好的地方，有太多的[官方模块](https://nuxt.com/docs/community/roadmap)，迟迟没有推出。就比如我在实现用户登录的时候，要研究写入 cookies 的最佳实践，当然我最后还是选择了用 pinia 来手动管理。

我用 Nuxt3 和 Next.js 写了一些开源和 private 项目，就目前给我的感觉而言，双方的路线还是有很大的差异化的。没有说谁最好，但是选型时还是可以根据需求和对应框架提供的能力来决定，况且 Vue 和 React 生态都有我喜欢但另一边没什么平替的库。

这篇博客，基于我开发过的一些项目（PicImpact），来梳理大概的流程和实践，不管你有没有实际开发经验，当你想上手时，都会帮你绕过一些坑。

## 概述

![](/images/articles/2024/next-ssr-practice/001.png)

阅读前其实希望读者对 React 和 JavaScript 有基本的了解，组件、道具、状态和钩子之类的。文章可能会涉及到下面这些知识：

- 路由：布局、页面、路由跳转、中间件等等，都跟路由相关。
- 数据获取和重新验证：在 server 和 client 如何获取数据。
- 状态机制：在改变数据的同时，制作最佳的用户体验。
- 错误处理：一点小经验。
- 身份验证：处理登录和认证，并结合中间件保护路由和“接口”。
- 数据迁移：基于 prisma 迁移表结构，Next.js 控制数据更新生命周期。
- 无障碍：虽然很难在好的设计和无障碍之间平衡，但也并非无法改善。
- Edge Runtime：最怕 Only Edge Runtime，谁懂啊！

## 实践

实践部分，主要基于  [PicImpact](https://github.com/besscroft/PicImpact) 来写。

### 布局、页面和路由

![](/images/articles/2024/next-ssr-practice/002.png)

我们可以看到，首页的布局，采用了 2 大块布局，在 Header 部分，会在服务端渲染路由部分，点击不同的路由，跳转到不同的页面。在这里只有第一次是服务端渲染，后续的路由渲染会变为客户端渲染，这是因为 `useRouter` 和 `useParams` 都是客户端组件，要在客户端进行 active 的判断，而初次服务端渲染，可以保证首屏体验最佳。

![](/images/articles/2024/next-ssr-practice/003.png)

在布局的设计上，我采用了 [Route Groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups)，用来区分不同的业务布局，而不是单纯的父子嵌套关系。这点在 Nuxt 那边的体验就好点，Next 会更加考验你对业务的抽象能力。

### 数据获取

获取形式主要分两大类：API（通过 api 请求 server 或者第三方服务）、数据库查询。

![](/images/articles/2024/next-ssr-practice/004.png)

API 是应用程序代码和数据库之间的中间层，一般在客户端请求 API 层，然后获取数据，避免直接把数据库暴露给客户端。这在前后端分离的场景中很常见，前端请求接口，后端提供业务逻辑和数据库交互能力。

> 注：Next.js 中，常把 API 叫做 Route。在后端我们常说的接口，在 Next 中就是一个特殊的 route，是一个在服务器上运行的 API 层，它可以处理 req 和 res。

#### React Server Components

在 Next.js 中，我们也可以用“服务器操作”的形式来获取数据，也就是常说的 RSC。

```tsx
export default async function Page() {
  const getData = async () => {
    'use server'
    return await fetchDatabase()
  }
  const data = await getData()
  return <main>{data}</main>
}
```

这样可以不用写“接口”也能直接查询数据库，并且不会暴露到客户端。

#### SWR

讲到这里，就不得不介绍 SWR 了，一种由 [HTTP RFC 5861](https://tools.ietf.org/html/rfc5861) 推广的 HTTP 缓存失效策略。这种策略首先从缓存中返回数据（过期的），同时发送 fetch 请求（重新验证），最后得到最新数据。

先来看一个最简单的原生的 fetch  请求：

```js
async function getData() {
  const data = await fetch('https://baidu.com')
  .then((res: any) => res.json())
  console.log(data)
}
```

在真实的业务场景，我们必须得知道每个异步请求的状态，对吧？因为要根据状态显示不同的 UI，比如在请求时，页面上显示 `Loading...` ，结束请求后正常渲染结果。用专业点的话说就是，每一个异步请求，都是一个独立的**状态机**，每个都会在不同的状态中流转：

- data：有响应数据，代表请求成功。
- error：有错误，代表请求失败。
- isLoading：请求是否正在进行。

在 SWR 中，有一个 `isValidating` 状态：

- 无论数据是否已加载，只要有一个正在进行中的请求，`isValidating` 都会变为 `true` 。
- 当数据尚未加载并且有一个正在进行的请求时，`isLoading` 会变为 `true` 。

看到区别了吗？没错，实际场景中，`isLoading` 通常放在第一次渲染用，而 `isValidating` 适用于已经有数据时的自动更新/静默更新场景。

> 我开发时，由于业务并没有分这么细，所以偷懒直接 `isLoading && isValidating` 了。

你看哈，如果每一个异步请求都要维护状态，是不是很麻烦？所以 SWR 就很好的解决了我们的痛点，并且它还有其它更好用的 api。

```js
const { data, error, isLoading, isValidating, mutate } = useSWR(key, fetcher, options)
```

>- `key`: 请求的唯一 key string（或者是 function / array / null）
>- `fetcher`:（*可选*）一个请求数据的 Promise 返回函数
>- `options`:（*可选*）SWR hook 的配置选项对象

```js
const { data, error, isLoading, isValidating, mutate } = useSWR('https://baidu.com', 
  (url: string) => fetch(url).then((res) => res.json()));
```

我们用 useSWR 改造之前的 fetch 请求，可以看到，`url` 直接用作了状态机的 `key`，同时也可以作为参数传递给 `fetcher`，`fetcher` 也正是请求函数。

#### 重新请求

为啥我上面把 key 叫做状态机的 key 呢？因为咱们可以在客户端的任何组件中，获取全局配置，来 `mutate` 触发状态机的状态，重新获取数据：

```js
import { useSWRConfig } from 'swr'

export default function Page() {
  const { mutate } = useSWRConfig()
  return (
    <Button
	  onClick={async() => await mutate()}
    >
      更新
	</Button>
  )
}
```

这是我觉得最好用的功能之一，同时解决了代码复用和组件 props 传递的烦恼。同时我们也可以利用自动重新请求机制来获得更好的用户体验，这就区别于 `mutation` 的手动控制了：

```js
const { data, error, isLoading, isValidating, mutate } = useSWR('https://baidu.com', 
  (url: string) => fetch(url).then((res) => res.json())
  , { refreshInterval: 1000 });
```

这里的 `refreshInterval` 用于控制定期重新请求。

### 状态机制

![](/images/articles/2024/next-ssr-practice/005.png)

图中的模式，表示在开启 `keepPreviousData` 选项并设置预设数据时，请求数据，再改变 key 值，并在之后进行重新请求的场景。

![](/images/articles/2024/next-ssr-practice/006.gif)

可以看到，我们改变了值并重新加载，也可以保留之前的数据。并且在分页场景下，点到下一页时，仍旧会保留上一页的数据，这样避免了数据的重复获取，也提升了用户体验。

### 错误处理

文档中有推荐用 `error.tsx` 来捕获意外错误，并显示错误页面给用户，但我不是很喜欢这种方式（我写的错误页面不好看...），所以我常用下面的方式尽可能处理错误：

```js
const { data, error, isLoading, isValidating, mutate } = useSWR('https://baidu.com', 
  (url: string) => fetch(url).then((res) => res.json()));

if (error) {
  // 处理错误
}
```

```js
export async function Page() {
  try {
    const findAll = await db.$queryRaw`
    SELECT 
       *,
    FROM 
       "public"."Images"
  `
  } catch (error) {
    throw new Error('查询错误');
  }
}
```

### 身份验证

身份验证框架，我选择了 [Auth.js](https://authjs.dev/)，它抽象化了管理会话、登录和注销以及身份验证其他方面所涉及的大部分复杂性。挺省事儿的，唯一不爽的地方，就是 middleware 在 vercel 上只能在 Edge 运行时跑，真的烦。

### 数据迁移

用 prisma 来迁移表结构就不多说了，这里主要介绍 Next.js 的 [Instrumentation](https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation)，可以在启动新的 Next.js 服务器实例时，将调用该函数**一次。**

```ts
import { PrismaClient } from '@prisma/client'

export async function register() {
  try {
    if (process.env.NEXT_RUNTIME === 'edge') {
      return
    }
    const prisma = new PrismaClient()
    if (prisma) {
      await prisma.$transaction(async (tx) => {
        // ...
      })
      console.log('初始化完毕！')
      await prisma.$disconnect()
    } else {
      console.error('数据库初始化失败，请检查您的连接信息！')
    }
  } catch (e) {
    console.error('初始化数据失败，您可能需要准备干净的数据表，请联系管理员！', e)
  }
}
```

### 无障碍

可访问性（[Accessibility](https://web.dev/learn/accessibility/)）是指设计和实现每个人（包括残障人士）都可以使用的 Web 应用程序。这是一个涵盖许多领域的广阔主题，例如键盘导航、语义 HTML、图像、颜色、视频等。

在开发时，我们可以用 `next lint` 命令来检查项目中的可访问性问题，在 Next.js 中包含了一个 [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y) 插件。同时记得添加 [aria-label](https://developer.mozilla.org/zh-CN/docs/Web/Accessibility/ARIA/Attributes/aria-label) 标签。

## 最后

得益于 React 和 Next.js 的强大生态，以及之前进行 SSR 开发的经验，这次在设计 PicImpact 时，算是少走了不少弯路，它有着更好的设计、更优的性能，我在保留之前大部分功能的同时，进行了更多良性的可拓展设计。

当然这个项目也还有很多不足的地方，Next.js 本身也是一个很考验代码抽象能力的框架，更何况还用了 typescript。

最后感谢你能看到这里，有想法欢迎与我交流！
