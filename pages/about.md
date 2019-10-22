---
layout: page
title: About
description: 付华的个人博客
keywords: Fu Hua, 付华
comments: true
menu: 关于
permalink: /about/
---

## 付华

北邮研二在读

联系方式：18618187978

生日：1996年10月4日

2014年9月1日 — 2018年7月1日 北京邮电大学 电信工程及管理

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
