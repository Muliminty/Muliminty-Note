---
# 🔴 核心必填
title: 'OpenClaw 配置文件详解'
date: '2026-03-12'
lastModified: '2026-03-12'
tags: ['OpenClaw', '配置', '实战', 'Gateway']

# 🟡 体系建设
moc: '[[!MOC-OpenClaw]]'
stage: '工程化实践'
prerequisites: []

# 🟢 拓展与控制
description: 'OpenClaw 配置文件（openclaw.json）结构、各节点含义及使用注意事项'
publish: true
aliases: ['openclaw.json 配置']
toc: true
---

# OpenClaw 配置文件详解

> 解析 OpenClaw 配置文件结构、各字段含义及使用方式，便于理解与维护。

## 📋 场景说明

配置文件位于 `~/.openclaw/openclaw.json`（或项目约定路径），采用 JSON 格式，是 Gateway 网关、智能体、渠道与模型的唯一事实来源。修改前建议备份，并注意敏感字段保密。

---

## 配置文件整体结构

配置分为多个一级节点，各节点职责如下：

```json
{
  "meta": {},
  "wizard": {},
  "models": {},
  "agents": {},
  "bindings": [],
  "commands": {},
  "channels": {},
  "gateway": {},
  "plugins": {}
}
```

| 节点     | 说明                          |
| -------- | ----------------------------- |
| meta     | 元数据（最后修改版本、时间）  |
| wizard   | 向导工具运行记录（如 doctor） |
| models   | AI 模型提供商与模型参数       |
| agents   | 智能体实例配置                |
| bindings | 智能体与渠道账号的绑定关系    |
| commands | 命令执行相关规则              |
| channels | 消息渠道配置（如飞书、钉钉）  |
| gateway  | 网关运行模式与认证            |
| plugins  | 插件启用状态                  |

---

## 各节点详细说明

### 1. meta（元数据）

记录配置文件最后修改信息，由系统自动维护，无需手动修改。

| 字段               | 类型   | 说明                         |
| ------------------ | ------ | ---------------------------- |
| lastTouchedVersion | 字符串 | 最后修改配置的 OpenClaw 版本 |
| lastTouchedAt      | 字符串 | 最后修改时间（UTC 格式）     |

### 2. wizard（向导工具）

记录内置向导工具（如 doctor 诊断）的运行记录，系统自动更新。

| 字段           | 类型   | 说明                         |
| -------------- | ------ | ---------------------------- |
| lastRunAt      | 字符串 | 最后运行时间（UTC 格式）     |
| lastRunVersion | 字符串 | 最后运行的版本               |
| lastRunCommand | 字符串 | 最后运行的命令（如 doctor）  |
| lastRunMode    | 字符串 | 运行模式（local = 本地模式） |

### 3. models（AI 模型配置）

配置 AI 模型提供商及具体模型参数，为核心业务配置之一。

```json
"models": {
  "providers": {
    "anthropic": {
      "baseUrl": "模型服务基础地址",
      "apiKey": "API 密钥",
      "models": [
        {
          "id": "模型唯一标识",
          "name": "模型名称",
          "reasoning": false,
          "input": ["text"],
          "cost": {
            "input": 0,
            "output": 0,
            "cacheRead": 0,
            "cacheWrite": 0
          },
          "contextWindow": 200000,
          "maxTokens": 8192
        }
      ]
    }
  }
}
```

| 字段          | 说明                                       |
| ------------- | ------------------------------------------ |
| baseUrl       | API 请求基础 URL                           |
| apiKey        | 访问模型服务的密钥（敏感）                 |
| id            | 模型唯一标识，如 `anthropic/deepseek-v3.2` |
| reasoning     | 是否启用推理能力                           |
| input         | 支持的输入类型（text / 图片等）            |
| cost          | 计费配置，0 表示免费                       |
| contextWindow | 上下文窗口大小（token 数）                 |
| maxTokens     | 单次响应最大输出 token 数                  |

### 4. agents（智能体配置）

配置智能体实例，每个智能体可独立处理不同渠道的请求。

```json
"agents": {
  "defaults": {
    "model": { "primary": "默认使用的模型ID" },
    "models": { "模型ID": {} }
  },
  "list": [
    { "id": "main" },
    {
      "id": "feishu-bot-01",
      "name": "feishu-bot-01",
      "workspace": "工作目录路径",
      "agentDir": "智能体目录路径"
    }
  ]
}
```

- **defaults**：所有智能体的默认模型等配置。
- **list**：智能体实例列表；`id: "main"` 为内置默认智能体；自定义智能体需配置 `workspace`、`agentDir` 等。

### 5. bindings（绑定关系）

将智能体与渠道账号绑定，实现「某渠道某账号的请求由指定智能体处理」。

```json
"bindings": [
  {
    "agentId": "feishu-bot-01",
    "match": {
      "channel": "feishu",
      "accountId": "feishu-01"
    }
  }
]
```

**作用**：当 `feishu` 渠道的 `feishu-01` 账号收到消息时，会路由到 `feishu-bot-01` 智能体处理。

### 6. commands（命令配置）

配置命令执行相关规则。

| 字段         | 类型   | 说明                             |
| ------------ | ------ | -------------------------------- |
| native       | 字符串 | 原生命令处理模式（auto = 自动）  |
| nativeSkills | 字符串 | 原生技能处理模式（auto = 自动）  |
| restart      | 布尔值 | 是否允许重启命令（true = 允许）  |
| ownerDisplay | 字符串 | 所有者显示格式（raw = 原始格式） |

### 7. channels（消息渠道配置）

配置消息接收/发送的渠道（飞书、钉钉、微信等）。以下以飞书为例：

```json
"channels": {
  "feishu": {
    "enabled": true,
    "defaultAccount": "feishu-01",
    "accounts": {
      "feishu-01": {
        "appId": "飞书应用ID",
        "appSecret": "应用密钥",
        "botName": "机器人名称"
      },
      "default": {
        "dmPolicy": "pairing"
      }
    },
    "groupPolicy": "open",
    "requireMention": true
  }
}
```

| 字段                          | 说明                           |
| ----------------------------- | ------------------------------ |
| enabled                       | 是否启用该渠道                 |
| defaultAccount                | 该渠道的默认账号 ID            |
| accounts.\*.appId / appSecret | 飞书应用 ID、密钥（敏感）      |
| dmPolicy                      | 私聊策略（pairing = 配对模式） |
| groupPolicy                   | 群聊策略（open = 开放）        |
| requireMention                | 是否需 @ 机器人才触发响应      |

### 8. gateway（网关配置）

配置网关运行模式与认证方式。

```json
"gateway": {
  "mode": "local",
  "auth": {
    "mode": "token",
    "token": "网关访问令牌"
  }
}
```

- **mode**：运行模式（local = 本地）。
- **auth**：认证方式（token = 令牌认证）；`token` 需保密。

### 9. plugins（插件配置）

配置插件的启用状态。

```json
"plugins": {
  "entries": {
    "feishu": { "enabled": true }
  }
}
```

---

## 使用注意事项

1. **敏感信息**：`apiKey`、`appSecret`、`token` 等需妥善保管，避免提交到版本库或对外泄露。
2. **路径**：`workspace`、`agentDir` 需存在且进程具备读写权限。
3. **版本**：`lastTouchedVersion` 宜与当前 OpenClaw 版本一致，避免配置不兼容。
4. **模型引用**：`agents.defaults.model.primary` 必须在 `models.providers` 下存在对应模型 ID。

---

## 总结

- 配置文件为 JSON，分为 meta、wizard、models、agents、bindings、commands、channels、gateway、plugins 九大模块，职责清晰且相互关联。
- **bindings** 是核心：将智能体（agents）与渠道账号（channels）绑定，实现按渠道/账号的定向路由。
- 敏感项保密、路径权限正确、模型 ID 全局一致，是维护配置的三大要点。


---

参考模型配置
[大模型服务平台百炼控制台](https://bailian.console.aliyun.com/cn-beijing/?tab=doc#/doc/?type=model&url=3023085)

```
```json
{
  "models": {
    "mode": "merge",
    "providers": {
      "bailian": {
        "baseUrl": "https://coding.dashscope.aliyuncs.com/v1",
        "apiKey": "YOUR_API_KEY",
        "api": "openai-completions",
        "models": [
          {
            "id": "qwen3.5-plus",
            "name": "qwen3.5-plus",
            "reasoning": false,
            "input": ["text", "image"],
            "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 },
            "contextWindow": 1000000,
            "maxTokens": 65536
          },
          {
            "id": "qwen3-max-2026-01-23",
            "name": "qwen3-max-2026-01-23",
            "reasoning": false,
            "input": ["text"],
            "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 },
            "contextWindow": 262144,
            "maxTokens": 65536
          },
          {
            "id": "qwen3-coder-next",
            "name": "qwen3-coder-next",
            "reasoning": false,
            "input": ["text"],
            "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 },
            "contextWindow": 262144,
            "maxTokens": 65536
          },
          {
            "id": "qwen3-coder-plus",
            "name": "qwen3-coder-plus",
            "reasoning": false,
            "input": ["text"],
            "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 },
            "contextWindow": 1000000,
            "maxTokens": 65536
          },
          {
            "id": "MiniMax-M2.5",
            "name": "MiniMax-M2.5",
            "reasoning": false,
            "input": ["text"],
            "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 },
            "contextWindow": 196608,
            "maxTokens": 32768
          },
          {
            "id": "glm-5",
            "name": "glm-5",
            "reasoning": false,
            "input": ["text"],
            "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 },
            "contextWindow": 202752,
            "maxTokens": 16384
          },
          {
            "id": "glm-4.7",
            "name": "glm-4.7",
            "reasoning": false,
            "input": ["text"],
            "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 },
            "contextWindow": 202752,
            "maxTokens": 16384
          },
          {
            "id": "kimi-k2.5",
            "name": "kimi-k2.5",
            "reasoning": false,
            "input": ["text", "image"],
            "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 },
            "contextWindow": 262144,
            "maxTokens": 32768
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "bailian/qwen3.5-plus"
      },
      "models": {
        "bailian/qwen3.5-plus": {},
        "bailian/qwen3-max-2026-01-23": {},
        "bailian/qwen3-coder-next": {},
        "bailian/qwen3-coder-plus": {},
        "bailian/MiniMax-M2.5": {},
        "bailian/glm-5": {},
        "bailian/glm-4.7": {},
        "bailian/kimi-k2.5": {}
      }
    }
  },
  "gateway": {
    "mode": "local"
  }
}
```
```