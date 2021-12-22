---
title: "更换为Google Fonts思源宋体！"
date: 2019-07-01T15:14:24+08:00
tags: ["Hexo","Google Fonts"]
categories: ["技术"]
---

对于中文书籍来说，宋体一直是正文印刷的标准字体，而不是目前电子显示屏上普遍的黑体，因为**宋体的衬线更适合长时间阅读**。

本文是针对Hexo博客的NexT主题来设置的，不是这个的小伙伴们也可以参照着来看！

### 修改字体

#### 修改配置文件中的参数

修改配置文件`_config.yml` ，找到`font`将下列代码中红色的部分修改成绿色的部分即可。可以根据实际情况稍作修改！

```diff 文件位置:~/blog/themes/next/_config.yml
font:
- enable: false
+ enable: true

  # Uri of fonts host, e.g. //fonts.googleapis.com (Default).
  # Uri字体主机，例如//fonts.googleapis.com（默认）。
+ host: https://fonts.loli.net

  # Font options:字体选项：
  # `external: true` will load this font family from `host` above.
  # `family: Times New Roman`. Without any quotes.
  # `size: xx`. Use `px` as unit.

  # Global font settings used for all elements in <body>.
  # 用于<body>中所有元素的全局字体设置。
  global:
    external: true
+   family: Noto Serif SC
    size:

  # Font settings for Headlines (H1, H2, H3, H4, H5, H6).
  # 标题的字体设置（H1，H2，H3，H4，H5，H6）。
  # Fallback to `global` font settings.
  # 回退到`global`字体设置。
  headings:
    external: true
+   family: Noto Serif SC
    size:

  # Font settings for posts.帖子的字体设置
  # Fallback to `global` font settings.回退到`global`字体设置。
  posts:
    external: true
+   family: Noto Serif SC

  # Font settings for Logo.LOGO的字体设置。
  # Fallback to `global` font settings.回退到`global`字体设置。
  logo:
    external: true
+   family: Noto Serif SC
    size:
```

#### 修改配置文件

找到主题的`base.styl`文件，具体位置为`~/blog/themes/next/source/css/_variables/base.styl`,然后修改相关数据！

```diff 文件位置:~/blog/themes/next/source/css/_variables/base.styl
-$font-family-monospace    = consolas, Menlo, $font-family-chinese, monospace
+$font-family-monospace    = consolas, Menlo, $font-family-base, monospace
-$font-family-monospace    = get_font_family('codes'), consolas, Menlo, $font-family-chinese, monospace if get_font_family('codes')
+$font-family-monospace    = get_font_family('codes'), consolas, Menlo, $font-family-base, monospace if get_font_family('codes')
```

### 自定义项目


#### 设置字体大小

如果你看不习惯默认(原来)的字体大小的话，你可以尝试修改它！

```diff 文件位置:~/blog/themes/next/source/css/_variables/base.styl
// Font size
$font-size-base           = 14px	//改成你想要的即可！
```

#### 设置字体颜色

没错，你甚至可以设置不同的颜色！

```diff 文件位置:~/blog/themes/next/source/css/_custom/custom.styl
//修改字体颜色
body {
    color: <在这里填上你想要的颜色，如：#000>;	//别漏了分号！
}
```

<div class="note warning"><p>本文参考自reuixiy的<a href="https://io-oi.me/tech/noto-serif-sc-added-on-google-fonts.html#main">Google Fonts已支持思源宋体！</a>点击即可访问！</p></div>