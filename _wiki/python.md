---
layout: wiki
title: Python
cate1: Programming Language
cate2: 
description: Python 常用模块及资源记录。
keywords: Python
---

## 模块

### requests

优雅简单的 HTTP 模块。

### BeautifulSoup

很好用的 HTML/XML 解析器。

### json

JSON 编码解码器。

应用举例：

* 格式化 JSON 文件

  ```sh
  python -m json.tool src.json > dst.json
  ```

  在 Vim 里格式化 JSON：

  ```sh
  :%!python -m json.tool
  ```

### CGIHTTPServer

简单实用的 HTTP 服务器。

应用举例：

* 运行一个简易的 HTTP 服务器

  ```sh
  python -m CGIHTTPServer 80
  ```

### base64

方便地进行 base64 编解码的模块。

应用举例：

* 解码 base64

  ```sh
  echo aGVsbG93b3JsZA== | python -m base64 -d
  ```

  则能看到输出

  ```sh
  helloworld
  ```

## 问题解决

### Your PYTHONPATH points to a site-packages dir

报错信息：

```
~/github/hs-airdrop$ npm install

> bcrypto@5.0.3 install /Users/username/github/hs-airdrop/node_modules/bcrypto
> node-gyp rebuild

Your PYTHONPATH points to a site-packages dir for Python 3.x but you are running Python 2.x!
     PYTHONPATH is currently: "/usr/local/lib/node_modules/npm/node_modules/node-gyp/gyp/pylib"
     You should `unset PYTHONPATH` to fix this.
gyp ERR! configure error
gyp ERR! stack Error: `gyp` failed with exit code: 1
gyp ERR! stack     at ChildProcess.onCpExit (/usr/local/lib/node_modules/npm/node_modules/node-gyp/lib/configure.js:351:16)
gyp ERR! stack     at ChildProcess.emit (events.js:210:5)
gyp ERR! stack     at Process.ChildProcess._handle.onexit (internal/child_process.js:272:12)
gyp ERR! System Darwin 19.3.0
gyp ERR! command "/usr/local/Cellar/node/12.12.0/bin/node" "/usr/local/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js" "rebuild"
gyp ERR! cwd /Users/username/github/hs-airdrop/node_modules/bcrypto
gyp ERR! node -v v12.12.0
gyp ERR! node-gyp -v v5.0.5
gyp ERR! not ok
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! bcrypto@5.0.3 install: `node-gyp rebuild`
npm ERR! Exit status 1
npm ERR!
npm ERR! Failed at the bcrypto@5.0.3 install script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/username/.npm/_logs/2020-02-19T14_14_34_524Z-debug.log
```

解决方法：

删除 /usr/local/lib/python3.7/site-packages/ 文件夹下的 sitecustomize.pyc，将 sitecustomize.py 文件重名为 sitecustomize.py~，安装成功之后再改回来。
