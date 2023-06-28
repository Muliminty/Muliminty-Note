---
link: https://juejin.cn/post/7028590772333051918
title: JavaScript中 FileReader 对象详解
description: 「这是我参与11月更文挑战的第9天，活动详情查看：2021最后一次更文挑战」 1. 简介 FileReader 对象允许 Web 应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容，使
keywords: 前端,JavaScript
author: 首页 首页 沸点 课程 直播 活动 竞赛 商城 App 插件 搜索历史 清空 创作者中心 写文章 发沸点 写笔记 写代码 草稿箱 创作灵感 查看更多 会员 登录
date: 2021-11-09T15:22:52.000Z
publisher: 稀土掘金
stats: paragraph=51 sentences=84, words=532
---
「这是我参与11月更文挑战的第9天，活动详情查看：[2021最后一次更文挑战](https://juejin.cn/post/7023643374569816095/ "https://juejin.cn/post/7023643374569816095/")」

### 1. 简介

FileReader 对象允许 Web 应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容，使用 File 或 Blob 对象指定要读取的文件或数据。 其中 File 对象可以是来自用户在一个 < input > 元素上选择文件后返回的 FileList 对象，也可以来自拖放操作生成的 DataTransfer 对象，还可以是来自在一个 HTMLCanvasElement 上执行 mozGetAsFile() 方法后返回结果。

**重要提示：** FileReader 仅用于以安全的方式从用户（远程）系统读取文件内容，不能用于从文件系统中按路径名简单地读取文件。 要在JavaScript中按路径名读取文件，应使用标准 Ajax 解决方案进行服务器端文件读取。如果读取跨域，则使用 CORS 权限。

#### 属性

属性描述FileReader.error一个DOMException，表示在读取文件时发生的错误 。FileReader.result返回文件的内容。只有在读取操作完成后，此属性才有效，返回的数据的格式取决于是使用哪种读取方法来执行读取操作的。FileReader.readyState表示FileReader状态的数字。 EMPTY 0 还没有加载任何数据。 LOADING 1 数据正在被加载。DONE 2 已完成全部的读取请求。

#### 方法

FileReader 的实例拥有 4 个方法，其中 3 个用以读取文件，另一个用来中断读取。 下面的表格列出了这些方法以及他们的参数和功能，

需要注意的是 ，无论读取成功或失败，方法并不会返回读取结果，这一结果存储在 result属性中。

方法名描述FileReader.abort()中止读取操作。在返回时，readyState 属性为 DONE。FileReader.readAsArrayBuffer()开始读取指定的 Blob 中的内容。 一旦完成，result 属性中保存的将是被读取文件的 ArrayBuffer 数据对象。FileReader.readAsBinaryString()开始读取指定的 Blob 中的内容。一旦完成，result 属性中将包含所读取文件的原始二进制数据。FileReader.readAsDataURL()开始读取指定的 Blob 中的内容。一旦完成，result 属性中将包含一个 data: URL 格式的 Base64 字符串以表示所读取文件的内容。FileReader.readAsText()开始读取指定的Blob中的内容。一旦完成，result 属性中将包含一个字符串以表示所读取的文件内容。

#### 事件处理

FileReader 包含了一套完整的事件模型，用于捕获读取文件时的状态，下面这个表格归纳了这些事件。

事件描述FileReader.onabort处理 abort 事件。该事件在读取操作被中断时触发。FileReader.onerror处理 error 事件。该事件在读取操作发生错误时触发。FileReader.onload处理 load 事件。该事件在读取操作完成时触发。FileReader.onloadstart处理 loadstart 事件。该事件在读取操作开始时触发。FileReader.onloadend处理 loadend 事件。该事件在读取操作结束时（要么成功，要么失败）触发。FileReader.onprogress处理 progress 事件。该事件在读取Blob时触发。

> 因为 FileReader 继承自 EventTarget，所以所有这些事件也可以通过 addEventListener 方法使用。

**检测浏览器对 FileReader 的支持**

```js
if(window.FileReader) {
  var fr = new FileReader();

}else {
  alert("Not supported by your browser!");
}
复制代码
```

### 2. FileReader 对象的使用

#### 2.1 基本使用

**准备文件**

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/70a7fe9af3c742c0ba995e8c6fec4571~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.image)

**完整代码：**

```html

<html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1, user-scalable=no">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="format-detection" content="telephone=no">
    <title>testtitle>
  head>
  <body>
    <div>
      <input type="file">
      <input type="file" id="imgFile">
      <img src="" id="preview">
    div>
    <script type="text/javascript">
      let inputFile = document.querySelector('input[type=file]');
      inputFile.onchange = function(){
        var reader = new FileReader()

        reader.readAsText(this.files[0])
        reader.onload = function(){
          console.log(this.result)
        }
      }

      let imgFile = document.querySelector('#imgFile');
      let priview = document.querySelector("#preview");
      imgFile.onchange = function () {
        var reader = new FileReader();

        reader.readAsDataURL(this.files[0])
          reader.onload = function () {
          priview.src = reader.result;
          console.log(this.result)
        }
      }
    script>
  body>
html>
复制代码
```

**效果：**

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ab5b2584a30e4240a40a30e3fb4a0cae~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.image)

#### 2.2 事件处理

**完整代码：**

```html

<html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1, user-scalable=no">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="format-detection" content="telephone=no">
    <title>testtitle>
  head>
  <body>
    <div>
      <input type="file">
    div>
    <script type="text/javascript">
      let inputFile = document.querySelector('input[type=file]');
      inputFile.onchange = function(){
        var reader = new FileReader()

        reader.readAsText(this.files[0])
        reader.onloadstart = function(){
          console.log("onloadstart状态"+this.readyState)
        }
        reader.onloadend= function(){
          console.log("onloadend状态"+this.readyState)
        }
        reader.onprogress = function(){
          console.log("onprogress状态"+this.readyState)
        }
        reader.onload = function(){
          console.log("onload状态"+this.readyState,"获取的数据："+this.result);
        }
        reader.onerror = function(){
          console.log('出错了')
        }
        reader.onerror = function(){
          console.log('处理abort事件。该事件在读取操作被中断时触发。')
        }
      }
    script>
  body>
html>
复制代码
```

**效果：**

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b196a3f09d8d4276ad0ece8171167590~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.image)

**分析：**

* onloadstart 状态：数据正在被加载；
* onloadend 状态：已完成全部的读取请求；
* .当然状态为 0（readyState）表示还没有加载任何数据；
* 每过50ms左右，就会触发一次 progress 事件；也就是说这个可能多次触发，onload 事件在 onloadend 之前触发；
* 由于种种原因无法读取文件时，会触发 error 事件。触发 error 事件时，相关信息保存在 FileReader 对象的 error 属性中，这个属性将保存一个对象，此对象只有一个属性 code，即错误码。1 表示未找到文件，2 表示安全性错误，3 表示读取中断，4 表示文件不可读，5 表示编码错误；
* 如果想中断读取过程，可调用 abort 方法，就会触发 abort 事件。在返回时，readyState 属性为 DONE。一般用于后台的操作；

#### 2.3 node操作文件

根据以上可知，浏览器中的 JavaScript 是没有文件操作的能力的（基于安全，不能直接操作本地文件），但是 Node 中的 JavaScript 具有文件操作的能力。

**读取文件**

```js

var fs = require('fs')

fs.readFile('read.txt', function (error, data) {

  if (error) {
    console.log('读取文件失败了')
  } else {
    console.log(data.toString())
  }
})
复制代码
```

**文件读取是异步操作**

当我们读取多个文件，发现使用 readfile 读取文件并不能一定按顺序打印结果，所以这是一个异步操作，如何顺序读取文件。 使用 Promise

```js
var fs = require('fs')
function pReadFile(filePath) {
  return new Promise(function (resolve, reject) {
    fs.readFile(filePath, 'utf8', function (err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

pReadFile('./data/a.txt')
  .then(function (data) {
    console.log(data)
    return pReadFile('./data/b.txt')
  })
  .then(function (data) {
    console.log(data)
    return pReadFile('./data/c.txt')
  })
  .then(function (data) {
    console.log(data)
  })
复制代码
```

**文件写入**

```js
fs.writeFile('read.txt', '大家好，给大家介绍一下，我是文件写入', function (error) {
  if (error) {
    console.log('写入失败')
  } else {
    console.log('写入成功了')
  }
})
复制代码
```
