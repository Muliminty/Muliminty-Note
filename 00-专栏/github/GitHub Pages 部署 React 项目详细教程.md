## GitHub Pages 部署 React 项目详细教程

本文将详细介绍如何将一个 React 项目部署到 GitHub Pages 上，并设置支持不同的路由（如 `/a`, `/b`）。本文适合新手，内容将从头到尾一步步指导如何完成部署。

### 前提条件

- 已经在本地搭建好了一个 React 项目。如果你没有现成的 React 项目，可以通过以下命令创建一个新的项目：
  ```bash
  npx create-react-app my-app
  cd my-app
  ```

- 你需要有一个 GitHub 帐号，并且有一个 GitHub 仓库用于存放 React 项目。

### 步骤概览

1. **创建 GitHub 仓库**
2. **安装并配置 `gh-pages`**
3. **修改 `package.json` 配置**
4. **配置 React 路由**
5. **构建并部署到 GitHub Pages**
6. **访问部署的页面**

---

### 1. 创建 GitHub 仓库

首先，在 GitHub 上创建一个新的仓库。这个仓库将用于存放你的 React 项目。

- 登录 GitHub，点击右上角的加号（`+`），选择 `New repository`。
- 给仓库命名，比如 `my-react-app`。
- 不要勾选 `Initialize this repository with a README`（因为我们会将现有项目推送到这个仓库）。
- 点击 `Create repository`。

---

### 2. 安装并配置 `gh-pages`

`gh-pages` 是一个用于将项目部署到 GitHub Pages 的工具，我们需要在项目中安装并配置它。

#### 安装 `gh-pages`

1. 在你的 React 项目根目录中打开命令行（终端）。
2. 运行以下命令安装 `gh-pages`：

   ```bash
   npm install gh-pages --save-dev
   ```

---

### 3. 修改 `package.json` 配置

#### 设置 `homepage` 字段

在你的 `package.json` 文件中，添加 `homepage` 字段。这个字段将告诉 React 项目在 GitHub Pages 上的部署路径。

打开 `package.json` 文件，找到并修改如下：

```json
{
  "homepage": "https://username.github.io/repository-name"
}
```

- `username` 是你的 GitHub 用户名。
- `repository-name` 是你的 GitHub 仓库名称。

例如，如果你的 GitHub 用户名是 `johnDoe`，仓库名是 `my-react-app`，那么 `homepage` 应该是：

```json
"homepage": "https://johnDoe.github.io/my-react-app"
```

#### 配置 `deploy` 脚本

在 `package.json` 中，添加以下脚本来自动化构建和部署过程：

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

- `predeploy`：在部署之前运行 `npm run build`，用于构建生产环境代码。
- `deploy`：将构建好的代码推送到 `gh-pages` 分支。

---

### 4. 配置 React 路由

由于 GitHub Pages 将你的项目部署在子路径下（例如 `/repository-name`），你需要调整 React 路由以支持路径路由。

#### 使用 `BrowserRouter` 和 `basename`

React 路由的 `BrowserRouter` 组件有一个 `basename` 属性，它用来告诉路由从哪个基础路径开始。在 `App.js` 或 `App.tsx` 中，设置 `basename`：

```tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import APage from './pages/APage';
import BPage from './pages/BPage';

function App() {
  return (
    <Router basename="/repository-name"> {/* 设置项目的子路径 */}
      <div>
        <h1>My React App</h1>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/a" element={<APage />} />
          <Route path="/b" element={<BPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
```

- `basename="/repository-name"`：告诉路由从 `/repository-name` 开始，这样所有的路径都会基于该子路径。

这样设置后，当你访问 `https://username.github.io/repository-name/a` 或 `https://username.github.io/repository-name/b` 时，React 路由会根据 `/a` 和 `/b` 路径渲染相应的页面。

---

### 5. 构建并部署到 GitHub Pages

#### 构建项目

运行以下命令生成生产环境代码：

```bash
npm run build
```

这会在项目根目录下创建一个 `build` 文件夹，里面包含了经过优化的生产环境代码。

#### 部署到 GitHub Pages

运行以下命令将 `build` 文件夹的内容推送到 GitHub Pages：

```bash
npm run deploy
```

这条命令会将构建后的文件推送到 `gh-pages` 分支，GitHub Pages 会自动从这个分支加载你的页面。

---

### 6. 访问部署的页面

一旦部署完成，你可以通过以下 URL 访问你的 React 应用：

```
https://username.github.io/repository-name
```

其中 `username` 是你的 GitHub 用户名，`repository-name` 是你的 GitHub 仓库名称。你可以通过不同的路由路径（如 `/a`, `/b`）访问不同的页面：

- `https://username.github.io/repository-name/a`
- `https://username.github.io/repository-name/b`

---

## 总结

通过上述步骤，你可以将 React 项目成功部署到 GitHub Pages 上，并且支持不同的路由：

- 配置 `homepage` 来指定 GitHub Pages 的 URL。
- 使用 `BrowserRouter` 并设置 `basename` 来确保 React 路由能够正确解析路径。
- 使用 `gh-pages` 工具将项目构建并推送到 `gh-pages` 分支。

部署完成后，你的 React 应用就能在 GitHub Pages 上顺利运行，且可以支持多路由访问。

---

### 参考资料

- [GitHub Pages 官方文档](https://docs.github.com/en/pages)
- [React Router 官方文档](https://reactrouter.com/)
- [gh-pages 官方文档](https://www.npmjs.com/package/gh-pages)