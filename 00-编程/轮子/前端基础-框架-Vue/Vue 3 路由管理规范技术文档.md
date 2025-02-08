# **Vue 3 路由管理规范技术文档**

## **概述**
本技术文档旨在规范 Vue 3 项目中路由管理的搭建方式，确保代码的可维护性、可扩展性和易读性。本方案基于 `vue-router`，通过模块化的路由配置和路由守卫实现灵活高效的管理。

---

## **1. 安装依赖**

确保项目中安装了 `vue-router`：

```bash
npm install vue-router
```

---

## **2. 项目目录结构**

推荐的目录结构如下：

```
src/
├── router/                  # 路由管理目录
│   ├── modules/             # 路由模块目录
│   │   ├── auth.ts          # 认证相关路由
│   │   ├── dashboard.ts     # 仪表盘路由
│   │   ├── user.ts          # 用户管理路由
│   ├── index.ts             # 路由主入口
│   ├── guard.ts             # 路由守卫
│
├── views/                   # 页面视图目录
│   ├── Auth/                # 认证模块
│   │   ├── Login.vue        # 登录页面
│   │   ├── Register.vue     # 注册页面
│   ├── Dashboard/           # 仪表盘模块
│   │   ├── Dashboard.vue    # 仪表盘页面
│   ├── User/                # 用户模块
│   │   ├── UserList.vue     # 用户列表页面
│   │   ├── UserDetail.vue   # 用户详情页面
```

---

## **3. 路由配置**

### **3.1 主路由文件**

在 `src/router/index.ts` 中创建路由主入口，统一管理路由和守卫：

```typescript
import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './modules'; // 导入模块化路由
import setupGuards from './guard';  // 路由守卫

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // HTML5 模式
  routes,
});

// 应用路由守卫
setupGuards(router);

export default router;
```

---

### **3.2 模块化路由**

将路由拆分成多个模块，存放在 `src/router/modules/` 目录下。

#### **auth.ts**
```typescript
import { RouteRecordRaw } from 'vue-router';

const authRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Auth/Login.vue'), // 懒加载组件
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Auth/Register.vue'),
  },
];

export default authRoutes;
```

#### **dashboard.ts**
```typescript
import { RouteRecordRaw } from 'vue-router';

const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard/Dashboard.vue'),
    meta: { requiresAuth: true }, // 路由元信息
  },
];

export default dashboardRoutes;
```

#### **user.ts**
```typescript
import { RouteRecordRaw } from 'vue-router';

const userRoutes: RouteRecordRaw[] = [
  {
    path: '/users',
    name: 'UserList',
    component: () => import('@/views/User/UserList.vue'),
  },
  {
    path: '/users/:id',
    name: 'UserDetail',
    component: () => import('@/views/User/UserDetail.vue'),
    props: true, // 路由参数作为 props 传入
  },
];

export default userRoutes;
```

#### **模块统一导出**

在 `src/router/modules/index.ts` 中统一管理模块化路由：

```typescript
import authRoutes from './auth';
import dashboardRoutes from './dashboard';
import userRoutes from './user';

export const routes = [
  ...authRoutes,
  ...dashboardRoutes,
  ...userRoutes,
];
```

---

### **3.3 路由守卫**

路由守卫用于控制路由访问权限，配置文件放在 `src/router/guard.ts`：

```typescript
import { Router } from 'vue-router';

export default function setupGuards(router: Router) {
  router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('token'); // 假设通过 token 判断登录状态

    if (to.meta.requiresAuth && !isAuthenticated) {
      next('/login'); // 未登录时跳转到登录页
    } else {
      next(); // 放行
    }
  });
}
```

---

## **4. Vue 应用中注册路由**

在 `src/main.ts` 中注册路由实例：

```typescript
import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // 引入路由实例

const app = createApp(App);

app.use(router); // 注册路由
app.mount('#app');
```

---

## **5. 路由的使用**

### **5.1 路由导航**

在模板中使用 `<router-link>` 实现页面跳转：

```vue
<template>
  <nav>
    <router-link to="/dashboard">Dashboard</router-link>
    <router-link to="/users">Users</router-link>
  </nav>
</template>
```

### **5.2 路由视图**

使用 `<router-view>` 渲染页面内容：

```vue
<template>
  <div>
    <router-view />
  </div>
</template>
```

---

## **6. 扩展功能**

### **6.1 动态路由加载**

动态加载权限路由示例：

```typescript
router.addRoute({
  path: '/admin',
  name: 'Admin',
  component: () => import('@/views/Admin.vue'),
});
```

### **6.2 通配符和重定向**

处理未匹配路由和默认跳转：

```typescript
const routes = [
  {
    path: '/:pathMatch(.*)*', // 404 页面
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
  },
  {
    path: '/',
    redirect: '/dashboard', // 默认重定向到仪表盘
  },
];
```

---

## **7. 总结**

通过本方案，你可以实现以下功能：
1. **模块化**：按功能划分路由，增强代码的可维护性。
2. **权限控制**：结合路由守卫轻松实现登录验证和权限管理。
3. **灵活扩展**：支持动态加载路由和元信息控制。

本方案适用于中大型 Vue 3 项目，能有效提升开发效率并降低复杂性。