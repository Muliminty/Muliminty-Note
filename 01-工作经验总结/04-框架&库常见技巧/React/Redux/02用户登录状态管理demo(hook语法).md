好的，以下是一个完整的 Redux 示例项目，涵盖了从创建状态、触发 action 到更新 UI 的整个流程。这个示例包含了 Redux 的基础用法，同时演示了如何通过 **React-Redux** 连接 Redux 状态和 React 组件。

### **完整 Demo：用户登录状态管理**

#### **1. 项目结构**
```
src/
|-- actions/
|   |-- userActions.js
|-- reducers/
|   |-- userReducer.js
|-- store/
|   |-- store.js
|-- components/
|   |-- Login.js
|   |-- UserProfile.js
|-- App.js
|-- index.js
```

#### **2. 安装依赖**
首先，确保你已经安装了 `redux` 和 `react-redux`：

```bash
npm install redux react-redux
```

#### **3. 创建 Action**

在 `src/actions/userActions.js` 文件中，定义登录相关的 `actions`。

```javascript
// src/actions/userActions.js

// 定义常量
export const SET_USER = 'SET_USER';
export const LOGOUT = 'LOGOUT';

// 登录 action creator
export const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

// 登出 action creator
export const logout = () => ({
  type: LOGOUT,
});
```

#### **4. 创建 Reducer**

在 `src/reducers/userReducer.js` 文件中，定义 `user` 状态的变化逻辑。

```javascript
// src/reducers/userReducer.js

import { SET_USER, LOGOUT } from '../actions/userActions';

// 初始状态
const initialState = {
  user: null,
  isAuthenticated: false,
};

// 定义 reducer
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

#### **5. 配置 Redux Store**

在 `src/store/store.js` 中，创建 Redux store，并引入 `userReducer`。

```javascript
// src/store/store.js

import { createStore } from 'redux';
import userReducer from '../reducers/userReducer';

// 创建 Redux store
const store = createStore(userReducer);

export default store;
```

#### **6. 创建 React 组件**

##### 6.1 登录组件

在 `src/components/Login.js` 中创建一个登录按钮，点击按钮后会更新 Redux 中的 `user` 状态。

```javascript
// src/components/Login.js

import React from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../actions/userActions';

const Login = () => {
  const dispatch = useDispatch();

  const handleLogin = () => {
    // 模拟用户数据
    const user = { name: 'John Doe', email: 'john.doe@example.com' };
    
    // 使用 dispatch 更新 Redux 中的用户信息
    dispatch(setUser(user));
  };

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
```

##### 6.2 用户资料组件

在 `src/components/UserProfile.js` 中创建一个展示当前用户信息的组件。它将通过 `useSelector` 从 Redux 中读取 `user` 状态。

```javascript
// src/components/UserProfile.js

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../actions/userActions';

const UserProfile = () => {
  const user = useSelector((state) => state.user);
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());  // 触发登出 action
  };

  if (!isAuthenticated) {
    return <p>Please log in.</p>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default UserProfile;
```

#### **7. 配置 Redux 和 React**

在 `src/index.js` 文件中，使用 `Provider` 将 Redux store 注入到应用中。

```javascript
// src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/store';  // 引入 Redux store
import App from './App';

ReactDOM.render(
  <Provider store={store}>  {/* 用 Provider 包裹应用，传入 Redux store */}
    <App />
  </Provider>,
  document.getElementById('root')
);
```

#### **8. 主组件**

在 `src/App.js` 中，使用 `Login` 和 `UserProfile` 组件。

```javascript
// src/App.js

import React from 'react';
import Login from './components/Login';
import UserProfile from './components/UserProfile';

const App = () => {
  return (
    <div>
      <h1>Redux Demo</h1>
      <Login />
      <UserProfile />
    </div>
  );
};

export default App;
```

#### **9. 数据流转流程**

- **Login 组件**：用户点击登录按钮，触发 `setUser` action，Redux 状态更新。
- **Redux Store**：`userReducer` 接收 `setUser` action，更新 `user` 和 `isAuthenticated` 状态。
- **UserProfile 组件**：`useSelector` 从 Redux 获取 `user` 和 `isAuthenticated`，显示用户信息。
- **登出功能**：点击登出按钮，触发 `logout` action，清除用户信息。

#### **10. 运行效果**

1. 页面初始状态：显示 "Please log in."
2. 用户点击 "Login" 按钮后，页面会显示用户信息（`name` 和 `email`）以及 "Logout" 按钮。
3. 用户点击 "Logout" 按钮后，用户信息被清除，页面恢复到 "Please log in."。

#### **11. 总结**

通过本示例，我们展示了如何在 Redux 中管理应用的状态，如何通过 `dispatch` 触发 `action` 来更新状态，以及如何使用 `useSelector` 和 `useDispatch` 来在 React 组件中访问和修改 Redux 中的状态。

### **数据流转总结**

1. **用户点击登录按钮**：触发 `setUser` action，更新 Redux 状态。
2. **Redux 更新状态**：`userReducer` 根据 `action` 更新 `user` 和 `isAuthenticated`。
3. **组件响应状态变化**：`UserProfile` 组件通过 `useSelector` 获取最新的状态并展示用户信息。
4. **用户点击登出按钮**：触发 `logout` action，清除 `user` 信息，状态更新。