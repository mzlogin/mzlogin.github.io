---
layout: post
title: 在 Mac 下编译 chaosblade
categories: [混沌工程]
description: 在 Mac 下编译 chaosblade，从开始到放弃。
keywords: 混沌工程, chaosblade
---

首先声明，这不是一份指南，这是一份失败的操作流水记录。我得到的最终结果：编译成功，但是无法运行，放弃在 Mac 平台直接使用此工具，乖乖用 Linux 或者容器环境。

以下问题的遇到和解决记录，基本是按时间序。

[chaosblade 项目的 README 上自行编译部分](https://github.com/chaosblade-io/chaosblade#compile) 说明很简单，就是 `make build_darwin` 这么一条命令而已。

## 环境准备

1. 安装 go，<https://go.dev/> 下载最新版安装，我安装的是 1.17.7 版本，然后将 /usr/local/go/bin 添加到 PATH。

2. 安装和配置 JAVA 环境。（我以前装过，本次先没动它，但实际后面也遇到问题与此相关。）

3. 安装 Docker Desktop。

## 下载源码，开始编译

```sh
git clone git@github.com:chaosblade-io/chaosblade.git
cd chaosblade
make build_darwin
```

然后，兵来将挡，水来土掩的问题解决之旅开始了。

## 遇到问题，解决问题

### 0x01 网络问题

编译过程中需要下载一些源码和二进制文件，首先遇到了网络问题。

如果遇到 `timeout` 或者 `fatal: 无法访问 'xxxx'：LibreSSL SSL_connect: Operation timed out in connection to xxx.com:443` 之类的提示，一般是因为有一些资源偶尔需要科学上网才能访问。

解决方法：

终端挂代理：

```sh
export http_proxy=http://127.0.0.1:54107
export https_proxy=http://127.0.0.1:54107
export no_proxy="chaosblade.oss-cn-hangzhou.aliyuncs.com"
```

其中代理自备，`no_proxy` 那一行是指定从阿里域名下载不走代理。

如果遇到下载 <https://chaosblade.oss-cn-hangzhou.aliyuncs.com/agent/github/sandbox/sandbox-1.3.1-bin.zip> 特别慢，几 kb/s 的速度，但是用浏览器下载很快，那可以先停掉编译，直接用浏览器下载好该文件，放到 target/cache/chaosblade-exec-jvm/build-target/cache 下面，再重新开始编译。

同理：

如果遇到下载 <https://chaosblade.oss-cn-hangzhou.aliyuncs.com/agent/release/tools.jar> 特别慢，可以先停掉编译，直接用浏览器下载好该文件，放到 target/cache/chaosblade-exec-jvm/build-target/cache 下面，再重新开始编译。

例外是如果遇到下载 <https://chaosblade.oss-cn-hangzhou.aliyuncs.com/agent/github/1.5.0/chaosblade-1.5.0-linux-amd64.tar.gz> 特别慢，手动下载，放到 target/cache/chaosblade-operator/build/cache 也不行，编译过程只认自己下载的。

由以上得出的小技巧：

如果从 GitHub release 界面下载 chaosblade 的 release 文件特别慢，比如 <https://github.com/chaosblade-io/chaosblade/releases/download/v1.3.0/chaosblade-1.3.0-darwin-amd64.tar.gz>，可以将链接替换为 <https://chaosblade.oss-cn-hangzhou.aliyuncs.com/agent/github/1.3.0/chaosblade-1.3.0-darwin-amd64.tar.gz> 加速下载。

### 0x02 go 依赖模块问题

如果遇到

```sh
exec/model.go:22:2: missing go.sum entry for module providing package github.com/chaosblade-io/chaosblade-exec-os/exec (imported by github.com/chaosblade-io/chaosblade-exec-docker/exec); to add:
        go get github.com/chaosblade-io/chaosblade-exec-docker/exec
exec/executor_execin.go:29:2: missing go.sum entry for module providing package github.com/chaosblade-io/chaosblade-spec-go/channel (imported by github.com/chaosblade-io/chaosblade-exec-docker/exec); to add:
        go get github.com/chaosblade-io/chaosblade-exec-docker/exec
exec/client.go:29:2: missing go.sum entry for module providing package github.com/chaosblade-io/chaosblade-spec-go/spec; to add:
        go mod download github.com/chaosblade-io/chaosblade-spec-go
exec/container.go:24:2: missing go.sum entry for module providing package github.com/chaosblade-io/chaosblade-spec-go/util; to add:
        go mod download github.com/chaosblade-io/chaosblade-spec-go
make[1]: *** [build_yaml] Error 1
make: *** [docker] Error 2
```

到 target/cache/chaosblade-exec-docker 和 target/cache/chaosblade-exec-os 目录下执行

```sh
go mod tidy
```

整理依赖，参考 <https://stackoverflow.com/questions/67203641/missing-go-sum-entry-for-module-providing-package-package-name>

### 0x03 Java 编译问题

如果遇到报错：

```
[ERROR] Failed to execute goal org.apache.maven.plugins:maven-compiler-plugin:3.1:compile (default-compile) on project chaosblade-exec-spi: Compilation failure: Compilation failure:
[ERROR] 不再支持源选项 6。请使用 7 或更高版本。
[ERROR] 不再支持目标选项 6。请使用 7 或更高版本。
[ERROR] -> [Help 1]
[ERROR]
[ERROR] To see the full stack trace of the errors, re-run Maven with the -e switch.
[ERROR] Re-run Maven using the -X switch to enable full debug logging.
[ERROR]
[ERROR] For more information about the errors and possible solutions, please read the following articles:
[ERROR] [Help 1] http://cwiki.apache.org/confluence/display/MAVEN/MojoFailureException
[ERROR]
[ERROR] After correcting the problems, you can resume the build with the command
[ERROR]   mvn <args> -rf :chaosblade-exec-spi
make[1]: *** [build_java] Error 1
make: *** [java] Error 2
```

修改 target/cache/chaosblade-exec-jvm/chaosblade-exec-spi/pom.xml 里的 

```xml
<configuration>
    <source>6</source>
    <target>6</target>
</configuration>
```

为

```xml
<configuration>
    <source>8</source>
    <target>8</target>
</configuration>
```

同理，后面还会遇到类似的报错，对应还要修改：

- target/cache/chaosblade-exec-jvm/chaosblade-exec-common/pom.xml
- target/cache/chaosblade-exec-jvm/chaosblade-exec-service/pom.xml
- target/cache/chaosblade-exec-jvm/chaosblade-exec-bootstrap/chaosblade-exec-bootstrap-jvmsandbox/pom.xml
- target/cache/chaosblade-exec-jvm/chaosblade-exec-plugin/chaosblade-exec-plugin-dubbo/pom.xml
- target/cache/chaosblade-exec-jvm/chaosblade-exec-plugin/chaosblade-exec-plugin-jvm/pom.xml
- target/cache/chaosblade-exec-jvm/chaosblade-exec-plugin/chaosblade-exec-plugin-mysql/pom.xml
- target/cache/chaosblade-exec-jvm/chaosblade-exec-plugin/chaosblade-exec-plugin-postgrelsql/pom.xml
- target/cache/chaosblade-exec-jvm/chaosblade-exec-plugin/chaosblade-exec-plugin-servlet/pom.xml
- target/cache/chaosblade-exec-jvm/chaosblade-exec-plugin/chaosblade-exec-plugin-jedis/pom.xml
- target/cache/chaosblade-exec-jvm/chaosblade-exec-plugin/chaosblade-exec-plugin-elasticsearch/pom.xml
- target/cache/chaosblade-exec-jvm/chaosblade-exec-plugin/chaosblade-exec-plugin-hbase/pom.xml

另外：

- target/cache/chaosblade-exec-jvm/chaosblade-exec-plugin/pom.xml
- target/cache/chaosblade-exec-jvm/chaosblade-exec-plugin/chaosblade-exec-plugin-dubbo/pom.xml（存疑）
- target/cache/chaosblade-exec-jvm/chaosblade-exec-plugin/chaosblade-exec-plugin-http/pom.xml（存疑）

里是需要添加

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <configuration>
                <source>8</source>
                <target>8</target>
            </configuration>
        </plugin>
    </plugins>
</build>
```

如果遇到

```
[ERROR] Failed to execute goal org.apache.maven.plugins:maven-compiler-plugin:3.1:compile (default-compile) on project chaosblade-exec-plugin-redisson: Compilation failure
[ERROR] /Users/mazhuang/github/chaosblade/target/cache/chaosblade-exec-jvm/chaosblade-exec-plugin/chaosblade-exec-plugin-redisson/src/main/java/com/alibaba/chaosblade/exec/plugin/redisson/RedissonEnhancer.java:[52,23] 对info的引用不明确
[ERROR]   org.slf4j.Logger 中的方法 info(java.lang.String,java.lang.Object...) 和 org.slf4j.Logger 中的方法 info(java.lang.String,java.lang.Throwable) 都匹配
[ERROR]
[ERROR] -> [Help 1]
[ERROR]
[ERROR] To see the full stack trace of the errors, re-run Maven with the -e switch.
[ERROR] Re-run Maven using the -X switch to enable full debug logging.
[ERROR]
[ERROR] For more information about the errors and possible solutions, please read the following articles:
[ERROR] [Help 1] http://cwiki.apache.org/confluence/display/MAVEN/MojoFailureException
[ERROR]
[ERROR] After correcting the problems, you can resume the build with the command
[ERROR]   mvn <args> -rf :chaosblade-exec-plugin-redisson
make[1]: *** [build_java] Error 1
make: *** [java] Error 2
```

修改 target/cache/chaosblade-exec-jvm/chaosblade-exec-plugin/chaosblade-exec-plugin-redisson/src/main/java/com/alibaba/chaosblade/exec/plugin/redisson/RedissonEnhancer.java

```java
LOGGER.info("method command {}", ReflectUtil.invokeMethod(command, "getName", new Object[0], false));
```

改成 

```java
Object tmpResult =  ReflectUtil.invokeMethod(command, "getName", new Object[0], false);
LOGGER.info("method command {}", tmpResult);
```

如果遇到

```
[ERROR] Failed to execute goal org.apache.maven.plugins:maven-compiler-plugin:3.1:compile (default-compile) on project chaosblade-exec-common: Fatal error compiling: java.lang.IllegalAccessError: class lombok.javac.apt.LombokProcessor (in unnamed module @0x45da40ad) cannot access class com.sun.tools.javac.processing.JavacProcessingEnvironment (in module jdk.compiler) because module jdk.compiler does not export com.sun.tools.javac.processing to unnamed module @0x45da40ad -> [Help 1]
[ERROR]
[ERROR] To see the full stack trace of the errors, re-run Maven with the -e switch.
[ERROR] Re-run Maven using the -X switch to enable full debug logging.
[ERROR]
[ERROR] For more information about the errors and possible solutions, please read the following articles:
[ERROR] [Help 1] http://cwiki.apache.org/confluence/display/MAVEN/MojoExecutionException
[ERROR]
[ERROR] After correcting the problems, you can resume the build with the command
[ERROR]   mvn <args> -rf :chaosblade-exec-common
make[1]: *** [build_java] Error 1
make: *** [java] Error 2
```

将 target/cache/chaosblade-exec-jvm/chaosblade-exec-common/pom.xml

lombok 版本由 1.18.10 改为 1.18.20，参考 https://www.cnblogs.com/ZZG-GANGAN/p/14789050.html

如果遇到 

```java
The JAVA_HOME environment variable is not defined correctly,
this environment variable is needed to run this program.
make[1]: *** [build_java] Error 1
make: *** [java] Error 2
```

那配置 JAVA_HOME：

```sh
/usr/libexec/java_home -V
vim ~/.zshrc
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_271.jdk/Contents/Home
export PATH=$JAVA_HOME/bin:$PATH
:wq
source ~/.zshrc
```

### 0x04 Docker 问题

如果遇到

```
docker: Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?.
See 'docker run --help'.
make: *** [upx] Error 125
```

启动 Docker Desktop，然后再开始编译。

### 0x0x 未知

编码过程中有个警告，不知道有无影响：

```
WARN[0000] parse java spec failed, so skip it, open build/cache/chaosblade/yaml/chaosblade-jvm-spec-1.5.0.yaml: no such file or directory
```

## 结果

终于编译成功了，生成了 target/chaosblade-1.5.0.tar.gz 文件。

但解压后执行 `./blade`，输出：

```sh
zsh: killed     ./blade
```

下载官方 Release 的 1.3.0 的 darwin 版本文件，也是报同样的问题。

到 [Issues](https://github.com/chaosblade-io/chaosblade/issues) 里翻到了几个类似的问题，官方给出的 [建议](https://github.com/chaosblade-io/chaosblade/issues/478)，比如修改系统【安全与隐私】-【通用】配置等，经验证都无效。

至此，如文首所述，放弃了在 Mac 平台下折腾，直接用 Linux 或者容器环境来体验。
