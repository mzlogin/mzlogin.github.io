---
layout: post
title: 一键Vercel部署ChatGPT
categories: [ChatGPT]
description: 一键Vercel部署Pandora 潘多拉 无需api 无需翻墙 不封号 不掉线 突破各种限制 完全免费稳定的使用ChatGPT
keywords: ChatGPT，一键部署
---

# 一键Vercel部署ChatGPT，不需要科学上网，不需要API，不封号，不掉线

## 前言：

之前搭建过很多ChatGPT的开源项目，大多数都需要用OpenAI的API-KEY来运行，而日前我发现了一个非常好用的项目，只需要有一个ChatGPT账号，直接登录就可以使用，无需消耗API-KEY，无需科学上网，完全免费，真的太好用了。

## 项目简介

Pandora，一个让你畅快运行ChatGPT的容器。

Pandora实现了网页版ChatGPT的运行。后端优化，绕过Cloudflare，速度惊人。能完美解决ChatGPT的各种奇葩问题。

## 项目地址

https://github.com/pengzhile/pandora-cloud-serverless

### 1、Vercel部署：

打开网页：https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fpengzhile%2Fpandora-cloud-serverless
![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/cd37afc6-7170-45a2-bf86-fe05ec81b0ec)

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/917546e7-6a94-49be-bc33-fd40102ac2ad)

### 2、打开Dshaboard：
![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/f91cec71-bb31-4ea4-9eca-1592dad581a8)

### 3、点选上面的Domains，绑定自己的域名
![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/c6cf663c-723c-4912-ae74-bd24a03a52f8)
![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/c5056223-f1c2-4551-baea-61b5d1086b01)

### 4、添加域名
![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/52b267f2-7c85-453d-a8a7-351c5da89d5e)

### 5、进入CF，添加CNAME
![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/156a43e8-dc48-4623-b4fc-9cea790e82e0)

再回到Vecel，会提示域名已布置完成
![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/d97e632f-499a-400b-a13f-11e31a0f8f57)

此时(有可能还得等待一会5分钟)就可以用自己的域名无需翻墙国内直接访问。

### 6、使用方法：

#### 6.1 账号密码登录

打开网址  https://chat.magictube.link

输入自己的chatgpt账号密码就可以使用

### 6.2 token登录

6.2.1、登陆  chat.openai.com 

6.2.2、获取token    

chat.openai.com/api/auth/session 

6.2.3、输入token

https://chat.magictube.link

登录上之后14天内免登陆，之后需要再次获取token。

