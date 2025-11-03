# 服务端全局导航 MOC

> 本笔记作为服务端知识体系的顶层索引，串联所有子 MOC 和关键原子笔记。  
> 用法：作为入口导航，按需跳转到各层级或专题笔记。

---

## 🚀 快速起点

- [Nginx 配置指南](nginx/!MOC-nginx.md) — Web 服务器配置与管理
- [腾讯云部署指南](部署/腾讯云部署.md) — 服务器部署实践

---

## 🔧 Web 服务器

### Nginx

- [!MOC-nginx](nginx/!MOC-nginx.md)
  - 基础配置
  - 反向代理与负载均衡
  - 安全与 HTTPS
  - 性能优化

---

## 🚢 部署与运维

### 云平台部署

- [腾讯云部署](部署/腾讯云部署.md)
  - 服务器环境配置
  - 多项目部署
  - HTTPS 配置

### 部署工具

- Docker / Docker Compose
- Kubernetes (K8s)
- CI/CD 流程

---

## 💾 数据库

### 关系型数据库

- MySQL / PostgreSQL
- 数据库设计
- 性能优化

### NoSQL 数据库

- MongoDB
- Redis
- 缓存策略

---

## 🔌 API 设计

### RESTful API

- API 设计原则
- 版本管理
- 文档生成（Swagger/OpenAPI）

### GraphQL

- Schema 设计
- Resolver 实现
- 性能优化

---

## 🔐 安全

- 认证与授权（JWT / OAuth）
- 数据加密
- SQL 注入防护
- XSS / CSRF 防护
- 安全头部配置

---

## ⚡ 性能优化

- 数据库查询优化
- 缓存策略
- CDN 配置
- 负载均衡
- 监控与日志

---

## 🏗 架构设计

- 微服务架构
- 服务间通信
- 消息队列（RabbitMQ / Kafka）
- 分布式系统设计

---

## 📌 维护规范

- MOC 文件只做索引：每个条目指向一个原子笔记或子 MOC。
- 命名规范：`!MOC-模块名.md`，原子笔记按 `主题/概念.md` 命名。
- 更新频率：每次新增笔记后，务必在对应 MOC 中加入链接并补充简短注释。
