---
layout: wiki
title: latex in jekyll
categories: [jekyll, latex, bug]
excerpt: 在jekyll使用latex遇到的问题
keywords: latex, jekyll
mathjax: true
---

### `|`,`||`无法使用或其后无法接`_`

解决方案：直接使用标签把要写的公式包起来就可以了

```ag-0-1decgop91
<p>$||x||_p=\left[\int_{-\infty}^{\infty}|x|^p\right]^{1/p}$</p>
```

效果：

<p>$||x||_p=\left[\int_{-\infty}^{\infty}|x|^p\right]^{1/p}$</p>
