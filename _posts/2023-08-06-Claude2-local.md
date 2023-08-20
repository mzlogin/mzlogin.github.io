---
layout: post
title: 本地部署Claude2的两种办法
categories: [Claude2]
description: 本地部署Claude2的两种办法
keywords: Claude2,Docker
---

# 本地部署Claude2的两种办法

## 1、使用镜像网站 https://www.claudeai.ai/zh-CN

首先，有大神建立了一个可以在国内运行的镜像网站，在国内网络环境中直接运行就可以

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/ac7b8115-5e0f-491e-8528-c1a01c29c6cc)

输入一个邮箱地址，邮箱中就可以收到一个临时验证码，点击进去它会出现如下页面

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/8d555b8f-3b56-4290-9c81-438ae966263d)

然后就可以像使用Claude2网站一样了

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/36c6366c-b055-4467-b918-ae03df68ccee)


## 2、在本地做一些基础工为使用Claude2做准备

首先，打开自己的Claude.ai网站，登录进去，

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/f6df07f2-dc43-4e97-9a3a-46da0adf7232)

在页面上空白出点击鼠标右键，点击最下面的检查

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/1e561250-8205-42c2-9f53-645c3124ad46)

出现如下页面

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/c3155257-f958-4d1e-9ebf-38e8a7110766)

点选网络中的chat_conversation，选中https://claude.ai/api/organizations/0eexxxxxxxxxxxxxxxxxxxxx/chat_conversations,这个字符串0eexxxxxxxxxxxxxxxxxxxxx。

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/b0eeb431-7c5a-4249-90fd-5c772506bcfe)

再点选应用中sessionKey的值

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/c6f9658c-a59c-4bba-85bf-d4c7af8f9460)

打开网站：

https://github.com/UNICKCHENG/openai-proxy

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/9da5901a-c924-4b67-97de-6cfd311b36a2)

Vercel进行自动部署

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/341e8eee-091b-4f99-af86-09e58a2280c8)

看到如下界面就说明部署完成了

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/ac13d46c-9fe6-40ad-a6e0-cb205c7294f4)


![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/51cf37fa-3755-48f5-a513-d764a6a1d5b4)


## 3、接下来，我们部署ChatGPT-Next-Web

首先，打开这个开源项目 https://github.com/Yidadaa/ChatGPT-Next-Web

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/de9a194b-0a76-4926-9b05-984614ded2c7)

为其命名，然后进行部署

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/9b9b8c82-188f-4976-8756-1758faf6c451)

这里需要填写我们在上一步拷贝出来的sessionKey的值，以及自定义一个密码，简单也可复杂也可以

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/9172e977-6446-40da-a91c-7fc43773a1f2)

部署完成后，点击setting

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/ec1a5f43-eb7b-4dfb-b1e1-8aa24945bd4a)

增加一个变量BASE_URL:  PROXY_URL/claude/organization_uuid/conversation_uuid



