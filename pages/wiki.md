---
layout: page
title: Wiki
description: 人越学越觉得自己无知
keywords: 维基, Wiki
header-img: zhihu.jpg
comments: false
permalink: /wiki/
---

> 记多少快捷键会让脑袋爆炸呢？

<ul class="listing">
{% for doc in site.documents %}
{% if doc.title != "Wiki Template" %}
<li class="listing-item"><a href="{{ doc.url }}">{{ doc.title }}</a></li>
{% endif %}
{% endfor %}
</ul>
