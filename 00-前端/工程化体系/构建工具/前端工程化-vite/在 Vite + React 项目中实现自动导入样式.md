# 在 Vite + React 项目中实现自动导入样式

## 背景：为啥要这么折腾？

作为一名前端开发工程师，我们的日常工作中有很多让人“抓狂”的事情，其中之一就是在每个组件中手动导入样式文件。举个栗子：

```javascript
import styles from './style.module.scss';

const MyComponent = () => (
  <div className={styles.container}>
    Hello World!
  </div>
);
```

根据我们的代码规范，每个组件和它的样式文件必须在同级目录下。于是，每次新建一个组件时，都要重复写这一行 `import styles from './style.module.scss';`。重复劳动不仅容易出错，还会让人怀疑人生。于是，我决定要通过编写一个 Vite 插件，来自动为每个组件引入样式文件，解放双手，提升工作效率！

## 怎么做：撸起袖子加油干

### 1. 创建 Vite 插件

首先，我们需要创建一个 Vite 插件文件，并起一个响亮的名字：`vite-plugin-auto-import-styles.js`。这个插件的作用是在编译每个 `.jsx` 或 `.tsx` 文件时，自动插入 `import styles` 语句。

```javascript
import fs from 'fs';
import path from 'path';

/**
 * Vite 插件，用于自动导入组件同级目录下的样式文件。
 * 
 * @returns {import('vite').Plugin} Vite 插件配置对象
 */
export default function autoImportStyles() {
  return {
    name: 'auto-import-styles',
    
    /**
     * 在 Vite 的编译过程中对代码进行转换。
     * 
     * @param {string} code - 当前正在被处理的文件内容
     * @param {string} id - 当前正在被处理的文件路径
     * @returns {{code: string, map: null} | undefined} 转换后的代码和 source map
     */
    transform(code, id) {
      // 如果文件不是以 .jsx 或 .tsx 结尾，则跳过处理
      if (!id.endsWith('.jsx') && !id.endsWith('.tsx')) return;

      // 解析样式文件的路径
      const stylesPath = path.resolve(path.dirname(id), 'style.module.scss');

      // 如果样式文件存在，则插入导入语句
      if (fs.existsSync(stylesPath)) {
        // 插入 ESLint 禁用注释以避免 'styles' 未定义的报错
        const importStatement = `/* eslint-disable-next-line */\nimport styles from './style.module.scss';\n`;
        return {
          code: importStatement + code, // 将导入语句添加到代码的开头
          map: null, // 不生成 source map
        };
      }

      // 如果样式文件不存在，则返回原始代码
      return { code, map: null };
    },
  };
}

```

### 2. 配置 Vite 使用插件

接下来，我们要把这个插件配置到 Vite 中，让它生效。打开 `vite.config.js`，加入我们的插件配置：

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import autoImportStyles from './vite-plugin-auto-import-styles';

export default defineConfig({
  plugins: [
    react(),
    autoImportStyles(),
  ],
});
```

### 3. 确保样式文件存在

每个组件都需要有一个自己的样式文件。这就像是每个英雄都需要有自己的武器一样。确保你的组件目录中有一个 `style.module.scss` 文件。例如：

```scss
/* style.module.scss */
.example {
  color: red;
}
```

### 4. 组件示例：看看我们的小英雄

现在，我们来看看组件代码是不是变得简单优雅了呢？

```javascript
import React from 'react';

const ExampleComponent = () => {
  return (
    <div className={styles.example}>
      这是一个示例组件。
    </div>
  );
};

export default ExampleComponent;
```

你会发现，我们并没有手动引入 `styles`，但它已经在那里了！

## 为什么这么做：这样做的好处

### 1. 提升开发效率

通过自动引入样式文件，我们可以省去手动导入的麻烦，减少代码重复，提高开发效率。

### 2. 减少错误

手动导入样式文件容易出现遗漏或路径错误，通过自动化可以避免这些问题，让代码更加可靠。

### 3. 代码更简洁

自动化处理后，组件代码变得更加简洁，开发者可以专注于业务逻辑和功能实现，而不必担心样式文件的导入问题。

### 4. 符合代码规范

按照我们公司的代码规范，组件和样式文件必须在同级目录。通过自动化导入样式文件，不仅符合规范，还简化了我们的工作流程。

## 结语

通过这次趣味之旅，我们不仅解决了手动导入样式的烦恼，还让代码变得更加简洁优雅。这就是编写插件的魅力所在，简单几行代码，就能让我们从重复劳动中解放出来。希望这篇博客能给你带来一些启发，也希望大家能享受这种解决问题的乐趣！

如果你也有类似的好点子，别忘了分享给大家哦！让我们一起在编程的世界里探索更多的可能性！


---

补充

要解决 VSCode 中的 'styles' is not defined 报错问题
可以在 ESLint 的配置文件 `.eslintrc.cjs` 中做如下设置：

### 1. 更新 ESLint 配置文件

在 `.eslintrc.cjs` 文件中添加一个规则，专门针对 `styles` 的未定义错误进行配置。由于你使用的是 CommonJS 模块 (`.cjs` 文件)，我们可以通过配置 `globals` 选项来声明 `styles` 为全局变量，或者通过禁用特定的规则来解决问题。

#### 选项 A：声明 `styles` 为全局变量

在 ESLint 配置中声明 `styles` 作为全局变量，这样 ESLint 就不会对 `styles` 未定义进行报错。

```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  globals: {
    styles: 'readonly', // 声明 `styles` 作为全局只读变量
  },
  rules: {
    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}
```

#### 选项 B：禁用 `no-undef` 规则（不推荐）

如果你只想在特定情况下禁用 `no-undef` 规则，可以将其禁用：

```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'no-undef': 'off', // 关闭未定义变量检查（不推荐）
  },
}
```

### 2. VSCode 配置

确保 VSCode 的 ESLint 插件配置一致，不会覆盖你的 ESLint 配置。检查 `.vscode/settings.json` 文件是否有如下配置：

```json
{
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"],
  "eslint.workingDirectories": [{ "mode": "auto" }],
  "eslint.options": {
    "globals": {
      "styles": "readonly"
    }
  }
}
```

### 总结

- **声明 `styles` 为全局变量**：在 ESLint 配置中使用 `globals` 选项，将 `styles` 声明为只读全局变量。
- **禁用 `no-undef` 规则**：虽然不推荐，但如果选择禁用 `no-undef` 规则，确保不会影响其他代码质量检查。

通过这些配置，可以在 ESLint 中处理 `styles` 的未定义问题，同时保持代码的规范性。
