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

向服务商购买一张常见的 DV 通配符 SSL 证书，通常每年价格在数百至一千多元人民币不等；若名下有多个域名需要使用证书，总费用每年可能达到数千元。

在当前强调降本增效的环境下，若评估后认为免费证书能够满足需求，小公司和个人网站即可节省相应成本。

## Let's Encrypt 简介

Let's Encrypt 是一家免费、开放、自动化的公益性证书颁发机构（CA），由互联网安全研究组（ISRG）运作，属于非营利组织。其目标是推广 HTTPS 的应用，为构建更安全、尊重隐私的互联网提供免费而便捷的支持。

## 操作方法

根据不同使用环境，Let's Encrypt 提供多种验证与获取证书的方式。常用工具是 Certbot，详见文档：<https://eff-certbot.readthedocs.io/en/stable/>。

在部分环境中，可配置工具定期自动续期，减少维护工作。

由于服务器环境较为老旧，且需要将证书上传至阿里云并部署到多个云服务，本文暂采用“本地生成证书—手动上传与更新”的方式。

### 0x01 在本地生成证书

本文使用 Docker 运行 Certbot，参见文档：<https://eff-certbot.readthedocs.io/en/stable/install.html#alternative-1-docker>。

生成通配符证书的示例命令如下：

```bash
docker run -it --rm --name certbot \
  -v '/Users/mazhuang/some/path/letsencrypt:/etc/letsencrypt' \
  certbot/certbot certonly \
  --preferred-challenges dns \
  --manual \
  --server https://acme-v02.api.letsencrypt.org/directory \
  --key-type rsa --rsa-key-size 2048
```

- `--preferred-challenges dns`：使用 DNS 方式进行域名验证；
- `--manual`：以交互式方式进行询问与操作；
- `--key-type rsa --rsa-key-size 2048`：生成 2048 位 RSA 私钥（部分阿里云服务不支持默认的 ECC 证书）。

执行后会依次询问邮箱、协议授权、域名等信息，随后提示添加 DNS TXT 记录以完成域名所有权验证，按提示操作即可。

生成成功后，证书与私钥保存在挂载的本地目录中，例如上述命令中的 `/Users/mazhuang/some/path/letsencrypt/archive/{domain name}`。各文件的说明可参考：<https://eff-certbot.readthedocs.io/en/stable/using.html#where-certs>。

### 0x02 上传和部署证书

将证书上传到阿里云的数字证书管理服务。可使用其一键部署功能（付费），或在各云服务中手动选择使用该证书（免费），按需取用。

### 0x03 定期更新证书

Let's Encrypt 颁发的证书有效期为 90 天，建议在到期前 30 天内更新。可重复步骤 0x01 生成新证书，然后上传并部署。

## 小结

以上步骤简单、成本为零。对小公司和个人网站而言，是节省 SSL 证书费用的可行方案。

若环境允许，建议配置自动化续期，进一步降低维护成本，按需采用。

## 参考链接

- https://letsencrypt.org/zh-cn/
- https://eff-certbot.readthedocs.io/en/stable/