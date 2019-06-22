---
layout: wiki
title: jekyll
categories: jekyll
description: 使用jekyll过程中的一些总结
keywords: Linux
---

使用jekyll的一些bug和技巧

## 技巧

### 支持latex的`$__$`

1. 在线方式
   
   在`header.html`中添加以下代码：
   
   ```javascript
   <script src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
   ```

2. 本地方式
   
   下载[`MathJax.js`](http://cdn.mathjax.org/mathjax/latest/MathJax.js), 在`header.html`中添加下列代码
   
   ```javascript
   <script src="{{ "/yourpath/MathJax.js?config=TeX-AMS-MML_HTMLorMML" | prepend: site.baseurl }}"></script>
   ```

*推荐使用第一种方法，参考*[:grinning:](https://www.jianshu.com/p/bb184f61c9ae)


