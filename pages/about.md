---
layout: page
title: About
description: 付华的个人博客
keywords: Fu Hua, 付华
comments: true
menu: 关于
permalink: /about/
---

付华，一名普通的北邮研究生。

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
