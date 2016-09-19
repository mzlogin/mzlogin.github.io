---
layout: wiki
title: php
categories: php
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

或者，更简单地可以直接运行命令输出以上信息：

```sh
php -r "phpinfo();"
```
