---
layout: fragment
title: 生成自签名证书
tags: [openssl, https]
description: 生成和应用自签名证书
keywords: openssl, https
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

## 生成自签名证书

两步走：

一、生成密钥和证书签名请求（Certificate Signing Request)：

```sh
openssl req  -newkey rsa:2048 -nodes -keyout local_self_key.pem  -out local_self_csr.pem
```

二、生成自签名证书：

```sh
openssl x509 -signkey local_self_key.pem -in local_self_csr.pem  -req -days 365 -out local_self_cert.pem
```

至此我们得到了三个文件：

- local_self_key.pem 密钥
- local_self_csr.pem 证书签名请求
- local_self_cert.pem 证书

## 使用自签名证书

比如如果我们使用 Nginx 作为服务器，那么可以在配置文件里：

```conf
# HTTPS server

server {
   listen       443 ssl;
   server_name  local.mazhuang.org;

   ssl_certificate      local_self_cert.pem;
   ssl_certificate_key  local_self_key.pem;

   ssl_session_cache    shared:SSL:1m;
   ssl_session_timeout  5m;

   ssl_ciphers  HIGH:!aNULL:!MD5;
   ssl_prefer_server_ciphers  on;

   location / {
       root   html;
       index  index.html index.htm;
   }
}
```

## 参考

- https://www.cnblogs.com/wufengtinghai/p/15559537.html
