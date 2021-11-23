---
layout: page
title: Links
description: 好看的网页过眼如烟，持续有价值的网站百里挑一
keywords: 内容与链接
comments: true
menu: 链接
permalink: /links/
---

> 好看的网页过眼如烟，持续有价值的网站百里挑一

<ul>
{% for link in site.data.links %}
  {% if link.src == 'work' %}
  <li><a href="{{ link.url }}" target="_blank">{{ link.name}}</a></li>
  {% endif %}
{% endfor %}
</ul>

> 工具网站

<ul>
{% for link in site.data.links %}
  {% if link.src == 'tool' %}
  <li><a href="{{ link.url }}" target="_blank">{{ link.name}}</a></li>
  {% endif %}
{% endfor %}
</ul>

> 内容与教程

<ul>
{% for link in site.data.links %}
  {% if link.src == 'tour' %}
  <li><a href="{{ link.url }}" target="_blank">{{ link.name}}</a></li>
  {% endif %}
{% endfor %}
</ul>
