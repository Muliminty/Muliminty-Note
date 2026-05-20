---
title: "Redux-Saga Effect API 核心区别"
date: "2026-05-20"
tags: ["Redux-Saga", "状态管理", "异步处理"]
---

# Redux-Saga Effect API 核心区别

## 核心认知

Effect 是**纯描述对象**——你告诉 middleware "我想做什么"，middleware 负责执行。不同 Effect 描述不同的操作意图。

---

## 一句话速记

| Effect | 做什么 | 类比 |
|--------|--------|------|
| `call` | 调用函数，等结果回来 | 打电话给 API，**等**回复 |
| `put` | 派发 action 到 Store | 发短信通知 Reducer |
| `select` | 从 Store 读 state | 看一眼仓库现在什么状态 |
| `take` | 等待某个 action 被 dispatch | 守在门口**等**人来 |
| `fork` | 非阻塞启动子任务 | 派人去办事，自己**不等**，继续走 |
| `cancel` | 取消 fork 出去的任务 | 把派出去的人叫回来 |

---

## 阻塞 vs 非阻塞

```
阻塞（暂停当前 Saga，等完成才继续）
├── call    → 等函数执行完
├── take    → 等 action 到来
├── select  → 等获取 state（瞬时）
└── put     → 等 action 派发完成

非阻塞（不等，立即继续执行下一行）
├── fork    → 启动任务，不等它完成
├── spawn   → 启动完全独立的任务
└── cancel  → 发出取消信号
```

---

## 关键对比

### `call` vs 直接调用

```javascript
// 直接调用 — 立即执行，无法测试、无法取消
const user = yield api.getUser(userId)

// call — 生成描述对象，middleware 执行，可测试可取消
const user = yield call(api.getUser, userId)
```

`call` 只生成 `{ type: 'CALL', fn: api.getUser, args: [userId] }` 这样的纯对象。测试时直接比较对象，不需要 mock 网络请求。

### `put` vs `dispatch`

```javascript
// 组件里用 dispatch
dispatch({ type: 'FETCH_SUCCESS', payload: data })

// Saga 里用 put（效果完全一样）
yield put({ type: 'FETCH_SUCCESS', payload: data })
```

`put` 就是 Saga 版的 `dispatch`。

### `fork` vs `call`

```javascript
// call：阻塞 — 必须等 fetchUser 完成才执行下一行
yield call(fetchUser)
yield call(fetchPosts)     // 要等上面完成

// fork：非阻塞 — 两个任务并行执行
const task = yield fork(fetchUser)
yield fork(fetchPosts)     // 立即执行，不等上面
yield cancel(task)         // 后续可取消
```

### `take` vs `takeEvery`

```javascript
// take：底层原语，手动控制流程
function* loginFlow() {
  while (true) {
    const { payload } = yield take('LOGIN')    // 等登录
    yield call(api.login, payload)
    yield take('LOGOUT')                        // 等登出
    yield call(api.logout)
  }
}

// takeEvery：语法糖（= while + take + fork）
function* watchLogin() {
  yield takeEvery('LOGIN', loginSaga)
}
```

---

## 实际串联示例

```javascript
function* fetchUserSaga(action) {
  // select：从 Store 读数据
  const token = yield select(state => state.auth.token)

  // call：调用 API，阻塞等待返回值
  const user = yield call(api.getUser, action.payload.userId)

  // put：派发 action 给 Reducer，更新 Store
  yield put({ type: 'FETCH_USER_SUCCESS', payload: user })
}
```

---

## 心智模型

> `call` 是打电话等回复，`put` 是发短信通知，`take` 是守在门口等人来，`fork` 是派人去办事自己先走。

---

## 关联知识

- [Redux-Saga 中间件](../03-前端开发/02-前端框架/07-状态管理/02-React生态/Redux-Saga.md)
- [Redux 状态管理](../03-前端开发/02-前端框架/07-状态管理/02-React生态/Redux.md)
- [Redux dispatch 与 action 数据流](./20260520-Redux-dispatch与action数据流.md)
