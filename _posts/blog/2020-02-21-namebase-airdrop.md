---
layout: post
title: GitHub 用户专属福利，实际到账 3K+，Namebase Airdrop
categories: [GitHub]
description: 使用 GitHub 一年以上的用户可以关注一下。
keywords: GitHub, Namebase, Airdrop
---

我经常提醒自己的防骗第一准则：**天上不会掉馅饼**。

冒着被人当骗子的风险，写这样一篇文章，是因为这次是真的领到了馅饼。不过这个馅饼不是随机掉落，是限定了条件定向投放的，满足条件的可以一试，不满足的就不用浪费时间了，可以推荐给身边的 GitHub 用户来碰碰运气。

我的馅饼到账图：

![](/images/blog/airdrop-income.jpeg)

从开始操作到入账历时约一天，花了一两个小时在了解和操作上面。

## 条件

1. 在 2019-02-04 那一周，你的 GitHub 账号有 15 个以上 followers；

2. 保留有当时的 SSH / PGP 私钥；

## 背景简介

详情可查看 <https://www.namebase.io/airdrop>，大意就是说 Handshake Orgnization 从 A16Z 和红杉融资以后，向 GNU、Mozilla 和其它互联网基金会捐赠了 10.2 亿美元，现在他们向 GitHub 上符合条件的开发者赠送约 4662 Handshake 币。

而这些币可以提取到 Namebase 账户，并可以兑换成比特币或美元，最终换成人民币提现。

Handshake Orgnization 可以提供 CA 的分布式替代方案，去中心化的 DNS 以提升互联网安全性，详见 <https://www.namebase.io/blog/meet-handshake-decentralizing-dns-to-improve-the-security-of-the-internet>。建议有兴趣的人除了收馅饼，也关注一下项目，项目方放 Airdrop 是希望更多人能参与并支持他们的项目建设。

## 取馅饼步骤

好了闲话少述，我知道大家最关心的还是怎么领到钱，步骤可以根据 <https://www.namebase.io/airdrop> 讲的来，以下我也简单做个描述，供懒得看英文的朋友参考：

### Step 1. 验证并领取 HNS

1. 打开 <https://www.namebase.io>，点击右上角 Log In，使用 GitHub 账号登录；

2. 打开 <https://www.namebase.io/airdrop>，按它的步骤来，第一步，下载 hs-airdrop 工具：

    ```sh
    git clone https://github.com/handshake-org/hs-airdrop.git
    ```

3. 第二步，安装 hs-airdrop 工具：

    ```sh
    cd hs-airdrop && npm install
    ```

    我在 npm install 时遇到过两个问题，一个是 `Your PYTHONPATH points to a site-packages dir ...`，解决方案参考 <https://mazhuang.org/wiki/python/#your-pythonpath-points-to-a-site-packages-dir>，另一个是 `No Xcode or CLT version detected`，解决方案参考 <https://mazhuang.org/wiki/mac/#no-xcode-or-clt-version-detected>。

4. 第三步，找到你认为有资格的 SSH / PGP 私钥，一般是放在 ~/.ssh 目录下，比如我的是 ~/.ssh/id_rsa；

5. 第四步，点击网页上的 Step 4 的 Click To Show Your Handshake Wallet Address，得到你的 HNS 币钱包 address：

    ![](/images/blog/airdrop-address.jpg)

    然后执行：

    ```sh
    ./bin/hs-airdrop <path to key> <address> <fee>
    ```

    比如我执行的是

    ```sh
    ./bin/hs-airdrop ~/.ssh/id_rsa xxxxxxx 0.01
    ```

    如果是用 GPG key 的，使用命令（不明白含义的可以 ./bin/hs-airdrop --help 查看命令帮助文档）：

    ```sh
    ./bin/hs-airdrop <导出的 .asc/.pgp/.gpg 文件> <gpg-id> <address> -f 0.01
    ```

    这里有几点可以加速命令执行的：

    一、fee 可以设置高一点，比如 10，这会加快确认速度。

    二、可以先把 https://github.com/handshake-org/hs-tree-data clone 到 ~/.hs-tree-data，这样在以上命令执行过程中需要下载的文件就在本地了。

    **注：** 这一步会用到私钥，有很多人担忧这里存在安全隐患，文档上有说明说是用私钥只用于生成加密证明，不会被上传，证明里也不会包含私钥的任何信息，hs-airdrop 的源码是开源的，可以 review 它的代码，或者实在不放心的可以在操作完之后就把用于 GitHub 的密钥都换掉。

6. 第五步，上一步执行成功后，会在最后展示一段 Base64，将它贴到网页里并提交：

    ![](/images/blog/airdrop-base64.jpeg)

    ![](/images/blog/airdrop-submit.jpg)

    如果没有得到 Base64，而是其它提示，有可能是没有资格，也有可能是出错了，可以参考下文末 V2EX 链接里的讨论内容。

7. 正常这时候就能在 <https://www.namebase.io/dashboard> 看到有一笔交易在 Pending 中了：

    ![](/images/blog/airdrop-pending.jpeg)

    **注：** 这一步正常应该是很快变成 Airdrop: waiting for more confirmations，但有的人可能遇到较长时间显示 Airdrop: almost mined... 的情况，有的等一段时间后可以好，有的则一直在这个状态。这种情况知乎网友 Kenkk 问过客服，回复是 Some airdrops were stuck. Please generate a base64 with a new address from these instructions and submit it again，也就是重新生成钱包地址，然后重新执行第五步的命令即可，注意 fee 可以设置大点，比如 10。

### Step 2. 身份验证

![](/images/blog/airdrop-verify.jpeg)

点 namebase 网页如图上所示位置的“验证了”开始验证身份，会要填名字、问是否居住在美国、上传证件照片，可以上传护照、驾驶证、身份证，我用的驾驶证。

网友们说这里校验并不严格，不放心的用网上找的图也可以。

### Step 3. 等待 HNS 入账

要等待的时间不等，我等了十几个小时。

![](/images/blog/airdrop-hns.jpeg)

### Step 4. 提取到 BTC 钱包

点击 namebase 网站菜单的 Buy & Sell -- Sell HNS，完成提现到 BTC 钱包：

![](/images/blog/airdrop-cashout.jpeg)

像我就是以前不接触币圈，没有 BTC 钱包，现去 OKEX 注册了一个，注册链接：<https://www.okex.me/join/1876977>，（链接上包含我的推荐 ID，如果不喜欢，可以去掉）。注册以后在“我的资产”-“充币”里可以获取 BTC 钱包地址。

然后就又要等待一会儿了，约一二十分钟，BTC 到账了。

### Step 5. 提现到银行卡

在 OKEX “我的资产”-“资产划转”里将 BTC 划转到法币账户，然后就可以去“交易”-“法币交易”里按提示操作就行了，需要绑定一张银行卡用作收款，我挂出去不到十秒就被买走了，然后两分钟内银行卡里到账，我确认出币后交易完成。

![](/images/blog/airdrop-done.jpeg)

至此大功告成，按网友们的反馈，按 HNS 换 BTC 行情，实际到手 500 到 1400 刀不等。

### Step 6. 收尾

如果担心信息泄漏的，可以更换 GitHub 密钥、删除 OKEX 上绑定的信息等。

## 相关讨论和记录

- <https://v2ex.com/t/645480>

- <https://shidenggui.com/articles/namebase-airdrop>
