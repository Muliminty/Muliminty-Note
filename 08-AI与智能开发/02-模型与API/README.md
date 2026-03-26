---
title: "模型与 API 目录说明"
date: "2026-03-17"
lastModified: "2026-03-26"
tags: ["AI", "模型与API", "目录说明"]
description: "说明模型与 API 目录的收录范围、当前结构与推荐阅读顺序。"
publish: true
toc: true
---

# 模型与 API 目录说明

本目录主要收集和整理大模型 API、本地模型运行层、调用框架与相关基础设施知识。

## 1. 本目录负责什么

本目录重点收录：

- 云端模型 API 的调用方式
- 本地模型运行层与调用方式
- 模型开发框架与抽象层
- 与模型调用密切相关的数据基础设施

## 2. 当前结构

- [Ollama](./Ollama.md)：本地模型的下载、运行与 HTTP API 调用入口
- [OpenAI API](./OpenAI-API.md)：OpenAI 官方接口调用与参数说明
- [Claude API](./Claude-API.md)：Anthropic Claude 接口使用说明
- [LangChain](./LangChain.md)：LLM 应用开发框架与抽象层
- [向量数据库](./向量数据库.md)：向量检索与 RAG 常见基础设施

## 3. 推荐阅读顺序

如果你刚开始接触这一层，建议这样读：

1. 先看 [Ollama](./Ollama.md)，理解本地模型如何真正跑起来。
2. 再看云端模型 API，如 [OpenAI API](./OpenAI-API.md) 与 [Claude API](./Claude-API.md)。
3. 最后再看 [LangChain](./LangChain.md) 与 [向量数据库](./向量数据库.md) 这类更上层的抽象与基础设施。

## 4. 维护约束

- 这里优先收录“模型如何被调用、组织和集成”的内容。
- 如果内容核心是“模型原理、推理机制、RAG 与 Agent 概念”，优先放到 `01-AI基础理论`。
- 如果内容核心是“基于模型开发应用或 MCP 工具链”，优先放到 `03-AI应用开发`。
