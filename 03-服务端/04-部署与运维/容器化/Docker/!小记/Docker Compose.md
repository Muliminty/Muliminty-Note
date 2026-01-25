# Docker Compose 简介

> 本文简要介绍 Docker Compose 及其作用场景。

---

## 1. 什么是 Docker Compose？

**Docker Compose** 是 Docker 官方提供的用于定义和运行多容器 Docker 应用的工具。

**简单理解**：
- 使用一个 YAML 文件（`docker-compose.yml`）来配置多个容器
- 一条命令就能启动整个应用栈（前端、后端、数据库等）
- 简化多容器应用的部署和管理

**类比**：
- 单个 `docker run` = 手动启动一个容器
- Docker Compose = 一键启动整个应用（多个容器）

---

## 2. 为什么需要 Docker Compose？

### 问题：手动管理多个容器很麻烦

**传统方式**（使用 `docker run`）：
```bash
# 启动数据库
docker run -d \
  --name mysql \
  -e MYSQL_ROOT_PASSWORD=password \
  -v mysql-data:/var/lib/mysql \
  mysql:8.0

# 启动 Redis
docker run -d \
  --name redis \
  redis:latest

# 启动后端服务
docker run -d \
  --name backend \
  -p 3000:3000 \
  --link mysql:db \
  --link redis:redis \
  my-backend:latest

# 启动前端服务
docker run -d \
  --name frontend \
  -p 80:80 \
  my-frontend:latest
```

**问题**：
- 命令很长，容易出错
- 容器之间的依赖关系不清晰
- 启动顺序需要手动控制
- 配置分散，难以管理

### 解决：使用 Docker Compose

**使用 Compose**：
```yaml
# docker-compose.yml
version: '3.8'

services:
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: password
    volumes:
      - mysql-data:/var/lib/mysql

  redis:
    image: redis:latest

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    depends_on:
      - db
      - redis

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mysql-data:
```

**一条命令启动所有服务**：
```bash
docker-compose up -d
```

**优势**：
- ✅ 配置集中在一个文件
- ✅ 自动处理容器依赖关系
- ✅ 自动创建网络和数据卷
- ✅ 一条命令管理所有服务

---

## 3. 核心概念

### 3.1 docker-compose.yml 文件

**作用**：定义应用的所有服务、网络、数据卷等配置

**基本结构**：
```yaml
version: '3.8'  # Compose 文件格式版本（新版本可省略）

services:        # 定义服务（容器）
  web:           # 服务名称
    image: nginx:latest
    ports:
      - "8080:80"

volumes:         # 定义数据卷
networks:        # 定义网络
```

### 3.2 服务（Services）

**服务** = 一个容器配置

```yaml
services:
  web:                    # 服务名称
    image: nginx:latest   # 使用的镜像
    ports:                # 端口映射
      - "8080:80"
    volumes:              # 数据卷挂载
      - ./app:/app
    environment:          # 环境变量
      - NODE_ENV=production
```

### 3.3 项目（Project）

**项目** = 一组相关的服务

- 默认项目名 = 当前目录名
- 所有容器名称前缀 = 项目名
- 例如：目录名 `myapp` → 容器名 `myapp_web_1`

---

## 4. 常用命令

### 启动服务

```bash
# 启动所有服务（前台运行，查看日志）
docker-compose up

# 启动所有服务（后台运行）
docker-compose up -d

# 启动指定服务
docker-compose up web

# 重新构建镜像后启动
docker-compose up --build

# 强制重新创建容器
docker-compose up --force-recreate
```

### 停止服务

```bash
# 停止所有服务（保留容器）
docker-compose stop

# 停止并删除容器
docker-compose down

# 停止并删除容器、网络、数据卷
docker-compose down -v
```

### 查看状态

```bash
# 查看运行中的服务
docker-compose ps

# 查看所有服务（包括已停止的）
docker-compose ps -a

# 查看服务日志
docker-compose logs

# 实时查看日志
docker-compose logs -f

# 查看指定服务日志
docker-compose logs -f web
```

### 执行命令

```bash
# 在服务中执行命令
docker-compose exec web ls /app

# 进入服务容器
docker-compose exec web /bin/bash
```

### 其他常用命令

```bash
# 重启服务
docker-compose restart

# 重启指定服务
docker-compose restart web

# 查看服务资源使用情况
docker-compose top

# 验证 Compose 文件格式
docker-compose config
```

---

## 5. 实际应用场景

### 场景 1：Web 应用 + 数据库

**docker-compose.yml**：
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "8080:80"
    depends_on:
      - db
    environment:
      - DATABASE_URL=postgres://db:5432/mydb

  db:
    image: postgres:13
    environment:
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=mydb
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```

**启动**：
```bash
docker-compose up -d
```

### 场景 2：前后端分离项目

**docker-compose.yml**：
```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    depends_on:
      - db
      - redis
    environment:
      - DATABASE_URL=postgres://db:5432/mydb
      - REDIS_URL=redis://redis:6379

  db:
    image: postgres:13
    environment:
      - POSTGRES_PASSWORD=password
    volumes:
      - db-data:/var/lib/postgresql/data

  redis:
    image: redis:latest

volumes:
  db-data:
```

### 场景 3：开发环境（代码热更新）

**docker-compose.yml**：
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    volumes:
      # 挂载源代码目录，修改代码立即生效
      - ./src:/app/src
      - ./package.json:/app/package.json
    environment:
      - NODE_ENV=development

  db:
    image: postgres:13
    environment:
      - POSTGRES_PASSWORD=password
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```

### 场景 4：微服务架构

**docker-compose.yml**：
```yaml
version: '3.8'

services:
  api-gateway:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - api
      - auth

  api:
    build: ./api
    environment:
      - DATABASE_URL=postgres://db:5432/mydb
    depends_on:
      - db

  auth:
    build: ./auth
    depends_on:
      - db

  db:
    image: postgres:13
    environment:
      - POSTGRES_PASSWORD=password
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```

---

## 6. docker-compose.yml 常用配置

### 基本配置

```yaml
services:
  web:
    # 使用镜像
    image: nginx:latest
    
    # 或使用 Dockerfile 构建
    build: .
    # 或指定构建上下文
    build:
      context: .
      dockerfile: Dockerfile
    
    # 容器名称
    container_name: my-web
    
    # 端口映射
    ports:
      - "8080:80"
      - "8443:443"
    
    # 环境变量
    environment:
      - NODE_ENV=production
      - PORT=3000
    # 或使用字典格式
    environment:
      NODE_ENV: production
      PORT: 3000
    
    # 数据卷挂载
    volumes:
      - ./app:/app              # 绑定挂载
      - db-data:/data           # 命名数据卷
      - ./config:/config:ro     # 只读挂载
    
    # 服务依赖
    depends_on:
      - db
      - redis
    
    # 重启策略
    restart: always  # always, unless-stopped, on-failure, no
```

### 网络配置

```yaml
services:
  web:
    networks:
      - frontend
  
  db:
    networks:
      - backend

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
```

### 数据卷配置

```yaml
services:
  db:
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
    driver: local
```

---

## 7. 对比：Docker vs Docker Compose

| 特性 | Docker | Docker Compose |
|------|--------|----------------|
| **适用场景** | 单个容器 | 多个容器应用 |
| **配置文件** | 命令行参数 | YAML 文件 |
| **命令复杂度** | 简单 | 简单（但配置在文件中） |
| **依赖管理** | 手动 | 自动（depends_on） |
| **网络管理** | 手动创建 | 自动创建 |
| **数据卷管理** | 手动创建 | 自动创建 |
| **启动方式** | `docker run` | `docker-compose up` |

---

## 8. 常见问题

### Q1: docker-compose 和 docker compose 有什么区别？

**docker-compose**（旧版本）：
- 独立的 Python 工具
- 需要单独安装
- 命令：`docker-compose up`

**docker compose**（新版本）：
- 集成在 Docker CLI 中
- Docker Desktop 自带
- 命令：`docker compose up`

**建议**：使用新版本的 `docker compose`（没有连字符）

### Q2: 如何查看 Compose 创建的资源？

```bash
# 查看容器
docker-compose ps

# 查看网络
docker network ls | grep <项目名>

# 查看数据卷
docker volume ls | grep <项目名>
```

### Q3: 如何在不同环境使用不同的配置？

**方法 1：使用多个 Compose 文件**
```bash
# docker-compose.yml（基础配置）
# docker-compose.prod.yml（生产环境覆盖配置）

# 启动时指定多个文件
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

**方法 2：使用环境变量文件**
```bash
# .env.development
NODE_ENV=development
PORT=3000

# .env.production
NODE_ENV=production
PORT=80

# 使用指定环境文件
docker-compose --env-file .env.production up -d
```

### Q4: 如何扩展服务（运行多个实例）？

```bash
# 运行 3 个 web 服务实例
docker-compose up -d --scale web=3

# 注意：需要移除 ports 映射或使用负载均衡器
```

### Q5: Compose 文件中的 version 字段是必须的吗？

**新版本 Docker Compose**（v2+）可以省略 `version` 字段：
```yaml
# 新版本（推荐）
services:
  web:
    image: nginx:latest

# 旧版本
version: '3.8'
services:
  web:
    image: nginx:latest
```

---

## 9. 最佳实践

### 1. 使用命名数据卷（生产环境）

```yaml
services:
  db:
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:  # 命名数据卷，数据持久化
```

### 2. 使用绑定挂载（开发环境）

```yaml
services:
  web:
    volumes:
      - ./src:/app/src  # 代码热更新
```

### 3. 使用环境变量文件

```yaml
# docker-compose.yml
services:
  web:
    env_file:
      - .env
```

```bash
# .env
NODE_ENV=production
DATABASE_URL=postgres://db:5432/mydb
```

### 4. 明确服务依赖关系

```yaml
services:
  web:
    depends_on:
      - db
      - redis
```

### 5. 使用健康检查

```yaml
services:
  web:
    depends_on:
      db:
        condition: service_healthy
  
  db:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
```

### 6. 不要在生产环境使用 `latest` 标签

```yaml
# ❌ 不推荐
image: nginx:latest

# ✅ 推荐
image: nginx:1.21.6
```

---

## 10. 快速开始示例

### 步骤 1：创建 docker-compose.yml

```yaml
version: '3.8'

services:
  web:
    image: nginx:latest
    ports:
      - "8080:80"
  
  db:
    image: postgres:13
    environment:
      - POSTGRES_PASSWORD=password
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```

### 步骤 2：启动服务

```bash
# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

### 步骤 3：停止服务

```bash
# 停止服务
docker-compose down

# 停止并删除数据卷
docker-compose down -v
```

---

## 📚 相关链接

- [[Compose基础|Docker Compose 基础]] - 详细的 Compose 使用指南
- [[Compose文件编写指南|Compose 文件编写指南]] - 完整的配置参考
- [[多服务编排实践|多服务编排实践]] - 实际应用案例
- [[指令速查|Docker 指令速查]] - 常用命令参考

---

## 📚 参考资源

- [Docker Compose 官方文档](https://docs.docker.com/compose/)
- [Compose 文件参考](https://docs.docker.com/compose/compose-file/)
- [Compose 命令行参考](https://docs.docker.com/compose/reference/)

---

[[!MOC-Docker|返回 Docker 知识体系]]

#Docker #Docker-Compose #容器编排 #多容器应用