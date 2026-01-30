
1. 创建容器[20260130-运行交互式容器](批注/20260130-运行交互式容器.md)


好的，我给你整理一份**完整的从零搭建容器 SSH 并用 VSCode Remote-SSH 连接的文档**，包含 Dockerfile、配置和注意事项，保证可以直接用。

---

# 容器 SSH + VSCode Remote-SSH 使用文档

## 一、前提条件

* 已安装 Docker（Mac/Win/Linux 都可以）
* 已安装 VSCode + Remote-SSH 插件
* 有一定的终端操作基础

---

## 二、Dockerfile 配置

这是一个最小可用的 Ubuntu 容器，并开启 SSH 服务。

```dockerfile
# 基础镜像
FROM ubuntu:22.04

# 设置环境变量避免交互
ENV DEBIAN_FRONTEND=noninteractive

# 安装必要软件
RUN apt-get update && apt-get install -y \
    openssh-server \
    sudo \
    vim \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 创建 SSH 目录
RUN mkdir /var/run/sshd

# 设置 root 密码
RUN echo 'root:root123' | chpasswd

# 允许 root 登录
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
RUN sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config

# 防止 SSH 自动退出
RUN echo "PermitUserEnvironment yes" >> /etc/ssh/sshd_config

# 容器启动时运行 SSH 服务
CMD ["/usr/sbin/sshd","-D"]
```

> ⚠️ 提示：`root123` 是 root 密码，可根据需求修改。

---

## 三、构建镜像并启动容器

1. **构建镜像**

```bash
docker build -t ubuntu-ssh .
```

2. **启动容器并映射端口**

```bash
docker run -d --name my-ubuntu-container -p 2222:22 ubuntu-ssh
```

* `-p 2222:22` 表示宿主机的 2222 端口映射到容器的 22 端口
* `-d` 后台运行

3. **检查容器是否启动**

```bash
docker ps
```

输出类似：

```
CONTAINER ID   IMAGE       PORTS       NAMES
abcd1234       ubuntu-ssh  0.0.0.0:2222->22/tcp   my-ubuntu-container
```

---

## 四、VSCode 配置 SSH

1. 打开 VSCode → 打开 Command Palette → 输入 `Remote-SSH: Open SSH Configuration File…`
   选择对应的配置文件（通常是 `~/.ssh/config`）

2. 添加以下配置：

```text
Host my-ubuntu-container
    HostName 127.0.0.1
    User root
    Port 2222
    StrictHostKeyChecking no
    UserKnownHostsFile /dev/null
```

* `Host my-ubuntu-container` → 给连接起个名字
* `HostName 127.0.0.1` → 访问本机
* `Port 2222` → 对应容器映射的端口
* `StrictHostKeyChecking no` + `UserKnownHostsFile /dev/null` → 第一次连接不提示

---

## 五、用 VSCode 连接

1. 打开 Command Palette → `Remote-SSH: Connect to Host…` → 选择 `my-ubuntu-container`
2. 输入 root 密码 `root123`
3. 连接成功后，VSCode 会在容器中安装服务器端组件
4. 现在可以像在本地开发一样操作容器了

---

## 六、常见问题与解决

| 问题                                         | 解决方法                                                                  |
| ------------------------------------------ | --------------------------------------------------------------------- |
| VSCode 提示 `Could not establish connection` | 检查容器是否运行，端口映射是否正确                                                     |
| 登录失败                                       | 检查 root 密码是否正确，SSH 是否允许 root 登录                                       |
| 第一次连接报 `host key verification failed`      | 确认 `StrictHostKeyChecking no` + `UserKnownHostsFile /dev/null` 是否配置正确 |
| 容器内 SSH 不启动                                | 容器 CMD 必须是 `["/usr/sbin/sshd","-D"]`，不能在后台启动                          |

---

## 七、可选优化

* 使用非 root 用户增加安全性：

```dockerfile
RUN useradd -ms /bin/bash devuser && echo "devuser:dev123" | chpasswd && adduser devuser sudo
```

* 然后 VSCode 配置 `User devuser`，避免使用 root。

* 每次启动容器可以用 `docker start -ai my-ubuntu-container` 来进入日志模式

---

如果你愿意，我可以再帮你加一个**一条命令就能直接启动容器 + VSCode 可连的版本**，省去手动 build/run 步骤。

你希望我做这个吗？
