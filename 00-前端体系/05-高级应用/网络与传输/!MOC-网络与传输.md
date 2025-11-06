# 网络与传输 MOC

> 前端网络通信和数据传输，包括 HTTP 协议、缓存策略、数据交互方案。
> 
> **学习路径**：网络与传输是前端应用的基础，与 [性能优化](../../04-质量保障/性能/!MOC-性能.md) 密切相关。数据交互通常在前端框架（[React](../../02-框架进阶/React/!MOC-React.md)、[Vue](../../02-框架进阶/Vue/!MOC-Vue.md)）中使用，缓存策略与 [状态管理](../../02-框架进阶/状态管理/!MOC-状态管理.md) 配合。

---

## 📚 核心主题

- [HTTP/2/3、TLS基础](./HTTP-2-3-TLS基础.md) — HTTP 协议深入（与 [安全](../../04-质量保障/安全/!MOC-前端安全.md) 相关）
- [缓存策略（HTTP cache、Service Worker）](./缓存策略.md) — 缓存策略设计（详见 [性能优化](../../04-质量保障/性能/关键资源优化.md)）
- [REST/GraphQL/Streaming（SSE/WebSocket）](./REST-GraphQL-Streaming.md) — 数据交互方案（在前端框架中使用）
- [客户端缓存策略（SWR/React Query）](./客户端缓存策略.md) — 客户端数据缓存（配合 [React](../../02-框架进阶/React/!MOC-React.md) 使用，可参考 [状态管理](../../02-框架进阶/状态管理/!MOC-状态管理.md)）
- [离线与PWA](./离线与PWA.md) — 离线应用与 PWA（配合 [部署与发布](../部署与发布/!MOC-部署与发布.md)）

---

## 🎯 核心主题

### HTTP 协议
- HTTP/1.1、HTTP/2、HTTP/3
- TLS/SSL
- 请求和响应
- 状态码

### 缓存策略
- 浏览器缓存
- HTTP 缓存头
- Service Worker
- CDN 缓存

### 数据交互
- RESTful API
- GraphQL
- WebSocket
- Server-Sent Events (SSE)

### 客户端缓存
- SWR（配合 [React](../../02-框架进阶/React/!MOC-React.md) 使用）
- React Query（配合 [React](../../02-框架进阶/React/!MOC-React.md) 使用）
- 缓存策略（可参考 [状态管理](../../02-框架进阶/状态管理/!MOC-状态管理.md)）
- 数据同步

---

## 📝 学习建议

1. **前置知识**：需要掌握 [JavaScript 基础](../../01-基础入门/JavaScript/!MOC-javascript.md) 和前端框架基础
2. **学习顺序**：基础 → 框架 → 网络基础 → 数据交互 → 缓存策略
3. **相关主题**：
   - [性能优化](../../04-质量保障/性能/!MOC-性能.md)：缓存是性能优化的重要手段
   - [状态管理](../../02-框架进阶/状态管理/!MOC-状态管理.md)：客户端缓存与状态管理配合
   - [安全](../../04-质量保障/安全/!MOC-前端安全.md)：HTTPS、CSP 等安全策略
4. **实践应用**：数据交互和缓存策略在前端应用中非常重要，需要根据项目需求选择合适的方案

---

## 📖 学习资源

- [MDN HTTP](https://developer.mozilla.org/zh-CN/docs/Web/HTTP)
- [GraphQL 官方文档](https://graphql.org/)

---

#网络 #http #缓存 #数据传输

