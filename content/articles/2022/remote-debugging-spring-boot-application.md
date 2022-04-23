---
title: "基于 JPDA 远程调试 SpringBoot 应用程序"
date: 2022-03-30T15:54:51+08:00
categories: ["技术"]
tags: ["远程调试","remote debugging","springboot","调试","JPDA"]
---

## 前言

远程调试技术，在开发中相对常见。如果技术团队是采用的基于 DevOps 开发流程，那么你可能需要了解远程调试技术。

在我司，后端开发工程师，几乎不在本地启动服务进行调试。单元测试和接口测试，在某些情况下，并不能很好的复原和追踪哪些诡异的 bug。在我们内部有 2 套环境（开发联调和测试环境），都是在本地开发完，然后将代码推送到“开发环境”服务器，通过 CI/CD 进行自动化部署，然后基于开发环境进行调试，这时，远程调试就派上用场了。

在开发环境完毕后，我们会将代码合并，并推送到测试环境，再用同样的方式部署。这时，测试人员会对应用程序进行测试，试想一下，测试人员在测试出一个 bug 后，通常要汇报一些文本。比如接口地址、请求参数、哪些条件下能够触发 bug、bug 带来的破坏性和影响面等等。然后开发人员再根据这些情况进行场景还原，并对 bug 进行追踪，效率如何暂且不讨论，这里的问题是，你不一定能够复现出来，通常需要走一些复杂的业务流程。这时，利用远程调试，在可疑的地方启动断点，即可一步步追踪。

## Java 调试技术 JPDA

[Java 平台调试器架构](https://docs.oracle.com/javase/8/docs/technotes/guides/jpda/) (JPDA)，全称是 Java Platform Debugger Architecture。

![](/images/articles/2022/remote-debugging-spring-boot-application/001.png)

* JVM TI
	Java Virtual Machine Tool Interface 是一个双路接口，支持 JVM 与本机代理程序之间进行通信。它取代了 JVM DI 和 JVM PI 接口。我们通常在 idea 中打断点让程序停住，那么想在远程也实现，那么 JVM 必须得提供一种代理程序机制，用于统治 JVM 所需的各类信息。JVM TI 支持需要访问 JVM 状态的所有工具，包括但不限于：分析、调试、监控、线程分析和覆盖分析工具。
* JDWP
	Java Debug Wire Protocol 是一种通信协议，它是 Java Platform Debugger Architecture 的一部分。它用于调试器和它所调试的 Java 虚拟机之间的通信。它允许在不同的计算机上调试进程。它可以通过网络套接字或共享内存工作。简单点说，想要与 JVM TI Agent 通信，就要先与“通信后端”通信，那么咱们想通信是不是得有一个协议呢？没错，就是 JDWP。
* JDI
	Java Debugger Interface 定义了一个高级 Java 语言接口，开发人员可以轻松地使用它来编写远程调试器应用程序工具。JDI 位于 JPDA 的最顶层入口，它的实现是通过 JAVA 语言编写的，所以可以理解为 Java 调试客户端对 JDI 接口的封装调用来启动调试的。

![](/images/articles/2022/remote-debugging-spring-boot-application/002.png)

咱们来梳理一下调试的整个流程吧：

IDEA 客户端调试器 -> JDI 客户端 -> JDWP Agent -> JVM TI Agent -> JVM TI -> JVM 应用

更深的原理，就不在这里浪费篇幅了（其实理解起来有点小费劲），咱们关键是得把这玩意用好，才能简化开发，不是么？

## 在 IDEA 中进行远程调试

先声明一下哈，JPDA 的玩法有很多种，咱们这里只讲最经常用的这一种，也就是在 idea 中调试远程服务器上的 springboot 项目，当然，其它项目也是可以的。

### 设置应用程序

对于应用程序的运行方式一般没有限制，不过我们通常是将应用程序打包为 jar 包，并使用命令行启动它的，在容器中实际上也是这样。下面俺以 JDK 8 的项目为例，当然，我也会指出不同版本间的差异。

```java
java -jar -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005 remote-debug.jar
```
注意，这里和我们正常启动应用程序是没有什么区别的，我们只需要加上使用调试代理启动程序的 VM 选项就行了。

* address 这个参数可能有点歧义，它是配置端口的，但在某些情况下，可能会是 `*:5005` 或者 `0.0.0.0:5005` 。
* server=y 这个是指定当前应用是作为调试的服务端还是客户端的，默认情况下是 `n` ，也就是客户端，但是咱们肯定得作为服务端使用，所以得改成 `y` 。
* suspend 这个参数，指定进程是等到调试器连接好了再跑，还是立即启动，通常情况下，为了不影响程序正常运行，我们都会选择 `n` ，也就是立即启动。
* timeout 也就是超时时间，单位是毫秒。当 `suspend=y` 时，该值表示等待连接的超时；当 `suspend=n` 时，该值表示连接后的使用超时。

### 设置 IDEA 客户端

我们打开 idea 客户端，找到 `Edit Configurations`，然后选择 `+` 新增一个 `Remote JVM Debug` ，并安装下图中的方式配置。

![](/images/articles/2022/remote-debugging-spring-boot-application/003.png)

请注意，ip、端口以及项目模块，记得填自己的哦！如果是在同一台机器上运行，需要填 `localhost` 。

在配置完成后，远程应用启动的情况下，我们启动刚才配置的本地应用程序，不出意外的话，你会得到这样一行输出：

```
Listening for transport dt_socket at address: 5005
```

连接成功后，尝试在你的 idea 上打个断点调试看看。

### 不同版本间的区别

你如果看过文档，可能会注意到，不同 JDK 版本，配置会稍有差别。

* 对于 JDK 1.3 以及更老的版本

```
-Xnoagent -Djava.compiler=NONE -Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005
```

* 对于 JDK 1.4 版本

```
-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005
```

* 对于 JDK 1.5 - 1.8 的版本

```
-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005
```

* 对于 JDK 1.9 及更新版本

```
-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005
```

### 注意事项

这里的注意事项，就说一下俺踩过的坑吧！🥲

* 务必保证远程应用和本地 idea 调试器的代码是一致的，不然会出现许多诡异的现象！
* module 一定要两边一致，比如咱们一个微服务项目，你在远程启动 service-a，但是本地是 service-b，那肯定不行！
* 注意开放对应的端口，并且千万注意，Debug 端口和程序端口，是两个不同的端口，不要冲突。
* 不同应用之间，不要共用一个 Debug 端口，不然会发生什么，俺也没试过~
* 如果在容器，或者 k8s 部署的话，注意做一下端口映射，比如 Docker 需要加上 `-p 5005:5005` 。

## 最后

说到这里，就差不多啦。我个人认为这还是一个比较方便的技术，虽然任何技术都不是万能的，但是它在合适的场景，确实能帮你解决问题！😊

扩展阅读：[Arthas](https://arthas.aliyun.com/doc/)
