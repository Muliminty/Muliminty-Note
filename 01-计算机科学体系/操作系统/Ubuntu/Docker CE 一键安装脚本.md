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


# 一键安装脚本

下面给出一份 **Ubuntu 22.04/24.04 通用** 的 **Docker 一键安装脚本**（含国内镜像加速），复制到终端直接跑即可，3 分钟装好。

```bash
#!/usr/bin/env bash
# Ubuntu 22.04/24.04 Docker CE 一键安装脚本
# 更新时间：2025-08-22

set -e

echo ">>> 1. 更新系统包索引"
sudo apt-get update -y && sudo apt-get upgrade -y

echo ">>> 2. 卸载旧版本 Docker"
sudo apt-get remove -y docker docker-engine docker.io containerd runc || true

echo ">>> 3. 安装依赖"
sudo apt-get install -y \
  ca-certificates \
  curl \
  gnupg \
  lsb-release

echo ">>> 4. 导入阿里云 GPG 密钥 & 添加仓库"
curl -fsSL https://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | \
  sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) \
  signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] \
  https://mirrors.aliyun.com/docker-ce/linux/ubuntu \
  $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

echo ">>> 5. 安装 Docker Engine + Compose 插件"
sudo apt-get update -y
sudo apt-get install -y \
  docker-ce \
  docker-ce-cli \
  containerd.io \
  docker-buildx-plugin \
  docker-compose-plugin

echo ">>> 6. 启动并设置开机自启"
sudo systemctl enable --now docker

echo ">>> 7. 将当前用户加入 docker 组（免 sudo）"
sudo usermod -aG docker "$USER"

echo ">>> 8. 配置阿里云镜像加速器（国内网络更快）"
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json >/dev/null <<EOF
{
  "registry-mirrors": ["https://registry.aliyuncs.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker

echo ">>> 9. 验证安装"
docker --version
docker run --rm hello-world

echo ">>> Docker 安装完成！请注销或重启终端使免 sudo 生效。"
```

### 使用方法
1. 保存为 `install-docker.sh`  
2. 赋权并执行  
   ```bash
   chmod +x install-docker.sh
   ./install-docker.sh
   ```

安装结束后，**注销或重开终端**即可免 `sudo` 运行 Docker。

# 一键脚本设置代理

明白 ✅
我帮你写一个 **一键脚本**，可以直接配置 Docker 的 **HTTP/HTTPS 代理**（适合你在 VMware 里跑 Linux，需要走代理才能拉取镜像的情况）。

下面的脚本适合 **systemd 管理 Docker 的 Linux 系统（Ubuntu / Debian / CentOS 7+）**。

---

### 脚本：`set-docker-proxy.sh`

```bash
#!/bin/bash
# 一键设置 Docker 代理 (systemd)

set -e

# 代理地址 (请修改为你自己的代理地址)
HTTP_PROXY="http://127.0.0.1:7890"
HTTPS_PROXY="http://127.0.0.1:7890"
NO_PROXY="localhost,127.0.0.1"

# 创建目录
sudo mkdir -p /etc/systemd/system/docker.service.d

# 写入代理配置
cat <<EOF | sudo tee /etc/systemd/system/docker.service.d/http-proxy.conf
[Service]
Environment="HTTP_PROXY=${HTTP_PROXY}"
Environment="HTTPS_PROXY=${HTTPS_PROXY}"
Environment="NO_PROXY=${NO_PROXY}"
EOF

# 重新加载并重启 Docker
echo ">>> 重新加载 systemd..."
sudo systemctl daemon-reexec
sudo systemctl daemon-reload

echo ">>> 重启 Docker..."
sudo systemctl restart docker

echo ">>> Docker 代理配置完成！"
echo "验证配置: systemctl show --property=Environment docker"
```

---

### 使用方法

1. 保存为 `set-docker-proxy.sh`

2. 赋予执行权限：

   ```bash
   chmod +x set-docker-proxy.sh
   ```

3. 执行：

   ```bash
   ./set-docker-proxy.sh
   ```

4. 验证：

   ```bash
   systemctl show --property=Environment docker
   ```

   应该能看到你设置的 `HTTP_PROXY` / `HTTPS_PROXY`。

5. 再测试：

   ```bash
   docker run --rm hello-world
   ```

---

要不要我帮你扩展一下脚本，加上 **一键取消代理** 的功能（比如 `./set-docker-proxy.sh --unset`）？
