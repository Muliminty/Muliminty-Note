# JavaScript MOC

这是 JavaScript 学习与整理的内容地图，按照 **语法（Syntax）→ 语义（Semantics）→ 运行时（Runtime）** 三个层次来组织，方便扩展与深化。

> **学习路径**：JavaScript 是前端三大基础之一，与 [HTML](../HTML/!MOC-HTML.md) 和 [CSS](../CSS/!MOC-CSS.md) 配合使用。掌握 JavaScript 后，可以学习 [TypeScript](../TypeScript/!MOC-TypeScript.md) 或前端框架（[React](../../02-框架进阶/React/!MOC-React.md)、[Vue](../../02-框架进阶/Vue/!MOC-Vue.md) 等）。

---

## 体系整理

主线笔记（串联语法、语义到运行时的脉络）：

+ [从语法、语义到运行时](./体系/从语法、语义到运行时.md)
---

## 一、语法（Syntax）

JavaScript 的表层结构，描述代码如何书写与组成。

### 1. 基础语法

* 变量声明：`var` / `let` / `const`
* 数据类型

  * 原始类型（string / number / boolean / null / undefined / symbol / bigint）
  * 引用类型（object / array / function）
* 运算符与表达式
* 控制流：`if` / `for` / `while` / `switch`

### 2. 函数语法

* 函数声明与函数表达式
* 箭头函数
* 参数：默认参数 / 剩余参数 / 解构参数

### 3. 对象与结构

* 对象字面量
* 属性与属性描述符
* `class` 与语法糖

### 4. 模块化语法

* ES Modules：`import` / `export`
* 动态导入：`import()`

### 5. 现代语法扩展

* 模板字符串
* 解构赋值
* 展开运算符
* 可选链 `?.` 与空值合并 `??`

---

## 二、语义（Semantics）

语法背后的意义和运行规则。

### 1. 作用域与闭包

* 作用域链
* 词法作用域
* 闭包的形成与应用

### 2. this 绑定语义

* 默认绑定
* 隐式绑定
* 显式绑定：`call` / `apply` / `bind`
* new 绑定

### 3. 原型与继承

* 原型链
* 构造函数继承
* `class` 的继承语义
* `super` 关键字

### 4. 类型与健壮性

* JavaScript 的类型检查机制
* 类型转换（显式 / 隐式）
* 异常处理与错误对象
* 与 TypeScript 的衔接

### 5. 内置对象的语义

* 常用对象：`Object` / `Function` / `Array`
* 工具对象：`JSON` / `Intl`
* 正则：`RegExp`
* 日期：`Date`
* 数学：`Math`
* 集合：`Map` / `Set` / `WeakMap` / `WeakSet`

---

## 三、运行时（Runtime）

JavaScript 程序执行时的环境与机制。

### 1. 执行模型

* 执行上下文（创建、执行阶段）
* 变量提升与函数提升
* 事件循环（Event Loop）

  * 宏任务 / 微任务
  * 浏览器与 Node.js 的差异

### 2. 异步与并发

* Promise 语义与执行流程
* async / await
* 事件驱动模型
* 并发与多线程：Web Worker / SharedArrayBuffer

### 3. 内存与性能

* 垃圾回收机制
* 内存管理与泄漏
* 性能优化（代码层面）

### 4. 安全与运行环境

* XSS / CSRF
* 沙箱机制
* WebAssembly 与 JS 的结合

### 5. 环境与 API

#### 浏览器环境

* **BOM（Browser Object Model）**

  * `window` 对象
  * `navigator` / `location` / `history`
  * `screen`
  * alert / confirm / prompt

* **DOM（Document Object Model）**

  * DOM 树结构
  * 节点类型与属性
  * DOM 操作（查询、增删改）
  * 事件机制（事件捕获/冒泡、委托）
  * MutationObserver

#### Node.js 环境

* 全局对象 `global`
* 常用模块：`fs` / `http` / `path`
* 事件驱动与 `EventEmitter`

---

## 四、语言进化与生态

### 1. 语言进化

* ES6+ 新特性集合
* Proxy / Reflect
* Iterator / Generator
* 元编程

### 2. 模块化与规范（历史到现代）

* IIFE / 全局命名空间
* CommonJS / AMD / UMD
* ES Modules (ESM)

### 3. 工具与生态

* 包管理：NPM / Yarn / PNPM（详见 [包管理](../../03-工程化实践/工具链与构建/包管理与版本策略.md)）
* 编译与构建：Babel / Webpack / Vite / Rollup（详见 [工具链与构建 MOC](../../03-工程化实践/工具链与构建/!MOC-工具链与构建.md)）
* Lint & Format：ESLint / Prettier（详见 [代码规范](../../03-工程化实践/工程化/代码规范.md)）
* 测试框架：Jest / Mocha / Vitest（详见 [测试 MOC](../../04-质量保障/测试/!MOC-测试.md)）

---

## 📝 学习建议

1. **前置知识**：需要先掌握 [HTML](../HTML/!MOC-HTML.md) 和 [CSS](../CSS/!MOC-CSS.md) 基础
2. **学习顺序**：HTML → CSS → JavaScript → [TypeScript](../../02-框架进阶/TypeScript/!MOC-TypeScript.md) → 前端框架
3. **进阶方向**：
   - 学习 [TypeScript](../../02-框架进阶/TypeScript/!MOC-TypeScript.md) 增强类型安全
   - 学习前端框架：[React](../../02-框架进阶/React/!MOC-React.md) 或 [Vue](../../02-框架进阶/Vue/!MOC-Vue.md)
   - 学习 [工程化工具](../../03-工程化实践/工具链与构建/!MOC-工具链与构建.md) 提升开发效率
4. **实践应用**：JavaScript 操作 DOM（HTML）和样式（CSS），实现页面交互

---

## 📌 扩展说明

遇到新知识时，可以按照以下规则扩展：

1. **语法层面 (Syntax)**

   * 如果是 **代码写法 / 新语法糖** → 放在 **语法**。
   * 例子：`?.` 可选链、`??` 空值合并、新的 `class` 特性。

2. **语义层面 (Semantics)**

   * 如果是 **语法背后的规则与含义** → 放在 **语义**。
   * 例子：闭包为什么能访问外部变量、this 在箭头函数中的语义。

3. **运行时层面 (Runtime)**

   * 如果涉及 **执行机制 / 内存 / 并发 / 安全** → 放在 **运行时**。
   * 例子：微任务队列、垃圾回收算法、事件驱动模型。

4. **跨语法的语言演化**

   * 如果是 **新标准、新提案、语言未来方向** → 放在 **语言进化与生态**。
   * 例子：Pipeline operator 提案、TC39 的新特性。

5. **工具与生态**

   * 如果是 **不属于语言本身，而是配套工具链** → 放在 **生态**。
   * 例子：Vite 插件、Babel 配置、Vitest 的最佳实践。

6. **主线文章**

   * 如果写的是 **从多个维度串起来的总览 / 脉络文章** → 放进 `体系/` 目录，并在 **体系整理**和相关章节都挂上链接。
