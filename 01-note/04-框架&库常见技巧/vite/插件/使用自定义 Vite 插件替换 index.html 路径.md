# 使用自定义 Vite 插件替换 index.html 路径

在现代前端开发中，Vite 是一个非常受欢迎的构建工具，特别适合于开发高效的 React 应用。如果你在使用 Vite 构建项目时需要替换 HTML 文件中的路径，你可以通过创建自定义 Vite 插件来实现。本文将详细介绍如何使用自定义 Vite 插件来替换构建后的 HTML 文件中的路径。

#### 1. 背景

在某些情况下，构建后的 HTML 文件中的资源路径需要根据部署环境进行调整。例如，当你将应用部署到 GitHub Pages 时，应用的根路径可能会有所不同，因此需要替换 HTML 文件中的资源路径。通过使用 Vite 的自定义插件 API，我们可以在构建过程中自动化这个过程。

#### 2. 项目准备

假设你已经有一个使用 Vite 和 React 的项目，并且你希望在构建时自动替换 HTML 文件中的路径。我们将实现一个 Vite 插件，该插件在构建完成后修改生成的 HTML 文件。

#### 3. 创建自定义 Vite 插件

首先，在项目的根目录下创建一个新的文件 `replaceHtmlPathPlugin.js`，并添加以下内容：

```javascript
// replaceHtmlPathPlugin.js
import fs from 'fs';
import path from 'path';

/**
 * 自定义 Vite 插件，用于替换 HTML 文件中的路径
 * @param {string} basePath - 基础路径
 * @returns {object} 插件对象
 */
function replaceHtmlPathPlugin(basePath) {
  return {
    name: 'replace-html-path', // 插件名称
    closeBundle() {
      // 构建完成后执行
      const indexPath = path.resolve('dist', 'index.html');
      let content = fs.readFileSync(indexPath, 'utf-8');
      // 替换路径中的 /src/ 为 basePath + src/
      content = content.replace(/src="\/src\//g, `src="${basePath}src/`);
      fs.writeFileSync(indexPath, content);
    }
  };
}

export default replaceHtmlPathPlugin;
```

#### 4. 配置 Vite 使用自定义插件

接下来，我们需要在 `vite.config.js` 文件中配置使用自定义插件。确保你已经安装了 `fs` 和 `path` 模块（这些模块是 Node.js 的核心模块，所以通常不需要单独安装）。

在项目的根目录下打开或创建 `vite.config.js` 文件，并添加以下内容：

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import envConfig from './env'; // 加载环境配置
import replaceHtmlPathPlugin from './replaceHtmlPathPlugin'; // 导入自定义插件

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = envConfig[mode]; // 获取环境配置
  return {
    base: env.VITE_BASE_URL, // 设置基础路径
    plugins: [
      react(),
      replaceHtmlPathPlugin(env.VITE_BASE_URL) // 使用自定义插件
    ]
  };
});
```

#### 5. 如何工作

- **`replaceHtmlPathPlugin`**：这是我们自定义的 Vite 插件，用于替换生成的 `index.html` 文件中的路径。
  - `name`: 插件的名称，用于标识插件。
  - `closeBundle()`: 这是插件的核心方法，在构建完成后执行。它读取 `dist/index.html` 文件，替换其中的路径，并将修改后的内容写回文件。

- **Vite 配置**：在 Vite 的配置文件 `vite.config.js` 中，我们通过 `plugins` 选项将自定义插件添加到构建流程中。插件会在构建完成后自动执行，修改生成的 HTML 文件。

#### 6. 验证

完成配置后，运行 Vite 构建命令：

```sh
npm run build
```

构建完成后，检查 `dist/index.html` 文件中的路径是否已经被正确替换为你的基础路径。

#### 7. 总结

通过创建自定义 Vite 插件，我们可以在构建过程中自动修改 HTML 文件中的路径，以适应不同的部署环境。这种方法不仅可以简化手动操作，还可以确保每次构建后生成的文件都符合预期的路径结构。

希望这篇技术博客能够帮助你顺利实现项目的路径替换功能。如果你有任何问题或建议，欢迎在评论区留言讨论。Happy coding! 🎉