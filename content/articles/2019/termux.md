---
title: "神器Termux的使用记录"
date: 2019-04-23T11:47:39+08:00
categories: ["技术"]
tags: ["Termux"]
---

Termux是一个Android终端模拟器和Linux环境应用程序，可以直接使用，无需root或设置。自动安装最小基本系统 - 使用APT包管理器可以使用其他软件包。

## Termux使用

我觉得吧，虽然我喜欢玩游戏，但是我不怎么玩手游，我觉得还是以前的手游(主要指单机)好玩些，现在的手游都提不起我的兴趣了。那么，在安卓手机上，就有这样一个替代品——[Termux](https://termux.com/)

### 我的准备步骤

1.先下载安装，我是在Google play下的，或者可以去👉[GitHub](https://github.com/termux/termux-app)。

2.安装完之后，我们进入Termux

![](/images/articles/2019/termux/termux01.png)

然后先更新源和升级软件包：

```
apt update	//更新源
apt upgrade  //升级软件包
```

3.安装一些基本的包，我推荐你安装一下：

```
apt install git  //分布式管理工具
apt install wget   //下载工具
apt install vim    //vim编辑器
apt install tar  //解压缩工具
apt install less  //termux下vim支持触摸移动光标移动位置
```

4.更换国内源，没错，这样网络速度会更快，更换Termux清华大学源,加快软件包下载速度.

```
export EDITOR=vi  //设置默认编辑器
apt edit-sources  //编辑源文件
将原来的https://termux.net官方源替换为http://mirrors.tuna.tsinghua.edu.cn/termux stable main
ESC，输入:wq保存并退出
```

或者

```
vi  $PREFIX/etc/apt/sources.list  //直接编辑源文件
# 安装基本工具
	pkg update
	pkg install vim curl wget git unzip unrar
```

5.编辑启动问候语

```
vim $PREFIX/etc/motd  //编辑问候语文件直接修改问候语
```

### 常用快捷键

`Ctrl`键是终端用户常用的按键 - 但大多数触摸键盘都没有这个按键。为此，Termux使用`音量减小按钮`来模拟`Ctrl`键。
例如，在触摸键盘上按`音量减小`+ `L`发送与在硬件键盘上按`Ctrl + L`相同的输入。

```
Ctrl+A -> 将光标移动到行首
Ctrl+C -> 中止当前进程
Ctrl+D -> 注销终端会话
Ctrl+E -> 将光标移动到行尾
Ctrl+K -> 从光标删除到行尾
Ctrl+L -> 清除终端
Ctrl+Z -> 挂起（发送SIGTSTP到）当前进程
```

`音量加键`也可以作为产生特定输入的`特殊键`.

```
音量加+E -> Esc键
音量加+T -> Tab键
音量加+1 -> F1（和音量增加+ 2→F2等）
音量加+0 -> F10
音量加+B -> Alt + B，使用readline时返回一个单词
音量加+F -> Alt + F，使用readline时转发一个单词
音量加+X -> Alt+X
音量加+W -> 向上箭头键
音量加+A -> 向左箭头键
音量加+S -> 向下箭头键
音量加+D -> 向右箭头键
音量加+L -> | （管道字符）
音量加+H -> 〜（波浪号字符）
音量加+U -> _ (下划线字符)
音量加+P -> 上一页
音量加+N -> 下一页
音量加+. -> Ctrl + \（SIGQUIT）
音量加+V -> 显示音量控制
音量加+Q -> 显示额外的按键视图
```

## 基本命令

`Termux`除了支持`apt`命令外,还在此基础上封装了`pkg`命令,`pkg`命令向下兼容`apt`命令.`apt`命令大家应该都比较熟悉了,这里直接简单的介绍下`pkg`命令:

```bash
pkg search <query>              搜索包
pkg install <package>           安装包
pkg uninstall <package>         卸载包
pkg reinstall <package>         重新安装包
pkg update                      更新源
pkg upgrade                     升级软件包
pkg list-all                    列出可供安装的所有包
pkg list-installed              列出已经安装的包
pkg shoe <package>              显示某个包的详细信息
pkg files <package>             显示某个包的相关文件夹路径
```

### 更换配色

执行下面这个命令确保已经安装好了curl，没有的话根据它的提示安装，你没安装的话，执行了下面这条语句，它会给你一条安装curl的语句的。

```
sh -c "$(curl -fsSL https://github.com/Cabbagec/termux-ohmyzsh/raw/master/install.sh)"  
```

Android6.0以上会弹框确认是否授权,`允许`授权后`Termux`可以方便的访问SD卡文件.
脚本允许后先后有如下两个选项:

```
Enter a number, leave blank to not to change:<自己选一个自己喜欢的>
Enter a number, leave blank to not to change:<自己选一个自己喜欢的>
```

分别选择`背景色`和`字体`
想要继续更改挑选配色的话,继续运行脚本来再次筛选:

```bash
~/termux-ohmyzsh/install.sh
```

`exit`重启`sessions`会话生效配置，如想深入使用，请访问👉[GitHub](https://github.com/Cabbagec/termux-ohmyzsh)

### 管理员身份

#### 手机没有root

利用`proot`工具来模拟某些需要root的环境

```bash
pkg install proot
```

然后终端下面输入:

```
termux-chroot
```

即可模拟`root`环境
在这个`proot`环境下面,相当于是进入了`home`目录,可以很方便地进行一些配置.

在管理员身份下，输入

```
exit
```

可回到普通用户身份。

#### 手机已经root

安装`tsu`,这是一个`su`的termux版本,用来在termux上替代`su`:

```bash
pkg install tsu
```

然后终端下面输入:

```
tsu
```

即可切换`root`用户,这个时候会弹出`root`授权提示,给予其`root`权限,效果图如下:

在管理员身份下，输入

```
exit
```

可回到普通用户身份。

## 人生苦短、我选Python

### 安装python2.7

```
pkg install python2
```

安装完成后,使用`python2`命令启动`python 2.7.16`环境.

![](/images/articles/2019/termux/termux02.jpg)

然后输入`exit()`退出。

### 安装python3

```
pkg install python
```

安装完成后,使用`python`命令启动`python 3.7.3`环境.

![](/images/articles/2019/termux/termux03.jpg)

然后输入`exit()`退出。

### 升级pip版本

```
python2 -m pip install --upgrade pip
python -m pip install --upgrade pip
```

这两条命令分别升级了`pip2`和`pip3`到最新版.

### ipython

```
pkg install clang
pip install ipython
pip3.6 install ipython
```

ipython是什么，怎么用，不需要过多的解释。在termux里，输入：

```
ipython
ipython2
```

即可进入py2和py3的终端了。

## 什么？还有Nodejs？

### 安装nodejs

```bash
pkg install nodejs
```

## MariaDB(MySQL)安装

MariaDB数据库管理系统是MySQL的一个分支，主要由开源社区在维护，采用GPL授权许可。开发这个分支的原因之一是：甲骨文公司收购了MySQL后，有将MySQL闭源的潜在风险，因此社区采用分支的方式来避开这个风险。

### 安装mariadb

```bash
pkg install mariadb
```

### 安装基本数据

```bash
mysql_install_db
```

### 启动mariadb服务

```bash
mysqld
```

启动完成后,这个会话就一直存活,类似与debug调试一样,只有新建会话才可以操作.

### 新建termux会话

由于mariadb安装的时候没有设置密码,当前的`mariadb`密码为`空`.

```
mysql
```

直接进入`mariadb`数据库.输入`exit`退出数据库.

### 修改密码

输入一下命令,进行密码相关的安全设置:

```bash
mysql_secure_installation
```

**输入当前输入密码**
因为是`空`密码,这里默认 `回车`

```bash
Enter current password for root (enter for none):
```

**设置新密码**
这里设置新的root密码

```bash
Set root password? [Y/n] y
New password:
Re-enter new password:
```

**其他设置**
下面根据个人偏好来进行设置,没有绝对的要求

```bash
Remove anonymous users? [Y/n] Y                #是否移除匿名用户
Disallow root login remotely? [Y/n] n          #是否不允许root远程登录
Remove test database and access to it? [Y/n] n #是否移除test数据库
Reload privilege tables now? [Y/n] y           #是否重新加载表的权限
```

### 使用密码登录数据库

```mysql
$ mysql -uroot -p
Enter password:****
```

## 听说PHP是世界上最好的语言？

```bash
pkg install php
```

### 编写测试文件

在家目录下建一个`www`文件夹:`mkdir www`
在`www`文件夹下新建一个`index.php`文件,其内容为

```php
<?php phpinfo();?>
```

具体操作如下：

```
mkdir www
vim www/index.php
tree www/
```

### 启动WebServer

```
php -S 127.0.0.1:8080 -t www/
```

## nginx？

Nginx 是一个高性能的 Web 和反向代理服务器, 它具有有很多非常优越的特性.

### 安装nginx包

```bash
pkg install nginx
```

### 切换root用户

尝试下能不能解析默认的`index.html`主页
这个文件在`termux`上的默认位置为`/data/data/com.termux/files/usr/share/nginx/html/index.html`
**切换root用户**

默认的普通权限无法启动nginx,需要模拟`root`权限才可以

没有这个命令的话,手动安装`pkg install proot`包

```
termux-chroot
```

进入模拟的root环境

### 启动nginx

在模拟的root环境下启动`nginx`

```
nginx
```

`termux`上`nginx`默认的端口是`8080`
查看下`8080`端口是否在运行

```bash
netstat -an |grep 8080
```

然后手机本地直接访问:

```
http://127.0.0.1:8080
```

查看下nginx是否正常启动。

## 搭建WordPress

这里只是用`wordpress`做个典型安利来讲解,类似地可以安装`Discuz`,`DeDecms`等国内主流的PHP应用程序.

### 方法一 使用PHP内置的Web Server

确保安装并配置了`php`和`mariadb`,没有安装好的话,参考本文中具体细节部分来进行安装.
**新建数据库**

`***` 这里是mysql的密码

```sql
mysql -uroot -p*** -e"create database wordpress;show databases;"
```

**下载解压wordpress**

```bash
wget https://cn.wordpress.org/wordpress-4.9.4-zh_CN.zip
pkg install unzip
unzip wordpress-4.9.4-zh_CN.zip
```

**启动PHP Web Server**
到解压后的`wordpress`目录下,执行

```bash
cd wordpress
php -S 127.0.0.1:8080
```

然后浏览器访问`127.0.0.1:8080`开始进行`wordperss`的安装.

### 方法二 nginx+PHP+Mariadb

上面使用的方法一是直接使用PHP自带的`PHP Web Server`来运行的,看上去不够严谨~,所以这里用`nginx`来部署`wordpress`.
确保安装了`PHP`,`php-fpm`,`mariadb`,没有安装的话,参考本文中具体细节部分来进行安装和配置.
**新建数据**和**wordpress下载**参考上面的`方法一`,这里主要介绍使用`nginx`去解析`wordpress`源文件.
当前解压后`wordpress`的绝对路径是:

```bash
/data/data/com.termux/files/home/wordpress
```

**编辑nginx.conf**

```bash
vim /etc/nginx/nginx.conf
```

修改为如下几处:

```
root   /data/data/com.termux/files/home/wordpress;
        index  index.html index.htm index.php;

fastcgi_param  SCRIPT_FILENAME  /data/data/com.termux/files/home/wordpress$fastcgi_script_name;
```

![](/images/articles/2019/termux/termux04.png)

#### 启动php-fpm和nginx

在`proot`环境下面分别启动`php-fpm`和`nginx`,这里的`nginx`不在`proot`环境下启动后会出一些问题,感兴趣的可以自己去研究看看.

```bash
php-fpm
nginx
```

**安装wordpress**
浏览器访问:`http://127.0.0.1:8080/wp-admin/setup-config.php`进行安装.

同理安装其他博客也就轻而易举了,可玩性大大增加~

## 搭建hexo博客

没错还能搭建Hexo，但是我的hexo是用的电脑。但是这并不代表手机就不能玩了，你要是觉得不方便，还可以用电脑来控制。

### 安装hexo

```
npm install hexo-cli -g
```

### 部署hexo博客环境

然后建立一个目录,然后到这个目录下初始化hexo环境

```
mkdir hexoblog  #手动创建一个目录
cd hexoblog  
hexo init   #初始化hexo环境
hexo g      #生成静态文件
hexo s      #启动hexo
```

然后就跑起来一个最基本的hexo博客
关于hexo博客的详细教程,建议搭建去参考hexo官方文档,我这里重点在于 termux 其他的不作过多的叙述.

## 什么？还能玩Linux？

是的，可以玩。

### 安装步骤

1.下载安装脚本

```
wget http://funs.ml/file/atilo
```

2.设置执行权限

```
chmod +x  atilo
```

3.运行atilo

```
./atilo
```

![](/images/articles/2019/termux/termux05.png)

通过它告诉我们的用法，我们就可以来安装了，注意流量哦，记得用WiFi，土豪随意。

4.比如安装Arch试试

```
./atilo arch
```

然后稍等一会儿，安装完成之后会提示你通过startarch指令启动：

```
startarch
```

5.如果你不想要了，也可以删除

```
./atilo -r arch
```

## 内网穿透

使用`ngrok`或者`frp`可以将`Termux`上面搭建的网站映射到外网上去,`手机建站`也不是不可能了。

