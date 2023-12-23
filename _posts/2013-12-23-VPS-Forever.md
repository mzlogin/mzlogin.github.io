---
layout: post
title: 永久免费的VPS  
categories: VPS
description: 永久免费的VPS
keywords: VPS
---

# 永久免费的VPS

&emsp;&emsp;永久免费的VPS:https://dashboard.render.com/

需要在Github上搭建render知识库

```
# 使用 Ubuntu 22.04 作为基础镜像
FROM ubuntu:22.04

# 安装 Shellinabox
RUN apt-get update && \
    apt-get install -y shellinabox && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# 设置 root 用户的密码为 'root'
RUN echo 'root:frepai' | chpasswd

# 暴露 22 端口
EXPOSE 22

# 启动 Shellinabox
CMD ["/usr/bin/shellinaboxd", "-t", "-s", "/:LOGIN"]

```

VPS申请完成之后，需要安装最基础的软件包，因为我们申请的是底层的unbutu操作系统，操作性非常强，需要什么就安装什么！

更新系统
apt update

安装基础软件包
apt install sudo curl wget nano screen git

安装neofetch工具
sudo apt install neofetch

调用显示系统信息命令
neofetch

当出现如下信息，就说明VPS已经安装成功

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/de5b8553-4267-4b6f-94a8-7ceb054ecfa9)

由于是Ubuntu的基础安装包，因此动手性必须好！





