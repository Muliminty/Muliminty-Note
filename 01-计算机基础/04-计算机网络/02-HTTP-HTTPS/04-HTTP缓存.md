# HTTP 缓存（HTTP Caching）

> HTTP 缓存是提高 Web 性能的重要手段，通过缓存可以减少网络请求，提高页面加载速度。

---

## 什么是 HTTP 缓存

HTTP 缓存是浏览器或代理服务器存储 HTTP 响应的机制，当再次请求相同资源时，可以直接使用缓存，而不需要重新从服务器获取。

### 缓存的优势

- **减少网络请求**：降低服务器负载
- **提高响应速度**：减少延迟
- **节省带宽**：减少数据传输
- **改善用户体验**：页面加载更快

---

## 缓存位置

### 1. 浏览器缓存

**位置**：浏览器本地存储

**类型**：
- **内存缓存（Memory Cache）**：存储在内存中，关闭标签页后清除
- **磁盘缓存（Disk Cache）**：存储在磁盘中，持久保存

### 2. 代理缓存

**位置**：代理服务器（如 CDN、反向代理）

**特点**：多个用户共享缓存

### 3. 网关缓存

**位置**：网关服务器

**特点**：企业级缓存解决方案

---

## 缓存控制

### Cache-Control 头部

**Cache-Control** 是最重要的缓存控制头部。

#### 常用指令

| 指令 | 说明 | 示例 |
|------|------|------|
| `max-age` | 缓存有效期（秒） | `Cache-Control: max-age=3600` |
| `no-cache` | 必须重新验证 | `Cache-Control: no-cache` |
| `no-store` | 不缓存 | `Cache-Control: no-store` |
| `private` | 仅浏览器缓存 | `Cache-Control: private` |
| `public` | 可被任何缓存存储 | `Cache-Control: public` |
| `must-revalidate` | 过期后必须验证 | `Cache-Control: must-revalidate` |
| `immutable` | 资源不会改变 | `Cache-Control: immutable` |

#### 示例

```http
# 缓存 1 小时
Cache-Control: max-age=3600

# 不缓存
Cache-Control: no-store

# 必须重新验证
Cache-Control: no-cache

# 仅浏览器缓存，缓存 1 天
Cache-Control: private, max-age=86400

# 公共缓存，缓存 1 周
Cache-Control: public, max-age=604800
```

---

### Expires 头部

**Expires** 指定资源的过期时间（HTTP/1.0）。

**格式**：
```http
Expires: Wed, 01 Jan 2024 12:00:00 GMT
```

**注意**：
- HTTP/1.1 推荐使用 `Cache-Control`
- 如果同时存在，`Cache-Control` 优先级更高

---

## 缓存验证

### Last-Modified 和 If-Modified-Since

**工作原理**：
1. 服务器返回 `Last-Modified` 头部
2. 客户端再次请求时，发送 `If-Modified-Since` 头部
3. 服务器比较时间，如果未修改，返回 304 Not Modified

**示例**：
```http
# 首次请求
GET /index.html HTTP/1.1

HTTP/1.1 200 OK
Last-Modified: Wed, 01 Jan 2024 12:00:00 GMT
Content-Length: 1234

# 再次请求
GET /index.html HTTP/1.1
If-Modified-Since: Wed, 01 Jan 2024 12:00:00 GMT

HTTP/1.1 304 Not Modified
```

---

### ETag 和 If-None-Match

**ETag（Entity Tag）**：资源的唯一标识符

**工作原理**：
1. 服务器返回 `ETag` 头部
2. 客户端再次请求时，发送 `If-None-Match` 头部
3. 服务器比较 ETag，如果相同，返回 304 Not Modified

**示例**：
```http
# 首次请求
GET /index.html HTTP/1.1

HTTP/1.1 200 OK
ETag: "abc123"
Content-Length: 1234

# 再次请求
GET /index.html HTTP/1.1
If-None-Match: "abc123"

HTTP/1.1 304 Not Modified
```

**ETag 类型**：
- **强 ETag**：`ETag: "abc123"`（字节级别相同）
- **弱 ETag**：`ETag: W/"abc123"`（语义相同，但可能字节不同）

---

## 缓存策略

### 1. 强缓存（Strong Cache）

**特点**：直接使用缓存，不向服务器验证

**实现**：
```http
Cache-Control: max-age=3600
```

**流程**：
```
请求 → 检查缓存 → 未过期 → 直接返回缓存
```

---

### 2. 协商缓存（Negotiation Cache）

**特点**：需要向服务器验证缓存是否有效

**实现**：
```http
Cache-Control: no-cache
# 或
Cache-Control: max-age=0, must-revalidate
```

**流程**：
```
请求 → 检查缓存 → 向服务器验证 → 304/200
```

---

### 3. 不缓存

**实现**：
```http
Cache-Control: no-store
```

**流程**：
```
请求 → 不缓存 → 直接请求服务器
```

---

## 缓存最佳实践

### 静态资源（长期缓存）

**策略**：使用强缓存 + 文件名版本控制

```http
Cache-Control: public, max-age=31536000, immutable
```

**文件名版本控制**：
```
style.css → style.v1.2.3.css
script.js → script.v1.2.3.js
```

**优势**：
- 长期缓存，提高性能
- 版本更新时，文件名改变，自动失效

---

### HTML 文件（不缓存或短期缓存）

**策略**：不缓存或短期缓存

```http
Cache-Control: no-cache
# 或
Cache-Control: max-age=0, must-revalidate
```

**原因**：HTML 文件经常更新，需要及时获取最新版本

---

### API 响应（根据场景）

**策略**：根据数据特性选择

```http
# 实时数据（不缓存）
Cache-Control: no-store

# 可缓存数据（短期缓存）
Cache-Control: private, max-age=60

# 静态数据（长期缓存）
Cache-Control: public, max-age=3600
```

---

## 实际应用示例

### Nginx 缓存配置

```nginx
# 静态资源缓存
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# HTML 文件不缓存
location ~* \.html$ {
    add_header Cache-Control "no-cache, must-revalidate";
}

# API 响应
location /api/ {
    add_header Cache-Control "private, max-age=60";
    add_header ETag on;
}
```

---

### 浏览器缓存检查

```javascript
// 检查资源是否来自缓存
const resource = performance.getEntriesByName('https://example.com/style.css')[0];
console.log(resource.transferSize); // 0 表示来自缓存

// 强制刷新缓存
fetch('https://example.com/api/data', {
  cache: 'no-cache' // 或 'no-store', 'reload'
});
```

---

## Service Worker 缓存

**Service Worker** 可以更精细地控制缓存。

```javascript
// 安装 Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/',
        '/style.css',
        '/script.js'
      ]);
    })
  );
});

// 拦截请求
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

---

## CDN 缓存

**CDN（Content Delivery Network）** 提供边缘缓存。

**优势**：
- 地理位置接近用户
- 减少源服务器负载
- 提高响应速度

**缓存策略**：
- 静态资源：长期缓存
- 动态内容：短期缓存或不缓存

---

## 常见问题

### 1. 如何强制刷新缓存？

- **浏览器**：Ctrl+F5（Windows）或 Cmd+Shift+R（Mac）
- **代码**：添加版本号或时间戳到 URL

### 2. 缓存和 Cookie 的关系？

- **缓存**：存储 HTTP 响应
- **Cookie**：存储用户数据
- 两者独立，但都可以影响请求

### 3. 如何调试缓存问题？

- **浏览器开发者工具**：Network 标签查看缓存状态
- **响应头**：检查 `Cache-Control`、`ETag` 等
- **状态码**：200（新请求）、304（使用缓存）

---

## 总结

HTTP 缓存要点：
- **缓存位置**：浏览器缓存、代理缓存、网关缓存
- **缓存控制**：`Cache-Control`、`Expires`
- **缓存验证**：`Last-Modified`、`ETag`
- **缓存策略**：强缓存、协商缓存、不缓存
- **最佳实践**：静态资源长期缓存，HTML 不缓存，API 根据场景选择

合理使用 HTTP 缓存可以显著提升 Web 应用性能。

---

**相关链接**：
- [01-HTTP 协议](./01-HTTP协议.md) — HTTP 基础
- [02-HTTP/2 与 HTTP/3](./02-HTTP2-HTTP3.md) — HTTP 版本演进

---

#HTTP #缓存 #Web性能 #Cache-Control

