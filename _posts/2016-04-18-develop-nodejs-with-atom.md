---
layout: post
title: 配置 Node.js 开发环境——使用 Atom
categories: Node.js
description: 如何将 Atom 配置成为好用的 Node.js 开发环境。
keywords: Atom, Node.js, ternjs
---

Node.js 的开发环境选择很多，比如 WebStrom/Visual Studio Code/Atom/HBuilder，还有万能的 Vim/Emacs 等等。

根据我个人的试用，WebStorm 应该是配置起来最省心，用起来最顺手的选择，而且有 Android Studio 和 PyCharm 的使用经验上手毫无障碍。但一来 WebStorm 价格不菲，二来最近刚刚被 Atom 圈粉，而 Visual Studio Code 和 Atom 又是这些编辑器里面与 Node.js 渊源最深的，所以最终决定最近在学习 Node.js 以及写一些练手项目时以使用 Atom 为主，Vim 为辅。

## 安装 Atom 插件

主要是它们：

* **atom-ternjs** 用于 Javascript 和 Node.js 的自动补全
* **script** 用于一键运行程序

### 自动补全插件

Atom 上的 Javascript 自动补全主要依赖 atom-ternjs 插件，貌似没有什么其它更好的选择。（配合 autocomplete-plus 插件使用，Atom 默认已经安装。）

安装方法与安装其它插件无异，主要有三种选择：

1. 图形界面。

   在 Atom 的 Settings > Install 里搜索找到 atom-ternjs 并安装。

   这种方法在国内需要科学上网。

2. 命令行。

   ```sh
   apm install atom-ternjs
   ```

   这种方法在国内也需要科学上网。

3. 本地安装。

   ```sh
   cd ~/.atom/packages
   git clone https://github.com/tststs/atom-ternjs.git
   cd atom-ternjs
   npm install
   ```

### 一键运行插件

安装 script 插件，然后有两种方法可以一键运行/结束程序了：

1. Packages > Script > Run Script/Stop Script。

2. 快捷键。

   |      | Mac                          | Windows                                       |
   |------|------------------------------|-----------------------------------------------|
   | 运行 | <kbd>cmd</kbd>+<kbd>i</kbd>  | <kbd>ctrl</kbd>+<kbd>shift</kbd>+<kbd>b</kbd> |
   | 结束 | <kbd>ctrl</kbd>+<kbd>c</kbd> | <kbd>ctrl</kbd>+<kbd>q</kbd>                  |

## 配置项目

atom-ternjs 插件对项目配置做了可视化，可以通过菜单来操作。

1. File > Open 打开 Node.js 项目文件夹。

2. Package > Atom Ternjs > Configure project

   ![](/images/posts/node/ternjs-configure-project.jpeg)

   Save & Restart server 之后会在项目根目录生成 .tern-project 文件，该配置文件里常用字段：

   | 字段名      | 含义                                              |
   |-------------|---------------------------------------------------|
   | ecmaVersion | 选择 ECMAScript 版本                              |
   | libs        | browser 表示原生 js 补全，jquery 代表 jQuery 补全 |
   | loadEagerly | 指定加载解析的 js 文件                            |
   | dontLoad    | 排除加载的文件                                    |
   | plugins     | ternjs 使用的插件，配置的扩展补全的库等

   目前插件的配置页面暂不支持 plugins 部分配置，需要手动配置。

   比如一份最简单的 .tern-project 文件的示例：

   ```javascript
   {
     "ecmaVersion": 6,
     "libs": [],
     "loadEagerly": [
       "**/*.js"
     ],
     "plugins": {
       "node": {},
       "node-express": {}
     }
   }
   ```

   它代表使用 ECMAScript 6，递归加载项目文件夹下所有的 js 文件（包括 node\_modules），使用 ternjs 的 node 插件用于 Node.js 核心库补全，node-express 插件用于 express 补全。

   这部分推荐详细阅读一下 [atom-ternjs][] 的 README，会更清楚怎么回事。

3. 创建/修改 .tern-project 文件后，执行 Packages > Atom Ternjs > Restart server。

   进行完这一步以后，顺利的话你应该已经能愉快地看到原生 js 和 Node.js 的自动补全了；不顺利的话，看看下面的 Q & A 一节，有我遇到的问题的记录。

最终效果：

![](/images/posts/node/ternjs-auto-completion.jpeg)

## Q & A

1. 在 Mac 下按步骤官方的 README 操作后自动提示出不来？

   我在 Windows 下按官方指南配置 atom-ternjs 倒是很顺利，按默认步骤操作完，然后在 plugins 一节添加 node 就一切 OK 了，但在 Mac 下貌似不配置 loadEagerly 为 `**/*.js` 智能提示出不来。

   另外就是 .tern-project 文件放置的位置，最好与 package.json 放在同级目录。

2. 安装 atom-ternjs 总是失败。

   科学上网。

3. Vim 也有 [tern\_for\_vim][]，作为主力编辑器，为何不使用它来写 Node.js 呢？

   别提了，如果没有把 .tern-project 文件配置好，打一个 `.` 之后能卡五秒，严重拉低 Vim 编辑速度。

   不过 tern\_for\_vim 也有一个好处，那就是不用像 atom-ternjs 这样每次改完配置后都要手动 Restart server。

## 后话

ternjs 功能强大，包括：

* 自动补全方法和变量
* 查找引用/定义
* 显示方法详情，包括方法签名和文档等
* 简单的重构

把它用好了还是能不错地提升开发效率的。

[atom-ternjs]: https://github.com/tststs/atom-ternjs
[tern_for_vim]: https://github.com/ternjs/tern_for_vim
