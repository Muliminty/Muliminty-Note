
# **完整流程：Vite + Nginx + Docker 部署**

## **1. 初始化 Vite 项目**

我们先创建一个简单的 `Vite` 项目，并确保它可以正确运行。

### **1.1 创建 Vite 项目**

```sh
npm create vite@latest my-vite-app --template react
cd my-vite-app
npm install
```

### **1.2 运行开发环境**

```sh
npm run dev
```

访问 `http://localhost:5173`，确认开发环境正常。

---

## **2. 配置 Vite 生产环境**

默认情况下，Vite 会输出 `dist` 文件夹，我们需要配置 `base`，确保部署时路径正确。

### **2.1 配置 `vite.config.js`**

在 `vite.config.js` 添加 `base`（如果部署在 `/` 目录下，可忽略）。

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // 如果部署到子路径如 `/app/`，则修改 `base: '/app/'`
  server: {
    port: 5173,
  },
});
```

### **2.2 打包**

```sh
npm run build
```

生成 `dist` 文件夹，静态资源将在 `dist` 目录中。

---

## **3. 使用 Nginx 作为 Web 服务器**

我们需要配置 `Nginx` 来提供静态资源，并作为反向代理。

### **3.1 创建 `nginx.conf`**

在 `my-vite-app/nginx.conf` 中添加：

```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://backend:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

- `location /` → 处理 `Vite` 前端静态资源
- `location /api/` → 反向代理到 `Node.js` 后端（可选）

---

## **4. 使用 Docker 部署 Nginx + Vite**

我们把 `Nginx` 和 `Vite` 静态文件打包到 `Docker` 容器中。

### **4.1 创建 `Dockerfile`**

在 `my-vite-app/Dockerfile` 添加：

```dockerfile
# 使用 Node 构建前端
FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

# 使用 Nginx 作为 Web 服务器
FROM nginx:latest
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

这里：

- 第一阶段：使用 `Node.js` 构建 `Vite` 前端
- 第二阶段：使用 `Nginx` 作为 Web 服务器，提供 `dist` 文件

---

## **5. 使用 Docker-Compose 管理服务**

如果需要同时运行 `Vite` 前端、`Nginx` 和 `Node.js` 后端（可选），可以使用 `docker-compose`。

### **5.1 创建 `docker-compose.yml`**

在 `my-vite-app/docker-compose.yml` 添加：

```yaml
version: '3'
services:
  frontend:
    build: .
    container_name: vite-frontend
    ports:
      - "8080:80"
    depends_on:
      - backend

  backend:
    image: node:18
    container_name: backend-server
    working_dir: /app
    volumes:
      - ./backend:/app
    command: ["node", "server.js"]
    ports:
      - "3000:3000"
```

- `frontend`：`Vite` 打包后交给 `Nginx`，对外提供 `http://localhost:8080`
- `backend`（可选）：`Node.js` 运行后端 API，提供 `http://localhost:3000`

---

## **6. 启动 Docker**

### **6.1 直接运行 Docker**

```sh
docker build -t my-vite-nginx .
docker run -d -p 8080:80 my-vite-nginx
```

然后访问 `http://localhost:8080`，查看 Vite 部署是否成功。

### **6.2 运行 `docker-compose`**

```sh
docker-compose up -d
```

- `http://localhost:8080` → Vite 前端
- `http://localhost:3000/api` → 后端 API（如果有）

---

## **7. 部署到服务器**

如果要部署到远程服务器（如 `Ubuntu`），可以：

1. **打包 Docker 镜像**
    
    ```sh
    docker save my-vite-nginx > my-vite-nginx.tar
    ```
    
2. **上传到服务器**
    
    ```sh
    scp my-vite-nginx.tar user@your-server:/home/user/
    ```
    
3. **在服务器上加载并运行**
    
    ```sh
    docker load < my-vite-nginx.tar
    docker run -d -p 80:80 my-vite-nginx
    ```
    

如果使用 `docker-compose`：

```sh
scp -r my-vite-app user@your-server:/home/user/
ssh user@your-server
cd /home/user/my-vite-app
docker-compose up -d
```

---

## **8. 访问网站**

- 本地环境：`http://localhost:8080`
- 服务器环境：直接访问服务器 IP `http://your-server-ip`

---

## **总结**

|步骤|任务|
|---|---|
|1|创建 Vite 项目并安装依赖|
|2|配置 `vite.config.js` 并构建|
|3|配置 `nginx.conf` 处理静态资源|
|4|编写 `Dockerfile` 构建前端并打包到 Nginx|
|5|使用 `docker-compose` 管理 `Nginx + Node.js`（可选）|
|6|本地 `docker run` 或 `docker-compose up` 启动|
|7|服务器上 `scp` 上传 Docker 镜像，并运行|

这样，你就完成了 **Vite + Nginx + Docker 部署** 🎉，可以用它在本地开发，也可以在服务器上部署生产环境！🚀