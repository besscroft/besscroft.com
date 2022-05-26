---
title: "权限模型之基于角色的访问控制（RBAC）"
date: 2022-03-30T15:54:51+08:00
categories: ["技术"]
tags: ["权限模型","RBAC","Kubernetes 中的 RBAC","基于角色的访问控制"]
---

## 前言

在搞明白 RBAC 这个访问控制模型之前，我们得先了解下，信息安全中的一些基本的概念，从而了解 RBAC 属于哪一个环节。

- 认证（Authentication）：系统识别操作用户的真实身份，也就是弄清楚操作用户到底是谁。
- 授权（ Authorization）：系统控制一个用户操作数据的权限，也就是控制操作用户在系统中能干什么。
- 凭证（Credential）：系统承载和用户的认证授权信息，你需要一个凭证，来证明你就是你，然后就可以干允许你干的事了。
- 机密（Confidentiality）：系统确保凭证或数据传递与存储的隐秘性，避免被篡改或者泄露。
- 传输（Transport Security）：确保系统和用户之间的网络传输信息无法被第三方窃听、篡改。
- 验证（Verification）：系统确保提交到每项服务中的数据是合乎规则的，乱填一些数据，是可能导致系统安全问题的。

那么 RBAC 是解决什么问题的呢？也就是“**谁**（User）拥有什么**权限**（Authority）去**操作**（Operation）哪些**资源**（Resource）”，所以本质上属于一种授权（访问控制）行为。

## RBAC

### 什么是 RBAC？

基于角色的访问控制（Role-based access control，简称 RBAC），指的是通过用户的角色（Role）授权其相关权限，这实现了更灵活的访问控制，相比直接授予用户权限，要更加简单、高效、可扩展。

![](/images/articles/2022/just-rbac-it/rbac01.png)

### 怎么理解 RBAC？

![](/images/articles/2022/just-rbac-it/rbac02.png)

这里我画了一张图，图中的贝丝是管理员，所以他具备了对资源 A 和资源 B 的可读、可写资源。而莫斯作为开发者，他对资源 A 具有可读、可写权限，但是对资源 B 只有可读权限。这样我们就满足了“**谁**（User）拥有什么**权限**（Authority）去**操作**（Operation）哪些**资源**（Resource）”的行为。但是显然有个不好的地方，让我们接着往下说。

![](/images/articles/2022/just-rbac-it/rbac03.png)

这时来了一个新的开发人员塔斯，想加入我们一起开发，由于他的职责和莫斯是一样的，所以我们给他分配了同样的权限。细心的你可能已经发现了，给莫斯和塔斯分配权限是一个重复的步骤，看上去并没有什么不妥。

那么我们要想象一种糟糕的场景，如果我们需要对开发人员分配许多的权限，而且开发人员同时又有很多该怎么办？想必贝丝管理员这时一定在抱怨了！🥲如果我们这时要删除所有开发人员对资源 A 的可写权限，也需要一个个更改，这简直坏透了🤬

![](/images/articles/2022/just-rbac-it/rbac04.png)

这时我们可以考虑用一种通用配置的思路，而不是直接给用户分配这些权限。如图所示，我们只需要给贝丝分配 `admin` 配置，给莫斯和塔斯分配 `dev` 配置即可。如果下次再有小伙伴要参与进来，直接分配给他 `dev` 配置就可以了。

![](/images/articles/2022/just-rbac-it/rbac05.png)

我们在系统中通常把这些配置文件叫做“角色”，这也就是基于角色的访问控制的方式，还是很好理解的，对吧？

### 软件开发中的 RBAC

![](/images/articles/2022/just-rbac-it/rbac06.png)

在软件开发中，普遍采用的 RBAC 模型，是 `NIST RBAC` 模型。咱们上面说的，为了避免对每一个用户单独设置权限，以及避免过程中容易产生的错误，将权限从直接绑定用户，改为了绑定“角色”。将权限控制变为了对“**角色**拥有操作哪些**资源**的**许可**”。

这里的“许可”可以理解为抽象权限的具象化体现，角色解耦了用户和权限之间的多对多关系，而许可是用来解耦操作和资源之间的多对多关系的。比如对资源 A 可以有增、删、改、查等操作。

> 注：1996年，莱威·桑度（Ravi Sandhu）等人在前人的理论基础上，提出以角色为基础的访问控制模型，故该模型又被称为RBAC96。之后，美国国家标准局重新定义了以角色为基础的访问控制模型，并将之纳为一种标准，称之为NIST RBAC。

在软件开发中，如果要实现 RBAC 模型，则需要实现它的几个核心概念：

- 用户：访问系统的任意用户。
- 角色：角色是一个逻辑集合，你可以授权一个角色某些操作权限，然后将角色授予给用户，被授予角色的用户将会继承这个角色中的**所有**权限。
- 资源：应用系统中的实体对象一般定义为资源，比如订单、商品、文档等等，而每种资源都可以定义多个操作，比如商品有查看、编辑、上架、删除操作；
- 授权：把某类（个）资源的某些（个）操作授权给角色**或者**用户。

![](/images/articles/2022/just-rbac-it/rbac07.png)

注意“授权”这一项，我给“或者”加粗了，为什么这里用“或者”呢。因为有些软件开发框架在设计时，并没有完全遵循 RBAC 来设计，比如 [Spring Security](https://spring.io/projects/spring-security)...不过并不是说这样设计不好，首先怎么用是用户自己的事，可以完全遵守 RBAC 来用，而 Authority 在某些场景下，它也是适用的。

### 操作系统中的 RBAC

在 Linux/Unix 系统中，RBAC 用于控制用户对通常仅限于超级用户的任务的访问。通过对进程和用户应用安全属性，RBAC 可以向多个管理员分派超级用户功能。进程权限管理通过特权实现。用户权限管理通过 RBAC 实现。

我们都知道，root 用户在 Linux 系统中，是具有最高权限的，是基于叫做超级用户模型的（管理员对系统要么具有全部控制权要么毫无控制权）。而使用 RBAC，可以在更精细的级别上强制执行安全策略。RBAC 采用最小特权的安全原则。最小特权表示用户仅具有执行某项作业所必需的特权。普通用户具有足够特权来使用其应用程序、检查其作业状态、打印文件、创建新文件等。超出普通用户功能以外的功能将分组到各权限配置文件中。如果用户将要执行的作业要求具有某些超级用户功能才能执行，这些用户将承担拥有适当权限配置文件的角色。

RBAC 会将超级用户功能收集到权限配置文件中。这些权限配置文件将指定给称为角色的特殊用户帐户。然后，用户可以承担某个角色，以执行要求具有某些超级用户功能才能执行的作业。

> 参考资料：
> [RedHat 基于角色的访问控制 (RBAC)](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/5/html/deployment_guide/selg-overview#sec-rbac-intro1)

### Kubernetes 中的 RBAC

在 Kubernetes 中，我们通常授予对 API 端点（endpoints）的访问权限。RBAC 通过允许或禁止访问管理 API 资源来定义用户、组和进程的策略。

在 Kubernetes 中，可以用 RBAC 做哪些操作呢？比如：

- 为系统的不同用户，定义不同的角色，来访问不同的 Kubernetes 资源。
- 控制 Pod 中运行的进程，以及可以通过 Kubernetes API 执行的操作。
- 限制命名空间的资源可见性等等。

![](/images/articles/2022/just-rbac-it/rbac08.png)

在 Kubernetes 中，RBAC 由三个模块组成，它们一起将 API 原语（API primitives）及其允许的操作连接到用户、组或者 [ServiceAccount](https://kubernetes.io/zh/docs/tasks/configure-pod-container/configure-service-account/). 

#### Kubernetes RBAC API

我们来了解下实现 RBAC 功能的 Kubernetes API 原语：

- 角色：角色 API 原语声明了该规则可以操作的 API 资源及其操作（查看、删除等）。
	- 允许查看和删除 Pods
	- 允许查看 Pods 的日志
- RoleBinding：RoleBinding API 原语将角色绑定到主题。例如：将允许更新服务的角色绑定到用户 贝丝。

![](/images/articles/2022/just-rbac-it/rbac09.png)

所有的 Kubernetes 集群都有两类用户：Kubernetes 管理的 Service Account 和普通用户。角色可以分配给外部用户或机器人（集群内的应用程序）。我们来总结一下，完成访问控制的行为，需要的几步操作：

- 创建/拥有一个用户。
- 创建角色以向 API 端点授予权限。
- 将角色链接到用户。

最后一步称为绑定，由上图中名为 RoleBinding 的对象完成，该对象将身份链接到角色。

> 注：Roles 和 RoleBindings 在命名空间中创建，它们授予对当前命名空间中资源的访问权限。如果需要将角色定义为全局而不是限定为命名空间，需要 [ClusterRole](https://kubernetes.io/zh/docs/reference/kubernetes-api/authorization-resources/cluster-role-v1/)，要将身份链接到全局角色，需要使用 [ClusterRoleBinding](https://kubernetes.io/zh/docs/reference/kubernetes-api/authorization-resources/cluster-role-binding-v1/)。

## 最后

RBAC 访问控制模型，应该是开发中比较常见的模型了，我采取图文的形式，结合自己的理解，写下了这篇文字，希望能对看到的小伙伴提供帮助！😊

> 我的水平和认知都是有限的，如果你想了解更多关于 RBAC 或者访问控制模型的知识，我为你准备了一些参考资料链接：
> [AWS 的访问控制模型](https://docs.aws.amazon.com/IAM/latest/UserGuide/access.html)
> [Wiki-基于角色的访问控制](https://zh.wikipedia.org/zh-cn/%E4%BB%A5%E8%A7%92%E8%89%B2%E7%82%BA%E5%9F%BA%E7%A4%8E%E7%9A%84%E5%AD%98%E5%8F%96%E6%8E%A7%E5%88%B6)
> [Kubernetes 使用 RBAC 鉴权](https://kubernetes.io/zh/docs/reference/access-authn-authz/rbac/)
> [基于角色的访问权限控制 (RBAC) 概览 ](https://cloud.google.com/data-fusion/docs/concepts/rbac?hl=zh_cn)
> [Azure 的访问控制模型](https://docs.microsoft.com/en-us/azure/role-based-access-control/overview)