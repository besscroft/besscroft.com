---
title: "在虚拟机中安装ArchLinux(UEFI)"
date: 2020-01-31T11:25:13+08:00
tags: ["虚拟机","ArchLinux","UEFI启动","Linux"]
categories: ["技术"]
---

## 前言

关于操作系统的选择，我还是喜欢把Windows 10作为**Host OS**，把其它的作为**Guest OS**，比如一些Linux发行版openSUSE、Ubuntu等，以及用作其它用途的系统。比如我喜欢把迅雷等软件放在虚拟机的Windows系统里面(迅雷之类的软件感觉就是毒瘤，但有时候又需要用，别跟我说还有很多替代软件，我用的也不只是迅雷哦😅)。至于为什么要写这篇文章，因为我身边用ArchLinux的人慢慢地变多了起来，不过相对于ArchLinux，我还是比较喜欢Ubuntu啊😄

ArchLinux有一个与众不同的地方，初始安装的Arch只是一个基本系统，随后用户可以根据自己的喜好安装需要的软件并配置成符合自己理想的系统。很多用户喜欢ArchLinux的原因就是，“以用户为中心”等的[Arch之道](https://wiki.archlinux.org/index.php/Arch_Linux_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87))。如果您觉得安装ArchLinux之流已经满足不了你的折腾需求了，可以尝试[LFS](https://en.wikipedia.org/wiki/Linux_From_Scratch)哦！

<center><b>如果你是初次尝试Linux或者ArchLinux，我建议你从“业余环境”慢慢迁移到“工作环境”！</b></center>


## 准备工作

在安装的过程中，无论遇到什么困难，我们都不要怕，解决问题本身就是一种乐趣。此时，你可以围绕着Google等搜索引擎来寻找解决方案，[Arch官方论坛](https://bbs.archlinux.org/)、[Ubuntu中文论坛Arch专区](http://forum.ubuntu.org.cn/viewforum.php?f=155)、[IRC频道:archlinux-cn](irc://irc.freenode.net/#archlinux-cn)等，都是不错的地方。好在，ArchLinux官方提供了非常详细的Wiki👍

### 下载镜像

你可以去[官网下载](https://www.archlinux.org/download/)，或者使用国内外的镜像源进行下载。不管从哪里下载，我都建议你**验证GnuPG签名！！！**

### 虚拟机准备

新建虚拟机

![](/images/tech/2020/helloarchlinux/helloarchlinux01.png)

选择`典型`，然后下一步

![](/images/tech/2020/helloarchlinux/helloarchlinux02.png)

选择`稍后安装操作系统`，然后下一步

![](/images/tech/2020/helloarchlinux/helloarchlinux03.png)

然后客户机操作系统选择`Linux`，版本为`其他 Linux 5.x 或更高版本内核 64 位`。

![](/images/tech/2020/helloarchlinux/helloarchlinux04.png)

虚拟机名称和位置请自定义吧，**最好别用中文**(我没试过中文能不能成功，但最好别用)。

![](/images/tech/2020/helloarchlinux/helloarchlinux05.png)

磁盘大小我选择60GB，这个根据实际需求来就好啦！

![](/images/tech/2020/helloarchlinux/helloarchlinux06.png)

到这一步，我们选择`自定义硬件`

![](/images/tech/2020/helloarchlinux/helloarchlinux07.png)

![](/images/tech/2020/helloarchlinux/helloarchlinux08.png)

![](/images/tech/2020/helloarchlinux/helloarchlinux09.png)

![](/images/tech/2020/helloarchlinux/helloarchlinux10.png)

![](/images/tech/helloarchlinux/helloarchlinux11.png)

然后，选择完成即可！

![](/images/tech/2020/helloarchlinux/helloarchlinux12.png)

选择`编辑虚拟机设置`

![](/images/tech/2020/helloarchlinux/helloarchlinux13.png)

选择`选项`-->`高级`，然后选择`固件类型`为`UEFI`，然后点击确定。这一步非常重要，不能忽略！

## 安装

启动虚拟机之后，会看到如下画面：

![](/images/tech/2020/helloarchlinux/helloarchlinux14.png)

选择第一个 `Arch Linux archiso x86_64 UEFI CD`，按下回车键。

![](/images/tech/2020/helloarchlinux/helloarchlinux15.png)

过一会儿，就能进入U盘中的系统啦，也就是Live CD(据说有些Linux发行版，就只是在Live CD中运行的哦)。这一步可以输入`ls`查看到当前目录下，有一个叫做`install.txt`文件，它就是安装教程啦！可以输入命令 `cat i` + tab 键自动补全后回车查看（`shift + pgup/pgdn` 可上下翻页），也可用 `vim` 或 `nano` 查看。

### 验证启动模式

刚才我们不是设置的UEFI启动嘛？这时候来验证一下：

```bash
# ls /sys/firmware/efi/efivars
```

如果有输出，确认启动模式为UEFI，就没问题啦。

### 网络

确保系统启用了网络接口：

```bash
# ip link
```

使用`dhcpcd`联网：

```bash
# dhcpcd
```
<div class="note info"><p>-c 参数：用于指定 ping 的次数</p></div>


### 更新系统时间

```bash
# timedatectl set-ntp true
```

检查：

```bash
# timedatectl status
```

### 硬盘分区

到了重要的一步了，硬盘分区。先说说我的分区方案：

| 分区      | 分区类型             | 大小       | 描述        | 挂载点    |
| --------- | -------------------- | ---------- | ----------- | --------- |
| /dev/sda1 | EFI system partition | 512M       | EFI引导分区 | /mnt/boot |
| /dev/sda2 | Linux swap           | 4G         | 交换分区    | swap      |
| /dev/sda3 | /                    | 剩下所有的 | 系统根分区  | /mnt      |

查看硬盘的信息，核对无误后再上手操作：

```bash
# fdisk -l
```

![](/images/tech/2020/helloarchlinux/helloarchlinux16.png)

#### 开始分区

```bash
# fdisk /dev/sda
```

进入分区程序。输入 **m** 可以查看 fdisk 的帮助。**在决定写入之前，所有的更改都不会被保存。**

> * 创建分区表，输入 `g` 创建一个全新的 GPT (GUID Partition Table) 分区表。
> * 输入 **n** 建立第一个分区，这里我们创建的是sda1分区
> * 分区类型默认回车，分区序号默认回车，起始扇区默认回车，结束扇区输入 `+512M` 回车。

![](/images/tech/2020/helloarchlinux/helloarchlinux17.png)

依此类推，我们还需要创建交换分区和根分区：

![](/images/tech/2020/helloarchlinux/helloarchlinux18.png)

![](/images/tech/2020/helloarchlinux/helloarchlinux19.png)

#### 修改分区类型

按 **t** ，会询问需要修改的分区号，然后则是询问你要修改的类型（按 L 会列出各个分区类型的编号），编号 **1** 是 **EFI System Partition** ，编号 **19** 是 **swap** ，分区3的类型不做修改（默认的分区类型是 Linux Filesystem）。

![](/images/tech/2020/helloarchlinux/helloarchlinux20.png)

最后，我们输入w，将改动输入到硬盘：

![](/images/tech/2020/helloarchlinux/helloarchlinux21.png)

此时，我们来确认下有没有生效：

```bash
# fdisk -l /dev/sda
```

![](/images/tech/2020/helloarchlinux/helloarchlinux22.png)

#### 格式化，并设置swap分区

```bash
# mkfs.fat -F32 /dev/sda1
# mkswap /dev/sda2
# mkfs.ext4 /dev/sda3
```

#### 启用交换分区

```bash
# swapon /dev/sda2
```

查看是否启用成功

```bash
# swapon --show
```

#### 挂载分区

```bash
# mount /dev/sda3 /mnt
# mkdir /mnt/boot
# mount /dev/sda1 /mnt/boot
```

然后查看是否成功：

```bash
# lsblk
```

![](/images/tech/2020/helloarchlinux/helloarchlinux23.png)

### 选择镜像源

```bash
# vim /etc/pacman.d/mirrorlist
```

然后输入`:set nu`，按下回车键后，让vim显示行号。

![](/images/tech/2020/helloarchlinux/helloarchlinux24.png)

然后找到第19行的China。

![](/images/tech/2020/helloarchlinux/helloarchlinux25.png)

输入大写字母`V`，然后按`d`进行剪切，然后把光标移到第6行，按`p`进行粘贴。

![](/images/tech/2020/helloarchlinux/helloarchlinux26.png)

然后输入`:wq`，回车，保存并退出。

### 安装软件包

使用 `pacstrap` 脚本，安装 *base* 软件包和 Linux 内核以及常规硬件的固件：

```bash
# pacstrap /mnt base linux linux-firmware
```

注意，这里的`firmware`，不要输成`fireware`了😂

安装网络管理器：

```bash
# pacstrap /mnt networkmanager
```

### 配置系统

#### 生成挂载表

**fstab** 文件可用于定义磁盘分区，包括各种块设备或者远程文件系统应该如何装入到文件系统。

```bash
# genfstab -U -p /mnt >> /mnt/etc/fstab
```

检查一下：

```bash
# cat /mnt/etc/fstab
```

确认无误。

### arch-chroot

切换到安装的新系统

```bash
# arch-chroot /mnt
```

这意味着在 `exit` 之前，下面所有的操作都是在硬盘中的系统中运行，而非 U 盘。

#### 设置时区

```bash
[root@archiso /]# ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
```

将硬件时钟设置为当前系统时间：

```bash
[root@archiso /]# hwclock --systohc --utc
```

安装vim：

```bash
pacman -S vim
```

#### 配置系统语言环境：

```bash
[root@archiso /]# vim /etc/locale.gen
```

![](/images/tech/2020/helloarchlinux/helloarchlinux27.png)

找到 `#en_US.UTF-8 UTF-8` 这一行，光标移动到开头的 `#` ，然后输入 `x` ，再键入 `:wq` 保存并退出即可。同样的操作，把`zh_CN.UTF-8 UTF-8`也整一个。

接着执行 `locale-gen` 以生成 `locale` 信息：

```bash
[root@archiso /]# locale-gen
```

创建 `locale.conf` 文件，并相应地设置 `LANG` 变量：

```bash
[root@archiso /]# echo LANG=en_US.UTF-8 > /etc/locale.conf
```

<div class="note warning"><p>在<b>/etc/locale.conf</b>中设置的locale是全局有效的，所以只建议设置<b>LANG=en_US.UTF-8</b>，也就是上门这条指令所设置的内容。因为在这里设置了<b>中文locale</b>的话，会导致<b>tty</b>乱码。但是你可以在图形界面中单独启用<b>中文locale</b>。具体可以参考<a href="https://wiki.archlinux.org/index.php/Localization/Simplified_Chinese_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87)">官方Wiki</a></p></div>

#### 设置主机名

```bash
[root@archiso /]# echo arch > /etc/hostname
```

你可以把`arch`设置成自己的自定义主机名。

添加信息：

```bash
[root@archiso /]# vim /etc/hosts
```

按`i`编辑内容：

```bash
# Static table lookup for hostnames.
# See hosts(5) for details.
127.0.0.1   localhost
::1         localhost
127.0.1.1   arch.localdomain arch
```

如果你上面修改了`arch`，这里的也得改哦，主机名可以自定义，但要保持一致！

填写完成后就键入 `Esc` 键，退回命令模式，再键入 `:wq` 保存并退出。

将 *NetworkManager* 服务设为开机自启：

```bash
[root@archiso /]# systemctl enable NetworkManager
```

#### 设置 root 的密码

```bash
# passwd
```

输入后回车即可，输入时无显示，需输入两次。

#### 安装引导程序

> * default – 默认加载的配置文件 (不含 .conf 后缀)。
> * timeout – 启动选单的超时时间,如果不设置的话,启动选单只有在按键时才显示。
> * editor - 是否允许用户编辑内核参数。 yes 是允许, no 是阻止。

```bash
[root@archiso /]# bootctl --path=/boot install
```

用 vim 编辑 `/boot/loader/loader.conf` ：

```bash
[root@archiso /]# vim /boot/loader/loader.conf
```

如：

```bash
default  arch
timeout  5
console-mode max
editor   no
```

#### 添加启动选项：

```bash
[root@archiso /]# vim /boot/loader/entries/arch.conf
```

编辑如下内容：

```bash
title   Arch Linux
linux   /vmlinuz-linux
initrd  /initramfs-linux.img
options root=PARTUUID=
```

保存并退出编辑后，我们执行一下这么一行命令：

```bash
[root@archiso /]# blkid -s PARTUUID -o value /dev/sda3 >> /boot/loader/entries/arch.conf
```

上面的命令将会把根分区的UUID的值追加到 `/boot/loader/entries/arch.conf` 的最后一行。

![](/images/tech/2020/helloarchlinux/helloarchlinux28.png)

此时，可能是这样的，你需要用 vim 编辑 `/boot/loader/entries/arch.conf` ，将文件改成这样：

![](/images/tech/2020/helloarchlinux/helloarchlinux29.png)

#### 重启系统

回退到Live CD环境

```bash
[root@archiso /]# exit
```

执行重启命令：

```bash
# systemctl reboot
```

重启后会出现如图所示：

![](/images/tech/2020/helloarchlinux/helloarchlinux30.png)

选择第一个，`Arch Linux`，进入系统，然后输入用户名和密码。

#### 新建普通用户

先安装sudo软件包：

```bash
[root@arch ~]# pacman -S sudo
```

配置 `sudoers`：

```bash
[root@arch ~]# EDITOR=vim visudo
```

找到这一行：

```bash
# %wheel ALL=(ALL) ALL
```

去掉找到的那一行开头的注释，即 **#** 和 **空格** ，不要误删掉 **%** 哦。弄完之后保存即可:

```bash
%wheel ALL=(ALL) ALL
```

<div class="note info"><p>去掉注释的作用：取消注释以允许 wheel 组成员执行任何命令</p></div>
添加一个 wheel 组普通用户:

```bash
[root@arch ~]# useradd -m -g users -G wheel -s /bin/bash 你想要取的用户名
```

设置普通用户的密码：

```bash
[root@arch ~]# passwd 你取的用户名
```

#### VMware 相关软件包和服务

安装 `open-vm-tools`：

```bash
[root@arch ~]# sudo pacman -S open-vm-tools
```

将 `vmtoolsd` 和 `vmware-vmblock-fuse` 两个服务设为开机自启:

```bash
[root@arch ~]# systemctl enable vmtoolsd vmware-vmblock-fuse
```

安装 `gtkmm3`：

```bash
[root@arch ~]# sudo pacman -S gtkmm3
```

安装相关驱动:

```bash
[root@arch ~]# sudo pacman -S xf86-input-vmmouse xf86-video-vmware mesa
```

如果你不明白这几步干嘛的，可以查阅[官方Wiki](https://wiki.archlinux.org/index.php/VMware/Installing_Arch_as_a_guest_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87)#Open-VM-Tools)

### 安装桌面环境

到了这一步，很多人都会卡在KDE和GNOME之间怎么选择了。2个我都用过，也不好说谁更好用。单纯从使用习惯和风格来考虑。GNOME更像macos的那种风格，而KDE更像Windows的风格。

#### 1.GNOME桌面

```bash
[root@arch ~]# sudo pacman -S xorg xorg-server xorg-xinit gnome gnome-extra
[root@arch ~]# systemctl enable gdm
```

#### 2.KDE桌面

```bash
[root@arch ~]# sudo pacman -S xorg plasma-meta
```

#### 3.LightDM

可以选择用LightDM替换GNOME

```bash
[root@arch ~]# sudo pacman -S lightdm lightdm-gtk-greeter
[root@arch ~]# systemctl disable gdm
[root@arch ~]# systemctl enable lightdm
```

重启系统，选择 Gnome on Xorg 启动。

同时，发现启动界面有两个重复的 Gnome 选项，解决方法：

```bash
[root@arch ~]# sudo mv /usr/share/wayland-sessions/gnome.desktop /usr/share/wayland-sessions/gnome.desktop.bak
```

#### 完善显卡驱动(可选)

```bash
[admin@arch ~]# sudo pacman -S xf86-video-intel intel-media-driver vulkan-intel xf86-video-amdgpu xf86-video-ati mesa-vdpau vulkan-radeon
```

### 显示管理器

安装 `sddm` ：

```bash
[admin@arch ~]# sudo pacman -S sddm
```

将 `sddm`服务设为开机自启：

```bash
[admin@arch ~]# systemctl enable sddm
```

重启虚拟机：

```bash
[admin@arch ~]# systemctl reboot
```

重启后，即可进入图形系统。

## 安装完之后

### 安装终端

按下 `Ctrl + Alt + F2` 切换至 `tty2` ，登录，然后输入命令：

```bash
[root@arch ~]# sudo pacman -S deepin-terminal
```

然后按下 `Ctrl + Alt + F1` 切换至桌面环境。

### yay

对于 Arch Linux，最具特色也是最强大的莫过于它丰富的 AUR (Arch User Repository)，而 yay 就是一个安装这个仓库的软件的便捷工具。

```bash
$ git clone https://aur.archlinux.org/yay.git
$ cd yay
$ makepkg -si
$ cd ..
$ rm -rf yay
```

### 一些工具

```bash
$ sudo pacman -S git vim wget curl ntfs-3g exfat-utils p7zip unzip unrar
```

### 安装chromium

```bash
$ sudo pacman -S chromium
```

### 安装中文字体

打开终端，执行以下命令：

```bash
$ sudo pacman -S base-devel git
$ git clone https://aur.archlinux.org/noto-fonts-sc.git
$ cd noto-fonts-sc
$ makepkg -si
$ sudo pacman -S noto-fonts-emoji
```

上面的命令可能需要代理。。。

### 安装 shadowsocks-qt5

```bash
$ sudo pacman -S shadowsocks-qt5
```

### 安装文件管理器

```bash
$ sudo pacman -S dolphin
```

### 安装归档管理器

```bash
$ sudo pacman -S p7zip unrar zip unzip engrampa
```

然后，其它的自己去diy吧😀

## Arch信仰

安装`neofetch`

```bash
$ sudo pacman -S neofetch
```

然后在终端输入：

```bash
$ neofetch
```

呐：

![](/images/tech/2020/helloarchlinux/helloarchlinux31.jpg)