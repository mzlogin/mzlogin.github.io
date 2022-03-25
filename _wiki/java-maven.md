---
layout: wiki
title: Maven
cate1: Java
cate2:
description: 依赖管理工具 Maven
keywords: Java, Maven
type:
link:
---

## 问题与解决方案

### deploy 时忽略指定模块

如果一个项目有如下结构：

```
proj
    -- proj-api
    -- proj-service
```

那 `mvn deploy` 时会 deploy 三个目标：proj、proj-api、proj-service。

而实际上，我们往往只需要 deploy 前两者与其它项目共享，proj-service 只用于自己打包运行使用。

此时，可以在 proj-service 的 pom 文件里添加以下内容，这样 Maven 在 deploy 时会忽略掉 proj-service。

```xml
<properties>
    <maven.deploy.skip>true</maven.deploy.skip>
</properties>
```

## 参考

- <https://blog.csdn.net/rjbcxhc/article/details/123062310>
