---
title: "AI 基础理论目录说明"
date: "2026-03-17"
lastModified: "2026-05-09"
tags: ["AI", "基础理论", "目录说明"]
publish: false
toc: true
---

# AI 基础理论目录说明

本目录收录 LLM、Transformer、Embedding、Prompt Engineering、RAG、Agent、模型训练等 AI 基础概念与原理性内容。

## 文章索引

| 序号 | 文章 | 核心内容 |
|:---|:---|:---|
| 01 | [LLM 原理](./01-LLM%20原理.md) | Token、Tokenizer、自回归生成、关键参数、主流模型对比 |
| 02 | [Transformer 架构](./02-Transformer%20架构.md) | Self-Attention、Q/K/V、多头注意力、FFN、位置编码 |
| 03 | [Embedding 与向量表示](./03-Embedding%20与向量表示.md) | 词向量/句向量/Token 向量、余弦相似度、向量数据库 |
| 04 | [Prompt Engineering](./04-Prompt%20Engineering.md) | Few-shot、Chain-of-Thought、System Prompt、结构化提示 |
| 05 | [RAG 原理](./05-RAG%20原理.md) | 文档分块、Embedding 索引、向量检索、生成与评估 |
| 06 | [Agent 原理](./06-Agent%20原理.md) | 规划、工具调用、记忆、反思、ReAct、多 Agent 协作 |
| 07 | [模型训练与对齐](./07-模型训练与对齐.md) | 预训练、SFT、RLHF、DPO、LoRA、量化 |

## 推荐学习顺序

```
01-LLM 原理 → 02-Transformer 架构 → 03-Embedding → 07-模型训练与对齐
                                                          ↓
                          06-Agent 原理 ← 05-RAG 原理 ← 04-Prompt Engineering
```

## 判定原则

- 若文章重点是解释概念、原理、架构边界，应进入本目录
- 若文章重点是调用方式或工程落地，应迁往 `02-模型与API` 或 `03-AI应用开发`
