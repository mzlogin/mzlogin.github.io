---
layout: fragment
title: MySQL 表空间碎片回收
tags: [mysql]
description: MySQL 表空间碎片查看与回收。
keywords: MySQL
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

从 MySQL 表中大量删除数据后，有可能表占用的空间并不会马上回收掉，此时如果在意空间占用，可以主动进行空间碎片回收。

## 查看表空间碎片占用

方法一：

```sql
SELECT table_schema db, 
         table_name, 
         data_free, 
         engine 
    FROM information_schema.tables 
   WHERE table_schema NOT IN ('information_schema', 'mysql') 
     AND data_free > 0 and table_name = 'xxx'
ORDER BY DATA_FREE DESC;
```

方法二：

```sql
show table status like 'xxx';
```

data_free 字段对应的值就是碎片字节数。


## 表空间碎片回收

```sql
-- 适用 InnoDB 表
ALTER TABLE xxx engine = InnoDB
```

有一篇相关的文章讲得比较好可以参考：<https://www.cnblogs.com/wanng/p/mysql-recycle-table-space.html>
