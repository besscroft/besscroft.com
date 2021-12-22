---
title: "NexT主题个性定制与深度优化"
date: 2019-03-29T15:45:51+08:00
categories: ["技术"]
tags: ["个性"]
---

“互联网精神”即：开放、平等、协作、快速、分享。感谢我的生命之中有互联网，让我脑海中的开源共享有了实现的可能。能拥有自己的博客，不仅记录自己，还能分享他人！

## 写在前面

### 容我先bb几句

首先肯定是感谢各位大佬的文章，我一个小白，靠着Google搭建了自己的博客……如果你是一个和我一样的小白，而且对我的博客感觉还蛮满意的话，恭喜你！看完这篇文章，你自己也可以拥有一个~~可能不太~~漂亮~~的~~博客啦！

这篇文章主要是写给跟我一样的小白们看的，当然也方便自己以后忘记了来查阅。如果各位大佬不慎看到，如有不足之处还欢迎指出来哦，还请见谅！我在搭建博客的时候，看到很多博客，写了一些比较好的文章，但是有时候却忘记收藏了。别告诉我只有我一个人设置的关闭浏览器时自动清理的......许多时候还是挺后悔的，为什么当时没收藏。因为这种文章，肯定是比某度随便一搜索找到的教程要准确的多的，毕竟人家博主可能真的是有在认真的写。

### 我的本地环境

有时候出问题的原因可能会有很多，如果你决定用我的这篇文章来做参考的话，那么我就把我的环境给你参考。因为可能大家一样的操作的话，并不一定实现的结果都是相同的。嗯~ o(*￣▽￣*)o，没错，我有时候Google按照流程来，结果疯狂报错。。。

大家都知道，外星人阻断了我们与Google的链接，导致无法访问，不过估计能看到这篇文章的人，应该是具有了访问Google的能力了。如果你是在是无法访问，可以去全球最大的同性交友社区GitHub看看呢，附上大神的开源项目[入口](https://laod.cn/wp-content/themes/begin/to.php?url=aHR0cHM6Ly9naXRodWIuY29tL2dvb2dsZWhvc3RzL2hvc3Rz)👉

```
/* 调试用的浏览器 */
Google Chrome Version 73.0.3683.75（Official version）（64-bit）
QQ Browser 10.4(3341) Chromium70.0.3538.25\IE11.379.17763.0
Microsoft Edge 44.17763.1.0
Internet Explorer 11.379.17763.0
//IE8及以下版本无法正常显示

/* 版本信息 */
$ hexo version
hexo: 3.8.0
hexo-cli: 1.1.0
os: Windows_NT 10.0.17763 win32 x64
http_parser: 2.8.0
node: 10.15.3
v8: 6.8.275.32-node.51
uv: 1.23.2
zlib: 1.2.11
ares: 1.15.0
modules: 64
nghttp2: 1.34.0
napi: 3
openssl: 1.1.0j
icu: 62.1
unicode: 11.0
cldr: 33.1
tz: 2018e


/* 依赖包 */
$ cat package.json
{
  "name": "hexo-site",
  "version": "0.0.0",
  "private": true,
  "hexo": {
    "version": "3.8.0"
  },
  "dependencies": {
    "hexo": "^3.8.0",
    "hexo-asset-image": "0.0.3", /* 图片显示 */
    "hexo-blog-encrypt": "^2.1.1",
    "hexo-deployer-git": "^1.0.0", /* Git 部署工具 */
    "hexo-douban": "^1.1.3", /* 豆瓣页面生成 */
    "hexo-generator-archive": "^0.1.5",
    "hexo-generator-baidu-sitemap": "^0.1.6", /* 生成 sitemap.xml，利于 SEO */
    "hexo-generator-category": "^0.1.3", /* 默认安装 */
    "hexo-generator-feed": "^1.2.2", /* RSS */
    "hexo-generator-index": "^0.2.1", /* 默认安装 */
    "hexo-generator-sitemap": "^1.2.0", /* 生成 sitemap.xml，利于 SEO */
    "hexo-generator-tag": "^0.2.0", /* 默认安装 */
    "hexo-helper-live2d": "^3.1.1", /* 看板娘 */
    "hexo-renderer-ejs": "^0.3.1",
    "hexo-renderer-marked": "^0.3.2",
    "hexo-renderer-stylus": "^0.3.3",
    "hexo-server": "^0.3.3", /* 默认安装 */
    "hexo-symbols-count-time": "^0.4.4",
    "hexo-tag-aplayer": "^3.0.4", /* 音乐播放插件，支持歌词 */
    "hexo-tag-dplayer": "^0.3.3", /* 视频播放插件，支持弹幕 */
    "hexo-wordcount": "^6.0.1", /* 字数统计 */
    "live2d-widget-model-koharu": "^1.0.5" /* 看板娘 */
  }
}

/* 主题NexT版本 */
NexT.Muse v7.1.0

/* 优化主题NexT的设计版式 */
Muse
```

样式还是看自己选择吧，我觉得都能设计的挺好看的，主要是看你想呈现出一个怎样的界面出来！

### 注意！

站点配置文件和主题配置文件，名字都叫`_config.yml`，容易乱，这一点我在其它文章也不止一次的提过了。

- 站点配置文件，位于站点文件夹根目录内：

```
~/blog/_config.yml
```

- 主题配置文件，位于主题文件夹根目录内：

```
~/blog/themes/<你的主题>/_config.yml
```

## Go

### 搭建博客

进入正题啦！由于我以及写过了，不知道为什么这时候有一种偷完懒之后的感觉，真香~😂

好吧，附上快速访问链接👉[Hexo博客搭建](https://blog.52bess.com/hexo.html)

建议大家一定要看一看官方文档哦，毕竟是👉[官方文档](https://hexo.io/zh-cn/docs/)

当然了，你如果对GitHub提供的Pages服务不太满意的话，也可以选择搭建在自己的(Linux)服务器上，只不过会增加些开销！！！

### What is GiyHub Pages?

GitHub Pages是一种静态站点托管服务，旨在直接从GitHub存储库托管您的个人，组织或项目页面。这里附上GitHub Pages的网址👉[你好，世界](https://pages.github.com/)

| **问题**                                                     | 解答                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| Why is GitHub Pages?                                         | 首先免费，其次省心，最后可以学习使用 GitHub。                |
| GitHub Pages有使用限制吗？                                   | GitHub Pages源存储库的建议限制为1GB，每月100G流量，每小时大约能更新10次版本。超出配额后，可能会收到礼貌的邮件 |
| 超出限制的容量、或者是流量怎么办？                           | 建议平常就使用国内各大云服务提供商，如[七牛云KODO](https://www.qiniu.com/products/kodo)、[阿里云OSS](https://www.aliyun.com/product/oss)、[腾讯云COS](https://cloud.tencent.com/product/cos)、[百度云BOS](https://cloud.baidu.com/product/bos.html)等提供的对象存储上。甚至还可以设置[镜像回源](https://help.aliyun.com/wordpower/452476-1.html)。 |
| 国内访问速度不行，有必要同时部署在 [Coding](https://coding.net/)上吗？ | 可以，但没必要。我原来是同时部署的，但是经常502，说来也巧，放弃Coding后，再也不502了。但是，Coding是部署在香港的服务器的哦！但是Coding经常被上有服务上暂停服务。。。 |
| 我可以用自己的域名吗？                                       | 可以，并且支持https。                                        |
| 可以用作商业用途吗？                                         | GitHub Pages不适用于或不允许用作免费的网络托管服务来运行您的在线业务，电子商务网站或任何其他主要针对促进商业交易或提供商业软件即服务的网站（SaaS） |

如果你要去七牛云使用对象存储服务的话，不妨使用我的👉[邀请链接](https://portal.qiniu.com/signup?code=3lcqpyrc4dy6q)，那样我就会获得5 GB/月 CDN 免费下载流量等奖励👌

### 可能遇到的错误

强制执行GitHub Pages的https，可能会遇到一些混合内容的问题。

如果您为自己的网站启用了HTTPS，并且您网站的HTML仍然通过HTTP引用了图片，CSS或JavaScript，那么您的网站就会提供混合内容，并且您可能无法加载资源。提供混合内容也会降低您网站的安全性。

要删除网站的混合内容，提高网站的安全性，并解决与加载混合内容相关的问题，修改网站的HTML文件并进行更改`http://`，`https://`以便通过HTTPS提供所有资源。

更多详情👉[入口](https://help.github.com/en/articles/securing-your-github-pages-site-with-https#resolving-problems-with-mixed-content)

## 基本配置

### 主题

默认的主题感觉不是很好看的样子，但是别的主题就不一样啦！😁我选的是[NexT主题](https://github.com/iissnan/hexo-theme-next)，简洁美观、功能也算完善。这里附上官方的👉[主题库链接](https://hexo.io/themes/)

### 站点文件配置

可以先去看看👉[官方文档](https://hexo.io/zh-cn/docs/configuration.html)是怎么介绍的，然后可以参考参考我的👉[站点文件基本配置](https://www.52bess.com/zhandian.html)，需要更多的操作，可以自己去Google看看呢！

### 主题文件配置

没错，还是建议你先看NexT主题的👉[官方文档](https://theme-next.iissnan.com/)，一定要养成这个好习惯！啥都不说了，把我的贴出来大家参考吧！

```
# ---------------------------------------------------------------
# Theme Core Configuration Settings
# See: https://theme-next.org/docs/theme-settings/
# ---------------------------------------------------------------
# 更新相关，参考：
# https://github.com/iissnan/hexo-theme-next/issues/328
override: false

# ---------------------------------------------------------------
# Site Information Settings
# ---------------------------------------------------------------

# 站点图标直接去 https://realfavicongenerator.net 下载
# 建议放在 hexo-site/source/images/ 里（没有自己建）
favicon:
  small: /images/favicon-16x16-dog.png
  medium: /images/favicon-32x32-dog.png
  apple_touch_icon: /images/apple-touch-icon-next.png
  safari_pinned_tab: /images/logo.svg
# 修改图片名字保持一致即可！


rss: /atom.xml

footer:		# 页脚配置
  since: 2018   # 这里填入你的建站年份

  icon:
    # 年份后面的图标，为 Font Awesome 图标
	# 去挑一个吧！ https://fontawesome.com/v4.7.0/
    name: fas fa-heartbeat	  # 图标名字
    animated: true		  # 让你的图标跳动起来！
    color: "#ff0000"      #看到我博客页脚的跳动着的红色爱心了吗？
  copyright:
  # -------------------------------------------------------------
  powered:
    enable: true
    version: true
    # 你不想页脚显示 由 Hexo 强力驱动 v3.8.0，可以关闭！
  theme:
    enable: true
    version: true
    # 同理，你不想页脚显示 主题 – NexT.Muse v7.1.0，可以关闭！
    
    beian:
    enable: false
    icp: 
    # 同理，如果你有备案信息，也可以放在这里
    
# ---------------------------------------------------------------
# SEO Settings
# ---------------------------------------------------------------

canonical: true

seo: false

# If true, will add site-subtitle to index page, added in main hexo config.
# subtitle: Subtitle
index_with_subtitle: false

# ---------------------------------------------------------------
# Menu Settings
# ---------------------------------------------------------------

# 菜单设置 || 菜单图标设置（图标上面说了，不重复）
# 项目换行可以更改显示顺序
# 如果这个项前会显示 .menu
# 解决方法：编辑 ~/blog/themes/next/languages 下的相应文件
# 比如添加一个「留言」菜单，站点配置文件的 language 是 zh-CN
# 则编辑 zh-CN.yml，在 menu: 项内添加一行 留言: 留言
# 注意空格，且符号 : 为英文字符！
menu:
  home: / || home
  tags: /tags/ || tags
  categories: /categories/ || th
  archives: /archives/ || archive
  about: /about/ || user
  books: /books/ || book  
  movies: /movies/ || video-camera  
  games: /games/ || gamepad

# Enable/Disable menu icons.
# 是否开启菜单图标
menu_settings:
  icons: true
  badges: false
  
# ---------------------------------------------------------------
# Scheme Settings
# ---------------------------------------------------------------

# 设计板式，都长啥样，去 README 里面的链接里看看
# https://github.com/iissnan/hexo-theme-next#live-preview
# Schemes
scheme: Muse
#scheme: Mist
#scheme: Pisces
#scheme: Gemini


site_state: true

# 侧栏社交链接设置，与上面菜单差不多，要生效记得把前面的 # 去掉
social:
  GitHub: https://github.com/besscroft || github
  E-Mail: mailto:631908942@gmail.com || envelope
  
# 侧栏社交链接图标设置
social_icons:
  enable: true
  icons_only: false
  transition: false
  
# 侧栏友链设置
links_icon: globe
links_title: 友♂链
links_layout: block
#links_layout: inline
links:
  关于此博客: https://blog.52bess.com/about/
  
avatar:
 # 侧栏头像设置
  url: https://*****.com/avatar.png
  rounded: false
  opacity: 1
  rotated: false
  
toc:
  enable: true

  number: true

  wrap: false
# 开启后可能要在 custom.styl 里加代码
  max_depth: 6
  
sidebar:
  # 侧栏的位置，left或right
  position: left
  
  display: post   # 样式我的是默认的post
  # 只对 Pisces 和 Gemini 设计版式有效！
  offset: 12
  # 只对 Muse 和 Mist 设计版式有效！
  onmobile: false
  # 移动端显示侧栏，只对 Muse 和 Mist 设计版式有效！
  dimmer: false

# ---------------------------------------------------------------
# Post Settings
# ---------------------------------------------------------------

# 点击 [Read More]，页面自动滚动到 <!-- more --> 标记处
scroll_to_more: false

# 用 cookies 保存浏览的位置信息，意味着重新打开这个页面后
# 页面就会自动滚动到上次的位置，除非读者清理浏览器 cookies
save_scroll: false

# 将每篇文章 Front-matter 里 description 的文字作为页面显示的文章摘要
excerpt_description: false

# 按字数自动加入 [Read More]，不建议！
# 建议在文章中加入 <!-- more -->
# 自定义 [Read More] 按钮之前要显示的内容！
auto_excerpt:
  enable: false
  length: 150

# 文章顶部显示的文章元数据设置
post_meta:
  item_text: true # 显示文字说明
  created_at: true # 显示文章创建时间
  updated_at:
    enable: true # 隐藏文章修改时间
    another_day: true # 只有当修改时间和创建时间不是同一天的时候才显示
  categories: true # 隐藏分类信息

# Dependencies: https://github.com/willin/hexo-wordcount
# 显示统计字数和估计阅读时长
# 注意：这个要安装插件，先进入站点文件夹根目录
# 然后：npm install hexo-wordcount --save
post_wordcount:
  item_text: true
  wordcount: true
  min2read: false
  totalcount: false
  separated_meta: false

# Wechat Subscriber
wechat_subscriber:
  enable: true
  qcode: /uploads/wechat-qcode.jpg
  description: 欢迎您扫一扫上面的微信公众号，订阅我的博客！
  
# Reward
reward:
  wechatpay: /images/wechatpay.jpg
  
# Declare license on posts
post_copyright:
  # enable: false
  # license: CC BY-NC-SA 3.0
  # license_url: https://creativecommons.org/licenses/by-nc-sa/3.0/
  # 版权信息
  
# ---------------------------------------------------------------
# Misc Theme Settings
# ---------------------------------------------------------------

# 移动端把页面两边留白去除
# Reduce padding / margin indents on devices with narrow width.
mobile_layout_economy: false

# Android 上 Chrome 浏览器顶部颜色设置
android_chrome_color: "#222"
# Android 端 QQ浏览器，很多配置都无法显示出来。。。

# Custom Logo
# Do not support Scheme Mist currently.
custom_logo:
  enable: false
  image: #/uploads/custom-logo.jpg
  
# Available value:
#    normal | night | night eighties | night blue | night bright
# https://github.com/chriskempson/tomorrow-theme
# 代码高亮主题设置
# 都长啥样自己点开上面的链接查看
highlight_theme: normal

# 字体设置
font:
  enable: true

  # 外链字体库地址，例如 //fonts.googleapis.com (默认值)
  host: https://fonts.loli.net

  # Global font settings used for all elements in <body>.
  global:
    external: true
    family: Noto Serif SC
    size:

  # Font settings for Headlines (H1, H2, H3, H4, H5, H6).
  # Fallback to `global` font settings.
  headings:
    external: true
    family: Noto Serif SC
    size:

  # Font settings for posts.
  # Fallback to `global` font settings.
  posts:
    external: true
    family: Noto Serif SC

  # Font settings for Logo.
  # Fallback to `global` font settings.
  logo:
    external: true
    family: Noto Serif SC
    size:

  # Font settings for <code> and code blocks.
  codes:
    external: true
    family:
    size:
    
# ---------------------------------------------------------------
# Third Party Services Settings
# ---------------------------------------------------------------

# Math Equations Render Support
math:
  enable: false
  per_page: true

  engine: mathjax
  #engine: katex

  mathjax:
    cdn: //cdn.jsdelivr.net/npm/mathjax@2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML
 # 这一大串都是默认的，还有一些不列举了，感觉会水贴
 
# Han Support docs: https://hanzi.pro/
# 汉字标准格式，没用过暂时不了解
han: false

# 评论系统，当然id和key我就不提供了，这个可以自己去注册
# leancloud网址：https://leancloud.cn/dashboard/login.html#/signup
valine:
  enable: true # 是否开启
  appid:  # 你的leancloud应用appid
  appkey:  # 你的leancloud应用appkey
  notify: false # mail notifier, See: https://github.com/xCss/Valine/wiki
  verify: true 
  placeholder: 说点儿什么吧o(*￣▽￣*)o 
  avatar: mm 
  guest_info: nick,mail,link r
  pageSize: 10 
  visitor: false 
  comment_count: true 

# 不蒜子统计，用于在页脚显示总访客数和总浏览量，将 false 改为 true 就能直接使用
busuanzi_count:
  enable: true
  total_visitors: true
  total_visitors_icon: user
  total_views: true
  total_views_icon: eye
  post_views: true
  post_views_icon: eye

# 要安装插件才能使用，先进入站点文件夹根目录
# 然后：npm install hexo-generator-searchdb --save
local_search:
  enable: true
  trigger: auto
  top_n_per_article: 1
  unescape: false
  
# ---------------------------------------------------------------
# Tags Settings
# ---------------------------------------------------------------

# 主题的标签样式，有 simple、note、label、tabs 四种
note:
  style: simple
  icons: false
  border_radius: 3
  light_bg_offset: 0
  
# 标签
tabs:
  enable: true
  transition:
    tabs: false
    labels: true
  border_radius: 0
  
# Use velocity to animate everything.
motion:
  enable: true
  async: false
  transition:
    post_block: fadeIn
    post_header: slideDownIn
    post_body: slideDownIn
    coll_header: slideLeftIn
    sidebar: slideUpIn

# 动态背景，但是我觉得放一张好看的图片更好
canvas_nest:
  enable: false
  onmobile: true # display on mobile or not
  color: '0,0,255' # RGB values, use ',' to separate
  opacity: 0.5 # the opacity of line: 0~1
  zIndex: -1 # z-index property of the background
  count: 99 # the number of lines
# JavaScript 3D library.
# Dependencies: https://github.com/theme-next/theme-next-three
# three_waves
three_waves: false
# canvas_lines
canvas_lines: false
# canvas_sphere
canvas_sphere: false

vendors:
  # Internal path prefix. Please do not edit it.
  _internal: lib
  # 这个下面的东西就不贴出来了，建议大家按需使用，同时找一个好一点的CDN，不然速度感人啊！！！
  
# Assets
css: css
js: js
images: images

daovoice: true
daovoice_app_id: 

nav:
  home: /
  about: /about
  tags: /tags
  categories: /categories

cache:
  enable: true
  
fireworks: true

# window woblle
wobble:
  enable: true  # 是否开启边缘波动效果
  radius: 50  # 波动半径
  sidebar: true  # 开启侧边栏边缘摆动
  header: true  # 开启头部边缘摆动
  footer: true  # 开启脚部边缘摆动
  
fireworks: true

# typing effect
typing_effect:
  colorful: true  # 礼花特效
  shake: false  # 震动特效
  
post_wordcount:
  item_text: true
  wordcount: true
  min2read: false
  totalcount: false
  separated_meta: false
  
# Theme version
version: 7.1.0
```

## 自定义网页布局

我觉得这个对于学过前端三🗡客的同学们来说还是比较简单的，不做多解释。但是对于没学的同学，强烈建议去看看这篇大佬的文章👉[这里](https://www.cduyzh.com/hexo-settings-3/)，看完之后，你基本就明白在哪个文件修改了，一些基本的步骤也能掌握！

主要是修改`/blog/themes/next/source/css/_custom/custom.styl`，那么数据去哪里找呢？当然是浏览器按F12进行调试啊。如果是计算机专业，期末做过作品的你，没少受过折磨吧？

`hexo s`后可以直接本地调试，也就是更改文件保存后，Hexo 后台会自动重新渲染文件，所以只要稍等片刻，浏览器刷新一下就能看到效果。

我建议你使用Google浏览器进行调试，可以先看看，嗯~ o(*￣▽￣*)o，没错👉[Google 开发者工具](https://developers.google.com/web/tools/chrome-devtools/)，记得给文档5颗星星支持一下下！

## 自定义鼠标点击效果

### 爱心效果

在`/themes/next/source/js/src`新建文件`clicklove.js`，并添加如下代码

<a id="download" href="https://cdn.jsdelivr.net/gh/besscroft/cdn/js/clicklove.js"><i class="fa fa-download"></i><span> Download Now</span>
</a>代码过长，在文章里面不太好排版，毕竟不是IDE，所以点击之后复制即可！

然后在`/themes/next/layout/_layout.swig`中添加如下代码：

```
<!-- 页面点击小心心 -->
<script type="text/javascript" src="/js/love.js"></script>
```

### 字体效果

嗯，我们以社会主义核心价值观为例，当然，实际的使用场景，也可以改成别的。

在`/themes/next/source/js/src`新建文件`click_show_text.js`，并添加如下代码

<a id="download" href="https://cdn.jsdelivr.net/gh/besscroft/cdn/js/click_show_text.js"><i class="fa fa-download"></i><span> Download Now</span>
</a>

然后在`/themes/next/layout/_layout.swig`中添加如下代码：

```
<!--单击显示文字-->
<script type="text/javascript" src="/js/click_show_text.js"></script>
```

### 烟花爆炸效果

在`/themes/next/source/js/src`新建文件`fireworks.js`，并添加如下代码

<a id="download" href="https://cdn.jsdelivr.net/gh/besscroft/cdn/js/fireworks.js"><i class="fa fa-download"></i><span> Download Now</span>
</a>

然后在`/themes/next/layout/_layout.swig`中添加如下代码：

```
{% if theme.fireworks %}
<canvas class="fireworks" style="position: fixed; left: 0; top: 0; z-index: 1; pointer-events: none;" ></canvas>
<script type="text/javascript" src="//cdn.bootcss.com/animejs/2.2.0/anime.min.js"></script>
<script type="text/javascript" src="/js/src/fireworks.js"></script>
{% endif %}
```

## 添加文章结束语

在`\themes\next\layout\_macro`中新建`passage-end-tag.swig`文件，添加代码至该文件中：

```
<div>
    {% if not is_index %}
        <div style="text-align:center;color: #ccc;font-size:14px;">-------------本文结束<i class="fa fa-paw"></i>感谢您的阅读-------------</div>
    {% endif %}
</div>
```

大小自己看着调整，毕竟每个人喜欢的不一样。

打开`\themes\next\layout\_macro\post.swig`文件，在`post-body`后，`post-footer`前，添加下面内容：

```
<div>
  {% if not is_index %}
    {% include 'passage-end-tag.swig' %}
  {% endif %}
</div>
```

打开主题配置文件`_config.yml`,在末尾添加：

```
# 文章末尾添加“本文结束”标记
passage_end_tag:
  enabled: true
```

## 设置文章背景

在`\themes\next\source\css\\_custom\custom.styl`文件内增添如下代码：

```
/*设置博文背景*/
.main-inner {
    background: #fff;
    opacity: 0.9;
```

background后为rgb颜色代码，百度来一个rgb色值粘贴即可替换博文背景颜色（替换了也很丑）
opacity后数值为博文背景透明度，可设置0.0-1.0数值，值越小透明度越高。

## 为主页文章添加阴影效果

在`\themes\next\source\css\\_custom\custom.styl`文件内增添如下代码：

```
// 主页文章添加阴影效果
.post {
  background: #fff;
  opacity: 1;
  margin-top: 60px;
  margin-bottom: 60px;
  padding: 25px;
  webkit-box-shadow: 0 0 5px rgba(202, 203, 203, .5);
  moz-box-shadow: 0 0 5px rgba(202, 203, 204, .5);
 }
```

background和上面设置文章背景一样，为文章背景颜色；opacity透明度；margin-top上边距；margin-bottom下边距；padding框间距；webkit-box-shadow和moz-box-shadow为阴影长宽设置。
