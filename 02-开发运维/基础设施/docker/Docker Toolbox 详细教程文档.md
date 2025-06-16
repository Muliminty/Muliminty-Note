### Docker Toolbox 详细教程文档

---

#### **一、什么是 Docker Toolbox？**
- **定位**：为旧版 Windows（Windows 10 以下）和 macOS（10.13 以下）设计的 Docker 解决方案。
- **核心组件**：
  - Docker Client（命令行工具）
  - Docker Engine（通过 VirtualBox 虚拟机运行）
  - Docker Compose
  - Docker Machine（管理虚拟机）
  - Kitematic（GUI 管理工具）
- **适用场景**：
  - 不支持 Hyper-V 的 Windows 系统（如 Windows 7/8）
  - macOS 老版本无法运行 Docker Desktop

---

#### **二、安装准备**
1. **系统要求**：
   - **Windows**：64-bit Windows 7/8/10（需关闭 Hyper-V）
   - **macOS**：10.10 "Yosemite" 或更高
   - **硬件**：VT-x/AMD-v 虚拟化支持（需在 BIOS 中启用）
   - **磁盘空间**：至少 3GB 可用空间

2. **安装依赖**：
   - [Oracle VirtualBox](https://www.virtualbox.org/)（最新版）
   - 关闭安全软件（避免安装冲突）

---

#### **三、安装步骤（Windows/macOS 通用）**
1. **下载安装包**：
   - 官网下载：[https://github.com/docker/toolbox/releases](https://github.com/docker/toolbox/releases)
   - 选择对应系统版本（`.exe` 或 `.pkg`）

2. **运行安装向导**：
   - **Windows**：
     - 勾选所有组件（包括 VirtualBox、Git Bash）。
     - 安装路径避免空格（如 `C:\DockerToolbox`）。
   - **macOS**：
     - 拖拽 Docker Toolbox 到 Applications 文件夹。
     - 授权所有权限请求。

3. **完成安装**：
   - 桌面生成图标：
     - Docker Quickstart Terminal（核心工具）
     - Kitematic（GUI 管理）
     - VirtualBox

---

#### **四、首次启动配置**
1. **启动 Docker Quickstart Terminal**：
   - 自动创建名为 `default` 的 VirtualBox 虚拟机（基于 boot2docker Linux 镜像）。
   - 过程提示：
     ```bash
     Creating a new virtual machine...
     Starting "default"...
     Docker is up and running!
     ```
   - 显示 Docker 鲸鱼图标即成功。

2. **验证安装**：
   ```bash
   docker --version          # 输出 Docker 版本（如 18.09）
   docker run hello-world    # 运行测试容器
   ```

3. **环境变量检查**：
   ```bash
   docker-machine env default  # 查看虚拟机环境变量
   eval $(docker-machine env default)  # 激活环境（每次新终端需执行）
   ```

---

#### **五、核心操作指南**
1. **管理虚拟机**：
   - 启动/停止 VM：
     ```bash
     docker-machine start default   # 启动
     docker-machine stop default    # 停止
     ```
   - 查看 VM 信息：
     ```bash
     docker-machine ip default     # 获取虚拟机 IP（通常 192.168.99.100）
     docker-machine ls             # 列出所有虚拟机
     ```

2. **运行容器**：
   - 示例：启动 Nginx 容器并映射端口：
     ```bash
     docker run -d -p 8080:80 --name my-nginx nginx
     ```
     访问：`http://192.168.99.100:8080`

3. **挂载本地目录**：
   - 需将目录共享到 VirtualBox 虚拟机：
     ```bash
     # 先停止虚拟机
     docker-machine stop default
     # 添加共享文件夹（Windows 示例）
     VBoxManage sharedfolder add "default" --name "c/Users" --hostpath "C:\Users" --automount
     # 重启后，在虚拟机内访问 /c/Users
     ```
   - 运行容器时挂载：
     ```bash
     docker run -v /c/Users:/data alpine ls /data
     ```

4. **使用 Kitematic**：
   - 图形化管理容器（启动/停止/日志查看）。
   - 可视化修改环境变量、端口映射。

---

#### **六、常见问题解决**
1. **启动报错 "VT-x not available"**：
   - 进入 BIOS 启用虚拟化（Intel VT-x / AMD-V）。
   - 关闭 Hyper-V（Windows）：  
     ```powershell
     bcdedit /set hypervisorlaunchtype off
     ```

2. **共享文件夹权限问题**：
   - 在 VirtualBox 中设置共享文件夹为“自动挂载”。
   - 容器内使用 `-v` 挂载时添加 `:rw` 参数：
     ```bash
     docker run -v /c/Users:/data:rw my-image
     ```

3. **网络连接失败**：
   - 检查防火墙是否放行 VirtualBox 网络（通常 `192.168.99.0/24`）。
   - 重置 Docker 虚拟机：
     ```bash
     docker-machine regenerate-certs default
     docker-machine restart default
     ```

4. **镜像下载慢**：
   - 配置国内镜像源：
     ```bash
     docker-machine ssh default
     echo '{"registry-mirrors": ["https://docker.mirrors.ustc.edu.cn"]}' > /etc/docker/daemon.json
     exit
     docker-machine restart default
     ```

---

#### **七、升级与卸载**
1. **升级 Docker Toolbox**：
   - 下载新版本安装包覆盖安装。
   - 保留现有虚拟机：
     ```bash
     docker-machine upgrade default
     ```

2. **完全卸载**：
   - **Windows**：
     - 控制面板卸载 Docker Toolbox、VirtualBox、Git。
     - 删除 `C:\Users\<user>\.docker` 和 `C:\Users\<user>\.docker-machine`。
   - **macOS**：
     ```bash
     rm -rf /Applications/Docker
     rm -rf ~/.docker
     rm -rf ~/.docker-machine
     ```

---

#### **八、替代方案建议**
- **Windows 10+/macOS 10.15+**：  
  迁移到 [Docker Desktop](https://www.docker.com/products/docker-desktop)，性能更好且支持原生虚拟化。
- **Linux 用户**：  
  直接安装 Docker Engine（无需虚拟机）。

---

> **附：命令速查表**
> ```bash
> docker-machine create dev     # 创建新虚拟机
> docker-compose up -d         # 启动 Compose 服务
> docker ps -a                 # 查看所有容器
> docker exec -it my-nginx sh  # 进入容器
> ```

通过本教程，您已掌握 Docker Toolbox 的核心操作。建议新系统用户优先使用 Docker Desktop，老系统用户可继续使用 Toolbox 作为稳定方案。