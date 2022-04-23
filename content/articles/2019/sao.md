---
title: "Hexo之魔法操作"
date: 2019-03-17T12:23:16+08:00
categories: ["技术"]
tags: ["魔法操作"]
---
这篇博文用来记录关于hexo的一些魔法操作，主要针对于NEXT主题。将会在未来很长一段时间内持续更新，希望对大家有所帮助。

## 常规基本操作

### 写作

我们在搭建好了Hexo博客之后，肯定是需要写文章上去的。 那么，首先打开git，在命令行输入这些指令来创建文章：

```
$ hexo new [layout] <title>  //[这里是文章布局]，<这里是文章标题>
```

例如这样：

```
$ hexo new post HelloHexo
```

完成之后，会在 _posts 目录下会生成文件标题.md，一般的格式如下：

```
title: HelloHexo
date: 201-03-17 16:10:00 #发表日期，一般不改动
categories: hexo #文章文类
tags: [hexo,github] #文章标签，多于一项时用这种格式
---
正文，使用Markdown语法书写
```

写完文章后，可以先预览，或者直接推送到服务器上。

#### 布局

Hexo 有三种默认布局：`post`、`page` 和 `draft`，它们分别对应不同的路径，而您自定义的其他布局和 `post` 相同，都将储存到 `source/_posts` 文件夹。

| **参数** | **路径**       | 描述 |
| -------- | -------------- | ---- |
| post     | source/_posts  | 文章 |
| page     | source         | 页面 |
| draft    | source/_drafts | 草稿 |

在命令中指定文章的布局（layout），默认为 `post`，可以通过修改 `_config.yml` (根目录下的)中的 `default_layout` 参数来指定默认布局。如果你不想你的文章被处理，你可以将 Front-Matter 中的`layout:` 设为 `false` 。

#### 基本模板参数

| **参数**   | **描述**             |
| ---------- | -------------------- |
| layout     | 布局                 |
| title      | 标题                 |
| date       | 建立日期             |
| updated    | 更新日期             |
| comments   | 开启文章的评论功能   |
| tags       | 标签（不适用于分页） |
| categories | 分类（不适用于分页） |
| permalink  | 覆盖文章网址         |

#### 基本变量参数

| **变量** | **描述**                            |
| -------- | ----------------------------------- |
| :title   | 标题（小写，空格将会被替换为短杠）  |
| :year    | 建立的年份，比如， `2015`           |
| :month   | 建立的月份（有前导零），比如， `04` |
| :i_month | 建立的月份（无前导零），比如， `4`  |
| :day     | 建立的日期（有前导零），比如， `07` |
| :i_day   | 建立的日期（无前导零），比如， `7`  |

## 强大的标签插件

标签插件和 Front-matter 中的标签不同，它们是用于在文章中快速插入特定内容的插件。

这个其实在Hexo的官方文档上都有比较完善的，大家想了解更多的话，还是建议去那里看，这里主要放一些我用到过的，以及我自己的一些理解。

#### 引用书上的句子

```
{% blockquote David Levithan, Wide Awake %}
Do not just seek happiness for yourself. Seek happiness for all. Through kindness. Through mercy.
{% endblockquote %}
```

演示效果：

> Do not just seek happiness for yourself. Seek happiness for all. Through kindness. Through mercy.
>
> **David Levithan**—Wide Awake

解释一下：

```
{% blockquote <这里填作者>, <这里填书名等> %}
中间这里存放引用正文
{% endblockquote %}
```

#### iframe

在文章中插入 iframe。

```
{% iframe url [width] [height] %}  //设定url，宽、高
```

#### Image

在文章中插入指定大小的图片。

```
{% img [class names] /path/to/image [width] [height] [title text [alt text]] %}
//实际上，只需要定义图片的路径即可，除非图片的大小不能使你满意。图片的路径可以是本地路径，也可以是网络路径，这取决于你的选择。
```

#### Link

在文章中插入链接，并自动给外部链接添加 `target="_blank"` 属性。

```
{% link text url [external] [title] %}   //这个不作过多的解释，都是常见属性
```

## 基于Next主题的优化与配置

这篇文章👉[NexT主题个性定制与深度优化](http://blog.besscroft.com/tech/2019/next.html)