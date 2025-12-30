# MCP 服务器开发教程

> 本指南详细介绍如何开发自定义 MCP Server，包括基础概念、代码示例和最佳实践。

## 📚 前置知识

- Python 或 TypeScript 基础编程能力
- 了解异步编程（async/await）
- 熟悉 JSON-RPC 协议（可选）

---

## 🛠️ 开发环境准备

### Python 环境

```bash
# 安装 MCP SDK
pip install mcp

# 或使用 uv（更快的包管理器）
pip install uv

# 创建项目目录
mkdir my-mcp-server
cd my-mcp-server
```

### TypeScript 环境

```bash
# 初始化项目
npm init -y

# 安装 MCP SDK
npm install @modelcontextprotocol/sdk

# 安装开发依赖
npm install -D typescript @types/node
```

---

## 📝 开发你的第一个 MCP Server

### 示例 1：加法工具（Python）

这是一个最简单的 MCP Server 示例，提供加法工具。

**目录结构**：
```
math-server/
├── pyproject.toml
└── src/
    └── math_server.py
```

**pyproject.toml**：
```toml
[project]
name = "math-server"
version = "0.1.0"
description = "A simple MCP server for math operations"
dependencies = [
    "mcp>=1.0.0",
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
```

**math_server.py**：
```python
#!/usr/bin/env python3
import asyncio
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

# 创建服务器实例
server = Server("math-server")

# 注册加法工具
@server.tool()
async def add(a: float, b: float) -> str:
    """将两个数字相加"""
    result = a + b
    return f"{a} + {b} = {result}"

# 注册减法工具
@server.tool()
async def subtract(a: float, b: float) -> str:
    """将两个数字相减"""
    result = a - b
    return f"{a} - {b} = {result}"

# 注册乘法工具
@server.tool()
async def multiply(a: float, b: float) -> str:
    """将两个数字相乘"""
    result = a * b
    return f"{a} * {b} = {result}"

# 主函数
async def main():
    # 使用标准输入输出运行服务器
    async with stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            server.create_initialization_options()
        )

if __name__ == "__main__":
    asyncio.run(main())
```

### 示例 2：天气查询服务（Python - 使用 FastMCP）

使用 FastMCP 可以简化开发流程。

**weather_server.py**：
```python
#!/usr/bin/env python3
import httpx
import os
from typing import Any
from mcp.server.fastmcp import FastMCP

# 初始化 MCP 服务器
mcp = FastMCP("WeatherServer")

# 获取 API 密钥
API_KEY = os.getenv("OPENWEATHER_API_KEY")
BASE_URL = "https://api.openweathermap.org/data/2.5"

@mcp.tool()
async def get_weather(city: str) -> str:
    """获取指定城市的当前天气"""
    if not API_KEY:
        return "错误：未设置 OPENWEATHER_API_KEY"

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{BASE_URL}/weather",
                params={
                    "q": city,
                    "appid": API_KEY,
                    "units": "metric",
                    "lang": "zh_cn"
                }
            )
            response.raise_for_status()
            data = response.json()

            # 解析天气信息
            weather = data["weather"][0]["description"]
            temp = data["main"]["temp"]
            feels_like = data["main"]["feels_like"]
            humidity = data["main"]["humidity"]

            return f"""🌍 {city} 的天气：
- 天气状况: {weather}
- 气温: {temp}°C
- 体感温度: {feels_like}°C
- 湿度: {humidity}%"""

    except httpx.HTTPError as e:
        return f"获取天气失败: {str(e)}"

@mcp.tool()
async def get_forecast(city: str, days: int = 3) -> str:
    """获取指定城市的天气预报"""
    if not API_KEY:
        return "错误：未设置 OPENWEATHER_API_KEY"

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{BASE_URL}/forecast",
                params={
                    "q": city,
                    "appid": API_KEY,
                    "units": "metric",
                    "lang": "zh_cn",
                    "cnt": days * 8  # 每天8次预报（每3小时一次）
                }
            )
            response.raise_for_status()
            data = response.json()

            result = [f"📅 {city} 未来 {days} 天天气预报："]
            daily_data = {}
            for item in data["list"]:
                date = item["dt_txt"].split()[0]
                if date not in daily_data:
                    daily_data[date] = []
                daily_data[date].append(item)

            for date, items in list(daily_data.items())[:days]:
                temps = [item["main"]["temp"] for item in items]
                weather = items[0]["weather"][0]["description"]
                avg_temp = sum(temps) / len(temps)
                result.append(f"\n{date}: {weather}, 平均温度 {avg_temp:.1f}°C")

            return "\n".join(result)

    except httpx.HTTPError as e:
        return f"获取天气预报失败: {str(e)}"

if __name__ == "__main__":
    mcp.run()
```

### 示例 3：文件系统操作（TypeScript）

**filesystem-server.ts**：
```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import * as fs from "fs/promises";
import * as path from "path";

const server = new Server(
  {
    name: "filesystem-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 列出可用工具
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "read_file",
        description: "读取文件内容",
        inputSchema: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description: "文件路径",
            },
          },
          required: ["path"],
        },
      },
      {
        name: "write_file",
        description: "写入文件内容",
        inputSchema: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description: "文件路径",
            },
            content: {
              type: "string",
              description: "文件内容",
            },
          },
          required: ["path", "content"],
        },
      },
      {
        name: "list_directory",
        description: "列出目录内容",
        inputSchema: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description: "目录路径",
            },
          },
          required: ["path"],
        },
      },
    ],
  };
});

// 处理工具调用
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "read_file": {
        const content = await fs.readFile(args.path, "utf-8");
        return {
          content: [
            {
              type: "text",
              text: content,
            },
          ],
        };
      }

      case "write_file": {
        await fs.writeFile(args.path, args.content, "utf-8");
        return {
          content: [
            {
              type: "text",
              text: `成功写入文件: ${args.path}`,
            },
          ],
        };
      }

      case "list_directory": {
        const files = await fs.readdir(args.path, { withFileTypes: true });
        const fileList = files.map((f) => ({
          name: f.name,
          isDirectory: f.isDirectory(),
        }));
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(fileList, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`未知工具: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `错误: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

// 启动服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Filesystem MCP server running on stdio");
}

main().catch(console.error);
```

---

## 🔧 MCP Server 核心概念

### 1. 工具（Tools）

工具是 MCP Server 提供的功能单元，可以通过装饰器或配置方式注册。

**Python 示例**：
```python
@server.tool()
async def my_function(param1: str, param2: int) -> str:
    """工具描述，会被 LLM 看到并理解"""
    # 实现逻辑
    return "结果"
```

**TypeScript 示例**：
```typescript
{
  name: "tool_name",
  description: "工具描述",
  inputSchema: {
    type: "object",
    properties: {
      param1: { type: "string", description: "参数描述" },
    },
    required: ["param1"],
  },
}
```

### 2. 资源（Resources）

资源提供对数据的访问，类似于只读工具。

**Python 示例**：
```python
@server.resource("file://{path}")
async def get_file(path: str) -> str:
    """获取文件内容"""
    return await read_file(path)
```

### 3. 提示词（Prompts）

提示词是预定义的提示模板，可以动态生成。

**Python 示例**：
```python
@server.prompt("analyze-code")
async def analyze_code_prompt(file_path: str) -> str:
    """分析代码的提示词"""
    code = await read_file(file_path)
    return f"""请分析以下代码：
{code}

请指出：
1. 代码结构
2. 潜在问题
3. 改进建议
"""
```

---

## 📊 MCP Server 类型

### 1. STDIO 类型的 Server

通过标准输入输出进行通信，适用于简单的工具。

**配置示例**：
```json
{
  "mcp_servers": {
    "my-server": {
      "command": "uv",
      "args": [
        "--directory",
        "/path/to/server",
        "run",
        "main.py"
      ]
    }
  }
}
```

### 2. SSE 类型的 Server

通过服务器发送事件（SSE）进行通信，支持实时更新。

**配置示例**：
```json
{
  "mcp_servers": {
    "my-server": {
      "type": "sse",
      "url": "http://localhost:3000/sse"
    }
  }
}
```

---

## 🚀 高级功能

### 1. 环境变量管理

敏感信息（API 密钥等）应通过环境变量传递。

**Python**：
```python
import os

API_KEY = os.getenv("MY_API_KEY")
if not API_KEY:
    raise ValueError("未设置 MY_API_KEY")
```

**配置文件**：
```json
{
  "mcp_servers": {
    "weather": {
      "command": "uv",
      "args": ["run", "weather.py"],
      "env": {
        "OPENWEATHER_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

### 2. 错误处理

```python
@mcp.tool()
async def safe_operation(data: str) -> str:
    try:
        # 尝试执行操作
        result = process_data(data)
        return f"成功: {result}"
    except ValueError as e:
        return f"数据错误: {str(e)}"
    except Exception as e:
        return f"未知错误: {str(e)}"
```

### 3. 日志记录

```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@mcp.tool()
async def logged_operation(input: str) -> str:
    logger.info(f"执行操作，输入: {input}")
    try:
        result = process(input)
        logger.info("操作成功")
        return result
    except Exception as e:
        logger.error(f"操作失败: {e}")
        raise
```

### 4. 缓存机制

```python
from functools import lru_cache
from datetime import datetime, timedelta
import hashlib

cache = {}

def get_cache_key(*args) -> str:
    return hashlib.md5(str(args).encode()).hexdigest()

def should_use_cache(key: str, ttl_seconds: int = 300) -> bool:
    if key not in cache:
        return False
    cached_time = cache[key]["timestamp"]
    return (datetime.now() - cached_time) < timedelta(seconds=ttl_seconds)

@mcp.tool()
async def cached_fetch(url: str) -> str:
    cache_key = get_cache_key(url)

    if should_use_cache(cache_key):
        return cache[cache_key]["data"]

    data = await fetch_data(url)
    cache[cache_key] = {
        "data": data,
        "timestamp": datetime.now()
    }
    return data
```

---

## 🧪 测试 MCP Server

### 单元测试

```python
import pytest
from your_server import add, subtract, multiply

@pytest.mark.asyncio
async def test_add():
    result = await add(2, 3)
    assert "5" in result

@pytest.mark.asyncio
async def test_subtract():
    result = await subtract(5, 3)
    assert "2" in result

@pytest.mark.asyncio
async def test_multiply():
    result = await multiply(2, 3)
    assert "6" in result
```

### 手动测试

使用 `mcp-client` 工具进行手动测试：

```bash
# 安装 MCP 测试工具
pip install mcp-client

# 启动服务器并测试
echo '{"jsonrpc": "2.0", "method": "tools/list", "id": 1}' | python your_server.py
```

---

## 📦 打包与发布

### Python 项目

```bash
# 构建项目
pip install build
python -m build

# 发布到 PyPI（可选）
pip install twine
twine upload dist/*
```

### TypeScript 项目

```bash
# 构建
npm run build

# 发布到 npm（可选）
npm publish
```

---

## 🔐 安全最佳实践

1. **输入验证**
   ```python
   @mcp.tool()
   async def safe_operation(input: str) -> str:
       # 验证输入
       if not input or len(input) > 1000:
           return "错误：输入无效"
       # 执行操作
   ```

2. **沙盒隔离**
   - 限制文件系统访问路径
   - 使用虚拟环境
   - 限制网络访问

3. **速率限制**
   ```python
   from datetime import datetime, timedelta
   from collections import defaultdict

   rate_limits = defaultdict(list)

   @mcp.tool()
   async def rate_limited_operation(user_id: str) -> str:
       now = datetime.now()
       user_requests = rate_limits[user_id]

       # 清理超过1分钟的请求
       user_requests = [t for t in user_requests if (now - t) < timedelta(minutes=1)]
       rate_limits[user_id] = user_requests

       if len(user_requests) >= 10:  # 每分钟最多10次
           return "错误：请求过于频繁"

       user_requests.append(now)
       # 执行操作
   ```

4. **敏感信息保护**
   - 使用环境变量存储密钥
   - 不要在日志中记录敏感信息
   - 对敏感数据进行加密

---

## 📚 实用示例项目

### 1. 数据库操作 Server

```python
import sqlite3
from typing import List, Dict

@mcp.tool()
async def execute_sql(query: str) -> str:
    """执行 SQL 查询"""
    conn = sqlite3.connect("database.db")
    try:
        cursor = conn.execute(query)
        if query.strip().upper().startswith("SELECT"):
            results = cursor.fetchall()
            columns = [description[0] for description in cursor.description]
            return format_results(results, columns)
        else:
            conn.commit()
            return f"成功执行 SQL，影响 {cursor.rowcount} 行"
    except Exception as e:
        return f"SQL 错误: {str(e)}"
    finally:
        conn.close()
```

### 2. Git 操作 Server

```python
import subprocess
from pathlib import Path

@mcp.tool()
async def git_status(repo_path: str) -> str:
    """获取 Git 仓库状态"""
    try:
        result = subprocess.run(
            ["git", "status", "--porcelain"],
            cwd=repo_path,
            capture_output=True,
            text=True,
            check=True
        )
        if not result.stdout:
            return "工作区干净，无变更"
        return f"变更文件：\n{result.stdout}"
    except subprocess.CalledProcessError as e:
        return f"Git 错误: {e.stderr}"

@mcp.tool()
async def git_commit(repo_path: str, message: str) -> str:
    """提交更改"""
    try:
        subprocess.run(
            ["git", "add", "."],
            cwd=repo_path,
            check=True
        )
        subprocess.run(
            ["git", "commit", "-m", message],
            cwd=repo_path,
            check=True
        )
        return "提交成功"
    except subprocess.CalledProcessError as e:
        return f"Git 错误: {e.stderr}"
```

---

## 🎯 下一步

1. **学习高级功能**：探索 Resources、Prompts 等高级特性
2. **贡献社区**：将你的 Server 发布到 GitHub 社区
3. **实际应用**：将 MCP Server 集成到实际工作流中
4. **性能优化**：学习如何优化 Server 的性能和响应速度

---

#MCP #开发教程 #Python #TypeScript #Server开发 #AI工具
