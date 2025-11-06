# JavaScript MOC

> 基于 ECMAScript 官方规范的 JavaScript 知识体系索引
> 
> **学习路径**：JavaScript 是前端三大基础之一，与 [HTML](../HTML/!MOC-HTML.md) 和 [CSS](../CSS/!MOC-CSS.md) 配合使用。掌握 JavaScript 后，可以学习 [TypeScript](../../02-框架进阶/TypeScript/!MOC-TypeScript.md) 或前端框架（[React](../../02-框架进阶/React/!MOC-React.md)、[Vue](../../02-框架进阶/Vue/!MOC-Vue.md) 等）。
> 
> **参考规范**：[ECMAScript Language Specification](https://tc39.es/ecma262/)

---

## 📚 核心体系

### 1. 语言核心（Language Core）

JavaScript 的基础语法和核心概念：

- [语法（Syntax）](./01-语言核心/语法.md) — 变量声明、控制结构、函数、类等语法规则
- [数据类型（Data Types）](./01-语言核心/数据类型.md) — 原始类型与对象类型
- [控制结构（Control Flow）](./01-语言核心/控制结构.md) — `if`、`for`、`while` 等语句
- [作用域和闭包（Scope and Closures）](./01-语言核心/作用域和闭包.md) — 作用域链、块级作用域、闭包概念

**参考**：[ECMAScript Language Specification](https://tc39.es/ecma262/)

---

### 2. 内置对象和 API（Built-in Objects and APIs）

JavaScript 提供的标准内置对象和方法：

- [内置对象概述](./02-内置对象与API/内置对象概述.md) — 内置对象分类和概览
- [Array 对象](./02-内置对象与API/Array.md) — 数组操作和方法
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
- [Promise](./04-异步编程/Promise.md) — ES6 引入的 Promise API
- [async/await](./04-异步编程/async-await.md) — ES8 引入的异步处理语法
- [异步编程最佳实践](./04-异步编程/异步编程最佳实践.md) — 错误处理、并发控制等

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

JavaScript 在浏览器环境中的应用：

- [DOM 操作](./08-浏览器环境与DOM/DOM操作.md) — DOM 接口和操作
- [BOM（Browser Object Model）](./08-浏览器环境与DOM/BOM.md) — `window`、`document`、`navigator` 等
- [事件机制](./08-浏览器环境与DOM/事件机制.md) — 事件捕获、冒泡、委托
- [浏览器 API](./08-浏览器环境与DOM/浏览器API.md) — Fetch API、Storage API 等

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
