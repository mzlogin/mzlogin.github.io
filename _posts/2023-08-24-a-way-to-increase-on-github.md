---
layout: post
title: 发现一种增加在 GitHub 曝光量的方法，已举报
categories: [GitHub]
description: 今天偶然看到一种增加项目和个人在 GitHub 曝光量的方法，但感觉无法赞同这种做法，已经向 GitHub 官方举报。
keywords: GitHub
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

今天偶然看到一种增加项目和个人在 GitHub 曝光量的方法，但感觉无法赞同这种做法，已经向 GitHub 官方举报。

具体怎么回事呢？我上周在 Vim 插件大佬 [tpope][1] 的一个项目提了个 Issue，但一周过去了，大佬也没有回应，我就去他的 GitHub 主页确认他这一周有没有活动记录，看到他最近的提交活动是给 [github/copilot.vim][2] 项目——这是 GitHub Copilot 的官方 Vim 插件项目，我也在用，心想这也太巧了吧，于是点进项目主页看了一眼，大佬果然是大佬，竟然是这个插件的主要维护者，不由心生赞叹，同时在 Contributors 列表的上方我还发现了一个以前没太注意到的信息，「Used by」：

![](/images/posts/github/github-project-used-by.png)
*Figure 1. copilot.vim's Used by*

好奇心驱使，点进去看看大家能依赖一个 Vim 插件构建一些什么项目：

![](/images/posts/github/repositories-depend-on-copilot.png)
*Figure 2. 依赖 copilot.vim 的项目*

列表里的六个项目点进去基本都是空项目或者仅仅作为个人主页的 README 展示的，只有倒数第二个是有实质内容的项目（但最终发现它也没有实质依赖上面的插件）。

它们的共同点是在项目里有一个巨大的 go.mod 文件（初步判断出自 [akirataguchi115][6] 之手），里面列出了大量的依赖，足足有六千多行，但实际上都是没有用到的。里面列举的托管在 GitHub 上的「依赖」项目，我随便扫了一眼，有一些熟悉的名字，比如 [HelloGitHub][3]、[996.ICU][4] 等都赫然在列，甚至还包括了我的 [awesome-adb][5]，随机打开几个链接看了下，都是 Star 数量 5K+ 的热门项目，而且基本上都不是 package 类项目，不可能被作为依赖包。

![](/images/posts/github/go-mod-contents.png)
*Figure 3. go.mod 文件内容*

至此恍然大悟：这几千个热门项目的浏览量是比较大，然后它们的首页的「Used by」都会显示上面 *Figure 1* 里的这几个人，点进去都会看到 *Figure 2* 里的这几个项目……妙啊！引流效果一定不错！

但是，我对这种做法感到恶心。这「巧妙」地利用了 GitHub 的一个功能，但是扰乱了项目间正常的依赖关系的链接和展示，让真正需要的人筛选和寻找正确的信息更加费劲。

如果想要在热门项目的主页里曝光自己，应该通过正常的方式去做，比如提交 PR、提 Issue、参与 Discussions、真正基于它们做一些实质性的项目等，而不是通过这种「巧妙」的方式。

不然，即使获得了流量和曝光量，也只是遭人唾弃的「现眼包」。

在写这篇文章的同时，我已经向 GitHub 官方举报了这个问题，看看官方如何看待吧。

[1]: https://github.com/tpope
[2]: https://github.com/github/copilot.vim
[3]: https://github.com/521xueweihan/HelloGitHub
[4]: https://github.com/996icu/996.ICU
[5]: https://github.com/mzlogin/awesome-adb
[6]: https://github.com/akirataguchi115
