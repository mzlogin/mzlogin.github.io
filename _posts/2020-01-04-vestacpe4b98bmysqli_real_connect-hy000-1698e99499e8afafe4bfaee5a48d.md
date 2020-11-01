---
id: 111
title: 'VestaCP之mysqli_real_connect(): (HY000/1698)错误修复'
date: 2020-01-04T11:11:10+08:00
author: netrob
excerpt: 'mysqli_real_connect(): (HY000/1698): Access denied for user ‘root’@’localhost’错误修复。'
layout: post
guid: https://www.justcn.cn/?p=111
permalink: '/vestacp%e4%b9%8bmysqli_real_connect-hy000-1698%e9%94%99%e8%af%af%e4%bf%ae%e5%a4%8d/'
Fanly_Submit:
  - OK
categories:
  - 网络技术
tags:
  - mysql
  - 错误
---
重装Ubuntu系统和vestacp后，发生了不少奇怪的问题。大部分是由于系统升级造成的。导致root无法登陆mysql提示错误：  
mysqli\_real\_connect(): (HY000/1698): Access denied for user ‘root’@’localhost’  
1698 – Access denied for user ‘root’@’localhost’ 

## 操作与分析

拒绝访问数据库的通常是访问权限受限。受限查看是否root拥有远程访问权限：显示MySQL 用户列表命令：  
SELECT User, Host FROM mysql.user;  
输出应类似于以下内容：  
+——————+———–+  
| user | host |  
+——————+———–+  
| root | localhost |  
| luke | % |  
| yoda | % |  
| jabba | 10.10.0.6 |  
| jabba | 10.10.0.9 |  
| chewbacca | localhost |  
| leia | localhost |  
| han | localhost |  
+——————+———–+  
8 rows in set (0.00 sec)

root只有localhost权限，改成%即可拥有远程权限，但这并不安全，因此不建议修改。

**关闭、开启MySQL root用户远程访问权限命令**  
关闭MySQL root用户远程访问权限：

<blockquote class="wp-block-quote">
  <p>
    use mysql;<br />update user set host = “localhost” where user = “root” and host = “%”;<br />flush privileges;
  </p>
</blockquote>

打开MySQL root用户的远程访问权限：

<blockquote class="wp-block-quote">
  <p>
    use mysql;<br />update user set host = “%” where user = “root”;<br />flush privileges;
  </p>
</blockquote>

重新登录web端访问mysql，发现问题并没有解决，并出现新的错误提示：  
mysql -u root  
ERROR 1045 (28000): Access denied for user ‘root’@’localhost’  
  
如果plugin是socket的，则只允许客户端登录。再次百度若设置数据库 没有设置密码，之后在登录的时候出现错误 ERROR 1045 (28000) 。

## 修改 plugin 参数

同样，先列出用户表的 plugin 参数信息：  
select user, plugin from mysql.user;  


发现root为 auth\_socket ，修改为mysql\_native_password即可

<blockquote class="wp-block-quote">
  <p>
    update user set plugin = “mysql_native_password” where user = “root”;<br /> flush privileges;<br />修改回来的命令：<br /> update user set plugin = “auth_socket” where user = “root”;<br /> flush privileges;
  </p>
</blockquote>

**相关mysql命令：**新版mysql要用sudo来进行登录：  
sudo mysql -u root -p设置mysql密码：  
set password for ‘root’@’localhost’ = password(‘设置mysql密码’);  
flush privileges; service mysql stop  
service mysql restart 退出mysql  
quit  
\q  
Crtl+C

对于JustCN这类业余人士而言，不能依靠技术能力来解决问题，只能通过分析和猜测。通常思路为：找到错误代码，百度寻找控制出错误的参数，通过对比已有数据并修改参数来尝试解决。做工业品推广多年，分析源于分类。 先做数据， 分类建模型。测试模型的实用性。无效则重新以上步骤。