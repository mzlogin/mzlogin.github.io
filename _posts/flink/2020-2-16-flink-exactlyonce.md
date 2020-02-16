---
layout: post
title: Flink实现exactly-once的方式
categories: flink
description: Flink实现exactly-once的方式
keywords: Flink,exactly-once，Chandy-Lamport
---
Flink跟其他的流计算引擎相比,最突出或者做的最好的就是状态的管理.Flink是怎么保证容错恢复的时候保证数据没有丢失也没有数据的冗余呢?exactly-once的方式的实现方式，参考：[Flink是如何实现exactly-once语义的](https://www.cnblogs.com/leon0/p/11005159.html),[深入理解Flink ---- 系统内部消息传递的exactly once语义](https://www.cnblogs.com/tuowang/p/9022198.html),[Flink Exactly-Once 投递实现浅析](https://cloud.tencent.com/developer/article/1485664)

## 前提知识：At Most once,At Least once和Exactly once

在分布式系统中，组成系统的各个计算机是独立的。这些计算机有可能fail。

一个sender发送一条message到receiver。根据receiver出现fail时sender如何处理fail，可以将message delivery分为三种语义:
 
**At Most once**: 对于一条message,receiver最多收到一次(0次或1次).

可以达成At Most Once的策略:

sender把message发送给receiver.无论receiver是否收到message,sender都不再重发message.

**At Least once**: 对于一条message,receiver最少收到一次(1次及以上).

可以达成At Least Once的策略:

sender把message发送给receiver.当receiver在规定时间内没有回复ACK或回复了error信息,那么sender重发这条message给receiver,直到sender收到receiver的ACK.

**Exactly once**: 对于一条message,receiver确保只收到一次

## Flink的Exactly once模式

Flink实现Exactly once的策略: Flink会持续地对整个系统做snapshot,然后把global state(根据config文件设定)储存到master node或HDFS.当系统出现failure,Flink会停止数据处理,然后把系统恢复到最近的一次checkpoint.

下面就来介绍一下Flink从Kafka中获取数据,怎么管理offest实现exactly-once的.

Apache Flink 中实现的 Kafka 消费者是一个有状态的算子（operator），它集成了 Flink 的检查点机制，它的状态是所有 Kafka 分区的读取偏移量。当一个检查点被触发时，每一个分区的偏移量都被存到了这个检查点中。Flink 的检查点机制保证了所有 operator task 的存储状态都是一致的。这里的“一致的”是什么意思呢？意思是它们存储的状态都是基于相同的输入数据。当所有的 operator task 成功存储了它们的状态，一个检查点才算完成。因此，当从潜在的系统故障中恢复时，系统提供了 excatly-once 的状态更新语义。

在具有多个并发运行的接收器任务的分布式系统中，简单的提交或回滚是远远不够的，因为必须确保所有组件在提交或回滚时一致才能确保一致的结果。Flink 使用两阶段提交协议及预提交阶段来解决这一问题。

检查点的启动表示我们的**两阶段提交协议**的预提交阶段。当检查点启动时，Flink JobManager 会将检查点 Barrier 注入数据流中（将数据流中的记录分为进入当前检查点的集合与进入下一个检查点的集合）。

Barrier在算子之间传递。对于每个算子，它会触发算子状态后端生成状态的快照。

TwoPhaseCommitSinkFunction 接口，从命名即可看出这是对两阶段提交协议的一个实现，其主要方法如下:
* beginTransaction: 初始化一个事务。在有新数据到达并且当前事务为空时调用。
* preCommit: 预提交数据，即不再写入当前事务并准好提交当前事务。在 sink 算子进行快照的时候调用。
* commit: 正式提交数据，将准备好的事务提交。在作业的 checkpoint 完成时调用。
* abort: 放弃事务。在作业 checkpoint 失败的时候调用。

Flink的checkpoint是基于Chandy-Lamport算法的分布式一致性快照.

## 获得一致性global state的算法 ---- Chandy-Lamport算法

**精髓**:该算法在普通message中插入了control message – marker

前提:
1. message的传输可能有delay,但一定会到达
2. 每两个process之间都有一条communication path(可能由多条channel组成)
3. Channel是单向的FIFO

描述:

Marker sending rule for process Pi
1. Process Pi 记录自身state
2. Pi在记录自身state后,发送下一条message前,Pi向自己所有的outgoing channel发送marker
3. Marker receiving rule for process Pj on receiving a marker along channel C
4. 如果Pj第一次接收到marker,那么把channel C的state记为空集，执行marker sending rule。否则(并非第一次接收到marker)把记录自身state(或最近一次记录另一个channel的state)后,收到这个marker前的message集记为C的state

Flink的snapshot算法:

为了消去记录channel state这一步骤,process在接收到第一个barrier后不会马上做snapshot,

而是**等待接受其他上游channel的barrier**.

在等待期间,process会把barrier已到的channel的record放入input buffer.

当所有上游channel的barrier到齐后,process才记录自身state,之后向所有下游channel发送barrier.

因为先到的barrier会等待后到的barrier,所有所有barrier相当于同时到达process,

因此,该process的上游channel的state都是空集.这就避免了去记录channel的state

具体图解看参考博客