---
layout: page
title: About
description: 人改变世界
keywords: 曹桑
comments: true
menu: 关于
permalink: /about/
---

仰慕「优雅编码的艺术」。

爱慕艺术的生养。

坚信熟能生巧，努力改变人生。

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
