---
id: 23
title: WordPress安全设置之手动修改后台地址路径
date: 2019-11-28T03:49:50+08:00
author: netrob
excerpt: 用纯代码修改WordPress后台 wp-login地址，以增加安全性。
layout: post
guid: https://www.justcn.cn/?p=23
permalink: '/wordpress%e5%ae%89%e5%85%a8%e8%ae%be%e7%bd%ae%e4%b9%8b%e6%89%8b%e5%8a%a8%e4%bf%ae%e6%94%b9%e5%90%8e%e5%8f%b0%e5%9c%b0%e5%9d%80%e8%b7%af%e5%be%84/'
categories:
  - 网络技术
tags:
  - wordpress
  - 安全
---
用过WordPress的都知道后台为 wp-login ，安全考虑本次为纯代码修改后台地址，共两个文件：

  1. 修改 wp-login.php 文件名，如justcn.php，你自己开心就好。 替换所有wp-login字符为 justcn。
  2. 找到wp-includes目录内的general-template.php文件， 找到如下代码，  
    **_$login\_url = site\_url(‘ wp-login.php’, ‘login’);_**  
    将wp-login 替换为任意名字，如anycall。
  3. 然后搜索 general-template.php文件 所有wp-login替换为 justcn 。

插件法： **WPS Hide Login** 也是一个不错的选择。特别是省去升级带来的反复修改代码问题。好了收工，测试一下新后台吧。