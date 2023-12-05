---
layout: post
title: iOS｜获取 Distribution Managed 证书的 SHA-1 指纹和公钥
categories: [iOS]
description: 获取 Distribution Managed 证书的公钥和 SHA-1 指纹。
keywords: iOS, Distribution Managed, 公钥, 指纹
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

最近在处理 APP 备案的事情，其中 iOS 平台的资料里要求填写签名证书的 SHA-1 指纹和公钥。

按照阿里云的操作指南 [填写App特征信息][1] 进行操作时，在公钥与签名 SHA1 值获取这一步遇到了问题：我们证书的类型与指南中显示的不同，是 Distribution Managed 类型的，苹果开发者网站上不提供下载，自然也就无法直接拿到公钥和 SHA-1 指纹了。

## 参考

- [https://help.aliyun.com/zh/icp-filing/fill-in-app-feature-information][1]
- [https://blog.csdn.net/weixin_50340188/article/details/133023592][2]

[1]: https://help.aliyun.com/zh/icp-filing/fill-in-app-feature-information 
[2]: https://blog.csdn.net/weixin_50340188/article/details/133023592