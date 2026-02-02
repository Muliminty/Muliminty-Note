明白，你这个命令是 **直接启动一个 Ubuntu 20.04 的交互式容器**，而不是用 Dockerfile 构建好的带 SSH 的镜像。所以这里的流程和之前的不太一样。我们可以整理成一个完整步骤文档：

---

# 从 `docker run` 启动 Ubuntu 容器并配置 SSH + VSCode

---

## 一、启动容器

```bash
docker run -it --name my-ubuntu -p 2222:22 ubuntu:20.04 /bin/bash
```

参数说明：

* `-it` → 交互式终端
* `--name my-ubuntu` → 容器名字
* `-p 2222:22` → 映射宿主机 2222 端口到容器的 22 端口（SSH 默认端口）
* `ubuntu:20.04` → 镜像
* `/bin/bash` → 启动后进入容器终端

---

## 二、在容器内配置 SSH

1. **更新软件源并安装 SSH 服务**

```bash
apt-get update
apt-get install -y openssh-server sudo vim curl
```

2. **创建 SSH 目录**

```bash
mkdir /var/run/sshd
```

3. **设置 root 密码**

```bash
passwd
# 输入你希望的密码，例如 root123
```

4. **修改 SSH 配置允许 root 登录**

```bash
sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config
echo "PermitUserEnvironment yes" >> /etc/ssh/sshd_config
```

5. **启动 SSH 服务**

```bash
/usr/sbin/sshd
```

> ⚠️ 注意：这个方式启动 SSH，容器关闭后再次进入需要重复启动 SSH。

---

## 三、宿主机测试 SSH

在宿主机终端执行：

```bash
ssh root@127.0.0.1 -p 2222
```

* 密码：刚才设置的 root 密码
* 如果能成功登录，说明 SSH 配置正确

---

## 四、VSCode 配置 Remote-SSH

1. 打开 VSCode → Command Palette → `Remote-SSH: Open SSH Configuration File…`
2. 添加以下配置：

```text
Host my-ubuntu-container
    HostName 127.0.0.1
    User root
    Port 2222
    StrictHostKeyChecking no
    UserKnownHostsFile /dev/null
```

3. Command Palette → `Remote-SSH: Connect to Host…` → 选择 `my-ubuntu-container` → 输入密码 `root123`

VSCode 会在容器中安装 Remote-SSH 服务器组件，连接成功后可以直接开发。

---

## 五、优化（可选）

* **避免每次启动都手动安装 SSH** → 可以把当前容器提交成镜像：

```bash
docker commit my-ubuntu ubuntu-ssh
```

* 下次启动可以直接用：

```bash
docker run -d --name my-ubuntu2 -p 2222:22 ubuntu-ssh
```

* **使用非 root 用户** 提高安全性：

```bash
useradd -ms /bin/bash devuser && echo "devuser:dev123" | chpasswd && adduser devuser sudo
```

然后 VSCode 配置 `User devuser`。

---

如果你想，我可以帮你画一张**“docker run 启动容器 → 配置 SSH → VSCode 连接”的全流程图”**，让操作步骤一目了然。

你希望我画吗？
