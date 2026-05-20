---
title: "Redux dispatch 与 action 数据流"
date: "2026-05-20"
tags: ["Redux", "状态管理", "前端开发"]
---

# Redux dispatch 与 action 数据流

## 一句话理解

Store 是状态仓库，你不能直接改它，只能通过发"指令单"（action）让仓库管理员（Reducer）来改。发出指令单这个动作叫 **dispatch（派发）**。

---

## 银行账户类比

```
你（组件） →→ 提交操作单（dispatch action） →→ 柜台人员（Reducer） →→ 更新余额（Store）
```

- **Store**：银行账户余额
- **Action**：一张操作单（写着"存款 100 元"）
- **Reducer**：柜台工作人员，按操作单规则改余额
- **dispatch**：把操作单递给柜台

---

## 为什么不能直接改

```javascript
// 直接改（禁止）
store.balance = 1000

// 提交指令单（正确）
dispatch({ type: '存款', payload: 1000 })
```

因为走 dispatch 有三个好处：

- **可追踪**：每张"指令单"都被记录，DevTools 能看到所有操作历史
- **可预测**：同样的 state + 同样的 action = 永远相同的结果
- **可撤销**：知道每一步做了什么，就能"时间旅行"回退

---

## 完整数据流

```
1. 用户点击按钮
2. dispatch({ type: '存款', payload: 100 })     ← 发出指令单
3. Reducer 收到指令单，计算：0 + 100 = 100       ← 纯函数处理
4. Store 更新：balance = 100                     ← 状态变更
5. 组件自动重新渲染，显示 "余额：100"             ← UI 响应
```

---

## 在代码中的样子

```javascript
// Reducer：按指令单规则处理
function accountReducer(state = { balance: 0 }, action) {
  switch (action.type) {
    case '存款':
      return { balance: state.balance + action.payload }
    case '取款':
      return { balance: state.balance - action.payload }
    default:
      return state  // 不认识的单子，原样返回
  }
}

// 组件：读状态 + 发指令单
function BankApp() {
  const balance = useSelector(state => state.balance)  // 读余额
  const dispatch = useDispatch()                        // 拿到"发单子"的能力

  return (
    <div>
      <p>余额：{balance}</p>
      <button onClick={() => dispatch({ type: '存款', payload: 100 })}>
        存 100 元
      </button>
    </div>
  )
}
```

---

## Saga 里的 `put` 就是 `dispatch`

在 Saga 中不能直接调 `dispatch`，要用 `put` 代替，效果完全一样：

```javascript
// 组件里
dispatch({ type: '存款', payload: 100 })

// Saga 里（效果一模一样）
yield put({ type: '存款', payload: 100 })
```

---

## 关联知识

- [Redux 状态管理](../03-前端开发/02-前端框架/07-状态管理/02-React生态/Redux.md)
- [Redux-Saga 中间件](../03-前端开发/02-前端框架/07-状态管理/02-React生态/Redux-Saga.md)
