在 Ubuntu 上安装 `docker-compose` 有两种主流方法：

### ​**方法 1：使用官方二进制（推荐）​**​

适用于所有 Ubuntu 版本（包括 20.04/22.04），安装最新稳定版：

```
# 1. 下载最新版 docker-compose（替换版本号）
sudo curl -L "https://github.com/docker/compose/releases/download/v2.27.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# 2. 添加可执行权限
sudo chmod +x /usr/local/bin/docker-compose

# 3. 验证安装
docker-compose --version  # 输出示例：Docker Compose version v2.27.1
```

#### **2. 删除错误文件**
```
sudo rm -f /usr/local/bin/docker-compose
```
#### **下载失败重新下载（使用官方 URL）​**
```
# 直接使用 GitHub 官方 URL（确保网络正常）
sudo curl -L "https://github.com/docker/compose/releases/download/v2.27.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# 如果 GitHub 访问慢，可以用国内镜像（如阿里云）
sudo curl -L "https://mirrors.aliyun.com/docker-toolbox/linux/compose/v2.27.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

---

### ​**方法 2：通过 apt 安装（旧版）​**​

适用于 Ubuntu 官方仓库版本（但版本较旧）：

```
# 1. 更新包索引
sudo apt update

# 2. 安装 docker-compose-plugin（Docker 官方推荐）
sudo apt install docker-compose-plugin

# 3. 验证安装
docker compose version  # 注意：新版命令无连字符（-）
```

---

### ​**常见问题**​

1. ​**权限错误**​：  
    如果提示 `Permission denied`，确保当前用户在 `docker` 用户组中：
    
    ```
    sudo usermod -aG docker $USER  # 添加当前用户到 docker 组
    newgrp docker                  # 刷新组权限（或重新登录）
    ```
    
2. ​**命令不存在**​：  
    检查 `/usr/local/bin` 是否在 `$PATH` 中：
    
    ```
    echo $PATH
    ```
    
3. ​**兼容性提示**​：
    
    - Docker 官方已迁移到 `docker compose`（无连字符的 Go 版本），但旧版 `docker-compose` 仍可继续使用。
    - 如果使用 `apt` 安装的版本过旧，建议改用 ​**方法1**​ 安装最新版。

---

### ​**卸载方法**​

```
# 如果通过 curl 安装
sudo rm /usr/local/bin/docker-compose

# 如果通过 apt 安装
sudo apt remove docker-compose-plugin
```

---

如果需要其他帮助（如配置镜像加速或代理），请告诉我！