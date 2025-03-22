---
layout: fragment
title: 给 OrbStack 配置代理
tags: [docker]
description: 给 OrbStack 配置代理
keywords: OrbStack, Docker, 代理
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

前一阵将 Docker Desktop 换成了 OrbStack，但是发现拉镜像拉不下来了，在网上查了下，一般是因为网络问题。

现在大厂的镜像源纷纷不可用了，那么比较稳定的方式还是配置代理。

给 OrbStack 配置代理的方式：

打开 Settings，在 Docker 标签的 Advanced engine config 里填入以下内容：

```json
{
  "ipv6" : true,
  "proxies" : {
    "http-proxy" : "http:\/\/127.0.0.1:54107",
    "no-proxy" : "localhost,127.0.0.1",
    "https-proxy" : "http:\/\/127.0.0.1:54107"
  }
}
```

这里的本地的代理端口是 54107，可以根据自己的代理端口进行修改。