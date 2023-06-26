---
layout: post
title: 使用 jsDelivr 免费加速 GitHub Pages 博客的静态资源
categories: GitHub
description: 使用 jsdelivr CDN 加速 GitHub Pages 博客的静态资源。
keywords: GitHub, CDN, jsdelivr
---

挺久以前就有网友给我的 GitHub Pages 博客模板提 [Issue](https://github.com/mzlogin/mzlogin.github.io/issues/65)，说希望能增加 CDN 用于加速静态资源的加载，由于懒，一直没有动。

最近偶尔要打开自己博客看下 Wiki 的时候，要等挺久，比较痛苦，碰巧昨天晚上看到这样一篇帖子：[GitHub 图床的正确用法，通过 jsDelivr CDN 全球加速](https://hacpai.com/article/1583894928771)，感觉很适合我的需求场景，于是决定趁这几天休假将这个改造一下。

## 先看效果

以下改造前后的加载情况都是在 Edge 浏览器禁用缓存后录制的，录制时间段很接近，从本地访问两个 GitHub Pages 服务的原始响应速度应该类似。

### 改造前加载

![before use cdn](/images/posts/github/cdn-before.png)

*注：由于改造前没有保留加载图，所以这是截的一个使用相同模板的朋友的首页加载情况。*

可以看到耗时最长的两个请求时间达到了 12 秒左右，而且很多资源的加载时间在 1 秒以上，页面完成加载时间长达 15 秒多……估计一般的访客是没这个耐心等待的。

### 改造后加载

![after use cdn](/images/posts/github/cdn-after.png)

这样一对比效果还是很明显的。改造过后耗时最长的是两个没办法走 CDN 的请求，而走 CDN 的那些资源加载时间基本都没超过 60 毫秒，页面完成加载时间缩短到了 3 秒以内。

当然，因为页面自身还是在 GitHub Pages 托管，有时候首个请求还是会挺久才返回。

改造后的效果可以打开 <https://mazhuang.org> 体验。

## 方案考虑

优化独立博客的加载速度有一些不同的思路，对应不同的方案：

1. 优化博客代码，精简需要加载的资源；
2. 将博客部署到国内访问快的服务器上；
3. 部署到国内的代码托管平台，比如 Gitee 和 Coding 等；
4. 采用 CDN 加速；
5. 等等。

其中 2 和 3 我不想考虑，还是期望只在 GitHub 上管理博客，所以 1 和 4 是优化方向，本文对应的就是 4 的部分。

而采用 CDN 加速的方案，可以考虑

- 将公共库改为直接引用公共 CDN 链接；
- 自己编写和修改的静态资源自己去托管在一个 CDN 服务上。

    有一些 CDN 服务商提供一定的免费额度，可以按喜好选用，或者选择付费服务。这里我没有纠结，看完文首提到的那篇文章，去看了下 jsDelivr 的介绍后觉得靠谱：它原生支持使用 GitHub 项目里的资源，什么都不用配置，更重要的是免费，在国内有节点，而且速度还不错（官网上也把 works in China 作为一个卖点的），遂决定直接用它。

## jsDelivr 支持的 GitHub 资源的方式

jsDelivr 对 GitHub 的支持是作为重要特性来宣传的，官网的介绍链接：<https://www.jsdelivr.com/features#gh>，以下是一些认为需要了解的知识的小结：

这里以我托管博客的 GitHub 仓库为例，地址是 `https://github.com/mzlogin/mzlogin.github.io`，那它里面的资源可以直接以 `https://fastly.jsdelivr.net/gh/mzlogin/mzlogin.github.io/` + `仓库里的文件路径` 来访问。

比如仓库里有一个 js 文件 `assets/js/main.js`，那么它可以用 CDN 链接 `https://fastly.jsdelivr.net/gh/mzlogin/mzlogin.github.io/assets/js/main.js` 来访问。

另外还支持一些高级用法，比如：

1. 指定 release 版本号/提交 sha1/分支名称，例如指定获取该仓库的名称为 `1.2.0` 或 `v1.2.0` 的 release 版本资源：

    ```
    https://fastly.jsdelivr.net/gh/mzlogin/mzlogin.github.io@1.2.0/assets/js/main.js
    ```

    如果指定版本为 `1` 或者 `1.2`，那它会自动匹配到这个范围内的最新版本号。

    也可以不指定版本或者指定版本为 `latest`，这样总是使用最新版本的资源。

2. 压缩资源，在 js/css 文件后缀前面加上 `.min`：

    ```
    https://fastly.jsdelivr.net/gh/mzlogin/mzlogin.github.io@1.2.0/assets/js/main.min.js
    ```

3. 合并多个文件，用 `combine/file1,file2,file3` 格式的链接：

    ```
    https://fastly.jsdelivr.net/combine/gh/mzlogin/mzlogin.github.io@1.2.0/assets/js/main.min.js,gh/mzlogin/mzlogin.github.io@1.2.0/assets/js/simple-jekyll-search.min.js
    ```

压缩资源、合并文件的 CDN 链接在第一次有人访问时可能比较慢，后面再有人访问就快了。

其它知识点：

- 可以通过 `https://fastly.jsdelivr.net/combine/gh/mzlogin/mzlogin.github.io[@<版本号>]/[<文件夹>/]` 这样的路径浏览缓存文件列表；
- 可以访问 `https://purge.jsdelivr.net/gh/mzlogin/mzlogin.github.io@1.2.0/assets/js/main.js` 来清除指定文件的缓存；（将引用的 CDN 链接里的 `cdn` 改成 `purge` 就是了）
- 可以访问 `https://data.jsdelivr.com/v1/package/gh/mzlogin/mzlogin.github.io` 来查看 CDN 上的 tags 和 versions 列表，更多数据接口参数参见 <https://github.com/jsdelivr/data.jsdelivr.com>。

## 改造步骤

下面是记录具体改造博客模板的步骤：

1. 在 _config.yml 文件中添加控制开关：

    ```yaml
    # 对 css 和 js 资源的 cdn 加速配置
    cdn:
        jsdelivr:
            enabled: true
    ```

2. 修改 _layouts 里的文件，给名为 `assets_base_url` 的变量赋值，用它来代表加载静态资源的根路径：

    {% raw %}
    ```liquid
    {% assign assets_base_url = site.url %}
    {% if site.cdn.jsdelivr.enabled %}
        {% assign assets_base_url = "https://fastly.jsdelivr.net/gh/" | append: site.repository | append: '@master' %}
    {% endif %}
    ```
    {% endraw %}

3. 修改以前直接用 {% raw %}`{{ site.url }}`{% endraw %} 拼接的静态资源引用链接，替换为 {% raw %}`{{ assets_base_url }}`{% endraw %}，比如 _includes/header.html 里：

    {% raw %}
    ```diff
    - <link rel="stylesheet" href="{{ site.url }}/assets/css/posts/index.css">
    + <link rel="stylesheet" href="{{ assets_base_url }}/assets/css/posts/index.css">
    ```
    {% endraw %}

这样万一哪天 CDN 出了点什么状况，我们也可以很方便地通过一个开关就切回自已的资源链接恢复服务。

主要就是这类修改，当然涉及的地方有多处，以上只是举一处例子记录示意，改造过程和改造后的代码可以参考我的博客仓库 <https://github.com/mzlogin/mzlogin.github.io>。

## 现存问题

- 如果项目曾经打过 tag，那么新增/修改静态资源后，需要刷新 CDN 缓存的话，需要打个新 tag；

    一般发生在修改了博客模板的 js/css 以后。我也还在摸索如何省去这一步的方法。

    **Update:** 我后来采用的解决方法是删除了所有的 tag，这样以前的 release 就变成了 Draft，对外是不可见的，因为我这个仓库不需要对外可见的 release，所以这个问题也就解决了，不需要再操心刷新 CDN 的问题了。

## 参考链接

- [GitHub 图床的正确用法，通过 jsDelivr CDN 全球加速](https://hacpai.com/article/1583894928771)
- [jsDelivr 为开发者提供免费公共 CDN 加速服务](https://blog.csdn.net/larpland/article/details/101349605)
- [Features - jsDelivr](https://www.jsdelivr.com/features)

## 相关文章

- [使用 jsDelivr 免费加速 GitHub Pages 博客的静态资源（二）](https://mazhuang.org/2020/10/07/cdn-for-github-pages-2/)
