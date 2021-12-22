---
title: "给vue-admin-template添加TagsView"
date: 2020-12-12T16:57:33+08:00
tags: ["Vue"]
categories: ["技术"]
---

## 前言

之前规划着做一做自己的比较正式一点的项目，基于SpringBoot开发的前后端分离项目，但是自己本身只是Java后端为主的，所以前端功底并不好。于是就采用了[vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)的基础模板[vue-admin-template](https://github.com/PanJiaChen/vue-admin-template)来进行开发。同时也可以基于自己的需要，增加很多组件上去。

## 开始

### 官方案例的对比

{% tabs 选项卡 1 %}
<!-- tab 无tagsView -->
<img src="/images/tech/2020/vue-add-tagsview/vue-add-tagsview01.png" />
<!-- endtab -->
<!-- tab 有tagsView -->
<img src="/images/tech/2020/vue-add-tagsview/vue-add-tagsview02.png" />
<!-- endtab -->
{% endtabs %}

我们可以清楚的看到，有无tagsView的区别。

### 添加

既然需要这个组件，那么就添加上去吧，好在官方的完整解决方案中，是有这个代码的。

#### 复制文件

我们需要先从[vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)复制一些必要的文件过来。

* `src/layout/components/TagsView` 注意，这是一整个文件夹，全部复制进去。地址： https://github.com/PanJiaChen/vue-element-admin/tree/master/src/layout/components

![](/images/tech/2020/vue-add-tagsview/vue-add-tagsview03.png)

* `src/store/modules/tagsView.js`，复制这个文件到相应的位置，不知道位置的，就看这个文件的路径。。。地址：https://github.com/PanJiaChen/vue-element-admin/blob/master/src/store/modules/tagsView.js

#### 修改文件

* 修改`vue-admin-template\src\layout\components\AppMain.vue`

修改如下代码：

![](/images/tech/2020/vue-add-tagsview/vue-add-tagsview04.png)

```vue
<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
<!--        <router-view :key="key" />-->
        <router-view></router-view>
      </keep-alive>
    </transition>
  </section>
</template>
```

修改如下代码：

![](/images/tech/2020/vue-add-tagsview/vue-add-tagsview05.png)

```javascript
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    }
    // ,
    // key() {
    //   return this.$route.path
    // }
  }
}
```

新增如下代码：

![](/images/tech/2020/vue-add-tagsview/vue-add-tagsview06.png)

```css
.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
```

* 修改`vue-admin-template\src\layout\components\index.js`

![](/images/tech/2020/vue-add-tagsview/vue-add-tagsview08.png)

```vue
export { default as TagsView } from './TagsView'
```

* 修改`src\layout\index.vue`

修改如下代码：

![](/images/tech/2020/vue-add-tagsview/vue-add-tagsview09.png)

```vue
<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
      </div>
      <tags-view />
      <app-main />
    </div>
  </div>
</template>
```

修改如下代码：

![](/images/tech/2020/vue-add-tagsview/vue-add-tagsview10.png)

```javascript
import { Navbar, Sidebar, AppMain, TagsView } from './components'
```

修改如下代码：

![](/images/tech/2020/vue-add-tagsview/vue-add-tagsview11.png)

```json
components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView
}
```

* 修改`src\settings.js`

![](/images/tech/2020/vue-add-tagsview/vue-add-tagsview12.png)

```javascript
/**
 * @type {boolean} true | false
 * @description 是否开启标签栏缓存
 */
tagsView: true
```

* 修改`src\store\getters.js`

![](/images/tech/2020/vue-add-tagsview/vue-add-tagsview13.png)

```javascript
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews
}
export default getters
```

* 修改`src/store/index.js `

![](/images/tech/2020/vue-add-tagsview/vue-add-tagsview14.png)

```javascript
import user from './modules/user'
import tagsView from './modules/tagsView'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    tagsView,
    user
  },
  getters
})
```

* 修改`src/store/modules/settings.js`

![](/images/tech/2020/vue-add-tagsview/vue-add-tagsview15.png)

```javascript
import defaultSettings from '@/settings'

const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings

const state = {
  showSettings: showSettings,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo
}
```

至此，我们就把新功能添加上去啦！😉

### 完成

现在我们来看看添加后的效果吧！

![](/images/tech/2020/vue-add-tagsview/vue-add-tagsview16.png)