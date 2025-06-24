### Ubuntu Docker 安装与使用教程

#### **一、安装 Docker**
以下步骤适用于 Ubuntu 20.04/22.04 LTS：

1. **卸载旧版本**（如有）：
   ```bash
   sudo apt remove docker docker-engine docker.io containerd runc
   ```

2. **更新系统并安装依赖**：
   ```bash
   sudo apt update
   sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
   ```

3. **添加 Docker 官方 GPG 密钥**：
   ```bash
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
   ```

4. **添加 Docker 仓库**：
   ```bash
   echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
   ```

5. **安装 Docker 引擎**：
   ```bash
   sudo apt update
   sudo apt install -y docker-ce docker-ce-cli containerd.io
   ```

6. **验证安装**：
   ```bash
   sudo docker run hello-world
   ```
   看到 `Hello from Docker!` 表示安装成功。

---

#### **二、配置 Docker（可选）**
1. **允许非 root 用户运行 Docker**：
   ```bash
   sudo usermod -aG docker $USER
   newgrp docker  # 刷新用户组（或重启终端）
   ```

2. **设置 Docker 开机自启**：
   ```bash
   sudo systemctl enable docker
   ```

---

#### **三、Docker 基本命令**
| **命令** | **说明** |
|----------|----------|
| `docker pull nginx` | 拉取镜像（如 Nginx） |
| `docker images` | 查看本地镜像 |
| `docker run -d -p 8080:80 --name my-nginx nginx` | 后台运行容器（映射端口 8080→80） |
| `docker ps` | 查看运行中的容器 |
| `docker ps -a` | 查看所有容器（包括已停止） |
| `docker stop my-nginx` | 停止容器 |
| `docker start my-nginx` | 启动已停止的容器 |
| `docker rm my-nginx` | 删除容器 |
| `docker rmi nginx` | 删除镜像 |
| `docker exec -it my-nginx bash` | 进入容器终端 |

---

#### **四、使用示例：部署 Nginx**
1. **拉取镜像**：
   ```bash
   docker pull nginx:latest
   ```

2. **运行容器**：
   ```bash
   docker run -d --name my-web -p 80:80 nginx
   ```
   - `-d`：后台运行
   - `--name`：容器名称
   - `-p 80:80`：主机端口:容器端口

3. **访问服务**：
   打开浏览器访问 `http://localhost`，看到 Nginx 欢迎页即成功。

---

#### **五、管理 Docker 服务**
| **命令** | **说明** |
|----------|----------|
| `sudo systemctl start docker` | 启动 Docker 服务 |
| `sudo systemctl stop docker` | 停止 Docker 服务 |
| `sudo systemctl restart docker` | 重启 Docker 服务 |

---

#### **六、常见问题**
1. **权限问题**：
   - 错误：`Got permission denied while trying to connect...`
   - 解决：执行 `sudo usermod -aG docker $USER` 并重新登录。

2. **端口冲突**：
   - 错误：`Bind for 0.0.0.0:80 failed: port is already allocated`
   - 解决：更换主机端口或停止占用端口的容器。

3. **清理资源**：
   ```bash
   docker system prune -a  # 清理所有未使用的镜像/容器
   ```

---

#### **七、卸载 Docker**
1. 卸载软件包：
   ```bash
   sudo apt purge docker-ce docker-ce-cli containerd.io
   ```
2. 删除残留文件：
   ```bash
   sudo rm -rf /var/lib/docker
   sudo rm -rf /var/lib/containerd
   ```
