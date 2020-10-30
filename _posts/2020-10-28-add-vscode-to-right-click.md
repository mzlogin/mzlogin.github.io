---
layout: post
title: 给 Mac 添加右键菜单「使用 VSCode 打开」
categories: VSCode
description: 如何在 Mac 下右键文件或文件夹，直接通过菜单项「用 VSCode 打开」。
keywords: VSCode, macOS
---

最终的实现效果是在文件 / 文件夹上右击时，会出现菜单项「用 VSCode 打开」，点击后会启动 Visual Studio Code 打开对应的文件 / 文件夹。

![](/images/posts/mac/open-with-vscode.png)

## 实现步骤

1. 打开「自动操作.app」，就是小机器人图标那个；

    ![](/images/posts/mac/auto-operate.png)

2. <kbd>command + n</kbd> 新建文稿，在「选取文稿类型」里选择「快速操作」；

    ![](/images/posts/mac/quick-operate.png)

3. 按以下步骤操作：

    第五步贴入代码

    ```sh
    for f in "$@"
    do
        open -a "Visual Studio Code" "$f"
    done
    ```

    ![](/images/posts/mac/open-with-vscode-steps.png)

    以上代码片段的大概意思是对于传入的一个或多个参数，都使用 Visual Studio Code 这个 APP 打开（将以下步骤配置完成后，可以分别选中一个、多个文件 / 文件夹，然后右键用 VSCode 打开看看效果）。

4. <kbd>command + s</kbd> 保存为 「用 VSCode 打开」：

    ![](/images/posts/mac/open-with-vscode-rename.png)

5. 好了，现在试试在 Finder 里右键一个文件，就可以直接看到「用 VSCode 打开」菜单，右键一个文件夹，就可以看到「服务」-「用 VSCode 打开」菜单了。

    ![](/images/posts/mac/open-with-vscode-file.png)

愉快地使用 Visual Studio Code 和各种文件、文件夹玩耍吧。

## 编辑

以后如果想修改上面这个快速操作，有两种方法：

1. 可以打开「自动操作.app」，然后「文件」-「打开最近使用」 -「用 VSCode 打开.workflow」；

2. 如果找不到这个操作，可以「文件」-「打开」-个人目录 / 资源库 / Services / 用 VSCode 打开.workflow

    ![](/images/posts/mac/open-with-vscode-open.png)

    如果个人目录下不显示「资源库」，按 <kbd>Command + Shift + .</kbd>。

## 参考

- <https://blog.csdn.net/u013069892/article/details/83147239>
