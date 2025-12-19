# GitHub 开源贡献完整指南

> 从零开始学习如何在 GitHub 上参与开源项目，包括 Fork、Pull Request、代码审查等完整流程。

---

## 📚 目录

1. [为什么参与开源](#为什么参与开源)
2. [准备工作](#准备工作)
3. [寻找合适的项目](#寻找合适的项目)
4. [Fork 和 Clone](#fork-和-clone)
5. [设置开发环境](#设置开发环境)
6. [开始贡献](#开始贡献)
7. [如何提问和报告问题](#如何提问和报告问题)
8. [提交 Pull Request（提交代码）](#提交-pull-request提交代码)
9. [代码审查与反馈](#代码审查与反馈)
10. [维护 Fork](#维护-fork)
11. [高级技巧](#高级技巧)
12. [常见问题](#常见问题)

---

## 🎯 为什么参与开源

### 个人收益

- **提升技能**：学习优秀的代码和最佳实践
- **建立声誉**：在 GitHub 上建立个人品牌
- **扩展人脉**：结识志同道合的开发者
- **职业发展**：开源贡献是很好的简历亮点
- **回馈社区**：帮助改进你使用的工具和库

### 贡献类型

- **代码贡献**：修复 Bug、添加新功能
- **文档改进**：完善文档、翻译、修正错误
- **问题报告**：发现并报告 Bug
- **代码审查**：审查他人的 Pull Request
- **社区支持**：回答 Issue、帮助新用户

---

## 🚀 准备工作

### 1. 创建 GitHub 账号

如果没有账号，访问 [GitHub](https://github.com) 注册。

### 2. 配置 Git

```bash
# 设置用户名和邮箱
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 配置默认分支名
git config --global init.defaultBranch main

# 配置编辑器（可选）
git config --global core.editor "code --wait"  # VS Code
```

### 3. 设置 SSH 密钥（推荐）

```bash
# 生成 SSH 密钥
ssh-keygen -t ed25519 -C "your.email@example.com"

# 启动 ssh-agent
eval "$(ssh-agent -s)"

# 添加密钥到 ssh-agent
ssh-add ~/.ssh/id_ed25519

# 复制公钥内容
cat ~/.ssh/id_ed25519.pub

# 添加到 GitHub: Settings > SSH and GPG keys > New SSH key
```

### 4. 安装必要的工具

- **Git**：版本控制系统
- **代码编辑器**：VS Code、Vim 等
- **命令行工具**：Terminal、iTerm2 等

---

## 🔍 寻找合适的项目

### 1. 从你使用的项目开始

- 你正在使用的库或框架
- 你遇到 Bug 的项目
- 你想添加功能的项目

### 2. 使用 GitHub 探索功能

- [GitHub Explore](https://github.com/explore) - 发现热门项目
- [GitHub Topics](https://github.com/topics) - 按主题浏览
- [GitHub Trending](https://github.com/trending) - 查看趋势项目

### 3. 寻找适合新手的项目

**标识**：
- `good first issue` 标签
- `help wanted` 标签
- `beginner-friendly` 标签
- 活跃的维护者
- 清晰的贡献指南

### 4. 检查项目状态

**健康指标**：
- ✅ 最近有提交记录
- ✅ 有活跃的 Issue 讨论
- ✅ 维护者及时回复
- ✅ 有清晰的 README 和文档
- ❌ 避免：长期无更新、无维护者回复

---

## 🍴 Fork 和 Clone

### 1. Fork 项目

1. 打开项目主页
2. 点击右上角的 **Fork** 按钮
3. 选择 Fork 到你的账号

**Fork 的作用**：
- 在你的账号下创建项目副本
- 可以自由修改而不影响原项目
- 可以提交 Pull Request 到原项目

### 2. Clone Fork 的项目

```bash
# 使用 SSH（推荐）
git clone git@github.com:YOUR_USERNAME/REPO_NAME.git

# 或使用 HTTPS
git clone https://github.com/YOUR_USERNAME/REPO_NAME.git

# 进入项目目录
cd REPO_NAME
```

### 3. 添加上游仓库（重要）

```bash
# 查看远程仓库
git remote -v

# 添加上游仓库（原项目）
git remote add upstream https://github.com/ORIGINAL_OWNER/REPO_NAME.git

# 验证添加成功
git remote -v
# 应该看到：
# origin    https://github.com/YOUR_USERNAME/REPO_NAME.git (fetch)
# origin    https://github.com/YOUR_USERNAME/REPO_NAME.git (push)
# upstream  https://github.com/ORIGINAL_OWNER/REPO_NAME.git (fetch)
# upstream  https://github.com/ORIGINAL_OWNER/REPO_NAME.git (push)
```

---

## ⚙️ 设置开发环境

### 1. 阅读贡献指南

**查找以下文件**：
- `CONTRIBUTING.md` - 贡献指南
- `README.md` - 项目说明
- `CODE_OF_CONDUCT.md` - 行为准则
- `LICENSE` - 许可证

**重要信息**：
- 代码风格要求
- 提交信息格式
- 测试要求
- 分支命名规范

### 2. 安装依赖

```bash
# Node.js 项目
npm install
# 或
yarn install

# Python 项目
pip install -r requirements.txt

# 其他项目根据 README 说明安装
```

### 3. 运行测试

```bash
# 确保测试通过
npm test
# 或
pytest
```

### 4. 检查现有 Issue 和 PR

**避免重复工作**：
- 搜索相关 Issue
- 查看开放的 Pull Request
- 确认你的想法还没有被实现

---

## 💻 开始贡献

### 1. 创建新分支

```bash
# 从最新的 main 分支创建
git checkout main
git pull upstream main

# 创建新分支（使用描述性名称）
git checkout -b fix/typo-in-readme
# 或
git checkout -b feature/add-new-function
# 或
git checkout -b docs/update-installation-guide
```

**分支命名规范**：
- `fix/` - Bug 修复
- `feature/` - 新功能
- `docs/` - 文档更新
- `refactor/` - 代码重构
- `test/` - 测试相关

### 2. 进行修改

**最佳实践**：
- 一次只做一个改动
- 保持改动小而专注
- 遵循项目代码风格
- 添加必要的注释
- 更新相关文档

### 3. 提交更改

```bash
# 查看修改的文件
git status

# 查看具体改动
git diff

# 添加文件到暂存区
git add file1.js file2.js
# 或添加所有改动
git add .

# 提交（使用清晰的提交信息）
git commit -m "fix: 修复 README 中的拼写错误"
```

**提交信息规范**（遵循 Conventional Commits）：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型（type）**：
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具相关

**示例**：
```bash
git commit -m "fix(parser): 修复解析空字符串时的错误

修复了当输入为空字符串时解析器崩溃的问题。
添加了相应的单元测试。

Closes #123"
```

### 4. 保持分支同步

```bash
# 在提交 PR 之前，确保与上游同步
git checkout main
git pull upstream main

# 回到你的分支
git checkout your-branch

# 合并上游更改（或使用 rebase）
git merge upstream/main
# 或
git rebase upstream/main
```

---

## 💬 如何提问和报告问题

### 1. 提问前准备

**在提问前，请先**：
- ✅ 搜索现有的 Issue，看是否已有相同问题
- ✅ 阅读项目的 README 和文档
- ✅ 查看 FAQ 或常见问题
- ✅ 确认问题确实存在且可复现

### 2. 创建 Issue

**步骤**：
1. 打开项目主页，点击 **Issues** 标签
2. 点击 **New Issue** 按钮
3. 选择合适的 Issue 模板（Bug Report、Feature Request 等）
4. 填写详细信息

### 3. Bug 报告模板

```markdown
## 问题描述
清晰简洁地描述问题

## 复现步骤
1. 执行 '...'
2. 点击 '....'
3. 滚动到 '....'
4. 看到错误

## 预期行为
描述你期望发生什么

## 实际行为
描述实际发生了什么

## 截图
如果适用，添加截图帮助说明问题

## 环境信息
- OS: [e.g. macOS 12.0]
- 浏览器: [e.g. Chrome 96.0]
- 版本: [e.g. 1.2.3]

## 附加信息
任何其他相关信息
```

### 4. 功能请求模板

```markdown
## 功能描述
清晰简洁地描述你想要的功能

## 问题描述
这个功能要解决什么问题？为什么需要它？

## 建议的解决方案
描述你希望如何实现这个功能

## 替代方案
描述你考虑过的其他解决方案

## 附加信息
任何其他相关信息、截图等
```

### 5. 提问的最佳实践

**好的提问**：
- ✅ 清晰的问题描述
- ✅ 提供复现步骤
- ✅ 包含环境信息
- ✅ 提供错误信息或日志
- ✅ 说明你已经尝试过的解决方案

**不好的提问**：
- ❌ "这个不工作"（太模糊）
- ❌ "帮我修复这个"（没有具体信息）
- ❌ "为什么这么慢？"（没有上下文）
- ❌ 不提供环境信息
- ❌ 不搜索现有 Issue

### 6. 提问示例

**❌ 不好的提问**：
```
这个功能坏了，请修复。
```

**✅ 好的提问**：
```markdown
## 问题描述
在登录页面输入用户名和密码后，点击登录按钮没有反应。

## 复现步骤
1. 打开 https://example.com/login
2. 输入用户名：test@example.com
3. 输入密码：password123
4. 点击"登录"按钮
5. 页面没有任何反应，没有跳转，也没有错误提示

## 预期行为
应该跳转到用户主页

## 环境信息
- OS: macOS 12.0
- 浏览器: Chrome 96.0.4664.110
- 项目版本: 2.1.0

## 控制台错误
```
Uncaught TypeError: Cannot read property 'login' of undefined
    at login.js:45
```

## 我已经尝试过
- 清除浏览器缓存
- 使用其他浏览器（Firefox）也有同样问题
- 检查网络连接正常
```

### 7. 在 Issue 中互动

**回应维护者**：
- 及时回复问题
- 提供额外信息
- 测试建议的解决方案
- 标记问题是否已解决

**帮助其他用户**：
- 回答你能回答的问题
- 提供解决方案
- 分享你的使用经验

---

## 📤 提交 Pull Request（提交代码）

### 1. 完整的代码提交流程

#### 步骤 1: Fork 并 Clone 项目

```bash
# 1. 在 GitHub 上 Fork 项目（点击 Fork 按钮）

# 2. Clone 你的 Fork
git clone https://github.com/YOUR_USERNAME/REPO_NAME.git
cd REPO_NAME

# 3. 添加上游仓库
git remote add upstream https://github.com/ORIGINAL_OWNER/REPO_NAME.git
```

#### 步骤 2: 创建功能分支

```bash
# 确保 main 分支是最新的
git checkout main
git pull upstream main

# 创建新分支
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/bug-description
```

#### 步骤 3: 进行代码修改

```bash
# 编辑文件，进行修改
# 使用你喜欢的编辑器

# 查看修改
git status
git diff
```

#### 步骤 4: 提交代码

```bash
# 添加修改的文件
git add file1.js file2.js
# 或添加所有修改
git add .

# 提交（使用清晰的提交信息）
git commit -m "feat: 添加用户登录功能

- 实现用户名密码登录
- 添加登录验证逻辑
- 更新相关文档

Closes #123"
```

**提交信息规范**：
- 使用 Conventional Commits 格式
- 第一行：简短描述（50 字以内）
- 空行
- 详细描述（可选）
- 空行
- 关联 Issue（可选）

#### 步骤 5: 保持分支同步

```bash
# 在提交 PR 前，确保与上游同步
git checkout main
git pull upstream main

# 回到你的分支
git checkout feature/your-feature-name

# 合并或变基上游更改
git merge upstream/main
# 或
git rebase upstream/main
```

#### 步骤 6: 推送分支

```bash
# 推送到你的 Fork
git push origin feature/your-feature-name

# 如果是第一次推送，设置上游
git push -u origin feature/your-feature-name
```

### 2. 创建 Pull Request

#### 方法一：通过 GitHub 网页

1. **打开你的 Fork 页面**
   - 访问 `https://github.com/YOUR_USERNAME/REPO_NAME`

2. **点击 "Compare & pull request" 按钮**
   - GitHub 会在你推送新分支后显示这个按钮
   - 或点击 "Pull requests" > "New pull request"

3. **选择分支**
   - Base: 原项目的 `main` 分支
   - Compare: 你的 `feature/your-feature-name` 分支

4. **填写 PR 信息**（见下方模板）

#### 方法二：通过 GitHub CLI

```bash
# 安装 GitHub CLI
brew install gh  # macOS

# 登录
gh auth login

# 创建 PR
gh pr create --title "feat: 添加用户登录功能" --body "PR 描述"
```

### 3. PR 描述模板（详细版）

```markdown
## 📝 描述
简要描述这个 PR 做了什么改动

## 🔗 相关 Issue
Closes #123
Fixes #456
Related to #789

## 🎯 改动类型
请选择适用的类型：
- [ ] 🐛 Bug 修复
- [ ] ✨ 新功能
- [ ] 📝 文档更新
- [ ] ♻️ 代码重构
- [ ] ⚡️ 性能优化
- [ ] 🧪 测试相关
- [ ] 🔧 构建/工具相关
- [ ] 🎨 代码风格

## 🔄 改动说明
详细说明你做了什么改动：

### 主要改动
- 添加了 xxx 功能
- 修复了 xxx 问题
- 更新了 xxx 文档

### 技术细节
- 使用了 xxx 技术
- 修改了 xxx 文件
- 添加了 xxx 依赖

## 🧪 测试
- [ ] 已添加单元测试
- [ ] 已添加集成测试
- [ ] 已通过所有现有测试
- [ ] 已手动测试
- [ ] 测试覆盖率达到要求

### 测试步骤
1. 执行 `npm test`
2. 手动测试 xxx 功能
3. 验证 xxx 场景

## 📸 截图/演示（如适用）
<!-- 如果是 UI 改动，添加截图或 GIF -->
![截图描述](截图链接)

## ✅ 检查清单
在提交 PR 前，请确认：

- [ ] 代码遵循项目的代码风格指南
- [ ] 已更新相关文档（README、API 文档等）
- [ ] 已添加必要的测试
- [ ] 所有测试通过（`npm test`）
- [ ] 已检查代码冲突
- [ ] 提交信息遵循 Conventional Commits 规范
- [ ] 代码已通过 lint 检查
- [ ] 已检查性能影响（如适用）

## 🔍 审查者注意
<!-- 需要审查者特别关注的地方 -->
- 请重点审查 xxx 部分
- 这个改动可能影响 xxx

## 📚 相关文档
- [相关文档链接]
- [设计文档]
```

### 4. 如何请求合并（跟进 PR）

#### 等待审查

**PR 创建后**：
- 等待维护者或审查者查看
- 通常会在 1-3 个工作日内收到反馈
- 可以通过邮件或 GitHub 通知收到更新

#### 请求审查

**方法一：在 PR 中 @ 相关人员**
```markdown
@maintainer1 @maintainer2 请帮忙审查这个 PR，谢谢！
```

**方法二：使用 GitHub 的 Reviewers 功能**
1. 在 PR 页面右侧找到 "Reviewers"
2. 点击 "Request review"
3. 选择要请求审查的人

**方法三：在项目讨论区提及**
- 如果项目有 Discord、Slack 等讨论区
- 可以在讨论区提及你的 PR

#### 跟进 PR 状态

**查看 PR 状态**：
- ✅ **绿色勾**：所有检查通过
- ❌ **红色叉**：有检查失败，需要修复
- ⏳ **黄色圆**：检查进行中
- 💬 **评论**：有审查者评论

**处理检查失败**：
```bash
# 查看失败原因
# 在 PR 页面点击 "Details" 查看详细错误

# 修复问题后
git add .
git commit -m "fix: 修复 CI 检查失败"
git push origin feature/your-feature-name
```

#### 回应审查反馈

**收到反馈后**：

1. **仔细阅读所有评论**
   - 理解每个建议
   - 确认需要修改的地方

2. **在 PR 中回复**
   ```markdown
   感谢审查！我会根据您的建议进行修改。
   ```

3. **进行修改**
   ```bash
   # 在同一个分支上继续修改
   git add .
   git commit -m "fix: 根据审查反馈修改代码"
   git push origin feature/your-feature-name
   ```

4. **标记评论为已解决**（如适用）
   - 在 GitHub 上可以标记评论为 "Resolved"

5. **请求再次审查**
   ```markdown
   已完成修改，请再次审查。@reviewer
   ```

#### 处理请求的更改

**如果维护者请求更改**：

```bash
# 1. 根据反馈修改代码
# 编辑文件...

# 2. 提交修改
git add .
git commit -m "fix: 根据审查反馈修改"

# 3. 推送更新（PR 会自动更新）
git push origin feature/your-feature-name

# 4. 在 PR 中回复
# "已完成修改，请再次审查"
```

#### PR 被合并后

**合并成功**：
- 你会收到通知
- PR 状态变为 "Merged"
- 你的贡献会出现在项目贡献者列表中

**合并后清理**：
```bash
# 1. 切换到 main 分支
git checkout main

# 2. 从上游拉取最新代码（包含你的贡献）
git pull upstream main

# 3. 删除本地功能分支
git branch -d feature/your-feature-name

# 4. 删除远程分支（可选）
git push origin --delete feature/your-feature-name

# 5. 更新你的 Fork 的 main 分支
git push origin main
```

#### PR 被关闭或拒绝

**如果 PR 被关闭**：
- 不要灰心，这是学习过程
- 仔细阅读关闭原因
- 询问如何改进
- 可以基于反馈创建新的 PR

**回应示例**：
```markdown
感谢您的反馈。我理解这个 PR 不符合项目方向。
我会根据您的建议重新考虑实现方式。
```

### 5. PR 状态说明

| 状态 | 说明 | 操作 |
|------|------|------|
| **Open** | PR 已创建，等待审查 | 等待审查者查看 |
| **Draft** | 草稿状态，未准备好审查 | 完成后点击 "Ready for review" |
| **Review** | 正在审查中 | 回应审查者的反馈 |
| **Changes requested** | 需要修改 | 根据反馈修改代码 |
| **Approved** | 已批准 | 等待合并 |
| **Merged** | 已合并 | 清理分支 |
| **Closed** | 已关闭 | 查看关闭原因 |

### 6. 加速 PR 合并的技巧

**提高 PR 被接受的概率**：
- ✅ 遵循项目代码风格
- ✅ 添加充分的测试
- ✅ 更新相关文档
- ✅ 保持 PR 小而专注
- ✅ 提供清晰的描述
- ✅ 及时回应反馈
- ✅ 关联相关 Issue
- ✅ 确保所有检查通过

**避免的问题**：
- ❌ PR 太大（包含多个不相关的改动）
- ❌ 不遵循代码风格
- ❌ 缺少测试
- ❌ 不更新文档
- ❌ 不及时回应反馈
- ❌ 不关联相关 Issue

---

## 🔍 代码审查与反馈

### 1. 处理反馈

**常见反馈类型**：
- 代码风格问题
- 需要添加测试
- 需要更新文档
- 逻辑问题
- 性能优化建议

### 2. 根据反馈修改

```bash
# 在同一个分支上继续修改
git add .
git commit -m "fix: 根据审查反馈修改代码风格"

# 推送到同一分支（PR 会自动更新）
git push origin your-branch-name
```

### 3. 处理冲突

```bash
# 如果上游有新的提交，先同步
git checkout main
git pull upstream main

# 回到你的分支
git checkout your-branch

# 合并或变基
git merge upstream/main
# 或
git rebase upstream/main

# 解决冲突后
git add .
git commit -m "fix: 解决合并冲突"
git push origin your-branch-name
```

### 4. 回应审查者

- 及时回复评论
- 感谢反馈
- 说明你的修改
- 如有疑问，礼貌询问

---

## 🔄 维护 Fork

### 1. 同步上游更改

```bash
# 切换到 main 分支
git checkout main

# 从上游拉取最新更改
git pull upstream main

# 推送到你的 Fork
git push origin main
```

### 2. 清理旧分支

```bash
# 删除本地分支
git branch -d old-branch-name

# 删除远程分支
git push origin --delete old-branch-name
```

### 3. 保持 Fork 整洁

- 定期同步上游
- 删除已合并的分支
- 清理无用的 Fork

---

## 🎓 高级技巧

### 1. 使用 GitHub CLI

```bash
# 安装 GitHub CLI
# macOS
brew install gh

# 登录
gh auth login

# 创建 PR
gh pr create --title "fix: 修复 Bug" --body "描述"

# 查看 PR 列表
gh pr list

# 合并 PR
gh pr merge 123
```

### 2. 使用 Issue 模板

许多项目有 Issue 模板，使用模板可以：
- 提供必要信息
- 帮助维护者理解问题
- 提高问题解决效率

### 3. 参与讨论

- 在 Issue 中提供帮助
- 回答其他贡献者的问题
- 参与代码审查
- 分享使用经验

### 4. 成为维护者

长期贡献者可能被邀请成为：
- **Collaborator**：可以合并 PR
- **Maintainer**：可以管理项目
- **Owner**：项目所有者

---

## ❓ 常见问题

### Q1: 我的 PR 被拒绝了怎么办？

**A**: 
- 不要灰心，这是正常的
- 仔细阅读反馈
- 询问如何改进
- 根据反馈修改后重新提交

### Q2: 如何找到适合新手的项目？

**A**:
- 搜索 `good first issue` 标签
- 查看项目的 CONTRIBUTING.md
- 选择你熟悉的技术栈
- 从小改动开始（如文档、拼写错误）

### Q3: 如何保持 Fork 同步？

**A**:
```bash
# 定期执行
git checkout main
git pull upstream main
git push origin main
```

### Q4: 可以同时提交多个 PR 吗？

**A**: 
- 可以，但建议一次专注于一个
- 每个 PR 应该是独立的改动
- 避免 PR 之间的依赖

### Q5: 如何贡献到不接受 PR 的项目？

**A**:
- 查看项目的贡献指南
- 可能需要在邮件列表讨论
- 可能需要使用补丁文件
- 遵循项目的特定流程

### Q6: 我的贡献会被接受吗？

**A**:
- 不是所有贡献都会被接受
- 可能因为：不符合项目方向、已有类似实现、需要更多讨论等
- 即使被拒绝，也是学习的机会

---

## 📖 学习资源

### 官方文档

- [GitHub 文档](https://docs.github.com/)
- [Git 官方文档](https://git-scm.com/doc)
- [GitHub 协作指南](https://docs.github.com/en/pull-requests)

### 推荐阅读

- [First Contributions](https://firstcontributions.github.io/) - 新手贡献指南
- [Open Source Guide](https://opensource.guide/) - 开源指南
- [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)

### 实践项目

- [First Contributions](https://github.com/firstcontributions/first-contributions) - 练习项目
- [24 Pull Requests](https://24pullrequests.com/) - 鼓励 12 月贡献开源

---

## 💡 最佳实践总结

### 贡献前

- ✅ 阅读贡献指南
- ✅ 检查现有 Issue 和 PR
- ✅ 确认项目接受贡献
- ✅ 理解项目代码风格

### 贡献时

- ✅ 保持改动小而专注
- ✅ 遵循代码规范
- ✅ 添加必要的测试
- ✅ 更新相关文档
- ✅ 编写清晰的提交信息

### 提交 PR

- ✅ 清晰的标题和描述
- ✅ 关联相关 Issue
- ✅ 添加测试和文档
- ✅ 确保所有检查通过

### 审查后

- ✅ 及时回应反馈
- ✅ 根据反馈修改
- ✅ 保持礼貌和专业
- ✅ 从反馈中学习

---

## 🎯 开始你的第一次贡献

### 快速开始步骤

1. **选择一个项目**：从你使用的项目开始
2. **Fork 项目**：点击 Fork 按钮
3. **Clone 到本地**：`git clone ...`
4. **创建分支**：`git checkout -b fix/xxx`
5. **进行修改**：修复 Bug 或添加功能
6. **提交更改**：`git commit -m "fix: ..."`
7. **推送分支**：`git push origin fix/xxx`
8. **创建 PR**：在 GitHub 上点击 "New Pull Request"
9. **等待审查**：维护者会审查你的代码
10. **根据反馈修改**：如有需要，继续修改

### 推荐新手任务

- 修复文档中的拼写错误
- 改进 README 的说明
- 添加代码注释
- 修复简单的 Bug
- 添加单元测试
- 改进错误信息

---

**记住**：开源贡献是一个学习过程，不要害怕犯错。每个贡献者都从第一次开始，社区通常很友好，会帮助你成长！

---

#GitHub #开源贡献 #PullRequest #Git #协作
