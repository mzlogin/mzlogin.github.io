---
layout: wiki
title: PHP
cate1: Programming Language
cate2: 
description: 学习 php 过程中遇到的问题记录。
keywords: php
---

## Q & A

### 如何查看 php.ini 文件路径？

新建一个 test.php 文件，内容如下：

```php
<?php
phpinfo();
?>
```

然后在浏览器使用 url 访问 test.php，会显示 php 相关的配置、插件等大量相关信息，在其中 `Loaded Configuration File` 一项即可找到所有生效的 php.ini 文件路径。

或者，更简单地可以直接运行命令输出以上信息（如果安装了多个版本的 php，那注意使用正确的 php 命令）：

```sh
php -r "phpinfo();"
```

### 本地运行一个 php 文件

```sh
php [-f] test.php
```

### 几种错误提示及对应的解决办法

提示：

```sh
PHP Fatal error: Uncaught Error: Call to undefined function socket_create()
```

解决办法：

在 php.ini 文件中配置启用扩展 php_curl.dll。

提示：

```sh
PHP Fatal error:  Uncaught Error: Call to undefined function curl_init()
```

解决办法：

在 php.ini 文件中配置启用扩展 php_curl.dll。

提示：

```sh
The openssl extension is required for SSL/TLS protection but is not available. If you can not enable the openssl extension, you can disable this error, at your own risk, by setting the 'disable-tls' option to true
```

解决办法：

在 php.ini 文件中配置启用扩展 php_openssl.dll。

### 在开发环境下直接在页面显示出错信息

修改 php.ini 文件，配置 `display_errors = On`。

### 安装 Memcache（not Memcached）for php7

当前（2016-10-19）Memcache 扩展并未有官方的支持办法，所以从源码编译安装。

步骤：

1. 下载解压源码

   ```sh
   wget https://github.com/websupport-sk/pecl-memcache/archive/NON_BLOCKING_IO_php7.zip
   unzip NON_BLOCKING_IO_php7.zip
   cd pecl-memcache-NON_BLOCKING_IO_php7
   ```

2. 编译

   ```sh
   /usr/local/php7/bin/phpize && ./configure --enable-memcache --with-php-config=/usr/local/php7/bin/php-config && make
   ```

   注意 phpize 和 php-config 要使用 php7 下的。

3. 放置 so 文件到正确位置

   ```sh
   cp modules/memcache.so /usr/local/php7/lib/php/extensions/no-debug-non-zts-20151012/memcache.so
   ```

   目标路径可以在 phpinfo() 的 `extension_dir` 字段找到。

4. 配置

   ```sh
   echo 'extension=memcache.so' > /usr/local/php7/etc/php.d/memcache.ini
   ```

   目标路径可以在 phpinfo() 的 `Scan this dir for addtional .ini files` 字段找到。

5. 重启服务使扩展生效

   ```sh
   service php-fpm restart
   ```

参考 [Memcache extension with PHP 7 on CentOS fails to install](http://stackoverflow.com/questions/37550910/memcache-extension-with-php-7-on-centos-fails-to-install)。

### 修改 php.ini 后让配置生效

```sh
service php-fpm restart
```
