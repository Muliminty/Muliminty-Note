# **完整流程：Vite + Nginx + Docker 部署**

## **1. 初始化 Vite 项目**

我们先创建一个简单的 `Vite` 项目，并确保它可以正确运行。

### **1.1 创建 Vite 项目**

```sh
npm create vite@latest vite_nginx_docker_deployment --template react
cd vite_nginx_docker_deployment
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

在 `vite_nginx_docker_deployment/nginx.conf` 中添加：

```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri /index.html;
    }
}
```

- `location /` → 处理 `Vite` 前端静态资源
- `location /api/` → 反向代理到 `Node.js` 后端（可选）

---

## **4. 使用 Docker 部署 Nginx + Vite**

我们把 `Nginx` 和 `Vite` 静态文件打包到 `Docker` 容器中。

### **4.1 创建 `Dockerfile`**

在 `vite_nginx_docker_deployment/Dockerfile` 添加：

```dockerfile
   # 使用完整 Node.js 镜像
   FROM node:22.11.0 AS builder
   WORKDIR /app

   # 复制 package.json 和 package-lock.json（如果有的话）
   COPY package*.json ./


   RUN npm config rm proxy \
       && npm config rm https-proxy \
       && npm config set registry https://registry.npmmirror.com \
       && npm cache clean -force \
       && npm install

   # 复制剩余文件并构建
   COPY . .
   RUN npm run build

   # 使用 Nginx 作为 Web 服务器
   FROM nginx:alpine
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

在 `vite_nginx_docker_deployment/docker-compose.yml` 添加：

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
```

- `frontend`：`Vite` 打包后交给 `Nginx`，对外提供 `http://localhost:8080`
- `backend`（可选）：`Node.js` 运行后端 API，提供 `http://localhost:3000`

---

## **6. 启动 Docker**

### **6.1 直接运行 Docker**

```sh
docker build -t vite_nginx_docker_deployment .
docker run -d -p 8080:80 vite_nginx_docker_deployment
```

如果网络问题暂时无法解决，可以尝试手动拉取镜像：

```
   docker pull nginx:alpine
   docker pull node:22.11.0
```

拉取完成后，运行以下命令查看本地镜像：

```
   REPOSITORY   TAG             IMAGE ID       CREATED       SIZE
   node         22.11.0         abcdef123456   2 weeks ago   120MB
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
    docker save vite_nginx_docker_deployment > vite_nginx_docker_deployment.tar
    ```
    
2. **上传到服务器**
    
    ```sh
    scp vite_nginx_docker_deployment.tar user@your-server:/home/user/
    ```
    
3. **在服务器上加载并运行**
    
    ```sh
    docker load < vite_nginx_docker_deployment.tar
    docker run -d -p 80:80 vite_nginx_docker_deployment
    ```
    

如果使用 `docker-compose`：

```sh
scp -r vite_nginx_docker_deployment user@your-server:/home/user/
ssh user@your-server
cd /home/user/vite_nginx_docker_deployment
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