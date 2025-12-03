# HTTPS 与 TLS（HTTPS and TLS）

> HTTPS（HTTP Secure）是 HTTP 的安全版本，通过 TLS/SSL 协议提供加密和身份验证。

---

## 什么是 HTTPS

HTTPS = HTTP + TLS/SSL

HTTPS 在 HTTP 的基础上，通过 TLS（Transport Layer Security）或 SSL（Secure Sockets Layer）协议提供：
- **加密**：防止数据被窃听
- **身份验证**：验证服务器身份
- **完整性**：防止数据被篡改

---

## SSL/TLS 协议

### SSL vs TLS

- **SSL（Secure Sockets Layer）**：旧版本，已废弃（SSL 3.0 及以下）
- **TLS（Transport Layer Security）**：SSL 的继任者，当前标准

**版本历史**：
- SSL 1.0（未发布）
- SSL 2.0（1995，已废弃）
- SSL 3.0（1996，已废弃）
- TLS 1.0（1999，已废弃）
- TLS 1.1（2006，已废弃）
- TLS 1.2（2008，广泛使用）
- TLS 1.3（2018，最新版本）

### TLS 协议栈

```
应用层（HTTP、FTP 等）
    ↓
TLS 记录协议（Record Protocol）
    ↓
TLS 握手协议（Handshake Protocol）
TLS 变更密码规范协议（Change Cipher Spec Protocol）
TLS 警报协议（Alert Protocol）
    ↓
传输层（TCP）
```

---

## TLS 握手过程

### TLS 1.2 握手（完整握手）

```
客户端                          服务器
   |                              |
   |--- Client Hello ----------->|
   |   (支持的 TLS 版本、加密套件、随机数) |
   |                              |
   |<-- Server Hello ------------|
   |   (选择的 TLS 版本、加密套件、随机数) |
   |<-- Certificate -------------|
   |   (服务器证书)                |
   |<-- Server Hello Done -------|
   |                              |
   |--- Client Key Exchange ---->|
   |   (预主密钥，用服务器公钥加密)   |
   |--- Change Cipher Spec ----->|
   |--- Finished ---------------->|
   |                              |
   |<-- Change Cipher Spec -------|
   |<-- Finished -----------------|
   |                              |
   |<===== 加密通信开始 =========>|
```

### TLS 1.3 握手（简化握手）

```
客户端                          服务器
   |                              |
   |--- Client Hello ----------->|
   |   (支持的加密套件、密钥共享)     |
   |                              |
   |<-- Server Hello ------------|
   |   (选择的加密套件、证书、密钥共享) |
   |<-- Change Cipher Spec -------|
   |<-- Finished -----------------|
   |                              |
   |--- Change Cipher Spec ----->|
   |--- Finished ---------------->|
   |                              |
   |<===== 加密通信开始 =========>|
```

**TLS 1.3 改进**：
- 握手从 2 RTT 减少到 1 RTT
- 移除不安全的加密算法
- 支持 0-RTT（零往返时间）

---

## 数字证书

### 证书的作用

- **身份验证**：证明服务器的身份
- **公钥分发**：提供服务器的公钥

### 证书结构

```
证书内容：
- 版本号
- 序列号
- 签名算法
- 颁发者（CA）
- 有效期（开始时间、结束时间）
- 主体（域名、组织等）
- 公钥
- 扩展信息

签名：
- CA 使用私钥对证书内容进行签名
```

### 证书链

```
根证书（Root CA）
    ↓
中间证书（Intermediate CA）
    ↓
服务器证书（Server Certificate）
```

**验证过程**：
1. 验证服务器证书的有效性
2. 验证中间证书
3. 验证根证书（存储在浏览器中）

---

## 加密算法

### 对称加密

**特点**：加密和解密使用同一个密钥

**算法**：
- AES（Advanced Encryption Standard）：最常用
- DES、3DES：已废弃
- ChaCha20：TLS 1.3 支持

**优势**：速度快

**劣势**：密钥分发困难

### 非对称加密

**特点**：使用公钥和私钥对

**算法**：
- RSA：传统算法
- ECDSA（Elliptic Curve Digital Signature Algorithm）：椭圆曲线算法
- EdDSA：Edwards 曲线算法

**优势**：密钥分发容易

**劣势**：速度慢

### 混合加密

**原理**：结合对称加密和非对称加密

**过程**：
1. 使用非对称加密交换对称加密的密钥
2. 使用对称加密进行实际数据传输

---

## 数字签名

### 签名过程

```
1. 对数据计算哈希值（如 SHA-256）
2. 使用私钥对哈希值进行加密（签名）
3. 将数据和签名一起发送
```

### 验证过程

```
1. 接收数据和签名
2. 对数据计算哈希值
3. 使用公钥解密签名，得到原始哈希值
4. 比较两个哈希值，如果相同则验证通过
```

---

## HTTPS 配置

### Nginx HTTPS 配置

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;
    
    # 证书文件
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # TLS 版本
    ssl_protocols TLSv1.2 TLSv1.3;
    
    # 加密套件
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
    ssl_prefer_server_ciphers on;
    
    # HSTS（HTTP Strict Transport Security）
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
}
```

### 强制 HTTPS 重定向

```nginx
server {
    listen 80;
    server_name example.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 证书获取

### Let's Encrypt（免费证书）

```bash
# 安装 Certbot
sudo apt-get install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d example.com

# 自动续期
sudo certbot renew --dry-run
```

### 自签名证书（仅用于测试）

```bash
# 生成私钥
openssl genrsa -out key.pem 2048

# 生成证书签名请求
openssl req -new -key key.pem -out csr.pem

# 生成自签名证书
openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem
```

---

## 安全最佳实践

### 1. 使用强加密套件

**推荐**：
- TLS 1.2 或 TLS 1.3
- 禁用弱加密算法（RC4、MD5、SHA1）

### 2. 启用 HSTS

**HTTP Strict Transport Security**：强制浏览器使用 HTTPS

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

### 3. 启用 OCSP Stapling

**Online Certificate Status Protocol Stapling**：减少证书验证延迟

### 4. 使用安全的 Cookie

```javascript
// 设置 Secure 标志
Set-Cookie: sessionId=abc123; Secure; HttpOnly; SameSite=Strict
```

### 5. 内容安全策略（CSP）

```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'";
```

---

## HTTPS 性能

### 性能开销

- **CPU 开销**：加密/解密需要 CPU 计算
- **握手延迟**：TLS 握手需要时间
- **证书验证**：需要验证证书链

### 性能优化

1. **使用 TLS 1.3**：减少握手时间
2. **启用 HTTP/2**：多路复用提高效率
3. **会话复用**：Session ID 或 Session Ticket
4. **OCSP Stapling**：减少证书验证时间
5. **CDN 加速**：使用 CDN 提供 HTTPS 服务

---

## 常见问题

### 1. HTTPS 一定比 HTTP 慢吗？

不一定。虽然 HTTPS 有加密开销，但通过优化（如 TLS 1.3、HTTP/2），性能差异很小，甚至在某些情况下更快。

### 2. 自签名证书安全吗？

不安全。自签名证书无法验证服务器身份，浏览器会显示警告。仅用于测试环境。

### 3. 如何检查 HTTPS 配置？

使用在线工具：
- SSL Labs：https://www.ssllabs.com/ssltest/
- Security Headers：https://securityheaders.com/

---

## 总结

HTTPS 与 TLS 要点：
- **HTTPS = HTTP + TLS**：提供加密和身份验证
- **TLS 握手**：建立安全连接的过程
- **数字证书**：验证服务器身份和分发公钥
- **加密算法**：对称加密、非对称加密、混合加密
- **安全配置**：使用强加密套件、启用 HSTS、OCSP Stapling

使用 HTTPS 是保护 Web 应用安全的基本要求。

---

**相关链接**：
- [01-HTTP 协议](./01-HTTP协议.md) — HTTP 基础
- [02-HTTP/2 与 HTTP/3](./02-HTTP2-HTTP3.md) — HTTP 版本演进

---

#HTTPS #TLS #SSL #网络安全 #加密

