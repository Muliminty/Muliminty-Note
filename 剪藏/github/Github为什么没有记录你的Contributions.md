---
link: https://zhuanlan.zhihu.com/p/20490947
title: Github为什么没有记录你的Contributions
description: 最近在给同学看我的github时，突然发现我的Contributions Graph上一篇空白居然只有两三个小绿块，因为自己平时在公司工作的记录会显示在自己的Contribution Graph上，所以一直没发现个人repo的commit记录都没有被…
keywords: Git,GitHub,开源社区
author: 泽明Web手艺人
date: 2016-01-15T02:49:00.000Z
publisher: 知乎专栏
stats: paragraph=25 sentences=6, words=117
---
> 最近在给同学看我的github时，突然发现我的Contributions Graph上一篇空白居然只有两三个小绿块，因为自己平时在公司工作的记录会显示在自己的Contribution Graph上，所以一直没发现个人repo的commit记录都没有被记录，于是外事不决问Google，发现原来是因为git初始化设定时没有设定正确的用户名和邮箱（主要是邮箱），具体可以参考Github官方写的help文档

## 为什么你的 Contributions 没有在你的 Profile 里显示？

那么问题来了，什么是Contributions呢，Github官网上有这么一句话：

> Your profile contributions graph is a record of contributions you've made to GitHub repositories. Contributions are only counted if they meet certain criteria. In some cases, we may need to rebuild your graph in order for contributions to appear.

你的个人简介中的贡献图记录的是你给Github上的仓库的贡献。它仅仅只记录某些符合标准的commits。在某些情况下，我们需要重新建立你的贡献图以便让所有的贡献都显示出来。

## 什么样的贡献才会被Github统计?

* 这个操作是在一年之内
* 这个操作是针对一个独立的仓库，不能是fork

当你的commits满足以下条件时，它才会被展示出来：

* 一年之内提交的commits
* commits使用的email地址是与你的Github账号相关联的
* 这些commits是在一个独立的仓库而不是fork仓库
* 这些commits是在：
  - 在默认分支上（通常是master）
  - 在gh-pages分支(包含[Project Pages sites](https://link.zhihu.com/?target=https%3A//help.github.com/articles/user-organization-and-project-pages/%23project-pages) 的仓库)

此外，至少满足下面条件中的一个（主要针对你Commit的仓库不是你创建的）：

* 你是这个仓库的协作者，或者是这个版本库的拥有组织中的一员
* 你fork过这个仓库
* 你对这个仓库发起过pull request或者issue
* 你对这个仓库标记了Star

> **注意：**私有库的贡献仅仅对私有库成员显示

Contributions未被Github计入的几个常见原因

* 进行Commits的用户没有被关联到你的Github帐号中。
* 不是在这个版本库的默认分支进行的Commit。
* 这个仓库是一个Fork仓库，而不是独立仓库。

## 如何排查

你可以在你的本地repo里用git log命令查看commit记录上的个人邮箱是否正确，像我就是因为之前切换到Mac平台开发之后用户名没有配置，所以我之后的commit记录上的邮箱一直是Leo@Leo-MacBook-Pro.local，所以Github就会认为这些commits都不是你提交的！

## 补救措施

然而这也并不是没有补救办法的，Github官网上就有给出详细的补救过程，英语好的同学请自行移步 [Changing author info](https://link.zhihu.com/?target=https%3A//help.github.com/articles/changing-author-info/)，下面是我翻译自Github Help的简要步骤：

为改变已经存在的 commits 的用户名和/或邮箱地址，你必须重写你 Git repo 的整个历史。

> **警告：** 这种行为对你的 repo 的历史具有破坏性。如果你的 repo 是与他人协同工作的，重写已发布的历史是一种不好的习惯。仅限紧急情况执行该操作。 使用脚本改变你 repo 的 Git 历史 我们写了一段能把 commit 作者旧的邮箱地址修改为正确用户名和邮箱的脚本。

使用脚本来改变某个repo的Git历史

我们已经创建了一个脚本，使用正确的姓名和电子邮件地址提交后，你以前提交的所有的commits中的作者信息及提交者字段中的旧的用户名和邮箱地址都将被更正

> **注意：** 执行这段脚本会重写 repo 所有协作者的历史。完成以下操作后，任何 fork 或 clone 的人必须获取重写后的历史并把所有本地修改 rebase 入重写后的历史中。 在执行这段脚本前，你需要准备的信息：

## 如何正确设置你的 git 个人信息

接下来全局设置好你的正确信息，以后就放心的用Github进行版本管理吧 ^_^


![](img/md-2023-04-11-14-39-56.png)