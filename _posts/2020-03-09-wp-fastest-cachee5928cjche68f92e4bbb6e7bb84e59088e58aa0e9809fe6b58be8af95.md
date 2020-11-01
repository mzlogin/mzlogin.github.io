---
id: 364
title: WP Fastest Cache和JCH插件组合加速测试
date: 2020-03-09T14:28:32+08:00
author: netrob
excerpt: wordpress的有非常多的js,css压缩组合插件，还有CDN，静态缓存，Gzip等增强功能。但大多数功能为付费。JustCN测试两款大名鼎鼎的免费版速度优化插件WP Fastest Cache和JCH Optimize插件组合优化效果。
layout: post
guid: https://www.justcn.cn/?p=364
permalink: '/wp-fastest-cache%e5%92%8cjch%e6%8f%92%e4%bb%b6%e7%bb%84%e5%90%88%e5%8a%a0%e9%80%9f%e6%b5%8b%e8%af%95/'
categories:
  - 推广笔记
tags:
  - JCH Optimize
  - wordpress插件
---
wordpress的有非常多的js,css压缩组合插件，还有CDN，静态缓存，Gzip等增强功能。但大多数功能为付费。JustCN测试两款大名鼎鼎的免费版速度优化插件WP Fastest Cache和JCH Optimize插件组合优化效果。

## WP Fastest Cache和JCH Optimize插件组合

这两款插件任意一个即可达到非常不错的加速效果。但由于免费版限制了其功能的发挥。需要找到两款不冲突的优化插件，已达到最佳效果。<figure class="wp-block-image size-large">

<img loading="lazy" width="867" height="318" src="https://www.justcn.cn/wp-content/uploads/2020/03/wordpress加速优化插件测试.jpg" alt="wordpress加速优化插件测试" class="wp-image-365" srcset="https://www.justcn.cn/wp-content/uploads/2020/03/wordpress加速优化插件测试.jpg 867w, https://www.justcn.cn/wp-content/uploads/2020/03/wordpress加速优化插件测试-300x110.jpg 300w, https://www.justcn.cn/wp-content/uploads/2020/03/wordpress加速优化插件测试-768x282.jpg 768w, https://www.justcn.cn/wp-content/uploads/2020/03/wordpress加速优化插件测试-660x242.jpg 660w" sizes="(max-width: 867px) 100vw, 867px" /> <figcaption>wordpress加速优化插件测试</figcaption></figure> 

单使用免费版WP Fastest Cache，速度明显上升，但是文件请求数有34个， 文件压缩合并能力弱，没有图片优化功能，没有自定义CDN 。单用JCH请求数为12个，但是缓存能力和加载时间优化不足，导致加载时间增长。因此采用混合策略。

WP Fastest Cache 免费功能全开，而JCH Optimize取消页面缓存Page Cache，其它全开。

相信 JCH Optimize 会有更好的发展，等待它强大的一天。而google字体和google分析代码，拉低了测速评分。以后再想办法提速。

### WP Rocket是JustCN觉得最好的加速优化插件

如果WP Rocket有一个缺点，就是收费。除此以外真心简单而强大。JustCN费劲优化最佳加载时间为1.1秒。而用WP Rocket 轻松就可以实现。而且有付费CDN，图片优化，google分析，facebook等嵌入功能。

相比WP Fastest Cache，WP Super Cache，W3 Total Cache，WP Super Minify等的各有优缺点， WP Rocket 趋近于完美并且在手机端和电脑端都能直接感受到速度的变化。