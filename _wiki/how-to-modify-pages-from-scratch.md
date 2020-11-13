---
layout: wiki
title: 从零开始学习修改Github Pages
categories: tools
description: 记录Jekyll修改
keywords: jekyll，github pages 
---

## 静态网站加功能真难

完全是我不会的js或者git安装。只能不断的fork。

### 显示tags标签代码
```html
<html>
<!-- Leo标签的完整代码 -->
          <span class="meta-info">[
                {% for tag in page.tags %}
                {% capture tag_name %}{{ tag }}{% endcapture %}
		<a href="/tag/#{{ tag_name }}" title="{{ tag[0] }}" >{{ tag_name }}</a>
                {% endfor %}
                ]</span>
</html>
```

### Markdown的表格

| 功能     | Windows | Mac OS X |
|:---------|:--------|:---------|
| 左对齐   | C-M-l   |          |
| 左右居中 | C-M-c   |          |
| 右对齐   | C-M-r   |          |
