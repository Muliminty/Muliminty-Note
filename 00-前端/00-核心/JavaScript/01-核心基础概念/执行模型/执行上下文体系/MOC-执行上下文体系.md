## 1. [执行上下文](执行上下文.md)（Execution Context）

- 执行上下文的类型
    - 全局执行上下文（Global Execution Context）
    - 函数执行上下文（Function Execution Context）
    - `eval` 执行上下文（Eval Execution Context）
- 执行上下文的生命周期
    - 创建阶段
        - 创建变量对象（VO）或活动对象（AO）
        - 创建作用域链（Scope Chain）
        - 确定 `this` 绑定
    - 执行阶段
        - 变量赋值
        - 执行代码逻辑
    - 销毁阶段
        - 释放上下文（如果没有被闭包引用）
- 执行上下文栈（Execution Stack / Call Stack）
    - 先进后出（LIFO）
    - 递归函数的调用栈溢出（Stack Overflow）

---

## 2. [变量对象](变量对象.md)（Variable Object, VO）

- 变量提升（Hoisting）
- `var` 变量存储在 VO 中
- `function` 声明存储在 VO 并可提前调用

---

## 3. 活动对象（Activation Object, AO）

- 存储函数内部变量
- 仅在函数执行时创建
- AO 包含内容
    - `arguments` 对象
    - `this` 绑定
    - 函数内部 `var` 变量
    - 函数声明（Function Declaration）

---

## 4. 词法环境（Lexical Environment, LE）

- 取代变量对象（VO）和活动对象（AO）
- 组成部分
    - 环境记录（Environment Record）
        - 存储变量、函数声明
        - `let` 和 `const` 变量
    - 外部环境引用（Outer Environment Reference）
        - 指向父作用域，形成作用域链
- 词法作用域（Lexical Scope）
    - 作用域在定义时确定，而非调用时
    - 块级作用域（`let` / `const`）

---

## 5. [作用域链](作用域链.md)（Scope Chain）

- 变量查找机制
- 作用域链由多个 词法环境 组成
- 作用域链查找规则：
    1. 先在当前作用域查找变量
    2. 查找父级作用域
    3. 直至全局作用域
- 闭包（Closure） 依赖作用域链

---

## 6. this 绑定

- 默认绑定（全局作用域下，`this === window` / `globalThis`）
- 隐式绑定（`obj.method()`，`this === obj`）
- 显式绑定（`call` / `apply` / `bind`）
- `new` 绑定（构造函数中的 `this`）
- [箭头函数](../../函数机制/箭头函数.md) `this` 绑定（继承外层 `this`）

---

## 7. 闭包（Closure）

- 形成闭包的条件：
    - 内部函数引用外部作用域的变量
- 常见应用
    - 函数工厂（函数返回另一个函数）
    - 数据私有化（模拟 `private` 变量）
    - 事件监听（捕获外部变量）

---

## 8. 执行上下文与垃圾回收（GC, Garbage Collection）

- 标记清除（Mark & Sweep）
    - 变量不再被引用时，GC 进行回收
- 引用计数（Reference Counting）
    - 当引用数为 0 时释放内存
- 常见内存泄漏
    - 未清理的 DOM 绑定
    - 闭包导致变量未释放

---

## 9. 事件循环（Event Loop）

- 宏任务（Macrotask）
    - `setTimeout`
    - `setInterval`
    - `setImmediate`（Node.js）
    - `I/O`
    - `UI 渲染`
- 微任务（Microtask）
    - `Promise.then/catch/finally`
    - `MutationObserver`
    - `queueMicrotask`
- 执行顺序
    1. 执行同步代码（执行栈）
    2. 执行所有微任务
    3. 执行一个宏任务（如果有）
    4. 进入下一个事件循环，重复上述步骤

---

## 10. `eval` 与 `with` 作用域

- `eval()` 创建新的执行上下文
- `with` 改变作用域链（不推荐）

---

这个列表涵盖了 JavaScript 执行上下文相关的所有重要机制，每个概念都与 JavaScript 代码执行息息相关。