# Nginx 学习笔记

## 目录

1. [Nginx 标准目录结构](#nginx-标准目录结构)
2. [配置文件基础](#配置文件基础)
3. [单项目配置](#单项目配置)
4. [多项目配置方式](#多项目配置方式)
5. [配置优化](#配置优化)
6. [常用命令](#常用命令)
7. [最佳实践](#最佳实践)

---

## Nginx 标准目录结构

### 标准目录规范

```
/etc/nginx/                    # Nginx 配置主目录
├── nginx.conf                 # 主配置文件
├── sites-available/           # 可用的站点配置模板（不会自动生效）
│   ├── default               # 默认配置模板
│   └── [项目名]              # 其他项目配置
├── sites-enabled/             # 启用的站点配置（软链接，会生效）
│   └── default -> ../sites-available/default
├── conf.d/                    # 额外的配置文件
├── snippets/                 # 可复用的配置片段
├── mime.types                 # MIME 类型定义
└── [其他标准文件]

/var/www/html/                 # 标准网站根目录（推荐）
或
/usr/share/nginx/html/         # 备选网站根目录
```

### 重要说明

- **sites-available/**：配置模板库，不会自动生效，可以存放多个配置
- **sites-enabled/**：启用的配置（通过软链接），只有这里的配置才会被加载
- **不会冲突**：`sites-available/` 中的配置不会冲突，只有启用的才会生效

---

## 配置文件基础

### 主配置文件 (nginx.conf)

```nginx
user www-data;
worker_processes auto;
pid /run/nginx.pid;

events {
    worker_connections 768;
}

http {
    sendfile on;
    tcp_nopush on;
    types_hash_max_size 2048;

    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    gzip on;

    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
```

### 基本站点配置结构

```nginx
server {
    listen 80;                    # 监听端口
    listen [::]:80;              # IPv6 端口
    server_name _;                # 服务器名称（_ 表示匹配所有）
    
    root /var/www/html/project;   # 网站根目录
    index index.html;             # 默认首页
    
    location / {
        try_files $uri $uri/ =404;  # 尝试文件，目录，否则404
    }
}
```

---

## 单项目配置

### 最简单的配置

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    root /var/www/html/muliminty;
    index index.html;
    
    server_name _;
    
    location / {
        try_files $uri $uri/ =404;
    }
}
```

### 配置步骤

1. 创建网站目录：`mkdir -p /var/www/html/project`
2. 创建配置文件：`/etc/nginx/sites-available/project`
3. 创建软链接启用：`ln -s /etc/nginx/sites-available/project /etc/nginx/sites-enabled/project`
4. 验证配置：`nginx -t`
5. 重载配置：`systemctl reload nginx`

---

## 多项目配置方式

### 方式1：通过域名区分（推荐，需要域名）

每个项目使用不同的域名：

```nginx
# /etc/nginx/sites-available/project1
server {
    listen 80;
    server_name project1.example.com www.project1.example.com;
    root /var/www/project1;
    index index.html;
    location / {
        try_files $uri $uri/ =404;
    }
}

# /etc/nginx/sites-available/project2
server {
    listen 80;
    server_name project2.example.com www.project2.example.com;
    root /var/www/project2;
    index index.html;
    location / {
        try_files $uri $uri/ =404;
    }
}
```

**访问方式：**
- 项目1: `http://project1.example.com`
- 项目2: `http://project2.example.com`

### 方式2：通过端口区分

不同项目使用不同端口：

```nginx
# 项目1 - 80端口
server {
    listen 80;
    server_name _;
    root /var/www/project1;
    ...
}

# 项目2 - 8080端口
server {
    listen 8080;
    server_name _;
    root /var/www/project2;
    ...
}
```

**访问方式：**
- 项目1: `http://IP:80`
- 项目2: `http://IP:8080`

**缺点：** 需要开放多个端口，防火墙配置复杂

### 方式3：通过路径区分（推荐，无域名时使用）

所有项目在同一端口，通过路径区分：

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    server_name _;
    
    # 项目1
    location /project1 {
        alias /var/www/project1;
        index index.html;
        try_files $uri $uri/ /project1/index.html;
    }
    
    # 项目2
    location /project2 {
        alias /var/www/project2;
        index index.html;
        try_files $uri $uri/ /project2/index.html;
    }
    
    # 项目3
    location /project3 {
        alias /var/www/project3;
        index index.html;
        try_files $uri $uri/ /project3/index.html;
    }
    
    # 默认根路径（可选）
    location / {
        root /var/www/html;
        index index.html;
        try_files $uri $uri/ =404;
    }
}
```

**访问方式：**
- 项目1: `http://IP/project1`
- 项目2: `http://IP/project2`
- 项目3: `http://IP/project3`

**优点：**
- 只需要 80 端口
- 配置集中，便于管理
- 不需要修改防火墙规则

**注意：** 使用 `alias` 时，`try_files` 的路径需要包含 location 前缀

---

## 配置优化

### 基础优化配置

```nginx
http {
    # 基本设置
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;  # 隐藏服务器版本

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript;

    # 文件缓存
    open_file_cache max=10000 inactive=20s;
    open_file_cache_valid 30s;
    open_file_cache_min_uses 2;
}
```

### 安全响应头（可选）

创建 `/etc/nginx/snippets/security-headers.conf`:

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

在站点配置中使用：
```nginx
include snippets/security-headers.conf;
```

---

## 常用命令

### 配置管理

```bash
# 验证配置文件语法
nginx -t

# 查看完整配置（包括所有 include）
nginx -T

# 重载配置（不中断服务）
systemctl reload nginx
# 或
nginx -s reload

# 重启服务
systemctl restart nginx

# 查看配置状态
systemctl status nginx
```

### 启用/禁用站点

```bash
# 启用站点（创建软链接）
ln -s /etc/nginx/sites-available/project /etc/nginx/sites-enabled/project

# 禁用站点（删除软链接）
rm /etc/nginx/sites-enabled/project

# 重载配置使更改生效
nginx -t && systemctl reload nginx
```

### 文件权限

```bash
# 设置网站目录权限
chown -R www-data:www-data /var/www/project

# 设置目录权限
chmod -R 755 /var/www/project
```

### 日志查看

```bash
# 查看访问日志
tail -f /var/log/nginx/access.log

# 查看错误日志
tail -f /var/log/nginx/error.log

# 查看最近的错误
grep error /var/log/nginx/error.log | tail -20
```

---

## 最佳实践

### 1. 目录结构规范

- ✅ 网站文件放在 `/var/www/项目名/`
- ✅ 配置文件放在 `/etc/nginx/sites-available/`
- ✅ 通过软链接在 `sites-enabled/` 中启用
- ❌ 不要直接在 `sites-enabled/` 中创建文件

### 2. 配置文件命名

- 使用项目名称作为配置文件名
- 保持简洁明了：`project1`, `project2` 等

### 3. 多项目配置选择

- **有域名**：使用方式1（域名区分）- 最推荐
- **无域名**：使用方式3（路径区分）- 推荐
- **特殊需求**：使用方式2（端口区分）

### 4. 配置管理

- 保持 `sites-available/` 整洁，删除不需要的示例配置
- 定期备份重要配置
- 修改配置前先验证：`nginx -t`

### 5. 安全建议

- 隐藏服务器版本：`server_tokens off;`
- 添加安全响应头
- 限制文件上传大小：`client_max_body_size 20M;`
- 禁止访问隐藏文件：`location ~ /\. { deny all; }`

### 6. 性能优化

- 启用 gzip 压缩
- 配置静态文件缓存
- 使用 `sendfile` 提升性能
- 合理设置 `worker_connections`

---

## 常见问题

### Q: sites-available 中的多个配置会冲突吗？

**A:** 不会。`sites-available/` 只是配置模板库，不会自动生效。只有 `sites-enabled/` 中的配置才会被加载。

### Q: 如何知道哪些配置已启用？

**A:** 查看 `sites-enabled/` 目录：
```bash
ls -la /etc/nginx/sites-enabled/
```

### Q: 修改配置后如何生效？

**A:** 
1. 验证配置：`nginx -t`
2. 重载配置：`systemctl reload nginx`

### Q: 路径区分时，项目中的资源路径不对怎么办？

**A:** 确保项目中的资源使用相对路径，或者配置 `base` 路径。例如：
- HTML: `<link rel="stylesheet" href="./style.css">`
- 或配置 base: `<base href="/project1/">`

### Q: 如何添加新项目？

**A:**
1. 创建项目目录：`mkdir -p /var/www/newproject`
2. 创建配置文件：`/etc/nginx/sites-available/newproject`
3. 启用配置：`ln -s /etc/nginx/sites-available/newproject /etc/nginx/sites-enabled/newproject`
4. 验证并重载：`nginx -t && systemctl reload nginx`

---

## 实际案例

### 当前配置示例

**配置文件：** `/etc/nginx/sites-available/multi-projects-by-path`

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    server_name _;
    
    # 项目1 - muliminty
    location /muliminty {
        alias /var/www/muliminty;
        index index.html;
        try_files $uri $uri/ /muliminty/index.html;
    }
    
    # 项目2
    location /project2 {
        alias /var/www/project2;
        index index.html;
        try_files $uri $uri/ /project2/index.html;
    }
    
    # 项目3
    location /project3 {
        alias /var/www/project3;
        index index.html;
        try_files $uri $uri/ /project3/index.html;
    }
    
    # 默认根路径
    location / {
        root /var/www/html;
        index index.html;
        try_files $uri $uri/ =404;
    }
}
```

**访问地址：**
- 项目1: `http://114.132.244.217/muliminty`
- 项目2: `http://114.132.244.217/project2`
- 项目3: `http://114.132.244.217/project3`

---

## 总结

1. **标准目录结构**：遵循 `/etc/nginx/` 和 `/var/www/` 的标准规范
2. **配置管理**：使用 `sites-available/` 和 `sites-enabled/` 的软链接方式
3. **多项目配置**：根据是否有域名选择合适的方式
4. **配置验证**：修改后务必先验证再重载
5. **保持整洁**：定期清理不需要的配置文件

---

*最后更新：2025-12-12*
