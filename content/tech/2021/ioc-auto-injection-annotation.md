---
title: "IOC依赖注入——自动注入的三个注解"
date: 2021-03-14T15:12:16+08:00
tags: ["Spring","Spring IOC"]
categories: ["技术"]
---

### 前言

学过Spring的小伙伴应该知道，只要是能够运行Java程序的平台，就能运行Spring应用程序。而Spring框架也同时为Java应用程序的开发，提供了基础架构支持和丰富的功能。但是这些功能的底层，都会依赖Spring框架的两大核心特性：依赖注入(dependency injection，DI)和面向切面编程(aspect-oriented programming，AOP)。

最近一直在看的书单：`Spring 实战(第四版)`和`Spring 实战(第五版)`，同时在Google也查阅了一些资料，算是对一个小知识点的总结了。

### 自动化装配

Spring框架主要从两个角度来实现了自动化装配：

* 组件扫描（component scanning）：Spring 会自动发现应用上下文中所创建的 bean。

* 自动装配（autowiring）：Spring 自动满足 bean 之间的依赖。

### 实现自动装配的三大注解

#### @Autowired

我们可以对一个Bean的`构造器` 、`属性`、`Setter方法`上面标注`@Autowired`注解，无论采用构造器还是Setter方法，Spring都会尝试满足方法参数上所声明的依赖。标注在属性上，Spring也会按照属性对应的类型，从容器中找到对应的Bean赋值到对应的属性上。

```java
package personsystem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * 构造器注入
 */
@Component
public class Boy implements Person {
  
    private Girl girl;

    @Autowired
    public Boy(Girl girl) {
        this.girl = girl;
    }

    public void love() {
        girl.love();
    }

}
```

上面的例子，不出意外的话，Spring会注入一个girl给boy😅

```java
/**
 * Setter方法注入
 */
@Autowired(required=false)
@Qualifier("beautifulGirl")
public void setGirl(Girl girl){
    this.girl = girl;
}
```

在Spring初始化Bean之后，会尽可能的去满足Bean的依赖。但是如果没有girl给boy注入的话，Spring会抛出一个异常。为了避免这个异常的发生，我们需要将`@Autowired`的`required`属性设置为false。如果有多个Bean可供注入时，我们可以使用`@Qualifier`注解指定要注入的Bean。

#### @Resource

后面的两个注释，来源于Java 依赖注入规范（JSR, Java Specification Requests）。而`@Resource`注解，依赖于JSR250规范，可以参考下官方文档：https://jcp.org/en/jsr/detail?id=250

`@Resource`和`@Autowired`的区别：

| 注解名     | 注入方式                                      |
| ---------- | --------------------------------------------- |
| @Resource  | 按照属性名/Bean的名称注入，也提供按照类型注入 |
| @Autowired | 按照类型注入                                  |

```java
@Component
public class Boy implements Person {
	
    @Resource(name="beautifulGirl")
    private Girl girl;

}
```

当然，`@Resource`也是可以指定要注入的Bean的。

#### @Inject

`@Inject`注解依赖JSR330规范：https://jcp.org/en/jsr/detail?id=330 ，但是我们在用这个注解之前，是需要导入一个依赖的：

```xml
<!-- https://mvnrepository.com/artifact/javax.inject/javax.inject -->
<dependency>
    <groupId>javax.inject</groupId>
    <artifactId>javax.inject</artifactId>
    <version>1</version>
</dependency>
```

`@Inject`注解虽然来源于Java依赖注入规范，但是只和`@Autowired`有着一点点差别，在绝大多数场景下，都是可以相互替换的。该规范还提供了一个`@Named`注解，作用是等同于`@Qualifier`注解的。

```java
@Component
public class Boy implements Person {
	
    @Inject
    @Named("beautifulGirl")
    private Girl girl;

}
```

值得一提的是，`@Resource`和`@Inject`注解，并不属于Spring。而依赖特性，并不是只有Spring框架才有。但是我个人并没有什么偏向性，只是习惯使用某些注解了。比如`@Inject`需要导包，我自己平常写代码喜欢用`@Resource`，在idea里面，用`@Autowired`会有红色的波浪线等等，不过搬砖的时候，还是用的`@Autowired`。这都是些个人习惯，不知道是不是只有我一个人这样，哈哈😃