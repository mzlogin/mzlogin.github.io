---
layout: post
title: Spark Job、Task、Stage关系
categories: Knowledge
description: Spark Job、Stage、Task关系
keywords: Spark
---
Spark中的Job、Stage、Task关系之前一直不是很清晰，今天研究了一下，主要参考[文档](https://www.jlpyyf.com/article/22)

这里拿一个简单的wordcount作为例子。代码如下：

``` scala
import org.apache.spark.{SparkConf, SparkContext}

/**
  * @Author: fuhua
  * @Date: 2019-06-19 14:45
  */
object WordCount {
  def main(args: Array[String]) {
    val conf = new SparkConf()
      .setAppName("WordCount")
      .setMaster("local[2]");
    val sc = new SparkContext(conf)

    val lines = sc.textFile("/Users/fuhua/Desktop/test.txt");
    val words = lines.flatMap { line => line.split(" ")}
    val pairs = words.map {word => (word, 1)}
    val wordCount = pairs.reduceByKey(_ + _)
    wordCount.foreach(wordCount => println(wordCount._1 + " 出现次数为： " + wordCount._2 + " times"))
    println(wordCount.top(1).toSeq)
    Thread.sleep(1000000000)
  }
}
```

## Job

当要执行一个rdd action操作时，就会产生一个job，如在代码中的reduceByKey和top操作，就有两个job。（即遇到action即生成一个新的Job）

![Job](/images/posts/knowledge/spark-taskstagejob/WX20191104-124812.png)

>注：spark的action操作和transformation操作:
>
>+ transformation: Transformation用于对RDD的创建，RDD只能使用Transformation创建，同时还提供大量操作方法，包括map，filter，groupBy，join等，RDD利用这些操作生成新的RDD，但是需要注意，无论多少次Transformation，在RDD中真正数据计算Action之前都不可能真正运行。
>+ action: Action是数据执行部分，其通过执行count，reduce，collect等方法真正执行数据的计算部分。实际上，RDD中所有的操作都是Lazy模式进行，运行在编译中不会立即计算最终结果，而是记住所有操作步骤和方法，只有显示的遇到启动命令才执行。这样做的好处在于大部分前期工作在Transformation时已经完成，当Action工作时，只需要利用全部自由完成业务的核心工作。

## Stage

在DAGScheduler中，会将每个job划分成多个stage，它会从触发action操作的那个RDD开始往前推，首先会为最后一个RDD创建一个stage，然后往前倒推的时候，如果发现对某个RDD是宽依赖，那么就会将宽依赖的那个RDD创建一个新的stage。（即在job中从后往前倒退，遇到宽依赖新建stage）

![Stage](/images/posts/knowledge/spark-taskstagejob/stage.png)

>注：窄依赖:
>
>+ 窄依赖：父RDD和子RDD partition之间的关系是一对一的。不会有shuffle的产生。父RDD的一个分区去到子RDD的一个分区中。如：map，flatMap
>+ 宽依赖：父RDD与子RDD partition之间的关系是一对多的。会有shuffle的产生。父RDD的一个分区去到子RDD的不同分区里面。如：reduceByKey

## Task

task是stage下的一个任务执行单元，一般来说，一个rdd有多少个partition，就会有多少个task，因为每一个task只是处理一个partition上的数据。像我这次本地跑的，因为设定的是local[2]即两个CPU核心，所以是两个分区划分为两个task。（即stage的执行单元）

![Task](/images/posts/knowledge/spark-taskstagejob/task.png)
