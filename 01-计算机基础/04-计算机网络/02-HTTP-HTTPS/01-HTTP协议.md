# HTTP 协议（HTTP Protocol）

> HTTP（HyperText Transfer Protocol，超文本传输协议）是 Web 应用的核心协议，用于客户端和服务器之间的通信。

---

## 什么是 HTTP

HTTP 是一种应用层协议，用于在 Web 浏览器和 Web 服务器之间传输超文本（HTML、CSS、JavaScript 等）和其他资源。

### HTTP 的特点

- **无状态**：每次请求都是独立的，服务器不保存客户端状态
- **请求/响应模型**：客户端发送请求，服务器返回响应
- **基于 TCP**：HTTP 建立在 TCP 连接之上
- **明文传输**：HTTP 默认不加密（HTTPS 才加密）

---

## HTTP 请求（Request）

### 请求结构

```
请求行（Request Line）
请求头（Request Headers）
空行
请求体（Request Body，可选）
```

### 请求行格式

```
方法 路径 HTTP/版本
```

**示例**：
```
GET /index.html HTTP/1.1
POST /api/users HTTP/1.1
```

### HTTP 方法

| 方法 | 说明 | 是否幂等 | 是否有请求体 |
|------|------|---------|-------------|
| GET | 获取资源 | ✅ | ❌ |
| POST | 创建资源或提交数据 | ❌ | ✅ |
| PUT | 完整更新资源 | ✅ | ✅ |
| PATCH | 部分更新资源 | ❌ | ✅ |
| DELETE | 删除资源 | ✅ | ❌ |
| HEAD | 获取响应头 | ✅ | ❌ |
| OPTIONS | 获取支持的请求方法 | ✅ | ❌ |

### 完整请求示例

```http
GET /index.html HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
Accept: text/html,application/xhtml+xml
Accept-Language: zh-CN,zh;q=0.9
Connection: keep-alive
```

---

## HTTP 响应（Response）

### 响应结构

```
状态行（Status Line）
响应头（Response Headers）
空行
响应体（Response Body）
```

### 状态行格式

```
HTTP/版本 状态码 状态描述
```

**示例**：
```
HTTP/1.1 200 OK
HTTP/1.1 404 Not Found
```

### HTTP 状态码

#### 2xx 成功

| 状态码 | 说明 |
|--------|------|
| 200 OK | 请求成功 |
| 201 Created | 资源创建成功 |
| 204 No Content | 请求成功，无返回内容 |

#### 3xx 重定向

| 状态码 | 说明 |
|--------|------|
| 301 Moved Permanently | 永久重定向 |
| 302 Found | 临时重定向 |
| 304 Not Modified | 资源未修改（缓存） |

#### 4xx 客户端错误

| 状态码 | 说明 |
|--------|------|
| 400 Bad Request | 请求错误 |
| 401 Unauthorized | 未授权 |
| 403 Forbidden | 禁止访问 |
| 404 Not Found | 资源不存在 |
| 405 Method Not Allowed | 方法不允许 |

#### 5xx 服务器错误

| 状态码 | 说明 |
|--------|------|
| 500 Internal Server Error | 服务器内部错误 |
| 502 Bad Gateway | 网关错误 |
| 503 Service Unavailable | 服务不可用 |
| 504 Gateway Timeout | 网关超时 |

### 完整响应示例

```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: 1234
Date: Mon, 01 Jan 2024 12:00:00 GMT
Server: nginx/1.18.0

<!DOCTYPE html>
<html>
<head>
    <title>Example</title>
</head>
<body>
    <h1>Hello World</h1>
</body>
</html>
```

---

## HTTP 头部字段

### 常用请求头

| 头部字段 | 说明 |
|---------|------|
| Host | 目标服务器的主机名和端口 |
| User-Agent | 客户端信息 |
| Accept | 可接受的媒体类型 |
| Accept-Language | 可接受的语言 |
| Accept-Encoding | 可接受的编码方式（gzip、deflate） |
| Content-Type | 请求体的媒体类型 |
| Content-Length | 请求体的长度 |
| Cookie | 客户端发送的 Cookie |
| Authorization | 认证信息 |
| Referer | 来源页面 |
| Connection | 连接控制（keep-alive、close） |

### 常用响应头

| 头部字段 | 说明 |
|---------|------|
| Content-Type | 响应体的媒体类型 |
| Content-Length | 响应体的长度 |
| Set-Cookie | 设置 Cookie |
| Location | 重定向地址 |
| Cache-Control | 缓存控制 |
| ETag | 资源标识符 |
| Last-Modified | 最后修改时间 |
| Server | 服务器信息 |
| Date | 响应时间 |

---

## Cookie 和 Session

### Cookie

**定义**：服务器发送给客户端的小型数据，客户端会保存并在后续请求中发送

**特点**：
- 存储在客户端
- 有大小限制（约 4KB）
- 可以设置过期时间
- 每次请求都会发送

**Set-Cookie 示例**：
```http
Set-Cookie: sessionId=abc123; Path=/; HttpOnly; Secure; Max-Age=3600
```

**Cookie 属性**：
- **Path**：Cookie 的路径范围
- **Domain**：Cookie 的域名范围
- **HttpOnly**：只能通过 HTTP 访问，JavaScript 无法访问
- **Secure**：只能通过 HTTPS 传输
- **Max-Age**：过期时间（秒）
- **SameSite**：防止 CSRF 攻击

### Session

**定义**：服务器端存储的用户会话信息

**工作原理**：
1. 客户端首次访问，服务器创建 Session 并返回 Session ID
2. 客户端保存 Session ID（通常通过 Cookie）
3. 后续请求携带 Session ID
4. 服务器根据 Session ID 查找对应的 Session 数据

**Session vs Cookie**：
- **Session**：存储在服务器，更安全，但占用服务器资源
- **Cookie**：存储在客户端，不占用服务器资源，但安全性较低

---

## HTTP 连接管理

### HTTP/1.0 - 短连接

每次请求都需要建立新的 TCP 连接，请求完成后立即关闭。

**缺点**：
- 连接建立开销大
- 效率低

### HTTP/1.1 - 长连接（Keep-Alive）

可以在同一个 TCP 连接上发送多个 HTTP 请求。

**Connection 头部**：
```http
Connection: keep-alive
Keep-Alive: timeout=5, max=100
```

**优点**：
- 减少连接建立开销
- 提高效率

**缺点**：
- 队头阻塞（Head-of-line blocking）：前面的请求阻塞后面的请求

---

## HTTP 版本演进

### HTTP/1.0
- 基本请求/响应模型
- 短连接

### HTTP/1.1
- 长连接（Keep-Alive）
- 分块传输（Chunked Transfer）
- 管道化（Pipelining，但很少使用）

### HTTP/2
- 多路复用（Multiplexing）
- 头部压缩（HPACK）
- 服务器推送（Server Push）
- 二进制分帧

### HTTP/3
- 基于 UDP 的 QUIC 协议
- 解决队头阻塞问题
- 更快的连接建立

---

## 实际应用示例

### GET 请求示例

```bash
# 使用 curl
curl -X GET https://api.example.com/users/1

# 使用浏览器
# 在地址栏输入：https://api.example.com/users/1
```

### POST 请求示例

```bash
# 使用 curl
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d '{"name":"张三","email":"zhangsan@example.com"}'
```

### JavaScript Fetch API

```javascript
// GET 请求
fetch('https://api.example.com/users/1')
  .then(response => response.json())
  .then(data => console.log(data));

// POST 请求
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: '张三',
    email: 'zhangsan@example.com'
  })
})
  .then(response => response.json())
  .then(data => console.log(data));
```

---

## 常见问题

### 1. GET 和 POST 的区别？

- **GET**：用于获取资源，参数在 URL 中，有长度限制，可缓存
- **POST**：用于提交数据，参数在请求体中，无长度限制，不可缓存

### 2. HTTP 是无状态的吗？

是的，HTTP 本身是无状态的。但可以通过 Cookie 和 Session 实现状态管理。

### 3. HTTP 和 HTTPS 的区别？

- **HTTP**：明文传输，不安全
- **HTTPS**：加密传输，使用 TLS/SSL 协议，安全

---

## 总结

HTTP 协议要点：
- **请求/响应模型**：客户端发送请求，服务器返回响应
- **HTTP 方法**：GET、POST、PUT、DELETE 等
- **状态码**：200、404、500 等
- **头部字段**：传递元数据信息
- **Cookie/Session**：状态管理机制
- **版本演进**：HTTP/1.0 → HTTP/1.1 → HTTP/2 → HTTP/3

理解 HTTP 协议是 Web 开发的基础。

---

**相关链接**：
- [02-HTTP/2 与 HTTP/3](./02-HTTP2-HTTP3.md) — HTTP 版本演进
- [03-HTTPS 与 TLS](./03-HTTPS与TLS.md) — 安全传输协议
- [04-HTTP 缓存](./04-HTTP缓存.md) — 缓存机制

---

#HTTP #Web协议 #网络协议

