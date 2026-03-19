---
title: "Nginx HTTPS 与证书配置"
date: "2026-03-19"
lastModified: "2026-03-19"
tags: ["Nginx", "安全", "HTTPS", "证书配置"]
moc: "[[!MOC-Nginx]]"
stage: "工程化实践"
prerequisites: ["安装与环境配置", "虚拟主机配置"]
description: "说明 Nginx 中 HTTPS、证书、443 监听、HTTP 跳转 HTTPS 与证书续期的基础配置方法。"
publish: true
aliases: ["HTTPS 与证书配置", "Nginx HTTPS 配置"]
toc: true
---

# Nginx HTTPS 与证书配置

## 1. 先理解这件事

对新手来说，可以先记住一句话：

- `HTTP` 是明文传输
- `HTTPS` 是带加密和身份校验的 HTTP

Nginx 在这里承担的角色是：

- 监听 `443` 端口
- 加载证书和私钥
- 与浏览器完成 TLS 握手
- 再把请求转给静态站点或后端服务

对有经验的读者，更值得关注的是：

- 证书文件如何组织
- HTTP 到 HTTPS 的跳转策略
- TLS 版本与密码套件如何收敛
- 证书续期如何避免服务中断

## 2. 最小可用配置

```nginx
server {
    listen 80;
    server_name example.com www.example.com;

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name example.com www.example.com;

    ssl_certificate /etc/nginx/ssl/example.com/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/example.com/privkey.pem;

    root /var/www/example.com;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

先看懂这几行：

- `listen 443 ssl http2;` 表示启用 HTTPS
- `ssl_certificate` 指向公钥证书链
- `ssl_certificate_key` 指向私钥
- `return 301 https://$host$request_uri;` 表示把明文请求永久跳到 HTTPS

## 3. 证书文件怎么理解

常见文件：

- `fullchain.pem`：证书链文件，通常包含站点证书和中间证书
- `privkey.pem`：私钥文件，只能服务器自己持有

常见要求：

- 私钥权限要收紧
- 证书路径要固定，方便后续自动续期
- 重载 Nginx 前要先执行 `nginx -t`

## 4. 推荐的安全配置

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;

    ssl_certificate /etc/nginx/ssl/example.com/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/example.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:10m;
    ssl_session_tickets off;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    location / {
        proxy_pass http://127.0.0.1:3000;
    }
}
```

由浅入深地理解：

- 新手先记 `TLSv1.2 TLSv1.3` 基本够用
- 进阶再看 `HSTS`、Session Cache 和 Ticket 策略
- 上生产前，再结合证书来源、自动续期和兼容性做统一治理

## 5. 证书来源与续期

常见来源：

- Let’s Encrypt：适合大多数公开站点
- 云厂商证书服务：适合已有云平台接入流程的场景
- 企业内网 CA：适合内部系统

续期建议：

1. 证书路径尽量固定。
2. 续期后执行 `nginx -t`。
3. 验证通过后执行 `systemctl reload nginx`。

## 6. 排查清单

- [ ] 域名已正确解析到服务器
- [ ] 443 端口已放通
- [ ] 证书链与私钥路径正确
- [ ] `nginx -t` 验证通过
- [ ] 浏览器访问时无证书警告
- [ ] HTTP 已正确跳转 HTTPS

## 7. 常见问题

### 7.1 浏览器提示证书不受信任

常见原因：

- 使用了自签证书
- 证书链不完整
- 域名与证书不匹配

### 7.2 配置更新后 Nginx 无法启动

优先检查：

- 证书路径是否写错
- 私钥权限是否过严或不可读
- `listen 443 ssl` 是否遗漏了 `ssl`

## 8. 相关笔记

- [02-CORS与安全头配置.md](./02-CORS与安全头配置.md)
- [03-限流与恶意请求防护.md](./03-限流与恶意请求防护.md)
- [../08-部署实践/01-多项目配置与部署实践.md](../08-部署实践/01-多项目配置与部署实践.md)
