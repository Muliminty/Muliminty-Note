# Node.js 知识地图 (MOC)

## 1. 基础概念
- Node.js 运行时环境
- 事件驱动与非阻塞 I/O
- 模块系统 (CommonJS, ESM)
- 包管理
  - [nvm](00-前端/00-核心/node/包管理器/nvm.md) - 管理多个 Node.js 版本

## 2. 核心模块与API
- 文件系统操作 (fs)
- 网络通信 (http, https, net)
- 流处理 (stream)
- 事件系统 (events)
- 进程管理 (process, child_process)
- 路径处理 (path)
- 缓冲区与二进制数据 (Buffer)

## 3. 开发工具与环境
- [使用 dotenv 轻松管理 Node.js 项目的多环境变量](./使用%20dotenv%20轻松管理%20Node.js%20项目的多环境变量.md) - 环境变量管理
- [使用 simple-git 操作 Git：详细指南](./使用%20simple-git%20操作%20Git：详细指南.md) - Git 操作集成
- 调试技巧
- 性能监控与优化

## 4. 数据库操作
- [Node.js 使用 JavaScript 语法操作数据库的方案](./Node.js%20使用%20JavaScript%20语法操作数据库的方案.md) - 数据库操作概览
- [构建sql技巧](./构建sql技巧.md) - SQL 查询构建详解
- [sqlBase](./sqlBase.md) - 基于 SQL 语句的通用 ORM 基类设计
- ORM 框架
  - Sequelize
  - TypeORM
  - Prisma
  - Objection.js
- 查询构建器
  - Knex.js

## 5. Web 开发
- HTTP 服务器
- RESTful API 设计
- 中间件架构
- 常用框架
  - Express.js
  - Koa.js
  - Fastify
  - NestJS
- [Strapi 简介](./Strapi%20简介.md) - Headless CMS 解决方案

## 6. 高级主题
- 异步编程模式
  - Callback
  - Promise
  - Async/Await
- 安全最佳实践
- 微服务架构
- GraphQL API
- WebSocket 实时通信
- 服务端渲染 (SSR)

## 7. 部署与运维
- 容器化 (Docker)
- 持续集成/持续部署 (CI/CD)
- 监控与日志
- 负载均衡
- 云服务部署

## 8. 测试
- 单元测试
- 集成测试
- 端到端测试
- 测试框架
  - Jest
  - Mocha
  - Chai

## 9. 设计模式与最佳实践
- 模块化设计
- 错误处理
- 依赖注入
- 代码组织
- 性能优化

## 10. 生态系统与工具
- npm 生态
- 常用库与工具
- 构建工具
  - Webpack
  - Rollup
  - esbuild

