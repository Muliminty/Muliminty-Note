---
title: "零基础搭建 GitHub 笔记仓库完整教程"
date: "2026-05-22"
lastModified: "2026-05-22"
status: "成熟"
tags: ["GitHub", "静态网站部署", "教程", "基础入门"]
description: "面向零基础读者的 GitHub 笔记仓库搭建与发布教程。"
toc: true
publish: true
---

# 零基础搭建 GitHub 笔记仓库完整教程

> 从零开始，一步步教你搭建一个美观的 GitHub 笔记仓库，实现自动部署和发布
> 
> **适用人群**：完全不懂代码的人也可以跟着这个教程成功搭建
> 
> **预计时间**：30-60 分钟
> 
> **最终效果**：一个美观的在线笔记网站，支持搜索、双链、知识图谱等功能

---

## 📋 目录

- [第一步：准备工作](#第一步准备工作)
- [第二步：创建 GitHub 账号和仓库](#第二步创建-github-账号和仓库)
- [第三步：安装必要的软件](#第三步安装必要的软件)
- [第四步：创建本地项目](#第四步创建本地项目)
- [第五步：配置项目文件](#第五步配置项目文件)
- [第六步：配置 GitHub Pages](#第六步配置-github-pages)
- [第七步：配置 GitHub Actions 工作流](#第七步配置-github-actions-工作流)
- [第八步：上传代码到 GitHub](#第八步上传代码到-github)
- [第九步：测试部署](#第九步测试部署)
- [第十步：添加笔记内容](#第十步添加笔记内容)
- [常见问题](#常见问题)
- [总结](#总结)

---

## 第一步：准备工作

### 1.1 你需要准备什么？

- **一台电脑**（Windows、Mac 或 Linux 都可以）
- **网络连接**
- **一个邮箱地址**（用于注册 GitHub 账号）
- **30-60 分钟的时间**

### 1.2 最终你会得到什么？

- ✅ 一个 GitHub 仓库（用来存储你的笔记）
- ✅ 一个美观的在线笔记网站（所有人都可以访问）
- ✅ 自动部署功能（每次更新笔记，网站自动更新）
- ✅ 搜索功能（可以快速找到笔记）
- ✅ 双链功能（笔记之间可以互相链接）
- ✅ 知识图谱（可视化你的笔记关系）

---

## 第二步：创建 GitHub 账号和仓库

### 2.1 注册 GitHub 账号

1. **打开浏览器**，访问 GitHub 官网：https://github.com

2. **点击右上角的 "Sign up"**（注册）按钮

3. **填写注册信息**：
   - **Username**（用户名）：输入你想要的用户名（例如：`yourname`）
   - **Email**（邮箱）：输入你的邮箱地址
   - **Password**（密码）：设置一个安全的密码
   - 点击 **"Create account"**（创建账号）

4. **验证邮箱**：
   - GitHub 会发送一封验证邮件到你的邮箱
   - 打开邮箱，点击邮件中的验证链接
   - 完成邮箱验证

5. **完成注册**：
   - 选择你感兴趣的内容（可以跳过）
   - 完成简单的设置
   - 注册成功！

### 2.2 创建 GitHub 仓库

1. **登录 GitHub**：
   - 访问 https://github.com
   - 点击右上角的 **"Sign in"**（登录）
   - 输入你的用户名和密码登录

2. **创建新仓库**：
   - 点击右上角的 **"+"** 号
   - 选择 **"New repository"**（新建仓库）

3. **填写仓库信息**：
   - **Repository name**（仓库名称）：输入 `my-notes`（或你喜欢的名字）
   - **Description**（描述）：可选，输入 "我的笔记"
   - **Visibility**（可见性）：
     - 选择 **Public**（公开）- 所有人都可以访问你的笔记网站
     - 或选择 **Private**（私有）- 只有你可以访问（需要付费）
   - **不要勾选** "Add a README file"（我们稍后会创建）
   - **不要勾选** "Add .gitignore"（我们稍后会创建）
   - **不要选择** License（许可证）

4. **点击 "Create repository"**（创建仓库）

5. **复制仓库地址**：
   - 创建成功后，你会看到一个页面
   - 找到 **"Quick setup"**（快速设置）部分
   - 复制仓库地址（例如：`https://github.com/yourname/my-notes.git`）
   - **保存这个地址**，稍后会用到

---

## 第三步：安装必要的软件

### 3.1 安装 Git

Git 是用来管理代码版本的工具，我们需要它来上传代码到 GitHub。

#### Windows 系统：

1. **下载 Git**：
   - 访问：https://git-scm.com/download/win
   - 点击下载，会自动下载最新版本

2. **安装 Git**：
   - 双击下载的安装文件
   - 一直点击 **"Next"**（下一步），使用默认设置
   - 最后点击 **"Install"**（安装）

3. **验证安装**：
   - 按 `Win + R` 键
   - 输入 `cmd`，按回车
   - 在命令行中输入：`git --version`
   - 如果显示版本号（如 `git version 2.xx.x`），说明安装成功

#### Mac 系统：

1. **安装 Git**：
   - 打开 **终端**（Terminal）应用
   - 输入以下命令：
     ```bash
     xcode-select --install
     ```
   - 如果提示已安装，说明 Git 已经安装好了

2. **验证安装**：
   - 在终端中输入：`git --version`
   - 如果显示版本号，说明安装成功

#### Linux 系统：

1. **安装 Git**：
   - 打开终端
   - 输入以下命令：
     ```bash
     sudo apt-get install git
     ```
     （Ubuntu/Debian 系统）
   - 或
     ```bash
     sudo yum install git
     ```
     （CentOS/RHEL 系统）

2. **验证安装**：
   - 在终端中输入：`git --version`
   - 如果显示版本号，说明安装成功

### 3.2 安装 Node.js

Node.js 是用来运行构建工具的环境，我们需要它来生成网站。

#### Windows 系统：

1. **下载 Node.js**：
   - 访问：https://nodejs.org/
   - 点击下载 **LTS 版本**（推荐版本，通常是左边的绿色按钮）
   - 下载 Windows 安装程序（.msi 文件）

2. **安装 Node.js**：
   - 双击下载的安装文件
   - 一直点击 **"Next"**（下一步），使用默认设置
   - 最后点击 **"Install"**（安装）

3. **验证安装**：
   - 按 `Win + R` 键
   - 输入 `cmd`，按回车
   - 在命令行中输入：`node --version`
   - 如果显示版本号（如 `v20.x.x`），说明安装成功
   - 再输入：`npm --version`
   - 如果显示版本号（如 `10.x.x`），说明安装成功

#### Mac 系统：

1. **下载 Node.js**：
   - 访问：https://nodejs.org/
   - 点击下载 **LTS 版本**（推荐版本）
   - 下载 Mac 安装程序（.pkg 文件）

2. **安装 Node.js**：
   - 双击下载的安装文件
   - 按照提示完成安装

3. **验证安装**：
   - 打开 **终端**（Terminal）应用
   - 输入：`node --version`
   - 如果显示版本号，说明安装成功
   - 再输入：`npm --version`
   - 如果显示版本号，说明安装成功

#### Linux 系统：

1. **安装 Node.js**：
   - 打开终端
   - 输入以下命令：
     ```bash
     curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
     sudo apt-get install -y nodejs
     ```
     （Ubuntu/Debian 系统）

2. **验证安装**：
   - 在终端中输入：`node --version`
   - 如果显示版本号，说明安装成功
   - 再输入：`npm --version`
   - 如果显示版本号，说明安装成功

### 3.3 安装文本编辑器（可选）

我们推荐使用 **VS Code**（Visual Studio Code），它是一个免费、好用的代码编辑器。

1. **下载 VS Code**：
   - 访问：https://code.visualstudio.com/
   - 点击下载，选择适合你系统的版本

2. **安装 VS Code**：
   - 按照提示完成安装

---

## 第四步：创建本地项目

### 4.1 创建项目文件夹

1. **选择项目位置**：
   - 选择一个你容易找到的位置（例如：桌面或文档文件夹）
   - 创建一个新文件夹，命名为 `my-notes`（或你喜欢的名字）

2. **打开终端/命令行**：
   - **Windows**：在文件夹中右键，选择 "Git Bash Here" 或 "在终端中打开"
   - **Mac**：打开终端，输入 `cd` 然后空格，把文件夹拖到终端窗口，按回车
   - **Linux**：打开终端，使用 `cd` 命令进入文件夹

### 4.2 初始化 Git 仓库

1. **在终端/命令行中输入以下命令**：
   ```bash
   git init
   ```

2. **设置 Git 用户信息**（第一次使用需要）：
   ```bash
   git config --global user.name "你的名字"
   git config --global user.email "你的邮箱"
   ```
   将 "你的名字" 和 "你的邮箱" 替换为你的实际信息

---

## 第五步：配置项目文件

现在我们需要创建和配置项目文件。**不要担心，我会提供所有文件的完整内容，你只需要复制粘贴即可。**

### 5.1 创建 `package.json` 文件

1. **创建文件**：
   - 在项目文件夹中创建新文件，命名为 `package.json`
   - 使用文本编辑器（记事本、VS Code 等）打开

2. **复制以下内容**：
   ```json
   {
     "name": "my-notes",
     "version": "1.0.0",
     "description": "我的笔记",
     "scripts": {
       "dev": "node scripts/ensure-link.js && node scripts/dev.js",
       "prebuild": "node scripts/ensure-link.js && node scripts/fix-markdown-links.js",
       "build": "./scripts/build.sh",
       "preview": "node scripts/ensure-link.js && npx quartz build --serve --port 4399 -d . && node scripts/fix-image-paths.js",
       "fix": "node scripts/fix-image-paths.js",
       "fix:links": "node scripts/fix-markdown-links.js"
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
   - `prebuild` 脚本会在构建前自动运行，确保符号链接正确并修复 Markdown 链接
   - `dev` 和 `preview` 脚本会自动创建符号链接，无需手动创建

3. **保存文件**

### 5.2 创建 `.gitignore` 文件

1. **创建文件**，命名为 `.gitignore`（注意：文件名前面有个点）

2. **复制以下内容**：
   ```
   # Quartz
   .quartz-cache/
   public/

   # Node
   node_modules/
   yarn.lock

   # Obsidian
   .obsidian/

   # macOS
   .DS_Store

   # IDE
   .vscode/
   .idea/
   *.swp
   *.swo
   *~

   # Logs
   *.log
   npm-debug.log*
   yarn-debug.log*
   yarn-error.log*
   ```

3. **保存文件**

### 5.3 创建 `scripts` 文件夹

1. **在项目文件夹中创建新文件夹**，命名为 `scripts`

### 5.4 创建 `scripts/fix-image-paths.js` 文件

1. **在 `scripts` 文件夹中创建新文件**，命名为 `fix-image-paths.js`

2. **复制以下内容**：
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
         // 匹配各种深度的相对路径（包括 ../../../../、../../../、../../、../）
         content = content.replace(/src="(\.\.\/)+img\//g, 'src="img/');
         
         // 也处理可能存在的其他变体，如 ../../img/、../../../img/ 等
         // 确保图片路径是相对于当前 HTML 文件的
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

   const publicDir = path.join(__dirname, '..', 'public');
   if (fs.existsSync(publicDir)) {
     console.log('Fixing image paths in HTML files...');
     fixImagePaths(publicDir);
     console.log('Done!');
   } else {
     console.error('Public directory not found!');
     process.exit(1);
   }
   ```

3. **保存文件**

### 5.5 创建 `scripts/ensure-link.js` 文件

1. **在 `scripts` 文件夹中创建新文件**，命名为 `ensure-link.js`

2. **复制以下内容**：
   ```javascript
   #!/usr/bin/env node
   const fs = require('fs')
   const path = require('path')

   // 使用相对路径（在 CI 环境中更可靠）
   const projectRoot = path.resolve(__dirname, '..')
   const symlinkPath = path.join(projectRoot, 'quartz')
   const target = path.join(projectRoot, 'node_modules', 'quartz', 'quartz')
   // 计算相对路径（相对于符号链接所在目录）
   const relativeTarget = path.relative(path.dirname(symlinkPath), target)

   // 检查目标目录是否存在
   if (!fs.existsSync(target)) {
     console.warn(`Target directory does not exist: ${target}`)
     console.warn('Skipping symlink creation. This is normal if dependencies are not installed yet.')
   } else {
     // 检查符号链接是否存在
     if (!fs.existsSync(symlinkPath)) {
       // 符号链接不存在，创建它（使用相对路径）
       try {
         fs.symlinkSync(relativeTarget, symlinkPath, 'dir')
         console.log('Created symlink: quartz -> node_modules/quartz/quartz')
       } catch (e) {
         // 如果失败，可能是因为文件已存在（race condition）
         if (e.code !== 'EEXIST') {
           console.warn('Ensure symlink failed:', e?.message)
         }
         // 不退出，继续执行其他操作
       }
     } else {
       // 检查现有符号链接是否有效
       try {
         const linkStat = fs.lstatSync(symlinkPath)
         if (linkStat.isSymbolicLink()) {
           // 检查符号链接指向的路径
           const currentTarget = fs.readlinkSync(symlinkPath)
           // 如果指向绝对路径，需要重新创建为相对路径
           if (path.isAbsolute(currentTarget)) {
             console.warn('quartz symlink points to absolute path, recreating with relative path')
             try {
               // 强制删除旧的符号链接
               if (fs.existsSync(symlinkPath)) {
                 fs.unlinkSync(symlinkPath)
               }
               // 确保删除成功
               if (fs.existsSync(symlinkPath)) {
                 console.warn('Failed to remove old symlink, trying again...')
                 // 尝试使用 rm -rf（如果可能）
                 const { execSync } = require('child_process')
                 try {
                   execSync(`rm -rf "${symlinkPath}"`, { stdio: 'ignore' })
                 } catch {}
               }
               // 创建新的符号链接
               if (!fs.existsSync(symlinkPath)) {
                 fs.symlinkSync(relativeTarget, symlinkPath, 'dir')
                 console.log('Recreated symlink: quartz -> node_modules/quartz/quartz')
               } else {
                 console.warn('Cannot create symlink, old one still exists')
               }
             } catch (e2) {
               console.warn('Failed to recreate symlink:', e2?.message)
             }
           } else {
             // 验证符号链接指向的目标是否存在
             let isValid = false
             try {
               const realPath = fs.realpathSync(symlinkPath)
               if (fs.existsSync(realPath) && fs.existsSync(path.join(realPath, 'build.ts'))) {
                 isValid = true
                 console.log('quartz symlink is valid')
               }
             } catch (e) {
               // 符号链接损坏或指向不存在的路径
               console.warn('quartz symlink is broken or points to invalid location:', e?.message)
             }
             
             // 如果无效，删除并重新创建
             if (!isValid) {
               try {
                 if (fs.existsSync(symlinkPath)) {
                   fs.unlinkSync(symlinkPath)
                 }
                 // 确保删除成功
                 if (!fs.existsSync(symlinkPath)) {
                   fs.symlinkSync(relativeTarget, symlinkPath, 'dir')
                   console.log('Recreated symlink: quartz -> node_modules/quartz/quartz')
                 }
               } catch (e2) {
                 console.warn('Failed to recreate symlink:', e2?.message)
               }
             }
           }
         } else {
           // 存在但不是符号链接，由 build.sh 处理
           console.warn('quartz exists but is not a symlink, will be handled by build.sh')
         }
       } catch (e) {
         // 检查失败，可能是文件不存在或权限问题
         if (e.code !== 'ENOENT') {
           console.warn('Failed to check symlink:', e?.message)
         }
         // 不尝试重新创建，由 build.sh 处理
       }
     }
   }

   // Ensure node_modules/quartz/quartz.config.ts re-exports the project's root config
   try {
     const injected = path.join(__dirname, '..', 'node_modules', 'quartz', 'quartz.config.ts')
     const targetDir = path.join(__dirname, '..', 'node_modules', 'quartz')
     if (fs.existsSync(targetDir)) {
       const content = 'export { default } from "../../quartz.config"\n'
       fs.writeFileSync(injected, content, 'utf8')
       console.log('Injected config shim:', injected)
     }
   } catch (e) {
     console.warn('Inject config failed:', e?.message)
   }

   process.exit(0)
   ```

3. **保存文件**

4. **说明**：这个脚本会自动创建和管理 `quartz` 符号链接，确保在本地和 CI 环境中都能正常工作。

### 5.6 创建 `scripts/fix-markdown-links.js` 文件

1. **在 `scripts` 文件夹中创建新文件**，命名为 `fix-markdown-links.js`

2. **复制以下内容**：
   ```javascript
   #!/usr/bin/env node
   /**
    * 修复 Markdown 文件中的相对路径链接
    * 将缺少 ./ 前缀的相对路径链接添加 ./ 前缀
    * 例如：将 [链接](./路径/文件.md) 改为 [链接](./路径/文件.md)
    */

   const fs = require('fs');
   const path = require('path');

   function fixMarkdownLinks(dir) {
     const files = fs.readdirSync(dir);
     let fixedCount = 0;
     
     for (const file of files) {
       const filePath = path.join(dir, file);
       
       // 跳过某些目录（在 stat 之前检查，避免访问问题）
       if (file.startsWith('.') || file === 'node_modules' || file === 'public' || file === 'scripts' || file === 'quartz') {
         continue;
       }
       
       let stat;
       try {
         stat = fs.statSync(filePath);
       } catch (error) {
         // 如果无法访问文件/目录（如损坏的符号链接），跳过它
         console.warn(`Skipping inaccessible path: ${filePath} (${error.message})`);
         continue;
       }
       
       if (stat.isDirectory()) {
         fixedCount += fixMarkdownLinks(filePath);
       } else if (file.endsWith('.md')) {
         let content = fs.readFileSync(filePath, 'utf8');
         const originalContent = content;
         
         // 1) 修复以 / 开头的绝对路径为相对路径： [文本](./路径/文件.md) -> [文本](./路径/文件.md)
         content = content.replace(/\((\/[^(\)]*\.md)\)/g, (m, p1) => `(${p1.replace(/^\//, '')})`)

         // 2) 修复缺少 ./ 前缀的相对路径链接：将 [文本](./路径/文件.md) 改为 [文本](./路径/文件.md)
         // 匹配模式：[文本](./路径/文件.md)，但不匹配 [文本](./路径/文件.md) 或 [文本](../路径/文件.md) 或 [文本](#锚点)
         content = content.replace(/\[([^\]]+)\]\(([^./#][^)]*\.md)\)/g, (match, text, linkPath) => {
           if (!linkPath.startsWith('./') && !linkPath.startsWith('../') && !linkPath.startsWith('#')) {
             return `[${text}](./${linkPath})`
           }
           return match
         })
         
         if (content !== originalContent) {
           fs.writeFileSync(filePath, content, 'utf8');
           console.log(`Fixed links in: ${filePath}`);
           fixedCount++;
         }
       }
     }
     
     return fixedCount;
   }

   const rootDir = process.cwd();
   console.log('Fixing markdown links in all .md files...');
   const fixedCount = fixMarkdownLinks(rootDir);
   console.log(`Done! Fixed ${fixedCount} file(s).`);
   ```

3. **保存文件**

4. **说明**：这个脚本会在构建前自动修复 Markdown 文件中的链接路径，确保链接能正常工作。

### 5.7 创建 `scripts/build.sh` 文件

1. **在 `scripts` 文件夹中创建新文件**，命名为 `build.sh`

2. **复制以下内容**：
   ```bash
   #!/bin/bash
   # Quartz 构建脚本，自动修复图片路径和 Markdown 链接

   echo "Cleaning cache and output..."
   rm -rf .quartz-cache public

   echo "Ensuring quartz symlink exists..."
   if [ ! -d node_modules/quartz/quartz ]; then
     echo "Error: node_modules/quartz/quartz does not exist"
     echo "Please run 'npm install' first"
     exit 1
   fi

   # 使用相对路径创建符号链接（在 CI 环境中更可靠）
   QUARTZ_TARGET="node_modules/quartz/quartz"

   # 强制删除旧的 quartz（无论是符号链接还是目录）
   if [ -e quartz ]; then
     if [ -L quartz ]; then
       LINK_TARGET=$(readlink quartz)
       echo "Found existing symlink pointing to: $LINK_TARGET"
       if [[ "$LINK_TARGET" == /* ]]; then
         echo "Warning: quartz symlink points to absolute path, will recreate with relative path"
       elif [ -d quartz ] && [ -f quartz/build.ts ]; then
         echo "quartz symlink already exists and is valid"
         # 符号链接有效，不需要重新创建
         QUARTZ_VALID=true
       else
         echo "Warning: quartz symlink is broken, will recreate"
       fi
     else
       echo "Warning: quartz exists but is not a symlink, will recreate"
     fi
     
     # 如果需要重新创建，先删除旧的
     if [ "${QUARTZ_VALID:-false}" != "true" ]; then
       echo "Removing old quartz..."
       rm -rf quartz
       # 确保删除成功
       if [ -e quartz ]; then
         echo "Error: Failed to remove quartz"
         exit 1
       fi
       echo "Creating new symlink..."
       ln -s "$QUARTZ_TARGET" quartz
       echo "Created quartz symlink"
     fi
   else
     # 不存在，创建符号链接（使用相对路径）
     echo "Creating quartz symlink..."
     ln -s "$QUARTZ_TARGET" quartz
     echo "Created quartz symlink"
   fi

   # 验证符号链接是否有效
   echo "Verifying quartz symlink..."
   if [ ! -L quartz ]; then
     echo "Error: quartz is not a symlink"
     exit 1
   fi

   LINK_TARGET=$(readlink quartz)
   echo "Symlink target: $LINK_TARGET"

   if [ ! -f quartz/build.ts ]; then
     echo "Error: quartz symlink is invalid or build.ts not found"
     echo "Symlink target: $LINK_TARGET"
     echo "Expected target: $QUARTZ_TARGET"
     echo "Current directory: $(pwd)"
     echo "Checking if target exists:"
     if [ -f "$QUARTZ_TARGET/build.ts" ]; then
       echo "✓ Target build.ts exists at: $QUARTZ_TARGET/build.ts"
       echo "But symlink cannot access it. This might be a path resolution issue."
       echo "Trying to resolve symlink:"
       if command -v realpath >/dev/null 2>&1; then
         RESOLVED=$(realpath quartz 2>&1 || echo 'failed')
       else
         RESOLVED=$(readlink -f quartz 2>&1 || echo 'failed')
       fi
       echo "Resolved path: $RESOLVED"
     else
       echo "✗ Target build.ts not found at: $QUARTZ_TARGET/build.ts"
       ls -la "$QUARTZ_TARGET" 2>&1 || echo "Target directory does not exist"
     fi
     exit 1
   fi

   echo "✓ quartz symlink is valid and build.ts exists"

   echo "Ensuring config shim exists..."
   node scripts/ensure-link.js

   echo "Building Quartz site..."
   export NODE_OPTIONS=--preserve-symlinks
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

3. **保存文件**

4. **设置执行权限**（Mac/Linux）：
   - 在终端中进入项目文件夹
   - 输入：`chmod +x scripts/build.sh`
   
   **Windows 系统**：
   - 如果使用 Git Bash，也需要设置执行权限：`chmod +x scripts/build.sh`
   - 如果使用 PowerShell，可能需要使用 `bash scripts/build.sh` 来运行

### 5.8 创建 `scripts/dev.js` 文件

1. **在 `scripts` 文件夹中创建新文件**，命名为 `dev.js`

2. **复制以下内容**：
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
     const publicDir = path.join(__dirname, '..', 'public');
     
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

3. **保存文件**

### 5.9 创建 `scripts/disable-og.js` 文件

1. **在 `scripts` 文件夹中创建新文件**，命名为 `disable-og.js`

2. **复制以下内容**：
   ```javascript
   #!/usr/bin/env node
   const fs = require('fs')
   const path = require('path')

   function findFiles(dir, matcher, results = []) {
     const entries = fs.existsSync(dir) ? fs.readdirSync(dir) : []
     for (const entry of entries) {
       const p = path.join(dir, entry)
       const stat = fs.statSync(p)
       if (stat.isDirectory()) {
         findFiles(p, matcher, results)
       } else if (matcher.test(entry)) {
         results.push(p)
       }
     }
     return results
   }

   function disableCustomOgImages(rootDir) {
     const targetRoot = path.join(rootDir, 'node_modules', 'quartz')
     if (!fs.existsSync(targetRoot)) {
       console.error('Quartz package not found at', targetRoot)
       process.exit(0)
     }
     const files = findFiles(targetRoot, /\.([cm]?ts|m?js)$/)
     let patched = 0
     for (const file of files) {
       const content = fs.readFileSync(file, 'utf8')
       if (content.includes('CustomOgImages')) {
         // Comment out any Plugin.CustomOgImages( ... ) occurrence safely
         const replaced = content.replace(/(\s*)Plugin\.CustomOgImages\s*\([^)]*\)\s*,?/g, (m, ws) => `${ws}// ${m.trim()}`)
         if (replaced !== content) {
           fs.writeFileSync(file, replaced, 'utf8')
           patched++
         }
       }
     }
     console.log(`Patched files: ${patched}`)
   }

   disableCustomOgImages(process.cwd())
   ```

3. **保存文件**

### 5.10 创建 `quartz.config.ts` 文件

1. **在项目文件夹根目录创建新文件**，命名为 `quartz.config.ts`

2. **复制以下内容**（**重要：将 `yourname` 替换为你的 GitHub 用户名**）：
   ```typescript
   import { QuartzConfig } from "quartz/cfg"
   import * as Plugin from "quartz/plugins"
   import * as Component from "quartz/components"
   import * as Shared from "./quartz.layout"

   /**
    * Quartz 4.0 Configuration
    * 
    * See https://quartz.jzhao.xyz/configuration for more information.
    */
   const config: QuartzConfig = {
     configuration: {
       pageTitle: "我的笔记",
       enableSPA: true,
       enablePopovers: true,
       analytics: {
         provider: "plausible",
       },
       locale: "zh-CN",
       baseUrl: process.env.BASE_URL ?? "yourname.github.io",
       ignorePatterns: [
         "private",
         "xx-归档",
         "xx-草稿",
         ".obsidian",
         "node_modules",
         ".git",
       ],
       defaultDateType: "created",
       theme: {
         fontOrigin: "googleFonts",
         cdnCaching: true,
         typography: {
           header: "Schibsted Grotesk",
           body: "Source Sans Pro",
           code: "IBM Plex Mono",
         },
         colors: {
           lightMode: {
             light: "#faf8f8",
             lightgray: "#e5e0e0",
             gray: "#b8b8b8",
             darkgray: "#4e4e4e",
             dark: "#2b2b2b",
             secondary: "#284b63",
             tertiary: "#84a59d",
             highlight: "rgba(143, 159, 169, 0.15)",
           },
           darkMode: {
             light: "#161618",
             lightgray: "#393639",
             gray: "#646464",
             darkgray: "#d4d4d4",
             dark: "#ebebec",
             secondary: "#7b97aa",
             tertiary: "#84a59d",
             highlight: "rgba(143, 159, 169, 0.15)",
           },
         },
       },
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
           wikilinks: true,
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
         Plugin.CrawlLinks({ markdownLinkResolution: "relative" }),
         Plugin.Description(),
         Plugin.Latex({ renderEngine: "katex" }),
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
         Plugin.Assets(),
         Plugin.Static(),
         Plugin.NotFoundPage(),
         // Plugin.CustomOgImages(), // 暂时禁用，避免编码错误
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

3. **重要：将第 20 行的 `yourname.github.io` 替换为你的 GitHub 用户名**（例如：如果你的用户名是 `zhangsan`，就改为 `zhangsan.github.io`）

4. **保存文件**

### 5.11 创建 `quartz.layout.ts` 文件

1. **在项目文件夹根目录创建新文件**，命名为 `quartz.layout.ts`

2. **复制以下内容**（**重要：将 `yourname` 和 `my-notes` 替换为你的实际信息**）：
   ```typescript
   import { PageLayout, SharedLayout } from "quartz/cfg"
   import * as Component from "quartz/components"

   // 左侧边栏组件
   const left: Component.ComponentId[] = [
     Component.PageTitle(),
     Component.Search(), // 搜索组件
     Component.Darkmode(), // 深色模式切换
     Component.Explorer({ // 文件目录浏览器
       title: "📁 目录",
       folderClickBehavior: "collapse",
       folderDefaultState: "collapsed",
       useSavedState: true,
       mapFn: (node) => {
         // 自定义文件夹图标
         if (node.file !== undefined) {
           return {
             ...node,
             displayName: node.displayName ?? node.file.name,
           }
         }
         return node
       },
     }),
     Component.DesktopOnly(Component.RecentNotes({ // 最近笔记（仅桌面端）
       title: "最近更新",
       limit: 5,
       linkToMore: "tags/" as any,
     })),
     Component.DesktopOnly(Component.TagList({ // 标签列表（仅桌面端）
       title: "标签",
       limit: 10,
     })),
     Component.Graph({ // 知识图谱
       title: "知识图谱",
       localGraph: {
         drag: true,
         zoom: true,
         depth: -1,
         scale: 1.1,
         repelForce: 0.5,
         centerForce: 0.3,
         linkDistance: 30,
         linkStrength: 0.9,
         fontSize: 0.6,
         opacityScale: 1,
       },
       globalGraph: {
         drag: true,
         zoom: true,
         depth: -1,
         scale: 1,
         repelForce: 0.5,
         centerForce: 0.3,
         linkDistance: 30,
         linkStrength: 0.9,
         fontSize: 0.6,
         opacityScale: 1,
       },
     }),
   ]

   // 右侧边栏组件（文章目录）
   const right: Component.ComponentId[] = [
     Component.DesktopOnly(Component.TableOfContents({ // 文章目录（仅桌面端）
       title: "📑 目录",
     })),
     Component.DesktopOnly(Component.Backlinks({ // 反向链接（仅桌面端）
       title: "反向链接",
     })),
     Component.MobileOnly(Component.TableOfContents({ // 移动端目录
       title: "📑 目录",
     })),
     Component.MobileOnly(Component.Backlinks({ // 移动端反向链接
       title: "反向链接",
     })),
   ]

   // 顶部组件
   const header: Component.ComponentId[] = []

   // 底部组件
   const footer: Component.ComponentId[] = [
     Component.Footer({
       links: {
         "GitHub": "https://github.com/yourname/my-notes", // 替换为你的仓库地址
       },
     }),
   ]

   export const sharedPageComponents: SharedLayout = {
     left,
     right,
     header,
     footer,
   }

   export const defaultContentPageLayout: PageLayout = {
     beforeBody: [
       Component.Breadcrumbs(),
       Component.ArticleTitle(),
       Component.ContentMeta(),
       Component.TagList(),
     ],
     left: [],
     right: [],
   }

   export const defaultListPageLayout: PageLayout = defaultContentPageLayout
   ```

3. **重要：将第 85 行的 `https://github.com/yourname/my-notes` 替换为你的实际仓库地址**

4. **保存文件**

### 5.12 创建 `index.md` 文件（首页）

1. **在项目文件夹根目录创建新文件**，命名为 `index.md`

2. **复制以下内容**：
   ```markdown
   # 欢迎来到我的笔记

   这是我的笔记网站首页。

   你可以在这里添加任何内容。

   ## 快速开始

   - 开始写笔记
   - 使用双链功能连接笔记
   - 使用标签组织笔记
   ```

3. **保存文件**

### 5.13 创建 `README.md` 文件

1. **在项目文件夹根目录创建新文件**，命名为 `README.md`

2. **复制以下内容**：
   ```markdown
   # 我的笔记

   这是我的个人笔记仓库。

   ## 使用方法

   1. 在本地编辑笔记
   2. 提交更改到 GitHub
   3. 自动部署到网站
   ```

3. **保存文件**

---

## 第六步：配置 GitHub Pages

### 6.1 启用 GitHub Pages

1. **登录 GitHub**，进入你的仓库页面

2. **点击仓库顶部的 "Settings"**（设置）

3. **在左侧菜单中找到 "Pages"**（页面）

4. **配置 Pages**：
   - 在 **"Source"**（源）部分
   - 选择 **"GitHub Actions"**（不是 "Deploy from a branch"）
   - **重要**：这一步很关键，必须选择 "GitHub Actions"

5. **点击 "Save"**（保存）

6. **等待几秒钟**，页面会刷新

---

## 第七步：配置 GitHub Actions 工作流

### 7.1 创建工作流文件夹

1. **在项目文件夹中创建以下文件夹结构**：
   ```
   .github/
     workflows/
   ```
   注意：文件夹名前面有点号（`.`）

2. **在 `.github/workflows/` 文件夹中创建新文件**，命名为 `deploy.yml`

### 7.2 创建工作流文件

1. **打开 `deploy.yml` 文件**

2. **复制以下内容**（**重要：如果你的主分支是 `main` 而不是 `master`，将第 12 行的 `master` 改为 `main`**）：
   ```yaml
   name: Deploy Quartz site to GitHub Pages

   # 使用说明：
   # 1. 在 GitHub 仓库 Settings → Pages → Source 中选择 "GitHub Actions"
   # 2. 这样会使用此自定义工作流进行构建和部署
   # 3. 如果选择 "Deploy from a branch"，GitHub 会使用默认的 pages-build-deployment 工作流
   # 4. 两个工作流不能同时使用，必须在 GitHub Pages 设置中选择一个

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
     cancel-in-progress: true  # 取消正在进行的部署，避免冲突

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
         - name: Ensure quartz link
           run: node scripts/ensure-link.js
         - name: Verify quartz symlink
           run: |
             echo "Checking quartz symlink..."
             if [ -L quartz ]; then
               echo "✓ quartz is a symlink"
               LINK_TARGET=$(readlink quartz)
               echo "Symlink target: $LINK_TARGET"
               # 检查是否指向绝对路径
               if [[ "$LINK_TARGET" == /* ]]; then
                 echo "⚠ Warning: symlink points to absolute path, will be fixed by build.sh"
               else
                 echo "✓ symlink uses relative path"
               fi
               # 尝试解析路径（使用 realpath 或 readlink -f）
               if command -v realpath >/dev/null 2>&1; then
                 RESOLVED=$(realpath quartz 2>/dev/null || echo 'unknown')
               else
                 RESOLVED=$(readlink -f quartz 2>/dev/null || echo 'unknown')
               fi
               echo "Resolved path: $RESOLVED"
               if [ -f quartz/build.ts ]; then
                 echo "✓ quartz/build.ts exists"
               else
                 echo "✗ quartz/build.ts not found"
                 echo "This will be fixed by build.sh"
               fi
             elif [ -d quartz ]; then
               echo "⚠ quartz exists but is not a symlink"
               if [ -f quartz/build.ts ]; then
                 echo "✓ quartz/build.ts exists (but not a symlink)"
               else
                 echo "✗ quartz/build.ts not found"
                 exit 1
               fi
             else
               echo "✗ quartz does not exist (will be created by build.sh)"
             fi
         - name: Normalize markdown links
           run: npm run fix:links
         - name: Disable CustomOgImages plugin
           run: node scripts/disable-og.js
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

3. **重要：检查分支名称**：
   - 如果你的 GitHub 仓库主分支是 `main`，将第 12 行的 `master` 改为 `main`
   - 如果不确定，可以在 GitHub 仓库页面查看分支名称

4. **保存文件**

---

## 第八步：上传代码到 GitHub

### 8.1 安装依赖

1. **在终端/命令行中，进入项目文件夹**

2. **输入以下命令安装依赖**：
   ```bash
   npm install
   ```

3. **等待安装完成**（可能需要几分钟）
   - 你会看到很多输出信息
   - 最后应该显示类似 `added 518 packages, and audited 519 packages`

### 8.2 验证符号链接（可选）

**重要说明**：符号链接现在由脚本自动创建和管理，你**不需要手动创建**。

1. **运行以下命令验证符号链接**（可选）：
   ```bash
   node scripts/ensure-link.js
   ```
   
   如果看到 `quartz symlink is valid` 或 `Created symlink`，说明符号链接已正确创建。

2. **如果遇到问题**：
   - 确保已经运行了 `npm install`
   - 确保 `node_modules/quartz/quartz` 目录存在
   - 脚本会自动处理符号链接的创建和修复

### 8.3 首次提交代码

1. **添加所有文件到 Git**：
   ```bash
   git add .
   ```

2. **提交代码**：
   ```bash
   git commit -m "Initial commit: Setup Quartz note site"
   ```

3. **连接到远程仓库**（**将 `yourname` 和 `my-notes` 替换为你的实际信息**）：
   ```bash
   git remote add origin https://github.com/yourname/my-notes.git
   ```

4. **推送代码到 GitHub**：
   ```bash
   git push -u origin master
   ```
   
   **注意**：
   - 如果你的主分支是 `main`，将 `master` 改为 `main`
   - 第一次推送可能需要输入 GitHub 用户名和密码（或访问令牌）

5. **如果提示输入用户名和密码**：
   - **用户名**：输入你的 GitHub 用户名
   - **密码**：不能使用账户密码，需要使用 **Personal Access Token**（个人访问令牌）
   - **如何创建访问令牌**：
     1. 登录 GitHub
     2. 点击右上角头像 → **Settings**（设置）
     3. 左侧菜单最下方 → **Developer settings**（开发者设置）
     4. **Personal access tokens** → **Tokens (classic)**（经典令牌）
     5. 点击 **Generate new token**（生成新令牌）
     6. 勾选 **repo** 权限
     7. 点击 **Generate token**（生成令牌）
     8. **复制生成的令牌**（只显示一次，务必保存）
     9. 在命令行中输入令牌作为密码

---

## 第九步：测试部署

### 9.1 检查 GitHub Actions

1. **登录 GitHub**，进入你的仓库页面

2. **点击顶部的 "Actions"**（操作）标签

3. **你应该看到一个工作流正在运行**，名称是 "Deploy Quartz site to GitHub Pages"

4. **等待工作流完成**（通常需要 2-5 分钟）
   - 你会看到构建过程
   - 如果成功，会显示绿色的 ✓
   - 如果失败，会显示红色的 ✗

### 9.2 查看部署结果

1. **工作流完成后**，点击仓库顶部的 **"Settings"**（设置）

2. **点击左侧的 "Pages"**（页面）

3. **你应该看到网站地址**，格式为：`https://yourname.github.io/my-notes`

4. **点击链接访问网站**

5. **如果看到你的笔记网站**，恭喜！部署成功！

### 9.3 如果部署失败

如果部署失败，请检查：

1. **GitHub Pages 设置**：
   - 确保选择了 **"GitHub Actions"** 作为源

2. **工作流文件**：
   - 检查 `.github/workflows/deploy.yml` 文件是否正确
   - 检查分支名称是否匹配（`master` 或 `main`）

3. **配置文件**：
   - 检查 `quartz.config.ts` 中的 `baseUrl` 是否正确
   - 检查 `quartz.layout.ts` 中的 GitHub 链接是否正确

4. **查看错误信息**：
   - 在 **Actions** 标签中点击失败的工作流
   - 查看错误信息，根据提示修复

---

## 第十步：添加笔记内容

### 10.1 创建笔记文件

1. **在项目文件夹中创建 Markdown 文件**（`.md` 文件）

2. **例如，创建一个 `示例笔记.md` 文件**：
   ```markdown
   # 示例笔记

   这是我的第一篇笔记。

   ## 二级标题

   这里是一些内容。

   - 列表项 1
   - 列表项 2
   - 列表项 3

   ## 使用双链

   你可以使用双链连接其他笔记：[[示例笔记]]

   ## 使用标签

   使用标签组织笔记：#笔记 #示例
   ```

3. **保存文件**

### 10.2 上传笔记到 GitHub

1. **在终端/命令行中，进入项目文件夹**

2. **添加文件**：
   ```bash
   git add .
   ```

3. **提交更改**：
   ```bash
   git commit -m "Add example note"
   ```

4. **推送到 GitHub**：
   ```bash
   git push
   ```

5. **等待几分钟**，GitHub Actions 会自动部署

6. **刷新网站**，你应该能看到新添加的笔记

### 10.3 笔记写作技巧

1. **使用 Markdown 语法**：
   - `# 标题` - 一级标题
   - `## 标题` - 二级标题
   - `**粗体**` - 粗体文本
   - `*斜体*` - 斜体文本
   - `[链接文本](链接地址)` - 链接

2. **使用双链**：
   - `[[笔记名称]]` - 创建笔记之间的链接
   - 例如：`[[示例笔记]]` 会链接到名为 "示例笔记" 的笔记

3. **使用标签**：
   - `#标签名` - 添加标签
   - 例如：`#笔记 #技术`

4. **使用图片**：
   - 将图片放在 `img/` 文件夹中
   - 在笔记中使用：`![图片描述](img/图片名.png)`

---

## 常见问题

### Q1: 安装依赖时出错怎么办？

**A**: 检查以下几点：
- 确保 Node.js 已正确安装（运行 `node --version` 检查）
- 确保网络连接正常
- 尝试删除 `node_modules` 文件夹和 `package-lock.json` 文件，然后重新运行 `npm install`

### Q2: Git 推送时提示权限错误怎么办？

**A**: 
- 确保使用 Personal Access Token（个人访问令牌）而不是密码
- 检查令牌是否有 `repo` 权限
- 如果使用 HTTPS，尝试使用 SSH（需要在 GitHub 添加 SSH 密钥）

### Q3: GitHub Actions 构建失败怎么办？

**A**: 
- 检查 GitHub Pages 设置，确保选择了 "GitHub Actions"
- 检查工作流文件中的分支名称是否正确（`master` 或 `main`）
- 查看 Actions 中的错误信息，根据提示修复

### Q4: 网站显示 404 错误怎么办？

**A**: 
- 等待几分钟，GitHub Pages 部署需要时间
- 检查仓库是否公开（Public），如果是私有仓库，需要 GitHub Pro
- 检查 `quartz.config.ts` 中的 `baseUrl` 是否正确

### Q5: 图片无法显示怎么办？

**A**: 
- 确保图片在 `img/` 文件夹中
- 确保图片路径正确（例如：`img/图片名.png`）
- 确保已经运行了 `npm run build` 来修复图片路径
- 检查构建日志，确保 `fix-image-paths.js` 脚本已运行

### Q6: 符号链接相关错误怎么办？

**A**: 
- **错误信息**：`Could not resolve "./quartz/build.ts"` 或 `EEXIST: file already exists`
- **原因**：符号链接创建失败或指向错误的路径
- **解决方法**：
  1. 运行 `node scripts/ensure-link.js` 来修复符号链接
  2. 如果仍然失败，删除 `quartz` 文件夹（如果存在），然后重新运行脚本
  3. 在 Windows 系统上，确保以管理员权限运行，或者使用 Git Bash
  4. 脚本会自动检测并修复绝对路径的符号链接

### Q7: 如何自定义网站外观？

**A**: 
- 编辑 `quartz.config.ts` 文件中的 `theme` 部分
- 可以修改颜色、字体等
- 修改后提交并推送，网站会自动更新

### Q8: 如何添加更多功能？

**A**: 
- 查看 Quartz 官方文档：https://quartz.jzhao.xyz/
- 可以添加更多插件和组件
- 修改 `quartz.config.ts` 和 `quartz.layout.ts` 文件

---

## 总结

恭喜！你已经成功搭建了一个 GitHub 笔记仓库！

### 你已经完成的：

✅ 创建了 GitHub 账号和仓库  
✅ 安装了必要的软件（Git、Node.js）  
✅ 配置了项目文件  
✅ 配置了 GitHub Pages  
✅ 配置了 GitHub Actions 工作流  
✅ 部署了笔记网站  

### 接下来的步骤：

1. **开始写笔记**：在项目文件夹中创建 `.md` 文件
2. **提交更改**：使用 `git add .`、`git commit -m "消息"`、`git push`
3. **自动部署**：GitHub Actions 会自动构建和部署网站
4. **访问网站**：在 `https://yourname.github.io/my-notes` 查看你的笔记

### 常用命令总结：

```bash
# 安装依赖
npm install

# 本地预览（开发模式）
npm run dev

# 构建网站（会自动创建符号链接和修复链接）
npm run build

# 修复 Markdown 链接（单独运行）
npm run fix:links

# 修复图片路径（单独运行）
npm run fix

# 提交更改
git add .
git commit -m "描述"
git push
```

### 有用的资源：

- **Quartz 官方文档**：https://quartz.jzhao.xyz/
- **Markdown 语法**：https://www.markdownguide.org/
- **Git 教程**：https://git-scm.com/doc

---

**祝你使用愉快！如果遇到问题，可以查看常见问题部分，或者参考 Quartz 官方文档。**

---

**最后更新**：2025-11-06  
**版本**：v1.0

