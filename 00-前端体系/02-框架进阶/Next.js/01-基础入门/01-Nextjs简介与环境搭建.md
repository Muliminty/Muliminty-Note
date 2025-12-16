# 01. Next.js 简介与环境搭建

## 1. 什么是 Next.js？

简单来说，**Next.js = React + 最佳实践 + 服务端能力**。

如果你只用 React (Create React App 或 Vite)，你构建的是一个 **单页应用 (SPA)**。
- 🟢 **优点**：用户体验像原生 App，页面切换流畅。
- 🔴 **缺点**：SEO（搜索引擎优化）差，首屏加载慢（因为要下载完 JS 才能渲染）。

Next.js 通过 **服务端渲染 (SSR)** 等技术解决了这些缺点，同时保留了 React 的开发体验。

### 核心特性一览
| 特性 | 通俗解释 |
| :--- | :--- |
| **文件系统路由** | 不需要写 React Router 配置，文件夹就是路由。创建 `app/about/page.tsx`，就有了 `/about` 页面。 |
| **混合渲染** | 有的页面可以是静态的（快），有的页面可以是动态的（实时）。 |
| **全栈能力** | 你可以在 Next.js 里直接写后端 API，不需要单独开一个 Node.js 服务。 |
| **自动优化** | 图片、字体、脚本，Next.js 都会自动帮你压缩和优化。 |

---

## 2. 环境搭建

### 前置要求
- Node.js 18.17 或更高版本。
- 终端（Terminal/iTerm/PowerShell）。

### 创建项目 (Step-by-Step)

在你想存放项目的目录下，运行以下命令：

```bash
npx create-next-app@latest my-next-app
```

你会看到一系列交互式提问，建议初学者按如下选择（**全选 Yes**）：

```text
TypeScript? ..................... Yes  (强烈推荐，类型安全)
ESLint? ......................... Yes  (代码检查)
Tailwind CSS? ................... Yes  (现代原子化 CSS，用起来很爽)
src/ directory? ................. Yes  (把代码都放在 src 里，目录更干净)
App Router? ..................... Yes  (这是重点！一定要选 Yes)
Import alias (@/*)? ............. Yes  (让引入文件更方便，不用 ../../../)
```

### 启动项目

```bash
# 进入目录
cd my-next-app

# 启动开发服务器
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)，看到 Next.js 的欢迎页面，恭喜你，环境搭建成功！🎉

---

## 3. 项目结构解析

打开项目，你会看到以下核心文件。别被吓到，我们只看最重要的：

```text
my-next-app/
├── node_modules/      # 依赖包（不管它）
├── public/            # 静态资源（放图片、图标的地方，浏览器能直接访问）
├── src/
│   └── app/           # ✨ 核心！你的页面都在这里
│       ├── layout.tsx # 全局布局（HTML骨架、导航栏放在这）
│       ├── page.tsx   # 首页内容（访问 / 显示的内容）
│       └── globals.css# 全局样式
├── next.config.js     # Next.js 的配置文件
├── package.json       # 项目依赖和脚本
└── tsconfig.json      # TypeScript 配置
```

### 动手改一改

打开 `src/app/page.tsx`，把里面的内容全删了，换成下面这段简单的代码：

```tsx
// src/app/page.tsx

// 这是一个 React 组件，也是 Next.js 的一个页面
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">
        Hello, Next.js!
      </h1>
      <p className="mt-4 text-xl text-gray-500">
        这是我的第一个 Next.js 页面。
      </p>
    </main>
  );
}
```

保存文件，浏览器会自动刷新（Hot Reloading）。

## 4. 总结

本章我们学习了：
1. Next.js 解决了 React 的 SEO 和首屏性能问题。
2. 使用 `create-next-app` 快速搭建了项目。
3. 认识了 `App Router` 模式下的文件结构，`page.tsx` 就是页面入口。

下一章，我们将深入了解 Next.js 最强大的特性——**渲染模式**。
