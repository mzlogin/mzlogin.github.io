---
layout: page
title: About
description: 联系方式及博客说明
keywords: 联系, 说明
comments: true
menu: 关于
permalink: /about/
---

## 联系

{% for website in site.data.social %}

* {{ website.sitename }}：[@{{ website.name }}]({{ website.url }})
  
  {% endfor %}

## 技能点

{% for category in site.data.skills %}

### {{ category.name }}

<div class="btn-inline">
{% for keyword in category.keywords %}
<button class="btn btn-outline" type="button">{{ keyword }}</button>
{% endfor %}
</div>
{% endfor %}

## 说明

- 博客模板取自这里[(～￣▽￣)～](https://github.com/mzlogin/mzlogin.github.io)  
- Wiki页面里的内容来自[(✪ω✪)](https://github.com/mzlogin/mzlogin.github.io)和个人的补充。
