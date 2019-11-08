---
layout: wiki
title: IaaS
categories: 云计算
description: IaaS介绍
keywords: 云计算, 融合云，KVM
---

# IaaS

一个完备的融合云平台，支持云主机，云硬盘的创建，并且可以个性化管理云镜像，并且通过提供开放的api接口，使第三方应用可以方便的使用云弹性计算服务。
在这个项目中，我负责运维此平台4年的时间，对这个分布式架构有着比较深的理解，并且在运维过程中添加了一些新功能，例如kvm虚拟机创建选择物理机时的调度策略，由之前的单一内存优先策略升级为多种调度策略的组合。并且在kvm虚拟机创建方式上也进行了改进升级，由之前仅支持外部快照创建虚拟机的方式修改为即能外部快照也能全量备份创建虚拟机，提供了更加丰富的云主机模板支持。
本文档对云海IaaS系统的系统架构设计和各个模块分别加以说明

## 总体架构

![架构图](https://github.com/ShangfengDing/IaaS/blob/master/frame.jpg)

在上图中，使用了三种不同颜色的连线，代表了模块间通信的不同方式。为了使上图更加简洁，忽略了Resource-Scheduler、Vm-Scheduler、Volume-Scheduler、Network-Provider、Image-Server模块与DB-Proxy模块的连线，实际上，这五个模块都涉及数据库读写。同样出于简洁的考虑，简略了LOL（日志）模块与其他模块的连线，在IaaS系统中，所有的模块都需要将日志通过RPC接口写到LOL。

1. IaaS Front
IaaS Front是用户门户，使用户通过浏览器就可以申请、操作、管理云资源，并记录用户的操作事件。IaaS Front的登录依赖于Account。
IaaS Front的主要功能包括：

    - 申请云主机，对云主机进行开机、关机、重启、删除、修改配置等基本操作，以及VNC远程访问、创建备份、系统重置等高级功能；
    - 申请云硬盘，对云硬盘进行挂载、删除等操作；
    - 创建和管理防火墙；
    - 记录操作日志，显示用户账户信息等；
    - 创建企业用户，企业用户管理；
    
2. IaaS Admin
IaaS Admin是管理员门户，使用管理员通过浏览器对IaaS平台进行全面的管理，包括：
    - 监控IaaS平台主要功能模块的运行状态；
    - 管理IaaS平台的资源（集群、节点、网络、模板等）；
    - 管理IaaS平台的云产品（云主机、云硬盘）；
    - 管理IaaS平台的用户和群组；
    - 管理IaaS平台的计费，包括资源费用设置、套餐设置、交易管理等；
    - IaaS平台的运行管理，包括记录运行日志，设置告警；
    - IaaS平台的操作管理，包括管理员的设置，管理员操作日志的记录和查询等。
IaaS Admin的登录不依赖于Account。

3. Api Server
API Server负责接收来自IaaS Front和IaaS Admin的所有请求，对外提供RESTFul Web Service.API Server的请求对来Front和Admin的请求处理具有如下特点：
    - 对于涉及实际物理资源（如CPU、内存、硬盘、模板、带宽）的请求，API Server对请求进行初步处理后，会通过RPC方式调用Resource Scheduler的接口，并对物理资源进行操作；
    - 对于仅涉及数据库修改的请求，API Server通过调用TIP协议调用DB-Proxy的接口对请求进行处理；
    - 对于物理资源的请求一般比较耗时，在这种情况下，API Server向Front或Admin直接返回Response，Resource Scheduler将采用异步方式处理这些请求；
在代码实现上，与API Server紧密相关的还有两个子工程，分别是API Common和API Client。
    - API Common：通过将Common中的Model的基础上，对Model中的成员添加注解，注解源于javax.xml.bind.annotation包；通过这步操作，可以在Front、Admin与API Server交互的过程中，将数据模型对象转换为XML格式；
    - API Client：Front、Admin通过调用API Client中的接口，生成请求的URL地址，并向API Server发起请求。
    
4. Resource-Scheduler
Resource Scheduler接收API Server发来请求，对请求的资源进行调度，并在取得调度结果的情况下，将请求进步发给Vm-Scheduler或Volume-Scheduler。
在IaaS中，资源分为计算资源（CPU和内存）、存储资源（硬盘）、网络资源（带宽），一台云主机的计算资源和存储资源可以分布在不同的物理服务器上，网络资源属于逻辑上的集群，由Network Provider通过DHCP方式获取IP，具体计算资源的调度由VM Scheduler实现，具体存储资源的调度由Volume Scheduler实现。Resource Scheduler负责在上层调度VM Scheduler、Volume Scheduler和Network Provider。
在IaaS的代码实现中，用到了事务处理，比如创建云主机的时候，对计算资源、存储资源和网络资源的申请应该看成一个事务，要么全部获取到，则创建虚拟机完成；如果其中有一种资源获取失败，则创建虚拟机失败，已经获取的资源需要归还给IaaS平台，即回滚操作。

5. Vm Scheduler
Vm-Scheduler对上接受Resource-Schedule的调用；根据具体的调度策略，向下调度具体的某个Vm-Controller。主要负责VM资源的调度，主要包括CPU、内存和防火墙规则等等；包括虚拟机的操作等。其功能主要如下：
    - 资源调度，为了使资源更加合理的利用，在Vm-Scheduler设有对CPU和内存的调度。当然可以根据不同的调度策略实现不同的调度机制。
    - 对虚拟机的操作，包括创建、关机、重启、删除等操作。由于在Vm-Controller没有操作数据库的权限，所以在Vm_Scheduler这层需要为虚拟机的操作准备参数，比如创建虚拟机的时CPU核数和内存大小等等；当然也包括硬盘的挂载和卸载。
    - 对防火墙规则的操作，包括防火墙的增删改查，防火墙规则的增删改查。
    
6. Vm Controller
Vm-Controller部署在每一个计算节点之上，对上接受Vm-Scheduler的调用，向下直接操作libvirt提供的Java API，是跟底层直接交互的一层。
通过Libvirt调用KVM的接口，进而实现虚拟化。Vm-Controller的实现逻辑比较容易理解，即通过定义一个XML文件，继而调用Libvirt的接口，即可完成对虚拟机的创建；当然虚拟机的其他操作也是根据Libvirt的接口实现的，比如启动、停止和删除等等。显然，关于防火墙的操作也是根据Libvirt的接口实现的。
另外，在IaaS中，实现了对虚拟机实时状态的监控，而实现方式就是根据Libvirt的接口来获取每个虚拟机的状态，进而达到了实时监控的目的。

7. Volume Scheduler
Volume-Scheduler对上接受Resource-Schedule的调用，向下表现为控制Volume-Provider。主要负责硬盘的创建，删除等硬盘相关的操作；快照的生成，删除；备份的生成，删除；发布镜像等；主要功能如下：
    - 资源调度，为了合理利用硬盘资源，需要对所创建硬盘的主机进行选择，这就是硬盘的资源的调度。当然可以有多种调度策略来实现调度。
    - 硬盘的操作，因为在Volume-Provider这层没有操作数据库的权限，所以需要在Volume-Schedule调用Volume-Provider的时，为其准备相应的参数。硬盘的操作包括创建、删除等。
    - 快照和备份，为了实现用户虚拟机的高可靠性而实现的功能。
    - 镜像的发布，其实就是硬盘的拷贝。
    - 修改密码，因为对于操作系统来说，其账号和密码都是固化到硬盘上的，所以可以通过修改硬盘文件来达到修改密码的效果。
    
8. Volume Provider
Volume-Provider部署在每个存储节点之上，接受Volume-Scheduler的调用。主要负责对物理介质的真实操作，而在Schedule一层，主要负责处理逻辑。此处才是真正的执行对硬盘的操作。
    - Volume-Provider主要通过调用qemu命令来实现硬盘的创建。而删除硬盘只是在Linux上删除一个普通文件。
    - 快照和备份，快照的操作也是根据qemu命令实现的。而备份只是硬盘的拷贝。
    - 镜像的发布，其实就是硬盘的拷贝。
    - 修改密码，通过开源的libguestfs工具，可以达到对volume文件的操作，进而可以修改硬盘的密码文件，以此达到修改密码的效果。
    
9. Network Provider
Network Provider对上接受Resource-Scheduler的调用，向下表现为控制DHCP Controller。主要负责IP的分配与管理

10. DHCP Controller
部署个数由使用者自行决定，可在不同的集群下设置不一样的dhcp，分配不一样的网段。

11. Node Agent
Node-Agent部署在每台计算节点或存储节点，除了对前端提供服务的启动和停止之外，基本为一个独立的模块。其主要功能如下：
    - 启动各个服务，通过maven的一些特性和Linux shell来实现启动各个模块的效果。
    - 收集信息，包括宿主机负载信息、虚拟机实时信息和各个服务的状态。
    
12. LOL Server 
LOL是一套分布式日志系统，对外提供两套接口，分别是RPC接口和HTTP接口，应用通过调用这些接口将日志存储到分布式文件系统中。
LOL Server即LOL对外提供的RPC接口，目前仅对IaaS开放使用。IaaS通过LOL Server的接口可以读/写LOL上的日志。关于LOL写日志的接口说明，请查看《日志规范和接口》。

13. Image Server
Image Server负责创建和管理IaaS平台上的模板或镜像。需要注意的是，Image Server的管理仅是对数据库的操作，并不对实际物理存储进行修改。对物理存储资源的修改（如镜像的保存，删除等）有Volume Scheduler实现。
关于模板和镜像的区别:
    - 模板：在已有操作系统上，根据某种需求，在该操作系统上安装特定的软件，并将安装好软件的模板以及操作系统作为一个整体进行发布。用户使用模板安装并启动虚拟机时，可以看到预先安装好的软件。同时，用户的系统盘并不会完整地拷贝一份模板文件，而是作为只读文件提供给用户，用户对操作系统所作的任何修改都将以增量文件的形似保存在用户云主机的硬盘上。模板一般以.img作为文件格式。
    - 镜像：即原始的操作系统安装文件，一般以.iso作为文件格式。当用户选择从ISO安装云主机时，就好像在普通的电脑上使用光驱安装操作系统一样。
    
14. DB Proxy
为了避免对数据库的连接过多，设计了DB Proxy，使各个模块对数据库的访问由DB Proxy完成。DB Proxy具有访问数据库的能力，其他模块对数据库的请求，是通过TIP方式交由DB Proxy处理完成的。DB Proxy使用JPA做数据库中间件。



最后附上github地址
[GitHub](https://github.com/ShangfengDing/IaaS)


   
