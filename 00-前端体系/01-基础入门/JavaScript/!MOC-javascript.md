# JavaScript（JavaScript）MOC

> 基于 ECMAScript 官方规范的 JavaScript 知识体系索引
> 
> **学习路径**：JavaScript 是前端三大基础之一，与 [HTML](../HTML/!MOC-HTML.md) 和 [CSS](../CSS/!MOC-CSS.md) 配合使用。掌握 JavaScript 后，可以学习 [TypeScript](../../02-框架进阶/TypeScript/!MOC-TypeScript.md) 或前端框架（[React](../../02-框架进阶/React/!MOC-React.md)、[Vue](../../02-框架进阶/Vue/!MOC-Vue.md) 等）。
> 
> **参考规范**：[ECMAScript Language Specification](https://tc39.es/ecma262/)

---

## 📚 知识体系分类说明

### 内置对象 vs 浏览器 API

JavaScript 知识体系包含两类 API：

**ECMAScript 内置对象（Built-in Objects）**：
- 由 **ECMAScript 规范**（TC39）定义
- 是 JavaScript 语言本身的一部分
- 在所有 JavaScript 运行环境中都可用（浏览器、Node.js、Deno 等）
- 示例：`Array`、`String`、`Date`、`Math`、`JSON`、`Promise` 等
- 参考：[ECMAScript Built-in Objects](https://tc39.es/ecma262/#sec-built-in-objects)
- 对应章节：[2. 内置对象和 API](#2-内置对象和-api-built-in-objects-and-apis)

**浏览器 API（Web API）**：
- 由 **W3C** 或其他 Web 标准组织定义
- 是浏览器环境提供的 API
- 主要用于浏览器环境，在 Node.js 等环境中可能不存在或需要 polyfill
- 示例：`File`、`Blob`、`FileReader`、`FormData`、`DOM`、`Fetch` 等
- 参考：[W3C File API](https://www.w3.org/TR/FileAPI/)、[DOM Living Standard](https://dom.spec.whatwg.org/)
- 对应章节：[8. 浏览器环境与 DOM 操作](#8-浏览器环境与-dom-操作-browser-and-dom)

### 为什么 File/Blob/FileReader/FormData 是浏览器 API？

1. **规范来源**：
   - 这些 API 由 **W3C File API** 规范定义，不是 ECMAScript 规范的一部分
   - `FormData` 由 **XMLHttpRequest 规范**定义

2. **环境依赖**：
   - 这些 API 主要用于浏览器环境中的文件操作
   - 虽然在 Node.js 18+ 中也有实现，但这是为了兼容性，而不是语言核心

3. **使用场景**：
   - `File`、`Blob`、`FileReader` 主要用于处理浏览器中的文件上传、下载、预览等
   - `FormData` 主要用于浏览器中的表单提交和文件上传
   - 这些功能与 DOM 操作密切相关

4. **历史原因**：
   - 这些 API 最初是为了在浏览器中处理文件而设计的
   - 它们与 DOM、BOM 等浏览器 API 属于同一类别

---

## 📚 核心体系

### 1. 语言核心（Language Core）

JavaScript 的基础语法和核心概念：

- [语法（Syntax）](./01-语言核心/语法.md) — 变量声明、控制结构、函数、类等语法规则
- [变量声明（Variable Declaration）](./01-语言核心/变量声明.md) — `var`、`let`、`const` 的区别和使用
- [数据类型（Data Types）](./01-语言核心/数据类型.md) — 原始类型与对象类型
- [控制结构（Control Flow）](./01-语言核心/控制结构.md) — `if`、`for`、`while` 等语句
- [函数（Functions）](./01-语言核心/函数.md) — 函数定义、调用、参数、返回值
- [作用域和闭包（Scope and Closures）](./01-语言核心/作用域和闭包.md) — 作用域链、块级作用域、闭包概念

#### 底层原理（Underlying Principles）

JavaScript 运行时的底层机制：

- [执行上下文（Execution Context）](./01-语言核心/底层原理/执行上下文.md) — 执行上下文的创建和执行
- [调用栈（Call Stack）](./01-语言核心/底层原理/调用栈.md) — 函数调用的栈结构
- [V8工作原理（V8 Engine）](./01-语言核心/底层原理/V8工作原理.md) — V8 引擎的编译和执行机制
- [内存管理（Memory Management）](./01-语言核心/底层原理/内存管理.md) — 内存分配、垃圾回收机制
- [事件循环机制（Event Loop）](./01-语言核心/底层原理/事件循环机制.md) — 异步任务的处理机制

**参考**：[ECMAScript Language Specification](https://tc39.es/ecma262/)

---

### 2. 内置对象和 API（Built-in Objects and APIs）

> **说明**：本节包含的是 **ECMAScript 内置对象**，由 TC39 组织定义的 ECMAScript 规范的一部分。这些对象在所有 JavaScript 运行环境中都可用（浏览器、Node.js、Deno 等）。
> 
> **注意**：`File`、`Blob`、`FileReader`、`FormData` 等 API 不是 ECMAScript 内置对象，而是 **Web API**（浏览器 API），由 W3C 定义，主要用于浏览器环境。相关内容请参考 [8. 浏览器环境与 DOM 操作](#8-浏览器环境与-dom-操作-browser-and-dom)。

JavaScript 提供的标准内置对象和方法：

- [内置对象概述](./02-内置对象与API/内置对象概述.md) — 内置对象分类和概览
- [Array 对象](./02-内置对象与API/Array.md) — 数组操作和方法（创建、访问、修改、迭代、ES6+ 方法、性能优化、最佳实践）
- [String 对象](./02-内置对象与API/String.md) — 字符串操作和方法
- [Date 对象](./02-内置对象与API/Date.md) — 日期和时间处理
- [RegExp 对象](./02-内置对象与API/RegExp.md) — 正则表达式
- [JSON 对象](./02-内置对象与API/JSON.md) — JSON 序列化和反序列化
- [Math 对象](./02-内置对象与API/Math.md) — 数学运算
- [Set 和 Map](./02-内置对象与API/Set和Map.md) — 集合数据结构
- [其他内置对象](./02-内置对象与API/其他内置对象.md) — Object、Function、Error 等

**参考**：[ECMAScript Built-in Objects](https://tc39.es/ecma262/#sec-built-in-objects)

---

### 3. 模块化（Modules）

JavaScript 模块系统：

- [ES6 模块（ES Modules）](./03-模块化/ES6模块.md) — `import` 和 `export` 语法
- [命名导入与默认导入](./03-模块化/导入导出.md) — 模块导入导出方式
- [动态导入（Dynamic Import）](./03-模块化/动态导入.md) — `import()` 函数
- [模块化历史](./03-模块化/模块化历史.md) — CommonJS、AMD、UMD 等（详见 [工程化实践](../../03-工程化实践/工程化/模块化与分包.md)）

**参考**：[ECMAScript Modules](https://tc39.es/ecma262/#sec-modules)

---

### 4. 异步编程（Asynchronous Programming）

JavaScript 异步处理机制：

- [回调函数（Callbacks）](./04-异步编程/回调函数.md) — 最初的异步处理方式
- [Promise](./04-异步编程/Promise.md) — ES6 引入的 Promise API，现代异步编程的基础
- [async/await](./04-异步编程/async-await.md) — ES8 引入的异步处理语法，基于 Promise 的语法糖
- [异步编程最佳实践](./04-异步编程/异步编程最佳实践.md) — 错误处理、并发控制、超时处理等最佳实践

**参考**：[ECMAScript Async Programming](https://tc39.es/ecma262/#sec-promise-objects)

---

### 5. 对象和类（Objects and Classes）

JavaScript 面向对象编程：

- [对象（Object）](./05-对象与类/对象.md) — 对象的定义、继承和属性描述
- [类（Class）](./05-对象与类/类.md) — ES6 引入的类语法
- [原型与继承](./05-对象与类/原型与继承.md) — 原型链机制
- [this 绑定](./05-对象与类/this绑定.md) — this 的绑定规则

**参考**：[ECMAScript Object and Class](https://tc39.es/ecma262/#sec-objects)

---

### 6. 性能优化（Performance Optimizations）

JavaScript 性能优化相关：

- [垃圾回收机制（Garbage Collection）](./06-性能优化/垃圾回收机制.md) — 内存管理和回收
- [尾调用优化（Tail Call Optimization）](./06-性能优化/尾调用优化.md) — 递归优化（并非所有引擎都实现）
- [代码性能优化](./06-性能优化/代码性能优化.md) — 代码层面的性能优化技巧
- [性能监控与分析](./06-性能优化/性能监控与分析.md) — 性能分析工具和方法

**参考**：[ECMAScript Garbage Collection](https://tc39.es/ecma262/#sec-gc)

---

### 7. 函数式编程（Functional Programming）

JavaScript 函数式编程特性：

- [高阶函数（Higher-order Functions）](./07-函数式编程/高阶函数.md) — `map`、`reduce`、`filter` 等
- [箭头函数（Arrow Functions）](./07-函数式编程/箭头函数.md) — 简化函数语法并改变 `this` 绑定
- [不可变数据（Immutability）](./07-函数式编程/不可变数据.md) — `Object.freeze` 等方式实现不可变数据
- [函数式编程模式](./07-函数式编程/函数式编程模式.md) — 函数式编程的常见模式

**参考**：[ECMAScript Arrow Functions](https://tc39.es/ecma262/#sec-arrow-function-definitions)

---

### 8. 浏览器环境与 DOM 操作（Browser and DOM）

> **说明**：本节包含的是 **Web API**（浏览器 API），而非 ECMAScript 内置对象。这些 API 由 W3C 等 Web 标准组织定义，主要用于浏览器环境。
> 
> **详细说明**：关于内置对象与浏览器 API 的区别，请参考 [知识体系分类说明](#-知识体系分类说明)。

JavaScript 在浏览器环境中的应用：

- [DOM 操作](./08-浏览器环境与DOM/DOM操作.md) — DOM 接口和操作
- [BOM（Browser Object Model）](./08-浏览器环境与DOM/BOM.md) — `window`、`document`、`navigator` 等
- [事件机制](./08-浏览器环境与DOM/事件机制.md) — 事件捕获、冒泡、委托
- [自定义事件](./08-浏览器环境与DOM/自定义事件.md) — CustomEvent API 和组件间通信
- [浏览器 API](./08-浏览器环境与DOM/浏览器API.md) — Fetch API、Storage API 等
- [File API](./08-浏览器环境与DOM/File-API.md) — 文件对象操作
- [Blob API](./08-浏览器环境与DOM/Blob-API.md) — 二进制大对象
- [FileReader API](./08-浏览器环境与DOM/FileReader-API.md) — 文件读取
- [FormData API](./08-浏览器环境与DOM/FormData-API.md) — 表单数据和文件上传

**参考**：[DOM Living Standard](https://dom.spec.whatwg.org/)

---

### 9. 工具与生态（Performance Tuning and Tools）

JavaScript 开发工具和生态：

- [Babel](./09-工具与生态/Babel.md) — 将新版本 ECMAScript 转译为旧版本的工具（详见 [Babel 转换管线](../../03-工程化实践/工具链与构建/Babel转换管线.md)）
- [包管理](./09-工具与生态/包管理.md) — npm、yarn、pnpm（详见 [包管理与版本策略](../../03-工程化实践/工具链与构建/包管理与版本策略.md)）
- [构建工具](./09-工具与生态/构建工具.md) — Webpack、Vite、Rollup（详见 [工具链与构建 MOC](../../03-工程化实践/工具链与构建/!MOC-工具链与构建.md)）
- [代码规范工具](./09-工具与生态/代码规范工具.md) — ESLint、Prettier（详见 [代码规范](../../03-工程化实践/工程化/代码规范.md)）

**参考**：[Babel Documentation](https://babeljs.io/docs/en/)

---

### 10. 测试和规范（Testing and Best Practices）

JavaScript 测试和最佳实践：

- [单元测试](./10-测试与规范/单元测试.md) — 使用 Jest 等框架进行测试（详见 [测试 MOC](../../04-质量保障/测试/!MOC-测试.md)）
- [ESLint 规范](./10-测试与规范/ESLint规范.md) — 代码质量检查工具
- [JavaScript 最佳实践](./10-测试与规范/最佳实践.md) — 编码规范和最佳实践
- [TC39 提案跟踪](./10-测试与规范/TC39提案跟踪.md) — ECMAScript 新特性跟踪

**参考**：[ECMAScript Best Practices](https://tc39.es/ecma262/#sec-best-practices)

---

## 🔗 相关链接

### 前置知识
- [HTML MOC](../HTML/!MOC-HTML.md) — HTML 基础
- [CSS MOC](../CSS/!MOC-CSS.md) — CSS 基础

### 进阶学习
- [TypeScript MOC](../../02-框架进阶/TypeScript/!MOC-TypeScript.md) — JavaScript 的类型系统
- [React MOC](../../02-框架进阶/React/!MOC-React.md) — JavaScript 框架
- [Vue MOC](../../02-框架进阶/Vue/!MOC-Vue.md) — JavaScript 框架

### 工程化实践
- [工具链与构建 MOC](../../03-工程化实践/工具链与构建/!MOC-工具链与构建.md) — 构建工具和编译
- [工程化 MOC](../../03-工程化实践/工程化/!MOC-工程化.md) — 代码规范和模块化
- [测试 MOC](../../04-质量保障/测试/!MOC-测试.md) — 测试策略和工具

---

## 📖 官方资源

- [ECMAScript 官方规范](https://tc39.es/ecma262/)
- [MDN JavaScript 文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)
- [JavaScript.info](https://zh.javascript.info/)

---

#javascript #ecmascript #前端基础
