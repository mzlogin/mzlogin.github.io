---
layout: post
title: 利用Excel批量生成SQL语句
categories: Excel
description: 利用Excel批量生成SQL语句
keywords: Excel, SQL, Skill
---
在做系统或者做项目的时候，经常会遇到这样的要求：用户给我们发过来一些数据，要求我们把这些数据导入到数据库中，对于少量的数据来说，用最原始的方法就可以解决，直接在SQL里面用语句来实现，但是如果有成千上万条的数据呢？如果你还继续单独写SQL语句，估计写个几十条你就会有跳楼的冲动，其实有两种简单的方法：
   1、将Excel的数据整理好，通过SQL的导入功能直接导入到数据库中，但是要保证数据库的字段和Excel的字段一致。
   2、通过Excel生成相应的SQL语句，然后，放到SQL的新建查询中，执行。下面就来说一说该方法怎么用：
   我要将对应物业公司的boss_id修改成Excel C列中的值。
   
![1](/Log/images/posts/excel/14920483409274.png)

在Excel的D2单元格中，写一段SQL语句，只需要写这一句就可以：

`="update uf_property_corp set boss_id = "&C2&" where accountName = '"&A2&"'"`

![2](/Log/images/posts/excel/14920486412508.png)

然后直接从头拉到尾，你会发现所有的数据都有对应的脚本，然后直接复制相关的SQL语句，到分析器中，command+return,OK,任务完成！

