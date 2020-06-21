---
layout: post
title: 本博客模板常见问题 Q & A
categories: GitHub
description: 使用这个博客模板的朋友们时不时会提出一些问题，我将它们的解决方案逐渐整理归纳，汇总到这一篇帖子里。
keywords: Jekyll, GitHub Pages
topmost: true
---

使用这个博客模板的朋友们时不时会提出一些问题，我将它们以及对应的解决方案逐渐整理归纳，汇总到这一篇帖子里。

## 如何本地预览

参考 GitHub 的官方说明：

- [Setting up your Pages site locally with Jekyll](https://help.github.com/articles/setting-up-your-pages-site-locally-with-jekyll/)

## 本地预览报错 undefined method map for false

```
GitHub Metadata: Failed to open TCP connection to api.github.com:443 (Connection refused - connect(2) for "api.github.com" port 443)
Liquid Exception: undefined method `map' for false:FalseClass Did you mean? tap in /_layouts/page.html
jekyll 3.8.5 | Error:  undefined method `map' for false:FalseClass
Did you mean?  tap
```

``undefined method `map` for false:FalseClass`` 这条报错之前总是伴随着 `Failed to open TCP connection to api.github.com:443` 一起出现，是在获取 GitHub Metadata 出错后，导致这一句报错：

{% raw %}
```liquid
{% assign repos = site.github.public_repositories | sort: "stargazers_count" | reverse %}
```
{% endraw %}

解决方法：

模板里主要是 _includes/sidebar-popular-repo.html 和 _pages/open-source.md 两个文件里用到了 Metadata，将以上这一句前的判断条件做一下修改后问题解决，将

{% raw %}
```liquid
{% if site.github.public_repositories != null %}
```
{% endraw %}

改为

{% raw %}
```liquid
{% if site.github.public_repositories != false %}
```
{% endraw %}

模板最新代码已经做了修改。

## 是否支持画流程图、时序图、mermaid 和 MathJax

支持。因为相关的引入文件比较大可能影响加载速度，没有默认对所有文件开启，需要在要想开启的文件的 Front Matter 里加上声明：

```yaml
---
flow: true
sequence: true
mermaid: true
mathjax: true
---
```

以上四个开关分别对应 flowchart.js（流程图）、sequence-diagram.js（时序图）、mermaid 和 MathJax 的支持，按需开启即可，然后就可以在正文里正常画图了，展示效果可以参见 <https://mazhuang.org/wiki/markdown/>，对应写法参考源文件 <https://github.com/mzlogin/mzlogin.github.io/blob/master/_wiki/markdown.md>。

## 如何修改代码高亮风格

可以通过 _config.yml 文件里的配置项 `highlight_theme` 来指定代码高亮风格，支持的风格名称列表参考我维护的另一个项目：

- <https://github.com/mzlogin/rouge-themes>

在项目主页可以看到每种风格的预览效果。
