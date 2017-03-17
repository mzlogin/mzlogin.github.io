---
layout: post
title: Kloudsec 挂了，GitHub Pages 去 HTTPS 化
categories: GitHub
description: 收到 Kloudsec 将停止服务的消息，决定将 GitHub Pages 去 HTTPS 化。
keywords: Kloudsec, GitHub Pages
---

前天收到来自 Kloudsec 的邮件，说 Kloudsec 将于 2016/08/01 停止服务。Bad news，请容许我做一个悲伤的表情。

## 邮件原文

> Hi all,
> 
> It is with great sadness that I have to inform you that Kloudsec is shutting down.
> 
> **Why is Kloudsec shutting down?**
> 
> 1. We have been funding Kloudsec out of our own pocket
> 2. Kloudsec is very expensive to maintain (upwards to $10000 / month)
> 3. We are unable to make money from Kloudsec, nor raise any funds for it
> 
> **We will shut Kloudsec down on 1st August**
> 
> From now till then, we will not be maintaining the service.
> 
> **Migrating out of Kloudsec**
> 
> Migrating out of Kloudsec is extremely simple. All you have to do is to point your domain back at its origin server. 
> 
> You will lose the HTTPS cert. But you can fix that by 
> 
> * either issuing your own LetsEncrypt certificate 
> * or using Cloudflare.
> 
> **Lessons learnt**
> 
> From the start, we are extremely lucky to have a small revenue stream that let us to experiment with cool products. And Kloudsec is one of our biggest experiment.
> 
> There are a couple of things we did right, and a couple we did wrong.
> 
> We did right by having the right team come together, building a seriously sophiscated product. (Thank you Ivan and Bach)
> 
> We did wrong by building a sophiscated product that made it hard for a small team to maintain, let alone scale.
> 
> We did wrong by building a product that was not immediately useful enough so much so that people will pay for.
> 
> We did wrong by building a product that was too expensive to maintain.
> 
> We did wrong by assuming that traction solves all ailments. Not in Singapore, you don't. There is no good venture money for real hard-tech software startups in Singapore.
> 
> We did right with pulling the plug so we can learn from these mistakes and work on the next product.
> 
> **What's next for us**
> 
> From Kloudsec, we identified a few niche problems that we will be looking to solve. In other words, we will continually be building.
> 
> And you can be sure from our next product onwards, we will charge right from day 1 so we can sustain the product financially.
> 
> Lastly, thank you!
> 
> Thank you. Most of you have spoken to me, or read the posts I've written on Github, on Hacker News, or Producthunt about Kloudsec. You guys took a leap of faith in trusting this small unknown team and product, and used us.
> 
> I'm sorry to disappoint you with this piece of news, but I'll try better next time.
> 
> If you like, you can follow me on Twitter at @nubela. You can also contact me at anytime at steven@nubela.co
> 
> Steven Goh.

## 我的决定

Sigh!

想起五月份的时候我还欢天喜地地给博客 HTTPS 化了，并为此写了一篇博客 [为绑定域名的 GitHub Pages 启用 HTTPS](http://mazhuang.org/2016/05/21/enable-https-for-github-pages/)，还将它推荐到了 [掘金](http://gold.xitu.io/entry/574f7ea17db2a20055c3b818/detail)，收获了 64 次收藏，并在那篇文章下创下了我个人博客单篇评论数最多的记录。

没想到还没等到 Kloudsec 第一次为我的域名证书自动续期，它家的服务就要关停了。

但也没有办法，使用第三方的服务，特别是初创公司的服务本就有这种风险。

本来 GitHub Pages + Custom Domain + HTTPS 也还有其它解决方案，但我已不想再折腾了，多引入一层中间服务，就多一层出状况的风险，我只是想作一名安静地写博客的美男子啊。

所以决定去掉自定义域名的 HTTPS，恢复 HTTP，现在 GitHub Pages 已经支持 `*.github.io` 域名的 HTTPS，除非哪天它原生支持 Custom Domain 的 HTTPS，否则我不再折腾这个事情。

## 采取的措施

当初之所以想开启 HTTPS 的一个重要原因就是 Google 收录了博客的 HTTPS 链接，但是证书不对导致用户打不开或者有警告，既然使用自定义域名没有办法让证书对，那就让 Google 不收录 HTTPS 的链接吧。

### 告诉 Google 不收录 HTTPS 链接

如果一个页面使用 HTTPS 和 HTTP 都能访问，那如果想 Google 只收录 HTTP 版，而不收录 HTTPS 版，那可以在页面的 `head` 里添加 `canonical` 给爬虫以建议，具体方法如下：

```html
<link rel="canonical" href="http 开头的 URL">
```
