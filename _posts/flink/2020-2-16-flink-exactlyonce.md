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

## 两阶段提交协议

两阶段提交指的是一种协议，经常用来实现分布式事务，可以简单理解为预提交+实际提交，一般分为协调器Coordinator(以下简称C)和若干事务参与者Participant(以下简称P)两种角色。

![两阶段提交协议](/images/posts/knowledge/flink-base/twoPhase.jpg)

1. C先将prepare请求写入本地日志，然后发送一个prepare的请求给P
2. P收到prepare请求后，开始执行事务，如果执行成功返回一个Yes或OK状态给C，否则返回No，并将状态存到本地日志。
3. C收到P返回的状态，如果每个P的状态都是Yes，则开始执行事务Commit操作，发Commit请求给每个P，P收到Commit请求后各自执行Commit事务操作。如果至少一个P的状态为No，则会执行Abort操作，发Abort请求给每个P，P收到Abort请求后各自执行Abort事务操作。注：C或P把发送或接收到的消息先写到日志里，主要是为了故障后恢复用

## TwoPhaseCommitSinkFunction

Flink在1.4.0版本引入了TwoPhaseCommitSinkFunction接口，封装了两阶段提交逻辑，并在Kafka Sink connector中实现了TwoPhaseCommitSinkFunction，依赖Kafka版本为0.11+

Flink Kafka Sink执行两阶段提交的流程图大致如下：

![1](/images/posts/knowledge/flink-commit/1.png)

假设一种场景，从Kafka Source拉取数据，经过一次窗口聚合，最后将数据发送到Kafka Sink，如下图：

![2](/images/posts/knowledge/flink-commit/2.png)

1. JobManager向Source发送Barrier，开始进入pre-Commit阶段，当只有内部状态时，pre-commit阶段无需执行额外的操作，仅仅是写入一些已定义的状态变量即可。当chckpoint成功时Flink负责提交这些写入，否则就终止取消掉它们。
2. 当Source收到Barrier后，将自身的状态进行保存，后端可以根据配置进行选择，这里的状态是指消费的每个分区对应的offset。然后将Barrier发送给下一个Operator。

![3](/images/posts/knowledge/flink-commit/3.png)

3. 当Window这个Operator收到Barrier之后，对自己的状态进行保存，这里的状态是指聚合的结果(sum或count的结果)，然后将Barrier发送给Sink。Sink收到后也对自己的状态进行保存，之后会进行一次预提交。

![3](/images/posts/knowledge/flink-commit/3.png)

预提交成功后，JobManager通知每个Operator，这一轮检查点已经完成，这个时候，Kafka Sink会向Kafka进行真正的事务Commit。

![4](/images/posts/knowledge/flink-commit/4.png)

以上便是两阶段的完整流程，提交过程中如果失败有以下两种情况

1. Pre-commit失败，将恢复到最近一次CheckPoint位置
2. 一旦pre-commit完成，必须要确保commit也要成功

因此，所有opeartor必须对checkpoint最终结果达成共识：即所有operator都必须认定数据提交要么成功执行，要么被终止然后回滚。


