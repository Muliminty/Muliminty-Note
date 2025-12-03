# WebSocket（WebSocket Protocol）

> WebSocket 是一种在单个 TCP 连接上进行全双工通信的协议，用于实现实时通信。

---

## 什么是 WebSocket

WebSocket 是一种应用层协议，允许客户端和服务器之间建立持久连接，实现双向实时通信。

### WebSocket 的特点

- **全双工通信**：可以同时双向传输数据
- **持久连接**：连接建立后保持打开状态
- **低延迟**：不需要 HTTP 请求/响应开销
- **实时性**：适合实时应用（聊天、游戏、股票行情等）

---

## WebSocket vs HTTP

### HTTP 的局限性

- **请求/响应模型**：客户端必须主动请求
- **无状态**：每次请求都是独立的
- **开销大**：每次请求都需要完整的 HTTP 头部
- **单向通信**：服务器不能主动推送数据

### WebSocket 的优势

- **双向通信**：客户端和服务器都可以主动发送数据
- **持久连接**：连接建立后保持打开
- **低开销**：数据帧头部小（2-14 字节）
- **实时推送**：服务器可以主动推送数据

---

## WebSocket 握手

### 握手过程

WebSocket 连接通过 HTTP 升级请求建立。

**客户端请求**：
```http
GET /chat HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13
Origin: http://example.com
```

**服务器响应**：
```http
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
```

**状态码 101**：表示协议切换成功

---

## WebSocket 数据帧

### 帧结构

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-------+-+-------------+-------------------------------+
|F|R|R|R| opcode|M| Payload len |    Extended payload length    |
|I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
|N|V|V|V|       |S|             |   (if payload len==126/127)   |
| |1|2|3|       |K|             |                               |
+-+-+-+-+-------+-+-------------+-------------------------------+
|     Extended payload length continued, if payload len == 127  |
+ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
|                               |Masking-key, if MASK set to 1  |
+-------------------------------+-------------------------------+
| Masking-key (continued)       |          Payload Data         |
+-------------------------------- - - - - - - - - - - - - - - - +
:                     Payload Data continued ...                :
+ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
|                     Payload Data continued ...                |
+---------------------------------------------------------------+
```

**字段说明**：
- **FIN**：是否为最后一个片段
- **RSV**：保留位
- **Opcode**：操作码（0=继续，1=文本，2=二进制，8=关闭，9=Ping，10=Pong）
- **MASK**：是否掩码（客户端必须设置）
- **Payload len**：负载长度
- **Masking-key**：掩码密钥（如果 MASK=1）
- **Payload Data**：实际数据

---

## WebSocket 应用场景

### 1. 实时聊天

**特点**：需要双向实时通信

**示例**：在线聊天室、即时通讯

### 2. 在线游戏

**特点**：需要低延迟、实时更新

**示例**：多人在线游戏、实时对战

### 3. 股票行情

**特点**：需要实时推送数据

**示例**：股票价格实时更新、交易系统

### 4. 协作编辑

**特点**：需要实时同步

**示例**：在线文档编辑、代码协作

### 5. 监控系统

**特点**：需要实时推送监控数据

**示例**：服务器监控、日志实时查看

---

## WebSocket API

### JavaScript 客户端

```javascript
// 创建 WebSocket 连接
const ws = new WebSocket('ws://example.com/chat');

// 连接打开
ws.onopen = function(event) {
    console.log('WebSocket 连接已打开');
    ws.send('Hello, Server!');
};

// 接收消息
ws.onmessage = function(event) {
    console.log('收到消息:', event.data);
};

// 连接错误
ws.onerror = function(error) {
    console.error('WebSocket 错误:', error);
};

// 连接关闭
ws.onclose = function(event) {
    console.log('WebSocket 连接已关闭');
};

// 发送消息
ws.send('Hello, Server!');

// 发送 JSON
ws.send(JSON.stringify({ type: 'message', data: 'Hello' }));

// 关闭连接
ws.close();
```

### Node.js 服务器（使用 ws 库）

```javascript
const WebSocket = require('ws');

// 创建 WebSocket 服务器
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws, req) {
    console.log('新客户端连接');
    
    // 接收消息
    ws.on('message', function incoming(message) {
        console.log('收到消息:', message);
        
        // 广播给所有客户端
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
    
    // 发送欢迎消息
    ws.send('欢迎连接 WebSocket 服务器！');
    
    // 连接关闭
    ws.on('close', function() {
        console.log('客户端断开连接');
    });
});
```

---

## 心跳机制

### 为什么需要心跳

- **保持连接**：防止连接被中间设备关闭
- **检测连接状态**：及时发现断开的连接
- **清理资源**：及时清理无效连接

### 实现方式

**客户端**：
```javascript
const ws = new WebSocket('ws://example.com/chat');

// 发送心跳
const heartbeat = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping' }));
    }
}, 30000); // 每 30 秒发送一次

// 接收心跳响应
ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    if (data.type === 'pong') {
        console.log('收到心跳响应');
    }
};

// 连接关闭时清除心跳
ws.onclose = function() {
    clearInterval(heartbeat);
};
```

**服务器**：
```javascript
wss.on('connection', function connection(ws) {
    let heartbeatInterval;
    
    ws.on('message', function incoming(message) {
        const data = JSON.parse(message);
        
        if (data.type === 'ping') {
            // 响应心跳
            ws.send(JSON.stringify({ type: 'pong' }));
        }
    });
    
    // 设置心跳超时
    heartbeatInterval = setInterval(() => {
        if (ws.isAlive === false) {
            return ws.terminate();
        }
        ws.isAlive = false;
    }, 30000);
    
    ws.on('pong', function() {
        ws.isAlive = true;
    });
    
    ws.on('close', function() {
        clearInterval(heartbeatInterval);
    });
});
```

---

## WebSocket 安全

### 1. 使用 WSS（WebSocket Secure）

**WSS = WebSocket + TLS**

**优势**：
- 加密传输
- 防止中间人攻击

**配置**：
```javascript
// 客户端
const wss = new WebSocket('wss://example.com/chat');

// 服务器（Node.js）
const https = require('https');
const fs = require('fs');

const server = https.createServer({
    cert: fs.readFileSync('cert.pem'),
    key: fs.readFileSync('key.pem')
});

const wss = new WebSocket.Server({ server });
```

### 2. 身份验证

**方式**：
- Token 验证
- Cookie 验证
- 自定义协议

**示例**：
```javascript
// 客户端
const ws = new WebSocket('ws://example.com/chat', {
    headers: {
        'Authorization': 'Bearer ' + token
    }
});

// 服务器
wss.on('connection', function connection(ws, req) {
    const token = req.headers.authorization;
    if (!validateToken(token)) {
        ws.close();
        return;
    }
    // 处理连接
});
```

---

## 常见问题

### 1. WebSocket 和 HTTP 长轮询的区别？

- **WebSocket**：持久连接，双向通信，低延迟
- **HTTP 长轮询**：客户端定期请求，单向通信，延迟较高

### 2. WebSocket 连接断开如何处理？

- **自动重连**：检测到断开后自动重新连接
- **指数退避**：重连间隔逐渐增加
- **最大重试次数**：限制重连次数

### 3. WebSocket 适合所有场景吗？

不是。WebSocket 适合需要实时双向通信的场景，对于简单的请求/响应，HTTP 更合适。

---

## 总结

WebSocket 要点：
- **全双工通信**：客户端和服务器都可以主动发送数据
- **持久连接**：连接建立后保持打开
- **低延迟**：适合实时应用
- **应用场景**：聊天、游戏、监控、协作编辑等
- **安全**：使用 WSS、身份验证

WebSocket 是实现实时通信的重要技术。

---

**相关链接**：
- [01-HTTP 协议](../02-HTTP-HTTPS/01-HTTP协议.md) — HTTP 基础
- [03-TCP 协议](../03-TCP-IP/03-TCP协议.md) — WebSocket 基于 TCP

---

#WebSocket #实时通信 #网络协议

