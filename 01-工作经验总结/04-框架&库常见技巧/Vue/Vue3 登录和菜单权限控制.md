在 **Vue3** 项目中实现登录和菜单权限控制，通常包括以下几个步骤：

1. **用户登录认证**：用户登录后，需要获取 `token`，并根据该 `token` 来进行身份验证。
2. **菜单权限**：根据用户的权限，动态显示菜单。权限信息通常由后端返回，并且前端需要根据返回的权限信息来展示不同的菜单。
3. **路由权限**：需要根据用户的角色或权限动态控制前端路由的访问权限。
4. **数据权限**：根据用户的权限，控制其对数据的访问。
5. **按钮权限**：控制页面中的按钮是否可以点击，根据权限决定。

以下是一个典型的 **Vue3** 登录和权限管理的实现步骤及代码示例。

### 1. **安装所需的依赖**

首先，确保你已经安装了以下依赖：
- `vue-router`: 用于前端路由管理。
- `pinia`: 用于状态管理（Vue3 推荐使用 Pinia 来代替 Vuex）。
- `axios`: 用于发起 HTTP 请求。
- `element-plus`: 用于 UI 组件。

```bash
npm install vue-router@next pinia axios element-plus
```

### 2. **设置路由管理**

在 `src/router/index.js` 中设置路由，并添加路由守卫进行权限控制。

```javascript
import { createRouter, createWebHistory } from 'vue-router';
import store from '../store'; // 导入 Pinia 状态管理
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }, // 需要认证
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  // 其他路由...
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫，判断是否需要权限
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.state.user.token; // 从 store 获取登录状态
  if (to.meta.requiresAuth && !isAuthenticated) {
    // 如果需要认证且没有登录，则跳转到登录页
    next({ name: 'Login' });
  } else {
    next(); // 允许访问
  }
});

export default router;
```

### 3. **设置状态管理（Pinia）**

在 `src/store/index.js` 中，使用 Pinia 管理用户的认证信息和菜单权限。

```javascript
import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '', // 从 localStorage 获取 token
    menuList: [], // 菜单权限列表
    routes: [], // 动态路由
  }),
  actions: {
    // 登录
    async login(username, password) {
      try {
        const response = await axios.post('/api/login', { username, password });
        this.token = response.data.token;
        localStorage.setItem('token', this.token); // 保存 token 到 localStorage
        await this.fetchMenuPermissions();
      } catch (error) {
        console.error('Login failed', error);
      }
    },

    // 获取菜单权限
    async fetchMenuPermissions() {
      try {
        const response = await axios.get('/api/permissions', {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        this.menuList = response.data.menuList;
        this.routes = this.generateRoutes(this.menuList); // 根据菜单生成动态路由
      } catch (error) {
        console.error('Failed to fetch permissions', error);
      }
    },

    // 生成动态路由
    generateRoutes(menuList) {
      const routes = [];
      menuList.forEach(menu => {
        if (menu.children && menu.children.length) {
          menu.children.forEach(subMenu => {
            routes.push({
              path: subMenu.path,
              name: subMenu.name,
              component: () => import(`../views/${subMenu.component}.vue`), // 动态导入组件
            });
          });
        }
      });
      return routes;
    },

    // 退出登录
    logout() {
      this.token = '';
      localStorage.removeItem('token');
      this.menuList = [];
      this.routes = [];
    },
  },
});
```

### 4. **动态菜单渲染**

在 `src/components/Sidebar.vue` 中，根据用户权限渲染菜单。

```vue
<template>
  <el-menu :default-active="activeMenu">
    <el-submenu v-for="menu in menuList" :key="menu.name" :index="menu.name">
      <template #title>{{ menu.name }}</template>
      <el-menu-item
        v-for="subMenu in menu.children"
        :key="subMenu.name"
        :index="subMenu.name"
        @click="handleMenuClick(subMenu)"
      >
        {{ subMenu.name }}
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
import { useUserStore } from '../store';

export default {
  setup() {
    const store = useUserStore();
    const menuList = store.menuList;

    const handleMenuClick = (subMenu) => {
      this.$router.push({ name: subMenu.name });
    };

    return { menuList, handleMenuClick };
  },
};
</script>
```

### 5. **登录页面**

在 `src/views/Login.vue` 中，创建一个简单的登录页面。

```vue
<template>
  <el-form :model="form" ref="form" @submit.prevent="handleLogin">
    <el-form-item label="Username" :rules="[{ required: true }]">
      <el-input v-model="form.username" />
    </el-form-item>
    <el-form-item label="Password" :rules="[{ required: true }]">
      <el-input type="password" v-model="form.password" />
    </el-form-item>
    <el-button type="primary" native-type="submit">Login</el-button>
  </el-form>
</template>

<script>
import { useUserStore } from '../store';

export default {
  data() {
    return {
      form: {
        username: '',
        password: '',
      },
    };
  },
  setup() {
    const userStore = useUserStore();

    const handleLogin = async () => {
      await userStore.login(this.form.username, this.form.password);
      this.$router.push({ name: 'Home' });
    };

    return { handleLogin };
  },
};
</script>
```

### 6. **根据权限渲染按钮**

在页面中根据权限控制按钮的显示与隐藏：

```vue
<template>
  <el-button v-if="hasPermission('exportData')" type="primary">Export Data</el-button>
</template>

<script>
import { useUserStore } from '../store';

export default {
  setup() {
    const userStore = useUserStore();

    const hasPermission = (permission) => {
      return userStore.menuList.some(menu => menu.permissions.includes(permission));
    };

    return { hasPermission };
  },
};
</script>
```

### 总结

1. **登录**：通过 `POST` 请求向后端发送用户名和密码，获取 `token`，并保存到 `localStorage`。
2. **菜单权限**：根据 `token` 获取用户的菜单权限，动态生成菜单并渲染。
3. **路由权限**：通过 `meta.requiresAuth` 和 `beforeEach` 路由守卫来判断用户是否已登录，若未登录则重定向到登录页面。
4. **按钮权限**：通过前端判断用户的权限来控制按钮是否显示或禁用。

这是一种简单的权限控制方案，适用于大多数基于 Vue3 的后台管理系统。