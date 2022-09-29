---
title: "Dynamic k8s 集群实现方案"
date: 2022-09-29T09:43:52+08:00
tags: ["k8s集群","Cloudflare","负载均衡","Dynamic K8s","Cloudflare Workers"]
categories: ["技术"]
---

## 前言

本文要探讨的，是一种极低成本，但是可用度较高的 K8S 集群方案，提供多种实现思路，以及部分可实现方案。我踩过一些坑，在现有资源下，其实有很多种玩法，但如果有小伙伴问：你怎么不用 xxx 家的 xx 服务啊？怎么不用 xxx 方式啊？

说到底，如果你是为了“生产级”而考虑，那确实也没问题，可靠性最重要。但我这种，贯彻的宗旨是“白嫖”，比较适合自己折腾当玩具、开源项目演示站之类的。比如生产级会在集群外配置 LoadBalancer，但是我就不会考虑，因为要花钱。而且我还得考虑，其中一个节点集群挂了，或者号没了，我能在极短的时间内切换到正常的集群上去。

## 方案

### 思路

![](/images/articles/2022/easy-k8s/001.png)

我先来解释下这张图的意思吧~我是用 [Pisces-Cloud](https://github.com/besscroft/pisces-cloud) 项目为例，因为是个前后端分离的微服务，所以前端直接放在 vercel。因为我觉得前端资源就没必要放在集群里了，而是应该放在 cdn 上，让用户能最快的访问静态资源，同时降低后端的压力（毕竟服务器只需要处理 API 请求就行了。

然后域名是放在 Cloudflare 进行解析的，目前是直接解析到集群的 Nginx 入口，再进入集群内部，通过 [Service](https://kubernetes.io/zh-cn/docs/concepts/services-networking/service/) 生成的 Virtual IP，提供一个 NodePort 来访问，Nginx 对这个 NodePort 进行反向代理。

> 注意，在这一步的 Virtual IP 需要创建无状态负载来实现，因为默认的应该是 Headless，只供集群内部使用。

k8s 里面，有多种方式可以向外暴露进行访问，比如 hostNetWork、hostPort、NodePort、LoadBalancer、Ingress 等。我之前用的是 Ingress 的域名路由方式，对 L7 进行转发，但这种方式有个小问题，配置好的域名后面还要带端口号访问，就很别扭。后来索性直接改了下 Ingress Controller 的端口，改成 80 和 443 了，那样就去掉了端口号。

这几天迁移后，就按照图片上的方式，放在集群外的那台 Nginx 上面的，证书也是在上面配置的。至于 Workers 那一步，咱们放到后面讲，目前我还没上，只提供思路，哪天有空弄好了补充完整的。

然后就是整个后端服务这边，各种配套的监控、中间件，都是在集群内部配置的。由于可以直接用 Helm，在配置一主三从的时候，反而比用 Docker 跑方便的多，毕竟改改 yaml 文件就好了嘛（🐶

### 我的实现

![](/images/articles/2022/easy-k8s/001.png)

这套玩法里面最重要的，是 Cloudflare 到集群这一块。第一张图片上 Host-0、Host-1 这些，就是不同的集群。可能有小伙伴要好奇了，为什么要弄多个单独的集群，而不是一个 master 对应多个 node 呢？我之前是这么玩的，但是我这个机器是白嫖的 Oracle Cloud 的 4C24G 的 ARM 机器，一个号只能开一个，所以走不了一套内网，而且跨地域延迟也高，时不时还调度失败。。。虽然可以通过公网把几台机器组成内网实现，但是延迟是个大问题，并且时不时丢包。

除了折磨人，可用性方面还是可以的。比如 Host-0 挂了，我直接把域名解析到 Host-1，服务就能正常使用了。数据同步，之前阿里云搞活动卖 20 一年的 RDS，拿来干这个不错，但现在已经过期了，因为要求不高，我是定时手动用 Navicat 去同步备份的。这勉强算是一种毕竟 Low 的异地容灾吧。。。宕机时间从收到告警邮件到登录 Cloudflare 切换 DNS 解析为止，花不了多久。

> 你要问我最大的缺点是什么？我觉得应该是限制于 ARM 的架构，导致基于 Jenkins 的 DevOps 系统安装困难（不是不能哈，兼容性问题需要解决。

### 基于 Cloudflare Workers 的动态负载均衡

这个思路呢，我是打算基于 [Reflare](https://reflare.js.org/) 这个项目做的。用 [Cloudflare Workers](https://workers.cloudflare.com/) 本身做反向代理，应该问题是不大的，我自己也用了很久了，而且这玩意除了反代，搭建网站，搞负载均衡本身也是支持的。

Reflare 有个实验性的功能，叫“Dynamic Route”，也就是动态路由。实际上是将路由基于 Worker KV 存取。这样的话，是不是可以对集群进行监控，然后触发制定的规则后（比如30秒一次，失败5次以上），通过 Cloudflare API 修改路由呢？（这个项目的仪表板正在开发中）这里直接用 Redis 替代 Worker KV 也是可以的。

## 最后

文章可能有点水了🙃不过这里主要还是提供一种思路，看到这篇文章的你，在生产环境千万别这么玩......如果你像看具体的操作的话，这个项目的文档里面，我后面会抽时间写完这部分。不过比较熟悉 k8s 的小伙伴，其实看完就大致明白了。

虽然俺是 Java 开发，但是万一咱下一家公司就用 k8s 呢是吧？（其实现在这家就在用）不是说要去学怎么做 k8s 开发，但是至少得了解咱们开发的程序在 k8s 上部署的大致流程。虽然生产都是运维去搞，但是咱们熟悉的话，在查问题时会更从容🙂

参考资料：

- [使用 Service 连接到应用](https://kubernetes.io/zh-cn/docs/concepts/services-networking/connect-applications-service/)
- [服务（Service）](https://kubernetes.io/zh-cn/docs/concepts/services-networking/service/)
- [跨云厂商部署 k3s 集群](https://icloudnative.io/posts/deploy-k3s-cross-public-cloud/)
- [访问集群上运行的服务](https://kubernetes.io/zh-cn/docs/tasks/access-application-cluster/access-cluster-services/)
- [关于在 Kubenretes 中暴露 Pod 及服务的五种方式](https://jimmysong.io/blog/accessing-kubernetes-pods-from-outside-of-the-cluster/)
