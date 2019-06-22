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

3. 补充方法
   
           为什么会有这个补充方式呢？:slightly_smiling_face: ，因为之前用的第一个方法突然不能用了？时灵时不灵。所以第三种方法是新找到的，虽然我觉得三种方法几乎一毛一样，但还是放出来给自己做个笔记。希望不要给我找第四种方法的机会。
   
   在`header.html`中添加以下代码：
   
   ```javascript
   <script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
   
   <script type="text/x-mathjax-config">
   MathJax.Hub.Config({
     tex2jax: {
       inlineMath: [['$','$'], ['\\(','\\)']],
       processEscapes: true
     }
   });
   </script>
   
   <script type="text/x-mathjax-config">
       MathJax.Hub.Config({
         tex2jax: {
           skipTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
         }
       });
   </script>
   ```

*第三种方法来自[:tophat:](https://blog.csdn.net/xky1306102chenhong/article/details/88317351)*


