# Docker 使用文档

## 1. Docker 基本概念

### 1.1 什么是 Docker

Docker 是一个开源的应用容器引擎，基于 Go 语言开发并遵从 Apache2.0 协议开源。<mcreference link="https://www.runoob.com/docker/docker-tutorial.html" index="1">1</mcreference> Docker 可以让开发者打包他们的应用以及依赖包到一个轻量级、可移植的容器中，然后发布到任何流行的 Linux 机器上，也可以实现虚拟化。

容器是完全使用沙箱机制，相互之间不会有任何接口，更重要的是容器性能开销极低。<mcreference link="https://www.runoob.com/docker/docker-tutorial.html" index="1">1</mcreference>

### 1.2 Docker 的核心组件

- **Docker 引擎**：Docker 的核心部分，负责创建和管理 Docker 容器。
- **Docker 镜像（Image）**：Docker 容器的模板，包含了应用程序及其依赖的环境。
- **Docker 容器（Container）**：由 Docker 镜像创建的运行实例，可以启动、停止、删除。
- **Docker 仓库（Registry）**：存储 Docker 镜像的地方，最常用的是 Docker Hub。
- **Dockerfile**：文本文件，描述如何自动构建镜像（例如指定基础镜像、安装软件、复制文件等）。<mcreference link="https://www.runoob.com/docker/docker-tutorial.html" index="1">1</mcreference>

### 1.3 Docker 的优势

- **轻量级**：容器共享主机的内核，比虚拟机更轻量。
- **可移植性**：在任何支持 Docker 的环境中运行，无需担心环境差异。
- **快速部署**：可以快速创建和销毁容器，加快开发和部署速度。
- **版本控制**：可以对镜像进行版本控制，方便回滚。
- **隔离性**：容器之间相互隔离，不会相互影响。

## 2. Docker 安装

### 2.1 Windows 安装 Docker

1. 下载 Docker Desktop for Windows 安装包：[Docker Desktop](https://www.docker.com/products/docker-desktop)
2. 双击安装包进行安装
3. 安装完成后，Docker 会自动启动
4. 安装 Docker for Windows 后会提示安装 Hyper-V 虚拟机，安装完成后需重启电脑才可使用 <mcreference link="https://github.com/Exrick/xboot/wiki/Docker%E7%9A%84%E5%AE%89%E8%A3%85%E4%B8%8E%E5%B8%B8%E7%94%A8%E5%91%BD%E4%BB%A4" index="3">3</mcreference>

### 2.2 Linux 安装 Docker

#### Ubuntu/Debian 系统

```bash
# 更新软件包索引
sudo apt-get update

# 安装必要的软件包
sudo apt-get install ca-certificates curl gnupg lsb-release

# 添加 Docker 的官方 GPG 密钥
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# 设置 Docker 仓库
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 更新软件包索引
sudo apt-get update

# 安装 Docker Engine
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 验证 Docker 是否安装成功
sudo docker run hello-world
```

#### CentOS 系统

```bash
# 安装必要的软件包
sudo yum install -y yum-utils

# 设置 Docker 仓库
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# 安装 Docker Engine
sudo yum install docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 启动 Docker
sudo systemctl start docker

# 设置开机自启
sudo systemctl enable docker

# 验证 Docker 是否安装成功
sudo docker run hello-world
```

### 2.3 安装 Docker Compose

Docker Compose 是一个用于定义和运行多容器 Docker 应用程序的工具。

#### Linux 系统安装 Docker Compose

```bash
# 下载 Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.1.1/docker-compose-$(uname -s)-$(uname -m)" > /usr/local/bin/docker-compose

# 添加可执行权限
chmod +x /usr/local/bin/docker-compose

# 验证安装
docker-compose --version
```

## 3. Docker 常用命令

### 3.1 容器生命周期管理

- **创建并启动容器**：`docker run [OPTIONS] IMAGE [COMMAND] [ARG...]`
  - 常用选项：
    - `-d`：后台运行容器
    - `-p`：映射端口（主机端口:容器端口）
    - `-v`：挂载卷（主机目录:容器目录）
    - `--name`：指定容器名称
    - `--restart`：设置重启策略

- **启动/停止/重启容器**：
  - `docker start CONTAINER`：启动容器
  - `docker stop CONTAINER`：停止容器
  - `docker restart CONTAINER`：重启容器

- **删除容器**：`docker rm CONTAINER`

- **在运行中的容器内执行命令**：`docker exec [OPTIONS] CONTAINER COMMAND [ARG...]`
  - 常用选项：
    - `-it`：交互式终端

### 3.2 镜像管理

- **列出本地镜像**：`docker images`

- **拉取镜像**：`docker pull [OPTIONS] NAME[:TAG|@DIGEST]`

- **删除镜像**：`docker rmi [OPTIONS] IMAGE [IMAGE...]`

- **构建镜像**：`docker build [OPTIONS] PATH | URL | -`
  - 常用选项：
    - `-t`：指定镜像名称和标签

### 3.3 容器信息查看

- **查看运行中的容器**：`docker ps [OPTIONS]`
  - 常用选项：
    - `-a`：显示所有容器（包括未运行的）

- **查看容器日志**：`docker logs [OPTIONS] CONTAINER`
  - 常用选项：
    - `-f`：跟踪日志输出
    - `--tail`：显示最后 n 行日志

- **查看容器详细信息**：`docker inspect CONTAINER`

### 3.4 网络管理

- **列出网络**：`docker network ls`

- **创建网络**：`docker network create [OPTIONS] NETWORK`

- **连接容器到网络**：`docker network connect NETWORK CONTAINER`

### 3.5 数据卷管理

- **列出卷**：`docker volume ls`

- **创建卷**：`docker volume create [OPTIONS] [VOLUME]`

- **删除卷**：`docker volume rm [OPTIONS] VOLUME [VOLUME...]`

## 4. Docker Compose 使用

### 4.1 基本概念

Docker Compose 是一个用于定义和运行多容器 Docker 应用程序的工具。使用 YAML 文件来配置应用程序的服务，然后使用一个命令创建并启动所有服务。

### 4.2 常用命令

- **启动服务**：`docker-compose up [OPTIONS] [SERVICE...]`
  - 常用选项：
    - `-d`：后台运行

- **停止服务**：`docker-compose down [OPTIONS]`

- **查看服务状态**：`docker-compose ps`

- **查看服务日志**：`docker-compose logs [OPTIONS] [SERVICE...]`

### 4.3 docker-compose.yml 示例

```yaml
version: '3'

services:
  web:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./html:/usr/share/nginx/html
    depends_on:
      - db

  db:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: example
      MYSQL_DATABASE: mydb
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:
```

## 5. 部署 Memos 应用

[Memos](https://github.com/usememos/memos) 是一个开源的、支持私有化部署的碎片化知识卡片管理工具，可以用于记录日常想法、读后感、计划等。<mcreference link="https://blog.laoda.de/archives/docker-install-memos" index="4">4</mcreference>

### 5.1 使用 Docker 命令部署

```bash
# 创建存储卷目录
mkdir -p /root/memos

# 运行 Memos 容器
docker run -d \
  --name memos \
  --publish 5230:5230 \
  --volume /root/memos/:/var/opt/memos \
  neosmemo/memos:latest \
  --mode prod \
  --port 5230
```
<mcreference link="https://blog.laoda.de/archives/docker-install-memos" index="4">4</mcreference>

### 5.2 使用 Docker Compose 部署

1. 创建 `docker-compose.yml` 文件：

```yaml
version: "3"
services:
  memos:
    image: neosmemo/memos:latest
    container_name: memos
    hostname: memos
    ports:
      - "5230:5230"
    volumes:
      - /root/memos/.memos/:/var/opt/memos
    restart: always
```
<mcreference link="https://blog.laoda.de/archives/docker-install-memos" index="4">4</mcreference>

2. 启动服务：

```bash
docker-compose up -d
```

### 5.3 访问 Memos

部署完成后，可以通过浏览器访问 `http://服务器IP:5230` 来使用 Memos。初次访问时，需要创建管理员账号。<mcreference link="https://sspai.com/post/76247" index="1">1</mcreference>

### 5.4 升级 Memos

```bash
# 停止并删除旧容器
docker stop memos
docker rm -f memos

# 备份数据（可选但推荐）
cp -r /root/memos/.memos /root/memos/.memos.archive

# 拉取最新镜像
docker pull neosmemo/memos:latest

# 重新运行容器（使用与部署时相同的命令）
docker run -d \
  --name memos \
  --publish 5230:5230 \
  --volume /root/memos/.memos/:/var/opt/memos \
  neosmemo/memos:latest \
  --mode prod \
  --port 5230
```
<mcreference link="https://blog.laoda.de/archives/docker-install-memos" index="4">4</mcreference>

## 6. Docker 最佳实践

### 6.1 安全性建议

- 定期更新 Docker 和容器镜像
- 使用官方镜像或可信来源的镜像
- 限制容器的资源使用
- 不要在容器中运行特权进程
- 使用 Docker 内置的安全功能（如 seccomp、AppArmor）

### 6.2 性能优化

- 使用多阶段构建减小镜像大小
- 合理设置容器的资源限制
- 使用数据卷而不是数据容器
- 避免在生产环境中使用 `latest` 标签

### 6.3 日志管理

配置 Docker 日志驱动以防止日志文件过大：

```json
{
    "log-driver": "json-file",
    "log-opts": {
        "max-size": "20m",
        "max-file": "3"
    }
}
```

## 7. 常见问题与解决方案

### 7.1 容器无法启动

- 检查端口是否被占用：`netstat -tulpn | grep <端口号>`
- 检查日志：`docker logs <容器ID或名称>`
- 检查磁盘空间：`df -h`

### 7.2 镜像拉取失败

- 检查网络连接
- 尝试使用镜像加速器
- 检查 Docker Hub 是否可访问

### 7.3 容器间通信问题

- 使用 Docker 网络：`docker network create <网络名>`
- 使用容器名作为主机名进行通信
- 检查防火墙设置

## 8. 参考资源

- [Docker 官方文档](https://docs.docker.com/)
- [Docker Hub](https://hub.docker.com/)
- [Memos GitHub 仓库](https://github.com/usememos/memos)
- [Docker 命令大全](https://www.runoob.com/docker/docker-command-manual.html)