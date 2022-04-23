---
title: "我和Docker的故事"
date: 2021-04-18T15:14:24+08:00
tags: ["Docker","Linux"]
categories: ["技术"]
---

![](/images/articles/2021/Docker笔记/docker.png)

### 初次接触

想起第一次用Docker的原因，当时还在读书，所以手里的海外服务器并不多。当时为了方便自己科学上网查学习资料，由于众所周知的原因，必须得用手里数量不多的服务器来代理了。但是手里又有其它服务需要跑，那么一台服务器运行包括科学上网在内的众多服务也就司空见惯了。然而令人头痛的就在这里，因为不同服务的环境问题，导致某些服务通常只能正常运行其中一个，这种情况下，我就只能进行环境隔离了。所以，首先想到的就是利用容器了，也就开始用起了Docker。

> 后记：果然懒才是第一生产力，后面直接分别写了公共脚本和自己私用的shell脚本，直接一把梭😅

### 一起成长(梦想依在，人生正当年)

> Docker: 与社区共同成长

使用Docker的过程中，其实也并不是想象的那么美好，不过好在，Docker经过这几年的迭代，变得越来越优秀，而我的技术也在稳步提升。这几年，提供容器服务的厂商，井喷式的增长，当然，也有不少被薅倒闭的，曾经的三大容器服务，如今只剩 `HeroKu` 还在继续。虽然 `Heroku` 每个月免费额度只有550小时，但是它不同地域、不同容器之间，竟然可以做负载均衡，曾经一度是科学上网“最佳实践”。

最开始，只是想着把不同服务的环境隔离开，才使用Docker。到后来，每次接触到新技术，我都会去看能不能用 Docker 运行。就好比“世界运行在 SharePoint 上一样”（doge，我绝大部分的服务，都是跑在 Docker 上的，包括开发、测试和部署环境。在确保开发与生产之间一致性的同时，我可以完全在本地进行编码和测试。

到毕业后，惊喜的发现，不少公司面试的时候，熟悉 Docker 都是一个加分项（明明只是开发，硬是被逼成了全干工程师🤣

### 我的一些Docker笔记

几乎所有主流平台，我都使用过，但限于我有60%的服务器是 `CentOS 7.x`，那就围绕这个系统来写吧。

#### CentOS 7.x && Docker

##### 安装Docker

* 卸载可能存在的旧版本

```bash
[root@besscroft ~]# sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
```

* 设置稳定的存储库并安装

```bash
[root@besscroft ~]# sudo yum install -y yum-utils

[root@besscroft ~]# sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
```

* 安装最新版本的Docker Engine和容器，或者转到下一步安装特定版本：

```bash
[root@besscroft ~]# sudo yum install docker-ce docker-ce-cli containerd.io -y
```

> 如果提示您接受 GPG 密钥，请验证指纹是否匹配 `060A 61C5 1B55 8A7F 742B 77AA C52F EB6B 621E 9F35`，如果是，则接受它。

* 设置开机启动，并启动Docker

```bash
[root@besscroft ~]# sudo systemctl enable docker
[root@besscroft ~]# sudo systemctl start docker
```

##### Docker安装配置Redis

* 拉取镜像

```bash
[root@besscroft ~]# docker pull redis:6.0.9
```

- 在合适的位置创建下面两个文件夹

```bash
[root@besscroft ~]# mkdir conf
[root@besscroft ~]# mkdir data
```

- 启动容器

```bash
[root@besscroft ~]# docker run -d -p 6379:6379 --restart always --name bess-redis \
-v /root/conf/redis.conf:/usr/local/etc/redis/redis.conf \
-v /root/data:/data \
redis:6.0.9 redis-server /usr/local/etc/redis/redis.conf \
--requirepass "password" --appendonly yes
```

> -d 在后台运行
>
> -p 6379:6379 端口映射，左边为宿主机的端口，右边为容器的端口
>
> --restart always 自动启动
>
> --privileged=true 给容器root权限
>
> -v /root/conf/redis.conf:/usr/local/etc/redis/redis.conf 挂载配置文件，冒号左边为宿主机，右边为容器
>
> -v /root/data:/data 数据目录，冒号左边为宿主机，右边为容器
>
> --requirepass 冒号里面填密码，也可以在conf里面配置
>
> --appendonly 是否开启持久化，也可以在conf里面配置

##### 启动自定义的容器

- 创建用户定义的网络

```bash
[root@besscroft ~]# docker network create somenetwork
```

- 运行镜像

```bash
[root@besscroft ~]# docker run -d --name <容器名> --net somenetwork -p<主机端口>:<容器端口> <镜像名>:<版本号> --appendonly yes
```

> 基本上大部分容器可以按照此思路来。

##### Windows 10 配置狗东自动脚本

- 下载镜像

```bash
[root@besscroft ~]# docker pull registry.cn-hangzhou.aliyuncs.com/supermanito/jd
```

- 启动容器

```bash
[root@besscroft ~]# docker run -dit \
-v D:/data/jd/scripts:/jd/scripts `# 设置活动脚本的主机挂载目录为D:/data/jd/scripts` \
-v D:/data/jd/config:/jd/config `# 设置配置文件的主机挂载目录为D:/data/jd/config` \
-v D:/data/jd/log:/jd/log `# 设置日志文件的主机挂载目录为D:/data/jd/log` \
-p 5678:5678 `# 设置端口映射，格式为 "主机端口:容器端口"，主机端口号可自定义` \
-e ENABLE_HANGUP=true `# 启用挂机功能` \
-e ENABLE_WEB_PANEL=true `# 启用控制面板功能` \
--name jd `# 设置容器名为 jd ` \
--network bridge `# 设置容器网络类型为桥接，直连主机` \
--hostname jd `# 设置容器内主机名为 jd ` \
--restart always `# 设置容器开机自启` \
registry.cn-hangzhou.aliyuncs.com/supermanito/jd
```

### 学习Docker

推荐2本书：《Docker实战》、《第一本Docker书》，我只看过《第一本Docker书》，个人感觉还不错。

然后就是官方文档了，已经够详细了，碰到问题也可以去仓库的issues看看。

### ARM Docker

![](/images/articles/2021/Docker笔记/docker-desktop-m1.jpg)

2021年4月15日，Docker能够运行在M1芯片的Macbook上面了，也预示着 ARM 架构的未来。虽然现在还需要安装 Rosetta 来进行兼容，当你想要在官网下载时，就会提醒你。V站上不少人都说，M1开发很香😯现在估计就是兼容性问题，让很多人不敢上车。

不过我这里还是忍不住吐槽一下，苹果你不出小键盘，我是绝对不会买 MacBook 的🙄反正不买也能照样用 MacOS，而且性能也不差。
