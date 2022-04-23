---
title: "Hexo多端同步"
date: 2019-03-17T21:19:03+08:00
categories: ["技术"]
tags: ["同步"]
---

假设你换了一台电脑，或者是把电脑重置了，那么，要怎样才能接着跟原来一样配置好Hexo，然后继续写文章呢？毕竟你不是从头、从零开始配置的，很多文件都已经有了，但是，怎么保证不出问题的继续运行呢?

多台电脑同步博客源码，首先要把最新的源码上传到git上，然后在其它电脑上搭建Hexo环境后同步博客源码。 前提是两台电脑都能连上git，主要是都配置了 `git ssh`密钥连接。这个方法同样适用与误删文件的你，但是我建议平时尽量多做好备份！！！

## 同步博客源码到你的GitHub

在你打算上传的最新博客源码的基础上，按照下面的魔法操作：

### 编辑.gitignore文件

`.gitignore`文件作用是声明不被git记录的文件，blog根目录下的 `.gitignore`是hexo初始化是创建的，可以直接编辑，建议.gitignore文件包括以下内容：

```
.DS_Store      
Thumbs.db      
db.json      
*.log      
node_modules/      
public/      
.deploy*/
```

说明：public内的文件可以根据source文件夹内容自动生成的，不需要备份。其他日志log、压缩、数据库Thumbs.db等文件也都是调试等使用，也不需要备份。

### 初始化仓库

```
git init    
git remote add origin https://github.com/<Github账号名称>/<Github账号名称>.git # 将本地仓库映射到托管服务器的仓库
```

server是仓库的在线目录地址，可以从git上直接复制过来，origin是本地分支，remote add会将本地仓库映射到托管服务器的仓库上。

### 同步到git

添加你的本地文件到仓库，并同步到GitHub上

```
git add . #添加blog目录下所有文件，注意有个'.'(.gitignore里面声明的文件不在此内)    
git commit -m "hexo source first add" #添加更新说明    
git push -u origin master  #推送更新到git上
```

## 将git的内容同步到另一台电脑

之前的操作主要类似于备份，而这里开始，就基本上是你在新电脑、或者是重置电脑之后的操作啦！假设我们这时候已经将blog源码内容备份到了GitHub上，现在准备在新电脑上同步源码内容。

### 搭建hexo的环境

这时候在你的新电脑上，肯定是必须要搭建环境的呢，没有环境，Hexo也无法运行呀不是。没错，又是熟悉的配方：

```
npm install -g hexo-cli  # 安装hexo

hexo init <folder>         #用hexo创建一个博客目录
cd <folder>
npm install
npm install hexo-deployer-git --save # 部署安装 hexo-deployer-git
```

\<folder>还是一样地填上博客文件夹地名字，比如说我的：

```
npm install -g hexo-cli  # 安装hexo

hexo init hexo         #用hexo创建一个博客目录
cd hexo
npm install
npm install hexo-deployer-git --save # 部署安装 hexo-deployer-git
```

### 拉取源代码

在建好的环境的主目录运行以下命令

```
git init       #将目录添加到版本控制系统中    
git remote add origin https://github.com/<Github账号名称>/<Github账号名称>.git 
#将本地仓库映射到托管服务器的仓库上    
git fetch --all  #将git上所有文件拉取到本地    
git reset --hard origin/master  #强制将本地内容指向刚刚同步git云端内容,用远端文件覆盖本地相同文件
```

reset对所拉取的文件不做任何处理，此处不用pull是因为本地尚有许多文件，使用pull会有一些版本冲突，解决起来也麻烦，而本地的文件都是初始化生成的文件，较拉取的库里面的文件而言基本无用，所以直接丢弃。

#### 发布内容到GitHub

要将新电脑上的最新的文章更新到git。在本地文件中运行以下命令：

```
git status #查看本地文件的状态。
git add . #将所有更新的本地文件添加到版本控制系统中

git commit -m '更新信息说明' 
git push
```

#### 同步文章

```
git pull
```

获取的源码即为最新文件。
