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

## 替换私钥和V6地址，并就进行CloudFlare IP优选

'''
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
