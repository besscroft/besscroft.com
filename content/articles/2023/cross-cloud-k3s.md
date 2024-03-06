---
title: "基于 K3s + Kilo 的跨云 Kubernetes 集群"
date: 2023-12-19T23:55:00+08:00
tags: ["Kubernetes","技术","K3s","Kilo","跨云 Kubernetes 集群"]
categories: ["技术"]
---

## 前言

自从~~白嫖~~了 Oracle Cloud 的云服务之后，一直使用的 24 G 大内存云服务器跑的 Kubernetes，也有 2 年多了吧？（记不清了）上一版本的方案，可以看我这篇文章👉[Dynamic k8s 集群实现方案](https://blog.besscroft.com/articles/2022/easy-k8s/)

至于为啥我要更换方式呢？主要还是要部署的东西日渐增加，内存是越来越不够了。原先的方案是相当于备份，假设当前使用的集群挂了，那么直接指向另一个集群就能马上恢复服务，那么服务不可用的时间，主要还是 DNS 解析变更时间。（这里放上之前的图片，便于理解）

![](/images/articles/2022/easy-k8s/001.png)

今天要聊的新的架构，则是下图所示：

![](/images/articles/2023/cross-cloud-k3s/001.png)

虽然依旧不用担心数据丢失问题（数据库和部分存储全部在集群外部），但是相比原来的可用性方面略有下滑，毕竟集群从原来的多个，变成了现在的一个。但好处是获得了更大内存的集群，这样就可以充分利用原来因为资源不够而不太好上的一些功能，比如蓝绿部署、金丝雀发布，以及用来模拟正式环境的流量镜像（Traffic Mirroring）功能，这样我在本地开发时，也有足够的内存来通过 [kt-connect](https://github.com/alibaba/kt-connect) 在集群内调试服务了。

而这次我选择了更轻量级的 K8S 版本——K3s，也是想节约一下资源。这样也正好能接入更多我在其它云厂商的大大小小的服务器了，官方的要求是最低 1 核 512 MB 内存。当然，我们也可以部署[高可用 K3s](https://docs.k3s.io/zh/architecture#%E9%AB%98%E5%8F%AF%E7%94%A8-k3s)，本文为了方便演示，就用一个控制平面节点，两个工作节点来演示。

## 集群部署

期待的架构模样已经描述好了，接下来我们开始实践部署！

### 部署前准备

机器环境如下，准备了 3 台相同配置，但分别在 3 个不同国家/地区的云服务器，且无法通过内网连接，只有公网 IP：

```
OS: Debian GNU/Linux 11 (bullseye) aarch64
Host: KVM Virtual Machine virt-4.2
Kernel: 5.10.0-26-arm64
Shell: bash 5.1.4
CPU: (4)
GPU: 00:01.0 Red Hat, Inc. Virtio GPU
Memory: 24003MiB
```

首先，需要更改每一台主机名称：

```bash
hostnamectl set-hostname xxx
```

3 台主机更改完毕后，名称为：

```
kube-japan // 主节点
kube-seoul
kube-chuncheon
```

其次，我们需要在每台机器上安装 wireguard：

```bash
apt-get install wireguard -y
```

### 主节点部署

首先我们需要在主节点上安装一个功能齐全的 Kubernetes 集群，它包括了托管工作负载 pod 所需的所有数据存储、control plane、kubelet 和容器运行时组件。

```bash
curl -sfL https://get.k3s.io | K3S_CLUSTER_INIT=true \
INSTALL_K3S_EXEC="server" \
INSTALL_K3S_CHANNEL=v1.27.8+k3s2 \
sh -s - --node-label "topology.kubernetes.io/region=japan" \
--node-label "master-node=true" \
--tls-san <主节点公网IP> \
--advertise-address <主节点公网IP> \
--flannel-backend none \
--kube-proxy-arg "metrics-bind-address=0.0.0.0"
```

[kubeconfig](https://kubernetes.io/zh-cn/docs/concepts/configuration/organize-cluster-access-kubeconfig/) 文件会被写入到 `/etc/rancher/k3s/k3s.yaml`，由 K3s 安装的 kubectl 将自动使用该文件。

> `K3S_CLUSTER_INIT=true` 将安装为集群模式。
>
> `INSTALL_K3S_EXEC="server"` 表示安装为 Server 节点。
>
> `INSTALL_K3S_CHANNEL=v1.27.8+k3s2` 表示安装的版本。
>
> `--node-label "topology.kubernetes.io/region=japan"` 设置节点的 label。
>
> `--node-label "master-node=true"` 设置为主节点。
>
> `--tls-san` 和 `--advertise-address` 要填主节点的公网 IP。
>
> `--flannel-backend none` 因为我们等会儿要用 Kilo，所以这里要关闭 fiannel CNI。
>
> 详细请参考[环境变量](https://docs.k3s.io/zh/reference/env-variables)

- 查看节点状态：

```bash
kubectl get node
```

节点是 `NotReady` 状态，别急，我们安装了 Kilo 就行了。

### install Kilo!

- 首先定义主节点的网络拓扑：

```bash
kubectl annotate nodes kube-japan kilo.squat.ai/location="japan"
kubectl annotate nodes kube-japan kilo.squat.ai/force-endpoint="<公网IP>:51820"
kubectl annotate nodes kube-japan kilo.squat.ai/persistent-keepalive=20
```

> `location` 定义节点的位置，Kilo 将尝试从 [topology.kubernetes.io/region](https://kubernetes.io/zh-cn/docs/reference/labels-annotations-taints/#topologykubernetesioregion) 节点标签推断每个节点的位置。 
>
> `force-endpoint` 定义节点的端点，因为咱们的服务器位置位于不同的云提供商或不同的专用网络中，则端点的 `host` 部分应该是可公开访问的 IP 地址或解析为公共 IP 的 DNS 名称，以便其它位置可以将数据包路由到它。 
>
> `persistent-keepalive` 持久保活注释参数配置，想了解可以看 [WireGuard 文档](https://www.wireguard.com/quickstart/#nat-and-firewall-traversal-persistence)

- 然后安装 Kilo：

```
kubectl apply -f https://raw.githubusercontent.com/squat/kilo/main/manifests/crds.yaml
wget https://raw.githubusercontent.com/squat/kilo/main/manifests/kilo-k3s.yaml
```

注意 `kilo-k3s.yaml` 文件，咱们需要添加以后参数，这里我们采用的是 [Full Mesh](https://kilo.squat.ai/docs/topology/#full-mesh) 模式：

```yaml
- name: kilo
  image: squat/kilo
  args:
    - --kubeconfig=/etc/kubernetes/kubeconfig
    - --hostname=$(NODE_NAME)
    - --mesh-granularity=full   # 添加这一行
  env:
    - name: NODE_NAME
      valueFrom:
        fieldRef:
          fieldPath: spec.nodeName
```

- 然后再执行：

```bash
kubectl apply -f kilo-k3s.yaml
```

然后咱们应该可以看到，节点状态变为 `Ready` 了。

### 部署 K3s Agent 节点

首先咱们现在 Server 节点上获取 `server token`：

```
cat /var/lib/rancher/k3s/server/node-token
```

- 同样的，在 node 节点上执行命令：

```bash
curl -sfL https://get.k3s.io  | K3S_URL=https://<主节点公网IP>:6443 \
K3S_TOKEN=<主节点 server token> \
INSTALL_K3S_EXEC="agent" \
INSTALL_K3S_CHANNEL=v1.27.8+k3s2 \
sh -s - --node-label "topology.kubernetes.io/region=chuncheon" \
--node-label "worker-node=true" \
--kube-proxy-arg "metrics-bind-address=0.0.0.0"
```

> 这里的参数不需要过多解释了，可以往上翻翻。

- 然后在主节点查看是否加入进来：

```bash
kubectl get node
```

- 在主节点上添加网络拓扑定义：

```bash
kubectl annotate nodes kube-chuncheon kilo.squat.ai/location="chuncheon"
kubectl annotate nodes kube-chuncheon kilo.squat.ai/persistent-keepalive=20
```

> 另一台也是同样的操作，注意参数的值略有不同！！！

至此，我们就安装配置完整个集群了，然后我们查看整个集群的网络拓扑图：

```bash
kgctl graph | circo -Tsvg > cluster.svg
```

![](/images/articles/2023/cross-cloud-k3s/002.png)

## 集群面板部署

现在咱们已经搞定了集群了，再来部署集群的 Web 面板吧，这里我选了 UI 好看点的 [KubeSphere](https://github.com/kubesphere/kubesphere)。

### 安装 KubeSphere

- 执行安装命令：

```bash
kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.4.1/kubesphere-installer.yaml

kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.4.1/cluster-configuration.yaml
```

- 查看安装日志：

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l 'app in (ks-install, ks-installer)' -o jsonpath='{.items[0].metadata.name}') -f
```

安装完毕后，访问使用 IP 端口的方式访问面板，可以看到集群节点状态：

![](/images/articles/2023/cross-cloud-k3s/003.png)

## 集群公网访问

既然咱们集群配置好了，自然是把面板配置成域名访问最好不过了。这里就要借助 Kilo 和 [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) 来完成了，对于 Ingress-Nginx Controller 的控制，我们采用 [cloudflare-tunnel-ingress-controller](https://github.com/STRRL/cloudflare-tunnel-ingress-controller) 来实现。

> 你至少得会用 Cloudflare 吧，既然都会玩 K8S 了，这对你来说应该不成问题。

### 安装

- 首先添加 Helm 仓库：

```bash
helm repo add strrl.dev https://helm.strrl.dev
helm repo update
```

也可以直接用 KubeSphere 操作，见下图：

![](/images/articles/2023/cross-cloud-k3s/004.png)

- 然后安装：

```bash
helm upgrade --install --wait \
  -n cloudflare-tunnel-ingress-controller --create-namespace \
  cloudflare-tunnel-ingress-controller \
  strrl.dev/cloudflare-tunnel-ingress-controller \
  --set=cloudflare.apiToken="<cloudflare-api-token>",cloudflare.accountId="<cloudflare-account-id>",cloudflare.tunnelName="<your-favorite-tunnel-name>" 
```

> - `cloudflare-api-token` 你得自己去 Cloudflare 配置令牌，记得要下面三个权限：
>
>   - `Zone:Zone:Read`
>
>   - `Zone:DNS:Edit`
>
>   - `Account:Cloudflare Tunnel:Edit`
>
> - `cloudflare-account-id` 你用的那个域名的 `账户 ID`，也是在 Cloudflare 控制台获取。
> - `your-favorite-tunnel-name` 这个是通道的名称。

安装完成后，你应该能看到下面的 Pod：

![](/images/articles/2023/cross-cloud-k3s/005.png)

### 配置应用路由

接下来，咱们只需要创建对应的 Ingress，将面板通过 Cloudflare-tunnel 公开到互联网就好了：

```yaml
kind: Ingress
apiVersion: networking.k8s.io/v1
metadata:
  name: dashboard-via-cf-tunnel
  namespace: kubesphere-system
  finalizers:
    - strrl.dev/cloudflare-tunnel-ingress-controller-controlled
spec:
  ingressClassName: cloudflare-tunnel
  rules:
    - host: example.com # 你要公开的域名
      http:
        paths:
          - path: /*
            pathType: Prefix
            backend:
              service:
                name: ks-console # 指定的 Service 名称
                port:
                  number: 80 # 指定的端口
```

如果你懒得创建 yaml 来执行，也可以：

```bash
kubectl -n kubesphere-system \
  create ingress dashboard-via-cf-tunnel \
  --rule="example.com/*=ks-console:80"\
  --class cloudflare-tunnel
```

然后我们就可以在 Cloudflare 的控制台看到对应的隧道里面多了一条 `Public Hostname` 数据，说明已经成功了，现在可以直接通过域名访问了。

![](/images/articles/2023/cross-cloud-k3s/006.png)

> 通过 Cloudflare-tunnel 来访问网站，可以搭配 Zero Trust 来实现网关配置（DNS、防火墙策略、流量出口策略等），配置身份提供商组、IP、设备、证书或服务令牌访问，以及监控等功能。

## 最后

虽然这套方案可以通过一系列措施来保证高可用性，但我还是决定将数据存储配置成外置存储，不放在集群内部。这样一旦集群遇到问题，我就可以通过 YAML 文件在短时间内恢复，前提是数据库部分也得可靠。

参考资料：

- [K3s](https://docs.k3s.io/zh/)
- [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)
- [Dynamic k8s 集群实现方案](https://blog.besscroft.com/articles/2022/easy-k8s/)
- [cloudflare-tunnel-ingress-controller](https://github.com/STRRL/cloudflare-tunnel-ingress-controller)
- [NAT and Firewall Traversal Persistence](https://www.wireguard.com/quickstart/#nat-and-firewall-traversal-persistence)
- [Ingress](https://kubernetes.io/zh-cn/docs/concepts/services-networking/ingress/)
- [Kilo](https://kilo.squat.ai/)
