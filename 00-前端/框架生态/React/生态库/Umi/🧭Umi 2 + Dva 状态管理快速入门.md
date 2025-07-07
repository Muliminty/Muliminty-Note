
## 一、基础概念

### ✅ Umi 是什么？

Umi 是蚂蚁金服出品的企业级前端应用框架，底层基于 React，整合了路由、构建、状态管理（默认集成 dva）等常用功能。

### ✅ Dva 是什么？

Dva 是一个基于 Redux 和 Redux-saga 的轻量级状态管理框架，特点是：

- 支持 model 的组织形式（state + reducer + effect）
    
- 简化 Redux 复杂配置
    
- 支持插件机制
    
- 内置 `redux-saga`
    

---

## 二、基本使用流程

### 1. 安装依赖（Umi 2 通常已内置 Dva）

如果你是裸项目：

```bash
yarn add umi@2 dva
```

如果是通过 `umi create` 创建的项目，可以直接使用 Dva。

---

## 三、Dva 核心组成

一个 `model` 文件结构如下：

```js
export default {
  namespace: 'count', // 模块名称

  state: {
    number: 0,
  },

  reducers: {
    add(state) {
      return { ...state, number: state.number + 1 };
    },
  },

  effects: {
    *addAsync(_, { call, put }) {
      yield call(delay, 1000);
      yield put({ type: 'add' });
    },
  },
};
```

### 各部分说明：

|部分|说明|
|---|---|
|`namespace`|model 的唯一标识，调用方法时需要用|
|`state`|模块初始状态|
|`reducers`|同步操作（对应 Redux 的 reducer）|
|`effects`|异步操作，基于 `redux-saga`|

---

## 四、使用步骤详解

### Step 1️⃣ 创建 Model

在 `src/models/count.js` 中：

```js
export default {
  namespace: 'count',
  state: {
    number: 0,
  },
  reducers: {
    increment(state) {
      return { ...state, number: state.number + 1 };
    },
  },
  effects: {
    *incrementAsync(_, { call, put }) {
      yield call(delay, 1000);
      yield put({ type: 'increment' });
    },
  },
};

// 工具函数
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

Umi 2 会自动加载 `src/models` 下的 model 文件。

---

### Step 2️⃣ 在组件中使用

```jsx
import React from 'react';
import { connect } from 'dva';

function Counter({ number, dispatch }) {
  return (
    <div>
      <h2>{number}</h2>
      <button onClick={() => dispatch({ type: 'count/increment' })}>加1</button>
      <button onClick={() => dispatch({ type: 'count/incrementAsync' })}>异步加1</button>
    </div>
  );
}

export default connect(({ count }) => ({
  number: count.number,
}))(Counter);
```

---

## 五、常见用法总结

|场景|示例|
|---|---|
|同步更新|`dispatch({ type: 'count/increment' })`|
|异步更新|`dispatch({ type: 'count/incrementAsync' })`|
|获取其他 model 的 state|`select(state => state.otherModel)`|
|model 分文件管理|推荐在 `models` 下建立多个文件，按模块拆分|

---

## 六、调试技巧

1. 打开 Redux DevTools，检查 dispatch 是否正确
    
2. 用 `console.log` 打印 `effect` 里的参数和 `put` 的调用
    
3. 多使用 `namespace` 来避免命名冲突
    
4. effect 不写 `yield` 会导致无任何效果
    

---

## 七、常见问题

### Q1：dispatch 时为什么要用 `namespace/action`？

Dva 为防止命名冲突，要求 action 类型带上命名空间前缀。

### Q2：为什么 `effect` 不生效？

可能原因：

- 没有 `yield`
    
- 没有用 `put` 调用 reducer
    
- 模块命名错误或 namespace 不一致
    

### Q3：可以只用 Dva 而不使用 Redux 吗？

Dva 本质封装的是 Redux，你可以不直接操作 Redux 的细节，但底层仍然是 Redux。

---

## 八、项目结构推荐

```bash
src/
├── models/
│   ├── count.js        # 状态模块
├── pages/
│   ├── index.js        # 页面组件
├── components/
├── services/           # 请求模块
└── utils/
```

---

## 九、总结一句话

> **Dva 让 Redux 和 redux-saga 更易用、更模块化，在 Umi 2 中天然集成，是企业级项目非常推荐的状态管理解决方案。**

---

如果你想看更高级的用法，如 subscription、动态加载 model、代码拆分、loading 效果绑定等，我可以继续帮你整理。

是否需要我给你写一个完整的 Demo 或者结合真实业务来模拟一个？