---
link: https://blog.csdn.net/csdn_haow/article/details/90369309
title: react项目打包后点击index.html页面出现空白
description: 在打包之前,在package.json中private下(位置任意)添加"homepage": "./"这样在你点击index.html时候路径没有问题不会报错,但是页面可能还是空白的然后将项目中的引用路由时候的BrowserRouter改为HashRouter,所有用到的地方都要改然后执行yarn build 或者 npm run build再点开index.html就不会报错...
keywords: react项目打包后点击index.html页面出现空白
author: Csdn_haow Csdn认证博客专家 Csdn认证企业博客 码龄7年 暂无认证
date: 2019-05-20T01:43:30.000Z
publisher: null
stats: paragraph=10 sentences=17, words=30
---
在打包之前,在package.json中private下(位置任意)添加"homepage": "./"

这样在你点击index.html时候路径没有问题不会报错,但是页面可能还是空白的

然后将项目中的引用路由时候的BrowserRouter改为HashRouter,所有用到的地方都要改

然后执行yarn build 或者 npm run build

再点开index.html就不会报错

## 原因：

你必须把build里的文件直接放到应用服务器的根路径下，比如，你的服务器IP是172.16.38.253，应用服务器端口为8080，你应该保证http://172.16.38.253:8080这种访问方式，访问到的是你的build下的文件。如果你希望以http://172.16.38.253:8080/build/index.htm这种方式访问应用，那么你可以在package.json文件中增加一个homepage字段。

## 在服务器下运行和直接打开html文件有什么区别？

最直接的区别，很容易注意到，一个是file协议，另一个是http协议。file协议更多的是将该请求视为一个本地资源访问请求，和你使用资源管理器打开是一样的，是纯粹的请求本地文件。而http请求方式则是通过假架设一个web服务器，解析http协议的请求然后向浏览器返回资源信息。我们所开发的html文件最后必定是会以网页的形式部署在服务器上，通过http协议访问，所以我们开发中也尽可能模拟线上环境，架设本地服务器，来避免file协议与http协议实现过程中的某些差异性，如某些API的差异、跨域请求的差异等。举个最容易验证的例子：在页面引入一张绝对路径的图片，即'/image/example.png'，然后分别通过这两种方式打开页面，file协议会将资源请求到根路径，而http协议虽然也会请求到根路径，但是是相对本地架设的服务器的根路径，一般也就是项目文件夹的路径。

html是运行于客户端的超文本语言，从安全性上来讲，服务端不能对客户端进行本地操作。即使有一些象cookie这类的本地操作，也是需要进行安全级别设置的。
