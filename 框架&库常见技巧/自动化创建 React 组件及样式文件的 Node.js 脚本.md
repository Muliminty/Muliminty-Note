
### 自动化创建 React 组件及样式文件的 Node.js 脚本

在前端开发中，自动化脚本可以极大地提高开发效率。本技术文档将介绍一个用 Node.js 实现的自动化脚本，它可以根据用户输入的组件名称自动创建 React 组件及其样式文件，并将它们放置在指定的目录结构中。

#### 1. 目的

本文档旨在介绍如何使用 Node.js 脚本来自动生成 React 组件及其样式文件。通过该脚本，开发者可以简化页面组件的创建过程，并确保文件命名的一致性。

#### 2. 实现原理

脚本使用 Node.js 的核心模块 `fs` 和 `path` 进行文件系统操作，利用 `readline` 模块与用户交互。脚本中包括两个主要功能：
- 转换组件名称为大驼峰（PascalCase）和小驼峰（camelCase）格式。
- 根据用户输入生成对应的 React 组件文件和样式文件。

#### 3. 核心代码

以下是实现该功能的 Node.js 脚本代码：

```javascript
const fs = require('fs');
const path = require('path');
const readline = require('readline');

/**
 * 将字符串中的连字符或空格去除，并将每个单词的首字母转换为大写字母，形成大驼峰命名法（PascalCase）。
 * @param {string} str - 要转换的字符串，可以包含连字符或空格。
 * @returns {string} 转换后的大驼峰命名字符串。
 */
const toPascalCase = (str) => {
  return str
    .split(/[\s\-]/) // 按空格或连字符分割字符串
    .filter(Boolean) // 过滤掉空字符串
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // 将每个单词首字母大写
    .join(''); // 连接成大驼峰格式
};

/**
 * 将字符串中的连字符或空格去除，并将每个单词的首字母转换为大写字母（除了第一个单词），形成小驼峰命名法（camelCase）。
 * @param {string} str - 要转换的字符串，可以包含连字符或空格。
 * @returns {string} 转换后的小驼峰命名字符串。
 */
const toCamelCase = (str) => {
  return str
    .split(/[\s\-]/) // 按空格或连字符分割字符串
    .filter(Boolean) // 过滤掉空字符串
    .map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)) // 第一个单词小写，其余单词首字母大写
    .join(''); // 连接成小驼峰格式
};

// 生成 React 组件的模板代码
/**
 * 生成 React 组件的模板代码。
 * @param {string} name - 组件的名称（大驼峰命名法）。
 * @returns {string} 生成的组件模板代码。
 */
const getComponentTemplate = (name) => `
import React from 'react';

const ${name} = () => {
  return (
    <div className={styles.container}>
      <h1>${name} Page</h1>
    </div>
  );
};

export default ${name};
`;

// 生成样式文件的模板代码
/**
 * 生成样式文件的模板代码。
 * @returns {string} 生成的样式模板代码。
 */
const getStyleTemplate = () => `
.container {
  // 样式代码
}
`;

// 文件模板和路径配置
/**
 * 文件模板和路径配置。
 * @type {Array<{type: string, path: Function, content: Function}>}
 */
const templates = [
  {
    type: 'component',
    path: (name) => path.join(__dirname, '..', 'src', 'page', name, `${toPascalCase(name)}.jsx`),
    content: getComponentTemplate
  },
  {
    type: 'style',
    path: (name) => path.join(__dirname, '..', 'src', 'page', name, 'style.module.scss'),
    content: getStyleTemplate
  }
];

/**
 * 从用户处获取输入并创建页面组件及其样式文件。
 */
const createPage = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('请输入页面组件的名称: ', (rawName) => {
    const componentName = toPascalCase(rawName); // 组件名称（大驼峰）
    const folderName = toCamelCase(rawName); // 目录名称和 .jsx 文件名（小驼峰）

    const pageDir = path.join(__dirname, '..', 'src', 'page', folderName);

    if (!fs.existsSync(pageDir)) {
      fs.mkdirSync(pageDir, { recursive: true }); // 创建目录（如果不存在的话）
    }

    // 生成文件
    templates.forEach(({ type, path: getPath, content }) => {
      const filePath = getPath(folderName); // 获取文件路径
      const fileContent = content(componentName); // 获取文件内容
      fs.writeFileSync(filePath, fileContent, 'utf8'); // 写入文件
      console.log(`已创建 ${type} 文件: ${filePath}`);
    });

    rl.close(); // 关闭 readline 接口
  });
};

createPage(); // 执行创建页面的函数

```

#### 4. 使用说明

1. **安装 Node.js**：确保你的开发环境中已安装 Node.js。

2. **保存脚本**：将上述脚本保存为 `createPage.cjs` 文件，并放置在项目的 `scripts` 文件夹中。如果你的项目配置为 ES 模块（`"type": "module"`），请将文件名改为 `.cjs` 扩展名，以确保 Node.js 能够以 CommonJS 模式加载该脚本。

3. **运行脚本**：
   在终端中运行以下命令来执行脚本：
   ```bash
   node ./scripts/createPage.cjs
   ```
   输入页面组件的名称（例如 `my-new-page`），脚本将自动生成对应的 React 组件和样式文件。

4. **目录结构**：
   脚本将根据输入的名称生成一个目录结构，示例如下：
   ```
   src/
     page/
       myNewPage/
         MyNewPage.jsx
         style.module.scss
   ```

#### 5. 错误处理

- **错误提示**：如果在运行脚本时遇到错误，可能是因为你的项目配置为 ES 模块（`.js` 文件扩展名），而你尝试使用了 CommonJS 模块语法。解决此问题的办法是将脚本文件扩展名改为 `.cjs`，或者将 `package.json` 中的 `"type": "module"` 配置移除。

- **处理未处理的承诺拒绝**：脚本可能会报 `UnhandledPromiseRejectionWarning` 错误。确保在使用 `async` 函数时使用 `.catch()` 方法处理所有的承诺拒绝，或者在 Node.js 启动时使用 `--unhandled-rejections=strict` 标志来严格处理未处理的承诺拒绝。

- **文件或目录不存在**：如果脚本报错提示文件或目录不存在，检查脚本路径和项目结构是否正确，确保 `src/page` 目录存在，并且你具有创建子目录和文件的权限。

