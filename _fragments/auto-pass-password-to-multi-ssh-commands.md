---
layout: fragment
title: 自动传递密码给多个 SSH 命令
tags: [shell]
description: 自动传递密码给多个 SSH 命令
keywords: ssh, shell
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

我有一个场景是需要向同一个服务器建立多个端口映射，但我只想输入一次密码，然后自动传递给后续的多条用于端口映射的 SSH 命令。

最终通过 sshpass 命令实现了这个需求。

```sh
open_tunnel() {
    killall ssh
    echo -n "password: "
    read -s password
    sshpass -p $password ssh -L 6379:172.16.1.15:6379 username@111.222.111.222 -N -f
    sshpass -p $password ssh -L 13306:172.16.1.15:6612 username@111.222.111.222 -N -f
    sshpass -p $password ssh -L 5672:172.16.1.15:5672 username@111.222.111.222 -N -f
    sshpass -p $password ssh -L 15672:172.16.1.15:15672 username@111.222.111.222 -N -f
}
```