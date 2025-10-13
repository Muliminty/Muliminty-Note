明白了，你希望得到 **详细到每个 Nginx 配置文件路径和目录结构** 的完整方案，我帮你整理一个可直接参考的落地方案，适用于 **腾讯云轻量服务器 + 一个域名 + 多项目部署**。我会分步骤详细说明，包括目录结构、文件路径、静态项目和 Node.js 项目处理方式。

---

## 一、服务器与域名准备

1. **腾讯云轻量应用服务器**
    
    - 推荐系统：Ubuntu 20.04 或 CentOS 7/8
        
    - 配置建议：2 核 4G
        
    - 开放端口：22（SSH）、80（HTTP）、443（HTTPS）
        
2. **域名**：`muliminty.site`
    
    - 购买后在 **腾讯云域名控制台 → DNS解析** 配置：
        

|主机记录|记录类型|记录值（服务器公网IP）|
|---|---|---|
|@|A|服务器公网IP|
|cv|A|服务器公网IP|
|note|A|服务器公网IP|

> 解析生效可能需要几分钟到几个小时。

---

## 二、服务器环境准备

### 1. 更新系统

```bash
# Ubuntu
apt update && apt upgrade -y
# CentOS
yum update -y
```

### 2. 安装 Nginx

```bash
# Ubuntu
apt install nginx -y
# CentOS
yum install epel-release -y
yum install nginx -y
```

### 3. 启动并设置开机自启

```bash
systemctl start nginx
systemctl enable nginx
```

### 4. 安装 Node.js（如果有 Node 项目）

推荐使用 nvm 安装：

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts
```

### 5. 安装 PM2（Node 项目进程管理）

```bash
npm install pm2 -g
```

---

## 三、项目目录结构建议

在服务器上创建统一项目目录：

```bash
mkdir -p /var/www/muliminty.site
mkdir -p /var/www/cv.muliminty.site
mkdir -p /var/www/note.muliminty.site
```

上传各自项目到对应目录。

> 目录说明：
> 
> - `/var/www/muliminty.site` → 主站
>     
> - `/var/www/cv.muliminty.site` → 个人简历
>     
> - `/var/www/note.muliminty.site` → 笔记系统
>     

---

## 四、Nginx 配置详细路径说明

### 1. Nginx 配置文件夹结构

|系统|主配置文件|虚拟主机配置文件夹|额外说明|
|---|---|---|---|
|Ubuntu|`/etc/nginx/nginx.conf`|`/etc/nginx/sites-available/` + `/etc/nginx/sites-enabled/`|使用 `sites-available` 管理所有站点，`sites-enabled` 通过软链接启用|
|CentOS|`/etc/nginx/nginx.conf`|`/etc/nginx/conf.d/`|每个站点单独 `*.conf` 文件即可，自动加载|

---

### 2. 配置示例

#### **Ubuntu 示例**

```bash
# 创建配置文件
nano /etc/nginx/sites-available/muliminty.conf
```

内容：

```nginx
# 主站 muliminty.site
server {
    listen 80;
    server_name muliminty.site;

    root /var/www/muliminty.site;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

# cv.muliminty.site
server {
    listen 80;
    server_name cv.muliminty.site;

    root /var/www/cv.muliminty.site;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

# note.muliminty.site
server {
    listen 80;
    server_name note.muliminty.site;

    root /var/www/note.muliminty.site;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

启用站点：

```bash
ln -s /etc/nginx/sites-available/muliminty.conf /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

#### **CentOS 示例**

```bash
# 创建配置文件
nano /etc/nginx/conf.d/muliminty.conf
```

内容同上即可，无需软链接，Nginx 会自动加载 `/etc/nginx/conf.d/*.conf`。

---

### 3. Node.js 项目反向代理示例

假设 `note` 项目是 Node.js 服务，运行在 3000 端口：

```nginx
server {
    listen 80;
    server_name note.muliminty.site;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

然后用 PM2 启动 Node 服务：

```bash
cd /var/www/note.muliminty.site
npm install
pm2 start index.js --name note
pm2 save
pm2 startup
```

---

## 五、申请 HTTPS（推荐）

使用 Let's Encrypt 免费证书：

```bash
# Ubuntu
apt install certbot python3-certbot-nginx -y

# 批量申请证书
certbot --nginx -d muliminty.site -d cv.muliminty.site -d note.muliminty.site
```

证书自动续期：

```bash
systemctl status certbot.timer
```

---

## 六、总结与扩展

1. **多项目部署核心**：
    
    - 每个项目独立目录：`/var/www/项目名`
        
    - 每个子域名独立 Nginx 配置文件
        
    - 静态项目直接 `root`，Node.js 项目使用 `proxy_pass`
        
2. **新增项目步骤**：
    
    1. 上传到 `/var/www/新项目名`
        
    2. 配置 DNS 子域名解析
        
    3. 创建 Nginx 配置文件 `/etc/nginx/sites-available/新项目.conf`（Ubuntu）或 `/etc/nginx/conf.d/新项目.conf`（CentOS）
        
    4. `nginx -t && systemctl reload nginx`
        
    5. （可选）申请 HTTPS
        

---

我可以帮你写一个 **一键部署脚本**，包括：

- 创建项目目录
    
- 上传或拉取项目
    
- 配置 Nginx
    
- 启动 Node 服务（PM2）
    
- 一键申请 HTTPS
    

这个脚本部署多个子域名项目只需要修改几个变量就行，非常省力。

你希望我直接写这个脚本吗？