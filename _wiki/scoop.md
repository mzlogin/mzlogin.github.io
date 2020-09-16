---
layout: wiki
title: Scoop
categories: Windows
description: Windows 下好用的包管理工具。
keywords: scoop, windows
---

## 指定 Scoop 安装目录

环境变量：

```
SCOOP='D:\Applications\Scoop'
```

## 指定安装程序自定义目录

设置 `SCOOP` 环境变量后，程序会默认安装在 `%SCOOP%\apps` 目录下。

还可以自定义全局安装目录：

```
SCOOP_GLOBAL='D:\Applications\ScoopApps'
```

这样需要 `scoop install -g <appname>` 来全局安装，需要使用管理员权限执行。

## 加快下载速度

```
scoop install aria2
```

## 软件下载

安装到默认目录：

```
scoop install <appname>
```

安装到全局安装目录：

```
scoop install -g <appname>
```

软件搜索：

```
scoop search <appname>
```

列出已知 bucket：

```
scoop bucket known
```

添加 bucket：

```
scoop bucket add <bucketname>
```

## 查看软件信息

列出已安装软件：

```
scoop list
```

查看某软件信息：

```
scoop info <appname>
```
