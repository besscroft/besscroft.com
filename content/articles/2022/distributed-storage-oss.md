---
title: "巧用阿里云 OSS 玩转免费分布式存储"
date: 2022-08-25T17:33:52+08:00
tags: ["分布式存储","阿里云OSS","阿里云OSS免流","Cloudflare"]
categories: ["技术"]
---

## 前言

说到对象存储，应该很多人都用过吧。先不说国外云厂商提供的服务，就拿国内的来说，大伙儿应该都用过阿里云 OSS。很多小伙伴选择用它来做图床、博客、甚至是拿来做冷备份（毕竟比百度网盘还是靠谱点的），不过对象存储昂贵的存储费用、流量费用、以及请求次数费用，都让不少个人用户相当头疼。这篇博客是想提供一种新思路，采用 [CloudFlare CDN](https://www.cloudflare.com/zh-cn/) 来进行 OSS 资源的数据传输，以达到免流的目的。

## 如何实现

### 介绍

先来介绍一下吧，[带宽联盟](https://www.cloudflare.com/zh-cn/bandwidth-alliance/)是 Cloudflare 推出的一项服务，由一群具有前瞻性思维的云服务和网络公司组成，致力于为共同客户降低或免除数据传输（带宽）费用。为什么能做到非常低甚至能免除成本呢？云厂商跟 Cloudflare 直接的数据传输，是通过专用网络接口 (PNI) 或专用互连的，中间不经过任何网络提供商（比如电信），既然是直连，那么就不存在 PNI 的增量成本了，自然也就便宜了。虽然阿里云不是第一批加入带宽联盟的，但是到现在为止也加入一年多了（我白嫖也一年多了🤣），并推出了 [Cloudflare+Alibaba Cloud OSS](https://www.alibabacloud.com/zh/partner/cloudflare) 的解决方案。这点还是非常良心的，虽然腾讯云后来也加入了，但是我觉得不够“清晰透明”，就一直没试过。

虽然有时候 Cloudflare 是“减速 CDN”，但是既然咱选择了白嫖，那么就要贯彻到底了🐶，对于有海外业务的小伙伴来说，这样反而能省下不少的开销呢。不像某些厂商，带宽成本极低，反而收取高昂的费用（说的就是你，AWS）。

> 网上存在一些争议，说只能阿里云国际这么玩，国区不行。。。这里贴上国区[说明文档](https://www.aliyun.com/product/news/detail?id=17749&source=5176.11533457&userCode=0a5rig7f)。而且，经我自己测试，国区也用了一年多了，确实也没花钱。

### 费用问题

![](/images/articles/2022/distributed-storage-oss/oss001.png)

上图为我国区账号的使用数据。我这里先讲清楚费用相关的问题，解决大家可能有的疑惑，以免误操作导致花钱！

* 存储费用

根据[存储费用文档](https://help.aliyun.com/document_detail/173534.html)，我们可以了解到，在海外（部分）区域，标准存储（本地冗余）容量支持使用5 GB/月的免费额度（即每月标准存储（本地冗余）容量≤5 GB时，不收取标准存储（本地冗余）容量费用）。

> 虽然不支持中国大陆免费 5GB 存储，不过并没有关系，支持的话我也不推荐你用，往下看就明白了。

* 流量费用

根据[流量费用文档](https://help.aliyun.com/document_detail/173535.html)，我们可以了解到，在海外（部分）区域，外网流出流量（oss_flow_out）支持使用5 GB/月的免费额度（即每月外网流出流量≤5 GB时，不收取外网流出流量费用）。

> 有的小伙伴可能会好奇，既然可以免流，那这 5GB 外网流出流量还有什么用呢？看我上面那张图，你会发现，外网流出流量，无法做到完全没有。我每个月都有几 KB 的漏网之鱼，这还是我用量少的情况下，用的多自然就可能漏的多。原因就是你无法把缓存命中率做到 100%，可能我设置方式不是最优，但是能做到接近 100% 也就够了。但我们还需要防范直接打到源站的流量，这 5GB 相当于一个缓冲，如何防范打到源站，我下面也会讲。

* 请求费用

根据[请求费用文档](https://help.aliyun.com/document_detail/173536.html)，算了没必要看了，请求费用是需要收费滴，不过好在便宜，几乎可以忽略不计。

> 想必有经验的小伙伴已经察觉到了，这套方案防 D 不防 C，不过方案是有平替的，只是各有优劣。但对于本身有这个需求的用户来说，确实能省钱。

* 最后，是 Cloudflare 这边的费用

对于阿里云来说，传输到 Cloudflare 是**零出口费用**。

> 有一点需要特别注意：出口传输费优惠或豁免可能需要与托管服务提供商注册，不适用于源于中国大陆的数据传输。也就是说，OSS 源站必须是海外节点，所以大陆节点没有免费 5GB 存储，其实无所谓的啦！

### 那么我该如何免流呢？

别急，咱一步步来！首先，准备一个阿里云账号，这里不管是中国区账号还是阿里云国际账号都是支持的哦！为了方便大家，我就用我的国区账号来演示吧，不过国区账号用的少，我主要还是用阿里云国际来操作的。

![](/images/articles/2022/distributed-storage-oss/oss002.png)

![](/images/articles/2022/distributed-storage-oss/oss003.png)

创建 Bucket，注意 Bucket 名称一定要取好，然后地域选择海外的，比如我这里选择的是中国香港区域。存储类型选择标准存储，读写权限选择公共读，其它的默认就行了，然后我们点击确定进行下一步。

![](/images/articles/2022/distributed-storage-oss/oss004.png)

这时候我们来到存储桶控制台，可以看到外网访问的域名，我们复制这个域名，然后到 Cloudflare 去配置解析。

![](/images/articles/2022/distributed-storage-oss/oss005.png)

这里的解析类型选择 CNAME 解析，然后填入我们刚才复制的域名，开启代理即可！

![](/images/articles/2022/distributed-storage-oss/oss006.png)

然后我们回到 OSS 控制台，找到传输管理——域名管理，绑定域名，把我们刚才配置解析的域名添加进来。

![](/images/articles/2022/distributed-storage-oss/oss007.png)

然后我们查看域名绑定配置，发现已经绑定上了。然后我们去上传一张照片。

![](/images/articles/2022/distributed-storage-oss/oss008.png)

自有域名选择自己配置好的解析域名，我们就可以看到 URL 已经变成咱们自定义的啦！

> 批量管理其实也就是域名用自定义的。

![](/images/articles/2022/distributed-storage-oss/oss009.png)

然后访问这个地址，发现可以正常访问了！

### 一些必要配置

能访问到图片了，说明已经可以正常使用了。但是，还有一些配置，我建议你加上。

![](/images/articles/2022/distributed-storage-oss/oss010.png)

防盗链、跨域设置的话，可以根据自己的需求来，这个是不强制的。

![](/images/articles/2022/distributed-storage-oss/oss011.png)

> 关于授权策略，这个一定要加，访问 [Cloudflare IP Ranges](https://www.cloudflare.com/zh-cn/ips/) 页面，将所有的 IP 都添加进来，最大程度的保证访问安全。

![](/images/articles/2022/distributed-storage-oss/oss012.png)

这里的静态页面，我建议你一定要配置上，不然请求到空资源时，请求方能看到你的源站信息，然后就能通过技术手段绕过 CDN 直接请求源站，这也是这套方案最大的风险。所以为什么我上面说我喜欢用阿里云国际账号玩这个呢，因为那是我的小号，不担心“天价账单”。

![](/images/articles/2022/distributed-storage-oss/oss013.png)

然后我们再去 Cloudflare 添加页面规则，提高缓存命中率。

## 最后

采用阿里云 OSS 这种商业方案，风险是有的。但是对于适合的用户来说，反而能省钱。而且，经我自己测试，我开了很多存储桶，一个存储桶 5GB 空间，那么我将这些存储桶管理起来，就可以当初分布式存储玩了（当然哈，并不是真正的分布式存储，区别大着呢🐶）。不过一般降低风险的平替，我们都采用 [Backblaze](https://www.backblaze.com/) ，这家的存储还是免费 10GB 呢，做个博客图床绰绰有余了。