---
title: "Dockerfile 最佳实践"
date: "2026-03-19"
lastModified: "2026-03-19"
tags: ["Docker", "Dockerfile", "最佳实践", "镜像优化"]
moc: "[[!MOC-Docker]]"
stage: "工程化实践"
prerequisites: ["Dockerfile 编写指南", "多阶段构建", "构建参数与变量"]
description: "总结 Dockerfile 在指令顺序、缓存利用、安全性、可维护性与性能优化方面的常见最佳实践。"
publish: true
aliases: ["Dockerfile最佳实践"]
toc: true
---

# Dockerfile 最佳实践

> 编写高效、安全、可维护的 Dockerfile 的最佳实践

---

## 📋 目录

- [指令顺序优化](#指令顺序优化)
- [缓存利用](#缓存利用)
- [安全性考虑](#安全性考虑)
- [可维护性](#可维护性)
- [性能优化](#性能优化)
- [完整示例](#完整示例)

---

## 指令顺序优化

### 原则

将变化频率低的指令放在前面，变化频率高的指令放在后面。

### 好的做法

```dockerfile
# 1. 基础镜像（变化频率低）
FROM node:16-alpine

# 2. 元数据（变化频率低）
LABEL maintainer="your-email@example.com"

# 3. 依赖文件（变化频率低）
COPY package*.json ./
RUN npm ci

# 4. 源代码（变化频率高）
COPY . .

# 5. 构建和运行
RUN npm run build
CMD ["npm", "start"]
```

### 不好的做法

```dockerfile
# 先复制所有文件，导致缓存失效
COPY . .
RUN npm install
```

---

## 缓存利用

### 合并 RUN 指令

```dockerfile
# 好的做法：合并指令，减少层数
RUN apt-get update && \
    apt-get install -y nginx && \
    rm -rf /var/lib/apt/lists/*

# 不好的做法：多个指令创建多个层
RUN apt-get update
RUN apt-get install -y nginx
RUN rm -rf /var/lib/apt/lists/*
```

### 利用构建缓存

```dockerfile
# 先复制依赖文件（变化频率低）
COPY package*.json ./
RUN npm install

# 再复制源代码（变化频率高）
COPY . .
RUN npm run build
```

---

## 安全性考虑

### 使用非 root 用户

```dockerfile
# 创建非 root 用户
RUN addgroup -g 1000 appuser && \
    adduser -D -u 1000 -G appuser appuser

# 切换到非 root 用户
USER appuser

# 设置工作目录权限
WORKDIR /app
RUN chown -R appuser:appuser /app
```

### 最小化镜像

```dockerfile
# 使用 Alpine 或 slim 镜像
FROM node:16-alpine

# 只安装必要的包
RUN apk add --no-cache curl
```

### 避免敏感信息

```dockerfile
# 不好的做法：硬编码密码
ENV DB_PASSWORD=secret123

# 好的做法：使用 ARG 或运行时环境变量
ARG DB_PASSWORD
ENV DATABASE_PASSWORD=$DB_PASSWORD
```

### 使用 .dockerignore

```dockerignore
# 排除敏感文件
.env
*.key
*.pem
secrets/
```

---

## 可维护性

### 使用特定版本标签

```dockerfile
# 好的做法：使用具体版本
FROM node:16.14.2-alpine

# 不好的做法：使用 latest
FROM node:latest
```

### 添加元数据

```dockerfile
LABEL maintainer="your-email@example.com"
LABEL version="1.0.0"
LABEL description="My application"
```

### 使用多阶段构建

```dockerfile
# 构建阶段
FROM node:16 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 运行阶段
FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/index.js"]
```

---

## 性能优化

### 减少镜像层数

```dockerfile
# 合并 RUN 指令
RUN apt-get update && \
    apt-get install -y nginx && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

### 清理缓存

```dockerfile
# 清理包管理器缓存
RUN apt-get update && \
    apt-get install -y nginx && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

### 使用 .dockerignore

```dockerignore
node_modules/
.git/
*.log
test/
```

---

## 完整示例

### Node.js 应用

```dockerfile
# 使用特定版本的基础镜像
FROM node:16.14.2-alpine AS builder

# 设置工作目录
WORKDIR /app

# 添加元数据
LABEL maintainer="your-email@example.com"
LABEL version="1.0.0"

# 复制依赖文件（利用缓存）
COPY package*.json ./
RUN npm ci --only=production

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 运行阶段
FROM node:16.14.2-alpine

# 创建非 root 用户
RUN addgroup -g 1000 appuser && \
    adduser -D -u 1000 -G appuser appuser

WORKDIR /app

# 只复制运行时需要的文件
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# 设置权限
RUN chown -R appuser:appuser /app

# 切换到非 root 用户
USER appuser

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s \
  CMD node healthcheck.js || exit 1

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", "dist/index.js"]
```

### Python 应用

```dockerfile
FROM python:3.9-slim AS builder

WORKDIR /app

# 安装依赖
COPY requirements.txt .
RUN pip install --user -r requirements.txt

# 运行阶段
FROM python:3.9-slim

WORKDIR /app

# 创建非 root 用户
RUN useradd -m -u 1000 appuser

# 复制已安装的包
COPY --from=builder /root/.local /root/.local

# 复制应用代码
COPY . .

# 设置权限
RUN chown -R appuser:appuser /app

# 切换到非 root 用户
USER appuser

# 确保使用用户安装的包
ENV PATH=/root/.local/bin:$PATH

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s \
  CMD python healthcheck.py || exit 1

EXPOSE 8000

CMD ["python", "app.py"]
```

---

## 检查清单

- [ ] 使用特定版本的基础镜像
- [ ] 优化指令顺序，利用缓存
- [ ] 合并 RUN 指令，减少层数
- [ ] 使用非 root 用户运行
- [ ] 清理不必要的文件和缓存
- [ ] 使用 .dockerignore 排除不必要文件
- [ ] 添加健康检查
- [ ] 使用多阶段构建减小镜像体积
- [ ] 添加元数据标签
- [ ] 避免硬编码敏感信息

---

## 📚 参考资源

- [Docker 官方文档 - 最佳实践](https://docs.docker.com/develop/dev-best-practices/)
- [Dockerfile 最佳实践指南](https://docs.docker.com/develop/dev-best-practices/)

---

## 相关笔记

- [01-多阶段构建.md](./01-多阶段构建.md)
- [02-构建参数与变量.md](./02-构建参数与变量.md)
- [03-健康检查配置.md](./03-健康检查配置.md)
