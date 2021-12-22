---
title: "世纪互联OneDrive搭建OneIndex"
date: 2020-04-18T21:57:07+08:00
categories: ["技术"]
tags: ["OneDrive","Linux","OneIndex"]
---

## 前言

众所周知，国际版OneDrive在国内的访问速度并不理想(多线程下载除外)，所以我们就需要相对而言速度更快的世纪互联版OneDrive来体验体验了。

## 准备

首先，得有一个世纪互联版的OneDrive，其次一个域名和一台vps。

## 安装

### 登录Azure Active Directory

登录[Azure Active Directory](https://portal.azure.cn/)注册应用。选择`应用注册`

![](/images/tech/2020/onedrivecn/onedrivecn01.png)

然后我们点击`新注册`

![](/images/tech/2020/onedrivecn/onedrivecn02.png)

这里的名称可以随便取，然后选择受支持的账户类型为`任何组织目录(任何Azure AD 目录- 多租户)中的账户`，回调地址填你的网站的地址，然后单击注册。

![](/images/tech/2020/onedrivecn/onedrivecn03.png)

然后我们能看到`应用程序(客户端)ID`，这个就是你的应用ID。然后接下来要进行`应用机密配置`和`API权限配置`。

![](/images/tech/2020/onedrivecn/onedrivecn04.png)

先进行`应用机密配置`，选择`新客户端密码`，然后自己随意即可！

![](/images/tech/2020/onedrivecn/onedrivecn05.png)

然后复制你的`应用机密`并保存，注意，**只能复制一次！！！**

![](/images/tech/2020/onedrivecn/onedrivecn06.png)

然后配置`API权限`，勾选`Files.ReadWrite`和`Files.ReadWrite.All`即可。

![](/images/tech/2020/onedrivecn/onedrivecn07.png)

### 安装OneIndex

这一步需要到vps上进行，项目是这个👉[oneindex2-in](https://github.com/lzx8589561/oneindex2-in)

![](/images/tech/2020/onedrivecn/onedrivecn08.png)

> 设置config/、config/base.php 、 cache/ 可读写
>
> 复制刚才的`应用程序(客户端) ID`到`应用ID`栏中
>
> 复制刚才的`应用机密到oneindex`的`应用机密`栏中
>
> 其中配置参数为世纪互联前缀`https://**xxx-my**.sharepoint.cn`填写加粗部分`xxx-my`
>
> 回调地址填写你的网址，例如`https://cdn.baidu.com`

### 特殊文件实现功能

`README.md`、`HEAD.md` 、 `.password`特殊文件使用

可以参考https://github.com/donwa/oneindex/tree/files

**在文件夹底部添加说明:**

> 在 OneDrive 的文件夹中添加`README.md`文件，使用 Markdown 语法。

**在文件夹头部添加说明:** 

> 在 OneDrive 的文件夹中添加`HEAD.md` 文件，使用 Markdown 语法。

**加密文件夹:** 

> 在 OneDrive 的文件夹中添加`.password`文件，填入密码，密码不能为空。  

**直接输出网页:**

> 在 OneDrive 的文件夹中添加`index.html` 文件，程序会直接输出网页而不列目录。
> 配合 文件展示设置-直接输出 效果更佳。

### Nginx伪静态设置

```xml
if (!-f $request_filename){
    set $rule_0 1$rule_0;
}
if (!-d $request_filename){
    set $rule_0 2$rule_0;
}
if ($rule_0 = "21"){
	rewrite ^/(.*)$ /index.php?/$1 last;
}
```

### 命令行功能

仅能在`php cli`模式下运行

**清除缓存:**

```bash
php one.php cache:clear
```

**刷新缓存:**

```bash
php one.php cache:refresh
```

**刷新令牌:**

```bash
php one.php token:refresh
```

**上传文件:**

```bash
php one.php upload:file 本地文件 [onedrive文件]
```

**上传文件夹:**

```
php one.php upload:folder 本地文件夹 [OneDrive文件夹]
```

**例如：**

```
//上传demo.zip 到OneDrive 根目录  
php one.php upload:file demo.zip  

//上传demo.zip 到OneDrive /test/目录  
php one.php upload:file demo.zip /test/  

//上传demo.zip 到OneDrive /test/目录并将其命名为 d.zip  
php one.php upload:file demo.zip /test/d.zip  

//上传up/ 到OneDrive /test/ 目录  
php one.php upload:file up/ /test/
```

### Shell计划任务

设置每小时刷新一次Token ，任务周期选择每小时，0分钟，脚本内容为：`php /程序具体路径/one.php token:refresh` 

设置每十分钟后台刷新一遍缓存,任务周期改为N分钟-10分钟，脚本内容为：`php /程序具体路径/one.php cache:refresh`

> 具体路径为你网站根目录路径,PHP后有空格请注意。

### 其它玩法：

推荐看看大佬们怎么玩的吧。

我习惯用服务器下载电视剧或者电影，然后同步到OneDrive，然后在线观看，非常清晰的呢！！！

可以访问我的由国际版OneDrive和Google Drive搭建的[站点](https://mirrors.52bess.com)哦！！！