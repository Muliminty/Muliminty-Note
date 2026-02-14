---
title: 长效运行智能体CLI工具实现计划
description: 基于《Effective harnesses for long-running agents》的双轨方案，设计独立的Node.js/TypeScript CLI工具，用于管理长效运行智能体项目
date: 2026-02-13
tags:
  - AI开发工具
  - CLI工具
  - 脚手架
  - 智能体工程
  - 自动化开发
category: AI编程工具
toc: true
---

# 长效运行智能体CLI工具实现计划

## 项目概述
创建一个独立的Node.js/TypeScript CLI工具，实现《Effective harnesses for long-running agents》文章中描述的双轨方案。工具用于管理长效运行智能体项目，支持初始化、增量进展、状态跟踪和自动化测试。

## 技术栈
- **语言**: TypeScript (编译为JavaScript)
- **运行时**: Node.js (>=18.0.0)
- **包管理**: npm 或 yarn
- **CLI框架**: commander.js 或 yargs
- **测试**: Jest + Puppeteer
- **构建工具**: tsup 或 esbuild

## 项目结构

### 新建独立项目目录
```
agent-cli/                          # 独立CLI工具项目
├── package.json                    # 项目配置
├── tsconfig.json                   # TypeScript配置
├── .gitignore                      # Git忽略配置
├── README.md                       # 项目文档
├── bin/
│   └── agent-cli                   # CLI入口文件
├── src/
│   ├── index.ts                    # 主入口
│   ├── cli/                        # CLI相关
│   │   ├── index.ts                # CLI入口
│   │   ├── commands/               # 命令实现
│   │   │   ├── init.ts             # 初始化命令
│   │   │   ├── status.ts           # 状态查看
│   │   │   ├── next.ts             # 下一步实现
│   │   │   ├── test.ts             # 测试命令
│   │   │   └── config.ts           # 配置管理
│   │   └── parser.ts               # 参数解析
│   ├── core/                       # 核心逻辑
│   │   ├── agent/                  # 智能体模块
│   │   │   ├── initializer.ts      # 初始化智能体
│   │   │   ├── coder.ts            # 编码智能体
│   │   │   └── base.ts             # 基础智能体类
│   │   ├── progress/               # 进度跟踪
│   │   │   ├── tracker.ts          # 进度跟踪器
│   │   │   ├── feature-list.ts     # 功能列表管理
│   │   │   └── state-manager.ts    # 状态管理器
│   │   ├── git/                    # Git集成
│   │   │   ├── manager.ts          # Git管理器
│   │   │   └── operations.ts       # Git操作
│   │   └── test/                   # 测试模块
│   │       ├── puppeteer-runner.ts # Puppeteer测试
│   │       └── test-manager.ts     # 测试管理器
│   ├── config/                     # 配置管理
│   │   ├── schema.ts               # 配置schema
│   │   ├── loader.ts               # 配置加载器
│   │   └── defaults.ts             # 默认配置
│   ├── utils/                      # 工具函数
│   │   ├── logger.ts               # 日志工具
│   │   ├── file-utils.ts           # 文件工具
│   │   ├── prompt-utils.ts         # 提示词工具
│   │   └── validation.ts           # 验证工具
│   └── types/                      # 类型定义
│       ├── index.ts                # 导出类型
│       ├── feature.ts              # 功能类型
│       └── config.ts               # 配置类型
├── templates/                      # 模板文件
│   ├── init-prompt.md              # 初始化提示词模板
│   ├── coder-prompt.md             # 编码提示词模板
│   └── feature-list.json           # 功能列表模板
├── examples/                       # 示例项目
│   └── web-app/                    # Web应用示例
└── tests/                          # 测试文件
    ├── unit/                       # 单元测试
    └── integration/                # 集成测试
```

### 参考现有脚本模式
基于对当前项目中`scripts/`目录的分析，采用以下最佳实践：
1. **中文注释**: 所有代码包含详细中文注释
2. **函数式组织**: 模块化的函数组织方式
3. **防御性编程**: 完善的错误处理和验证
4. **进度反馈**: 用户友好的进度指示

## 核心功能实现

### 1. 初始化智能体 (`src/core/agent/initializer.ts`)
**功能**: 创建项目环境，生成功能列表，设置基础结构

**关键实现**:
- 解析用户需求，生成详细功能列表（200+功能项）
- 创建项目目录结构
- 生成`init.sh`启动脚本
- 初始化Git仓库，创建初始提交
- 创建`claude-progress.txt`进度文件
- 生成`feature-list.json`功能列表文件

**输入**: 项目描述、技术栈选择、功能范围
**输出**: 完整的项目脚手架

### 2. 编码智能体 (`src/core/agent/coder.ts`)
**功能**: 实现增量功能开发，管理项目状态

**关键实现**:
- 读取当前项目状态（进度文件、功能列表、Git历史）
- 选择下一个待实现功能（基于优先级和依赖关系）
- 生成功能实现计划
- 执行代码修改
- 运行端到端测试验证
- 更新功能状态和进度文件
- 提交Git更改

**增量策略**: 每次只实现一个功能，保持环境干净状态

### 3. 进度跟踪系统 (`src/core/progress/tracker.ts`)
**功能**: 管理项目进度和状态

**关键组件**:
- `claude-progress.txt`: 人类可读的进度日志
- `feature-list.json`: 结构化功能状态
- Git历史: 完整的变更记录

**状态管理**:
```typescript
interface ProjectState {
  completedFeatures: Feature[];     // 已完成功能
  pendingFeatures: Feature[];       // 待完成功能
  lastUpdated: Date;                // 最后更新时间
  currentFocus: string | null;      // 当前聚焦功能
  testResults: TestResult[];        // 测试结果
}
```

### 4. Git集成 (`src/core/git/manager.ts`)
**功能**: 自动化Git操作，提供版本控制

**关键操作**:
- 仓库初始化
- 功能级别提交（每个功能一个提交）
- 提交信息模板化
- 历史查看和状态恢复
- 分支管理

**提交消息格式**:
```
feat: {功能描述}

- 实现功能: {详细描述}
- 分类: {功能分类}
- 测试状态: {通过/未通过}
- 相关文件: {修改的文件列表}
```

### 5. 测试集成 (`src/core/test/puppeteer-runner.ts`)
**功能**: 端到端功能验证

**测试流程**:
1. 启动开发服务器
2. 使用Puppeteer模拟用户操作
3. 验证功能步骤（基于功能列表中的steps）
4. 截图和日志记录
5. 生成测试报告

**测试验证**: 仅在所有步骤通过时才标记功能为完成

## CLI命令设计

### 命令列表
```bash
# 初始化新项目
agent-cli init <project-name> [options]

# 查看项目状态
agent-cli status [project-path]

# 执行下一个功能
agent-cli next [project-path] [options]

# 测试特定功能
agent-cli test [project-path] [--feature=<id>] [--all]

# 配置管理
agent-cli config get <key>
agent-cli config set <key> <value>
agent-cli config list

# 生成报告
agent-cli report [project-path] [--format=json|markdown|html]

# 重置功能状态
agent-cli reset [project-path] [--feature=<id>]

# 查看帮助
agent-cli --help
```

### 命令选项
- `--template`: 项目模板（react-app, vue-app, nextjs等）
- `--description`: 项目描述
- `--ai-model`: 使用的AI模型（claude-3-5-sonnet等）
- `--force`: 强制覆盖现有文件
- `--verbose`: 详细输出模式
- `--dry-run`: 试运行，不实际修改文件

## 配置系统

### 项目配置 (`agent.config.json`)
```json
{
  "$schema": "./node_modules/agent-cli/schemas/config.schema.json",
  "project": {
    "name": "项目名称",
    "description": "项目描述",
    "type": "web-app",
    "techStack": ["react", "typescript", "tailwind"]
  },
  "agent": {
    "initializer": {
      "promptTemplate": "templates/init-prompt.md",
      "maxFeatures": 200,
      "featureDetailLevel": "high"
    },
    "coder": {
      "promptTemplate": "templates/coder-prompt.md",
      "incrementalMode": true,
      "maxStepsPerSession": 1,
      "requireTests": true
    }
  },
  "testing": {
    "framework": "puppeteer",
    "headless": true,
    "timeout": 30000
  },
  "git": {
    "autoCommit": true,
    "branch": "main"
  }
}
```

### 功能列表格式 (`feature-list.json`)
```json
[
  {
    "id": "feature-001",
    "category": "functional",
    "priority": "high",
    "description": "新对话按钮创建全新会话",
    "steps": [
      "进入主界面",
      "点击'New Chat'按钮",
      "验证新对话被创建",
      "检查对话区为欢迎状态",
      "验证对话出现在侧栏"
    ],
    "passes": false,
    "dependencies": [],
    "estimatedComplexity": "medium",
    "notes": ""
  }
]
```

## 模板系统

### 初始化提示词模板 (`templates/init-prompt.md`)
```markdown
# 项目初始化提示词

你是一个初始化智能体，负责为以下项目创建完整的环境：

**项目描述**: {{projectDescription}}

**技术栈**: {{techStack}}

请完成以下任务：

1. 生成详细的功能需求列表（至少200个功能点）
2. 创建项目目录结构
3. 编写`init.sh`启动脚本
4. 设置Git仓库并创建初始提交
5. 创建`claude-progress.txt`进度文件
6. 生成`feature-list.json`功能列表文件

要求：
- 每个功能点必须包含详细的步骤描述
- 功能点按优先级排序
- 保持代码结构清晰，便于后续开发
```

### 编码提示词模板 (`templates/coder-prompt.md`)
```markdown
# 编码智能体提示词

你是一个编码智能体，负责实现以下功能：

**当前项目**: {{projectName}}
**目标功能**: {{featureDescription}}

**功能步骤**:
{{#each steps}}
{{this}}
{{/each}}

**当前状态**:
- 已完成功能: {{completedCount}}/{{totalCount}}
- 上次提交: {{lastCommitMessage}}
- 最近进度: {{recentProgress}}

请完成以下任务：
1. 阅读相关代码文件，理解当前实现
2. 实现目标功能
3. 编写必要的测试
4. 验证功能正常工作
5. 更新功能状态

要求：
- 每次只修改一个功能
- 保持代码风格一致
- 添加必要的注释
- 确保测试通过
```

## 实现步骤

### 第一阶段：基础框架（1-2天）
1. **项目初始化**
   - 创建项目目录结构
   - 配置TypeScript和构建工具
   - 设置package.json和依赖

2. **CLI框架**
   - 实现命令行参数解析
   - 创建基础命令结构
   - 设置日志和错误处理

3. **核心类型定义**
   - 定义Feature、ProjectState等类型
   - 创建配置schema

### 第二阶段：核心模块（2-3天）
4. **进度跟踪系统**
   - 实现ProgressTracker类
   - 文件读写操作
   - 状态管理逻辑

5. **Git集成**
   - GitManager类实现
   - 提交和分支操作
   - 历史查看功能

6. **智能体基类**
   - BaseAgent抽象类
   - 通用工具方法

### 第三阶段：智能体实现（2-3天）
7. **初始化智能体**
   - InitializerAgent类实现
   - 项目脚手架生成
   - 功能列表生成算法

8. **编码智能体**
   - CoderAgent类实现
   - 增量功能选择逻辑
   - 代码修改和测试流程

### 第四阶段：测试集成（1-2天）
9. **测试框架**
   - Puppeteer测试运行器
   - 测试结果管理
   - 截图和报告生成

10. **端到端测试**
    - 实际项目测试
    - 功能验证流程
    - 错误处理和恢复

### 第五阶段：完善和优化（1-2天）
11. **用户界面优化**
    - 彩色输出和进度指示
    - 交互式命令
    - 帮助文档

12. **错误处理和恢复**
    - 完善的错误处理
    - 状态恢复机制
    - 备份和回滚

13. **文档和示例**
    - 用户指南
    - API文档
    - 示例项目

## 关键技术点

### 1. 功能列表生成算法
- 基于项目描述解析功能需求
- 使用AI模型或规则引擎生成详细功能点
- 优先级排序和依赖分析

### 2. 状态同步机制
- 多文件状态同步（进度文件、功能列表、Git）
- 冲突检测和解决
- 原子操作保证一致性

### 3. 测试自动化
- 动态测试代码生成
- 步骤解析和执行
- 结果验证和报告

### 4. 错误恢复
- Git回滚机制
- 状态检查点
- 增量恢复策略

## 集成点

### 与Claude Agent SDK集成
```typescript
// 可选集成，增强AI能力
interface ClaudeIntegration {
  generateFeatureList(description: string): Promise<Feature[]>;
  getImplementationPlan(feature: Feature, context: ProjectContext): Promise<string>;
  reviewCodeChanges(changes: FileChange[]): Promise<ReviewResult>;
}
```

### 与现有开发工具集成
- VS Code扩展（可选）
- GitHub Actions工作流
- CI/CD流水线集成
- 监控和报警集成

## 验证计划

### 单元测试
- 核心模块单元测试覆盖率 >90%
- 边缘用例测试
- 错误场景测试

### 集成测试
- 完整工作流测试
- 真实项目场景测试
- 跨平台兼容性测试

### 端到端验证
1. 使用工具初始化一个React Web应用项目
2. 自动实现5-10个核心功能
3. 验证所有功能正常工作
4. 检查代码质量和测试覆盖率

## 风险与缓解

### 技术风险
1. **Puppeteer兼容性**: 不同环境的浏览器差异
   - 缓解: 使用容器化测试环境

2. **Git操作冲突**: 并发修改导致冲突
   - 缓解: 文件锁机制和冲突检测

3. **AI模型稳定性**: 生成内容不一致
   - 缓解: 缓存机制和重试策略

### 项目风险
1. **开发时间估计不足**: 复杂功能需要更多时间
   - 缓解: 分阶段交付，优先核心功能

2. **用户接受度**: 工具复杂性可能影响使用
   - 缓解: 详细文档和示例，渐进式学习曲线

## 交付物

### 代码库
- 完整的TypeScript源代码
- 单元测试和集成测试
- 示例项目
- 文档和指南

### 发布包
- npm包发布 (`agent-cli`)
- Docker镜像（可选）
- VS Code扩展市场（可选）

### 文档
- 用户快速入门指南
- API参考文档
- 最佳实践指南
- 故障排除手册

## 后续扩展

### 短期扩展（1-2个月）
1. **更多项目模板**: Next.js, Vue, Svelte等
2. **插件系统**: 支持第三方扩展
3. **团队协作功能**: 多人协同开发支持

### 中期扩展（3-6个月）
1. **云服务集成**: 远程状态同步
2. **高级分析**: 项目进度分析和预测
3. **智能建议**: 基于历史数据的优化建议

### 长期愿景（6-12个月）
1. **全平台支持**: Web界面和移动应用
2. **生态系统**: 模板市场和插件商店
3. **企业功能**: 权限管理、审计日志、合规支持

## 关键文件路径
基于上述设计，以下是实现该计划最关键的5个文件：

1. **agent-cli/src/core/agent/initializer.ts** - [核心逻辑：实现初始化智能体，创建项目环境、功能列表和基础结构]
2. **agent-cli/src/core/agent/coder.ts** - [核心逻辑：实现编码智能体，处理增量功能实现和状态管理]
3. **agent-cli/src/core/progress/tracker.ts** - [状态管理：管理claude-progress.txt和功能列表，跟踪项目进展]
4. **agent-cli/src/cli/commands/init.ts** - [CLI接口：实现初始化命令，用户交互入口]
5. **agent-cli/src/config/schema.ts** - [配置系统：定义配置结构和验证规则，确保工具可配置性]

## 总结
这个CLI工具实现了长效运行智能体的双轨方案，提供了完整的项目管理和自动化开发流程。通过结构化的进度跟踪、增量功能实现和自动化测试，确保智能体能够在多个会话间保持稳定进展，产出高质量的代码。

工具设计考虑了工程化需求，包括完善的错误处理、配置管理、测试覆盖和扩展性，适合用于Web应用开发和其他软件项目。

---
*文档生成时间: 2026-02-13*
*基于《Effective harnesses for long-running agents》文章的双轨方案设计*
*技术参考: Claude Agent SDK, Puppeteer, TypeScript, Node.js*