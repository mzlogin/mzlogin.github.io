---
id: 438
title: WordPress海外询盘的邮件转发设置
date: 2020-04-02T16:39:39+08:00
author: netrob
layout: post
guid: https://www.justcn.cn/?p=438
permalink: '/wordpress%e6%b5%b7%e5%a4%96%e8%af%a2%e7%9b%98%e7%9a%84%e9%82%ae%e4%bb%b6%e8%bd%ac%e5%8f%91%e8%ae%be%e7%bd%ae/'
categories:
  - 网络技术
tags:
  - wordpress
  - 邮件转发
---
WordPress做外贸推广网站非常普遍，而Contact Form 7是非常理想的免费询盘提交和转发功能。但是，大多数服务器空间都不是为WP设计的，因此邮件转发功能并不好用。最简单的方式是增加WP SMTP插件，如WP Mail SMTP by WPForms，来设置SMTP邮件转发功能。

### 如何设置WP Mail SMTP

WP Mail SMTP by WPForms提供邮件测试功能，但是基本只能提供一个方向。优先设置最保守方案，让测试能通过。如强制使用 [发件人电子邮件地址] 设置，SSL加密。服务器防火墙开启对应的端口。其它为标准设置如：

  * SMTP 主机：smtp.ym.163.com（163企业邮箱为例）
  * SMTP 端口：（ 查看邮件服务器）
  * SMTP用户名： test@test.com
  * SMTP 密码：密码

当出现网站500错误是，关闭自动 TLS。保存后，测试邮件并查看邮箱是否收到。如果依然有错，查看底部的错误代码。

注意：配置 WP SMTP 和 Contact Form 7 时测试多了，当邮件服务器有反垃圾邮件机制，可能就当成垃圾邮件拦截了。导致配置失败，通常换个邮箱即可解决问题。但最好控制测试频率和数量。

### Contact Form 7 设置转发和接收邮箱

WP SMTP插件测试邮件发送成功后，Contact Form 7安装和调用即可。一个典型的表单form类似如：

<pre class="wp-block-code"><code>&lt;label>Your Name (required)&lt;/label>
&#91;text* your-name]&lt;/p>

&lt;label>Your Country(required)&lt;/label>
&#91;text* YourCountry]&lt;/p>

&lt;label>Your Email (required)&lt;/label>
&#91;email*  your-email] &lt;/p>

&lt;label>Your Message(required)&lt;/label>
&#91;textarea* your-subject]

&#91;submit class:button primary "Submit"]</code></pre><figure class="wp-block-image size-full">

<img loading="lazy" width="590" height="541" src="https://www.justcn.cn/wp-content/uploads/2020/04/Contact-Form-7设置和调用.jpg" alt="Contact Form 7设置和调用" class="wp-image-441" srcset="https://www.justcn.cn/wp-content/uploads/2020/04/Contact-Form-7设置和调用.jpg 590w, https://www.justcn.cn/wp-content/uploads/2020/04/Contact-Form-7设置和调用-300x275.jpg 300w" sizes="(max-width: 590px) 100vw, 590px" /> <figcaption>Contact Form 7设置和调用</figcaption></figure> 

  1. 安装完Contact Form 7插件后，左侧菜单会新增一个“联系”菜单，新建一个表单。基本默认即可；
  2. 在表单标签，设置需要客户填写的信息分类；
  3. 在邮箱标签，设置转发的邮箱和邮件模板；如想记录客户的IP和访问url，则增加 IP is [\_remote\_ip], from [_url]；更多邮件标签信息可查看：<https://contactform7.com/tag-syntax/#mail_tag>  
    
  4. 在留言标签，设置客户提交询盘成功或失败的信息；
  5. 保存
  6. 在需要的页面，直接粘贴复制你刚才保存的表单代码，类似：  
    [contact-form-7 id=&#8221;3638&#8243; title=&#8221;Contact form&#8221;]

### 在wordpress上保留询盘

Contact Form 7是不保留询盘信息的，特别是客户提交失败的情况。因此需要Flamingo插件，一个由同一个作者设计的插件，当客户提交询盘，无论成功与否都保留在wp数据库中。安装后，不用设置。

注意：为了在Flamingo的收件箱中的主题栏目下，看到具体的邮件内容，需要在Contact Form 7，设置your-subject这个必填标签。否则会在清除垃圾邮件时因看不到内容而非常痛苦。