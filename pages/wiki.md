---
layout: page
title: Wiki
description: 其实我觉得主要得用这玩意（
keywords: 维基, Wiki
comments: false
menu: 维基
permalink: /wiki/
---

> 众所周知，Reki的记忆只有7秒

<ul class="listing">
{% for wiki in site.wiki %}
{% if wiki.title != "Wiki Template" %}
<li class="listing-item"><a href="{{ site.url }}{{ wiki.url }}">{{ wiki.title }}</a></li>
{% endif %}
{% endfor %}
</ul>
