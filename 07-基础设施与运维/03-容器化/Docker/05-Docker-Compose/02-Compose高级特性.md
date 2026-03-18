---
title: "Compose 高级特性"
date: "2026-03-18"
lastModified: "2026-03-18"
tags: ["Docker", "Docker Compose", "高级特性", "多服务编排"]
moc: "[[!MOC-Docker]]"
stage: "工程化实践"
prerequisites: ["Docker Compose 基础"]
description: "整理 Docker Compose 中覆盖文件、环境变量、扩展字段、健康检查和资源限制等高级能力。"
publish: true
aliases: ["Compose高级特性", "Docker Compose 高级用法"]
toc: true
---

# Compose 高级特性

> Docker Compose 的高级用法和特性

---

## 📋 目录

- [配置文件覆盖（override）](#配置文件覆盖override)
- [环境变量文件（.env）](#环境变量文件env)
- [扩展字段（extends）](#扩展字段extends)
- [健康检查配置](#健康检查配置)
- [资源限制配置](#资源限制配置)
- [部署配置](#部署配置)

---

## 配置文件覆盖（override）

### docker-compose.override.yml

Docker Compose 会自动读取 `docker-compose.override.yml` 文件来覆盖默认配置。

```yaml
# docker-compose.yml
version: '3.8'
services:
  web:
    image: nginx:latest
    ports:
      - "8080:80"
```

```yaml
# docker-compose.override.yml
version: '3.8'
services:
  web:
    volumes:
      - ./app:/app
    environment:
      - DEBUG=true
```

### 使用多个配置文件

```bash
# 使用多个配置文件
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

## 环境变量文件（.env）

### .env 文件

```bash
# .env
COMPOSE_PROJECT_NAME=myproject
HOST_PORT=8080
DB_PASSWORD=secretpassword
```

### 在 Compose 文件中使用

```yaml
version: '3.8'

services:
  web:
    image: nginx:latest
    ports:
      - "${HOST_PORT:-8080}:80"
    environment:
      - DB_PASSWORD=${DB_PASSWORD}
```

---

## 扩展字段（extends）

### 使用 extends

```yaml
# docker-compose.base.yml
version: '3.8'
services:
  base:
    image: nginx:latest
    environment:
      - NODE_ENV=production
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  web:
    extends:
      file: docker-compose.base.yml
      service: base
    ports:
      - "8080:80"
```

**注意**：extends 在 Compose 文件格式 3.x 中已废弃，建议使用 YAML 锚点。

---

## 健康检查配置

### 服务健康检查

```yaml
services:
  web:
    image: nginx:latest
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80/"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 40s
```

### 依赖健康检查

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

## 资源限制配置

### 资源限制

```yaml
services:
  web:
    image: nginx:latest
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

### 更新资源限制

```bash
# 更新服务资源限制
docker-compose up -d --no-deps web
```

---

## 部署配置

### 部署选项

```yaml
services:
  web:
    image: nginx:latest
    deploy:
      replicas: 3
      update_config:
        parallelism: 2
        delay: 10s
      restart_policy:
        condition: on-failure
        max_attempts: 3
```

### 重启策略

```yaml
services:
  web:
    image: nginx:latest
    restart: always
    # 或
    restart: unless-stopped
    restart: on-failure
    restart: no
```

---

## YAML 锚点和别名

### 使用锚点

```yaml
version: '3.8'

x-common-variables: &common-variables
  NODE_ENV: production
  DEBUG: false

services:
  web:
    image: nginx:latest
    environment:
      <<: *common-variables
      PORT: 3000

  api:
    image: node:16
    environment:
      <<: *common-variables
      PORT: 8080
```

---

## 实用技巧

### 条件配置

```yaml
services:
  web:
    image: nginx:latest
    # 根据环境变量条件配置
    deploy:
      replicas: ${REPLICAS:-1}
```

### 网络隔离

```yaml
services:
  frontend:
    image: nginx:latest
    networks:
      - frontend

  backend:
    image: node:16
    networks:
      - backend

networks:
  frontend:
  backend:
```

---

## 📚 参考资源

- [Docker Compose 文件参考](https://docs.docker.com/compose/compose-file/)
- [Docker Compose 环境变量](https://docs.docker.com/compose/environment-variables/)

---

## 相关笔记

- [01-Compose基础.md](./01-Compose基础.md)
- [03-多服务编排实践.md](./03-多服务编排实践.md)
- [04-Compose文件编写指南.md](./04-Compose文件编写指南.md)
