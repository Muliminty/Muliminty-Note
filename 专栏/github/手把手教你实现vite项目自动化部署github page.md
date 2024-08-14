下面是关于如何在 Vite 项目中实现自动化部署到 GitHub Pages 的详细技术文档。这篇文档将逐步讲解如何配置 GitHub Actions 以自动化部署，并解决可能遇到的问题。

---

## 手把手教你实现 Vite 项目自动化部署到 GitHub Pages

### 1. 前言

在本教程中，我们将介绍如何将 Vite 项目自动化部署到 GitHub Pages。我们将使用 GitHub Actions 作为自动化工具，并配置相关的 GitHub Pages 设置。通过本文，你将学习如何设置和运行 GitHub Actions 工作流，以及如何处理可能出现的资源路径问题。

### 2. 准备工作

#### 2.1 创建 GitHub 仓库

首先，你需要一个 GitHub 仓库来存储你的 Vite 项目。如果你还没有创建仓库，请访问 [GitHub](https://github.com) 并创建一个新的仓库。

#### 2.2 配置 Vite 项目

确保你的 Vite 项目已经可以正常构建，并且配置了正确的 `base` 路径。通常情况下，Vite 的 `base` 配置用于设置静态资源的公共路径。对于 GitHub Pages，通常设置为项目名称的路径，如下所示：

```js
// vite.config.js
export default {
  base: '/your-repo-name/',
};
```

请将 `your-repo-name` 替换为你的仓库名称。

### 3. 配置 GitHub Actions

#### 3.1 创建工作流文件

在你的 Vite 项目根目录下创建 `.github/workflows` 目录，并在该目录下创建一个名为 `deploy.yml` 的文件。这个文件将定义你的 GitHub Actions 工作流。

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main  # 触发工作流的分支

jobs:
  build-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '20'  # 使用的 Node.js 版本

      - name: Install dependencies
        run: npm install

      - name: Build project
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist  # Vite 默认构建输出目录
          publish_branch: gh-pages  # 部署分支
```

#### 3.2 配置 GitHub Pages 设置

1. **访问仓库设置**：在你的 GitHub 仓库页面，点击 `Settings`。
2. **设置 GitHub Pages**：找到 `Pages` 部分，确保 `Source` 设置为 `gh-pages` 分支，并且目录设置为 `/`（根目录）。

### 4. 处理常见问题

#### 4.1 资源路径问题

如果你的项目资源路径无法正确加载，可能需要在 Vite 配置中调整 `base` 路径。确保 `base` 设置为仓库名称的路径，例如 `/your-repo-name/`。

#### 4.2 部署失败

如果在 GitHub Actions 中遇到部署失败的问题，可以检查以下几点：

1. **访问权限**：确保你有权推送到 `gh-pages` 分支。
2. **GitHub Token**：确保 `secrets.GITHUB_TOKEN` 已正确配置。

#### 4.3 页面更新缓慢

GitHub Pages 部署有时需要几分钟的时间来生效。如果你刚刚推送了更新，请稍等几分钟再检查页面。

### 5. 总结

通过本教程，你已经学习了如何将 Vite 项目自动化部署到 GitHub Pages。你配置了 GitHub Actions 工作流，并解决了可能出现的资源路径问题。现在，你可以将 Vite 项目持续集成到 GitHub Pages，自动化构建和部署，提升开发效率。

### 6. 参考资料

- [Vite 官方文档](https://vitejs.dev/)
- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [GitHub Actions 文档](https://docs.github.com/en/actions)

---

这篇文档提供了从配置 Vite 项目到自动化部署的全面指南。你可以根据实际需要对其进行调整和补充。