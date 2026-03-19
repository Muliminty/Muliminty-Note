---
title: "Nginx CORS 与安全头配置"
date: "2026-03-19"
lastModified: "2026-03-19"
tags: ["Nginx", "安全", "CORS", "安全头"]
moc: "[[!MOC-Nginx]]"
stage: "工程化实践"
prerequisites: ["Nginx 反向代理", "Nginx HTTPS 与证书配置"]
description: "整理 Nginx 中 CORS、常见安全响应头和跨域控制的基础配置方法与注意事项。"
publish: true
aliases: ["CORS 与安全头配置", "Nginx 安全头配置"]
toc: true
---

# Nginx CORS 与安全头配置

## 1. 先理解问题

这篇内容最容易吓到新手，因为术语很多。可以先把它拆成两件事：

- `CORS`：浏览器是否允许前端页面跨域访问后端资源
- 安全头：服务器通过响应头告诉浏览器“这个页面应当如何更安全地被处理”

换句话说：

- CORS 解决“能不能跨域访问”
- 安全头解决“即使能访问，也怎样更安全”

## 2. 最小可用 CORS 配置

```nginx
location /api/ {
    add_header Access-Control-Allow-Origin "https://app.example.com" always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;

    if ($request_method = OPTIONS) {
        return 204;
    }

    proxy_pass http://127.0.0.1:3000;
}
```

先理解重点：

- `Allow-Origin` 不要一上来就写 `*`
- 预检请求 `OPTIONS` 需要显式处理
- 生产环境优先按域名精确放行

## 3. 常见安全头

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self';" always;
```

由浅入深地理解：

- `X-Frame-Options`：减少被恶意 iframe 嵌套的风险
- `X-Content-Type-Options`：减少浏览器猜测 MIME 类型的风险
- `Referrer-Policy`：控制来源页面信息泄露
- `CSP`：约束页面允许加载哪些脚本、样式和资源

## 4. 更稳妥的配置方式

推荐把安全头抽成可复用片段：

```nginx
# /etc/nginx/snippets/security-headers.conf
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

在站点配置中复用：

```nginx
server {
    include snippets/security-headers.conf;
}
```

这样做的好处：

- 新手更容易统一维护
- 多站点之间不容易配置漂移
- 高阶场景下方便按环境叠加策略

## 5. 配置时的常见误区

### 5.1 把 `Access-Control-Allow-Origin` 直接写成 `*`

问题：

- 对公开静态资源可以接受
- 对带鉴权的接口通常不合适

### 5.2 只配了跨域，没处理预检请求

表现：

- 浏览器报 CORS 错误
- 实际接口服务并没有真的执行

### 5.3 一上来就上非常严格的 CSP

问题：

- 很容易把现有前端脚本、样式、第三方资源全部拦掉
- 应先从宽松策略开始，再逐步收紧

## 6. 排查清单

- [ ] 已确认前端真实来源域名
- [ ] 预检请求 `OPTIONS` 能正确返回
- [ ] 安全头已经通过 `curl -I` 验证
- [ ] 没有把带鉴权接口直接暴露给所有来源
- [ ] CSP 已在测试环境验证页面资源是否正常加载

## 7. 相关笔记

- [01-HTTPS与证书配置.md](./01-HTTPS与证书配置.md)
- [03-限流与恶意请求防护.md](./03-限流与恶意请求防护.md)
- [../03-核心功能/反向代理.md](../03-核心功能/反向代理.md)
