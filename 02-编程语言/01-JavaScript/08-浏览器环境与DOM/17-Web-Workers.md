---
title: "Web Workers"
date: "2026-04-10"
lastModified: "2026-04-10"
tags: ["javascript", "web-workers", "多线程", "性能优化", "前端基础"]
moc: "[[!MOC-JavaScript]]"
description: "Web Workers 提供了在后台线程运行 JavaScript 代码的能力，避免阻塞主线程，提升应用性能和响应速度。"
publish: true
toc: true
---

# Web Workers

> Web Workers 提供了在后台线程运行 JavaScript 代码的能力，避免阻塞主线程，提升应用性能和响应速度。
> 
> **参考规范**：[Web Workers](https://html.spec.whatwg.org/multipage/workers.html)

---

## 📚 目录

- [1. Web Workers 概述](#1-web-workers-概述)
- [2. 基本用法](#2-基本用法)
- [3. 消息传递](#3-消息传递)
- [4. 错误处理](#4-错误处理)
- [5. 共享 Worker](#5-共享-worker)
- [6. 实际应用](#6-实际应用)

---

## 1. Web Workers 概述

### 1.1 什么是 Web Workers

**Web Workers** 允许在后台线程运行 JavaScript，不会阻塞主线程。

**特点**：
- 在独立线程中运行
- 不能直接访问 DOM
- 通过消息与主线程通信
- 适合 CPU 密集型任务

### 1.2 浏览器支持

```javascript
// 检查支持
if (typeof Worker !== 'undefined') {
  // 支持 Web Workers
} else {
  console.warn('Web Workers not supported');
}
```

---

## 2. 基本用法

### 2.1 创建 Worker

```javascript
// 创建 Worker（需要单独的 JS 文件）
const worker = new Worker('worker.js');

// 或者使用 Blob URL
const workerCode = `
  self.onmessage = function(e) {
    console.log('Worker received:', e.data);
    self.postMessage('Hello from worker');
  };
`;

const blob = new Blob([workerCode], { type: 'application/javascript' });
const worker = new Worker(URL.createObjectURL(blob));
```

### 2.2 Worker 文件

```javascript
// worker.js
// 接收主线程消息
self.onmessage = function(e) {
  const data = e.data;
  console.log('Worker received:', data);
  
  // 处理数据
  const result = processData(data);
  
  // 发送结果回主线程
  self.postMessage(result);
};

// 处理数据
function processData(data) {
  // 执行耗时操作
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i];
  }
  return sum;
}
```

### 2.3 主线程通信

```javascript
const worker = new Worker('worker.js');

// 发送消息到 Worker
worker.postMessage({ type: 'calculate', data: [1, 2, 3, 4, 5] });

// 接收 Worker 消息
worker.onmessage = function(e) {
  console.log('Main thread received:', e.data);
};

// 错误处理
worker.onerror = function(error) {
  console.error('Worker error:', error);
};

// 终止 Worker
worker.terminate();
```

---

## 3. 消息传递

### 3.1 基本消息

```javascript
// 主线程
const worker = new Worker('worker.js');

// 发送简单数据
worker.postMessage('Hello Worker');

// 发送对象
worker.postMessage({
  command: 'process',
  data: [1, 2, 3, 4, 5]
});

// Worker
self.onmessage = function(e) {
  const message = e.data;
  if (typeof message === 'string') {
    console.log('String:', message);
  } else if (message.command === 'process') {
    processData(message.data);
  }
};
```

### 3.2 传递复杂数据

```javascript
// 传递 ArrayBuffer（零拷贝）
const buffer = new ArrayBuffer(1024);
worker.postMessage(buffer, [buffer]);  // 转移所有权

// 传递 TypedArray
const array = new Uint8Array([1, 2, 3, 4, 5]);
worker.postMessage(array.buffer, [array.buffer]);

// Worker 接收
self.onmessage = function(e) {
  const buffer = e.data;
  const view = new Uint8Array(buffer);
  console.log('Received buffer:', view);
};
```

### 3.3 消息通道

```javascript
// 创建消息通道
const channel = new MessageChannel();

// 主线程
const worker1 = new Worker('worker1.js');
const worker2 = new Worker('worker2.js');

// 将端口传递给 Worker
worker1.postMessage({ port: channel.port1 }, [channel.port1]);
worker2.postMessage({ port: channel.port2 }, [channel.port2]);

// Worker 之间可以直接通信
// worker1.js
self.onmessage = function(e) {
  const port = e.data.port;
  port.onmessage = function(event) {
    console.log('Worker1 received:', event.data);
  };
  port.postMessage('Hello from Worker1');
};
```

---

## 4. 错误处理

### 4.1 Worker 错误

```javascript
// 主线程错误处理
const worker = new Worker('worker.js');

worker.onerror = function(error) {
  console.error('Worker error:', error.message);
  console.error('Filename:', error.filename);
  console.error('Line number:', error.lineno);
};

// Worker 内部错误处理
// worker.js
try {
  // 可能出错的代码
  processData();
} catch (error) {
  self.postMessage({
    type: 'error',
    message: error.message
  });
}
```

### 4.2 错误传播

```javascript
// Worker 发送错误到主线程
// worker.js
self.onmessage = function(e) {
  try {
    const result = riskyOperation(e.data);
    self.postMessage({ type: 'success', data: result });
  } catch (error) {
    self.postMessage({
      type: 'error',
      message: error.message,
      stack: error.stack
    });
  }
};

// 主线程处理
worker.onmessage = function(e) {
  if (e.data.type === 'error') {
    console.error('Worker error:', e.data.message);
  } else {
    console.log('Result:', e.data.data);
  }
};
```

---

## 5. 共享 Worker

### 5.1 创建共享 Worker

```javascript
// 创建共享 Worker（多个页面可以共享）
const sharedWorker = new SharedWorker('shared-worker.js');

// 通过 port 通信
sharedWorker.port.onmessage = function(e) {
  console.log('Received:', e.data);
};

sharedWorker.port.postMessage('Hello Shared Worker');

// 启动端口
sharedWorker.port.start();

// shared-worker.js
let connections = [];

self.onconnect = function(e) {
  const port = e.ports[0];
  connections.push(port);
  
  port.onmessage = function(event) {
    // 广播到所有连接
    connections.forEach(conn => {
      if (conn !== port) {
        conn.postMessage(event.data);
      }
    });
  };
  
  port.start();
};
```

---

## 6. 实际应用

### 6.1 图像处理

```javascript
// 主线程
const worker = new Worker('image-processor.js');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

// 发送图像数据到 Worker
worker.postMessage(imageData);

worker.onmessage = function(e) {
  // 接收处理后的图像
  ctx.putImageData(e.data, 0, 0);
};

// image-processor.js
self.onmessage = function(e) {
  const imageData = e.data;
  const data = imageData.data;
  
  // 图像处理（如灰度化）
  for (let i = 0; i < data.length; i += 4) {
    const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    data[i] = gray;     // R
    data[i + 1] = gray; // G
    data[i + 2] = gray; // B
  }
  
  self.postMessage(imageData);
};
```

### 6.2 大数据计算

```javascript
// 主线程
const worker = new Worker('calculator.js');

function calculateLargeSum() {
  const data = new Array(10000000).fill(0).map((_, i) => i);
  
  worker.postMessage({
    type: 'sum',
    data: data
  });
  
  worker.onmessage = function(e) {
    console.log('Sum:', e.data);
  };
}

// calculator.js
self.onmessage = function(e) {
  if (e.data.type === 'sum') {
    const sum = e.data.data.reduce((a, b) => a + b, 0);
    self.postMessage(sum);
  }
};
```

### 6.3 Worker 池

```javascript
class WorkerPool {
  constructor(workerScript, poolSize = 4) {
    this.workerScript = workerScript;
    this.poolSize = poolSize;
    this.workers = [];
    this.queue = [];
    this.activeWorkers = 0;
    
    this.init();
  }
  
  init() {
    for (let i = 0; i < this.poolSize; i++) {
      const worker = new Worker(this.workerScript);
      worker.idle = true;
      this.workers.push(worker);
    }
  }
  
  execute(data) {
    return new Promise((resolve, reject) => {
      this.queue.push({ data, resolve, reject });
      this.processQueue();
    });
  }
  
  processQueue() {
    if (this.queue.length === 0) return;
    if (this.activeWorkers >= this.poolSize) return;
    
    const worker = this.workers.find(w => w.idle);
    if (!worker) return;
    
    const task = this.queue.shift();
    worker.idle = false;
    this.activeWorkers++;
    
    const handleMessage = (e) => {
      worker.removeEventListener('message', handleMessage);
      worker.removeEventListener('error', handleError);
      worker.idle = true;
      this.activeWorkers--;
      task.resolve(e.data);
      this.processQueue();
    };
    
    const handleError = (error) => {
      worker.removeEventListener('message', handleMessage);
      worker.removeEventListener('error', handleError);
      worker.idle = true;
      this.activeWorkers--;
      task.reject(error);
      this.processQueue();
    };
    
    worker.addEventListener('message', handleMessage);
    worker.addEventListener('error', handleError);
    worker.postMessage(task.data);
  }
  
  terminate() {
    this.workers.forEach(worker => worker.terminate());
  }
}

// 使用
const pool = new WorkerPool('worker.js', 4);

async function processMultipleTasks() {
  const tasks = [1, 2, 3, 4, 5, 6, 7, 8];
  const results = await Promise.all(
    tasks.map(data => pool.execute(data))
  );
  console.log('Results:', results);
}
```

### 6.4 定时任务

```javascript
// 在 Worker 中执行定时任务
// worker.js
let intervalId;

self.onmessage = function(e) {
  if (e.data.command === 'start') {
    intervalId = setInterval(() => {
      const data = performTask();
      self.postMessage({ type: 'tick', data });
    }, e.data.interval);
  } else if (e.data.command === 'stop') {
    clearInterval(intervalId);
  }
};

function performTask() {
  // 执行任务
  return { timestamp: Date.now() };
}

// 主线程
const worker = new Worker('worker.js');
worker.postMessage({ command: 'start', interval: 1000 });

worker.onmessage = function(e) {
  if (e.data.type === 'tick') {
    console.log('Tick:', e.data.data);
  }
};
```

---

## 📖 参考资源

- [MDN - Web Workers API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API)
- [MDN - Worker](https://developer.mozilla.org/zh-CN/docs/Web/API/Worker)
- [Web Workers Specification](https://html.spec.whatwg.org/multipage/workers.html)

---

#javascript #web-workers #多线程 #性能优化 #前端基础
