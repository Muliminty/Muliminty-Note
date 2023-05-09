---
link: https://zhuanlan.zhihu.com/p/619769347
title: 如何解决Obsidian载入插件后无法启用的问题？
description: 问题安装obsidian插件后，点击启用，出现Failed to load plugin XXX 解决办法打开插件文件夹。 点击打开Github仓库地址。 点击右下角Latest。 对比本地插件夹，发现少了一个main.js，将其从Github单独下载到该插件…
keywords: Obsidian,黑曜石,插件
author: 梓芽
date: 2023-04-06T02:32:00.000Z
publisher: 知乎专栏
stats: paragraph=6 sentences=2, words=6
---
安装obsidian插件后，点击启用，出现Failed to load plugin XXX
![[Obsidian-Img/Pasted image 20230509093743.png]]
打开插件文件夹。
![[Obsidian-Img/Pasted image 20230509093837.png]]
点击打开Github仓库地址。

点击右下角 Latest。
![[Obsidian-Img/Pasted image 20230509093924.png]]
对比本地插件夹，发现少了一个main.js，将其从Github单独下载到该插件文件夹下。
![[Obsidian-Img/Pasted image 20230509093935.png]]
成功启动插件。
