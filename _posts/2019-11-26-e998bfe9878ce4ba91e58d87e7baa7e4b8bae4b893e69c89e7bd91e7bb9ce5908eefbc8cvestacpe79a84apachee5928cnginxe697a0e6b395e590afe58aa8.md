---
id: 1
title: 阿里云升级为专有网络后，VestaCP的apache和nginx无法启动
date: 2019-11-26T14:06:07+08:00
author: netrob
excerpt: '阿里云升级为专有网络后，VestaCP的apache和nginx无法启动，显示502错误。[emerg]: bind() to IP failed (99: Cannot assign requested address)'
layout: post
guid: https://www.justcn.cn/?p=1
permalink: '/%e9%98%bf%e9%87%8c%e4%ba%91%e5%8d%87%e7%ba%a7%e4%b8%ba%e4%b8%93%e6%9c%89%e7%bd%91%e7%bb%9c%e5%90%8e%ef%bc%8cvestacp%e7%9a%84apache%e5%92%8cnginx%e6%97%a0%e6%b3%95%e5%90%af%e5%8a%a8/'
categories:
  - 海外推广方案
  - 网络技术
tags:
  - 502错误
  - VestaCP
  - 阿里云
---
这是一篇半吐槽阿里云糟糕的技术售后,一半提供个人解决思路的blog。网站交着google付费点击的钱，而阿里云客服还在和你说502错误的可能原因。 Starting nginx: [emerg]: bind() to IP failed (99: Cannot assign requested address)

### 起因

经阿里云后台一再提醒，最后接受预约了从经典网络转到专有网络。整个过程很顺利，除了结果网站打不开，显示502错误的结果外。我第一时间恢复了今天，以及上周和上月的快照，结果都是一样。进入VestaCP后台，发现apache2和Nginx无法启动，而Mysql正常。  
就是PHP环境崩掉了，而Mysql服务正常。这个在后期linux中直接命令访问数据库得以验证。

### 寻求阿里云售后帮助

很显然，服务器本身没有任何操作和致命故障，那应该是联网方式出了问题。我并不是专家所以赶紧寻求客服的帮助。  
四十岁的人了，所以处理问题以解决问题为先，骂街要等闲时。ε=(´ο｀*)))唉

<blockquote class="wp-block-quote">
  <p>
    <strong>售后工程师 : 您好，请登录您的服务器执行 df -h 与netstat -nltp ps aux|grep php 截图反馈，查看服务器空间是否正常， 数据库与php服务是否启动， 一般服务器报错502 是数据库连接有问题与php服务导致的 </strong>
  </p>
  
  <p>
    <strong>售后工程师 : 您好，您那边是经典网络迁移专有网络吗？ 专有网络转载服务器内部是查看不到公网ip地址的 您那边执行mysql -h127.1 -P3306 -uroot -p 查看是否可以连接数据库 如果可以连接表示数据库正常， 在查看一下， 网站中连接数据库的地址是什么，如果是服务器的公网ip地址， 改为127.0.0.1或服务器的内网ip地址在测试洗衣啊 </strong> （错别字告诉我，的确是真人回复）
  </p>
</blockquote>

而最值得吐槽的是前后两次对比，刚处理故障时，和暂时没有解决问题时的回复

<blockquote class="wp-block-quote">
  <p>
    <strong> 售后工程师 : 您好， 经典网络迁移专有网络后，不需要进行任何特殊配置，ECS实例的公网IP都不变。 迁移不会修改您的数据，只是网络类型的改变，您的感知就是一次重启服务器。</strong>
  </p>
  
  <p>
    <strong>售后工程师 : 您好，网络迁移过程中是有相关提示的。 重置系统以后您还需要重新部署业务，请问您是否按照上述给您的方案联系您的nginx和apache的网站配置人员修改ip地址呢？ 即使是不修改ip地址地址，也不至于导致网站程序无法启动，只会外界无法通过ip识别到您的网站。 程序无法启动和更换网络没有直接关系，属于应用层面的报错，需要结合程序的错误日志来做处理。 </strong>
  </p>
</blockquote>

  1. 第一次知道重启服务器为导致apache和Nginx起不来；重启=重新部署业务？
  2. 更换网络会导致程序错误？甚至会导致 apache和Nginx 崩掉？

### 个人解决思路

我的mysq连接地址是localhost，且服务器环境是支持的。在看到应用层报错的思路后，我默默的退出了，自己google。 尝试启动Nginx，寻找错误信息  
`$ sudo /etc/init.d/nginx start`  
忽略大量警告错误后，看到了  
`<a href="https://stackoverflow.com/questions/3191509/nginx-error-99-cannot-assign-requested-address">Starting nginx: [emerg]: bind() to IP failed (99: Cannot assign requested address)</a>`  
老外解决思路很清晰，理解为，阿里云的专有网络类似于Amazon EC2的弹性云网络，那么需要告诉linux，允许程序绑定到非本地的地址。这显然不是程序的应用层出了问题，是服务器环境改变了，重新部署环境是必要的。后面直接copy了。Ubuntu中，在/etc/sysctl.conf 中加入以下代码：

<pre class="wp-block-code"><code># allow processes to bind to the non-local address
# (necessary for apache/nginx in Amazon EC2)
net.ipv4.ip_nonlocal_bind = 1
</code></pre>

重新加载 sysctl.conf 的命令: $ sysctl -p /etc/sysctl.conf

APACHE和Nginx恢复了。  
但是出现了一大批新的问题，包括SSL加密，好在都有应对方案。个人感觉，阿里云的售后如同外行查询资料库回答问题。而华为是真正的技术员在处理故障。讽刺的是，我的所有网络都在阿里云上。真打脸。hah~