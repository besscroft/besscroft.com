---
title: "Linux系统手动更换内核"
date: 2020-03-30T14:59:49+08:00
tags: ["Linux","CentOS","BBR"]
categories: ["技术"]
---

<center><b>从所有人的角度来看，当今的Internet并未如其所愿地移动数据。</b></center>

### 前言
> 一般而言，在云计算商那里“租”了一台服务器之后，我一般会选择`CentOS 7` 系统，所以这篇文章，就以CentOS为例(似乎有一点标题党的嫌疑？

**基本不会介绍BBR的原理，需要详细了解，[可以访问research](
https://research.google/pubs/pub45646/)，我技术并不够优秀，很难解释清楚，还请见谅！**

先讲讲BBR吧！[Wiki百科](
https://en.wikipedia.org/wiki/TCP_congestion_control#TCP_BBR)给出的解释是`
Bottleneck Bandwidth and Round-trip propagation time (BBR)` ，是Google在2016年开发的TCP拥塞控制算法(开源了)。TCP拥塞控制算法有很多，BBR是其中一种，但是由于它出色的效果，被很多人采用。至于linux内核什么时候开始原生支持的，网上的说法真的是五花八门，很多人文章感觉就是互相抄，连`2.6.*` 的说法都能蹦出来(我怀疑是一些采集站)。相对而言，很多大佬的博客文章，就比较严谨一些，基本上都是`4.9`。抱着不懂就查的态度，我去Google稍微搜了一下，不敢确定是不是一定是对的。[Wiki百科](
https://zh.wikipedia.org/wiki/Linux%E5%86%85%E6%A0%B8#4.x.y%E7%89%88%E6%9C%AC%E7%B3%BB%E5%88%97)的详细说明，可以找到如下一条说明：

| 内核 | 初始发行日期 | 最新版本 | 维护者 |支持状态  | 备注 |
| --- | --- | --- | --- | --- | --- |
| 4.9 | 2016年12月11日 | 4.9.148 | 葛雷格·克罗哈曼 | 长期支持版本，从2016年12月至2023年1月 | 开始支持 BBR congestion control。 |

### 更换/更新内核
这时候我们来更换内核吧，这里我的测试机器是阿里云国际香港ECS。
* 当前的 Kernel 版本

```sh
$ uname -r
```
![](/images/articles/2020/centoskernrlup/centoskernrlup01.png)

* 更新软件包

```sh
$ yum update -y
```
#### ELRepo项目
这里我们需要用到[Repo项目](
https://elrepo.org/tiki/tiki-index.php)Enterprise Linux软件包的RPM存储库。
* 导入ELRepo公钥

```sh
$ rpm --import https://www.elrepo.org/RPM-GPG-KEY-elrepo.org
```
* 安装ELRepo的 yum 源到系统

```sh
$ yum install https://www.elrepo.org/elrepo-release-7.0-4.el7.elrepo.noarch.rpm
```
#### 安装新内核啦
* 查看ELRepo仓库下，在当前系统支持的内核包
ELRepo会提供[he Linux Kernel Archives](
https://www.kernel.org/)用资源。

```sh
$ yum --disablerepo="*" --enablerepo="elrepo-kernel" list available
```
* 安装最新的主线稳定内核

```sh
$ yum --enablerepo=elrepo-kernel install kernel-ml
```
#### 更改grub配置
在安装完新的 Kernrl 之后，系统是不会帮你切换到新内核的，重启也不行，需要我们自己设置，将新内核设置为默认启动选项。
* 查看所有的 Kernel

```sh
$ rpm -qa | grep kernel
```
![](/images/articles/2020/centoskernrlup/centoskernrlup02.png)

* 查看当前正在使用的 Kernrl

```sh
$ uname -r
```
![](/images/articles/2020/centoskernrlup/centoskernrlup03.png)

* 查看 Kernel 启动顺序

```sh
$ awk -F\' '$1=="menuentry " {print i++ " : " $2}' /etc/grub2.cfg
```
![](/images/articles/2020/centoskernrlup/centoskernrlup04.png)

我们可以看到，安装完之后，内核没有切换过去，通过查看得知，新安装的内核位于第一个位置，标记为 `0`。这是我们需要修改`/etc/default/grub`文件，以便于让系统在启动时让新内核成为默认选项。
```sh
$ vim /etc/default/grub
```
![](/images/articles/2020/centoskernrlup/centoskernrlup05.png)

需要把图中的`GRUB_DEFAULT=saved` 改成 `GRUB_DEFAULT=0` ，然后保存。当然，你也可以在安装其它版本的Kernel之后，更改`GRUB_DEFAULT`的值。

* 重新生成 Kernrl 配置

```sh
$ grub2-mkconfig -o /boot/grub2/grub.cfg
```
* 然后重启机器

```sh
$ reboot
```
* 重启完毕后，检查是否成功

```sh
$ uname -r
```
![](/images/articles/2020/centoskernrlup/centoskernrlup06.png)

可以看到，已经成功啦！

### 删除多余内核
你可以在安装新内核之后，选择把其它内核删掉，但是请注意**千万不要删除正在运行的那个内核！！！**
* 查看所有的 Kernel

```sh
$ rpm -qa | grep kernel
```
* 删除你想删除的内核

```sh
$ yum remove kernel-[old_kernel_version]
# 举个例子
$ yum remove kernel-3.10.0-957.el7.x86_64
```
* 重新生成 Kernrl 配置

```sh
$ grub2-mkconfig -o /boot/grub2/grub.cfg
```
### 开启BBR
整了这么半天，除了更新下内核，另一个重要的事情就是需要开启BBR了。
* 编辑`/tec/sysctl.conf`文件

```sh
$ vim /etc/sysctl.conf
```
* 添加如下内容：

```
net.core.default_qdisc=fq
net.ipv4.tcp_congestion_control=bbr
```
* 或者使用tee命令重定向追加到`/tec/sysctl.conf`文件中：

```sh
$ echo 'net.core.default_qdisc=fq' | sudo tee -a /etc/sysctl.conf
$ echo 'net.ipv4.tcp_congestion_control=bbr' | sudo tee -a /etc/sysctl.conf
```
* 从配置文件“/etc/sysctl.conf”加载内核参数设置

```sh
$ sysctl -p
```
* 验证是否成功(是否开启了BBR

```sh
$ sysctl net.ipv4.tcp_congestion_control
# 显示如下内容即可：
# net.ipv4.tcp_congestion_control = bbr
$ sysctl net.ipv4.tcp_available_congestion_control
# 显示如下内容即可：
# net.ipv4.tcp_available_congestion_control = reno cubic bbr
```
* 查看内核模块是否加载

```sh
$ lsmod | grep bbr
```
![](/images/articles/2020/centoskernrlup/centoskernrlup07.png)

到这里，基本上就成功了！
### 最后
其实大家觉得这样很麻烦，也可以去网上找一键脚本。但是我觉得这并不是很好的习惯，不能对脚本产生过度依赖，除非你是买一台vps小鸡当玩具玩，否则千万不要用脚本，更不要在生产环境用这种一键脚本。很多人连一键脚本的内容都没瞟一眼，在搜索引擎找到后，直接就运行，造成重启后开不了机的，也大有人在！
**我不是说不能用所谓的一键脚本，我也经常用。我的观点是，不应该对一键脚本产生过度依赖，同时尽量不要在生产环境用！**
如果可以，也可以看一看哪些写的比较好的脚本，多研究研究也是不错的，“先懂后懒”嘛！