# Nginx 配置学习笔记

基于 MemoBox 部署过程中遇到的实际问题，整理关键知识点和疑惑解答。

## 1. Docker Compose 安装问题

### 遇到的问题

执行 `sudo apt install docker-compose-plugin` 报错：
```
E: Unable to locate package docker-compose-plugin
```

### 原因分析

- Ubuntu 24.04 (Noble) 官方仓库中的包名是 `docker-compose-v2`，不是 `docker-compose-plugin`
- `docker-compose-plugin` 是 Docker 官方仓库的包名

### 解决方案对比

| 方案 | 命令 | 包来源 | 使用方式 |
|------|------|--------|----------|
| Ubuntu 官方包 | `apt install docker-compose-v2` | Ubuntu 仓库 | `docker compose` (空格) |
| Docker 官方源 | 添加 Docker 仓库后安装 | Docker 官方 | `docker compose` (空格) |
| 独立二进制 | 下载到 `/usr/local/bin/` | GitHub Release | `docker-compose` (连字符) |

### 关键知识点

- Docker Compose v2 是插件形式，集成到 docker CLI
- 推荐使用 `docker compose`（空格），而非旧版 `docker-compose`（连字符）

---

## 2. Docker 镜像拉取超时

### 遇到的问题

```
Error response from daemon: Get "https://registry-1.docker.io/v2/": context deadline exceeded
```

### 原因

- Docker Hub (registry-1.docker.io) 在国内访问受限
- 拉取 `nginx:alpine` 镜像时连接超时

### 解决方案

配置 Docker 镜像加速器（`/etc/docker/daemon.json`）：

```json
{
  "registry-mirrors": [
    "https://mirror.ccs.tencentyun.com",
    "https://docker.mirrors.ustc.edu.cn"
  ]
}
```

重启 Docker：

```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
```

### 替代方案

- 使用国内镜像源：`registry.cn-hangzhou.aliyuncs.com/library/nginx:alpine`
- 配置 HTTP 代理

---

## 3. Dockerfile 构建失败：public 目录不存在

### 遇到的问题

```
ERROR [memobox runner 4/9] COPY --from=builder /app/public ./public
"/app/public": not found
```

### 原因

- Next.js 项目根目录没有 `public` 文件夹
- Dockerfile 尝试从 builder 阶段复制 `/app/public`，但该目录不存在

### 解决方案

**方式 1**：在 Dockerfile builder 阶段创建目录

```dockerfile
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN mkdir -p /app/public  # 确保目录存在
RUN npm run build
```

**方式 2**：在项目中创建空目录

```bash
mkdir -p /opt/memobox/public
```

### 知识点

- Next.js 的 `public` 目录用于静态资源（favicon、图片等）
- 如果项目不需要静态资源，可以创建空目录避免构建失败

---

## 4. 多层 Nginx 架构理解

### 部署架构图

```
用户浏览器
   ↓ memo.muliminty.online
宿主机 Nginx (80/443端口)
   ↓ proxy_pass localhost:3001
Docker Nginx 容器 (3001:80)
   ↓ proxy_pass memobox:3000
Next.js 容器 (3000端口)
```

### 疑惑点：为什么需要两层 Nginx？

| 层级 | 作用 | 配置位置 | 职责 |
|------|------|----------|------|
| 宿主机 Nginx | 入口网关 | `/etc/nginx/sites-available/` | SSL 终止、域名路由、多项目管理 |
| Docker Nginx | 应用代理 | `/opt/memobox/nginx/nginx.conf` | 应用级配置、静态资源缓存 |

### 优势

- 宿主机 Nginx 可以管理多个项目（不同域名路由到不同端口）
- Docker Nginx 随应用打包，配置独立，便于迁移
- 职责分离：外层处理 HTTPS，内层处理应用逻辑

---

## 5. server_name 匹配与 Host 头

### 遇到的问题

- `curl localhost:3001` 返回 "Welcome to nginx!" 默认页
- 但应用实际在运行

### 原因分析

Docker Nginx 配置：

```nginx
server {
    listen 80;
    server_name memo.muliminty.online www.memo.muliminty.online;
    location / {
        proxy_pass http://memobox:3000;
    }
}
```

当 `curl localhost:3001` 时：

- HTTP 请求的 Host 头是 `localhost`
- Nginx 匹配 `server_name`，发现不匹配 `memo.muliminty.online`
- 回退到默认 server（nginx 默认页）

### 验证方法

```bash
# 不匹配 server_name - 返回默认页
curl localhost:3001

# 匹配 server_name - 返回应用
curl -H "Host: memo.muliminty.online" localhost:3001
```

### 知识点

- Nginx 通过 `Host` 请求头匹配 `server_name`
- 如果没有匹配的 server block，使用 default_server
- 生产环境通过域名访问时，Host 头自动正确

---

## 6. 容器状态 unhealthy 但应用正常

### 现象

```
docker ps
STATUS: Up 19 hours (unhealthy)
```

但应用可以正常访问。

### 原因

Dockerfile 健康检查配置：

```dockerfile
healthcheck:
  test: ['CMD', 'curl', '-f', 'http://localhost:3000/api/health']
  interval: 30s
  timeout: 10s
  retries: 3
```

如果 `/api/health` 端点：

- 不存在（404）
- 响应慢（超过 10s）
- 返回非 200 状态码

健康检查就会失败，显示 unhealthy。

### 重要

- `unhealthy` 不代表应用无法访问
- 只是健康检查端点有问题
- 应用的其他路由可能完全正常

### 解决方案

- 确保 `/api/health` 路由存在并返回 200
- 或修改健康检查为更通用的端点（如 `/`）

---

## 7. 宿主机 Nginx 配置缺失导致无法访问

### 问题

- Docker 容器运行正常
- `curl localhost:3001` 能访问
- 但通过域名或 IP 无法访问

### 排查发现

```bash
ls /etc/nginx/sites-enabled/
# 只有 default，没有 memo.muliminty.online
```

### 原因

- 宿主机 Nginx 没有配置反向代理到 3001 端口
- 外部请求到达 80 端口后，没有转发规则

### 完整访问链路

```
1. 浏览器 → DNS服务器
   解析 memo.muliminty.online → 服务器IP

2. 浏览器 → 宿主机Nginx:80
   HTTP请求到80端口
   ⚠️ 需要配置反向代理！

3. 宿主机Nginx → Docker Nginx:3001
   proxy_pass localhost:3001

4. Docker Nginx → Next.js:3000
   proxy_pass memobox:3000

5. Next.js → Docker Nginx → 宿主机Nginx → 浏览器
   响应返回
```

### 必需配置

创建 `/etc/nginx/sites-available/memo.muliminty.online`：

```nginx
server {
    listen 80;
    server_name memo.muliminty.online;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/memo.muliminty.online /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 8. 什么是反向代理

### 概念解释

**正向代理** vs **反向代理**：

```
正向代理（Forward Proxy）：
  客户端 → 代理服务器 → 目标服务器
  代理代表"客户端"去访问服务器
  例如：翻墙工具、公司网关

反向代理（Reverse Proxy）：
  客户端 → 代理服务器 → 后端服务器
  代理代表"服务器"接收请求
  例如：Nginx 反向代理
```

### 反向代理的作用

| 作用 | 说明 |
|------|------|
| **隐藏后端** | 客户端不知道真实服务器地址，只看到代理服务器 |
| **负载均衡** | 将请求分发到多个后端服务器 |
| **SSL 终止** | 在代理层处理 HTTPS，后端只需处理 HTTP |
| **缓存加速** | 缓存静态资源，减少后端压力 |
| **安全防护** | 过滤恶意请求，保护后端服务 |

### 在 MemoBox 中的应用

```nginx
server {
    listen 80;
    server_name memo.muliminty.online;
    
    location / {
        # 这就是反向代理配置
        # 将所有请求转发到 localhost:3001
        proxy_pass http://localhost:3001;
        
        # 传递原始请求信息给后端
        proxy_set_header Host $host;              # 原始域名
        proxy_set_header X-Real-IP $remote_addr;  # 客户端真实 IP
    }
}
```

**工作流程**：
1. 用户访问 `http://memo.muliminty.online/`
2. 请求到达宿主机 Nginx（监听 80 端口）
3. Nginx 根据 `proxy_pass` 将请求转发到 `localhost:3001`
4. Docker Nginx 收到请求，再转发给 Next.js 应用
5. 响应原路返回给用户

用户始终只看到 `memo.muliminty.online`，不知道背后是 3001 还是 3000 端口。

---

## 9. Nginx 配置目录与软链接

### 目录结构

```
/etc/nginx/
├── nginx.conf              # 主配置文件
├── sites-available/        # 所有可用的站点配置（存放处）
│   ├── default             # 默认站点
│   └── memo.muliminty.online  # MemoBox 站点配置
├── sites-enabled/          # 已启用的站点配置（软链接）
│   ├── default -> ../sites-available/default
│   └── memo.muliminty.online -> ../sites-available/memo.muliminty.online
└── conf.d/                 # 其他配置片段
```

### 为什么用软链接？

**软链接（Symbolic Link）** 是 Linux 中的"快捷方式"，指向另一个文件。

```bash
# 创建软链接的命令
sudo ln -s /etc/nginx/sites-available/memo.muliminty.online /etc/nginx/sites-enabled/
```

**命令解析**：

| 部分 | 含义 |
|------|------|
| `ln` | 创建链接的命令 |
| `-s` | 创建软链接（symbolic），不加则创建硬链接 |
| 第一个路径 | 源文件（实际配置文件） |
| 第二个路径 | 链接位置（启用目录） |

### 这种设计的好处

1. **配置文件只存一份**：实际文件在 `sites-available/`，不会重复
2. **启用/禁用很方便**：
   - 启用站点：创建软链接到 `sites-enabled/`
   - 禁用站点：删除软链接，配置文件保留
3. **便于管理**：一眼就能看出哪些站点是启用的

```bash
# 启用站点
sudo ln -s /etc/nginx/sites-available/memo.muliminty.online /etc/nginx/sites-enabled/

# 禁用站点（只删除链接，不删除配置文件）
sudo rm /etc/nginx/sites-enabled/memo.muliminty.online

# 查看已启用的站点
ls -la /etc/nginx/sites-enabled/
```

---

## 10. Nginx 配置测试与重载

### nginx -t：测试配置语法

```bash
sudo nginx -t
```

**作用**：检查 Nginx 配置文件语法是否正确，**不会影响正在运行的 Nginx**。

**输出示例**：

```bash
# 配置正确
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful

# 配置错误
nginx: [emerg] unknown directive "proxyy_pass" in /etc/nginx/sites-enabled/memo.muliminty.online:7
nginx: configuration file /etc/nginx/nginx.conf test failed
```

**为什么要先测试？**

- 避免语法错误导致 Nginx 重载失败
- 如果配置有误，重载时 Nginx 可能崩溃，导致所有网站无法访问
- **养成好习惯：每次修改配置后，先 `nginx -t`，再 `reload`**

### systemctl reload nginx：重载配置

```bash
sudo systemctl reload nginx
```

**reload vs restart 的区别**：

| 命令 | 行为 | 影响 |
|------|------|------|
| `reload` | 重新读取配置文件，平滑过渡 | **不中断服务**，现有连接保持 |
| `restart` | 完全停止再启动 | **短暂中断**，所有连接断开 |

**推荐使用 `reload`**：
- 不会中断现有用户的访问
- Nginx 会优雅地切换到新配置
- 只有配置正确才会生效

### 完整的配置修改流程

```bash
# 1. 编辑配置文件
sudo nano /etc/nginx/sites-available/memo.muliminty.online

# 2. 测试配置语法（必须！）
sudo nginx -t

# 3. 如果测试通过，重载配置
sudo systemctl reload nginx

# 4. 验证是否生效
curl -I http://memo.muliminty.online
```

### 常见错误排查

```bash
# 查看 Nginx 状态
sudo systemctl status nginx

# 查看错误日志
sudo tail -f /var/log/nginx/error.log

# 查看访问日志
sudo tail -f /var/log/nginx/access.log
```

---

## 关键命令速查

### Docker 相关

```bash
# 查看容器状态
docker ps
docker compose ps

# 查看容器日志
docker logs memobox
docker compose logs -f

# 重启容器
docker compose restart
docker compose down && docker compose up -d
```

### Nginx 相关

```bash
# 测试配置语法
sudo nginx -t

# 重载配置（不中断服务）
sudo systemctl reload nginx

# 查看错误日志
sudo tail -f /var/log/nginx/error.log

# 查看访问日志
sudo tail -f /var/log/nginx/access.log
```

### 网络诊断

```bash
# 检查端口监听
sudo netstat -tlnp | grep 3001
sudo ss -tlnp | grep 3001

# 测试本地访问
curl -I localhost:3001
curl -H "Host: memo.muliminty.online" localhost:3001

# 测试 DNS 解析
nslookup memo.muliminty.online
```

---

## 学习要点总结

1. **包管理差异**：不同来源的包名可能不同（docker-compose-plugin vs docker-compose-v2）

2. **国内网络环境**：需要配置镜像加速器才能顺利拉取 Docker 镜像

3. **多层代理架构**：理解宿主机 Nginx 和容器 Nginx 的不同职责

4. **server_name 匹配**：Nginx 通过 Host 头匹配 server_name，测试时需注意

5. **健康检查 ≠ 可用性**：unhealthy 状态不代表应用无法访问

6. **完整链路配置**：DNS → 宿主机 Nginx → Docker Nginx → 应用，每一层都需要正确配置

7. **配置文件位置**：
   - 宿主机：`/etc/nginx/sites-available/` + `/etc/nginx/sites-enabled/`
   - Docker：`/opt/memobox/nginx/nginx.conf`（挂载到容器）

8. **反向代理**：Nginx 作为中间层，接收客户端请求并转发给后端服务，隐藏真实服务地址

9. **软链接机制**：`sites-available` 存配置，`sites-enabled` 放软链接，方便启用/禁用站点

10. **配置修改流程**：编辑 → `nginx -t` 测试 → `reload` 重载，先测试再生效，避免服务中断

---

## 相关文档

- [宿主机 Nginx 配置指南](../memos/宿主机%20Nginx%20配置指南.md)
