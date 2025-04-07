
- **函数基础**
  - 定义方式
    - 函数声明：`function funcName() {}`
    - 函数表达式：`const func = function() {}`
    - [箭头函数](00-前端/00-核心/JavaScript/核心概念/基础语法/函数/箭头函数.md)：`const func = () => {}`
    - `Function` 构造函数：`new Function('a', 'b', 'return a + b')`
  - 函数调用
    - 直接调用：`func()`
    - 方法调用：`obj.method()`
    - 构造函数调用：`new Func()`
    - 间接调用：`func.call(context, arg1)`, `func.apply(context, [args])`
  - 函数参数
    - 形参（Parameters）与实参（Arguments）
    - 默认参数：`function(a = 1) {}`（ES6）
    - 剩余参数：`function(...args) {}`（ES6）
    - 参数解构：`function({ a, b }) {}`
  - 返回值
    - `return` 语句
    - 默认返回 `undefined`

- **作用域与闭包**
  - 词法作用域（静态作用域）
  - 作用域链
  - 闭包（Closure）
    - 定义：函数访问其词法作用域外的变量
    - 应用场景：私有变量、模块化、柯里化
    - 内存泄漏风险

- **`this` 关键字**
  - 绑定规则
    - 默认绑定：全局对象（非严格模式）或 `undefined`（严格模式）
    - 隐式绑定：通过对象调用（`obj.func()`）
    - 显式绑定：`call()`, `apply()`, `bind()`
    - `new` 绑定：构造函数实例
  - 箭头函数的 `this`：继承外层作用域（无自身 `this`）

- **高阶函数（Higher-Order Functions）**
  - 函数作为参数（如 `setTimeout(callback, delay)`）
  - 函数作为返回值（如工厂函数）
  - 常见高阶函数
    - 数组方法：`map()`, `filter()`, `reduce()`, `some()`, `every()`
    - 函数组合：`compose(f, g)(x) = f(g(x))`

- **ES6+ 函数特性**
  - 箭头函数
    - 语法简写：`(a, b) => a + b`
    - 无 `arguments` 对象，不可作为构造函数
  - 默认参数值
  - 剩余/展开参数（`...`）
  - 尾调用优化（Tail Call Optimization, TCO）

- **特殊函数类型**
  - 生成器函数（Generator）
    - `function* gen() { yield value; }`
    - 用于惰性迭代、异步流程控制
  - 异步函数（Async/Await）
    - `async function foo() { await promise; }`
    - 基于 Promise 的语法糖
  - 立即执行函数（IIFE）
    - `(function() {})()`
    - 用于隔离作用域（ES6 前模块化方案）

- **函数对象属性与方法**
  - `name`：函数名（匿名函数返回变量名或空）
  - `length`：形参数量
  - `caller`（已弃用）：调用该函数的函数
  - `toString()`：返回函数源码字符串
  - `bind()`：创建绑定上下文的新函数

- **函数式编程概念**
  - 纯函数（无副作用，相同输入始终返回相同输出）
  - 副作用管理
  - 不可变性（Immutable Data）
  - 柯里化（Currying）：将多参数函数转为单参数链式调用
  - 函数组合（Function Composition）

- **错误处理与调试**
  - `try...catch` 捕获函数内异常
  - 错误边界（如 `Promise.catch()`）
  - 调试工具：断点、`console.trace()`

- **性能与优化**
  - 避免重复创建函数（如循环内定义函数）
  - 防抖（Debounce）与节流（Throttle）
  - 尾递归优化（部分环境支持）

- **设计模式中的函数**
  - 工厂模式：函数返回新对象
  - 单例模式：通过闭包隐藏实例
  - 观察者模式：回调函数队列
  - 策略模式：函数作为可替换策略

- **测试相关**
  - 单元测试：模拟函数输入/输出
  - Mock 函数：`jest.fn()`
  - 函数覆盖率分析

- **最佳实践**
  - 单一职责原则（一个函数只做一件事）
  - 合理命名（动词开头，如 `getUserData()`）
  - 控制函数长度（通常不超过 20 行）
  - 避免全局函数污染（使用模块化）


