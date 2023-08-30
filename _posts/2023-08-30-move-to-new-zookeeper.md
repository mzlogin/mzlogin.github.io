---
layout: post
title: Dubbo 应用切换 ZooKeeper 注册中心实例，流量无损迁移
categories: [Java]
description: 如果 Dubbo 应用使用 ZooKeeper 作为注册中心，现在需要切换到新的 ZooKeeper 实例，如何做到流量无损？
keywords: Dubbo, ZooKeeper
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

首先思考一个问题：如果 Dubbo 应用使用 ZooKeeper 作为注册中心，现在需要切换到新的 ZooKeeper 实例，如何做到流量无损？

本文提供解决这个问题的一种方案。

## 场景

- 有两个基于 Dubbo 的微服务应用，一个是服务提供者，简称 Provider，另一个是服务消费者，简称 Consumer；

- 使用 ZooKeeper 作为注册中心；

- 现在要将注册中心从旧实例「ZooKeeper（旧）」 切换到新实例「ZooKeeper（新）」；

- 要求流量无损；

*注：实际的场景可能要复杂得多，比如可能涉及很多个应用，有的应用既是服务提供者又是服务消费者等等，但原理一致。*

## 解决方案

主要利用 Dubbo 支持多注册中心的特性来进行设计。

Dubbo 多注册中心的用法参考 [多注册中心 - Apache Dubbo](https://cn.dubbo.apache.org/zh-cn/overview/mannual/java-sdk/reference-manual/registry/multiple-registry/)。

![](/images/posts/java/move-to-new-zookeeper.drawio.png)

Step 1 是现状；

Step 2 将新实例「ZooKeeper（新）」加入到 Provider 的注册中心列表中，且放在首位，此时 Provider 同时向「ZooKeeper（新）」和「ZooKeeper（旧）」注册，默认为新；

Step 3 将 Consumer 的注册中心修改为「ZooKeeper（新）」；

Step 4 将「ZooKeeper（旧）」从 Provider 的注册中心列表中移除。

*注：有一种特殊情况是一个服务既作为服务提供者又作为其它服务的消费者，这种情况应将其视为 Provider。*

至此，我们已经实现了流量无损的迁移。
