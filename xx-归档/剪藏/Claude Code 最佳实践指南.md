[Site Unreachable](https://zhuanlan.zhihu.com/p/2009744974980331332)

## 前言

本文档的核心目标：帮助团队成员**高效使用 [Claude Code](https://zhida.zhihu.com/search?content_id=270598290&content_type=Article&match_order=1&q=Claude+Code&zhida_source=entity)**。

内容以 [官方最佳实践](https://link.zhihu.com/?target=https%3A//code.claude.com/docs/en/best-practices) 为主线，穿插 Claude Code 之父 **[Boris Cherny](https://zhida.zhihu.com/search?content_id=270598290&content_type=Article&match_order=1&q=Boris+Cherny&zhida_source=entity)** 在 X 上分享的真实工作流（标注为 **Boris Pro Tip**），并从团队实践中提取实用模板。

**一个核心约束贯穿全文**：Claude 的上下文窗口（~200K tokens）会快速填满，而填满后性能会下降。几乎所有最佳实践都围绕这个约束展开。

### 难度标注

本文档使用以下标注帮助你根据自身水平选择性阅读：

|标注|含义|建议|
|---|---|---|
|🟢 基础|每个用户都需要掌握|必读|
|🟡 进阶|提升效率的关键技巧|熟练后阅读|
|🔴 高级|团队级和自动化场景|按需深入|

> 在开始具体操作之前，先建立对 Claude Code 的整体认知。

## 1.1 Claude Code 的核心交互模型 🟢

当你给 Claude 一个任务时，它会经历三个阶段：**收集上下文**、**采取行动**和**验证结果**。这些阶段相互融合。Claude 始终使用工具，无论是搜索文件以了解你的代码、编辑以进行更改，还是运行测试以检查其工作。

![](https://pica.zhimg.com/v2-4a828e29baaebf2669fa3ae5e7bfdc06_1440w.jpg)

你可以在任何时刻中断以引导 Claude 朝不同的方向发展、提供额外的上下文或要求它尝试不同的方法。Claude 自主工作但对你的输入保持响应。

**你的角色**：

|你做什么|Claude 做什么|
|---|---|
|通过 @ 引用文件，帮 Claude 看见正确的上下文|阅读文件、搜索代码、理解架构|
|用自然语言描述需求，帮 Claude 思考正确的方向|分析问题、规划方案、评估风险|
|配置权限，让 Claude 能够行动|编辑文件、运行测试、执行命令|

### @ 和 ! 速览

|符号|作用|示例|
|---|---|---|
|@|感知：将文件/资源注入上下文|解释 @src/auth.ts 的逻辑|
|!|行动：在提示框中直接执行 Shell|! git log --oneline -5（结果注入上下文）|

```
# @ 的常见用法
> 解释 @src/auth.ts 的逻辑              # 引用单个文件
> 对比 @old-api.ts 和 @new-api.ts       # 引用多个文件
> @src/components 的结构是什么？          # 引用目录

# ! 的常见用法
> ! git diff --stat                       # 执行命令，结果注入上下文
> ! npm test 2>&1 | tail -20              # 运行测试，截取尾部
```

> **关键洞察**：`@` 每次引用都消耗上下文 token——1000 行的文件约占数千 token。所以要精准引用，只给 Claude 它确实需要看的内容。

## 1.2 [Effort Level](https://zhida.zhihu.com/search?content_id=270598290&content_type=Article&match_order=1&q=Effort+Level&zhida_source=entity) 🟢

[Opus 4.6](https://zhida.zhihu.com/search?content_id=270598290&content_type=Article&match_order=1&q=Opus+4.6&zhida_source=entity) 引入了 **[Adaptive Thinking](https://zhida.zhihu.com/search?content_id=270598290&content_type=Article&match_order=1&q=Adaptive+Thinking&zhida_source=entity)**（自适应思考）——Claude 会根据任务复杂度自动决定是否以及多少使用深度推理。你通过 **effort level** 来控制推理深度，而不再需要在提示词中写 `think hard` 或 `ultrathink` 等关键词。

**三个等级：**

|Effort Level|推理行为|适用场景|
|---|---|---|
|High（默认）|Claude 几乎总是进行深度思考|复杂架构设计、多文件重构、疑难 Bug|
|Medium|适度思考，简单问题可能跳过|日常编码、跨文件修改、中等复杂度任务|
|Low|最小化思考，优先速度|简单问答、格式化、小修改|

> 💡 API 层面还支持 **max** 等级（仅 Opus 4.6），思考无上限。Claude Code CLI 目前暴露 low/medium/high 三级。

**配置方式（三选一）：**

```
# 方式 1：在 /model 菜单中用 ← → 箭头键调节滑块
/model

# 方式 2：环境变量
export CLAUDE_CODE_EFFORT_LEVEL=low    # low | medium | high

# 方式 3：settings.json
{
  "effortLevel": "high"
}
```

> **Boris Pro Tip B1**：Boris 的日常配置是 Opus + High Effort，用于所有任务。他认为最强模型 + 深度推理是产出高质量代码的基础。

![](https://pic4.zhimg.com/v2-191d1b625e60f5cedde58ebcf1f983cd_1440w.jpg)

## 1.3 学习路线图 🟢

![](https://pica.zhimg.com/v2-281400b6207dd52251d45ef39430bb30_1440w.jpg)

**三条推荐路线**：

|路线|适合谁|章节|
|---|---|---|
|🟢 快速入门|第一次用 Claude Code|1 → 2 → 3 → 4|
|🟡 效率提升|已经在用，想更高效|5 → 6 → 7 → 8|
|🔴 团队推广|团队负责人 / Tech Lead|9 → 10 → 附录 A|

## 2 快速上手

> 🟢 基础 | 从安装到第一次对话

## 2.1 安装 Claude Code 🟢

![](https://pic2.zhimg.com/v2-ad043e0795f9808265dede985d7b3a67_1440w.jpg)

> **推荐**：使用原生安装（curl / PowerShell），支持后台自动更新。

### 验证安装

## 2.2 首次启动 🟢

首次运行会提示登录，支持以下方式：  
- **Claude Max/Pro 订阅**：通过 [http://claude.com](https://link.zhihu.com/?target=http%3A//claude.com) 登录  
- **Anthropic Console API**：使用 API Key  
- **第三方提供商**：AWS Bedrock / Google Vertex 等

## 2.3 使用环境选择 🟢

Claude Code 可以在多种环境中运行：

|环境|适用场景|特点|
|---|---|---|
|终端 CLI|日常开发主力|功能最完整，直接操作文件系统|
|VS Code 扩展|偏好 IDE 内操作|内联 Diff、@引用、计划审查|
|JetBrains 插件|IntelliJ/PyCharm 用户|交互式 Diff、选择上下文|
|Desktop 应用|多会话并行|可视化 Diff 审查，多窗口管理|
|Web 版|无需本地安装|云端运行，支持长任务|
|Chrome 扩展|UI 测试调试|直接操作浏览器验证 UI|

> **建议**：终端 CLI 是功能最全的入口。VS Code 扩展适合习惯 IDE 的开发者。两者可以同时使用。

## 2.4 项目目录结构全景 🟢

一个完整的 Claude Code 项目配置结构：

```
your-project/
├── CLAUDE.md                    # 📋 项目级指令（团队共享，提交到 Git）
├── CLAUDE.local.md              # 👤 个人项目偏好（自动 gitignore）
├── .claude/
│   ├── settings.json            # ⚙️ 项目设置（团队共享）
│   ├── settings.local.json      # 👤 个人项目设置（gitignore）
│   ├── CLAUDE.md                # 📋 等效于根目录 CLAUDE.md
│   ├── rules/                   # 📏 模块化规则文件
│   │   ├── code-style.md        #    代码风格
│   │   ├── testing.md           #    测试规范
│   │   └── security.md          #    安全要求
│   ├── agents/                  # 🤖 自定义子代理
│   │   ├── code-reviewer.md
│   │   └── debugger.md
│   ├── skills/                  # ⚡ 自定义技能
│   │   └── fix-issue/
│   │       └── SKILL.md
│   └── worktrees/               # 🌳 Git Worktree 目录（加入 .gitignore）
├── .mcp.json                    # 🔌 项目级 MCP 服务器配置
└── .github/
    └── workflows/
        └── claude.yml           # 🔄 Claude Code GitHub Actions
```

> **新手提示**：刚开始只需要 `CLAUDE.md` 和 `.claude/settings.json`。其他配置随着需求逐步添加。

## 2.5 settings.json 分层配置 🟡

Claude Code 使用分层配置系统，优先级从高到低：

|优先级|层级|位置|作用范围|是否共享|
|---|---|---|---|---|
|最高 🔴|托管策略|系统级路径（IT 部署）|组织内所有用户|是|
|↓|命令行参数|CLI flags|当前会话|否|
|↓|本地项目设置|.claude/settings.local.json|你在此项目|否|
|↓|共享项目设置|.claude/settings.json|所有协作者|是（提交 Git）|
|最低 🟢|用户设置|~/.claude/settings.json|你的所有项目|否|

> **规则**：高优先级覆盖低优先级。托管策略不可覆盖。

基础配置示例：

```
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": [
      "Bash(npm run lint)",
      "Bash(npm run test *)",
      "Bash(git commit *)"
    ],
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Bash(curl *)"
    ]
  },
  "enabledPlugins": {
    "example-skills@anthropic-agent-skills": true,
    "context7@claude-plugins-official": true
  },
  "alwaysThinkingEnabled": true,
  "env": {
    "CLAUDE_CODE_EFFORT_LEVEL": "high"
  }
}
```

> **提示**：添加 `$schema` 字段可以在 VS Code / Cursor 中获得自动补全。

## 2.6 必备 [CLI 工具](https://zhida.zhihu.com/search?content_id=270598290&content_type=Article&match_order=1&q=CLI+%E5%B7%A5%E5%85%B7&zhida_source=entity) 🟢

Claude Code 可以调用任何已安装的 CLI 工具。以下工具强烈建议提前安装：

```
# GitHub CLI（Claude Code 用它操作 PR、Issue）
brew install gh
gh auth login

# jq（Hooks 脚本中解析 JSON 必备）
brew install jq

# ripgrep（高速代码搜索）
brew install ripgrep
```

> **关键**：CLI 工具是与外部服务交互最节省上下文的方式。例如 `gh`、`aws`、`gcloud`、`sentry-cli` 等。

## 2.7 快速验证配置 🟢

```
cd your-project
claude

# 在 Claude Code 中运行
> /init          # 自动生成 CLAUDE.md
> /config        # 查看/修改全局配置
> /permissions   # 查看/修改权限规则
> /cost          # 查看当前会话 token 用量
> /context       # 查看上下文消耗分布
```

## 2.8 你的第一次对话 🟢

安装完成后，试试这些命令快速上手：

```
# 探索项目（最安全的开始方式）
> 给我一个这个代码库的概览

# 理解代码
> 解释 @src/main.ts 的主要逻辑

# 做一个小修改
> 把 @src/utils/format.ts 中的 formatDate 函数改为支持 ISO 8601 格式

# 验证修改
> 运行测试确认修改没有破坏任何东西
```

> 🎉 **恭喜！** 如果你完成了以上步骤，你已经迈入了 Claude Code 的大门。接下来的章节会帮你逐步精通。

## 3 给 Claude 验证自己工作的能力

> 🟢 基础 | **官方最佳实践 #1**：这是提升质量最有效的单一策略。

## 3.1 为什么验证如此重要 🟢

Claude 在能够验证自己工作的时候表现**远更好**——可以运行测试、对比截图、校验输出。

没有明确的验证手段时，它可能产出看起来对但实际不工作的代码。你成了唯一的反馈回路，每个错误都需要你来发现。

![](https://picx.zhimg.com/v2-76dda6d35af8178d7183526d0679eff9_1440w.jpg)

> **Boris Pro Tip B2**：Boris 认为验证是让 Claude 产出质量提升 2-3 倍的关键。他的经验是：**给 Claude 一个反馈循环，它就能自我纠正。不给反馈循环，它就在猜。**

## 3.2 四种验证策略 🟢

|策略|模糊做法 ❌|高效做法 ✅|
|---|---|---|
|提供测试用例|"实现一个验证邮箱的函数"|"写一个 validateEmail 函数。测试: user@example.com → true, invalid → false, user@.com → false。实现后运行测试。"|
|UI 变更截图对比|"让 dashboard 更好看"|"[粘贴截图] 按这个设计实现。完成后截图对比原图，列出差异并修复。"|
|根因修复|"构建失败了"|"构建失败，错误信息: [粘贴]。修复它并验证构建成功。解决根本原因，不要抑制错误。"|
|指定验证命令|"修改认证流程"|"修改认证流程后，运行 npm test -- --testPathPattern auth 验证所有认证测试通过。"|

## 3.3 验证工具链 🟢

|类别|工具|适用场景|
|---|---|---|
|📝 测试套件|单元测试、集成测试、E2E 测试|功能正确性验证|
|🔍 静态分析|ESLint、tsc --noEmit、mypy|代码质量、类型安全|
|🚀 运行验证|npm run build、截图对比、Bash 脚本|构建通过、UI 正确、自定义检查|

### Chrome 扩展：UI 验证利器

Claude Code 的 Chrome 扩展可以打开浏览器新标签页、测试 UI、截图，然后迭代修改直到代码正确。对前端开发者来说，这是验证 UI 变更的最强工具。

## 3.4 验证驱动的开发模式 🟢

![](https://pic1.zhimg.com/v2-0603d8e4226a2eac91c70b95be420ff4_1440w.jpg)

一个完整的验证驱动示例：

```
为 @src/utils/date.ts 添加 formatRelativeTime 函数。

要求：
- 输入 Date，输出 "刚刚"、"3 分钟前"、"2 小时前"、"昨天"、"3 天前" 等
- 超过 7 天返回 YYYY-MM-DD 格式

验证：
1. 先为以上每种情况编写测试用例
2. 实现函数
3. 运行 `npm test -- formatRelativeTime`
4. 运行 `npm run typecheck`
5. 所有通过后告诉我结果
```

## 3.5 让验证变得坚如磐石 🟡

投资让你的验证机制更加可靠：

- **写好 CLAUDE.md 中的测试命令**，让 Claude 知道如何运行测试
- **用 Hooks 自动验证**（详见第 6 节），例如 Stop Hook 自动运行测试套件
- **在 Skills 中嵌入验证步骤**，确保工作流最后一步总是验证
- **如果你无法验证它，就不要发布它**

> **Boris Pro Tip**：Boris 使用 Chrome 扩展来验证 UI 变更，并配置了 Agent Stop Hook 在 Claude 完成响应后自动执行验证脚本。这让验证成为每次交互的自动环节，而非需要手动记住的步骤。

## 4 先探索，再计划，再编码

> 🟢 基础 | **官方最佳实践 #2**：将研究/规划与实现分离，避免解决错误的问题。

## 4.1 为什么需要分阶段 🟢

让 Claude 直接跳到编码可能产出解决错误问题的代码。使用 Plan Mode 将探索与执行分离。

推荐的工作流有四个阶段：

|阶段|模式|做什么|关键操作|
|---|---|---|---|
|1️⃣ 探索|Plan Mode（只读）|理解代码库、定位相关文件|Shift+Tab 进入 Plan Mode|
|2️⃣ 计划|Plan Mode（只读）|制定实施方案、确认范围|Ctrl+G 在编辑器中编辑计划|
|3️⃣ 编码|Normal Mode|按计划实现、运行测试|Shift+Tab 切回 Normal Mode|
|4️⃣ 提交|Normal Mode|提交代码、创建 PR|/commit-push-pr|

> **Boris Pro Tip B3**：Boris 把 Plan Mode 视为基础操作而非可选步骤。他的日常流程是：先让 Claude 在 Plan Mode 下理解代码、生成计划，然后用第二个 Claude 会话审计这个计划的合理性，确认后才开始编码。

## 4.2 第一阶段：探索（Explore）🟢

按 `Shift+Tab` 切换到 Plan Mode，让 Claude 只读地探索代码库：

```
# 进入 Plan Mode 后
> 阅读 /src/auth 目录，了解我们如何处理会话和登录。
> 同时看看我们如何管理用于密钥的环境变量。
```

**Plan Mode 的特点**：  
- Claude 只执行读取操作，不会修改任何文件  
- 适合安全地探索不熟悉的代码  
- 按 `Shift+Tab` 循环切换：Normal Mode → Auto-Accept Mode → Plan Mode

也可以从命令行启动：

```
claude --permission-mode plan
```

## 4.3 第二阶段：计划（Plan）🟢

让 Claude 在 Plan Mode 下创建详细的实施计划：

```
> 我想添加 Google OAuth 登录。需要修改哪些文件？
> 会话流程是怎样的？创建一个实施计划。
```

**关键操作**：  
- 按 `Ctrl+G` 在文本编辑器中打开计划，可以直接编辑  
- 计划确认后再切换到 Normal Mode 执行  
- 你可以修改计划中的任何部分，删除不需要的步骤，或添加额外约束

### 用第二个 Claude 审计计划 🟡

对于复杂任务，Boris 推荐的做法是：

```
# 会话 A（Plan Mode）
> 分析 @src/auth 目录，制定添加 Google OAuth 的实施计划

# 会话 B（独立会话）
> 审查这个实施计划 [粘贴计划]。
> 指出遗漏的边界情况、潜在的安全问题、和更好的替代方案。
```

## 4.4 第三阶段：编码（Implement）🟢

切换回 Normal Mode，让 Claude 按计划编码：

```
> 按你的计划实现 OAuth 流程。
> 为回调处理器编写测试，运行测试套件并修复所有失败。
```

**增量开发技巧**：  
- 写一个文件 → 测试 → 继续，尽早发现问题  
- 如果 Claude 偏离方向，按 `Esc` 立即停止  
- 按两次 `Esc` 或 `/rewind` 回到之前的检查点

## 4.5 第四阶段：提交（Commit）🟢

或直接使用自定义 Skill（详见第 6 节）：

## 4.6 何时跳过计划直接编码 🟢

![](https://pic1.zhimg.com/v2-85fc28eec59d21923715079c0e14a29e_1440w.jpg)

**可以跳过计划的场景**：  
- 修复拼写错误  
- 添加一行日志  
- 重命名变量  
- 你非常清楚要做什么，修改范围小

**经验法则**：当你不确定方案、修改涉及多个文件、或对代码不熟悉时，使用 Plan Mode。

## 4.7 实战：用规范驱动开发（[SDD](https://zhida.zhihu.com/search?content_id=270598290&content_type=Article&match_order=1&q=SDD&zhida_source=entity)）做业务需求 🟡

4.1-4.6 介绍了通用的"探索→计划→编码→提交"流程。但面对**较大的业务需求**（新功能、新模块），直接在 Claude 的对话中口述需求往往不够——需求会散落在多轮对话中，Claude 的上下文窗口也可能装不下。

**规范驱动开发（Spec-Driven Development, SDD）** 提供了一种更结构化的做法：**先把需求写成 Markdown 规范文件，再用 Claude Code 逐步实现。**

### 核心理念

|传统做法|SDD 做法|
|---|---|
|口述需求 → Claude 直接写代码|先写 spec.md → Claude 按规范编码|
|需求散落在聊天记录中|规范集中在文件中，可版本管理|
|发现问题时改代码|发现问题时先改规范，再重新生成|
|Claude 的理解随上下文衰减|每次通过 @spec.md 注入完整需求|

**核心价值**：把"发现需求理解偏差"的成本从"改代码"左移到"改 Markdown"——代价低一个数量级。

### 三层产物

```
specs/001-feature-name/
├── spec.md      ← WHAT：功能需求（用户故事、验收标准、边界情况）
├── plan.md      ← HOW：技术方案（架构设计、数据结构、接口定义）
└── tasks.md     ← DO：原子任务（逐步执行指令，每个任务改一个文件）
```

|产物|定位|核心内容|谁来写|
|---|---|---|---|
|spec.md|需求规范（WHAT/WHY）|用户故事、验收标准、边界情况、MVP 范围|你主导，Claude 辅助提问|
|plan.md|技术方案（HOW）|技术选型、目录结构、数据模型、接口设计、风险评估|Claude 主导，你审核决策|
|tasks.md|执行计划（DO）|原子化任务列表、依赖关系、TDD 顺序|Claude 生成，你审核完整性|

### 在 Claude Code 中实操

**第一步：协作编写 spec.md**

```
> 我想构建 [功能描述]。用采访模式对我进行详细提问，
> 帮我生成一份 spec.md，包含：用户故事、验收标准、边界情况。
> 不要写任何技术实现细节。
```

**第二步：生成 plan.md**

```
> @specs/001-feature/spec.md
> 基于这份需求规范，生成技术方案 plan.md。
> 技术栈约束：[TypeScript / React / PostgreSQL]
> 包含：目录结构、核心数据模型、接口定义、实施阶段。
```

**第三步：分解 tasks.md**

```
> @specs/001-feature/spec.md @specs/001-feature/plan.md
> 将技术方案分解为原子任务列表 tasks.md。
> 要求：每个任务只改一个文件，测试先行（奇数任务写测试，偶数任务写实现）。
```

**第四步：逐步执行**

```
> @specs/001-feature/tasks.md
> 执行任务 T001-T006。严格按 TDD 顺序：先写测试（必须失败），再写实现（使测试通过）。
```

### TDD 防幻觉原则

这是 SDD 中最实用的洞察：

> ⚠️ **不要让 Claude 同时写代码和测试**。如果它先写了有 Bug 的代码，再写测试，它会写出"验证错误逻辑"的测试——一切绿色但全是错的。

正确做法：**测试先行，独立验证**。

```
# ❌ 错误：同时生成
> 实现用户注册功能，并编写测试

# ✅ 正确：分步进行
> 第一步：为用户注册写测试用例，覆盖正常流程和边界情况。先不要实现。
> 第二步：现在实现代码，使所有测试通过。不要修改测试。
```

**防止 AI 偷改测试**：仅靠提示词说"不要修改测试"并不可靠。建议用三层防护：

1. **提示词约束**：在 CLAUDE.md 中写明 `严禁修改 *_test.go / *.test.ts 文件`
2. **权限控制**：在 `.claude/settings.json` 中配置 `"deny": ["Write(*_test.go)", "Write(*.test.ts)"]`
3. **Git 兜底**：先提交测试代码，实现完成后用 `git diff` 检查测试文件是否被意外修改

第 2 层是关键——即使 AI 忽略提示词，权限系统也会硬性阻止。

### 何时使用 SDD

|场景|推荐做法|
|---|---|
|修 Bug、小改动、单文件|直接编码（3.6 的流程）|
|明确的小功能（< 3 文件）|Plan Mode → 编码（3.1-3.5 的流程）|
|完整业务功能、新模块、多文件|SDD 三层规范 → 逐步实现|
|大型重构、系统迁移|SDD + worktree 并行（第 9 节）|

## 5 提供具体的上下文

> 🟢 基础 | **官方最佳实践 #3**：指令越精确，需要修正的次数越少。

## 5.1 具体化原则 🟢

Claude 能推断意图，但无法读你的心。引用具体文件、提及约束、指向示例模式。

|策略|模糊提示 ❌|具体提示 ✅|
|---|---|---|
|限定范围|"添加测试"|"为 foo.py 编写测试，覆盖用户已注销的边界情况。不要使用 mock。"|
|指向来源|"为什么 API 设计这么奇怪？"|"查看 ExecutionFactory 的 git 历史，总结它的 API 是怎么演变成现在这样的"|
|参考已有模式|"添加日历组件"|"查看首页已有 widget 的实现方式，HotDogWidget.php 是好的参考。按相同模式实现日历组件。"|
|描述症状|"修复登录 bug"|"用户报告会话超时后登录失败。检查 src/auth/ 中的 token 刷新。写一个能复现问题的失败测试，然后修复它。"|

> 模糊提示有时也有用——当你在探索阶段、可以承受方向纠正时。`"这个文件有什么可以改进的？"` 可能发现你没想到的问题。

## 5.2 丰富的上下文输入方式 🟢

![](https://pic4.zhimg.com/v2-23190052a556c1b967e113702a7ac1fd_1440w.jpg)

### 用 @ 引用文件

```
> 解释 @src/utils/auth.js 中的逻辑
> 对比 @src/old-api.ts 和 @src/new-api.ts 的实现差异
```

> `@` 引用文件时，Claude Code 会自动加载该文件所在目录的 CLAUDE.md。

### 粘贴截图/图片

- 直接拖放图片到 Claude Code 窗口
- 使用 `Ctrl+V` 粘贴剪贴板中的图片
- 提供图片路径：`分析这张截图: /path/to/screenshot.png`

### 管道输入

```
# 文件内容传入
cat error.log | claude -p "简洁地解释这个构建错误的根因"

# 命令输出传入
git diff main | claude -p "审查这些变更中的安全问题"

# 多个文件传入
git diff main --name-only | claude -p "审查这些修改过的文件"
```

### 提供 URL或者文件、目录

```
参考 https://docs.example.com/api-v2 的文档，为我们的客户端添加 v2 支持

参考文档 ~/Download/design_doc/implementation_plan.md
```

使用 `/permissions` 将常用域名加入白名单，避免每次批准。

### 让 Claude 自己获取上下文

不需要你手动提供一切——Claude 可以自己通过 Bash 命令、MCP 工具、文件读取来获取上下文。

**Boris Pro Tip B4**：Boris 大量使用语音输入（macOS 上按两次 `fn` 键触发听写），他发现语音描述需求比打字快约 3 倍。语音天然产出更详细的描述，而 Claude 擅长理解非结构化的自然语言。

## 5.3 提示词结构图 🟡

一个高质量提示词的结构：

```
┌─────────────────────────────────────────────┐
│  1. 任务描述                                 │
│     做什么？（一句话清晰描述）                 │
├─────────────────────────────────────────────┤
│  2. 上下文                                   │
│     相关文件：@path/to/files                  │
│     参考模式：@path/to/example                │
│     背景信息：为什么要做这个                    │
├─────────────────────────────────────────────┤
│  3. 约束                                     │
│     不能做什么 / 必须满足什么                   │
│     "不引入新依赖"、"保持向后兼容"              │
├─────────────────────────────────────────────┤
│  4. 验证标准                                  │
│     怎么确认做对了？                           │
│     "运行 npm test"、"截图对比"               │
└─────────────────────────────────────────────┘
```

## 5.4 结构化提示模板 🟡

### 功能开发模板

```
实现 [功能描述]。

上下文：
- 相关文件：@path/to/relevant/files
- 参考已有模式：@path/to/similar/implementation

要求：
1. [具体要求 1]
2. [具体要求 2]
3. [具体要求 3]

验证：
- 运行 `npm test` 确保所有测试通过
- 运行 `npm run typecheck` 确保无类型错误
```

### Bug 修复模板

```
修复 [问题描述]。

复现步骤：
1. [步骤 1]
2. [步骤 2]
3. [出现错误]

错误信息：
[粘贴完整错误信息或堆栈跟踪]

期望行为：[描述正确行为]

请：
1. 找到根因
2. 写一个能复现问题的失败测试
3. 修复问题
4. 确认测试通过
```

### 代码审查模板

```
审查 @path/to/file 的以下方面：
- 安全漏洞（注入、XSS、认证问题）
- 边界情况处理
- 性能问题
- 与项目现有模式的一致性

对每个问题给出：
1. 问题严重度（Critical / Warning / Suggestion）
2. 具体位置（文件名和行号）
3. 修复建议
```

## 5.5 采访模式：让 Claude 采访你 🟡

对于大型功能，让 Claude 先采访你以明确需求，而不是一开始就写代码。

### AskUserQuestion：采访模式的秘密武器

`AskUserQuestion` 是 Claude Code 内置的一个交互工具。当 Claude 需要你做决策时，它会弹出**结构化的选择题界面**——不需要你打字组织语言，只需点击选项即可。

这个工具有时会被 Claude 自动触发，但你也可以**显式要求**使用它。

### 实战演示：用苏格拉底式提问对齐需求

假设你要做一个「与众不同的小游戏」，在 Claude Code 中输入：

```
我想开发一款独特的小游戏，但具体做什么、怎么做还没想好。

请你作为游戏策划顾问，用苏格拉底式提问法帮我从零厘清思路。要求：

 - 必须使用 AskUserQuestion 工具向我提问，不要用纯文字提问
 - 每轮提问后，根据我的回答总结洞察，再发起下一轮提问
 - 至少覆盖以下维度：游戏类型、核心玩法、美术风格、目标平台、技术方案
 - 灵活运用 single_select、multi_select、rank_priorities 三种题型
 - 3-5 轮提问结束后，输出一份「游戏设计一页纸」

从第一轮开始吧。
```

Claude 会调用 AskUserQuestion，弹出选择题界面：

![](https://pic3.zhimg.com/v2-ca28102662c446c60b36040c8a8470ea_1440w.jpg)

注意弹窗上方有 **Tab 标签页**，可以切换不同维度的问题：

![](https://pica.zhimg.com/v2-e5d4b94706337766fc62947c6b8987ac_1440w.jpg)

选择完所有选项后，点击 **Submit answers** 继续：

![](https://pic1.zhimg.com/v2-2624097914b05b0fbb5d30c1290f23e2_1440w.jpg)

然后 Claude 会继续追问其他维度的问题——真的像苏格拉底一样，把你脑海中的想法逐步显化：

![](https://pic4.zhimg.com/v2-ca9119dfcfd53e04c531759926851777_1440w.jpg)

当你耐心回答完所有问题，就得到了一份完整的需求文档：

**适用环境**：AskUserQuestion 在 Claude Code IDE Extension 和 CLI 中都可用。在 CLI 里，用键盘上下箭头选择选项。

### 标准提示模板

```
我想构建 [简要描述]。用 AskUserQuestion 工具对我进行详细采访。

问我关于技术实现、UI/UX、边界情况、顾虑和权衡的问题。
不要问显而易见的问题，深入挖掘我可能没有考虑到的困难部分。

持续采访直到我们覆盖了所有方面，然后把完整的需求规格写入 SPEC.md。
```

### 引申用法：用 AskUserQuestion 排查盲区

对于真实项目中的复杂问题，当你有不确定的地方，可以这样用：

```
对于这个问题，我们还有哪些没有考虑到的？

使用 AskUserQuestion 工具，像苏格拉底一样帮助我，
无论是技术选型、潜在风险、需求对齐等等任何方向，
因为我是小白我什么都不懂，请帮助我理解。
```

这个模式把 Claude 从「执行者」变成了「顾问」——它不再猜你想要什么，而是通过结构化提问帮你自己想清楚。

完成采访后，**开一个新会话**来执行规格。新会话有干净的上下文，完全聚焦于实现。

## 6 配置你的环境

🟡 进阶 | **官方最佳实践 #4**：环境配置是长期杠杆——投入一次，每次会话都受益。

本章是全文最长的一章，因为环境配置涵盖 CLAUDE.md、权限、CLI 工具、MCP、Hooks、Skills 和子代理。这些配置一旦就绪，会在之后的每次会话中持续发挥作用。

|小节|组件|作用|上下文成本|优先级|
|---|---|---|---|---|
|6.1|CLAUDE.md|项目记忆与规则|常驻（控制在 <2K tokens）|🟢 必配|
|6.2|权限|安全控制|零|🟢 必配|
|6.3|CLI 工具|外部服务集成|仅调用时|🟢 推荐|
|6.4|MCP|外部数据源连接|工具定义默认常驻（Tool Search 可延迟加载）|🟡 按需|
|6.5|Hooks|事件驱动自动化|零（独立运行）|🟡 推荐|
|6.6|Skills|可复用工作流|description 常驻（~2%），内容按需|🟡 推荐|
|6.7|子代理|独立上下文窗口|独立窗口，不占主上下文|🔴 按需|

## 6.1 编写有效的 CLAUDE.md 🟢

CLAUDE.md 是一个特殊文件，Claude 在每次会话开始时读取它。写入 Bash 命令、代码风格、工作流规则等**Claude 无法从代码中推断**的信息。

### 什么该写，什么不该写

|该写 ✅|不该写 ❌|
|---|---|
|Claude 猜不到的 Bash 命令|Claude 读代码就能知道的信息|
|与默认不同的代码风格规则|标准语言规范（Claude 已知）|
|测试指令和首选测试框架|详细的 API 文档（链接即可）|
|仓库约定（分支命名、PR 格式）|频繁变化的信息|
|项目特有的架构决策|长篇教程或解释|
|开发环境怪癖（必需的环境变量）|逐文件的代码库描述|
|常见陷阱和非显而易见的行为|"写干净的代码"之类的废话|

**格式自由但保持精炼**，例如：

```
# Code style
- Use ES modules (import/export), not CommonJS (require)
- Destructure imports when possible

# Workflow
- Be sure to typecheck when you're done making a series of code changes
- Prefer running single tests, not the whole test suite, for performance
```

### CLAUDE.md 的检验标准

对每一行问自己：**"如果删掉这行，Claude 会犯错吗？"** 如果不会，就删掉它。

臃肿的 CLAUDE.md 会导致 Claude 忽略你真正重要的指令。如果 Claude 反复不遵守某条规则，CLAUDE.md 可能太长了，规则被淹没了。像对待代码一样对待 CLAUDE.md——出问题时审查它、定期修剪、通过观察 Claude 行为来测试变更。

### 分层加载机制 🟡

CLAUDE.md 文件可以放在多个位置，自动按层级加载：

|优先级|层级|位置|管理者|加载时机|
|---|---|---|---|---|
|最高 🔴|企业托管策略|/Library/.../ClaudeCode/CLAUDE.md|IT/DevOps|启动时，不可覆盖|
|↓|项目级|./CLAUDE.md + .claude/rules/*.md|团队（Git）|启动时自动|
|↓|项目级（个人）|./CLAUDE.local.md|个人（gitignore）|启动时自动|
|↓|用户级|~/.claude/CLAUDE.md + ~/.claude/rules/*.md|个人|启动时自动|
|最低|自动记忆|~/.claude/projects/<project>/memory/MEMORY.md|Claude 自动|前 200 行自动|
|按需|子目录|任意子目录的 CLAUDE.md|团队|Claude 访问该目录时|

**优先级规则**：  
- 企业策略不可覆盖  
- 更具体的指令优先——项目级覆盖用户级  
- 所有层级累加贡献内容  
- 子目录 CLAUDE.md 按需加载（只在 Claude 访问该目录的文件时加载）

### 模块化 rules/ 目录 🟡

对大型项目，使用 `.claude/rules/` 组织规则：

```
.claude/rules/
├── code-style.md        # 代码风格
├── testing.md           # 测试规范
├── security.md          # 安全要求
├── frontend/
│   ├── react.md         # React 特定规则
│   └── styles.md        # 样式规范
└── backend/
    ├── api.md           # API 设计
    └── database.md      # 数据库规范
```

规则文件支持通过 YAML frontmatter 限定作用路径：

```
---
paths:
  - "src/api/**/*.ts"
  - "lib/**/*.ts"
---

# API 开发规范
- 所有 API 端点必须包含输入验证
- 使用标准错误响应格式
```

### @ 导入语法 🟡

CLAUDE.md 支持通过 `@` 语法导入其他文件：

```
# 项目概览见 @README.md，可用命令见 @package.json

# 额外指令
- Git 工作流：@docs/git-instructions.md
```

**规则**：  
- 支持相对路径和绝对路径  
- 导入可递归，最大深度 5 层  
- 代码块中的 `@` 不会触发导入  
- **注意**：`@` 导入会把被引用文件的完整内容拉入上下文。避免导入大文件，改为让 Claude 按需读取

### 自动记忆（Auto Memory）🟡

除了手动编写的 CLAUDE.md，Claude 还有自动记忆系统：

```
~/.claude/projects/<project>/memory/
├── MEMORY.md              # 索引文件（前 200 行自动加载）
├── debugging.md           # 调试模式笔记
└── api-conventions.md     # API 设计决策
```

- Claude 在会话中自动记录有用信息
- `MEMORY.md` 的前 200 行在每次会话启动时加载
- 使用 `/memory` 命令可在编辑器中直接编辑
- 你可以主动让 Claude 记住信息：`"记住我们使用 pnpm 而不是 npm"`

### 使用强调语法提高遵从度

```
# 重要规则
- **IMPORTANT**: 所有 API 响应必须包含 `request_id` 字段
- **YOU MUST**: 在提交前运行 `npm run typecheck`
- **NEVER**: 不要修改 migrations/ 目录下的已有文件
```

**Boris Pro Tip B5**：Boris 的做法是让团队共同维护 CLAUDE.md，提交到 Git，像维护代码一样维护它。当 Claude 犯错时，他会让 Claude 自己更新 CLAUDE.md：`"@claude 更新 CLAUDE.md，添加这条规则以避免这个错误再次发生"`。这让规则库随着团队经验自然增长。

**进阶做法**：当项目知识超出 CLAUDE.md 的合理长度时，可拆分到 `notes/` 目录，由 CLAUDE.md 引用。例如：在 CLAUDE.md 中写 `详细的 API 约定见 @notes/api-conventions.md`，保持主文件精简的同时让 Claude 在需要时按需读取深度知识。

### CLAUDE.md 模板集 🟢

### 最小可用模板

```
# 构建
- 安装：`npm install`
- 测试：`npm test`
- Lint：`npm run lint`

# 规范
- TypeScript strict 模式
- 提交消息使用 Conventional Commits
```

### 通用项目模板

```
# 项目：[项目名]
[一句话描述]。技术栈：[列出关键技术]。

# 构建与测试
- 安装：`pnpm install`
- 开发：`pnpm dev`
- 构建：`pnpm build`
- 测试全部：`pnpm test`
- 测试单个：`pnpm test -- path/to/test`
- 类型检查：`pnpm typecheck`
- Lint：`pnpm lint`

# 代码规范
- 使用 ES modules（import/export）
- 函数参数 >3 个时使用对象参数
- 错误处理使用 AppError 类（@src/lib/errors.ts）
- API 路径 kebab-case，JSON 属性 camelCase

# 架构
- 状态管理：Zustand（不是 Redux）
- ORM：Drizzle（不是 Prisma）
- API：tRPC

# 工作流
- **IMPORTANT**: 修改代码后运行 `pnpm typecheck`
- **NEVER**: 不要修改 migrations/ 下的已有文件
- 提交遵循 Conventional Commits

# 压缩指令
When compacting, preserve:
- 修改过的文件完整列表
- 测试命令和结果
- 未完成的任务
```

### 前端项目模板

```
# 构建命令
- 开发：`pnpm dev`（端口 3000）
- 构建：`pnpm build`
- 测试：`pnpm test`（Vitest）
- E2E：`pnpm e2e`（Playwright）

# 代码规范
- 函数式组件 + hooks
- Tailwind CSS（不用 CSS modules）
- 导入顺序：React → 第三方 → 本地 → 类型 → 样式

# 组件结构
- 页面：`src/app/`（Next.js App Router）
- 组件：`src/components/`
- 参考：`src/components/ui/Button.tsx`

# 测试
- 优先运行单个测试文件
- UI 变更后截图对比验证
```

## 6.2 配置权限 🟡

默认情况下，Claude Code 对可能修改系统的操作请求权限。这很安全但频繁打断你。

### 权限允许列表

```
{
  "permissions": {
    "allow": [
      "Bash(npm run lint)",
      "Bash(npm run test *)",
      "Bash(git commit *)",
      "Bash(git push *)"
    ],
    "ask": [
      "Bash(git push --force *)"
    ],
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)",
      "Bash(curl *)",
      "Bash(rm -rf *)"
    ]
  }
}
```

### 规则评估顺序

![](https://picx.zhimg.com/v2-95e55492d8a00f1dd6ea0e0b609ea5e7_1440w.jpg)

deny 优先 → 然后 ask → 然后 allow → 首次匹配生效。

### 沙箱隔离

沙箱提供 OS 级别的文件系统和网络隔离：

沙箱定义的是边界，而非绕过所有检查。启用沙箱后 Claude 可以更自由地工作。

**Boris Pro Tip B6**：Boris 使用 `/permissions` 预批准安全的常用命令（如 lint、test、git 操作），而不是用 `--dangerously-skip-permissions` 跳过所有权限。他的原则是：**预批准而非跳过权限**——前者是有意识的安全决策，后者是关闭安全门。

### 权限模式

|模式|说明|切换方式|
|---|---|---|
|default|标准权限检查|默认|
|acceptEdits|自动接受文件编辑|Shift+Tab|
|plan|只读模式|Shift+Tab / --permission-mode plan|
|dontAsk|自动拒绝未允许的工具|CLI 参数|
|bypassPermissions|跳过所有检查|--dangerously-skip-permissions（强烈建议仅在沙箱/隔离环境中使用）|

## 6.3 使用 CLI 工具 🟢

CLI 工具是与外部服务交互最节省上下文的方式。

```
# Claude Code 直接调用已安装的 CLI
用 gh 创建一个 PR
用 aws s3 ls 查看桶列表
用 sentry-cli 查看最近的错误
```

Claude 也善于学习不熟悉的 CLI 工具：

```
用 'foo-cli-tool --help' 学习 foo 工具的用法，然后用它完成 A、B、C
```

**为什么 CLI 优于 MCP**：CLI 工具无常驻上下文成本，只在调用时产生输出。而 MCP 服务器的工具定义默认常驻占用上下文空间（新版本的 Tool Search 机制可延迟加载，但仍建议控制 MCP 工具数量）。

## 6.4 配置 MCP 服务器 🟡

MCP（Model Context Protocol）让 Claude 连接外部数据源——Notion、Figma、数据库等。

### MCP 架构速览

MCP 基于三个角色协作：

|角色|位置|职责|示例|
|---|---|---|---|
|Host（宿主）|中心编排器|管理连接、路由请求|Claude Code|
|Client（客户端）|连接器|1:1 会话管理、协议翻译、安全边界|每个 Server 一个内部实例|
|Server（服务器）|能力提供方|暴露 Tools / Resources / Prompts|GitHub Server, Notion Server|

MCP Server 提供三种能力：

|能力类型|说明|示例|
|---|---|---|
|Tools（行动能力）|AI 可执行的操作|create_issue、query_database|
|Resources（参考数据）|AI 可引用的数据|@github:issue://123|
|Prompts（工作流模板）|封装好的提示词|/mcp__github__list_prs|

**安全模型**：AI 模型永远不接触 API Key/Token。凭证由 Host 在运行时通过环境变量注入。

### 少即是多原则

每个 MCP 服务器都向上下文中添加工具定义，**默认即使空闲也占用空间**（新版 Tool Search 机制可延迟加载超阈值的工具，但仍建议主动控制数量）。

**✅ 推荐做法**：  
- **CLI 优先**：能用 `gh`、`aws`、`gcloud` 完成的，不用 MCP  
- **按需启用**：只添加确实需要的 MCP 服务器  
- **定期审计**：用 `/mcp` 查看并禁用未使用的服务器  
- **用** **`/context`** **监控**：了解每个 MCP 服务器的上下文消耗

**❌ 避免做法**：  
- 一次性添加十几个 MCP 服务器  
- 安装后不管——默认空闲也占上下文空间

### 添加服务器

```
claude mcp add <server-name> -- <command>
```

### 配置文件

```
// .mcp.json（项目级）
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

|位置|作用域|
|---|---|
|.mcp.json（项目根目录）|项目级，所有协作者|
|~/.claude.json|用户级，所有项目|

## 6.5 配置 Hooks 🟡

Hooks 在 Claude 工作流的特定节点自动执行脚本。与 CLAUDE.md 中的建议性指令不同，**Hooks 是确定性的，保证操作一定发生**。

### Hooks vs CLAUDE.md 规则

|维度|CLAUDE.md 规则|Hooks|
|---|---|---|
|驱动模型|建议性（AI 可能忽略）|事件驱动，确定性执行|
|类比|团队规范文档|自动化传感器|
|执行保证|不保证|退出码 0 = 继续，退出码 2 = 阻止（限可阻止事件）|
|适用场景|代码风格、架构决策|格式化、保护文件、通知、验证|
|经验法则|"Claude 应该做"|"必须发生"|

### Hook 事件流程

![](https://pic2.zhimg.com/v2-d07ad6963a358035c93399cbadbe5549_1440w.jpg)

### 核心事件类型

|事件|触发时机|典型用途|
|---|---|---|
|SessionStart|会话开始或恢复|注入上下文、初始化环境|
|UserPromptSubmit|提交提示词后|预处理或验证输入|
|PreToolUse|工具调用前|阻止危险操作|
|PostToolUse|工具调用后|自动格式化、运行 lint|
|Notification|需要注意时|桌面通知|
|Stop|Claude 完成响应|验证任务完成度|
|PreCompact|压缩前|注入必须保留的上下文|

### Hook 退出码

|退出码|行为|
|---|---|
|0|操作继续。stdout 可注入上下文（仅 exit 0 时解析 JSON 输出）|
|2|阻止操作（仅限可阻止事件：PreToolUse、UserPromptSubmit、Stop 等）。stderr 作为反馈发送给 Claude。对于不可阻止事件（PostToolUse、Notification 等），exit 2 仅显示 stderr|
|其他|操作继续。stderr 记入日志|

> **注意**：exit 2 的具体行为取决于事件类型。例如 PreToolUse 中 exit 2 阻止工具调用，Stop 中 exit 2 阻止 Claude 停止（强制继续），PostToolUse 中 exit 2 仅将 stderr 显示给 Claude（工具已执行，无法阻止）。

**Boris Pro Tip B7**：Boris 配置了 PostToolUse Hook 在每次文件编辑后自动运行 Prettier 格式化。这保证了所有 Claude 写的代码都自动符合项目格式规范，无需在 CLAUDE.md 中写格式化规则。

### 实用 Hook 示例

**文件编辑后自动格式化**：

```
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write 2>/dev/null || true"
          }
        ]
      }
    ]
  }
}
```

**阻止编辑受保护文件**：

```
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/protect-files.sh"
          }
        ]
      }
    ]
  }
}
```

**桌面通知（macOS）**：

```
{
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "osascript -e 'display notification \"Claude Code 需要你的注意\" with title \"Claude Code\"'"
          }
        ]
      }
    ]
  }
}
```

**Stop Hook：验证任务完成度**：

```
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "检查所有任务是否已完成。如果没有，返回 {\"ok\": false, \"reason\": \"剩余工作描述\"}。"
          }
        ]
      }
    ]
  }
}
```

Claude 也可以帮你写 Hooks：

```
写一个 Hook，在每次文件编辑后运行 eslint
写一个 Hook，阻止对 migrations 目录的写入
```

运行 `/hooks` 可以交互式配置，或直接编辑 `.claude/settings.json`。

## 6.6 创建 Skills 🟡

Skills 是存放在 `.claude/skills/` 下的可重用工作流或领域知识。与 CLAUDE.md 的全量常驻不同，Skills 采用**两级加载**：description 常驻（占上下文预算约 2%，用于 AI 自动发现），完整内容仅在调用时加载。设置 `disable-model-invocation: true` 的 Skill，description 也不会常驻。

### 指令 vs 技能：范式转换

> **注意**：当前版本中，自定义 Slash Commands 已并入 Skills 体系（`.claude/commands/` 作为兼容方式保留）。下表用于理解两种思维模型的区别，而非两套独立机制。

|维度|Slash Commands（指令）|Skills（技能）|
|---|---|---|
|本质|命令式："去做这件事"|声明式："我是一种能力"|
|发起者|用户主动调用|AI 自发现匹配任务|
|示例|/gen-test myfile.go|"我是一个 Go 代码审查技能"|
|发现机制|用户记住命令名|AI 扫描技能库自动匹配|
|核心价值|执行效率|渐进式知识加载|

**关键洞察**：Skills 解决的核心问题是"如何在保持上下文窗口轻量的同时提供大量专业知识"——答案是 AI 按需加载，只在需要时才读取。

### SKILL.md 结构

```
# .claude/skills/fix-issue/SKILL.md
---
name: fix-issue
description: 修复 GitHub Issue
disable-model-invocation: true
---
分析并修复 GitHub Issue: $ARGUMENTS。

1. 使用 `gh issue view` 获取 Issue 详情
2. 理解问题描述
3. 搜索代码库找到相关文件
4. 实现必要的修改
5. 编写并运行测试验证修复
6. 确保代码通过 lint 和类型检查
7. 创建描述性的提交消息
8. 推送并创建 PR
```

### 团队实用 Skill/Command 创意

来自 Claude Code 团队的真实用法：

- **`/techdebt`**：每次会话结束时运行，自动发现和清理重复代码
- **上下文聚合 Skill**：同步过去 7 天的 Slack、GDrive、Asana、GitHub 到一个上下文中，快速获取项目全貌
- **数据分析 Skill**：封装 BigQuery / bq CLI 查询能力，团队成员直接在 Claude Code 中跑分析（Boris 说他 6 个月没写过一行 SQL）
- **analytics-engineer 代理**：编写 dbt 模型、审查代码、在 dev 环境测试变更

**经验法则**：如果一个操作你每天做超过一次，就该把它变成 Skill 或 Slash Command。

**调用方式**：

### frontmatter 参数

|参数|说明|
|---|---|
|name|技能名称（调用时用 /name）|
|description|描述（默认常驻加载到上下文用于 AI 自动发现，保持简短；设 disable-model-invocation: true 时不常驻）|
|disable-model-invocation|设为 true 表示需要手动调用（有副作用的工作流）|
|$ARGUMENTS|占位符，接收 /skill-name 后的参数|

### 更多 Skill 示例

**代码审查 Skill**：

```
# .claude/skills/review/SKILL.md
---
name: review
description: 代码审查当前变更
---
审查当前分支相对于 main 的所有变更。

1. 运行 `git diff main --name-only` 列出变更文件
2. 逐个审查
3. 检查：安全漏洞、性能、错误处理、边界情况、风格一致性
4. 按严重度分类输出
```

**创建 PR Skill**：

```
# .claude/skills/pr/SKILL.md
---
name: pr
description: 创建格式化的 PR
disable-model-invocation: true
---
为当前分支创建 Pull Request。

1. `git log main..HEAD --oneline` 获取提交历史
2. `git diff main --stat` 获取变更统计
3. 编写 PR 标题和描述
4. 使用 `gh pr create` 创建
5. 输出 PR URL
```

**Boris Pro Tip B8**：Boris 的 `/commit-push-pr` Skill 是他每天用几十次的命令——提交、推送、创建 PR 一步到位。他认为将重复性工作流封装成 Skill 是 Claude Code 最被低估的功能之一。

> ⚠️ **安全提醒**：Skills 可执行任意 shell 命令。安装第三方 Skill 前，务必审查 SKILL.md 中的脚本内容，确认没有恶意命令。建议结合权限系统（`deny` 规则）限制 Skill 的工具访问范围。

## 6.7 创建自定义子代理 🔴

子代理运行在独立的上下文窗口中，有自己的系统提示、工具访问和权限。

### 为什么需要子代理？

可以把主 Claude 会话想象成 **CTO**，子代理是各**部门总监**：

|角色|类比|特点|
|---|---|---|
|主会话|CTO|全局视野，协调任务|
|安全子代理|安全总监|专注安全审计，有自己的知识和工具|
|测试子代理|QA 总监|专注测试覆盖，独立上下文|
|调试子代理|故障专家|专注根因分析，不受其他任务干扰|

子代理的三个核心特质：

|特质|解决的问题|机制|
|---|---|---|
|独立上下文窗口|上下文污染|独立内存空间，不读/不污染主会话|
|自定义系统提示|指令冲突|每个子代理有专属人格和领域知识|
|细粒度工具权限|权限过宽|最小权限原则（审查者只读、DevOps 可执行）|

### 子代理配置文件

在 `.claude/agents/` 下创建 Markdown 文件：

```
# .claude/agents/security-reviewer.md
---
name: security-reviewer
description: 审查代码安全漏洞
tools: Read, Grep, Glob, Bash
model: opus
---

你是一名高级安全工程师。审查代码的：
- 注入漏洞（SQL、XSS、命令注入）
- 认证和授权缺陷
- 代码中的密钥或凭证
- 不安全的数据处理

提供具体行号引用和修复建议。
```

### 关键配置项

```
---
name: db-reader
description: 执行只读数据库查询
tools: Bash                        # 可用工具
model: haiku                       # 控制成本
permissionMode: dontAsk            # 自动拒绝未允许的工具
maxTurns: 10                       # 限制最大轮次
memory: user                       # 启用跨会话持久记忆
background: true                   # 在后台运行
isolation: worktree                # 在独立 worktree 中工作
---
```

### 使用子代理的技巧

- 在任何请求后追加 **"use subagents"**，让 Claude 投入更多算力并行处理
- 将独立子任务分配给子代理，**保持主会话上下文窗口干净聚焦**
- 可以通过 Hook 将权限请求路由到 Opus 审批（详见 [Hooks 文档](https://link.zhihu.com/?target=https%3A//code.claude.com/docs/en/hooks%23permissionrequest)）
- 使用 `/agents` 可交互式管理子代理（创建、编辑、删除），无需手动编辑文件

### 内置子代理

|子代理|模型|用途|
|---|---|---|
|Explore|Haiku（快速）|只读代码搜索和分析|
|Plan|继承|Plan Mode 下的代码库研究|
|general-purpose|继承|复杂多步骤任务|
|Bash|继承|独立上下文中执行命令|

## 6.8 五大扩展组件对比 🟡

Claude Code 有五种扩展机制。理解它们的区别是高效配置环境的关键：

### 核心辨析：Slash Commands vs. Skills vs. Sub-agents

这三者看似相似，但定位和适用场景截然不同：

|维度|Slash Commands|Agent Skills|Sub-agents|
|---|---|---|---|
|调用者|用户 (User)|AI 模型 (Model)|AI 模型 (Model)|
|调用模式|命令式 (Imperative)："AI，执行这个！"|发现式 (Declarative)："我声明有一种能力…"|委托式 (Delegative)："这个问题太专业，我交给专家…"|
|核心作用|封装高频工作流为快捷指令|封装领域知识和能力为可发现的"知识胶囊"|封装专家"人格"，处理需要独立上下文的复杂任务|
|上下文|共享主会话上下文|共享主会话上下文|拥有独立的上下文窗口|
|发现机制|用户通过 /help 菜单或记忆发现|AI 通过语义匹配 description 自主发现|AI 通过语义匹配 description 自主委托|
|适合场景|确定的、重复性的、需要由人发起的任务|需要 AI 具备特定领域知识或遵循特定流程的开放式任务|需要深度思考、多步推理、且不希望污染主会话上下文的复杂独立子任务|
|心智模型|工具箱里的电动工具|AI 可自主查阅的"专家知识库"|可以随时召唤的"领域专家"顾问团|

### 完整五组件对比（含 Hooks 和 MCP）

|维度|Slash Commands|Skills|Hooks|子代理|MCP|
|---|---|---|---|---|---|
|触发方式|用户 /命令|AI 自发现 + /命令|事件自动触发|主代理委托|Claude 自动调用|
|执行保证|建议性|建议性|确定性 ✅|建议性|建议性|
|上下文成本|共享主上下文|按需加载|零（独立运行）|独立窗口|工具定义默认常驻（Tool Search 可延迟加载）|
|参数|$ARGUMENTS / $1 $2|frontmatter|JSON stdin|frontmatter|协议定义|
|配置位置|.claude/commands/|.claude/skills/|settings.json|.claude/agents/|.mcp.json|
|作用域|项目级 / 用户级|项目级 / 用户级|项目级 / 用户级|项目级 / 用户级|项目级 / 用户级|

### 如何选择？

![](https://pic3.zhimg.com/v2-f9d03da5ebdb2ed666f6b0fced83fd88_1440w.jpg)

## 6.9 自定义状态栏（Status Line）🟡

状态栏显示在输入框正下方，让你在工作时随时看到关键信息——当前模型、工作目录、剩余上下文、已花费 token 等。

运行后进入交互式配置界面，选择要显示的信息项。配置保存在 `settings.json` 中：

```
// ~/.claude/settings.json
{
  "statusLine": {
    "type": "command",
    "command": "~/.claude/statusline.sh"   // 脚本通过 stdin 接收会话 JSON 数据
  }
}
```

也可以直接内联命令，不写脚本文件：

```
{
  "statusLine": {
    "type": "command",
    "command": "jq -r '\"[\\(.model.display_name)] \\(.context_window.used_percentage // 0)% context\"'"
  }
}
```

> **提示**：更简单的方式是运行 `/statusline`，用自然语言描述你想看到的信息，Claude 会自动生成配置脚本。

**Boris Pro Tip B13**：Claude Code 团队里每个人的状态栏配置都不一样——有人盯 token 成本，有人盯剩余上下文，有人显示当前 Git 分支。用 `/statusline` 找到最适合你工作习惯的组合。

![](https://pic4.zhimg.com/v2-80e6ee8a61d4960c012dee88fca9ae4b_1440w.jpg)

## 7 有效沟通

🟢 基础 | **官方最佳实践 #5**：你与 Claude 的沟通方式直接影响输出质量。

## 7.1 像问资深工程师一样提问 🟢

当你加入新项目或探索不熟悉的代码时，把 Claude Code 当成一位资深工程师来提问：

```
日志系统是怎么工作的？
怎么创建一个新的 API 端点？
foo.rs 第 134 行的 async move { ... } 是做什么的？
CustomerOnboardingFlowImpl 处理了哪些边界情况？
为什么这段代码在第 333 行调用 foo() 而不是 bar()？
```

不需要特殊的提示技巧——直接问。这是一个非常有效的入职工作流，可以加速熟悉新代码库、减少对其他工程师的打扰。

## 7.2 沟通模式选择 🟢

![](https://pic4.zhimg.com/v2-0299db86ddbde79de8ff32a6fc1b6937_1440w.jpg)

|模式|适用场景|示例|
|---|---|---|
|提问模式|理解代码、学习架构|"这个模块是怎么工作的？"|
|指令模式|明确的实现任务|"为 auth.ts 添加 JWT 刷新，运行测试验证"|
|采访模式|大型功能、需求不明确|"采访我关于这个功能的需求"|
|对话模式|探索性任务、方案讨论|"这个文件有什么可以改进的？"|

## 7.3 采访模式的深度用法 🟡

采访模式不仅适用于需求收集，还适用于：

**方案评审**：

```
我打算用 Redis 做分布式锁来解决并发问题。
用 AskUserQuestion 采访我，挑战这个方案的假设，
帮我发现我可能忽略的问题。
```

**架构探讨**：

```
我想把单体应用拆分成微服务。
采访我关于服务边界、数据一致性、部署策略等问题。
深入挖掘我没考虑到的困难部分。
```

**事后复盘**：

```
刚修完一个严重 bug。
采访我关于根因、为什么没有测试覆盖、如何防止再次发生。
输出一份事后复盘报告。
```

**Boris Pro Tip B9**：Boris 和团队使用挑战式提示来获得更好的结果：  
- `"grill me on these changes and don't make a PR until I pass your test"` — 让 Claude 当你的 reviewer  
- `"prove to me this works"` — 让 Claude diff main 和 feature branch 的行为差异  
- `"knowing everything you know now, scrap this and implement the elegant solution"` — 中庸方案不满意时，让 Claude 推倒重来  
- `"play devil's advocate"` — 让 Claude 站在反方论证

**这些提示利用了 Claude 的推理能力，比简单的"帮我实现 X"能得到更深思熟虑的结果。**

## 7.4 沟通的常见误区 🟢

|误区 ❌|改进 ✅|
|---|---|
|一次给太多不相关任务|一次专注一个任务，完成后 /clear|
|反复修正同一个错误|修正两次后 /clear，用更好的提示词重新开始|
|用"改善"、"优化"等模糊词|给出具体目标和验证标准|
|不提供错误信息就说"有 bug"|粘贴完整错误信息和复现步骤|
|不指定参考文件|用 @ 引用，或指明参考模式|
|让 AI 猜你想要什么风格|指向项目中已有的代码作为参考|

## 7.5 Output Styles（输出风格）🟡

通过 `/config` 设置输出风格，改变 Claude 的回复方式：

|风格|效果|适用场景|
|---|---|---|
|Explanatory|Claude 解释每个修改的 why|入职新代码库、代码审查学习|
|Learning|Claude 像教练一样引导你修改|学习新语言/框架、培训初级工程师|
|自定义|按你的偏好调整 Claude 的语气和格式|团队统一风格、个人习惯|

```
/config
# 选择 Output Style → Explanatory
```

**团队提示**：新人入职代码库时，启用 Explanatory 风格可以加速理解。Claude 不只是改代码，还会告诉你为什么这样改。

![](https://pic4.zhimg.com/v2-fcfa14d98416327c49cc660f6a54743f_1440w.jpg)

## 7.6 Bug 修复的高效沟通 🟡

Claude Code 团队分享的零上下文切换 Bug 修复流程：

```
# 从 Slack 直接修复（需配置 Slack MCP）
这是 Slack 上报告的 bug：[粘贴 bug thread]。Fix it.

# 修复 CI 失败
Go fix the failing CI tests.

# 分布式系统排查
查看 docker logs，分析这些错误的根因并修复
```

**关键原则**：不要微管理 _how_，只说 _what_。让 Claude 自己决定修复路径。

## 7.7 Claude Code 团队的沟通建议 🟡

来自 Anthropic 内部团队的实践：

1. **越具体越好**：与其说"修复这个"，不如说"检查 `src/auth/middleware.ts` 第 45 行的 token 验证逻辑"
2. **提供约束**："不引入新的第三方依赖"、"保持与现有模式一致"
3. **说明"为什么"**："我需要添加缓存，因为这个接口 P99 延迟是 2 秒" 比 "添加缓存" 更好
4. **给出例子**：模糊的需求 + 一个示例 = 清晰的需求

## 8 管理你的会话

🟡 进阶 | **官方最佳实践 #6**：上下文窗口是最重要的资源。

## 8.1 理解上下文窗口 🟢

Claude 的上下文窗口（~200K tokens）包含了会话中的所有内容。

每个功能在会话的不同点加载。下面的选项卡说明每个功能何时加载以及什么进入上下文。

![](https://pica.zhimg.com/v2-4a828e29baaebf2669fa3ae5e7bfdc06_1440w.jpg)

![](https://pic1.zhimg.com/v2-2ff72b38f613c7c075a0d4a4a04dafe8_1440w.jpg)

**核心认知**：一次调试会话或代码库探索就可能产生数万 token。当上下文接近上限时，Claude 可能"遗忘"早期指令或犯更多错误。

## 8.2 及早纠正 🟢

最好的结果来自紧凑的反馈循环：

|操作|快捷键|说明|
|---|---|---|
|停止|Esc|立即停止 Claude，保留上下文|
|回退|Esc + Esc 或 /rewind|打开回退菜单，恢复到检查点|
|撤销|"Undo that"|让 Claude 撤销最近的修改|
|重置|/clear|清空上下文，开始新任务|

**关键规则**：如果你已经修正了 Claude 两次，上下文已经被失败方案污染。运行 `/clear` 并用更好的提示词重新开始——**干净会话 + 好提示词 几乎总是优于 长会话 + 反复修正**。

## 8.3 积极管理上下文 🟡

### 上下文管理策略决策树

![](https://pic1.zhimg.com/v2-c3fdb53f733d9deb39cab86a4ec36a6e_1440w.jpg)

### /clear：最简单也最有效的策略

在切换任务时清空上下文，让新任务获得干净的上下文。

### 自动压缩（Auto Compaction）

当上下文接近上限时，Claude Code 自动触发压缩，保留关键代码和决策，释放空间。

你可以在 CLAUDE.md 中自定义压缩行为：

```
# 压缩指令
When you are using compact, please focus on:
- 测试输出和代码变更
- 修改过的文件的完整列表
- 所有未完成的任务
```

也可以手动触发带指令的压缩：

### 部分回退压缩

使用 `Esc + Esc` 或 `/rewind` 打开回退菜单，选择一个消息检查点，然后选择 **Summarize from here**。这会从该点开始压缩后续消息，同时保留更早的上下文。

## 8.4 使用子代理隔离探索 🟡

由于上下文是你的核心约束，子代理是最强大的工具之一：

![](https://pic1.zhimg.com/v2-86a3259de1acfdf584c2f6f7c9743362_1440w.jpg)

子代理探索代码库、读取文件，然后只返回摘要到主会话，不污染主上下文。

## 8.5 检查点与回退 🟢

Claude 在每次操作前自动创建检查点。按两次 `Esc` 或运行 `/rewind` 打开回退菜单：

- 仅恢复会话
- 仅恢复代码
- 两者都恢复
- 从某点开始压缩

检查点跨会话持久化——你可以关闭终端，下次仍然可以回退。

**提示**：检查点只追踪 Claude 的修改，不能替代 Git。

## 8.6 恢复会话 🟢

```
claude --continue     # 继续最近的会话
claude --resume       # 从列表中选择会话
claude --teleport     # 将 Web 会话拉回本地终端继续
```

Boris 经常用 `--teleport` 把 claude.ai/code 上的 Web 会话拉回本地终端继续，比如在 iOS 上开始任务、稍后在电脑上接手。

使用 `/rename` 给会话命名，像分支一样管理不同工作流的上下文。

### 会话选择器快捷键

|快捷键|操作|
|---|---|
|↑/↓|浏览会话|
|Enter|选择并恢复|
|P|预览会话内容|
|R|重命名会话|
|/|搜索过滤|
|B|按当前 Git 分支过滤|

## 8.7 Token 效率目标 🟡

|指标|目标|说明|
|---|---|---|
|基础上下文消耗|< 20K tokens|占 200K 上下文的 10%|
|CLAUDE.md 大小|< 2000 tokens|60-80 行以内|
|MCP 工具定义总量|< 20K tokens|默认预加载，空闲也占空间|
|上下文清理频率|每 ~60K tokens|在 30% 而非上限时清理|
|Bash 输出截断|尾部 30 行|`npm test 2>&1 \|tail -30`|

### 上下文效率优化清单

|优化方向|方法|
|---|---|
|减少 MCP 开销|禁用不使用的 MCP 服务器，默认预加载时空闲也占上下文|
|CLI 优于 MCP|能用 gh、aws CLI 的场景，优先用 CLI|
|具体化提示|"改善代码库" → 全面扫描；"给 auth.ts 添加验证" → 精准高效|
|CLAUDE.md 瘦身|不常用指令移到 Skills|
|Hooks 预处理|用 Hook 过滤 10000 行日志只剩 ERROR 行|
|安装代码智能插件|一次 "go to definition" 比 grep 多个文件更省 token|

### 监控上下文

通过自定义状态栏持续显示上下文使用情况（配置详见 6.9）：

**Boris Pro Tip B10**：Boris 同时运行 5 个 Claude 会话（Desktop 多窗口 + 终端），并配置了系统通知 Hook。当任何一个会话需要他的注意时，macOS 会弹出通知。这让他可以发起多个任务、去做其他事，等通知再回来处理。

## 9 自动化与规模化

🔴 高级 | **官方最佳实践 #7**：当你用好了一个 Claude，用并行和自动化倍增你的产出。

## 9.1 从单会话到多会话 🟡

|维度|L3 单会话|L4 多会话并行|
|---|---|---|
|Claude 实例|1 个|3-5 个|
|执行方式|串行|并行|
|角色分工|通用|专业化（开发/审查/测试/修复）|
|上下文|共享（容易污染）|隔离（互不影响）|
|工作目录|同一目录|各自 Worktree|
|产出效率|1x|3-5x|

## 9.2 Headless 模式 🟡

`claude -p "your prompt"` 在无交互式环境中运行 Claude，用于 CI 管道、pre-commit hooks、自动化脚本。

```
# 一次性查询
claude -p "解释这个项目是做什么的"

# JSON 输出
claude -p "列出所有 API 端点" --output-format json

# 流式 JSON（实时处理）
claude -p "分析这个日志文件" --output-format stream-json

# 管道组合
cat build-error.txt | claude -p "解释根因" > diagnosis.txt
```

## 9.3 多会话并行 🔴

运行并行会话的三种方式：

|方式|适用场景|特点|
|---|---|---|
|Desktop 应用|本地多会话|可视化管理，每个会话独立 worktree|
|Web 版|云端并行|Anthropic 安全基础设施，隔离 VM|
|Agent Teams（实验特性）|自动化协调|多实例共享任务和消息传递，需手动启用|

并行会话不只是加速——它还启用了质量导向的工作流。新上下文让代码审查更客观，因为 Claude 不会偏向自己刚写的代码。

## 9.4 Writer/Reviewer 模式 🟡

使用两个独立会话，一个写代码一个审查：

![](https://pica.zhimg.com/v2-18846762ffbe7aac5b9f2165376c8c9e_1440w.jpg)

类似地，你可以让一个 Claude 写测试，另一个写代码让测试通过。

## 9.5 Worktree 并行开发 🔴

Git Worktrees 为每个 Claude 会话创建独立的工作目录：

```
# 终端 1：功能开发
claude --worktree feature-auth

# 终端 2：Bug 修复
claude --worktree bugfix-123

# 终端 3：测试编写
claude --worktree add-tests

# 自动生成名称
claude --worktree
```

Worktree 创建在 `<repo>/.claude/worktrees/<name>`，基于默认远程分支创建新分支。退出时：  
- 无变更 → 自动删除 worktree 和分支  
- 有变更 → 提示你保留或删除

将 `.claude/worktrees/` 加入 `.gitignore`。

**Boris Pro Tip B11**：Boris 日常同时维护 3-5 个 worktrees，每个运行独立的 Claude 会话。他最长的一次 Claude 运行持续了 42 小时。他的经验是：worktree 并行是目前"一个人当一个团队用"最实际的方法。  
>  
团队中有人设置 shell 别名 `za`/`zb`/`zc` 一键跳转 worktrees，还有人专门维护一个 **analysis worktree** 只用于读日志和跑数据查询，不做代码修改。

## 9.6 Fan-out 批量处理 🔴

对于大规模迁移或分析，将工作分发到多个并行 Claude 调用：

```
# 1. 生成任务列表
claude -p "列出所有需要迁移的 Python 文件" > files.txt

# 2. 循环执行
for file in $(cat files.txt); do
  claude -p "将 $file 从 React 迁移到 Vue。返回 OK 或 FAIL。" \
    --allowedTools "Edit,Bash(git commit *)" &
done
wait
```

**最佳实践**：先在 2-3 个文件上测试，优化提示词，然后批量执行。`--allowedTools` 让指定工具免确认自动执行，无人值守时避免被权限提示阻塞。

## 9.7 长时间运行的任务 🔴

对于需要持续运行数小时的任务（Boris 最长记录是 42 小时），有几种策略避免 Claude 被权限提示阻塞：

|策略|做法|适用场景|
|---|---|---|
|Background Agent 验证|提示 Claude 完成后用 background agent 自我验证|半自主任务|
|Stop Hook|配置 Stop Hook 检查任务是否完成，未完成则自动继续|需要确定性控制|
|ralph-wiggum 插件|社区插件，自动恢复被中断的 Claude 会话|超长运行任务|
|dontAsk 模式|--permission-mode=dontAsk 在沙箱中运行|受信环境|

⚠️ `--dangerously-skip-permissions` 强烈建议仅在沙箱/隔离环境中使用（非产品硬限制，而是安全最佳实践）。日常开发用 `/permissions` 预批准 + `dontAsk` 模式。

## 9.8 GitHub Actions 集成 🔴

### 快速设置

在 Claude Code 中运行：

### 手动设置

1. 安装 Claude GitHub App：[https://github.com/apps/claude](https://link.zhihu.com/?target=https%3A//github.com/apps/claude)
2. 添加 `ANTHROPIC_API_KEY` 到仓库 Secrets
3. 创建工作流文件：

```
# .github/workflows/claude.yml
name: Claude Code
on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
jobs:
  claude:
    if: contains(github.event.comment.body, '@claude')
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

### 自动 PR 审查

```
name: Claude PR Review
on:
  pull_request:
    types: [opened, synchronize]
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: "/review"
          claude_args: "--max-turns 5"
```

### Issue 自动修复

```
name: Claude Fix Issue
on:
  issues:
    types: [labeled]
jobs:
  fix:
    if: github.event.label.name == 'claude-fix'
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: |
            修复 Issue #${{ github.event.issue.number }}。
            读取 Issue → 搜索代码 → 实现修复 → 编写测试 → 创建 PR
          claude_args: "--max-turns 15"
```

### 已知限制

> ⚠️ Claude GitHub App **不支持 push 事件触发**。上述示例（`issue_comment`、`pull_request`、`issues`）均可正常工作，但如果你需要在 push 时触发 Claude（如自动修复 lint 错误），需在 runner 中手动安装 Claude CLI 并配置环境变量，而非依赖 GitHub App。

### 在 PR/Issue 中使用

安装 GitHub App 后，在评论中 `@claude` 即可触发：

```
@claude 根据 Issue 描述实现这个功能
@claude 修复用户面板组件中的 TypeError
@claude 审查这个 PR 的安全性
```

## 10 避免常见陷阱

🟢 基础 | **官方最佳实践 #8**：识别这些常见错误，及早规避。

## 10.1 五大失败模式 🟢

|陷阱|表现|修复|
|---|---|---|
|1️⃣ 厨房水槽式会话|一个会话混合多个不相关任务|/clear 分隔任务|
|2️⃣ 反复修正|修了两次还是错，上下文被污染|/clear + 更好的初始提示词|
|3️⃣ 过长的 CLAUDE.md|规则被噪声淹没，Claude 忽略|修剪 + 详细指令移到 Skills|
|4️⃣ 信任但不验证|看起来对但实际不工作|始终提供验证手段|
|5️⃣ 无限探索|Claude 读了上百个文件，上下文爆满|缩小范围 + 用子代理隔离|

### 陷阱 1：厨房水槽式会话

**表现**：一个会话中混合了多个不相关任务，上下文充满无关信息。

**修复**：在不相关的任务之间使用 `/clear`。

```
# 错误做法 ❌
修复登录 bug
[完成后]
帮我写 README
[又切换]
分析性能问题

# 正确做法 ✅
修复登录 bug
[完成后]
/clear
帮我写 README
```

### 陷阱 2：反复修正

**表现**：Claude 做错了，你修正它，还是错，再修正……上下文被失败方案污染。

**修复**：修正两次后，`/clear` 并写一个更好的初始提示词，融合你在前两轮学到的信息。

### 陷阱 3：过长的 CLAUDE.md

**表现**：CLAUDE.md 太长，Claude 忽略了一半规则，重要指令被噪声淹没。

**修复**：  
- 无情地修剪。如果 Claude 不需要某条规则也能做对，就删掉  
- 详细指令移到 Skills（按需加载）  
- "必须做"的操作转为 Hooks（确定性保证）

### 陷阱 4：信任但不验证

**表现**：Claude 产出看起来合理的实现，但没处理边界情况。

**修复**：始终提供验证手段——测试、脚本、截图。**如果无法验证，就不要发布。**

### 陷阱 5：无限探索

**表现**：让 Claude "调查"某问题但不限定范围，Claude 读了上百个文件，上下文爆满。

**修复**：  
- 缩小范围："只看 `src/auth/` 目录"  
- 用子代理隔离探索，不污染主上下文

## 10.2 团队级反模式 🟡

|反模式|表现|解决|
|---|---|---|
|无标准化|每人各自配置，没有共享 Skills|建立团队标准——统一 CLAUDE.md 模板、共享 settings.json|
|过度标准化|CLAUDE.md 变成几百行"宪法"|只标准化必要的（构建命令、安全规则），其他留给个人|
|盲目推广|没试点就全团队推广|先 2-3 人试点一周，收集反馈，渐进式推广|

## 10.3 Claude Code 团队的应对建议 🟡

来自 Anthropic 内部的经验：

1. **犯错后更新规则**：每次 Claude 犯了你不想看到的错误，就是完善 CLAUDE.md 或添加 Hook 的机会
2. **定期审查 CLAUDE.md**：像代码审查一样审查你的规则，删除过时的、合并重复的
3. **观察 Claude 行为**：如果 Claude 反复违反某条规则，文件可能太长了，规则被忽略
4. **如果 Claude 问了 CLAUDE.md 已回答的问题**：措辞可能有歧义，重写那条规则

**Boris Pro Tip B12**：Boris 在 Claude 犯错后的标准流程是：让 Claude 自己更新 CLAUDE.md 来避免同类错误。`"刚才那个错误是因为 X。更新 CLAUDE.md 添加规则来防止类似情况。"` 这形成了一个自我改进的循环——Claude 犯的每个错误都让下一次交互变得更好。

## 附录 A 配置模板

## A.1 settings.json 模板

### 个人全局设置

```
// ~/.claude/settings.json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": [
      "Bash(git status)",
      "Bash(git diff *)",
      "Bash(git log *)",
      "Bash(git add *)",
      "Bash(git commit *)"
    ]
  },
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "osascript -e 'display notification \"Claude Code 需要你的注意\" with title \"Claude Code\"'"
          }
        ]
      }
    ]
  },
  "env": {
    "CLAUDE_CODE_EFFORT_LEVEL": "high"
  }
}
```

### 项目共享设置

```
// .claude/settings.json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": [
      "Bash(npm run lint)",
      "Bash(npm run test *)",
      "Bash(npm run build)",
      "Bash(npm run typecheck)"
    ],
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)",
      "Bash(rm -rf *)",
      "Bash(curl *)"
    ]
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write 2>/dev/null || true"
          }
        ]
      }
    ]
  }
}
```

### 企业托管策略

```
// /Library/Application Support/ClaudeCode/managed-settings.json (macOS)
{
  "allowManagedHooksOnly": true,
  "allowManagedPermissionRulesOnly": true,
  "disableBypassPermissionsMode": "disable",
  "permissions": {
    "deny": [
      "Bash(curl *)",
      "Bash(wget *)",
      "Read(./**/*.pem)",
      "Read(./**/*.key)",
      "Read(./**/.env*)"
    ]
  }
}
```

## A.2 Hook 脚本模板

### protect-files.sh

```
#!/bin/bash
# .claude/hooks/protect-files.sh
# 阻止编辑受保护的文件

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

PROTECTED_PATTERNS=(
  ".env"
  "package-lock.json"
  "pnpm-lock.yaml"
  ".git/"
  "migrations/"
  ".pem"
  ".key"
)

for pattern in "${PROTECTED_PATTERNS[@]}"; do
  if [[ "$FILE_PATH" == *"$pattern"* ]]; then
    echo "Blocked: $FILE_PATH matches protected pattern '$pattern'" >&2
    exit 2
  fi
done

exit 0
```

### filter-test-output.sh

```
#!/bin/bash
# ~/.claude/hooks/filter-test-output.sh
# 过滤测试输出，只显示失败

input=$(cat)
cmd=$(echo "$input" | jq -r '.tool_input.command')

if [[ "$cmd" =~ ^(npm\ test|pnpm\ test|pytest|go\ test|bun\ test) ]]; then
  filtered_cmd="$cmd 2>&1 | grep -A 5 -E '(FAIL|ERROR|error:)' | head -100"
  jq -n --arg cmd "$filtered_cmd" \
    '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"allow","updatedInput":{"command":$cmd}}}'
else
  echo "{}"
fi
```

## A.3 GitHub Actions 模板

### 基础 @claude 响应

```
# .github/workflows/claude.yml
name: Claude Code
on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
jobs:
  claude:
    if: contains(github.event.comment.body, '@claude')
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

### 定时报告

```
name: Daily Report
on:
  schedule:
    - cron: "0 9 * * *"
jobs:
  report:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: "生成昨天的提交总结和未关闭 Issue 报告"
```

## 附录 B 键盘快捷键与斜杠命令速查

## 键盘快捷键

|快捷键|操作|
|---|---|
|Enter|发送消息|
|Shift+Tab|切换权限模式（Normal → Auto-Accept → Plan）|
|Esc|停止 Claude 当前操作（保留上下文）|
|Esc + Esc|打开 Rewind 菜单|
|Ctrl+G|在外部编辑器中编写多行输入|
|Ctrl+C|中断当前输入或生成|
|Ctrl+D|退出 Claude Code|
|fn + fn（macOS）|语音输入|

所有快捷键均可自定义：运行 `/keybindings` 重新映射任意按键，设置即时生效。

## 斜杠命令

### 会话与上下文管理

|命令|说明|使用场景|
|---|---|---|
|/clear|清空对话上下文|🟢 切换不相关任务时用，最常用命令之一|
|/compact [指令]|手动压缩上下文|🟡 上下文快满但需要保留历史时|
|/cost|查看当前会话 token 用量|🟢 监控消耗，判断是否需要清理|
|/context|查看上下文消耗分布|🟡 诊断哪些内容占了最多空间|
|/rewind|打开回退菜单|🟢 回退到检查点、撤销错误操作|
|/resume|恢复之前的会话|🟢 继续昨天的工作|
|/rename|重命名当前会话|🟡 像 Git 分支一样管理多个工作流|

### 环境与配置

|命令|说明|使用场景|
|---|---|---|
|/init|自动生成 CLAUDE.md|🟢 新项目引入 AI 协作的最快启动方式|
|/memory|在编辑器中编辑记忆文件|🟡 调试工具：怀疑 AI 没遵循规范时，查看 AI "脑中"的规则到底是什么|
|/config|查看/修改全局配置（含 Output Style）|🟢 调整全局设置、切换输出风格|
|/permissions|查看/修改权限规则|🟢 预批准安全的常用命令|
|/hooks|交互式配置 Hooks|🟡 配置事件驱动的自动化|
|/model|切换模型或调整 Effort Level|🟡 根据任务复杂度切换|
|/mcp|查看和管理 MCP 服务器|🟡 禁用不用的 MCP 节省上下文|
|/keybindings|自定义所有键绑定|🟡 重新映射快捷键，即时生效|
|/terminal-setup|配置终端兼容性|🟢 在 IDE 终端/Warp/Alacritty 中启用 Shift+Enter 换行|

### 项目与协作

|命令|说明|使用场景|
|---|---|---|
|/review|代码审查（需安装对应 skill/插件）|🟢 比自然语言"帮我审查代码"意图更明确，可能触发专门的审查子代理|
|/pr_comments|获取 PR 中的所有评论（需安装对应 skill/插件，非内置命令）|🟡 不用切换到浏览器，直接在终端看同事的审查意见，然后说"根据第二条评论修改 @main.go"|
|/sandbox|开启沙箱隔离|🔴 需要 OS 级文件系统隔离时|
|/statusline|自定义状态栏|🟡 持续监控上下文使用情况|
|/stats|查看使用统计与历史|🟢 查看用量和配额|
|/install-github-app|安装 Claude GitHub App|🔴 配置 GitHub Actions 集成|
|/plugin|浏览插件市场|🟡 插件可打包 LSP、MCP、Skills、Agents、Hooks 为一体化能力包；团队可将常用插件配置纳入版本控制，确保成员环境一致|

## CLI 启动参数

|参数|说明|常用度|
|---|---|---|
|claude|交互式启动|🟢|
|claude -p "prompt"|Headless 模式|🟡|
|claude --continue|继续最近的会话|🟢|
|claude --resume|选择并恢复会话|🟢|
|claude --teleport|将 Web 会话拉回本地终端|🟡|
|claude --permission-mode plan|以 Plan Mode 启动|🟡|
|claude --worktree [name]|在 worktree 中启动|🔴|
|claude --output-format json|JSON 输出|🟡|
|claude --output-format stream-json|流式 JSON 输出|🔴|
|claude --allowedTools "Edit,Bash(*)"|指定工具免确认执行（不是限制可用工具；限制用 --tools 白名单或 --disallowedTools 黑名单）|🔴|
|claude --verbose|调试输出|🟡|
|claude --dangerously-skip-permissions|跳过权限（强烈建议仅限隔离环境）|🔴|

## 附录 C 提示词速查表

|场景|提示词模板|难度|
|---|---|---|
|新项目探索|给我一个这个代码库的概览|🟢|
|理解架构|解释 @src/auth 目录的认证架构|🟢|
|查找代码|找到处理用户认证的文件|🟢|
|Bug 修复|错误信息: [粘贴]。找到根因，写失败测试，修复它|🟢|
|写测试|为 @path/to/file 编写测试，覆盖边界情况。不用 mock|🟢|
|代码审查|审查 @path/to/file 的安全性、性能和一致性|🟢|
|重构|将 @path/to/file 重构为使用 [新模式]，保持行为不变|🟡|
|创建 PR|用描述性消息提交更改并创建 PR|🟢|
|性能分析|分析 @path/to/file 的性能瓶颈并建议优化|🟡|
|文档生成|为 @src/api/ 的公共函数添加 JSDoc 注释|🟢|
|子代理调查|用子代理调查 [模块A] 和 [模块B] 的交互|🟡|
|并行研究|使用独立的子代理并行研究 [A]、[B]、[C]|🔴|
|采访模式|我想构建 [功能]。用 AskUserQuestion 对我进行详细采访|🟡|
|挑战方案|grill me on these changes and don't make a PR until I pass your test|🟡|
|证明有效|prove to me this works. diff main 和 feature branch 的行为差异|🟡|
|推倒重来|knowing everything you know now, scrap this and implement the elegant solution|🟡|
|零切换修 Bug|这是 Slack 上的 bug report：[粘贴]。Fix it.|🟡|
|修 CI|Go fix the failing CI tests.|🟢|
|并行算力|[你的请求]。Use subagents.|🟡|
|Git 历史|查看 @file 的 git 历史，总结它的 API 如何演变|🟡|
|深度思考|/model → 调高 effort level → 输入复杂任务描述|🔴|
|批量 Lint|claude -p "检查相对 main 的变更，报告拼写错误"|🔴|

## 附录 D 精选资源

## 官方文档（必读）

|资源|说明|
|---|---|
|Best Practices|官方最佳实践，本文档的主线来源|
|CLAUDE.md 指南|记忆系统详解|
|常用工作流|调试、测试、PR 等实操指南|
|Hooks 指南|钩子系统详解|
|Skills 系统|自定义技能详解|
|Sub-agents|子代理详解|
|Settings|完整配置参考|
|GitHub Actions|CI/CD 集成|
|功能扩展总览|Skills/Hooks/MCP/Subagents 选择指南|

## 官方博客

|资源|说明|
|---|---|
|How Anthropic Teams Use Claude Code|内部团队案例|
|Using CLAUDE.md Files|CLAUDE.md 使用指南|
|Skills explained|Skills 与 Prompts、Projects、MCP、Subagents 的对比|

## 社区精选

|资源|说明|
|---|---|
|everything-claude-code|完整配置集合（50K+ Stars）|
|claude-code-best-practice|practice made claude perfect|
|Boris Cherny's Workflow (Thread 1)|Claude Code 之父Boris的的工作流分享（12 条推文）|
|Boris Cherny's Tips (Thread 2)|Claude Code 之父Boris的进阶技巧分享|
|Boris Cherny's Tips (Thread 3)|Claude Code 之父Boris的最新实践分享|
|Shipping Faster with Worktrees|[http://incident.io](https://link.zhihu.com/?target=http%3A//incident.io) 的 worktree 实战|

## 附录 E 使用哲学速查卡

## 核心心法

```
1. 验证 > 信任
   给 Claude 验证手段，不要盲目信任输出

2. 上下文是最贵的资源
   /clear 是你最好的朋友，子代理是你的上下文防火墙

3. 具体 > 模糊
   一次精准的指令胜过三次模糊的修正

4. 先探索再编码
   Plan Mode 不是开销，是投资

5. 配置是长期杠杆
   在 CLAUDE.md / Hooks / Skills 上花的时间，每次会话都在回报你

6. 预批准而非跳过权限
   /permissions 白名单 > --dangerously-skip-permissions

7. 犯错后更新规则
   每个错误都是改进 CLAUDE.md 的机会
```

## 成长路径速览

![](https://pic4.zhimg.com/v2-7f793cba890228529c724acdea8a9ed5_1440w.jpg)

## Boris Cherny Pro Tips 索引

|编号|Tips|章节|
|---|---|---|
|B1|Opus + High Effort for everything|1.2|
|B2|验证是 2-3x 质量的关键|3.1|
|B3|Plan Mode 是基础而非可选|4.1|
|B4|语音输入（fn×2）比打字快 3x|5.2|
|B5|团队共维 CLAUDE.md + @claude 更新|6.1|
|B6|/permissions 预批准而非 skip|6.2|
|B7|PostToolUse Hook 自动格式化|6.5|
|B8|/commit-push-pr 每天几十次|6.6|
|B9|挑战式提示 "grill me" / "prove to me" / "elegant solution"|7.3|
|B10|5 个并行 Claude + 系统通知 + --teleport 拉回本地|8.7|
|B11|3-5 worktrees、42h 最长运行、analysis worktree|9.5|
|B12|犯错后让 Claude 更新 CLAUDE.md|10.3|
|B13|每个人的 statusline 都不一样|6.9|

## 发展你的直觉

本指南中的模式不是一成不变的——它们是在一般情况下有效的起点。

有时你**应该**让上下文积累，因为你正在深入一个复杂问题，历史记录很有价值。有时你应该跳过计划直接让 Claude 动手，因为任务是探索性的。有时模糊的提示才是正确的，因为你想看看 Claude 如何解读问题。

注意观察什么有效。当 Claude 产出优秀结果时，回忆你做了什么：提示词结构、提供的上下文、使用的模式。当 Claude 挣扎时，问为什么：上下文太嘈杂？提示词太模糊？任务太大不适合一轮完成？

随着时间推移，你会发展出任何指南都无法捕捉的直觉——你会知道何时该具体、何时该开放，何时该计划、何时该探索，何时该清空上下文、何时该让它积累。