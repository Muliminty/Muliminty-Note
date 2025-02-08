# Vue 动态布局实现

在 Vue 项目中，动态切换页面布局是一种常见的需求。例如：在不同页面展示不同的布局（如管理后台布局和普通页面布局）。本文整理了如何通过扩展的方式动态切换布局，代码结构清晰，易于维护。

---

## 需求分析

我们希望根据路由的 `meta.layout` 字段动态选择布局，例如：
- `MainLayout` 作为普通页面的默认布局。
- `AdminLayout` 作为管理员页面的特殊布局。

最终目标：
- 提供统一的动态布局逻辑。
- 避免在每个组件中重复定义 `layout` 计算属性。
- 简化布局扩展和维护。

---

## 实现步骤

### 1. 路由配置支持 `meta.layout`

在 `router/index.ts` 中为每个路由定义 `meta.layout` 属性：

```ts
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { layout: 'MainLayout' }, // 普通页面布局
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/Admin.vue'),
    meta: { layout: 'AdminLayout' }, // 管理员页面布局
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
```

通过 `meta.layout` 指定每个页面使用的布局。

---

### 2. 在 `main.ts` 中定义全局布局逻辑

通过 Vue 的 `app.mixin` 扩展全局的布局逻辑，动态返回布局组件。

#### 修改 `main.ts`：

```ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import DefaultLayout from '@/layouts/defaultLayout/index.vue';
import AdminLayout from '@/layouts/empty/index.vue';

const app = createApp(App);

// 添加全局布局逻辑
app.mixin({
  computed: {
    layout() {
      const layoutMap = {
        MainLayout: DefaultLayout,
        AdminLayout: AdminLayout,
      };

      // 根据路由 `meta.layout` 动态返回布局
      const layoutName = this.$route?.meta?.layout || 'MainLayout';
      return layoutMap[layoutName] || DefaultLayout;
    },
  },
});

app.use(router).mount('#app');
```

#### 逻辑说明：
- 定义了一个 `layoutMap`，用来映射布局名称到布局组件。
- 通过 `this.$route.meta.layout` 获取当前路由指定的布局名称，默认返回 `MainLayout`。
- 将逻辑封装在全局 `mixin` 中，所有页面都能共享 `layout` 计算属性。

---

### 3. 修改 `App.vue`

`App.vue` 作为根组件，动态渲染布局组件，并在布局组件内部使用 `router-view` 展示页面内容。

#### 修改后的 `App.vue`：

```vue
<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script setup lang="ts">
// 不需要额外逻辑，布局通过全局 mixin 动态提供
</script>

<style scoped>
/* 全局样式或 App 级别样式可定义在此处 */
</style>
```

#### 逻辑说明：
- 使用 Vue 动态组件 `<component :is="layout">`，根据 `layout` 渲染对应的布局。
- `layout` 属性由全局 `mixin` 提供，直接共享，无需每个页面重复定义。

---

### 4. 布局组件定义

#### 示例布局组件：

**`MainLayout`**
```vue
<template>
  <div class="main-layout">
    <header>Main Header</header>
    <main>
      <slot />
    </main>
    <footer>Main Footer</footer>
  </div>
</template>

<script setup lang="ts">
// 可根据需求定义额外逻辑
</script>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
</style>
```

**`AdminLayout`**
```vue
<template>
  <div class="admin-layout">
    <aside>Sidebar</aside>
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
// 可根据需求定义额外逻辑
</script>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
}

.admin-layout aside {
  width: 200px;
  background-color: #333;
  color: #fff;
}

.admin-layout main {
  flex: 1;
  padding: 20px;
}
</style>
```

---

## 可扩展性

### 添加新布局

如果需要扩展新的布局，只需：
1. 定义新的布局组件，例如 `UserLayout`。
2. 在 `main.ts` 的 `layoutMap` 中添加映射：

```ts
const layoutMap = {
  MainLayout: DefaultLayout,
  AdminLayout: AdminLayout,
  UserLayout: UserLayout, // 新布局
};
```
3. 在路由 `meta` 中配置对应的布局名称：

```ts
{
  path: '/user',
  name: 'User',
  component: () => import('@/views/User.vue'),
  meta: { layout: 'UserLayout' },
}
```

---

## 总结

通过扩展的方式实现动态布局，有以下优势：

1. **全局可复用性**：布局逻辑通过 `mixin` 提供，全局共享，无需重复定义。
2. **灵活扩展性**：布局组件和路由 `meta` 配置相互独立，可轻松扩展新布局。
3. **简洁易维护**：主逻辑集中在 `main.ts` 中，代码清晰简洁，易于定位和维护。

适用于需要多个布局切换的大型 Vue 项目。

