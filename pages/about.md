---
layout: page
title: About
description: Object not found exception
keywords: Yue Jia, 贾悦
comments: true
menu: 关于
permalink: /about/
---

## 坚信

* 熟能生巧
* 努力改变人生

## 联系

* GitHub：
* 掘金：
* LinkedIn：
* 博客：[{{ site.title }}]({{ site.url }})
* 微博: 
* 知乎: 
* 豆瓣: 

## Skill Keywords

#### Software Engineer Keywords
<div class="btn-inline">
    {% for keyword in site.skill_software_keywords %}
    <button class="btn btn-outline" type="button">{{ keyword }}</button>
    {% endfor %}
</div>

#### Mobile Developer Keywords
<div class="btn-inline">
    {% for keyword in site.skill_mobile_app_keywords %}
    <button class="btn btn-outline" type="button">{{ keyword }}</button>
    {% endfor %}
</div>

#### Windows Developer Keywords
<div class="btn-inline">
    {% for keyword in site.skill_windows_keywords %}
    <button class="btn btn-outline" type="button">{{ keyword }}</button>
    {% endfor %}
</div>
