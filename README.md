码志
=================

我的个人博客：<http://mazhuang.org>，外观基于 [DONGChuan](http://dongchuan.github.io) 修改，感谢！

欢迎 Star 和 Fork。

### Fork 指南

Fork 本项目之后，还需要做一些事情才能让你的页面「正确」跑起来。

1. 正确设置项目名称与分支。

   按照 GitHub Pages 的规定，名称为 `username.github.io` 的项目的 master 分支，或者其它名称的项目的 gh-pages 分支可以自动生成 GitHub Pages 页面。

2. 修改域名。

   如果你需要绑定自己的域名，那么修改 CNAME 文件的内容；如果不需要绑定自己的域名，那么删掉 CNAME 文件。

3. 修改配置。

   网站的配置基本都集中在 _config.yml 文件中，将其中与个人信息相关的部分替换成你自己的，比如网站的 title、subtitle 和 disqus 的用户名等。

4. 删除我的博客文章。

   _posts 与 _drafts 文件夹中除了 template.md 文件外，其它均为我的博客文章，可以全部删除，然后往 _posts 里添加自己的博客文章。

5. 修改「关于」页面。

   pages/about.md 文件内容对应网站的「关于」页面，里面的内容多为个人相关，将它们替换成自己的信息。

### 书写原则

1. 简约，尽量每个页面都不展示多余的内容。

2. 有时一图抵千言，有时可能只会拖慢网页加载速度。

3. 言之有物，不做无痛之呻吟。

### 书写提示

1. 在 Github Flavored Markdown 书写与 Redcarpt 有些许差异，可以参考 [GFM 与 Redcarpet 的不同点][2]。

2. 中英文之间要加空格，更多中文文案排版规范可以参考 [中文文案排版指北（简体中文版）][1]。

3. 在本地预览博客效果可以参考 [Setting up your Pages site locally with Jekyll][3]。

### 书写经验

* 如果写技术文章，那先将技术原理完全理清了再开始写，一边摸索技术一边组织文章效率较低。

* 杜绝难断句、难理解的长句子，如果不能将其拆分成几个简洁的短句，说明脑中的理解并不清晰。

### 书写思考

* 那些高质量的博主，他们的行文，内容组织方式，有什么值得学习借鉴的地方？

[1]: https://github.com/mzlogin/chinese-copywriting-guidelines
[2]: http://mazhuang.org/2015/12/05/diff-between-gfm-and-redcarpet/
[3]: https://help.github.com/articles/setting-up-your-pages-site-locally-with-jekyll/
