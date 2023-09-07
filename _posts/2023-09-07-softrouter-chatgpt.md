---
layout: post
title: 在软路由中搭建自己的ChatGPT，无需梯子
categories: ChatGPT
description: 在软路由中搭建自己的ChatGPT
keywords: chatgpt，softrouter
---

# 在软路由中搭建自己的ChatGPT，无需梯子

## 1、首先获取自己的OpenAI中API Key

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/302ca2fd-c678-4846-9d72-2a489b35fe99)

## 2、打开软路由中Docker，创建新的Docker容器，打开命令行，输入如下命令：

```
docker run \
       --name chatgpt-web \
       -p 3002:3002 \
       --env OPENAI_API_KEY=Your key \
       --restart always \
       -d chenzhaoyu94/chatgpt-web:latest
```

将API Key替换成自己获取的，提交

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/2548a923-5e81-4659-a157-2002a0b9ff75)

然后启动就可以了，随后在浏览器中输入自己的软路由IP地址:3002,就可以直接访问了。

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/6d41ae15-40f8-4485-a6b5-c7016e7acbd5)

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/c5db2ced-ad94-4b0c-bcc9-913e631b0386)

速度很快，回答的问题与ChatGPT相当。

好处是，不再需要梯子，也不需要账号登陆，而且所提问题不会在OpenAI中留下记号！
