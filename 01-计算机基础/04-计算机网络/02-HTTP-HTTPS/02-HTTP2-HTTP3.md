# HTTP/2 与 HTTP/3（HTTP/2 and HTTP/3）

> HTTP/2 和 HTTP/3 是 HTTP 协议的新版本，带来了性能和安全性的重大改进。

---

## HTTP 版本演进

```
HTTP/1.0 (1996)
    ↓
HTTP/1.1 (1997) - 长连接、分块传输
    ↓
HTTP/2 (2015) - 多路复用、头部压缩
    ↓
HTTP/3 (2022) - 基于 QUIC、解决队头阻塞
```

---

## HTTP/2

### HTTP/2 的主要特性

#### 1. 多路复用（Multiplexing）

**问题**：HTTP/1.1 虽然支持长连接，但仍然存在队头阻塞问题

**解决方案**：HTTP/2 允许在同一个 TCP 连接上并行发送多个请求和响应

**优势**：
- 消除队头阻塞
- 提高连接利用率
- 减少延迟

**示例**：
```
HTTP/1.1: 请求1 → 响应1 → 请求2 → 响应2 → 请求3 → 响应3
HTTP/2:  请求1、请求2、请求3 → 响应1、响应2、响应3（并行）
```

#### 2. 头部压缩（HPACK）

**问题**：HTTP/1.1 的头部是纯文本，重复的头部字段浪费带宽

**解决方案**：使用 HPACK 算法压缩头部

**优势**：
- 减少头部大小（通常减少 50-90%）
- 提高传输效率

**压缩方式**：
- 静态表：预定义的常用头部字段
- 动态表：连接期间维护的动态头部字段
- 霍夫曼编码：进一步压缩

#### 3. 服务器推送（Server Push）

**功能**：服务器可以主动向客户端推送资源

**应用场景**：
- 推送 CSS、JavaScript 等依赖资源
- 减少客户端请求次数

**示例**：
```
客户端请求：GET /index.html
服务器响应：index.html + 推送 style.css 和 script.js
```

#### 4. 二进制分帧（Binary Framing）

**改变**：从文本协议改为二进制协议

**优势**：
- 解析效率更高
- 更紧凑的格式
- 减少错误

**帧类型**：
- **HEADERS**：头部帧
- **DATA**：数据帧
- **PRIORITY**：优先级帧
- **RST_STREAM**：流重置帧
- **SETTINGS**：设置帧
- **PUSH_PROMISE**：推送承诺帧

#### 5. 流优先级（Stream Prioritization）

**功能**：客户端可以指定请求的优先级

**应用场景**：
- 优先加载关键资源（如 HTML、CSS）
- 延迟加载非关键资源（如图片）

---

### HTTP/2 的局限性

#### 1. TCP 队头阻塞

虽然 HTTP/2 解决了应用层的队头阻塞，但 TCP 层的队头阻塞仍然存在。

**问题**：如果 TCP 包丢失，后续的包需要等待重传，即使它们属于不同的 HTTP 流。

#### 2. 连接建立延迟

TCP 三次握手和 TLS 握手仍然需要时间。

---

## HTTP/3

### HTTP/3 的主要特性

#### 1. 基于 QUIC 协议

**改变**：从 TCP 改为基于 UDP 的 QUIC 协议

**优势**：
- 解决 TCP 队头阻塞问题
- 更快的连接建立
- 更好的移动网络支持

#### 2. 内置加密

**改变**：QUIC 协议内置 TLS 1.3

**优势**：
- 所有 QUIC 连接都是加密的
- 减少握手次数

#### 3. 连接迁移

**功能**：连接可以在网络切换时保持（如从 WiFi 切换到移动网络）

**优势**：
- 移动设备体验更好
- 减少重新连接的开销

#### 4. 多路复用

**改进**：每个流独立，互不阻塞

**优势**：
- 彻底解决队头阻塞问题
- 更好的并发性能

---

### QUIC 协议

**QUIC（Quick UDP Internet Connections）**：Google 开发的基于 UDP 的传输协议

**特点**：
- 基于 UDP，但提供类似 TCP 的可靠性
- 内置加密（TLS 1.3）
- 多路复用
- 连接迁移
- 更快的连接建立（0-RTT 或 1-RTT）

**QUIC vs TCP**：
- **TCP**：三次握手（1.5 RTT）+ TLS 握手（2 RTT）= 3.5 RTT
- **QUIC**：连接建立 + 加密 = 1 RTT（或 0 RTT）

---

## HTTP 版本对比

| 特性 | HTTP/1.1 | HTTP/2 | HTTP/3 |
|------|---------|--------|--------|
| 传输协议 | TCP | TCP | UDP (QUIC) |
| 多路复用 | ❌ | ✅ | ✅ |
| 头部压缩 | ❌ | ✅ (HPACK) | ✅ (QPACK) |
| 服务器推送 | ❌ | ✅ | ✅ |
| 二进制分帧 | ❌ | ✅ | ✅ |
| 队头阻塞 | ✅ | 应用层解决 | 完全解决 |
| 连接建立 | 慢 | 慢 | 快 |
| 加密 | 可选 (HTTPS) | 可选 (HTTPS) | 内置 |

---

## 浏览器支持

### HTTP/2 支持

- Chrome：从 40+ 版本支持
- Firefox：从 36+ 版本支持
- Safari：从 9+ 版本支持
- Edge：从 12+ 版本支持

### HTTP/3 支持

- Chrome：从 87+ 版本支持
- Firefox：从 88+ 版本支持
- Safari：从 14+ 版本支持
- Edge：从 87+ 版本支持

---

## 服务器配置

### Nginx HTTP/2 配置

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # HTTP/2 服务器推送
    location / {
        http2_push /style.css;
        http2_push /script.js;
    }
}
```

### Nginx HTTP/3 配置

```nginx
server {
    listen 443 ssl http2;
    listen 443 quic reuseport;
    
    http3 on;
    
    add_header Alt-Svc 'h3=":443"; ma=86400';
}
```

---

## 性能对比

### HTTP/1.1 vs HTTP/2

**测试场景**：加载包含 100 个资源的页面

- **HTTP/1.1**：需要多个连接，总时间约 5-10 秒
- **HTTP/2**：单个连接，总时间约 2-3 秒

### HTTP/2 vs HTTP/3

**测试场景**：高延迟、丢包网络环境

- **HTTP/2**：受 TCP 队头阻塞影响，性能下降明显
- **HTTP/3**：QUIC 协议表现更好，性能更稳定

---

## 迁移建议

### 何时使用 HTTP/2

- ✅ 现代浏览器环境
- ✅ 需要提高性能
- ✅ 服务器支持 HTTP/2

### 何时使用 HTTP/3

- ✅ 移动网络环境
- ✅ 高延迟网络
- ✅ 需要最佳性能
- ✅ 服务器和客户端都支持

### 兼容性策略

- **渐进增强**：同时支持 HTTP/1.1、HTTP/2、HTTP/3
- **自动协商**：客户端和服务器自动选择最佳版本
- **降级处理**：不支持时自动降级到旧版本

---

## 实际应用

### 检测 HTTP 版本

```javascript
// 在浏览器控制台
console.log(performance.getEntriesByType('navigation')[0].nextHopProtocol);
// 输出：h2、h3 等
```

### 使用 HTTP/2 服务器推送

```javascript
// 服务器端（Node.js + Express）
app.get('/', (req, res) => {
  res.push('/style.css', {
    status: 200,
    responseHeaders: {
      'content-type': 'text/css'
    }
  });
  res.end('<html>...</html>');
});
```

---

## 常见问题

### 1. HTTP/2 需要 HTTPS 吗？

不是必须的，但大多数浏览器只支持 HTTP/2 over HTTPS。

### 2. HTTP/3 比 HTTP/2 快多少？

取决于网络环境。在理想情况下，HTTP/3 可能快 10-30%，但在高延迟、丢包的网络环境下，优势更明显。

### 3. 如何启用 HTTP/2 或 HTTP/3？

- **服务器配置**：在 Web 服务器（如 Nginx、Apache）中启用
- **CDN 支持**：使用支持 HTTP/2/3 的 CDN（如 Cloudflare）

---

## 总结

HTTP 版本演进要点：
- **HTTP/2**：多路复用、头部压缩、服务器推送，解决应用层队头阻塞
- **HTTP/3**：基于 QUIC、内置加密、解决 TCP 队头阻塞，更快连接建立
- **性能提升**：每个版本都带来显著的性能改进
- **兼容性**：需要服务器和客户端都支持

选择合适的 HTTP 版本可以显著提升 Web 应用的性能。

---

**相关链接**：
- [01-HTTP 协议](./01-HTTP协议.md) — HTTP 基础
- [03-HTTPS 与 TLS](./03-HTTPS与TLS.md) — 安全传输协议

---

#HTTP #HTTP2 #HTTP3 #QUIC #Web性能

