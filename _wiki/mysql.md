---
layout: wiki
title: MySQL
categories: [MySQL, Database]
description: MySQL Wiki
keywords: MySQL
---

## 常用 SQL

### 查看表的创建语句

```sql
desc tb_name;
show create table tb_name;
```

### dump

```sql
-- dump 库
mysqldump -u root -p db_name > 1.txt
-- dump 表
mysqldump -u root -p db_name tb_name > 1.txt
-- dump 表不带数据
mysqldump -u root -p --no-date db_name tb_name > 1.txt
```

### 数据库状态

```sql
show engine INNODB status;
```

脏页相关

```sql
-- flush 脏页时是否刷新邻居
show VARIABLES  like 'innodb_flush_neighbors';
-- 设置该值
set global innodb_flush_neighbors = 0;

-- 查看脏页比例
select VARIABLE_VALUE into @a from PERFORMANCE_SCHEMA.global_status where VARIABLE_NAME = 'Innodb_buffer_pool_pages_dirty';
select VARIABLE_VALUE into @b from PERFORMANCE_SCHEMA.global_status where VARIABLE_NAME = 'Innodb_buffer_pool_pages_total';
select @a/@b;
```

### 磁盘空间相关

查看数据库内磁盘占用空间：

```sql
SELECT
table_name,
    TABLE_SCHEMA,
    ( DATA_LENGTH + INDEX_LENGTH + DATA_FREE ) / 1024 / 1024 MB,
    TABLE_ROWS
    FROM
    information_schema. TABLES
    WHERE
    TABLE_SCHEMA NOT IN ('information_schema','mysql')
    ORDER BY
    MB DESC
    LIMIT 0,
    50
```

查看表中数据、索引、已分配给表但没有使用空间：

```sql
SELECT
table_name,
    TABLE_SCHEMA,
    DATA_LENGTH/ 1024 / 1024 _DATA, INDEX_LENGTH/ 1024 / 1024 _INDEX, DATA_FREE/ 1024 / 1024 _DATA_FREE,
    TABLE_ROWS
    FROM
    information_schema. TABLES
    WHERE
    TABLE_SCHEMA NOT IN ('information_schema','mysql')
    ORDER BY
    _DATA DESC
    LIMIT 0,
    50
```

查看数据库的文件大小：

```sql
SELECT file_name, concat(TOTAL_EXTENTS,'M') as 'FIle_size' FROM INFORMATION_SCHEMA.FILES order by TOTAL_EXTENTS DESC
```
