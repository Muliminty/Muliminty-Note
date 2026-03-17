# AI API 知识库

> 本目录主要收集和整理各类 AI API 和框架的使用指南、最佳实践与知识体系。

## 目录结构

本目录包含了大模型相关的 API 和调用框架：

- [OpenAI API](./OpenAI-API.md) — OpenAI 官方接口调用与参数详解（待补充）
- [Claude API](./Claude-API.md) — Anthropic Claude 接口使用指南（待补充）
- [LangChain](./LangChain.md) — LLM 应用开发的主流框架，涵盖其核心组件的使用和原理
- [向量数据库](./向量数据库.md) — Pinecone, Weaviate, Milvus, Chroma 等向量检索相关的 API 与原理（待补充）

## 学习建议

在使用 AI API 与框架时：
1. **优先掌握底层 API**：建议先熟悉原生大模型 API (如 OpenAI API) 的参数和调用方式，这是理解更高层框架的基础。
2. **理解框架的抽象**：LangChain 等框架为了通用性进行了高度抽象，学习时应重点理解其抽象逻辑（如 LCEL、Prompt、Memory 等）。
3. **关注安全性与成本**：在调用各种 API 时，要注意 API Key 的安全管理以及 Token 消耗的成本预估。
