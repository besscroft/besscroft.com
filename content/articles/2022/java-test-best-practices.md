---
title: "我的 Java 测试最佳实践"
date: 2022-03-22T14:28:51+08:00
categories: ["技术"]
tags: ["单元测试","unit test","Java","测试","最佳实践"]
---
## 介绍

### 什么是测试？

> 软件测试（英语：software testing），描述一种用来促进鉴定软件的正确性、完整性、安全性和质量的过程。依照可计算理论（计算机科学的一个支派）一个简单的数学证明推断出下列结果：不可能完全解决所谓“死机”，指任意计算机程序是否会进入死循环，或者罢工并产生输出问题。换句话说，软件测试是一种实际输出与预期输出间的审核或者比较过程。—— 软件测试 Wiki

### 为什么要做测试？

软件测试的经典定义是：在规定的条件下对程序进行操作，以发现程序错误，衡量软件质量，并对其是否能满足设计要求进行评估的过程。

* 从业务角度出发，定义好功能测试的预期结果，在不运行代码的前提下，通过测试反馈输出结果，来验证业务和功能的可行性。
* 从项目角度出发，可以清晰的了解程序内部的运行过程、细节和边界条件，一定程度上保证代码重构的安全性，让接盘的你和接你盘的同事，能放心的动代码。。。🥲
* 从质量角度出发，可以复现任何上游或下游出现异常时的情况，以及被引用代码造成的业务影响，从而构建出高可用性的代码，保证核心业务的稳定性。

### 开发模式

开发模式，主要是 2 种，我目前公司的开发方式，更接近于 BDD 开发，而我阅读的《Java 测试驱动开发》，则讲述的是 TDD。

[BDD](https://zh.wikipedia.org/wiki/%E8%A1%8C%E4%B8%BA%E9%A9%B1%E5%8A%A8%E5%BC%80%E5%8F%91)：即行为驱动开发。BDD 要求系统最终的实现与用户（产品）的行为是一致的，验证代码实现是否符合原型设计目标。它侧重与整个系统的行为，关注的核心是设计，是测试驱动开发的延伸。

[TDD](https://zh.wikipedia.org/wiki/%E6%B5%8B%E8%AF%95%E9%A9%B1%E5%8A%A8%E5%BC%80%E5%8F%91)：即测试驱动开发。TDD 的流程要求你先编写测试，再编写实现代码。它侧重于单个方法或特性。

> 测试驱动开发中，先编写的测试代码，也算是单元测试的一部分。

### 测试类型

* 单元测试：旨在对小型功能单元进行检查。在 Java 代码中，这些单元就是【方法】。
* 集成测试：旨在核实各个单元、模块、应用程序乃至系统被妥善地集成在一起。在 Java 中，我们一般按照设计要求，会把多个单元测试组装起来，进行集成测试。
* 功能测试：功能测试就是对产品的各功能进行验证，根据功能测试用例，逐项测试，检查产品是否达到原型和需求文档要求的功能。
* 验收测试：它和功能而此时的用途不同，但是目标相似。在我们公司，它的实践是黑盒测试，主要交由测试人员完成。无需了解代码和程序内部的情况，测试案例依照原型和需求文档的要求而设计。

### 测试框架技术选型

常用的测试框架：

* [Junit](https://junit.org/junit5/) 是一个 Java 语言的单元测试框架。
* [Mockito](https://site.mockito.org/) 是一个在 MIT 许可下发布的 Java 开源测试框架。该框架允许在自动化单元测试中创建测试双重对象（模拟对象），以用于测试驱动开发或行为驱动开发。
* [EasyMock](https://easymock.org/) 通过使用 Java 代理机制动态生成模拟对象。
* [PowerMock](https://powermock.github.io/) 使用自定义类加载器和字节码操作来模拟静态方法、构造函数、最终类和方法、私有方法、删除静态初始化程序等。
* [JMock](http://jmock.org/) 是一个支持使用模拟对象对 Java 代码进行测试驱动开发的库。

在日常开发中，我基本上见过最多的单元测试，基本上都是用 Junit 完成的。也有许多团队是采用的 JUnit + Mockito 组合使用。其它的测试框架比较少见，可能是因为国内用的少了，也可能是我见识少了~。不过话说回来，国内真的有很多公司不注重这一块，虽然单元测试是把双刃剑，但是它带来的好处也是很不错的。

## 最佳实践

最佳实践，主要围绕 `SpringBoot` 工程的项目来讲解，如果你要在其它框架诸如 `Vert.x` 中使用，请自行查询[引用方法](https://vertx.io/docs/vertx-junit5/java/)。

#### 快速上手

* 导入测试所需的依赖包

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
</dependency>
```

这里有一点我们需要注意的是，在 `spring-boot-starter-test` 包中，已经集成了 `Mockito` ，所以不需要单独引用，开箱即用即可。

* Mapper 层代码

```java
/**
 * 根据用户名查询用户信息
 * @param username 用户名
 * @return 用户信息
 */
User findByUsername(@Param("username") String username);
```

> 注意，这里的 `Mapper` 层指代 `持久化层` ，在其它项目中，也可能叫 `Repository` 层。

* Service 层代码

```java
@Slf4j
@Service
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    
    /**
     * Mockito 使用注解注入依赖关系，需要提供构造器
     */
    public UserServiceImpl(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    @Override
    public AjaxResult login(String account, String password) {
        User user = userMapper.findByUsername(account);
        if (null == user) {
            throw new BusinessException("暂无该用户！");
        }
        if (!Objects.equals(user.getPassword, password)) {
            throw new BusinessException("密码错误！");
        }
        return AjaxResult.success("登录成功！");
    }
}
```

> 注意，这里只是模拟，实际开发中步骤不会这么少的。

* 测试代码

```java
@Slf4j
@SpringBootTest
public class UserServiceTest {
    
    @Autowired
    private UserService userService;
    
	@Test
    @DisplayName("登录测试")
    void login() {
        // 准备测试数据
        String account = "admin";
        String password = "666666";
        AjaxResult login = userService.login(account, password);
        // 验证是否与我们预期的状态值相符
        assertEquals(HttpStatus.SUCCESS, login.get("code"));
        assertNotNull(login.get("data"));
        log.info("登录方法测试成功.[login={}]", login);
    }
}
```

运行单元测试，看到 `登录方法测试成功` ，即表明成功！

### 数据库访问测试

数据库访问测试，应该是单元测试中，大家关注最少的地方了，有种脱裤子放屁的感觉，但实际上它也是有适用场景的。举个简单的例子吧，咱们在用 mybatis 开发复杂的业务场景的查询时，经常需要【变动】，也就是调整 SQL 语句。这时往往去启动项目调试，会非常麻烦且浪费时间，可能有时候你多打了一个 `,` ，也不一定能及时发现。那么在以往的开发中，累计下来的测试案例，可帮助你迅速的测试数据库访问的单元测试，及时发现问题。

* Mapper 层代码（此处省略 xml 文件）

```java
public interface UserMapper {
    /**
     * 根据用户名查询用户信息
     * @param username 用户名
     * @return 用户信息
     */
    User findByUsername(@Param("username") String username);
}
```

* 测试代码

```java
@Slf4j
@SpringBootTest
public class UserMapperTest {
	
	@Autowired
    private UserMapper userMapper;
    
    @Test
    @DisplayName("根据用户名查询用户信息测试")
    void login() {
        // 准备测试数据
        String username = "admin";
        User user = userMapper.findByUsername(username);
        // 验证是否与我们预期的状态值相符
        assertEquals(username, user.getUsername());
        assertNotNull(user, "获取用户信息失败！");
        log.info("根据用户名查询用户信息测试成功.[user={}]", user);
    }
    
}
```

运行单元测试，看到 `根据用户名查询用户信息测试成功` ，即表明成功！

#### 业务测试

在业务层，通常会有许多的依赖关系，我们在测试时，需要隔离依赖，同时也得遵守 `BCDE 原则` 。

* Border：边界值测试，包括循环边界、特殊取值、特殊时间点、数据顺序等；
* Correct：正确的输入，并得到预期的结果；
* Design：与设计文档相结合，来编写单元测试；
* Error：强制错误信息输入（如:非法数据、异常流程、非业务允许输入等），并得到预期的结果；

这里还是以刚才的登录场景为例：

```java
@Slf4j
@Service
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    
    /**
     * Mockito 使用注解注入依赖关系，需要提供构造器
     */
    public UserServiceImpl(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    @Override
    public AjaxResult login(User User) {
        User userResult = userMapper.findByUsername(loginParam.getUsername());
        if (null == user) {
            throw new BusinessException("暂无该用户！");
        }
        if (!Objects.equals(user.getPassword, password)) {
            throw new BusinessException("密码错误！");
        }
        return AjaxResult.success("登录成功！");
    }
}
```

* 测试代码

```java
@Slf4j
@SpringBootTest
public class UserServiceTest {
    
    @Mock
    private UserMapper mockUserMapper; // 通过注解模拟依赖的接口或类
    
    @InjectMocks
    private UserServiceImpl userService; // 通过注解自动注入依赖关系
    private static username = "admin";
    private static password = "666666";
    private static User user;
        
    @BeforeAll
    static void beforInsertTest() {
        user = new User();
        user.setUsername(username);
        user.setPassword(password);

        mockUserResult = new User();
        mockUserResult.setUsername(username);
        mockUserResult.setPassword("666666");
    }
    
	@Test
    @DisplayName("登录测试")
    void login() {
        // 验证测试用例是否创建
        assertNotNull(user, "user is null");

        // 模拟登录业务中，依赖的 mapper 层查询接口
        UserMapper mockUserMapper = mock(UserMapper.class);
        // 将模拟的接口注入
        UserServiceImpl userService = new UserServiceImpl(mockUserMapper);

        // 当程序运行时，模拟查询结果，返回我们指定的预期结果
        when(mockUserMapper.findByUsername(username)).thenReturn(mockUserResult);

        AjaxResult loginResult = userService.login(user);

        // 验证是否执行
        verify(mockUserMapper).findByUsername(username);

        // 验证是否与我们预期的状态值相符
        assertEquals(HttpStatus.SUCCESS, loginResult.getCode());
        assertNotNull(loginCallResult.getData());
        log.info("登录方法测试成功.[loginResult={}]", loginResult);
    }
    
}
```

运行单元测试，看到 `登录方法测试成功` ，即表明成功！

#### HTTP 接口测试

接口测试，在业务测试的基础上，还得加上 AIR 原则。AIR 原则和 BCDE 原则在[阿里巴巴 Java 开发手册](https://github.com/alibaba/p3c/blob/master/p3c-gitbook/%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95.md#L17)上都有，可以自行查看。

* Controller 层代码

```java
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    /**
     * 登录接口
     * @param loginParam 登录参数
     * @return token 信息
     */
    @PostMapping("/login")
    public AjaxResult login(@RequestBody @Valid LoginParam loginParam) {
        log.info("登录请求:{}", loginParam);
        AjaxResult accessToken = userService.login(loginParam.getUsername(), loginParam.getPassword());
        log.info("登录请求成功:{}", accessToken);
        return accessToken;
    }
}
```

* 测试代码

```java
@Slf4j
@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    private static LoginParam loginParam;
    
    @BeforeAll
    static void beforeUserControllerTest() {
        loginParam = new LoginParam();
        loginParam.setUsername("admin");
        loginParam.setPassword("666666");
    }
    
    @Test
    @DisplayName("登录接口测试")
    void login() throws Exception {
        // 验证测试用例是否创建
        assertNotNull(loginParam, "loginParam is null");

        // 发起测试请求
        MockHttpServletResponse response = mockMvc.perform(MockMvcRequestBuilders.post("/user/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginParam)))
                .andDo(MockMvcResultHandlers.print())
                .andReturn()
                .getResponse();

        // 验证 http 状态码
        assertEquals(HttpStatus.SUCCESS, response.getStatus());
        Map map = objectMapper.readValue(response.getContentAsString(), Map.class);
        // 验证业务状态码
        assertEquals(HttpStatus.SUCCESS, map.get("code"));
        log.info("登录接口测试成功:{}", map.get("data"));
    }
    
}
```

* 测试结果

```
MockHttpServletRequest:
      HTTP Method = POST
      Request URI = /user/login
       Parameters = {}
          Headers = [Content-Type:"application/json;charset=UTF-8", Content-Length:"40"]
             Body = {"username":"admin","password":"666666"}
    Session Attrs = {}

Handler:
             Type = com.besscroft.pisces.admin.controller.UserController
           Method = com.besscroft.pisces.admin.controller.UserController#login(LoginParam)

Async:
    Async started = false
     Async result = null

Resolved Exception:
             Type = null

ModelAndView:
        View name = null
             View = null
            Model = null

FlashMap:
       Attributes = null

MockHttpServletResponse:
           Status = 200
    Error message = null
          Headers = [Content-Type:"application/json"]
     Content type = application/json
             Body = {"code":200,"data":{"token":"token","refreshToken":"refreshToken","tokenHead":"Bearer ","expiresIn":86399},"message":"登录成功！"}
    Forwarded URL = null
   Redirected URL = null
          Cookies = []
          
登录接口测试成功:{"token":"token","refreshToken":"refreshToken","tokenHead":"Bearer ","expiresIn":86399}
```

## 高级技巧

### 代码覆盖率

好的单元测试能够最大限度地规避线上故障，这也是我们写单元测试的原因，在某些情况下，我们需要了解代码覆盖率。

代码覆盖率，也称为测试覆盖率，可衡量自动化测试执行的代码比例。

代码覆盖率工具针对特定的编程语言。 其使用一系列标准衡量覆盖率，包括代码行数、方法或函数、分支和条件。 您可以使用代码覆盖率工具识别代码库尚未被自动化测试覆盖的部分。

一般我们会用 Idea 自带的覆盖率工具，或者 JaCoCo 进行测试。当然，在代码提交时，也会在 CI 管道中进行自动化测试！下面是 Idea 覆盖率工具的截图：

![](/images/articles/2022/java-test-best-practices/test001.png)

### CI 自动化测试

CI/CD 流程可实现短迭代周期的敏捷方法，提供快速反馈，并允许少量多次地发布更新。 测试是这些短迭代周期的关键部分，用于自动验证新代码是否有效和具有破坏性。

在开发中，自动化测试会节省很多重复的操作，节约大量的时间，但是这也对测试人员的要求更高了。测试人员需要定义测试用例，有时候还需要和开发合作编写自动化测试，而且有些东西，是无法自动化测试的，也需要测试人员操作。

测试一般在 CI 管道的多个阶段进行，一般我们会分阶段运行测试，并在每一步后提供结果。

常见的 CI 测试工具/平台有：
* [GitHub Actions](https://github.com/features/actions)
* [GitLab](https://about.gitlab.com/stages-devops-lifecycle/continuous-integration/)
* [CircleCI](https://circleci.com/)
* [TravisCI](https://www.travis-ci.org/)
* [Azure Pipelines](https://azure.microsoft.com/zh-cn/services/devops/pipelines/)
* [Coveralls](https://coveralls.io/)
* [TeamCity](https://www.jetbrains.com/zh-cn/teamcity/)

## 最后

前面俺也提到了，国内有不少公司都不太注重“测试”，更有甚者，直接不招聘测试人员。而且据我观察，越差的公司/团队，越是这样，这是对自己的水平有多放心呢？虽然是任何人都无法避免 bug，但能及时发现并修复总是好事儿吧，在优秀的团队里面做事，共同努力才是最好的结果，不是么？

在我刚参加工作时，同样也不怎么了解这一块，曾经也在没有测试、不写单元测试的公司带过，其中的风险可想而知。不是说做好测试线上就一定没问题，而是好的测试，能够最大程度上避免线上问题，甚至能让你提前准备针对线上问题的预案。曾经我想学好单元测试时，找不到地方学，因为公司没人写，问朋友也不会。最终还是去看书——《Java 测试驱动开发》，虽然这本书并不是 100 % 读完和消化完了，但是它的思想，深深影响着我。。。

还有个怪事儿，一般我学习一个东西怎么写的时候，因为担心自己想出来的方式太差，就喜欢去 GitHub 上面找一些看上去不错的项目，研究人家的代码实现。但唯独这一次，可能是个例外，我发现很多的“系统”项目，比如 XX 管理系统、XX 商城，几乎都没写单元测试🥲甚至是一些商业公司做的开源项目也是。当然，最后还是找到一些优秀的团队的项目，看着人家的代码学了学单元测试怎么写，而且很多都是真实场景实践出来的。 像者优秀的人学习，自己也能变好，虽然自己很多地方经验也有所欠缺，但只要不断学习、踩坑，相信我的代码可靠性也会越来越高的😊