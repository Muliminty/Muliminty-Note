# 完善的 React 项目架构文档

### 1. 目录结构

良好的目录结构是项目可维护性的基础，它可以使代码组织更清晰，团队协作更顺畅。以下是一个推荐的目录结构：

```
my-react-app/
│
├── public/                  # 公共静态资源
│   └── index.html           # HTML 模板
├── src/                     # 源代码
│   ├── assets/              # 静态资源（图片、字体等）
│   ├── components/          # 公共组件
│   ├── hooks/               # 自定义 Hooks
│   ├── layouts/             # 布局组件
│   ├── pages/               # 页面组件
│   ├── services/            # 网络请求和 API 管理
│   ├── store/               # 状态管理（如 Redux 或 MobX）
│   ├── styles/              # 全局样式文件
│   ├── utils/               # 工具函数
│   ├── index.js             # 应用入口
│   └── App.js               # 根组件
├── .env                     # 环境变量配置文件
├── .env.development         # 开发环境的环境变量
├── .env.production          # 生产环境的环境变量
├── .babelrc                 # Babel 配置文件
├── webpack.config.js        # Webpack 配置文件
├── package.json             # 项目依赖和脚本
└── README.md                # 项目文档
```

### 2. 关键功能和配置

#### 2.1 导入别名（Path Aliases）

在大型项目中，深层的文件路径会导致代码难以阅读和维护。通过配置 Webpack 的别名，我们可以使导入路径更简洁。

**Webpack 别名配置：**

在 `webpack.config.js` 中添加：

```js
const path = require('path');

module.exports = {
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@assets': path.resolve(__dirname, 'src/assets')
    },
    extensions: ['.js', '.jsx', '.json']
  }
};
```

使用别名导入：

```js
import MyComponent from '@components/MyComponent';
import useCustomHook from '@hooks/useCustomHook';
```

#### 2.2 多环境配置（Multi-Environment Setup）

多环境配置是开发和生产环境区分的基础。通过 `.env` 文件管理不同环境的变量：

- `.env`：默认环境配置
- `.env.development`：开发环境配置
- `.env.production`：生产环境配置

**环境变量文件示例：**

```ini
# .env.development
REACT_APP_API_URL=https://dev.api.example.com
REACT_APP_ENV=development

# .env.production
REACT_APP_API_URL=https://api.example.com
REACT_APP_ENV=production
```

使用 `dotenv` 和 `webpack DefinePlugin` 来加载环境变量：

```bash
npm install dotenv --save
```

在 `webpack.config.js` 中配置：

```js
const webpack = require('webpack');
const dotenv = require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(dotenv.parsed)
    })
  ]
};
```

在代码中使用环境变量：

```js
const apiUrl = process.env.REACT_APP_API_URL;
```

#### 2.3 支持 CSS 预处理器（Sass、Less）

使用 `Sass` 或 `Less` 可以更高效地编写样式。

**安装 Sass 依赖：**

```bash
npm install sass-loader sass --save-dev
```

在 `webpack.config.js` 中配置：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  }
};
```

#### 2.4 多环境启动脚本

通过 `package.json` 添加多环境启动脚本，可以快速切换环境：

```json
"scripts": {
  "start": "webpack serve --mode development --env development",
  "build": "webpack --mode production --env production",
  "start:dev": "webpack serve --mode development",
  "build:prod": "webpack --mode production"
}
```

#### 2.5 状态管理（Redux 或 MobX）

根据项目复杂性，选择适合的状态管理库。

安装 `Redux` 及相关工具：

```bash
npm install redux react-redux --save
```

#### 2.6 国际化（i18n）

支持多语言的项目，可以使用 `react-i18next`：

```bash
npm install i18next react-i18next --save
```

#### 2.7 单元测试和集成测试

使用 `Jest` 和 `React Testing Library` 进行测试。

安装测试依赖：

```bash
npm install jest @testing-library/react @testing-library/jest-dom --save-dev
```

配置测试脚本：

```json
"scripts": {
  "test": "jest"
}
```

#### 2.8 代码格式化和 Linting

使用 `ESLint` 和 `Prettier` 进行代码格式化和质量检查。

安装依赖：

```bash
npm install eslint prettier eslint-plugin-react eslint-config-prettier eslint-plugin-prettier --save-dev
```

创建 `.eslintrc` 配置文件：

```json
{
  "extends": ["react-app", "prettier"],
  "plugins": ["react", "prettier"],
  "rules": {
    "prettier/prettier": ["error"]
  }
}
```

#### 2.9 热模块替换（HMR）

使用 Webpack 的热模块替换功能来提高开发效率。

配置 Webpack 的 `devServer`：

```js
module.exports = {
  devServer: {
    hot: true,
    open: true,
    port: 3000,
    static: path.resolve(__dirname, 'dist'),
  }
};
```

### 3. 开发痛点的解决方案

#### 3.1 网络请求管理

集成 Axios 或其他 HTTP 库，创建统一的网络请求管理模块，以简化和统一 API 调用：

安装 Axios：

```bash
npm install axios --save
```

创建 `services/api.js`：

```js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// 请求拦截器
apiClient.interceptors.request.use(
  config => {
    // 在请求发送前做一些处理
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  response => response.data,
  error => {
    // 处理响应错误
    return Promise.reject(error);
  }
);

export default apiClient;
```

#### 3.2 缓存和持久化状态

使用 `redux-persist` 或 `localStorage` 来缓存应用状态，减少不必要的网络请求：

安装 `redux-persist`：

```bash
npm install redux-persist --save
```

在 `store/index.js` 中配置：

```js
import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './reducers';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = createStore(persistedReducer);
export const persistor = persistStore(store);
```

#### 3.3 动态组件加载（Lazy Loading）

使用 `React` 的 `lazy` 和 `Suspense` 动态加载组件，提高首屏加载速度：

```js
import React, { lazy, Suspense } from 'react';

const MyComponent = lazy(() => import('./components/MyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyComponent />
    </Suspense>
  );
}
```

#### 3.4 配置持久化的多环境日志

为了解决日志的持久化和不同环境的日志记录，可以创建一个日志管理工具模块：

```js
const log = {
  info: (message) => {
    if (process.env.REACT_APP_ENV !== 'production') {
      console.info(message);
    }
  },
  warn: (message) => {
    if (process.env.REACT_APP_ENV !== 'production') {
      console.warn(message);
    }
  },
  error:

 (message) => {
    console.error(message);
  },
};

export default log;
```

