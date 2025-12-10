# Fetch API

> Fetch API 提供了现代化的网络请求接口，是 XMLHttpRequest 的替代方案。
> 
> **参考规范**：[Fetch Living Standard](https://fetch.spec.whatwg.org/)

---

## 📚 目录

- [1. Fetch 概述](#1-fetch-概述)
- [2. 基本用法](#2-基本用法)
- [3. Request 对象](#3-request-对象)
- [4. Response 对象](#4-response-对象)
- [5. 请求配置](#5-请求配置)
- [6. 错误处理](#6-错误处理)
- [7. 高级用法](#7-高级用法)
- [8. 与 XMLHttpRequest 对比](#8-与-xmlhttprequest-对比)

---

## 1. Fetch 概述

### 1.1 什么是 Fetch

**Fetch API** 提供了用于获取资源的接口，包括跨网络异步获取资源的能力。

**特点**：
- 基于 Promise，支持 async/await
- 更简洁的 API
- 更好的错误处理
- 支持流式处理

### 1.2 浏览器支持

```javascript
// 检查支持
if (window.fetch) {
  // 支持 Fetch API
} else {
  // 需要 polyfill 或使用 XMLHttpRequest
}
```

---

## 2. 基本用法

### 2.1 GET 请求

```javascript
// 最简单的 GET 请求
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });

// 使用 async/await
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### 2.2 POST 请求

```javascript
// POST 请求（JSON 数据）
fetch('https://api.example.com/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John',
    age: 30
  })
})
  .then(response => response.json())
  .then(data => console.log(data));

// POST 请求（FormData）
const formData = new FormData();
formData.append('name', 'John');
formData.append('age', '30');

fetch('https://api.example.com/data', {
  method: 'POST',
  body: formData
})
  .then(response => response.json())
  .then(data => console.log(data));
```

### 2.3 其他 HTTP 方法

```javascript
// PUT
fetch('https://api.example.com/data/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ name: 'Updated' })
});

// DELETE
fetch('https://api.example.com/data/1', {
  method: 'DELETE'
});

// PATCH
fetch('https://api.example.com/data/1', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ name: 'Patched' })
});
```

---

## 3. Request 对象

### 3.1 创建 Request 对象

```javascript
// 方式 1：直接使用 URL
fetch('https://api.example.com/data');

// 方式 2：使用 Request 对象
const request = new Request('https://api.example.com/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ data: 'value' })
});

fetch(request);
```

### 3.2 Request 属性

```javascript
const request = new Request('https://api.example.com/data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ data: 'value' })
});

request.url;        // "https://api.example.com/data"
request.method;     // "POST"
request.headers;    // Headers 对象
request.body;       // ReadableStream
request.bodyUsed;   // false（是否已读取）
```

### 3.3 克隆 Request

```javascript
const request = new Request('https://api.example.com/data');

// 克隆 Request（body 可重复使用）
const clonedRequest = request.clone();

// ⚠️ 注意：Request 的 body 只能读取一次
// 如果已经读取过，需要克隆才能再次使用
```

---

## 4. Response 对象

### 4.1 Response 属性

```javascript
fetch('https://api.example.com/data')
  .then(response => {
    // 状态码
    response.status;        // 200
    response.statusText;    // "OK"
    
    // 响应头
    response.headers;       // Headers 对象
    response.ok;            // true（status 200-299）
    response.redirected;    // false（是否重定向）
    response.type;          // "basic", "cors", "error" 等
    response.url;           // 最终 URL（可能经过重定向）
    
    // 响应体
    response.body;          // ReadableStream
    response.bodyUsed;      // false（是否已读取）
  });
```

### 4.2 读取响应体

```javascript
fetch('https://api.example.com/data')
  .then(response => {
    // JSON
    return response.json();
  })
  .then(data => console.log(data));

// 其他格式
response.text();      // 文本
response.blob();      // Blob
response.arrayBuffer(); // ArrayBuffer
response.formData();  // FormData
```

### 4.3 检查响应状态

```javascript
fetch('https://api.example.com/data')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### 4.4 处理不同响应类型

```javascript
async function fetchData() {
  const response = await fetch('https://api.example.com/data');
  
  const contentType = response.headers.get('content-type');
  
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  } else if (contentType && contentType.includes('text/html')) {
    return await response.text();
  } else {
    return await response.blob();
  }
}
```

---

## 5. 请求配置

### 5.1 Headers

```javascript
// 方式 1：对象形式
fetch('https://api.example.com/data', {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123'
  }
});

// 方式 2：Headers 对象
const headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('Authorization', 'Bearer token123');

fetch('https://api.example.com/data', {
  headers: headers
});

// Headers 操作
headers.get('Content-Type');        // "application/json"
headers.has('Authorization');      // true
headers.set('X-Custom', 'value');   // 设置
headers.delete('Authorization');    // 删除
headers.forEach((value, key) => {
  console.log(key, value);
});
```

### 5.2 请求模式

```javascript
fetch('https://api.example.com/data', {
  mode: 'cors',  // 'cors' | 'no-cors' | 'same-origin' | 'navigate'
});

// cors - 跨域请求（默认）
// no-cors - 不跨域请求（有限响应）
// same-origin - 同源请求
// navigate - 导航请求
```

### 5.3 凭证

```javascript
fetch('https://api.example.com/data', {
  credentials: 'include',  // 'omit' | 'same-origin' | 'include'
});

// omit - 不发送凭证
// same-origin - 同源时发送凭证
// include - 总是发送凭证（Cookie）
```

### 5.4 缓存控制

```javascript
fetch('https://api.example.com/data', {
  cache: 'no-cache',  // 'default' | 'no-store' | 'reload' | 'no-cache' | 'force-cache' | 'only-if-cached'
});

// default - 浏览器默认缓存策略
// no-store - 不缓存
// reload - 强制重新获取
// no-cache - 每次验证缓存
// force-cache - 强制使用缓存
// only-if-cached - 只使用缓存
```

### 5.5 重定向

```javascript
fetch('https://api.example.com/data', {
  redirect: 'follow',  // 'follow' | 'error' | 'manual'
});

// follow - 自动跟随重定向（默认）
// error - 重定向时抛出错误
// manual - 手动处理重定向
```

---

## 6. 错误处理

### 6.1 网络错误

```javascript
fetch('https://api.example.com/data')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .catch(error => {
    // 网络错误或 HTTP 错误
    console.error('Fetch error:', error);
  });
```

### 6.2 超时处理

```javascript
// 使用 AbortController 实现超时
function fetchWithTimeout(url, options = {}, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  return fetch(url, {
    ...options,
    signal: controller.signal
  })
    .then(response => {
      clearTimeout(timeoutId);
      return response;
    })
    .catch(error => {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    });
}

// 使用
fetchWithTimeout('https://api.example.com/data', {}, 5000)
  .then(response => response.json())
  .catch(error => console.error('Error:', error));
```

### 6.3 取消请求

```javascript
// 使用 AbortController 取消请求
const controller = new AbortController();

fetch('https://api.example.com/data', {
  signal: controller.signal
})
  .then(response => response.json())
  .catch(error => {
    if (error.name === 'AbortError') {
      console.log('Request aborted');
    }
  });

// 取消请求
controller.abort();
```

---

## 7. 高级用法

### 7.1 流式处理

```javascript
// 流式读取响应
fetch('https://api.example.com/data')
  .then(response => {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    function readChunk() {
      return reader.read().then(({ done, value }) => {
        if (done) {
          return;
        }
        
        const chunk = decoder.decode(value);
        console.log('Chunk:', chunk);
        
        return readChunk();
      });
    }
    
    return readChunk();
  });
```

### 7.2 上传进度

```javascript
// ⚠️ Fetch API 不支持上传进度
// 需要使用 XMLHttpRequest 或 fetch with ReadableStream

// 使用 XMLHttpRequest 获取上传进度
const xhr = new XMLHttpRequest();
xhr.upload.addEventListener('progress', (event) => {
  if (event.lengthComputable) {
    const percentComplete = (event.loaded / event.total) * 100;
    console.log('Upload progress:', percentComplete);
  }
});
```

### 7.3 下载进度

```javascript
// 使用 Response.body 获取下载进度
async function fetchWithProgress(url, onProgress) {
  const response = await fetch(url);
  const reader = response.body.getReader();
  const contentLength = +response.headers.get('Content-Length');
  let receivedLength = 0;
  
  const chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    
    if (done) break;
    
    chunks.push(value);
    receivedLength += value.length;
    
    if (onProgress) {
      onProgress(receivedLength, contentLength);
    }
  }
  
  const allChunks = new Uint8Array(receivedLength);
  let position = 0;
  for (const chunk of chunks) {
    allChunks.set(chunk, position);
    position += chunk.length;
  }
  
  return new Blob([allChunks]);
}

// 使用
fetchWithProgress('https://example.com/large-file', (loaded, total) => {
  console.log(`Progress: ${(loaded / total * 100).toFixed(2)}%`);
});
```

### 7.4 封装 Fetch 工具函数

```javascript
class FetchClient {
  constructor(baseURL, defaultOptions = {}) {
    this.baseURL = baseURL;
    this.defaultOptions = defaultOptions;
  }
  
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...this.defaultOptions,
      ...options,
      headers: {
        ...this.defaultOptions.headers,
        ...options.headers,
      },
    };
    
    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      return await response.text();
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }
  
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }
  
  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  }
  
  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  }
  
  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

// 使用
const api = new FetchClient('https://api.example.com', {
  headers: {
    'Authorization': 'Bearer token123'
  }
});

api.get('/users').then(users => console.log(users));
api.post('/users', { name: 'John' }).then(user => console.log(user));
```

---

## 8. 与 XMLHttpRequest 对比

### 8.1 主要区别

| 特性 | Fetch API | XMLHttpRequest |
|------|-----------|----------------|
| Promise 支持 | ✅ 原生支持 | ❌ 需要封装 |
| 请求取消 | ✅ AbortController | ✅ abort() |
| 上传进度 | ❌ 不支持 | ✅ 支持 |
| 下载进度 | ⚠️ 需要手动实现 | ✅ 支持 |
| 超时 | ⚠️ 需要手动实现 | ✅ 原生支持 |
| 浏览器支持 | 现代浏览器 | 所有浏览器 |

### 8.2 何时使用 XMLHttpRequest

- 需要上传/下载进度
- 需要支持旧浏览器
- 需要更细粒度的控制

---

## 📖 参考资源

- [MDN - Fetch API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API)
- [Fetch Living Standard](https://fetch.spec.whatwg.org/)
- [Using Fetch](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch)

---

#javascript #fetch #网络请求 #前端基础
