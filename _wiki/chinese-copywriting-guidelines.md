---
layout: wiki
title: 常用CSS+div排版
categories: 网络技术
description: 常用CSS+div排版。
keywords: css

---

### CSS图片自适应大小
代码如下：
```html
<html>
  <head></head>
  <body>
    <div class="main-container">
        <img src="**" alt="**"/>
    </div>
  </body>
</html>
```
```html
html,body,.main-container{
  width:100%;
}
.main-container img{
  max-width:100%;
}
```
