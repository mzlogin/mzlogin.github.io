---
layout: post
title: VestaCP 及 Ubuntu常规安全加固-更换默认登录端口
date: 2021-01-22
description: Vestacp常规加固。
keywords: Vestacp, Ubuntu, 安全
permalink: '/VestaCP及Ubuntu常规安全加固-更换默认登录端口/'
tags:
  - Vestacp
  - Ubuntu
  - 安全
categories: 
- 服务器及建站

   
---

修改完Vestacp端口，记得修改防火墙端口号，必要时重启。后面不再说明。除了命令操作外，灵兮更喜欢winscp窗口操作。
### 修改默认VESTA 8083端口

1. 修改nginx中的配置文件
vi /usr/local/vesta/nginx/conf/nginx.conf在编辑器中找到 8083，修改成你想要的端口；保存退出。
2. 重启vesta ：service vesta restart

### 修改默认phpmyadmin路径

1. vim /etc/apache2/conf.d/phpmyadmin.conf找到
Alias /phpmyadmin  /usr/share/phpmyadmin

2. Alias后面的phpmyadmin  改成你需要的名字，比如改成了/justcn-mysql，然后在面板里重启apache服务器就可以了。下次访问就可以通过http://ip/justcn-mysql来访问。
3. 上面只是修改了phpmyadmin 的链接地址，而不能直接从VestaCP后台直接访问，会出错。现在来修复下后台模版文件的链接。共有5处修改：
4. 
    1. /usr/local/vesta/web/templates/admin/list_db.html找到这行
    if ($data[$key]['TYPE'] == 'mysql') $db_admin_link = "http://".$http_host."/phpmyadmin/";
    修改为:
    if ($data[$key]['TYPE'] == 'mysql') $db_admin_link = "http://".$http_host."/justcn-mysql/";  <br>
    $db_myadmin_link = "http://".$http_host."phpmyadmin/";
    修改为
    $db_myadmin_link = "http://".$http_host."justcn-mysql/";

    2. /usr/local/vesta/web/templates/user/list_db.html
    if ($data[$key]['TYPE'] == 'mysql') $db_admin_link = "http://".$http_host."/phpmyadmin/";
    修改为:
    if ($data[$key]['TYPE'] == 'mysql') $db_admin_link = "http://".$http_host."/justcn-mysql/";<br>
    $db_myadmin_link = "http://".$http_host."phpmyadmin/";
    修改为
    $db_myadmin_link = "http://".$http_host."justcn-mysql/";

    3. /usr/local/vesta/web/add/db/index.php同理修改下面位置，phpmyadmin替换为justcn-mysql
    if ($_POST[‘v_type’] == ‘mysql’) $db_admin_link = “http://”.$http_host.”/phpmyadmin/”
    <br>收工，VestaCp可以直接跳转到数据库了。


### 忘记或修改mysql默认密码
You have password here – /root/.my.cnf，隐藏文件。


### 修改Ubuntu SSH默认22端口
编辑 /etc/ssh/sshd_config，查找 #Port 22修改为自己希望的端口如32622。   
**添加公钥认证  + 密码登录 为更安全的加密方式。**
### 禁止用服务器IP访问网站
"/etc/nginx/conf.d"，找到[YOUR SERVER IP].conf  
在    server_name  _;后增加
```
return 444;
```
