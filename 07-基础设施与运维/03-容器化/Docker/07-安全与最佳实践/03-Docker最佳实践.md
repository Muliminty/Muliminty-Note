---
title: "Docker 最佳实践"
date: "2026-03-19"
lastModified: "2026-03-19"
tags: ["Docker", "最佳实践", "生产环境", "容器化"]
moc: "[[!MOC-Docker]]"
stage: "工程化实践"
prerequisites: ["安全基础", "安全配置实践", "Dockerfile 最佳实践"]
description: "总结 Docker 在镜像管理、容器运行、网络、存储和监控日志方面的通用最佳实践。"
publish: true
aliases: ["Docker最佳实践", "Docker 生产环境最佳实践"]
toc: true
---

# Docker 最佳实践

> Docker 生产环境最佳实践

---

## 📋 目录

- [镜像管理最佳实践](#镜像管理最佳实践)
- [容器运行最佳实践](#容器运行最佳实践)
- [网络配置最佳实践](#网络配置最佳实践)
- [存储配置最佳实践](#存储配置最佳实践)
- [监控与日志最佳实践](#监控与日志最佳实践)

---

## 镜像管理最佳实践

### 1. 使用特定版本标签

```dockerfile
# 好的做法
FROM node:16.14.2-alpine

# 不好的做法
FROM node:latest
```

### 2. 定期更新基础镜像

```bash
# 定期更新基础镜像
docker pull node:16.14.2-alpine
```

### 3. 扫描镜像漏洞

```bash
# 扫描镜像
docker scout cves myapp:latest
```

---

## 容器运行最佳实践

### 1. 使用非 root 用户

```dockerfile
USER appuser
```

### 2. 设置资源限制

```bash
docker run -d \
  --cpus="1.0" \
  --memory="512m" \
  nginx:latest
```

### 3. 使用健康检查

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:80/ || exit 1
```

---

## 网络配置最佳实践

### 1. 使用自定义网络

```bash
docker network create my-network
```

### 2. 网络隔离

```bash
docker network create --internal isolated-network
```

---

## 存储配置最佳实践

### 1. 使用命名数据卷

```bash
docker volume create app-data
```

### 2. 定期备份

```bash
# 定时备份数据卷
```

---

## 监控与日志最佳实践

### 1. 配置日志驱动

```bash
docker run --log-driver json-file --log-opt max-size=10m nginx:latest
```

### 2. 监控容器资源

```bash
docker stats
```

---

## 📚 参考资源

- [Docker 官方文档 - 最佳实践](https://docs.docker.com/develop/dev-best-practices/)
- [Docker 生产环境指南](https://docs.docker.com/config/containers/logging/)

---

## 相关笔记

- [01-安全基础.md](./01-安全基础.md)
- [02-安全配置实践.md](./02-安全配置实践.md)
- [../08-生产环境部署/01-部署策略.md](../08-生产环境部署/01-部署策略.md)
