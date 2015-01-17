---
layout: default
title: MarkDown Test
description: Markdown语法的测试页面。
keywords: markdown
permalink: /markdown
---

###目录
* [超链接](#超链接)  
* [列表](#列表)  
* [任务列表](#任务列表)
* [表格](#表格)  
* [代码块](#代码块)
* [图片](#图片)

###超链接
```
[靠谱-ing](http://www.mazhuang.org)
<http://www.mazhuang.org>
```
[靠谱-ing](http://www.mazhuang.org)  
<http://www.mazhuang.org>

###列表
```
1. first
2. second
3. third
```
1. first  
2. second  
3. third  

###任务列表
```
- [] Task1
- [] Task2
- [1] Task3
- [1] Task4
```
- [] Task1  
- [] Task2  
- [1] Task3  
- [1] Task4  


###表格
```
| HEADER1 | HEADER2 | HEADER3 | HEADER4 |
| ------- | :------ | :-----: | ------: |
| content | content | content | content |

```
| HEADER1 | HEADER2 | HEADER3 | HEADER4 |
| ------- | :------ | :-----: | ------: |
| content | content | content | content |

1. :----- 表示左对齐
2. :----: 表示中对齐
3. -----: 表示右对齐

###代码块

```python
print 'Hello, World!'
```

{% gist mzlogin/f6dbe25c70131113b7ec %}

###图片
```
![本站favicon](/favicon.ico)
```

![本站favicon](/favicon.ico)
