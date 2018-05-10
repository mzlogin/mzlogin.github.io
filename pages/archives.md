---
layout: page
title: 归档
description: 按年份归档
keywords: 归档
comments: false
menu: 归档
permalink: /archives/
---

{% assign count = 1 %}
{% for post in site.posts reversed %}
    {% assign year = post.date | date: '%Y' %}
    {% assign nyear = post.next.date | date: '%Y' %}
    {% if year != nyear %}
        {% assign count = count | append: ', ' %}
        {% assign counts = counts | append: count %}
        {% assign count = 1 %}
    {% else %}
        {% assign count = count | plus: 1 %}
    {% endif %}
{% endfor %}

{% assign counts = counts | split: ', ' | reverse %}
{% assign i = 0 %}

{% for post in site.posts %}
    {% assign year = post.date | date: '%Y' %}
    {% assign nyear = post.next.date | date: '%Y' %}
    {% if year != nyear %}
### {{ post.date | date: '%Y' }} ({{ counts[i] }})
        {% assign i = i | plus: 1 %}
    {% endif %}
* <span class="posts-list-meta">{{ post.date | date:"%m-%d" }}</span><a class="posts-list-name" href="{{ site.url }}{{ post.url }}">{{ post.title }}</a>
{% endfor %}
