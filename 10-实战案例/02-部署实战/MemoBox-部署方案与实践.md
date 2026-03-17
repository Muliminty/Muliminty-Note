# MemoBox 部署方案与实践

> MemoBox 是一个兼容 memos 数据格式的个人私人朋友圈项目，采用 Next.js + Docker + Nginx 架构部署。本文档详细记录项目的部署方案、架构设计和最佳实践。
> 
> **技术栈**：Next.js 16、React 19、TypeScript、SQLite (better-sqlite3)、Docker、Nginx
> 
> **部署环境**：腾讯云 Ubuntu 服务器

---

## 📚 目录

- [1. 项目概述](#1-项目概述)
- [2. 部署架构设计](#2-部署架构设计)
- [3. Docker 配置详解](#3-docker-配置详解)
- [4. Nginx 配置详解](#4-nginx-配置详解)
- [5. 环境变量管理](#5-环境变量管理)
- [6. 数据持久化方案](#6-数据持久化方案)
- [7. 完整部署流程](#7-完整部署流程)
- [8. 最佳实践与注意事项](#8-最佳实践与注意事项)

---

## 1. 项目概述

### 1.1 项目特点

- **全栈应用**：Next.js App Router，前后端一体化
- **数据存储**：SQLite 数据库（better-sqlite3）
- **文件存储**：本地文件系统存储资源文件
- **容器化部署**：Docker + Docker Compose
- **反向代理**：双层 Nginx 架构

### 1.2 技术选型理由

| 技术 | 选型理由 |
|------|---------|
| **Next.js 16** | App Router、Server Components、API Routes 一体化 |
| **SQLite** | 轻量级、无需独立数据库服务、适合个人项目 |
| **Docker** | 环境一致性、易于部署和维护 |
| **Nginx** | 高性能反向代理、静态资源缓存 |

---

## 2. 部署架构设计

### 2.1 整体架构图

```
用户访问 memo.muliminty.online
   ↓
宿主机主 Nginx (80/443) ← 对外暴露，处理 HTTPS
   ↓ 反向代理到 localhost:3001
Docker Nginx 容器 (3001:80) ← 宿主机端口 3001
   ↓ 通过 Docker 网络 memobox-network
Next.js 应用容器 (3000) ← 仅容器内，不对外暴露
   ↓
SQLite 数据库 + 资源文件 (Docker Volume)
```

### 2.2 端口规划

| 端口 | 服务 | 说明 | 访问方式 |
|------|------|------|----------|
| **80** | 宿主机主 Nginx | HTTP 入口（生产环境） | `http://memo.muliminty.online` |
| **443** | 宿主机主 Nginx | HTTPS 入口（生产环境） | `https://memo.muliminty.online` |
| **3001** | Docker Nginx 容器 | 容器端口映射 | `http://localhost:3001` |
| **3000** | Next.js 应用容器 | 容器内端口，不对外暴露 | 仅通过 Docker 网络访问 |

### 2.3 架构设计要点

1. **双层 Nginx 架构**
   - 宿主机 Nginx：处理 HTTPS、SSL 证书、域名路由
   - Docker Nginx：应用层反向代理、静态资源缓存

2. **容器网络隔离**
   - 使用 Docker 自定义网络 `memobox-network`
   - Next.js 应用不直接暴露端口，通过 Nginx 访问

3. **数据持久化**
   - 使用 Docker Volumes 挂载数据目录
   - 支持本地开发和生产环境不同路径配置

---

## 3. Docker 配置详解

### 3.1 Dockerfile 多阶段构建

```dockerfile
# 使用 Node.js 官方镜像
FROM node:20-alpine AS base

# 安装系统依赖（better-sqlite3 需要）
RUN apk add --no-cache python3 make g++

# 安装依赖阶段
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# 构建阶段
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 生产阶段
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制必要文件
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/lib ./lib

# 创建数据目录
RUN mkdir -p /app/data /app/backups
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

**关键点**：
- **多阶段构建**：减少最终镜像体积
- **非 root 用户**：提高安全性
- **standalone 模式**：Next.js 独立部署，只包含必要文件

### 3.2 Next.js Standalone 配置

```javascript
// next.config.js
const nextConfig = {
  output: 'standalone',  // 启用独立部署模式
  serverExternalPackages: ['better-sqlite3'],  // 外部包不打包
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',  // 文件上传大小限制
    },
  },
}
```

**standalone 模式优势**：
- 只包含运行时的必要文件
- 减少镜像体积
- 提高启动速度

### 3.3 Docker Compose 配置

```yaml
version: '3.8'

services:
  memobox:
    build:
      context: .
      dockerfile: Dockerfile
    platform: linux/amd64  # 指定平台，避免架构问题
    container_name: memobox
    restart: unless-stopped  # 自动重启策略

    # 不直接暴露端口，只通过 Nginx 访问
    # ports:  # 注释掉，不暴露端口

    environment:
      - NODE_ENV=${NODE_ENV:-production}
      - DATABASE_PATH=/app/data/memos_prod.db
      - STORAGE_PATH=/app/data/resources
      - THUMBNAIL_CACHE_PATH=/app/data/.thumbnail_cache
      - COOKIE_SECURE=${COOKIE_SECURE:-false}

    volumes:
      - ${DATA_PATH:-./data}:/app/data
      - ${BACKUPS_PATH:-./backups}:/app/backups

    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:3000/api/health']
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

    networks:
      - memobox-network

  nginx:
    image: nginx:alpine
    container_name: memobox-nginx
    ports:
      - "3001:80"  # 宿主机 3001 映射到容器内 80
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/app.conf
      - ./nginx/logs:/var/log/nginx
    restart: unless-stopped
    depends_on:
      - memobox
    networks:
      - memobox-network

networks:
  memobox-network:
    driver: bridge
```

**配置要点**：
- **平台指定**：`platform: linux/amd64` 避免 ARM 架构问题
- **健康检查**：自动检测容器健康状态
- **网络隔离**：使用自定义网络，容器间通信
- **数据持久化**：通过 volumes 挂载数据目录

---

## 4. Nginx 配置详解

### 4.1 Docker 内 Nginx 配置

```nginx
# nginx/nginx.conf
server {
    listen 80;
    listen [::]:80;
    server_name memo.muliminty.online www.memo.muliminty.online;

    charset utf-8;
    client_max_body_size 50M;  # 允许上传大文件

    access_log /var/log/nginx/app_access.log;
    error_log /var/log/nginx/app_error.log;

    # 反向代理到 Next.js 应用
    location / {
        proxy_pass http://memobox:3000;  # 通过 Docker 网络访问
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        # 缓冲设置（提高性能）
        proxy_buffering off;
    }

    # 健康检查端点
    location /api/health {
        proxy_pass http://memobox:3000/api/health;
        access_log off;
    }

    # 静态资源缓存
    location /_next/static {
        proxy_pass http://memobox:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }

    # 其他静态资源缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://memobox:3000;
        proxy_cache_valid 200 1d;
        expires 1d;
        add_header Cache-Control "public, immutable";
    }
}
```

**配置要点**：
- **WebSocket 支持**：`Upgrade` 和 `Connection` 头支持 WebSocket
- **静态资源缓存**：Next.js 静态资源和图片缓存优化
- **大文件上传**：`client_max_body_size 50M`

### 4.2 宿主机主 Nginx 配置

```nginx
# /etc/nginx/sites-available/memo.muliminty.online
server {
    listen 80;
    listen [::]:80;
    server_name memo.muliminty.online www.memo.muliminty.online;

    # 反向代理到 Docker Nginx 容器
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
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

**HTTPS 配置**（使用 Let's Encrypt）：

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取证书（会自动配置 Nginx）
sudo certbot --nginx -d memo.muliminty.online -d www.memo.muliminty.online
```

---

## 5. 环境变量管理

### 5.1 环境变量分类

**Docker Compose 配置变量**（用于 volumes 挂载）：
```bash
DATA_PATH=/opt/memobox/data
BACKUPS_PATH=/opt/memobox/backups
NODE_ENV=production
COOKIE_SECURE=true
```

**应用运行时变量**（容器内路径）：
```bash
DATABASE_PATH=/app/data/memos_prod.db
STORAGE_PATH=/app/data/resources
THUMBNAIL_CACHE_PATH=/app/data/.thumbnail_cache
```

### 5.2 不同环境配置

**本地开发（Mac）**：
```bash
# .env.local
DATA_PATH=./data
BACKUPS_PATH=./backups
NODE_ENV=development
COOKIE_SECURE=false
```

**生产环境（Ubuntu 服务器）**：
```bash
# .env
DATA_PATH=/opt/memobox/data
BACKUPS_PATH=/opt/memobox/backups
NODE_ENV=production
COOKIE_SECURE=true
```

### 5.3 环境变量使用原则

1. **路径配置**：
   - 本地开发：使用相对路径 `./data`
   - 生产环境：使用绝对路径 `/opt/memobox/data`

2. **安全配置**：
   - HTTP 环境：`COOKIE_SECURE=false`
   - HTTPS 环境：`COOKIE_SECURE=true`（必须）

3. **数据隔离**：
   - 不同环境使用不同的数据目录
   - 避免数据污染

---

## 6. 数据持久化方案

### 6.1 数据目录结构

```
/opt/memobox/
├── data/                    # 数据目录
│   ├── memos_prod.db       # SQLite 数据库
│   ├── resources/          # 资源文件（图片、文档等）
│   │   ├── 2024/
│   │   │   ├── 01/
│   │   │   │   └── xxx.jpg
│   │   └── ...
│   └── .thumbnail_cache/   # 缩略图缓存
└── backups/                # 备份目录
    └── memobox-backup-*.tar.gz
```

### 6.2 Docker Volume 挂载

```yaml
volumes:
  - ${DATA_PATH:-./data}:/app/data
  - ${BACKUPS_PATH:-./backups}:/app/backups
```

**挂载说明**：
- 宿主机路径：`/opt/memobox/data`（生产环境）
- 容器内路径：`/app/data`
- 数据持久化：容器删除后数据不丢失

### 6.3 数据备份方案

**自动备份脚本**：
```bash
#!/bin/bash
# scripts/backup.sh

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="memobox-backup-${TIMESTAMP}.tar.gz"

# 创建备份
tar -czf "${BACKUP_DIR}/${BACKUP_FILE}" \
  --exclude='.thumbnail_cache' \
  ./data/memos_prod.db \
  ./data/resources

echo "备份完成: ${BACKUP_FILE}"
```

**定时备份**（Crontab）：
```bash
# 每天凌晨 2 点自动备份
0 2 * * * /path/to/MemoBox/scripts/backup.sh
```

---

## 7. 完整部署流程

### 7.1 首次部署步骤

```bash
# 1. 克隆项目
git clone git@github.com:Muliminty/MemoBox.git
cd MemoBox

# 2. 配置环境变量
cp .env.production.example .env
nano .env  # 修改 DATA_PATH 和 BACKUPS_PATH

# 3. 创建数据目录
sudo mkdir -p /opt/memobox/data /opt/memobox/backups
sudo chown -R $USER:$USER /opt/memobox/data /opt/memobox/backups

# 4. 导入数据（如果有备份）
./scripts/import.sh /path/to/backup.tar.gz

# 5. 构建并启动
docker-compose up -d --build

# 6. 配置宿主机 Nginx
sudo nano /etc/nginx/sites-available/memo.muliminty.online
# 添加配置（见 4.2 节）

# 7. 启用配置
sudo ln -s /etc/nginx/sites-available/memo.muliminty.online /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 8. 配置 HTTPS（可选）
sudo certbot --nginx -d memo.muliminty.online
```

### 7.2 更新部署流程

```bash
# 1. 拉取最新代码
git pull

# 2. 备份数据（重要！）
./scripts/export.sh

# 3. 重新构建镜像
docker-compose build

# 4. 停止旧容器
docker-compose down

# 5. 启动新容器
docker-compose up -d

# 6. 查看日志确认
docker-compose logs -f
```

### 7.3 一键部署脚本

项目提供了自动化部署脚本 `scripts/deploy.sh`：

```bash
#!/bin/bash
# 功能：
# 1. 检查 Docker 环境
# 2. 检查 .env 文件
# 3. 创建数据目录
# 4. 构建并启动服务
# 5. 验证服务状态

./scripts/deploy.sh
```

---

## 8. 最佳实践与注意事项

### 8.1 安全建议

1. **使用 HTTPS**：
   - 生产环境必须使用 HTTPS
   - 设置 `COOKIE_SECURE=true`
   - 使用 Let's Encrypt 免费证书

2. **容器安全**：
   - 使用非 root 用户运行（已配置）
   - 定期更新基础镜像
   - 限制容器资源使用

3. **数据安全**：
   - 定期备份数据
   - 备份文件加密存储
   - 限制数据目录访问权限

### 8.2 性能优化

1. **Nginx 缓存**：
   - 静态资源缓存（已配置）
   - Next.js 构建产物缓存

2. **数据库优化**：
   - SQLite 适合小到中型应用
   - 定期执行 `VACUUM` 优化数据库

3. **资源文件优化**：
   - 图片自动生成缩略图
   - 使用 WebP 格式（可选）

### 8.3 监控与维护

**查看容器状态**：
```bash
docker-compose ps
docker-compose logs -f memobox
docker-compose logs -f nginx
```

**健康检查**：
```bash
# 检查应用健康状态
curl http://localhost:3001/api/health

# 检查容器健康状态
docker inspect memobox | grep Health -A 10
```

**资源监控**：
```bash
# 查看容器资源使用
docker stats

# 查看磁盘使用
df -h
du -sh /opt/memobox/data
```

### 8.4 常见问题排查

**问题 1：502 Bad Gateway**

**原因**：Next.js 应用未启动或端口不对

**解决**：
```bash
# 检查容器状态
docker-compose ps

# 查看应用日志
docker-compose logs memobox

# 检查端口映射
docker port memobox-nginx
```

**问题 2：数据库文件权限错误**

**原因**：数据目录权限不正确

**解决**：
```bash
# 检查权限
ls -la /opt/memobox/data

# 修改权限
sudo chown -R 1001:1001 /opt/memobox/data
```

**问题 3：静态资源 404**

**原因**：Next.js standalone 模式文件缺失

**解决**：
```bash
# 检查构建产物
docker-compose exec memobox ls -la /app/.next/static

# 重新构建
docker-compose build --no-cache
docker-compose up -d
```

### 8.5 数据迁移

**导出数据**：
```bash
./scripts/export.sh
# 生成: backups/memobox-backup-YYYYMMDD-HHMMSS.tar.gz
```

**导入数据**：
```bash
# 在新服务器上
./scripts/import.sh backups/memobox-backup-*.tar.gz
```

**迁移步骤**：
1. 在旧服务器导出数据
2. 将备份文件传输到新服务器
3. 在新服务器部署应用
4. 导入备份数据
5. 启动服务

---

## 📋 部署检查清单

### 部署前检查

- [ ] Docker 和 Docker Compose 已安装
- [ ] 环境变量文件 `.env` 已配置
- [ ] 数据目录已创建并设置权限
- [ ] 端口 3001 未被占用
- [ ] 防火墙规则已配置（80/443）

### 部署后验证

- [ ] 容器正常运行：`docker-compose ps`
- [ ] 应用健康检查通过：`curl http://localhost:3001/api/health`
- [ ] 宿主机 Nginx 配置正确
- [ ] 域名解析正确
- [ ] HTTPS 证书配置（如使用）
- [ ] 数据目录挂载正确

### 生产环境检查

- [ ] `COOKIE_SECURE=true` 已设置
- [ ] `NODE_ENV=production` 已设置
- [ ] 数据备份脚本已配置
- [ ] 定时备份已设置（Crontab）
- [ ] 日志目录已配置
- [ ] 监控告警已配置（可选）

---

## 🔗 相关链接

### 项目文档
- [MemoBox README](https://github.com/Muliminty/MemoBox) — 项目说明
- [部署备忘](../../MemoBox/!doc/03-运维教程/部署/备忘.md) — 快速部署指南
- [环境变量配置](../../MemoBox/!doc/03-运维教程/部署/环境变量配置.md) — 环境变量说明

### 技术文档
- [服务器多项目部署规范](./服务器多项目部署规范.md) — 多项目部署规范
- [Docker 核心概念](../../07-基础设施与运维/03-容器化/Docker/01-基础入门/02-核心概念.md) — Docker 基础
- [Nginx 多项目配置](../../07-基础设施与运维/02-Web服务器/Nginx/Nginx%20多项目配置与部署实践.md) — Nginx 配置

---

**最后更新**：2026-01-28  
**项目地址**：https://github.com/Muliminty/MemoBox

---

#部署 #Docker #Next.js #Nginx #反向代理 #容器化部署 #MemoBox #生产环境部署
