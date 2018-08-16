---
layout: post
title: Metrics-JVM上的实时监控类库
categories: 运维
description: 当我们需要为某个系统某个服务做监控、做统计，就需要用到 Metrics 。
keywords: Metrics
---

当我们需要为某个系统某个服务做监控、做统计，就需要用到 Metrics 。举个例子，一个图片压缩服务：
1. 每秒钟的请求数是多少（TPS）?
2. 平均每个请求处理的时间？
3. 请求处理的最长耗时？
4. 等待处理的请求队列的长度？

基本上每一个服务，应用都需要做一个监控系统，这需要尽量以少量的代码，实现统计某类数据的功能。

---

## 1 导入

基本使用方式直接将 core 包导入 pom 文件即可，配置如下：

``` xml
<!-- 阿里maven -->
<dependency>
    <groupId>com.yammer.metrics</groupId>
    <artifactId>metrics-core</artifactId>
    <version>3.0.0-BETA1</version>
</dependency>
```

**core 包主要提供如下核心功能：**

- Metrics Registries 类似一个 Metrics 容器，维护一个 Map，可以是一个服务一个实例。
- 支持五种 Metric 类型：Gauges，Counters，Meters，Histograms 和 Timers。
- 可以将 Metrics 值通过 JMX，Console，CSV 文件和 SLF4J loggers 发布出来。

---

## 2 五种 Metrics 类型

### 2.1 Gauges

Gauges 是一个最简单的计量，一般用来统计瞬时状态的数据信息，比如系统中处于 Pending 状态的 Job：

``` java
public class TestGauges {
    // 实例化一个registry，最核心的一个模块，相当于一个应用程序的metrics系统的容器，维护一个Map
    private static final MetricRegistry metrics = new MetricRegistry("metrics1");
    // 在控制台上打印输出
    private static ConsoleReporter reporter = ConsoleReporter.forRegistry(metrics).build();
    private static Queue<String> queue = new LinkedBlockingDeque<String>();

    public static void main(String[] args) throws InterruptedException {
        reporter.start(3, TimeUnit.SECONDS);
        // 实例化一个Gauge
        Gauge<Integer> gauge = new Gauge<Integer>() {
            public Integer getValue() {
                return queue.size();
            }
        };
        // 注册到容器中
        metrics.register(MetricRegistry.name(TestGauges2.class, "pending-job", "size"), gauge);
        for (int i = 0; i < 20; i++) {
            queue.add("a");
            // pending
            Thread.sleep(1000);
        }
    }
}
/*
console output:
17-11-13 21:42:35 ==============================================================

-- Gauges ----------------------------------------------------------------------
Metrics.TestGauges2.pending-job.size
             value = 3


17-11-13 21:42:38 ==============================================================

-- Gauges ----------------------------------------------------------------------
Metrics.TestGauges2.pending-job.size
             value = 6


17-11-13 21:42:41 ==============================================================

-- Gauges ----------------------------------------------------------------------
Metrics.TestGauges2.pending-job.size
             value = 9
*/
```

通过以上步骤将会向 MetricsRegistry 容器中注册一个名字为 Metrics.TestGauges2.pending-job.size 的 Metrics ，实时获取队列长度的指标。另外，Core 包还扩展了几种特定的 Gauge：

- JMX Gauges — 提供给第三方库只通过JMX将指标暴露出来。
- Ratio Gauges — 简单地通过创建一个gauge计算两个数的比值。
- Cached Gauges — 对某些计量指标提供缓存
- Derivative Gauges — 提供Gauge的值是基于其他Gauge值的接口。

### 2.2 Counters

Counter 是 Gauge 的一个特例，维护一个计数器，可以通过 inc() 和 dec() 方法对计数器做修改。使用步骤与 Gauge 基本类似，在 MetricRegistry 中提供了静态方法可以直接实例化一个 Counter。

``` java
public class TestCounter {
    private static final MetricRegistry metrics = new MetricRegistry("name");
    private static ConsoleReporter reporter = ConsoleReporter.forRegistry(metrics).build();
    // 实例化一个Counter
    // metrics.register(MetricRegistry.name(TestCounter.class, "pending-jobs"), new Counter());
    private static Counter pendingJobs = metrics.counter(MetricRegistry.name(TestCounter.class, "pedding-jobs"));
    private static Queue<String> queue = new LinkedList<String>();

    public static void add(String str) {
        pendingJobs.inc();
        queue.add(str);
    }
    public String take() {
        pendingJobs.dec();
        return queue.poll();
    }
    public static void main(String[] args) throws InterruptedException {
        reporter.start(3, TimeUnit.SECONDS);
        while (true) {
            add("1");
            Thread.sleep(1000);
        }
    }
}
/*
17-11-13 21:53:05 ==============================================================

-- Counters --------------------------------------------------------------------
Metrics.TestCounter.pedding-jobs
             count = 4


17-11-13 21:53:08 ==============================================================

-- Counters --------------------------------------------------------------------
Metrics.TestCounter.pedding-jobs
             count = 6


17-11-13 21:53:11 ==============================================================

-- Counters --------------------------------------------------------------------
Metrics.TestCounter.pedding-jobs
             count = 9
*/
```

### 2.3 Meters

Meters 用来度量某个时间段的平均处理次数（request per second），每 1、5、15 分钟的 TPS 。比如一个 Service 的请求数，通过 metrics.meter() 实例化一个 Meter 之后，然后通过 meter.mark() 方法就能将本次请求记录下来。统计结果有总的请求数，平均每秒的请求数，以及最近的 1、5、15 分钟的平均 TPS 。

``` java
public class TestMeters {
    private static final MetricRegistry metrics = new MetricRegistry("name");
    private static ConsoleReporter reporter = ConsoleReporter.forRegistry(metrics).build();
    // 实例化一个Meter
    private static Meter requests = metrics.meter(MetricRegistry.name(TestMeters.class, "request"));

    public static void handleReuqest() {
        requests.mark();
    }

    public static void main(String[] args) throws InterruptedException {
        reporter.start(3, TimeUnit.SECONDS);
        while (true) {
            handleReuqest();
            Thread.sleep(10);
        }
    }
}
/*
17-11-13 21:58:15 ==============================================================

-- Meters ----------------------------------------------------------------------
Metrics.TestMeters.request
             count = 292
         mean rate = 96.48 events/second
     1-minute rate = 0.00 events/second
     5-minute rate = 0.00 events/second
    15-minute rate = 0.00 events/second


17-11-13 21:58:18 ==============================================================

-- Meters ----------------------------------------------------------------------
Metrics.TestMeters.request
             count = 579
         mean rate = 96.49 events/second
     1-minute rate = 96.60 events/second
     5-minute rate = 96.60 events/second
    15-minute rate = 96.60 events/second


17-11-13 21:58:21 ==============================================================

-- Meters ----------------------------------------------------------------------
Metrics.TestMeters.request
             count = 855
         mean rate = 94.85 events/second
     1-minute rate = 96.60 events/second
     5-minute rate = 96.60 events/second
    15-minute rate = 96.60 events/second
*/
```

### 2.4 Histograms

Histograms 主要使用来统计数据的分布情况，最大值、最小值、平均值、中位数，百分比（75%、90%、95%、98%、99%和99.9%）。例如，需要统计某个页面的请求响应时间分布情况，可以使用该种类型的 Metrics 进行统计。具体的样例代码如下：

``` java
public class TestHistograms {
    private static final MetricRegistry metrics = new MetricRegistry("name");
    private static ConsoleReporter reporter = ConsoleReporter.forRegistry(metrics).build();
    // 实例化一个Histograms
    private static Histogram randomEum = metrics.histogram(MetricRegistry.name(TestHistograms.class, "random"));

    public static void handleRequest(double random) {
        randomEum.update((int) (random * 100));
    }

    public static void main(String[] args) throws InterruptedException {
        reporter.start(3, TimeUnit.SECONDS);
        Random random = new Random();
        while (true) {
            handleRequest(random.nextDouble());
            Thread.sleep(100);
        }
    }
}
/*
17-11-13 22:00:38 ==============================================================

-- Histograms ------------------------------------------------------------------
Metrics.TestHistograms.random
             count = 31
               min = 0
               max = 98
              mean = 43.68
            stddev = 34.26
            median = 41.00
              75% <= 77.00
              95% <= 96.20
              98% <= 98.00
              99% <= 98.00
            99.9% <= 98.00


17-11-13 22:00:41 ==============================================================

-- Histograms ------------------------------------------------------------------
Metrics.TestHistograms.random
             count = 60
               min = 0
               max = 98
              mean = 45.10
            stddev = 31.09
            median = 46.00
              75% <= 72.75
              95% <= 94.95
              98% <= 97.78
              99% <= 98.00
            99.9% <= 98.00


17-11-13 22:00:44 ==============================================================

-- Histograms ------------------------------------------------------------------
Metrics.TestHistograms.random
             count = 90
               min = 0
               max = 98
              mean = 47.18
            stddev = 31.06
            median = 48.50
              75% <= 77.00
              95% <= 94.45
              98% <= 97.18
              99% <= 98.00
            99.9% <= 98.00
*/
```

### 2.5 Timers

Timers 主要是用来统计某一块代码段的执行时间以及其分布情况，具体是基于 Histograms 和 Meters 来实现的。样例代码如下：

``` java
public class TestTimers {
    private static final MetricRegistry metrics = new MetricRegistry("name");
    private static ConsoleReporter reporter = ConsoleReporter.forRegistry(metrics).build();
    // 实例化一个Timer
    private static Timer requests = metrics.timer(MetricRegistry.name(TestTimers.class, "request"));

    public static void handleReuqest(int sleep) {
        Context context = requests.time();
        try {
            // 耗时操作
            Thread.sleep(sleep);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            context.stop();
        }
    }

    public static void main(String[] args) {
        reporter.start(3, TimeUnit.SECONDS);
        Random random = new Random();
        while (true) {
            handleReuqest(random.nextInt(1000));
        }
    }
}
/*
17-11-13 22:03:29 ==============================================================

-- Timers ----------------------------------------------------------------------
Metrics.TestTimers.request
             count = 6
         mean rate = 1.99 calls/second
     1-minute rate = 0.00 calls/second
     5-minute rate = 0.00 calls/second
    15-minute rate = 0.00 calls/second
               min = 86.93 milliseconds
               max = 977.19 milliseconds
              mean = 435.70 milliseconds
            stddev = 362.66 milliseconds
            median = 291.05 milliseconds
              75% <= 836.14 milliseconds
              95% <= 977.19 milliseconds
              98% <= 977.19 milliseconds
              99% <= 977.19 milliseconds
            99.9% <= 977.19 milliseconds


17-11-13 22:03:32 ==============================================================

-- Timers ----------------------------------------------------------------------
Metrics.TestTimers.request
             count = 14
         mean rate = 2.33 calls/second
     1-minute rate = 2.20 calls/second
     5-minute rate = 2.20 calls/second
    15-minute rate = 2.20 calls/second
               min = 41.82 milliseconds
               max = 977.19 milliseconds
              mean = 390.15 milliseconds
            stddev = 302.58 milliseconds
            median = 339.11 milliseconds
              75% <= 621.34 milliseconds
              95% <= 977.19 milliseconds
              98% <= 977.19 milliseconds
              99% <= 977.19 milliseconds
            99.9% <= 977.19 milliseconds


17-11-13 22:03:35 ==============================================================

-- Timers ----------------------------------------------------------------------
Metrics.TestTimers.request
             count = 20
         mean rate = 2.22 calls/second
     1-minute rate = 2.20 calls/second
     5-minute rate = 2.20 calls/second
    15-minute rate = 2.20 calls/second
               min = 41.82 milliseconds
               max = 977.19 milliseconds
              mean = 427.92 milliseconds
            stddev = 294.70 milliseconds
            median = 355.03 milliseconds
              75% <= 726.69 milliseconds
              95% <= 972.35 milliseconds
              98% <= 977.19 milliseconds
              99% <= 977.19 milliseconds
            99.9% <= 977.19 milliseconds
*/
```

---

## 3 Health Checks

Metrics 提供了一个独立的模块：Health Checks，用于对 Application、其子模块或者关联模块的运行是否正常做检测。该模块是独立 metrics-core 模块的，使用时则导入 metrics-healthchecks 包。

``` xml
<!-- 阿里maven -->
<dependency>
    <groupId>io.dropwizard.metrics</groupId>
    <artifactId>metrics-healthchecks</artifactId>
    <version>4.0.0-alpha3</version>
</dependency>
```

使用起来和与上述几种类型的 Metrics 有点类似，但是需要重新实例化一个 Metrics 容器 HealthCheckRegistry ，待检测模块继承抽象类 HealthCheck 并实现 check() 方法即可，然后将该模块注册到 HealthCheckRegistry 中，判断的时候通过 isHealthy() 接口即可。如下示例代码：

``` java
public class DatabaseHealthChecks extends HealthCheck {

    private final Database database;

    public DatabaseHealthChecks(Database database) {
        this.database = database;
    }

    @Override
    protected Result check() throws Exception {
        if (database.ping()) {
            return Result.healthy(); // 健康
        }
        return Result.unhealthy("Can't ping database."); // 不良
    }

    public static void main(String[] args) throws InterruptedException {
        // MetricRegistry metrics = new MetricRegistry();
        // ConsoleReporter reporter = ConsoleReporter.forRegistry(metrics).build();
        HealthCheckRegistry registry = new HealthCheckRegistry();
        registry.register("database1", new DatabaseHealthChecks(new Database()));
        registry.register("database2", new DatabaseHealthChecks(new Database()));
        while(true) {
            for (Map.Entry<String, Result> entry : registry.runHealthChecks().entrySet()) {
                if(entry.getValue().isHealthy()) { // 是否健康
                    System.out.println(entry.getKey() + ": OK!");
                }else {
                    System.out.println(entry.getKey() + "FAIL, error message: " + entry.getValue().getMessage());
                    Throwable e = entry.getValue().getError();
                    if(e != null) {
                        e.printStackTrace();
                    }
                }
            }
            Thread.sleep(1000);
        }
    }

    static class Database {
        /**
         * 模拟database的ping方法
         * @return 随机返回boolean值
         */
        public boolean ping() {
            Random random = new Random();
            return random.nextBoolean();
        }
    }
}
/*
SLF4J: Failed to load class "org.slf4j.impl.StaticLoggerBinder".
SLF4J: Defaulting to no-operation (NOP) logger implementation
SLF4J: See http://www.slf4j.org/codes.html#StaticLoggerBinder for further details.
database1: OK!
database2: OK!
database1FAIL, error message: Can't ping database.
database2: OK!
database1FAIL, error message: Can't ping database.
database2FAIL, error message: Can't ping database.
database1FAIL, error message: Can't ping database.
database2: OK!
database1: OK!
database2FAIL, error message: Can't ping database.
database1FAIL, error message: Can't ping database.
database2: OK!
database1FAIL, error message: Can't ping database.
database2: OK!
database1: OK!
database2: OK!
database1: OK!
database2FAIL, error message: Can't ping database.
database1: OK!
database2: OK!
database1: OK!
database2: OK!
*/
```

---

## 4 其他支持
metrics 提供了对 Ehcache、Apache HttpClient、JDBI、Jersey、Jetty、Log4J、Logback、JVM 等的集成，可以方便地将 Metrics 输出到 Ganglia、Graphite 中，供用户图形化展示。

---

## 5 参考资料
- 学习来源1：http://www.cnblogs.com/nexiyi/p/metrics_sample_1.html
- 学习来源2：http://www.cnblogs.com/nexiyi/p/metrics_sample_2.html
- Github仓库：https://github.com/dropwizard/metrics
- 官方文档：http://metrics.dropwizard.io
- Hadoop指标框架MetricsV2：https://wiki.apache.org/hadoop/HADOOP-6728-MetricsV2