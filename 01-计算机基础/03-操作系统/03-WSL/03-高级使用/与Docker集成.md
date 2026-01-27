# WSL 与 Docker 集成

> WSL 2 与 Docker Desktop 集成配置和最佳实践

---

## 📋 目录

- [Docker Desktop 安装](#docker-desktop-安装)
- [WSL 2 后端配置](#wsl-2-后端配置)
- [Docker 命令使用](#docker-命令使用)
- [容器网络配置](#容器网络配置)
- [性能优化](#性能优化)
- [常见问题](#常见问题)

---

## Docker Desktop 安装

### 系统要求

- **Windows 10**：64-bit，版本 1903 或更高（内部版本 18362 或更高）
- **Windows 11**：64-bit，所有版本
- **WSL 2**：必须启用 WSL 2 功能
- **虚拟化**：必须在 BIOS 中启用虚拟化

### 安装步骤

#### 1. 启用 WSL 2

```powershell
# 以管理员身份运行 PowerShell

# 启用 WSL
wsl --install

# 或手动启用
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# 重启计算机
Restart-Computer

# 设置 WSL 2 为默认版本
wsl --set-default-version 2
```

#### 2. 下载并安装 Docker Desktop

1. 访问 [Docker Desktop 下载页面](https://www.docker.com/products/docker-desktop)
2. 下载 Docker Desktop for Windows
3. 运行安装程序
4. 按照向导完成安装
5. 重启计算机（如需要）

#### 3. 配置 Docker Desktop

1. 启动 Docker Desktop
2. 进入 Settings → General
3. 启用 "Use the WSL 2 based engine"
4. 在 Settings → Resources → WSL Integration 中：
   - 启用 "Enable integration with my default WSL distro"
   - 选择要集成的 WSL 发行版

### 验证安装

```bash
# 在 WSL 中验证 Docker
docker --version
docker compose version

# 测试 Docker
docker run hello-world

# 查看 Docker 信息
docker info
```

---

## WSL 2 后端配置

### Docker Desktop 设置

#### General 设置

- ✅ **Use the WSL 2 based engine**：必须启用
- ✅ **Start Docker Desktop when you log in**：可选
- ✅ **Use Docker Compose V2**：推荐启用

#### Resources 设置

- **WSL Integration**：
  - ✅ Enable integration with my default WSL distro
  - 选择要集成的发行版（如 Ubuntu-22.04）

#### Docker Engine 设置

可以配置 Docker daemon 选项：

```json
{
  "builder": {
    "gc": {
      "defaultKeepStorage": "20GB",
      "enabled": true
    }
  },
  "experimental": false,
  "features": {
    "buildkit": true
  }
}
```

### WSL 配置

确保 `.wslconfig` 配置合理：

```ini
[wsl2]
# 分配足够的内存
memory=8GB

# 分配足够的 CPU 核心
processors=4

# 交换空间
swap=2GB

# 本地主机转发（重要）
localhostForwarding=true
```

### 验证集成

```bash
# 在 WSL 中检查 Docker 上下文
docker context ls

# 应该显示 "default" 或 "desktop-linux"

# 检查 Docker 是否运行
docker ps

# 如果出现错误，检查 Docker Desktop 是否运行
```

---

## Docker 命令使用

### 基本命令

```bash
# 查看 Docker 版本
docker --version
docker compose version

# 查看 Docker 信息
docker info

# 查看运行中的容器
docker ps

# 查看所有容器
docker ps -a

# 查看镜像
docker images

# 拉取镜像
docker pull ubuntu:22.04
docker pull node:18-alpine

# 运行容器
docker run -it ubuntu:22.04 /bin/bash
docker run -d -p 3000:3000 node:18-alpine

# 停止容器
docker stop container_id

# 删除容器
docker rm container_id

# 删除镜像
docker rmi image_id
```

### Docker Compose

```bash
# 使用 Docker Compose
docker compose up -d
docker compose down
docker compose ps
docker compose logs
```

### 在 WSL 中使用 Docker

所有 Docker 命令都可以直接在 WSL 中运行：

```bash
# 构建镜像
docker build -t myapp:latest .

# 运行容器
docker run -d \
  --name myapp \
  -p 3000:3000 \
  -v $(pwd):/app \
  myapp:latest

# 查看日志
docker logs myapp

# 进入容器
docker exec -it myapp /bin/bash
```

---

## 容器网络配置

### 网络模式

Docker Desktop 在 WSL 2 中支持以下网络模式：

- **bridge**：默认网络模式
- **host**：使用主机网络（在 WSL 2 中有限支持）
- **none**：无网络

### 端口映射

```bash
# 映射端口
docker run -d -p 3000:3000 nginx

# 映射多个端口
docker run -d -p 3000:3000 -p 8080:80 nginx

# 指定主机 IP
docker run -d -p 127.0.0.1:3000:3000 nginx
```

### 从 Windows 访问容器

由于 WSL 2 使用虚拟网络，需要配置端口转发：

```powershell
# Docker Desktop 通常会自动处理端口转发
# 如果无法访问，检查 Windows 防火墙规则

# 手动测试端口
Test-NetConnection -ComputerName localhost -Port 3000
```

### 容器间通信

```bash
# 创建网络
docker network create mynetwork

# 在指定网络中运行容器
docker run -d --name app1 --network mynetwork myapp:latest
docker run -d --name app2 --network mynetwork myapp:latest

# 容器可以通过名称互相访问
# 例如：curl http://app1:3000
```

### Docker Compose 网络

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    networks:
      - mynetwork

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    networks:
      - mynetwork

networks:
  mynetwork:
    driver: bridge
```

---

## 性能优化

### 文件系统性能

#### 推荐：使用 Linux 文件系统

```bash
# 推荐：项目文件在 Linux 文件系统中
~/projects/myapp

# 不推荐：项目文件在 Windows 文件系统中
/mnt/c/Users/Username/projects/myapp
```

**原因**：
- WSL 2 中 Linux 文件系统（ext4）性能更好
- Windows 文件系统（NTFS）通过 9p 协议访问，性能较差
- 避免文件权限问题

#### 使用命名卷

```bash
# 创建命名卷
docker volume create mydata

# 使用命名卷
docker run -d -v mydata:/data myapp:latest
```

### 资源限制

在 `.wslconfig` 中配置：

```ini
[wsl2]
# 分配足够的内存给 WSL（Docker 需要）
memory=8GB

# 分配足够的 CPU 核心
processors=4

# 交换空间
swap=2GB
```

在 Docker Desktop 中配置：
- Settings → Resources
- 调整 CPU、内存、磁盘限制

### BuildKit

启用 BuildKit 以提升构建性能：

```bash
# 设置环境变量
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# 或在 Docker Desktop 中启用
# Settings → Docker Engine → 添加：
{
  "features": {
    "buildkit": true
  }
}
```

### 镜像优化

```dockerfile
# 使用多阶段构建
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
CMD ["node", "dist/index.js"]
```

---

## 常见问题

### 1. Docker 命令未找到

**问题**：`docker: command not found`

**解决方案**：
1. 确保 Docker Desktop 正在运行
2. 在 Docker Desktop Settings → Resources → WSL Integration 中启用集成
3. 重启 WSL：`wsl --shutdown` 然后重新启动

### 2. 无法连接到 Docker daemon

**问题**：`Cannot connect to the Docker daemon`

**解决方案**：
```bash
# 检查 Docker Desktop 是否运行
# 在 Windows 任务栏查看 Docker 图标

# 重启 Docker Desktop
# 或在 WSL 中重启
wsl --shutdown
wsl
```

### 3. 端口无法访问

**问题**：容器运行但无法从 Windows 访问

**解决方案**：
1. 检查端口映射：`docker ps` 查看端口映射
2. 检查 Windows 防火墙规则
3. 检查 `.wslconfig` 中的 `localhostForwarding=true`
4. 尝试使用 `127.0.0.1` 而不是 `localhost`

### 4. 文件权限问题

**问题**：容器中文件权限不正确

**解决方案**：
```bash
# 使用命名卷而不是绑定挂载
docker volume create mydata

# 或在 docker-compose.yml 中
volumes:
  - mydata:/app/data
```

### 5. 性能问题

**问题**：Docker 操作缓慢

**解决方案**：
1. 确保使用 WSL 2：`wsl --list --verbose`
2. 将项目文件放在 Linux 文件系统中
3. 增加 WSL 资源分配（内存、CPU）
4. 启用 BuildKit

### 6. 磁盘空间不足

**问题**：Docker 镜像和容器占用大量空间

**解决方案**：
```bash
# 清理未使用的资源
docker system prune -a

# 清理特定资源
docker image prune -a
docker container prune
docker volume prune

# 查看磁盘使用
docker system df
```

### 7. 网络问题

**问题**：容器无法访问外部网络

**解决方案**：
```bash
# 检查 Docker 网络
docker network ls

# 检查容器网络配置
docker inspect container_name | grep NetworkMode

# 重启 Docker Desktop
```

---

## 最佳实践

### 1. 项目结构

```
project/
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
└── src/
```

### 2. .dockerignore

```
node_modules
npm-debug.log
.git
.gitignore
.env
*.md
```

### 3. 使用 Docker Compose

对于多容器应用，使用 Docker Compose：

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - ./src:/app/src
    environment:
      - NODE_ENV=development
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 4. 开发环境配置

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  app:
    build:
      context: .
      target: development
    volumes:
      - ./src:/app/src
      - /app/node_modules
    environment:
      - NODE_ENV=development
```

---

## 📚 参考资源

- [Docker Desktop WSL 2 后端](https://docs.docker.com/desktop/wsl/)
- [WSL 2 与 Docker 集成](https://learn.microsoft.com/zh-cn/windows/wsl/tutorials/wsl-containers)
- [Docker 官方文档](https://docs.docker.com/)

---

[[!MOC-WSL|返回 WSL 知识体系]]  
[[安装与环境配置|参考：Docker 安装与环境配置]]

#WSL #Docker #容器 #WSL2
