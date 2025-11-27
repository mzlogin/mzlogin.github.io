---
layout: post
title: 借助 Let's Encrypt 节省 SSL 证书费用
categories: [DevOps]
description: 小公司和个人网站如何借助 Let's Encrypt 免费获取 SSL 证书，从而节省成本。
keywords: Let's Encrypt, HTTPS, 免费证书, 小企业, 个人网站
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

向服务商购买一张最常见的 DV 通配符 SSL 证书一年大概在几百到一千多人民币不等，名下如果有多个域名需要申请证书，每年也得花个几千块。

如今各行各业都在降本增效，能省则省。对于小公司和个人网站来说，如果评估过后觉得免费证书能满足需求，那么就可以省下对应的费用。

## Let's Encrypt 简介

Let's Encrypt 是一家免费、开放、自动化的公益性证书颁发机构 (CA)， 由互联网安全研究组 (ISRG) 运作，属于非营利组织，旨在推广 HTTPS 技术的应用，从而构建更加安全且尊重隐私的互联网环境。致力于提供免费便捷的服务，以此帮助所有网站部署 HTTPS。

## 操作方法

根据不同的使用环境，Let's Encrypt 提供了多种验证和证书获取方式。最常用的方式是使用 Certbot。详细的使用介绍可以参考文档 <https://eff-certbot.readthedocs.io/en/stable/> 。

有一些环境可以直接配置让工具定期自动更新证书，一劳永逸。

我这边因为服务器环境比较老旧，且需要将证书上传到阿里云然后部署到多个不同的云服务，所以目前暂时采用本地生成证书-手动上传和更新的方式。

### 0x01 在本地生成证书

我这里使用 Docker 来运行 Certbot 工具，对应文档：<https://eff-certbot.readthedocs.io/en/stable/install.html#alternative-1-docker> 。

我这边是生成通配符证书，采用的命令如下：

```bash
docker run -it --rm --name certbot -v '/Users/mazhuang/some/path/letsencrypt:/etc/letsencrypt' certbot/certbot certonly --preferred-challenges dns --manual --server https://acme-v02.api.letsencrypt.org/directory --key-type rsa --rsa-key-size 2048
```

- `--preferred-challenges dns` 参数，表示使用 DNS 方式进行域名验证；
- `--manual` 参数，表示使用交互式方式询问和操作；
- `--key-type rsa --rsa-key-size 2048` 参数，表示生成 RSA 加密类型的私钥，长度为 2048 位；（这里是因为阿里云有些云服务不支持默认生成的 ECC 类型的证书）

执行后会依次询问邮箱、同意协议、输入域名等信息，最后会提示添加 DNS TXT 记录以完成域名所有权验证，按提示操作即可。

若执行成功，证书和私钥会保存在挂载的本地目录中，比如上面命令中的 `/Users/mazhuang/some/path/letsencrypt/archive/{domain name}`。关于生成的文件的说明可以参考 <https://eff-certbot.readthedocs.io/en/stable/using.html#where-certs>。

### 0x02 上传和部署证书

将证书上传到阿里云的 数字证书管理服务，然后可以使用它提供的一键部署功能（付费），也可以自行到各个云服务中手动选择使用该证书（免费），丰俭由人。

### 0x03 定期更新证书

Let's Encrypt 颁发的证书有效期为 90 天，建议在到期前的 30 天内更新证书。可以重复步骤 0x01 来生成新的证书，然后再上传和部署。

## 小结

以上步骤并不复杂，且完全免费。对于小公司和个人网站来说，是一个不错的节省 SSL 证书费用的选择。

如果环境允许，可以配置自动化更新，进一步降低维护成本。有需要的朋友可以酌情考虑使用。

## 参考链接

- https://letsencrypt.org/zh-cn/
- https://eff-certbot.readthedocs.io/en/stable/