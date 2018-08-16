---
layout: post
title: Telegraf+InfluxDB+Grafana 构建监控平台
categories: 运维
description: OPS 内容建设团队第二期分享 - Telegraf+InfluxDB+Grafana 构建监控平台
keywords:  Telegraf, InfluxDB, Grafana, 运维, 监控
---

> 本文章为本人在 OPS 内容建设团队第二期分享

>  欢迎关注微信公众号：OPS 无界工程师

大家晚上好，今晚由我来分享基于 Telegraf+InfluxDB+Grafana 构建监控平台的方案，首先我们先来了解 InfluxDB。InfluxDB 是一款专为时序数据编写的高性能数据库，采用 GO 语言开发，并且开源！它是 TICK 技术栈的一部分。它采用 TSM 引擎进行高速摄取和数据压缩。并提供高性能的写入/查询 HTTP API，其表达式语句类似 SQL 查询语句（但数据结构概念不太一样，详见 [InfluxDB design insights and tradeoffs](https://docs.influxdata.com/influxdb/v1.5/concepts/crosswalk/)。

先对上面的一些名称进行解释，TICK 技术栈指的是 InfluxData 公司研发的四款监控开源产品，包括 Telegraf、InfluxDB、Chronograf、Kapacitor。其中 InfluxDB 使用最广泛，是开源的时序数据库，一个比较常见的应用场景为日志存储。Kapacitor 提供了基于 InfluxDB 的监控报警方案，支持多种数据聚合，选择，变换，预测方法。Chronograf 用于对数据进行展示，可以使用功能更强大的 Grafana 替代。

TSM 引擎这块我也不太熟悉，属于进阶知识，网上资料也不多，感兴趣的大佬可以自己去研究：

![TSM](/assets/img/blog/2018/05/13/1.png)

## 1 InfluxDB

时序数据库主要用于存储系统的监控数据，一般具有如下特征：

- 以时间为维度的高效查询
- 方便的 Down Sampling
- 高效的处理过期数据

对于 InfluxDB 的学习方式，我建议先参考 [Linux 大学的 InfluxDB 系列教程](https://www.linuxdaxue.com/influxdb-principle.html) 对 InfluxDB 有一个基本的了解（但不需要死抠，因为其中有些描述是过时的），然后再去 [InfluxDB 官档](https://docs.influxdata.com/influxdb/v1.5/) 深入学习为佳。

### 1.1 下载并安装 InfluxDB

```shell
# 添加 yum 源
cat <<EOF | sudo tee /etc/yum.repos.d/influxdb.repo
[influxdb]
name = InfluxDB Repository - RHEL \$releasever
baseurl = https://repos.influxdata.com/rhel/\$releasever/\$basearch/stable
enabled = 1
gpgcheck = 1
gpgkey = https://repos.influxdata.com/influxdb.key
EOF
sudo yum install influxdb
influx -version
```

启动服务、添加开机启动：

```shell
sudo service influxdb start
sudo systemctl start influxdb
```

### 1.2 主要概念

InfluxDB 与传统数据库在概念上有一些不同，我介绍一些基本的概念，如果你想了解更多请参考官档 [influxdb concepts](https://docs.influxdata.com/influxdb/v1.5/concepts/)

#### 1.2.1 与传统数据库中的名词做比较

| InfluxDB 中的名词 | 	传统数据库中的概念 |
|-----|-----|
| Database | 数据表 |
| Measurement | 数据库中的表 |
| Points | 表里面的一行数据 |

#### 1.2.2 InfluxDB 的独有概念

刚才说的是 InfluxDB 与传统数据库相同的概念，下面介绍它的特有概念。

##### 1.2.2.1 Point

Point 相当于传统数据库中表里面的一行数据，由 Timestamp（时间戳），Field（数据），Tags（标签）组成。

| Point 属性 | 传统数据库中的概念 |
|-----|----|
| Timestamp | 每个数据都需要一个时间戳（主索引&自动生成），在TSM存储引擎中会特殊对待，以为了优化后续的查询操作 |
| Field | （field key,field set,field value） 各种记录值（没有索引的属性），例如温度 |
| Tags | （tag key,tag sets,tag value） 各种有索引的属性，例如地区 |

##### 1.2.2.2 Series

Series 相当于是 InfluxDB 中一些数据的集合。所有在数据库中的数据，都要通过图表展示出来，而 Series 则表示表里面的数据，可以在图表上画成几条线（通过 Tags 排列组合算出来）：

```shell
> show series from cpu
key
---
cpu,cpu=cpu-total,host=VM_42_233_centos
cpu,cpu=cpu0,host=VM_42_233_centos
cpu,cpu=cpu1,host=VM_42_233_centos
cpu,cpu=cpu2,host=VM_42_233_centos
cpu,cpu=cpu3,host=VM_42_233_centos
```

其代码结构如下：

```shell
type Series struct {
    mu          sync.RWMutex
    Key         string              // series key
    Tags        map[string]string   // tags
    id          uint64              // id
    measurement *Measurement        // measurement
}
```

##### 1.2.2.3 Shard

每个存储策略下会存在许多 Shard，每个 Shard 存储一个指定时间段的数据，例如 7 - 8 点的数据落入 Shard0 中，8 - 9 点的数据落到 Shard1 中，每个 Shard 都对应一个底层的 TSM 存储引擎，有独立的 CACHE，WAL，TSM FILE。

### 1.3 数据保留策略

保留策略（RP）是用来定义数据在 InfluxDB 存放的时间，或者定义保存某个期间的数据。当你创建数据库时，InfluxDB 会自动创建一个 Autogen（具有无限保留的保留策略）:

```shell
> SHOW RETENTION POLICIES ON telegraf
name    duration shardGroupDuration replicaN default
----    -------- ------------------ -------- -------
autogen 0s       168h0m0s           1        true
```

上面是查询数据库现有策略的语句，查询结果各字段含义如下：

| 字段 | 含义 |
|-----|-----|
| name | 策略名称 |
| duration | 持续时间，0 代表无限保留 |
| shardGroupDuration | shardGroup 是 InfluxDB 的一个基本储存结构，168h0m0s 表示单个 Shard 所存储的时间间隔为 168 小时，超过 168 小时后会被存放到下一个 Shard 中 |
| replicaN | 全称 Replication，副本个数 |
| default | 是否是默认策略 |

```js
func shardGroupDuration(d time.Duration) time.Duration {
    if d >= 180*24*time.Hour || d == 0 { // 6 months or 0
        return 7 * 24 * time.Hour
    } else if d >= 2*24*time.Hour { // 2 days
        return 1 * 24 * time.Hour
    }
    return 1 * time.Hour
}
```

我们可以创建一个新的保留策略，下面语句在 Telegraf 库中创建了一个 2 小时保留策略，名为 2h0m0s 并设置为默认策略：

```sql
> CREATE RETENTION POLICY "2h0m0s" ON "telegraf" DURATION 2h REPLICATION 1 DEFAULT
> SHOW RETENTION POLICIES ON telegraf
name    duration shardGroupDuration replicaN default
----    -------- ------------------ -------- -------
autogen 0s       168h0m0s           1        false
2h0m0s  2h0m0s   1h0m0s             1        true
```

目前我们的 Autogen 已经不再是默认策略，如果你需要查询这个策略的数据，你需要在查询时显式的加上策略名：

```sql
> SELECT time,host,usage_system FROM "autogen".cpu limit 2
name: cpu
time                host             usage_system
----                ----             ------------
1526008670000000000 VM_42_233_centos 1.7262947210419817
1526008670000000000 VM_42_233_centos 1.30130130130254
```

更多保留策略相关的内容，请参考官档 [database_management](https://docs.influxdata.com/influxdb/v1.5/query_language/database_management/)。

### 1.4 连续查询

连续查询（CQ）是在数据库中自动定时启动的一组语句，InfulxDB 会将查询结果存储在指定的数据表中。

- 使用连续查询是最优降低采样率的方式，连续查询和存储策略搭配使用将会大大降低 InfulxDB 的系统占用量。
- 使用连续查询后，数据会存放到指定的数据表中，这样就为以后统计不同精度的数据提供了方便。
- 连续查询一旦创建就无法更改。要更改连续查询，您必须先 DROP 再重新使用 CREATE 创建新查询。

下面是连续查询的语法：

```sql
// 基本语法
CREATE CONTINUOUS QUERY <cq_name> ON <database_name>
RESAMPLE EVERY <interval> FOR <interval>
BEGIN
  SELECT <function[s]> INTO <destination_measurement> 
  FROM <measurement> [WHERE <stuff>] 
  GROUP BY time(<interval>)[,<tag_key[s]>]
END
```

例如，下面语句在 Telegraf 库中新建了一个名为 cq_30m 的连续查询，每 30 分钟会取 Used 字段的平均值加入到 mem_used_30m 表中。使用的数据保留策略都是 Default：

```sql
CREATE CONTINUOUS QUERY cq_30m ON telegraf BEGIN SELECT mean(used) INTO mem_used_30m FROM mem GROUP BY time(30m) END
```

下面是一些常用操作：

| SQL | 描述 |
|-----|----|
| SHOW CONTINUOUS QUERIES | 查询所有 CQ |
| DROP CONTINUOUS QUERY <cq_name> ON <database_name> | 删除连续查询 |

更多连续查询相关的内容，请参考官档[continuous_queries](https://docs.influxdata.com/influxdb/v1.5/query_language/continuous_queries/)。

### 1.5 常用函数

InfluxDB 提供了很多的有用的函数，其中分为三类：

- 聚合类函数

| 函数 | 描述 |
|----|----|
| count(field_key) | 返回计数 |
| DISTINCT(field_key) | 返回唯一值 |
| INTEGRAL(field_key) | 计算字段值覆盖的曲面的面积值并得到面积之和 |
| MEAN(field_key) | 返回平均值 |
| MEDIAN(field_key) | 返回中间值 |
| MODE(field_key) | 返回字段里最频繁的值 |
| SPREAD(field_key) | 返回最大差值 |
| SUM(field_key) | 返回总和 |

- 选择类函数

| 函数 | 描述 |
|----|----|
| BOTTOM(field_key,N) | 返回最小的N个值 |
| FIRST(field_key) | 返回一个字段中最老的取值 |
| LAST(field_key) | 返回一个字段中最新的取值 |
| MAX(field_key) | 返回一个字段中的最大值 |
| MIN(field_key) | 返回一个字段中的最小值 |
| PERCENTILE(field_key,N) | Returns the Nth percentile field value. |
| SAMPLE(field_key,N) | 返回N个字段的随机样本 |
| TOP(field_key,N) | 返回最大的N个值 |

- 转换类函数

| 函数 | 描述 |
|----|----|
| CEILING() | ~ |
| CUMULATIVE_SUM() | ~ |
| DERIVATIVE() | ~ |
| DIFFERENCE() | ~ |
| ELAPSED() | ~ |
| FLOOR() | ~ |
| HISTOGRAM() | ~ |
| MOVING_AVERAGE() | ~ |
| NON_NEGATIVE_DERIVATIVE() | ~ |
| NON_NEGATIVE_DIFFERENCE() | ~ |

- 预测类

| 函数 | 描述 |
|----|----|
| HOLT_WINTERS() | [季节性预测算法-对数据流量趋势进行预测和预警](https://blog.csdn.net/zhixingheyi_tian/article/details/79458383) |

---

## 2 Telegraf

建立起了对时序库的概念后，接下来我们就该往时序库写数据了，你可以通过你应用服务的 Metrics 程序采集指标，然后通过 InfluxDB 提供的 HTTP API 向 InfluxDB 写入数据，但是本期我们并不介绍这样的用法（如 Java 的 Metrics 还需介绍 Java 的语法），下面为大家介绍一款与 InfluxDB 完美结合的采集数据的代理程序：Telegraf

Telegraf 是用 Go 写的代理程序，可以用于收集系统和服务的统计数据，是 **TICK 技术栈** 的一部分。它具备输入插件，可以直接从系统获取指标数据，从第三方 API 获取指标数据，甚至可以通过 Statsd 和 Kafka 获取指标数据。它还具备输出插件，可以将采集的指标发送到各种数据存储，服务和消息队列。比如 InfluxDB，Graphite，OpenTSDB，Datadog，Librato，Kafka，MQTT，NSQ 等等。

### 2.1 下载并安装 Telegraf：

```shell
wget https://dl.influxdata.com/telegraf/releases/telegraf-1.6.2-1.x86_64.rpm
sudo yum install telegraf-1.6.2-1.x86_64.rpm
telegraf -version
```

如果你的 Telegraf 是安装的，其配置文件位置为：

```shell
/etc/telegraf/telegraf.conf
```

编辑配置文件，将我们配置好的 InfluxDB 数据库指定为期望的输出源：

```shell
[[outputs.influxdb]]
  urls=["http://localhost:8086"]
```

启动服务、添加开机启动：

```shell
sudo systemctl start telegraf.service
sudo service telegraf status
sudo systemctl enable telegraf.service
```

在 InfluxDB 上检查默认配置下 Telegraf 采集了哪些数据：

```shell
> show databases
> use telegraf
> show measurements
> SHOW FIELD KEYS
```

### 2.2 如何进行配置

默认配置下，会启用 system 分类下的 INPUT 插件，即 telegraf.conf 有如下配置：

```shell
# Read metrics about cpu usage
# 读取有关CPU使用情况的指标
[[inputs.cpu]]
  ## Whether to report per-cpu stats or not
  percpu = true
  ## Whether to report total system cpu stats or not
  totalcpu = true
  ## If true, collect raw CPU time metrics.
  collect_cpu_time = false
  ## If true, compute and report the sum of all non-idle CPU states.
  report_active = false

# Read metrics about disk usage by mount point
# 通过mount point读取有关磁盘使用情况的指标
[[inputs.disk]]
  ## Ignore mount points by filesystem type.
  ignore_fs = ["tmpfs", "devtmpfs", "devfs"]

# Read metrics about disk IO by device
# 通过device读取有关磁盘IO的指标
[[inputs.diskio]]

# Get kernel statistics from /proc/stat
# 通过/proc/stat获取内核统计信息
[[inputs.kernel]]
  # no configuration

# Read metrics about memory usage
# 读取有关内存使用量的指标
[[inputs.mem]]
  # no configuration

# Get the number of processes and group them by status
# 获取进程的数量并按状态分组
[[inputs.processes]]
  # no configuration

# Read metrics about swap memory usage
# 读取有关交换内存使用量的指标
[[inputs.swap]]
  # no configuration

# Read metrics about system load & uptime
# 读取有关系统负载和运行时间的指标
[[inputs.system]]
  # no configuration
```


其具体采集数据如下 [其中第一级别为 Measurements，第二级别为字段（省略了时间戳字段）]：

```shell
- cpu[units: percent (out of 100)]
    - usage_guest      float
    - usage_guest_nice float
    - usage_idle       float
    - usage_iowait     float
    - usage_irq        float
    - usage_nice       float
    - usage_softirq    float
    - usage_steal      float
    - usage_system     float
    - usage_user       float
- disk
    - free         integer
    - inodes_free  integer
    - inodes_total integer
    - inodes_used  integer
    - total        integer
    - used         integer
    - used_percent float
- diskio
    - io_time          integer
    - iops_in_progress integer
    - read_bytes       integer
    - read_time        integer
    - reads            integer
    - weighted_io_time integer
    - write_bytes      integer
    - write_time       integer
    - writes           integer
- kernel
    - boot_time        integer
    - context_switches integer
    - entropy_avail    integer
    - interrupts       integer
    - processes_forked integer
- mem
    - active            integer
    - available         integer
    - available_percent float
    - buffered          integer
    - cached            integer
    - free              integer
    - inactive          integer
    - slab              integer
    - total             integer
    - used              integer
    - used_percent      float
    - wired             integer
- processes
    - blocked       integer
    - dead          integer
    - idle          integer
    - paging        integer
    - running       integer
    - sleeping      integer
    - stopped       integer
    - total         integer
    - total_threads integer
    - unknown       integer
    - zombies       integer
- swap
    - free         integer
    - in           integer
    - out          integer
    - total        integer
    - used         integer
    - used_percent float
- system
    - load1         float
    - load15        float
    - load5         float
    - n_cpus        integer
    - n_users       integer
    - uptime        integer
    - uptime_format string
```

### 2.3 如何查找指标及其采集数据

Telegraf 主要分为输入插件和输入插件，其源码目录分别对应 `plugins/inputs` 和 `plugins/outputs`，你只要参考 [Telegraf 官档](https://docs.influxdata.com/telegraf/v1.6/plugins/) 找到你所需要的插件然后去到源码对应的目录找到相应的 `.md` 文件，按照提示获取相关信息进行配置即可。

启用 Telegraf 服务后，你会发现在 TnfluxDB 中多了一个 Telegraf 的库，其中有多个 Measurement，这说明我们的数据采集已经成功了。有了数据以后，我们需要关心的是如何把数据聚合然后进行展示。下面将介绍一款可视化套件 Grafana。

--- 

## 3 Grafana

Grafana 是一个开源指标分析和可视化套件，常用于可视化基础设施的性能数据和应用程序分析的时间序列数据。也可以应用于其他领域，包括工业传感器，家庭自动化，天气和过程控制。但请注意，我们使用 Grafana 最关心的是如何把数据进行聚合后进行展示。

Grafana 支持多种不同的时序数据库数据源，Grafana 对每种数据源提供不同的查询方法，而且能很好的支持每种数据源的特性。它支持下面几种数据源：Graphite、Elasticsearch、CloudWatch、InfluxDB、OpenTSDB、Prometheus、MySQL、Postgres、Microsoft SQL Server (MSSQL)。每种数据源都有相应的文档，您可以将多个数据源的数据合并到一个单独的仪表板上，本文只举例 InfluxDB 数据源的应用。

### 3.1 下载并安装 Telegraf：

```shell
# 安装grafana
wget https://s3-us-west-2.amazonaws.com/grafana-releases/release/grafana-5.1.2-1.x86_64.rpm 
# 启动服务、添加开机启动：
systemctl enable grafana-server
systemctl start grafana-server
# 配置
配置文件 /etc/grafana/grafana.ini
systemd服务名 grafana-server.service
默认日志文件 /var/log/grafana/grafana.log
默认数据库文件 /var/lib/grafana/grafana.db
```

### 3.2 简单使用

启动服务后访问 `http://localhost:3000` ，默认端口为 3000 ，可在配置文件修改。默认用户名和密码为 admin/admin。登录后按照提示配置数据源：

![配置数据源 1](/assets/img/blog/2018/05/13/2.png)
![配置数据源 2](/assets/img/blog/2018/05/13/3.png)

接着创建一个 Dashboard：

![创建面板 1.png](/assets/img/blog/2018/05/13/4.png)

我们先选择导入模板的方式来预览效果，再来了解 grafana/dashboard 的相关配置，这里选择官方提供的一套[Telegraf: system dashboard](https://grafana.com/dashboards/928)，地址 `https://grafana.com/dashboards/928` 。请你根据它的提示配置你的 Telegraf。然后在 Dashboards 中选择 `import->Upload.jsonFile`，将下载的模板导入：

![导入模板](/assets/img/blog/2018/05/13/5.png)

查看结果：

![telegraf-system-dashboard](/assets/img/blog/2018/05/13/6.png)


你还可以安装一些插件，例如安装一款[时间面板插件](https://grafana.com/plugins/grafana-clock-panel/installation)。

安装方式是到你的 `/var/lib/grafana/plugins` 目录下执行 grafana-cli 工具安装插件，下面安装时间面板插件：

```shell
> sudo grafana-cli plugins install grafana-clock-panel
 installing grafana-clock-panel @ 0.0.9
 from url: https://grafana.com/api/plugins/grafana-clock-panel/versions/0.0.9/download
 into: /var/lib/grafana/plugins
 
 ✔ Installed grafana-clock-panel successfully 
  
 Restart grafana after installing plugins . <service grafana-server restart>

# 重启服务
> sudo systemctl restart grafana-server
```


### 3.3 自己动手配置几个

我们创建一个新的 Dashboard，Dashboard 由多个 Row 组成，一行 Row 分为 12 列，我们可以自定义面板的 Span 宽度和高度。现在我们选择添加一个 Singlestat（如果是绘制线性表选 Graph），然后点击 Panel Title->Edit 编辑我们的面板信息，默认打开 Metrics 视图，我们修改后得到如下信息：

![upTime 1](/assets/img/blog/2018/05/13/7.png)

我们修改options中的单位和颜色：

![upTime 2](/assets/img/blog/2018/05/13/8.png)

同样的，你可以尝试添加其他的面板实现下面效果：

![最终效果](/assets/img/blog/2018/05/13/9.png)

Grafana 的功能非常丰富，在这里不能详细叙述，请您参考官档了解更多：
`http://docs.grafana.org/features/datasources/`