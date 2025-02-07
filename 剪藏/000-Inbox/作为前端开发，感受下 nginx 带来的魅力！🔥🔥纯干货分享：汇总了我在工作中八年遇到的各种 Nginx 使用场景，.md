[作为前端开发，感受下 nginx 带来的魅力！🔥🔥纯干货分享：汇总了我在工作中八年遇到的各种 Nginx 使用场景， - 掘金](https://juejin.cn/post/7368433531926052874)

这篇文章是关于前端开发中 Nginx 的介绍，包括其与 Node.js 的区别，核心特性如事件驱动、负载均衡等，安装方法、常用命令、配置文件构成，还列举了多种配置实战案例，如静态资源服务、反向代理等，深入探讨了负载均衡的健康检查、算法和开源模块，最后总结前端人员了解 Nginx 基本概念和配置操作的必要性。

关联问题: Nginx如何实现热部署 Nginx负载均衡怎么选 怎样修改Nginx配置

**引言**：纯干货分享，汇总了我在工作中这几年遇到的各种 Nginx 使用场景，对这篇文章进行了细致的整理和层次分明的讲解，旨在提供简洁而深入的内容。希望这能为你提供帮助和启发！ ![1802c30a7bb47ccc7cd70314829ac04796140850.jpeg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d680ac9516f4445db2b44b4b4e3e9a74~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=999&h=625&s=507721&e=jpg&b=162a20)

对于前端开发人员来说，Node.js 是一种熟悉的技术。虽然 Nginx 和 Node.js 在某些理念上有相似之处，比如都支持 HTTP 服务、事件驱动和异步非阻塞操作，但两者并不冲突，各有各自擅长的领域：

- **Nginx**：擅长处理底层的服务器端资源，如静态资源处理、反向代理和负载均衡。
- **Node.js**：更擅长处理上层的具体业务逻辑。

而两者的结合可以实现更加高效和强大的应用服务架构，下面我们就来看一下。借助文章目录阅读，效率更高。目前您可能还用不到这篇文章，不过可以先收藏起来。希望将来它能为您提供所需的帮助！

## Nginx 是什么？

`Nginx` 是一个高性能的HTTP和反向代理服务器，由俄罗斯程序员Igor Sysoev于 2004 年使用 C 语言开发。它最初设计是为了应对俄罗斯大型门户网站的高流量挑战。

![1667274211133.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/053e9c357c8d4caf98793adebb2246e3~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1608&h=1018&s=98415&e=jpg&b=fefefe)

### 反向代理是什么？（🔥面试会问）

让我们先从代理说起。Nginx 常被用作反向代理，那么什么是正向代理呢？

- **正向代理**：客户端知道要访问的服务器地址，但服务器只知道请求来自某个代理，而不清楚具体的客户端。正向代理隐藏了真实客户端的信息。例如，当无法直接访问国外网站时，我们通过代理服务器访问特定网址。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/42c66fd130404662a866dfa0002fb99d~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2252&h=764&s=157792&e=png&b=fbfbfb)

- **反向代理**：多个客户端向反向代理服务器发送请求，Nginx 根据一定的规则将请求转发至不同的服务器。客户端不知道具体请求将被转发至哪台服务器，反向代理隐藏了后端服务器的信息。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4328db3dfd894865aafd11677466f26e~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2290&h=690&s=154512&e=png&b=fbfbfb)

### Nginx 的核心特性

Nginx包含以下七个核心特性，使它成为处理高并发和大数据量请求的理想选择：

**1. 事件驱动**：Nginx采用高效的异步事件模型，利用 I/O 多路复用技术。这种模型使 Nginx 能在占用最小内存的同时处理大量并发连接。

**2. 高度可扩展**：Nginx能够支持数千乃至数万个并发连接，非常适合大型网站和高并发应用。例如：为不同的虚拟主机设置不同的 worker 进程数，以增加并发处理能力：

```
http {
  worker_processes auto; # 根据系统CPU核心数自动设置worker进程数
}
```

**3. 轻量级**：相较于传统的基于进程的Web服务器（如Apache），Nginx的内存占用更低，得益于其事件驱动模型，每个连接只占用极小的内存空间。

**4. 热部署**：Nginx支持热部署功能，允许在不重启服务器的情况下更新配置和模块。例如：在修改了 Nginx 配置文件后，可以快速热部署 Nginx 配置：

```
sudo nginx -s reload
```

**5. 负载均衡**：Nginx内置负载均衡功能，通过`upstream`模块实现客户端请求在多个后端服务器间的分配，从而提高服务的整体处理能力。以下是一个简单的upstream配置，它将请求轮询分配到三个后端服务器：

```
upstream backend {
    server backend1.example.com;
    server backend2.example.com;
    server backend3.example.com;
}

server {
    location / {
        proxy_pass http://backend; # 将请求转发到upstream定义的backend组
    }
}
```

**6. 高性能**：Nginx 在多项 Web 性能测试中表现卓越，能快速处理静态文件、索引文件及代理请求。比如：配置 Nginx 作为反向代理服务器，为大型静态文件下载服务：

```
location /files/ {
  alias /path/to/files/; # 设置实际文件存储路径
  expires 30d; # 设置文件过期时间为30天
}
```

**7. 安全性**：Nginx支持SSL/TLS协议，能够作为安全的Web服务器或反向代理使用。

```
server {
  listen 443 ssl;
  ssl_certificate /path/to/fullchain.pem; # 证书路径
  ssl_certificate_key /path/to/privatekey.pem; # 私钥路径
  ssl_protocols TLSv1.2 TLSv1.3; # 支持的SSL协议
}
```

## 搭建 Nginx 服务

![1-48.jpeg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7c7f57e4ea4b4066a40fe64252112387~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=600&h=320&s=62279&e=jpg&b=667655)

### 如何安装？

在 Linux 系统中，可以使用包管理器来安装 Nginx。例如，在基于 Debian 的系统上，可以使用 `apt`：

```
sudo apt update
sudo apt install nginx
```

在基于 Red Hat 的系统上，可以使用 `yum` 或 `dnf`：

```
sudo yum install epel-release
sudo yum install nginx
```

在安装完成后，通常可以通过以下命令启动 Nginx 服务：

```
sudo systemctl start nginx
```

设置开机自启动：

```
sudo systemctl enable nginx
```

启动成功后，在浏览器输入服务器 ip 地址或者域名，如果看到 Nginx 的默认欢迎页面，说明 Nginx 运行成功。

### 常用命令有哪些

在日常的服务器管理和运维中，使用脚本来管理 Nginx 是很常见的。这可以帮助自动化一些常规任务，如启动、停止、重载配置等。以下是一些常用的 Nginx 脚本命令，这些脚本通常用于 Bash 环境下：

1. 启动 Nginx：`nginx`
2. 停止 Nginx：`nginx -s stop`
3. 重新加载 Nginx：`nginx -s reload`
4. 检查 Nginx 配置文件：`nginx -t`（检查配置文件的正确性）
5. 查看 Nginx 版本：`nginx -v`

其他常用的配合脚本命令：

1. 查看进程命令：`ps -ef | grep nginx`
2. 查看日志，在logs目录下输入指令：`more access.log`

。。。还有哪些常用命令，评论区一起讨论下！

### 配置文件构成（🔥核心重点，一定要了解）

Nginx配置文件主要由指令组成，这些指令可以分布在多个上下文中，主要上下文包括：

1. main: 全局配置，影响其他所有上下文。
2. events: 配置如何处理连接。
3. http: 配置HTTP服务器的参数。
    - server: 配置虚拟主机的参数。
        - location: 基于请求的URI来配置特定的参数。

```
worker_processes auto;   # worker_processes定义Nginx可以启动的worker进程数，auto表示自动检测 

# 定义Nginx如何处理连接 
events {   
    worker_connections 1024;  # worker_connections定义每个worker进程可以同时打开的最大连接数 
}  
  
# 定义HTTP服务器的参数  
http {  
    include mime.types;  # 引入mime.types文件，该文件定义了不同文件类型的MIME类型  
    default_type application/octet-stream;  # 设置默认的文件MIME类型为application/octet-stream  
    sendfile on;  # 开启高效的文件传输模式  
    keepalive_timeout 65;  # 设置长连接超时时间  

    # 定义一个虚拟主机  
    server {  
        listen 80;  # 指定监听的端口
        server_name localhost;  # 设置服务器的主机名，这里设置为localhost  
        
        # 对URL路径进行配置  
        location / {  
            root /usr/share/nginx/html;  # 指定根目录的路径  
            index index.html index.htm;  # 设置默认索引文件的名称，如果请求的是一个目录，则按此顺序查找文件  
        }  

        # 错误页面配置，当请求的文件不存在时，返回404错误页面  
        error_page 404 /404.html;  

        # 定义/40x.html的位置  
        location = /40x.html {  
            # 此处可以配置额外的指令，如代理、重写等，但在此配置中为空  
        }  

        # 错误页面配置，当发生500、502、503、504等服务器内部错误时，返回相应的错误页面  
        error_page 500 502 503 504 /50x.html;  

        # 定义/50x.html的位置  
        location = /50x.html {  
            # 同上，此处可以配置额外的指令  
        }  
    }  
}
```

这个配置文件设置了Nginx监听80端口，使用root指令指定网站的根目录，并为404和50x错误页面提供了位置。其中，`user`和`worker_processes`指令在main上下文中，`events`块定义了事件处理配置，`http`块定义了HTTP服务器配置，包含一个`server`块，该块定义了一个虚拟主机，以及两个`location`块，分别定义了对于404和50x错误的处理。

## 进入正题，详细看下如何配置

![a0e2c2ce0c28044531b1589f5e3fb83263cb690c.jpeg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed5c0d4f97524804b8db6d85343d3363~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1170&h=731&s=125606&e=jpg&b=373631)

### 打开 Nginx 配置世界大门

下面这段是 Nginx 配置定义了一个服务器块（server block），它指定了如何处理发往特定域名的 HTTP 请求。

```
server {
    listen 80;  # 监听80端口，HTTP请求的默认端口
    client_max_body_size 100m;  # 设置客户端请求体的最大大小为100MB
    index index.html;  # 设置默认的索引文件为index.html
    root /user/project/admin;  # 设置Web内容的根目录为/user/project/admin

    # 路由配置，处理所有URL路径
    location ~ /* {
        proxy_pass http://127.0.0.1:3001;  # 将请求代理到本机的3001端口
        proxy_redirect off;  # 关闭代理重定向

        # 设置代理请求头，以便后端服务器可以获取客户端的原始信息
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        # 定义代理服务器失败时的行为，如遇到错误、超时等，尝试下一个后端服务器
        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
        proxy_max_temp_file_size 0;  # 禁止代理临时文件写入

        # 设置代理连接、发送和读取的超时时间
        proxy_connect_timeout 90;
        proxy_send_timeout 90;
        proxy_read_timeout 90;

        # 设置代理的缓冲区大小
        proxy_buffer_size 4k;
        proxy_buffers 4 32k;
        proxy_busy_buffers_size 64k;
        proxy_temp_file_write_size 64k;
    }

    # 对图片文件设置缓存过期时间，客户端可以在1天内使用本地缓存
    location ~ .*.(gif|jpg|jpeg|png|swf)$ {
        expires 1d; 
    }

    # 对JavaScript和CSS文件设置缓存过期时间，客户端可以在24小时内使用本地缓存
    location ~ .*.(js|css)?$ {
        expires 24h;
    }

    # 允许访问/.well-known目录下的所有文件，通常用于WebFinger、OAuth等协议
    location ~ /.well-known {
        allow all;
    }

    # 禁止访问隐藏文件，即以点开头的文件或目录
    location ~ /. {
        deny all;
    }

    # 指定访问日志的路径，日志将记录在/user/logs/admin.log文件中
    access_log /user/logs/admin.log;
}
```

注意：Nginx 支持使用正则表达式来匹配 URI，这极大地增强了配置的灵活性。在 Nginx 配置中，正则表达式通过 `~` 来指定。

例如，`location ~ /*` 可以匹配所有请求。另一个例子是 `location ~ .*.(gif|jpg|jpeg|png|swf)$`，这个表达式用于匹配以 gif、jpg、jpeg、png 或 swf 这些图片文件扩展名结尾的请求。

### Nginx 配置实战（🔥可以复制，直接拿来使用）

以下是一些常见的 Nginx 配置实战案例：

#### 1、静态资源服务：前端web

```
server {
    listen 80;
    server_name example.com;
    location / {
        root /path/to/your/static/files;
        index index.html index.htm;
    }
    location ~* \.(jpg|png|gif|jpeg)$ {
        expires 30d;
        add_header Cache-Control "public";
    }
}
```

在这个案例中，Nginx 配置为服务静态文件，如 HTML、CSS、JavaScript 和图片等。通过设置 `root` 指令，指定了静态文件的根目录。同时，对于图片文件，通过 `expires` 指令设置了缓存时间为 30 天，减少了服务器的负载和用户等待时间。

#### 2、反向代理

```
server {
    listen 80;
    server_name api.example.com;
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

这个案例展示了如何配置 Nginx 作为反向代理服务器。当客户端请求 `api.example.com` 时，Nginx 会将请求转发到后端服务器集群。通过设置 `proxy_set_header`，可以修改客户端请求的头部信息，确保后端服务器能够正确处理请求。

#### 3、负载均衡

```
http {
    upstream backend {
        server backend1.example.com;
        server backend2.example.com;
        server backend3.example.com;
    }
    server {
        listen 80;
        server_name example.com;
        location / {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }
}
```

在这个负载均衡的案例中，Nginx 将请求分发给多个后端服务器。通过 `upstream` 指令定义了一个服务器组，然后在 `location` 块中使用 `proxy_pass` 指令将请求代理到这个服务器组。Nginx 支持多种负载均衡策略，如轮询（默认）、IP 哈希等。

#### 4、HTTPS 配置

```
server {
    listen 443 ssl;
    server_name example.com;
    ssl_certificate /path/to/your/fullchain.pem;
    ssl_certificate_key /path/to/your/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers on;
    location / {
        root /path/to/your/https/static/files;
        index index.html index.htm;
    }
}
```

这个案例展示了如何配置 Nginx 以支持 HTTPS。通过指定 SSL 证书和私钥的路径，以及设置 SSL 协议和加密套件，可以确保数据传输的安全。同时，建议使用 HTTP/2 协议以提升性能。

#### 5、安全防护

```
server {
    listen 80;
    server_name example.com;
    location / {
        # 防止 SQL 注入等攻击
        rewrite ^/(.*)$ /index.php?param=$1 break;
        # 限制请求方法，只允许 GET 和 POST
        if ($request_method !~ ^(GET|POST)$ ) {
            return 444;
        }
        # 防止跨站请求伪造
        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-Content-Type-Options "nosniff";
        add_header X-XSS-Protection "1; mode=block";
    }
}
```

通过 `rewrite` 指令，可以防止一些常见的 Web 攻击，如 SQL 注入。这种限制请求方法，可以减少服务器被恶意利用的风险。同时，添加了一些 HTTP 头部来增强浏览器安全，如防止点击劫持和跨站脚本攻击（XSS）等。

![63d12faf8e9f0972ed2f0d90_1024.jpeg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/491a3384adfa4daca35219ff35ca2b53~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1024&h=430&s=44278&e=jpg&b=d6caa2)

## Nginx 深入学习-负载均衡

在负载均衡的应用场景中，Nginx 通常作为反向代理服务器，接收客户端的请求并将其分发到一组后端服务器。这样做不仅可以分散负载、提升网站的响应速度，更能提高系统的可用性。

### 健康检查

Nginx 能够监测后端服务器的健康状态。如果服务器无法正常工作，Nginx 将自动将请求重新分配给其他健康的服务器。

```
http {
    upstream myapp1 { # 定义了后端服务器组
        server srv1.example.com;
        server srv2.example.com;
        server srv3.example.com;
        
        # 健康检查配置。
        # 每10秒进行一次健康检查，如果连续3次健康检查失败，则认为服务器不健康；
        # 如果连续2次健康检查成功，则认为服务器恢复健康。
        check interval=10s fails=3 passes=2;
    }

    server {
        listen 80;

        location / {
            proxy_pass http://myapp1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }
}
```

> `check interval=10s fails=3 passes=2;` 这样的配置语法在开源版本的 NGINX 上是不支持的。这是 `ngx_http_upstream_check_module` 模块的特有语法，而该模块不包含在 NGINX 的开源版本中，需要自行下载、编译和安装。该模块是开源免费的，具体详情请参见 [ngx_http_upstream_check_module 文档](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fyaoweibin%2Fnginx_upstream_check_module "https://github.com/yaoweibin/nginx_upstream_check_module")。

Nginx 会定期向定义的服务器发送健康检查请求。如果服务器响应正常，则认为服务器健康；如果服务器没有响应或者响应异常，则认为服务器不健康。当服务器被标记为不健康时，Nginx 将不再将请求转发到该服务器，直到它恢复健康。

### 负载均衡算法

Nginx 支持多种负载均衡算法，可以适应不同的应用场景。以下是几种常见的负载均衡算法的详细说明和示例：

**1、Weight轮询（默认）**：权重轮询算法是 Nginx 默认的负载均衡算法。它按顺序将请求逐一分配到不同的服务器上。通过设置服务器权重（weight）来调整不同服务器上请求的分配率。

```
upstream backend {
  server backend1.example.com weight=3; # 设置backend1的权重为3
  server backend2.example.com; # backend2的权重为默认值1
  server backend3.example.com weight=5; # 设置backend3的权重为5
}
```

如果某一服务器宕机，Nginx会自动将该服务器从队列中剔除，请求代理会继续分配到其他健康的服务器上。

**2、IP Hash 算法：** 根据客户端IP地址的哈希值分配请求，确保客户端始终连接到同一台服务器。

```
upstream backend {
  ip_hash; # 启用IP哈希算法
  server backend1.example.com;
  server backend2.example.com;
}
```

根据客户端请求的IP地址的哈希值进行匹配，将具有相同IP哈希值的客户端分配到指定的服务器。这样可以确保同一客户端的请求始终被分配到同一台服务器，有助于保持用户的会话状态。

**3、fair算法：** 根据服务器的响应时间和负载来分配请求。

```
upstream backend {
  fair; # 启用公平调度算法
  server backend1.example.com;
  server backend2.example.com;
  server backend3.example.com;
}
```

它结合了轮询和IP哈希的优点，但Nginx默认不支持公平调度算法，需要安装额外的模块（upstream_fair）来实现。

**4、URL Hash 算法：** 根据请求的 URL 的哈希值分配请求，每个请求的URL会被分配到指定的服务器，有助于提高缓存效率。

```
upstream backend {
  hash $request_uri; # 启用URL哈希算法
  server backend1.example.com;
  server backend2.example.com;
}
# 根据请求的URL哈希值来决定将请求发送到backend1还是backend2。
```

这种方法需要安装Nginx的hash软件包。

### 开源模块

`Nginx`拥有丰富的开源模块，有很多还有待我们探索，除了一些定制化的需求需要自己开发，大部分的功能都有开源。大家可以在 `NGINX` 社区、`GitHub` 上搜索 "nginx module" 可以找到。

![image (1).png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea3c96cdbd3b4c68be0557aee3ccb6c0~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1414&h=668&s=1236501&e=png&b=121e21)

## 总结

虽然前端人员可能不经常直接操作 Nginx，但了解其基本概念和简单的配置操作是必要的。这样，在需要自行配置 Nginx 的情况下，前端人员能够知晓如何进行基本的设置和调整。