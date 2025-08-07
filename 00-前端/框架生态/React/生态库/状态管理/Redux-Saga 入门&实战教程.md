

下面给出一条「从零到上线」的完整学习路径，并穿插可运行的最小代码片段，帮助你把 Redux + Redux-Saga 真正用起来。阅读顺序：概念 → 环境 → HelloSaga → 异步流 → 项目实战 → 常见坑。

──────────────────
1. 概念速记（30 秒）
• Redux：单一 Store、纯函数 reducer、同步数据流  
• Redux-Saga：基于 Generator 的「进程级」中间件，专门负责**异步副作用**（网络、定时器、WebSocket…）  
• 三者关系：  
  UI → dispatch(action) → saga 拦截 → 做副作用 → put(action) → reducer → 更新 Store → UI

──────────────────
2. 环境与最小可运行例子
（1）安装  
```bash
npm i redux react-redux redux-saga
```

（2）src/index.js  
```js
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';
import App from './App';
import rootReducer from './reducers';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

（3）src/sagas/helloSaga.js（官方「Hello World」）  
```js
export function* helloSaga() {
  console.log('Hello Sagas!');
}
```

（4）src/sagas/index.js（根 Saga）  
```js
import { all } from 'redux-saga/effects';
import { helloSaga } from './helloSaga';

export default function* rootSaga() {
  yield all([helloSaga()]);
}
```
运行后控制台即出现 `Hello Sagas!`。

──────────────────
3. 异步流程：1 秒递增计数器
需求：点击按钮 → 等待 1 秒 → 计数 +1  
（1）组件派发普通 action  
```js
<button onClick={() => dispatch({ type: 'INCREMENT_ASYNC' })}>
  +1 after 1s
</button>
```

（2）sagas/counterSaga.js  
```js
import { delay, put, takeEvery } from 'redux-saga/effects';

function* incrementAsync() {
  yield delay(1000);        // 阻塞 1 秒
  yield put({ type: 'INCREMENT' }); // 再发同步 action
}

export function* watchIncrementAsync() {
  yield takeEvery('INCREMENT_ASYNC', incrementAsync);
}
```

（3）加到 rootSaga  
```js
yield all([helloSaga(), watchIncrementAsync()]);
```
至此，你已掌握 saga 的核心 API：`takeEvery`、`put`、`delay`。

──────────────────
4. 实战：登录 + 获取列表
完整思路：  
• 监听 `TO_LOGIN_IN` → 调用登录接口 → 成功后触发 `to_login_in` → 同时拉取列表  
• 监听 `TO_LOGIN_OUT` → 触发 `to_login_out`

```js
import { call, put, take, all } from 'redux-saga/effects';

// 工具函数：fetch 封装
const post = (url, body) =>
  fetch(url, { method: 'POST', body: JSON.stringify(body) })
    .then(res => res.json());

function* loginFlow() {
  while (true) {
    const { username, password } = yield take('TO_LOGIN_IN');
    try {
      const res = yield call(post, '/api/login', { username, password });
      if (res.status === 10000) {
        yield put({ type: 'to_login_in', user: res.user });
        // 登录成功后拉取列表（可并发）
        yield call(getList);
      } else {
        yield put({ type: 'login_fail', msg: res.msg });
      }
    } catch (e) {
      yield put({ type: 'login_fail', msg: e.message });
    }

    // 等待登出
    yield take('TO_LOGIN_OUT');
    yield put({ type: 'to_login_out' });
  }
}

function* getList() {
  try {
    const res = yield call(post, '/api/list', {});
    yield put({ type: 'update_list', list: res.data });
  } catch (e) {
    yield put({ type: 'update_list_error', error: e });
  }
}

export default function* rootSaga() {
  yield all([loginFlow()]);
}
```
注意：`call` 会阻塞，若希望并行/非阻塞，可使用 `fork`。

──────────────────
5. 高频 API 速查表
| 名称        | 作用示例 |
|-------------|----------|
| takeEvery   | `yield takeEvery('LOGIN', loginSaga)` 监听所有 LOGIN |
| takeLatest  | 仅响应最近一次 action，适合搜索框 |
| take        | 精准一次：`const action = yield take('LOGIN')` |
| put         | saga 内部再 dispatch |
| call(fn,...)| 阻塞调用 |
| fork        | 非阻塞调用，返回 task |
| select      | 获取当前 state：`const s = yield select()` |
| all([...])  | 并发启动多个 saga |

──────────────────
6. 典型目录结构（中大型项目）
```
src/
├── store/
│   ├── index.js          // createStore + sagaMiddleware.run
│   ├── reducers/
│   └── sagas/
│       ├── index.js      // rootSaga
│       ├── userSaga.js
│       └── listSaga.js
├── components/
```
把每个业务模块的 saga 拆文件，再在 `rootSaga` 中 `all` 合并，可维护性最佳。

──────────────────
7. 常见坑 & 调试技巧
• 忘记 `sagaMiddleware.run(rootSaga)` → saga 不执行  
• 忘记 `yield` → 代码不报错但逻辑不生效  
• 阻塞误区：登录后拉取列表若用 `call`，登出按钮需等待列表返回才能点击；解决办法：`fork(getList)` 或 `spawn`（无阻塞）  
• 调试：安装浏览器扩展 Redux DevTools，可直接查看 action 流和 effect 日志  
• 兼容性：老浏览器需 `@babel/polyfill` 支持 Generator

──────────────────
8. 继续深造
9. 官方中文教程（含 Counter 完整源码）  
   https://saga.redux.js.cn/docs/introduction/BeginnerTutorial/  
10. 知乎实战：React-Redux-Saga 一条龙  
   https://zhuanlan.zhihu.com/p/82442831  
11. 掘金长文：登录/列表/登出完整案例  
   https://juejin.cn/post/6844903635747340296

照以上步骤，你可以在一小时内跑通最小 Demo，一天内完成业务接入。祝你编码愉快！