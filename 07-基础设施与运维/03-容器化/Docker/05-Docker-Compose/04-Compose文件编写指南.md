---
title: "Compose 文件编写指南"
date: "2026-03-18"
lastModified: "2026-03-18"
tags: ["Docker", "Docker Compose", "配置指南", "多服务编排"]
moc: "[[!MOC-Docker]]"
stage: "工程化实践"
prerequisites: ["Docker Compose 基础"]
description: "系统整理 Compose 文件中的服务、网络、数据卷、环境变量、依赖关系与配置模板写法。"
publish: true
aliases: ["Compose文件编写指南", "Docker Compose 配置指南"]
toc: true
---

# Compose 文件编写指南

> Docker Compose 文件的完整配置指南

---

## 📋 目录

- [文件版本](#文件版本)
- [服务定义](#服务定义)
- [网络配置](#网络配置)
- [数据卷配置](#数据卷配置)
- [环境变量](#环境变量)
- [依赖关系](#依赖关系)
- [配置变量与模板](#配置变量与模板)

---

## 文件版本

### version 字段

```yaml
version: '3.8'
```

**注意**：新版本的 Docker Compose 可以省略 version 字段。

### 版本选择

- `3.8`：推荐使用，功能完整
- `3.7`：较旧版本
- `2.x`：旧版本格式

---

## 服务定义

### 基本服务

```yaml
services:
  web:
    image: nginx:latest
    container_name: my-nginx
    ports:
      - "8080:80"
```

### 使用 Dockerfile 构建

```yaml
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        - VERSION=1.0.0
```

### 端口映射

```yaml
services:
  web:
    image: nginx:latest
    ports:
      - "8080:80"           # 简单映射
      - "127.0.0.1:8080:80" # 指定 IP
      - "8443:443"          # 多个端口
```

### 环境变量

```yaml
services:
  web:
    image: nginx:latest
    environment:
      - NODE_ENV=production
      - PORT=3000
    # 或使用字典格式
    environment:
      NODE_ENV: production
      PORT: 3000
```

### 使用 .env 文件

```yaml
services:
  web:
    image: nginx:latest
    env_file:
      - .env
      - .env.production
```

---

## 网络配置

### 默认网络

```yaml
services:
  web:
    image: nginx:latest
  db:
    image: postgres:13
# 自动创建默认网络，服务可以通过服务名通信
```

### 自定义网络

```yaml
services:
  web:
    image: nginx:latest
    networks:
      - frontend
  db:
    image: postgres:13
    networks:
      - backend

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
```

### 网络配置选项

```yaml
networks:
  my-network:
    driver: bridge
    driver_opts:
      com.docker.network.bridge.name: my-bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

---

## 数据卷配置

### 命名数据卷

```yaml
services:
  db:
    image: postgres:13
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
    driver: local
```

### 绑定挂载

```yaml
services:
  web:
    image: nginx:latest
    volumes:
      - ./app:/app
      - ./config:/etc/nginx/conf.d:ro
```

### 临时文件系统

```yaml
services:
  web:
    image: nginx:latest
    tmpfs:
      - /tmp
      - /var/cache
```

---

## 环境变量

### 在 Compose 文件中定义

```yaml
services:
  web:
    image: nginx:latest
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgres://db:5432/mydb
```

### 使用 .env 文件

```bash
# .env 文件
NODE_ENV=production
DATABASE_URL=postgres://db:5432/mydb
```

```yaml
services:
  web:
    image: nginx:latest
    env_file:
      - .env
```

### 变量替换

```yaml
services:
  web:
    image: nginx:${VERSION:-latest}
    ports:
      - "${PORT:-8080}:80"
```

---

## 依赖关系

### depends_on

```yaml
services:
  web:
    image: nginx:latest
    depends_on:
      - db
      - redis

  db:
    image: postgres:13

  redis:
    image: redis:latest
```

### 健康检查依赖

```yaml
services:
  web:
    image: nginx:latest
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:13
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
```

---

## 配置变量与模板

### 使用变量

```yaml
version: '3.8'

services:
  web:
    image: ${IMAGE_NAME:-nginx}:${IMAGE_TAG:-latest}
    ports:
      - "${HOST_PORT:-8080}:80"
```

### 环境变量文件

```bash
# .env
IMAGE_NAME=nginx
IMAGE_TAG=latest
HOST_PORT=8080
```

### 条件配置

```yaml
services:
  web:
    image: nginx:latest
    # 使用条件配置
    deploy:
      replicas: ${REPLICAS:-1}
```

---

## 完整示例

### Web 应用 + 数据库 + Redis

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "${HOST_PORT:-8080}:80"
    depends_on:
      - db
      - redis
    environment:
      - DATABASE_URL=postgres://db:5432/mydb
      - REDIS_URL=redis://redis:6379
    networks:
      - app-network

  db:
    image: postgres:13
    environment:
      - POSTGRES_PASSWORD=${DB_PASSWORD:-password}
      - POSTGRES_DB=${DB_NAME:-mydb}
    volumes:
      - db-data:/var/lib/postgresql/data
    networks:
      - app-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:latest
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  db-data:
```

---

## 📚 参考资源

- [Docker Compose 文件参考](https://docs.docker.com/compose/compose-file/)
- [Docker Compose 环境变量](https://docs.docker.com/compose/environment-variables/)

---

## 相关笔记

- [01-Compose基础.md](./01-Compose基础.md)
- [02-Compose高级特性.md](./02-Compose高级特性.md)
- [03-多服务编排实践.md](./03-多服务编排实践.md)
