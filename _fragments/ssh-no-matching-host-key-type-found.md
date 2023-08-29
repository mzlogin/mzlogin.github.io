---
layout: fragment
title: ssh 报错 no matching host key type found
tags: [ssh]
description: ssh 报错 no matching host key type found，解决方法记录。
keywords: ssh
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

`ssh username@xx.xx.xx.xx` 时报错：

```
Unable to negotiate with xx.xx.xx.xx port 22: no matching host key type found. Their offer: ssh-rsa,ssh-dss
```

原因是 OpenSSH 8.8 版本开始默认禁用了 ssh-rsa，详细可以参考 [OpenSSH 8.8 release note](https://www.openssh.com/txt/release-8.8)，通常情况下无感，程序会自动选择强度更高的算法，在客户端和服务端 SSH 实现版本差太远时有可能出现上述问题。

解决办法（三选一）：

一、执行 ssh 命令时添加参数：

```sh
ssh -o HostkeyAlgorithms=+ssh-rsa -o PubkeyAcceptedAlgorithms=+ssh-rsa username@xx.xx.xx.xx
```

二、修改 `~/.ssh/config` 文件，添加以下内容：

```
Host old-host
    HostkeyAlgorithms +ssh-rsa
	PubkeyAcceptedAlgorithms +ssh-rsa
```

其中 `old-host` 是你的服务器地址，如果想省事也可以直接写 `*` 全局生效。

三、升级客户端和服务端比较旧的那一个。

参考：

- [解决 ssh 找不到对应主机密钥类型 - 程序员翔仔 - 博客园](https://www.cnblogs.com/fatedeity/p/17267481.html)
