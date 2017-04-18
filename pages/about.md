---
layout: page
title: About
description: 杜乐乐hot
keywords: 杜乐乐hot
comments: true
menu: 关于
permalink: /about/
---

人世间的相逢无非两种，或是相见恨晚，或是追悔莫及。

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
