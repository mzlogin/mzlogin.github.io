---
layout: post
title: 利用 XXL-JOB 实现灵活控制的分片处理
categories: Java
description: 通过 XXL-JOB 的分片广播机制，实现灵活控制的并发数控制。
keywords: XXL-JOB, Java, 分片广播
---

本文讲述了一种利用 XXL-JOB 来进行分片任务处理的方法，另外加入对执行节点数的灵活控制。

## 场景

现在一张数据表里有大量数据需要某个服务端应用来处理，要求：

1. 能够并行处理；
2. 能够较灵活地控制并行任务数量。
3. 压力较均衡地分散到不同的服务器节点；

## 思路

因为需要并行处理同一张数据表里的数据，所以比较自然地想到了分片查询数据，可以利用对 id 取模的方法进行分片，避免同一条数据被重复处理。

根据第 1、2 点要求，本来想通过对线程池的动态配置来实现，但结合第 3 点来考虑，服务器节点数量有可能会变化，节点之间相互无感知无通信，自己在应用内实现一套调度机制可能会很复杂。

如果有现成的独立于这些服务器节点之外的调度器就好了——顺着这个思路，就想到了已经接入的分布式任务调度平台 XXL-JOB，而在阅读其 [官方文档][1] 后发现「分片广播 & 动态分片」很贴合这种场景。

![](/images/posts/java/xxl-job-sharding-broadcast.png)

## 方案

1. 利用 XXL-JOB 的路由策略「分片广播」来调度定时任务；
2. 通过任务参数传入执行任务节点数量；
3. 定时任务逻辑里，根据获取到的分片参数、执行任务节点数量，决策当前节点是否需要执行，分片查询数据并处理：
    - 如果 *分片序号 > (执行任务节点数量 - 1)*，则当前节点不执行任务，直接返回；
    - 否则，取 *分片序号* 和 *执行任务节点数量* 作为分片参数，查询数据并处理。

这样，我们可以实现灵活调度 [1, N] 个节点并行执行任务处理数据。

## 主要代码示例

JobHandler 示例：

```java
@XxlJob("demoJobHandler")
public void execute() {
    String param = XxlJobHelper.getJobParam();
    if (StringUtils.isBlank(param)) {
        XxlJobHelper.log("任务参数为空");
        XxlJobHelper.handleFail();
        return;
    }

    // 执行任务节点数量
    int executeNodeNum = Integer.valueOf(param);
    // 分片序号
    int shardIndex = XxlJobHelper.getShardIndex();
    // 分片总数
    int shardTotal = XxlJobHelper.getShardTotal();

    if (executeNodeNum <= 0 || executeNodeNum > shardTotal) {
        XxlJobHelper.log("执行任务节点数量取值范围[1,节点总数]");
        XxlJobHelper.handleFail();
        return;
    }

    if (shardIndex > (executeNodeNum - 1)) {
        XxlJobHelper.log("当前分片 {} 无需执行", shardIndex);
        XxlJobHelper.handleSuccess();
        return;
    }

    shardTotal = executeNodeNum;

    // 分片查询数据并处理
    process(shardIndex, shardTotal);

    XxlJobHelper.handleSuccess();
}
```

分片查询数据示例：

```sql
select field1, field2 
from table_name 
where ... 
    and mod(id, #{shardTotal}) = #{shardIndex} 
order by id limit #{rows};
```

## 进一步思考

1. 如果需要更大的并发量，需要有大于应用节点数量的任务并行，如何处理？

    两种思路：
    
    - 通过任务参数传入一个并发数，单个节点在处理任务时，将查询到的数据按这个数字进行再分片，交由线程池并行处理；
    - 配置 M 个定时任务，指定相同的 JobHandler，给它们编号 0、1、2...M，并将定时任务编号和 M 这两个数，由任务参数传入，定时任务逻辑里，先根据分片参数、定时任务编号、M，重新计算出新的分片参数，如 *分片序号 = (分片序号 * M) + 定时任务编号*，*分片总数 = 分片总数 \* M*，再查询数据并处理。

2. 如果有可能频繁调整任务执行逻辑，包括可能要新增任务参数等，而不想重启服务器，如何解决？

    可以考虑使用 XXL-JOB 的「GLUE模式」任务，能够在线编辑和更新定时任务执行逻辑。

## 参考

- [分布式任务调度平台XXL-JOB][1]

[1]: https://www.xuxueli.com/xxl-job/
