# Node.js 简介与特点

Node.js 是基于 Chrome V8 引擎的 JavaScript 运行时。

---

## 📚 什么是 Node.js

Node.js 是一个**跨平台的 JavaScript 运行时环境**，允许在服务器端运行 JavaScript 代码。

### 核心特点

- **基于 V8 引擎**：使用 Chrome V8 JavaScript 引擎
- **事件驱动**：非阻塞 I/O 模型
- **单线程**：主线程是单线程，但通过事件循环处理并发
- **NPM 生态**：拥有庞大的包生态系统

---

## 🎯 主要特性

### 1. 非阻塞 I/O

```javascript
// 非阻塞读取文件
const fs = require('fs');
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});
console.log('继续执行'); // 不会等待文件读取完成
```

### 2. 事件驱动

```javascript
const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.on('event', (data) => {
  console.log('收到事件:', data);
});

emitter.emit('event', 'Hello Node.js');
```

### 3. 单线程事件循环

```javascript
// Node.js 使用事件循环处理异步操作
setTimeout(() => {
  console.log('异步执行');
}, 0);
console.log('同步执行');
// 输出：
// 同步执行
// 异步执行
```

---

## 💡 适用场景

### 适合的场景

- **API 服务器**：RESTful API、GraphQL
- **实时应用**：聊天应用、协作工具
- **微服务**：轻量级服务
- **工具开发**：CLI 工具、构建工具
- **全栈开发**：前后端统一语言

### 不适合的场景

- **CPU 密集型任务**：图像处理、视频编码
- **大型计算**：科学计算、数据分析

---

## 🔗 相关链接

- [安装与版本管理](./安装与版本管理.md) — Node.js 安装指南
- [模块系统](./模块系统.md) — CommonJS 和 ES Modules
- [核心模块](./核心模块.md) — Node.js 内置模块

---

**参考**：
- [Node.js 官网](https://nodejs.org/)
- [Node.js 文档](https://nodejs.org/docs/)

---

#nodejs #服务端 #javascript #运行时
