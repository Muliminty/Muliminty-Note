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

---

## 4. 开发工具推荐

### VS Code 插件
- **ES7+ React/Redux/React-Native snippets**：快速生成 React 组件代码
- **Tailwind CSS IntelliSense**：Tailwind 类名自动补全
- **Error Lens**：实时显示代码错误
- **Prettier**：代码格式化

### 浏览器扩展
- **React Developer Tools**：调试 React 组件
- **Next.js DevTools**：Next.js 专用调试工具

---

## 5. 常见问题排查

### 问题 1：端口 3000 被占用
```bash
# 方法1：使用其他端口
npm run dev -- -p 3001

# 方法2：查找并关闭占用端口的进程（macOS/Linux）
lsof -ti:3000 | xargs kill -9
```

### 问题 2：依赖安装失败
```bash
# 清除缓存重新安装
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### 问题 3：TypeScript 类型错误
确保 `tsconfig.json` 配置正确，如果仍有问题，可以尝试：
```bash
# 重启 TypeScript 服务器（VS Code: Cmd+Shift+P -> "TypeScript: Restart TS Server"）
```

---

## 6. 实战练习：创建你的第一个项目

### 练习目标
创建一个简单的个人介绍页面，包含：
- 姓名和头像
- 个人简介
- 技能列表
- 联系方式

### 实现步骤

**步骤 1：修改首页**
```tsx
// src/app/page.tsx
export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">欢迎来到我的个人主页</h1>
        <p className="text-gray-600 mb-8">
          这是一个使用 Next.js 构建的简单页面
        </p>
        
        <section className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">关于我</h2>
          <p className="text-gray-700">
            我是一名前端开发者，正在学习 Next.js 框架。
          </p>
        </section>

        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">技能</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>React</li>
            <li>Next.js</li>
            <li>TypeScript</li>
            <li>Tailwind CSS</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
```

**步骤 2：查看效果**
保存文件后，访问 `http://localhost:3000`，你应该能看到一个简单的个人介绍页面。

---

## 7. 总结

本章我们学习了：
1. ✅ Next.js 解决了 React 的 SEO 和首屏性能问题
2. ✅ 使用 `create-next-app` 快速搭建了项目
3. ✅ 认识了 `App Router` 模式下的文件结构，`page.tsx` 就是页面入口
4. ✅ 创建了第一个简单的页面

**下一步**：在下一章，我们将深入学习项目配置，了解如何自定义 Next.js 的行为。
