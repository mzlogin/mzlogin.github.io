---
layout: post
title: Spark分区原理
categories: Knowledge
description: 学习Spark的分区原理
keywords: Spark,分区
---
## Spark分区的概念

每个RDD/Dataframe被分成多个片，每个片被称作一个分区，每个分区的数值都在一个任务中进行，任务的个数也会由分区数决定。

