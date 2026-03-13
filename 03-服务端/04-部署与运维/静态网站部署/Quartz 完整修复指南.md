# Quartz 完整修复指南

> 本指南涵盖 Quartz 笔记网站的完整安装、配置、使用和问题修复流程

---

## 📋 目录

- [一、环境准备](#一环境准备)
- [二、安装依赖](#二安装依赖)
- [三、项目初始化](#三项目初始化)
- [四、配置文件说明](#四配置文件说明)
- [五、本地开发](#五本地开发)
- [六、修复图片路径问题](#六修复图片路径问题)
- [七、修复双链路径问题](#七修复双链路径问题)
- [八、GitHub Actions 自动部署](#八github-actions-自动部署)
- [九、常见问题](#九常见问题)
- [十、快速参考](#十快速参考)

---

## 一、环境准备

### 1.1 系统要求

- **Node.js**：版本 22+（推荐 22.17.0）
- **npm**：版本 10.9.2+（推荐 11.4.2）
- **Git**：用于版本控制
- **操作系统**：macOS、Linux 或 Windows

### 1.2 检查环境

```bash
# 检查 Node.js 版本
node --version  # 应该显示 v22.x.x

# 检查 npm 版本
npm --version  # 应该显示 10.x.x 或更高

# 检查 Git 版本
git --version
```

---

## 二、安装依赖

### 2.1 创建 package.json

创建 `package.json` 文件，内容如下：

```json
{
  "name": "muliminty-note",
  "version": "1.0.0",
  "description": "全栈开发知识体系学习笔记",
  "scripts": {
    "dev": "node scripts/dev.js",
    "build": "./scripts/build.sh",
    "preview": "npx quartz build --serve --port 4399 -d . && node scripts/fix-image-paths.js",
    "fix": "node scripts/fix-image-paths.js"
  },
  "dependencies": {
    "quartz": "github:jackyzha0/quartz#v4"
  },
  "devDependencies": {
    "@types/node": "^20.0.0"
  }
}
```

**重要说明**：
- ✅ **必须从 GitHub 安装**：`"quartz": "github:jackyzha0/quartz#v4"`
- ❌ **不要使用**：`"quartz": "^4.4.0"`（npm 上不存在）
- ❌ **不需要单独的插件包**：所有插件都是 Quartz 内置的

### 2.2 安装依赖

```bash
# 安装依赖
npm install
```

**预期输出**：
```
added 518 packages, and audited 519 packages
found 0 vulnerabilities
```

### 2.3 创建必要的符号链接

Quartz 需要 `quartz` 目录指向 `node_modules/quartz/quartz`：

```bash
# 创建符号链接
ln -s node_modules/quartz/quartz quartz
```

**验证**：
```bash
ls -la quartz
# 应该显示：quartz -> node_modules/quartz/quartz
```

---

## 三、项目初始化

### 3.1 创建配置文件

#### 3.1.1 quartz.config.ts

创建 `quartz.config.ts` 文件，**关键配置点**：

```typescript
import { QuartzConfig } from "quartz/cfg"  // ⚠️ 注意：是 "quartz/cfg" 不是 "quartz/config"
import * as Plugin from "quartz/plugins"
import * as Component from "quartz/components"
import * as Shared from "./quartz.layout"

const config: QuartzConfig = {
  configuration: {
    pageTitle: "Muliminty Note",
    enableSPA: true,
    enablePopovers: true,  // ⚠️ 必须启用，否则双链预览不显示
    locale: "zh-CN",
    baseUrl: process.env.BASE_URL ?? "muliminty.github.io",
    ignorePatterns: [
      "private",
      "xx-归档",
      "xx-草稿",
      ".obsidian",
      "node_modules",
      ".git",
    ],
    defaultDateType: "created",
    // ... 主题配置
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ 
        enableInHtml: true,
        comments: true,
        highlight: true,
        wikilinks: true,  // ⚠️ 启用双链支持
        callouts: true,
        mermaid: true,
        parseTags: true,
        enableLatex: true,
      }),
      Plugin.GitHubFlavoredMarkdown({
        enableHardLineBreaks: true,
        enableTaskList: true,
        enableSmartyPants: true,
      }),
      Plugin.CrawlLinks({ 
        markdownLinkResolution: "relative"  // ⚠️ 关键：使用 "relative" 保持相对路径
      }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
      Plugin.Mermaid(),
      Plugin.TableOfContents({
        minEntries: 1,
        maxDepth: 6,
        collapseByDefault: false,
        showByDefault: true,
      }),
    ],
    filters: [
      Plugin.RemoveDrafts(),
    ],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Search(),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.NotFoundPage(),
      // Plugin.CustomOgImages(), // ⚠️ 暂时禁用，避免编码错误
    ],
  },
  layout: {
    sharedPageComponents: Shared.sharedPageComponents,
    defaultContentPageLayout: Shared.defaultContentPageLayout,
    defaultListPageLayout: Shared.defaultListPageLayout,
  },
}

export default config
```

**关键配置说明**：

1. **导入路径**：`from "quartz/cfg"` 不是 `from "quartz/config"`
2. **双链预览**：`enablePopovers: true` 必须启用
3. **双链支持**：`wikilinks: true` 必须启用
4. **路径解析**：`markdownLinkResolution: "relative"` 保持相对路径
5. **禁用插件**：`CustomOgImages()` 暂时禁用，避免编码错误

#### 3.1.2 quartz.layout.ts

创建 `quartz.layout.ts` 文件，配置布局组件：

```typescript
import { PageLayout, SharedLayout } from "quartz/cfg"
import * as Component from "quartz/components"

// 左侧边栏组件
const left: Component.ComponentId[] = [
  Component.PageTitle(),
  Component.Search(),
  Component.Darkmode(),
  Component.Explorer({
    title: "📁 目录",
    folderClickBehavior: "collapse",
    folderDefaultState: "collapsed",
    useSavedState: true,
  }),
  // ... 其他组件
]

// 右侧边栏组件
const right: Component.ComponentId[] = [
  Component.TableOfContents({
    title: "📑 目录",
    maxDepth: 6,
  }),
  Component.Backlinks({
    title: "🔗 反向链接",
  }),
]

// ... 其他配置

export const sharedPageComponents: SharedLayout = {
  left,
  right,
  header: [],
  footer: [],
}

export const defaultContentPageLayout: PageLayout = {
  beforeBody: [],
  left,
  right,
}

export const defaultListPageLayout: PageLayout = defaultContentPageLayout
```

### 3.2 禁用 CustomOgImages 插件

在 `node_modules/quartz/quartz.config.ts` 中禁用该插件：

```typescript
// 找到这一行
Plugin.CustomOgImages(),

// 改为
// Plugin.CustomOgImages(), // 暂时禁用，避免编码错误
```

**注意**：这个修改在 `npm install` 后会丢失，需要重新修改。

---

## 四、配置文件说明

### 4.1 关键配置项

#### 4.1.1 路径解析配置

```typescript
Plugin.CrawlLinks({ 
  markdownLinkResolution: "relative"  // ⚠️ 必须使用 "relative"
})
```

**选项说明**：
- `"relative"`：保持相对路径，适合图片和双链（✅ 推荐）
- `"shortest"`：使用最短路径，可能导致路径错误（❌ 不推荐）
- `"absolute"`：使用绝对路径（❌ 不推荐）

#### 4.1.2 双链配置

```typescript
configuration: {
  enablePopovers: true,  // ⚠️ 必须启用，否则双链预览不显示
}

Plugin.ObsidianFlavoredMarkdown({ 
  wikilinks: true,  // ⚠️ 启用双链支持
})
```

#### 4.1.3 内容目录配置

在 `package.json` 的脚本中使用 `-d .` 参数：

```json
{
  "scripts": {
    "dev": "node scripts/dev.js",
    "build": "./scripts/build.sh"
  }
}
```

`scripts/build.sh` 中包含：
```bash
npx quartz build -d .  # -d . 表示从当前目录读取文件
```

---

## 五、本地开发

### 5.1 启动开发服务器

```bash
# 启动开发服务器（自动修复图片路径）
npm run dev
```

访问 `http://localhost:4399` 查看网站。

**功能说明**：
- ✅ 自动修复图片路径
- ✅ 监听文件变化自动重建
- ✅ 实时预览

### 5.2 构建生产版本

```bash
# 构建生产版本（自动修复图片路径）
npm run build
```

构建后的文件在 `public/` 目录中。

### 5.3 预览构建结果

```bash
# 预览构建结果
npm run preview
```

### 5.4 手动修复图片路径

如果需要手动修复图片路径：

```bash
npm run fix
```

---

## 六、修复图片路径问题

### 6.1 问题描述

Quartz 会将 markdown 中的相对图片路径（如 `./img/window.png`）转换为错误的路径（如 `../../../../img/window.png`），导致图片无法显示。

### 6.2 解决方案

创建自动修复脚本 `scripts/fix-image-paths.js`：

```javascript
#!/usr/bin/env node
/**
 * 修复 Quartz 生成的 HTML 文件中的图片路径
 * 将 ../../../../img/ 替换为 img/（相对于当前 HTML 文件）
 */

const fs = require('fs');
const path = require('path');

function fixImagePaths(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fixImagePaths(filePath);
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      
      // 修复图片路径：将 ../../../../img/ 替换为 img/
      content = content.replace(/src="(\.\.\/)+img\//g, 'src="img/');
      content = content.replace(/src="\.\.\/\.\.\/img\//g, 'src="img/');
      content = content.replace(/src="\.\.\/\.\.\/\.\.\/img\//g, 'src="img/');
      content = content.replace(/src="\.\.\/\.\.\/\.\.\/\.\.\/img\//g, 'src="img/');
      content = content.replace(/src="\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/img\//g, 'src="img/');
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed image paths in: ${filePath}`);
      }
    }
  }
}

const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  console.log('Fixing image paths in HTML files...');
  fixImagePaths(publicDir);
  console.log('Done!');
} else {
  console.error('Public directory not found!');
  process.exit(1);
}
```

### 6.3 集成到构建流程

#### 6.3.1 创建构建脚本

创建 `scripts/build.sh`：

```bash
#!/bin/bash
# Quartz 构建脚本，自动修复图片路径

echo "Building Quartz site..."
npx quartz build -d .

if [ $? -eq 0 ]; then
  echo "Build successful. Fixing image paths..."
  node scripts/fix-image-paths.js
  echo "Done!"
else
  echo "Build failed!"
  exit 1
fi
```

#### 6.3.2 创建开发服务器脚本

创建 `scripts/dev.js`：

```javascript
#!/usr/bin/env node
/**
 * Quartz 开发服务器脚本，自动修复图片路径
 * 在每次构建后自动修复图片路径
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// 修复图片路径的函数
function fixImagePaths(dir) {
  const files = fs.readdirSync(dir);
  let fixedCount = 0;
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fixedCount += fixImagePaths(filePath);
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      
      // 修复图片路径
      content = content.replace(/src="(\.\.\/)+img\//g, 'src="img/');
      content = content.replace(/src="\.\.\/\.\.\/img\//g, 'src="img/');
      content = content.replace(/src="\.\.\/\.\.\/\.\.\/img\//g, 'src="img/');
      content = content.replace(/src="\.\.\/\.\.\/\.\.\/\.\.\/img\//g, 'src="img/');
      content = content.replace(/src="\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/img\//g, 'src="img/');
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        fixedCount++;
      }
    }
  }
  
  return fixedCount;
}

// 监听 public 目录的变化
function watchPublicDir() {
  const publicDir = path.join(__dirname, 'public');
  
  if (!fs.existsSync(publicDir)) {
    console.log('Waiting for public directory to be created...');
    return;
  }
  
  console.log('Watching public directory for changes...');
  
  // 使用简单的轮询方式监听文件变化
  let lastCheck = Date.now();
  const checkInterval = 2000; // 每2秒检查一次
  
  setInterval(() => {
    try {
      const stats = fs.statSync(publicDir);
      if (stats.mtimeMs > lastCheck) {
        lastCheck = Date.now();
        const fixedCount = fixImagePaths(publicDir);
        if (fixedCount > 0) {
          console.log(`Fixed ${fixedCount} HTML file(s) with image paths`);
        }
      }
    } catch (err) {
      // 忽略错误
    }
  }, checkInterval);
  
  // 初始修复
  fixImagePaths(publicDir);
}

// 启动 Quartz 开发服务器
console.log('Starting Quartz development server...');
const quartz = spawn('npx', ['quartz', 'build', '--serve', '--port', '4399', '-d', '.'], {
  stdio: 'inherit',
  shell: true
});

// 延迟启动文件监听，等待首次构建完成
setTimeout(() => {
  watchPublicDir();
}, 5000);

// 处理退出
quartz.on('exit', (code) => {
  process.exit(code);
});

process.on('SIGINT', () => {
  quartz.kill('SIGINT');
  process.exit(0);
});
```

### 6.4 验证修复

构建后检查 HTML 文件中的图片路径：

```bash
# 检查图片路径是否正确
grep -o 'src="img/[^"]*"' public/**/*.html | head -5

# 应该显示类似：src="img/window.png"
```

---

## 七、修复双链路径问题

### 7.1 问题描述

双链（wikilinks）路径解析不正确，导致链接无法正常工作。

### 7.2 解决方案

在 `quartz.config.ts` 中配置：

```typescript
// 1. 启用双链支持
Plugin.ObsidianFlavoredMarkdown({ 
  wikilinks: true,  // ⚠️ 必须启用
})

// 2. 使用相对路径解析
Plugin.CrawlLinks({ 
  markdownLinkResolution: "relative"  // ⚠️ 必须使用 "relative"
})

// 3. 启用双链预览
configuration: {
  enablePopovers: true,  // ⚠️ 必须启用
}
```

### 7.3 双链格式

在 Markdown 文件中使用以下格式：

```markdown
# 基本链接
[[文件名]]

# 自定义显示文本
[[文件名|显示文本]]

# 子目录文件
[[文件夹/文件名]]

# 带锚点的链接
[[文件名#锚点]]
```

### 7.4 验证双链

1. 启动开发服务器：`npm run dev`
2. 访问网站：`http://localhost:4399`
3. 鼠标悬停在双链上，应该看到预览窗口
4. 点击双链，应该能正确跳转

---

## 八、GitHub Actions 自动部署

### 8.1 创建工作流文件

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy Quartz site to GitHub Pages

on:
  push:
    branches:
      - master
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0 # Fetch all history for git info
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install Dependencies
        run: npm ci
      - name: Verify Configuration
        run: |
          echo "Checking configuration files..."
          ls -la quartz.config.ts quartz.layout.ts || echo "Config files not found"
      - name: Build Quartz site
        run: npm run build
      - name: Fix image paths
        run: npm run fix
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: public

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 8.2 启用 GitHub Pages

1. 进入 GitHub 仓库的 **Settings** → **Pages**
2. 在 **Source** 中选择 **GitHub Actions**
3. 点击 **Save**

### 8.3 部署流程

```bash
# 1. 提交代码
git add .
git commit -m "更新笔记"
git push origin master

# 2. GitHub Actions 自动执行：
#    - 安装依赖
#    - 构建网站
#    - 修复图片路径
#    - 部署到 GitHub Pages

# 3. 等待 3-5 分钟，访问网站
```

---

## 九、常见问题

### 9.1 依赖安装失败

**错误**：`npm error 404 Not Found - GET https://registry.npmjs.org/@quartz/plugin-*`

**原因**：这些包在 npm 上不存在，Quartz 的插件都是内置的。

**解决**：
```json
{
  "dependencies": {
    "quartz": "github:jackyzha0/quartz#v4"  // ✅ 正确
    // 不要添加 @quartz/plugin-* 包
  }
}
```

### 9.2 构建失败：Could not resolve "./quartz/build.ts"

**错误**：`Could not resolve "./quartz/build.ts"`

**原因**：缺少 `quartz` 符号链接。

**解决**：
```bash
ln -s node_modules/quartz/quartz quartz
```

### 9.3 构建失败：Could not resolve "../quartz.config"

**错误**：`Could not resolve "../quartz.config"`

**原因**：配置文件路径错误。

**解决**：
1. 确保 `quartz.config.ts` 在项目根目录
2. 确保 `quartz` 符号链接存在：`ln -s node_modules/quartz/quartz quartz`

### 9.4 构建失败：CustomOgImages 编码错误

**错误**：`Failed to emit from plugin CustomOgImages: codepoint 31-20e3 not found in map`

**原因**：CustomOgImages 插件遇到编码问题。

**解决**：
在 `node_modules/quartz/quartz.config.ts` 中禁用该插件：
```typescript
// Plugin.CustomOgImages(), // 暂时禁用，避免编码错误
```

**注意**：这个修改在 `npm install` 后会丢失，需要重新修改。

### 9.5 图片无法显示

**问题**：图片路径错误，如 `../../../../img/window.png`

**原因**：Quartz 将相对路径转换为错误的路径。

**解决**：
1. 确保 `scripts/build.sh` 脚本存在
2. 确保 `scripts/fix-image-paths.js` 脚本存在
3. 运行 `npm run build` 会自动修复路径

### 9.6 双链无法工作

**问题**：双链（`[[链接]]`）无法点击或预览

**原因**：配置未正确启用。

**解决**：
```typescript
// 1. 启用双链预览
configuration: {
  enablePopovers: true,  // ⚠️ 必须启用
}

// 2. 启用双链支持
Plugin.ObsidianFlavoredMarkdown({ 
  wikilinks: true,  // ⚠️ 必须启用
})

// 3. 使用相对路径解析
Plugin.CrawlLinks({ 
  markdownLinkResolution: "relative"  // ⚠️ 必须使用 "relative"
})
```

### 9.7 端口被占用

**错误**：`Error: listen EADDRINUSE: address already in use :::8080`

**解决**：
1. 修改端口：在 `package.json` 中修改端口号
2. 或停止占用端口的进程：
```bash
lsof -ti:8080 | xargs kill -9
```

### 9.8 左侧目录和搜索框不显示

**问题**：部署后左侧边栏不显示

**原因**：布局配置未正确导入。

**解决**：
```typescript
// 确保 quartz.config.ts 中导入了布局配置
import * as Shared from "./quartz.layout"

const config: QuartzConfig = {
  // ...
  layout: {
    sharedPageComponents: Shared.sharedPageComponents,
    defaultContentPageLayout: Shared.defaultContentPageLayout,
    defaultListPageLayout: Shared.defaultListPageLayout,
  },
}
```

---

## 十、快速参考

### 10.1 常用命令

```bash
# 安装依赖
npm install

# 创建符号链接
ln -s node_modules/quartz/quartz quartz

# 启动开发服务器（自动修复图片路径）
npm run dev

# 构建生产版本（自动修复图片路径）
npm run build

# 手动修复图片路径
npm run fix

# 清理缓存
rm -rf .quartz-cache/ public/

# 提交并推送
git add .
git commit -m "更新笔记"
git push origin master
```

### 10.2 文件清单

确保以下文件存在：

```
项目根目录/
├── package.json              # 项目配置
├── quartz.config.ts          # Quartz 主配置
├── quartz.layout.ts          # 布局配置
├── scripts/                   # 脚本目录
│   ├── build.sh              # 构建脚本
│   ├── dev.js                # 开发服务器脚本
│   ├── fix-image-paths.js    # 图片路径修复脚本
│   └── disable-og.js          # 禁用 CustomOgImages 插件脚本
├── quartz -> node_modules/quartz/quartz  # 符号链接
└── .github/workflows/deploy.yml  # GitHub Actions 配置
```

### 10.3 配置检查清单

- [ ] `package.json` 中 `quartz` 从 GitHub 安装
- [ ] `quartz.config.ts` 中导入路径是 `"quartz/cfg"`
- [ ] `enablePopovers: true` 已设置
- [ ] `wikilinks: true` 已启用
- [ ] `markdownLinkResolution: "relative"` 已设置
- [ ] `layout` 配置已导入
- [ ] `quartz` 符号链接已创建
- [ ] `CustomOgImages` 插件已禁用
- [ ] `scripts/fix-image-paths.js` 脚本存在
- [ ] `scripts/build.sh` 脚本存在
- [ ] `scripts/dev.js` 脚本存在
- [ ] `scripts/disable-og.js` 脚本存在
- [ ] GitHub Actions 工作流配置正确

### 10.4 工作流程

1. **日常开发**：
   ```bash
   npm run dev  # 启动开发服务器，自动修复图片路径
   ```

2. **构建部署**：
   ```bash
   npm run build  # 构建生产版本，自动修复图片路径
   git add .
   git commit -m "更新笔记"
   git push origin master  # 自动部署到 GitHub Pages
   ```

3. **问题排查**：
   ```bash
   # 清理缓存
   rm -rf .quartz-cache/ public/
   
   # 重新构建
   npm run build
   
   # 检查图片路径
   grep -r 'src=".*img/' public/**/*.html | head -5
   ```

---

## 📚 相关资源

- [Quartz 官方文档](https://quartz.jzhao.xyz/)
- [Quartz GitHub 仓库](https://github.com/jackyzha0/quartz)
- [Quartz 配置参考](https://quartz.jzhao.xyz/configuration)

---

**最后更新**：2025-11-06  
**相关文档**：
- [GitHub Pages 部署指南](./GitHub%20Pages%20部署指南.md)
- [Quartz 定制教程](./Quartz%20定制教程.md)

