---
layout: page
title: Fragments
description: fragments 索引页
keywords: fragments
comments: false
menu: 片段
permalink: /fragments/
---

> 零散的知识，简短的观点，作为片段汇集于此。

<ul class="listing">
{% for item in site.fragments %}
{% if item.title != "Fragment Template" %}
<li class="listing-item"><a href="{{ site.url }}{{ item.url }}">{{ item.title }}</a></li>
{% endif %}
{% endfor %}
</ul>
