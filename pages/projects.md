---
layout: page
title: Projects
description: 我的项目历史
keywords: 项目, Projects
comments: true
menu: 项目
permalink: /projects/
---

> 记多少命令和快捷键会让脑袋爆炸呢？

<ul class="listing">
{% for projects in site.projects %}
{% if projects.title != "Projects Template" %}
<li class="listing-item"><a href="{{ site.url }}{{ projects.url }}">{{ projects.title }}</a></li>
{% endif %}
{% endfor %}
</ul>
