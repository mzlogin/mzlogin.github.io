---
layout: fragment
title: OpenWrt 部署 VPS
tags: [OpenWrt]
description: OpenWrt部署到VPS
keywords: OpenWrt, VPS, deploy
---

# 将OpenWrt部署到VPS

## 必要条件

### 1. Ubuntu或者Debian系统

### 2. 已经安装**wget**，或者使用下面命令安装**wget**

```
apt update && apt install -y wget 
    
```

## 步骤：

### 1、上传OpenWrt固件（WinSCP或首选），重命名为op.img.gz

### 2、运行下面这个命令

```
bash -c "$(wget -O- https://git.io/JZOn0)"
    
```

### 3、如果你的http证书有问题，请尝试如下操作：

```
wget --no-check-certificate -O- https://git.io/JZOn0|bash
    
```

    
--------------
