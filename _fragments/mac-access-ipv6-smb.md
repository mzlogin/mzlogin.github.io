---
layout: fragment
title: Mac 访问 IPv6 SMB 共享
tags: [mac]
description: Mac 访问 IPv6 SMB 共享的配置方法。
keywords: Mac, IPv6, SMB, 共享
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

Mac 访问 SMB 共享时，是在 Finder 中「前往」-「连接服务器」中输入 `smb://` 地址。

如果是 IPv4 地址，直接输入 `smb://192.168.1.111` 这样就可以了，但如果是 IPv6 地址，直接输入 `smb://2001:db8::1` 这样是不行的，需要在 IPv6 地址前后加上方括号，变成 `smb://[2001:db8::1]` 这样才能访问。