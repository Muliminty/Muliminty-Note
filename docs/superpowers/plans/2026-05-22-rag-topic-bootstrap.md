---
title: "RAG 专题启动实施计划"
date: "2026-05-22"
lastModified: "2026-05-22"
status: "归档"
tags: ["计划", "RAG", "AI与智能开发"]
description: "记录 RAG 专题启动与目录搭建的实施计划。"
toc: true
publish: false
---

# RAG 专题启动实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `08-AI与智能开发/03-AI应用开发/RAG/` 下建立最小可用的 RAG 专题入口，复用既有 `RAG 原理` 正文，补齐专题 backlog、父子目录入口和显式验收路径。

**Architecture:** 采用“复用既有正文 + 新建轻量专题入口”的方式，不重复创建平行开篇文。专题根目录只承载 `README.md`，规划资产进入 `99-参考与归档/`，父级 `03-AI应用开发/README.md` 同步更新以保持目录入口和真实结构一致。验收以链接、入口、阅读路径为核心，而不是新增代码逻辑。

**Tech Stack:** Markdown、Quartz 文档仓库、Node.js 脚本（`npm run fix:links`、`npm run check:wikilinks`）

---

## File Structure

### Create
- `08-AI与智能开发/03-AI应用开发/RAG/README.md`
  - RAG 专题目录说明、范围声明、最短阅读路径、与既有正文的关系说明
- `08-AI与智能开发/03-AI应用开发/RAG/99-参考与归档/01-写作选题清单.md`
  - 首批 10 个优先选题 backlog，作为规划资产而非正式正文

### Modify
- `08-AI与智能开发/03-AI应用开发/README.md`
  - 把目录范围从“当前聚焦 MCP”扩展为“当前包含 MCP 与新建的 RAG 专题入口”，补充 RAG 专题索引与阅读说明

### Reuse without modification
- `08-AI与智能开发/01-AI基础理论/05-RAG 原理.md`
  - 作为当前唯一基础认知正文入口，不迁移、不复制、不重写

### Validation targets
- `08-AI与智能开发/03-AI应用开发/README.md`
- `08-AI与智能开发/03-AI应用开发/RAG/README.md`
- `08-AI与智能开发/03-AI应用开发/RAG/99-参考与归档/01-写作选题清单.md`
- `08-AI与智能开发/01-AI基础理论/05-RAG 原理.md`

---

### Task 1: 更新父级 AI 应用开发入口

**Files:**
- Modify: `08-AI与智能开发/03-AI应用开发/README.md`

- [ ] **Step 1: 读取父级 README 并确认当前目录说明边界**

Read:
- `08-AI与智能开发/03-AI应用开发/README.md`

Expected to find:
- 当前目录主要聚焦 MCP
- “若后续补充 RAG，应新增对应正式文章后再纳入目录索引” 的约束

- [ ] **Step 2: 编写父级 README 的更新内容草稿**

Use this exact content shape when editing:

```md
## 1. 当前收录范围

本目录当前主要包括两类内容：

- MCP（Model Context Protocol）相关应用开发
- RAG（Retrieval-Augmented Generation）专题入口与后续扩展规划

当前已收录的 RAG 内容以专题入口形式接入，基础认知正文复用上游文章，而不是在本目录重复创建平行开篇文。
```

And extend the index table with one new row:

```md
| RAG | [RAG 专题](./RAG/README.md) | RAG 专题入口、阅读路径与后续写作规划 |
```

And extend the reading order section with one line near the end:

```md
5. 如果你要系统学习 RAG，可进入 [RAG 专题](./RAG/README.md)，先看基础认知正文，再看后续选题规划。
```

- [ ] **Step 3: 修改父级 README**

Edit `08-AI与智能开发/03-AI应用开发/README.md` so that:
- “当前聚焦 MCP” 改为包含 MCP 与 RAG 专题
- 索引表新增 `RAG 专题` 行
- 阅读顺序新增 RAG 专题入口
- 维护约束继续保留，不删除现有规则

- [ ] **Step 4: 人工检查父级 README 渲染与语义**

Verify manually in file content:
- 没有把父级 README 写成 RAG 正文
- 目录范围从单一 MCP 扩展为 MCP + RAG
- RAG 链接使用相对 Markdown 链接 `./RAG/README.md`

- [ ] **Step 5: Commit**

```bash
git add "08-AI与智能开发/03-AI应用开发/README.md"
git commit -m "docs(AI应用开发): 接入 RAG 专题入口"
```

---

### Task 2: 创建 RAG 专题 README

**Files:**
- Create: `08-AI与智能开发/03-AI应用开发/RAG/README.md`

- [ ] **Step 1: 写入 RAG 专题 README 初稿**

Create `08-AI与智能开发/03-AI应用开发/RAG/README.md` with this exact structure:

```md
---
title: "RAG 专题目录说明"
date: "2026-05-22"
lastModified: "2026-05-22"
tags: ["AI与智能开发", "RAG", "目录说明"]
description: "说明 RAG 专题当前的收录范围、阅读起点与后续扩展方式。"
publish: false
toc: true
---

# RAG 专题目录说明

本专题用于承载 RAG（Retrieval-Augmented Generation，检索增强生成）相关内容的入口、阅读路径与后续扩展规划。

## 1. 当前专题定位

当前 RAG 专题处于启动阶段，目标不是一次性铺满全部目录，而是先建立一个真实可用的专题入口。

当前专题承担两类职责：

- 提供 RAG 的专题入口与阅读路径
- 收纳后续正式文章的写作规划

当前不承担的职责：

- 不重复编写已有的基础认知正文
- 不使用空目录制造“专题已经完整”的假象

## 2. 当前收录范围

当前专题已接入的内容包括：

- 基础认知正文：[RAG 原理](../../01-AI基础理论/05-RAG 原理.md)
- 写作规划资产：[写作选题清单](./99-参考与归档/01-写作选题清单.md)

## 3. 推荐阅读起点

如果你是第一次进入本专题，建议按以下顺序阅读：

1. 先看 [RAG 原理](../../01-AI基础理论/05-RAG 原理.md)，建立基础认知。
2. 再看 [写作选题清单](./99-参考与归档/01-写作选题清单.md)，了解后续扩展方向。

## 4. 目录结构说明

当前专题目录只保留真实需要承载内容的文件：

- `README.md`：专题说明与阅读路径
- `99-参考与归档/01-写作选题清单.md`：写作 backlog

后续当正式正文落地后，再按需补建如“概念与原理”“核心配置与实战”等子目录。

## 5. 维护约束

- 基础认知正文当前统一复用 [RAG 原理](../../01-AI基础理论/05-RAG 原理.md)，不新增平行开篇文。
- 写作规划放在 `99-参考与归档`，不伪装成正式正文。
- 新目录应跟随真实内容创建，而不是预先铺满空骨架。
```

- [ ] **Step 2: 检查 README 的链接与职责边界**

Verify in the file content:
- 链接到 `RAG 原理` 使用 `../../01-AI基础理论/05-RAG 原理.md`
- 链接到 backlog 使用 `./99-参考与归档/01-写作选题清单.md`
- README 没有写成正文知识解释
- README 明确给出最短阅读路径

- [ ] **Step 3: Commit**

```bash
git add "08-AI与智能开发/03-AI应用开发/RAG/README.md"
git commit -m "docs(RAG): 新建专题目录说明"
```

---

### Task 3: 创建 RAG 写作选题清单

**Files:**
- Create: `08-AI与智能开发/03-AI应用开发/RAG/99-参考与归档/01-写作选题清单.md`

- [ ] **Step 1: 创建归档目录**

Run:

```bash
mkdir -p "08-AI与智能开发/03-AI应用开发/RAG/99-参考与归档"
```

Expected: directory exists with no error.

- [ ] **Step 2: 写入 backlog 文档**

Create `08-AI与智能开发/03-AI应用开发/RAG/99-参考与归档/01-写作选题清单.md` with this exact structure:

```md
---
title: "RAG 写作选题清单"
date: "2026-05-22"
lastModified: "2026-05-22"
status: "草稿"
tags: ["AI与智能开发", "RAG", "写作规划"]
description: "RAG 专题首批优先写作选题与落盘建议。"
publish: false
toc: true
---

# RAG 写作选题清单

> 本文是 RAG 专题的内部写作规划资产，用于整理优先级最高的正式文章选题，不承担正文知识讲解职责。

## 1. 选题使用说明

每条选题包含以下信息：

- 推荐标题：建议最终落盘使用的文章标题
- 知识类型：概念理解类 / 实战应用类 / 问题排错类
- 建议目录：后续正式文章建议放置的位置
- 优先级：高 / 中 / 低
- 写作目标：这篇文章解决什么认知或工程问题

## 2. 首批优先选题

### 2.1 什么是 RAG？它主要解决了什么问题？
- 推荐标题：什么是 RAG？它主要解决了什么问题？
- 知识类型：概念理解类
- 建议目录：`01-概念与原理/01-什么是RAG，它主要解决了什么问题.md`
- 优先级：高
- 写作目标：建立专题总入口，解释 RAG 的定义、问题背景与能力边界。

### 2.2 RAG 的完整链路与系统工作流程
- 推荐标题：RAG 的完整链路与系统工作流程
- 知识类型：概念理解类
- 建议目录：`01-概念与原理/02-RAG 的完整链路与系统工作流程.md`
- 优先级：高
- 写作目标：说明查询、检索、向量数据库与生成阶段之间的整体配合关系。

### 2.3 RAG 知识库的构建流程
- 推荐标题：RAG 知识库的构建流程
- 知识类型：实战应用类
- 建议目录：`02-快速上手/01-RAG 知识库的构建流程.md`
- 优先级：高
- 写作目标：串起文档加载、切分、Embedding、索引建立等落地步骤。

### 2.4 分块策略是什么？如何进行 Chunking？
- 推荐标题：分块策略是什么？如何进行 Chunking？
- 知识类型：概念理解类
- 建议目录：`03-核心配置与实战/01-分块策略是什么，如何进行 Chunking.md`
- 优先级：高
- 写作目标：建立 Chunking 的基础认知，解释其在 RAG 中的工程意义。

### 2.5 为什么 Chunking 会直接影响检索质量？
- 推荐标题：为什么 Chunking 会直接影响检索质量？
- 知识类型：概念理解类
- 建议目录：`03-核心配置与实战/02-为什么 Chunking 会直接影响检索质量.md`
- 优先级：高
- 写作目标：从召回、上下文噪声与语义完整性角度解释切分质量的影响。

### 2.6 固定长度分块和按语义分块，各有什么优缺点？
- 推荐标题：固定长度分块和按语义分块，各有什么优缺点？
- 知识类型：实战应用类
- 建议目录：`03-核心配置与实战/03-固定长度分块和按语义分块的优缺点.md`
- 优先级：高
- 写作目标：帮助读者建立切分策略选型能力。

### 2.7 什么是召回？什么是重排？
- 推荐标题：什么是召回？什么是重排？
- 知识类型：概念理解类
- 建议目录：`03-核心配置与实战/04-什么是召回，什么是重排.md`
- 优先级：高
- 写作目标：讲清 Recall 与 Rerank 的职责边界，为后续检索优化文打基础。

### 2.8 什么是 Query Rewrite？为什么很多 RAG 系统需要它？
- 推荐标题：什么是 Query Rewrite？为什么很多 RAG 系统需要它？
- 知识类型：实战应用类
- 建议目录：`04-高阶与调优/01-什么是 Query Rewrite，为什么很多 RAG 系统需要它.md`
- 优先级：高
- 写作目标：说明查询改写如何改善检索命中率与结果质量。

### 2.9 RAG 系统常见的评测指标有哪些？
- 推荐标题：RAG 系统常见的评测指标有哪些？
- 知识类型：概念理解类
- 建议目录：`04-高阶与调优/02-RAG 系统常见的评测指标有哪些.md`
- 优先级：高
- 写作目标：建立后续评估与优化工作的统一指标口径。

### 2.10 如何系统评估一个 RAG 系统的检索质量、回答质量与可用性？
- 推荐标题：如何系统评估一个 RAG 系统的检索质量、回答质量与可用性？
- 知识类型：实战应用类
- 建议目录：`04-高阶与调优/03-如何系统评估一个 RAG 系统的检索质量、回答质量与可用性.md`
- 优先级：高
- 写作目标：把检索评估、回答评估与系统可用性检查收敛成一套工程化评测视角。
```

- [ ] **Step 3: 检查 backlog 文件角色与字段完整性**

Verify in the file content:
- 文件明确声明自己是“内部写作规划资产”
- 10 条选题都具备标题、类型、建议目录、优先级、写作目标
- 没有把 backlog 写成正式正文或导航首页

- [ ] **Step 4: Commit**

```bash
git add "08-AI与智能开发/03-AI应用开发/RAG/99-参考与归档/01-写作选题清单.md"
git commit -m "docs(RAG): 新增首批写作选题清单"
```

---

### Task 4: 执行链接与入口验收

**Files:**
- Modify: `08-AI与智能开发/03-AI应用开发/README.md`
- Modify: `08-AI与智能开发/03-AI应用开发/RAG/README.md`
- Modify: `08-AI与智能开发/03-AI应用开发/RAG/99-参考与归档/01-写作选题清单.md`
- Validation target: `08-AI与智能开发/01-AI基础理论/05-RAG 原理.md`

- [ ] **Step 1: 运行项目链接修复脚本**

Run:

```bash
npm run fix:links
```

Expected:
- command completes without error
- any normalized markdown links are updated consistently

- [ ] **Step 2: 运行 wikilink 检查脚本**

Run:

```bash
npm run check:wikilinks
```

Expected:
- no forbidden wikilinks introduced in new or modified files
- command completes without error

- [ ] **Step 3: 人工执行阅读路径验收**

Verify this exact path manually in file contents:

```text
03-AI应用开发/README.md
  -> RAG/README.md
    -> 05-RAG 原理.md
    -> 99-参考与归档/01-写作选题清单.md
```

Confirm all of the following:
- 父 README 中已经纳入 RAG 专题说明
- 父 README 到 `./RAG/README.md` 的链接正确
- `RAG/README.md` 到 `../../01-AI基础理论/05-RAG 原理.md` 的链接正确
- `RAG/README.md` 到 `./99-参考与归档/01-写作选题清单.md` 的链接正确
- 没有新增第二篇平行 `什么是RAG` 开篇文
- backlog 位于 `99-参考与归档/`，不是专题根目录

- [ ] **Step 4: 如有脚本或路径问题，做最小修正**

Allowed fixes:
- 修正相对链接路径
- 修正 README 文案中的范围说明
- 修正 backlog 中不完整的选题字段

Do not:
- 新增未审过的专题正文
- 创建额外空目录
- 迁移 `05-RAG 原理.md`

- [ ] **Step 5: Commit**

```bash
git add "08-AI与智能开发/03-AI应用开发/README.md" "08-AI与智能开发/03-AI应用开发/RAG/README.md" "08-AI与智能开发/03-AI应用开发/RAG/99-参考与归档/01-写作选题清单.md"
git commit -m "docs(RAG): 补齐专题入口与阅读路径验收"
```

---

## Self-Review

### Spec coverage
- 建立 `RAG/` 独立专题入口: Task 2
- 生成首批写作 backlog: Task 3
- 复用既有 `05-RAG 原理.md`: Task 2 + Task 4 validation
- 同步修正父级目录入口: Task 1
- 显式验收清单: Task 4
- 不创建平行开篇文、不铺空骨架目录: constrained in File Structure and Task 4 guards

### Placeholder scan
- No `TBD` / `TODO`
- Every file path is exact
- Every command is explicit
- Validation criteria are written as concrete checklist items

### Type consistency
- RAG 专题入口始终指向 `08-AI与智能开发/03-AI应用开发/RAG/README.md`
- 唯一基础正文入口始终指向 `08-AI与智能开发/01-AI基础理论/05-RAG 原理.md`
- backlog 始终位于 `08-AI与智能开发/03-AI应用开发/RAG/99-参考与归档/01-写作选题清单.md`
