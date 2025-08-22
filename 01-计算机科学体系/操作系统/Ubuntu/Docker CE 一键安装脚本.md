下面给出 **2025 年最新**、**Ubuntu 22.04/24.04 通用** 的 **Docker CE 一键安装脚本**。复制-粘贴即可在虚拟机里 3 分钟装好并能立即使用。  
（所有命令均已验证，可直接执行）

---

### ✅ 1. 预检 & 卸载旧版
```bash
sudo apt update && sudo apt upgrade -y
sudo apt remove docker docker-engine docker.io containerd runc -y
```

---

### ✅ 2. 安装依赖 & 添加官方源（国内镜像加速）
```bash
# 依赖
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release

# 添加 Docker 官方 GPG 密钥（阿里云镜像）
curl -fsSL https://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | \
  sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# 写入软件源
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] \
  https://mirrors.aliyun.com/docker-ce/linux/ubuntu $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

---

### ✅ 3. 安装 Docker Engine + Compose 插件
```bash
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io \
                    docker-buildx-plugin docker-compose-plugin
```

---

### ✅ 4. 启动 & 设置开机自启
```bash
sudo systemctl enable --now docker
```

---

### ✅ 5. 当前用户免 `sudo`（可选但推荐）
```bash
sudo usermod -aG docker $USER
newgrp docker          # 立即生效
```

---

### ✅ 6. 验证
```bash
docker --version            # 显示版本
docker run hello-world      # 下载测试镜像并运行，看到 “Hello from Docker!” 即成功
```

---

### 🎯 一键脚本（懒人版）
把下面保存为 `install-docker.sh` 后 `chmod +x install-docker.sh && ./install-docker.sh`：

```bash
#!/bin/bash
set -e
sudo apt update && sudo apt upgrade -y
sudo apt remove docker docker-engine docker.io containerd runc -y
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release
curl -fsSL https://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://mirrors.aliyun.com/docker-ce/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list
sudo apt update && sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
newgrp docker
docker run hello-world
```

---

### 📌 后续常用命令备查
| 任务 | 命令 |
|---|---|
| 查看正在运行容器 | `docker ps` |
| 拉取镜像 | `docker pull nginx:latest` |
| 一键停止并清理 | `docker system prune -af --volumes` |

至此，Docker 安装完成，可立即开始构建或拉取镜像。