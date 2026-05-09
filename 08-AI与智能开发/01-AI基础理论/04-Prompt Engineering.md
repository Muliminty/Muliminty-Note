---
title: "Prompt Engineering"
date: "2026-05-09"
lastModified: "2026-05-09"
status: "草稿"
tags: ["AI与智能开发", "Prompt Engineering", "LLM", "提示词工程"]
moc: "[[!MOC-AI与智能开发]]"
stage: "基础入门"
prerequisites: ["[[01-LLM 原理]]"]
description: "Prompt Engineering 核心技巧：从基本原则到 Few-shot、Chain-of-Thought 等高级策略。"
aliases: ["提示词工程", "Prompt 工程"]
toc: true
---

# Prompt Engineering

## 是什么

Prompt Engineering（提示词工程）是设计和优化输入给 LLM 的文本（Prompt），以获得更准确、更有用输出的技术与方法论。

> LLM 的能力是固定的，但 Prompt 的质量决定了你能调用出多少能力。Prompt Engineering 就是学会"如何正确地向 AI 提问"。

LLM 本质上是一个条件概率模型：`P(输出 | Prompt)`。Prompt 越好，输出的概率分布越集中在你期望的方向。

---

## 为什么需要 Prompt Engineering

### 同一个模型，不同的 Prompt，天差地别

```
❌ 差的 Prompt：
"写一篇关于 Docker 的文章"

✅ 好的 Prompt：
"你是一位有 10 年经验的 DevOps 工程师。请为前端开发者写一篇 Docker 入门指南，
要求：1）用通俗语言解释容器 vs 虚拟机；2）包含一个 Node.js 项目的完整 Dockerfile 示例；
3）控制在 1500 字以内。"
```

好的 Prompt 明确了：角色、受众、内容要求、格式约束。

### 编程的新形态

Prompt Engineering 不是"花式提问"，而是一种新的人机交互范式：

- 传统编程：用代码精确描述逻辑
- Prompt 编程：用自然语言描述意图，由 LLM 补全细节

---

## 基本原则

### 1. 明确具体

模糊的指令会得到模糊的回答。越具体，输出越可控。

```
❌ "帮我优化这段代码"
✅ "这段 JavaScript 函数处理 10 万条数据时耗时 3 秒，请从时间复杂度角度优化，
   保持函数签名不变，并解释优化思路。"
```

### 2. 提供上下文

LLM 只知道 Prompt 中给的信息。你认为"显而易见"的背景，模型可能完全不知道。

```
✅ "我在用 React 18 + TypeScript 开发一个后台管理系统。
   当前使用 useState 管理表单状态，表单有 20 个字段。
   请推荐更好的状态管理方案。"
```

### 3. 指定输出格式

如果你需要特定格式的输出，直接告诉模型。

```
✅ "请以 JSON 格式返回，结构如下：
   { "title": string, "summary": string, "tags": string[] }"
```

### 4. 分步拆解

复杂任务拆成多个步骤，比一次性塞进去效果好。

```
✅ "请分三步完成：
   1. 分析这段代码的性能瓶颈
   2. 列出可能的优化方案（至少 3 个）
   3. 实现最优方案并给出前后对比"
```

---

## 核心技巧

### Zero-Shot Prompting

不给任何示例，直接下达指令。适合简单、明确的任务。

```
将以下英文翻译为中文：
"The quick brown fox jumps over the lazy dog."
```

### Few-Shot Prompting

在 Prompt 中给出几个输入-输出示例，让模型"学会"任务模式。

```
请将以下技术词汇翻译为中文，保留英文原词：

Input: "Container orchestration"
Output: "容器编排（Container orchestration）"

Input: "Load balancing"
Output: "负载均衡（Load balancing）"

Input: "Service mesh"
Output:
```

模型会从示例中推断出格式和翻译风格。

**适用场景**：

- 模型不理解你想要的格式
- 任务有特定的风格/规则
- Zero-Shot 效果不理想时

### Chain-of-Thought（CoT，思维链）

引导模型"一步一步思考"，显著提升推理类任务的准确率。

```
❌ 直接提问：
"一个商店有 23 个苹果，卖出 8 个后又进了 15 个，现在有多少个？"
→ 模型可能直接给错误答案

✅ 加入 CoT 引导：
"一个商店有 23 个苹果，卖出 8 个后又进了 15 个，现在有多少个？
请一步一步推理。"
→ 模型会先列出 23-8=15，再算 15+15=30
```

**变体**：

- **Zero-Shot CoT**：在 Prompt 末尾加 "Let's think step by step"
- **Few-Shot CoT**：给出包含推理过程的示例
- **Self-Consistency**：多次采样，取出现最多的答案

### System Prompt

设定模型的角色、行为准则和约束。通常通过 API 的 `system` 字段传入。

```json
{
  "system": "你是一位高级前端工程师，专注于 React 和 TypeScript。
             回答要简洁、技术准确，并给出代码示例。
             如果问题超出你的专业范围，请明确告知。",
  "user": "如何实现一个自定义 Hook 管理分页？"
}
```

System Prompt 的设计要点：

- **角色定义**：明确专业领域和经验水平
- **行为约束**：输出格式、语言风格、长度限制
- **兜底策略**：不确定时的行为（坦诚说不知道 vs 推测标注）

### 结构化 Prompt

使用 Markdown 或 XML 标记组织复杂 Prompt，提高可读性和效果。

```markdown
# 任务
分析以下 Pull Request 的代码变更。

# 输入
<code_diff>
...（PR diff 内容）
</code_diff>

# 要求
1. 检查是否有潜在的 Bug
2. 评估代码风格是否一致
3. 给出改进建议

# 输出格式
| 文件 | 行号 | 类型 | 说明 |
|------|------|------|------|
```

---

## 高级策略

### ReAct（Reasoning + Acting）

让模型交替进行"思考"和"行动"，适合需要调用外部工具的场景：

```
问题：北京今天的天气适合户外跑步吗？

思考：我需要查看北京今天的天气数据。
行动：调用天气 API → 获取结果：晴，25°C，AQI 45
观察：天气晴朗，温度适中，空气质量优。
思考：这些条件都适合户外运动。
回答：适合。今天北京晴天，25°C，空气质量优，非常适合户外跑步。
```

这是 [Agent](./06-Agent%20原理.md) 的核心推理模式之一。

### 自我反思（Self-Reflection）

让模型检查自己的输出，发现并纠正错误：

```
请回答以下问题，然后检查你的回答是否正确。如果发现错误，给出修正后的答案。

问题：...
```

### 少样本选择策略

Few-Shot 示例的质量直接影响效果：

- **多样性**：示例应覆盖不同类型的输入
- **相关性**：选择与目标任务最相似的示例
- **排列顺序**：最相关的示例放在最后（模型对末尾信息更敏感）
- **数量**：通常 3-5 个即可，过多会挤占上下文窗口

---

## 常见反模式

| 反模式 | 问题 | 改进 |
|:---|:---|:---|
| 过度客气 | "能不能麻烦你帮我看一下..." | 直接下达指令 |
| 一次塞太多 | 一个 Prompt 里要求 10 件事 | 拆分为多轮对话 |
| 不给约束 | "写一篇文章" | 明确字数、格式、风格 |
| 不给上下文 | "这段代码有 Bug" | 给出完整代码、错误信息、环境 |
| 期望完美 | 指望一次 Prompt 就得到理想输出 | 迭代优化，多轮调整 |

---

## Prompt 与代码的关系

在 AI 辅助开发场景中，Prompt 本质上就是"需求文档"：

```
传统开发：需求文档 → 开发者 → 代码
AI 开发：Prompt → LLM → 代码
```

好的 Prompt 和好的需求文档一样，需要：

- 明确的输入/输出定义
- 边界条件的说明
- 期望行为的示例
- 约束条件（性能、兼容性、风格）

---

## 延伸阅读

- [01-LLM 原理](./01-LLM%20原理.md)：理解 LLM 如何处理 Prompt
- [06-Agent 原理](./06-Agent%20原理.md)：ReAct 等 Prompt 策略在 Agent 中的应用
- [02-Transformer 架构](./02-Transformer%20架构.md)：Attention 机制如何影响模型对 Prompt 的理解
