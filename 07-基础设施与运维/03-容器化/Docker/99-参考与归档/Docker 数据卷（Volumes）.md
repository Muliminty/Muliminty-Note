# Docker 卷（Volumes）简介

> 本文简要介绍 Docker 的数据卷（volumes）及其作用场景。

---

## 1. 什么是 Volumes？

**Docker Volumes（数据卷）** 是 Docker 提供的持久化存储机制，用于在容器生命周期之外保存数据。

**简单理解**：
- 容器删除后，容器内的数据会丢失
- Volumes 就像容器的"外部硬盘"，数据存储在容器外部
- 即使容器被删除，Volume 中的数据依然存在

---

## 2. 为什么需要 Volumes？

### 问题：容器数据丢失

```bash
# 在容器中创建文件
docker run -it ubuntu:20.04 /bin/bash
echo "重要数据" > /data/file.txt
exit

# 删除容器后，数据就丢失了
docker rm <容器ID>
```

### 解决：使用 Volumes 持久化数据

```bash
# 使用数据卷，数据不会丢失
docker run -it -v my-data:/data ubuntu:20.04 /bin/bash
echo "重要数据" > /data/file.txt
exit

# 即使删除容器，数据还在
docker rm <容器ID>
# 数据仍然保存在 my-data 卷中
```

---

## 3. 三种数据存储方式

### 3.1 数据卷（Volume）- 推荐用于生产环境

**特点**：
- Docker 管理的存储位置
- 独立于容器生命周期
- 可移植性好
- 适合生产环境

**使用方式**：
```bash
# 创建数据卷
docker volume create my-volume

# 使用数据卷
docker run -d -v my-volume:/data nginx:latest

# 或者使用匿名卷（自动创建）
docker run -d -v /data nginx:latest
```

### 3.2 绑定挂载（Bind Mount）- 适合开发环境

**特点**：
- 直接挂载宿主机目录
- 方便开发时修改代码
- 可移植性差（路径依赖）
- 适合开发环境

**使用方式**：
```bash
# 绑定挂载目录
docker run -d -v /host/path:/container/path nginx:latest

# 只读挂载
docker run -d -v /host/path:/container/path:ro nginx:latest

# 开发环境常用：挂载当前目录
docker run -d -v $(pwd):/app node:16
```

### 3.3 临时文件系统（tmpfs）- 临时数据

**特点**：
- 存储在内存中
- 容器停止后数据丢失
- 性能好
- 适合临时数据

**使用方式**：
```bash
# 使用 tmpfs
docker run -d --tmpfs /tmp nginx:latest

# 指定大小
docker run -d --tmpfs /tmp:rw,noexec,nosuid,size=100m nginx:latest
```

---

## 4. 对比表格

| 特性 | 数据卷（Volume） | 绑定挂载（Bind Mount） | tmpfs |
|------|-----------------|---------------------|-------|
| **管理方式** | Docker 管理 | 用户管理 | Docker 管理 |
| **存储位置** | Docker 存储目录 | 宿主机指定路径 | 内存 |
| **可移植性** | 高 | 低 | 高 |
| **性能** | 好 | 取决于宿主机 | 最好 |
| **数据持久化** | ✅ 是 | ✅ 是 | ❌ 否 |
| **适用场景** | 生产环境 | 开发环境 | 临时数据 |

---

## 5. 常用命令

### 数据卷管理

```bash
# 创建数据卷
docker volume create my-volume

# 列出所有数据卷
docker volume ls

# 查看数据卷详细信息
docker volume inspect my-volume

# 删除数据卷
docker volume rm my-volume

# 删除所有未使用的数据卷（谨慎使用）
docker volume prune
```

### 使用数据卷

```bash
# 方式1：使用 -v 参数（简写）
docker run -d -v my-volume:/data nginx:latest

# 方式2：使用 --mount 参数（推荐，更明确）
docker run -d \
  --mount source=my-volume,target=/data \
  nginx:latest

# 绑定挂载
docker run -d -v /host/path:/container/path nginx:latest

# 只读挂载
docker run -d -v /host/path:/container/path:ro nginx:latest
```

---

## 6. 实际应用场景

### 场景 1：数据库数据持久化

```bash
# MySQL 数据持久化
docker run -d \
  --name mysql \
  -v mysql-data:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=password \
  mysql:8.0

# 即使删除容器，数据库数据也不会丢失
docker rm -f mysql
docker run -d \
  --name mysql \
  -v mysql-data:/var/lib/mysql \
  mysql:8.0
# 数据还在！
```

### 场景 2：开发环境代码挂载

```bash
# 挂载源代码目录，修改代码立即生效
docker run -it \
  --name dev \
  -v $(pwd):/workspace \
  -w /workspace \
  node:16 \
  /bin/bash

# 在容器内修改代码，宿主机也能看到
```

### 场景 3：配置文件挂载

```bash
# 挂载 Nginx 配置文件
docker run -d \
  --name nginx \
  -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro \
  -p 80:80 \
  nginx:latest

# 修改配置文件后，重启容器即可生效
```

### 场景 4：多容器共享数据

```bash
# 创建共享数据卷
docker volume create shared-data

# 容器1写入数据
docker run -d -v shared-data:/data --name writer alpine sh -c "echo 'Hello' > /data/file.txt"

# 容器2读取数据
docker run -it --rm -v shared-data:/data alpine cat /data/file.txt
# 输出：Hello
```

---

## 7. 数据卷位置

### 查看数据卷存储位置

```bash
# 查看数据卷详细信息（包含存储路径）
docker volume inspect my-volume

# 输出示例：
# [
#     {
#         "CreatedAt": "2024-01-01T00:00:00Z",
#         "Driver": "local",
#         "Mountpoint": "/var/lib/docker/volumes/my-volume/_data",
#         "Name": "my-volume",
#         "Options": {},
#         "Scope": "local"
#     }
# ]
```

**Linux 默认位置**：`/var/lib/docker/volumes/<卷名>/_data`  
**macOS/Windows**：在 Docker Desktop 的虚拟机中

---

## 8. 数据备份与恢复

### 备份数据卷

```bash
# 备份数据卷到当前目录
docker run --rm \
  -v my-volume:/data \
  -v $(pwd):/backup \
  ubuntu:20.04 \
  tar czf /backup/backup.tar.gz /data
```

### 恢复数据卷

```bash
# 从备份恢复数据卷
docker run --rm \
  -v my-volume:/data \
  -v $(pwd):/backup \
  ubuntu:20.04 \
  tar xzf /backup/backup.tar.gz -C /
```

---

## 9. 常见问题

### Q1: 数据卷 vs 绑定挂载，如何选择？

**生产环境**：使用数据卷（Volume）
- 可移植性好
- Docker 统一管理
- 不依赖宿主机路径

**开发环境**：使用绑定挂载（Bind Mount）
- 方便修改代码
- 实时同步
- 调试方便

### Q2: 如何查看数据卷中的数据？

```bash
# 方法1：使用临时容器查看
docker run --rm -it -v my-volume:/data ubuntu:20.04 ls -la /data

# 方法2：进入数据卷目录（需要 root 权限）
sudo ls -la /var/lib/docker/volumes/my-volume/_data
```

### Q3: 如何清理未使用的数据卷？

```bash
# 查看未使用的数据卷
docker volume ls -f dangling=true

# 删除未使用的数据卷（谨慎使用）
docker volume prune
```

---

## 10. 最佳实践

1. **生产环境使用命名数据卷**
   ```bash
   docker volume create app-data
   docker run -d -v app-data:/data myapp:latest
   ```

2. **开发环境使用绑定挂载**
   ```bash
   docker run -d -v $(pwd):/app node:16
   ```

3. **配置文件使用只读挂载**
   ```bash
   docker run -d -v /host/config:/container/config:ro app:latest
   ```

4. **定期备份重要数据卷**
   ```bash
   # 设置定时任务备份
   0 2 * * * docker run --rm -v my-volume:/data -v /backup:/backup ubuntu:20.04 tar czf /backup/backup-$(date +\%Y\%m\%d).tar.gz /data
   ```

---

## 📚 相关链接

- [容器数据管理](../03-容器管理/02-容器数据管理.md) - 详细的数据管理指南
- [Docker 存储详解](../06-网络与存储/01-存储详解.md) - 存储架构和驱动
- [数据持久化策略](../06-网络与存储/02-数据持久化策略.md) - 持久化最佳实践
- [[指令速查|Docker 指令速查]] - 常用命令参考

---

## 📚 参考资源

- [Docker 官方文档 - 数据卷](https://docs.docker.com/storage/volumes/)
- [Docker 官方文档 - 绑定挂载](https://docs.docker.com/storage/bind-mounts/)
- [Docker 官方文档 - tmpfs](https://docs.docker.com/storage/tmpfs/)

---

[[!MOC-Docker|返回 Docker 知识体系]]

#Docker #数据卷 #Volumes #数据持久化 #存储
