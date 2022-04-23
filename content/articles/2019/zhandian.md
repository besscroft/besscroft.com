---
title: "站点文件基本配置"
date: 2019-03-25T19:56:53+08:00
categories: ["技术"]
tags: ["Hexo","站点文件配置"]
---

刚接触Hexo的你，是不是对站点配置文件`_config.yml`一脸的问号呢？没事，这篇文章可以帮助你轻松阅览站点配置文件，让你快速上手！

### 简介

总所周知，在Hexo静态博客本地配置中，有两个重要的配置文件，分别是：

- 位于根目录下的`站点配置文件`：`_config.yml`

- 位于根目录/theme/你的主题下的`主题配置文件`：`/theme/<你的主题名称>/_config.yml`

当然，基本熟悉的小伙伴是不会弄混的，刚开始的时候可能会弄错。

### 源码

下面简单列举了一些站点配置文件的源码，方便快速上手：

```
# Hexo 站点配置文件
## 官方说明文档: https://hexo.io/docs/configuration.html
## GitHub源码: https://github.com/hexojs/hexo/

# 网站基础设定
title: 生如夏花               # 网站标题
subtitle: www.zhuimeng.online         # 网站副标题
description: 追逐梦想！                 # 网站描述：建议描述：网站介绍或者座右铭
keywords: 博客,Hexo,黑苹果,Linux        # 关键词
author: Bess Croft                    # 站长信息
language: zh-CN      # 网站语言：查询主题文件下的language文件夹查阅支持语言列表再进行更改   
timezone: Asia/Shanghai              # 网站时区

# 头像
avatar: /uploads/avatar.jpg

# 网址信息
## 如果您的网站存放在子目录中，例如 http://yoursite.com/blog，则请将您的 url 设为 http://yoursite.com/blog 并把 root 设为 /blog/。
url: https://blog.52bess.com                # 网址
root: /                                 # 网站根目录	
permalink: :title.html    # 文章的 永久链接 格式	
permalink_defaults:                     # 永久链接中各部分的默认值	

# 目录：如果您刚刚开始接触Hexo，通常没有必要修改这一部分的值。
source_dir: source              # 资源文件夹，这个文件夹用来存放内容。
public_dir: public              # 公共文件夹，这个文件夹用于存放生成的站点文件。
tag_dir: tags                   # 标签文件夹	
archive_dir: archives           # 归档文件夹
category_dir: categories        # 分类文件夹	
code_dir: downloads/code        # Include code 文件夹	
i18n_dir: :lang                 # 国际化（i18n）文件夹	
skip_render: README.md          # 跳过指定文件的渲染，您可使用 [glob 表达式](https://github.com/isaacs/node-glob)来匹配路径。	

# 文章
new_post_name: :title.md        # 新文章的文件名称
default_layout: post            # 预设布局	
titlecase: false                # 把标题转换为 title case
external_link: true             # 在新标签中打开链接
filename_case: 0                # 把文件名称转换为 (1) 小写或 (2) 大写
render_drafts: false            # 显示草稿
post_asset_folder: true        # 启动 [Asset](https://hexo.io/zh-cn/docs/asset-folders) 文件夹
relative_link: false            # 把链接改为与根目录的相对位址
future: true                    # 显示未来的文章
highlight:                      # 代码块的设置
  enable: true
  line_number: true
  auto_detect: true
  tab_replace:
  
# 主页设置
index_generator:
  path: ''              # 博客索引页面的根路径。
  per_page: 10          # 每页显示的帖子。（0 =禁用分页）
  order_by: -date       # 排序。（默认情况下按日期降序排序）
  
# 分类 & 标签
default_category: uncategorized     # 默认分类
category_map:                       # 分类别名	
tag_map:                            # 标签别名

# 日期 / 时间格式
## Hexo uses Moment.js to parse and display date
## You can customize the date format as defined in
## http://momentjs.com/docs/#/displaying/format/
date_format: YYYY-MM-DD
time_format: HH:mm:ss

# 分页
per_page: 10                # 每页显示的文章量（0 = 关闭分页功能）
pagination_dir: page        # 分页目录

# 扩展
## 插件: https://hexo.io/plugins/
## 主题: https://hexo.io/themes/
theme: next                     #主题选择

# 部署部分的设置
## 文档: https://hexo.io/docs/deployment.html
deploy:
  type: git
  repository: git@github.com:<Github账号名称>/<Github账号名称>.github.io.git # 仓库ssh
  branch: master #分支选择
  
post_end_tag:
  enabled: true  # 是否开启文末的本文结束标记
  icon: paw # 结束标记之间的图标

# 看板娘
live2d:
  enable: true
  scriptFrom: local
  pluginRootPath: live2dw/
  pluginJsPath: lib/
  pluginModelPath: assets/
  tagMode: false
  debug: false
  model:
    use: live2d-widget-model-koharu
    scale: 1
    hHeadPos: 0.5
    vHeadPos: 0.618
  display:
    superSample: 2
    position: right
    width: 150
    height: 300
    hOffset: 0
    vOffset: -20
  mobile:
    show: false
    scale: 0.5
  react:
    opacityDefault: 0.7
    opacityOnHover: 0.2

# 豆瓣页面
douban:
  user: 195767035
  builtin: true
  book:
    title: '我的书单'
    quote: '看书很慢，但都是值得的'
  movie:
    title: '我的电影'
    quote: '最佳的娱乐方式'
  game:
    title: '我的游戏'
    quote: '最佳的娱乐方式'
  timeout: 10000
  
# 
archive_generator:
  per_page: 20
  yearly: true
  monthly: true

tag_generator:
  per_page: 10
  
# Extensions
plugins:
    hexo-generator-feed
#Feed Atom
feed:
    type: atom
    path: atom.xml
    limit: 20
    
# 自动生成sitemap
sitemap:
  path: sitemap.xml
baidusitemap:
  path: baidusitemap.xml
```
