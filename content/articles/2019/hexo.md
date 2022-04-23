---
title: "Hexo博客搭建"
date: 2019-03-12T12:07:38+08:00
categories: ["技术"]
tags: ["Hexo","GitHub"]
---

![](/images/articles/2019/hexo/h001.png)

## 写在前面

为什么网上这么多教程，我还要在这里写下一篇呢？主要是总结大家的经验和自己的操作过程，一来是方便自己看，二来是给大家提供一些参考。Google一下，你可以找到几乎所有你想看到的，但是能否为你带来实质性的解决方案，可能也是需要花时间的。而且，跟别人做一样的操作，可能就刚好是你出了问题。。。没错，说的就是我自己。写这篇文章，仅此以纪念从WordPress转到Hexo。
## 博客搭建

### 适合哪些人呢？

- 平常喜欢写作，尤其是Blog的人。有不少人通过Hexo发表文学类作品呢。
- 不害怕编程，且爱折腾的人
- 了解和能够使用版本控制Git和GitHub的人
- 熟悉基本的MarkDown语法，能够利用MarkDown和Typora写作的人

### 准备工作

#### 安装环境

1. [Node.js](https://nodejs.org/en/)下载，并安装到您的计算机上。

2. [Git](https://git-scm.com/)下载，并安装到您的计算机上。

   不会下载安装？没关系，点击链接去它们的官网，有非常详细的安装教程。或者，我也可以抽时间写，但是感觉这样的文章质量并不高啊！

#### 安装Hexo

这时候我们需要利用npm来安装了。(直接打开Git Bash，或者任意位置鼠标右键选择打开)

运行如下命令：

```shell
npm install -g hexo-cli
```

如果报错，出现

```
npm ERR! registry error parsing json
```

的话，可能需要设置npm代理，执行如下命令

```
npm config set registry http://registry.cnpmjs.org
```

然后删除刚才安装的npm目录，

```
hexo:command not found
```

重新执行第一条命令安装Hexo，不过，这第一步都能报错，脸是有多黑啊！！！

#### 初始化Hexo

在命令行接着运行以下命令

```
$ hexo init <folder>    //初始化hexo文件夹,hexo会在目标文件夹建立网站所需要的所有文件
$ cd <folder>      
$ npm install    //安装依赖包
```

这里的<folder>是你自己指定的文件夹，比如说我的就是这样：

```
$ hexo init G:hexo
$ cd G:hexo
$ npm install
```

这样说你应该更容易理解，这就相当于选择安装软件的位置。

#### 本地查看

新建完成后，指定文件夹的目录如下：

```
.
├── _config.yml
├── package.json
├── scaffolds
├── source
|   ├── _drafts
|   └── _posts
└── themes
```

在命令行执行如下命令，然后打开你的浏览器输入http://localhost:4000/即可查看。

```shell
hexo g    #等同于hexo generate，生成静态文件到public文件夹
hexo s    # 等同于hexo server，在本地服务器渲染运行
```

到这一步，你的本地博客基本上就搭建起来了。我第一次搭建成功时，简直是兴奋的飞起了!

#### 注意事项详解

- hexo相关命令均在**站点目录**下，用**Git Bash**运行。
- _config.yml是站点的配置文件，用来存放网站的配置信息，可以在此配置大部分的参数。路径为：

```
<folder>\_config.yml
```

- 也就是你的站点的根目录下。
- 还有个叫_config.yml的，是你的主题配置文件，千万别弄混了。路径为：

```
<folder>\themes\<主题文件夹>\_config.yml
```

​	就存放在你的主题根目录下

- scaffolds是模板文件夹。当你新建文章的时候，Hexo 会根据 scaffold 来建立文件。
- source是资源文件夹，是存放用户资源的地方。
- themes，没错，就是存放主题的文件夹，今后你可能要无数次的打开它。

#### Git

将项目部署上去，你需要安装：`hexo-deployer-git`插件，不然会报错。在git运行如下：

```
$ npm install hexo-deployer-git --save
```

### 网站搭建实施方案

#### GithubPages

1. 创建一个[GitHub](https://github.com/)账号，如果你有一个更好。

2. 创建一个仓库，名字必须为：<Github账号名称>.github.io

   ![](/images/articles/2019/hexo/hexo001.png)

   图中报错的细节就不要在意了，这个仓库只能创建一个，当时我创建的时候没有截图。为了方便理解，专门去打开了这个页面截了一张图。

3. 将本地Hexo博客推送到GithubPages

   3.1.安装hexo-deployer-git插件。在命令行（即Git Bash）运行以下命令即可：

   ```
   $ npm install hexo-deployer-git --save
   ```

   3.2.添加SSH Key

   3.2.1.创建一个SSH Key。在命令行输入一下命令，密码为空，敲击三下回车：

   ```
   $ ssh-keygen -t rsa -C "邮箱地址"
   ```

   3.2.2.把公钥添加到GitHub。复制密钥文件内容，路径形如：

   ```
   C:\Users\Administrator(也就是你的账户名)\.ssh\id_rsa.pub
   ```

   ![](/images/articles/2019/hexo/hexo002.png)

   然后粘贴到[SSH keys](https://github.com/login?return_to=https%3A%2F%2Fgithub.com%2Fsettings%2Fkeys)即可。

   3.2.3.测试是否添加成功。在命令行输入以下命令：

   ```
   $ ssh -T git@github.com
   $ yes
   ```

   返回“You're successfully authenticated”,就说明你添加成功啦！

   3.3.修改你的站点配置文件_config.yml(前面说过了在你的站点目录下)。文件末尾修改为：

   ```
   # Deployment
   ## Docs: https://hexo.io/docs/deployment.html
   deploy:
     type: git
     repo: git@github.com:<Github账号名称>/<Github账号名称>.github.io.git
     branch: master
   ```

   仓库地址填写ssh地址，比如我的：

   ```
   deploy:
   - type: git
     repo: git@github.com:besscroft/besscroft.github.io.git
     barnch: master
   ```

   3.4.然后我们要推送到GitHubPages。在命令行(即Git Bash)，输入以下命令，注意，这个命令请记下来。以后你会经常用到的。

   ```
   $ hexo g	#等同于hexo generate，生成静态文件到public文件夹
   $ hexo d	# 等于hexo deploy 即，部署，可与hexo g合并为 hexo d -g
   ```

   如果返回：

   ```
   INFO Deploy done: git
   ```

   即推送成功啦！然后稍等片刻，浏览器访问地址：

   ```
   https://<Github账号名称>.github.io
   ```

   然后，嗯嗯~ o(*￣▽￣*)o，到这里就成功了啦，是不是很开心？

#### GithubPages + 域名

这一步最重要的就是买域名了，买个域名先！

1. 打开你的域名提供商的控制台，设置域名解析。

   1.1.解析类型选择为CNAME；

   1.2.主机记录，就是你的域名前缀，填写www即可；

   1.3.记录值去复制你的<Github账号名称>.github.io填上去；

   1.4.线路解析，就默认的就行了。

2. 仓库设置

   2.1.打开你的博客仓库设置，都到这一步了别告诉我你不知道在哪儿。

   ![](/images/articles/2019/hexo/hexo003.png)

   然后再该页面中往下滑，找到图中的位置！

   ![](/images/articles/2019/hexo/hexo004.png)

   我相信你看到页面上的提示，能够非常容易地添加自定义域名并开启 https 的！

#### GithubPages + CodingPages + 域名

你还可以在CodingPages上也搭建仓库，推送到仓库的时候2个仓库是同步推送的呢！

1. 创建你的[Coding](https://coding.net/)账号

2. 一样要创建一个用来托管的仓库，而且仓库名为:<Coding账号名称>

3. 将你的Hexo博客给推送到CodingPages

   3.1.之前大家在创建GitHubPages时，我们是已经做过生成公钥这一步了。这时候找到它，复制内容，并粘贴到Coding的[新增公钥](https://dev.tencent.com/user/account/setting/keys)。

   3.2.然后我们来测试以下成功了没有。在命令行依次输入如下命令：

   ```
   $ ssh -T git@git.coding.net
   $ yes
   ```

   返回了“You've successfully authenticated”，就表示已经成功了！

   3.3.修改你的站点配置文件_config.yml(前面说过了在你的站点目录下)。文件末尾修改为：

   ```
   type: git
   repo: git@git.dev.tencent.com:<Coding账号名称>/<Coding账号名称>.git
   branch: master
   ```

   按照之前的GitHub添加一样，在这里把coding的也添加上去，直接加到后面即可！

   4.4.然后推送到你的Coding仓库，没错，又是这两条指令：

   ```
   $ hexo g	# 等于hexo generate # 生成静态文件
   $ hexo d	# 等于hexo deploy 即，部署，可与hexo g合并为 hexo d -g
   ```

4. 进入刚才创建的Coding项目，进入代码页面，你会看到有一项叫Pages服务，然后点击“一键开启静态Pages”。稍等片刻，美味就快好。。。不对，稍等片刻CodingPages即可部署成功！

5. 域名解析

   5.1.解析类型选择为CNAME；

   5.2.主机记录，就是你的域名前缀，填写www即可；

   5.3.记录值去复制你的<Coding账号名称>.coding.me填上去；

   5.4.线路解析，就默认的就行了。

6. 在你刚才开启Pages服务的地方，点击设置，进入它的设置页绑定你的自定义域名。

7. 最后，到这里基本上就大功告成啦！~ o(*￣▽￣*)o

#### 配置解析注意事项

嗯，为什么要在两个托管平台都搭建起来呢？原因很简单：要实现国内外访问不同的服务，所以要分别托管并且分别设置解析。无论是腾讯云还是阿里云，他们的解析服务都能够很好地区分国内外的节点。我们需要将国内的CNAME设置到pages.coding.me，将国外的CNAME设置到pages.github.io，然后，魔法就出现了！

如果你不会的话，请参考图片中的设置即可！

![](/images/articles/2019/hexo/hexo005.png)

别跟我说这样不行，难道你平常逛的淘宝，就只有一台服务器嘛？🙃

![](/images/articles/2019/hexo/hexo006.png)

可以去看看阿里的部分云解析的[文档](https://help.aliyun.com/document_detail/29730.html?spm=a2c4g.11186623.6.575.4ea05b9clns2hv)。

### Hexo命令行常用指令

```
hexo help	#查看帮助
hexo init	#初始化一个目录
hexo new "postName"		#新建文章
hexo new page "pageName" 	#新建页面
hexo generate 	#生成网页，可以在 public 目录查看整个网站的文件
hexo server 	#本地预览，'Ctrl+C'关闭
hexo deploy 	#部署.deploy目录
hexo clean 		# 清除缓存文件 (db.json) 和已生成的静态文件 (public)
```

**简写：**

```
hexo n == hexo new
hexo g == hexo generate
hexo s == hexo server
hexo d == hexo deploy
```

如果你采用了静态资源压缩的话，每次同步到服务器就要多一条指令：

```
hexo g
gulp     //没有用静态资源压缩，同步时不需要中间这条指令
hexo d
```

部署成功时会返回这个：

```
[info] Deploy done: git
```

执行`hexo clean && hexo deploy`命令。前者清除站点文件，后者重新生成站点文件并将之推送到指定的库分支。（如果你的Hexo是局部安装，则需要执行`./node_modules/.bin/hexo clean && ./node_modules/.bin/hexo deploy`。）

登入 [Github](https://github.com/)/[BitBucket](https://bitbucket.org/)/[Gitlab](https://about.gitlab.com/)，请在库设置（Repository Settings）中将默认分支设置为`_config.yml`配置中的分支名称。稍等片刻，你的站点就会显示在你的Github Pages中啦！

如果你是才接触，那么我建议你熟悉之后，再将Hexo部署到其它托管平台！比如👉[Heroku](https://dashboard.heroku.com)（蛮好用的）、👉[Netlify](https://www.netlify.com/)、👉[Rsync](https://rsync.samba.org/)、👉[OpenShift](https://www.openshift.com/)、等等。具体的可以去阅读👉[官方文档](https://hexo.io/zh-cn/docs/deployment)

### Hexo使用

#### 目录结构

```
.
├── .deploy       #需要部署的文件
├── node_modules  #Hexo插件
├── public        #生成的静态网页文件
├── scaffolds     #模板
├── source        #博客正文和其他源文件，404、favicon、CNAME 都应该放在这里
|   ├── _drafts   #草稿
|   └── _posts    #文章
├── themes        #主题
├── _config.yml   #全局配置文件
└── package.json
```

#### 全局配置_config.yml

请看我的这篇👉[文章](http://blog.52bess.com/zhandian.html#more)

## 最后

记得平时多做好备份，这是个好习惯。万一出现文件误删，丢失等，甚至GitHub你在某一天无法访问。

我的博客的评论系统是[Valine](https://valine.js.org/)我觉得还可以吧，其它的如：来比利、哦不是[来必力](https://www.livere.com/)、[畅言](http://changyan.kuaizhan.com/)等都是不错的。由于我只用了一个，优缺点就不说了，但是感觉Valine的UI更符合我的胃口。

博客右下角的被大家称为萌萌哒，也就是二次元看板娘，是使用[live-2d](https://github.com/EYHN/hexo-helper-live2d/blob/master/README.zh-CN.md)实现的。

如果你的Hexo搭建成功，不妨跟大家分享以下你的快乐呢！