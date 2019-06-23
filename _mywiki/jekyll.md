---
layout: wiki
title: jekyll
categories: jekyll
description: 使用jekyll过程中的一些总结
keywords: Linux
---

> jekyll官方文档[:space_invader:](https://www.jekyll.com.cn/docs/)

### jekyll的本地环境搭建

*本来我是打死不想弄本地环境的，因为配环境什么的太麻烦了，直接push到GitHub上然后刷新不就行了吗？简单的写好文章放到`_post`里面当然可以，可以要改网页格式什么的要实时看到效果，还是不得已搭建本地环境，真香。*

#### 安装ruby

> 看到网上很多的东西都是把ruby和devkit分开装，但是官网两个现在好像可以一起下载安装。

**官网**：[:raising_hand_woman:](https://rubyinstaller.org/downloads/) ，选择`rubyinstaller-devkit-2.5.5-1-x64.exe`下载

*官网速度很慢，可以用`IDM`和`FDM`等下载工具下载。*

**注意：最后不要勾选`ridk install`选项**

#### 安装MSYS2

*这个东西就是前面没有勾选的，不过为什么在这里下载我也不知道，但是这样做确实是可以的，不这样做可不可以我就不知道了*

cmd窗口输入下列命令，选项123选择3

```bash
ridk install
```

#### 安装bundler

同样是命令行输入

```bash
gem install bundler
```

#### 安装jekyll

```bash
gem install jekyll
```

*环境部分安装结束啦~*

#### 创建博客or调试博客

创建：

```bash
jekyll new yourblog
```

调试（注意要命令行打开到博客的根目录下）:

```bash
bundle exec jekyll serve
```

然后打开`http://localhost:4000`即可。

*安装过程参考：*[:tophat:](https://foochane.cn/article/2019051905.html)

## 技巧

### 支持latex的`$__$`

1. 在线方式
   
   在`header.html`中添加以下代码：
   
   ```javascript
   <script src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
   ```

2. 本地方式
   
   下载[`MathJax.js`](http://cdn.mathjax.org/mathjax/latest/MathJax.js), 在`header.html`中添加下列代码
   
   ```javascript
   <script src="{{ "/yourpath/MathJax.js?config=TeX-AMS-MML_HTMLorMML" | prepend: site.baseurl }}"></script>
   ```

*推荐使用第一种方法，参考*[:grinning:](https://www.jianshu.com/p/bb184f61c9ae)

3. 补充方法
   
   *为什么会有这个补充方式呢？:slightly_smiling_face: ，因为之前用的第一个方法突然不能用了？时灵时不灵。所以第三种方法是新找到的，虽然我觉得三种方法几乎一毛一样，但还是放出来给自己做个笔记。希望不要给我找第四种方法的机会。*
   
   在`header.html`中添加以下代码：
   
   ```javascript
   <script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
   
   <script type="text/x-mathjax-config">
   MathJax.Hub.Config({
     tex2jax: {
       inlineMath: [['$','$'], ['\\(','\\)']],
       processEscapes: true
     }
   });
   </script>
   
   <script type="text/x-mathjax-config">
       MathJax.Hub.Config({
         tex2jax: {
           skipTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
         }
       });
   </script>
   ```

*第三种方法来自[:tophat:](https://blog.csdn.net/xky1306102chenhong/article/details/88317351)*
