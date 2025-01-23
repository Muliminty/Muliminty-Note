# Svelte.js 入门指南

## 引言
在前端开发领域，Svelte.js 以其独特的编译时优化和简洁的语法，迅速成为开发者关注的焦点。与 React、Vue.js 等传统框架不同，Svelte 在构建阶段将组件代码编译为高效的原生 JavaScript 代码，从而减少运行时的开销。本文将重点介绍 Svelte 的核心用法，帮助你快速上手并体验其魅力。

---

## 1. 安装与初始化

### (1) 安装 Svelte
使用以下命令创建一个新的 Svelte 项目：
```bash
npx degit sveltejs/template my-svelte-project
cd my-svelte-project
npm install
```

### (2) 启动开发服务器
```bash
npm run dev
```
打开浏览器访问 `http://localhost:5000`，即可看到默认的 Svelte 应用。

---

## 2. 组件基础

### (1) 组件结构
一个 Svelte 组件由三部分组成：
- `<script>`：JavaScript 逻辑。
- `<style>`：CSS 样式（默认作用域为当前组件）。
- HTML 模板。

示例：
```svelte
<script>
  let name = 'Svelte';
</script>

<style>
  h1 {
    color: #ff3e00;
  }
</style>

<h1>Hello {name}!</h1>
```

### (2) 响应式数据
Svelte 的响应式系统非常直观，只需使用 `$:` 标记即可实现响应式变量。

示例：
```svelte
<script>
  let count = 0;

  $: doubled = count * 2;
</script>

<button on:click={() => count += 1}>
  点击次数：{count}，双倍：{doubled}
</button>
```

---

## 3. 事件绑定

### (1) 绑定 DOM 事件
使用 `on:` 指令绑定 DOM 事件。

示例：
```svelte
<script>
  let count = 0;

  function increment() {
    count += 1;
  }
</script>

<button on:click={increment}>
  点击次数：{count}
</button>
```

### (2) 事件修饰符
Svelte 支持事件修饰符，如 `preventDefault`、`stopPropagation` 等。

示例：
```svelte
<button on:click|preventDefault={increment}>
  点击我（阻止默认行为）
</button>
```

---

## 4. 状态管理

### (1) 组件内状态
在组件内直接声明变量即可管理状态。

示例：
```svelte
<script>
  let name = 'Svelte';
</script>

<input bind:value={name} />
<p>Hello, {name}!</p>
```

### (2) 全局状态（Store）
Svelte 提供了 `writable`、`readable` 和 `derived` 等 API 来管理全局状态。

示例：
```svelte
<script>
  import { writable } from 'svelte/store';

  const count = writable(0);

  function increment() {
    count.update(n => n + 1);
  }
</script>

<button on:click={increment}>
  点击次数：{$count}
</button>
```

---

## 5. 条件与循环

### (1) 条件渲染
使用 `{#if}` 和 `{:else}` 实现条件渲染。

示例：
```svelte
<script>
  let isLoggedIn = false;
</script>

{#if isLoggedIn}
  <p>欢迎回来！</p>
{:else}
  <p>请登录。</p>
{/if}
```

### (2) 循环渲染
使用 `{#each}` 实现循环渲染。

示例：
```svelte
<script>
  let items = ['Apple', 'Banana', 'Cherry'];
</script>

<ul>
  {#each items as item}
    <li>{item}</li>
  {/each}
</ul>
```

---

## 6. 生命周期

Svelte 提供了以下生命周期函数：
- `onMount`：组件挂载时执行。
- `onDestroy`：组件销毁时执行。
- `beforeUpdate` 和 `afterUpdate`：组件更新前后执行。

示例：
```svelte
<script>
  import { onMount } from 'svelte';

  onMount(() => {
    console.log('组件已挂载');
  });
</script>
```

---

## 7. 动画与过渡

Svelte 内置了强大的动画和过渡支持，使用 `transition` 和 `animate` 指令即可实现。

示例：
```svelte
<script>
  import { fade } from 'svelte/transition';
  let visible = true;
</script>

<button on:click={() => visible = !visible}>
  切换显示
</button>

{#if visible}
  <p transition:fade>这是一个淡入淡出的效果</p>
{/if}
```

---

## 8. 组件通信

### (1) Props
父组件通过 `export` 关键字向子组件传递数据。

父组件：
```svelte
<script>
  import Child from './Child.svelte';
  let message = 'Hello from Parent';
</script>

<Child {message} />
```

子组件：
```svelte
<script>
  export let message;
</script>

<p>{message}</p>
```

### (2) 事件派发
子组件通过 `createEventDispatcher` 向父组件派发事件。

子组件：
```svelte
<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  function notify() {
    dispatch('notify', { detail: 'Hello from Child' });
  }
</script>

<button on:click={notify}>通知父组件</button>
```

父组件：
```svelte
<script>
  import Child from './Child.svelte';

  function handleNotify(event) {
    alert(event.detail);
  }
</script>

<Child on:notify={handleNotify} />
```

---

## 9. 进阶用法

### (1) SvelteKit
SvelteKit 是 Svelte 的官方框架，支持路由、服务端渲染（SSR）、静态站点生成（SSG）等功能。

### (2) 第三方库
Svelte 社区提供了丰富的第三方库，如：
- **Svelte Material UI**：Material Design 组件库。
- **Svelte Router**：轻量级路由库。

---

## 结语

Svelte.js 以其简洁的语法和高效的性能，正在成为前端开发的重要选择。通过本文的介绍，你应该已经掌握了 Svelte 的核心用法。如果你还没有尝试过 Svelte，不妨从一个小项目开始，体验它的魅力！

---

**参考链接：**
- [Svelte 官方文档](https://svelte.dev/)
- [SvelteKit 官方文档](https://kit.svelte.dev/)
- [Svelte 中文社区](https://www.sveltejs.cn/)

希望这篇博客能帮助你快速上手 Svelte.js！如果你有任何问题或想法，欢迎在评论区分享！