---
layout: post
title: 让 Tapd 的源码关联功能支持 Gitee 平台
categories: Tools
description: 让 Tapd 的源码关联功能支持 Gitee 平台
keywords: Gitee, webhook, Tapd
---

Tapd 是腾讯提供的越来越完善的项目管理工具，Gitee 是国内相对比较稳的代码托管平台。本文记录了让 Tapd 的源码关联功能支持 Gitee 平台的方法，及摸索过程中遇到的问题的解决步骤。

## 背景

想要使用 Tapd + Gitee 的组合来管理业余项目，但 Tapd 目前官方支持的代码托管平台只有 Gitlab、GitHub 和腾讯工蜂，并不能直接支持 Gitee，直觉上 Gitee 是基于 Gitlab 开发的，所以尝试在 Tapd 里开启了 Gitlab 服务，然后直接将 webhook 地址配置到 Gitee 项目里，却并不能生效。

## 求索

这种问题我应该肯定不是第一个遇到，于是在 Tapd 的论坛里搜索 Gitee 关键字，果然在帖子 <https://www.tapd.cn/forum/view/67001> 里找到了方案。

## 方案

方案的原理简单来说就是 Gitee 在触发 webhook 时，向目标网址发起的请求和 GitLab 很雷同，只是有个别 Header 的名字不一样，但缺失特定的 Header 信息后无法正常触发 Tapd 的源码关联，所以可以通过 Nginx 反向代理来将缺失的 Header 补全，然后将请求转发给 Tapd 即可。

### 方案示意图

![](/images/posts/tools/webhook-gitee.png)

对比直接支持的 Gitlab 的示意：

![](/images/posts/tools/webhook-gitlab.png)

所以前提条件是你有一个可以在公网访问到的 Nginx 服务器，且可以自己修改配置。

网友介绍方案及原理的 GitHub 仓库：<https://github.com/notzheng/Tapd-Git-Hooks>

### 操作步骤

1. 在 Tapd 项目里开启 Gitlab 服务；

2. 在你可用的公网 Nginx 服务器的配置文件里添加一段配置：

    ```
    server {
      listen 80;
      server_name tapdhooks.yourdomain.com;
      location ~ ^/(\d+)/([a-z0-9]+) {
        proxy_set_header X-Gitlab-Event $http_X_Gitee_Event ;
        proxy_set_header X-Gitlab-Token $http_X_Gitee_Token ;
        proxy_pass https://hook.tapd.cn ;
      }
    }
    ```

3. 将 tapdhooks.yourdomain.com 解析到该 Nginx 服务器 IP；

4. 将替换过域名的 webhook 链接配置到 Gitee 项目里；

    比如原 webhook 链接：https://hook.tapd.cn/32198210/adcc961bc533c74a257ef96295812fa7

    将 `https://hook.tapd.cn` 替换成 `http://tapdhook.yourdomain.com` 得到新的链接

    http://tapdhooks.yourdomain.com/32198210/adcc961bc533c74a257ef96295812fa7

搞定！

### 小插曲

事情就是这么简单，但往往实操的时候不会这么顺利，会有些小插曲，比如我就遇到了。

如上配置之后，我向 Gitee push 代码却发现并没有在 Tapd 看到源码关联，在 Gitee 配置 webhook 的地方 test 了一下，报 502 bad gateway。

把 test 请求在 postman 里构造出来，然后使用 hook.tapd.cn 的原链接，请求是成功的，加上 Nginx 新增的 Header，也没有问题，但换回自己域名的链接就报 502 了。在 Nginx 服务器上将错误日志打印出来：

> 2019/09/12 15:51:25 [crit] 24721#24721: *287854 SSL_do_handshake() failed (SSL: error:1411B041:SSL routines:SSL3_GET_NEW_SESSION_TICKET:malloc failure) while SSL handshaking to upstream, client: 28.39.21.123, server: tapdhooks.yourdomain.com, request: "POST /32198210/adcc961bc533c74a257ef96295812fa7 HTTP/1.1", upstream: "https://119.29.122.86:443/32198210/adcc961bc533c74a257ef96295812fa7", host: "tapdhooks.yourdomain.com"

所以是 Nginx 向 https://hook.tapd.cn 链接发起请求时，SSL 握手错误了。

在网上搜了一些网友们的帖子后，得出的结论基本是因为客户端与服务端支持的 SSL protocol 版本不一致导致的，用工具查了一下 Tapd 服务器支持的 protocol 版本是 TLSv2，而我 Nginx 服务器的 OpenSSL 版本较低，可能不支持这个，于是先是升级了服务器上的 OpenSSL 的版本，然后通过重新编译升级了 Nginx 的 OpenSSL 版本，之后问题解决。这两步自己维护 Ngninx 服务器的同学应该不在话下，在此不再赘述，以下是我参考的链接：

- 升级服务器 OpenSSL 版本： [CentOS之——升级openssl为最新版][]
- 升级 Nginx 的 OpenSSL 版本：[nginx旧版本openssl升级][]

## 参考

- [分享一个让源码关联支持Gogs/Gitee等平台的解决方案][]
- [Tapd Git Hooks][]
- [nginx旧版本openssl升级][]
- [CentOS之——升级openssl为最新版][]

[分享一个让源码关联支持Gogs/Gitee等平台的解决方案]: https://www.tapd.cn/forum/view/67001
[Tapd Git Hooks]: https://github.com/notzheng/Tapd-Git-Hooks
[nginx旧版本openssl升级]: https://my.oschina.net/u/1449160/blog/220415
[CentOS之——升级openssl为最新版]: https://blog.csdn.net/l1028386804/article/details/53165252
