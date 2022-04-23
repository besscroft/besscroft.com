---
title: "Google sitemap不允许的网址解决办法"
date: 2019-04-10T13:03:47+08:00
categories: ["技术"]
tags: ["Google Search Console"]
---

搭建好自己的博客之后，当然得做收录。要想让别人在Google看到我的文章，就得添加站点地图。但是我在提交到Google的时候就给我报了错，不允许的网址。本文所说的方法只是众多解决方法中的一个，这个问题的原因也是有很多的，可以参考👉[站点地图报告](https://support.google.com/webmasters/answer/7451001?hl=zh-Hans&ref_topic=7440006)

## 问题描述

在我提交之后，是这样显示的：

![](/images/articles/2019/googlesitemap/google001.png)

所以说，得找到错误。最开始我根本没意识到错误在哪里，也就是选择性眼瞎。。。但是仔细观察图片，发现网址不对，怎么能是http://<yoursite.com>(这里一看就不对)/***.html呢？于是恍然大悟！

## 解决

综上所述，在我的站点文件`sitemap.xml`里面，也肯定都是错误的网址。可以看到地址都是错的，都是`yoursite.com`开头，这很明显不是我的网址啊😥所以说肯定是我某个地方没有修改，应该是默认值。然后检查我的`_config.yml`文件，一看果然是的：

```
# URL
url: http://yoursite.com
root: /
permalink: :title.html
permalink_defaults:
```

可以看到`url`这一项是默认值，压根就没改！因为之前不影响使用，我就没管。然后这时候更正它：

```
# URL
url: http://www.zhuimeng.online
root: /
permalink: :title.html
permalink_defaults:
```

然后`hexo g -d`更新网站，再在 Google Search Console 重新提交一次 sitemap 就可以了。

![](/images/articles/2019/googlesitemap/google002.png)

nice!大功告成啦！😄