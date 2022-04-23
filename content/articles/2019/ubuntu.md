---
title: "Ubuntu安装记录"
date: 2019-07-04T15:56:15+08:00
tags: ["Linux"]
categories: ["技术"]
---

一直以来，都是在虚拟机里面使用Linux系统，但随着使用需求的增加，于是直接在笔记本中安装Ubuntu。基本上就是Windows 10 + Ubuntu18.04LTS双系统共存模式！

## 浅谈

很多同学在虚拟机中安装Linux(实际上不仅限于Ubuntu)，都会觉得安装很简单，基本上就是一直点下一步之类的，当然了，ArchLinux之流除外哈。不是说ArchLinux不好用(我觉得过渡动画还比较流畅，速度也很快)，而是它的安装过程，感觉就是个过滤用户的阴谋😂

既然要直接在笔记本上安装，那么，肯定会有不少坑的，而且还是双系统共存。最常见的就是分区和假死了吧(卡死在某一界面)。其它的诸如制作镜像，装驱动出现问题，点击现在重启卡死等。我在刚买我的暗影精灵3的时候，就尝试过双系统，然后，你懂的。我直接就留下了心里阴影，因为那时候没做备份，后来我备份的好习惯就是这么被逼出来的🙃

## 准备工作

### 电脑配置

先介绍下我的电脑配置吧。

```
产品名称 : OMEN by HP Laptop 15-ce0xx
BIOS : F.18-11/09/2018
内存总量 : 16 GB
处理器名称 : Intel(R) Core(TM) i7-7700HQ CPU @ 2.80GHz
BIOS模式 : UEFI
当前系统 : Windows 10 家庭中文版 1903 版本18632
显卡 : NVIDIA GeForce GTX 1050
```

### 制作镜像

在哪里下，应该就不用我废话了，我个人更喜欢👍[清华大学开源软件镜像站](https://mirrors.tuna.tsinghua.edu.cn/)，大家没下载的可以在这里下。如果是要像我一样，想当作主力系统来用的，就下Ubuntu 18.04.02LTS版本，LTS是官方长期维护的版本，更稳定，一直维护到2023年4月。如果你跟我一样，喜欢最新的事务，那么，Ubuntu 19.04是你不错的选择，自带的UI变漂亮了许多，但遗憾的是，它的支持生命周期只到2020年1月😥

镜像制作工具，推荐[Rufus](http://rufus.ie/)吧，简单制作个镜像而已，必须要花里胡哨的功能，而且差不多就1M大小，免安装！！！

![](/images/articles/2019/ubuntu/ubuntu01.png)

选项基本跟我保持一致即可，尤其是簇大小，大家都习惯默认的，但是部分奇葩的U盘，默认分配单元大小是16K或者32K，可能会导致安装系统过程中，出现一些不必要的问题。

**然后，在Windows下分一个给Ubuntu用的分区出来，确保为为分配状态！！！**

### 系统安装

#### BIOS设置

开机进入BIOS，hp暗影精灵是开机按F10，其它品牌请自行Google！

![](/images/articles/2019/ubuntu/ubuntu02.png)

![](/images/articles/2019/ubuntu/ubuntu03.png)

如图，你需要将传统模式和安全启动模式(Secure Boot)都设置为禁用，然后把U盘的启动顺序调整到操作系统管理员的前面。如果你不禁用Secure Boot的话，Ubuntu系统将无法运行，不明白为什么的同学，自行Google！

#### 禁用N卡

然后重点来了！！！你这时候应该进入引导界面了，但是不要着急！！！把光标移到`Install Ubuntu`，先别着急敲下回车键。先按下键盘上的字母键E，然后将`quiet splash --- `更改为 `quiet splash nouveau.modeset=0`，如图：

![ubuntu04](/images/articles/2019/ubuntu/ubuntu04.png)

改为：

![ubuntu05](/images/articles/2019/ubuntu/ubuntu05.png)

我在安装时忘记拍照了，这是在虚拟机中截的图，不过影响不大，只是用来参考的。改完之后，按下Ctrl+X或者F10，具体的那个界面下面会有显示的。

<div class="note warning"><p>为什么要大家这么做呢？因为自己安装过的朋友，遇到过最头疼的问题应该就是安装过程中卡死了，我曾经也遇到过！没错，就是从你开始安装，直到安装完毕进入Ubuntu的桌面为止，随时都有可能卡死。但是在虚拟机中并不会这样，我去Google查了一下，很多解释差不多是这个意思：Ubuntu是开源系统，但是Nvidia并没有将显卡驱动开源，所以Ubuntu内核中自带的Nvidia显卡驱动版本就没有特别新，就导致安装过程中会卡死。所以进行上面的设置后，禁止Ubuntu加载自带的N卡驱动，问题就解决了。玩过黑苹果的朋友门，应该也碰到过相同的问题吧。</p></div>

#### 安装选项

只强调2件事，如果禁用N卡驱动之后，窗口变大的话，部分窗口被挤出屏幕，导致鼠标点不到按钮，可以按住Alt键然后用鼠标拖动窗口。其次，建议不要选择最小安装，这样以后你使用是，会少部分依赖库，给你造成麻烦(精通Linux的大神当我没说！)😋

#### 分区挂载

![](/images/articles/2019/ubuntu/ubuntu06.png)

千万不要偷懒，一定要选择其它选项。

![ubuntu07](/images/articles/2019/ubuntu/ubuntu07.png)

挂载分区，因为是UEFI启动模式，所以只少要4个分区，以我的为例，我分了100个G给Ubuntu，且我的运行内存为16G。

| 分区类型 | 挂载点 | 大小    | 说明        |
| -------- | ------ | ------- | ----------- |
| efi      | efi    | 2046MB  | 用于安装efi |
| swap     | swap   | 16386MB | 交换分区    |
| ext4     | /home  | 42859MB | 主目录      |
| ext4     | /      | 46080MB | 根目录      |

传统的Boot为主分区，UEFI模式就选择逻辑分区，efi分区用来存储引导器，系统的启动文件等。我分配了2G，硬盘不大的400M左右也可以。

swap分区选择主分区，这个交换分区就相当于是虚拟内存，一般设置为你的内存大小的同等大小，或者内存的2倍。

`/home`即主目录，也叫用户的宿主目录。用户登录系统后，所处的位置就是/home，通常用来保存用户文件。没错，什么图片啊、视频啊、你下载的东西啊，都是存在这里的，给多少自己看着办吧。

`/`即根目录，不要给太小，如果一共就四五十个G，至少也得给15G左右。

最后，在下面的`安装启动引导器的设备`那里，**选择你刚才分出来的那个efi分区**(划重点，要考)，然后再点击`现在安装`。然后后面的一堆设置可以按需求设置，然后，慢慢等。

#### 重点来了

这一步很重要，因为实际上整个安装过程并没有结束，你还是得提防Ubuntu有没有搞你。在安装完成之后，系统会提示`已安装完成，是否重启`，这不废话吗，当然得选择`现在重启`了(逃)。。。😐

点击重启之后，拔掉U盘，然后**在开机的品牌logo出现后，按一下、按一下、只按一下键盘左上角的ESC键**。开机的时候，都会出现品牌logo的吧？你看到它之后，按一下就行了。为了防止某些同学说他电脑开机不显示品牌logo，那好，你插上鼠标，等重启后屏幕亮了之后(屏幕是黑色时也有亮的情况，别跟我杠这些)，然后看着你的鼠标，鼠标等亮了之后，按一下ESC键。

![ubuntu08](/images/articles/2019/ubuntu/ubuntu08.png)

<p><center>(图片来源于互联网，我没拍照，不过都差不多)</center></p>

这时候出现的画面，就是`GRUB`引导器，键盘选中`Ubuntu`这一项，然后按下键盘字母`E`键，是不是觉得刚才做过这步？是的，按下E之后，一样的操作。

把光标移到`Install Ubuntu`，先别着急敲下回车键。先按下键盘上的字母键E，然后将`quiet splash --- `更改为 `quiet splash nouveau.modeset=0`，如图：

![ubuntu04](/images/articles/2019/ubuntu/ubuntu04.png)

改为：(只要让那一串代码变成下图这样，这串代码前面和后面不变，你不用管它是什么)

![ubuntu05](/images/articles/2019/ubuntu/ubuntu05.png)

到这里，应该就可以正常地进入系统了。

## 安装之后

### 更换镜像源

由于一系列总所周知的原因，我们需要更换镜像源为国内的源，我推荐使用[清华大学的镜像源](https://mirrors.tuna.tsinghua.edu.cn/help/ubuntu/)，其它源也可以用类似的方法添加。

**先备份好习惯！**

```
sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak
```

打开编辑源列表：

```
sudo gedit /etc/apt/sources.list
```

将文件内所有文件清空，然后将下列清华源全部copy进去：

```
# 默认注释了源码镜像以提高 apt update 速度，如有需要可自行取消注释
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic-updates main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic-updates main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic-backports main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic-backports main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic-security main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic-security main restricted universe multiverse

# 预发布软件源，不建议启用
# deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic-proposed main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic-proposed main restricted universe multiverse
```

然后用清华源更新一下：

```
sudo apt-get update
sudo apt-get upgrade
```

如果你不知道这两条命令干嘛的，请自行Google，按理说应该知道的！

### 安装nVidia驱动

#### 自动安装

推荐使用标准的Ubuntu仓库进行自动化安装，虽然版本不是最新的，但是**更稳定**！！！又不打游戏，用Linux一大原因不就是图个稳定嘛！

删除现有的系统自带N卡驱动以及相关的所有配置文件等：

```
sudo apt-get --purge remove nvidia*
```

查看显卡设备，并显示系统推荐的驱动版本：

```
ubuntu-drivers devices
```

安装系统推荐的驱动：

```
sudo ubuntu-drivers autoinstall
```

#### 其它方案

自行Google好嘛，只让你看最稳定的方式，要追求刺激，可以自己去追求，我怕出了问题要来怪我！

安装完之后，开机就不用再去设置了(重启后生效！)

## 配置优化

到这里基本上就结束了，其它的使用，我可以给一些建议！

- 安装中文输入法，如：`搜狗`。

- 安装浏览器，如：`chrome`。

- 彻底卸载办公软件Libreoffice，改用WPS等。

```
sudo apt remove libreoffice-calc	//卸载libreoffice表格
sudo apt remove libreoffice-draw	//卸载libreoffice绘图
sudo apt remove libreoffice-impress //卸载libreoffice幻灯片
sudo apt remove libreoffice-writer  //卸载libreoffice文档
sudo apt remove libreoffice*		//清理所有libreoffice相关
sudo apt purge libreoffice*			//清理libreoffice配置文件
sudo apt autoremove					//清理libreoffice配置文件
```

- 安装思源宋体等好看的字体
- UI透明化，配置终端(这个很重要)等。
- 安装Steam，开始白给。
- 安装一个好看的主题。
- 安装网易云音乐等。