# 如何取消一个正在发送的请求

## 1. 现代浏览器方案：Fetch API + AbortController

### 1.1 基本用法

```javascript
// 创建中断控制器
const controller = new AbortController();
const { signal } = controller;

// 发起请求
fetch('https://api.example.com/data', { signal })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(err => {
    if (err.name === 'AbortError') {
      console.log('请求被取消');
    } else {
      console.error('请求出错:', err);
    }
  });

// 取消请求
controller.abort();
```

### 1.2 流式数据处理中的取消

```javascript
// 创建中断控制器
const abortController = new AbortController();

// 发起请求
fetch('your-api-url', {
  signal: abortController.signal
})
.then(response => {
  const reader = response.body.getReader();
  
  // 递归读取流数据
  const read = () => {
    reader.read().then(({ done, value }) => {
      if (done) return;
      console.log('Received:', value);
      read(); // 持续读取
    });
  }
  read();
})
.catch(err => {
  if (err.name === 'AbortError') {
    console.log('Request aborted');
  }
});

// 中断操作
abortController.abort(); // 同时终止请求和流
```

### 1.3 React组件中的最佳实践

```jsx
import { useEffect } from 'react';

function StreamComponent() {
  useEffect(() => {
    const abortController = new AbortController();
    
    const loadStream = async () => {
      try {
        const response = await fetch('/api/stream', {
          signal: abortController.signal
        });
        const reader = response.body.getReader();
        // ...处理流数据
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Stream error:', err);
        }
      }
    };

    loadStream();

    return () => abortController.abort(); // 组件卸载时自动取消请求
  }, []);

  return <div>Streaming Component</div>;
}
```

### 1.4 高级用法

#### 取消多个请求

```javascript
const controller = new AbortController();

// 多个请求共享同一个 signal
fetch(url1, { signal: controller.signal });
fetch(url2, { signal: controller.signal });

// 同时取消所有请求
controller.abort();
```

#### 超时自动取消

```javascript
// 使用 AbortSignal.timeout()（需注意浏览器兼容性）
fetch(url, { signal: AbortSignal.timeout(5000) })
  .catch(err => {
    if (err.name === 'TimeoutError') {
      console.log('请求超时');
    }
  });

// 或者手动实现超时取消
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);

fetch(url, { signal: controller.signal })
  .then(response => {
    clearTimeout(timeoutId); // 请求成功，清除超时
    return response.json();
  })
  .catch(err => {
    if (err.name === 'AbortError') {
      console.log('请求超时或被取消');
    }
  });
```

## 2. 兼容方案：XMLHttpRequest

```javascript
const xhr = new XMLHttpRequest();
xhr.open('GET', 'your-api-url');

// 监听进度
xhr.onprogress = (event) => {
  console.log(`已接收 ${event.loaded} / ${event.total} 字节`);
};

// 监听完成
xhr.onload = () => {
  if (xhr.status === 200) {
    console.log('请求成功:', xhr.responseText);
  }
};

// 监听错误
xhr.onerror = () => {
  console.error('请求失败');
};

// 监听中止
xhr.onabort = () => {
  console.log('请求已中止');
};

xhr.send();

// 中断操作
xhr.abort(); // 立即终止请求
```

## 3. Axios取消请求

### 3.1 使用CancelToken（旧API）

```javascript
// 方法1：使用CancelToken.source
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios.get('/api/data', {
  cancelToken: source.token
})
.then(response => console.log(response.data))
.catch(err => {
  if (axios.isCancel(err)) {
    console.log('请求已取消:', err.message);
  } else {
    console.error('请求错误:', err);
  }
});

// 取消请求
source.cancel('用户取消了操作');

// 方法2：使用CancelToken构造函数
let cancel;

axios.get('/api/data', {
  cancelToken: new CancelToken(function executor(c) {
    // 将取消函数赋值给外部变量
    cancel = c;
  })
});

// 取消请求
cancel('操作被取消');
```

### 3.2 使用AbortController（新API，推荐）

```javascript
const controller = new AbortController();

axios.get('/api/data', {
  signal: controller.signal
})
.then(response => console.log(response.data))
.catch(err => {
  if (axios.isCancel(err)) {
    console.log('请求已取消');
  } else {
    console.error('请求错误:', err);
  }
});

// 取消请求
controller.abort();
```

## 4. 其他场景的取消操作

### 4.1 EventSource（SSE）

```javascript
const eventSource = new EventSource('your-sse-url');

// 监听消息
eventSource.onmessage = (event) => {
  console.log('SSE数据:', event.data);
};

// 监听错误
eventSource.onerror = (error) => {
  console.error('SSE错误:', error);
  eventSource.close(); // 发生错误时关闭连接
};

// 关闭连接
eventSource.close();
```

### 4.2 WebSocket

```javascript
const ws = new WebSocket('wss://your-websocket');

// 监听连接打开
ws.onopen = () => {
  console.log('WebSocket连接已建立');
};

// 监听消息
ws.onmessage = (event) => {
  console.log('收到消息:', event.data);
};

// 监听关闭
ws.onclose = (event) => {
  console.log(`WebSocket已关闭，代码: ${event.code}, 原因: ${event.reason}`);
};

// 关闭连接
ws.close(1000, '用户主动关闭'); // 状态码 + 原因
```

### 4.3 文件上传取消

```javascript
// 使用Fetch API上传文件
const controller = new AbortController();
const formData = new FormData();
formData.append('file', fileInput.files[0]);

fetch('/upload', {
  method: 'POST',
  body: formData,
  signal: controller.signal
});

// 取消上传
controller.abort();

// 使用Ant Design Upload组件
// 调用upload实例的abort方法
upload.abort(file);
```

## 5. 注意事项与最佳实践

### 5.1 资源释放

- 使用`reader.cancel()` + `reader.releaseLock()` 确保释放流资源
- 清除所有未完成的事件监听器

```javascript
const reader = response.body.getReader();

try {
  // 读取流
} catch (err) {
  // 错误处理
} finally {
  // 确保资源释放
  reader.cancel();
  reader.releaseLock();
}
```

### 5.2 错误处理

```javascript
try {
  // 请求逻辑
} catch (err) {
  if (err.name === 'AbortError') {
    console.log('用户主动终止');
  } else {
    console.error('请求异常:', err);
  }
}
```

### 5.3 服务端影响

- 中断仅客户端断开连接，服务端可能继续处理请求
- 重要操作需配合服务端的终止机制

### 5.4 浏览器兼容性

- AbortController兼容性：Chrome 66+ / Firefox 57+ / Safari 12.1+
- 需要polyfill：`npm install abortcontroller-polyfill`

### 5.5 取消请求的时机

1. **用户主动取消**：如点击取消按钮
2. **组件卸载**：React/Vue组件卸载时
3. **超时处理**：请求时间过长自动取消
4. **重复请求**：发起新请求前取消旧请求
5. **路由切换**：页面导航时取消未完成的请求

## 6. 方案对比

| 特性                | Fetch + AbortController       | XMLHttpRequest      | Axios              | EventSource         |
|---------------------|-------------------------------|---------------------|--------------------|--------------------- |
| **协议支持**        | HTTP/1.1、HTTP/2、HTTP/3      | HTTP/1.1            | 基于XHR/HTTP适配器 | 仅HTTP              |
| **流控制**          | 支持ReadableStream            | 需手动处理          | 支持（基于适配器） | 自动分块            |
| **错误处理**        | 捕获AbortError                | 监听abort事件       | isCancel检查       | 监听error事件       |
| **浏览器兼容**      | IE除外（需polyfill）          | 全兼容              | 全兼容             | IE除外              |
| **中断后恢复**      | 不可恢复                      | 不可恢复            | 不可恢复           | 需重新建立连接      |
| **适用场景**        | 现代Web应用                   | 老式浏览器兼容      | 通用REST API       | 服务器推送场景      |

## 7. 面试回答要点

1. **基本概念**：解释请求取消的意义和必要性
2. **技术选择**：根据场景选择合适的取消方法
3. **实现细节**：展示对各种取消机制的深入理解
4. **错误处理**：说明如何正确处理取消操作的异常
5. **资源管理**：强调取消后的资源释放和内存管理
6. **实际应用**：结合实际项目经验，说明在哪些场景下使用过请求取消

回答示例：

"在前端开发中，取消正在进行的请求是一个重要的性能和用户体验优化点。我通常使用现代的AbortController API来实现这一功能，它可以与Fetch API无缝集成。在React组件中，我会在useEffect的清理函数中调用abort()方法，确保组件卸载时取消所有未完成的请求，防止内存泄漏和不必要的状态更新。对于需要兼容旧浏览器的项目，我会使用XMLHttpRequest的abort()方法或Axios的cancelToken机制。在处理文件上传等长时间运行的请求时，我还会实现进度监控和用户可交互的取消按钮，提升用户体验。"