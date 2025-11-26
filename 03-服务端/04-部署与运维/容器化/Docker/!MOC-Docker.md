# Docker 知识体系（Docker）MOC

> Docker 容器化技术的完整知识体系
> 
> **学习路径**：Docker 是现代应用部署的基础工具，掌握 Docker 后可以学习 [Docker Compose](#5-docker-compose-多服务编排) 进行多服务编排，或进阶到 [Kubernetes](../Kubernetes/!MOC-Kubernetes.md) 进行容器编排。
> 
> **参考资源**：[Docker 官方文档](https://docs.docker.com/)

---

## 📚 知识体系分类说明

### 容器化 vs 虚拟化

**虚拟化（Virtualization）**：
- 在物理服务器上运行多个完整的操作系统
- 每个虚拟机包含完整的操作系统内核
- 资源消耗大，启动慢
- 示例：VMware、VirtualBox、KVM

**容器化（Containerization）**：
- 在宿主机操作系统上运行多个隔离的应用环境
- 共享宿主机操作系统内核
- 资源消耗小，启动快
- 示例：Docker、Podman、containerd

### Docker 核心概念

**镜像（Image）**：
- 只读的模板，用于创建容器
- 类似于面向对象中的"类"
- 可以基于其他镜像创建新镜像

**容器（Container）**：
- 镜像的运行实例
- 类似于面向对象中的"对象"
- 可以创建、启动、停止、删除

**仓库（Repository）**：
- 存储镜像的地方
- Docker Hub 是公共仓库
- 可以搭建私有仓库

---

## 📚 知识体系

### 1. 基础入门（Getting Started）

Docker 的安装、配置和基本概念。

#### 安装与环境配置
- [Docker 安装指南](./01-基础入门/安装与环境配置.md) — Docker 在不同平台的安装方法
  - Linux 安装（Ubuntu、CentOS、Debian）
  - macOS 安装
  - Windows 安装
  - Docker Desktop 使用
  - 安装验证与测试

#### 核心概念
- [Docker 核心概念](./01-基础入门/核心概念.md) — Docker 基础概念理解
  - 镜像（Image）概念
  - 容器（Container）概念
  - 仓库（Repository）概念
  - 镜像与容器的关系
  - 命名空间与隔离机制

#### 基本命令
- [Docker 基本命令](./01-基础入门/基本命令.md) — Docker 常用命令详解
  - `docker version` - 查看版本
  - `docker info` - 查看系统信息
  - `docker run` - 运行容器
  - `docker ps` - 查看容器
  - `docker images` - 查看镜像
  - `docker pull` - 拉取镜像
  - `docker push` - 推送镜像
  - `docker build` - 构建镜像
  - `docker exec` - 执行命令
  - `docker logs` - 查看日志

---

### 2. 镜像管理（Image Management）

Docker 镜像的构建、管理和优化。

#### 镜像基础
- [镜像基础操作](./02-镜像管理/镜像基础操作.md) — 镜像的拉取、查看、删除
  - 从 Docker Hub 拉取镜像
  - 查看本地镜像列表
  - 查看镜像详细信息
  - 删除镜像
  - 镜像标签管理
  - 镜像导出与导入

#### Dockerfile 编写
- [Dockerfile 编写指南](./02-镜像管理/Dockerfile编写指南.md) — Dockerfile 完整编写教程
  - Dockerfile 语法与指令
  - FROM - 基础镜像
  - RUN - 执行命令
  - COPY/ADD - 复制文件
  - WORKDIR - 工作目录
  - ENV - 环境变量
  - EXPOSE - 暴露端口
  - CMD/ENTRYPOINT - 启动命令
  - 多阶段构建（Multi-stage Build）
  - 最佳实践与优化

#### 镜像构建
- [镜像构建实践](./02-镜像管理/镜像构建实践.md) — 镜像构建的实践技巧
  - 构建上下文理解
  - .dockerignore 文件
  - 构建缓存机制
  - 构建参数传递
  - 多架构构建
  - 构建优化技巧

#### 镜像优化
- [镜像优化策略](./02-镜像管理/镜像优化策略.md) — 减小镜像体积、提升构建速度
  - 选择合适的基础镜像
  - 减少镜像层数
  - 合并 RUN 指令
  - 清理不必要的文件
  - 使用多阶段构建
  - 镜像大小分析工具

#### 镜像仓库
- [镜像仓库管理](./02-镜像管理/镜像仓库管理.md) — 镜像仓库的使用与管理
  - Docker Hub 使用
  - 私有仓库搭建（Harbor、Registry）
  - 镜像推送与拉取
  - 镜像版本管理
  - 镜像安全扫描

---

### 3. 容器管理（Container Management）

容器的创建、运行、管理和生命周期。

#### 容器基础操作
- [容器基础操作](./03-容器管理/容器基础操作.md) — 容器的创建、启动、停止
  - 创建容器
  - 启动与停止容器
  - 重启容器
  - 删除容器
  - 查看容器状态
  - 进入容器内部

#### 容器运行模式
- [容器运行模式](./03-容器管理/容器运行模式.md) — 前台、后台、交互式运行
  - 前台运行（-d）
  - 后台运行（-d）
  - 交互式运行（-it）
  - 分离模式（detached）
  - 自动重启策略（--restart）

#### 容器资源限制
- [容器资源限制](./03-容器管理/容器资源限制.md) — CPU、内存、磁盘限制
  - CPU 限制（--cpus）
  - 内存限制（-m）
  - 磁盘 I/O 限制
  - 资源监控
  - 资源配额管理

#### 容器数据管理
- [容器数据管理](./03-容器管理/容器数据管理.md) — 数据卷、绑定挂载
  - 数据卷（Volume）概念
  - 创建与管理数据卷
  - 绑定挂载（Bind Mount）
  - 临时文件系统（tmpfs）
  - 数据持久化策略

#### 容器网络
- [容器网络基础](./03-容器管理/容器网络基础.md) — 容器网络配置
  - 网络模式（bridge、host、none）
  - 端口映射（-p）
  - 容器间通信
  - 自定义网络
  - 网络隔离

---

### 4. Dockerfile 高级应用（Advanced Dockerfile）

Dockerfile 的高级用法和最佳实践。

#### 多阶段构建
- [多阶段构建](./04-Dockerfile高级应用/多阶段构建.md) — 减小镜像体积
  - 多阶段构建原理
  - 构建阶段分离
  - 只复制必要文件
  - 实际应用案例

#### 构建参数
- [构建参数与变量](./04-Dockerfile高级应用/构建参数与变量.md) — ARG、ENV 使用
  - ARG 构建参数
  - ENV 环境变量
  - 参数传递
  - 默认值设置

#### 健康检查
- [健康检查配置](./04-Dockerfile高级应用/健康检查配置.md) — HEALTHCHECK 指令
  - HEALTHCHECK 语法
  - 健康检查脚本
  - 健康状态监控
  - 自动重启策略

#### 最佳实践
- [Dockerfile 最佳实践](./04-Dockerfile高级应用/Dockerfile最佳实践.md) — 编写高效 Dockerfile
  - 指令顺序优化
  - 缓存利用
  - 安全性考虑
  - 可维护性
  - 性能优化

---

### 5. Docker Compose 多服务编排（Docker Compose）

使用 Docker Compose 管理多容器应用。

#### Compose 基础
- [Docker Compose 基础](./05-Docker-Compose/Compose基础.md) — Compose 安装与基本使用
  - Docker Compose 安装
  - docker-compose.yml 文件结构
  - 基本命令（up、down、ps、logs）
  - 服务定义
  - 网络配置

#### Compose 文件编写
- [Compose 文件编写指南](./05-Docker-Compose/Compose文件编写指南.md) — 完整的 Compose 配置
  - version 版本
  - services 服务定义
  - networks 网络配置
  - volumes 数据卷配置
  - environment 环境变量
  - depends_on 依赖关系
  - 配置变量与模板

#### 多服务编排
- [多服务编排实践](./05-Docker-Compose/多服务编排实践.md) — 实际项目编排案例
  - Web 应用 + 数据库
  - 微服务架构编排
  - 前后端分离项目
  - 服务依赖管理
  - 服务扩展（scale）

#### Compose 高级特性
- [Compose 高级特性](./05-Docker-Compose/Compose高级特性.md) — Compose 高级用法
  - 配置文件覆盖（override）
  - 环境变量文件（.env）
  - 扩展字段（extends）
  - 健康检查配置
  - 资源限制配置

---

### 6. 网络与存储（Network & Storage）

Docker 网络和存储的深入理解。

#### 网络详解
- [Docker 网络详解](./06-网络与存储/网络详解.md) — Docker 网络架构
  - 网络驱动类型
  - Bridge 网络
  - Host 网络
  - Overlay 网络
  - Macvlan 网络
  - 自定义网络
  - 网络插件

#### 存储详解
- [Docker 存储详解](./06-网络与存储/存储详解.md) — Docker 存储架构
  - 存储驱动类型
  - 数据卷（Volume）
  - 绑定挂载（Bind Mount）
  - tmpfs 挂载
  - 存储驱动选择
  - 数据备份与恢复

#### 数据持久化
- [数据持久化策略](./06-网络与存储/数据持久化策略.md) — 容器数据持久化
  - 数据卷生命周期
  - 数据卷备份
  - 数据卷恢复
  - 数据迁移
  - 数据卷驱动

---

### 7. 安全与最佳实践（Security & Best Practices）

Docker 安全配置和最佳实践。

#### 安全基础
- [Docker 安全基础](./07-安全与最佳实践/安全基础.md) — Docker 安全概念
  - 容器安全模型
  - 命名空间隔离
  - 控制组（Cgroups）
  - 能力（Capabilities）
  - 安全扫描

#### 安全配置
- [安全配置实践](./07-安全与最佳实践/安全配置实践.md) — 安全配置方法
  - 非 root 用户运行
  - 只读文件系统
  - 资源限制
  - 网络隔离
  - 镜像安全扫描
  - 密钥管理

#### 最佳实践
- [Docker 最佳实践](./07-安全与最佳实践/Docker最佳实践.md) — 生产环境最佳实践
  - 镜像管理最佳实践
  - 容器运行最佳实践
  - 网络配置最佳实践
  - 存储配置最佳实践
  - 监控与日志最佳实践

---

### 8. 生产环境部署（Production Deployment）

生产环境中 Docker 的部署和管理。

#### 部署策略
- [生产环境部署策略](./08-生产环境部署/部署策略.md) — 生产环境部署方案
  - 单机部署
  - 集群部署
  - 高可用部署
  - 蓝绿部署
  - 滚动更新

#### 容器编排
- [容器编排方案](./08-生产环境部署/容器编排方案.md) — Docker Swarm、Kubernetes
  - Docker Swarm 基础
  - Kubernetes 基础
  - 编排工具选择
  - 服务发现
  - 负载均衡

#### CI/CD 集成
- [CI/CD 集成](./08-生产环境部署/CI-CD集成.md) — Docker 与 CI/CD 集成
  - GitHub Actions 集成
  - GitLab CI 集成
  - Jenkins 集成
  - 自动化构建与部署
  - 镜像自动推送

#### 监控与日志
- [监控与日志](./08-生产环境部署/监控与日志.md) — 容器监控与日志管理
  - 容器监控工具
  - 日志收集
  - 性能监控
  - 告警配置
  - 日志聚合

---

### 9. 故障排查（Troubleshooting）

Docker 常见问题和故障排查。

#### 常见问题
- [常见问题排查](./09-故障排查/常见问题排查.md) — Docker 常见问题解决
  - 容器无法启动
  - 镜像拉取失败
  - 网络连接问题
  - 存储空间问题
  - 权限问题

#### 调试技巧
- [调试技巧](./09-故障排查/调试技巧.md) — Docker 调试方法
  - 查看容器日志
  - 进入容器调试
  - 网络调试
  - 存储调试
  - 性能分析

#### 故障诊断
- [故障诊断工具](./09-故障排查/故障诊断工具.md) — Docker 诊断工具
  - docker inspect
  - docker stats
  - docker events
  - 第三方诊断工具

---

## 🎯 学习路径

### 阶段一：基础入门

**目标**：能够安装 Docker 并使用基本命令

**学习顺序**：
1. [Docker 安装指南](./01-基础入门/安装与环境配置.md) — 安装 Docker
2. [Docker 核心概念](./01-基础入门/核心概念.md) — 理解 Docker 基础概念
3. [Docker 基本命令](./01-基础入门/基本命令.md) — 掌握基本命令

**学习检查点**：
- ✅ 能够成功安装 Docker
- ✅ 理解镜像、容器、仓库的概念
- ✅ 能够拉取镜像、运行容器、查看日志

---

### 阶段二：镜像与容器管理

**目标**：能够编写 Dockerfile 并管理镜像和容器

**学习顺序**：
1. [镜像基础操作](./02-镜像管理/镜像基础操作.md) — 掌握镜像操作
2. [Dockerfile 编写指南](./02-镜像管理/Dockerfile编写指南.md) — 编写 Dockerfile
3. [容器基础操作](./03-容器管理/容器基础操作.md) — 掌握容器操作
4. [容器数据管理](./03-容器管理/容器数据管理.md) — 理解数据卷

**学习检查点**：
- ✅ 能够编写简单的 Dockerfile
- ✅ 能够构建和推送镜像
- ✅ 能够管理容器的生命周期
- ✅ 能够使用数据卷持久化数据

---

### 阶段三：多服务编排

**目标**：能够使用 Docker Compose 编排多服务应用

**学习顺序**：
1. [Docker Compose 基础](./05-Docker-Compose/Compose基础.md) — 学习 Compose
2. [Compose 文件编写指南](./05-Docker-Compose/Compose文件编写指南.md) — 编写 Compose 文件
3. [多服务编排实践](./05-Docker-Compose/多服务编排实践.md) — 实践多服务编排

**学习检查点**：
- ✅ 能够编写 docker-compose.yml
- ✅ 能够编排 Web 应用 + 数据库
- ✅ 能够管理多服务应用

---

### 阶段四：生产环境应用

**目标**：能够在生产环境中部署和管理 Docker 应用

**学习顺序**：
1. [Docker 最佳实践](./07-安全与最佳实践/Docker最佳实践.md) — 学习最佳实践
2. [生产环境部署策略](./08-生产环境部署/部署策略.md) — 部署策略
3. [监控与日志](./08-生产环境部署/监控与日志.md) — 监控与日志
4. [CI/CD 集成](./08-生产环境部署/CI-CD集成.md) — CI/CD 集成

**学习检查点**：
- ✅ 能够遵循最佳实践部署应用
- ✅ 能够配置监控和日志
- ✅ 能够集成 CI/CD 流程

---

## 📖 专题索引

### 按场景快速查找

#### 开发相关
- [Dockerfile 编写指南](./02-镜像管理/Dockerfile编写指南.md) — 编写 Dockerfile
- [镜像构建实践](./02-镜像管理/镜像构建实践.md) — 构建镜像
- [镜像优化策略](./02-镜像管理/镜像优化策略.md) — 优化镜像

#### 部署相关
- [Docker Compose 基础](./05-Docker-Compose/Compose基础.md) — 多服务编排
- [生产环境部署策略](./08-生产环境部署/部署策略.md) — 生产部署
- [CI/CD 集成](./08-生产环境部署/CI-CD集成.md) — CI/CD 集成

#### 配置相关
- [Docker 网络详解](./06-网络与存储/网络详解.md) — 网络配置
- [Docker 存储详解](./06-网络与存储/存储详解.md) — 存储配置
- [安全配置实践](./07-安全与最佳实践/安全配置实践.md) — 安全配置

#### 优化相关
- [镜像优化策略](./02-镜像管理/镜像优化策略.md) — 镜像优化
- [Dockerfile 最佳实践](./04-Dockerfile高级应用/Dockerfile最佳实践.md) — Dockerfile 优化
- [Docker 最佳实践](./07-安全与最佳实践/Docker最佳实践.md) — 整体优化

#### 故障排查
- [常见问题排查](./09-故障排查/常见问题排查.md) — 问题排查
- [调试技巧](./09-故障排查/调试技巧.md) — 调试方法
- [故障诊断工具](./09-故障排查/故障诊断工具.md) — 诊断工具

---

## 🔗 相关链接

### 前置知识
- [Linux 基础](../01-计算机基础/03-操作系统/02-Linux/README.md) — Linux 命令行基础
- [服务端知识体系](../!MOC-服务端.md) — 服务端开发基础

### 进阶学习
- [Kubernetes 知识体系](../Kubernetes/!MOC-Kubernetes.md) — 容器编排进阶
- [CI/CD 流程](../CI-CD/README.md) — 持续集成与部署
- [监控与日志](../08-监控与日志/README.md) — 系统监控

### 外部资源
- [Docker 官方文档](https://docs.docker.com/)
- [Docker Hub](https://hub.docker.com/)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [Docker 最佳实践](https://docs.docker.com/develop/dev-best-practices/)

---

## 📌 使用说明

### 目录结构

```
03-服务端/04-部署与运维/容器化/Docker/
├── !MOC-Docker.md                    # 主索引文件
├── 01-基础入门/                      # 基础入门
│   ├── 安装与环境配置.md
│   ├── 核心概念.md
│   └── 基本命令.md
├── 02-镜像管理/                      # 镜像管理
│   ├── 镜像基础操作.md
│   ├── Dockerfile编写指南.md
│   ├── 镜像构建实践.md
│   ├── 镜像优化策略.md
│   └── 镜像仓库管理.md
├── 03-容器管理/                      # 容器管理
│   ├── 容器基础操作.md
│   ├── 容器运行模式.md
│   ├── 容器资源限制.md
│   ├── 容器数据管理.md
│   └── 容器网络基础.md
├── 04-Dockerfile高级应用/            # Dockerfile 高级
│   ├── 多阶段构建.md
│   ├── 构建参数与变量.md
│   ├── 健康检查配置.md
│   └── Dockerfile最佳实践.md
├── 05-Docker-Compose/                # Docker Compose
│   ├── Compose基础.md
│   ├── Compose文件编写指南.md
│   ├── 多服务编排实践.md
│   └── Compose高级特性.md
├── 06-网络与存储/                    # 网络与存储
│   ├── 网络详解.md
│   ├── 存储详解.md
│   └── 数据持久化策略.md
├── 07-安全与最佳实践/                # 安全与最佳实践
│   ├── 安全基础.md
│   ├── 安全配置实践.md
│   └── Docker最佳实践.md
├── 08-生产环境部署/                  # 生产环境
│   ├── 部署策略.md
│   ├── 容器编排方案.md
│   ├── CI-CD集成.md
│   └── 监控与日志.md
└── 09-故障排查/                      # 故障排查
    ├── 常见问题排查.md
    ├── 调试技巧.md
    └── 故障诊断工具.md
```

### 文件命名规范

- **MOC 文件**：`!MOC-分类名.md`（如 `!MOC-Docker.md`）
- **普通文件**：使用中划线分隔（如 `安装与环境配置.md`）
- **目录名**：使用数字前缀+中划线+名称（如 `01-基础入门`）

---

**最后更新**：2025  
**维护规范**：每次新增笔记后，在对应 MOC 中加入链接

---

#Docker #容器化 #部署 #运维 #DevOps

