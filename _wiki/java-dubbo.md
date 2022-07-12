---
layout: wiki
title: Dubbo
cate1: Java
cate2:
description: 关于 Dubbo 的一些知识点
keywords: Java, Dubbo
type:
link:
---

## 知识点

### 命令行调用

示例：

```sh
telnet localhost 50900

dubbo> invoke test1("hello")

dubbo> invoke org.mazhuang.test1("hello")

dubbo> invoke org.mazhuang.test2("hello", {"name":"mzlogin", "age": 18, "class":"org.mazhuang.Person"})
```

参考：<https://dubbo.apache.org/zh/docs/references/telnet/#invoke>

### 使用外网 IP 注册

Dubbo 默认使用主机名获取 IP。

Linux / Unix：通过 `hostname` 命令获取主机名。

在 /etc/hosts 里配置将主机名称映射到公网 IP。

参考：<https://www.jianshu.com/p/b85ffd07bb38>

## 常见问题

### 通过 XML 声明服务提供者 Bean 了，ServiceImpl 上还用加 @Service 注解吗？

不用，再加 @Service 或 @Component 会生成两个 Bean。
