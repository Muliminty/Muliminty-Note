你可以通过修改Vite的配置文件来实现一套代码跑多个端口，以便对接多个后端开发环境。具体步骤如下：

以下是完整的项目设置和配置，其中包括使用 Axios 和根据环境变量配置不同端口的完整代码。

### 项目设置

确保你的项目结构如下：

```
my-vite-project/
├── node_modules/
├── public/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── api/
│       └── axios.js
├── .env.development
├── .env.staging
├── index.html
├── package.json
└── vite.config.js
```

### 环境配置文件

创建两个环境文件 `.env.development` 和 `.env.staging`，配置不同的 API 基础 URL 和端口：

**.env.development**

```env
VITE_API_BASE_URL=https://dev.api.yourservice.com
VITE_PORT=3000
```

**.env.staging**

```env
VITE_API_BASE_URL=https://staging.api.yourservice.com
VITE_PORT=3001
```

### `vite.config.js`

配置 `vite.config.js` 以根据环境变量加载不同的设置：

```javascript
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  console.log(`Running in ${mode} mode`);

  // 加载环境变量
  const env = loadEnv(mode, process.cwd());
  console.log('Loaded environment variables: ', env);

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: parseInt(env.VITE_PORT, 10),
    },
    define: {
      'process.env': env
    }
  };
});
```

### 封装 Axios

在 `src/api/axios.js` 中封装 Axios 实例，并配置请求和响应拦截器：

```javascript
import axios from 'axios';

// 创建 Axios 实例
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000, // 设置请求超时时间
});

// 请求拦截器
apiClient.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么，例如添加 Token
    return config;
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  response => {
    // 对响应数据做些什么
    return response;
  },
  error => {
    // 对响应错误做些什么
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 使用 Axios

在你的 React 组件中使用封装的 Axios 实例，例如在 `src/App.jsx` 中：

```jsx
import React, { useEffect, useState } from 'react';
import apiClient from './api/axios';

function App() {
  const [data, setData] = useState(null);
  
  const env = import.meta.env
  console.log(env)
  
  useEffect(() => {
    // 使用封装的 Axios 实例进行请求
    apiClient.get('/endpoint')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div className="App">
      <h1>My Vite React App</h1>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}

export default App;
```

### `package.json` 配置

确保你的 `package.json` 中的脚本配置正确：

```json
{
  "name": "project",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "start": "vite",
    "start:dev": "cross-env VITE_NODE_ENV=development vite --mode development",
    "start:staging": "cross-env VITE_NODE_ENV=staging vite --mode staging",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.7.2",
    "dotenv": "^16.4.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "cross-env": "^7.0.3",
    "eslint": "^8.57.0",
    "eslint-plugin-react": "^7.34.2",
    "eslint-plugin-react-hooks": "^4.6.2",
    "eslint-plugin-react-refresh": "^0.4.7",
    "vite": "^4.4.0"
  }
}
```

### 运行项目

运行以下命令启动不同环境的服务器：

```sh
npm run start:dev     # 开发环境
npm run start:staging # 测试环境
```

### 总结

通过以上步骤，你可以在 Vite 项目中使用不同的环境配置来切换 API 基础 URL 和端口，并且通过封装 Axios 实例来处理请求和响应拦截。希望这能解决你的问题。如果还有其他问题，请随时告诉我！



### 参考文章

https://blog.csdn.net/xiaomogg/article/details/131535284

一直习惯用"cross-env来设置环境变量。最近接手了个vite的，但是上个人没有区分test和prod环境，所以需要自己处理下

按照习惯，我就先npm i cross-env，然后设置命令行如下：

"dev:test": "cross-env VITE_NODE_ENV=development vite",
"dev:prod": "cross-env VITE_NODE_ENV=production vite",
然后在项目文件里面用process.env.VITE_NODE_ENV == "production"，

在nodejs配置文件里面也用process.env.VITE_NODE_ENV == "production"

开发环境运行都没问题

打包后就不行了，找不到这个process.env.VITE_NODE_ENV

vite要求项目文件里面用import.meta.env来读取变量，且变量名字用VITE开头

并且命令行用--mode [变量值] 的方式来这种变量

对应跟目录下的

.env.[变量值]文件，在这个文件里面设置变量

例如

vite build --mode test对应文件.env.test

.env.test文件输入如下内容

VITE_NODE_ENV=production

项目文件里面就可以使用以下代码来读取变量

import.meta.env.VITE_NODE_ENV == 'production' ?"生产":"测试"
但是nodejs的配置文件无法使用import.meta.env.VITE_NODE_ENV，依旧需要使用cross-env的方式来配置_(¦3」∠)_，然后我的package.json脚本命令行就变成了这样了

```
  "dev:test": "cross-env VITE_NODE_ENV=development vite --mode development",
  "dev:prod": "cross-env VITE_NODE_ENV=production vite  --mode production",
```
既有corss-env又有--mode
