# Redux 使用规范详细笔记

### 1. **Redux 基础概念**

- **Store**：存储全局的应用状态，只有一个。
- **Action**：描述发生的事件，包含 `type` 和 `payload`（必要的附加信息）。
- **Reducer**：根据接收到的 `action` 更新状态。每个 `reducer` 处理不同的部分状态。
- **Dispatch**：触发 `action`，使得 `reducer` 更新状态。
- **Selector**：从 `state` 中选择需要的数据。

### 2. **Redux 目录结构规范**

一个规范的 Redux 项目目录结构通常包括以下部分：

```
src/
|-- store/
|   |-- actions/
|   |   |-- userActions.js       // 用户相关的 actions
|   |   |-- authActions.js       // 权限相关的 actions
|   |-- reducers/
|   |   |-- userReducer.js       // 用户相关的 reducers
|   |   |-- authReducer.js       // 权限相关的 reducers
|   |-- types/
|   |   |-- userTypes.js         // 用户相关的常量
|   |   |-- authTypes.js         // 权限相关的常量
|   |-- store.js                // 创建 Redux store
|-- components/
|-- pages/
```

- **actions/**：存放所有的 Redux `action creators`（动作创建器）。
- **reducers/**：存放所有的 `reducers`，定义如何更新 `state`。
- **types/**：存放 `action` 和 `reducer` 中使用的常量。
- **store.js**：配置 Redux store，整合所有的 reducer 和中间件。

### 3. **安装依赖**

确保安装了以下依赖：

```bash
npm install redux react-redux
```

### 4. **创建 Action**

#### 4.1 定义 Action Types
为了避免在代码中硬编码字符串常量，通常会在 `types` 文件夹中定义常量。

```javascript
// types/userTypes.js
export const SET_USER = 'SET_USER';
export const LOGOUT = 'LOGOUT';
```

#### 4.2 创建 Action Creators
`action creator` 是一个返回 `action` 对象的函数。

```javascript
// actions/userActions.js
import { SET_USER, LOGOUT } from '../types/userTypes';

export const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

export const logout = () => ({
  type: LOGOUT,
});
```

### 5. **创建 Reducer**

Reducers 根据接收到的 `action` 更新 `state`。

```javascript
// reducers/userReducer.js
import { SET_USER, LOGOUT } from '../types/userTypes';

const initialState = {
  user: null,
  isAuthenticated: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

export default userReducer;
```

### 6. **创建 Redux Store**

通过 `createStore` 创建一个 Redux store，并将所有的 reducers 传递给它。

```javascript
// store/store.js
import { createStore, combineReducers } from 'redux';
import userReducer from '../reducers/userReducer';

const rootReducer = combineReducers({
  user: userReducer,
});

const store = createStore(rootReducer);

export default store;
```

### 7. **连接 React 组件与 Redux**

#### 7.1 使用 `useSelector` 获取 State
通过 `useSelector` 从 Redux 中选择需要的状态。

```javascript
import React from 'react';
import { useSelector } from 'react-redux';

const UserProfile = () => {
  const user = useSelector(state => state.user.user);

  return (
    <div>
      {user ? (
        <h1>{`Hello, ${user.name}`}</h1>
      ) : (
        <p>No user found!</p>
      )}
    </div>
  );
};

export default UserProfile;
```

#### 7.2 使用 `useDispatch` 触发 Action
通过 `useDispatch` 触发 `action`。

```javascript
import React from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../actions/userActions';

const Login = () => {
  const dispatch = useDispatch();

  const handleLogin = () => {
    const user = { name: 'John Doe', email: 'john@example.com' };
    dispatch(setUser(user));
  };

  return <button onClick={handleLogin}>Login</button>;
};

export default Login;
```

### 8. **Redux Toolkit（推荐使用）**

#### 8.1 安装 Redux Toolkit

Redux Toolkit 是 Redux 的官方工具集，它简化了创建 `action` 和 `reducer` 的过程，避免了手写冗余代码。

```bash
npm install @reduxjs/toolkit
```

#### 8.2 使用 `createSlice` 简化 Reducer 和 Action

```javascript
// store/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, logout } = userSlice.actions;

export default userSlice.reducer;
```

#### 8.3 配置 Redux Store

通过 `configureStore` 创建 Redux store，自动启用开发环境的 DevTools 和中间件（如 thunk）。

```javascript
// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;
```

### 9. **异步操作**

#### 9.1 使用 Thunk 处理异步操作

首先安装 `redux-thunk`：

```bash
npm install redux-thunk
```

配置 Redux store 支持 Thunk：

```javascript
// store/store.js
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
```

#### 9.2 异步 Action 示例

```javascript
// actions/userActions.js
import { SET_USER } from '../types/userTypes';

export const fetchUser = () => async (dispatch) => {
  try {
    const response = await fetch('/api/user');
    const data = await response.json();
    dispatch({
      type: SET_USER,
      payload: data,
    });
  } catch (error) {
    console.error('Failed to fetch user:', error);
  }
};
```

### 10. **调试和开发工具**

#### 10.1 Redux DevTools

Redux DevTools 是一个非常有用的调试工具，可以帮助你追踪 Redux 状态的变化。确保安装并启用它。

1. 安装 Redux DevTools Extension：[Redux DevTools](https://github.com/reduxjs/redux-devtools).
2. 在创建 Redux store 时启用 DevTools：

```javascript
// store.js
import { createStore } from 'redux';
const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
```

#### 10.2 使用中间件

使用 `redux-thunk` 或 `redux-saga` 处理异步操作或副作用。

### 11. **Redux 使用规范的最佳实践**

#### 11.1 使用常量避免硬编码字符串
定义常量来避免字符串的硬编码。

```javascript
// types/userTypes.js
export const SET_USER = 'SET_USER';
export const LOGOUT = 'LOGOUT';
```

#### 11.2 使用 `createSlice` 简化 `action` 和 `reducer`
推荐使用 Redux Toolkit 提供的 `createSlice` 来简化创建 `action` 和 `reducer` 的过程，减少重复的代码。

#### 11.3 管理异步操作
使用 `redux-thunk` 或 `redux-saga` 来管理异步操作，确保代码的可维护性。

#### 11.4 组件与 Redux 分离
将 Redux 的逻辑和 React 组件的逻辑分离，保持组件的纯净，避免将业务逻辑直接放入组件中。

#### 11.5 使用 DevTools 进行调试
启用 Redux DevTools 来追踪和调试 Redux 状态的变化，快速定位问题。

#### 11.6 组织清晰的文件结构
根据功能将 `actions`、`reducers`、`types` 等分开管理，确保代码清晰易于维护。

### 12. **总结**

- **组织结构**：确保代码结构清晰，避免冗长的 `action` 和 `reducer`，使用 `createSlice` 简化代码。
- **使用常量**：避免硬编码字符串

常量，确保易于维护和管理。
- **调试工具**：使用 Redux DevTools 进行状态调试，提高开发效率。
- **异步操作**：通过 `redux-thunk` 或 `redux-saga` 处理异步操作，保持代码简洁。
