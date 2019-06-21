---
layout: page
title: Wiki
description: 人越学越觉得自己无知
keywords: 维基, Wiki
comments: false
menu: 维基
permalink: /wiki/
---

## 我的 Wiki  
<ul class="listing">
{% for mywiki in site.mywiki %}
{% if mywiki.title != "Wiki Template" %}
<li class="listing-item"><a href="{{ site.url }}{{ mywiki.url }}">{{ mywiki.title }}</a></li>
{% endif %}
{% endfor %}
</ul>

## 有用的链接
<ul class="listing">
{% for point in site.date.points %}

<li class="listing-item"><a href="{{ point.url }}">{{ point.name }}</a></li>

{% endfor %}
</ul>

## 原博主的 Wiki  
<ul class="listing">
{% for wiki in site.wiki %}
{% if wiki.title != "Wiki Template" %}
<li class="listing-item"><a href="{{ site.url }}{{ wiki.url }}">{{ wiki.title }}</a></li>
{% endif %}
{% endfor %}
</ul>
