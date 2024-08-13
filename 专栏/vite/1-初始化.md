# 使用 Vite 全局安装并创建 React 项目：详细过程

Vite 是一个新兴的前端构建工具，以其快速的启动速度和高效的构建性能受到了广泛关注。本文将详细介绍如何全局安装 Vite，并使用它创建一个 React 项目。我们将从安装 Vite 开始，逐步完成项目的配置和构建。

## 1. 安装 Vite

### 1.1 安装 Node.js

在开始之前，请确保你的计算机上已经安装了 Node.js。可以通过以下命令检查 Node.js 是否已安装：

```bash
node -v
```

如果 Node.js 尚未安装，请访问 [Node.js 官网](https://nodejs.org/) 下载并安装适合你操作系统的版本。

### 1.2 全局安装 Vite

打开终端或命令提示符，执行以下命令全局安装 Vite：

```bash
npm install -g create-vite
```

或者使用 Yarn 进行全局安装：

```bash
yarn global add create-vite
```

## 2. 创建 React 项目

### 2.1 使用 Vite 创建新项目

全局安装完成后，你可以使用 Vite 创建新的 React 项目。使用以下命令：

```bash
create-vite my-react-app --template react
```

这里 `my-react-app` 是你的项目名称，你可以根据需要更改为其他名称。`--template react` 参数指定使用 React 模板创建项目。

### 2.2 进入项目目录

创建完成后，进入项目目录：

```bash
cd my-react-app
```

### 2.3 安装依赖

在项目目录中，执行以下命令安装项目依赖：

```bash
npm install
```

或者使用 Yarn：

```bash
yarn
```

## 3. 配置和开发

### 3.1 运行开发服务器

使用以下命令启动开发服务器：

```bash
npm run dev
```

或者使用 Yarn：

```bash
yarn dev
```

在浏览器中打开 `http://localhost:5173`，你将看到 Vite 启动的 React 应用。

### 3.2 编辑代码

在 `src` 目录下，你可以找到 `App.jsx` 和其他 React 组件。打开 `src/App.jsx` 文件，进行代码编辑。例如，你可以修改 `App.jsx` 文件如下：

```jsx
import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to My React App!</h1>
      </header>
    </div>
  );
}

export default App;
```

### 3.3 使用其他功能

Vite 支持许多现代前端开发功能，例如 CSS 预处理器、TypeScript、环境变量等。你可以根据需要进行配置。

## 4. 构建和部署

### 4.1 构建项目

当你的应用开发完成后，你可以使用以下命令构建生产版本：

```bash
npm run build
```

或者使用 Yarn：

```bash
yarn build
```

构建完成后，构建结果会被输出到 `dist` 目录中。你可以将 `dist` 目录中的文件部署到任何静态文件托管服务上，例如 GitHub Pages、Netlify、Vercel 等。

### 4.2 部署到 GitHub Pages（可选）

如果你想将项目部署到 GitHub Pages，可以按照以下步骤操作：

1. 安装 `gh-pages` 包：

    ```bash
    npm install --save-dev gh-pages
    ```

    或者使用 Yarn：

    ```bash
    yarn add --dev gh-pages
    ```

2. 在 `package.json` 文件中添加以下部署脚本：

    ```json
    "scripts": {
      "predeploy": "npm run build",
      "deploy": "gh-pages -d dist"
    }
    ```

3. 执行以下命令进行部署：

    ```bash
    npm run deploy
    ```

    或者使用 Yarn：

    ```bash
    yarn deploy
    ```

    这会将 `dist` 目录中的文件推送到 `gh-pages` 分支，并将其托管在 GitHub Pages 上。

