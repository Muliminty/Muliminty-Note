---
title: "Redux-Saga 中间件"
date: "2026-05-20"
lastModified: "2026-05-20"
status: "成熟"
tags: ["Redux-Saga", "状态管理", "异步处理", "React"]
moc: "[[!MOC-状态管理]]"
stage: "框架进阶"
prerequisites: ["[[Redux]]"]
description: "Redux-Saga 完整知识体系，包含核心概念、Effect API、实战 Demo、高级模式与性能优化。"
aliases: ["Redux Saga", "Saga 中间件"]
toc: true
---

# Redux-Saga 中间件

> Redux-Saga 是一个用于管理 Redux 应用**副作用**的库。它让异步操作（如数据获取、缓存读写）变得更加优雅和易于测试。

## 📑 快速导航

- 🗺️ [Redux + Redux-Saga 完整学习路径](./!MOC-Redux学习路径.md) - **新手必看！系统学习指南**
- 📘 [Redux 基础文档](./Redux.md) - Redux 核心概念（学习 Saga 前必须掌握）

## ⚠️ 重要提示

**在学习 Redux-Saga 之前，你必须先掌握 Redux 基础！**

Redux-Saga 是 Redux 的中间件，用于处理 Redux 无法处理的异步操作。如果你还不熟悉 Redux，请先学习：

1. [Redux 核心概念](./Redux.md#二核心概念通俗理解)
2. [Redux 数据流](./Redux.md#三数据流向单向数据流)
3. [Redux 最小闭环 Demo](./Redux.md#四最小闭环-demo)

👉 **推荐学习路径**：[完整学习路径](./!MOC-Redux学习路径.md)

## 📑 目录

- [一、为什么需要 Redux-Saga？](#一为什么需要-redux-saga)
- [二、核心概念](#二核心概念通俗理解)
- [三、常用 Effect API](#三常用-effect-api)
- [四、最小闭环 Demo](#四最小闭环-demo)
- [五、实战 Demo 集合](#五实战-demo-集合)
- [六、数据流向](#六数据流向)
- [七、高级用法](#七高级用法)
- [八、实际应用场景](#八实际应用场景)
- [九、测试 Saga](#九测试-saga)
- [十、与 React Hooks 集成](#十与-react-hooks-集成)
- [十一、与 Redux Toolkit 集成](#十一与-redux-toolkit-集成)
- [十二、性能优化](#十二性能优化)
- [十三、常见问题与解决方案](#十三常见问题与解决方案)
- [十四、Redux-Saga vs Redux-Thunk](#十四redux-saga-vs-redux-thunk)
- [十五、最佳实践](#十五最佳实践)
- [十六、快速参考](#十六快速参考)
- [十七、总结](#十七总结)

## 🎯 学习路径

### 前置知识

在学习 Redux-Saga 之前，建议掌握以下知识：

1. **JavaScript 基础**
   - ES6+ 语法（箭头函数、解构、模块化）
   - Promise 和异步编程
   - **Generator 函数**（重要！）

2. **React 基础**
   - React 组件和生命周期
   - React Hooks（useState, useEffect, useSelector, useDispatch）
   - 组件通信和状态提升

3. **Redux 基础**
   - Redux 核心概念（Store, Action, Reducer）
   - Redux 数据流
   - React-Redux 使用

### 学习顺序

1. **基础阶段**：理解为什么需要 Redux-Saga → 掌握核心概念 → 完成最小闭环 Demo
2. **进阶阶段**：学习常用 Effect API → 掌握高级用法 → 了解实际应用场景
3. **实践阶段**：学习测试方法 → 与 React Hooks 集成 → 性能优化
4. **深入阶段**：解决常见问题 → 掌握最佳实践 → 项目实战

### 推荐资源

- [Generator 函数详解](https://es6.ruanyifeng.com/#docs/generator)
- [Redux 官方文档](https://redux.js.org/)
- [Redux-Saga 官方文档](https://redux-saga.js.org/)
- [Redux-Saga 中文文档](https://redux-saga-in-chinese.js.org/)

---

## 一、为什么需要 Redux-Saga？

### Redux 的局限性

> 💡 **前置知识**：如果你还不了解 Redux，请先学习 [Redux 基础文档](./Redux.md)

Redux 本身是**同步**的，但实际应用中经常需要：

- 发起异步请求（API 调用）
- 访问浏览器缓存（localStorage）
- 执行定时任务（setTimeout）
- 监听事件（WebSocket）

这些操作都是**副作用（Side Effects）**，不能直接放在 Reducer 中（因为 Reducer 必须是纯函数）。

#### Redux 的三个核心原则回顾

1. **单一数据源**：整个应用的状态存储在一个 Store 中
2. **State 是只读的**：只能通过 dispatch action 来更新
3. **使用纯函数进行修改**：Reducer 必须是纯函数

> ⚠️ **关键点**：因为 Reducer 必须是纯函数，所以**不能**在 Reducer 中执行异步操作或产生副作用。

### 解决方案对比

| 方案 | 说明 | 缺点 |
|------|------|------|
| 在组件中处理 | 在 `useEffect` 中调用 API | 逻辑分散，难以测试 |
| 在 Action Creator 中处理 | 使用 `redux-thunk` | 回调地狱，难以测试 |
| **Redux-Saga** | 使用 Generator 函数 | 声明式，易于测试和调试 ✅ |

---

## 二、核心概念（通俗理解）

### 1. Generator 函数

**可以暂停和恢复执行的函数**，用 `function*` 定义，使用 `yield` 暂停。

```javascript
// 普通函数：一次性执行完
function normalFunction() {
  console.log('1')
  console.log('2')
  return 'done'
}

// Generator 函数：可以暂停
function* generatorFunction() {
  console.log('1')
  yield '暂停在这里'
  console.log('2')
  yield '又暂停了'
  return 'done'
}

// 使用
const gen = generatorFunction()
gen.next()  // { value: '暂停在这里', done: false }
gen.next()  // { value: '又暂停了', done: false }
gen.next()  // { value: 'done', done: true }
```

### 2. Effect（效果）

**描述"想要做什么"的对象**，不会立即执行，而是告诉 Saga 中间件要执行的操作。

```javascript
// Effect：描述"调用 API"
import { call } from 'redux-saga/effects'

function* fetchUser() {
  const user = yield call(api.getUser, userId)  // call 创建 Effect
  // 实际执行：api.getUser(userId)
}
```

### 3. Saga（传奇）

**监听 Action 的 Generator 函数**，当特定 action 被 dispatch 时执行。

```javascript
import { takeEvery } from 'redux-saga/effects'

// 监听 'FETCH_USER' action
function* watchFetchUser() {
  yield takeEvery('FETCH_USER', fetchUserSaga)
}

function* fetchUserSaga(action) {
  // 处理异步逻辑
}
```

---

## 三、常用 Effect API

### 1. call - 调用函数

**异步调用函数（如 API 请求）**

```javascript
import { call } from 'redux-saga/effects'

function* fetchUser(action) {
  const user = yield call(api.getUser, action.payload.userId)
  // 等同于：api.getUser(action.payload.userId)
}
```

### 2. put - 派发 Action

**派发一个 action 到 Store**

```javascript
import { put } from 'redux-saga/effects'

function* fetchUser(action) {
  const user = yield call(api.getUser, action.payload.userId)
  yield put({ type: 'FETCH_USER_SUCCESS', payload: user })
  // 等同于：dispatch({ type: 'FETCH_USER_SUCCESS', payload: user })
}
```

### 3. takeEvery - 监听所有 Action

**每次 dispatch 该 action 时都执行**

```javascript
import { takeEvery } from 'redux-saga/effects'

function* watchFetchUser() {
  yield takeEvery('FETCH_USER', fetchUserSaga)
  // 每次 'FETCH_USER' 被 dispatch，都会执行 fetchUserSaga
}
```

### 4. takeLatest - 只执行最新的

**只执行最后一次 dispatch 的 action，取消之前的**

```javascript
import { takeLatest } from 'redux-saga/effects'

function* watchSearch() {
  yield takeLatest('SEARCH', searchSaga)
  // 如果快速连续 dispatch 多次 'SEARCH'，只执行最后一次
}
```

### 5. fork - 非阻塞调用

**非阻塞地执行一个 Saga**

```javascript
import { fork } from 'redux-saga/effects'

function* rootSaga() {
  yield fork(watchFetchUser)    // 非阻塞，继续执行
  yield fork(watchFetchPosts)   // 非阻塞，继续执行
}
```

### 6. all - 并行执行

**并行执行多个 Effect**

```javascript
import { all, call } from 'redux-saga/effects'

function* fetchAll() {
  const [user, posts] = yield all([
    call(api.getUser, userId),
    call(api.getPosts, userId)
  ])
  // 并行执行，等待全部完成
}
```

### 7. select - 获取 State

**从 Store 中获取当前 state**

```javascript
import { select } from 'redux-saga/effects'

function* updateUser() {
  const userId = yield select(state => state.user.id)
  // 获取 state.user.id
}
```

### 8. take - 等待 Action

**等待特定的 action 被 dispatch（只执行一次）**

```javascript
import { take, call } from 'redux-saga/effects'

function* loginFlow() {
  while (true) {
    // 等待 LOGIN action
    const { payload } = yield take('LOGIN')
    const token = yield call(api.login, payload)
    
    // 等待 LOGOUT action
    yield take('LOGOUT')
    yield call(api.logout, token)
  }
}
```

### 9. race - 竞态条件

**执行多个 Effect，只等待第一个完成（或失败）**

```javascript
import { race, call, put } from 'redux-saga/effects'

function* fetchWithTimeout(action) {
  const { data, timeout } = yield race({
    data: call(api.fetchData, action.payload),
    timeout: call(delay, 5000)  // 5秒超时
  })
  
  if (data) {
    yield put({ type: 'FETCH_SUCCESS', payload: data })
  } else {
    yield put({ type: 'FETCH_TIMEOUT' })
  }
}
```

### 10. retry - 重试机制

**失败时自动重试**

```javascript
import { retry, call } from 'redux-saga/effects'

function* fetchWithRetry() {
  try {
    // 最多重试 3 次，每次间隔 1000ms
    const data = yield retry(3, 1000, api.fetchData, userId)
    yield put({ type: 'FETCH_SUCCESS', payload: data })
  } catch (error) {
    yield put({ type: 'FETCH_FAILURE', payload: error })
  }
}
```

### 11. spawn - 分离任务

**创建一个完全独立的任务（无法被取消）**

```javascript
import { spawn, call } from 'redux-saga/effects'

function* rootSaga() {
  // spawn 创建的任务是独立的，即使父任务被取消也会继续执行
  yield spawn(loggerSaga)
  yield spawn(analyticsSaga)
}

function* loggerSaga() {
  while (true) {
    // 记录日志
  }
}
```

### 12. cancel - 取消任务

**取消一个正在运行的任务**

```javascript
import { fork, cancel, take } from 'redux-saga/effects'

function* watchFetch() {
  let task
  
  while (true) {
    const action = yield take('FETCH_START')
    
    // 如果已有任务在运行，先取消它
    if (task) {
      yield cancel(task)
    }
    
    // 启动新任务
    task = yield fork(fetchData, action)
  }
}
```

### 13. cancelled - 检查是否被取消

**检查当前任务是否被取消**

```javascript
import { cancelled, call, put } from 'redux-saga/effects'

function* fetchData() {
  try {
    const data = yield call(api.fetchData)
    yield put({ type: 'FETCH_SUCCESS', payload: data })
  } finally {
    // 检查是否被取消
    if (yield cancelled()) {
      console.log('任务被取消')
    }
  }
}
```

### 14. throttle - 节流

**限制执行频率（与 debounce 不同，throttle 会定期执行）**

```javascript
import { throttle, call, put } from 'redux-saga/effects'

function* searchSaga(action) {
  const results = yield call(api.search, action.payload.keyword)
  yield put({ type: 'SEARCH_SUCCESS', payload: results })
}

function* watchSearch() {
  // 节流：500ms 内最多执行一次
  yield throttle(500, 'SEARCH', searchSaga)
}
```

### 15. delay - 延迟

**延迟执行**

```javascript
import { delay, put } from 'redux-saga/effects'

function* delayedAction() {
  yield delay(1000)  // 延迟 1 秒
  yield put({ type: 'ACTION_AFTER_DELAY' })
}
```

### Effect API 对比表

| Effect | 说明 | 阻塞性 | 使用场景 |
|--------|------|--------|----------|
| `call` | 调用函数 | 阻塞 | API 调用、同步操作 |
| `put` | 派发 action | 阻塞 | 更新 store |
| `fork` | 非阻塞调用 | 非阻塞 | 启动后台任务 |
| `spawn` | 分离任务 | 非阻塞 | 完全独立的任务 |
| `take` | 等待 action | 阻塞 | 条件执行 |
| `takeEvery` | 监听所有 | 非阻塞 | 每次都要执行 |
| `takeLatest` | 只执行最新 | 非阻塞 | 搜索、表单提交 |
| `takeLeading` | 只执行第一个 | 非阻塞 | 防止重复请求 |
| `all` | 并行执行 | 阻塞 | 等待所有完成 |
| `race` | 竞态条件 | 阻塞 | 超时处理 |
| `select` | 获取 state | 阻塞 | 读取 store |
| `cancel` | 取消任务 | 阻塞 | 取消后台任务 |
| `debounce` | 防抖 | 非阻塞 | 搜索输入 |
| `throttle` | 节流 | 非阻塞 | 滚动事件 |

---

## 四、最小闭环 Demo

### 环境准备

```bash
npm install redux react-redux redux-saga
```

### 完整代码示例

#### 1. 创建 API 服务

```javascript
// api/userApi.js
// 模拟 API 调用
export const userApi = {
  getUser: (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: userId,
          name: '张三',
          age: 25
        })
      }, 1000)
    })
  }
}
```

#### 2. 创建 Redux Store 和 Reducer

```javascript
// store/userReducer.js
const initialState = {
  user: null,
  loading: false,
  error: null
}

function userReducer(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_USER_REQUEST':
      return { ...state, loading: true, error: null }
    case 'FETCH_USER_SUCCESS':
      return { ...state, loading: false, user: action.payload }
    case 'FETCH_USER_FAILURE':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

export default userReducer
```

#### 3. 创建 Saga

```javascript
// saga/userSaga.js
import { call, put, takeEvery } from 'redux-saga/effects'
import { userApi } from '../api/userApi'

// Worker Saga：处理具体的异步逻辑
function* fetchUser(action) {
  try {
    // 派发 loading 状态
    yield put({ type: 'FETCH_USER_REQUEST' })
    
    // 调用 API
    const user = yield call(userApi.getUser, action.payload.userId)
    
    // 成功：派发成功 action
    yield put({ type: 'FETCH_USER_SUCCESS', payload: user })
  } catch (error) {
    // 失败：派发错误 action
    yield put({ type: 'FETCH_USER_FAILURE', payload: error.message })
  }
}

// Watcher Saga：监听 action
function* watchFetchUser() {
  yield takeEvery('FETCH_USER', fetchUser)
}

export default watchFetchUser
```

#### 4. 创建根 Saga

```javascript
// saga/index.js
import { all } from 'redux-saga/effects'
import watchFetchUser from './userSaga'

// 根 Saga：组合所有 watcher
export default function* rootSaga() {
  yield all([
    watchFetchUser()
    // 可以添加更多 watcher
  ])
}
```

#### 5. 配置 Store

```javascript
// store/index.js
import { createStore, combineReducers, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import userReducer from './userReducer'
import rootSaga from '../saga'

// 创建 Saga 中间件
const sagaMiddleware = createSagaMiddleware()

// 合并 Reducer
const rootReducer = combineReducers({
  user: userReducer
})

// 创建 Store，应用 Saga 中间件
const store = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware)
)

// 运行根 Saga
sagaMiddleware.run(rootSaga)

export default store
```

#### 6. 创建 React 组件

```javascript
// components/UserProfile.jsx
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

function UserProfile() {
  const { user, loading, error } = useSelector(state => state.user)
  const dispatch = useDispatch()

  const handleFetchUser = () => {
    dispatch({ type: 'FETCH_USER', payload: { userId: 1 } })
  }

  return (
    <div>
      <button onClick={handleFetchUser} disabled={loading}>
        {loading ? '加载中...' : '获取用户信息'}
      </button>
      
      {error && <p style={{ color: 'red' }}>错误: {error}</p>}
      
      {user && (
        <div>
          <h3>用户信息</h3>
          <p>ID: {user.id}</p>
          <p>姓名: {user.name}</p>
          <p>年龄: {user.age}</p>
        </div>
      )}
    </div>
  )
}

export default UserProfile
```

#### 7. 连接应用

```javascript
// App.jsx
import React from 'react'
import { Provider } from 'react-redux'
import store from './store'
import UserProfile from './components/UserProfile'

function App() {
  return (
    <Provider store={store}>
      <UserProfile />
    </Provider>
  )
}

export default App
```

---

## 五、实战 Demo 集合

> 以下提供多个完整的、可直接运行的实战示例，每个示例都是独立的，可以直接复制使用。

### 📋 Demo 快速索引

| Demo | 功能 | 核心知识点 | 适用场景 |
|------|------|-----------|---------|
| [Demo 1: 用户登录](#demo-1-用户登录完整流程) | 登录/登出 | `call`, `put`, `takeEvery`, 错误处理 | 用户认证 |
| [Demo 2: 搜索功能](#demo-2-搜索功能防抖--取消) | 实时搜索 | `debounce`, `takeLatest` | 搜索框、筛选 |
| [Demo 3: 数据列表](#demo-3-数据列表加载更多) | 分页加载 | `select`, `takeEvery`, 无限滚动 | 列表页、数据展示 |
| [Demo 4: 表单提交](#demo-4-表单提交带验证和重试) | 表单处理 | `retry`, 错误重试 | 表单提交、数据创建 |
| [Demo 5: 实时更新](#demo-5-实时数据更新轮询) | 轮询更新 | `fork`, `cancel`, `cancelled`, 轮询 | 通知、实时数据 |
| [Demo 6: 综合示例](#demo-6-综合示例购物车--订单) | 购物车+订单 | 多 Saga 组合、跨模块通信 | 复杂业务场景 |

### 🚀 快速开始

1. **选择需要的 Demo**：根据你的业务场景选择对应的 Demo
2. **复制代码**：每个 Demo 都包含完整的文件结构
3. **安装依赖**：`npm install redux @reduxjs/toolkit react-redux redux-saga`
4. **运行测试**：每个 Demo 都可以独立运行

---

### Demo 1: 用户登录（完整流程）

#### 项目结构
```
src/
├── store/
│   ├── index.js
│   └── authSlice.js
├── saga/
│   ├── index.js
│   └── authSaga.js
├── api/
│   └── authApi.js
└── components/
    └── Login.jsx
```

#### 1. API 服务
```javascript
// api/authApi.js
export const authApi = {
  login: async (username, password) => {
    // 模拟 API 调用
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === 'admin' && password === '123456') {
          resolve({
            token: 'mock-jwt-token-12345',
            user: {
              id: 1,
              username: 'admin',
              name: '管理员'
            }
          })
        } else {
          reject(new Error('用户名或密码错误'))
        }
      }, 1000)
    })
  },
  
  logout: async (token) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 500)
    })
  }
}
```

#### 2. Redux Slice
```javascript
// store/authSlice.js
import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
    isAuthenticated: false
  },
  reducers: {
    loginRequest: (state) => {
      state.loading = true
      state.error = null
    },
    loginSuccess: (state, action) => {
      state.loading = false
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.error = null
    },
    loginFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
      state.isAuthenticated = false
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
    }
  }
})

export const { loginRequest, loginSuccess, loginFailure, logout } = authSlice.actions
export default authSlice.reducer
```

#### 3. Saga
```javascript
// saga/authSaga.js
import { call, put, takeEvery } from 'redux-saga/effects'
import { authApi } from '../api/authApi'
import { loginRequest, loginSuccess, loginFailure, logout } from '../store/authSlice'

// Worker Saga: 处理登录逻辑
function* loginSaga(action) {
  try {
    yield put(loginRequest())
    const { username, password } = action.payload
    
    const response = yield call(authApi.login, username, password)
    
    // 保存 token 到 localStorage
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(response.user))
    
    yield put(loginSuccess(response))
  } catch (error) {
    yield put(loginFailure(error.message))
  }
}

// Worker Saga: 处理登出逻辑
function* logoutSaga() {
  try {
    const token = localStorage.getItem('token')
    if (token) {
      yield call(authApi.logout, token)
    }
    
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    yield put(logout())
  } catch (error) {
    console.error('登出失败:', error)
    // 即使 API 失败，也清除本地数据
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    yield put(logout())
  }
}

// Watcher Saga: 监听 action
function* watchAuth() {
  yield takeEvery('LOGIN', loginSaga)
  yield takeEvery('LOGOUT', logoutSaga)
}

export default watchAuth
```

#### 4. Store 配置
```javascript
// store/index.js
import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import authReducer from './authSlice'
import rootSaga from '../saga'

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: {
    auth: authReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware)
})

sagaMiddleware.run(rootSaga)
```

#### 5. React 组件
```javascript
// components/Login.jsx
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  
  const dispatch = useDispatch()
  const { loading, error, isAuthenticated, user } = useSelector(state => state.auth)

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch({ type: 'LOGIN', payload: { username, password } })
  }

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' })
  }

  if (isAuthenticated) {
    return (
      <div>
        <h2>欢迎, {user?.name}!</h2>
        <button onClick={handleLogout}>登出</button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>登录</h2>
      
      {error && <div style={{ color: 'red' }}>{error}</div>}
      
      <div>
        <label>
          用户名:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
        </label>
      </div>
      
      <div>
        <label>
          密码:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </label>
      </div>
      
      <button type="submit" disabled={loading}>
        {loading ? '登录中...' : '登录'}
      </button>
      
      <p style={{ fontSize: '12px', color: '#666' }}>
        提示: 用户名: admin, 密码: 123456
      </p>
    </form>
  )
}

export default Login
```

#### 6. 根 Saga
```javascript
// saga/index.js
import { all } from 'redux-saga/effects'
import watchAuth from './authSaga'

export default function* rootSaga() {
  yield all([
    watchAuth()
  ])
}
```

---

### Demo 2: 搜索功能（防抖 + 取消）

#### 1. API 服务
```javascript
// api/searchApi.js
export const searchApi = {
  search: async (keyword) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = [
          { id: 1, title: `${keyword} 相关结果 1` },
          { id: 2, title: `${keyword} 相关结果 2` },
          { id: 3, title: `${keyword} 相关结果 3` }
        ]
        resolve(results)
      }, 500)
    })
  }
}
```

#### 2. Redux Slice
```javascript
// store/searchSlice.js
import { createSlice } from '@reduxjs/toolkit'

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    keyword: '',
    results: [],
    loading: false,
    error: null
  },
  reducers: {
    setKeyword: (state, action) => {
      state.keyword = action.payload
    },
    searchRequest: (state) => {
      state.loading = true
      state.error = null
    },
    searchSuccess: (state, action) => {
      state.loading = false
      state.results = action.payload
    },
    searchFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    clearResults: (state) => {
      state.results = []
      state.keyword = ''
    }
  }
})

export const { setKeyword, searchRequest, searchSuccess, searchFailure, clearResults } = searchSlice.actions
export default searchSlice.reducer
```

#### 3. Saga（带防抖）
```javascript
// saga/searchSaga.js
import { call, put, debounce } from 'redux-saga/effects'
import { searchApi } from '../api/searchApi'
import { searchRequest, searchSuccess, searchFailure } from '../store/searchSlice'

function* searchSaga(action) {
  const keyword = action.payload
  
  // 如果关键词为空，不搜索
  if (!keyword || keyword.trim() === '') {
    yield put({ type: 'CLEAR_RESULTS' })
    return
  }
  
  try {
    yield put(searchRequest())
    const results = yield call(searchApi.search, keyword)
    yield put(searchSuccess(results))
  } catch (error) {
    yield put(searchFailure(error.message))
  }
}

function* watchSearch() {
  // 防抖：500ms 内只执行一次
  yield debounce(500, 'SEARCH', searchSaga)
}

export default watchSearch
```

#### 4. React 组件
```javascript
// components/Search.jsx
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setKeyword, clearResults } from '../store/searchSlice'

function Search() {
  const [inputValue, setInputValue] = useState('')
  const dispatch = useDispatch()
  const { results, loading, keyword } = useSelector(state => state.search)

  useEffect(() => {
    // 当输入值改变时，触发搜索
    dispatch({ type: 'SEARCH', payload: inputValue })
  }, [inputValue, dispatch])

  const handleClear = () => {
    setInputValue('')
    dispatch(clearResults())
  }

  return (
    <div>
      <div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="输入搜索关键词..."
        />
        <button onClick={handleClear}>清除</button>
      </div>

      {loading && <div>搜索中...</div>}

      {results.length > 0 && (
        <ul>
          {results.map(item => (
            <li key={item.id}>{item.title}</li>
          ))}
        </ul>
      )}

      {!loading && keyword && results.length === 0 && (
        <div>没有找到相关结果</div>
      )}
    </div>
  )
}

export default Search
```

---

### Demo 3: 数据列表（加载更多）

#### 1. API 服务
```javascript
// api/postApi.js
export const postApi = {
  getPosts: async (page = 1, pageSize = 10) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const posts = Array.from({ length: pageSize }, (_, i) => ({
          id: (page - 1) * pageSize + i + 1,
          title: `文章 ${(page - 1) * pageSize + i + 1}`,
          content: `这是第 ${(page - 1) * pageSize + i + 1} 篇文章的内容`
        }))
        resolve({
          posts,
          hasMore: page < 5, // 假设只有 5 页数据
          page
        })
      }, 800)
    })
  }
}
```

#### 2. Redux Slice
```javascript
// store/postSlice.js
import { createSlice } from '@reduxjs/toolkit'

const postSlice = createSlice({
  name: 'post',
  initialState: {
    posts: [],
    page: 1,
    hasMore: true,
    loading: false,
    error: null
  },
  reducers: {
    fetchPostsRequest: (state) => {
      state.loading = true
      state.error = null
    },
    fetchPostsSuccess: (state, action) => {
      state.loading = false
      if (action.payload.page === 1) {
        state.posts = action.payload.posts
      } else {
        state.posts = [...state.posts, ...action.payload.posts]
      }
      state.page = action.payload.page
      state.hasMore = action.payload.hasMore
    },
    fetchPostsFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    resetPosts: (state) => {
      state.posts = []
      state.page = 1
      state.hasMore = true
    }
  }
})

export const { fetchPostsRequest, fetchPostsSuccess, fetchPostsFailure, resetPosts } = postSlice.actions
export default postSlice.reducer
```

#### 3. Saga
```javascript
// saga/postSaga.js
import { call, put, takeEvery, select } from 'redux-saga/effects'
import { postApi } from '../api/postApi'
import { fetchPostsRequest, fetchPostsSuccess, fetchPostsFailure } from '../store/postSlice'

function* fetchPostsSaga(action) {
  try {
    yield put(fetchPostsRequest())
    
    // 获取当前页码
    const currentPage = yield select(state => state.post.page)
    const page = action.payload?.page || currentPage
    
    const response = yield call(postApi.getPosts, page, 10)
    
    yield put(fetchPostsSuccess({
      posts: response.posts,
      page: response.page,
      hasMore: response.hasMore
    }))
  } catch (error) {
    yield put(fetchPostsFailure(error.message))
  }
}

function* watchPosts() {
  yield takeEvery('FETCH_POSTS', fetchPostsSaga)
}

export default watchPosts
```

#### 4. React 组件
```javascript
// components/PostList.jsx
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { resetPosts } from '../store/postSlice'

function PostList() {
  const dispatch = useDispatch()
  const { posts, loading, hasMore, error } = useSelector(state => state.post)
  const observerRef = useRef()

  useEffect(() => {
    // 初始加载
    dispatch({ type: 'FETCH_POSTS', payload: { page: 1 } })
    
    return () => {
      dispatch(resetPosts())
    }
  }, [dispatch])

  useEffect(() => {
    // 无限滚动：当滚动到底部时加载更多
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          dispatch({ type: 'FETCH_POSTS' })
        }
      },
      { threshold: 1.0 }
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current)
      }
    }
  }, [hasMore, loading, dispatch])

  return (
    <div>
      <h2>文章列表</h2>
      
      {error && <div style={{ color: 'red' }}>错误: {error}</div>}
      
      <ul>
        {posts.map(post => (
          <li key={post.id} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd' }}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>

      {loading && <div>加载中...</div>}
      
      {!hasMore && posts.length > 0 && <div>没有更多数据了</div>}
      
      <div ref={observerRef} style={{ height: '20px' }} />
    </div>
  )
}

export default PostList
```

---

### Demo 4: 表单提交（带验证和重试）

#### 1. API 服务
```javascript
// api/formApi.js
export const formApi = {
  submitForm: async (formData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 模拟随机失败（30% 失败率）
        if (Math.random() < 0.3) {
          reject(new Error('提交失败，请重试'))
        } else {
          resolve({
            success: true,
            message: '提交成功',
            data: formData
          })
        }
      }, 1500)
    })
  }
}
```

#### 2. Redux Slice
```javascript
// store/formSlice.js
import { createSlice } from '@reduxjs/toolkit'

const formSlice = createSlice({
  name: 'form',
  initialState: {
    submitting: false,
    success: false,
    error: null,
    retryCount: 0
  },
  reducers: {
    submitRequest: (state) => {
      state.submitting = true
      state.error = null
      state.success = false
    },
    submitSuccess: (state) => {
      state.submitting = false
      state.success = true
      state.error = null
      state.retryCount = 0
    },
    submitFailure: (state, action) => {
      state.submitting = false
      state.error = action.payload
      state.success = false
    },
    setRetryCount: (state, action) => {
      state.retryCount = action.payload
    },
    resetForm: (state) => {
      state.submitting = false
      state.success = false
      state.error = null
      state.retryCount = 0
    }
  }
})

export const { submitRequest, submitSuccess, submitFailure, setRetryCount, resetForm } = formSlice.actions
export default formSlice.reducer
```

#### 3. Saga（带重试）
```javascript
// saga/formSaga.js
import { call, put, retry, takeEvery, delay } from 'redux-saga/effects'
import { formApi } from '../api/formApi'
import { submitRequest, submitSuccess, submitFailure, setRetryCount } from '../store/formSlice'

function* submitFormSaga(action) {
  try {
    yield put(submitRequest())
    
    // 最多重试 3 次，每次间隔 1000ms
    const response = yield retry(3, 1000, formApi.submitForm, action.payload)
    
    yield put(submitSuccess())
    
    // 3 秒后重置表单状态
    yield delay(3000)
    yield put({ type: 'RESET_FORM' })
  } catch (error) {
    // 计算重试次数
    const retryCount = error.message.includes('retry') ? 3 : 0
    yield put(setRetryCount(retryCount))
    yield put(submitFailure(error.message))
  }
}

function* watchForm() {
  yield takeEvery('SUBMIT_FORM', submitFormSaga)
}

export default watchForm
```

#### 4. React 组件
```javascript
// components/ContactForm.jsx
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { resetForm } from '../store/formSlice'

function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  
  const dispatch = useDispatch()
  const { submitting, success, error, retryCount } = useSelector(state => state.form)

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // 简单验证
    if (!name || !email || !message) {
      alert('请填写所有字段')
      return
    }
    
    dispatch({
      type: 'SUBMIT_FORM',
      payload: { name, email, message }
    })
  }

  const handleReset = () => {
    setName('')
    setEmail('')
    setMessage('')
    dispatch(resetForm())
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>联系我们</h2>
      
      {success && (
        <div style={{ color: 'green', padding: '10px', background: '#e8f5e9' }}>
          提交成功！我们会尽快回复您。
        </div>
      )}
      
      {error && (
        <div style={{ color: 'red', padding: '10px', background: '#ffebee' }}>
          错误: {error}
          {retryCount > 0 && <div>已重试 {retryCount} 次</div>}
        </div>
      )}
      
      <div>
        <label>
          姓名:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={submitting}
            required
          />
        </label>
      </div>
      
      <div>
        <label>
          邮箱:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
            required
          />
        </label>
      </div>
      
      <div>
        <label>
          留言:
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={submitting}
            required
          />
        </label>
      </div>
      
      <button type="submit" disabled={submitting}>
        {submitting ? '提交中...' : '提交'}
      </button>
      
      <button type="button" onClick={handleReset} disabled={submitting}>
        重置
      </button>
    </form>
  )
}

export default ContactForm
```

---

### Demo 5: 实时数据更新（轮询）

#### 1. API 服务
```javascript
// api/notificationApi.js
export const notificationApi = {
  getNotifications: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const notifications = [
          { id: Date.now(), message: `新通知 ${new Date().toLocaleTimeString()}` }
        ]
        resolve(notifications)
      }, 1000)
    })
  }
}
```

#### 2. Redux Slice
```javascript
// store/notificationSlice.js
import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    notifications: [],
    unreadCount: 0,
    polling: false
  },
  reducers: {
    startPolling: (state) => {
      state.polling = true
    },
    stopPolling: (state) => {
      state.polling = false
    },
    addNotifications: (state, action) => {
      const newNotifications = action.payload
      // 去重：只添加新的通知
      const existingIds = new Set(state.notifications.map(n => n.id))
      const uniqueNew = newNotifications.filter(n => !existingIds.has(n.id))
      state.notifications = [...uniqueNew, ...state.notifications]
      state.unreadCount = state.notifications.length
    },
    markAsRead: (state) => {
      state.unreadCount = 0
    }
  }
})

export const { startPolling, stopPolling, addNotifications, markAsRead } = notificationSlice.actions
export default notificationSlice.reducer
```

#### 3. Saga（轮询）
```javascript
// saga/notificationSaga.js
import { call, put, delay, take, cancelled, fork, cancel } from 'redux-saga/effects'
import { notificationApi } from '../api/notificationApi'
import { addNotifications } from '../store/notificationSlice'

function* pollNotifications() {
  try {
    while (true) {
      const notifications = yield call(notificationApi.getNotifications)
      yield put(addNotifications(notifications))
      yield delay(5000) // 每 5 秒轮询一次
    }
  } finally {
    if (yield cancelled()) {
      console.log('轮询已取消')
    }
  }
}

function* watchNotifications() {
  while (true) {
    // 等待开始轮询
    yield take('START_POLLING')
    const task = yield fork(pollNotifications)
    
    // 等待停止轮询
    yield take('STOP_POLLING')
    yield cancel(task)
  }
}

export default watchNotifications
```

#### 4. React 组件
```javascript
// components/NotificationCenter.jsx
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { markAsRead, startPolling, stopPolling } from '../store/notificationSlice'

function NotificationCenter() {
  const dispatch = useDispatch()
  const { notifications, unreadCount, polling } = useSelector(state => state.notification)

  useEffect(() => {
    // 组件挂载时开始轮询
    dispatch({ type: 'START_POLLING' })
    
    return () => {
      // 组件卸载时停止轮询
      dispatch({ type: 'STOP_POLLING' })
    }
  }, [dispatch])

  const handleMarkAsRead = () => {
    dispatch(markAsRead())
  }

  return (
    <div>
      <h2>
        通知中心
        {unreadCount > 0 && (
          <span style={{ marginLeft: '10px', color: 'red' }}>
            ({unreadCount} 条未读)
          </span>
        )}
        {polling && <span style={{ fontSize: '12px', color: '#666' }}> (实时更新中...)</span>}
      </h2>
      
      <button onClick={handleMarkAsRead} disabled={unreadCount === 0}>
        标记为已读
      </button>
      
      <ul>
        {notifications.map(notification => (
          <li key={notification.id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
            {notification.message}
          </li>
        ))}
      </ul>
      
      {notifications.length === 0 && <div>暂无通知</div>}
    </div>
  )
}

export default NotificationCenter
```

---

### 快速开始指南

#### 1. 安装依赖
```bash
npm install redux @reduxjs/toolkit react-redux redux-saga
```

#### 2. 选择 Demo
选择一个你需要的 Demo，复制对应的文件到你的项目中。

#### 3. 配置 Store
确保在 `store/index.js` 中正确配置了 Saga 中间件。

#### 4. 运行
在 React 组件中使用 `Provider` 包裹应用：
```javascript
import { Provider } from 'react-redux'
import { store } from './store'
import Login from './components/Login'

function App() {
  return (
    <Provider store={store}>
      <Login />
    </Provider>
  )
}
```

#### 5. 测试
每个 Demo 都可以独立运行，直接复制代码即可使用。

---

### Demo 6: 综合示例（购物车 + 订单）

这是一个综合示例，展示如何在一个项目中组合使用多个 Saga。

#### 项目结构
```
src/
├── store/
│   ├── index.js
│   ├── cartSlice.js
│   └── orderSlice.js
├── saga/
│   ├── index.js
│   ├── cartSaga.js
│   └── orderSaga.js
├── api/
│   ├── cartApi.js
│   └── orderApi.js
└── components/
    ├── Cart.jsx
    └── Checkout.jsx
```

#### 1. API 服务
```javascript
// api/cartApi.js
export const cartApi = {
  getCart: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          items: [
            { id: 1, name: '商品1', price: 99, quantity: 2 },
            { id: 2, name: '商品2', price: 199, quantity: 1 }
          ]
        })
      }, 500)
    })
  },
  
  updateCartItem: async (itemId, quantity) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, itemId, quantity })
      }, 300)
    })
  },
  
  removeCartItem: async (itemId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, itemId })
      }, 300)
    })
  }
}

// api/orderApi.js
export const orderApi = {
  createOrder: async (orderData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.2) {
          resolve({
            orderId: `ORDER-${Date.now()}`,
            ...orderData,
            status: 'pending',
            createdAt: new Date().toISOString()
          })
        } else {
          reject(new Error('创建订单失败'))
        }
      }, 1500)
    })
  },
  
  getOrderStatus: async (orderId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          orderId,
          status: 'completed',
          updatedAt: new Date().toISOString()
        })
      }, 1000)
    })
  }
}
```

#### 2. Redux Slices
```javascript
// store/cartSlice.js
import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    fetchCartRequest: (state) => {
      state.loading = true
    },
    fetchCartSuccess: (state, action) => {
      state.loading = false
      state.items = action.payload
    },
    fetchCartFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    updateItemQuantity: (state, action) => {
      const { itemId, quantity } = action.payload
      const item = state.items.find(item => item.id === itemId)
      if (item) {
        item.quantity = quantity
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload)
    },
    clearCart: (state) => {
      state.items = []
    }
  }
})

export const { 
  fetchCartRequest, 
  fetchCartSuccess, 
  fetchCartFailure,
  updateItemQuantity,
  removeItem,
  clearCart
} = cartSlice.actions

export default cartSlice.reducer

// store/orderSlice.js
import { createSlice } from '@reduxjs/toolkit'

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    currentOrder: null,
    orders: [],
    loading: false,
    error: null
  },
  reducers: {
    createOrderRequest: (state) => {
      state.loading = true
      state.error = null
    },
    createOrderSuccess: (state, action) => {
      state.loading = false
      state.currentOrder = action.payload
      state.orders.push(action.payload)
    },
    createOrderFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    checkOrderStatus: (state, action) => {
      const order = state.orders.find(o => o.orderId === action.payload.orderId)
      if (order) {
        order.status = action.payload.status
      }
    }
  }
})

export const { 
  createOrderRequest, 
  createOrderSuccess, 
  createOrderFailure,
  checkOrderStatus
} = orderSlice.actions

export default orderSlice.reducer
```

#### 3. Sagas
```javascript
// saga/cartSaga.js
import { call, put, takeEvery, select } from 'redux-saga/effects'
import { cartApi } from '../api/cartApi'
import { fetchCartRequest, fetchCartSuccess, fetchCartFailure, updateItemQuantity, removeItem } from '../store/cartSlice'

function* fetchCartSaga() {
  try {
    yield put(fetchCartRequest())
    const response = yield call(cartApi.getCart)
    yield put(fetchCartSuccess(response.items))
  } catch (error) {
    yield put(fetchCartFailure(error.message))
  }
}

function* updateCartItemSaga(action) {
  try {
    const { itemId, quantity } = action.payload
    yield call(cartApi.updateCartItem, itemId, quantity)
    yield put(updateItemQuantity({ itemId, quantity }))
  } catch (error) {
    console.error('更新购物车失败:', error)
  }
}

function* removeCartItemSaga(action) {
  try {
    const itemId = action.payload
    yield call(cartApi.removeCartItem, itemId)
    yield put(removeItem(itemId))
  } catch (error) {
    console.error('删除商品失败:', error)
  }
}

function* watchCart() {
  yield takeEvery('FETCH_CART', fetchCartSaga)
  yield takeEvery('UPDATE_CART_ITEM', updateCartItemSaga)
  yield takeEvery('REMOVE_CART_ITEM', removeCartItemSaga)
}

export default watchCart

// saga/orderSaga.js
import { call, put, takeEvery, select, delay } from 'redux-saga/effects'
import { orderApi } from '../api/orderApi'
import { createOrderRequest, createOrderSuccess, createOrderFailure, checkOrderStatus } from '../store/orderSlice'
import { clearCart } from '../store/cartSlice'

function* createOrderSaga(action) {
  try {
    yield put(createOrderRequest())
    
    // 获取购物车数据
    const cartItems = yield select(state => state.cart.items)
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    
    const orderData = {
      items: cartItems,
      total,
      shippingAddress: action.payload.shippingAddress,
      paymentMethod: action.payload.paymentMethod
    }
    
    const order = yield call(orderApi.createOrder, orderData)
    yield put(createOrderSuccess(order))
    
    // 创建订单成功后，清空购物车
    yield put(clearCart())
    
    // 模拟订单状态更新（实际应该通过 WebSocket 或轮询）
    yield delay(3000)
    const statusUpdate = yield call(orderApi.getOrderStatus, order.orderId)
    yield put(checkOrderStatus(statusUpdate))
  } catch (error) {
    yield put(createOrderFailure(error.message))
  }
}

function* watchOrder() {
  yield takeEvery('CREATE_ORDER', createOrderSaga)
}

export default watchOrder
```

#### 4. Store 配置
```javascript
// store/index.js
import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import cartReducer from './cartSlice'
import orderReducer from './orderSlice'
import rootSaga from '../saga'

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    order: orderReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware)
})

sagaMiddleware.run(rootSaga)

// saga/index.js
import { all } from 'redux-saga/effects'
import watchCart from './cartSaga'
import watchOrder from './orderSaga'

export default function* rootSaga() {
  yield all([
    watchCart(),
    watchOrder()
  ])
}
```

#### 5. React 组件
```javascript
// components/Cart.jsx
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

function Cart() {
  const dispatch = useDispatch()
  const { items, loading } = useSelector(state => state.cart)

  useEffect(() => {
    dispatch({ type: 'FETCH_CART' })
  }, [dispatch])

  const handleQuantityChange = (itemId, quantity) => {
    if (quantity <= 0) {
      dispatch({ type: 'REMOVE_CART_ITEM', payload: itemId })
    } else {
      dispatch({ type: 'UPDATE_CART_ITEM', payload: { itemId, quantity } })
    }
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div>
      <h2>购物车</h2>
      {loading && <div>加载中...</div>}
      <ul>
        {items.map(item => (
          <li key={item.id}>
            <span>{item.name} - ¥{item.price}</span>
            <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
            <span>{item.quantity}</span>
            <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
            <button onClick={() => handleQuantityChange(item.id, 0)}>删除</button>
          </li>
        ))}
      </ul>
      <div>总计: ¥{total}</div>
    </div>
  )
}

export default Cart

// components/Checkout.jsx
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createOrderRequest } from '../store/orderSlice'

function Checkout() {
  const [address, setAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('credit-card')
  
  const dispatch = useDispatch()
  const { loading, error, currentOrder } = useSelector(state => state.order)
  const { items } = useSelector(state => state.cart)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!address) {
      alert('请填写收货地址')
      return
    }
    dispatch({
      type: 'CREATE_ORDER',
      payload: { shippingAddress: address, paymentMethod }
    })
  }

  if (currentOrder) {
    return (
      <div>
        <h2>订单创建成功！</h2>
        <p>订单号: {currentOrder.orderId}</p>
        <p>状态: {currentOrder.status}</p>
      </div>
    )
  }

  if (items.length === 0) {
    return <div>购物车为空，无法结账</div>
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>结账</h2>
      
      {error && <div style={{ color: 'red' }}>{error}</div>}
      
      <div>
        <label>
          收货地址:
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            disabled={loading}
            required
          />
        </label>
      </div>
      
      <div>
        <label>
          支付方式:
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            disabled={loading}
          >
            <option value="credit-card">信用卡</option>
            <option value="alipay">支付宝</option>
            <option value="wechat">微信支付</option>
          </select>
        </label>
      </div>
      
      <button type="submit" disabled={loading}>
        {loading ? '创建订单中...' : '提交订单'}
      </button>
    </form>
  )
}

export default Checkout
```

#### 6. 使用示例
```javascript
// App.jsx
import React from 'react'
import { Provider } from 'react-redux'
import { store } from './store'
import Cart from './components/Cart'
import Checkout from './components/Checkout'

function App() {
  return (
    <Provider store={store}>
      <div>
        <Cart />
        <Checkout />
      </div>
    </Provider>
  )
}

export default App
```

---

### 实战 Demo 总结

以上 6 个 Demo 涵盖了 Redux-Saga 的常见使用场景：

1. **Demo 1 - 用户登录**：基础异步操作、错误处理、localStorage 操作
2. **Demo 2 - 搜索功能**：防抖、取消重复请求
3. **Demo 3 - 数据列表**：分页加载、无限滚动
4. **Demo 4 - 表单提交**：重试机制、表单验证
5. **Demo 5 - 实时更新**：轮询、任务取消
6. **Demo 6 - 综合示例**：多个 Saga 组合、跨模块通信

每个 Demo 都是完整的、可运行的代码，可以直接复制到项目中使用。

---

## 六、数据流向

```
┌─────────────┐
│  组件 (UI)   │
└──────┬──────┘
       │ dispatch({ type: 'FETCH_USER', payload: { userId: 1 } })
       │
       ▼
┌─────────────┐
│    Store    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Saga 中间件 │
│             │
│  watchFetch │ ──► 监听到 'FETCH_USER'
│  User       │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ fetchUser   │ ──► 调用 API
│  Saga       │
└──────┬──────┘
       │
       │ put({ type: 'FETCH_USER_SUCCESS', payload: user })
       │
       ▼
┌─────────────┐
│    Store    │ ──► 更新 State
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  组件 (UI)   │ ──► 重新渲染
└─────────────┘
```

---

## 七、高级用法

### 1. 处理多个异步操作

```javascript
import { all, call, put } from 'redux-saga/effects'

function* fetchUserDashboard(action) {
  try {
    // 并行执行多个 API 调用
    const [user, posts, comments] = yield all([
      call(api.getUser, action.payload.userId),
      call(api.getPosts, action.payload.userId),
      call(api.getComments, action.payload.userId)
    ])
    
    yield put({
      type: 'FETCH_DASHBOARD_SUCCESS',
      payload: { user, posts, comments }
    })
  } catch (error) {
    yield put({ type: 'FETCH_DASHBOARD_FAILURE', payload: error.message })
  }
}
```

### 2. 取消任务（takeLatest）

```javascript
import { takeLatest, call } from 'redux-saga/effects'

function* searchSaga(action) {
  try {
    const results = yield call(api.search, action.payload.keyword)
    yield put({ type: 'SEARCH_SUCCESS', payload: results })
  } catch (error) {
    yield put({ type: 'SEARCH_FAILURE', payload: error.message })
  }
}

function* watchSearch() {
  // 如果用户快速输入，只执行最后一次搜索
  yield takeLatest('SEARCH', searchSaga)
}
```

### 3. 条件执行（take）

```javascript
import { take, call } from 'redux-saga/effects'

function* loginFlow() {
  while (true) {
    // 等待 LOGIN action
    const { payload } = yield take('LOGIN')
    
    // 执行登录
    const token = yield call(api.login, payload)
    
    // 等待 LOGOUT action
    yield take('LOGOUT')
    
    // 执行登出
    yield call(api.logout, token)
  }
}
```

### 4. 防抖（debounce）

```javascript
import { debounce, call, put } from 'redux-saga/effects'

function* searchSaga(action) {
  const results = yield call(api.search, action.payload.keyword)
  yield put({ type: 'SEARCH_SUCCESS', payload: results })
}

function* watchSearch() {
  // 防抖：500ms 内只执行一次
  yield debounce(500, 'SEARCH', searchSaga)
}
```

### 5. 节流（throttle）

```javascript
import { throttle, call, put } from 'redux-saga/effects'

function* scrollSaga() {
  const position = yield select(state => state.scrollPosition)
  yield call(api.saveScrollPosition, position)
}

function* watchScroll() {
  // 节流：每 1000ms 最多执行一次
  yield throttle(1000, 'SCROLL', scrollSaga)
}
```

### 6. 超时处理（race）

```javascript
import { race, call, put, delay } from 'redux-saga/effects'

function* fetchWithTimeout(action) {
  const { data, timeout } = yield race({
    data: call(api.fetchData, action.payload),
    timeout: delay(5000)  // 5秒超时
  })
  
  if (data) {
    yield put({ type: 'FETCH_SUCCESS', payload: data })
  } else {
    yield put({ type: 'FETCH_TIMEOUT' })
  }
}
```

### 7. 重试机制（retry）

```javascript
import { retry, call, put } from 'redux-saga/effects'

function* fetchWithRetry(action) {
  try {
    // 最多重试 3 次，每次间隔 1000ms
    const data = yield retry(3, 1000, api.fetchData, action.payload)
    yield put({ type: 'FETCH_SUCCESS', payload: data })
  } catch (error) {
    yield put({ type: 'FETCH_FAILURE', payload: error.message })
  }
}
```

### 8. 任务取消

```javascript
import { fork, cancel, take } from 'redux-saga/effects'

function* watchFetch() {
  let task
  
  while (true) {
    const action = yield take('FETCH_START')
    
    // 如果已有任务在运行，先取消它
    if (task) {
      yield cancel(task)
    }
    
    // 启动新任务
    task = yield fork(fetchData, action)
  }
}

function* fetchData(action) {
  try {
    const data = yield call(api.fetchData, action.payload)
    yield put({ type: 'FETCH_SUCCESS', payload: data })
  } catch (error) {
    yield put({ type: 'FETCH_FAILURE', payload: error.message })
  } finally {
    if (yield cancelled()) {
      console.log('任务被取消')
    }
  }
}
```

### 9. 条件监听（take 模式匹配）

```javascript
import { take, call } from 'redux-saga/effects'

function* watchLogin() {
  while (true) {
    // 只监听特定条件的 action
    const action = yield take(action => 
      action.type === 'LOGIN' && action.payload.username
    )
    
    yield call(handleLogin, action)
  }
}
```

### 10. 监听多个 Action（take 数组）

```javascript
import { take } from 'redux-saga/effects'

function* watchMultipleActions() {
  while (true) {
    // 监听多个 action，返回第一个匹配的
    const action = yield take(['LOGIN', 'LOGOUT', 'REGISTER'])
    
    switch (action.type) {
      case 'LOGIN':
        yield call(handleLogin, action)
        break
      case 'LOGOUT':
        yield call(handleLogout, action)
        break
      case 'REGISTER':
        yield call(handleRegister, action)
        break
    }
  }
}
```

---

## 八、实际应用场景

### 1. WebSocket 连接管理

```javascript
import { take, call, put, fork, cancel } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'

// 创建 WebSocket 通道
function createWebSocketChannel(url) {
  return eventChannel(emitter => {
    const ws = new WebSocket(url)
    
    ws.onopen = () => {
      emitter({ type: 'WS_OPEN' })
    }
    
    ws.onmessage = (event) => {
      emitter({ type: 'WS_MESSAGE', payload: JSON.parse(event.data) })
    }
    
    ws.onerror = (error) => {
      emitter({ type: 'WS_ERROR', payload: error })
    }
    
    ws.onclose = () => {
      emitter({ type: 'WS_CLOSE' })
    }
    
    // 返回清理函数
    return () => {
      ws.close()
    }
  })
}

function* watchWebSocket() {
  const channel = yield call(createWebSocketChannel, 'ws://localhost:8080')
  
  try {
    while (true) {
      const event = yield take(channel)
      
      switch (event.type) {
        case 'WS_MESSAGE':
          yield put({ type: 'RECEIVE_MESSAGE', payload: event.payload })
          break
        case 'WS_ERROR':
          yield put({ type: 'WS_ERROR', payload: event.payload })
          break
        default:
          yield put(event)
      }
    }
  } finally {
    channel.close()
  }
}

function* rootSaga() {
  const wsTask = yield fork(watchWebSocket)
  
  // 当需要断开连接时
  yield take('WS_DISCONNECT')
  yield cancel(wsTask)
}
```

### 2. 轮询（Polling）

```javascript
import { call, put, delay, take, cancelled } from 'redux-saga/effects'

function* pollData() {
  try {
    while (true) {
      const data = yield call(api.fetchData)
      yield put({ type: 'DATA_RECEIVED', payload: data })
      yield delay(5000)  // 每 5 秒轮询一次
    }
  } finally {
    if (yield cancelled()) {
      console.log('轮询已取消')
    }
  }
}

function* watchPolling() {
  while (true) {
    yield take('START_POLLING')
    const task = yield fork(pollData)
    
    yield take('STOP_POLLING')
    yield cancel(task)
  }
}
```

### 3. 文件上传（带进度）

```javascript
import { call, put, takeEvery } from 'redux-saga/effects'
import { eventChannel, END } from 'redux-saga'

function createUploadChannel(file) {
  return eventChannel(emitter => {
    const xhr = new XMLHttpRequest()
    
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100)
        emitter({ type: 'PROGRESS', payload: percent })
      }
    })
    
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        emitter({ type: 'SUCCESS', payload: JSON.parse(xhr.responseText) })
      } else {
        emitter({ type: 'ERROR', payload: xhr.statusText })
      }
      emitter(END)  // 关闭通道
    })
    
    xhr.addEventListener('error', () => {
      emitter({ type: 'ERROR', payload: '上传失败' })
      emitter(END)
    })
    
    xhr.open('POST', '/api/upload')
    const formData = new FormData()
    formData.append('file', file)
    xhr.send(formData)
    
    return () => {
      xhr.abort()
    }
  })
}

function* uploadFile(action) {
  const channel = yield call(createUploadChannel, action.payload.file)
  
  try {
    while (true) {
      const event = yield take(channel)
      
      switch (event.type) {
        case 'PROGRESS':
          yield put({ type: 'UPLOAD_PROGRESS', payload: event.payload })
          break
        case 'SUCCESS':
          yield put({ type: 'UPLOAD_SUCCESS', payload: event.payload })
          break
        case 'ERROR':
          yield put({ type: 'UPLOAD_ERROR', payload: event.payload })
          break
      }
    }
  } finally {
    channel.close()
  }
}

function* watchUpload() {
  yield takeEvery('UPLOAD_FILE', uploadFile)
}
```

### 4. 请求缓存

```javascript
import { call, put, select } from 'redux-saga/effects'

function* fetchUserWithCache(action) {
  const { userId } = action.payload
  
  // 检查缓存
  const cachedUser = yield select(state => state.userCache[userId])
  const cacheTime = yield select(state => state.userCacheTime[userId])
  const now = Date.now()
  
  // 如果缓存存在且未过期（5分钟内）
  if (cachedUser && (now - cacheTime < 5 * 60 * 1000)) {
    yield put({ type: 'FETCH_USER_SUCCESS', payload: cachedUser })
    return
  }
  
  // 从 API 获取
  try {
    const user = yield call(api.getUser, userId)
    yield put({ type: 'FETCH_USER_SUCCESS', payload: user })
    yield put({ type: 'CACHE_USER', payload: { userId, user } })
  } catch (error) {
    yield put({ type: 'FETCH_USER_FAILURE', payload: error.message })
  }
}
```

### 5. 批量请求处理

```javascript
import { call, put, all } from 'redux-saga/effects'

function* batchFetchUsers(action) {
  const { userIds } = action.payload
  
  // 分批处理，每批 10 个
  const batchSize = 10
  const batches = []
  
  for (let i = 0; i < userIds.length; i += batchSize) {
    batches.push(userIds.slice(i, i + batchSize))
  }
  
  // 逐批处理
  for (const batch of batches) {
    const results = yield all(
      batch.map(userId => call(api.getUser, userId))
    )
    
    yield put({ type: 'BATCH_FETCH_SUCCESS', payload: results })
  }
}
```

### 6. 错误重试与降级

```javascript
import { call, put, retry, delay } from 'redux-saga/effects'

function* fetchWithFallback(action) {
  try {
    // 尝试主 API，最多重试 2 次
    const data = yield retry(2, 1000, api.fetchData, action.payload)
    yield put({ type: 'FETCH_SUCCESS', payload: data })
  } catch (error) {
    // 主 API 失败，尝试备用 API
    try {
      const fallbackData = yield call(api.fetchDataFallback, action.payload)
      yield put({ type: 'FETCH_SUCCESS', payload: fallbackData })
      yield put({ type: 'SHOW_WARNING', payload: '使用备用数据源' })
    } catch (fallbackError) {
      // 备用 API 也失败，使用缓存
      const cachedData = yield select(state => state.cache[action.payload.id])
      if (cachedData) {
        yield put({ type: 'FETCH_SUCCESS', payload: cachedData })
        yield put({ type: 'SHOW_WARNING', payload: '使用缓存数据' })
      } else {
        yield put({ type: 'FETCH_FAILURE', payload: fallbackError.message })
      }
    }
  }
}
```

---

## 九、测试 Saga

Saga 的纯函数特性使其易于测试。推荐使用 `redux-saga-test-plan` 进行测试。

### 1. 基础测试

```javascript
import { call, put } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import { fetchUser } from './userSaga'
import { userApi } from '../api/userApi'

test('fetchUser saga 成功场景', () => {
  const mockUser = { id: 1, name: '张三', age: 25 }
  
  return expectSaga(fetchUser, { payload: { userId: 1 } })
    .provide([
      [call(userApi.getUser, 1), mockUser]
    ])
    .put({ type: 'FETCH_USER_REQUEST' })
    .put({ type: 'FETCH_USER_SUCCESS', payload: mockUser })
    .run()
})

test('fetchUser saga 失败场景', () => {
  const error = new Error('网络错误')
  
  return expectSaga(fetchUser, { payload: { userId: 1 } })
    .provide([
      [call(userApi.getUser, 1), Promise.reject(error)]
    ])
    .put({ type: 'FETCH_USER_REQUEST' })
    .put({ type: 'FETCH_USER_FAILURE', payload: '网络错误' })
    .run()
})
```

### 2. 测试带 State 的 Saga

```javascript
import { select, call, put } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'

function* updateUser(action) {
  const currentUser = yield select(state => state.user)
  const updatedUser = yield call(api.updateUser, currentUser.id, action.payload)
  yield put({ type: 'UPDATE_USER_SUCCESS', payload: updatedUser })
}

test('updateUser saga', () => {
  const initialState = {
    user: { id: 1, name: '张三' }
  }
  
  const updatedUser = { id: 1, name: '李四' }
  
  return expectSaga(updateUser, { payload: { name: '李四' } })
    .withState(initialState)
    .provide([
      [select(state => state.user), initialState.user],
      [call(api.updateUser, 1, { name: '李四' }), updatedUser]
    ])
    .put({ type: 'UPDATE_USER_SUCCESS', payload: updatedUser })
    .run()
})
```

### 3. 测试并发 Saga

```javascript
import { all, call } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'

function* fetchDashboard(userId) {
  const [user, posts, comments] = yield all([
    call(api.getUser, userId),
    call(api.getPosts, userId),
    call(api.getComments, userId)
  ])
  
  return { user, posts, comments }
}

test('fetchDashboard saga', () => {
  const mockData = {
    user: { id: 1, name: '张三' },
    posts: [{ id: 1, title: '文章1' }],
    comments: [{ id: 1, content: '评论1' }]
  }
  
  return expectSaga(fetchDashboard, 1)
    .provide([
      [call(api.getUser, 1), mockData.user],
      [call(api.getPosts, 1), mockData.posts],
      [call(api.getComments, 1), mockData.comments]
    ])
    .returns(mockData)
    .run()
})
```

### 4. 使用 Jest Mock

```javascript
import { call, put } from 'redux-saga/effects'
import { runSaga } from 'redux-saga'
import { fetchUser } from './userSaga'
import * as userApi from '../api/userApi'

test('使用 runSaga 测试', async () => {
  const mockUser = { id: 1, name: '张三' }
  const getUserSpy = jest.spyOn(userApi, 'getUser').mockResolvedValue(mockUser)
  
  const dispatched = []
  const saga = runSaga(
    {
      dispatch: (action) => dispatched.push(action),
      getState: () => ({})
    },
    fetchUser,
    { payload: { userId: 1 } }
  )
  
  await saga.toPromise()
  
  expect(getUserSpy).toHaveBeenCalledWith(1)
  expect(dispatched).toContainEqual({ type: 'FETCH_USER_SUCCESS', payload: mockUser })
  
  getUserSpy.mockRestore()
})
```

---

## 十、与 React Hooks 集成

### 1. 使用 useSelector 和 useDispatch

```javascript
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

function UserProfile() {
  const { user, loading, error } = useSelector(state => state.user)
  const dispatch = useDispatch()

  const handleFetchUser = () => {
    dispatch({ type: 'FETCH_USER', payload: { userId: 1 } })
  }

  return (
    <div>
      <button onClick={handleFetchUser} disabled={loading}>
        {loading ? '加载中...' : '获取用户信息'}
      </button>
      {error && <p style={{ color: 'red' }}>错误: {error}</p>}
      {user && <div>用户: {user.name}</div>}
    </div>
  )
}
```

### 2. 自定义 Hook 封装

```javascript
// hooks/useUser.js
import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'

export function useUser() {
  const { user, loading, error } = useSelector(state => state.user)
  const dispatch = useDispatch()

  const fetchUser = useCallback((userId) => {
    dispatch({ type: 'FETCH_USER', payload: { userId } })
  }, [dispatch])

  const updateUser = useCallback((userData) => {
    dispatch({ type: 'UPDATE_USER', payload: userData })
  }, [dispatch])

  return {
    user,
    loading,
    error,
    fetchUser,
    updateUser
  }
}

// 使用
function UserProfile() {
  const { user, loading, fetchUser } = useUser()

  return (
    <div>
      <button onClick={() => fetchUser(1)} disabled={loading}>
        获取用户
      </button>
      {user && <div>{user.name}</div>}
    </div>
  )
}
```

### 3. 在 useEffect 中触发 Saga

```javascript
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

function UserProfile({ userId }) {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch({ type: 'FETCH_USER', payload: { userId } })
  }, [userId, dispatch])

  // ...
}
```

---

## 十一、与 Redux Toolkit 集成

Redux Toolkit (RTK) 是 Redux 官方推荐的工具集，可以与 Redux-Saga 完美配合使用。

### 1. 配置 Store

```javascript
// store/index.js
import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import userReducer from './userSlice'
import rootSaga from '../saga'

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: {
    user: userReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware)
})

sagaMiddleware.run(rootSaga)
```

### 2. 使用 createSlice

```javascript
// store/userSlice.js
import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    loading: false,
    error: null
  },
  reducers: {
    fetchUserRequest: (state) => {
      state.loading = true
      state.error = null
    },
    fetchUserSuccess: (state, action) => {
      state.loading = false
      state.user = action.payload
    },
    fetchUserFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    }
  }
})

export const { fetchUserRequest, fetchUserSuccess, fetchUserFailure } = userSlice.actions
export default userSlice.reducer
```

### 3. Saga 中使用 RTK Actions

```javascript
// saga/userSaga.js
import { call, put, takeEvery } from 'redux-saga/effects'
import { fetchUserRequest, fetchUserSuccess, fetchUserFailure } from '../store/userSlice'
import { userApi } from '../api/userApi'

function* fetchUser(action) {
  try {
    yield put(fetchUserRequest())
    const user = yield call(userApi.getUser, action.payload.userId)
    yield put(fetchUserSuccess(user))
  } catch (error) {
    yield put(fetchUserFailure(error.message))
  }
}

function* watchFetchUser() {
  yield takeEvery('FETCH_USER', fetchUser)
}

export default watchFetchUser
```

---

## 十二、性能优化

### 1. 使用 takeLatest 避免重复请求

```javascript
// 搜索场景：只执行最后一次搜索
function* watchSearch() {
  yield takeLatest('SEARCH', searchSaga)
}
```

### 2. 使用缓存减少请求

```javascript
function* fetchUserWithCache(action) {
  const { userId } = action.payload
  const cachedUser = yield select(state => state.userCache[userId])
  
  if (cachedUser) {
    yield put({ type: 'FETCH_USER_SUCCESS', payload: cachedUser })
    return
  }
  
  const user = yield call(api.getUser, userId)
  yield put({ type: 'CACHE_USER', payload: { userId, user } })
  yield put({ type: 'FETCH_USER_SUCCESS', payload: user })
}
```

### 3. 批量处理请求

```javascript
// 避免频繁的小请求，改为批量请求
function* batchFetchUsers(action) {
  const { userIds } = action.payload
  
  // 分批处理，每批 10 个
  const batchSize = 10
  for (let i = 0; i < userIds.length; i += batchSize) {
    const batch = userIds.slice(i, i + batchSize)
    const results = yield all(
      batch.map(userId => call(api.getUser, userId))
    )
    yield put({ type: 'BATCH_FETCH_SUCCESS', payload: results })
  }
}
```

### 4. 及时取消不需要的任务

```javascript
function* watchFetch() {
  let task
  
  while (true) {
    const action = yield take('FETCH_START')
    
    // 取消之前的任务
    if (task) {
      yield cancel(task)
    }
    
    task = yield fork(fetchData, action)
  }
}
```

### 5. 使用 select 优化

```javascript
// 使用 selector 函数，避免不必要的重新计算
import { createSelector } from 'reselect'

const selectUser = state => state.user
const selectUserId = createSelector(
  [selectUser],
  user => user.id
)

function* updateUser() {
  const userId = yield select(selectUserId)  // 使用 memoized selector
  // ...
}
```

---

## 十三、常见问题与解决方案

### 1. Saga 不执行

**问题**：Saga 没有响应 action

**解决方案**：
- 检查 `sagaMiddleware.run(rootSaga)` 是否已调用
- 检查 action type 是否匹配
- 检查 watcher saga 是否正确注册

```javascript
// 确保 rootSaga 正确导出和运行
export default function* rootSaga() {
  yield all([
    watchFetchUser(),
    watchFetchPosts()
  ])
}
```

### 2. 任务无法取消

**问题**：使用 `cancel` 无法取消任务

**解决方案**：
- 确保使用 `fork` 而不是 `call` 创建任务
- 在 finally 块中检查 `cancelled()`

```javascript
function* fetchData() {
  try {
    const data = yield call(api.fetchData)
    yield put({ type: 'FETCH_SUCCESS', payload: data })
  } finally {
    if (yield cancelled()) {
      console.log('任务已取消')
    }
  }
}
```

### 3. 内存泄漏

**问题**：长时间运行的任务导致内存泄漏

**解决方案**：
- 及时清理 eventChannel
- 取消不需要的任务
- 避免在 while(true) 循环中创建大量对象

```javascript
function* watchWebSocket() {
  const channel = yield call(createWebSocketChannel, url)
  
  try {
    while (true) {
      const event = yield take(channel)
      // 处理事件
    }
  } finally {
    channel.close()  // 确保清理
  }
}
```

### 4. 测试困难

**问题**：Saga 测试复杂

**解决方案**：
- 使用 `redux-saga-test-plan`
- 使用 `provide` 模拟 Effect
- 分离业务逻辑和 Effect

```javascript
// 将业务逻辑提取为纯函数
function processUserData(user) {
  return {
    ...user,
    displayName: `${user.firstName} ${user.lastName}`
  }
}

// Saga 只负责协调
function* fetchUser(action) {
  const user = yield call(api.getUser, action.payload.userId)
  const processedUser = processUserData(user)  // 纯函数，易于测试
  yield put({ type: 'FETCH_USER_SUCCESS', payload: processedUser })
}
```

### 5. 错误处理不统一

**问题**：每个 Saga 都要写 try-catch

**解决方案**：
- 创建统一的错误处理 Saga
- 使用 `onError` 钩子

```javascript
// 统一错误处理
function* errorHandler(error) {
  console.error('Saga 错误:', error)
  yield put({ type: 'SHOW_ERROR', payload: error.message })
}

// 在创建 middleware 时配置
const sagaMiddleware = createSagaMiddleware({
  onError: (error) => {
    console.error('未捕获的 Saga 错误:', error)
  }
})
```

---

## 十四、Redux-Saga vs Redux-Thunk

| 特性 | Redux-Saga | Redux-Thunk |
|------|------------|-------------|
| 学习曲线 | 较陡（需要理解 Generator） | 较平缓 |
| 代码风格 | 声明式（Effect） | 命令式（回调） |
| 测试 | 非常容易（纯函数） | 相对困难 |
| 取消任务 | 原生支持 | 需要手动实现 |
| 并发控制 | 强大的 API | 需要手动管理 |
| 适用场景 | 复杂异步逻辑 | 简单异步操作 |

---

## 十五、最佳实践

### 1. 文件结构

```
src/
├── store/
│   ├── index.js
│   └── userReducer.js
├── saga/
│   ├── index.js          # rootSaga
│   ├── userSaga.js       # 用户相关 saga
│   └── postSaga.js       # 文章相关 saga
├── api/
│   └── userApi.js
└── components/
    └── UserProfile.jsx
```

### 2. 错误处理

```javascript
function* fetchUser(action) {
  try {
    const user = yield call(api.getUser, action.payload.userId)
    yield put({ type: 'FETCH_USER_SUCCESS', payload: user })
  } catch (error) {
    // 统一错误处理
    yield put({ type: 'FETCH_USER_FAILURE', payload: error.message })
    yield put({ type: 'SHOW_ERROR_TOAST', payload: '获取用户信息失败' })
  }
}
```

### 3. 加载状态管理

```javascript
// 使用统一的 loading 状态
function* fetchUser(action) {
  yield put({ type: 'SET_LOADING', payload: true })
  try {
    const user = yield call(api.getUser, action.payload.userId)
    yield put({ type: 'FETCH_USER_SUCCESS', payload: user })
  } finally {
    yield put({ type: 'SET_LOADING', payload: false })
  }
}
```

---

## 十六、快速参考

### Effect API 速查表

| API | 说明 | 示例 |
|-----|------|------|
| `call(fn, ...args)` | 调用函数（阻塞） | `yield call(api.getUser, userId)` |
| `put(action)` | 派发 action | `yield put({ type: 'SUCCESS' })` |
| `take(pattern)` | 等待 action | `yield take('LOGIN')` |
| `takeEvery(pattern, saga)` | 监听所有 | `yield takeEvery('FETCH', saga)` |
| `takeLatest(pattern, saga)` | 只执行最新 | `yield takeLatest('SEARCH', saga)` |
| `takeLeading(pattern, saga)` | 只执行第一个 | `yield takeLeading('FETCH', saga)` |
| `fork(saga, ...args)` | 非阻塞调用 | `yield fork(watchUser)` |
| `spawn(saga, ...args)` | 分离任务 | `yield spawn(loggerSaga)` |
| `all([...effects])` | 并行执行 | `yield all([call(fn1), call(fn2)])` |
| `race({...effects})` | 竞态条件 | `yield race({ data: call(api), timeout: delay(5000) })` |
| `select(selector)` | 获取 state | `yield select(state => state.user)` |
| `cancel(task)` | 取消任务 | `yield cancel(task)` |
| `cancelled()` | 检查是否取消 | `if (yield cancelled()) { ... }` |
| `delay(ms)` | 延迟 | `yield delay(1000)` |
| `debounce(ms, pattern, saga)` | 防抖 | `yield debounce(500, 'SEARCH', saga)` |
| `throttle(ms, pattern, saga)` | 节流 | `yield throttle(1000, 'SCROLL', saga)` |
| `retry(times, delay, fn, ...args)` | 重试 | `yield retry(3, 1000, api.fetch)` |

### 常用模式

#### 1. 标准异步请求模式

```javascript
function* fetchData(action) {
  try {
    yield put({ type: 'FETCH_REQUEST' })
    const data = yield call(api.fetchData, action.payload)
    yield put({ type: 'FETCH_SUCCESS', payload: data })
  } catch (error) {
    yield put({ type: 'FETCH_FAILURE', payload: error.message })
  }
}
```

#### 2. 带超时的请求

```javascript
function* fetchWithTimeout(action) {
  const { data, timeout } = yield race({
    data: call(api.fetchData, action.payload),
    timeout: delay(5000)
  })
  
  if (data) {
    yield put({ type: 'FETCH_SUCCESS', payload: data })
  } else {
    yield put({ type: 'FETCH_TIMEOUT' })
  }
}
```

#### 3. 条件执行

```javascript
function* conditionalFlow() {
  while (true) {
    const action = yield take('ACTION')
    const condition = yield select(state => state.someCondition)
    
    if (condition) {
      yield call(handleAction, action)
    }
  }
}
```

#### 4. 任务取消

```javascript
function* watchWithCancel() {
  let task
  
  while (true) {
    const action = yield take('START')
    if (task) yield cancel(task)
    task = yield fork(handleTask, action)
  }
}
```

#### 5. 批量处理

```javascript
function* batchProcess(action) {
  const items = action.payload
  const batchSize = 10
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    yield all(batch.map(item => call(processItem, item)))
  }
}
```

---

## 十七、总结

### 核心要点

1. **Saga**：使用 Generator 函数处理副作用
2. **Effect**：描述操作的对象，不立即执行
3. **Watcher**：监听 action 的 Saga
4. **Worker**：处理具体逻辑的 Saga

### 数据流向

```
Action → Saga 中间件 → Worker Saga → API → put Action → Store → 组件更新
```

### 优势

- ✅ 声明式代码，易于理解
- ✅ 纯函数，易于测试
- ✅ 强大的并发控制
- ✅ 支持取消任务
- ✅ 优秀的错误处理

---

## 参考资料

- [Redux-Saga 官方文档](https://redux-saga.js.org/)
- [Redux-Saga 中文文档](https://redux-saga-in-chinese.js.org/)
- [Generator 函数](https://es6.ruanyifeng.com/#docs/generator)

---

## 相关文档

- 🗺️ [Redux + Redux-Saga 完整学习路径](./!MOC-Redux学习路径.md) - 系统学习指南
- 📘 [Redux 基础文档](./Redux.md) - Redux 核心概念（学习 Saga 前必须掌握）

---


