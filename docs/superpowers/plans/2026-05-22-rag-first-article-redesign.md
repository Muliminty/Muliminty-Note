---
title: "RAG 首篇正文重写计划"
date: "2026-05-22"
lastModified: "2026-05-22"
status: "归档"
tags: ["计划", "RAG", "AI与智能开发"]
description: "记录 RAG 首篇正文重写的实施计划。"
toc: true
publish: false
---

# RAG 首篇正文重写 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 `08-AI与智能开发/01-AI基础理论/05-RAG 原理.md` 重写为 RAG 专题第 1 篇基础认知正文，稳定回答“是什么、为什么出现、解决什么问题、不解决什么问题”。

**Architecture:** 直接复用现有文件路径与文章身份，不新建平行正文、不迁移目录。改写方式采用“保留 frontmatter + 重写正文主体 + 校验专题入口链接关系”的收敛式更新，把过深的流程、评测、优化、进阶架构下沉为后续专题扩展空间。

**Tech Stack:** Markdown、YAML Frontmatter、Quartz 文档仓库脚本（`npm run fix:links`、`npm run check:wikilinks`）

---

## File Structure

### Modify
- `08-AI与智能开发/01-AI基础理论/05-RAG 原理.md`
  - 保留现有文章路径，重写为 RAG 专题第 1 篇基础认知正文

### Validate against
- `08-AI与智能开发/03-AI应用开发/RAG/README.md`
  - 确认专题入口仍然把该文作为唯一基础认知正文
- `08-AI与智能开发/03-AI应用开发/RAG/99-参考与归档/01-写作选题清单.md`
  - 确认后续拆分主题与本文边界一致
- `99-系统/模板/01-概念理解类模板.md`
  - 确认正文结构仍符合概念理解类模板的写法意图

---

### Task 1: 重写 frontmatter 与文章定位

**Files:**
- Modify: `08-AI与智能开发/01-AI基础理论/05-RAG 原理.md`

- [ ] **Step 1: 读取现有正文并确认需保留的元数据字段**

Read:
- `08-AI与智能开发/01-AI基础理论/05-RAG 原理.md`
- `99-系统/模板/01-概念理解类模板.md`

Expected to confirm:
- 文件路径不变
- frontmatter 保留 `title`、`date`、`lastModified`、`status`、`tags`、`moc`、`stage`、`prerequisites`、`aliases`、`toc`
- 需要更新 `lastModified` 与 `description`
- 当前 `moc` 与 `prerequisites` 使用了仓库中的既有链接风格，不在本任务中扩大修复范围

- [ ] **Step 2: 把 frontmatter 草稿改成“首篇基础认知正文”口径**

Replace the current frontmatter block with:

```md
---
title: "RAG 原理"
date: "2026-05-09"
lastModified: "2026-05-22"
status: "草稿"
tags: ["AI与智能开发", "RAG", "检索增强生成", "向量检索"]
moc: "[[!MOC-AI与智能开发]]"
stage: "基础入门"
prerequisites: ["[[01-LLM 原理]]", "[[03-Embedding 与向量表示]]"]
description: "解释 RAG 是什么、为什么会出现、主要解决什么问题，以及它不解决什么问题。"
aliases: ["RAG", "检索增强生成", "Retrieval-Augmented Generation"]
toc: true
---
```

- [ ] **Step 3: 保留文章标题并删除旧正文主体，为新结构腾出空间**

After frontmatter, the file should start like this:

```md
# RAG 原理

## 是什么
```

Expected result:
- 标题仍为 `# RAG 原理`
- 旧的“核心流程 / 核心环节详解 / 评估指标 / 常见问题与优化方向 / 进阶架构 / 延伸阅读”旧段落先整体移除
- 只保留新正文将要覆盖的最小结构起点

- [ ] **Step 4: 人工检查文章身份没有漂移**

Verify in file content:
- 文件仍是 `RAG 原理`，不是新标题的新文章
- 没有改路径、改文件名、改父级目录
- `description` 已从“大而全全流程”收敛为“首篇基础认知正文”定位

- [ ] **Step 5: Commit**

```bash
git add "08-AI与智能开发/01-AI基础理论/05-RAG 原理.md"
git commit -m "docs(RAG): 收敛首篇正文元数据定位"
```

---

### Task 2: 重写“是什么 / 为什么 / 解决什么问题”主体段落

**Files:**
- Modify: `08-AI与智能开发/01-AI基础理论/05-RAG 原理.md`

- [ ] **Step 1: 写入“是什么”章节**

Insert this exact content after `# RAG 原理`:

```md
## 是什么

RAG（Retrieval-Augmented Generation，检索增强生成）是一种在 **推理阶段** 先检索外部知识、再让大语言模型基于检索结果生成回答的系统架构。

可以先记住一句话：**RAG 不是让模型“记住更多”，而是让模型在回答前先“查到相关资料”。**

这里“增强”的不是模型参数本身，而是模型生成回答时所使用的上下文。

这意味着 RAG 的核心思路不是重新训练模型，而是在用户提问和模型回答之间，插入一层“找资料”的能力。

```text
不使用 RAG：用户提问 → 模型直接凭参数记忆回答
使用 RAG：  用户提问 → 系统先检索相关资料 → 模型结合资料回答
```

从工程视角看，RAG 更像一种“给 LLM 接外部知识源”的架构方案，而不是一个单独的模型训练方法。
```

- [ ] **Step 2: 写入“为什么会出现”章节**

Append this exact section after `## 是什么`:

```md
## 为什么会出现

RAG 的出现，本质上是因为 LLM 单独使用时，虽然已经具备很强的语言理解与生成能力，但在知识获取上仍然有天然边界。

### 1. 知识有截止时间

模型训练完成后，它掌握的知识就基本冻结了。训练之后发生的新事件、新文档、新版本变更，并不会自动进入模型参数。

### 2. 私有知识默认不可见

公司内部文档、业务规则、数据库说明、代码仓库约定，通常都不在公开训练数据里。也就是说，模型再强，也天然不知道你团队内部的那部分知识。

### 3. 事实问题容易出现幻觉

当问题要求回答具体事实，而模型又没有足够依据时，它可能生成一个“看起来合理但实际上不准确”的答案。

### 4. 不能把所有补知识问题都交给微调

如果只是为了补充最新知识、私有知识或可追溯资料，直接走微调并不经济。微调更适合调整风格、格式、任务习惯，而不是承担高频知识更新。

所以，RAG 不是为了替代 LLM，而是为了补齐“模型会说，但不一定知道最新事实，也不一定知道你自己的资料”这一层能力缺口。
```

- [ ] **Step 3: 写入“它主要解决了什么问题”章节**

Append this exact section after `## 为什么会出现`:

```md
## 它主要解决了什么问题

RAG 最核心的价值，不是让模型突然变得更聪明，而是让系统回答问题时更容易“有依据”。

### 1. 让 LLM 能接入私有知识

通过接入企业知识库、产品文档、内部规范、代码说明等外部数据源，RAG 可以让回答建立在团队真实拥有的知识之上，而不是只依赖通用训练语料。

### 2. 让系统能够利用最新知识

当底层文档更新后，只要知识库同步更新，系统就可以在下一次检索时拿到新的资料，而不需要重新训练模型。

### 3. 提升回答的可追溯性

因为回答前经过了检索，系统可以引用资料来源、文档片段或证据位置。这一点对文档问答、企业知识问答、合规场景尤其重要。

### 4. 降低部分事实性幻觉风险

RAG 不能彻底消灭幻觉，但它能让模型在回答时优先参考外部材料，而不是完全依赖参数记忆，因此通常能降低部分事实性错误风险。

### 5. 降低“为了补知识而微调”的成本

很多问题本质上是知识接入问题，而不是能力训练问题。对于这类问题，优先建设 RAG 往往比直接微调更快、更便宜，也更容易持续维护。
```

- [ ] **Step 4: 人工检查前三章是否仍然聚焦“认知入口”**

Verify in file content:
- 每一章都围绕“定义 / 背景 / 价值”展开
- 没有重新写回大段工具枚举、评测指标、进阶架构
- 行文语境偏工程认知，不是百科式堆概念

- [ ] **Step 5: Commit**

```bash
git add "08-AI与智能开发/01-AI基础理论/05-RAG 原理.md"
git commit -m "docs(RAG): 重写首篇正文核心认知段落"
```

---

### Task 3: 重写“怎么工作 / 不解决什么问题 / 适用场景 / 关联知识”收尾结构

**Files:**
- Modify: `08-AI与智能开发/01-AI基础理论/05-RAG 原理.md`

- [ ] **Step 1: 写入“它是怎么工作的”章节**

Append this exact section after `## 它主要解决了什么问题`:

```md
## 它是怎么工作的

如果只保留最小链路，RAG 的工作过程可以概括为四步：

```text
用户提问 → 检索相关内容 → 拼接上下文 → 模型生成回答
```

把它展开一点，可以理解为：

1. 用户提出一个问题。
2. 系统先去知识库里找和这个问题最相关的文档片段。
3. 系统把这些片段连同用户问题一起交给模型。
4. 模型基于这批上下文生成最终回答。

这里最重要的不是“向量数据库”这几个字本身，而是：**模型回答前，是否真的拿到了足够相关、足够干净、足够可信的外部上下文。**

也正因为如此，后续工程实践里才会继续拆出 Chunking、Embedding、Recall、Rerank、Query Rewrite、评测等专题，它们本质上都在服务同一件事：让“送到模型面前的资料”更合适。
```

- [ ] **Step 2: 写入“它不解决什么问题”章节**

Append this exact section after `## 它是怎么工作的`:

```md
## 它不解决什么问题

理解 RAG 的价值，同样要理解它的边界。

### 1. 它不会自动消灭幻觉

如果检索结果本身不准、上下文噪声很大，或者模型没有严格依据资料回答，幻觉依然会发生。

### 2. 它不保证检索一定正确

RAG 的前提是“能找到对的资料”。如果知识库构建不好、分块不合理、查询没有命中，后面的生成阶段也只能建立在错误输入之上。

### 3. 它不等于微调

微调解决的是模型行为模式、风格、任务习惯、领域适配问题；RAG 优先解决的是外部知识接入问题。两者相关，但不是一回事。

### 4. 它不等于 Agent

RAG 关注的是“先检索再回答”的知识增强链路；Agent 关注的是多步决策、工具调用、状态管理与任务执行。很多系统会同时使用它们，但概念上不能混为一谈。

### 5. 它不等于“接个向量数据库就一定好用”

真正影响效果的，是整条链路的质量，包括文档质量、分块策略、召回质量、重排策略、Prompt 约束和评测方法，而不只是是否接入了向量存储。
```

- [ ] **Step 3: 写入“什么场景适合用 RAG”与“关联知识”章节**

Append this exact section after `## 它不解决什么问题`:

```md
## 什么场景适合用 RAG

RAG 更适合那些“答案需要依赖外部资料，而且这些资料会变化或需要可追溯”的场景。

常见高匹配场景包括：

- 企业知识库问答
- 文档问答
- FAQ 系统
- 需要引用来源的问答系统
- 时效信息密集的业务场景

如果一个任务的核心矛盾是“模型需要知道你自己的资料”或“回答必须引用依据”，通常就值得优先考虑 RAG。

## 关联知识

- [01-LLM 原理](./01-LLM 原理.md)：理解为什么 LLM 具备生成能力，但知识获取存在边界
- [03-Embedding 与向量表示](./03-Embedding 与向量表示.md)：理解文本为什么能够被表示为可检索的向量
- [06-Agent 原理](./06-Agent 原理.md)：理解 Agent 与 RAG 的职责边界
- [RAG 专题](../03-AI应用开发/RAG/README.md)：查看后续专题入口与阅读路径
```

- [ ] **Step 4: 对全文做一次结构收敛检查**

Verify in file content:
- 章节结构为：`是什么` → `为什么会出现` → `它主要解决了什么问题` → `它是怎么工作的` → `它不解决什么问题` → `什么场景适合用 RAG` → `关联知识`
- 不再包含旧的“评估指标 / 常见问题与优化方向 / 进阶架构 / 大段离线在线细节”章节
- 仍然给后续专题保留自然拆分空间

- [ ] **Step 5: Commit**

```bash
git add "08-AI与智能开发/01-AI基础理论/05-RAG 原理.md"
git commit -m "docs(RAG): 完成首篇正文结构重写"
```

---

### Task 4: 执行链接与专题入口验收

**Files:**
- Modify: `08-AI与智能开发/01-AI基础理论/05-RAG 原理.md`
- Validation target: `08-AI与智能开发/03-AI应用开发/RAG/README.md`
- Validation target: `08-AI与智能开发/03-AI应用开发/RAG/99-参考与归档/01-写作选题清单.md`

- [ ] **Step 1: 运行项目链接修复脚本**

Run:

```bash
npm run fix:links
```

Expected:
- 命令执行完成
- 如果脚本修正了无关文件，只记录现象，不擅自扩大本任务范围
- 当前目标文件中的 Markdown 相对链接保持一致

- [ ] **Step 2: 运行 wikilink 检查脚本**

Run:

```bash
npm run check:wikilinks
```

Expected:
- 命令执行完成
- 如果仓库仍存在历史 wikilink 问题，明确区分“历史问题”和“本次新增问题”
- 本次改写的 `05-RAG 原理.md` 不应新增正文里的 `[[...]]` 链接

- [ ] **Step 3: 人工执行专题阅读路径验收**

Verify this exact path manually in file contents:

```text
03-AI应用开发/README.md
  -> RAG/README.md
    -> 05-RAG 原理.md
      -> 01-LLM 原理.md
      -> 03-Embedding 与向量表示.md
      -> 06-Agent 原理.md
    -> 99-参考与归档/01-写作选题清单.md
```

Confirm all of the following:
- `RAG/README.md` 仍把 `05-RAG 原理.md` 作为唯一基础认知正文入口
- `05-RAG 原理.md` 的正文职责已收敛为首篇认知文，而不是大而全总览文
- `05-RAG 原理.md` 中新增的“关联知识”链接使用相对 Markdown 链接
- `01-写作选题清单.md` 中列出的后续主题，与正文中提到的拆分方向一致
- 没有新增第二篇平行“什么是 RAG”正文

- [ ] **Step 4: 如有必要，做最小修正**

Allowed fixes:
- 修正 `05-RAG 原理.md` 中的相对链接
- 修正 `description` 与正文定位不一致的问题
- 修正章节标题文案不一致的问题

Do not:
- 新建平行开篇文
- 迁移 `05-RAG 原理.md`
- 扩写回“完整链路大总览”结构
- 顺手处理仓库里与本任务无关的历史 wikilink 问题

- [ ] **Step 5: Commit**

```bash
git add "08-AI与智能开发/01-AI基础理论/05-RAG 原理.md"
git commit -m "docs(RAG): 验收首篇正文阅读路径与边界"
```

---

## Self-Review

### Spec coverage
- 收敛为第 1 篇基础认知正文：Task 1 + Task 2 + Task 3
- 解释“是什么 / 为什么出现 / 解决什么问题 / 不解决什么问题”：Task 2 + Task 3
- 只保留最小工作流程，不展开工程细节：Task 3
- 保持原路径、不新建平行正文：Task 1 + Task 4
- 为后续 Chunking / Recall / Rerank / 评测等主题保留拆分空间：Task 3 + Task 4
- 与专题入口和 backlog 的关系一致：Task 4

### Placeholder scan
- No `TBD` / `TODO`
- Every file path is exact
- Every command is explicit
- Every replacement block is concrete

### Type consistency
- 唯一被改写的正文文件始终是 `08-AI与智能开发/01-AI基础理论/05-RAG 原理.md`
- 专题入口始终是 `08-AI与智能开发/03-AI应用开发/RAG/README.md`
- backlog 始终是 `08-AI与智能开发/03-AI应用开发/RAG/99-参考与归档/01-写作选题清单.md`
- 正文章节顺序在 Task 2 与 Task 3 中保持一致
