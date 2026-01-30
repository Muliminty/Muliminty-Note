# Docker Compose 基础

> Docker Compose 的安装、基本使用和常用命令

---

## 📋 目录

- [Docker Compose 安装](#docker-compose-安装)
- [docker-compose.yml 文件结构](#docker-composeyml-文件结构)
- [基本命令](#基本命令)
- [服务定义](#服务定义)
- [网络配置](#网络配置)
- [数据卷配置](#数据卷配置)

---

## Docker Compose 安装

### 安装方式

Docker Compose 已经集成到 Docker Desktop 中，也可以单独安装。

#### Linux 安装

```bash
# 下载最新版本
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# 添加执行权限
sudo chmod +x /usr/local/bin/docker-compose

# 验证安装
docker-compose --version
```

#### macOS/Windows

Docker Desktop 已包含 Docker Compose，无需单独安装。

### 验证安装

```bash
# 查看版本
docker-compose --version
# 或
docker compose version
```

---

## docker-compose.yml 文件结构

### 基本结构

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
      POSTGRES_PASSWORD: password
```

### 版本说明

- `version: '3.8'`：Compose 文件格式版本
- 新版本 Docker Compose 可以省略 version

---

## 基本命令

### docker-compose up

启动服务。

```bash
# 启动所有服务（前台）
docker-compose up

# 启动所有服务（后台）
docker-compose up -d

# 启动指定服务
docker-compose up web

# 重新构建镜像后启动
docker-compose up --build

# 强制重新创建容器
docker-compose up --force-recreate
```

### docker-compose down

停止并删除服务。

```bash
# 停止并删除容器
docker-compose down

# 删除数据卷
docker-compose down -v

# 删除镜像
docker-compose down --rmi all
```

### docker-compose ps

查看服务状态。

```bash
# 查看运行中的服务
docker-compose ps

# 查看所有服务（包括已停止的）
docker-compose ps -a
```

### docker-compose logs

查看服务日志。

```bash
# 查看所有服务日志
docker-compose logs

# 查看指定服务日志
docker-compose logs web

# 实时查看日志
docker-compose logs -f

# 查看最后 N 行
docker-compose logs --tail=100
```

### docker-compose exec

在服务中执行命令。

```bash
# 在服务中执行命令
docker-compose exec web ls /app

# 交互式执行
docker-compose exec web /bin/bash
```

---

## 服务定义

### 基本服务定义

```yaml
services:
  web:
    image: nginx:latest
    container_name: my-nginx
    ports:
      - "8080:80"
    environment:
      - NODE_ENV=production
    volumes:
      - ./app:/app
```

### 使用 Dockerfile 构建

```yaml
services:
  web:
    build: .
    ports:
      - "8080:80"
```

### 指定构建上下文

```yaml
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        - VERSION=1.0.0
```

---

## 网络配置

### 默认网络

Compose 会为每个项目创建一个默认网络。

```yaml
services:
  web:
    image: nginx:latest
  db:
    image: postgres:13
# web 和 db 可以在同一网络中通信
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
  backend:
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
```

### 绑定挂载

```yaml
services:
  web:
    image: nginx:latest
    volumes:
      - ./app:/app
      - ./config:/etc/nginx/conf.d
```

---

## 实用示例

### Web 应用 + 数据库

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

---

## 📚 参考资源

- [Docker Compose 官方文档](https://docs.docker.com/compose/)
- [Docker Compose 命令参考](https://docs.docker.com/compose/reference/)

---

[[!MOC-Docker|返回 Docker 知识体系]]

#Docker #DockerCompose #容器编排
