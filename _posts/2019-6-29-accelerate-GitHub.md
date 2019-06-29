---
layout: post
title: 解决 GitHub push 速度过慢
categories: [Github]
description: 
excerpt: 通过修改 hosts 文件加入 GitHub 的 host 地址 
keywords: GitHub, push
---

## 解决 GitHub push 速度过慢

> 通过修改 GitHub 的 hosts 文件选取速度较快的 IP 地址

### 查询域名 IP

进入 [https://www.ipaddress.com/](https://www.ipaddress.com/) 查询 `github.com`和`github.global.ssl.fastly.net`对应的 IP 。

### 修改 `hosts` 文件

打开`hosts`文件，Windows下路径为`C:\Windows\System32\drivers\etc`。

在末尾加入：

```bash
151.101.***.*** github.global.ssl.fastly.net
192.30.***.*** github.com
```

其中，前面的`151.101.***.***`和`192.30.***.***`为之前查到的 IP 。

### 刷新 DNS (可选)

在`cmd`中输入`ipconfig/flushdns`刷新`DNS`

### 结果

测试发现速度有所提升，但并没有上百。

由原来的`10-20K`增加为`50-60K`。


