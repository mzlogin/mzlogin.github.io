---
layout: post
title: 怎么查询Github仓库所有者的联系方式
categories: GitHub
description: Github仓库所有者的联系方式
keywords: github，inquiry
---

## 怎么查询Github仓库所有者的联系方式

&emsp;&emsp;有的适合由于某种原因需要联系GitHub仓库作者，但这真的不是一件容易的事情。

&emsp;&emsp;有些GitHub的仓库玩家会在自己的作品中留下自己的邮箱或者其他联系方式，有些真的什么都没留下。那怎么知道这些作者的联系方式呢。

&emsp;&emsp;今天我来分享一个查询方式

&emsp;&emsp;使用GitHub提供的GraphQL来查询用户邮箱

&emsp;&emsp;访问GitHub的GraphQL API Explorer,点击右侧的Sign in，使用你的GitHub账号登陆，这样就可以调用Github的API了。

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/6ef26ea5-6f0a-4a57-b051-0331ecc56936)

&emsp;&emsp;登陆后，你下方的GraphQL输入框就可以输入内容了。在其中输入如下代码：
```
{
  repository(name: "grank", owner: "lctt") {
    ref(qualifiedName: "master") {
      target {
        ... on Commit {
          id
          history(first: 5) {
            edges {
              node {
                author {
                  name
                  email
                }
              }
            }
          }
        }
      }
    }
  }
}

```

&emsp;&emsp;并将 name 替换为你要查询的人的 repo 名，owner 改为你需要查询的人的名字，然后点击执行按钮。

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/7d251a6f-4692-4dbd-9edf-30c4abd543cf)

&emsp;&emsp;这样要找的作者名字的Gmail邮箱就查找出来了。

&emsp;&emsp;但有一种方法是无论如何也看不到邮箱的，那就是作者在设置时，将邮箱设置为不可见，那就暂时真的没有办法了。

&emsp;&emsp;我的这个方法可能不是唯一的方法，但对于有需要的用户，可以试试看！
