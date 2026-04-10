---
title: "WebSocket API"
date: "2026-04-10"
lastModified: "2026-04-10"
tags: ["javascript", "websocket", "实时通信", "前端基础"]
moc: "[[!MOC-JavaScript]]"
description: "WebSocket 提供了全双工通信协议，允许客户端和服务器之间进行实时、双向的数据传输。"
publish: true
toc: true
---

# WebSocket API

> WebSocket 提供了全双工通信协议，允许客户端和服务器之间进行实时、双向的数据传输。
> 
> **参考规范**：[WebSocket API](https://html.spec.whatwg.org/multipage/web-sockets.html)

---

## 📚 目录

- [1. WebSocket 概述](#1-websocket-概述)
- [2. 基本用法](#2-基本用法)
- [3. 连接管理](#3-连接管理)
- [4. 消息传输](#4-消息传输)
- [5. 错误处理](#5-错误处理)
- [6. 实际应用](#6-实际应用)

---

## 1. WebSocket 概述

### 1.1 什么是 WebSocket

**WebSocket** 是一种在单个 TCP 连接上进行全双工通信的协议，提供了比 HTTP 轮询更高效的实时通信方式。

**特点**：
- 全双工通信（双向数据传输）
- 低延迟
- 持久连接
- 支持二进制和文本数据

### 1.2 与 HTTP 对比

| 特性 | HTTP | WebSocket |
|------|------|-----------|
| 连接方式 | 请求-响应 | 持久连接 |
| 通信方向 | 单向（客户端→服务器） | 双向 |
| 开销 | 每次请求都有头部 | 连接建立后开销小 |
| 适用场景 | 传统 Web 请求 | 实时通信 |

---

## 2. 基本用法

### 2.1 建立连接

```javascript
// 创建 WebSocket 连接
const ws = new WebSocket('ws://localhost:8080');

// 或使用 wss（加密）
const wss = new WebSocket('wss://example.com/ws');
```

### 2.2 连接状态

```javascript
const ws = new WebSocket('ws://localhost:8080');

// 连接状态
ws.readyState;  // 0=CONNECTING, 1=OPEN, 2=CLOSING, 3=CLOSED

// 常量
WebSocket.CONNECTING = 0;
WebSocket.OPEN = 1;
WebSocket.CLOSING = 2;
WebSocket.CLOSED = 3;
```

### 2.3 连接事件

```javascript
const ws = new WebSocket('ws://localhost:8080');

// open - 连接打开
ws.addEventListener('open', function(event) {
  console.log('WebSocket connected');
});

// message - 接收消息
ws.addEventListener('message', function(event) {
  console.log('Message received:', event.data);
});

// error - 错误
ws.addEventListener('error', function(error) {
  console.error('WebSocket error:', error);
});

// close - 连接关闭
ws.addEventListener('close', function(event) {
  console.log('WebSocket closed', event.code, event.reason);
});
```

---

## 3. 连接管理

### 3.1 打开连接

```javascript
const ws = new WebSocket('ws://localhost:8080', ['protocol1', 'protocol2']);

ws.addEventListener('open', function(event) {
  console.log('Connected');
  console.log('Protocol:', ws.protocol);  // 服务器选择的协议
  console.log('Extensions:', ws.extensions);
});
```

### 3.2 关闭连接

```javascript
// 关闭连接
ws.close();

// 指定关闭码和原因
ws.close(1000, 'Normal closure');

// 关闭码常量
// 1000 - 正常关闭
// 1001 - 端点离开
// 1002 - 协议错误
// 1003 - 不支持的数据类型
// 1006 - 异常关闭（无关闭帧）
// 1007 - 数据格式错误
// 1008 - 策略违规
// 1009 - 消息过大
// 1010 - 扩展协商失败
// 1011 - 服务器错误
```

### 3.3 连接状态检查

```javascript
function isConnected(ws) {
  return ws.readyState === WebSocket.OPEN;
}

// 等待连接打开
function waitForConnection(ws, callback) {
  if (ws.readyState === WebSocket.OPEN) {
    callback();
  } else {
    ws.addEventListener('open', callback, { once: true });
  }
}
```

---

## 4. 消息传输

### 4.1 发送文本消息

```javascript
const ws = new WebSocket('ws://localhost:8080');

ws.addEventListener('open', function() {
  // 发送文本消息
  ws.send('Hello Server');
  ws.send(JSON.stringify({ type: 'message', data: 'Hello' }));
});
```

### 4.2 发送二进制消息

```javascript
ws.addEventListener('open', function() {
  // 发送 ArrayBuffer
  const buffer = new ArrayBuffer(8);
  ws.send(buffer);
  
  // 发送 Blob
  const blob = new Blob(['Hello'], { type: 'text/plain' });
  ws.send(blob);
  
  // 发送 TypedArray
  const uint8Array = new Uint8Array([1, 2, 3, 4]);
  ws.send(uint8Array);
});
```

### 4.3 接收消息

```javascript
ws.addEventListener('message', function(event) {
  // 消息类型
  console.log('Message type:', typeof event.data);
  
  // 文本消息
  if (typeof event.data === 'string') {
    console.log('Text message:', event.data);
    try {
      const json = JSON.parse(event.data);
      console.log('JSON message:', json);
    } catch (e) {
      console.log('Plain text:', event.data);
    }
  }
  
  // 二进制消息
  if (event.data instanceof ArrayBuffer) {
    const view = new Uint8Array(event.data);
    console.log('Binary message:', view);
  }
  
  // Blob 消息
  if (event.data instanceof Blob) {
    event.data.text().then(text => {
      console.log('Blob text:', text);
    });
  }
});
```

### 4.4 消息缓冲

```javascript
// 检查缓冲状态
ws.bufferedAmount;  // 未发送的字节数

// 等待缓冲区清空
function waitForBuffer(ws, callback) {
  if (ws.bufferedAmount === 0) {
    callback();
  } else {
    setTimeout(() => waitForBuffer(ws, callback), 100);
  }
}

// 发送前检查
if (ws.bufferedAmount === 0) {
  ws.send('Message');
} else {
  console.warn('Buffer not empty, message may be delayed');
}
```

---

## 5. 错误处理

### 5.1 错误事件

```javascript
ws.addEventListener('error', function(error) {
  console.error('WebSocket error:', error);
  // 注意：error 事件不提供详细的错误信息
});

// 通过 close 事件获取错误信息
ws.addEventListener('close', function(event) {
  if (event.code !== 1000) {
    console.error('Connection closed with error:', event.code, event.reason);
  }
});
```

### 5.2 重连机制

```javascript
class WebSocketClient {
  constructor(url, options = {}) {
    this.url = url;
    this.options = options;
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = options.maxReconnectAttempts || 5;
    this.reconnectDelay = options.reconnectDelay || 1000;
  }
  
  connect() {
    this.ws = new WebSocket(this.url);
    
    this.ws.addEventListener('open', () => {
      console.log('Connected');
      this.reconnectAttempts = 0;
      this.onOpen();
    });
    
    this.ws.addEventListener('message', (event) => {
      this.onMessage(event);
    });
    
    this.ws.addEventListener('error', (error) => {
      this.onError(error);
    });
    
    this.ws.addEventListener('close', (event) => {
      this.onClose(event);
      this.reconnect();
    });
  }
  
  reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      console.error('Max reconnect attempts reached');
    }
  }
  
  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    } else {
      console.warn('WebSocket is not open');
    }
  }
  
  close() {
    if (this.ws) {
      this.ws.close();
    }
  }
  
  onOpen() {}
  onMessage(event) {}
  onError(error) {}
  onClose(event) {}
}

// 使用
const client = new WebSocketClient('ws://localhost:8080');
client.onMessage = (event) => {
  console.log('Message:', event.data);
};
client.connect();
```

---

## 6. 实际应用

### 6.1 聊天应用

```javascript
class ChatClient {
  constructor(url) {
    this.ws = new WebSocket(url);
    this.setupEventHandlers();
  }
  
  setupEventHandlers() {
    this.ws.addEventListener('open', () => {
      console.log('Chat connected');
    });
    
    this.ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      this.handleMessage(message);
    });
    
    this.ws.addEventListener('close', () => {
      console.log('Chat disconnected');
    });
  }
  
  sendMessage(text) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'message',
        text: text,
        timestamp: Date.now()
      }));
    }
  }
  
  handleMessage(message) {
    switch (message.type) {
      case 'message':
        this.displayMessage(message);
        break;
      case 'user_joined':
        console.log('User joined:', message.username);
        break;
      case 'user_left':
        console.log('User left:', message.username);
        break;
    }
  }
  
  displayMessage(message) {
    // 显示消息到 UI
    console.log(`${message.username}: ${message.text}`);
  }
}
```

### 6.2 实时数据更新

```javascript
class DataStreamClient {
  constructor(url) {
    this.ws = new WebSocket(url);
    this.subscriptions = new Set();
  }
  
  subscribe(topic, callback) {
    this.subscriptions.add({ topic, callback });
    
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'subscribe',
        topic: topic
      }));
    }
  }
  
  unsubscribe(topic) {
    this.subscriptions.forEach(sub => {
      if (sub.topic === topic) {
        this.subscriptions.delete(sub);
      }
    });
    
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'unsubscribe',
        topic: topic
      }));
    }
  }
  
  setupEventHandlers() {
    this.ws.addEventListener('open', () => {
      // 重新订阅所有主题
      this.subscriptions.forEach(sub => {
        this.ws.send(JSON.stringify({
          type: 'subscribe',
          topic: sub.topic
        }));
      });
    });
    
    this.ws.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      this.subscriptions.forEach(sub => {
        if (sub.topic === data.topic) {
          sub.callback(data.payload);
        }
      });
    });
  }
}
```

### 6.3 心跳检测

```javascript
class HeartbeatWebSocket {
  constructor(url, heartbeatInterval = 30000) {
    this.url = url;
    this.heartbeatInterval = heartbeatInterval;
    this.heartbeatTimer = null;
    this.ws = null;
  }
  
  connect() {
    this.ws = new WebSocket(this.url);
    
    this.ws.addEventListener('open', () => {
      this.startHeartbeat();
    });
    
    this.ws.addEventListener('close', () => {
      this.stopHeartbeat();
    });
    
    this.ws.addEventListener('message', (event) => {
      // 重置心跳定时器
      if (event.data === 'pong') {
        this.resetHeartbeat();
      }
    });
  }
  
  startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send('ping');
      }
    }, this.heartbeatInterval);
  }
  
  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }
  
  resetHeartbeat() {
    this.stopHeartbeat();
    this.startHeartbeat();
  }
}
```

---

## 📖 参考资源

- [MDN - WebSocket](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket)
- [WebSocket API Specification](https://html.spec.whatwg.org/multipage/web-sockets.html)
- [RFC 6455 - WebSocket Protocol](https://tools.ietf.org/html/rfc6455)

---

#javascript #websocket #实时通信 #前端基础
