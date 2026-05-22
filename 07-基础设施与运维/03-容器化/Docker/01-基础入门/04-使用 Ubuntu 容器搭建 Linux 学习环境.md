---
title: "使用 Ubuntu 容器搭建 Linux 学习环境"
date: "2026-05-21"
lastModified: "2026-05-21"
status: "草稿"
tags: ["Docker", "Linux", "基础入门", "环境搭建", "基础设施与运维"]
moc: "[[!MOC-Docker]]"
stage: "基础入门"
prerequisites: ["Docker 安装与环境配置", "Docker 核心概念", "Docker 基本命令"]
description: "使用 Docker 创建可反复重置的 Ubuntu 容器，搭建低风险的 Linux 学习环境，并给出分阶段学习路线与练习方法。"
aliases: ["Ubuntu 容器 Linux 学习环境", "Docker Linux 学习环境"]
toc: true
---

# 使用 Ubuntu 容器搭建 Linux 学习环境

> 目标不是单纯启动一个 Ubuntu 容器，而是搭一台可以长期练命令、权限、进程、网络与包管理的 Linux 学习机。

## 1. 场景说明

很多人学 Linux 时，一开始就在本机直接操作，容易担心把宿主机环境搞乱；或者上来就装虚拟机，前置成本又偏高。

对 Docker 初学者来说，更合适的路径是：

- 先用 Ubuntu 容器建立最小可用环境
- 把练习范围限制在容器内部
- 把“可随时删掉重来”当成默认恢复方案
- 先学用户态 Linux，再决定是否升级到虚拟机

这套方案尤其适合前端开发者补 Linux 基础，因为它覆盖了最常用的工程能力：

- 命令行操作
- 目录与文件管理
- 用户与权限
- 进程与网络排查
- 包管理与环境变量

## 2. 先理解边界：容器里乱折腾会不会影响宿主机

默认情况下，影响范围主要停留在容器内部。

安全前提是：

- 不挂载宿主机目录
- 不使用 `--privileged`
- 不映射 Docker socket
- 不挂载宿主机的系统目录或设备目录

在这个前提下，你在容器里做这些操作，通常都不会直接污染宿主机：

- `apt install`
- 新建和删除文件
- 创建用户
- 修改 shell 配置
- 把系统包和配置折腾坏

### 2.1 哪些操作默认安全

```bash
apt update
apt install -y vim curl tree htop
useradd -m alice
chmod 600 demo.txt
rm -rf /tmp/demo
```

这些改动只发生在容器自己的文件系统层。容器删掉后，改动也一起消失。

### 2.2 哪些操作会穿透到宿主机

下面这些做法不要在学习阶段使用：

```bash
# 挂载宿主机目录
-v "$PWD:/workspace"

# 提升为高权限容器
--privileged

# 挂载 Docker socket
-v /var/run/docker.sock:/var/run/docker.sock

# 挂载宿主机核心目录
-v /:/host
-v /dev:/dev
```

这些配置会把宿主机文件、设备或 Docker 控制权暴露给容器。容器内的破坏性操作可能直接影响宿主机。

## 3. 搭建目标

我们最终要得到的是一台具备以下特征的 Ubuntu 学习容器：

- 可反复进入
- 不依赖宿主机目录挂载
- 预装常用 Linux 学习工具
- 同时具备 root 和普通用户两种操作视角
- 具备清晰的实验目录结构
- 具备快速重建与快照保存能力

## 4. 前置条件

开始前先确认 Docker 已可用：

```bash
docker version
docker info
```

如果仍然报 `Cannot connect to the Docker daemon`，先回到安装阶段，确认 Docker Desktop、Colima 或 OrbStack 已经正常启动。

可参考：[Docker 安装与环境配置](./01-安装与环境配置.md)

## 5. 一步步搭建学习环境

### 5.1 拉取 Ubuntu 镜像

```bash
docker pull ubuntu:24.04
```

验证：

```bash
docker images
```

说明：

- `ubuntu:24.04` 是 LTS 版本，适合长期学习
- 学习场景优先选官方镜像，减少环境噪音

### 5.2 创建长期学习容器

```bash
docker run -it \
  --name ubuntu-lab \
  --hostname ubuntu-lab \
  ubuntu:24.04 \
  bash
```

参数说明：

- `-it`：使用交互式终端
- `--name ubuntu-lab`：固定容器名，后续方便启动与进入
- `--hostname ubuntu-lab`：让容器更像一台独立主机
- `bash`：启动后直接进入 shell

成功后你会看到类似提示符：

```bash
root@ubuntu-lab:/#
```

### 5.3 更新软件源

```bash
apt update
```

这一步只更新包索引，不会升级整台系统。它的目的是确保后续 `apt install` 能正常找到包。

### 5.4 安装学习工具

```bash
apt install -y \
  vim \
  nano \
  curl \
  wget \
  git \
  tree \
  htop \
  less \
  man-db \
  iproute2 \
  iputils-ping \
  net-tools \
  procps \
  sudo \
  tzdata \
  locales \
  file \
  zip \
  unzip
```

这些工具覆盖了学习主线：

- 文件查看与编辑：`vim`、`nano`、`less`、`tree`、`file`
- 网络排查：`curl`、`wget`、`iproute2`、`ping`、`net-tools`
- 进程观察：`htop`、`procps`
- 系统文档与权限：`man-db`、`sudo`
- 基础环境：`locales`、`tzdata`

### 5.5 配置 UTF-8 字符集

```bash
locale-gen en_US.UTF-8
update-locale LANG=en_US.UTF-8
export LANG=en_US.UTF-8
```

验证：

```bash
locale
```

这一步的价值是降低乱码、`sed` 与文本处理命令的字符集问题，尤其适合后面学习 `grep`、`sed`、日志分析等内容。

### 5.6 创建普通用户

不要一直用 root 学习。建议同时保留 root 与普通用户两种视角。

```bash
useradd -m -s /bin/bash student
passwd student
usermod -aG sudo student
su - student
```

为什么这样设计：

- 普通用户更接近真实工作环境
- `sudo` 能帮助你理解权限边界
- root 只在需要系统级操作时使用

### 5.7 创建练习目录

```bash
mkdir -p ~/lab/{files,users,process,network,shell,permissions}
tree ~/lab
```

推荐目录职责：

- `files`：文件与目录练习
- `users`：用户与权限实验
- `process`：进程、前后台任务、信号处理
- `network`：网络命令与连接练习
- `shell`：环境变量、重定向、管道、脚本
- `permissions`：chmod、chown、sudo 等实验

### 5.8 退出与重新进入容器

退出：

```bash
exit
```

查看容器：

```bash
docker ps -a
```

重新进入：

```bash
docker start -ai ubuntu-lab
```

另开一个终端进入：

```bash
docker exec -it ubuntu-lab bash
```

删除重来：

```bash
docker rm -f ubuntu-lab
```

## 6. 推荐保留一个基础快照

当容器环境装好后，可以保存一份自己的基础镜像：

```bash
docker commit ubuntu-lab ubuntu-lab-base:v1
```

后续基于这份镜像重新创建新环境：

```bash
docker run -it \
  --name ubuntu-lab-2 \
  --hostname ubuntu-lab-2 \
  ubuntu-lab-base:v1 \
  bash
```

这能避免每次都重新安装工具。

## 7. 两种容器使用模式

### 7.1 一次性沙箱

```bash
docker run -it --rm ubuntu:24.04 bash
```

适用：

- 临时试命令
- 做破坏性实验
- 退出后自动清理

### 7.2 长期学习机

```bash
docker run -it --name ubuntu-lab ubuntu:24.04 bash
```

适用：

- 连续学习
- 保留安装状态与实验文件
- 形成可复用学习环境

如果目标是系统学习 Linux，优先用“长期学习机”模式。

## 8. 适合在这个环境里学什么

### 8.1 第一阶段：文件系统与命令行

建议先掌握：

```bash
pwd
ls -lah
cd
mkdir
touch
cp
mv
rm
cat
less
head
tail
find
grep
tree
man
```

练习：

```bash
mkdir -p ~/lab/files/project/src
touch ~/lab/files/project/src/index.js
touch ~/lab/files/project/README.md
tree ~/lab/files
find ~/lab -name "*.js"
grep root /etc/passwd
```

### 8.2 第二阶段：用户与权限

建议掌握：

```bash
whoami
id
groups
chmod
chown
sudo
su
passwd
useradd
```

练习：

```bash
cd ~/lab/permissions
echo "hello" > demo.txt
ls -l demo.txt
chmod 600 demo.txt
ls -l demo.txt
chmod 644 demo.txt
ls -l demo.txt
```

### 8.3 第三阶段：进程与任务控制

建议掌握：

```bash
ps
top
htop
kill
jobs
bg
fg
sleep
```

练习：

```bash
sleep 300 &
jobs
ps -ef | grep sleep
kill %1
```

### 8.4 第四阶段：网络基础

建议掌握：

```bash
hostname
ip a
ip route
ss -lntp
ping
curl
wget
cat /etc/hosts
```

练习：

```bash
hostname
ip a
ip route
curl -I https://example.com
ss -lntp
```

### 8.5 第五阶段：包管理与环境变量

建议掌握：

```bash
apt
dpkg
which
whereis
env
printenv
export
```

练习：

```bash
sudo apt install -y jq
which jq
dpkg -L jq | head
sudo apt remove -y jq
export MY_NAME=linux-lab
echo $MY_NAME
```

### 8.6 第六阶段：文本处理与日志排查

建议掌握：

```bash
grep
sed
awk
sort
uniq
wc
xargs
tee
tail -f
```

练习：

```bash
touch ~/lab/shell/app.log
tail -f ~/lab/shell/app.log
```

另一个终端写入：

```bash
echo "INFO app started" >> ~/lab/shell/app.log
echo "ERROR db failed" >> ~/lab/shell/app.log
```

再结合过滤命令：

```bash
grep ERROR ~/lab/shell/app.log
```

## 9. 一个适合前端开发者的 4 周学习路线

### 第 1 周：命令行与文件系统

目标：

- 能熟练导航目录
- 能查看、复制、移动、删除文件
- 能用 `find` 和 `grep` 搜索文件与文本

### 第 2 周：权限、用户与包管理

目标：

- 理解 root、普通用户与 sudo 的边界
- 会使用 `chmod`、`chown`
- 会安装、查询、删除包

### 第 3 周：进程与网络

目标：

- 会看进程
- 会结束进程
- 会看端口与连接
- 会用 `curl` 验证服务状态

### 第 4 周：文本处理与排错

目标：

- 会追日志
- 会用 `grep` 过滤错误
- 会组合命令处理输出
- 能完成基础 Linux 排错

## 10. 学习方法建议

每学一个命令，都按下面这四步走：

1. 看帮助文档
2. 跑最小示例
3. 在真实文件或真实目录上再用一次
4. 记住它解决什么工程问题

示例：

```bash
man grep
echo "hello" | grep hell
grep root /etc/passwd
```

这样学的不是“命令背诵”，而是“命令解决问题的场景”。

## 11. Docker 学 Linux 的边界

Docker 适合学习的是用户态 Linux：

- shell
- 文件系统
- 用户与权限
- 进程与网络基础
- 包管理
- 文本处理
- 开发环境搭建

Docker 不适合完整模拟这些主题：

- systemd
- 开机启动
- 磁盘分区
- 内核模块
- 宿主机级网络与设备管理
- 复杂挂载与文件系统实验

如果后续学习目标升级到这些主题，应该转向虚拟机。

## 12. 最小起步命令清单

按顺序执行即可：

```bash
docker pull ubuntu:24.04

docker run -it \
  --name ubuntu-lab \
  --hostname ubuntu-lab \
  ubuntu:24.04 \
  bash

apt update
apt install -y \
  vim nano curl wget git tree htop less man-db \
  iproute2 iputils-ping net-tools procps sudo \
  tzdata locales file zip unzip

locale-gen en_US.UTF-8
update-locale LANG=en_US.UTF-8
export LANG=en_US.UTF-8

useradd -m -s /bin/bash student
passwd student
usermod -aG sudo student
su - student

mkdir -p ~/lab/{files,users,process,network,shell,permissions}
tree ~/lab
```

## 13. 第一批起步练习

进入 `student` 用户后，建议先完成这组练习：

```bash
whoami
pwd
ls -lah
mkdir -p ~/lab/files/demo
touch ~/lab/files/demo/a.txt
echo "hello linux" > ~/lab/files/demo/a.txt
cat ~/lab/files/demo/a.txt
cp ~/lab/files/demo/a.txt ~/lab/files/demo/b.txt
mv ~/lab/files/demo/b.txt ~/lab/files/demo/c.txt
ls -lah ~/lab/files/demo
grep hello ~/lab/files/demo/a.txt
find ~/lab -name "*.txt"
```

这组练习完成后，你就已经把“环境搭建”切换成“实际学习”。

## 14. 关联知识

- [Docker 安装与环境配置](./01-安装与环境配置.md)
- [Docker 核心概念](./02-核心概念.md)
- [Docker 基本命令](./03-基本命令.md)
- [容器基础操作](../03-容器管理/01-容器基础操作.md)
- [容器数据管理](../03-容器管理/02-容器数据管理.md)
