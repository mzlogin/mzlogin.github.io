---
layout: post
title: CF的Workers免费节点IP固定
categories: Cloudflare
description: CF的Workers免费节点IP固定，一次跑满宽带
keywords: science online，反代cf，ip值段
---

# CF的Workers免费节点IP固定

## 一、介绍2种workers搭建veless节点代码

    https://github.com/zizifn/edgetunnel/blob/main/src/worker-vless.js

    https://github.com/Misaka-blog/cf-wkrs-pages-vless/blob/main/_worker.js

## 二、介绍2种IP测速工具：

    https://github.com/XIU2/CloudflareSpeedTest

    https://github.com/badafans/better-cloudflare-ip

前者给没有配置反代CF的IP,需要自己去添加。后者代码配置了反代CF的IP，可直接使用。而且还对域名进行了伪装。

## 三、获得worker代码中的反代CF的IP：

### 1.zip.baipiao.eu.org

### 2.Telegram频道：

    https://t.me/cf_push 有某大佬维护。

## 四、优选反代CF的IP。

### 1.以反代CF的IP，群组为例把所有IP文件合并：

新建txt文件，输入type *.txt»all.txt

重命名bat后运行。合并完成。

### 2.把反代CF的IP所在地区查询下载出来：

    https://reallyfreegeoip.org/bulk

在excel表中筛选想要的地区，并拷贝到txt文件

## 五、利用优先测速工具CloudflareSpeedTest工具进行优选

注意一些参数的使用,

比如：

    CloudflareST.exe -url https://cfspeed1.kkiyomi.top/200mb.bin -tl 250 -sl 10 -tlr 0.10 -f tokyo.txt
表示启动cloudflare工具，利用https://cfspeed1.kkiyomi.top/200mb.bin测速地址测速。延迟上限是250,最低速度10M,丢包率小于0.1，针对toyko.txt文件内IP测速。

## 六、优选CF的高速IP节点

### 1.打开fofa网站搜索
 server="cloudflare" && country="JP" && city="Tokyo" && port="443"
（ 意思是筛选CF的IP，国家是日本，地区是东京，端口443）

### 2.把筛选结果下载下来，期间需要注册fofa帐号，可用临时邮箱。

### 3.在excle表进行筛选，把某个地区的CF的ip拷贝到txt文件里。

### 4.进行利用优选测速工具进行筛选

参数：

-n 200

延迟测速线程；越多延迟测速越快，性能弱的设备 (如路由器) 请勿太高；(默认 200 最多 1000)

-t 4

延迟测速次数；单个 IP 延迟测速的次数；(默认 4 次)

-dn 10

下载测速数量；延迟测速并排序后，从最低延迟起下载测速的数量；(默认 10 个)

-dt 10

下载测速时间；单个 IP 下载测速最长时间，不能太短；(默认 10 秒)

-tp 443

指定测速端口；延迟测速/下载测速时使用的端口；(默认 443 端口)

-url https://cf.xiu2.xyz/url

指定测速地址；延迟测速(HTTPing)/下载测速时使用的地址，默认地址不保证可用性，建议自建；

-httping

切换测速模式；延迟测速模式改为 HTTP 协议，所用测试地址为 [-url] 参数；(默认 TCPing)

注意：HTTPing 本质上也算一种 网络扫描 行为，因此如果你在服务器上面运行，需要降低并发(-n)，否则可能会被一些严格的商家暂停服务。

如果你遇到 HTTPing 首次测速可用 IP 数量正常，后续测速越来越少甚至直接为 0，但停一段时间后又恢复了的情况，那么也可能是被 运营商、Cloudflare CDN 认为你在网络扫描而 触发临时限制机制，因此才会过一会儿就恢复了，建议降低并发(-n)减少这种情况的发生。

-httping-code 200

有效状态代码；HTTPing 延迟测速时网页返回的有效 HTTP 状态码，仅限一个；(默认 200 301 302)

-cfcolo HKG,KHH,NRT,LAX,SEA,SJC,FRA,MAD

匹配指定地区；地区名为当地机场三字码，英文逗号分隔，支持小写，支持 Cloudflare、AWS CloudFront，仅 HTTPing 模式可用；(默认 所有地区)

-tl 200

平均延迟上限；只输出低于指定平均延迟的 IP，各上下限条件可搭配使用；(默认 9999 ms)

-tll 40

平均延迟下限；只输出高于指定平均延迟的 IP；(默认 0 ms)

-tlr 0.2

丢包几率上限；只输出低于/等于指定丢包率的 IP，范围 0.00~1.00，0 过滤掉任何丢包的 IP；(默认 1.00)

-sl 5

下载速度下限；只输出高于指定下载速度的 IP，凑够指定数量 [-dn] 才会停止测速；(默认 0.00 MB/s)

-p 10

显示结果数量；测速后直接显示指定数量的结果，为 0 时不显示结果直接退出；(默认 10 个)

-f ip.txt

IP段数据文件；如路径含有空格请加上引号；支持其他 CDN IP段；(默认 ip.txt)

-ip 1.1.1.1,2.2.2.2/24,2606:4700::/32

指定IP段数据；直接通过参数指定要测速的 IP 段数据，英文逗号分隔；(默认 空)

-o result.csv

写入结果文件；如路径含有空格请加上引号；值为空时不写入文件 [-o “”]；(默认 result.csv)

-dd

禁用下载测速；禁用后测速结果会按延迟排序 (默认按下载速度排序)；(默认 启用)

-allip

测速全部的IP；对 IP 段中的每个 IP (仅支持 IPv4) 进行测速；(默认 每个 /24 段随机测速一个 IP)

-v

打印程序版本 + 检查版本更新

-h

打印帮助说明

## 七、把得到的反代CF的IP和Cf的IP填到对应的位置

## 八、在ip.gs网站查看ip位置，并测速。发现IP固定了在某一个地区，而且速度可跑满你的带宽！


