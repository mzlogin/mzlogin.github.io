---
layout: categories
title: Categories
description: 哈哈，你找到了我的文章基因库
keywords: 分类
header-img: semantic.jpg
comments: false
menu: Categories
permalink: /categories/
---

<section class="container posts-content">
{% for category in site.categories %}
<h3>{{ category | first }}</h3>
<ol class="posts-list" id="{{ category[0] }}">
{% for post in category.last %}
<li class="posts-list-item">
<span class="posts-list-meta">{{ post.date | date:"%Y-%m-%d" }}</span>
<a class="posts-list-name" href="{{ post.url }}">{{ post.title }}</a>
</li>
{% endfor %}
</ol>
{% endfor %}
</section>
<!-- /section.content -->
