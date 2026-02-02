# HTTPS 配置指南（腾讯云证书）

本文档说明如何用腾讯云购买的 SSL 证书，为 `memo.muliminty.online` 配置 HTTPS，使 `https://memo.muliminty.online` 及 `/login` 等页面支持 HTTPS。按步骤执行即可完成配置。

---

## 1. 前置说明

### 目标

- 让 `https://memo.muliminty.online`（含 `/login`）支持 HTTPS。
- 可选：将 HTTP 自动跳转到 HTTPS。

### 架构

```
浏览器
   ↓ https://memo.muliminty.online
宿主机 Nginx（80 / 443）  ← SSL 在这里终结
   ↓ proxy_pass http://localhost:3001
Docker Nginx 容器（3001:80）
   ↓ proxy_pass http://memobox:3000
MemoBox 应用（3000）
```

- **证书和 HTTPS**：只在宿主机 Nginx 上配置，宿主机到 3001、3000 仍用 HTTP。
- **后端感知 HTTPS**：通过 `X-Forwarded-Proto $scheme` 等请求头传给 MemoBox。

### 证书来源

- 腾讯云购买的 SSL 证书，服务器类型选择 **Nginx**。
- 下载后的压缩包解压得到文件夹：**`muliminty.online_nginx`**（名称以你申请时的域名为准）。

---

## 2. 如何查腾讯云文档

### 主文档

- **Nginx 服务器 SSL 证书安装部署（Linux）**  
  https://cloud.tencent.com/document/product/400/35244

### 文档里可以查什么

| 需求 | 在文档中的位置 |
|------|----------------|
| 证书下载、解压后有哪些文件 | 「操作步骤」→「证书安装」→ 文件夹内容说明 |
| 如何把证书文件上传到服务器 | 「前提条件」→ 如何将本地文件拷贝到云服务器 / 上传文件到云服务器 |
| 如何开放 443 端口 | 文档内「操作场景」→ 服务器如何开启443端口；安全组入站规则 |
| Nginx 里 SSL 块怎么写（协议、套件等） | 「操作步骤」→ 证书安装 → server 块示例；HTTP 跳转 HTTPS 可选配置 |

### 与本场景的重要差异

- 腾讯云文档示例里，`location /` 是 **静态站点** 写法：`root html; index index.html index.htm;`
- 我们是 **反向代理**：`location /` 里必须用 `proxy_pass http://localhost:3001`，并保留 `proxy_set_header Host`、`X-Forwarded-Proto` 等，**不要照抄文档里的 root html**。
- 下面「步骤三」会给出适合 MemoBox 的完整 Nginx 配置，直接使用即可。

---

## 3. 证书文件说明（muliminty.online_nginx）

解压 `muliminty.online_nginx` 后，典型文件如下：

| 文件 | 用途 |
|------|------|
| `muliminty.online_bundle.crt` | 证书链，Nginx 使用（必须） |
| `muliminty.online.key` | 私钥（必须） |
| `muliminty.online_bundle.pem` | PEM 格式证书（可选） |
| `muliminty.online.csr` | 申请证书时使用，部署可忽略 |

**部署 Nginx 只需要这两个文件：**

- `muliminty.online_bundle.crt`
- `muliminty.online.key`

---

## 4. 操作步骤（按顺序执行）

### 步骤一：开放 443 端口

1. **腾讯云安全组**  
   - 登录腾讯云控制台 → 云服务器 → 安全组。  
   - 添加入站规则：协议 **TCP**，端口 **443**，来源按需（如 `0.0.0.0/0`）。

2. **本机防火墙（若使用 UFW）**

```bash
sudo ufw allow 443/tcp
sudo ufw reload
```

### 步骤二：上传证书到服务器

1. 在服务器上创建证书目录：

```bash
sudo mkdir -p /etc/nginx/ssl
```

2. 将本地的 **`muliminty.online_bundle.crt`** 和 **`muliminty.online.key`** 上传到服务器的 `/etc/nginx/ssl/` 目录。  
   - 可用：scp、WinSCP、腾讯云「文件上传」等。

3. （可选）限制私钥权限：

```bash
sudo chmod 600 /etc/nginx/ssl/muliminty.online.key
```

### 步骤三：编辑宿主机 Nginx 站点配置

1. 编辑站点配置（与现有 HTTP 配置同一文件）：

```bash
sudo nano /etc/nginx/sites-available/memo.muliminty.online
```

2. 用下面完整配置**替换**原有内容（或在此基础上合并你已有的其他配置）。  
   **注意**：证书路径为 `/etc/nginx/ssl/muliminty.online_bundle.crt` 和 `/etc/nginx/ssl/muliminty.online.key`，若你实际路径不同，请修改前两处 `ssl_*` 行。

```nginx
# HTTP：自动跳转到 HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name memo.muliminty.online www.memo.muliminty.online;
    return 301 https://$host$request_uri;
}

# HTTPS：腾讯云证书 + 反向代理到 MemoBox
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name memo.muliminty.online www.memo.muliminty.online;

    # 证书路径（请与实际上传路径一致）
    ssl_certificate     /etc/nginx/ssl/muliminty.online_bundle.crt;
    ssl_certificate_key /etc/nginx/ssl/muliminty.online.key;

    ssl_session_timeout 5m;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
    ssl_prefer_server_ciphers on;

    # 反向代理到 Docker Nginx（不要写 root html）
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

3. 若之前没有启用该站点，需要创建软链接：

```bash
sudo ln -s /etc/nginx/sites-available/memo.muliminty.online /etc/nginx/sites-enabled/
```

### 步骤四：测试并重载 Nginx

1. 测试配置语法：

```bash
sudo nginx -t
```

2. 若有报错：检查证书路径、文件名是否与上面一致，以及语法是否完整。

3. 测试通过后重载 Nginx：

```bash
sudo systemctl reload nginx
```

### 步骤五：MemoBox 侧（HTTPS 下建议）

1. 在 MemoBox 项目目录下编辑 `.env`（例如 `/opt/memobox/.env`），增加或修改：

```bash
COOKIE_SECURE=true
```

2. 重启 MemoBox 容器使环境变量生效：

```bash
cd /opt/memobox
docker compose restart memobox
```

### 步骤六：验证

1. 浏览器访问 **https://memo.muliminty.online/login**，确认：
   - 地址栏有小锁图标，无证书告警。
2. 访问 **http://memo.muliminty.online**，应自动 301 跳转到 **https://memo.muliminty.online**。

---

## 5. 故障排查

| 现象 | 可能原因 | 处理建议 |
|------|----------|----------|
| 502 Bad Gateway | 后端未启动或 3001 未监听 | `docker ps`、`docker compose ps`，确认容器运行；`curl -I http://localhost:3001` 测试 |
| 证书不受信任 / 告警 | 域名与证书不一致、证书过期 | 核对证书域名、有效期；浏览器查看证书详情 |
| 443 无法访问 | 安全组或防火墙未放行 443 | 检查腾讯云安全组入站规则、本机 UFW |
| nginx -t 报错 | 证书路径或文件名错误 | 核对 `ssl_certificate`、`ssl_certificate_key` 路径与实际上传位置一致 |

查看 Nginx 错误日志：

```bash
sudo tail -f /var/log/nginx/error.log
```

---

## 6. 相关文档

- **腾讯云**： [Nginx 服务器 SSL 证书安装部署（Linux）](https://cloud.tencent.com/document/product/400/35244)
- **本仓库**：
  - [宿主机 Nginx 配置指南](../memos/宿主机%20Nginx%20配置指南.md)（HTTP 与基础架构）
  - [Nginx配置学习笔记](./Nginx配置学习笔记.md)（概念与问题整理）
