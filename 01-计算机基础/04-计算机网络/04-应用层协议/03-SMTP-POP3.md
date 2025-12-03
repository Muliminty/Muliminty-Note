# SMTP/POP3（SMTP and POP3）

> SMTP（Simple Mail Transfer Protocol）用于发送邮件，POP3（Post Office Protocol 3）用于接收邮件。

---

## 邮件系统架构

### 邮件系统组成

```
发件人 → MUA（邮件用户代理）→ MTA（邮件传输代理）→ MTA → MDA（邮件投递代理）→ MUA → 收件人
         (Outlook)              (SMTP服务器)      (SMTP服务器)  (邮件存储)      (Outlook)
```

**组件说明**：
- **MUA（Mail User Agent）**：邮件客户端（如 Outlook、Thunderbird）
- **MTA（Mail Transfer Agent）**：邮件服务器（如 Sendmail、Postfix）
- **MDA（Mail Delivery Agent）**：邮件投递代理（如 Procmail）

---

## SMTP（Simple Mail Transfer Protocol）

### 什么是 SMTP

SMTP 是用于发送邮件的应用层协议。

### SMTP 特点

- **发送邮件**：从客户端到服务器，服务器到服务器
- **端口**：25（标准）、587（提交）、465（SMTPS）
- **文本协议**：基于文本的命令和响应

---

## SMTP 工作过程

### SMTP 会话示例

```
客户端                          服务器
   |                              |
   |--- 连接到 25 端口 ---------->|
   |                              |
   |<-- 220 服务就绪 --------------|
   |                              |
   |--- HELO client.example.com ->|
   |<-- 250 OK -------------------|
   |                              |
   |--- MAIL FROM:<sender@example.com> ->|
   |<-- 250 OK -------------------|
   |                              |
   |--- RCPT TO:<recipient@example.com> ->|
   |<-- 250 OK -------------------|
   |                              |
   |--- DATA -------------------->|
   |<-- 354 开始输入邮件内容 ------|
   |                              |
   |--- 邮件内容 ----------------|
   |--- . (结束) ----------------->|
   |<-- 250 OK 邮件已接收 --------|
   |                              |
   |--- QUIT -------------------->|
   |<-- 221 关闭连接 --------------|
```

---

## SMTP 命令

### 常用命令

| 命令 | 说明 | 示例 |
|------|------|------|
| HELO | 问候服务器 | HELO client.example.com |
| EHLO | 扩展问候（支持扩展） | EHLO client.example.com |
| MAIL FROM | 发件人地址 | MAIL FROM:<sender@example.com> |
| RCPT TO | 收件人地址 | RCPT TO:<recipient@example.com> |
| DATA | 开始邮件内容 | DATA |
| QUIT | 退出 | QUIT |
| AUTH | 身份验证 | AUTH LOGIN |
| STARTTLS | 开始 TLS 加密 | STARTTLS |

### SMTP 响应码

| 响应码 | 说明 |
|--------|------|
| 220 | 服务就绪 |
| 250 | 请求操作完成 |
| 354 | 开始输入邮件内容 |
| 421 | 服务不可用 |
| 450 | 邮箱不可用 |
| 550 | 邮箱不存在 |
| 221 | 关闭连接 |

---

## SMTP 认证

### AUTH 命令

**目的**：防止未授权用户发送邮件

**方式**：
- **LOGIN**：用户名和密码（Base64 编码）
- **PLAIN**：用户名和密码（Base64 编码）
- **CRAM-MD5**：挑战-响应认证

**示例**：
```
AUTH LOGIN
334 VXNlcm5hbWU6  (Base64: Username:)
dXNlcm5hbWU=      (Base64: username)
334 UGFzc3dvcmQ6  (Base64: Password:)
cGFzc3dvcmQ=      (Base64: password)
235 认证成功
```

---

## SMTPS 和 STARTTLS

### SMTPS（SMTP over SSL）

**特点**：
- 直接使用 SSL/TLS 加密连接
- 端口：465

### STARTTLS

**特点**：
- 先建立普通连接，然后升级到 TLS
- 端口：25 或 587

**过程**：
```
客户端                          服务器
   |                              |
   |--- 连接到 587 端口 --------->|
   |<-- 220 服务就绪 --------------|
   |                              |
   |--- STARTTLS --------------->|
   |<-- 220 准备开始 TLS ----------|
   |                              |
   |<===== TLS 握手 =============>|
   |                              |
   |--- 加密的 SMTP 命令 --------->|
```

---

## POP3（Post Office Protocol 3）

### 什么是 POP3

POP3 是用于从邮件服务器接收邮件的协议。

### POP3 特点

- **接收邮件**：从服务器下载邮件到客户端
- **端口**：110（标准）、995（POP3S）
- **简单**：命令和响应简单

---

## POP3 工作过程

### POP3 会话示例

```
客户端                          服务器
   |                              |
   |--- 连接到 110 端口 --------->|
   |                              |
   |<-- +OK 服务就绪 --------------|
   |                              |
   |--- USER username ----------->|
   |<-- +OK 用户名正确 -------------|
   |                              |
   |--- PASS password ----------->|
   |<-- +OK 登录成功 --------------|
   |                              |
   |--- LIST -------------------->|
   |<-- +OK 邮件列表 --------------|
   |   1 1200                      |
   |   2 2400                      |
   |   .                           |
   |                              |
   |--- RETR 1 ------------------>|
   |<-- +OK 邮件内容 --------------|
   |   邮件正文...                 |
   |   .                           |
   |                              |
   |--- DELE 1 ------------------>|
   |<-- +OK 邮件已删除 -------------|
   |                              |
   |--- QUIT -------------------->|
   |<-- +OK 关闭连接 --------------|
```

---

## POP3 命令

### 常用命令

| 命令 | 说明 | 示例 |
|------|------|------|
| USER | 用户名 | USER username |
| PASS | 密码 | PASS password |
| LIST | 列出邮件 | LIST |
| RETR | 获取邮件 | RETR 1 |
| DELE | 删除邮件 | DELE 1 |
| STAT | 统计信息 | STAT |
| QUIT | 退出 | QUIT |

### POP3 响应

- **+OK**：成功响应
- **-ERR**：错误响应

---

## IMAP（Internet Message Access Protocol）

### IMAP vs POP3

| 特性 | POP3 | IMAP |
|------|------|------|
| 邮件存储 | 下载到客户端 | 保留在服务器 |
| 多设备同步 | ❌ | ✅ |
| 文件夹支持 | ❌ | ✅ |
| 搜索功能 | ❌ | ✅ |
| 服务器负载 | 低 | 高 |
| 离线访问 | ✅ | 需要网络 |

### IMAP 特点

- **邮件保留在服务器**：多设备可以同步
- **文件夹管理**：支持文件夹和标签
- **搜索功能**：服务器端搜索
- **端口**：143（标准）、993（IMAPS）

---

## 邮件格式

### 邮件结构

```
From: sender@example.com
To: recipient@example.com
Subject: 邮件主题
Date: Mon, 01 Jan 2024 12:00:00 +0800
Content-Type: text/plain; charset=utf-8

邮件正文
```

### MIME（Multipurpose Internet Mail Extensions）

**作用**：支持多媒体邮件（图片、附件等）

**Content-Type**：
- `text/plain`：纯文本
- `text/html`：HTML 格式
- `multipart/mixed`：包含附件
- `multipart/alternative`：多种格式（文本和 HTML）

---

## 实际应用

### 使用 telnet 发送邮件

```bash
telnet smtp.example.com 25
HELO client.example.com
MAIL FROM:<sender@example.com>
RCPT TO:<recipient@example.com>
DATA
Subject: Test Email

This is a test email.
.
QUIT
```

### 使用 Python 发送邮件

```python
import smtplib
from email.mime.text import MIMEText

# 创建邮件
msg = MIMEText('邮件正文', 'plain', 'utf-8')
msg['From'] = 'sender@example.com'
msg['To'] = 'recipient@example.com'
msg['Subject'] = '邮件主题'

# 发送邮件
smtp = smtplib.SMTP('smtp.example.com', 587)
smtp.starttls()
smtp.login('username', 'password')
smtp.send_message(msg)
smtp.quit()
```

### 使用 Python 接收邮件

```python
import poplib

# 连接 POP3 服务器
pop = poplib.POP3('pop.example.com', 110)
pop.user('username')
pop.pass_('password')

# 获取邮件列表
num_messages = len(pop.list()[1])

# 获取第一封邮件
response, lines, octets = pop.retr(1)
email_content = b'\n'.join(lines).decode('utf-8')

# 关闭连接
pop.quit()
```

---

## 常见问题

### 1. SMTP 和 POP3 的区别？

- **SMTP**：发送邮件（端口 25、587、465）
- **POP3**：接收邮件（端口 110、995）

### 2. 为什么邮件发送失败？

- 检查 SMTP 服务器地址和端口
- 检查是否需要认证
- 检查防火墙设置
- 检查是否被标记为垃圾邮件

### 3. POP3 和 IMAP 如何选择？

- **POP3**：单设备使用，需要离线访问
- **IMAP**：多设备使用，需要同步

---

## 总结

SMTP/POP3 要点：
- **SMTP**：发送邮件，端口 25/587/465
- **POP3**：接收邮件，端口 110/995
- **IMAP**：高级邮件访问，端口 143/993
- **安全**：使用 SMTPS、POP3S、IMAPS
- **认证**：AUTH 命令进行身份验证

理解邮件协议有助于邮件系统配置和故障排查。

---

**相关链接**：
- [03-TCP 协议](../03-TCP-IP/03-TCP协议.md) — SMTP/POP3 基于 TCP
- [03-HTTPS 与 TLS](../02-HTTP-HTTPS/03-HTTPS与TLS.md) — SMTPS/POP3S 使用 TLS

---

#SMTP #POP3 #IMAP #邮件协议

