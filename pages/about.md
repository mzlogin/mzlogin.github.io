---
layout: page
title: About
description: 丁上峰的个人博客
keywords: Shangfeng Ding, 丁上峰
comments: true
menu: 关于
permalink: /about/
---

## 丁上峰

北京邮电大学网络技术研究院交换中心研究生

联系方式：15811467471

生日：1996年10月11日

2014年9月1日 — 2018年7月1日 北京邮电大学 物联网工程

2018年9月1日 - 至今 北京邮电大学 计算机科学与技术

研究方向：云计算与大数据

## 联系

{% for website in site.data.social %}
* {{ website.sitename }}：[@{{ website.name }}]({{ website.url }})
{% endfor %}

## Skill Keywords

{% for category in site.data.skills %}
### {{ category.name }}
<div class="btn-inline">
{% for keyword in category.keywords %}
<button class="btn btn-outline" type="button">{{ keyword }}</button>
{% endfor %}
</div>
{% endfor %}
