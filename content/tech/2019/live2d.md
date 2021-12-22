---
title: "萌萌哒二次元看板娘"
date: 2019-03-28T16:18:51+08:00
categories: ["技术"]
tags: ["萌萌哒"]
---

已弃用live2d插件，太长时间没更新了，且功能单一。现已改为开源项目**live2d-widget**，地址：https://github.com/stevenjoezhang/live2d-widget

不少同学应该都发现了，许多人的博客都有类似萌萌哒、看板娘的东西。这个其实是一个名叫`hexo-helper-live2d`的插件，那么，我们一起来向Hexo里放上一只萌萌哒二次元看板娘吧！

## 安装

首先，在`Hexo`博客根目录下运行`git`,然后再命令行输入：

```
npm install --save hexo-helper-live2d
```

当然也可以以标签模式运行，但是不建议这样，容易带来不必要的麻烦。目前最新的插件版本应该是`+ hexo-helper-live2d@3.1.0                                                      `

## 配置

### 基础设置

在安装好插件之后，我们可以向Hexo的或者主题的`_config.yml`文件中添加配置，但是我建议你添加到Hexo的`_config.yml`中，而不是主题的配置文件中。

```
live2d:
  enable: true		#默认开启
  scriptFrom: local		# 默认
  pluginRootPath: live2dw/	# 插件在站点上的根目录(相对路径)
  pluginJsPath: lib/       # 脚本文件相对与插件根目录路径
  pluginModelPath: assets/	# 模型文件相对与插件根目录路径
  tagMode: false		# 标签模式, 是否仅替换 live2d tag标签而非插入到所有页面中
  debug: false  		# 调试, 是否在控制台输出日志
  model:
    use: live2d-widget-model-koharu	#当前使用的模型
  display:
    position: right		#显示位置：左或右
    width: 150			#画布的宽度，显示模型画布的长度
    height: 300			#画布高度显示模型画布的高度
  mobile:
    show: true		#是否在移动设备上显示，默认为true
```

请注意，如果你不想手机端显示，请把`mobile`下的`show`的值改为`false`，大多数情况下会遮挡视线。我最开始没注意，但是好多人跟我说手机端影响阅读体验了，然后我发现是得取消。

### 详细的设置

详细设置其实不愿意折腾的同学可以不用管，但是你想按照自己的意愿来，还是可以尝试的。按照官方文档的说法：**设置分为`helper`特有的和公共的, 你需要把他们合并放到 `_config.yml` 中**。以下是`helper`特有：

```
# Live2D
## https://github.com/EYHN/hexo-helper-live2d
live2d:
  enable: true
  # enable: false
  scriptFrom: local # 默认
  pluginRootPath: live2dw/ # 插件在站点上的根目录(相对路径)
  pluginJsPath: lib/ # 脚本文件相对与插件根目录路径
  pluginModelPath: assets/ # 模型文件相对与插件根目录路径
  # scriptFrom: jsdelivr # jsdelivr CDN
  # scriptFrom: unpkg # unpkg CDN
  # scriptFrom: https://cdn.jsdelivr.net/npm/live2d-widget@3.x/lib/L2Dwidget.min.js # 你的自定义 url
  tagMode: false # 标签模式, 是否仅替换 live2d tag标签而非插入到所有页面中
  debug: false # 调试, 是否在控制台输出日志
  model:
    use: live2d-widget-model-wanko # npm-module package name
    # use: wanko # 博客根目录/live2d_models/ 下的目录名
    # use: ./wives/wanko # 相对于博客根目录的路径
    # use: https://cdn.jsdelivr.net/npm/live2d-widget-model-wanko@1.0.5/assets/wanko.model.json # 你的自定义 url
```

### General Settings

这里具体的设置，以及你想要的更多，可以参考官方[API文档](https://l2dwidget.js.org/docs/class/src/index.js~L2Dwidget.html#instance-method-init)

示例：

```
# Live2D
## https://github.com/xiazeyu/live2d-widget.js
## https://l2dwidget.js.org/docs/class/src/index.js~L2Dwidget.html#instance-method-init
live2d:
  model:
    scale: 1			#模型与canvas的缩放
    hHeadPos: 0.5		#模型头部横坐标
    vHeadPos: 0.618		#模型头部纵坐标
  display:
    superSample: 2		#超采样等级
    width: 150			#画布的宽度，显示模型画布的长度
    height: 300			#画布高度显示模型画布的高度
    position: right		#显示位置：左或右
    hOffset: 0			#水平偏移
    vOffset: -20		#垂直偏移
  mobile:
    show: true		#是否在移动设备上显示
    scale: 0.5		#移动设备上的缩放
  react:
    opacityDefault: 0.7		#默认透明度
    opacityOnHover: 0.2		#鼠标移上透明度
```

### 模型

有许多方法来使用不同的模型，这里来介绍我设置的方法：

1. 在Hexo跟目录下新建文件夹`live2d_models`
2. 然后在`live2d_models`下建文件夹`<你要安装的模型的名字>`
3. 然后在`<你要安装的模型的名字>`下新建json文件：<你要安装的模型的名字>.model.json

可以参考我的：

```
Hexo
│
├──live2d_models
│          └── koharu
				└──koharu.model.json 
```

#### 安装模型

在git的命令行输入：

```
npm install --save live2d-widget-model-<你要安装的模型的名字>
```

比如我的：

```
npm install --save live2d-widget-model-koharu
```

然后你就可以通过向 `model.use` 键入包名 (`live2d-widget-model-wanko`) 来使用了。当然，你也可以去官方发布寻找[live2d小模型](https://github.com/xiazeyu/live2d-widget-models)

## 最后

嗯，如果你是没有CDN会死星人,直接将 `.model.json` 的url地址输入 `model.use`。祝你成功！

## 我的配置参数

这里贴上我的配置参数吧，希望能帮到大家！我是放在`Hexo`的`_config.yml`中的，而不是主题的`_config.yml`中:

```
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
```

