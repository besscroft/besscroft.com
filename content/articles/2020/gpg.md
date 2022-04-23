---
title: "GPG与在GitHub上使用GPG"
date: 2020-01-30T10:29:32+08:00
tags: ["GPG","GitHub","Git"]
categories: ["技术"]
---

## GPG与在GitHub上使用GPG
### 基本过程
* 生成自己的`GPG`密钥
* 关联`GPG`公钥与`Github`账户
* 设置利用`GPG`私钥对`commit`进行签名
* 可选步骤：信任`Github`的`GPG`密钥

### 安装
使用`GitHub`的话，当然得用`Git`了。我主要`在Windows10`系统中使用`GitHub`，而在`openSUSE`中，很少使用。而在`Windows`平台的`Git`发行版中，自带了`GPG`。打开`Git Bash`，在终端输入`pgp --version`，就可以看到一些版本信息了：
```shell
$ gpg --version

gpg (GnuPG) 2.2.19-unknown
libgcrypt 1.8.5
Copyright (C) 2019 Free Software Foundation, Inc.
```
**但是！！！GPG是有多个版本的，你可以去查询相关的[Wiki](https://en.wikipedia.org/wiki/Man_page)，不同版本的GPG，可能密钥生成命令是不同的！**

### 生成GPG密钥密钥对
* 如果使用的是 2.1.17 或更高版本，复制以下命令粘贴到Git终端以生成 GPG 密钥对。(我的是2.2.19版本)：
```shell
$ gpg --full-generate-key
```
* 如果你的版本没有达到2.1.17或更高版本，那么这个命令可能是无效的。请参考[官方文档](https://help.github.com/cn/github/authenticating-to-github/generating-a-new-gpg-key)！

* 在看到提示时，你可以指定要生成的密钥类型，或按 Enter 键接受默认的 RSA and RSA。

> GitHub有支持的GPG密钥算法如下：
> * RSA
> * ElGamal
> * DSA数字签名算法
> * ECDH
> * ECDSA
> * EdDSA

* 然后输入所需的密钥长度。 Your key must be at least 4096 bits.

* 输入密钥的有效时长。 按 Enter 键将指定默认选择，表示该密钥不会过期。
> 这一步的Enter和数字0都表示不会过期。输入其它数字表示天数，字母w表示星期，m表示月份，y表示年份。如3m表示有效期3个月，依此类推，我英语不太好，希望我没说错！

* 输完之后，会让你确认一遍。
* 然后会让你输入三项东西

```shell
Real name: 这里填个人信息(随便填
Email address: 这里必须填 GitHub 帐户的经过验证的电子邮件地址
Comment: 随便填，如：mygpg
```
* 按下回车之后，就会让你设置GPG的安全密码了，先别说密码复不复杂，自己先给记住了哈！

* 最后会输出一些信息，记得保存，不过，你也可以使用如下命令来查看：
```shell
$ gpg --list-secret-keys --keyid-format LONG
```
* 为了方便，这里引用官方的案例，GPG密钥ID `3AA5C34371567BD2`：
```shell
$ gpg --list-secret-keys --keyid-format LONG
/Users/hubot/.gnupg/secring.gpg
------------------------------------
sec   4096R/3AA5C34371567BD2 2016-03-10 [expires: 2017-03-10]
uid                          Hubot 
ssb   4096R/42B317FD4BA89E7A 2016-03-10
```
* 粘贴下面的文本（替换为您要使用的 GPG 密钥 ID）。 在此例中，GPG 密钥 ID 是 `3AA5C34371567BD2`：
```shell
$ gpg --armor --export 3AA5C34371567BD2
# 以 ASCII 封装格式打印 GPG 密钥 ID
```
* 复制 GPG 密钥，从 `-----BEGIN PGP PUBLIC KEY BLOCK-----` 开始，到 `-----END PGP PUBLIC KEY BLOCK-----` 结束。
* 最后，将GPG密钥添加到GitHub账户。
### 将GPG密钥添加到GitHub账户
打开GitHub的设置，找到SSH and GPG keys这一项，添加一个新的GPG密钥，并将你刚才复制的密钥粘贴进去。

![](/images/articles/2020/gpg/gpg01.png)

![](/images/articles/2020/gpg/gpg02.png)

然后就大功告成啦！

### 利用GPG私钥对Git commit进行签名

首先，需要让Git知道签名所用的GPG密钥ID：
```
git config --global user.signingkey {key_id}
```
然后，在每次commit的时候，加上-S参数，表示这次提交需要用GPG密钥进行签名：
```
git commit -S -m "..."
```
如果你觉得每次都需要手动加上-S有些麻烦，可以设置Git为每次commit自动要求签名：
```
git config --global commit.gpgsign true
```
但不论是否需要手动加上-S，commit时都会弹出对话框，需要你输入该密钥的密码，以判断是否为本人操作。
至于其它的进阶玩法，自行Google去吧！

