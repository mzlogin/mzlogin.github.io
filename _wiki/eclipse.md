---
layout: wiki
title: Eclipse
cate1: Android
cate2: Tools
description: Eclipse 常用快捷键和操作总结
keywords: Eclipse
---

### 快捷键

C --> Ctrl

S --> Shift

A --> Alt

| 功能               | 快捷键      |
|:-------------------|:------------|
| 显示所有快捷键     | C-S-l       |
| 开/关注释          | C-/         |
| 显示 outline       | C-o         |
| 当前打开的文件列表 | C-e         |
| 快速查找打开文件   | C-S-r       |
| 查找               | C-h         |
| 查找后跳到下一处   | C-.         |
| Undo               | C-z         |
| Redo               | C-y         |
| 跳到指定行         | C-l         |
| 自动补全           | A-/         |
| 自动解决导入包问题 | C-S-o       |
| 返回               | A-Left      |
| 反返回             | A-Right     |
| 步进               | F5          |
| 单步               | F6          |
| 执行到返回         | F7          |
| 继续执行           | F8          |
| 删除当前行         | C-d         |
| 删除前一个词       | C-Backspace |
| 删除后一个词       | C-Delete    |
| 缩进               | Tab         |
| 减少缩进           | S-Tab       |
| 在下面新起一行     | S-Enter     |
| 在上面新起一行     | C-S-Enter   |

### Q&A

1. 如何解决 Mac OS X 下安装的是 Java 1.8，运行 Eclipse 时提示「您需要安装旧 Java SE 6 运行环境才能打开「Eclipse.app」。」的问题？

   ![](/images/wiki/eclipse-need-java6.png)

   更改 /Library/Java/JavaVirtualMachines/jdk1.8.0_45.jdk/Contents/Info.plist 文件里的 JVMCapabilities 段如下（默认只有 `CommandLine`）：

   ```
    <key>JVMCapabilities</key>
               <array>
                       <string>JNI</string>
                       <string>BundledApp</string>
                       <string>WebStart</string>
                       <string>Applets</string>
                       <string>CommandLine</string>
               </array>
   ```

   然后重启电脑。

   没有找到为何这样改的解释，按名称猜想应该是说在这几种环境下启动 Java 具有跨版本的兼容性吧。
