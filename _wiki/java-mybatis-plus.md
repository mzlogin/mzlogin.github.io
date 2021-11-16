---
layout: wiki
title: MyBatis-Plus
cate1: Java
cate2:
description: MyBatis-Plus 使用笔记。
keywords: Java, MyBatis-Plus
---

## 获取刚刚插入数据的主键 ID

如果我们使用数据库自增主键，可以通过给对应字段加上注解 `@TableId(type = IdType.AUTO)`，这样当 insert 后，刚刚插入数据的主键 ID 会回填到 `id` 字段上。

```java
@Data
public class User {
    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;
}
```
