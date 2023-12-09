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

按照阿里云的操作指南 [https://help.aliyun.com/zh/icp-filing/fill-in-app-feature-information][1] 进行操作时，在公钥与签名 SHA1 值获取这一步遇到了问题：我们证书的类型与指南中显示的不同，是 Distribution Managed 类型的，苹果开发者网站上不提供下载，自然也就无法直接拿到公钥和 SHA-1 指纹了。

到了这个时间点，这类问题我当然不会是第一个遇到和解决的，经过一番搜索，找到了可行的参考方法：[https://blog.csdn.net/weixin_50340188/article/details/133023592][2]，这里将完整的操作步骤也做个记录。

1. 访问 <https://developer.apple.com/cn/>，使用 App 对应的 iOS 开发者账号登录；
2. 在计划资源中点击证书进入证书列表页面：
    ![](/images/posts/ios/view-certificates.png)
3. 在证书列表页面 F12 打开浏览器开发者工具，刷新页面，在网络标签中找到 certificates 这次请求，在响应内容的 data 数组里找到需要的那个证书的 attribites.certificateContent 字段，如图所求；
    ![](/images/posts/ios/ios-certificate-content-field.png)
4. 将 attributes.certificateContent 字段的完整内容复制保存到一个新的文本文件中，并将该文本文件后缀名改为 .cer，如 test.cer；
5. 将 test.cer 文件传送到一台 **Windows 电脑**，双击打开，切到详细信息标签，分别点击上面的公钥、指纹，下方显示的字段值就是我们需要的，用 Ctrl-A、Ctrl-C、Ctrl-V 将它们复制出来即可。
    ![](/images/posts/ios/public-key.jpeg)
    ![](/images/posts/ios/finger-print.jpeg)

实测可行，已顺利通过审核。


## 参考

- [https://help.aliyun.com/zh/icp-filing/fill-in-app-feature-information][1]
- [https://blog.csdn.net/weixin_50340188/article/details/133023592][2]

[1]: https://help.aliyun.com/zh/icp-filing/fill-in-app-feature-information 
[2]: https://blog.csdn.net/weixin_50340188/article/details/133023592