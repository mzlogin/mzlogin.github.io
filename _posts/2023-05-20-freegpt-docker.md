---
layout: post
title: 在本地Docker上部署FreeGPT
categories: [FreeGPT]
description: 在本地Docker上部署FreeGPT
keywords: FreeGPT,Docker
---

# 在本地Docker上部署FreeGPT

## 1、首先确保本地已经安装了Docker，并且启用Docker

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/34c7ed09-210f-4dc8-896d-19995c3fd8ba)

## 2、Windows系统中Powershell用管理员身份运行：

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/654b8b73-2081-41ff-843c-1537dbefdf0a)

## 3、在Powershell命令行输入如下指令：

   docker pull ramonvc/freegpt-webui

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/7254e834-2d7d-494c-b44f-fd2e34030a9a)

## 4、在第一条指令运行完毕后，接着输入如下指令：

docker run -p 1338:1338 ramonvc/freegpt-webui

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/244776a8-9f66-46ab-a6fb-14f8c8367534)

## 5、等待上面命令执行完毕，接着在浏览器中运行如下指令：

http://127.0.0.1:1338，或者  http://localhost：1338

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/6aec3463-5eae-4549-a919-5c6cda05ab6a)

