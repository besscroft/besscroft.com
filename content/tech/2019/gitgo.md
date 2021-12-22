---
title: "Git本地文件到GitHub仓库"
date: 2019-03-18T17:01:55+08:00
categories: ["技术"]
tags: ["Git","GitHub"]
---

这是一个简单使用的教程，如果你刚接触`git`和`GitHub`，那么，这篇文章再适合你不过了！首先，没有接触过版本控制概念的同学们也可以轻松入门；其次，通过这篇博文，你将学会本地构建仓库、远程克隆仓库、上传本地仓库等魔法操作(语言上可能组织不太好😅)，值得你一看。

## 版本控制

### 基本概念

首先，我们得弄清楚工作区和暂存区的是怎么回事，不然当你看到这些文件夹，可能一脸问号。

#### 工作区

工作区（Working Directory）,是一个你在电脑里能够看到的目录，存放的就是你的本地文件，一般指的是你的仓库根目录下。

#### 版本库

版本库（Repository），在你的工作区，细心的小伙伴可能会发现，有一个隐藏的目录，名叫`.git`,这个就是我们常说的版本库了。版本库里面存放了很多东西，其中最重要的是称为`stage`的暂存区(或者叫`index`)和git为我们创建的第一个分支`master`，以及指向`master`的一个叫`HEAD`的指针。

### 配置

#### 绑定用户

首先，我们得将电脑和GitHub账号进行绑定才行，打开GIt Bash，输入以下命令（用户和邮箱为你GitHub注册的账号和邮箱）：

```
$ git config --global user.name "github用户名称"
$ git config --global user.email "github注册时的邮箱"
```

比如我这样：

```
$ git config --global user.name "besscroft"
$ git config --global user.email "631908942@qq.com"
```

#### 配置SSH

首先创建一下自己的SSH Key。如果已经有了请跳过：

```
ssh-keygen -t rsa -C "github注册时的邮箱"
```

然后可能要按下几次回车，具体几次我也没数，默认就行了，如果你觉得有必要，可以自己设置密码。如果一切顺利的话，你可以在你的系统用户主目录里找到`.ssh`目录，一般路径为：`C:\Users\这里是你的计算机用户名啦\.ssh`，然后里面会有`id_rsa`和`id_rsa.pub`两个文件，这两个就是SSH Key的秘钥对，`id_rsa`是私钥，不能泄露出去，`id_rsa.pub`是公钥，你告诉别人也没事儿。

你甚至能自己检查一下：

```
$ cd ~/.ssh
$ ls    //这个s前面的是lmn的l，不同字体下显示很容易看错成i的大写或者数字1
```

#### 添加SHH Key

然后我们需要去GitHub添加[SSH Key](https://github.com/login?return_to=https%3A%2F%2Fgithub.com%2Fsettings%2Fkeys)，如果左边的链接挂掉了，直接去你自己的GitHub页面打开设置，找到`SSH and GPG keys`,然后`New SSH key`,然后将`id_rsa.pub`文件的所有内容拷贝到`Add key`的框框里面。

为什么GitHub需要SSH Key呢？因为GitHub需要识别出你推送的提交确实是你推送的，而不是别人冒充的，而Git支持SSH协议，所以，GitHub只要知道了你的公钥，就可以确认只有你自己才能推送。

## 远程仓库

### 添加远程仓库

我们假设你现在要折腾一个新的项目，那么，你可以先去GitHub新建好仓库，或者现在本地把项目做一点、甚至做完，然后再上传都可以。但是，最终我们肯定是要让GitHub上的仓库和本地的仓库进行同步的。这样子你的GitHub即成为了网盘、也可以跟他人一起来协作，真香。

首先要确保远程和本地的仓库名字一样，再GitHub上创建新仓库之后，这个仓库肯定是空的。在下面会有GitHub的提示，然后在本地仓库下运行如下指令：

```
$ git remote add origin git@github.com:<Github账号名称>/<Github仓库名称>.git
```

如果不小心关联了别人的仓库，不要紧，反正你是推送不上去的🤣，因为他人的账户中没有你的`SSH key`公钥。关联之后，远程库的名字就是`origin`，这是Git默认的叫法，也可以改成别的，但是`origin`这个名字一看就知道是远程库的啦！

#### 上传README文件

如果在创建 `Github` 仓库时没有勾选创建 `README.md` 文件，则要先创建 `README.md` 文件，不然上传文件会报错。如果已经勾选，可以跳过此步骤。

```
$ git init
$ touch README.md
$ git add README.md
$ git commit -m 'first_commit'
$ git remote add origin https://github.com/<Github账号名称>/<Github仓库名称>.git
$ git push origin master
```

#### 推送到远程库

我们输入以下指令，把本地库的所有内容推送到远程库上：

```
$ git push origin master
$ git push -u origin master  //如果你是第一次，可以用这个
```

我们知道，把本地库的内容推送到远程，用`git push`命令，实际上是把当前分支`master`推送到远程。由于远程库是空的，我们第一次推送`master`分支时，加上了`-u`参数，Git不但会把本地的`master`分支内容推送的远程新的`master`分支，还会把本地的`master`分支和远程的`master`分支关联起来，在以后的推送或者拉取时就可以不用这样啦！

也就是说，从第二次起，只要本地作了提交，就可以通过命令：

```
$ git push origin master
```

那么，把本地`master`分支的最新修改推送至GitHub，现在，你就拥有了真正的分布式版本库！开始你的创造吧！

#### 从远程仓库克隆

假设我们这时候买了台新电脑，或者是把电脑重置了，那么最好的方式就是从远程库克隆。我们现在本地创建仓库，注意本地仓库的名字要跟远程一样哦。然后再本地仓库根目录下，输入如下指令：

```
$ git init
```

初始化完毕后，我们要跟踪项目文件夹中的所有文件和文件夹，也就是将文件添加到暂存区，输入以下指令：

```
$ git add .
```

需要注意的是，“ . ”的意思是文件夹下的所有文件。这时候我们本地仓库是没有东西的，那么：

```
$ git remote add origin https://github.com/<Github账号名称>/<Github仓库名称>.git
$ git pull --rebase origin master
```

获取远程库与本地同步合并，你可以理解为将远程仓库克隆下来。或者是使用以下代码：

```
$ git clone git@github.com:<Github账号名称>/<Github仓库名称>.git
```

#### 推送到远程库基本步骤

每次将本地仓库推送到GitHub时，需要先将文件添加到暂存区：

```
$ git add .
```

然后附上提交说明：

```
$ git commit -m "引号之间存放提交说明"
```

这是为了告诉git ，把文件提交到仓库。

关联远程仓库：

```
$ git remote add origin https://github.com/<Github账号名称>/<Github仓库名称>.git
```

如果这一步你的关联出现错误的话`fatal: remote origin already exists`，那么可以执行以下语句进行关联：

```
$ git remote rm origin
```

然后再次执行：

```
$ git remote add origin https://github.com/<Github账号名称>/<Github仓库名称>.git
```

然后我们再把本地仓库推送上去：

```
$ git push origin master
```

如果在推送时出现错误 `error:failed to push som refs to.......`，则执行下列语句：

```
$ git pull origin master
```

将远程仓库 `Github` 上的文件拉下来合并之后重新推送上去：

```
$ git push origin master
```
### 更改username
如果你更改了当前的username，会带来些麻烦，你可能需要解决一些问题！
* 你的旧的个人资料页面不会被重定向(需要手动更改)
* 你的Pages网站设置不会被重定向(需要手动更改)
* 你的远程存储库会自动重定向，无须更改
* 你的本地存储库需要手动更改！！！

#### 更改本地repo的远程repo的URL
一般的，使用`git remote set-url`命令更改现有的远程存储卡URL。
* 如果您要更新为使用HTTPS，则URL可能类似于：
```
$ https://github.com/USERNAME/REPOSITORY.git
```
* 如果您要更新为使用SSH，则您的URL可能如下所示：
```
$ git@github.com:USERNAME/REPOSITORY.git
```
#### 将远程URL从SSH切换到HTTPS
* 列出现有的URL:
```
$ git remote -v
> origin  git@github.com:USERNAME/REPOSITORY.git (fetch)
> origin  git@github.com:USERNAME/REPOSITORY.git (push)
```
* 使用`git remote set-url`命令将远程URL从SSH更改为HTTPS

```
$ git remote set-url origin https://github.com/USERNAME/REPOSITORY.git
```
* 验证远程URL是否已更改
```
$ git remote -v
# 下面是新的 URL
> origin  https://github.com/USERNAME/REPOSITORY.git (fetch)
> origin  https://github.com/USERNAME/REPOSITORY.git (push)
```
在你下次使用`git fetch`，`git pull`或`git push`访问远程存储库时，系统将要求你重新提供GitHub用户名和密码
#### 将远程URL从HTTPS切换到SSH
* 列出现有的URL:
```
$ git remote -v
> origin  https://github.com/USERNAME/REPOSITORY.git (fetch)
> origin  https://github.com/USERNAME/REPOSITORY.git (push)
```
* 使用`git remote set-url`命令将远程URL从HTTPS更改为SSH
```
$ git remote set-url origin git@github.com:USERNAME/REPOSITORY.git
```
* 验证远程URL是否已更改
```
$ git remote -v
# 下面是新的 URL
> origin  git@github.com:USERNAME/REPOSITORY.git (fetch)
> origin  git@github.com:USERNAME/REPOSITORY.git (push)
```
#### 错误排解
出现以下错误，表示URL不存在：
```
$ git remote set-url sofake https://github.com/octocat/Spoon-Knife
> fatal: No such remote 'sofake'
```
更多请访问[官方Wiki](https://help.github.com/en/github/using-git/changing-a-remotes-url)！
### 总结

每次推送的话，基本上就是下面这么回事儿：

```
// 第一步
$  git add .

// 第二步
$ git commit -m "更新日志"

// 第三步
$ git push
```
