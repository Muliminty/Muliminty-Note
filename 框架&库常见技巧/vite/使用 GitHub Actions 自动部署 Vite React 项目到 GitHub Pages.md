### 使用 GitHub Actions 自动部署 Vite React 项目到 GitHub Pages

本文将介绍如何在 Vite 的 React 项目中，使用 GitHub Actions 自动化构建和部署到 GitHub Pages。

---

### 1. 启用 GitHub Pages

在开始配置之前，首先需要确保你的 GitHub 仓库已经启用了 GitHub Pages。

1. 进入你的 GitHub 仓库，点击 **Settings**。
2. 在左侧菜单中选择 **Pages**。
3. 在 **Source** 部分，选择 `GitHub Actions` 作为部署来源。

这一步确保了 GitHub Pages 准备好接收来自 GitHub Actions 的部署。

---

### 2. 配置 Vite 项目

#### 2.1. 配置 `vite.config.js`

为了确保 Vite 能正确地处理应用的路径，你需要在项目的 `vite.config.js` 文件中配置 `base` 选项。`base` 选项用于指定项目在 GitHub Pages 上的根路径。

```javascript
// vite.config.js
export default {
  base: '/your-repo-name/', // 替换为你的仓库名称
  // 其他配置项
}
```

> **注意**：如果你的仓库名称为 `my-app`，则 `base` 应该设为 `/my-app/`。

---

### 3. 创建 GitHub Actions 工作流

接下来，你需要创建一个 GitHub Actions 工作流文件，用于在每次代码提交时自动构建并部署你的应用。

#### 3.1. 创建工作流文件

在项目的根目录下创建 `.github/workflows/deploy.yml` 文件，并添加以下内容：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main  # 当推送到 main 分支时触发

jobs:
  build-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'  # 使用 Node.js 16

      - name: Install dependencies
        run: npm install

      - name: Build project
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist  # Vite 默认生成的目录
```

#### 3.2. 工作流解读

- `on.push.branches`: 设定当 `main` 分支有推送时，触发工作流。
- `jobs.build-deploy.runs-on`: 指定工作流运行在最新的 Ubuntu 环境上。
- `steps`:
  - `actions/checkout@v2`: 检出当前仓库代码。
  - `actions/setup-node@v2`: 配置 Node.js 环境，这里使用 Node.js 16 版本。
  - `run: npm install`: 安装项目依赖。
  - `run: npm run build`: 构建项目，生成静态文件。
  - `peaceiris/actions-gh-pages@v3`: 将生成的静态文件部署到 GitHub Pages。

---

### 4. 推送代码并触发工作流

完成上述步骤后，当你推送代码到 `main` 分支时，GitHub Actions 会自动执行工作流，构建项目并将其部署到 GitHub Pages。

---

### 5. 验证部署

部署完成后，你可以通过以下 URL 访问你部署的应用：

```
https://<your-username>.github.io/<your-repo-name>/
```

例如，如果你的 GitHub 用户名是 `octocat`，仓库名称是 `my-app`，则可以通过 `https://octocat.github.io/my-app/` 访问。

---

### 6. 可能遇到的问题及解决方案

#### 6.1. 页面路径问题

如果你的项目没有正确显示页面，检查 `vite.config.js` 中的 `base` 配置是否正确。如果网站根目录为 `/`，则可以将 `base` 设为 `'/'`，或者直接忽略 `base` 选项。

#### 6.2. 部署目录问题

确保 `deploy.yml` 中的 `publish_dir` 参数与 Vite 构建后生成的目录一致。默认情况下，Vite 的输出目录是 `./dist`。

---

### 总结

通过上述步骤，你已经成功配置了 GitHub Actions，用于自动构建和部署 Vite 的 React 项目到 GitHub Pages。这个自动化流程可以帮助你减少手动操作，确保每次代码提交后都能自动部署最新版本的应用。

希望这篇文档能帮助你顺利实现项目的自动化部署。Happy coding! 🎉
