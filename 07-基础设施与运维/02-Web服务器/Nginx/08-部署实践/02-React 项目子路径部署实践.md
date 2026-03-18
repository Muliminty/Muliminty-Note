---
title: "React 项目子路径部署实践"
date: "2026-03-18"
lastModified: "2026-03-18"
tags: ["Nginx", "React", "部署实践", "前端发布"]
moc: "[[!MOC-Nginx]]"
stage: "工程化实践"
prerequisites: ["Nginx 多项目配置与部署实践", "虚拟主机配置"]
description: "总结 React 项目部署在 Nginx 子路径下时的配置方式、路由回退策略、静态资源处理与验证步骤。"
publish: true
aliases: ["React 项目子路径部署解决方案", "React 子路径部署实践"]
toc: true
---

# React 项目子路径部署实践

## 1. 场景说明

当 React 项目不是部署在根路径 `/`，而是部署在 `/muliminty`、`/admin` 这类子路径下时，最常见的问题是直接访问页面深层路由会返回 `404`。

典型现象：

1. 用户访问 `/muliminty/about`
2. Nginx 尝试查找物理路径 `/var/www/muliminty/about`
3. 文件不存在，服务器直接返回 `404`
4. React Router 无法接管路由

根因是：

- BrowserRouter 依赖客户端路由
- 服务器必须先把请求回退到 `index.html`
- 前端构建产物还必须知道自己的基础路径不是根路径

## 2. 核心配置

### 2.1 Nginx 子路径配置

```nginx
location /muliminty {
    alias /var/www/muliminty;
    index index.html;

    # 当请求不是实际文件时，回退到 React 应用入口
    try_files $uri $uri/ /muliminty/index.html;
}
```

这段配置的作用是：

- 真实静态资源仍按文件路径返回
- 非真实文件请求统一回退到 `index.html`
- React Router 在浏览器中继续处理 `/about` 这类客户端路由

### 2.2 Vite 项目配置

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/muliminty/',
})
```

`base` 的作用是把打包产物中的脚本、样式、图片路径统一改为子路径前缀。

### 2.3 Create React App 配置

```json
{
  "homepage": "/muliminty"
}
```

或在 `.env` 中配置：

```text
PUBLIC_URL=/muliminty
```

### 2.4 React Router 配置

```javascript
import { BrowserRouter } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter basename="/muliminty">
      {/* routes */}
    </BrowserRouter>
  )
}
```

约束：

- Nginx `location` 路径
- 构建工具中的 `base` 或 `homepage`
- Router 的 `basename`

这三者必须保持一致。

## 3. 完整部署示例

```nginx
server {
    listen 80;
    server_name _;

    location /muliminty {
        alias /var/www/muliminty;
        index index.html;
        try_files $uri $uri/ /muliminty/index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

部署步骤：

1. 构建 React 项目。
2. 把产物发布到 `/var/www/muliminty/`。
3. 写入对应 `location /muliminty` 配置。
4. 执行 `nginx -t` 验证语法。
5. 重载 Nginx。
6. 测试首页、深层路由与静态资源。

## 4. 为什么这样配置

### 4.1 `try_files` 是服务端路由回退的关键

没有 `try_files $uri $uri/ /muliminty/index.html;` 时：

- 浏览器会把 `/muliminty/about` 发给服务器
- 服务器按文件查找
- 找不到就直接 `404`

加入回退后：

- 实际文件仍正常返回
- 非文件请求会加载 React 应用入口
- 前端路由再根据 URL 决定渲染哪个页面

### 4.2 仅配置 Nginx 不够

即使服务器已经回退到 `index.html`，如果前端构建路径仍然指向根路径：

- JavaScript 资源可能请求到 `/assets/...`
- CSS、图片、字体资源可能继续 `404`

所以必须同步设置构建基础路径与 Router 的 `basename`。

## 5. 测试验证

### 5.1 静态资源测试

```bash
curl http://localhost/muliminty/assets/index.js
```

### 5.2 路由回退测试

```bash
curl http://localhost/muliminty/about
```

期望结果：

- 返回内容应为 React 应用入口页，而不是 `404`
- 页面中应能看到类似 `<div id="root">` 的挂载节点

### 5.3 浏览器测试

- 访问 `/muliminty` 应正常显示首页
- 页面内跳转到 `/muliminty/about` 应正常工作
- 直接刷新 `/muliminty/about` 不应出现 `404`

## 6. 常见问题

### 6.1 刷新页面返回 `404`

原因：

- `try_files` 未回退到子路径下的 `index.html`

修复：

```nginx
try_files $uri $uri/ /muliminty/index.html;
```

### 6.2 静态资源返回 `404`

原因：

- `base`、`homepage` 或 `PUBLIC_URL` 未配置
- 构建产物与部署路径不一致

修复：

- Vite 设置 `base`
- CRA 设置 `homepage` 或 `PUBLIC_URL`
- 确认资源目录已发布到目标站点路径

### 6.3 路由跳转正常，但直接访问失败

原因：

- 浏览器内跳转依赖前端路由
- 直接访问依赖服务端回退

修复：

- 同时检查 Nginx 回退配置与 Router `basename`

## 7. 检查清单

- [ ] Nginx `location` 路径正确
- [ ] `try_files` 已回退到子路径下的 `index.html`
- [ ] Vite `base` 或 CRA `homepage` 已配置
- [ ] React Router `basename` 与子路径一致
- [ ] 构建产物已发布到目标目录
- [ ] 首页、深层路由与静态资源均验证通过

## 8. 相关笔记

- [README.md](./README.md)
- [01-多项目配置与部署实践.md](./01-多项目配置与部署实践.md)
- [../03-核心功能/反向代理.md](../03-核心功能/反向代理.md)
- [../03-核心功能/静态文件服务.md](../03-核心功能/静态文件服务.md)
