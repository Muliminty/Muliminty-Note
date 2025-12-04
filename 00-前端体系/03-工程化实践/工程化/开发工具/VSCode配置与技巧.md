# VSCode 配置与技巧

> VSCode 编辑器配置、插件推荐、快捷键和开发技巧。

---

## 📋 学习目标

- ✅ 掌握 VSCode 的核心配置
- ✅ 理解代码格式化配置
- ✅ 掌握 ESLint 和 Stylelint 集成
- ✅ 了解常用插件和快捷键
- ✅ 掌握工作区配置技巧

---

## 基础配置

### settings.json 位置

**用户配置**：`~/Library/Application Support/Code/User/settings.json` (macOS)

**工作区配置**：`.vscode/settings.json` (项目根目录)

---

## 代码格式化配置

### 全局格式化配置

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.stylelint": "explicit",
    "source.fixAll.eslint": "explicit"
  }
}
```

### 按文件类型配置

#### CSS/Less 配置

```json
{
  "[css]": {
    "editor.defaultFormatter": "stylelint.vscode-stylelint",
    "editor.formatOnSave": true
  },
  "[less]": {
    "editor.defaultFormatter": "stylelint.vscode-stylelint",
    "editor.formatOnSave": true
  }
}
```

#### JavaScript/React 配置

```json
{
  "[javascript]": {
    "editor.formatOnSave": false
  },
  "[javascriptreact]": {
    "editor.formatOnSave": false
  }
}
```

**说明**：
- JavaScript 文件通常使用 ESLint 自动修复，而不是格式化工具
- 格式化由 ESLint 的 `--fix` 功能处理

---

## ESLint 集成

### 基础配置

```json
{
  "eslint.validate": [
    "javascript",
    "javascriptreact"
  ],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

### 高级配置

```json
{
  "eslint.enable": true,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "eslint.format.enable": true,
  "eslint.codeActionsOnSave.mode": "all",
  "eslint.codeActionsOnSave.rules": null
}
```

### 工作区配置示例

```json
{
  "eslint.workingDirectories": [
    "./packages/frontend",
    "./packages/backend"
  ],
  "eslint.options": {
    "overrideConfigFile": ".eslintrc.js"
  }
}
```

---

## Stylelint 集成

### 基础配置

```json
{
  "stylelint.validate": [
    "css",
    "less",
    "scss"
  ],
  "editor.codeActionsOnSave": {
    "source.fixAll.stylelint": "explicit"
  }
}
```

### 高级配置

```json
{
  "stylelint.enable": true,
  "stylelint.validate": [
    "css",
    "less",
    "scss",
    "postcss"
  ],
  "stylelint.snippet": [
    "css",
    "less",
    "scss",
    "postcss"
  ],
  "stylelint.configFile": ".stylelintrc.json"
}
```

---

## 完整配置示例

### 推荐的 settings.json

```json
{
  // 编辑器基础配置
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.stylelint": "explicit",
    "source.fixAll.eslint": "explicit"
  },
  
  // 文件类型特定配置
  "[css]": {
    "editor.defaultFormatter": "stylelint.vscode-stylelint",
    "editor.formatOnSave": true
  },
  "[less]": {
    "editor.defaultFormatter": "stylelint.vscode-stylelint",
    "editor.formatOnSave": true
  },
  "[javascript]": {
    "editor.formatOnSave": false
  },
  "[javascriptreact]": {
    "editor.formatOnSave": false
  },
  
  // ESLint 配置
  "eslint.validate": [
    "javascript",
    "javascriptreact"
  ],
  
  // Stylelint 配置
  "stylelint.validate": [
    "css",
    "less"
  ],
  
  // 其他实用配置
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 1000,
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "files.trimFinalNewlines": true
}
```

---

## 工作区配置

### .vscode/settings.json

项目级别的配置，会覆盖用户配置：

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.workingDirectories": [
    "."
  ]
}
```

### .vscode/extensions.json

推荐团队成员安装的插件：

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "stylelint.vscode-stylelint",
    "esbenp.prettier-vscode"
  ]
}
```

---

## 常用插件推荐

### 代码质量

- **ESLint** (`dbaeumer.vscode-eslint`) - JavaScript/TypeScript 代码检查
- **Stylelint** (`stylelint.vscode-stylelint`) - CSS/Less/SCSS 代码检查
- **Prettier** (`esbenp.prettier-vscode`) - 代码格式化

### 开发效率

- **GitLens** (`eamodio.gitlens`) - Git 增强
- **Path Intellisense** (`christian-kohler.path-intellisense`) - 路径自动补全
- **Auto Rename Tag** (`formulahendry.auto-rename-tag`) - 自动重命名标签

### 主题和图标

- **Material Icon Theme** (`pkief.material-icon-theme`) - 文件图标
- **One Dark Pro** (`zhuangtongfa.material-theme`) - 主题

---

## 快捷键技巧

### 常用快捷键

| 功能 | macOS | Windows/Linux |
|------|-------|---------------|
| 命令面板 | `Cmd + Shift + P` | `Ctrl + Shift + P` |
| 快速打开文件 | `Cmd + P` | `Ctrl + P` |
| 查找替换 | `Cmd + Shift + F` | `Ctrl + Shift + F` |
| 格式化文档 | `Shift + Option + F` | `Shift + Alt + F` |
| 跳转到定义 | `F12` | `F12` |
| 查看引用 | `Shift + F12` | `Shift + F12` |
| 重命名符号 | `F2` | `F2` |
| 多光标 | `Option + Click` | `Alt + Click` |

### 自定义快捷键

在 `keybindings.json` 中配置：

```json
[
  {
    "key": "cmd+shift+l",
    "command": "editor.action.formatDocument"
  },
  {
    "key": "cmd+k cmd+s",
    "command": "workbench.action.files.save"
  }
]
```

---

## 调试配置

### launch.json

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "program": "${workspaceFolder}/index.js",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

---

## 任务配置

### tasks.json

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "npm: build",
      "type": "npm",
      "script": "build",
      "problemMatcher": []
    },
    {
      "label": "npm: test",
      "type": "npm",
      "script": "test",
      "problemMatcher": []
    }
  ]
}
```

---

## 最佳实践

### 1. 项目级配置

- 使用 `.vscode/settings.json` 进行项目特定配置
- 使用 `.vscode/extensions.json` 推荐插件
- 将 `.vscode/` 目录提交到版本控制

### 2. 代码格式化

- 统一使用 ESLint 处理 JavaScript
- 使用 Stylelint 处理 CSS/Less
- 配置 `formatOnSave` 自动格式化

### 3. 团队协作

- 共享工作区配置
- 推荐统一的插件和设置
- 文档化配置说明

### 4. 性能优化

- 禁用不必要的插件
- 配置文件监听排除规则
- 使用工作区配置而非全局配置

---

## 常见问题

### 1. ESLint 不生效

**检查**：
- 插件是否安装
- `.eslintrc` 文件是否存在
- `eslint.validate` 配置是否正确

### 2. 格式化冲突

**解决**：
- 统一使用 ESLint 或 Prettier
- 配置 `editor.defaultFormatter`
- 禁用冲突的格式化工具

### 3. 保存时自动修复不工作

**检查**：
- `editor.codeActionsOnSave` 配置
- ESLint/Stylelint 插件是否启用
- 文件类型是否在 `validate` 列表中

---

## 相关链接

- [VSCode 官方文档](https://code.visualstudio.com/docs)
- [ESLint 插件文档](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Stylelint 插件文档](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)
- [工程化 MOC](../!MOC-工程化.md)

---

**最后更新**：2025

---

#VSCode #编辑器 #开发工具 #工程化

