# GitHub Pages 部署完整指南

> GitHub Pages 静态网站部署完整实践指南
> 
> **适用场景**：静态网站、文档站点、博客、知识库等
> 
> **学习目标**：
> - 掌握 GitHub Pages 的基本使用
> - 掌握 GitHub Actions 自动部署
> - 掌握自定义域名配置
> - 掌握常见问题排查

---

## 📋 目录

- [一、GitHub Pages 简介](#一github-pages-简介)
- [二、快速开始](#二快速开始)
- [三、部署方式](#三部署方式)
- [四、GitHub Actions 自动部署](#四github-actions-自动部署)
- [五、自定义域名配置](#五自定义域名配置)
- [六、HTTPS 配置](#六https-配置)
- [七、常见问题排查](#七常见问题排查)
- [八、最佳实践](#八最佳实践)
- [九、扩展资源](#九扩展资源)

---

## 一、GitHub Pages 简介

### 1.1 什么是 GitHub Pages

**GitHub Pages** 是 GitHub 提供的免费静态网站托管服务，可以用于：
- 个人或项目主页
- 文档站点
- 博客
- 作品集展示
- 知识库（如 Obsidian 笔记）

### 1.2 功能特点

- ✅ **免费**：完全免费使用
- ✅ **自动部署**：支持 GitHub Actions 自动部署
- ✅ **HTTPS**：自动提供 HTTPS 证书
- ✅ **自定义域名**：支持绑定自己的域名
- ✅ **CDN**：全球 CDN 加速
- ✅ **版本控制**：与 Git 仓库集成

### 1.3 使用限制

- **仓库大小**：建议不超过 1GB
- **带宽限制**：每月 100GB（通常足够使用）
- **构建限制**：每次构建不超过 10 分钟
- **静态文件**：只能托管静态网站（HTML、CSS、JS）

---

## 二、快速开始

### 2.1 创建 GitHub 仓库

1. **登录 GitHub**，点击右上角 **+** → **New repository**

2. **填写仓库信息**：
   - **Repository name**：`你的用户名.github.io`（例如：`muliminty.github.io`）
   - **Description**：可选，描述你的网站
   - **Visibility**：选择 Public（公开）或 Private（私有）
   - 勾选 **Add a README file**

3. **点击 Create repository**

> **注意**：如果仓库名是 `用户名.github.io`，网站会自动部署到 `https://用户名.github.io`。如果是其他名称，网站会部署到 `https://用户名.github.io/仓库名`。

### 2.2 简单 HTML 部署

#### 方法一：直接在 GitHub 上创建

1. 在仓库中点击 **Create new file**
2. 文件名输入 `index.html`
3. 添加以下内容：

```html
<!DOCTYPE html>
<html>
<head>
    <title>我的网站</title>
</head>
<body>
    <h1>欢迎来到我的网站！</h1>
    <p>这是一个简单的 GitHub Pages 网站。</p>
</body>
</html>
```

4. 点击 **Commit new file**

5. **启用 GitHub Pages**：
   - 进入仓库 **Settings** → **Pages**
   - 在 **Source** 下选择 **Deploy from a branch**
   - **Branch** 选择 `main` 或 `master`
   - **Folder** 选择 `/ (root)`
   - 点击 **Save**

6. **等待部署完成**（通常需要几分钟）

7. 访问：`https://你的用户名.github.io`

#### 方法二：本地推送

```bash
# 1. 克隆仓库
git clone https://github.com/你的用户名/你的用户名.github.io.git
cd 你的用户名.github.io

# 2. 创建 index.html
cat > index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>我的网站</title>
</head>
<body>
    <h1>欢迎来到我的网站！</h1>
</body>
</html>
EOF

# 3. 提交并推送
git add index.html
git commit -m "Add index.html"
git push origin main
```

---

## 三、部署方式

### 3.1 从分支部署（推荐）

**适用场景**：简单的静态网站、Jekyll 网站

**步骤**：
1. 进入仓库 **Settings** → **Pages**
2. **Source** 选择 **Deploy from a branch**
3. **Branch** 选择 `main` 或 `master`
4. **Folder** 选择：
   - `/ (root)` - 根目录
   - `/docs` - docs 目录
5. 点击 **Save**

**优点**：
- 配置简单
- 自动部署
- 支持 Jekyll 自动构建

**缺点**：
- 只支持静态文件
- 构建选项有限

### 3.2 从 GitHub Actions 部署（推荐）

**适用场景**：使用构建工具（Vite、Webpack、Quartz 等）的项目

**步骤**：
1. 在项目根目录创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
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
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist  # 构建输出目录

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

2. 进入仓库 **Settings** → **Pages**
3. **Source** 选择 **GitHub Actions**
4. 保存设置

**优点**：
- 支持任何构建工具
- 完全控制构建过程
- 可以自定义构建步骤

**缺点**：
- 需要配置工作流文件
- 首次部署需要等待

---

## 四、GitHub Actions 自动部署

### 4.1 基本工作流配置

创建 `.github/workflows/deploy.yml` 文件：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main  # 主分支
  workflow_dispatch:  # 手动触发

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
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

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

### 4.2 常见构建工具配置

#### Vite 项目

```yaml
- name: Build
  run: npm run build
  # 构建输出在 dist 目录

- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: ./dist
```

#### Webpack 项目

```yaml
- name: Build
  run: npm run build
  # 构建输出在 dist 目录

- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: ./dist
```

#### Next.js 项目（静态导出）

```yaml
- name: Build
  run: |
    npm run build
    npm run export  # 或 next export
  # 构建输出在 out 目录

- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: ./out
```

#### Quartz 项目

```yaml
- name: Build
  run: npm run build
  # 构建输出在 public 目录

- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: ./public
```

### 4.3 环境变量配置

如果需要在构建时使用环境变量：

```yaml
- name: Build
  run: npm run build
  env:
    NODE_ENV: production
    API_URL: https://api.example.com
    # 其他环境变量
```

### 4.4 缓存依赖

加速构建过程：

```yaml
- name: Cache dependencies
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-

- name: Install dependencies
  run: npm ci
```

---

## 五、自定义域名配置

### 5.1 添加自定义域名

1. **在仓库中添加域名文件**：
   - 创建 `public/CNAME` 文件（如果使用 GitHub Actions）
   - 或创建根目录的 `CNAME` 文件（如果从分支部署）
   - 内容为你的域名（不带协议）：
     ```
     example.com
     www.example.com
     ```

2. **配置 DNS 解析**：
   - 登录你的域名注册商
   - 添加 DNS 记录：
     - **类型**：`CNAME`（推荐）或 `A`
     - **主机记录**：`@` 或 `www`
     - **记录值**：
       - CNAME：`你的用户名.github.io`
       - A 记录：使用 GitHub Pages 的 IP 地址
         ```
         185.199.108.153
         185.199.109.153
         185.199.110.153
         185.199.111.153
         ```

3. **在 GitHub 中配置**：
   - 进入仓库 **Settings** → **Pages**
   - 在 **Custom domain** 中输入你的域名
   - 勾选 **Enforce HTTPS**（等待 DNS 生效后）

4. **等待 DNS 生效**（通常需要几分钟到几小时）

### 5.2 验证域名配置

```bash
# 检查 DNS 解析
dig example.com +short
# 应该返回 GitHub Pages 的 IP 地址

# 或使用在线工具
# https://www.whatsmydns.net/
```

### 5.3 同时支持 www 和非 www

**方法一：使用 CNAME 记录**

```
@ → CNAME → 你的用户名.github.io
www → CNAME → 你的用户名.github.io
```

在 `CNAME` 文件中填写主域名：
```
example.com
```

**方法二：使用 A 记录（根域名）**

```
@ → A → GitHub Pages IP
www → CNAME → 你的用户名.github.io
```

---

## 六、HTTPS 配置

### 6.1 自动 HTTPS

GitHub Pages 会自动为所有域名提供 HTTPS 证书（Let's Encrypt）。

**启用步骤**：
1. 等待 DNS 配置生效
2. 进入仓库 **Settings** → **Pages**
3. 勾选 **Enforce HTTPS**
4. 等待证书生成（通常几分钟）

### 6.2 验证 HTTPS

访问 `https://你的域名.com`，应该看到：
- 地址栏显示锁图标
- 证书由 Let's Encrypt 签发

### 6.3 强制 HTTPS 重定向

在 `CNAME` 文件中配置域名后，GitHub Pages 会自动处理 HTTP 到 HTTPS 的重定向。

---

## 七、常见问题排查

### 7.1 网站显示 404

**原因**：
- 还没有部署内容
- 分支或目录配置错误
- 文件路径错误

**解决方案**：
1. 检查仓库 **Settings** → **Pages** 配置
2. 确认构建输出目录是否正确
3. 检查工作流是否成功执行

### 7.2 构建失败

**原因**：
- 依赖安装失败
- 构建脚本错误
- 超时

**解决方案**：
1. 查看 **Actions** 标签页的构建日志
2. 检查 `package.json` 中的依赖
3. 增加构建超时时间（如果构建时间较长）

### 7.3 自定义域名无法访问

**原因**：
- DNS 配置错误
- DNS 未生效
- `CNAME` 文件配置错误

**解决方案**：
1. 检查 DNS 解析：`dig example.com`
2. 确认 `CNAME` 文件内容正确
3. 等待 DNS 生效（最长 48 小时）

### 7.4 样式或资源加载失败

**原因**：
- 路径配置错误（使用相对路径而非绝对路径）
- base URL 配置错误

**解决方案**：
1. 检查构建工具的 `base` 配置
2. 使用相对路径或正确的 base URL
3. 对于 Vite：`base: '/仓库名/'`（如果不在根目录）

### 7.5 GitHub Actions 权限错误

**原因**：
- 缺少必要的权限

**解决方案**：
确保工作流文件中有：
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

---

## 八、最佳实践

### 8.1 项目结构

```
项目根目录/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── public/          # 构建输出目录（GitHub Actions）
├── src/             # 源代码
├── package.json
├── README.md
└── .gitignore
```

### 8.2 分离源代码和构建输出

**`.gitignore`**：
```gitignore
# 构建输出
dist/
build/
public/
out/

# 依赖
node_modules/
package-lock.json

# 环境变量
.env
.env.local
```

### 8.3 使用环境变量

在 GitHub Actions 中配置 Secrets：
1. 进入仓库 **Settings** → **Secrets and variables** → **Actions**
2. 点击 **New repository secret**
3. 添加需要的密钥

在工作流中使用：
```yaml
- name: Build
  run: npm run build
  env:
    API_KEY: ${{ secrets.API_KEY }}
```

### 8.4 性能优化

1. **启用压缩**：GitHub Pages 自动启用 gzip
2. **使用 CDN**：GitHub Pages 使用全球 CDN
3. **优化资源**：压缩图片、CSS、JS
4. **缓存策略**：设置合适的缓存头

### 8.5 监控和日志

- 查看部署状态：**Actions** 标签页
- 查看构建日志：点击具体的 workflow run
- 监控网站状态：使用 UptimeRobot 等工具

---

## 九、扩展资源

### 9.1 官方文档

- [GitHub Pages 官方文档](https://docs.github.com/en/pages)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Jekyll 文档](https://jekyllrb.com/)（如果使用 Jekyll）

### 9.2 相关工具

- **静态网站生成器**：
  - [Jekyll](https://jekyllrb.com/)
  - [Hugo](https://gohugo.io/)
  - [Vite](https://vitejs.dev/)
  - [Next.js](https://nextjs.org/)
  - [Quartz](https://quartz.jzhao.xyz/)

- **CI/CD 工具**：
  - [GitHub Actions](https://github.com/features/actions)
  - [GitLab CI](https://docs.gitlab.com/ee/ci/)

### 9.3 示例项目

- [GitHub Pages 示例](https://github.com/github/pages-gem)
- [各种静态网站生成器示例](https://github.com/topics/github-pages)

---

## 📝 总结

GitHub Pages 是一个强大的免费静态网站托管服务，通过本文档，你应该能够：

1. ✅ 创建并部署简单的静态网站
2. ✅ 使用 GitHub Actions 自动部署
3. ✅ 配置自定义域名和 HTTPS
4. ✅ 排查常见问题
5. ✅ 应用最佳实践

**下一步**：
- 尝试部署你的第一个网站
- 探索更多高级功能
- 参考其他项目的配置

---

**最后更新**：2025  
**相关文档**：
- [Quartz 定制教程](./Quartz%20定制教程.md)
- [Quartz 完整修复指南](./Quartz%20完整修复指南.md)
- [腾讯云部署指南](../04-云平台部署/腾讯云部署指南.md)
