---
layout: post
title: TypeScript+Nodejs+Express 构建前端调试的 Web 服务器
categories: 前端
description: 本文将简述如何使用 vscode 来搭建一套 TypeScript 的开发环境，其中我们会使用 Express 这套灵活的 Web 应用开发框架来提高我们的编码效率，另外我们还会增加 Nodemon 这个程序来自动监控你源代码的改变并自动重新启动服务器。
keywords: Typescript, Nodejs, Express
---

## 1 内容介绍

本文将简述如何使用 [`vscode [Visual Studio Code]`](https://code.visualstudio.com/) 开发工具来搭建一套 [`TypeScript`](http://www.typescriptlang.org/) 的开发环境，其中我们会使用 [`Express`](http://www.expressjs.com.cn/) 这套灵活的 Web 应用开发框架来提高我们的编码效率，另外我们还会增加 [`nodemon`](https://nodemon.io/) 这个程序来自动监控你源代码的改变并自动重新启动服务器。写这篇文章的目的是 **落地留痕**，同时也希望能对一些刚入门的小伙伴有一定的参考价值。

阅读本文的前置知识是需要你对 Webpack 和 Typescript 语法有一定的了解，阅读本文，你将学会：

* 使用 Nodejs 创建 Web 服务器
* 使用 Express 创建 Restful 的 Http 服务
* 使用 Nodemon 监控服务器文件的变化并自动重启服务器

---

## 2 构建你的 Web 服务器

1.首先创建一个 Server 文件夹并使用 NPM 命令进行初始化，我们使用 Typescript 语言来开发我们的服务器

```shell
npm init -y
```

2.首先我们需要引入 Node 的类型定义文件，使用类型定义文件的作用是使你能在 Typescript 中使用已有的 Javascript 的库

```shell
npm i @types/node --save
```

3.由于 Nodejs 本身是不能直接识别 Typescript，所以我们需要将 Typescript 编译成 Javascript，所以创建下面的 Tsconfig.json 配置文件，用于告诉编译器如何将 Typescript 编译成 Javascript，详细配置请参考 [typescript 官方文档](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html)：

```json
{
    "compilerOptions": {
        "target": "es5",
        "module": "commonjs",
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true,
        "outDir": "build",
        "lib": [
            "es6"
        ]
    },
    "exclude": [
        "node_modules"
    ]
}
```

4.我们需要告知编译器（vscode）使用这个配置文件来编译我们的 Typescript，使用快捷键 `ctrl+shift+b` 生成解决方案：![](/image/vscode生成tsconfig解决方案.png)

5.到这里我们的开发环境就配置好了，现在让我们开始编写我们的服务器文件，先创建一个 `server/hello_server.ts` 文件，这个服务器非常简单，只是接收一个 Http 请求并响应一段文本信息：

```javascript
import * as http from 'http';

const server = http.createServer((req,resp) => {
    resp.end("Hello Node!");
});

server.listen(8000);
```

6.再次执行 `ctrl+shift+b` 对该文件进行编译，首次执行会提升缺少 `.vscode/tasks.json` 文件，创建它并继续执行 `ctrl+shift+b`，此时根据 `tsconfig.json` 的配置，会在 Build 目录下生成编译后的 Javascript 代码：

```javascript
// build/hello_server.js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var server = http.createServer(function (req, resp) {
    resp.end("Hello Node!");
});
server.listen(8000);
```

7.下面我们可以通过这个文件来启动我们的 Node 服务器了，执行以下指令启动服务器，然后访问 `localhost:8000`：

```shell
node build/hello_server.js
```

![](/image/8080端口.png)

---

## 3 使用 Express 框架简化开发

Express 是基于 [Node.js](http://nodejs.org) 平台，快速、开放、极简的 Web 开发框架，使用它的理由很简单，我们使用原始的 Node 进行开发，需要手动处理很多问题，比如读取文件，路由请求，处理各种不同的请求类型。而使用 Express可以帮助你更快的处理这些事情。所以你应该到它的[官网](http://www.expressjs.com.cn/)学习它。

1.首先我们安装 Express 框架：

```shell
npm install express --save
```

2.然后我们引入 Express 的类型定义文件：

```shell
npm install @types/express --save
```

3.现在我们可以用 Typescript 的代码来使用 Express 的 API 了，我们创建一个新的服务器配置文件 `server/auction_server.ts` ：

```javascript
import * as express from 'express';

// 用于声明服务器端所能提供的 http 服务
const app = express(); 

// 声明一个处理 get 请求的服务
app.get('/', (req, resp) => {
    resp.send("Hello Express");
});

app.get("/products", (req, resp) => {
    resp.send("接收到商品查询请求");
});

const server = app.listen(8000, "localhost", () => {
    console.log("服务器已启动, 地址是：http://localhost:8000");
});
```

4.现在我们执行 `ctrl+shift+b`，然后通过 `auction_server.js` 文件启动 Node 服务器：

```shell
node build/auction_server.js
```

![](/image/接收到商品查询请求.png)

---

## 4 使用 Nodemon 工具自动重新加载服务器

我们已经学会构建一个 Node 服务器了，但是它非常的不方便，当我们修改了项目代码后，服务器不会自动重启。这样就非常的烦人，很浪费时间，于是有大神开发了自动重启的工具 Nodemon，下面我们来安装它。

1.首先我们安装 Nodemon：

```shell
npm install -g nodemon
```

2.执行以下命令来启动服务器：

```shell
nodemon build/auction_server.js
```

---

其实还有更快捷的方法可以直接自动编译同时自动重新加载服务器，但貌似由于 Window 平台 Cmd 命令权限问题我无法成功，如果你有兴趣，请参考这篇文章：[使用vscode 搭建 typescript 的nodejs 自动编译自动启动服务](http://blog.csdn.net/huangyong1991/article/details/78531998)

