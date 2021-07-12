---
layout: post
title: 图解 SQL 里的各种 JOIN
categories: Database
description: 用文氏图和示例来理解 SQL 里的各种 JOIN。
keywords: SQL, Database, 文氏图
---

从业以来主要在做客户端，用到的数据库都是表结构比较简单的 SQLite，以我那还给老师一大半的 SQL 水平倒也能对付。现在偶尔需要到后台的 SQL Server 里追查一些数据问题，就显得有点捉襟见肘了，特别是各种 JOIN，有时候傻傻分不清楚，于是索性弄明白并做个记录。

## 前言

在各种问答社区里谈及 SQL 里的各种 JOIN 之间的区别时，最被广为引用的是 CodeProject 上 [C.L. Moffatt][1] 的文章 [Visual Representation of SQL Joins][2]，他确实讲得简单明了，使用文氏图来帮助理解，效果明显。本文将沿用他的讲解方式，稍有演绎，可以视为该文较为粗糙的中译版。

## 约定

下文将使用两个数据库表 Table\_A 和 Table\_B 来进行示例讲解，其结构与数据分别如下：

```
mysql> SELECT * FROM Table_A ORDER BY PK ASC;
+----+---------+
| PK | Value   |
+----+---------+
|  1 | both ab |
|  2 | only a  |
+----+---------+
2 rows in set (0.00 sec)

mysql> SELECT * from Table_B ORDER BY PK ASC;
+----+---------+
| PK | Value   |
+----+---------+
|  1 | both ab |
|  3 | only b  |
+----+---------+
2 rows in set (0.00 sec)
```

其中 PK 为 1 的记录在 Table\_A 和 Table\_B 中都有，2 为 Table\_A 特有，3 为 Table\_B 特有。

## 常用的 JOIN

### INNER JOIN

INNER JOIN 一般被译作内连接。内连接查询能将左表（表 A）和右表（表 B）中能关联起来的数据连接后返回。

**文氏图：**

![INNER JOIN](/images/posts/database/inner-join.png)

**示例查询：**

```sql
SELECT A.PK AS A_PK, B.PK AS B_PK,
       A.Value AS A_Value, B.Value AS B_Value
FROM Table_A A
INNER JOIN Table_B B
ON A.PK = B.PK;
```

查询结果：

```
+------+------+---------+---------+
| A_PK | B_PK | A_Value | B_Value |
+------+------+---------+---------+
|    1 |    1 | both ab | both ab |
+------+------+---------+---------+
1 row in set (0.00 sec)
```

*注：其中 `A` 为 `Table_A` 的别名，`B` 为 `Table_B` 的别名，下同。*

### LEFT JOIN

LEFT JOIN 一般被译作左连接，也写作 LEFT OUTER JOIN。左连接查询会返回左表（表 A）中所有记录，不管右表（表 B）中有没有关联的数据。在右表中找到的关联数据列也会被一起返回。

**文氏图：**

![LEFT JOIN](/images/posts/database/left-join.png)

**示例查询：**

```sql
SELECT A.PK AS A_PK, B.PK AS B_PK,
       A.Value AS A_Value, B.Value AS B_Value
FROM Table_A A
LEFT JOIN Table_B B
ON A.PK = B.PK;
```

查询结果：

```
+------+------+---------+---------+
| A_PK | B_PK | A_Value | B_Value |
+------+------+---------+---------+
|    1 |    1 | both ab | both ba |
|    2 | NULL | only a  | NULL    |
+------+------+---------+---------+
2 rows in set (0.00 sec)
```

### RIGHT JOIN

RIGHT JOIN 一般被译作右连接，也写作 RIGHT OUTER JOIN。右连接查询会返回右表（表 B）中所有记录，不管左表（表 A）中有没有关联的数据。在左表中找到的关联数据列也会被一起返回。

**文氏图：**

![RIGHT JOIN](/images/posts/database/right-join.png)

**示例查询：**

```sql
SELECT A.PK AS A_PK, B.PK AS B_PK,
       A.Value AS A_Value, B.Value AS B_Value
FROM Table_A A
RIGHT JOIN Table_B B
ON A.PK = B.PK;
```

查询结果：

```
+------+------+---------+---------+
| A_PK | B_PK | A_Value | B_Value |
+------+------+---------+---------+
|    1 |    1 | both ab | both ba |
| NULL |    3 | NULL    | only b  |
+------+------+---------+---------+
2 rows in set (0.00 sec)
```

### FULL OUTER JOIN

FULL OUTER JOIN 一般被译作外连接、全连接，实际查询语句中可以写作 `FULL OUTER JOIN` 或 `FULL JOIN`。外连接查询能返回左右表里的所有记录，其中左右表里能关联起来的记录被连接后返回。

**文氏图：**

![FULL OUTER JOIN](/images/posts/database/full-outer-join.png)

**示例查询：**

```sql
SELECT A.PK AS A_PK, B.PK AS B_PK,
       A.Value AS A_Value, B.Value AS B_Value
FROM Table_A A
FULL OUTER JOIN Table_B B
ON A.PK = B.PK;
```

查询结果：

```
ERROR 1064 (42000): You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'FULL OUTER JOIN Table_B B
ON A.PK = B.PK' at line 4
```

*注：我当前示例使用的 MySQL 不支持 `FULL OUTER JOIN`。*

应当返回的结果（使用 UNION 模拟）：

```
mysql> SELECT * 
    -> FROM Table_A
    -> LEFT JOIN Table_B 
    -> ON Table_A.PK = Table_B.PK
    -> UNION ALL
    -> SELECT *
    -> FROM Table_A
    -> RIGHT JOIN Table_B 
    -> ON Table_A.PK = Table_B.PK
    -> WHERE Table_A.PK IS NULL;
+------+---------+------+---------+
| PK   | Value   | PK   | Value   |
+------+---------+------+---------+
|    1 | both ab |    1 | both ba |
|    2 | only a  | NULL | NULL    |
| NULL | NULL    |    3 | only b  |
+------+---------+------+---------+
3 rows in set (0.00 sec)
```

### 小结

以上四种，就是 SQL 里常见 JOIN 的种类和概念了，看一下它们的合影：

![](/images/posts/database/general-joins.png)

有没有感觉少了些什么，学数学集合时完全不止这几种情况？确实如此，继续看。

## 延伸用法

### LEFT JOIN EXCLUDING INNER JOIN

返回左表有但右表没有关联数据的记录集。

**文氏图：**

![LEFT JOIN EXCLUDING INNER JOIN](/images/posts/database/left-join-excluding-inner-join.png)

**示例查询：**

```sql
SELECT A.PK AS A_PK, B.PK AS B_PK,
       A.Value AS A_Value, B.Value AS B_Value
FROM Table_A A
LEFT JOIN Table_B B
ON A.PK = B.PK
WHERE B.PK IS NULL;
```

查询结果：

```
+------+------+---------+---------+
| A_PK | B_PK | A_Value | B_Value |
+------+------+---------+---------+
|    2 | NULL | only a  | NULL    |
+------+------+---------+---------+
1 row in set (0.01 sec)
```

### RIGHT JOIN EXCLUDING INNER JOIN

返回右表有但左表没有关联数据的记录集。

**文氏图：**

![RIGHT JOIN EXCLUDING INNER JOIN](/images/posts/database/right-join-excluding-inner-join.png)

**示例查询：**

```sql
SELECT A.PK AS A_PK, B.PK AS B_PK,
       A.Value AS A_Value, B.Value AS B_Value
FROM Table_A A
RIGHT JOIN Table_B B
ON A.PK = B.PK
WHERE A.PK IS NULL;
```

查询结果：

```
+------+------+---------+---------+
| A_PK | B_PK | A_Value | B_Value |
+------+------+---------+---------+
| NULL |    3 | NULL    | only b  |
+------+------+---------+---------+
1 row in set (0.00 sec)
```

### FULL OUTER JOIN EXCLUDING INNER JOIN

返回左表和右表里没有相互关联的记录集。

**文氏图：**

![FULL OUTER JOIN EXCLUDING INNER JOIN](/images/posts/database/full-outer-join-excluding-inner-join.png)

**示例查询：**

```sql
SELECT A.PK AS A_PK, B.PK AS B_PK,
       A.Value AS A_Value, B.Value AS B_Value
FROM Table_A A
FULL OUTER JOIN Table_B B
ON A.PK = B.PK
WHERE A.PK IS NULL
OR B.PK IS NULL;
```

因为使用到了 FULL OUTER JOIN，MySQL 在执行该查询时再次报错。

```
ERROR 1064 (42000): You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'FULL OUTER JOIN Table_B B
ON A.PK = B.PK
WHERE A.PK IS NULL
OR B.PK IS NULL' at line 4
```

应当返回的结果（用 UNION 模拟）：

```
mysql> SELECT * 
    -> FROM Table_A
    -> LEFT JOIN Table_B
    -> ON Table_A.PK = Table_B.PK
    -> WHERE Table_B.PK IS NULL
    -> UNION ALL
    -> SELECT *
    -> FROM Table_A
    -> RIGHT JOIN Table_B
    -> ON Table_A.PK = Table_B.PK
    -> WHERE Table_A.PK IS NULL;
+------+--------+------+--------+
| PK   | Value  | PK   | Value  |
+------+--------+------+--------+
|    2 | only a | NULL | NULL   |
| NULL | NULL   |    3 | only b |
+------+--------+------+--------+
2 rows in set (0.00 sec)
```

## 总结

以上七种用法基本上可以覆盖各种 JOIN 查询了。七种用法的全家福：

![SQL JOINS](/images/posts/database/sql-joins.png)

看着它们，我仿佛回到了当年学数学，求交集并集的时代……

顺带张贴一下 [C.L. Moffatt][1] 带 SQL 语句的图片，配合学习，风味更佳：

![SQL JOINS](/images/posts/database/Visual_SQL_JOINS_orig.jpg)

## 更新：更多的 JOIN

除以上几种外，还有更多的 JOIN 用法，比如 CROSS JOIN（迪卡尔集）、SELF JOIN，可以参考 [SQL JOINS Slide Presentation][4] 学习。

### CROSS JOIN

返回左表与右表之间符合条件的记录的迪卡尔集。

**图示：**

![CORSS JOIN](/images/posts/database/cross-join.png)

**示例查询：**

```sql
SELECT A.PK AS A_PK, B.PK AS B_PK,
       A.Value AS A_Value, B.Value AS B_Value
FROM Table_A A
CROSS JOIN Table_B B;
```

查询结果：

```
+------+------+---------+---------+
| A_PK | B_PK | A_Value | B_Value |
+------+------+---------+---------+
|    1 |    1 | both ab | both ba |
|    2 |    1 | only a  | both ba |
|    1 |    3 | both ab | only b  |
|    2 |    3 | only a  | only b  |
+------+------+---------+---------+
4 rows in set (0.00 sec)
```

上面讲过的几种 JOIN 查询的结果都可以用 CROSS JOIN 加条件模拟出来，比如 INNER JOIN 对应 `CROSS JOIN ... WHERE A.PK = B.PK`。

### SELF JOIN

返回表与自己连接后符合条件的记录，一般用在表里有一个字段是用主键作为外键的情况。

比如 Table\_C 的结构与数据如下：

```
+--------+----------+-------------+
| EMP_ID | EMP_NAME | EMP_SUPV_ID |
+--------+----------+-------------+
|   1001 | Ma       |        NULL |
|   1002 | Zhuang   |        1001 |
+--------+----------+-------------+
2 rows in set (0.00 sec)
```

EMP\_ID 字段表示员工 ID，EMP\_NAME 字段表示员工姓名，EMP\_SUPV\_ID 表示主管 ID。

**示例查询：**

现在我们想查询所有有主管的员工及其对应的主管 ID 和姓名，就可以用 SELF JOIN 来实现。

```sql
SELECT A.EMP_ID AS EMP_ID, A.EMP_NAME AS EMP_NAME, 
    B.EMP_ID AS EMP_SUPV_ID, B.EMP_NAME AS EMP_SUPV_NAME
FROM Table_C A, Table_C B
WHERE A.EMP_SUPV_ID = B.EMP_ID;
```

查询结果：

```
+--------+----------+-------------+---------------+
| EMP_ID | EMP_NAME | EMP_SUPV_ID | EMP_SUPV_NAME |
+--------+----------+-------------+---------------+
|   1002 | Zhuang   |        1001 | Ma            |
+--------+----------+-------------+---------------+
1 row in set (0.00 sec)
```

## 补充说明

1. 文中的图使用 Keynote 绘制；

2. 个人的体会是 SQL 里的 JOIN 查询与数学里的求交集、并集等很像；

3. SQLite 不支持 RIGHT JOIN 和 FULL OUTER JOIN，可以使用 LEFT JOIN 和 UNION 来达到相同的效果；

4. MySQL 不支持 FULL OUTER JOIN，可以使用 LEFT JOIN 和 UNION 来达到相同的效果；

假如你对我的文章感兴趣，可以关注我的微信公众号 isprogrammer 随时阅读更多内容。

## 参考

* [Visual Representation of SQL Joins][2]
* [How to do a FULL OUTER JOIN in MySQL?][3]
* [SQL JOINS Slide Presentation][4]
* [SQL Self Join][5]

[1]: https://www.codeproject.com/script/Membership/View.aspx?mid=5909363
[2]: https://www.codeproject.com/Articles/33052/Visual-Representation-of-SQL-Joins
[3]: https://stackoverflow.com/questions/4796872/how-to-do-a-full-outer-join-in-mysql
[4]: https://www.w3resource.com/slides/sql-joins-slide-presentation.php
[5]: https://www.w3resource.com/sql/joins/perform-a-self-join.php
