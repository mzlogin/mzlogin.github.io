---
layout: post
title: 为绑定域名的 GitHub Pages 启用 HTTPS
categories: GitHub
description: 为绑定域名的 GitHub Pages 添加免费、自动续期的 SSL 证书，简单几步开启 HTTPS，添加小绿锁。
keywords: GitHub Pages, SSL, Let's Encrypt
---

**Update 2016/07/11: 收到 Kloudsec 的邮件，说将在 2016/08/01 停止服务，所以如下方法在那之后会无法使用，寻找 GitHub Pages + Custom Domain + HTTPS 的方法的童鞋请不要再尝试 Kloudsec 了，去找一找别的方法吧。**

虽然现在各种网站都在 HTTPS 化，甚至有的个人网站在添加链接的说明里明确声明只与启用 HTTPS 的网站交换链接，但一直以来我启用 HTTPS 的需求并不强烈，又加上有懒癌在身，实在是没有动力去折腾，直到最近发生了几件事情。

## 缘起

1. 最近一段时间也不知道是 GitHub Pages 做了调整还是 Google 的收录策略有了变化，Google 收录我的博客页面都是同时收录了 HTTP 和 HTTPS 两种版本，而很遗憾这个博客并没有配置有效的 SSL 证书，所以点开的是一个 HTTPS 的链接就会被浏览器提示连接不可信，有安全风险云云，虽然访问量不大，但这样体验太差，也是蛮闹心的。

2. 恰逢知乎上有人邀我答题 [Github Pages 绑定了个人域名，怎么使用 HTTPS 访问而证书不报错呢？][1]。

3. 三月份的时候 [@nubela][2] 发邮件邀请我试用他为绑定域名的 GitHub Pages 制作的一键启用 HTTPS 的工具，而我当时答复的是实在太忙，后来有空再折腾。

几个理由加在一起，终于战胜了懒癌，让我动了起来。

![enable https for GitHub Pages](/images/posts/github/github-pages-with-https.png)

## 步骤

@nubela 提供的工具非常友好且方便，第一次使用的我只简单做了一些配置，没有对 GitHub Pages 仓库做任何更改就实现了全站 HTTPS 化，自动使用了 Let's Encrypt 提供的免费 SSL 证书，有效期 90 天，Kloudsec 会在它过期前自动续期，换句话说，只要 Kloudsec 还活着并且免费提供这项服务的话，后面就不用管这个了。

记录操作步骤如下：

1. 打开 Kloudsec 为 GitHub Pages 提供的工具 [Kloudsec for GitHub Pages][3]。

2. 按工具里的要求填好三个部分的内容，依次是

   * 用于注册 Kloudsec 的邮箱和为 Kloudsec 账户设置的密码。

     ![Register a Kloudsec account](/images/posts/github/https-kloudsec-account.png)

   * GitHub Pages 项目的 URL 和绑定的域名。

     ![Configure your Github Page](/images/posts/github/https-config-gh.png)

   * 到你的域名解析控制面板里添加工具要求的 A 记录。

     ![Configure your DNS settings](/images/posts/github/https-config-dns.png)

     **注意：** 每个 A 记录应只保留一个 IP，比如之前将 @ 做了 A 记录到 GitHub Pages 的 IP 上了，那现在将其删除，并添加工具提供的 IP。

3. 去上一步填写的邮箱里收邮件，激活 Kloudsec 账号并登录。

4. 进入到 Dashboard 的 SETTINGS，在 Web Server Origin IP / Hostname 一栏填上 GitHub Pages 的可用 IP，比如我填写的是 `103.245.222.133`。

   ![Web Server Origin IP](/images/posts/github/https-config-server-ip.png)

5. 开启 HTTP 自动跳转到 HTTPS。*（非必须，按自己需求来。）*

   进入到 Dashboard 的 PROTECTION，点击 SSL Encryption 里的按钮，选择你的网站：

   ![PROTECTION](/images/posts/github/https-config-redirection-1.png)

   将 Automatically redirect to HTTPS site? 下面的开关切换到 ON：

   ![Automatically redirect to HTTPS site?](/images/posts/github/https-config-redirection-2.png)

6. 进入到 Dashboard 的 PLUGIN STORE，启用 Offline Protection、Page Optimizer 和 One-Click Encryption，一般来讲免费的计划就够用了，如果你想要使用付费计划提供更多更好的服务，那按需选择吧。

   ![Plugin Store](/images/posts/github/https-config-plugin-store.png)

恭喜你已完成所有步骤！等待几分钟生效即可。

## 后话

### 实现原理

看 Kloudsec 的文档里描述的 [HOW DOES IT WORK?](https://docs.kloudsec.com/#section-how-does-it-work-)，它提供的服务处于我们的网站服务器和我们的网站访问者之间，其原理是缓存了我们服务器上的页面，所以实际用户建立的 HTTPS 连接是用户的浏览器与 Kloudsec 之间的。

### 使用 Kloudsec 的好处

* 摆脱了证书不可信存在安全风险的不友好提示。

* 配置方便，一劳永逸。

* 访问速度并未受影响~~，因为缓存里优化了图片大小，合并了 CSS/JS，甚至可能更快了。~~

* 小绿锁看着舒心。

### 使用 Kloudsec 的风险和影响

* 貌似是个小公司，这样的免费服务能提供多长时间只有天知道。

* ~~因为用户看到是在 Kloudsec 上的缓存页面，所以我们更新 GitHub Pages 内容后，刷新线上页面效果的时间变久了，以前上传完基本马上就能看到，现在有时候部分页面会延迟两三分钟，我勉强能接受。~~

  Update: 2016/6/16 现在基本上传完马上就能看到了。

* ~~很偶尔会出现样式加载不完整的情况，刷新就好了。~~

  Update: 2016/6/16 最近基本没出现过了。

* ~~缓存页面合并了 CSS 和 JS 文件，使用开发工具在线调试时要找到样式源文件变困难了——可能看到全都在一个 CSS 文件里。不过我大部分情况下都是用 Jekyll 在本地调试好再上传，这点对我影响不大。~~

  Update: 2016/6/16 现在貌似不会合并了。

* 如果引用了其它域名下的非 HTTPS 的 CSS 和图片资源等，开发者控制台下会有 error，显示不受影响。

* ~~Google 索引状态会受影响，目前本博客来自 Google 的流量完全没有了，估计需要一段时间才能恢复。~~

  Update: 2016/6/16 应该影响不大，只是 Google Search Console 将 http 与 https 的未当成一个网站来统计，所以给我造成错觉了。

接下来，能做的就是祈祷 Kloudsec 不要挂了。:laughing:

## 其它做法

如果使用 GitLab 提供的 Pages 服务，那它直接支持添加自定义域名的 SSL 证书，可以配合免费申请的 SSL 证书一起使用。详情可见 [零成本打造安全博客的简单办法](https://www.figotan.org/2016/04/26/using-free-wosign-to-certificate-your-blog-on-gitlab/)。

[1]: https://www.zhihu.com/question/33495825
[2]: https://github.com/nubela
[3]: https://kloudsec.com/github-pages/new
