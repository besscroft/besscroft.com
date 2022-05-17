---
title: "Spring Cloud on GitHub Actions"
date: 2022-05-17T11:01:51+08:00
categories: ["技术"]
tags: ["Spring Cloud CI/CD","GitHub Actions","Spring Cloud on GitHub Actions"]
---

## GitHub Actions

### 概览

[GitHub Actions](https://github.com/features/actions) 是由 GitHub 推出的持续集成服务。可以创建工作流程来构建和测试存储库的每个拉取请求，或将合并的拉取请求部署到生产环境。GitHub Actions 不仅仅是 DevOps，还允许您在存储库中发生其他事件时运行工作流程。 例如，您可以运行工作流程，以便在有人在您的存储库中创建新问题时自动添加相应的标签。GitHub 提供 Linux、Windows 和 macOS 虚拟机来运行工作流程，或者您可以在自己的数据中心或云基础架构中托管自己的自托管运行器。

### 它能做什么？

GitHub Actions 支持绝大多数你所熟知的语言，你可以用它进行代码检查、测试、CI/CD、项目管理，甚至能跑 Kubernetes 和薅羊毛。。。

如果我们要搜一些常见的操作，一般会想到 [awesome actions](https://github.com/sdras/awesome-actions)，你也可以在 [GitHub Market](https://github.com/marketplace?type=actions) 搜索。

### 核心概念

主要讲 3 点：工作流程、作业、步骤。其它的内容，请自行翻阅 [文档](https://docs.github.com/cn/actions)。不过话说回来，只需要了解这 3 个概念就够了，知道了它是怎么运行的，你就能在脑海中构思你每干一件事需要哪些步骤，然后直接去搜索有没有现成的步骤可以使用，当然，是在没有解决方案，只能自己造轮子了。

先来讲讲工作流程，我们要在 GitHub 上面做操作，肯定得有一个仓库，这是最基本的条件。其次，你也许以前就注意到了，很多仓库里面，都有 `.github/workflows` 文件夹，这是 GitHub Actions 必须的要求。文件夹下，存放的就是 YAML 文件了，实际上一个工作流程，就是对应一个 yaml 文件的。

比如说，我新建了一个 `github-actions-demo.yml` 文件，那么就相当于创建了一个名为 `github-actions-demo` 的工作流程。当然，名字是可以在 yaml 文件中配置的。

![](/images/articles/2022/spring-cloud-on-github-actions/actions01.png)

这是我从文档中抠下来的图，根据这张图我们来理解一下这 3 个概念。“工作流程”是一个可以配置的自动化过程，并且是由 YAML 文件定义的事件触发时运行，或者可以手动触发以及定时触发。我们可以看到，工作流程中是可以包含多个“作业”的，也就是 jobs，比如你可以定义 `job1`、`job2` ...每一个作业中，也可以存在多个“步骤”，可以是自定义的脚本，也可以是其它操作等等。

这里提到了一个新的概念，叫做“事件”。如果不好理解，那么我就说 6 个字解释下：“事件触发流程”。比如说你可以定义有人创建 pr、打开一个 issue、推送到存储库，或者是定时运行，来触发工作流程的运行。

> 这里说一个容易被误解的点，官方的图上看上去每个作业是顺序运行的，但它们也是可以并行运行的哦~😊

理论上来说，在耗尽 GitHub Actions 限定的资源和时间之前，单次工作流程，是可以一直跑的，那可玩性也就大大提升啦！虽然很多骚操作不太推荐就是了，毕竟是免费资源，不能滥用😂

说了这么多，来进入正题吧，啰嗦半天主要是怕搜到这里的朋友，没弄明白 GitHub Actions 是怎么回事，已经轻车熟路的朋友跳过就行啦！

## Spring Boot

在 Spring Cloud 之前，我们需要先讲一下 Spring Boot 的操作，毕竟也是基于它的嘛。这里就用基于 Spring Boot 的 [Pisces-Lfs](https://github.com/besscroft/pisces-lfs) 项目来举例。由于我们要打包基于 Docker 的镜像，那么得先写好 Dockerfile 文件。

```Dockerfile
# 该镜像需要依赖的基础镜像
FROM openjdk:8-jdk-alpine
# 设置环境变量
ENV TZ=Asia/Shanghai JAVA_OPTS="-Xms512m -Xmx512m" SPRING_CONFIG="-Dspring.config.location=/root/lfs/application-docker.yml"
# 设置时区
RUN set -eux; \
    ln -snf /usr/share/zoneinfo/$TZ /etc/localtime; \
    echo $TZ > /etc/timezone
# 创建文件夹
RUN mkdir -p /root/lfs
# 拷贝 jar 包，并重命名
COPY lfs-admin/target/lfs-admin-1.0.jar /lfs-admin.jar
# 指定 docker 容器启动时运行 jar 包
ENTRYPOINT exec java ${JAVA_OPTS} -jar ${SPRING_CONFIG} /lfs-admin.jar
# 指定维护者的名字
MAINTAINER besscroft
```

然后我们再创建 `docker-buildx.yml` 文件：

```yaml
# 工作流程名称
name: "Java CI with Multi-arch Docker Image"

# 指定事件触发条件和分支
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

# 一个作业
jobs:
  docker:
    name: Running Compile Java Multi-arch Docker Image
    # 基于 ubuntu-latest 运行时
    runs-on: ubuntu-latest
    steps:
      # 设置 Java 环境的操作
      - uses: actions/checkout@v3
      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          # 指定 jdk 版本
          java-version: '8'
          # 注意，这里的 adopt 是因为我需要用这个，你可以根据自身情况换成其它发行版
          distribution: 'adopt'
          cache: 'maven'
      - name: Build with Maven
        # maven 构建
        run: mvn -B package -Dmaven.test.skip=true --file pom.xml
      - name: Login to Docker Hub
        # 登录 docker 仓库
        uses: docker/login-action@v1
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      - name: Set up QEMU
        # 设置 QEMU，以便支持多平台构建
        uses: docker/setup-qemu-action@v1
      - name: Set up Docker Buildx
        id: buildx
        uses: docker/setup-buildx-action@v1
      - name: Build and push
        id: docker_build
        uses: docker/build-push-action@v2
        with:
          context: ./
          # 指定 Dockerfile 文件位置
          file: ./Dockerfile
          # 打包支持的镜像架构，因为我需要 aarch64 的镜像，所以这里加上了 arm64
          platforms: linux/amd64,linux/arm64
          push: true
          # 镜像标签
          tags: ${{ secrets.DOCKERHUB_USERNAME }}/lfs:latest
```

工作流程中，有使用到环境变量的地方，也就是用户名和 token，这个不可能直接放在文件中的，不然就泄露了。一般我们存放在 `Actions secrets` 中，使用环境变量配置进行读取，如下图所示。

![](/images/articles/2022/spring-cloud-on-github-actions/actions02.png)

## Spring Cloud

了解了 Spring Boot 如何操作后，Spring Cloud 实际上也就很简单了。我用自己的 [Pisces-Cloud](https://github.com/besscroft/pisces-cloud) 项目来举例，一个微服务下的子模块，假设全部在一个项目空间内的话，通常来说，打包构建只需要一次，就可以将所有的服务构建完成，那么问题就好办多了。

同样的，我们要对每个服务创建一个 `Dockerfile` 文件，然后再新建一个 `docker-buildx.yml` 文件即可。

```yaml
name: "Java CI with Multi-arch Docker Image"

on:
  push:
    branches: [ main ]

jobs:
  docker:
    name: Running Compile Java Multi-arch Docker Image=
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          java-version: '8'
          distribution: 'adopt'
          cache: 'maven'
      - name: Build with Maven
        run: mvn -B package -Dmaven.test.skip=true --file pom.xml
      - name: Login to Docker Hub
        uses: docker/login-action@v1
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      - name: Set up QEMU
        uses: docker/setup-qemu-action@v1
      - name: Set up Docker Buildx
        id: buildx
        uses: docker/setup-buildx-action@v1
      # 从这里开始看
      - name: Build and push admin
        id: docker_build_admin
        uses: docker/build-push-action@v2
        with:
          context: ./
          file: ./pisces-admin/admin-boot/Dockerfile
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ${{ secrets.DOCKERHUB_USERNAME }}/pisces-admin:latest
      - name: Build and push auth
        id: docker_build_auth
        uses: docker/build-push-action@v2
        with:
          context: ./
          file: ./pisces-auth/Dockerfile
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ${{ secrets.DOCKERHUB_USERNAME }}/pisces-auth:latest
      - name: Build and push gateway
        id: docker_build_gateway
        uses: docker/build-push-action@v2
        with:
          context: ./
          file: ./pisces-gateway/Dockerfile
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ${{ secrets.DOCKERHUB_USERNAME }}/pisces-gateway:latest
```

注意到区别了吗？实际上只多了“步骤”，就是对每一个 `Dockerfile` 都创建一个单独的“步骤”，来进行镜像的打包，只需要将这些步骤全部放到 maven 构建之后即可。

## 一些建议

我这里只提供了能同时满足 x86 平台和 arm 平台的容器构建方案，其它功能其实是由 Docker 本身实现的。

```shell
docker run -d --name pisces-gateway \
  -p 8000:8000 \
  -e JAVA_OPTS="-Xms512m -Xmx512m -Duser.timezone=GMT+08 -Dfile.encoding=UTF8" \
  -e SPRING_CONFIG="--spring.profiles.active=prod --spring.cloud.nacos.discovery.server-addr=http://127.0.0.1:8848" \
  besscroft/pisces-gateway:latest
```

比如说这里 Docker 容器启动时设置 JVM 参数，以及配置参数。

对于发布版本镜像，开源社区中比较规范一点的玩法是，创建 `release.yml` 文件，通过给分支打上 tag 标签来触发事件，进行工作流程。其它的骚操作就不属于本文讨论范围啦！