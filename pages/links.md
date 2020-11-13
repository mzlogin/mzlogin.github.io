---
layout: page
title: Links
description: 好看的网页过眼如烟，持续有价值的网站百里挑一
keywords: 友情链接
comments: true
menu: 链接
permalink: /links/
---

> 合作客户

<ul>
{% for link in site.data.links %}
  {% if link.src == 'work' %}
  <li><a href="{{ link.url }}" target="_blank">{{ link.name}}</a></li>
  {% endif %}
{% endfor %}
</ul>

> 人生短短几个秋，相交十元.

<ul>
{% for link in site.data.links %}
  {% if link.src == 'life' %}
  <li><a href="{{ link.url }}" target="_blank">{{ link.name}}</a></li>
  {% endif %}
{% endfor %}
</ul>
