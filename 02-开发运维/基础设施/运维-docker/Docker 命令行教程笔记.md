
### **一、环境准备**
#### 1. **系统要求**
- **Windows 10/11**（64位专业版/企业版/教育版）
- **启用虚拟化**（BIOS中开启 VT-x/AMD-V）
- **启用 WSL2**（Windows Subsystem for Linux 2）

#### 2. **安装步骤**
1. **启用 WSL2**（管理员 PowerShell）：
   ```powershell
   dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
   dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
   wsl --install  # 安装默认 Linux 发行版
   wsl --set-default-version 2
   ```
2. **安装 Docker Desktop**：
   - 下载 [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
   - 安装时勾选 **"Use WSL 2 instead of Hyper-V"**
3. **验证安装**：
   ```powershell
   docker --version        # 输出版本信息（e.g. Docker version 24.0.7）
   docker run hello-world  # 运行测试容器
   ```

---

### **二、核心概念**
| 概念         | 说明                                                                 |
|--------------|----------------------------------------------------------------------|
| **镜像(Image)**   | 只读模板（如 `ubuntu:22.04`），用于创建容器                          |
| **容器(Container)** | 镜像的运行实例（轻量级虚拟机）                                       |
| **仓库(Registry)** | 存储镜像的服务（默认 Docker Hub，如 `nginx` 即 `docker.io/library/nginx`） |

---

### **三、常用命令速查**
#### 1. **镜像管理**
| 命令 | 说明 | 示例 |
|------|------|------|
| `docker pull <镜像名>` | 下载镜像 | `docker pull ubuntu:22.04` |
| `docker images` | 查看本地镜像 | `docker images -a`（含中间层镜像） |
| `docker rmi <镜像ID>` | 删除镜像 | `docker rmi d2e4e1f51132` |
| `docker build -t <镜像名> .` | 构建镜像（需 Dockerfile） | `docker build -t my-app:1.0 .` |

#### 2. **容器管理**
| 命令 | 说明 | 示例 |
|------|------|------|
| `docker run [选项] <镜像>` | 创建并启动容器 | `docker run -d -p 8080:80 --name web nginx` |
| `docker ps` | 查看运行中的容器 | `docker ps -a`（含已停止容器） |
| `docker start/stop/restart <容器名>` | 启动/停止/重启容器 | `docker stop web` |
| `docker rm <容器名>` | 删除容器 | `docker rm -f web`（强制删除运行中容器） |
| `docker exec -it <容器名> <命令>` | 进入容器终端 | `docker exec -it web /bin/bash` |
| `docker logs <容器名>` | 查看容器日志 | `docker logs -f web`（实时跟踪） |

#### 3. **网络与存储**
| 命令 | 说明 | 示例 |
|------|------|------|
| `docker network ls` | 查看网络列表 | `docker network create my-net` |
| `docker volume create <卷名>` | 创建数据卷 | `docker volume create my-vol` |
| `docker run -v <宿主机路径>:<容器路径>` | 挂载目录 | `docker run -v C:\data:/app/data ubuntu` |
| `docker run -p <主机端口>:<容器端口>` | 端口映射 | `docker run -p 80:8080 nginx` |

---

### **四、实战示例**
#### 1. **运行 Nginx 并挂载网页目录**
```powershell
# 创建本地目录
mkdir C:\web-content

# 启动容器（挂载目录+端口映射）
docker run -d --name my-nginx -p 80:80 -v C:\web-content:/usr/share/nginx/html nginx

# 在 C:\web-content\index.html 写入内容，浏览器访问 http://localhost
```

#### 2. **构建自定义镜像（Dockerfile）**
1. 创建 `Dockerfile`：
   ```dockerfile
   FROM python:3.9-slim
   WORKDIR /app
   COPY . .
   RUN pip install flask
   EXPOSE 5000
   CMD ["python", "app.py"]
   ```
2. 构建并运行：
   ```powershell
   docker build -t my-flask-app .
   docker run -d -p 5000:5000 --name flask-app my-flask-app
   ```

#### 3. **使用 Docker Compose 部署多服务**
1. 创建 `docker-compose.yml`：
   ```yaml
   version: '3.8'
   services:
     web:
       image: nginx
       ports:
         - "80:80"
     db:
       image: mysql:8.0
       environment:
         MYSQL_ROOT_PASSWORD: example
   ```
2. 启动服务：
   ```powershell
   docker-compose up -d  # 后台运行
   docker-compose down   # 停止并删除
   ```

---

### **五、常见问题解决**
1. **权限问题**：
   - 错误：`Permission denied`  
     解决方案：在 Docker Desktop 设置 → **Resources → File Sharing** 中添加项目目录。
   
2. **端口冲突**：
   - 错误：`Bind for 0.0.0.0:80 failed: port is already allocated`  
     解决方案：更换主机端口（`-p 8080:80`）或停止占用端口的进程。

3. **WSL2 磁盘空间不足**：
   ```powershell
   wsl --shutdown  # 关闭 WSL
   diskpart        # Windows 磁盘工具
   select vdisk file="C:\Users\<user>\AppData\Local\Docker\wsl\data\ext4.vhdx"
   extend size=20480  # 扩展 20GB（单位 MB）
   ```

---

### **六、学习资源**
- **官方文档**：[https://docs.docker.com/](https://docs.docker.com/)
- **Docker Hub**：[https://hub.docker.com/](https://hub.docker.com/)
- **实战课程**：[Docker Mastery on Udemy](https://www.udemy.com/course/docker-mastery/)

> 提示：所有命令均在 **PowerShell** 或 **CMD** 中执行，建议使用 Windows Terminal 增强体验。
