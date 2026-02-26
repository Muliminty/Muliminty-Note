# LangChain 知识大纲

> LangChain 是一个用于开发由 LLM（大型语言模型）驱动的应用程序的框架。它提供了一套工具、组件和接口，旨在简化基于大模型的复杂应用的构建过程。

---

## 1. 🌟 LangChain 概述
- **定义与核心理念**：将大模型与其他计算或知识源“链”接起来。
- **应用场景**：问答系统、聊天机器人、智能代理 (Agents)、文本摘要、数据结构化。
- **核心价值**：组件化抽象、快速原型开发、易于切换底层模型（解耦）。

---

## 2. 🧩 核心组件架构

### 2.1 Model I/O (模型输入输出)
负责与语言模型进行最基础的交互：
- **Prompts (提示词)**: 
  - `PromptTemplate`：普通文本模板。
  - `ChatPromptTemplate`：面向聊天模型的模板（包含 System/Human/AI 角色）。
  - `FewShotPromptTemplate`：包含少样本示例的模板，用于引导模型输出。
- **Language Models (语言模型)**:
  - `LLMs`：接收文本字符串，返回文本字符串（如旧版 OpenAI 的 text-davinci）。
  - `Chat Models`：接收消息列表，返回聊天消息（如 gpt-3.5-turbo, gpt-4, claude 等）。
- **Output Parsers (输出解析器)**: 
  - 将大模型的文本输出转化为结构化数据格式。
  - 常见解析器：`PydanticOutputParser` (JSON结构转换), `CommaSeparatedListOutputParser`, `StructuredOutputParser`。

### 2.2 Retrieval (检索与 RAG)
为大模型提供用户特定数据的过程（检索增强生成 Retrieval-Augmented Generation）：
- **Document Loaders (文档加载器)**: 加载各种格式的外部数据（PDF, Markdown, HTML, CSV）。
- **Text Splitters (文本分割器)**: 
  - 将长文档切分为模型 context length 允许的小块 (Chunks)。
  - `RecursiveCharacterTextSplitter` (常用), `CharacterTextSplitter`, 按 Token 分割。
- **Text Embedding Models (文本嵌入模型)**: 
  - 将文本转换为浮点数向量（如 OpenAIEmbeddings）。
- **Vector Stores (向量数据库)**: 
  - 存储和搜索向量的数据库集成（如 Chroma, FAISS, Pinecone, Milvus）。
- **Retrievers (检索器)**: 
  - 接受查询返回文档的接口（如 Vector store retriever, MultiQueryRetriever）。

### 2.3 Chains (链)
将多个组件组装成一个端到端的应用：
- **LLMChain**：最基础的链（Prompt + Model + OutputParser）。
- **Sequential Chains**：顺序链接多个步骤。
- **Document Chains**：处理大量文档的链：
  - _Stuff_：全部塞入上下文。
  - _MapReduce_：分块处理再汇总。
  - _Refine_：滚动更新答案。
- **LCEL (LangChain Expression Language)**：
  - 强大的声明式组装方式，使用管道符 `|` 连接组件（如 `prompt | model | parser`）。
  - 原生支持流式输出、异步、批处理。

### 2.4 Memory (记忆组件)
管理对话的上下文状态，让模型有“记忆”：
- **ConversationBufferMemory**：简单保存所有历史对话。
- **ConversationBufferWindowMemory**：只保留最近 N 轮对话。
- **ConversationSummaryMemory**：利用 LLM 将历史对话总结并保留。
- **VectorStoreRetrieverMemory**：将对话存入向量库，根据相关性检索相关历史。

### 2.5 Agents (智能体)
大模型作为大脑来决定调用什么工具：
- **Tools (工具)**：赋予大模型特定能力的接口（如 Google 搜索、数学计算器、数据库查询）。
- **Agent Types (代理类型)**:
  - _ReAct (Reasoning and Acting)_：推理和行动框架，分析当前局势决定调用什么工具。
  - _OpenAI Functions / Tools Agents_：利用 OpenAI 原生的 Function Calling 能力。
- **AgentExecutor**：代理的运行时环境，负责循环执行“思考->调用工具->观察结果”直到任务完成。

### 2.6 Callbacks (回调系统)
用于日志记录、监控与流式传输的机制：
- 能够挂载在应用的各个阶段（如 `on_llm_start`, `on_tool_end`）。
- 常用 Handler：`StdOutCallbackHandler` (控制台输出), FileCallbackHandler 等。

---

## 3. 🚀 高阶生态系统

- **LangGraph**：
  - 用于构建复杂的多 Agent、有环（Cyclic）工作流和状态机的框架。（解决原版 Agent 不好控制且循环逻辑复杂的问题）。
- **LangServe**：
  - 将现有的 LangChain 应用（如 runnable/chain/Agent）一键部署为 REST API。
- **LangSmith**：
  - LangChain 官方的开发者平台，用于监控、调试、评估（Evaluation）和优化 LLM 应用。

---

## 4. 💡 最佳实践与建议

1. **全面拥抱 LCEL**：新项目应尽量使用 LangChain Expression Language 构建，抛弃老旧的预定义 Chain。LCEL 对 Streaming（流式输出）支持极好。
2. **解耦业务逻辑**：不要深度耦合到 LangChain 某个特定的工具里，特别是简单的 API 调用，可以考虑原生写以防止后期抽象泄漏。
3. **监控重于一切**：部署上线后，务必接入 LangSmith 或类似监控工具（如 LangFuse），没有 trace 的大模型应用像是开盲盒。
4. **控制 Context Size**：在 RAG 和 Memory 模块中，要非常注意输入长度的截断设计，防止触发模型的 Token 上限或产生高昂费用。
