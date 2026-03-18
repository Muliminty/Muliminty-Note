# 浏览器环境与 DOM 操作（Browser and DOM）

JavaScript 在浏览器环境中的应用。

> **说明**：本节包含的是 **Web API**（浏览器 API），而非 ECMAScript 内置对象。这些 API 由 W3C 等 Web 标准组织定义，主要用于浏览器环境。
> 
> **详细说明**：关于内置对象与浏览器 API 的区别，请参考 [JavaScript MOC](../../../../02-编程语言/01-JavaScript/!MOC-JavaScript.md)。

---

## 目录

### 核心 API

- [DOM 操作](./01-DOM操作.md) — DOM 接口和操作（配合 [HTML MOC](../../../../03-前端开发/01-Web基础/01-HTML/!MOC-HTML.md) 使用）
- [BOM（Browser Object Model）](./02-BOM.md) — `window`、`location`、`navigator`、`history`、`screen` 等
- [事件机制](./03-事件机制.md) — 事件捕获、冒泡、委托机制详解
- [自定义事件](./04-自定义事件.md) — CustomEvent API 和组件间通信

### 网络与通信

- [Fetch API](./05-Fetch-API.md) — 现代化的网络请求接口
- [WebSocket API](./06-WebSocket-API.md) — 全双工实时通信协议
- [History API](./07-History-API.md) — 浏览器历史记录操作，实现 SPA 路由

### 存储

- [Storage API](./08-Storage-API.md) — localStorage 和 sessionStorage 本地存储

### 文件操作

- [File API](./09-File-API.md) — 文件对象操作
- [Blob API](./10-Blob-API.md) — 二进制大对象
- [FileReader API](./11-FileReader-API.md) — 文件读取
- [FormData API](./12-FormData-API.md) — 表单数据
- [Cookie API](./13-Cookie-API.md) — Cookie 操作与属性（Domain、Path、Secure、SameSite、HttpOnly）

### 观察者 API

- [Intersection Observer API](./14-Intersection-Observer-API.md) — 观察元素与视口交叉状态（懒加载、无限滚动）
- [Mutation Observer API](./15-Mutation-Observer-API.md) — 观察 DOM 树变化

### 性能与工作线程

- [Performance API](./16-Performance-API.md) — 性能测量和监控
- [Web Workers](./17-Web-Workers.md) — 后台线程执行 JavaScript
- [Service Worker](./18-Service-Worker.md) — 后台脚本，实现离线功能和推送通知

## 参考

- [DOM Living Standard](https://dom.spec.whatwg.org/)
- [W3C File API](https://www.w3.org/TR/FileAPI/)
- [XMLHttpRequest Specification](https://xhr.spec.whatwg.org/)

---

#javascript #dom #bom #浏览器api
