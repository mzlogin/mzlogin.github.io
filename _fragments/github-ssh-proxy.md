---
layout: fragment
title: 给 GitHub 配置 SSH 代理
tags: [github]
description: 给 GitHub 配置 SSH 代理
keywords: GitHub, SSH, 代理
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

~/.ssh/config 文件中配置代理：

```
Host github.com                                                                                                       │位于分支 master
    Hostname ssh.github.com                                                                                           │您的分支与上游分支 'origin/master' 一致。
    Port 443                                                                                                          │
    User git                                                                                                          │要提交的变更：
    ProxyCommand nc -X 5 -v -x 127.0.0.1:54106 %h %p
```

参考 <https://gist.github.com/chenshengzhi/07e5177b1d97587d5ca0acc0487ad677>