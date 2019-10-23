---
layout: wiki
title: xi_board
categories: 前端
description: 悉BOARD项目介绍
keywords: 动态生成, Java Web, 卡片
---

## 悉BOARD

1. 悉BOARD是什么

    悉BOARD是一款高度开放高度自由的一站式展示页面解决方案。
    ![悉board示意图](/images/peojects/xi_board/xi1.png)

2. 悉BOARD特点

    - 网页元素卡片化
        网页的每一个显示内容，都可抽象成一张卡片，网页由一个个卡片组成。

        ![悉board示意图](/images/peojects/xi_board/xi5.png)

    - 更便捷的信息展示
        无需编程，通过图形化管理界面动态配置各个卡片。

        ![悉board示意图](/images/peojects/xi_board/xi3.png)

    - 多样化的信息展示
        既支持静态的网页展示，又支持配置自动刷新时间动态刷新各个组件。

    - 卡片动态刷新
        卡片可配置刷新时间，定时抽取刷新最新数据。同时可以配置将历史时间存储与localStorage中。

        ![悉board示意图](/images/peojects/xi_board/xi6.png)

3. 悉BOARD系统结构

    - 数据存储
        基于MySQL的JSON格式存储 + 内置的文件存储系统

    - 数据解析
        页面展示引擎 + 卡片展示引擎

        ![悉board示意图](/images/peojects/xi_board/xi4.png)

    - 技术框架
        - 数据库：MySQl
        - 后台 Struts2 + hibernate（由于项目启动较早比较老了）
        - 前端存储 localStorage
        - 前端 jQuery + Bootstrap

4. 安装成果

    - 企业IT实时监控平台

        ![悉board示意图](/images/peojects/xi_board/xi7.png)

    - [自邮之翼](http://www.free4inno.com) 官网

5. [GitHub](https://github.com/fuhuacn/free_board)
