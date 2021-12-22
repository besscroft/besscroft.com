---
title: "在VirtualBox上安装Android-X86"
date: 2019-08-17T10:50:49+08:00
tags: ["Android"]
categories: ["技术"]
---

对于`Android`开发来说，尤其是新手(没错，我自己就是`noob`😥)，有很多种开发调试的方案。比如`Genymotion+VirtualBox`搭配方案(在我的笔记本上这种方案性能最低，可能因配置而异)、直接用`VirtualBox`安装`Android-X86`的`iso`，或者是直接在`Android Studio`里面调试等等。本文介绍的是直接用`VirtualBox`安装`Android-X86`，虽然是在虚拟机中安装，但是也会有很多不可避免的坑！！！

![](/images/tech/android-for-virtualbox/android-for-virtualbox025.png)

## 准备

首先，我们要准备`VirtualBox`：

官网👉：https://www.virtualbox.org/wiki/Downloads

然后下载`Android-X86`的`iso`，这是一个将[Android开源项目](https://source.android.com/)移植到x86平台的项目：

官网👉：https://www.android-x86.org/download

**注：本文章同样适用于PhoenixOS系统！**

## 配置

准备好之后，我们安装完并打开`VirtualBox`，找到如图所示的`新建`按钮(不同版本可能界面稍有不同，但是明白要干什么就行了):

![](/images/tech/2019/android-for-virtualbox/android-for-virtualbox001.png)

![](/images/tech/2019/android-for-virtualbox/android-for-virtualbox002.png)

然后设置相应的信息，注意文件夹就是虚拟机文件存放位置，建议不要用默认的。名称随便取，类型选`Linux`，版本选`Other Linux`，至于是`32位`还是`64位`，就看你下载的`iso`是多少位的了。然后点击下一步。

![](/images/tech/2019/android-for-virtualbox/android-for-virtualbox003.png)

然后分配内存，这个看电脑本身的内存多大再酌情配置，然后点击下一步。

![](/images/tech/2019/android-for-virtualbox/android-for-virtualbox004.png)

然后选择`现在创建虚拟硬盘`。

![](/images/tech/2019/android-for-virtualbox/android-for-virtualbox005.png)

然后选择VDI，点击下一步。

![](/images/tech/2019/android-for-virtualbox/android-for-virtualbox006.png)

选择动态分配，然后点击下一步(当然，硬盘空间大的请随意)。

![](/images/tech/2019/android-for-virtualbox/android-for-virtualbox007.png)

根据实际情况来配置虚拟硬盘的大小，硬盘空间大的请随意，然后点击创建。

![](/images/tech/2019/android-for-virtualbox/android-for-virtualbox008.png)

然后找到我们刚才创建好的`Android_test`，点击设置。

![](/images/tech/2019/android-for-virtualbox/android-for-virtualbox009.png)

然后点击显示-调整显存大小-启用硬件加速里面的3D加速。

![](/images/tech/2019/android-for-virtualbox/android-for-virtualbox010.png)

选择存储-点击盘片-分配一个光驱，就是把你下载的`Android-X86`的`iso`添加进去。然后点击ok。

## 安装

当鼠标进入虚拟机窗口移不出来时，按下键盘右边的Ctrl(唱、跳、Rap、篮球😀)即可，vm虚拟机是Ctrl+Alt。

![](/images/tech/2019/android-for-virtualbox/android-for-virtualbox011.png)

双击我们创建好的虚拟机。

![](/images/tech/2019/android-for-virtualbox/android-for-virtualbox012.png)

选择`Advanced options...`，然后

![](/images/tech/2019/android-for-virtualbox/android-for-virtualbox013.png)

选择`Auto_Installation`，这里为什么建议大家选择自动安装呢？因为我们再“这个”虚拟机中只分配了一个虚拟硬盘，而且并不大，所以没必要分区。而且这样也最快，能保证新手在不太了解的情况下不出错。选择这一项之后，按下回车键。

![](/images/tech/2019/android-for-virtualbox/android-for-virtualbox014.png)

选择yes！

![](/images/tech/2019/android-for-virtualbox/android-for-virtualbox015.png)

耐心等待！

![](/images/tech/2019/android-for-virtualbox/android-for-virtualbox016.png)

选择Reboot以重启。

## 划重点

在重启之后，会回到开始的位置

![](/images/tech/2019/android-for-virtualbox/android-for-virtualbox017.png)

然后我们将其强制退出！

![](/images/tech/2019/android-for-virtualbox/android-for-virtualbox018.png)

然后在设置里面，把iso的盘片移除，免得开机时加载盘片去了。然后再重新双击启动！

![](/images/tech/2019/android-for-virtualbox/android-for-virtualbox019.png)

然后选择`Android-x86 8.1-r2`，**千万别手贱按了回车**，通过下面的帮助信息得知，我们要按下`E键`，进入编辑页面.

![](/images/tech/2019/android-for-virtualbox/android-for-virtualbox020.png)

然后在`kernel`哪里，同样的按下`E键`，进入编辑页面

![](/images/tech/2019/android-for-virtualbox/android-for-virtualbox021.png)

移动光标，找到图中的`quiet`这个词。

![](/images/tech/2019/android-for-virtualbox/android-for-virtualbox022.png)

把`quiet`改为`nomodeset xforcevesa`，然后按下回车键，再按下键盘上的`B键`。

![](/images/tech/2019/android-for-virtualbox/android-for-virtualbox023.png)

然后你就会看到Android的字母了，慢慢等待即可！后面的就不说了，等到了“开机”，应该就自己会玩了，跟用手机也区别不大！

**注：每次开机都需要这一步操作，如果你不想这么做，请自行Google！**

## 问题详解

这时候来给大家解释一下，为什么刚才在进入系统之前要修改某些参数！转化成问题，也就是：为什么部分电脑或者虚拟机无法启动Android-x86系统的图形界面？

![](/images/tech/2019/android-for-virtualbox/android-for-virtualbox024.png)

先来看一张图，我们知道，它是基于Linux内核的，就跟大多数人安装Linux时需要禁用独显一样，你在安装Android-x86时，需要告诉内核，不要设置图形分辨率。

那么，刚才的三个步骤，分别是在干什么呢？

- 删除`quiet`，删除之后可以查看内核消息。
- 添加`nomodeset`参数，禁用“内核模式设置”(告诉内核不要设置图形分辨率，让X代替)。
- 添加`xforcevesa`参数，强制使用X的VESA驱动程序。

**VESA**是一个支持大部分显卡的通用驱动，但不提供任何2D和3D加速功能。要充分发挥显卡性能，需安装**相应的厂商驱动程序**。

nVidia用户，可以参考ArchLinux的内核模式设置:https://wiki.archlinux.org/index.php/Kernel_mode_setting

同时，你可以了解HybridGraphics:https://help.ubuntu.com/community/HybridGraphics

然后查看项目官方的wiki(必要的):https://www.android-x86.org/documentation/graphic_card.html

以及issues:https://github.com/openthos/system-analysis/issues/23