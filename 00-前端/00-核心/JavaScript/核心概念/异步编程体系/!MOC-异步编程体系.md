+ !MOC-异步编程体系
	+ 事件循环
	+ 消息队列
	+ 宏任务和微任务
	+ promise
	+ async await
	+ 生成器（Generator）




#### 1. ​**基础机制层**​

- ​**1.1 事件循环 (Event Loop)​**​
    - 浏览器/Node.js 的事件循环模型差异（补充环境差异）
    - 执行栈 (Call Stack) 与任务队列的协作关系
- ​**1.2 任务队列分层**​
    - ​**宏任务 (MacroTask)​**​
        - 常见类型：`script`（整体代码）、`setTimeout`、`setInterval`、I/O 操作、UI 渲染、`setImmediate`（Node.js）
        - 调度规则：每个宏任务结束后会清空微任务队列
    - ​**微任务 (MicroTask)​**​
        - 常见类型：`Promise.then`、`MutationObserver`、`queueMicrotask`、`process.nextTick`（Node.js）
        - 优先级：微任务队列在渲染前清空，确保高优先级任务优先执行

#### 2. ​**异步编程范式**​

- ​**2.1 回调模式 (Callback)​**​
    - 基础但易导致回调地狱（补充缺点）
    - 错误处理机制：`try/catch` 无法捕获异步错误（需补充错误优先回调）
- ​**2.2 Promise**​
    - 状态机模型：`pending` → `fulfilled`/`rejected`（补充状态不可逆特性）
    - 链式调用与穿透机制（`.then()` 返回新 Promise）
    - 静态方法：`Promise.all`/`race`/`allSettled`/`any`
- ​**2.3 Generator 与协程**​
    - 生成器函数：`function*` 与 `yield` 的暂停/恢复机制
    - 与异步结合：通过手动调用 `next()` 或配合自动执行器（如 `co` 库）
    - 协程概念：单线程下的协作式多任务（补充与线程的对比）
- ​**2.4 Async/Await**​
    - 语法糖本质：基于 Generator + Promise 的封装
    - 错误处理：`try/catch` 捕获异步异常（补充同步化错误处理优势）
    - 顶层 Await：ES2022 在模块中的支持

#### 3. ​**进阶与生态**​

- ​**3.1 浏览器与 Node.js 差异**​
    - 浏览器：宏任务区分 `requestAnimationFrame` 与任务队列优先级
    - Node.js：`libuv` 引擎的 6 个任务阶段（如 `poll`、`check` 等）
- ​**3.2 性能与陷阱**​
    - 任务饥饿：微任务嵌套导致主线程阻塞（如递归调用 `queueMicrotask`）
    - 渲染时机：宏任务与 `requestAnimationFrame` 的协作优化
- ​**3.3 现代异步模式**​
    - ​**异步迭代器 (Async Iterators)​**​：`for await...of` 遍历异步数据流
    - ​**Web Workers**​：多线程异步（补充与事件循环的关系）
    - ​**AbortController**​：取消异步操作（如取消 Fetch 请求）

#### 4. ​**可视化与调试**​

- ​**4.1 工具辅助**​
    - 浏览器 Performance 面板分析任务调度
    - Node.js 的 `--trace-event-categories` 标志跟踪事件循环
- ​**4.2 代码示例**​
    - 经典面试题解析（如 `setTimeout vs Promise` 执行顺序）
    - 手写简易 Event Loop 模拟器（理解调度逻辑）
