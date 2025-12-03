# FTP（File Transfer Protocol）

> FTP（文件传输协议）是用于在网络上传输文件的应用层协议。

---

## 什么是 FTP

FTP 是一种应用层协议，用于在客户端和服务器之间传输文件。

### FTP 的特点

- **文件传输**：上传和下载文件
- **目录操作**：列出目录、创建目录、删除目录
- **双连接**：控制连接和数据连接
- **支持多种模式**：主动模式和被动模式

---

## FTP 工作原理

### 双连接架构

FTP 使用两个 TCP 连接：
1. **控制连接**：用于发送命令和接收响应（端口 21）
2. **数据连接**：用于传输文件数据（端口 20 或动态端口）

### 连接过程

```
客户端                          服务器
   |                              |
   |--- 控制连接 (端口 21) ------->|
   |                              |
   |<-- 220 欢迎消息 --------------|
   |                              |
   |--- USER username ----------->|
   |<-- 331 需要密码 --------------|
   |                              |
   |--- PASS password ----------->|
   |<-- 230 登录成功 --------------|
   |                              |
   |--- PASV (被动模式) ---------->|
   |<-- 227 进入被动模式 ----------|
   |   (服务器监听端口)             |
   |                              |
   |--- 数据连接 (动态端口) ------->|
   |                              |
   |--- RETR filename ----------->|
   |<-- 150 开始传输 --------------|
   |                              |
   |<===== 文件数据 =============>|
   |                              |
   |<-- 226 传输完成 --------------|
```

---

## FTP 模式

### 主动模式（Active Mode）

**工作原理**：
1. 客户端连接到服务器的 21 端口（控制连接）
2. 客户端告诉服务器自己的 IP 和端口
3. 服务器从 20 端口连接到客户端指定的端口（数据连接）

**问题**：
- 客户端防火墙可能阻止服务器连接
- 需要客户端开放端口

### 被动模式（Passive Mode）

**工作原理**：
1. 客户端连接到服务器的 21 端口（控制连接）
2. 客户端发送 PASV 命令
3. 服务器返回监听的 IP 和端口
4. 客户端连接到服务器指定的端口（数据连接）

**优势**：
- 客户端防火墙友好
- 不需要客户端开放端口

**现代 FTP 客户端默认使用被动模式**

---

## FTP 命令

### 常用命令

| 命令 | 说明 | 示例 |
|------|------|------|
| USER | 用户名 | USER ftpuser |
| PASS | 密码 | PASS password |
| PASV | 被动模式 | PASV |
| LIST | 列出目录 | LIST |
| CWD | 切换目录 | CWD /path |
| PWD | 当前目录 | PWD |
| RETR | 下载文件 | RETR filename |
| STOR | 上传文件 | STOR filename |
| DELE | 删除文件 | DELE filename |
| MKD | 创建目录 | MKD dirname |
| RMD | 删除目录 | RMD dirname |
| QUIT | 退出 | QUIT |

### FTP 响应码

| 响应码 | 说明 |
|--------|------|
| 200 | 命令成功 |
| 220 | 服务就绪 |
| 230 | 登录成功 |
| 331 | 需要密码 |
| 425 | 无法打开数据连接 |
| 550 | 文件不可用 |

---

## FTP 客户端

### 命令行客户端

```bash
# 连接 FTP 服务器
ftp ftp.example.com

# 登录
Name: ftpuser
Password: password

# 列出目录
ls

# 切换目录
cd /path

# 下载文件
get filename

# 上传文件
put filename

# 退出
quit
```

### 使用 curl

```bash
# 下载文件
curl -u username:password ftp://ftp.example.com/file.txt -o file.txt

# 上传文件
curl -u username:password -T file.txt ftp://ftp.example.com/
```

### 使用 wget

```bash
# 下载文件
wget ftp://username:password@ftp.example.com/file.txt
```

---

## FTP 服务器配置

### vsftpd（Linux）

**安装**：
```bash
sudo apt-get install vsftpd
```

**配置**（/etc/vsftpd.conf）：
```ini
# 允许匿名登录
anonymous_enable=NO

# 允许本地用户登录
local_enable=YES

# 允许写入
write_enable=YES

# 被动模式端口范围
pasv_min_port=40000
pasv_max_port=50000

# 被动模式地址
pasv_address=your_server_ip
```

**启动服务**：
```bash
sudo systemctl start vsftpd
sudo systemctl enable vsftpd
```

---

## FTP 安全

### 1. SFTP（SSH File Transfer Protocol）

**特点**：
- 基于 SSH 协议
- 加密传输
- 使用端口 22

**使用**：
```bash
# 连接 SFTP
sftp user@example.com

# 下载文件
get remote_file local_file

# 上传文件
put local_file remote_file
```

### 2. FTPS（FTP over SSL/TLS）

**特点**：
- FTP + SSL/TLS
- 加密传输
- 使用端口 990（隐式）或 21（显式）

**配置**：
```ini
# vsftpd 配置
ssl_enable=YES
allow_anon_ssl=NO
force_local_data_ssl=YES
force_local_logins_ssl=YES
```

### 3. 安全建议

- **禁用匿名登录**：除非必要
- **使用强密码**：复杂密码策略
- **限制用户权限**：chroot 限制用户目录
- **使用 SFTP 或 FTPS**：加密传输
- **防火墙配置**：只开放必要端口

---

## FTP vs SFTP vs FTPS

| 特性 | FTP | SFTP | FTPS |
|------|-----|------|------|
| 协议 | FTP | SSH | FTP + SSL/TLS |
| 加密 | ❌ | ✅ | ✅ |
| 端口 | 21 | 22 | 990/21 |
| 安全性 | 低 | 高 | 高 |
| 使用场景 | 内网传输 | 安全传输 | 安全传输 |

---

## 实际应用

### 批量下载

```bash
# 使用 wget 批量下载
wget -r -np -nH --cut-dirs=1 ftp://username:password@ftp.example.com/path/
```

### 自动化脚本

```bash
#!/bin/bash
ftp -n ftp.example.com <<EOF
user username password
binary
cd /remote/path
lcd /local/path
mget *.txt
quit
EOF
```

---

## 常见问题

### 1. 被动模式连接失败？

- 检查防火墙是否开放被动模式端口范围
- 检查服务器配置的被动模式地址

### 2. FTP 传输慢？

- 使用二进制模式传输（binary）
- 检查网络带宽
- 使用多线程下载工具

### 3. 如何提高 FTP 安全性？

- 使用 SFTP 或 FTPS
- 禁用匿名登录
- 限制用户权限
- 使用 VPN

---

## 总结

FTP 要点：
- **双连接**：控制连接和数据连接
- **两种模式**：主动模式和被动模式
- **文件传输**：上传和下载文件
- **安全**：使用 SFTP 或 FTPS 加密传输
- **应用场景**：文件传输、备份、发布

FTP 是传统的文件传输协议，但在安全要求高的场景下，建议使用 SFTP 或 FTPS。

---

**相关链接**：
- [03-TCP 协议](../03-TCP-IP/03-TCP协议.md) — FTP 基于 TCP
- [03-HTTPS 与 TLS](../02-HTTP-HTTPS/03-HTTPS与TLS.md) — FTPS 使用 TLS

---

#FTP #文件传输 #网络协议

