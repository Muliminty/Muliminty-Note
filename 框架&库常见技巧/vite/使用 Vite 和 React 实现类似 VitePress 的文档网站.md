# 使用 Vite 和 React 实现类似 VitePress 的文档网站

## 目标

创建一个基于 Vite 和 React 的文档网站，类似于 VitePress。该网站将支持以下功能：

- **Markdown 渲染**：解析和展示 Markdown 文件内容。
- **文件系统路由**：自动生成基于文件系统的路由。
- **动态导航和侧边栏**：生成文档的导航菜单和侧边栏。
- **热更新**：在开发过程中支持 Markdown 文件的热更新。

## 技术栈

- **Vite**：现代构建工具，用于快速构建和开发。
- **React**：用户界面库，用于构建组件化的应用。
- **React Router**：用于在 React 中处理路由。
- **Markdown-it** 或 **react-markdown**：用于 Markdown 文件的解析和渲染。

## 步骤

### 1. 初始化 Vite + React 项目

首先，创建一个新的 Vite + React 项目：

```bash
npm create vite@latest my-react-docs --template react
cd my-react-docs
npm install
```

### 2. 安装依赖

安装 Markdown 解析和渲染所需的库：

```bash
npm install markdown-it react-markdown react-router-dom
```

### 3. 配置 Vite 支持 Markdown 文件

在 `vite.config.js` 中配置 Vite，以支持 Markdown 文件的加载：

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite 配置
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['markdown-it', 'react-markdown']
  }
});
```

### 4. 创建 Markdown 渲染组件

在 `src` 目录下创建 `MarkdownRenderer.jsx` 文件，用于渲染 Markdown 内容：

```jsx
import React from 'react';
import ReactMarkdown from 'react-markdown';

const MarkdownRenderer = ({ content }) => {
  return <ReactMarkdown>{content}</ReactMarkdown>;
};

export default MarkdownRenderer;
```

### 5. 设置文件系统路由

在 `src` 目录下创建 `App.jsx` 文件，自动生成路由：

```jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import MarkdownRenderer from './MarkdownRenderer';

// 动态导入所有 Markdown 文件
const pages = import.meta.glob('./docs/**/*.md', { eager: true });

const App = () => {
  return (
    <Router>
      <nav>
        <ul>
          {Object.keys(pages).map((path) => (
            <li key={path}>
              <Link to={path.replace('./docs', '').replace('.md', '')}>{path}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <Routes>
        {Object.entries(pages).map(([path, page]) => {
          const Component = () => <MarkdownRenderer content={page.default} />;
          const routePath = path.replace('./docs', '').replace('.md', '');
          return <Route key={path} path={routePath} element={<Component />} />;
        })}
      </Routes>
    </Router>
  );
};

export default App;
```

### 6. 添加 Markdown 文件

在 `src/docs` 目录中添加一些 Markdown 文件。例如，创建 `src/docs/getting-started.md` 文件：

```markdown
# Getting Started

欢迎来到我们的文档站点！

## 介绍

这是一个简单的基于 React 和 Vite 的文档站点。
```

### 7. 热更新支持

Vite 默认支持热更新（HMR）。确保在 `vite.config.js` 中启用了 HMR：

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    hmr: true,
  },
});
```

### 8. 创建主布局组件

为了创建类似 VitePress 的导航和侧边栏，我们可以使用 `Layout.jsx` 作为主布局组件：

```jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => (
  <div className="layout">
    <aside>
      <nav>
        <ul>
          {/* 侧边栏内容可以从 pages 生成 */}
          {/* 这里可以添加更多的导航项 */}
        </ul>
      </nav>
    </aside>
    <main>{children}</main>
  </div>
);

export default Layout;
```

然后在 `App.jsx` 中使用 `Layout` 组件：

```jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import MarkdownRenderer from './MarkdownRenderer';
import Layout from './Layout';

// 动态导入所有 Markdown 文件
const pages = import.meta.glob('./docs/**/*.md', { eager: true });

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {Object.entries(pages).map(([path, page]) => {
            const Component = () => <MarkdownRenderer content={page.default} />;
            const routePath = path.replace('./docs', '').replace('.md', '');
            return <Route key={path} path={routePath} element={<Component />} />;
          })}
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
```

### 9. 样式和布局调整

根据需要，你可以为布局和组件添加 CSS 样式。创建一个 `src/styles.css` 文件，并在 `index.jsx` 中导入：

```css
/* src/styles.css */

.layout {
  display: flex;
}

aside {
  width: 250px;
  background: #f4f4f4;
  padding: 20px;
}

main {
  flex: 1;
  padding: 20px;
}
```

在 `index.jsx` 中导入样式：

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles.css'; // 导入样式

ReactDOM.render(<App />, document.getElementById('root'));
```

## 总结

通过以上步骤，我们创建了一个基于 Vite 和 React 的文档网站，实现了类似 VitePress 的功能。这个网站支持动态生成路由、渲染 Markdown 内容、以及热更新等功能。你可以根据实际需要进一步扩展功能，比如添加搜索功能、主题切换等。

