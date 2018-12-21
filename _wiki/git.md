---
layout: wiki
title: Git
categories: Git
description: Git 常用操作记录。
keywords: Git, 版本控制
---

## 常用命令

| 功能                      | 命令                                  |
|:--------------------------|:--------------------------------------|
| 添加文件/更改到暂存区     | git add filename                      |
| 添加所有文件/更改到暂存区 | git add .                             |
| 提交                      | git commit -m msg                     |
| 从远程仓库拉取最新代码    | git pull origin master                |
| 推送到远程仓库            | git push origin master                |
| 查看配置信息              | git config --list                     |
| 查看文件列表              | git ls-files                          |
| 比较工作区和暂存区        | git diff                              |
| 比较暂存区和版本库        | git diff --cached                     |
| 比较工作区和版本库        | git diff HEAD                         |
| 从暂存区移除文件          | git reset HEAD filename               |
| 查看本地远程仓库配置      | git remote -v                         |
| 回滚                      | git reset --hard 提交SHA              |
| 强制推送到远程仓库        | git push -f origin master             |
| 修改上次 commit           | git commit --amend                    |
| 推送 tags 到远程仓库      | git push --tags                       |
| 推送单个 tag 到远程仓库   | git push origin [tagname]             |
| 删除远程分支              | git push origin --delete [branchName] |
| 远程空分支（等同于删除）  | git push origin :[branchName]         |
| 查看所有分支历史          | gitk --all                            |
| 按日期排序显示历史        | gitk --date-order                     |

## Q&A

### 如何解决gitk中文乱码，git ls-files 中文文件名乱码问题？

在~/.gitconfig中添加如下内容

```
[core]
   quotepath = false
[gui]
   encoding = utf-8
[i18n]
   commitencoding = utf-8
[svn]
   pathnameencoding = utf-8
```

参考 <http://zengrong.net/post/1249.htm>

### 如何处理本地有更改需要从服务器合入新代码的情况？

```
git stash
git pull
git stash pop
```

### stash

查看 stash 列表：

```
git stash list
```

查看某一次 stash 的改动文件列表（不传最后一个参数默认显示最近一次）：

```
git stash show stash@{0}
```

以 patch 方式显示改动内容

```
git stash show -p stash@{0}
```

### 如何合并 fork 的仓库的上游更新？

```
git remote add upstream https://upstream-repo-url
git fetch upstream
git merge upstream/master
```

### 如何通过 TortoiseSVN 带的 TortoiseMerge.exe 处理 git 产生的 conflict？
* 将 TortoiseMerge.exe 所在路径添加到 `path` 环境变量。
* 运行命令 `git config --global merge.tool tortoisemerge` 将 TortoiseMerge.exe 设置为默认的 merge tool。
* 在产生 conflict 的目录运行 `git mergetool`，TortoiseMerge.exe 会跳出来供你 resolve conflict。

  > 也可以运行 `git mergetool -t vimdiff` 使用 `-t` 参数临时指定一个想要使用的 merge tool。

### 不想跟踪的文件已经被提交了，如何不再跟踪而保留本地文件？

`git rm --cached /path/to/file`，然后正常 add 和 commit 即可。

### 如何不建立一个没有 parent 的 branch？

```
git checkout --orphan newbranch
```

此时 `git branch` 是不会显示该 branch 的，直到你做完更改首次 commit。比如你可能会想建立一个空的 gh-pages branch，那么：

```
git checkout --orphan gh-pages
git rm -rf .
// add your gh-pages branch files
git add .
git commit -m "init commit"
```

### submodule 的常用命令

**添加 submodule**

```
git submodule add git@github.com:philsquared/Catch.git Catch
```

这会在仓库根目录下生成如下 .gitmodules 文件并 clone 该 submodule 到本地。

```
[submodule "Catch"]
path = Catch
url = git@github.com:philsquared/Catch.git
```

**更新 submodule**

```
git submodule update
```

当 submodule 的 remote 有更新的时候，需要

```
git submodule update --remote
```

**删除 submodule**

在 .gitmodules 中删除对应 submodule 的信息，然后使用如下命令删除子模块所有文件：

```
git rm --cached Catch
```

**clone 仓库时拉取 submodule**

```
git submodule update --init --recursive
```

### 删除远程 tag

```
git tag -d v0.0.9
git push origin :refs/tags/v0.0.9
```

或

```
git push origin --delete tag [tagname]
```

### 基于某次 commit 创建 tag

```
git tag <tag name> <commit id>
```

```
git tag v1.0.0 ef0120
```

### 清除未跟踪文件

```
git clean
```

可选项：

| 选项                    | 含义                             |
|-------------------------|----------------------------------|
| -q, --quiet             | 不显示删除文件名称               |
| -n, --dry-run           | 试运行                           |
| -f, --force             | 强制删除                         |
| -i, --interactive       | 交互式删除                       |
| -d                      | 删除文件夹                       |
| -e, --exclude <pattern> | 忽略符合 <pattern> 的文件        |
| -x                      | 清除包括 .gitignore 里忽略的文件 |
| -X                      | 只清除 .gitignore 里忽略的文件   |

### 忽略文件属性更改

因为临时需求对某个文件 chmod 了一下，结果这个就被记为了更改，有时候这是想要的，有时候这会造成困扰。

```
git config --global core.filemode false
```

参考：[How do I make Git ignore file mode (chmod) changes?](http://stackoverflow.com/questions/1580596/how-do-i-make-git-ignore-file-mode-chmod-changes)

### patch

将未添加到暂存区的更改生成 patch 文件：

```
git diff > demo.patch
```

将已添加到暂存区的更改生成 patch 文件：

```
git diff --cached > demo.patch
```

合并上面两条命令生成的 patch 文件包含的更改：

```
git apply demo.patch
```

将从 HEAD 之前的 3 次 commit 生成 3 个 patch 文件：

（HEAD 可以换成 sha1 码）

```
git format-patch -3 HEAD
```

生成 af8e2 与 eaf8e 之间的 commits 的 patch 文件：

（注意 af8e2 比 eaf8e 早）

```
git format-patch af8e2..eaf8e
```

合并 format-patch 命令生成的 patch 文件：

```
git am 0001-Update.patch
```

与 `git apply` 不同，这会直接 add 和 commit。

### 只下载最新代码

```
git clone --depth 1 git://xxxxxx
```

这样 clone 出来的仓库会是一个 shallow 的状态，要让它变成一个完整的版本：

```
git fetch --unshallow
```

或

```
git pull --unshallow
```

### 基于某次 commit 创建分支

```sh
git checkout -b test 5234ab
```

表示以 commit hash 为 `5234ab` 的代码为基础创建分支 `test`。

### 恢复单个文件到指定版本

```sh
git reset 5234ab MainActivity.java
```

恢复 MainActivity.java 文件到 commit hash 为 `5234ab` 时的状态。

### 设置全局 hooks

```sh
git config --global core.hooksPath C:/Users/mazhuang/git-hooks
```

然后把对应的 hooks 文件放在最后一个参数指定的目录即可。

比如想要设置在 commit 之前如果检测到没有从服务器同步则不允许 commit，那在以上目录下建立文件 pre-commit，内容如下：

```sh
#!/bin/sh

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

git fetch origin $CURRENT_BRANCH

HEAD=$(git rev-parse HEAD)
FETCH_HEAD=$(git rev-parse FETCH_HEAD)

if [ "$FETCH_HEAD" = "$HEAD" ];
then
    echo "Pre-commit check passed"
    exit 0
fi

echo "Error: you need to update from remote first"

exit 1
```

### 查看某次 commit 的修改内容

```sh
git show <commit-hash-id>
```

### 查看某个文件的修改历史

```sh
git log -p <filename>
```

### 查看最近两次的修改内容

```sh
git log -p -2
```

### 应用已存在的某次更改 / merge 某一个 commit

```sh
git cherry-pick <commit-hash-id>
```

cherry-pick 有更多详细的用法，可以参见帮助文档。

### 命令行自动补全

在 shell 里加载 git-completion 系列脚本，详见 <https://github.com/git/git/tree/master/contrib/completion>

### 文件每一行变更明细

```sh
git blame <filename>
```

### 找回曾经的历史

```sh
git reflog
```

列出 HEAD 曾指向过的一系列 commit，它们只存在于本机，不是版本仓库的一部分。

还有：

```sh
git fsck
```

### 记住 http(s) 方式的用户名密码

在有些情况下无法使用 git 协议，比如公司的 git 服务器设置了 IP 白名单，只能在公司内网使用 ssh，那么在外面就只能使用 http(s) 上传下载源码了，但每次都手动输入用户名/密码特别惨，于是乎就记住吧。

设置记住密码（默认 15 分钟）：

```sh
git config --global credential.helper cache
```

自定义记住的时间（如下面是一小时）：

```sh
git config credential.helper 'cache --timeout=3600'
```

长期存储密码：

```sh
git config --global credential.helper store
```

### git commit 使用 vim 编辑 commit message 中文乱码

这个问题在 Windows 下出现了，没找到能完美解决的办法，一种方法是在 vim 打开后输入：

```sh
:set termencoding=GBK
```

这就有点太麻烦了，折衷的方法是改为使用 gVim 或其它你喜欢的编辑器来编辑 commit message：

```sh
git config --global core.editor gvim
```

参考：
* [How do I make Git use the editor of my choice for commits?](https://stackoverflow.com/questions/2596805/how-do-i-make-git-use-the-editor-of-my-choice-for-commits)
* [转：git windows中文 乱码问题解决汇总](http://www.cnblogs.com/youxin/p/3227961.html)

另外在升级 Vim 到 8.1 之后，由于 PATH 环境变量里加的还是 vim80 文件夹，导致 git commit 时提示：

```
error: cannot spawn gvim: No such file or directory
error: unable to start editor 'gvim'
Please supply the message using either -m or -F option.
```

使用 `which gvim` 查看：

```
$ which gvim
/usr/bin/which: no gvim in xxxxxxx
```

将 PATH 里添加的 vim80 路径改为 vim81 后解决。

### git log 中文乱码

只在 Windows 下遇到。

```sh
git config --global i18n.logoutputencoding gbk
```

编辑 git 安装目录下 etc/profile 文件，在最后添加如下内容：

```
export LESSCHARSET=utf-8
```

参考：[Git for windows 中文乱码解决方案](https://segmentfault.com/a/1190000000578037)

### git diff 中文乱码

只在 Windows 下遇到，目前尚未找到有效办法。

### 统计代码行数

CMD 下直接执行可能失败，可以在右键，Git Bash here 里执行。

#### 统计某人的代码提交量

```sh
git log --author="$(git config --get user.name)" --pretty=tformat: --numstat | gawk '{ add += $1 ; subs += $2 ; loc += $1 - $2 } END { printf "added lines: %s removed lines : %s total lines: %s\n",add,subs,loc }'
```

#### 仓库提交都排名前 5

如果看全部，去掉 head 管道即可。

```sh
git log --pretty='%aN' | sort | uniq -c | sort -k1 -n -r | head -n 5
```

#### 仓库提交者（邮箱）排名前 5

这个统计可能不太准，可能有同名。

```sh
git log --pretty=format:%ae | gawk -- '{ ++c[$0]; } END { for(cc in c) printf "%5d %s\n",c[cc],cc; }' | sort -u -n -r | head -n 5
```

#### 贡献者排名

```sh
git log --pretty='%aN' | sort -u | wc -l
```

#### 提交数统计

```sh
git log --oneline | wc -l
```

参考：[Git代码行统计命令集](http://blog.csdn.net/Dwarven/article/details/46550117)

### 修改文件名时的大小写问题

修改文件名大小写时，默认会被忽略（在 Windows 下是这样），让 git 对大小写敏感的方法：

```sh
git config --global core.ignorecase false
```

或者使用 `git mv oldname newname` 也是可以的。

### 修复 gitk 在 macOS 下显示模糊的问题

gitk 很方便，但是在 Mac 系统下默认显示很模糊，影响体验。

根据网上搜索的结果，解决方法有两种，我采用第一种解决，第二种未尝试。

方法一：

1. 重新启动机器，按 command + R 等 Logo 和进度条出现，会进入 Recovery 模式，选择顶部的实用工具——终端，运行以下命令：

    ```sh
    csrutil disable
    ```

2. 重新启动机器。

3. 编辑 Wish 程序的 plist，启动高分辨率屏支持。

    ```
    sudo gvim /System/Library/Frameworks/Tk.framework/Versions/Current/Resources/Wish.app/Contents/Info.plist
    ```

    在最后的 </dict> 前面加上以下代码

    ```sh
    <key>NSHighResolutionCapable</key>
    <true/>
    ```

4. 更新 Wish.app。

    ```sh
    sudo touch Wish.app
    ```

5. 再次用 1 步骤的方法进入 Recovery 模式，执行 `csrutil enable` 启动对系统文件保护，再重启即可。

参考：[Mac 中解决 gitk 模糊问题](http://roshanca.com/2017/make-gitk-retina-in-mac/)

方法二：

```sh
brew cask install retinizer
open /System/Library/Frameworks/Tk.framework/Versions/Current/Resources/
```

打开 retinizer，将 Wish.app 拖到 retinizer 的界面。

参考：[起底Git-Git基础](http://yanhaijing.com/git/2017/02/09/deep-git-4/)
