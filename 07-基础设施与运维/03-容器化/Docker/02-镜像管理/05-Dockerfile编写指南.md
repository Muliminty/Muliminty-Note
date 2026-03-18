---
title: "Dockerfile 编写指南"
date: "2026-03-18"
lastModified: "2026-03-18"
tags: ["Docker", "镜像管理", "Dockerfile", "配置指南"]
moc: "[[!MOC-Docker]]"
stage: "工程化实践"
prerequisites: ["镜像基础操作"]
description: "系统整理 Dockerfile 的基础结构、常用指令、多阶段构建思路与实际编写建议。"
publish: true
aliases: ["Dockerfile编写指南", "Dockerfile 指南"]
toc: true
---

# Dockerfile 编写指南

> Dockerfile 完整编写教程和最佳实践

---

## 📋 目录

- [Dockerfile 基础](#dockerfile-基础)
- [常用指令](#常用指令)
- [多阶段构建](#多阶段构建)
- [最佳实践](#最佳实践)
- [实际案例](#实际案例)

---

## Dockerfile 基础

### 什么是 Dockerfile

Dockerfile 是一个文本文件，包含了一系列指令，用于自动化构建 Docker 镜像。

### 基本结构

```dockerfile
# 注释
FROM base-image:tag
LABEL maintainer="your-email@example.com"
RUN command
COPY source dest
WORKDIR /path
EXPOSE port
CMD ["executable", "param1", "param2"]
```

---

## 常用指令

### FROM

指定基础镜像。

```dockerfile
# 使用官方镜像
FROM ubuntu:20.04

# 使用 Alpine（体积小）
FROM alpine:latest

# 多阶段构建
FROM node:16 AS builder
```

### RUN

执行命令并创建新的镜像层。

```dockerfile
# 执行单个命令
RUN apt-get update

# 执行多个命令（合并减少层数）
RUN apt-get update && \
    apt-get install -y nginx && \
    rm -rf /var/lib/apt/lists/*

# 使用 shell 形式
RUN echo "Hello" > /tmp/hello.txt
```

### COPY / ADD

复制文件到镜像中。

```dockerfile
# COPY（推荐）
COPY package.json /app/
COPY . /app/

# ADD（支持 URL 和解压，不推荐）
ADD https://example.com/file.tar.gz /tmp/
ADD file.tar.gz /tmp/  # 自动解压

# 复制多个文件
COPY package*.json ./
COPY src/ /app/src/
```

```dockerfile
# 基本语法
COPY <源路径> <目标路径>

# 示例
COPY package.json /app/package.json      # 复制并重命名
COPY package.json /app/                  # 复制到目录，保持原名
COPY src/ /app/src/                      # 复制整个目录
COPY . /app/                             # 复制所有
COPY *.js /app/                          # 通配符
COPY ["file1", "file2", "/target/"]      # JSON 格式（包含空格时用）
```

**区别**：
- `COPY`：只复制本地文件，更明确
- `ADD`：支持 URL 和自动解压，但行为不够明确

### WORKDIR

设置工作目录。

```dockerfile
WORKDIR /app
RUN pwd  # 输出 /app
```

### ENV

设置环境变量。

```dockerfile
# 设置单个变量
ENV NODE_ENV=production

# 设置多个变量
ENV NODE_ENV=production \
    PORT=3000

# 使用变量
ENV PATH=$PATH:/usr/local/bin
```

### ARG

定义构建参数。

```dockerfile
# 定义构建参数
ARG VERSION=latest
ARG BUILD_DATE

# 使用构建参数
RUN echo "Building version $VERSION"
```

构建时传递参数：
```bash
docker build --build-arg VERSION=1.0 -t myapp:1.0 .
```

### EXPOSE

声明容器运行时监听的端口。

```dockerfile
EXPOSE 80
EXPOSE 443
EXPOSE 3000/tcp
EXPOSE 8080/udp
```

**注意**：`EXPOSE` 只是声明，不会自动映射端口，需要使用 `-p` 参数。

### CMD

指定容器启动时执行的命令（可被覆盖）。

```dockerfile
# Shell 形式
CMD echo "Hello World"

# Exec 形式（推荐）
CMD ["executable", "param1", "param2"]

# 使用 ENTRYPOINT 配合
CMD ["--help"]
```

### ENTRYPOINT

指定容器启动时执行的命令（不可被覆盖）。

```dockerfile
# Exec 形式（推荐）
ENTRYPOINT ["executable", "param1", "param2"]

# Shell 形式
ENTRYPOINT echo "Hello"
```

**与 CMD 的区别**：
- `ENTRYPOINT`：容器启动时总是执行，参数会追加
- `CMD`：可以被 `docker run` 的参数覆盖

### USER

指定运行容器的用户。

```dockerfile
# 创建用户
RUN groupadd -r appuser && useradd -r -g appuser appuser

# 切换到用户
USER appuser

# 切换到用户 ID
USER 1000
```

### VOLUME

创建数据卷挂载点。

```dockerfile
VOLUME ["/data"]
VOLUME /var/log
```

### LABEL

添加元数据。

```dockerfile
LABEL maintainer="your-email@example.com"
LABEL version="1.0"
LABEL description="My application"
```

### HEALTHCHECK

定义健康检查。

```dockerfile
# 检查命令
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# 禁用健康检查
HEALTHCHECK NONE
```

---

## 多阶段构建

### 为什么使用多阶段构建

- 减小最终镜像体积
- 只包含运行时需要的文件
- 构建工具不进入最终镜像

### 示例

```dockerfile
# 阶段 1：构建
FROM node:16 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 阶段 2：运行
FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

---

## 最佳实践

### 1. 使用 .dockerignore

创建 `.dockerignore` 文件，排除不需要的文件：

```
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.nyc_output
coverage
```

### 2. 合理使用缓存

```dockerfile
# 先复制依赖文件，利用缓存
COPY package*.json ./
RUN npm install

# 再复制源代码
COPY . .
```

### 3. 减少镜像层数

```dockerfile
# 不好：多个 RUN 指令
RUN apt-get update
RUN apt-get install -y nginx
RUN rm -rf /var/lib/apt/lists/*

# 好：合并 RUN 指令
RUN apt-get update && \
    apt-get install -y nginx && \
    rm -rf /var/lib/apt/lists/*
```

### 4. 使用特定版本标签

```dockerfile
# 不好：使用 latest
FROM ubuntu:latest

# 好：使用特定版本
FROM ubuntu:20.04
```

### 5. 使用多阶段构建

减小最终镜像体积。

### 6. 非 root 用户运行

```dockerfile
RUN groupadd -r appuser && useradd -r -g appuser appuser
USER appuser
```

### 7. 最小化镜像

使用 Alpine 等轻量级基础镜像。

```dockerfile
FROM alpine:latest
RUN apk add --no-cache nodejs npm
```

---

## 实际案例

### Node.js 应用

```dockerfile
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs
EXPOSE 3000
CMD ["node", "index.js"]
```

### Python 应用

```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser
EXPOSE 8000
CMD ["python", "app.py"]
```

### Nginx 静态网站

```dockerfile
FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY dist/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 📚 参考资源

- [Dockerfile 官方文档](https://docs.docker.com/engine/reference/builder/)
- [Dockerfile 最佳实践](https://docs.docker.com/develop/dev-best-practices/)

---

## 相关笔记

- [02-镜像构建实践.md](./02-镜像构建实践.md)
- [04-镜像优化策略.md](./04-镜像优化策略.md)
- [../04-Dockerfile高级应用/04-Dockerfile最佳实践.md](../04-Dockerfile高级应用/04-Dockerfile最佳实践.md)
