在 Ubuntu 系统中，Docker 的项目（容器、镜像、卷等数据）默认存储在 `/var/lib/docker` 目录下。以下是详细说明：

---

### 1. **Docker 默认存储路径**
- **根目录**: `/var/lib/docker`
  - 包含所有 Docker 相关的数据，包括：
    - **镜像（Images）**: `/var/lib/docker/image/`
    - **容器（Containers）**: `/var/lib/docker/containers/`
    - **卷（Volumes）**: `/var/lib/docker/volumes/`
    - **网络（Networks）**: `/var/lib/docker/network/`

---

### 2. **如何确认 Docker 存储路径**
如果 Docker 配置了自定义存储路径（例如通过 `daemon.json` 修改），可以通过以下命令检查：
```bash
sudo docker info | grep "Docker Root Dir"
```
输出示例：
```
Docker Root Dir: /var/lib/docker
```

---

### 3. **查看具体项目**
- **列出所有容器**（包括运行中和已停止的）：
  ```bash
  sudo docker ps -a
  ```
- **列出所有镜像**：
  ```bash
  sudo docker images
  ```
- **查看容器数据目录**：
  每个容器的文件系统存储在 `/var/lib/docker/containers/<容器ID>/` 下。

---

### 4. **注意事项**
- 需要 `root` 权限访问 `/var/lib/docker`，例如：
  ```bash
  sudo ls -la /var/lib/docker
  ```
- 如果 Docker 使用其他存储驱动（如 `overlay2`），目录结构可能略有不同，但根目录仍为 `/var/lib/docker`。

---

### 5. **自定义存储路径**
如果 Docker 数据存储在非默认位置（例如挂载的磁盘），检查配置文件：
```bash
sudo cat /etc/docker/daemon.json
```
修改此文件（如调整 `data-root`）后需重启 Docker：
```bash
sudo systemctl restart docker
```

---

通过以上步骤，你可以定位到 Docker 项目的实际存储位置。如果有其他需求（如迁移数据），请谨慎操作并备份数据。