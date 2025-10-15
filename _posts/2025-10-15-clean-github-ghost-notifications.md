---
layout: post
title: 清除 GitHub 上的幽灵通知
categories: [GitHub]
description: 清理 GitHub 幽灵通知的一种方法。
keywords: GitHub, 通知, 幽灵通知, 清理
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

最近我的 GitHub 页面右上角一直有个小蓝点，就像这样：

![](/images/posts/github/github-ghost-notifications.png)

这是有未读通知的指示，但点进去却什么也看不到。

![](/images/posts/github/github-ghost-notifications-empty-list.png)

这种「幽灵通知」已经干扰了我的正常使用体验。这天实在忍无可忍，正打算给 GitHub 提交一个工单时，在官方开设的讨论区里发现了一个讨论贴，我在里面找到了有效的临时解决办法，特此记录下来以备后用。

讨论贴链接：[https://github.com/orgs/community/discussions/6874][1]

## 方案一

我使用的是讨论里提到的 [利用浏览器开发者工具的解决方案][4]。

1. 在浏览器打开通知列表页面，点击左侧标记有数字的 Filters 或者 Repositories，比如我上文贴的图里的 `Participating`、`Mentioned`，或者 `outcaster552/gitcoinpromosender`、`gitcionoda/org`、`yycombinator/-co`、`paradigm-ventures/paradigm` 等等。

2. 打开浏览器的开发者工具（F12），切换到 Console 标签页，粘贴以下代码并回车执行：

    ```js
    document.querySelector('.js-notifications-mark-all-actions').removeAttribute('hidden');
    document.querySelector('.js-notifications-mark-all-actions form[action="/notifications/beta/archive"] button').removeAttribute('disabled');
    ```

3. 这时页面上会出现一个 `Done` 按钮，点击它即可清除对应的通知。


## 方案二

如果以上办法没有解决问题，还可以试一下贴子里 [被标记为答案的回复][2] 是一个借助 curl 命令的解决方案。

```sh
curl -X PUT
    -H "Accept: application/vnd.github.v3+json" \
    -H "Authorization: token $TOKEN" \
     https://api.github.com/notifications \
    -d '{"last_read_at":"2025-10-15T10:00:00Z"}'
```

其中 `$TOKEN` 需要替换成你自己的 GitHub 个人访问令牌（Personal Access Token），可以在 [https://github.com/settings/tokens/new][3] 创建，注意 Select scopes 里需要勾选 `notifications`。命令里的 `last_read_at` 字段的值可以按需修改为当前时间。

## 结语

这种幽灵通知，看情况应该来自于某些居心不良的开发者，在他们的仓库里恶意 at 大量的用户来引流，然后这些用户就会收到通知。但如果这些仓库后来因为违规被删除，那么这些通知就会变成幽灵通知，无法被正常清除。

看讨论的时间线，这个问题已经存在至少四年了，GitHub 官方似乎并没有打算修复它。希望本文能帮到和我有同样困扰的朋友。

[1]: https://github.com/orgs/community/discussions/6874
[2]: https://github.com/orgs/community/discussions/6874#discussioncomment-2859125
[3]: https://github.com/settings/tokens/new
[4]: https://github.com/orgs/community/discussions/6874?sort=top#discussioncomment-14507162