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

## 代码高亮支持哪些语言

语言列表见 <https://github.com/rouge-ruby/rouge/wiki/List-of-supported-languages-and-lexers>，也可以自己运行 `rougify list` 命令查看最新列表。

## Gitalk 授权登录后提示 403 错误

具体看到的错误信息为 `Error: Requrest failed with status code 403`。

详细的讨论可以参考 <https://github.com/gitalk/gitalk/issues/429>，这个 Issue 里也提到了问题原因和解决方案：更新 Gitalk 到 1.7.2 版本，或者自行搭建 CORS proxy service 并增加配置 `proxy: '<你的 proxy 地址>'`。

如果是使用本模板最新代码，那不用做什么，会自动引用最新版本。如果一再刷新后还是不行的话，那需要刷新一下你本地的缓存，方法是依次访问以下 2 个链接：

- <https://purge.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js>
- <https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js?v=1.7.2>

## Gitalk 评论框部分提示 Error: Not Found

页面上提示 `Error: Not Found.`，浏览器控制台可以看到报错信息 `GET https://api.github.com/repos/<用户名>/<repo>/issues?labels=gitment,xxx 404`。

这种情况一般是 _config.yml 的 gitalk.repo 这个配置项填写的不对。这个配置项是要填写一个利用其 Issues 存储评论内容的代码仓库名称，请确保填写的名称对应的代码仓库存在，如果想省事点可以直接填写博客源码对应的仓库名称，比如 `<用户名>.github.io`。

## 修改二维码图片

_config.yml 里的 components.qrcode 这一段用于控制二维码。

不显示二维码：将 components.qrcode.enabled 改为 false。

替换二维码图片：替换 assets/images/qrcode.jpg 文件。

## _data 目录下的 yml 文件内容含义

*skills.yml* 文件里的内容对应[「关于」][1]页面里的 Skill Keywords。

![](/images/posts/template/skills.yml.png)

*social.yml* 文件里的内容对应[「关于」][1]页面里的「联系」里的内容。

![](/images/posts/template/social.yml.png)

*links.yml* 文件里的内容对应[「链接」][2]页面里的内容。

![](/images/posts/template/links.yml.png)

[1]: https://mazhuang.org/about/
[2]: https://mazhuang.org/links/
