# 无感刷新 Token

## 介绍

无感刷新 token（又称为无缝刷新 token）是为了确保在用户进行操作时，身份验证 token 不会过期。通常，这种机制会在 token 过期之前请求一个新的 token，以避免用户必须重新登录。本文档将介绍如何使用 `axios` 实现无感刷新 token 的功能。

## 目录

1. 项目配置
2. 创建 `axios` 实例
3. 设置请求拦截器
4. 设置响应拦截器
5. 刷新 token 逻辑
6. 使用 `axios` 实例进行请求
7. 总结

## 1. 项目配置

在项目中，确保已经安装 `axios`：

```bash
npm install axios
```

## 2. 创建 `axios` 实例

首先，我们创建一个 `axios` 实例，以便集中管理 HTTP 请求。

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.yourservice.com', // 替换为你的 API 基础 URL
  timeout: 10000, // 请求超时设置
});
```

## 3. 设置请求拦截器

在每个请求发送之前，将 `accessToken` 添加到请求头中。

```javascript
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
```

## 4. 设置响应拦截器

拦截响应以检查 `401 Unauthorized` 错误。如果遇到 `401` 错误，则尝试刷新 token。

```javascript
let isRefreshing = false; // 标识是否正在刷新 token
let refreshSubscribers = []; // 存储请求等待队列

const onRefreshed = (token) => {
  refreshSubscribers.map((cb) => cb(token));
};

const addRefreshSubscriber = (cb) => {
  refreshSubscribers.push(cb);
};

api.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const { config, response: { status } } = error;
    const originalRequest = config;

    if (status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          const { data } = await axios.post('/auth/refresh-token', { token: refreshToken });
          const newToken = data.accessToken;
          localStorage.setItem('accessToken', newToken);
          isRefreshing = false;
          onRefreshed(newToken);
          refreshSubscribers = [];
        } catch (refreshError) {
          console.error('Refresh token error: ', refreshError);
          isRefreshing = false;
          // 处理 token 刷新错误，例如重定向到登录页面
        }
      }

      return new Promise((resolve) => {
        addRefreshSubscriber((newToken) => {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          resolve(axios(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);
```

## 5. 刷新 token 逻辑

当 `401` 错误发生时，如果 `isRefreshing` 为 `false`，则执行刷新 token 的请求。刷新成功后，通知所有挂起的请求并重试它们。

```javascript
if (!isRefreshing) {
  isRefreshing = true;
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const { data } = await axios.post('/auth/refresh-token', { token: refreshToken });
    const newToken = data.accessToken;
    localStorage.setItem('accessToken', newToken);
    isRefreshing = false;
    onRefreshed(newToken);
    refreshSubscribers = [];
  } catch (refreshError) {
    console.error('Refresh token error: ', refreshError);
    isRefreshing = false;
    // 处理 token 刷新错误，例如重定向到登录页面
  }
}
```

## 6. 使用 `axios` 实例进行请求

可以像平常一样使用 `axios` 实例进行请求。

```javascript
api.get('/protected-route')
  .then(response => {
    console.log('Data:', response.data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

## 7. 总结

这种方法确保了在 token 过期时，用户不会因为 token 失效而被迫重新登录。无感刷新 token 的机制可以大大提高用户体验，同时确保应用的安全性和可用性。

## 附录

### 完整代码

```javascript
import axios from 'axios';

// 创建 axios 实例
const api = axios.create({
  baseURL: 'https://api.yourservice.com', // 替换为你的 API 基础 URL
  timeout: 10000, // 请求超时设置
});

// 请求拦截器
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

let isRefreshing = false; // 标识是否正在刷新 token
let refreshSubscribers = []; // 存储请求等待队列

const onRefreshed = (token) => {
  refreshSubscribers.map((cb) => cb(token));
};

const addRefreshSubscriber = (cb) => {
  refreshSubscribers.push(cb);
};

// 响应拦截器
api.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const { config, response: { status } } = error;
    const originalRequest = config;

    if (status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          const { data } = await axios.post('/auth/refresh-token', { token: refreshToken });
          const newToken = data.accessToken;
          localStorage.setItem('accessToken', newToken);
          isRefreshing = false;
          onRefreshed(newToken);
          refreshSubscribers = [];
        } catch (refreshError) {
          console.error('Refresh token error: ', refreshError);
          isRefreshing = false;
          // 处理 token 刷新错误，例如重定向到登录页面
        }
      }

      return new Promise((resolve) => {
        addRefreshSubscriber((newToken) => {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          resolve(axios(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

// 使用 axios 实例进行请求
api.get('/protected-route')
  .then(response => {
    console.log('Data:', response.data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

以上代码实现了无感刷新 token 的功能，可以确保用户在 token 过期时不会被迫重新登录，提高用户体验的同时，确保应用的安全性和可用性。