---
layout: page
title: About
description: 杜乐乐hot
keywords: 杜乐乐hot
comments: true
menu: 关于
permalink: /about/
---

I'm 杜乐乐hot

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
