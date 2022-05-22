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

## 注解实现动态 SQL

不使用 mapper.xml 文件，在 `@Mapper` 注解的继承自 `BaseMapper` 的接口里，通过 `@Select` 等注解也可以实现动态 SQL。

这个属于 MyBatis 提供的功能。相关说明见官方文档：<https://mybatis.org/mybatis-3/zh/dynamic-sql.html>

一、使用 `<script></script>` 包裹，mapper.xml 里能使用的 `<where>`、`<if>`、`<foreach>`、`<set>` 等标签都可以使用，用法看起来与在 xml 里一致；

二、使用 `if (条件，为真操作，为假操作)` 可以实现类三目运算；

参考：

- <https://mybatis.org/mybatis-3/zh/dynamic-sql.html>
- <https://www.jianshu.com/p/eee6832628ce>

## 字段 on update CURRENT_TIMESTAMP 无效

如果 update 操作中 set 了该字段，比如很多时候我们用 updateById 等，不会触发。

可以添加注解 `@TableField(update = "NOW()")`。

注：添加了这个注解后，如果 insert 时对应的字段赋值了，会按所赋的值存储。

## 查询时 distinct

```java
List<User> userList = userService.list(new QueryWrapper<User>()
        .select("distinct id").lambda().isNull(User::getName));
```
