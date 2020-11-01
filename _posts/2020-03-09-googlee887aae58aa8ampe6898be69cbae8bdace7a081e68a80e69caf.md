---
id: 350
title: Google自动AMP手机转码技术
date: 2020-03-09T08:38:31+08:00
author: netrob
excerpt: 谷歌毫不掩饰的强调了手机版网站的重要程度已经高于电脑版，其并推出了Web Light技术：在搜索结果中提供加载速度更快且界面更精简的移动版网页的自动转码技术。百度曾经也做过类似的尝试，就是PC网站自动转码成手机端网站。
layout: post
guid: https://www.justcn.cn/?p=350
permalink: '/google%e8%87%aa%e5%8a%a8amp%e6%89%8b%e6%9c%ba%e8%bd%ac%e7%a0%81%e6%8a%80%e6%9c%af/'
categories:
  - 推广笔记
tags:
  - APM
  - 手机转码
  - 谷歌
---
谷歌毫不掩饰的强调了手机版网站的重要程度已经高于电脑版，其并推出了Web Light技术：在搜索结果中提供加载速度更快且界面更精简的移动版网页的自动转码技术。百度曾经也做过类似的尝试，就是PC网站自动转码成手机端网站。

当用户通过连接速度缓慢的移动客户端进行搜索时，Google 会向其提供加载速度更快且界面更精简的网页。为此，我们会实时对网页进行转码（转换），从而提供适用于上述客户端的优化版网页，以提高网页加载速度并节省数据流量。我们将这种技术称为“Web Light”。Web Light 网页会保留大部分相关内容，并会为用户提供用于查看原始网页的链接。我们的实验结果表明，与原始网页相比，经过优化的网页的加载速度提高了 4 倍，字节用量减少了 80%。由于这类网页的加载速度提高了许多，因此其浏览量也增加了 50%。

### 查看网页的 Web Light 版本

在桌面设备上，使用链接&nbsp;`http://googleweblight.com/i?u=[您的网站网址]`（如： http://www.example.com）打开&nbsp;<a rel="noreferrer noopener" href="https://developer.chrome.com/devtools/docs/device-mode" target="_blank">Chrome 设备模式模拟器</a> 

部分网页目前无法转码，包括视频网站、需要使用 Cookie 的网页，以及其他在技术上难以转码的网站。在这类情况下，，会看到“未转码”通知。 谷歌的手机端网站自动转码技术确实有明显速度优势，但内容有所调整。

### 对比加载用时

您可以查看 Web Light 网页和未转码网页的<a rel="noreferrer noopener" href="http://www.webpagetest.org/optimized?url=www.aol.com&start=0" target="_blank">加载用时对比图</a>（该测试需要几分钟的时间）。Measure your site performance when optimized by the Google&nbsp;[optimized pages transcoder](http://googlewebmastercentral.blogspot.com/2015/04/faster-and-lighter-mobile-web-pages-for.html).<figure class="wp-block-image size-large">

<a href="https://www.webpagetest.org/optimized?url=www.aol.com&start=0" target="_blank" rel="noreferrer noopener"><img loading="lazy" width="942" height="346" src="https://www.justcn.cn/wp-content/uploads/2020/03/谷歌手机端网站转码对比测试工具.jpg" alt="谷歌手机端网站转码对比测试工具" class="wp-image-361" srcset="https://www.justcn.cn/wp-content/uploads/2020/03/谷歌手机端网站转码对比测试工具.jpg 942w, https://www.justcn.cn/wp-content/uploads/2020/03/谷歌手机端网站转码对比测试工具-300x110.jpg 300w, https://www.justcn.cn/wp-content/uploads/2020/03/谷歌手机端网站转码对比测试工具-768x282.jpg 768w, https://www.justcn.cn/wp-content/uploads/2020/03/谷歌手机端网站转码对比测试工具-660x242.jpg 660w" sizes="(max-width: 942px) 100vw, 942px" /></a><figcaption>谷歌手机端网站转码对比测试工具</figcaption></figure>