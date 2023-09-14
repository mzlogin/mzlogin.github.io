---
layout: page
title: About
description: AI智谷
keywords: Eric Chen
comments: true
menu: 关于
permalink: /about/
---

我是Eric，一个过气的微软认证系统工程师，目前致力于人工智能学习。

我的人生格言是：

不抛弃、不放弃坚持到底就是胜利。

## <font color=red>联系</font>

<ul>
{% for website in site.data.social %}
<li>{{website.sitename }}：<a href="{{ website.url }}" target="_blank">@{{ website.name }}</a></li>
{% endfor %}
{% if site.url contains 'aiwv.xyz' %}
<li>
微信：<br />
<img style="height:192px;width:192px;border:1px solid lightgrey;" src="{{ site.url }}/assets/images/qrcode.jpg" alt="AI智谷X" />
</li>
{% endif %}
</ul>

Email：weakchen@gmail.com

## <font color=red>赞助</font>

[赞助链接](https://aiwv.xyz/donate/) 

## Skill Keywords

{% for skill in site.data.skills %}
### {{ skill.name }}
<div class="btn-inline">
{% for keyword in skill.keywords %}
<button class="btn btn-outline" type="button">{{ keyword }}</button>
{% endfor %}
</div>
{% endfor %}

----------
