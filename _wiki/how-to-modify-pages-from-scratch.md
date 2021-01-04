---
layout: wiki
title: 从零开始学习修改Github Pages
categories: tools
description: 记录Jekyll修改
keywords: jekyll，github pages 
---

## 静态网站加功能真难

完全是我不会的js或者git安装。只能不断的fork。其他MarkDown语法参考：[MarkDown语法](https://justcn.cn/wiki/how-to-make-a-blog-in-github/ "MarkDown语法参考")

### 显示tags标签代码，fork再看源码吧
><!-- Leo标签的完整引用代码 -->
>          <span class="meta-info">[
>                {% for tag in page.tags %}
>                {% capture tag_name %}{{ tag }}{% endcapture %}
>		<a href="/tag/#{{ tag_name }}" title="{{ tag[0] }}" >{{ tag_name }}</a>
>                {% endfor %}
>                ]</span>

### 超链接
`[普通链接带标题](https://www.justcn.cn/ "普通链接带标题")`

### 插入图片
![头条名片](https://justcn.cn/wp-content/uploads/2021/头条名片.jpg "头条名片")


### 字符效果和横线等
----

~~删除线~~ <s>删除线（开启识别HTML标签时）</s>

*斜体字*      _斜体字_

**粗体**  __粗体__

***粗斜体*** ___粗斜体___ 

### 引用 Blockquotes
> 引用文本 Blockquotes

#### 缩进风格
即缩进四个空格，也做为实现类似 `<pre>` 预格式化文本 ( Preformatted Text ) 的功能。
    <?php
        echo "Hello world!";
    ?>

#### JS代码
```javascript
function test() {
	console.log("Hello world!");
}
```

### Markdown的表格

| 功能                      | 命令                                  |
|:--------------------------|:--------------------------------------|
| 添加文件/更改到暂存区     | git add filename                      |
| 添加所有文件/更改到暂存区 | git add .                             |
| 提交                      | git commit -m msg                     |
| 从远程仓库拉取最新代码    | git pull origin master                |
| 推送到远程仓库            | git push origin master                |
| 查看配置信息              | git config --list                     |
| 查看文件列表              | git ls-files                          |
| 比较工作区和暂存区        | git diff                              |
| 比较暂存区和版本库        | git diff --cached                     |
| 比较工作区和版本库        | git diff HEAD                         |
| 从暂存区移除文件          | git reset HEAD filename               |
| 查看本地远程仓库配置      | git remote -v                         |
| 回滚                      | git reset --hard 提交SHA              |
| 强制推送到远程仓库        | git push -f origin master             |
| 修改上次 commit           | git commit --amend                    |
| 推送 tags 到远程仓库      | git push --tags                       |
| 推送单个 tag 到远程仓库   | git push origin [tagname]             |
| 删除远程分支              | git push origin --delete [branchName] |
| 远程空分支（等同于删除）  | git push origin :[branchName]         |
| 查看所有分支历史          | gitk --all                            |
| 按日期排序显示历史        | gitk --date-order                     |

### 列表 Lists

#### 无序列表（减号）Unordered Lists (-)

- 列表一
- 列表二
- 列表三

#### 无序列表（加号和嵌套）Unordered Lists (+)
+ 列表一
+ 列表二
    + 列表二-1
    + 列表二-2
    + 列表二-3
+ 列表三
    * 列表一
    * 列表二
    * 列表三

#### 有序列表 Ordered Lists (-)

1. 第一行
2. 第二行
3. 第三行

#### GFM task list

- [x] GFM task list 1
- [x] GFM task list 2
- [ ] GFM task list 3
    - [ ] GFM task list 3-1
    - [ ] GFM task list 3-2
    - [ ] GFM task list 3-3
- [ ] GFM task list 4
    - [ ] GFM task list 4-1
    - [ ] GFM task list 4-2

----
