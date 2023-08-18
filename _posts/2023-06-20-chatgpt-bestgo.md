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

2、Dshaboard
![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/f91cec71-bb31-4ea4-9eca-1592dad581a8)



部署示例 https://pandora-cloud-demo.vercel.app
部署示例 https://pandora-cloud-demo.vercel.app










等待几分钟即可部署完成







绑定自己的域名无需翻墙国内直接访问





自己要绑定的域名填入以下的位置并ADD增加




此时他会要求我们做如下CNAME




那么我们将自己的域名CNAME到vercel给你的域名即可
打开Cloudflare做如下配置




稍微等待一会，刷新，直到没有错误提示即可




此时(有可能还得等待一会5分钟)就可以用自己的域名无需翻墙国内直接访问

使用方法：
一）账号密码登录

打开网址  https://wz.5589757.xyz

输入自己的chatgpt账号密码即可使用





二）token登录

1、正常登陆  chat.openai.com 

2、获取token    chat.openai.com/api/auth/session 

3、输入token     https://wz.5589757.xyz    登录上之后14天内免登陆，不需要梯子

