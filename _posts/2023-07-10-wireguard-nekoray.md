---
layout: post
title: 在NekoRay使用WireGuard Warp节点流量分流
categories: WireGuard
description: NekoRay使用WireGuard Warp节点流量分流
keywords: wireguard，nekoray，warp
---

# 在NekoRay中使用WireGuard Warp节点流量分流

## 首先下载NekoRay

https://github.com/MatsuriDayo/nekoray/releases

## 然后进行WireGuard节点配置

https://replit.com/@misaka-blog/wgcf-profile-generator

<center>
![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/c2aaaa2b-9fe7-49eb-a471-d99a814c6f1c)
<center>

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/7a30436a-a8a1-4ae9-8e5d-699bd310af23)

得到Team Token，通过地址得到公钥和私钥

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/c0e864d0-524b-42dc-a840-e7e14dca440c)

## 替换私钥和V6地址，并就进行CloudFlare IP优选

```
{
    "interface_name": "WARP",
    "local_address": [
        "172.16.0.2/32",
        "2606:4700:110:8f0a:fcdb:db2f:3b3:4d49/128"
    ],
    "mtu": 1408,
    "peer_public_key": "bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo=",
    "private_key": "GAl2z55U2UzNU5FG+LW3kowK+BA/WGMi1dWYwx20pWk=",
    "server": "engage.cloudflareclient.com",
    "server_port": 2408,
    "system_interface": false,
    "tag": "proxy",
    "type": "wireguard"
}
```

** 注意的是进行节点配置时要判断自己的warp的不同类型，进行正确选择，这样才能得到自己的Token，这一步。再就是IP节点优选时，要IP地址和端口在不同位置进行填写，要注意“：”的删减。**

--------------
