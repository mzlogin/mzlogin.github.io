---
layout: post
title: Intellij IDEA解决乱码
categories: IDEA TOMCAT
description: 刚开始使用IDEA总会在工程中碰到中文乱码的情况，这里给大家列出来几处常见的编码设置，以及字体设置。
keywords: IDEA, TOMCAT, 乱码
---

刚开始使用IDEA总会在工程中碰到中文乱码的情况，这里给大家列出来几处常见的编码设置，以及字体设置。

## 常见中文乱码

* **设置文件编码**<br>
      菜单选择File->Settings->Editor->File Encodings，设置IDE Encoding、Project Encoding、Default encoding for properties files选项为UTF-8。通过这样的设置，基本上项目和项目中设计到的文件都是UTF-8编码方式，设置好结果如下图：<br>
      ![](http://wx2.sinaimg.cn/mw690/0067VWWuly1fdnd3ia6iuj30wj0iwdhb.jpg)

* **设置主题字体**<br>
      有点时候，我们IDEA菜单会出现乱码的情况。这种是我们用的字体不支持中文，需要我们重新设置主题字体。
      菜单选择File->Settings->Appearance & Behavior->Appearance->Override default fonts by, 设置成支持中文的字体。例如：Microsoft Yahei，设置好结果如下图：<br>
      ![](http://wx4.sinaimg.cn/mw690/0067VWWuly1fdndxfk0k4j30m50hs752.jpg)

* **设置TOMCAT编码**<br>
      有时候tomcat输出的日志中文乱码，是因为编码不对，需要我们配置一下。
      在TOMCAT启动文件或者JDK运行环境配置运行参数“-Dfile.encoding=UTF-8 -Dsun.jnu.encoding=UTF-8”即可。下图是我在IDEA中配置参数：<br>
      ![](http://wx2.sinaimg.cn/mw690/0067VWWuly1fdng515kbjj30i30fkdgi.jpg)
