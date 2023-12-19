---
layout: post
title: ChatGPT VPS部署和登录方式
categories: ChatGPT
description: ChatGPS虚拟机部署和登录方式
keywords: ChatGPT，ChatGPT VPS
---

# ChatGPT VPS部署和登录方式

&emsp;&emsp;自从上月OpenAI服务调整之后，原来的Pandora Cloud就彻底失效，慢慢成为了ChatGPT在AI领域的一个过客。

&emsp;&emsp;这段时间最热门的OpenAI免翻墙模式，一定是PandoraNext了，那么它有两种使用方式，一种是本地部署，一种是VPS部署。今天我就在VPS上用最简单的方式部署一下。

在GitHub上找到PandoraNext的作者的项目地址

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/51701d08-e11a-4268-8442-43489a73baee)

在Releases中找到相对应的文件，一般VPS都是Linux架构，因此我们找到对应的Linux文件地址

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/51431584-f0db-4f8f-87cc-7b30db8ddf87)

登录到自己的VPS服务器

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/a23c6d41-4f44-47e1-a12d-8e02300e91a6)

用Wget指令将Linux的文件下载到服务器中

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/5c4df873-c4f2-41b4-a353-e9ddac31e690)

然后对这个文件进行解压

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/153df3ce-264d-448f-8262-5537f78c558c)

解压后，进入文件目录

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/90ad2796-f5b0-4a54-b99d-f5b69d6643ae)

在启动PandoraNext之前，需要做两件事情，第一是获得License ID, 第二修改config.json文件

打开dash.pandoranext.com

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/fe48e8d2-c016-46e4-8478-09b94ce6d459)

然后修改config.json

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/e2962988-72cf-4546-bf08-34ae82c715a1)

修改bind中的地址及端口，把上面获得的License id复制到对应位置，修改Site_password 以及 Proxy_api_prefix

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/6b56b379-e5e9-4426-aba9-5c7ad9f945ea)

修改完了保存一下文件，然后在VPS中输入 ./PandoraNext

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/f6839e55-8365-478d-8787-2316865dace4)

在浏览器中输入vps的IP地址加端口号

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/676b071f-250c-45ec-8561-4ee1f71251f5)

然后就可以看到PandoraNext登录界面，你可以畅快免翻使用你的ChatGPT了。

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/98884a9c-4617-4766-8010-616271ad427f)

畅快使用吧

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/39e7aa09-9f93-4fa0-8541-0abe64f20df7)



























