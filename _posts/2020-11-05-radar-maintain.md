---
layout: post
title: 雷达模拟机安装维护手册
categories: Airport
description: 雷达模拟机安装维护手册
keywords: radar control simulate，maintain
---

# 雷达模拟机安装维护手册

## 第1章	引言

### 1.1	编写目的

本手册编写目的是明确雷达管制运行仿真实验平台各模块软件在各个平台下的安装说明。

### 1.2	总体介绍

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/fd82959f-c020-4c50-a089-91ba4efa853a)

（房间布局图）

雷达管制模拟系统设备部署在1个房间：

1)	部署管制席位1—管制席位2的设备；

2)	部署机长席位1—机长席位2的设备；

3)	部署服务器设备、数据准备席位和系统运行控制席位；

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/06fc2adc-5f74-4c70-9932-d0b14235716c)

（网络拓扑图）

### 1.3	环境要求
系统硬件配置

|  序号 | 硬件配置标识符                       |  功能和作用  | 与其它硬件、外部接口的关系   |  数量          |
|-----:|:-------------------------------------| :-------------------------------------| :-------------------------------------| :-------------------------------------|
| 01  | 景象音频记录服务器               | 主要负责记录各工作席位的景象数据和语音通讯数据；| 10/100BASE-T      |     1      |
| 02  | 综合信息数据库服务器             | 负责存储和管理系统的各种数据；                 | 10/100BASE-T      |     1     |
| 03  | 空中交通进程实时仿真服务器        | 负责根据练习实时产生雷达航迹，响应各席位的操作命令，记录航迹、指令、告警相关数据；   | 10/100BASE-T          |     1      |
| 04  | 系统运行控制席位终端              | 负责分组管理、运行控制、状态监控、数据回放、软件统一升级、雷达模拟多扇区联合运行、评估练习效果  | 10/100BASE-T        |     1      |
| 05  | 数据准备席位终端                  | 负责编辑态势空域、练习计划；|10/100BASE-T           |     1     |
| 06  | 飞行员操作席位终端                | 负责根据管制员语音指令，选择并操纵指定的飞机，控制飞机的飞行；  | 10/100BASE-T        |   2        |
| 07  | 管制员工作席位终端                | 负责模拟真实ATC系统中的雷达显示终端功能；| 10/100BASE-T         |     2      |
| 08  | 助理管制员工作席位终端            | 负责模拟真实ATC系统中的雷达显示终端功能；  | 10/100BASE-T         |     2      |
| 09  | 飞行员语音通讯设备终端     | 负责培训过程中进行语音通讯； | 10/100BASE-T         |     2      |
| 10  | 管制员语音通讯设备终端   | 负责培训过程中进行语音通讯；  | 10/100BASE-T           |     2      |
| 11  | 局域网交换机                  | 实现系统内部局域联网；     | 10/100BASE-T          |     1      |
| 12  | 管制员席位操作台                  |部署工作席位设备；      | 10/100BASE-T |     2      |
| 13  | 耳麦、脚踏板、话务盒、电源、串口线           | 通讯；              | 10/100BASE-T          |      5     |

### 1.4	网络地址规划

整个系统的单播网段地址为192.168.1；最后一位地址按不同的设备类型划分不同的范围。

系统设备的详细地址分配如下表：

网络地址分配表：

| 设备名称 | IP地址分配                       |  
|----------------:|:-------------------------------------| 
| 服务器           | 192.168.1.31             | 
| 语音服务器       | 192.168.1.32            | 
| 仿真服务器       | 192.168.1.11        | 
| 教员席位         | 192.168.1.41              | 
| 数据准备席位      | 192.168.1.42                  | 
| 管制员工作席位1   | 192.168.1.91                | 
| 助理管制工作席位1  | 192.168.1.81                | 
| 管制员语音通讯设备1  | 192.168.1.71             | 
| 管制员工作席位2      | 192.168.1.92      | 
| 助理管制员工作席位2  |  192.168.1.82   |
| 管制员语音通讯设备2  |  192.168.1.72                  | 
| 飞行员操作希望1      |  192.168.1.61              |
| 飞行员语音通讯设备1  |  192.168.1.51           |
| 飞行员操作席位2      |  192.168.1.62            |
| 飞行员语音通讯设备2  |  192.168.1.52           |

系统组播地址配置表：

| 管制员工作组 | 组播地址分配                      |  
|-----:|:-------------------------------------| 
| 管制员工作组1  | 224.100.100.101             | 
| 管制员工作组2  | 224.100.100.102            | 

## 第2章	服务器的安装说明

### 2.1	综合信息数据库服务器

	服务器操作系统版本，目前为Windows 

	数据库版本为SQL Server 2005

数据库安装在“服务器”上，IP地址按照“表1-2 网络地址分配表”设置为“192.168.1.31”。

#### 2.1.1	SQL Server 2005安装

1）	双击SQL Server 2005安装文件

2）	弹出如图对话框：

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/3e6f76da-7eb4-402a-a366-1e0e049c9c5f)

3）	选择“基于86的操作系统”，弹出如图对话框：

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/1c7468fc-6593-43b6-90bc-6266ab6df12f)

4）	选择“服务器组件、工具、联机丛书和示例”，弹出如图对话框：

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/0a780d9a-7568-4918-8b55-64bbbd735444)

5）	点击“我接受许可条款和条件”，单击“下一步”，弹出如图对话框：

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/84ae4e72-0f0d-4588-8882-dfff3ded792e)

6）	SQL Server安装必要组件，点击“安装”，弹出如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/a401a989-fc53-4511-ab7c-1e0312ecbf78)

7）	必要组件安装完成后，点击“下一步”，弹出如图对话框：

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/2c581d1b-decb-4894-a460-d0a38a087e40)

8）	单击“下一步”，弹出如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/40908b62-41ab-4656-9b30-0822c1987dab)

9）	系统配置检查完成后，单击“下一步”，弹出如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/283a7cfb-404e-4e05-a0f9-971e347f73b0)

10） 注册信息默认即可，单击“下一步”，弹出如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/5960aabe-427b-48ac-bc17-2834a96d8854)

11）	选择所有可选项，单击“下一步”，弹出如图话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/62bf84a7-d9f1-45f9-987f-5f030f26cb83)

12）	选择“默认实例”，单击“下一步”，弹出如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/21ae1fe3-c956-4b18-bbb2-b5567d8fe0e4)

13）	选择“使用内置系统账户”，单击“下一步”，弹出如所示对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/9912d046-fb56-425c-9798-6c05eb3ab68b)

14）	选择“混合模式”，设置密码，默认输入为“THCL7!@#”，点击“下一步”按钮，弹出如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/97386918-b06e-4ff3-8ff8-1b6620166ea8)

15）	排序规则保持默认即可，单击“下一步”，弹出如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/715b2d44-f3b3-4992-a521-423ae2b48b9f)

16）	错误和使用情况报告设置保持默认即可，单击“下一步”，弹出如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/ec794b4d-53df-4c42-9634-e4a79ef98a0e)

17）	单击“安装”，弹出如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/b58b3e51-d077-4cd4-a40f-0bae8bc235f5)

18）	安装完成后，点击“下一步”，弹出如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/318cfac9-6753-47ef-98dd-afd7c0e6298a)

19）	点击“完成”，SQL Server2005就安装完毕了。

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/863b9849-7112-44d2-914a-38e7258b0616)

#### 2.1.2	数据库设置远程连接

1）	在“开始”→“所有程序”→“Microsoft SQL Server 2005” →“配置工具”中找到“SQL Server 外围应用配置器”，单击打开，弹出如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/3e8cb852-84e9-4f5d-a986-d6e8f733acc6)

2）	点击“服务和连接的外围应用配置器”，弹出如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/e0a5a342-f0b3-411d-ac5a-d08f47062160)

3）	打开“远程连接”，选择“本地连接和远程连接”，在选择“同时使用TCP/IP和Named Pipes”，点击“应用”按钮，回到“服务”页面，如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/bdf8935f-f7e5-4ec8-bdf2-2ce56b25d595)

4）	选择“停止”，服务停止后，再选择“启动”，开启SQL Server服务；或者在上面设置完成后，重新启动电脑。

#### 2.1.3	系统数据库创建

1）	在“开始”→“所有程序”→“Microsoft SQL Server 2005” →“配置工具”中找到“SQL Server Management Studio”，单击打开，弹出如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/466fbe71-b784-4dc3-9881-cb27f90cb248)

2）	服务器类型选择“数据库引擎”，服务器名称输入本机的IP地址“192.168.1.53”，身份验证选择“Windows身份验证”，点击“连接”，弹出如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/64dc1509-aecc-4d97-b57b-b24c75dd83aa)

3）	如果能够弹出上图对话框，说明数据库连接设置正常。然后双击如图图标的数据库维护程序

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/8d3f70d7-4ce7-4c0d-8c6a-1f7851a89c50)

4）	弹出如图对话框，设置数据库文件保存的路径（建议找一个剩余空间较大的盘存放数据库），设置好路径后，点击“保存”按钮，软件自动创建所需数据库，以及导入必要数据；数据库创建完成后，程序自动退出。

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/18ebd2b4-cbd5-4616-a9a2-ba1788c93b05)

#### 2.1.4	数据库备份与还原

数据库在备份和还原的时候，不允许其他软件使用，否则会出现“数据库使用无法备份和还原”类似的提示。关闭所有的模拟机系统软件。

##### 数据库备份：

1、	首先打开数据管理工具：“开始”—“所有程序”—“Microsoft SQL Server 2005”，打开“SQL Server Management Studio”，弹出如下界面。

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/681d91e7-5dd6-4eb0-94cb-1844bc297663)

2、	在“服务器名称”输入“（Local）”，“身份验证”选择“SQL Server身份验证”，“登录名”输入“sa”，“密码”输入“1234”，如下图。

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/6b0fc1ee-9f71-4bc9-bc28-f872e59005a3)

3、	在“对象资源管理器”中找到“数据库”—“RadarSimDB”，如下图。

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/3133522d-a70a-4d53-bdea-d8002df7cc47)

4、	在“RadarSimDB”上右键菜单中，选择“任务”—“备份”，弹出如下界面。

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/0b9afb85-fe13-4805-8f4c-17bbf0545554)

5、	设置文件保存路径，点击“添加”按钮，在弹出界面中设置备份文件的保存路径和文件名称，然后点击“确定”按钮即可。

##### 数据库还原：

1、	与备份数据库前三步操作方式相同。

2、	在“RadarSimDB”上右键菜单中，选择“属性”，弹出如下界面。

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/4826ee30-78e1-42e9-9805-d9203c60f86c)

3、	在“选择页”中，选择“文件”，记录数据库文件所在路径和文件名称，（还原时用，只要看一下路径和名称即可）关闭界面。

4、	在“RadarSimDB”上右键菜单中，选择“任务”—“还原”—“数据库”，弹出如下界面。

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/fb1e02b6-5fff-439d-8b7b-ddb6256a3131)

5、	选择“源设备”，点击“…”按钮，在弹出的菜单中选择备份的文件，添加完成后，会在“选择用户还原的备份集”中显示出数据库备份的时间（可能会有多个），选择最近的一个时间的备份。

6、	在“选择页”中点击“选项”，界面如下。

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/2a448fa2-bd69-469b-8db3-bc1a83889725)

选择“覆盖现有数据库”，在“数据库文件还原为”中设置数据库文件路径和文件名称（即是第三步中记录的），如果文件路径和文件名都对，直接点“确定”按钮即可。

### 2.2	空中交通进程实时仿真服务器

该软件安装在“服务器”上，IP地址设置为“192.168.1.57”，安装过程如下：

1)	双击空中交通进程实时仿真软件图标，如下图图标

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/1ea99bec-80b8-4ef2-9a8d-3ce9232a18fe)

2)	弹出如下图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/63b1b680-491b-40ee-8cc6-ac1251333788)

3)	点击“下一步”，弹出如下图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/5cd83ef1-8f4d-48a5-b0e4-e025a792887c)

4)	点击“浏览”按钮，设置安装路径，然后点击“下一步”，弹出如下图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/61ccc9f8-c0c1-4c9b-90e7-48b3303a5426)

5)	点击“安装”，弹出如下图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/46cfc787-12d5-452d-ae2d-d075004eae86)

6)	安装完成，弹出如下图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/c06938ba-b5ea-4908-93db-e40a3b8b76e2)

### 2.3	语音景象服务器

#### 2.3.1	景象服务软件安装

该软件安装在“服务器”上，安装过程如下：

1)	双击景象服务安装软件图标，如图所示

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/1ad72382-1d2a-4d5a-810f-a4c39b96b88d)

2)	弹出如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/9c99a81c-1fc0-4303-87d6-f7a585441275)

3)	点击“下一步”，选择“我同意该许可协议的条款”，进行默认安装，如图所示对话框。 

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/ae4b85f5-8518-4fd3-b183-b5c406ef3304)
 
4)	直到如图2-35显示，点击完成安装结束

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/17599282-1d50-456b-8f83-29354e1a480c)
  
5)	修改景象记录服务器的数据库连接文件
找到安装目录下，打开config文件夹下的DB.xml文件，根据需要修改DB.xml文件（默认不需要修改），如图所示：

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/8cada74d-3db8-4050-9d48-38385bc10d53)

将DATABASENAME="test"中引号部分为数据库名称，

USERNAME="sa"中引号部分为数据库登录用户名，

PASSWORD="THCL7!@#"中引号部分为数据登录密码，

HOSTNAME="192.168.1.53"中引号部分为数据库IP地址，

PORT="-1"中引号部分为访问数据的端口号。

6)	修改景象记录服务器的配置文件
在安装路径的根目录下找到parameter.xml文件，根据需要修改其本地存放路径，即用于存放录制文件的本地路径（默认不需要修改），如图所示：

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/c38d88cd-d76c-4fda-9570-ed9b76bdcf4d)

将<dirinfo temporary="/export/home/user/upfile" changetemp="/dev/
rmt/1" />中"/export/home/user/upfile"的路径地址改为本地存放路径d:\Record； 

#### 2.3.2	语音景象合成软件安装

该软件安装在“语音/景象服务器”上，安装过程如下：

1)	双击语音景象合成软件图标，如图所示。

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/472b6e12-9dcb-42f0-97f9-59edbe015a66)

2)	弹出如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/700f05e0-5622-4446-9cc2-d43917ffba98)

3)	点击“下一步”进行默认安装，直到如图显示，点击“完成”完成安装。

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/b74c4079-993b-42dd-af3e-744dc5222cf5)
 
#### 2.3.3	内话服务器软件安装

该软件安装在“语音服务器”上。

## 第3章	客户端软件安装步骤
### 3.1	代理安装

此代理客户端需安装到管制员和助理管制员席位、模拟机长席位、以及语音设备客户端上，安装完成后，将软件的启动文件名称和路径写到代理客户端得xml文件下，操作如下：

1)	双击代理软件图标，如图所示：

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/e63b7169-4248-4dfb-9852-8a9c18e00c1a)

2)	弹出如图对话框：

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/de947e17-3e8c-40a7-a05a-86e387b04c39)
  
3)	点击“Next”，弹出如图对话框：

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/a43c6899-6ce6-47d6-a9dd-08c89404c23b)

4)	选择“I agree to the terms of this license agreement”，点击“Next”，弹出如图对话框：

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/43f3cd94-14ca-420a-a11a-ce9ac9e225b2)

5)	填写用户名，公司名称，点击“Next”，弹出如图对话框：

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/7d135653-b89f-4417-a1d9-d64e5459b5f8)

6)	点击“Next”，弹出如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/72e259ac-61d2-471a-b652-4a222d48ea4f)

7)	选择 “Install shortcuts for current user only”，点击“Next”，弹出如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/e01c57b0-07ad-4fa7-a514-09c28f907cc0)

8)	点击“Next”，弹出如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/fa3cf730-763f-4ecd-ad25-1faff09e7efd)

9)	安装完毕后，弹出如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/22488154-9eff-4e4f-9f15-00c2cd28e3c7)

配置代理文件，双击打开安装目录C:\Program Files\RcsSysMonitorAgent 中如图文件：

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/7057a1c7-acae-49dc-b655-194e480f95e1)

文件中的内容为：
<?xml version="1.0" encoding="utf-8" ?>
 <xbel version="1.0">
   <ItemList>
    <SeatInfo SeatName="RCS.AreaEditorSeat" SeatPath="D:\RadarCtrlSim\developer\applications\RCS.AreaEditorSeat\" />
   </ItemList>
</xbel>
将该文件中的SeatName=引号中的内容改为管制员或助理管制员的启动文件名称、SeatPath=引号中的内容修改为管制员或助理管制员的安装路径，即完成对管制席的代理配置。同理配置飞行员席位子系统的代理文件。

### 3.2	雷达基础数据编辑软件

雷达基础数据编辑软件（简称数据编辑软件），该软件安装在“教员席位”上，安装过程如下：

1)	双击数据编辑软件图标，如图所示

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/4332acfa-b6f4-468e-83b7-7fbcad229f19)

2)	弹出如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/f62e6da5-6eda-4663-bb74-3b4a69245add)

3)	点击“下一步”，弹出如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/2c5d6f49-2e07-48a5-8890-608514180121)

4)	点击“浏览”按钮，设置安装路径，然后点击“下一步”，弹出如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/97fedbb4-d995-4886-ac2f-6dbdcd0e6f30)

5)	点击“安装”，弹出如图对话框开始安装程序。	

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/bb5f7a29-bea1-47ac-ab19-aa972dd35a94)

6)	安装完成，弹出如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/bb983938-e952-4299-9364-a4d21643ebf2)

### 3.3	雷达飞行计划处理与显示软件

雷达飞行计划处理与显示软件（简称FDT），该软件安装在“助理管制员席位”上，安装过程如下：

1)	双击FDT图标，如图所示

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/019de9f0-842b-4e55-b091-204ad80ea858)

2)	弹出如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/30135619-9dfc-4a4c-97e7-5f842dac9165)

3)	点击“下一步”，弹出如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/df5580e1-ceba-42a1-a620-c90f9ae9917e)

4)	点击“浏览”按钮，设置安装路径，然后点击“下一步”，弹出如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/5f44c2f7-a483-4c00-9a1b-4e20e3514464)

5)	点击“安装”，弹出如图对话框开始安装程序。

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/fc1d6dfd-1a33-4e38-9b51-6d111284545f)

6)	安装完成，弹出如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/e6c3dbc5-2a44-45b8-b65b-9ab7173529c2)

### 3.4	系统运行控制软件

该软件安装在“教员席位”上，安装过程如下： 

1)	双击系统运行控制软件图标，如图所示

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/ce62d192-ebeb-47a4-a3e7-28674a208df1)

2)	弹出如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/3132602f-10b6-4d23-8b3d-0396e67369cf)

3)	点击“下一步”，弹出如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/5eb3d130-39be-4f50-abf7-2e9ddca9a51a)

4)	点击“浏览”按钮，设置安装路径，然后点击“下一步”，弹出如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/96bf6be5-6dc4-4dd2-bd02-a4b9393b530f)

5)	点击“安装”，弹出如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/6fe2c2db-0284-43c7-a9c6-13a6d33ed4b4)

6)	安装完成，弹出如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/4772a346-8a00-445b-b8ca-c556b43c902c)

### 3.5	管制员席位子系统

该软件安装在“受训管制员席位”和“助理管制员席位”上，安装过程如下：

1)	双击管制员席位软件图标，如图所示

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/31195347-d907-4f0e-951f-195876663887)

2)	弹出如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/6c8c8c07-3d00-423f-86fb-a234b9a42151)
 
3)	点击“下一步”按钮，弹出如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/0ad36f6f-0286-4a9c-994f-135f495aa4af)

4)	点击“浏览”按钮，设置安装路径，弹出如图对话框。

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/c398748b-54d4-4d06-84c4-06c9168fb3d1)
  
5)	然后点击“安装”，弹出如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/247e9212-56d6-48e6-be66-fbe6684cb5b6)
 
6)	安装完成后，弹出如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/4361aa36-bee0-420c-aa1f-157e1cd41e6e)
 
### 3.6	飞行员席位子系统
该软件安装在“模拟机长席位”上，安装过程如下：

1)	双击飞行员席位软件图标，如图所示

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/2e2f5966-47fc-4d69-bd25-a042f9710773)
  
2)	弹出如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/9e72887e-b614-4707-8bc3-93f63ce866cc)
 
3)	点击“下一步”，弹出如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/09527d65-f632-44a9-8bc5-4b51b3cd414a)
 
4)	点击“浏览”按钮，设置安装路径，然后点击“下一步”，弹出如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/ab134f9c-04b3-4c49-9e85-dff8d5b23bc8)
 
5)	点击“安装”，弹出如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/c8b96f33-7a63-4541-b910-e97e91326f1a)
 
6)	安装完成后，弹出如图对话框

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/2b8e51b3-be20-4bdd-ab97-faf9712cf875)
   
7)	点击“完成”，完成软件安装。

### 3.7	语音客户端安装

该软件安装在“教员席位语音设备”、“管制员席位语音设备”和“模拟机长席位语音设备”上。：

第4章	常见问题
4.1	系统运行控制软件

| 问题描述 | 可能原因             |  排查建议     |
|-----:|:----------------------------| :-------------------------------------| 
| 系统运行控制无法启动计算机  | 计算机上次没有正常关闭   | 先关闭系统上运行的所有程序，再正常关闭计算机 |
|                         | 选择的分组中不包含该计算  | 重新划分分组，选择要启动的计算机，再启动计算机 |
| 系统运行控制无法关闭计算机  |计算机上没有安装代理服务程序  | 按照3.1方式安装代理服务程序    |
|                         | 选择的分组中不包含该计算机  | 重新划分分组，选择要关闭的计算机，再关闭计算机 |

4.2	管制员席位软件

| 问题描述 | 可能原因             |  排查建议     |
|-----:|:----------------------------| :-------------------------------------| 
| 系统提示“该用户已经在其他席位登陆”而无法登录系统  | 上次管制席位软件未正常关闭   | 在运行控制席位上，在“人员管理”--“在线状态管理”中，删除该用户的登陆信息 |
| 练习启动后，系统无法接收到数据                        | 在该电脑上打开多个程序  | 关闭所有程序，重新打开 |
| 练习开始后，练习时间在变化，界面上不显示飞机  | 练习类型设置为程序管制  | 在空中交通场景生成系统上修改该练习的类型为雷达管制，再重新开始    |

4.3	模拟机长席位软件

| 问题描述 | 可能原因             |  排查建议     |
|-----:|:----------------------------| :-------------------------------------| 
| 航空器操纵软件发送指令成功，但航空器状态没变化 | 仿真计算服务器IP地址不对   | 打开运行控制软件，修改仿真计算设备IP地址，或者修改数据库中设备对应的IP地址 |
| 练习启动后，系统无法接收到数据                        | 在该电脑上打开多个程序  | 关闭所有程序，重新打开 |

4.4	内话系统服务端

问题描述 | 可能原因             |  排查建议     |
|-----:|:----------------------------| :-------------------------------------| 
| 连不上数据库  | 服务器计算机没启动   | 检查服务器主机是否开机 |
|                         | 服务器主机的杀毒软件及防火墙没有关闭  | 关闭服务器主机的杀毒软件和防火墙 |
| 内话客户端启动时提示“COM端口启动失败，请重新配置”  | 没有系统默认的启动端  | 联系开发人员，修改配置文件“Config.ini”  |
| 内话客户端启动时提示“UDP端口启动失败，请重新配置”  | 系统默认的UDP端口已被占用  | 联系开发人员重新设置对应的UDP端口 |
| 内话客户端运行中提示“检查COM口是否连接完好”  | 话务盒电源没有连接好   | 重新插入话务盒电源 |
|                         | 话务盒与主机的COM口没有连接好  | 重新插入COM口 |
|                         | 系统设置的COM口与连接的COM口不对应  | 按照设置的对应关系连接COM口 |
| 内话客户端运行中提示“该席位不是活动状态”  | 本按钮对应的席位关闭或没有开启  | 开启对应席位    |
|                         | 网络没有连接好  | 检查网络连接 |
| 内话客户端按下PTT后，有音频进来时，无线信道对应的状态绿条没有闪烁  | 网络状态不好   | 检查网络连接 |

4.5	内话系统客户端

问题描述 | 可能原因             |  排查建议     |
|-----:|:----------------------------| :-------------------------------------| 
| 内话服务端启动时提示“COM端口启动失败，请重新配置”  | 没有系统默认的启动端   | 联系开发人员，修改配置文件“Config.ini” |
| 内话服务端启动时提示“UDP端口启动失败，请重新配置”  | 系统默认的UDP端口已被占用  | 联系开发人员重新设置对应的UDP端口 |
| 内话服务端开始监听后，听不到声音 | 放音系统硬件电源没有插好  | 重新插入放音系统电源  |
| 内话服务端开始放音后，听不到声音  | 系统默认的UDP端口已被占用  | 联系开发人员重新设置对应的UDP端口 |
| 内话客户端运行中提示“检查COM口是否连接完好”  | 放音系统硬件电源没有插好   | 重新插入放音系统电源 |
|                         | 系统设置的COM口与连接的COM口不对应  |右键单击内话服务端界面右侧“记录名称列表”中所放音频，单击打开文件，查看“Remark=”后是否有数据。 |



