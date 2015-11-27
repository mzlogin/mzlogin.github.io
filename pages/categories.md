---
layout: default
title: Categories
description: 哈哈，你找到了我的文章基因库
keywords: 分类
header-img: semantic.jpg
permalink: /categories/
---

<div class='tag_cloud'>
{% for cat in site.categories %} 
<a href="#{{ cat[0] }}" title="{{ cat[0] }}" rel="{{ cat[1].size }}">{{ cat[0] }}({{ cat[1].size }}) </a>
{% endfor %}
</div>

{% for category in site.categories %}
<h3>{{ category | first }}</h3>
<ul id="{{ category[0] }}">
{% for post in category.last %}
<li><a href="{{ post.url }}">{{ post.title }}</a></li>
{% endfor %}
</ul>
{% endfor %}

## 本页使用方法

1. 在下面选一个你喜欢的词
2. 点击它
3. 相关的文章会「唰」地一声跳到页面顶端
4. 马上试试？

## 基因列表

<div id='tag_cloud'>
{% for cat in site.categories %} 
<a href="#{{ cat[0] }}" title="{{ cat[0] }}" rel="{{ cat[1].size }}">{{ cat[0] }}</a>
{% endfor %}
</div>

{% for category in site.categories %}
<h3>{{ category | first }}</h3>
<ul class="listing" id="{{ category[0] }}">
{% for post in category.last %}
<li class="listing-item">
  <time datetime="{{ post.date | date:"%Y-%m-%d" }}">{{ post.date | date:"%Y-%m-%d" }}</time>
  <a href="{{ post.url }}" title="{{ post.title }}">{{ post.title }}</a>
</li>
{% endfor %}
</ul>
{% endfor %}

<script src="/js/jquery.tagcloud.js" type="text/javascript" charset="utf-8"></script> 
<script language="javascript">
$.fn.tagcloud.defaults = {
    size: {start: 1, end: 1, unit: 'em'},
      color: {start: '#f8e0e6', end: '#ff3333'}
};

$(function () {
    $('#tag_cloud a').tagcloud();
});
</script>
