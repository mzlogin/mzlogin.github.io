---
layout: post
title: Win7 下部署 Discuz!
categories: PHP
description: 在 Win7 下部署 Discuz! 的详细步骤。
keywords: PHP, Discuz
---

需要在开发机上部署 Discuz!，结果在根据官方文档 [Discuz! X 系统部署](http://faq.comsenz.com/library/system/env/env_windows.htm) 操作时遇到了一些坑，有些是因为使用的组件版本不一样，有些是官方文档有谬误，所以在此将自己从零开始到部署成功的步骤记录下来，供备忘和参考。

*操作系统环境*

Win7 64 with sp1

**目录**

* TOC
{:toc}

### 使用软件

1. Discuz! X3.2

   我们要部署的目的程序。

   下载地址：<http://www.discuz.net/thread-3570835-1-1.html>

   我选的 GBK 版本。

1. IIS 7.5

   Web 服务器。

   下载地址：可直接在系统设置里安装，无需下载。

   如果使用 IIS 7 以下的版本，可能需要额外安装 FastCGI，下载地址 <http://www.iis.net/expand/fastcgi>。

1. PHP 5.4.42

   因为 PHP 5.2.10 开始已经不再提供 php5isapi.dll，也即在 IIS 上只能使用 FastCGI 而能使用 ISAPI 方式了，所以选用 Non Thread Safe 版本。关于 PHP5 的 Non Thread Safe 与 Thread Safe 的区别参见 <http://zhidao.baidu.com/question/2075132638027071628>。

   下载地址：<http://windows.php.net/download/#php-5.4-nts-VC9-x86>

1. MySQL 5.5.44

   数据库。我选用的 winx64 版本。

   下载地址：<http://dev.mysql.com/downloads/mysql/5.5.html#downloads>

1. Zend Optimizer

   用于提高 PHP 应用程序的执行速度。详见搜狗百科 <http://baike.sogou.com/v7557079.htm>。

   下载地址：<http://211.162.54.70/dl.softmgr.qq.com/original/System/ZendOptimizerwindows.exe>

1. phpMyAdmin 4.4.9 （可选）

   用于可视化管理 MySQL 数据库。

   下载地址：<http://www.phpmyadmin.net/home_page/downloads.php>

### 详细步骤

#### 安装 IIS

打开「控制面板」--「程序」--「打开或关闭 Windows 功能」，勾选「Internet 信息服务」，**确认「万维网服务」--「应用程序开发功能」--「CGI」是勾选状态**，然后点「确定」安装。

![](/images/posts/php/iis.png)

#### 配置 PHP

1. 解压前面下载的 PHP 的 zip 包，放在合适的地方。

   比如我放在 D:\discuz\PHP。

2. 修改 php.ini。

   将 D:\discuz\PHP 文件夹内的 php.ini-development 拷贝一份为 php.ini，找到并修改下列内容如下：
   * fastcgi.impersonate = 1
   * cgi.fix\_pathinfo = 1
   * cgi.force\_redirect = 0
   * cgi.rfc2616\_headers = 1
   * extension\_dir = "D:\discuz\PHP\ext"
   * date.timezone = Asia/Shanghai
   * 找到并打开以下模块的支持（删掉模块配置前的分号）
     * php\_gd2.dll
     * php\_mbstring.dll
     * php\_mysql.dll
     * php\_mysqli.dll
     * php\_openssl.dll
     * php\_sockets.dll
     * php\_xmlrpc.dll
   * disable\_functions

     ```
     disable_functions = passthru,exec,system,chroot,scandir,chgrp,chown,shell_exec,proc_open,proc_get_status,ini_alter,ini_alter,ini_restore,dl,pfsockopen,openlog,syslog,readlink,symlink,popepassthru,stream_socket_server
     ```

   据称 IIS 7 以下需要将 php.ini 复制到 C:\Windows\php.ini。

   另外，官方文档上显示的需要找开的模块比上面列出的多，但是在配置文件里并没有找到。

3. 添加 FastCGI 模块映射。

   打开「控制面板」--「系统和安全」--「管理工具」--「Internet 信息服务(IIS)管理器」--「处理程序映射」，点击右方的「添加模块映射」，填写如下并确认：

   ![fastcgi](/images/posts/php/fastcgi.png)

#### 配置 MySQL

如果需要安装 MySQL，首先确认有没有 MySQL 的历史残留文件，C:\ProgramData\MySQL 目录如果存在，删除之。不然 MySQL 的安装有可能总是在最后一步失败，提示 `error Nr. 1045` 和 `Access denied for user 'root'@localhost'(using password:No)` 之类的问题。

**安装 MySQL**

运行前面下载的 MySQL 安装程序安装到 D:\discuz\MySQL 目录下，安装过程如下（没有贴图的部分保持默认就好）：

选择 Custom 自定义安装。

![custom](/images/posts/php/mysql-1.png)

更改安装路径。

![install-path](/images/posts/php/mysql-2.png)

选择 MySQL 运行模式：Server Machine。

![server-machine](/images/posts/php/mysql-3.png)

选择 MySQL 数据库默认存储方式：Non-Trans Only (MYISAM)。

![non-trans](/images/posts/php/mysql-4.png)

设定 MySQL 的最大连接数，一般设置为 128 - 512 之间的整数。

![connections](/images/posts/php/mysql-5.png)

设定网络参数，注意：勾消掉「Enable Strict Mode」。而「Add firewall exception for this port」仅在需要外连 MySQL 的时候勾上。

![networking](/images/posts/php/mysql-6.png)

设定默认字符集，我根据官方文档选择了 gbk。

![character set](/images/posts/php/mysql-7.png)

将 Bin 目录添加到 PATH。

![path](/images/posts/php/mysql-8.png)

设置 root 用户密码，推荐设置复杂一点。

![password](/images/posts/php/mysql-9.png)

测试 MySQL 工作是否正常，在 CMD 运行

```
mysql -u root -p
```

输入密码后，若能顺利进入 MySQL 控制台，表示安装正常。一定要是输入密码后，不然使用以下命令重置 root 用户的密码。

```
mysqladmin -u root -p password 新的密码
```

**更改 MySQL 数据库存放目录**

在 CMD 运行

```
net stop mysql
```

若提示权限不足，请使用管理员权限的 CMD。将 MySQL 服务成功停止后，找到 D:\discuz\MySQL\my.ini，将 datadir 修改为你想要放置数据库文件的地方，比如：

```
datadir="D:/discuz/Database"
```

（当然据说最好应该是把数据库文件和程序不放在同一个地方。）

将 C:\ProgramData\MySQL\MySQL Server 5.5\data 下的内容复制到 D:\discuz\Database 里，然后删掉 C:\ProgramData\MySQL。

重新启动 MySQL 服务看是否正常工作。

```
net start mysql
```

**配置 LibMySQL**

将 D:\Discuz\MySQL\lib\libmysql.dll 复制到 C:\Windows\System32 目录下。

#### 检测环境是否准备好

在「Internet 信息服务(IIS)管理器」中右击「网站」，选「添加网站」：

![add-website](/images/posts/php/add-website.png)

然后在新建的网站的「默认文档」里添加 index.php。

在 D:\discuz\wwwroot 下新建 phpinfo.php 文件内容如下：

```php
<?php
phpinfo();
?>
```

打开浏览器访问 <http://localhost/phpinfo.php>，如果能显示如下网页表示环境已经准备就绪。

![](/images/posts/php/phpinfo.png)

#### 安装 Zend Optimizer

运行 Zend Optimizer 的安装包，安装到 D:\discuz\Zend，安装过程中需要指定你配置的 php.ini 的目标位置为 D:\discuz\PHP，指定 IIS 网站根目录位置为 D:\discuz\wwwroot。

安装时会重启 IIS 服务。

#### 部署 Discuz!

将前面下载的 Discuz! 包解压，把 upload 文件夹里的内容复制到 D:\discuz\wwwroot下，当然你也可以新建子目录来放置。

然后在浏览器里访问 <http://localhost/install>，按提示进行安装，除了需要填上你的 MySQL 管理员密码和设置 Discuz! 管理员密码外，其它保持默认就行了，分分钟自动给部署好。

安装完成后直接访问 <http://localhost> 就能看到熟悉的界面了：

![discuz](/images/posts/php/discuz.png)

**配置确认**

打开 D:\discuz\wwwroot\config\config\_global.php 确认数据库密码正确：

```
$_config['db']['1']['dbpw'] = '你的数据库密码';
```

打开 D:\discuz\wwwroot\config\config\_ucenter.php 确认数据库密码正确：

```
define('UC_DBPW', '你的数据库密码');
```

打开 D:\discuz\wwwroot\uc\_server\data\config.inc.php 确认数据库密码正确：

```
define('UC_DBPW', '你的数据库密码');
```

#### 部署 phpMyAdmin（可选）

将下载的 phpMyAdmin 文件解压到 D:\discuz\wwwroot\phpmyadmin 下，将 config.sample.inc.php 更名为 config.inc.php，找到 blowfish\_secret 并为它设置一个值，比如：

```
$cfg['blowfish_secret'] = 'hello';  
```

打开 <http://localhost/phpmyadmin> 用你的 MySQL 管理员账户密码登录就行了。

#### 常用入口

打开论坛 <http://localhost>

论坛管理 <http://localhost/admin.php>

查看数据库 <http://localhost/phpmyadmin>

打开UCenter <http://localhost/uc_server>

#### 让 Discuz! 局域网内可访问

完成如上步骤后，在局域网内使用 http://ip:port 并不能访问我们装好的 Discuz!，完成这个需要两个步骤：

1. 在防火墙添加 80 端口入站规则

   打开「控制面板」--「系统和安全」--「Windows 防火墙」--「高级设置」，（若之前没有启动防火墙的请先开启）。

   此时实际上是打开了「高级安全 Windows 防火墙」，右键「入站规则」，选择「新建规则」，规则类型选「端口」，协议和端口选择「TCP」和「特定本地端口：80」，操作选择「允许连接」，配置文件保持默认的全部勾选，然后取个名称后保存即可。

2. 为网站添加本机 IP 绑定

   ![](/images/posts/php/nat-bind-ip.png)
