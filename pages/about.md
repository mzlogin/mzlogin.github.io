---
layout: page
title: About
description: Me?
keywords: RekiDunois
comments: true
menu: 关于
permalink: /about/
---

兜兜转转，最后还是回到静态页面做博客

不过我还是希望自己实现一个博客系统。

事 Angular 和 .Net 程序员。

## 联系

{% for website in site.data.social %}
* {{ website.sitename }}：[@{{ website.name }}]({{ website.url }})
{% endfor %}

## Skill Keywords

{% for category in site.data.skills %}
### {{ category.name }}
<div class="btn-inline">
{% for keyword in category.keywords %}
<button class="btn btn-outline" type="button">{{ keyword }}</button>
{% endfor %}
</div>
{% endfor %}
