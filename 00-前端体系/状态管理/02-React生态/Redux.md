# Redux 状态管理

> Redux 是一个可预测的状态管理容器，用于 JavaScript 应用。它帮助你编写行为一致、易于测试、在不同环境（客户端、服务器、原生应用）中运行的应用。

---

## 一、为什么需要 Redux？

### 问题场景

在大型 React 应用中，组件之间需要共享状态。如果通过 props 一层层传递，会导致：

- **Props 钻取**：中间组件不需要这些 props，却要传递
- **状态管理混乱**：状态分散在各个组件中，难以追踪和调试
- **组件耦合**：组件之间相互依赖，难以维护

### Redux 的解决方案

Redux 将应用的状态集中管理在一个 **Store**（仓库）中，所有组件都可以直接访问和修改状态，而不需要通过 props 传递。

---

## 二、核心概念（通俗理解）

### 1. Store（仓库）

**就像是一个全局的数据库**，存储整个应用的状态。

```javascript
// Store 就像一个对象
const store = {
  count: 0,
  user: { name: '张三', age: 25 },
  todos: []
}
```

### 2. Action（动作）

**描述"发生了什么"的普通对象**，就像是一个"事件通知"。

```javascript
// Action 必须有一个 type 字段，描述动作类型
const action = {
  type: 'INCREMENT',  // 动作类型：增加
  payload: 1          // 可选：携带的数据
}
```

### 3. Reducer（处理器）

**纯函数，根据 Action 来更新 State**，就像是一个"状态转换器"。

```javascript
// Reducer 接收当前 state 和 action，返回新的 state
function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 }
    case 'DECREMENT':
      return { count: state.count - 1 }
    default:
      return state
  }
}
```

### 4. Dispatch（派发）

**发送 Action 的方法**，组件通过 dispatch 来触发状态更新。

```javascript
// 组件调用 dispatch 发送 action
dispatch({ type: 'INCREMENT' })
```

---

## 三、数据流向（单向数据流）

```
┌─────────┐
│ 组件     │
│ (UI)    │
└────┬────┘
     │ dispatch(action)
     │
     ▼
┌─────────┐
│  Store  │
│         │
│  State  │ ◄─────── Reducer ──────── Action
│         │
└────┬────┘
     │ subscribe
     │
     ▼
┌─────────┐
│ 组件     │
│ (UI)    │
└─────────┘
```

**流程说明：**

1. 用户操作 → 组件调用 `dispatch(action)`
2. Store 接收 action → 调用 `reducer(state, action)`
3. Reducer 返回新 state → Store 更新
4. Store 通知所有订阅的组件 → 组件重新渲染

---

## 四、最小闭环 Demo

### 环境准备

```bash
npm install redux react-redux
```

### 完整代码示例

#### 1. 创建 Store 和 Reducer

```javascript
// store/counterReducer.js
const initialState = {
  count: 0
}

function counterReducer(state = initialState, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 }
    case 'DECREMENT':
      return { ...state, count: state.count - 1 }
    case 'RESET':
      return { ...state, count: 0 }
    default:
      return state
  }
}

export default counterReducer
```

```javascript
// store/index.js
import { createStore } from 'redux'
import counterReducer from './counterReducer'

// 创建 Store
const store = createStore(counterReducer)

export default store
```

#### 2. 创建 React 组件

```javascript
// components/Counter.jsx
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

function Counter() {
  // 从 Store 中获取状态
  const count = useSelector(state => state.count)
  
  // 获取 dispatch 方法
  const dispatch = useDispatch()

  return (
    <div>
      <h2>计数器: {count}</h2>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>
        +1
      </button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>
        -1
      </button>
      <button onClick={() => dispatch({ type: 'RESET' })}>
        重置
      </button>
    </div>
  )
}

export default Counter
```

#### 3. 连接 Redux 和 React

```javascript
// App.jsx
import React from 'react'
import { Provider } from 'react-redux'
import store from './store'
import Counter from './components/Counter'

function App() {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  )
}

export default App
```

#### 4. 入口文件

```javascript
// index.js
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)
```

---

## 五、核心原则

### 1. 单一数据源（Single Source of Truth）

整个应用的状态存储在一个 Store 中，便于调试和管理。

### 2. State 是只读的（State is Read-Only）

不能直接修改 State，只能通过 dispatch action 来更新。

```javascript
// ❌ 错误：直接修改 state
state.count = 10

// ✅ 正确：通过 dispatch action
dispatch({ type: 'INCREMENT' })
```

### 3. 使用纯函数进行修改（Changes are Made with Pure Functions）

Reducer 必须是纯函数：

- 相同输入 → 相同输出
- 不产生副作用（不修改外部变量、不发起网络请求等）
- 不修改原 state，返回新 state

```javascript
// ✅ 正确：纯函数
function reducer(state, action) {
  return { ...state, count: state.count + 1 }
}

// ❌ 错误：修改了原 state
function reducer(state, action) {
  state.count++  // 修改了原对象
  return state
}
```

---

## 六、最佳实践

### 1. Action Creator（动作创建函数）

将 action 的创建逻辑封装成函数，便于复用和维护。

```javascript
// actions/counterActions.js
export const increment = () => ({
  type: 'INCREMENT'
})

export const decrement = () => ({
  type: 'DECREMENT'
})

export const reset = () => ({
  type: 'RESET'
})

export const incrementByAmount = (amount) => ({
  type: 'INCREMENT_BY_AMOUNT',
  payload: amount
})
```

使用：

```javascript
import { increment, decrement } from './actions/counterActions'

dispatch(increment())
dispatch(decrement())
```

### 2. 多个 Reducer 合并（combineReducers）

当应用状态复杂时，可以拆分为多个 reducer，然后合并。

```javascript
// store/index.js
import { createStore, combineReducers } from 'redux'
import counterReducer from './counterReducer'
import userReducer from './userReducer'

const rootReducer = combineReducers({
  counter: counterReducer,
  user: userReducer
})

const store = createStore(rootReducer)

// 使用
const count = useSelector(state => state.counter.count)
const userName = useSelector(state => state.user.name)
```

### 3. Redux DevTools

安装 Redux DevTools 浏览器扩展，可以：

- 查看所有 action 和 state 变化
- 时间旅行调试（撤销/重做）
- 导出和导入 state

```javascript
// store/index.js
const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
```

---

## 七、常见问题

### Q1: Redux 和 Context API 有什么区别？

| 特性 | Redux | Context API |
|------|-------|-------------|
| 适用场景 | 大型应用，复杂状态管理 | 小型应用，简单状态共享 |
| 性能 | 精确订阅，只更新需要的组件 | 可能触发所有消费组件更新 |
| 调试 | 强大的 DevTools，时间旅行 | 相对简单 |
| 学习曲线 | 较陡 | 较平缓 |

### Q2: 什么时候应该使用 Redux？

**适合使用 Redux：**

- 应用状态需要全局共享
- 状态变化逻辑复杂
- 需要时间旅行调试
- 需要状态持久化

**不适合使用 Redux：**

- 简单的局部状态可以用 `useState`
- 组件间简单通信可以用 `Context API`
- 不需要复杂的状态管理

### Q3: 如何组织 Redux 代码结构？

推荐的文件结构：

```
src/
├── store/
│   ├── index.js          # Store 配置
│   ├── rootReducer.js    # 根 Reducer
│   └── slices/           # 功能模块
│       ├── counterSlice.js
│       └── userSlice.js
├── actions/              # Action Creators（可选）
│   └── counterActions.js
└── components/
    └── Counter.jsx
```

---

## 八、总结

### 核心要点

1. **Store**：存放全局状态
2. **Action**：描述状态变化
3. **Reducer**：纯函数，根据 action 更新 state
4. **Dispatch**：发送 action 的方法

### 数据流向

```
用户操作 → dispatch(action) → reducer → 新 state → 组件更新
```

### 三个原则

1. 单一数据源
2. State 只读
3. 纯函数修改

---

## 参考资料

- [Redux 官方文档](https://redux.js.org/)
- [Redux 中文文档](https://cn.redux.js.org/)
- [React-Redux 文档](https://react-redux.js.org/)

---

#redux #状态管理 #react #前端框架

