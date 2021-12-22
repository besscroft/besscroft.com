---
title: "Playing CSO2 on your computer！"
date: 2019-04-03T21:55:50+08:00
categories: ["技术"]
tags: ["CSO2","反恐精英OL2"]
---

## 写在前面

反恐精英Online2，英文名：Counter-Strike Online2，粉丝们称为蛋拐兔2。世纪天成公司于2013年9月5日正式宣布代理《反恐精英Online2》，国服于2015年2月5日起源首测，3月5号二测，4月22号正式公测。然而不辛的是，在2018年5月18日，国服（世纪天成代理）正式停止运营。

### 想法

嗯，反正我是在停服之前的一段时间，就已经没玩了。因为我害怕，害怕前一天还玩了，第二天就进不去游戏了，这并不是我想要的。在我的印象中，每年的圣诞节，是蛋拐兔最好玩的时候，人多，氛围也好。而18年的圣诞节，只能听听bgm艰难度日，到后来，当我得知有私服之后，我便又重新燃起了激情！！！

## Gaming

### 浅谈

蛋拐兔2关服了，你是否还在苦恼呢？其实不少小伙伴们都知道有私服的，虽然不是我的，但是我也想借此机
会来推广，好让喜欢的朋友玩。我知道的私服都是免费的，都是公益性质的，搭建私服的大佬们完全是为了能
让大家接着玩，而且还免费。我录制视频和写教程，不出于任何形式的盈利目的，完全是基于一个热爱的老
玩家心态，告知和帮助那些跟我一样，曾经喜欢玩蛋拐兔的玩家，能够重新玩这款游戏。

<center>不管你玩不玩，但是请记得，你的青春里有过它！！！</center>

### 致谢

首先，让我们感谢Ochii大神写的CSO2的主服务器和客户端启动程序，并且已经开源了！
还有“I'm Not MentaL”大神的GUI启动器。
同时也感谢国内的几个小团队，自己搭建了国内的私服，并在此基础上优化了服务端和启动端，让大家
不仅免费也更容易地van这款游戏，而且是联机的！谢谢你们做出的努力！感谢！


### 要求

```
 - Microsoft .NET Framework 4.5.2及以上
 - NodeJS（如果你玩国内的联机私服，则不需要安装）
 - 一些必要的游戏运行环境，如果你是平常玩游戏，那么我相信你的电脑上也已经有了
```

### 准备

```
 - 安装包，版本可选，看你想玩那种的。国内私服的话，也是有它们自己稍做了修改的版本的。
		链接：https://pan.baidu.com/s/15qVLo7jrJxG6r-kZBqqEdQ   提取码：1h7v 
 - 主服务器 
		链接：https://pan.baidu.com/s/166igd4lFMR1R776ATMKN5w   提取码：h0ka 
 - 客户端启动程序
		链接：https://pan.baidu.com/s/1OeDIVXhbfgvDljVLdYxVfA   提取码：iwso 
 - GUI启动器
		链接：https://pan.baidu.com/s/1A8rh44NzJ8MSXU8edJqIwQ   提取码：czup 
 - node.js（版本10或更高版本）
```



### 基本步骤

我们先假设，你已经安装了[Node.js](https://nodejs.org/zh-cn/)，然后，在你的电脑硬盘里面，随便找一个盘。我放在E盘了，比如我的游戏路径

```
E:\Counter-Strike Online 2
```

然后创建`Game`文件夹和`Server`文件夹，如图：

![](/images/tech/2019/cso2/cs001.png)

然后，将游戏的压缩包解压到`Game`文件夹，解压完之后，应该是这样：

![](/images/tech/2019/cso2/cs002.png)

接着将主服务器的压缩包，解压至`Server`文件夹，解压完之后，应为：

![](/images/tech/2019/cso2/cs003.png)

然后，将下载的2个客户端启动程序，解压至`Counter-Strike Online 2\Game\Bin`文件夹。解压完成后，再将GUI启动器压缩包，解压至`Counter-Strike Online 2`根目录下。然后，基本上就完成一大半了。正常的，这个时候你的游戏根目录下应该为这样：

![](/images/tech/2019/cso2/cs004.png)

## 构建游戏

下一步我们要做的，就是让游戏跑起来！

### 方法一

这一步是最开始的方法，但是也最复杂，不建议大家使用，请跳至下一步！

要运行服务器，您需要：

- [Node.js](https://nodejs.org/zh-cn/)（版本10或更高版本）;
- 搭建服务器，也就是我们下载的主服务器。

然后，在服务器目录内的终端实例中，执行以下操作：

```
npm install --only = production ＃安装所需的依赖项（最小依赖项） 
npm run start ＃启动预构建服务器
```

默认情况下，服务器**会询问您要侦听的网络接口**。

#### 搭建

下载源代码后，转到源代码目录中的终端实例，然后：

```
npm install ＃安装所需的依赖项 
npm run build ＃ builds服务器 
npm run start ＃启动新服务器构建
```

#### 命令行参数

选项：

- `-i, --ip-address [ip]`（*可选*）要侦听的IP地址（默认值：自动检测）
- `-p, --port-master [port]`（*可选*）服务器的（TCP）端口（默认值：30001）
- `-P, --port-holepunch [port]`（*可选*）服务器的打孔（UDP）端口（默认值：30002）
- `-l, --log-packets`（*可选*）记录传入和传出的数据包

#### 安装

在开始之前，你必须允许launcher.exe在防火墙和端口转发端口27015到27020或打开路由器的NAT，以便与其他人一起玩。

如果您举办房间比赛，其他客户将知道您的IP。

如果您加入主持人的房间比赛，主人将知道您的IP。

一旦开发了专用服务器启动器，这可能在将来可以避免。

#### 开始游戏

基本上就是挂载到一个大服务器，然后玩家们进来。由配置和网络比较好的玩家开启房间当房主，然后其他人加入游戏。同时，房主卡，其他人跟着卡，房主推出房间，其他人也会掉。虽然目前只能这样，但是我觉得有得玩我就很高兴了😂

#### 对于启动器

- `-lang [some language]`- 将游戏的语言设置为*某种语言*（考虑到您拥有语言文件）
- `-masterip [some ip]`- 将主服务器的IP地址设置为*某个IP*
- `-masterport [some port]`- 将主服务器的端口号设置为*某个端口*
- `-decryptedfiles` - 告诉游戏将每个游戏文件视为已解密
- `-enablecustom`- 允许在`custom`游戏文件的根目录中使用自定义目录
- `-username [your username]` - 指定登录用户名，以跳过登录屏幕。**必须**使用`-password`
- `-password [your password]` - 指定登录密码，以跳过登录屏幕。**必须**使用`-username`

### 方法二

直接运行游戏根目录下的`PlayCSO2.exe`,如图：

![](/images/tech/2019/cso2/cs005.png)

然后点击游戏设定，分别如下面的图片所示，自己视情况设定选项：

![](/images/tech/2019/cso2/cs006.png)

![](/images/tech/2019/cso2/cs007.png)

![](/images/tech/2019/cso2/cs008.png)

然后点击保存，如果询问你是都要构建服务器之类的，或者是其它的，直接允许即可！然后根据你的网络情况，可以选择本地启动游戏，或者是连接到其它服务器加入游戏！开始游玩吧！

运行成功之后，会有cso2_launcher.ini，这个文件里面有登陆账号和密码，是你不联网的情况下，在本地使用的。


### 其它方法

~~这个其它方法嘛，就是各个搭建私服的工作组，给大家介绍的玩他们的私服的方法，略有不同，具体的自己去看看呢！~~建议有条件玩外(私)服，国内的私服。。。

## 再次鸣谢

感谢Ochii，主服务器GitHub👉[地址](https://github.com/Ochii/cso2-master-server)，客户端启动程序GitHub👉[地址](https://github.com/Ochii/cso2-launcher/)，感谢！均有MIT许可证许可！

感谢“I'm Not MentaL”大神的GUI启动器，他的👉[Patreon](https://www.patreon.com/posts/counter-strike-2-24597456?fbclid=IwAR25UBDEym2WhYishRcbFUtUD7URm1Z4phQOl9AsUGse7nERP0dFOy1Dwhg)！感谢！

Counter-Strike Online2的👉[网站](https://csonline2.net/)，感谢！

Counter-Strike Online2的👉[论坛](https://csonline2.net/forum/)，感谢！

感谢~~你们~~国外大神所做出的努力！

## 最后

<iframe width="680" height="360" src="https://www.youtube-nocookie.com/embed/djEXG4_IwCY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

视频链接👉https://www.youtube.com/watch?v=djEXG4_IwCY

有什么问题或建议，欢迎留言或者发邮箱。~~这里没有商业合作，每一个团队需要宣传都欢迎联系我！~~~~感谢无私帮助玩家们的开发者们，你们辛苦了！~~感谢国外的几个大神！

