---
layout: wiki
title: Markdown
categories: Markdown
description: Markdown 常用语法示例。
keywords: Markdown
---

**目录**

* TOC
{:toc}

### 超链接

```
[靠谱-ing](http://mazhuang.org)

<http://mazhuang.org>
```

[靠谱-ing](http://mazhuang.org)  

<http://mazhuang.org>

### 列表

```
1. 有序列表项 1

2. 有序列表项 2

3. 有序列表项 3
```

1. 有序列表项 1

2. 有序列表项 2

3. 有序列表项 3

```
* 无序列表项 1

* 无序列表项 2

* 无序列表项 3
```

* 无序列表项 1

* 无序列表项 2

* 无序列表项 3

- [x] 任务列表 1
- [ ] 任务列表 2

### 强调

```
~~删除线~~

**加黑**

*斜体*
```

~~删除线~~

**加黑**

*斜体*

### 标题

```
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题
```

Tips: `#` 与标题中间要加空格。

### 表格

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

### 代码块

```python
print 'Hello, World!'
```

1. list item1

2. list item2

   ```python
   print 'hello'
   ```

### 图片

```
![本站favicon](/favicon.ico)
```

![本站favicon](/favicon.ico)

### 锚点

```
* [目录](#目录)
```

* [目录](#目录)

### Emoji

:camel:
:blush:
:smile:

### Footnotes

This is a text with footnote[^1].

[^1]: Here is the footnote 1 definition.
