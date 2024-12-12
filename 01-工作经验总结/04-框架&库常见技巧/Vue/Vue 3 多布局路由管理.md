# Vue 3 多布局路由管理

在 Vue 3 项目中，使用多布局可以方便地管理不同页面的展示结构，如后台管理页面和前台展示页面使用不同的导航和布局。

以下是实现多布局路由的完整方法：

---

## 1. 路由结构设计
通过 `children` 定义嵌套路由，每种布局对应一个 `Layout` 组件。

### 示例代码
```javascript
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'), // 主站布局
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('@/views/About.vue'),
      },
    ],
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'), // 后台管理布局
    children: [
      {
        path: '',
        name: 'AdminHome',
        component: () => import('@/views/admin/Dashboard.vue'),
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('@/views/admin/Users.vue'),
      },
    ],
  },
  {
    path: '/auth',
    component: () => import('@/layouts/AuthLayout.vue'), // 认证页面布局
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/auth/Login.vue'),
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/auth/Register.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
```

---

## 2. 布局组件设计
每种布局对应一个独立的组件，用于包裹子页面的内容。

### 示例代码

#### MainLayout.vue
```vue
<template>
  <div>
    <header>Main Header</header>
    <main>
      <router-view /> <!-- 渲染子路由 -->
    </main>
    <footer>Main Footer</footer>
  </div>
</template>
```

#### AdminLayout.vue
```vue
<template>
  <div>
    <aside>Admin Sidebar</aside>
    <header>Admin Header</header>
    <main>
      <router-view /> <!-- 渲染子路由 -->
    </main>
  </div>
</template>
```

#### AuthLayout.vue
```vue
<template>
  <div>
    <main>
      <router-view /> <!-- 渲染子路由 -->
    </main>
  </div>
</template>
```

---

## 3. 导航守卫（可选）
通过全局导航守卫控制用户访问权限，例如限制未登录用户访问后台管理页面。

### 示例代码
```javascript
router.beforeEach((to, from, next) => {
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  if (to.path.startsWith('/admin') && !isAuthenticated) {
    // 如果未登录并尝试访问后台，重定向到登录页
    next({ name: 'Login' });
  } else {
    next();
  }
});
```

---

## 4. 动态加载布局（进阶方案）
通过 `meta` 字段为每个页面动态指定布局组件。

### 示例代码

#### 路由定义
```javascript
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { layout: 'MainLayout' },
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/admin/Dashboard.vue'),
    meta: { layout: 'AdminLayout' },
  },
];
```

#### App.vue
```vue
<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script>
import MainLayout from '@/layouts/MainLayout.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';

export default {
  computed: {
    layout() {
      const layoutName = this.$route.meta.layout || 'MainLayout';
      return layoutName === 'MainLayout' ? MainLayout : AdminLayout;
    },
  },
};
</script>
```

---

## 优势
- **清晰的结构**：每种布局对应一个组件，易于维护。
- **灵活性**：支持动态选择布局，满足复杂需求。
- **可扩展性**：通过 `meta` 字段动态控制布局，适合大型项目。

如需进一步扩展或调整，欢迎讨论！

