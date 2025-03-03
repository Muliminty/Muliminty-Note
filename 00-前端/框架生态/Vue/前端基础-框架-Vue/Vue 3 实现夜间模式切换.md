以下是基于你提供的项目目录结构，整理的关于夜间模式切换的技术笔记，遵循模块化、可维护性和可扩展性原则。

---

# Vue 3 实现夜间模式切换

### **功能目标**
1. 支持手动切换日间模式和夜间模式。
2. 将用户选择的主题持久化到 `localStorage`。
3. 优先根据用户选择加载主题，但首次访问时根据系统偏好设置默认主题。
4. 使用 CSS 变量动态切换主题，提高性能和样式复用性。

---

### **实现步骤**

#### **1. 配置全局 CSS 变量**
在 `src/assets/styles/variables.scss` 中定义日间和夜间模式的样式变量。

```scss
/* 变量文件：src/assets/styles/variables.scss */
:root {
  /* 日间模式 */
  --background-color: #ffffff;
  --text-color: #000000;
}

[data-theme="dark"] {
  /* 夜间模式 */
  --background-color: #1e1e1e;
  --text-color: #ffffff;
}

/* 应用变量 */
body {
  background-color: var(--background-color);
  color: var(--text-color);
}
```

#### **2. 封装主题逻辑**
创建一个统一管理主题的文件 `src/hooks/useTheme.ts`。

```typescript
import { reactive, onMounted } from "vue";

// 定义主题状态
const theme = reactive({
  current: localStorage.getItem("theme") || "light",
});

// 切换主题
const toggleTheme = () => {
  theme.current = theme.current === "light" ? "dark" : "light";
  applyTheme(theme.current);
};

// 应用主题
const applyTheme = (themeName: string) => {
  document.documentElement.setAttribute("data-theme", themeName);
  localStorage.setItem("theme", themeName);
};

// 初始化主题（优先加载用户选择，其次是系统偏好）
const initTheme = () => {
  const userTheme = localStorage.getItem("theme");
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  theme.current = userTheme || systemTheme;
  applyTheme(theme.current);
};

export const useTheme = () => {
  onMounted(initTheme);
  return { theme, toggleTheme };
};
```

#### **3. 创建全局状态管理（可选）**
如果项目中使用了 `Pinia` 或 `Vuex`，可以将主题状态纳入全局管理。

- 在 `src/store/modules/app.ts` 中：
```typescript
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    theme: localStorage.getItem("theme") || "light",
  }),
  actions: {
    toggleTheme() {
      this.theme = this.theme === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", this.theme);
      localStorage.setItem("theme", this.theme);
    },
    initTheme() {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      this.theme = localStorage.getItem("theme") || systemTheme;
      document.documentElement.setAttribute("data-theme", this.theme);
    },
  },
});
```

#### **4. 在组件中使用**
在全局布局组件 `src/layouts/DefaultLayout.vue` 中集成主题切换功能。

```vue
<script setup>
import { useTheme } from "@/hooks/useTheme"; // 如果使用 Pinia，则引入 useAppStore
const { theme, toggleTheme } = useTheme(); // 或 const appStore = useAppStore();
</script>

<template>
  <header>
    <button @click="toggleTheme">
      {{ theme.current === "light" ? "切换到夜间模式" : "切换到日间模式" }}
    </button>
  </header>
</template>
```

#### **5. 项目初始化时设置默认主题**
在入口文件 `src/main.ts` 中，确保加载默认主题。

```typescript
import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import "@/assets/styles/variables.scss";

const app = createApp(App);

// 如果使用 Pinia
const store = createPinia();
app.use(store);

// 初始化主题（如果使用 hooks，则在组件中完成）
import { useAppStore } from "@/store/modules/app";
const appStore = useAppStore();
appStore.initTheme();

app.mount("#app");
```

---

### **目录结构调整**
为保持项目清晰，可以整理目录如下：
```
├── src/
│   ├── assets/
│   │   ├── styles/
│   │   │   ├── variables.scss       # 全局主题变量
│   │   │   ├── reset.scss           # 样式重置
│   │
│   ├── hooks/
│   │   ├── useTheme.ts              # 封装的主题管理逻辑
│   │
│   ├── store/
│   │   ├── modules/
│   │   │   ├── app.ts               # 状态管理中的主题模块
│   │
│   ├── layouts/
│   │   ├── DefaultLayout.vue        # 集成主题切换的全局布局
│   │
│   ├── main.ts                      # 项目入口，初始化主题
```

---

### **未来扩展**
1. **多主题支持**：
   - 扩展 `variables.scss`，支持更多主题（如高对比度模式）。
2. **国际化支持**：
   - 在 `src/locales` 中定义不同语言的主题切换按钮文本。
3. **缓存优化**：
   - 使用服务端渲染时，将主题信息写入初始 HTML。

通过以上方式，可以实现一个灵活、模块化的夜间模式切换功能。