## Vue 3 + TypeScript + Element Plus 后台管理系统搭建教程

本教程将引导你一步步搭建一个基于 **Vue 3**、**TypeScript**、**Element Plus** 的后台管理系统，使用 **Vite** 作为构建工具，并展示如何搭建项目结构、配置依赖、创建常用功能模块等。

---

### 1. **初始化项目**

#### 1.1 创建项目目录

首先，在你想要存放项目的目录下创建一个新的文件夹，然后进入该目录。

```bash
mkdir vue3-admin
cd vue3-admin
```

#### 1.2 使用 Vite 创建 Vue 3 + TypeScript 项目

使用 Vite 的官方模板创建一个 Vue 3 + TypeScript 项目：

```bash
npm create vite@latest vue3-admin --template vue-ts
```

#### 1.3 安装依赖

进入项目目录并安装依赖：

```bash
cd vue3-admin
npm install
```

---

### 2. **安装项目所需的依赖**

根据项目需求，安装以下依赖：

```bash
# 安装 Element Plus UI 框架
npm install element-plus

# 安装 Vue Router 和 Pinia（状态管理）
npm install vue-router pinia

# 安装国际化插件 vue-i18n
npm install vue-i18n

# 安装 SCSS 支持
npm install -D sass

# 安装 eslint 和 prettier 用于代码格式化
npm install -D eslint prettier eslint-plugin-vue @vue/eslint-config-typescript
```

---

### 3. **配置项目结构**

根据你提供的项目结构，手动创建以下目录和文件。

#### 3.1 创建项目目录结构

```plaintext
src/
├── api/
│   ├── modules/
│   ├── index.ts
├── assets/
│   ├── images/
│   ├── styles/
├── components/
│   ├── BasicTable.vue
│   ├── BasicDialog.vue
│   ├── index.ts
├── config/
│   ├── theme.ts
│   ├── request.ts
├── directives/
│   ├── permission.ts
│   ├── index.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useFetch.ts
├── layouts/
│   ├── DefaultLayout.vue
│   ├── BlankLayout.vue
├── locales/
│   ├── en.json
│   ├── zh-CN.json
├── plugins/
│   ├── element-plus.ts
│   ├── vue-i18n.ts
├── router/
│   ├── modules/
│   ├── index.ts
├── store/
│   ├── modules/
│   ├── index.ts
├── utils/
│   ├── auth.ts
│   ├── request.ts
│   ├── index.ts
├── views/
│   ├── Dashboard/
│   │   ├── Dashboard.vue
│   │   ├── components/
│   ├── User/
│   │   ├── UserList.vue
│   │   ├── UserDetail.vue
└── App.vue
└── main.ts
```

#### 3.2 创建 `tsconfig.json` 配置文件

在项目根目录下创建或修改 `tsconfig.json` 配置文件，确保项目使用 TypeScript 并支持 Vue 文件。

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "allowJs": true,
    "resolveJsonModule": true,
    "jsx": "preserve",
    "lib": ["esnext", "dom"],
    "types": ["vite/client", "node"],
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.d.ts",
    "src/**/*.tsx",
    "src/**/*.vue"
  ]
}
```

#### 3.3 配置 Vite

在项目根目录下创建 `vite.config.ts`，配置 Vite 和相关插件：

```ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
  },
});
```

---

### 4. **设置项目中的基本功能模块**

#### 4.1 API 请求封装 (`src/api/`)

在 `src/api/modules/` 下创建 `auth.ts` 和 `user.ts` 文件，封装用户认证和用户管理的接口。

- `auth.ts` 示例：

```ts
import axios from 'axios';

export const login = (username: string, password: string) => {
  return axios.post('/api/login', { username, password });
};

export const logout = () => {
  return axios.post('/api/logout');
};
```

- `user.ts` 示例：

```ts
import axios from 'axios';

export const getUserList = () => {
  return axios.get('/api/users');
};

export const getUserDetail = (userId: number) => {
  return axios.get(`/api/users/${userId}`);
};
```

#### 4.2 路由配置 (`src/router/`)

在 `src/router/modules/` 下创建路由文件，比如 `dashboard.ts` 和 `user.ts`。

- `dashboard.ts` 示例：

```ts
import { RouteRecordRaw } from 'vue-router';
import Dashboard from '@/views/Dashboard/Dashboard.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
  },
];

export default routes;
```

#### 4.3 状态管理 (`src/store/`)

在 `src/store/modules/` 下创建状态管理模块，比如 `user.ts` 和 `app.ts`。

- `user.ts` 示例：

```ts
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    username: '',
  }),
  actions: {
    setUsername(username: string) {
      this.username = username;
    },
  },
});
```

#### 4.4 国际化配置 (`src/locales/`)

在 `src/locales/` 下创建 `en.json` 和 `zh-CN.json` 文件。

- `en.json` 示例：

```json
{
  "login": "Login",
  "username": "Username",
  "password": "Password"
}
```

- `zh-CN.json` 示例：

```json
{
  "login": "登录",
  "username": "用户名",
  "password": "密码"
}
```

#### 4.5 根组件配置 (`src/App.vue`)

```vue
<template>
  <router-view />
</template>

<script lang="ts">
export default {
  name: 'App',
};
</script>

<style scoped>
/* 全局样式 */
</style>
```

#### 4.6 入口文件 (`src/main.ts`)

```ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ElementPlus);

app.mount('#app');
```

---

### 5. **运行项目**

#### 5.1 启动开发环境

```bash
npm run dev
```

项目将在 `http://localhost:3000` 上运行。

#### 5.2 打包项目

```bash
npm run build
```

打包后的文件将生成在 `dist` 目录下。

#### 5.3 代码检查和修复

使用 ESLint 和 Prettier 对代码进行检查和修复。

```bash
npm run lint
```

---

### 6. **总结**

在本教程中，我们成功搭建了一个基于 Vue 3、TypeScript 和 Element Plus 的后台管理系统模板。我们配置了项目结构、安装了相关依赖，并实现了常用功能模块，如 API 请求封装、路由配置、状态管理、国际化等。通过 `Vite` 提供的快速构建工具，开发效率得到了显著提升。

接下来，你可以根据实际需求扩展功能模块，完善项目，进行开发。