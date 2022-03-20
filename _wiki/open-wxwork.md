---
layout: wiki
title: 企业微信
cate1: 开放平台
cate2:
description: 企业微信开发过程中的一些知识点记录。
keywords: 企业微信
---

企业微信开发过程中的一些知识点记录。

## 问题及解决方案

### redirect_uri需使用应用可信域名

![](/images/wiki/wxwork-redirect-uri.jpg)

遇到过两种情况出现这个提示。

一、环境搞混了，应用主页使用构造的 OAuth2 链接，其中的 appid 与 redirect_uri 里的域名不对应。

比如正在配置 UAT 环境应用，但是将 FAT 环境应用的 OAuth2 链接复制过来之后，忘了修改 appid，只修改了链接中的域名，遇到该问题，后来将 appid 修改成 UAT 环境应用的就正常了。

二、修改了可信域名之后，出现该提示。

修改了 UAT 环境应用（未在企业微信提交上线）的可信域名之后，遇到了该提示，因为是测试环境，直接将测试安装的企业删除后重新测试安装，就正常了。

但修改了生产环境应用（已在企业微信提交上线）的可信域名之后，一直是该提示，清除手机上的企业微信缓存，杀应用进程等都无效，点击应用主页还是一直跳旧链接。最后搜索到这个链接：[企业微信开发中，可信域名可以修改吗？][1]，官方回复为：

> 你好，可以修改，第三方应用修改可信域名，没上线的需要重新授权，已上线的需要重新提交审核，才会生效。

将应用在企业微信服务商管理后台提交上线审核通过后恢复正常。

### 企业微信回调报 Base64 错误

具体报错信息：

```
java.lang.IllegalArgumentException: Last encoded character (before the paddings if any) is a valid base 64 alphabet but not a possible value. Expected the discarded bits to be zero.
	at org.apache.commons.codec.binary.Base64.validateCharacter(Base64.java:803)
	at org.apache.commons.codec.binary.Base64.decode(Base64.java:482)
	at org.apache.commons.codec.binary.BaseNCodec.decode(BaseNCodec.java:481)
	at org.apache.commons.codec.binary.BaseNCodec.decode(BaseNCodec.java:465)
	at org.apache.commons.codec.binary.Base64.decodeBase64(Base64.java:699)
	at com.qq.weixin.mp.aes.WXBizMsgCrypt.<init>(WXBizMsgCrypt.java:63)
```

在网上找到一个记录相同报错的链接：<https://blog.csdn.net/qq_36830575/article/details/106646545>

最终确认确实是由于项目依赖的 commons-codec 包被升级到 1.13 以上（我们是升到了 1.14），导致 EncodingAESKey 解码失败。我采用了不同于上面那个链接的另一种解决办法，将 WXBizMsgCrypt 里的 `Base64.decodeBase64` 改为了 `Base64Utils.decodeFromString`，其中 `Base64Utils` 是 Spring 自带的工具类，经测试可以正常兼容。

更进一步的原因，大致意思是 commons-codec Base64 在解码时，面对非法的输入（比如最后的几个补位应该都是 0，但是混入了 1）的情况，应该拒绝，但老版本还是尝试给它解码了一个结果出来，而这个解码后的结果再次编码会生成另一个值，这可能会产生安全漏洞。

相关讨论见：

- <https://issues.apache.org/jira/browse/CODEC-134>
- <https://issues.apache.org/jira/browse/CODEC-270>
- <https://issues.apache.org/jira/browse/CODEC-279>

## 参考链接

- [企业微信开发中，可信域名可以修改吗？][1]
- [关于网页授权的可信域名][2]

[1]: https://developers.weixin.qq.com/community/develop/doc/0006acd7bd8b9063105bf7a295b800
[2]: https://work.weixin.qq.com/api/doc/90000/90135/91335#%E4%BD%BF%E7%94%A8OAuth2%E5%89%8D%E9%A1%BB%E7%9F%A5
