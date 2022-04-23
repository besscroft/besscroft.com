---
title: "【玩转腾讯云】用轻量应用服务器搭建网站"
date: 2020-06-29T20:29:56+08:00
tags: ["玩转腾讯云","Linux","博客"]
categories: ["技术"]
---

## 前言

不少小伙伴应该知道，腾讯云正在内测轻量应用服务器，而且马上就要公测了！我提前申请到了一台内测机器，那就来告诉大家，在公测后购买腾讯云轻量应用服务器之后如何玩转它吧，比如搭建静态或者动态网站！

## 什么是轻量应用服务器 Lighthouse

- 这里是文档上的介绍，让我们先了解下！

[轻量应用服务器](https://cloud.tencent.com/product/lighthouse)（Lighthouse）是一种易于使用和管理、适合承载轻量级业务负载的云服务器，能帮助个人和企业在云端快速构建网站、博客、电商、论坛等各类应用以及开发测试环境，并提供应用部署、配置和管理的全流程一站式服务，极大提升构建应用的体验，是您使用腾讯云的最佳入门途径。

## 购买

先去[控制台](https://console.cloud.tencent.com/lighthouse/instance/index)找到轻量应用服务器，然后按需求购买。可以选择不同的地域、镜像、套餐、时长和数量等。这里我申请到的内测机型是【上海区域、1核2G、系统盘40G，峰值5Mbps、1000G流量的套餐】。

## 使用

![](/images/articles/2020/lighthouse/lighthouse001.png)

我们购买成功后，来到轻量应用服务器控制台，打开详情页面后，需要先【重置密码】或者【绑定密钥】。由于是作演示用，所以我就选择了【重置密码】。

![](/images/articles/2020/lighthouse/lighthouse002.png)

然后打开XShell 6，新建会话，自定义名称，然后在【主机】里面输入【IP地址】。然后进行连接，并输入用户名和密码，连上去之后如图所示。

![](/images/articles/2020/lighthouse/lighthouse003.png)

## 搭建网站

这里我推荐使用BT面板，因为我这台轻量服务器的系统是CentOS，所以就需要自己安装了，当然，你也可以在控制台直接更换成BT面板的应用镜像，非常方便有木有！！！

- 更新系统和软件包

```bash
yum update -y
```

- 安装一些软件包

```bash
yum install -y curl vim wget unzip git nano
```

- 安装BT面板

```bash
yum install -y wget && wget -O install.sh http://download.bt.cn/install/install_6.0.sh && sh install.sh
```

![](/images/articles/2020/lighthouse/lighthouse004.png)

中间会弹出一个提示，输入y，并回车，之后等待一会儿就好啦！

![](/images/articles/2020/lighthouse/lighthouse005.png)

我们可以看到，安装速度真的是很快啊，上面的Bt-Panel、username和password分别对应公网访问地址、用户名和密码。

![](/images/articles/2020/lighthouse/lighthouse006.png)

然后我们需要去控制台的防火墙，开放8888端口。

![](/images/articles/2020/lighthouse/lighthouse007.png)

进入到BT面板之后，就安装推荐的LNMP即可，具体的版本其实可以根据自己的实际情况来看。

![](/images/articles/2020/lighthouse/lighthouse008.png)

然后等待安装就行了。

### 搭建静态网站

![](/images/articles/2020/lighthouse/lighthouse009.png)

安装好之后，选择左边的【网站】，然后点击【添加站点】，如上图，在域名这一栏，填上你的域名。当然，得先去把域名解析到当前的ip地址，而且还得先备案哦，在腾讯云备案，还是比较方便的。

![](/images/articles/2020/lighthouse/lighthouse010.png)

然后在最右边，选择刚创建好的网站的【设置】。

![](/images/articles/2020/lighthouse/lighthouse011.png)

然后可以一键申请SSL证书，还是比较方便的，其它的就按照自己的需求来。

![](/images/articles/2020/lighthouse/lighthouse012.png)

在【文件】里面，可以管理和上传你自己的代码和静态文件资源。

到这里，没啥问题的话，网站就已经可以访问了！

### 搭建动态网站

![](/images/articles/2020/lighthouse/lighthouse013.png)

BT面板也可以搭建动态网站，你可以按照刚才搭建静态网站的方法，上传自己的安装包，或者去【软件商店】安装【宝塔一键部署源码1.1】。

![](/images/articles/2020/lighthouse/lighthouse014.png)

安装好之后，可以用这个插件一键部署源码，比如说我们要安装wordpress博客系统，找到之后，选择一键部署就行了。

![](/images/articles/2020/lighthouse/lighthouse015.png)

然后在相应的空里面填就好了，域名还是一样，要提前解析好，其他的一般默认即可。

![](/images/articles/2020/lighthouse/lighthouse016.png)

部署好之后，访问站点，上面的数据库账号资料后面会用的到。

![](/images/articles/2020/lighthouse/lighthouse017.png)

点击【现在就开始】，进入下一步！

![](/images/articles/2020/lighthouse/lighthouse018.png)

在这一步，需要填好刚才准备的信息，然后点击提交！

![](/images/articles/2020/lighthouse/lighthouse019.png)

进行安装！

![](/images/articles/2020/lighthouse/lighthouse020.png)

然后根据自己的情况，填上相应的信息，注意密码不要用弱密码，我这里只是为了演示！

![](/images/articles/2020/lighthouse/lighthouse021.png)

成功之后，登录就能进到后台啦！

![](/images/articles/2020/lighthouse/lighthouse022.png)

然后就自己去探索功能吧！

![](/images/articles/2020/lighthouse/lighthouse023.png)

至此，动态网站已经搭建完成！

## 轻量服务器的应用场景

腾讯云轻量应用服务器，除了可以搭建网站，还可以干很多事情哦！

主要的应用场景：

- 网站搭建
- Web 应用服务
- 快速搭建开发测试环境
- 云端学习环境