---
title: "在微服务项目中引入 knife4j"
date: 2021-11-17T09:50:51+08:00
categories: ["技术"]
tags: ["微服务","knife4j","Spring Cloud 2020","Spring Cloud Alibaba 2021","swagger"]
---

## 什么是 Knife4j ？

knife4j 是为 Java MVC 框架集成 Swagger 生成 Api 文档的增强解决方案。说白了，如果项目开发为前后端分离开发的话，这个插件就非常的省事儿，不用再很麻烦的写接口文档了。之前用过 Swagger 来生成文档，但是在某些情况下，Swagger 却并不适合国内的项目，尤其是验收文档。给甲方的验收文档往往包含接口文档，这是 knife4j 的导出就派上用场了。

> 没有好不好用，只有适不适合！

## 引入项目

### 说明

本文章以我自己的开源项目 [aurora-mall](https://github.com/besscroft/aurora-mall) 为例，详细讲述在 Spring Cloud 2020 &  Alibaba 2021 中，应该如何引用。为什么必须加上这个说明呢？因为不同的项目，引入方式还是有一些差别的。

### 开始

#### 导包

* 在项目的根 `pom.xml` 文件中导包。

```xml
<properties>
    <knife4j.version>2.0.4</knife4j.version>
</properties>

<dependencyManagement>
    <dependencies>
		<dependency>
            <groupId>com.github.xiaoymin</groupId>
            <artifactId>knife4j-micro-spring-boot-starter</artifactId>
            <version>${knife4j.version}</version>
        </dependency>
        <dependency>
            <groupId>com.github.xiaoymin</groupId>
            <artifactId>knife4j-spring-boot-starter</artifactId>
            <version>${knife4j.version}</version>
        </dependency>
	</dependencies>
</dependencyManagement>
```

* 在网关服务的 `pom.xml` 中，导包

```xml
<dependency>
    <groupId>com.github.xiaoymin</groupId>
    <artifactId>knife4j-spring-boot-starter</artifactId>
</dependency>
```

* 在每一个需要生成文档的服务的 `pom.xml` 中，导包(一般放在 common 中，然后不需要屏蔽即可)

```xml
<dependency>
    <groupId>com.github.xiaoymin</groupId>
    <artifactId>knife4j-micro-spring-boot-starter</artifactId>
</dependency>
```

> gateway 服务模块的接口，需要多一个包，用来输出文档到前端（包含UI包）它会把我们所有的微服务都聚合到一个文档，统一输出到前端，其它服务只需控制数据，这样便于节约资源！

#### 生产环境屏蔽

目前 `Springfox-Swagger` 以及 `Knife4j` 提供的资源接口包括如下：**如果你要用的话，记得白名单放行**

| 资源                                      | 说明                                           |
| ----------------------------------------- | ---------------------------------------------- |
| /doc.html                                 | Knife4j提供的文档访问地址                      |
| /v2/api-docs-ext                          | Knife4j提供的增强接口地址,自`2.0.6` 版本后删除 |
| /swagger-resources                        | Springfox-Swagger提供的分组接口                |
| /v2/api-docs                              | Springfox-Swagger提供的分组实例详情接口        |
| /swagger-ui.html                          | Springfox-Swagger提供的文档访问地址            |
| /swagger-resources/configuration/ui       | Springfox-Swagger提供                          |
| /swagger-resources/configuration/security | Springfox-Swagger提供                          |

当我们部署系统到生产系统,为了接口安全,需要屏蔽所有 Swagger 的相关资源

如果使用 SpringBoot 框架,只需在 `application.properties` 或者 `application.yml` 配置文件中配置

```yml
knife4j:
  # 开启增强配置 
  enable: true
　# 开启生产环境屏蔽
  production: true
```

#### Java 化配置

* 配置基类

咱们一般会放在 common 包里面。

```java
package com.besscroft.aurora.mall.common.config;

import com.besscroft.aurora.mall.common.domain.SwaggerProperties;
import org.springframework.context.annotation.Bean;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.*;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spi.service.contexts.SecurityContext;
import springfox.documentation.spring.web.plugins.Docket;

import java.util.ArrayList;
import java.util.List;

/**
 * swagger 通用配置
 *
 * @Author Bess Croft
 * @Date 2021/4/2 12:28
 */
public abstract class BaseSwaggerConfig {

    @Bean
    public Docket createRestApi() {
        SwaggerProperties swaggerProperties = swaggerProperties();
        Docket docket = new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo(swaggerProperties))
                .select()
                .apis(RequestHandlerSelectors.basePackage(swaggerProperties.getApiBasePackage()))
                .paths(PathSelectors.any())
                .build();
        if (swaggerProperties.isEnableSecurity()) {
            docket.securitySchemes(securitySchemes()).securityContexts(securityContexts());
        }
        return docket;
    }

    private ApiInfo apiInfo(SwaggerProperties swaggerProperties) {
        return new ApiInfoBuilder()
                .title(swaggerProperties.getTitle())
                .description(swaggerProperties.getDescription())
                .contact(new Contact(swaggerProperties.getContactName(), swaggerProperties.getContactUrl(), swaggerProperties.getContactEmail()))
                .version(swaggerProperties.getVersion())
                .build();
    }

    private List<ApiKey> securitySchemes() {
        // 设置请求头信息
        List<ApiKey> result = new ArrayList<>();
        ApiKey apiKey = new ApiKey("Authorization", "Authorization", "header");
        result.add(apiKey);
        return result;
    }

    private List<SecurityContext> securityContexts() {
        // 设置需要登录认证的路径
        List<SecurityContext> result = new ArrayList<>();
        result.add(getContextByPath("/*/.*"));
        return result;
    }

    private SecurityContext getContextByPath(String pathRegex) {
        return SecurityContext.builder()
                .securityReferences(defaultAuth())
                .forPaths(PathSelectors.regex(pathRegex))
                .build();
    }

    private List<SecurityReference> defaultAuth() {
        List<SecurityReference> result = new ArrayList<>();
        AuthorizationScope authorizationScope = new AuthorizationScope("global", "accessEverything");
        AuthorizationScope[] authorizationScopes = new AuthorizationScope[1];
        authorizationScopes[0] = authorizationScope;
        result.add(new SecurityReference("Authorization", authorizationScopes));
        return result;
    }

    /**
     * 自定义Swagger配置
     */
    public abstract SwaggerProperties swaggerProperties();

}
```

* 新建 SwaggerProperties 类

```java
@Data
@Builder
@EqualsAndHashCode(callSuper = false)
public class SwaggerProperties {

    /**
     * API文档生成基础路径
     */
    private String apiBasePackage;

    /**
     * 是否要启用登录认证
     */
    private boolean enableSecurity;

    /**
     * 文档标题
     */
    private String title;

    /**
     * 文档描述
     */
    private String description;

    /**
     * 文档版本
     */
    private String version;

    /**
     * 文档联系人姓名
     */
    private String contactName;

    /**
     * 文档联系人网址
     */
    private String contactUrl;

    /**
     * 文档联系人邮箱
     */
    private String contactEmail;

    /**
     * 版权信息
     */
    private String license;

    /**
     * 版权协议地址
     */
    private String licenseUrl;

}
```

* 在网关服务新增 Swagger 资源配置

```java
package com.besscroft.aurora.mall.gateway.config;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.config.GatewayProperties;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.support.NameUtils;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import springfox.documentation.swagger.web.SwaggerResource;
import springfox.documentation.swagger.web.SwaggerResourcesProvider;

import java.util.ArrayList;
import java.util.List;

/**
 * swagger资源配置
 *
 * @Author Bess Croft
 * @Date 2021/4/2 12:37
 */
@Slf4j
@Component
@Primary
@AllArgsConstructor
public class SwaggerResourceConfig implements SwaggerResourcesProvider {

    private final RouteLocator routeLocator;
    private final GatewayProperties gatewayProperties;

    @Override
    public List<SwaggerResource> get() {
        List<SwaggerResource> resources = new ArrayList<>();
        List<String> routes = new ArrayList<>();
        //获取所有路由的ID
        routeLocator.getRoutes().subscribe(route -> routes.add(route.getId()));
        //过滤出配置文件中定义的路由->过滤出Path Route Predicate->根据路径拼接成api-docs路径->生成SwaggerResource
        gatewayProperties.getRoutes().stream().filter(routeDefinition -> routes.contains(routeDefinition.getId())).forEach(route -> {
            route.getPredicates().stream()
                    .filter(predicateDefinition -> ("Path").equalsIgnoreCase(predicateDefinition.getName()))
                    .forEach(predicateDefinition -> resources.add(swaggerResource(route.getId(),
                            predicateDefinition.getArgs().get(NameUtils.GENERATED_NAME_PREFIX + "0")
                                    .replace("**", "v2/api-docs"))));
        });

        return resources;
    }

    private SwaggerResource swaggerResource(String name, String location) {
        log.info("name:{},location:{}", name, location);
        SwaggerResource swaggerResource = new SwaggerResource();
        swaggerResource.setName(name);
        swaggerResource.setLocation(location);
        swaggerResource.setSwaggerVersion("2.0");
        return swaggerResource;
    }

}
```

* 配置网关的 Swagger 处理器，自定义 Swagger 的各个配置节点

```java
package com.besscroft.aurora.mall.gateway.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;
import springfox.documentation.swagger.web.*;

import java.util.Optional;

/**
 * 自定义Swagger的各个配置节点
 *
 * @Author Bess Croft
 * @Date 2021/3/30 21:35
 */
@RestController
public class SwaggerHandler {

    @Autowired(required = false)
    private SecurityConfiguration securityConfiguration;

    @Autowired(required = false)
    private UiConfiguration uiConfiguration;

    private final SwaggerResourcesProvider swaggerResources;

    @Autowired
    public SwaggerHandler(SwaggerResourcesProvider swaggerResources) {
        this.swaggerResources = swaggerResources;
    }

    /**
     * Swagger安全配置，支持oauth和apiKey设置
     */
    @GetMapping("/swagger-resources/configuration/security")
    public Mono<ResponseEntity<SecurityConfiguration>> securityConfiguration() {
        return Mono.just(new ResponseEntity<>(
                Optional.ofNullable(securityConfiguration).orElse(SecurityConfigurationBuilder.builder().build()), HttpStatus.OK));
    }

    /**
     * Swagger UI配置
     */
    @GetMapping("/swagger-resources/configuration/ui")
    public Mono<ResponseEntity<UiConfiguration>> uiConfiguration() {
        return Mono.just(new ResponseEntity<>(
                Optional.ofNullable(uiConfiguration).orElse(UiConfigurationBuilder.builder().build()), HttpStatus.OK));
    }

    /**
     * Swagger资源配置，微服务中的各个服务的api-docs信息
     */
    @GetMapping("/swagger-resources")
    public Mono<ResponseEntity> swaggerResources() {
        return Mono.just((new ResponseEntity<>(swaggerResources.get(), HttpStatus.OK)));
    }

}
```

* 在每个业务系统服务配置 Swagger

```java
package com.besscroft.aurora.mall.admin.config;

import com.besscroft.aurora.mall.common.config.BaseSwaggerConfig;
import com.besscroft.aurora.mall.common.domain.SwaggerProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

/**
 * swagger配置
 *
 * @Author Bess Croft
 * @Date 2021/3/30 13:43
 */
@Configuration
@EnableSwagger2
@Profile(value = {"dev"})
public class SwaggerConfiguration extends BaseSwaggerConfig {

    @Override
    public SwaggerProperties swaggerProperties() {
        return SwaggerProperties.builder()
                .apiBasePackage("com.besscroft.aurora.mall.admin.controller")
                .title("极光商城开发文档")
                .description("后台相关接口文档")
                .contactName("Bess Croft")
                .contactEmail("besscroft@foxmail.com")
                .contactUrl("https://github.com/besscroft/aurora-mall")
                .license("Open Source")
                .licenseUrl("https://github.com/besscroft/aurora-mall/blob/main/LICENSE")
                .version("0.1.0")
                .enableSecurity(true)
                .build();
    }

}
```

这里注意2点：


- `@Profile` 注解可以规定在哪个环境下生效，咱们只控制开发环境就ok了。
- `apiBasePackage` 设置生成的接口在哪个包里面。

> 同时，如果网关配置了白名单机制，记得放行 `/v2/api-docs` 地址！因为这里咱没做认证功能！（对于线上生产环境来说，白名单可以更好地控制访问权限，能一定程度保证安全性！）

#### 启动

然后咱们启动项目，来查看是否配置成功！

访问分组接口地址：



```plain
http://localhost:8000/swagger-resources
```



```jaon
[
    {
        "name": "mall-auth",
        "url": "/mall-auth/v2/api-docs",
        "swaggerVersion": "2.0",
        "location": "/mall-auth/v2/api-docs"
    },
    {
        "name": "mall-admin",
        "url": "/mall-admin/v2/api-docs",
        "swaggerVersion": "2.0",
        "location": "/mall-admin/v2/api-docs"
    },
    {
        "name": "mall-elasticsearch",
        "url": "/mall-elasticsearch/v2/api-docs",
        "swaggerVersion": "2.0",
        "location": "/mall-elasticsearch/v2/api-docs"
    },
    {
        "name": "mall-log",
        "url": "/mall-log/v2/api-docs",
        "swaggerVersion": "2.0",
        "location": "/mall-log/v2/api-docs"
    }
]
```

有正常值，表示接口返回正常！

- 访问前端地址：

```plain
http://localhost:8000/doc.html#/home
```

注意，实例中的 8000，指的是网关的端口号！

#### 使用注解

实际上就是 Swagger 的注解，比如说：

- 接口类上面可以加 `@Api(tags = "主页接口")`
- 接口方法上可以加 `@ApiOperation(value = "首页排行接口")`

- 实体类上可以加 `@ApiModel(value = "登录对象")`
- 实体类字段上可以加 `@ApiModelProperty(value = "用户名", dataType = "String")`

- 当然，不加也可以默认扫描读取！ 

#### 白名单

最后，放上一些可能需要放行的白名单地址：

```sql
"/doc.html"
"/v2/api-docs-ext"
"/swagger-resources"
"/v2/api-docs"
"/swagger-ui.html"
"/swagger-resources/configuration/ui"
"/swagger-resources/configuration/security"
```

### 最后

我觉得 knife4j 最大的好处就是，可以导出离线文档，有：Markdown、Word、Html、OpenAPI 格式！如果它正好命中你的需求，不妨试试引入到项目中呢！
