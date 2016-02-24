---
layout: wiki
title: Git
categories: Git
description: Git 常用操作记录。
keywords: Git, 版本控制
---

### 快捷键

| 功能                      | 命令                      |
|:--------------------------|:--------------------------|
| 添加文件/更改到暂存区     | git add filename          |
| 添加所有文件/更改到暂存区 | git add .                 |
| 提交                      | git commit -m msg         |
| 从远程仓库拉取最新代码    | git pull origin master    |
| 推送到远程仓库            | git push origin master    |
| 查看配置信息              | git config --list         |
| 查看文件列表              | git ls-files              |
| 比较工作区和暂存区        | git diff                  |
| 比较暂存区和版本库        | git diff --cached         |
| 比较工作区和版本库        | git diff HEAD             |
| 从暂存区移除文件          | git reset HEAD filename   |
| 查看本地远程仓库配置      | git remote -v             |
| 回滚                      | git reset --hard 提交SHA  |
| 强制推送到远程仓库        | git push -f origin master |
| 修改上次 commit           | git commit --amend        |
| 推送 tags 到远程仓库      | git push --tags           |
| 推送单个 tag 到远程仓库   | git push origin [tagname] |

### Q&A

1. 如何解决gitk中文乱码，git ls-files 中文文件名乱码问题？

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

2. 如何处理本地有更改需要从服务器合入新代码的情况？

   ```
   git stash
   git pull
   git stash pop
   ```

3. 如何合并 fork 的仓库的上游更新？

   ```
   git remote add upstream https://upstream-repo-url
   git fetch upstream
   git merge upstream/master
   ```

4. 如何通过 TortoiseSVN 带的 TortoiseMerge.exe 处理 git 产生的 conflict？
   * 将 TortoiseMerge.exe 所在路径添加到 `path` 环境变量。
   * 运行命令 `git config --global merge.tool tortoisemerge` 将 TortoiseMerge.exe 设置为默认的 merge tool。
   * 在产生 conflict 的目录运行 `git mergetool`，TortoiseMerge.exe 会跳出来供你 resolve conflict。

     > 也可以运行 `git mergetool -t vimdiff` 使用 `-t` 参数临时指定一个想要使用的 merge tool。

5. 不想跟踪的文件已经被提交了，如何不再跟踪而保留本地文件？

   `git rm --cached /path/to/file`，然后正常 add 和 commit 即可。

6. 如何不建立一个没有 parent 的 branch？

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

7. submodule 的常用命令

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

   **删除 submodule**

   在 .gitmodules 中删除对应 submodule 的信息，然后使用如下命令删除子模块所有文件：

   ```
   git rm --cached Catch
   ```

   **clone 仓库时拉取 submodule**

   ```
   git submodule update --init --recursive
   ```

8. 删除远程 tag

   ```git
   git tag -d v0.0.9
   git push origin :refs/tags/v0.0.9
   ```
