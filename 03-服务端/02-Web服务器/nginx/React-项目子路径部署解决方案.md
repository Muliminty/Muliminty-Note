# React 项目部署在 Nginx 子路径的完整解决方案

## 问题说明

当 React 项目部署在子路径（如 `/muliminty`）下时，会遇到路由冲突问题：

### 冲突场景

1. **用户访问：** `http://IP/muliminty/about`
2. **Nginx 行为：** 尝试在文件系统中查找 `/var/www/muliminty/about`
3. **结果：** 文件不存在，返回 404
4. **问题：** React Router 无法处理路由，因为请求根本没有到达浏览器

### 为什么会冲突？

- React Router 是**客户端路由**，在浏览器中运行
- 当用户直接访问 `/muliminty/about` 时，浏览器会先向服务器请求这个路径
- 如果服务器返回 404，浏览器就不会加载 React 应用，Router 无法工作

---

## 解决方案

### 1. Nginx 配置（关键）

**核心配置：** 使用 `try_files` 将所有请求回退到 `index.html`

```nginx
location /muliminty {
    alias /var/www/muliminty;
    index index.html;
    
    # 关键：所有请求都回退到 index.html，让 React Router 处理
    try_files $uri $uri/ /muliminty/index.html;
}
```

**工作原理：**
1. 先尝试访问实际文件（如 `/muliminty/static/js/main.js`）
2. 再尝试访问目录
3. 如果都不存在，回退到 `/muliminty/index.html`
4. 浏览器加载 React 应用后，Router 可以处理路由

### 2. React 项目配置

#### 2.1 配置 base 路径（Vite）

在 `vite.config.js` 中：

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/muliminty/',  // 重要：配置子路径
  build: {
    outDir: 'dist',
  }
})
```

#### 2.2 配置 base 路径（Create React App）

在 `package.json` 中：

```json
{
  "homepage": "/muliminty"
}
```

或者创建 `.env` 文件：

```
PUBLIC_URL=/muliminty
```

#### 2.3 React Router 配置

确保 Router 使用正确的 basename：

```javascript
import { BrowserRouter } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter basename="/muliminty">
      {/* 路由配置 */}
    </BrowserRouter>
  )
}
```

**注意：** 如果使用 HashRouter，不需要 basename，但 URL 会有 `#`：
- HashRouter: `http://IP/muliminty/#/about`
- BrowserRouter: `http://IP/muliminty/about`（需要正确配置）

### 3. 静态资源路径

确保静态资源使用正确的路径：

```html
<!-- 正确：使用相对路径或配置的 base -->
<link rel="stylesheet" href="./assets/style.css">
<script src="./assets/app.js"></script>

<!-- 或者使用 PUBLIC_URL（CRA） -->
<link rel="stylesheet" href="%PUBLIC_URL%/assets/style.css">
```

---

## 完整配置示例

### Nginx 配置

```nginx
server {
    listen 80;
    server_name _;
    
    # React 项目1
    location /muliminty {
        alias /var/www/muliminty;
        index index.html;
        
        # 支持 React Router
        try_files $uri $uri/ /muliminty/index.html;
        
        # 静态资源缓存
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
            alias /var/www/muliminty;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # React 项目2
    location /project2 {
        alias /var/www/project2;
        index index.html;
        try_files $uri $uri/ /project2/index.html;
    }
}
```

### React 项目配置（Vite）

**vite.config.js:**
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/muliminty/',
})
```

**App.jsx:**
```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter basename="/muliminty">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  )
}
```

---

## 测试验证

### 1. 测试静态资源

```bash
# 应该能正常加载
curl http://localhost/muliminty/static/js/main.js
```

### 2. 测试路由

```bash
# 应该返回 index.html（让 React Router 处理）
curl http://localhost/muliminty/about
# 应该包含 <div id="root"> 等 React 应用内容
```

### 3. 浏览器测试

1. 访问 `http://IP/muliminty` - 应该显示首页
2. 点击导航到 `/about` - 应该正常跳转（客户端路由）
3. 直接访问 `http://IP/muliminty/about` - 应该正常显示（服务器回退到 index.html）

---

## 常见问题

### Q1: 刷新页面返回 404

**原因：** Nginx 配置中 `try_files` 没有正确回退到 index.html

**解决：** 确保配置为：
```nginx
try_files $uri $uri/ /muliminty/index.html;
```

### Q2: 静态资源 404

**原因：** 静态资源路径不正确

**解决：**
1. 检查 React 项目的 base 配置
2. 确保静态资源使用相对路径或正确的 PUBLIC_URL

### Q3: 路由跳转正常，但直接访问路由 404

**原因：** Nginx 没有将请求回退到 index.html

**解决：** 检查 `try_files` 配置

### Q4: 多个 React 项目，路由互相干扰

**原因：** basename 配置错误

**解决：** 确保每个项目的 basename 与 nginx location 路径一致

---

## 最佳实践

1. **统一配置：** Nginx location 路径 = React basename
2. **使用 BrowserRouter：** 更友好的 URL（无 `#`）
3. **配置 base 路径：** 在构建工具中配置，确保静态资源路径正确
4. **测试所有路由：** 确保直接访问和跳转都正常
5. **静态资源缓存：** 配置长期缓存提升性能

---

## 总结

**关键点：**
1. ✅ Nginx: `try_files $uri $uri/ /路径/index.html;`
2. ✅ React: 配置 `base` 或 `homepage`
3. ✅ Router: 使用 `basename` 属性
4. ✅ 静态资源: 使用相对路径或配置的 base

**配置检查清单：**
- [ ] Nginx try_files 配置正确
- [ ] React 项目 base 路径配置
- [ ] Router basename 配置
- [ ] 静态资源路径正确
- [ ] 测试直接访问路由
- [ ] 测试路由跳转

---

*最后更新：2025-12-12*
