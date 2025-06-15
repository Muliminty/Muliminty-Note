厌倦了商业远程控制软件的会员限制和功能阉割？渴望拥有一个自由掌控、安全可靠的远程连接方案？开源软件 RustDesk 正是你需要的答案！

相信从事互联网工作的你，一定对向日葵和ToDesk等商业远程控制软件并不陌生。然而，受限于商业利益，它们往往对普通用户不太友好，比如限制免费用户的画质和帧率，以此引导用户开通会员。

今天，我们将向你介绍一款开源的远程桌面软件——RustDesk！它在 GitHub 上已收获 74.6k 的 Star，并且开发社区活跃，版本迭代迅速。

由于 RustDesk 的官方中转服务器位于国外，国内用户使用时可能会遇到连接速度慢、延迟高等问题。为了获得更流畅的体验，我们可以选择自建中转服务器。

接下来，我将给大家提供一个详细的自建 RustDesk 中转服务器教程，助你打造属于自己的高速、稳定、安全的远程连接通道！

### RustDesk 介绍

RustDesk 是一款开源、免费、高性能的远程桌面软件，它允许你通过互联网或局域网远程控制另一台计算机。RustDesk 使用 Rust 语言编写，注重安全性、速度和易用性，提供流畅、可靠的远程桌面体验。

与 TeamViewer 或 AnyDesk 等商业软件不同，RustDesk 不依赖中心化的服务器，而是采用端到端加密技术，直接连接你的设备，确保你的隐私安全。你也可以选择自建中继服务器，进一步提升连接速度和稳定性，并完全掌控你的数据。

#### RustDesk 的主要特点

- **开源免费**: RustDesk 代码完全开源，可以免费使用，没有任何功能限制或隐藏收费。
- **跨平台支持**: 支持 Windows、macOS、Linux、iOS、Android 等多个平台，实现跨设备远程控制。
- **高性能和低延迟**: 采用高效的编码和传输协议，提供流畅的屏幕传输和低延迟的操作体验。
- **安全性高**: 使用端到端加密技术，保护你的连接和数据安全，防止信息泄露。
- **易于使用**: 界面简洁直观，操作简单易懂，即使是新手也能轻松上手。
- **自建中继服务器**: 可以自行搭建中继服务器，实现更快的连接速度和更高的稳定性。

#### RustDesk 架构

**RustDesk 采用了经典的客户端-服务器模型，其中涉及三个主要组件：RustDesk 客户端、RustDesk 服务器和 ID Server。**

- **RustDesk 客户端**: 运行在你的设备上（Windows，macOS，Linux，Android， iPhone）用于连接两个设备的软件。
- **RustDesk 中继服务器（Relay Server）**: 运行在服务器上，充当客户端之间的桥梁，转发来自一方的数据包到另一方。在某些环境中（如经过 NAT 出网）设备之间无法进行 P2P 连接，可以用服务器来中转。
- **ID 服务器（ID Server）**: 运行在服务器上，用于维护客户端及中继服务器的连接信息，促进设备之间建立 P2P 连接。

![RustDesk架构图](https://img-blog.csdnimg.cn/a4fd23b55cb8429397540ea7e5c2c6f4.png)

**在 RustDesk 的服务器端部署中，hbbr 和 hbbs 是两个重要的组件，分别用于不同的功能：**

- **hbbs**: 代表 RustDesk ID / Rendezvous Server，RustDesk ID 注册服务器，用于分配和注册 ID；hbbs 是 RustDesk 的中介服务器（Broker Server），用于管理和协调客户端连接。它帮助客户端找到并建立 P2P 连接。hbbs 负责维护客户端的在线状态，并处理连接请求。当客户端 A 希望连接客户端 B 时，它会向 hbbs 发送请求，hbbs 会帮助它们建立连接。
- **hbbr**: 代表 RustDesk Relay Server，RustDesk 中继服务器，如果 P2P 无法连接，会使用 hbbr 进行流量中继。hbbr 是 RustDesk 的中继服务器（Relay Server），用于在两台客户端之间进行连接中继。它允许无法直接建立 P2P 连接的客户端通过中继服务器进行通信。当客户端 A 和客户端 B 之间无法建立直接连接时，它们会通过 hbbr 中继服务器进行数据传输。
- **rustdesk-utils**: RustDesk 命令行工具

**P2P 直连说明：**

RustDesk 首先尝试建立直接 P2P 连接，如果 P2P 失败，将使用中继服务器。

确认连接方式，首先连接到远程主机，可以将鼠标移动到工具栏图标（绿色图标），将显示它是直接连接还是通过中继服务器连接。

**使用端口说明：**

|序号|服务|端口|协议|用途|是否可选|
|---|---|---|---|---|---|
|1|hbbs|21114|TCP|用于 Web 控制台 API，仅在专业版中可用|可选|
|2|hbbs|21115|TCP|NAT 类型测试|必选|
|3|hbbs|21116|TCP/UDP|UDP 用于 ID 注册和心跳服务，TCP 用于 TCP 打洞和连接服务|必选|
|4|hbbr|21117|TCP|用于 Relay 服务|必选|
|5|hbbs|21118|TCP|用于支持 Web 客户端|可选|
|6|hbbr|21119|TCP|用于支持 Web 客户端|可选|

一般我们使用这些端口就好了:

- TCP: 21115,21116,21117,21118,21119
- UDP: 21116

### 准备工作

- 准备一台云服务器

若尚未拥有服务器，可前往 [雨云官网 https://rainyun.ivwv.site](https://rainyun.ivwv.site/) 进行注册，新用户有专属优惠。

### 开始部署中转服务器

[rustdesk-server 官方仓库地址: https://github.com/rustdesk/rustdesk-server](https://github.com/rustdesk/rustdesk-server)

#### 部署方式

RustDesk 提供了多种部署方式，您可以根据自己的需求和技术水平选择合适的方式，主要有以下三种方式：

1. **使用 Docker / Docker Compose 部署（推荐，选其一）：** 这是最简单、最快速的部署方式，适合大多数用户。您只需要运行几条 Docker 命令，即可完成 RustDesk 中转服务器的安装和配置。
    
2. **使用 PM2 部署：** PM2 是一个 Node.js 进程管理工具，可以帮助您方便地管理和维护 RustDesk 服务器进程。
    
3. **使用二进制文件运行：** 下载预编译的二进制文件，解压后即可运行，无需编译安装，适合快速部署和测试。
    

我会依次向大家介绍如何部署。

**前提要求(重要)**

在进行部署之前，请确保您的服务器满足以下前提要求：

- 一台拥有公网 IP 的 Linux 服务器，例如腾讯云、阿里云等。
- 服务器已开启必要的端口：
    - TCP: 21115, 21116, 21117, 21118, 21119
    - UDP: 21116

你可以通过服务器管理面板的安全组或防火墙配置中放行这些端口。

#### 使用 Docker 部署(推荐)

**1. 安装 Docker**  
如果您的服务器上还没有安装 Docker，请使用以下命令安装：

```
# 使用清华源，如果是国外云服务器可以不运行这一步
export DOWNLOAD_URL="https://mirrors.tuna.tsinghua.edu.cn/docker-ce"
# 安装命令
curl -fsSL https://get.docker.com/ | sh
```

检查是否安装完毕,如果有正确输出版本 ，那么就代表安装成功了。

```
root@ubuntu:~# docker -v
Docker version 27.1.1, build 6312585
```

**运行命令**

```
mkdir -p ~/rustdesk
cd ~/rustdesk
sudo docker image pull rustdesk/rustdesk-server
sudo docker run --name hbbs -p 21115:21115 -p 21116:21116 -p 21116:21116/udp -p 21118:21118 -v ./data:/root -td --net=host rustdesk/rustdesk-server hbbs
sudo docker run --name hbbr -p 21117:21117 -p 21119:21119 -v ./data:/root -td --net=host rustdesk/rustdesk-server hbbr
```

**注意**

如果你运行 docker 版本时候，要求注册码，说明你下载的是老版本，因为国内的 docker 镜像缓存可能没有更新

**检查是否正常运行**

控制台输入 `docker ps -a`,查看`STATUS` 状态是否是 `Up`

```
root@ubuntu:~/rustdesk# docker ps -a
CONTAINER ID   IMAGE                      COMMAND   CREATED          STATUS          PORTS     NAMES
97e8dfc8939e   rustdesk/rustdesk-server   "hbbr"    44 seconds ago   Up 43 seconds             hbbr
64e629c8a41d   rustdesk/rustdesk-server   "hbbs"    49 seconds ago   Up 48 seconds             hbbs
```

运行好后，可以在当前目录下列出文件,输入`ls -l data`

```
root@ubuntu:~/rustdesk# ls -l data
total 132
-rw-r--r-- 1 root root  4096 Oct 26 15:25 db_v2.sqlite3
-rw-r--r-- 1 root root 32768 Oct 26 15:25 db_v2.sqlite3-shm
-rw-r--r-- 1 root root 82432 Oct 26 15:25 db_v2.sqlite3-wal
-rw-r--r-- 1 root root    88 Oct 26 15:25 id_ed25519
-rw-r--r-- 1 root root    44 Oct 26 15:25 id_ed25519.pub
```

可以看到有5个文件，其中 `id_ed25519.pub` 文件内容接下来会使用到。

**也可以尝试使用Docker Compose 部署(可选)**

```
mkdir -p ~/rustdesk
cd ~/rustdesk
vim docker-compose.yaml
```

将以下内容复制粘贴进去

```

networks:
  rustdesk-net:
    external: false

services:
  hbbs:
    container_name: hbbs
    ports:
      - 21115:21115
      - 21116:21116
      - 21116:21116/udp
    image: rustdesk/rustdesk-server
    command: hbbs
    volumes:
      - ./data:/root # 自定义挂载目录
    networks:
      - rustdesk-net
    depends_on:
      - hbbr
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 64M

  hbbr:
    container_name: hbbr
    ports:
      - 21117:21117
    image: rustdesk/rustdesk-server
    command: hbbr
    volumes:
      - ./data:/root # 自定义挂载目录
    networks:
      - rustdesk-net
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 64M

```

运行 `Docker compose`

```
docker compose up -d
```

同样控制台输入 `docker ps -a`,查看`STATUS` 状态是否是 `Up`

```
root@ubuntu:~/rustdesk# docker ps -a
CONTAINER ID   IMAGE                      COMMAND   CREATED          STATUS          PORTS     NAMES
97e8dfc8939e   rustdesk/rustdesk-server   "hbbr"    44 seconds ago   Up 43 seconds             hbbr
64e629c8a41d   rustdesk/rustdesk-server   "hbbs"    49 seconds ago   Up 48 seconds             hbbs
```

运行好后，也可以在当前目录下列出文件,输入`ls -l data`

```
root@ubuntu:~/rustdesk# ls -l data
total 132
-rw-r--r-- 1 root root  4096 Oct 26 15:25 db_v2.sqlite3
-rw-r--r-- 1 root root 32768 Oct 26 15:25 db_v2.sqlite3-shm
-rw-r--r-- 1 root root 82432 Oct 26 15:25 db_v2.sqlite3-wal
-rw-r--r-- 1 root root    88 Oct 26 15:25 id_ed25519
-rw-r--r-- 1 root root    44 Oct 26 15:25 id_ed25519.pub
```

可以看到有5个文件，其中 `id_ed25519.pub` 文件内容接下来会使用到。

到此位置，使用 Docker 的两种方式都已经介绍完毕，客户端的使用可以直接到下一个标题: **客户端使用** 查看，接下来我会介绍**使用 PM2 部署**。

#### 使用 PM2 部署(推荐)

首先，是需要一个 NodeJS 的环境

**安装 NodeJS 和 NPM**

```
# 更新软件包列表
sudo apt update

# 安装 Node.js 和 npm
sudo apt install nodejs npm -y

# 验证安装是否成功
node -v
npm -v
```

安装 PM2

```
npm i -g pm2
# 验证安装是否成功
pm2 -v
```

**下载 `rustdesk-server`二进制文件**

进入 [Github - rustdesk-server - releases](https://github.com/rustdesk/rustdesk-server/releases)

![Github-rustdesk-server-releases](https://img-blog.csdnimg.cn/7f3985370bd440969799afe4d196695a.png)

找到自己服务器匹配的架构,一般市面上的云服务器都是amd64架构的，跟我一样的命令即可

```
sudo apt update
sudo apt install curl unzip -y
mkdir -p ~/rustdesk
cd ~/rustdesk
curl -L "https://github.com/rustdesk/rustdesk-server/releases/download/1.1.12/rustdesk-server-linux-amd64.zip" -o "rustdesk-server-linux-amd64.zip"
unzip rustdesk-server-linux-amd64.zip
cd amd64
ls -l
```

运行完毕后且无误后，会在终端列出三个二进制可执行文件,分别是:

- hddr
- hbbs
- rustdesk-utils

接下来运行下列命令

```
pm2 start hbbs
pm2 start hbbr
```

运行好后，会看到 pm2 输出的列表(也可以后续使用 `pm2 list`)

|id|name|namespace|version|mode|pid|uptime|↺|status|cpu|mem|user|watching|
|---|---|---|---|---|---|---|---|---|---|---|---|---|
|1|hbbr|default|N/A|fork|329446|0s|0|online|0%|696.0kb|root|disabled|
|0|hbbs|default|N/A|fork|329432|7s|0|online|0%|4.4mb|root|disabled|

当看到 `status` 都是 `online` 时就表示启动成功。 这里可以看到 `cpu` 和 `mem`，其实运行这两个程序并不会使用太多的内存和 `cpu` 接下来查看运行后，会在当前目录下创建什么文件

```
root@ubuntu:~/rustdesk/amd64# ls -l
total 27688
-rw-r--r-- 1 root root     4096 Oct 26 16:13 db_v2.sqlite3
-rw-r--r-- 1 root root    32768 Oct 26 16:13 db_v2.sqlite3-shm
-rw-r--r-- 1 root root    82432 Oct 26 16:13 db_v2.sqlite3-wal
-rwxr-xr-x 1 root root  9194392 Oct  7 16:37 hbbr
-rwxr-xr-x 1 root root 14290448 Oct  7 16:37 hbbs
-rw-r--r-- 1 root root       88 Oct 26 16:13 id_ed25519
-rw-r--r-- 1 root root       44 Oct 26 16:13 id_ed25519.pub
-rwxr-xr-x 1 root root  4734920 Oct  7 16:37 rustdesk-utils
```

可以看到，增加了5个文件，其中 `id_ed25519.pub` 后续客户端使用的时候会用到。  
到此位置，使用 `pm2` 的方式已经介绍完毕，客户端的使用可以直接到下一个标题: **客户端使用** 查看，接下来我会介绍使用 **使用二进制文件运行** 部署。

#### 使用二进制文件运行(不推荐)

这种方式为什么不推荐呢，稍后会提到。  
**与pm2方式一样，需要下载 `rustdesk-server`二进制文件**

进入 [Github - rustdesk-server - releases](https://github.com/rustdesk/rustdesk-server/releases)

![Github-rustdesk-server-releases](https://img-blog.csdnimg.cn/7f3985370bd440969799afe4d196695a.png)

找到自己服务器匹配的架构,一般市面上的云服务器都是amd64架构的，跟我一样的命令即可

```
sudo apt update
sudo apt install curl unzip -y
mkdir -p ~/rustdesk
cd ~/rustdesk
curl -L "https://github.com/rustdesk/rustdesk-server/releases/download/1.1.12/rustdesk-server-linux-amd64.zip" -o "rustdesk-server-linux-amd64.zip"
unzip rustdesk-server-linux-amd64.zip
cd amd64
ls -l
```

这里与 pm2 方式一样，也会输出同样的文件  
但是运行方式不一样，由于时二进制文件，我们可以直接运行 `hbbs` 和 `hbbr` 文件  
运行:

```
root@ubuntu:~/rustdesk/amd64# ./hbbs
[2024-10-26 16:47:14.908679 +08:00] INFO [src/common.rs:122] Private key comes from id_ed25519
[2024-10-26 16:47:14.908702 +08:00] INFO [src/rendezvous_server.rs:1205] Key: Ia42DxVS6hZ07cybqftPxAKXvszpbuj77aM=
[2024-10-26 16:47:14.908705 +08:00] INFO [src/peer.rs:84] DB_URL=./db_v2.sqlite3
[2024-10-26 16:47:14.909695 +08:00] INFO [src/rendezvous_server.rs:99] serial=0
[2024-10-26 16:47:14.909726 +08:00] INFO [src/common.rs:46] rendezvous-servers=[]
[2024-10-26 16:47:14.909730 +08:00] INFO [src/rendezvous_server.rs:101] Listening on tcp/udp :21116
[2024-10-26 16:47:14.909732 +08:00] INFO [src/rendezvous_server.rs:102] Listening on tcp :21115, extra port for NAT test
[2024-10-26 16:47:14.909734 +08:00] INFO [src/rendezvous_server.rs:103] Listening on websocket :21118
[2024-10-26 16:47:14.909762 +08:00] INFO [libs/hbb_common/src/udp.rs:36] Receive buf size of udp [::]:21116: Ok(212992)
[2024-10-26 16:47:14.909809 +08:00] INFO [src/rendezvous_server.rs:138] mask: None
[2024-10-26 16:47:14.909817 +08:00] INFO [src/rendezvous_server.rs:139] local-ip: ""
[2024-10-26 16:47:14.909822 +08:00] INFO [src/common.rs:46] relay-servers=[]
[2024-10-26 16:47:14.909870 +08:00] INFO [src/rendezvous_server.rs:153] ALWAYS_USE_RELAY=N
[2024-10-26 16:47:14.909898 +08:00] INFO [src/rendezvous_server.rs:185] Start
[2024-10-26 16:47:14.909929 +08:00] INFO [libs/hbb_common/src/udp.rs:36] Receive buf size of udp [::]:0: Ok(212992)
```

运行后发现，需要一直保持终端不断开，所以这种方式并不推荐，因为这种方式需要同时打开两个终端 ，一个终端运行 `hbbr` 另一个终端运行 `hbbs` 当终端结束后，服务也就停止了。

### 客户端使用

我们进入 [rustdesk官网:https://rustdesk.com/zh-cn/](https://rustdesk.com/zh-cn/) 或者进入 [Github-releases](https://github.com/rustdesk/rustdesk/releases/tag/1.3.1)

由于rustdesk支持多个平台的客户端。

可以直接从这个表格点击下载。

|||||||||
|---|---|---|---|---|---|---|---|
|Architecture|Windows|Ubuntu|Mac|Android|Flatpak|AppImage|iOS|
|x86-64 (64-bit)|[EXE](https://github.com/rustdesk/rustdesk/releases/download/1.3.1/rustdesk-1.3.1-x86_64.exe) [MSI](https://github.com/rustdesk/rustdesk/releases/download/1.3.1/rustdesk-1.3.1-x86_64.msi)|[Download](https://github.com/rustdesk/rustdesk/releases/download/1.3.1/rustdesk-1.3.1-x86_64.deb)|[Download](https://github.com/rustdesk/rustdesk/releases/download/1.3.1/rustdesk-1.3.1-x86_64.dmg)|[Universal](https://github.com/rustdesk/rustdesk/releases/download/1.3.1/rustdesk-1.3.1-universal-signed.apk)|[Download](https://github.com/rustdesk/rustdesk/releases/download/1.3.1/rustdesk-1.3.1-x86_64.flatpak)|[Download](https://github.com/rustdesk/rustdesk/releases/download/1.3.1/rustdesk-1.3.1-x86_64.AppImage)||
|AArch64 (ARM64)||[Download](https://github.com/rustdesk/rustdesk/releases/download/1.3.1/rustdesk-1.3.1-aarch64.deb)|[Download](https://github.com/rustdesk/rustdesk/releases/download/1.3.1/rustdesk-1.3.1-aarch64.dmg)|[Download](https://github.com/rustdesk/rustdesk/releases/download/1.3.1/rustdesk-1.3.1-aarch64-signed.apk)|[Download](https://github.com/rustdesk/rustdesk/releases/download/1.3.1/rustdesk-1.3.1-aarch64.flatpak)|[Download](https://github.com/rustdesk/rustdesk/releases/download/1.3.1/rustdesk-1.3.1-aarch64.AppImage)|[TestFlight](https://testflight.apple.com/join/KBG9EsZW)|
|ARMv7 (32-bit)||[Download](https://github.com/rustdesk/rustdesk/releases/download/1.3.1/rustdesk-1.3.1-armv7-sciter.deb)||[Download](https://github.com/rustdesk/rustdesk/releases/download/1.3.1/rustdesk-1.3.1-armv7-signed.apk)||||
|x86-32 (32-bit)|[Download](https://github.com/rustdesk/rustdesk/releases/download/1.3.1/rustdesk-1.3.1-x86-sciter.exe)|||||||

我这里以Windows为例，我的下载链接是: [x86-64 (64-bit)](https://github.com/rustdesk/rustdesk/releases/download/1.3.1/rustdesk-1.3.1-x86_64.exe)。

下载完毕后，直接打开双击，同时在你的被控制端也需要下载安装

安装好打开界面如下:

![rustdesk安装后打开界面](https://img-blog.csdnimg.cn/df4f1f7626e64fac9417f17ce845e655.png)

可以看到底部 **服务未运行 启动服务**

#### 设置中继服务器

点击窗口右上角 **三横线** 或 左侧 ID 旁边的 **三个点** 进入设置页面。

再依次点击: **网络** -> **解锁网络设置**

![找到设置中级服务器位置](https://img-blog.csdnimg.cn/5f1b999931464e189438b5ce093fc852.png)

以下是四个输入框的配置说明，具体配置可能会有所不同，取决于你的最初的设置，如果你使用docker方式时，更改了外部映射的端口，可以根据如下默认端口，填写对应的外部端口。

**ID 服务器（hbbs）**：

- 默认端口：**21116**

**中继服务器（hbbr）**：

- 默认端口：**21117**

**API 服务器**：

- 默认端口：**21118**

**Key**：

- 上面提到的 `id_ed25519.pub` 文件的内容
- 使用 `cat id_ed25519.pub` 命令查看 Key

```
# 具体根据你该文件的目录来
cd ~/rustdesk/data/
cat id_ed25519.pub

# 我的输出
Ia42DxVS6hZ07cybqftPxAKXvszpbuj77aM=
```

如果是默认rustdesk官方推荐的端口，那么只需要填写你的服务器 IP 到 ID 服务器 输入框即可,如图:

![默认方式输入ID中继服务器](https://img-blog.csdnimg.cn/0e3e4e13fdda4614a1799d93a9d8ee18.png)

如果使用docker方式有更改端口，可以按照如下默认端口，找到自己映射的外部端口

![自定义端口模板](https://img-blog.csdnimg.cn/d57ca3110a3b4c4c999d537db28139b1.png)

最后点击**应用**即可。

特别需要注意的是，你需要在每一个客户端都这样设置好中继服务器。

#### 启动服务

进入 **设置** -> **常规**

![启动客户端服务](https://img-blog.csdnimg.cn/d49d46181c3b42c1b98974454b4b9b27.png)

返回主页查看底部状态，如果是绿色圆圈，并且是 就绪两字，就表示成功了 。

![查看是否启动成功](https://img-blog.csdnimg.cn/c953990be40a42abbbd80c4c0e4b0944.png)

#### 被控端

被控端也同样设置好后，就可以看到 ID 和 密码了，将其给到控制端输入就可以了，跟向日葵和Todesk一样的操作

![被控端](https://img-blog.csdnimg.cn/528e53cf3f0f41cf98e92a147955adc6.png)

#### 控制端功能

成功远程后，控制端可以有这些功能操作。

![控制端功能](https://img-blog.csdnimg.cn/42d09ed77db149b7ab254865bc2e1e0e.png)

> 相关链接

[我的博客：https://blog.ivwv.site](https://blog.ivwv.site/)  
雨云官网：[https://rainyun.ivwv.site](https://rainyun.ivwv.site/)