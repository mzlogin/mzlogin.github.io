---
layout: page
title: Wiki
description: 人越学越觉得自己无知
keywords: 维基, Wiki
comments: false
menu: 维基
permalink: /wiki/
---

> 记多少命令和快捷键会让脑袋爆炸呢？

{% case site.components.wiki.view %}

{% when 'list' %}

<ul class="listing">
{% for wiki in site.wiki %}
{% if wiki.title != "Wiki Template" and wiki.topmost == true %}
<li class="listing-item"><a href="{{ site.url }}{{ wiki.url }}"><span class="top-most-flag">[置顶]</span>{{ wiki.title }}</a></li>
{% endif %}
{% endfor %}
{% for wiki in site.wiki %}
{% if wiki.title != "Wiki Template" and wiki.topmost != true %}
<li class="listing-item"><a href="{{ site.url }}{{ wiki.url }}">{{ wiki.title }}<span style="font-size:12px;color:red;font-style:italic;">{%if wiki.layout == 'mindmap' %}  mindmap{% endif %}</span></a></li>
{% endif %}
{% endfor %}
</ul>

{% when 'cate' %}

{% assign item_grouped = site.wiki | where_exp: 'item', 'item.title != "Wiki Template"' | group_by: 'cate1' | sort: 'name' %}
{% for group in item_grouped %}
<strong>{{ group.name }}</strong>
{% assign cate_items = group.items | sort: 'title' %}
{% assign item2_grouped = cate_items | group_by: 'cate2' | sort: 'name' %}
{% for sub_group in item2_grouped %}
{% assign name_len = sub_group.name | size %}
{% if name_len > 0 -%}
{{ sub_group.name }}: 
{%- endif -%}
{%- for item in sub_group.items -%}
<a href="{{ site.url }}{{ item.url }}" style="display:inline-block;padding:0.5em">{{ item.title }}<span style="font-size:12px;color:red;font-style:italic;">{%if item.layout == 'mindmap' %}  mindmap{% endif %}</span></a><span> |</span>
{%- endfor -%}
{% endfor %}
{% endfor %}

{% endcase %}
