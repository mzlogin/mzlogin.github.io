---
layout: post
title: 使用 jsDelivr 免费加速 GitHub Pages 博客的静态资源（二）
categories: GitHub
description: 使用 jsDelivr 加速 GitHub Pages 博客的图片资源、站内搜索引用的 JSON 资源。
keywords: GitHub, CDN, jsdelivr
---

之前写过一篇 [使用 jsDelivr 免费加速 GitHub Pages 博客的静态资源](https://mazhuang.org/2020/05/01/cdn-for-github-pages/)，在那之后，又陆续想到并实施了几点利用 jsDelivr 进一步加速静态资源加载的措施，新起一篇作为记录和分享。

继上一轮改造过后，比较拖页面加载速度的主要有三点：

1. 页面首个请求响应时间；
2. 图片资源加载时间；
3. 站内搜索引用的 JSON 资源加载时间。

第 1 点在页面仍然托管在 GitHub Pages 的前提下，似乎没有什么好办法能产生质的飞跃；本篇主要改善了第 2 点和第 3 点。

## 0x01 图片资源加速

这里所说的图片主要是指文章里引用的图片。

我一直将图片放在博客源码根目录的 images 文件夹下，引用图片的习惯写法是这样的：

```markdown
![after use cdn](/images/posts/github/cdn-after.png)
```

如果想将这个图片地址替换为 jsDelivr 的地址，需要做的就是将 `/images` 替换为 `https://fastly.jsdelivr.net/gh/mzlogin/mzlogin.github.io@master/images`。

一处一处替换行不行？当然也行，但后面写新文章时要引用图片，还得手动写这一长串，不方便；万一 jsDeliver 出状况，也不好一键切换回来。有没有一劳永逸的方法？当然也有，我们从 Jekyll 的 layout 机制来想办法。

Jekyll 的 layout 可以理解为页面模板，它是可以继承的，比如我的博客的所有页面模板有一个共同的祖先模板 _layouts/default.html，模板里可以使用 [Liquid](https://github.com/Shopify/liquid/wiki/Liquid-for-Designers) 语法对内容进行处理，我们可以利用这一点，来自动完成批量替换的工作。

关键代码如下：

{% raw %}
```liquid
{% assign assets_base_url = site.url %}
{% if site.cdn.jsdelivr.enabled %}
{% assign assets_base_url = "https://fastly.jsdelivr.net/gh/" | append: site.repository | append: '@master' %}
{% endif %}
{% assign assets_images_url = 'src="' | append: assets_base_url | append: "/images" %}
{% include header.html %}
    {{ content | replace: 'src="/images', assets_images_url }}
{% include footer.html %}
```
{% endraw %}

大意就是，如果打开了启用 jsDelivr 加速的开关，就将 `content` 里的 `src="/images"` 替换为 `src="https://fastly.jsdelivr.net/gh/mzlogin/mzlogin.github.io@master/images"`，否则替换为 `src="https://mazhuang.org/images"`。

以上便达成了我们的目的。

## 0x02 站内搜索引用的 JSON 资源加速

我是使用 [Simple-Jekyll-Search](https://github.com/christian-fei/Simple-Jekyll-Search) 这个 JavaScript 库来实现站内搜索的，它的搜索数据是来自一个动态生成的 JSON 文件。

这个 JSON 文件编译前长这样：

<https://github.com/mzlogin/mzlogin.github.io/blob/master/assets/search_data.json>

Jekyll 编译后长这样：

<https://mazhuang.org/assets/search_data.json>

这样的资源是没有办法直接通过替换网址来用 jsDelivr 加速的，因为 jsDelivr 上缓存的是编译前的文件，而我们需要的是编译后的。

那我们就想办法：

1. 将博客源码编译；
2. 将编译结果保存到另一个分支；
3. 通过 jsDelivr 引用新分支上的这个文件。

这些步骤可以通过 GitHub 去年推出的新特性 [Actions](https://github.com/features/actions) 来完成，在我们每一次向博客源码仓库 push 代码时自动触发。

关键步骤如下：

1. 在 GitHub 新建一个 Personal access Token：

    Settings --> Developer settings --> Personal access tokens --> Generate new token --> 填写 note，勾选 public_repo，生成之后复制 token 值备用。

2. 在博客源码仓库的 Settings --> Secrets --> New secret，Name 填 `ACCESS_TOKEN`，Value 填第 1 步里复制的 token 值；

3. 在博客源码根目录下新建文件 .github/workflows/ci.yml，内容如下：

    ```yaml
    name: Build and Deploy

    on:
      push:
        branches: [ master ]

    jobs:
      build-and-deploy:
        runs-on: ubuntu-latest
        steps:
          - name: Checkout
            uses: actions/checkout@v2.3.1
            with: 
              persist-credentials: false

          - name: Set Ruby 2.7
            uses: actions/setup-ruby@v1
            with:
              ruby-version: 2.7

          - name: Install and Build
            run: |
              gem install bundler
              bundle install
              bundle exec jekyll build
            
          - name: Deploy
            uses: JamesIves/github-pages-deploy-action@3.6.2
            with:
              ACCESS_TOKEN: ${{ secrets.ACCESS_TOKEN }}
              BRANCH: built
              FOLDER: _site
              CLEAN: true
    ```

    大意就是在向 master 分支 push 代码时，自动执行 checkout、初始化 ruby 环境、安装 Jekyll 并编译博客源码的工作，最后将编译生成的 _site 目录里的内容推送到 built 分支。对 GitHub Actions 感兴趣的同学可以自行参考官方说明学习。

4. 修改引用 JSON 文件的地方，比如我的 _includes/sidebar-search.html 里的写法由：

    ```javascript
    json: '{{ site.url }}/assets/search_data.json',
    ```

    改为了

    {% raw %}
    ```liquid
    {% if site.cdn.jsdelivr.enabled and site.url contains 'mazhuang.org' %}
      json: 'https://fastly.jsdelivr.net/gh/mzlogin/mzlogin.github.io@built/assets/search_data.json',
    {% else %}
      json: '{{ site.url }}/assets/search_data.json',
    {% endif %}
    ```
    {% endraw %}

5. 将以上更改推送到源码仓库，等待处理完成即可。

## 0x03 结语

经过以上改造，博客页面的加载速度又得到了小小的提升，所有相关源码可以在 <https://github.com/mzlogin/mzlogin.github.io> 找到，有相关心得或建议的朋友欢迎交流指正。

相关文章：

- [使用 jsDelivr 免费加速 GitHub Pages 博客的静态资源](https://mazhuang.org/2020/05/01/cdn-for-github-pages/)
