[微信公众平台](https://mp.weixin.qq.com/s/BwSxQX8XWyTKRe_y7OSd6w?version=5.0.6.99829&platform=mac)


![图片](https://mmbiz.qpic.cn/mmbiz_jpg/Z6bicxIx5naIbf9wyHoEmfHvAJFem5jypfEGJsI9QTcz3Ygg4dRcialuYXKMPAibr2oFxlR7Azzs5I138qdnbqic2g/640?wx_fmt=jpeg&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=0)

前言

2025年以来，AI Coding技术正以前所未有的速度演进，在提升研发效能方面发挥着越来越重要的作用。Claude Code、CodeX、Gemini、Qwen Coder、Kimi K2等编码模型层出不穷，从智能补全到函数生成，再到端到端模块实现，AI Coding已深度融入日常研发流程。

然而，在真实的业务场景中——例如像跨境保险这样涉及多国合规、动态定价、异步交互的复杂领域：

- 有时，为了让AI模型（ClaudeCode、QwenCoder）理解需求，需要花费数个小时“调试”Prompt，可能最终AI产出的代码是错误的或者并不是我想要的。
    
- 有时，受限于单一模型的能力，即使是详细且完善的Prompt，也无法产出预期中的代码。
    
- 有时，试图让多个AI协同开发时，却因模型间能力割裂、指令传递依赖人工复制粘贴，导致效率在琐碎中流失。
    

所以使用AI仅靠“写得快”远远不够，关键在于“写得对”。要实现这一点，需要从依赖感觉的 Vibe Coding 过渡到一个强调规范、可复现、可靠交付的新阶段，SDD（Specification-Driven Development 规范驱动开发） 正是这一转变的核心方法论，并且由多个 AI模型 协同工作，能力互补，避免受限于单一模型的能力边界。

本文基于 SDD 范式，构建了一套由 Claude Code、CodeX 与 Gemini 协同驱动的 AI Coding工作流，并成功从零交付一个跨境保险产品。实践涵盖：「多模型协同互补 + 规范约束」体系的设计与工具选型、Claude Code / CodeX / Gemini 的能力分工与协作机制、以及端到端的开发、审查与归档闭环。

Spec-Driven Development

随着 AI 编码模型的飞速发展，“Vibe Coding”虽能快速产出原型代码，却在研发日常中频频失效：代码看似合理，却偏离业务意图；架构不符合团队约定。问题不在模型本身，而在于仍将 AI 当作“模糊搜索工具”，而非需要明确指令的编码辅助。

Spec-Driven Development（SDD，规范驱动开发）正是对这一范式的根本性修正。SDD的定义由GitHub在25年9月的一篇Blog中提出：

Instead of coding first and writing docs later, in spec-driven development, you start with a (you guessed it) spec. This is a contract for how your code should behave and becomes the source of truth your tools and AI agents use to generate, test, and validate code. The result is less guesswork, fewer surprises, and higher-quality code.

SDD 核心理念：

1.规范先行，而非文档补写。开发始于对“做什么”和“为什么”的清晰定义——包括业务规则、合规约束、成功标准等。技术细节（如语言、框架）暂不介入。这份规范不是静态文档，而是随着对话可变化的、可被 AI 理解并执行的Contract。

2.分阶段验证，拒绝模糊推进。SDD 将开发拆解为 Specify → Plan → Tasks → Implement 四个明确阶段。每个阶段产出物（规范、技术方案、任务清单）必须经人工确认后，才进入下一阶段。这确保 AI 始终在正确轨道上运行。

3.规范即上下文，赋能多 AI 协同。在多模型协作场景中，统一的规范成为共享语境与约束边界。各模型基于同一份 Spec 工作，避免因理解偏差导致的返工或冲突。

**技术选型**

目前主流的开源 SDD 工具有三种：Spec Kit（GitHub）、BMAD（社区开源方法论）和 OpenSpec（Fission AI），下面的表格表格总结了这三种工具的核心特点：

![图片](data:image/svg+xml,%3C%3Fxml%20version='1.0'%20encoding='UTF-8'%3F%3E%3Csvg%20width='1px'%20height='1px'%20viewBox='0%200%201%201'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate\(-249.000000,%20-126.000000\)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

尽管 BMAD 在概念完整性上颇具启发性（Behavior-Model-Architecture-Data 分层思想值得借鉴），而 Spec Kit 是GitHub一类的厂商的SDD标准化尝试，但在实际工程落地中，我们面临的核心诉求是：

> 如何在不改造现有系统、不绑定单一 AI 工具的前提下，快速建立一套可协作、可追溯、可审计的 SDD 工作流。

OpenSpec 正好满足这一需求：

1.轻量可嵌入：OpenSpec 仅通过 CLI 注入即可启用；

2.多 AI 友好：原生支持多种AI工具，当Claude服务异常（例如几天前的CouldFalre服务异常）时，可以换个模型直接顶上，实现“同一份规范，多个模型协同”；

3.变更可管理：保险规则常因政策调整而变更，OpenSpec 的 `changes/` 提案机制让每次修改都有记录、可评审、可归档；

所以本文中的实践基于OpenSpec，大家可以结合自己的项目与场景选择合适的SDD工具。

**OpenSpec**

OpenSpec 是一个轻量级的命令行工具，它通过建立一套清晰的“提案->审查->实现->归档”流程，确保在写代码前，人和AI就“要做什么”达成共识。

```
┌────────────────────┐
```

多AI模型协作编码

在 OpenSpec 为我们奠定了“规范驱动”的工程基础后，我们面临一个根本矛盾：任务越复杂，越需要多个 AI 模型的能力互补；但手动切换工具、复制粘贴上下文的操作成本，又抵消了 AI 带来的提效红利。

![图片](data:image/svg+xml,%3C%3Fxml%20version='1.0'%20encoding='UTF-8'%3F%3E%3Csvg%20width='1px'%20height='1px'%20viewBox='0%200%201%201'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate\(-249.000000,%20-126.000000\)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

这里我的方法是通过 MCP 协议将 Codex 和 Gemini 作为工具（Tool）注入 Claude并通过全局规则约束，来实现Claude、Codex、Gemini 三位一体的无缝协作。我们只需向 Claude 提出一个需求，它便会自动判断何时调用 Codex 编码、何时调用 Gemini 分析海量文档，并将三位 AI 的输出融合并完整交付——整个过程无需人工干预工具切换。

**AI模型的角色与分工**

通过配置，我们为这三个模型设定了清晰的职责边界，让它们取长补短：

![图片](data:image/svg+xml,%3C%3Fxml%20version='1.0'%20encoding='UTF-8'%3F%3E%3Csvg%20width='1px'%20height='1px'%20viewBox='0%200%201%201'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate\(-249.000000,%20-126.000000\)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

**Claude如何智能决策“调谁”**

Claude 并非随机调用，而是严格遵循 `CLAUDE.md` 配置文件中的全局工具规则，这套规则是强制性的。关键条款如下：

> 0. Global tool rule For any task that is more than a trivial edit, you MUST:"Can Codex help with code / experiments here?"  "Can Gemini help with large-context analysis here?"

这意味着：工具调用是默认行为，而非可选项。Claude 在每个关键节点都会自问：“Codex 能帮忙吗？Gemini 能帮忙吗？”

这套规则通过三个配置文件来保障：

- CLAUDE.md：作为“主控面板”，定义了 Claude 作为协调者的决策框架和标准工作流程。
    

- 告诉 Claude "你是协调者，需要决定何时调用其他 AI模型；
    
- 提供明确的决策框架："遇到代码问题找 Codex，遇到大文本分析找 Gemini"；
    
- 定义标准工作流程和 MCP 调用规范；
    

```
# CLAUDE.md
```

- `AGENTS.md`：Codex 的行为规范
    

- 告诉 Codex "你是一个高级工程师，需要遵循这些规则"；
    
- 规定 Codex 的工作目录（.tmp/）、沟通方式、验证标准；
    
- 确保 Codex 的输出符合要求；
    

```
# AGENTS.md
```

- `AGENTS.md` - Gemini 的行为规范
    

- 告诉 Gemini " 你是一个长文本分析专家，需要遵循这些规则"；
    
- 规定 Gemini 的工作目录（.tmp/）、沟通方式、验证标准；
    
- 确保 Gemini 的输出符合要求；
    

```
# AGENTS.md
```

典型决策场景：

- 场景 1：实现保费计算逻辑  → Claude 识别为“non-trivial coding task （非平凡代码任务）” → 调用 Codex 生成 Java 实现原型。
    
- 场景 2： 重构机构路由模块  → Claude 识别需走读业务应用与网关应用的代码仓库 → 调用 Gemini 分析代码库系统架构与接口实现 → 调用 Codex 重构代码。
    

**标准工作流程：四步闭环**

1.理解与规划（Understand & Plan）

- Claude 澄清业务目标（如“支持德国 GDPR 数据删除”）
    
- 调用 Codex：细化技术方案、接口设计
    
- 若涉及多国法规 → 调用 Gemini 获取全局合规视图
    

2.实现与运行（Implement & Run）

- 对于任何非平凡代码变更：
    

- 向 Codex 请求 unified diff 原型
    
- Claude 手动审查、改进后应用最终代码（保障可控性）
    

3.审查与分析（Review & Analyze）

- 调用 Codex：进行代码/设计审查
    
- 调用 Gemini：分析测试日志、发现异常模式、建议消融实验
    
- 若 Codex 与 Gemini 结论冲突 → 要求二者互相回应，Claude 仲裁
    

4.撰写（Write）

- 调用 Gemini：总结法规要点、生成用户条款
    
- 调用 Codex：校验代码片段与文档一致性
    

> 💡 关键设计：Gemini 默认为 read-only 分析师，所有实现与最终决策仍由 Claude（人类监督下）完成，确保安全可控。

**保障机制**

1.强制规则检查

CLAUDE.md 不是建议，而是必须遵守的规则：

- "For any research task that is more than a trivial edit, you MUST..."
    
- "Tool usage is the default."
    
- "If you skip a tool, briefly explain why."
    

2.决策提醒机制

每个关键节点都明确提醒 Claude：

- "Ask yourself: Can Codex help...?"
    
- "Ask yourself: Can Gemini help...?"
    

3.职责清晰

- Claude：协调者，必须做决策
    
- Codex：代码专家
    
- Gemini：分析专家
    
- 每个角色都有明确边界，避免重复工作
    

4. 工作流程标准化

- 通过标准化的 4 步循环（理解→实现→分析→撰写），确保每个阶段都能正确调用对应工具。
    

> ✨ 最终效果：用户面对的仍是 单一 Claude 对话界面，但背后是三位 AI 的自动协同——真正实现“只需一个入口，获得完整结果”。

通过 MCP 协议与强制的协作规则来释放现有模型的组合潜力。在 Spec-Driven Development 的规范约束下，“Claude 统筹 + Codex 实现 + Gemini 分析”的铁三角，确保在复杂的业务背景下，从需求到实现的每一步都经过最合适的“专家”处理，从而保证了最终交付的代码的高质量与高可靠性。前置准备

在开始实践之前，我们需要先做如下的前置准备：

**OpenSpec安装 & 初始化**

前置条件

- Node.js ≥ 20.19.0（可通过 `node --version` 查看版本）
    

步骤 1：全局安装 CLI

```
npm install -g @fission-ai/openspec@latest
```

验证安装是否成功：

```
openspec --version
```

步骤 2：在项目中初始化 OpenSpec

进入你的项目目录：

```
cd my-project
```

运行初始化命令：

```
openspec init
```

![图片](data:image/svg+xml,%3C%3Fxml%20version='1.0'%20encoding='UTF-8'%3F%3E%3Csvg%20width='1px'%20height='1px'%20viewBox='0%200%201%201'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate\(-249.000000,%20-126.000000\)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

初始化过程中会发生以下操作：

- 系统会提示你选择支持的 AI 编码工具（如 Claude Code、CodeBuddy、Cursor、OpenCode、Qoder 等）；其他未列出的助手将默认使用项目根目录下的共享文件 `AGENTS.md` 作为上下文交接点。  
    
- OpenSpec 会自动为你选择的工具配置斜杠命令（如 `/openspec:proposal`）。 
    
- 在项目根目录下创建 `openspec/` 目录结构。
    

初始化完成后：

- 主流 AI 工具可直接使用 `/openspec` 相关命令，无需额外配置。
    
- 可运行 `openspec list` 验证设置状态，并查看当前活跃的变更提案。
    

**Claude SubAgent 构建**

为了配合后续的实践，需要在Claude中创建SubAgent

![图片](data:image/svg+xml,%3C%3Fxml%20version='1.0'%20encoding='UTF-8'%3F%3E%3Csvg%20width='1px'%20height='1px'%20viewBox='0%200%201%201'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate\(-249.000000,%20-126.000000\)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

- 执行/agent命令
    
- 选择 create new agent 
    
- 选择agent级别（project级别仅对当前应用生效，personal级别对当前用户的所有应用生效）
    

系统架构专家 SubAgent：

```
---
```

技术方案专家 SubAgent：

```

```

**CodeX MCP 安装**

确保已成功安装和配置claude code与codex两个编程工具。

> 确保claude code版本在v2.0.56以上；codex cli版本在v0.61.0以上！

1.安装步骤：

1.1 移除官方 Codex MCP（如果已安装）。

```
claude mcp remove codex
```

1.2 安装 CodexMCP。

```
claude mcp add codex -s user --transport stdio -- uvx --from git+https://github.com/GuDaStudio/codexmcp.git codexmcp
```

1.3 验证安装。在 终端 中运行：

```
claude mcp list
```

> 如果看到如下描述，说明安装成功！ `codex: uvx --from git+https://github.com/GuDaStudio/codexmcp.git codexmcp - ✓ Connected`

1.4 可选择默认允许claude code自动与codex交互，在`~/.claude/settings.json`添加 `mcp__codex__codex` allow项。

![图片](data:image/svg+xml,%3C%3Fxml%20version='1.0'%20encoding='UTF-8'%3F%3E%3Csvg%20width='1px'%20height='1px'%20viewBox='0%200%201%201'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate\(-249.000000,%20-126.000000\)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

4.配置claude code提示词（可选）

为使claude code更好完成与codex的协同工作，推荐在 `~/.claude/CLAUDE.md`中添加以下内容。

```
## Core Instruction for CodeX MCP
```

**Gemini MCP 安装**

确保已成功安装和配置claude code与Gemini两个编程工具。

1.Google Gemini CLI 安装指南

安装MCP

```
claude mcp add gemini-cli -- npx -y gemini-mcp-tool
```

验证安装

```
claude mcp list
```

**Yuque MCP 安装（可选）**

安装MCP

```
claude mcp add yuque --transport http https://mcp.alibaba-inc.com/yuque/mcp
```

验证安装

```
claude mcp list
```

实践分享

笔者这里实战中用claude code + codex 协作开发，Gemini的职责由Claude Code兼任。

**阶段一：生成Spec-PRD**

项目启动时，我们首先将原始产品需求文档（PRD）结构化重写为一份 Spec-PRD。这份文档的核心目标是：明确变更内容与代码库的映射关系，例如“新增的运费险种的投保接口”应作用于 `insurance-process/` 模块下的哪些类。

通过提前定义这种映射，可以避免 AI 因不熟悉业务上下文而产生理解偏差，减少后续人工与 AI 之间反复澄清需求的沟通成本。

Spec-PRD 可以写在语雀，也可保存为本地 Markdown 文件——只要格式规范、结构清晰即。

**阶段二：总结系统架构**

在Claude中调用系统架构专家 SubAgent，对现有代码库进行全面分析，输出一份清晰的系统架构文档，为后续AI生成技术方案提供参考基准。

![图片](data:image/svg+xml,%3C%3Fxml%20version='1.0'%20encoding='UTF-8'%3F%3E%3Csvg%20width='1px'%20height='1px'%20viewBox='0%200%201%201'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate\(-249.000000,%20-126.000000\)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

在走读代码库总结系统架构时，Claude也会调用CodeX来协作完善文档内容。

![图片](data:image/svg+xml,%3C%3Fxml%20version='1.0'%20encoding='UTF-8'%3F%3E%3Csvg%20width='1px'%20height='1px'%20viewBox='0%200%201%201'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate\(-249.000000,%20-126.000000\)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

最终产出文档

![图片](data:image/svg+xml,%3C%3Fxml%20version='1.0'%20encoding='UTF-8'%3F%3E%3Csvg%20width='1px'%20height='1px'%20viewBox='0%200%201%201'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate\(-249.000000,%20-126.000000\)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

**阶段三：生成技术方案**

基于阶段一和阶段二中产出的 系统架构文档 与 Spec-PRD，我们调用 “技术方案专家” SubAgent 自动生成一份技术方案文档，为后续 AI 编码阶段提供可执行、可验证的实现指引，确保开发过程“写得对”而非仅“写得快”。

![图片](data:image/svg+xml,%3C%3Fxml%20version='1.0'%20encoding='UTF-8'%3F%3E%3Csvg%20width='1px'%20height='1px'%20viewBox='0%200%201%201'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate\(-249.000000,%20-126.000000\)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

**阶段四：创建变更提案**

在前置准备中我们已经将OpenSpec初始化后，OpenSpec已经在Claude中为我们安装好了3个关键Command。

![图片](data:image/svg+xml,%3C%3Fxml%20version='1.0'%20encoding='UTF-8'%3F%3E%3Csvg%20width='1px'%20height='1px'%20viewBox='0%200%201%201'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate\(-249.000000,%20-126.000000\)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

在Claude中调用OpenSpec的命令创建变更提案（proposal）

```
/openspec:proposal 参考技术文档tech-file.md 和系统架构文档 project.md，新增一个香港地区的货运险种
```

![图片](data:image/svg+xml,%3C%3Fxml%20version='1.0'%20encoding='UTF-8'%3F%3E%3Csvg%20width='1px'%20height='1px'%20viewBox='0%200%201%201'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate\(-249.000000,%20-126.000000\)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

根据OpenSpec的workflow

```
┌────────────────────┐
```

在AI编写提案时，我们需要回答一些AI不确定的点，配合ai写出提案。

![图片](data:image/svg+xml,%3C%3Fxml%20version='1.0'%20encoding='UTF-8'%3F%3E%3Csvg%20width='1px'%20height='1px'%20viewBox='0%200%201%201'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate\(-249.000000,%20-126.000000\)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

回答完毕之后，ai会根据我们提供的明确答案继续创建提案。

![图片](data:image/svg+xml,%3C%3Fxml%20version='1.0'%20encoding='UTF-8'%3F%3E%3Csvg%20width='1px'%20height='1px'%20viewBox='0%200%201%201'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate\(-249.000000,%20-126.000000\)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

此时将第一阶段写好的Spec-PRD的语雀链接给到claude，他会调用Yuque MCP读取内容并创建提案

> 💡 这里也可以把写好的Spec-PRD以MarkDown格式写好保存到本地，让Claude读取路径下的.md文件内容。

![图片](data:image/svg+xml,%3C%3Fxml%20version='1.0'%20encoding='UTF-8'%3F%3E%3Csvg%20width='1px'%20height='1px'%20viewBox='0%200%201%201'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate\(-249.000000,%20-126.000000\)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

了解完毕后，ai开始编写proposal提案。

![图片](data:image/svg+xml,%3C%3Fxml%20version='1.0'%20encoding='UTF-8'%3F%3E%3Csvg%20width='1px'%20height='1px'%20viewBox='0%200%201%201'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate\(-249.000000,%20-126.000000\)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

即使前期我们将Spec-PRD、项目架构文档、技术文档给到ai作为参考资料编写提案，但ai大概率还是能发现遗漏的待确定点。

![图片](data:image/svg+xml,%3C%3Fxml%20version='1.0'%20encoding='UTF-8'%3F%3E%3Csvg%20width='1px'%20height='1px'%20viewBox='0%200%201%201'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate\(-249.000000,%20-126.000000\)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

与ai进行1~2轮对话之后，ai会对需求（为什么做、怎么做，做哪里、范围、边界）有一个清晰的了解，并完善提案。

![图片](data:image/svg+xml,%3C%3Fxml%20version='1.0'%20encoding='UTF-8'%3F%3E%3Csvg%20width='1px'%20height='1px'%20viewBox='0%200%201%201'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate\(-249.000000,%20-126.000000\)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

提案创建完毕，目录如下：

```
├── AGENTS.md
```

**阶段五：变更实现**

此时，变更提案（Proposal）已编写完成，即将通过 OpenSpec 命令触发编码流程。

但是，仅依赖 Spec 并不足以确保高质量输出。为了避免 AI “一口气生成全部代码”导致错误累积、难以修复，我们在调用 Claude 前需要加上额外关键约束：要求 Claude 采用分阶段、交互式的开发模式。

- 每完成一个阶段（如接口定义、服务实现、单元测试），必须总结该阶段的变更内容并汇总成文档，必须暂停并等待人工 Review；
    
- 不得在未确认前一阶段正确性的情况下继续开发
    

CLAUDE.md 相关限制Rule

从而降低AI“错上加错”的风险——当 AI 在早期阶段出现理解偏差时，问题可以被人工及时发现并拦截，而非等到千行代码生成后才暴露，提升代码采用率。

> 💡 本质不是限制 AI，而是将人类置于关键决策点，让 AI 成为高效执行者，而非盲目代码生成器。

加上之后，调用command开始实现变更

```
/openspec:apply
```

![图片](data:image/svg+xml,%3C%3Fxml%20version='1.0'%20encoding='UTF-8'%3F%3E%3Csvg%20width='1px'%20height='1px'%20viewBox='0%200%201%201'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate\(-249.000000,%20-126.000000\)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

完成每个阶段之后，Claude会总结当前阶段变更的代码，并停下来等我们review并确定之后再继续开发工作。

![图片](data:image/svg+xml,%3C%3Fxml%20version='1.0'%20encoding='UTF-8'%3F%3E%3Csvg%20width='1px'%20height='1px'%20viewBox='0%200%201%201'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate\(-249.000000,%20-126.000000\)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

> ❌ 此时一个小插曲发生，Claude服务不可用了...

![图片](data:image/svg+xml,%3C%3Fxml%20version='1.0'%20encoding='UTF-8'%3F%3E%3Csvg%20width='1px'%20height='1px'%20viewBox='0%200%201%201'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate\(-249.000000,%20-126.000000\)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

此时 OpenSpec 对多种 AI 工具的强兼容性优势便充分显现——当某一编码工具不可用或效果不理想时，可无缝切换至其他 AI Coding CLI 而无需修改工作流。

这里笔者选择了 iflow（model为 Claude Code Sonnet 4.5 Thinking），整个工作流依然顺畅运行，验证了 OpenSpec “工具无关，规范驱动”的理念。

![图片](data:image/svg+xml,%3C%3Fxml%20version='1.0'%20encoding='UTF-8'%3F%3E%3Csvg%20width='1px'%20height='1px'%20viewBox='0%200%201%201'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate\(-249.000000,%20-126.000000\)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

**阶段六：提案归档**

验证通过之后，调用OpenSpec的command完成提案归档

```
/openspec-archive
```

思考与总结

引用一段最近在一篇文章中读到的话：

> 这意味着，AI工程师的核心任务不再是“消灭所有不确定性”（这既不可能也不必要），而是通过架构设计、监控机制与人机协同策略，将不确定性收敛至业务与用户可接受的区间之内。从“追求绝对正确”向“管理概率预期”的转变。from 小枫 AI工程 vs 传统工程——「道法术」中的变与不变
> 
> 搜索技术团队，公众号：阿里云开发者[AI工程vs传统工程 —「道法术」中的变与不变](https://mp.weixin.qq.com/s/Foiid7aYvTD0-ejBSGhM7A)

本次的SDD开发实践中，深切体会到：AI 模型的输出天然带有概率性与模糊性——无论是单AI还是多AI协作，若放任其自由发挥，看似高效的“全自动编码”反而会引入难以追溯的隐性风险。  Spec-Driven Development（SDD）是应对这一不确定性的关键，通过一份结构清晰的统一规范（Spec），将原本分散的AI 能力（Claude、Codex、Gemini）约束在同一套框架之下。

这不是试图消除 AI 的不确定性，而是将其引导至一个可预测、可验证、可干预的轨道上。就像水利工程不靠堵水，而靠疏导入渠——SDD 通过规范对齐，让AI 的“概率输出”最终汇聚为“确定交付”。

参考链接：

- https://github.com/Fission-AI/OpenSpec
    
- https://github.com/anthropics/claude-code
    
- https://github.com/GuDaStudio/codexmcp
    
- https://github.com/jamubc/gemini-mcp-tool
    
- https://github.com/smart-lty/Claude-Team