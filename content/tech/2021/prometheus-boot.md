---
title: "普罗米修斯の初体験"
date: 2021-12-01T18:30:16+08:00
tags: ["Prometheus","普罗米修斯"]
categories: ["技术"]
---

## 前言

为什么我会选择普罗米修斯(Prometheus)？Prometheus 是按照 Google SRE 运维之道的理念构建的，具有实用性和前瞻性。同时也是基于 Go 语言开发的，性能好，安装部署也简单，甚至跨平台（包括 arm 平台）。作为对服务基础和业务监控，Prometheus 是一个非常好的选择。

## 什么是普罗米修斯？

咱们这里引用官方的术语：
Prometheus 是一个开源系统监控和警报工具包，它可以收集系统信息，并将其发送到一个或多个监控中心。Prometheus 将其指标收集并存储为时间序列数据，即指标信息与记录它的时间戳一起存储，以及称为标签的可选键值对。

这里引入官网的图，说明 Prometheus 的架构及其一些生态系统组件：

![](/images/tech/2021/prometheus-boot/prometheus001.png)

## 安装

安装方式有很多，二进制包或者 Docker 都可以，这里我们选择二进制包。

### 安装环境

![](/images/tech/2021/prometheus-boot/prometheus002.png)

这里俺用的是 Ubuntu 20.04，别问我为啥，主要是我内存最大的机器就是这台了（24G 内存），只不过，它是 arm64 架构的，所以下面的教程是运行在 arm64 架构的服务器上面的，当然，你也可以用本教程在 amd64 架构下安装，只有一些细微的区别，咱们下面会讲到。

### 安装 Prometheus

#### 下载 Prometheus

你可以去官网，或者 GitHub 的[发布页面](https://github.com/prometheus/prometheus/releases)下载安装包，这里我下载的是 GitHub 仓库的包。

 * 如果你是 amd64 架构的服务器

```bash
wget https://github.com/prometheus/prometheus/releases/download/v2.31.0/prometheus-2.31.0.linux-amd64.tar.gz
tar xfz prometheus-2.31.0.linux-amd64.tar.gz
sudo cp prometheus-2.31.0.linux-amd64/prometheus /usr/local/bin/
sudo cp prometheus-2.31.0.linux-amd64/promtool /usr/local/bin/
```

 * 如果你是 arm64 架构的服务器

```bash
wget https://github.com/prometheus/prometheus/releases/download/v2.31.0/prometheus-2.31.0.linux-arm64.tar.gz
tar xfz prometheus-2.31.0.linux-arm64.tar.gz
sudo cp prometheus-2.31.0.linux-arm64/prometheus /usr/local/bin/
sudo cp prometheus-2.31.0.linux-arm64/promtool /usr/local/bin/
```

> 最主要的差异，就是要下载不同的包，后面的配置几乎相同

#### 配置 Prometheus

 * 检查

```bash
prometheus --version
```

执行命令，出现如下图所示，就成功了！

![](/images/tech/2021/prometheus-boot/prometheus003.png)

我们在刚才解压后的文件夹下面，可以找到一个子目录 `prometheus` ，然后可以找到一个配置文件 `prometheus.yml` 。咱们现在需要把 `prometheus.yml` 这个初始配置文件复制到 `/etc/prometheus` 目录下，然后简单配置就可以启动啦。当然，你也可以按照自己的需求来配置，具体可以参考官方的[配置文档](https://prometheus.io/docs/prometheus/latest/configuration/configuration/)。

```bash
sudo mkdir -p /etc/prometheus
sudo cp prometheus.yml /etc/prometheus/
```

 * 默认的部分配置如下：

```yaml
scrape_configs:
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]
```

我们可以看到端口是 `9090` ，你可以按需求改为其它的。

#### 启动 Prometheus

接下来咱们启动看看

```bash
prometheus --config.file "/etc/prometheus/prometheus.yml"
```

 * 如果发生了异常，则可以使用 `prometool` 工具来检查你的配置文件。

```bash
promtool check config "/etc/prometheus/prometheus.yml"
```

如果输出如下提示，说明没问题了！

```
Checking /etc/prometheus/prometheus.yml
  SUCCESS: 0 rule files found
```

### 配置 service 方式运行 Prometheus

 * 新建一个 `service` 文件

```bash
sudo vim /etc/systemd/system/prometheus.service
```

 * 编辑如下内容保存即可！

```bash
[Unit]
Description=prometheus

[Service]
User=root
ExecStart=prometheus --config.file "/etc/prometheus/prometheus.yml"
Restart=on-abort

[Install]
WantedBy=multi-user.target
```

 * 设置开机启动

```bash
sudo systemctl enable prometheus
```

 * 启动 Prometheus

```bash
sudo systemctl start prometheus
```

这样便大功告成啦！

### 配置 HTTPS 和反向代理

如果你的服务器是 HTTPS 的，那么需要配置 HTTPS 的证书和私钥，这里俺使用的是 Let's Encrypt 的证书，可以去官网下载。具体如何操作就不说了，如果你不会，应该去学习如何使用 Nginx，并学会配置 HTTPS 证书。

 * 配置 Nginx 反向代理

这里我放出我的配置吧，你可以根据你的需求，参考使用：

```
location /
{
    proxy_pass http://127.0.0.1:9090;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header REMOTE-HOST $remote_addr;
    
    add_header X-Cache $upstream_cache_status;
    
    #Set Nginx Cache
    add_header Cache-Control no-cache;
}
```

> Prometheus 启动监听在本地回环地址 localhost:9090 ，所以公网是无法直接访问的，我也不太建议你开放防火墙，这样能带来一定的安全保护。

## 预览

![](/images/tech/2021/prometheus-boot/prometheus004.png)

这时候咱们访问域名，就能看到页面啦！

> 这里提示，我这不是生产环境，只是拿来练手学习，所以无所谓，生产环境不建议这么做！可以通过 ssh 端口转发方式实现远程访问。