---
layout: categories
title: Categories
description: 哈哈，你找到了我的文章基因库
keywords: 分类
header-img: semantic.jpg
comments: false
permalink: /categories/
---

<section class="container posts-content">
    <ol class="posts-list">
        {% for post in site.posts %}
        <li class="posts-list-item">
            <span class="posts-list-meta">{{ post.date | date: "%m/%d" }}</span>
            <a class="posts-list-name" href="{{ site.url }}{{ post.url }}">{{ post.title }}</a>
        </li>
        {% endfor %}
    </ol>
    <div class="pagination text-align">
        <div class="btn-group">
            {% if paginator.previous_page %}
            {% if paginator.previous_page == 1 %}
            <a href="/" class="btn btn-outline">&laquo;</a>
            {% else %}
            <a href="/page{{paginator.previous_page}}"  class="btn btn-outline">&laquo;</a>
            {% endif %}
            {% else %}
            <button disabled="disabled" href="javascript:;" class="btn btn-outline">&laquo;</button>
            {% endif %}
            {% if paginator.page == 1 %}
            <a href="javascript:;" class="active btn btn-outline">1</a>
            {% else %}
            <a href="/"  class="btn btn-outline">1</a>
            {% endif %}
            {% for count in (2..paginator.total_pages) %}
            {% if count == paginator.page %}
            <a href="javascript:;"  class="active btn btn-outline">{{count}}</a>
            {% else %}
            <a href="/page{{count}}"  class="btn btn-outline">{{count}}</a>
            {% endif %}
            {% endfor %}
            {% if paginator.next_page %}
            <a href="/page{{paginator.next_page}}"  class="btn btn-outline">&raquo;</a>
            {% else %}
            <button disabled="disabled" href="javascript:;" class="btn btn-outline">&raquo;</button>
            {% endif %}
        </div>
    </div>
    <!-- /pagination -->
</section>
<!-- /section.content -->
