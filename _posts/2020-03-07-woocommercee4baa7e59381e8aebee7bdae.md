---
id: 353
title: WooCommerce产品设置
date: 2020-03-07T13:04:45+08:00
author: netrob
excerpt: WooCommerce 现已是网络上最流行的电子商务平台之一， 在WordPress上免费，灵活的功能，为中小企业的品牌海外推广提供了一个良心的外贸商城解决方案。所以还请放心，您遇见的是款好产品。本Blog不断补充产品排序，产品标签设置上等问题。
layout: post
guid: https://www.justcn.cn/?p=353
permalink: '/woocommerce%e4%ba%a7%e5%93%81%e8%ae%be%e7%bd%ae/'
categories:
  - 推广笔记
tags:
  - WooCommerce
  - 产品设置
---
WooCommerce 现已是网络上最流行的电子商务平台之一， 在WordPress上免费，灵活的功能，为中小企业的品牌海外推广提供了一个良心的外贸商城解决方案。所以还请放心，您遇见的是款好产品。本Blog不断补充产品排序，产品标签设置上等问题。

### WooCommerce产品排序

如果想自定义前端产品的排序，首推使用WooCommerce自带功能。 WooCommerce -> Products，在产品编辑页面底部，Product data -> Advanced ->Menu order。以下为操作建议：

  * 必须正整数，数字小的排前面；0最前面
  * 建议设置排序规则；如分为热销类0-9，次级热门产品10-29，其它产品按产品类别留空，如便携式数控切割机为30-39，台式切割机为40-49等。
  * 建议留出空闲位置，如0永远留空；2,4,6,8偶数设置，奇数留给临时穿插的
  * 一定要为每个产品设置默认排序。必须999；默认排序可以是一样的数值
  * 当修改数值没有变化时，先查查是否有产品依然排序默认值为0.<figure class="wp-block-image size-large">

<img loading="lazy" width="680" height="292" src="https://www.justcn.cn/wp-content/uploads/2020/03/WooCommerce产品排序.png" alt="WooCommerce产品排序" class="wp-image-355" srcset="https://www.justcn.cn/wp-content/uploads/2020/03/WooCommerce产品排序.png 680w, https://www.justcn.cn/wp-content/uploads/2020/03/WooCommerce产品排序-300x129.png 300w, https://www.justcn.cn/wp-content/uploads/2020/03/WooCommerce产品排序-660x283.png 660w" sizes="(max-width: 680px) 100vw, 680px" /> <figcaption>WooCommerce产品排序</figcaption></figure> 



### WooCommerce产品NEW，SALE，HOT标识

How to Display Custom Product Badges ？为突出显示产品或者营销的差异，外贸经常需要在产品上贴上热销，打折，新品等标志。进入后台WooCommerce -> Products，在产品编辑页面底部，Product data ->Extra标签下，先启用Custom Bubble，在Custom Bubble Title中随意写内容，如NEW，SALE!，HOT，%OFF，FREE等。<figure class="wp-block-image size-large">

<img loading="lazy" width="729" height="380" src="https://www.justcn.cn/wp-content/uploads/2020/03/WooCommerce产品标签设置.png" alt="WooCommerce产品标签设置" class="wp-image-354" srcset="https://www.justcn.cn/wp-content/uploads/2020/03/WooCommerce产品标签设置.png 729w, https://www.justcn.cn/wp-content/uploads/2020/03/WooCommerce产品标签设置-300x156.png 300w, https://www.justcn.cn/wp-content/uploads/2020/03/WooCommerce产品标签设置-660x344.png 660w" sizes="(max-width: 729px) 100vw, 729px" /> <figcaption>WooCommerce产品标签设置</figcaption></figure>