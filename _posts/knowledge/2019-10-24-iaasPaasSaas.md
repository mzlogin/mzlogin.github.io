---
layout: post
title: 一张图说明Iaas，PaaS和Saas的区别
categories: Knowledge
description: 一张图说明Iaas，PaaS和Saas的区别
keywords: IaaS,PaaS,SaaS
---
毕竟自己也算研究云计算的，经常有时候被学弟问起IaaS，PaaS，SaaS三者的区别是什么，每次解释一大长串但提问者也没太搞懂，今天偶然间看微信公众号，看到了 CloudBest 写的[《你是真的了解云计算吗》](https://mp.weixin.qq.com/s/6twoopgsm5SPsKrkcsaxRA)这篇文章，其中有一张图非常清楚的解释了三者的区别，特贴在此记录一下。

![区别](/images/posts/knowledge/iaaspaassaas/640.jpeg)

总结来说：

- IaaS提供给客户的服务是所有计算机的基础设施的使用，包括虚拟机，处理器（CPU），内存，防火墙，网络带宽等基本的计算机资源。
- Paas是指软件的整个生命周期都是在PaaS上完成的。这种服务专门面向于应用程序的开发员，测试员，部署人员和管理员。  
*之前我们团队做过一键部署 JavaWeb ，其实就是用k8s发布一个jetty容器，将war包部署进去，但数据还是由开发者自己管理。*
- SaaS提供给用户的服务是可以运营在“云”上的应用程序。也就是说，用户可以在各种设备连接上“云”里的应用程序，用户不需要管理或者控制任何云计算设施，比如服务器，操作系统和储存等。  
*其实我们经常用的在线软件如：腾讯文档，pdf转word之类的软件都属于广义上的 SaaS*
