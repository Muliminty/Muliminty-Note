# MCP 配置与部署指南

> 本指南详细介绍如何在不同的 MCP Host 中配置和部署 MCP Server，包括配置文件、部署方案和故障排除。

---

## 🖥️ Claude Desktop 配置

### 配置文件位置

根据操作系统不同，配置文件位于：

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%/Claude/claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

### 配置文件结构

```json
{
  "mcp_servers": [
    {
      "name": "文件系统工具",
      "command": "claude-fs-mcp",
      "arguments": ["--root", "/Users/muliminty/Documents"],
      "env": {
        "CUSTOM_VAR": "value"
      }
    },
    {
      "name": "GitHub 集成",
      "command": "uv",
      "args": [
        "--directory",
        "/path/to/github-mcp",
        "run",
        "github_server.py"
      ],
      "env": {
        "GITHUB_TOKEN": "your_github_token_here"
      }
    }
  ]
}
```

### 配置选项说明

| 字段 | 类型 | 必需 | 说明 |
| :--- | :--- | :--- | :--- |
| `name` | string | 是 | 服务器名称，显示在 UI 中 |
| `command` | string | 是 | 启动服务器的命令 |
| `arguments` / `args` | array | 否 | 命令参数 |
| `env` | object | 否 | 环境变量 |
| `disabled` | boolean | 否 | 是否禁用该服务器 |

### 常见配置示例

#### 1. 文件系统服务器

```json
{
  "mcp_servers": [
    {
      "name": "本地文件系统",
      "command": "npx",
      "arguments": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/muliminty/Documents",
        "/Users/muliminty/Projects"
      ]
    }
  ]
}
```

#### 2. 数据库服务器

```json
{
  "mcp_servers": [
    {
      "name": "MySQL 数据库",
      "command": "uv",
      "args": [
        "--directory",
        "/path/to/mysql-mcp",
        "run",
        "mysql_server.py"
      ],
      "env": {
        "MYSQL_HOST": "localhost",
        "MYSQL_PORT": "3306",
        "MYSQL_USER": "root",
        "MYSQL_PASSWORD": "your_password",
        "MYSQL_DATABASE": "my_database"
      }
    }
  ]
}
```

#### 3. 搜索服务器

```json
{
  "mcp_servers": [
    {
      "name": "Brave 搜索",
      "command": "npx",
      "arguments": [
        "-y",
        "@modelcontextprotocol/server-brave-search"
      ],
      "env": {
        "BRAVE_API_KEY": "your_brave_api_key"
      }
    }
  ]
}
```

---

## 💻 Cursor IDE 配置

### 配置方式

Cursor IDE 支持通过 `.cursorrules` 文件或 Cursor Settings 配置 MCP。

#### 方式 1：通过 Cursor Settings

1. 打开 Cursor Settings（Cmd/Ctrl + ,）
2. 找到 "MCP Servers" 部分
3. 添加服务器配置

**配置示例**：
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/path/to/allowed/directory"
      ]
    },
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_TOKEN": "your_github_token"
      }
    }
  }
}
```

#### 方式 2：通过 .cursorrules

在项目根目录创建 `.cursorrules` 文件：

```json
{
  "mcpServers": [
    {
      "name": "project-tools",
      "command": "uv",
      "args": ["run", "server.py"],
      "cwd": "/path/to/mcp-server"
    }
  ]
}
```

---

## 📝 VSCode 配置

### 通过 VSCode 扩展

安装支持 MCP 的 VSCode 扩展（如 Cline）。

#### 使用 Cline 插件

Cline 是一个强大的 VSCode 扩展，支持 MCP。

1. 安装 Cline 扩展
2. 打开 Cline 设置
3. 配置 MCP Servers

**settings.json 配置示例**：
```json
{
  "cline.mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/path/to/project"
      ]
    },
    "git": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-git"
      ]
    }
  }
}
```

#### 使用 .vscode/mcp.json

在项目根目录创建 `.vscode/mcp.json` 文件：

```json
{
  "servers": {
    "database": {
      "type": "stdio",
      "command": "uv",
      "args": [
        "--directory",
        "/path/to/db-mcp",
        "run",
        "db_server.py"
      ],
      "env": {
        "DB_HOST": "localhost",
        "DB_USER": "admin"
      }
    }
  }
}
```

---

## 🌐 SSE 类型的 Server 配置

对于支持 SSE（Server-Sent Events）的 MCP Server，配置方式略有不同。

### 配置示例

```json
{
  "mcp_servers": [
    {
      "name": "remote-server",
      "type": "sse",
      "url": "https://api.example.com/mcp/sse",
      "headers": {
        "Authorization": "Bearer your_token"
      }
    }
  ]
}
```

### SSE Server 开发示例（Python）

```python
from quart import Quart, Response
import json
from mcp.server import Server

app = Quart(__name__)
server = Server("my-sse-server")

@app.route('/mcp/sse')
async def mcp_sse():
    async def event_stream():
        # 发送初始化事件
        yield f"event: init\ndata: {json.dumps(server.initialize())}\n\n"

        # 处理后续请求
        while True:
            # 这里应该有实际的事件处理逻辑
            await asyncio.sleep(1)

    return Response(
        event_stream(),
        mimetype='text/event-stream'
    )

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
```

---

## 🐳 Docker 部署

### 创建 Dockerfile

```dockerfile
# Python Server
FROM python:3.11-slim

WORKDIR /app

# 复制依赖文件
COPY pyproject.toml ./
RUN pip install --no-cache-dir -e .

# 复制源代码
COPY ./src ./src

# 设置入口点
ENTRYPOINT ["python", "-m", "your_server_package"]
```

```dockerfile
# TypeScript/Node.js Server
FROM node:20-alpine

WORKDIR /app

# 复制依赖文件
COPY package*.json ./
RUN npm ci --only=production

# 复制源代码
COPY ./dist ./dist

# 设置入口点
ENTRYPOINT ["node", "dist/index.js"]
```

### 构建和运行

```bash
# 构建镜像
docker build -t my-mcp-server .

# 运行容器
docker run -d \
  --name mcp-server \
  -e API_KEY=your_api_key \
  -v /host/path:/app/data \
  my-mcp-server

# 配置使用 Docker 中的 Server
# 在配置文件中使用 docker 命令
```

### Docker Compose 部署

```yaml
version: '3.8'

services:
  mcp-server:
    build: .
    container_name: my-mcp-server
    environment:
      - API_KEY=${API_KEY}
      - DATABASE_URL=${DATABASE_URL}
    volumes:
      - ./data:/app/data
    restart: unless-stopped

  # 可选：添加数据库等依赖
  postgres:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: example
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

**启动服务**：
```bash
docker-compose up -d
```

**配置 MCP 使用 Docker 服务**：
```json
{
  "mcp_servers": [
    {
      "name": "docker-server",
      "command": "docker",
      "arguments": [
        "exec",
        "-i",
        "my-mcp-server",
        "python",
        "-m",
        "your_server"
      ]
    }
  ]
}
```

---

## ☁️ 云端部署

### 使用 Railway

1. 将 MCP Server 代码推送到 GitHub
2. 在 Railway 中创建新项目
3. 选择自动部署
4. 设置环境变量
5. 获取部署 URL

**配置示例**：
```json
{
  "mcp_servers": [
    {
      "name": "cloud-server",
      "type": "sse",
      "url": "https://your-app.railway.app/mcp/sse"
    }
  ]
}
```

### 使用 Vercel

**项目结构**：
```
mcp-vercel/
├── api/
│   └── mcp/
│       └── route.ts  # Next.js API 路由
├── src/
│   └── server.ts     # MCP Server 逻辑
├── package.json
└── vercel.json
```

**route.ts**：
```typescript
import { NextRequest } from 'next/server';
import { server } from '../../src/server';

export async function GET(req: NextRequest) {
  // 实现 SSE 端点
  const stream = new ReadableStream({
    async start(controller) {
      // MCP 协议实现
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  });
}
```

**vercel.json**：
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/**/*.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/mcp",
      "dest": "/api/mcp/route.ts"
    }
  ]
}
```

---

## 🔧 故障排除

### 常见问题

#### 1. Server 无法启动

**症状**：启动后看不到工具

**排查步骤**：
1. 检查配置文件路径是否正确
2. 验证命令是否可执行
3. 查看日志输出

```bash
# 手动测试服务器命令
python your_server.py

# 检查环境变量
echo $YOUR_ENV_VAR
```

#### 2. 权限错误

**症状**：无法访问文件或资源

**解决方案**：
- 检查文件系统权限
- 使用绝对路径
- 配置 allowlist

```json
{
  "mcp_servers": [
    {
      "name": "filesystem",
      "command": "npx",
      "arguments": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/allowed/path1",
        "/allowed/path2"
      ]
    }
  ]
}
```

#### 3. 环境变量未生效

**症状**：API 密钥等配置无效

**解决方案**：
- 确保环境变量在 `env` 字段中正确配置
- 重启 Claude Desktop 使配置生效
- 验证环境变量名称是否正确

```bash
# 测试环境变量
# 在 Server 代码中添加日志
import os
print(f"API_KEY: {os.getenv('API_KEY')}")
```

#### 4. 性能问题

**症状**：响应缓慢

**优化方案**：
- 启用缓存
- 优化数据库查询
- 使用连接池
- 限制返回数据量

```python
from functools import lru_cache

@lru_cache(maxsize=128)
def cached_operation(param):
    # 缓存结果
    return expensive_operation(param)
```

### 调试技巧

#### 1. 启用详细日志

```bash
# 设置环境变量启用调试日志
export MCP_DEBUG=1

# 或在配置文件中设置
{
  "mcp_servers": [
    {
      "name": "debug-server",
      "command": "python",
      "arguments": [
        "-u",  # 无缓冲
        "server.py",
        "--debug"
      ]
    }
  ]
}
```

#### 2. 查看服务器输出

在 Server 代码中添加日志：

```python
import logging

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

@server.tool()
async def debug_tool(input: str) -> str:
    logger.debug(f"收到请求: {input}")
    result = process(input)
    logger.debug(f"返回结果: {result}")
    return result
```

#### 3. 使用 MCP Inspector

```bash
# 安装 MCP Inspector
pip install mcp-inspector

# 连接到服务器
mcp-inspector connect stdio python your_server.py

# 测试工具
tool list
tool call my_tool --arg1 value1
```

---

## 📊 监控和维护

### 健康检查

```python
from fastapi import FastAPI
import psutil

app = FastAPI()

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "cpu_usage": psutil.cpu_percent(),
        "memory_usage": psutil.virtual_memory().percent
    }
```

### 性能监控

```python
import time
from functools import wraps

def monitor_performance(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        start_time = time.time()
        result = await func(*args, **kwargs)
        duration = time.time() - start_time
        print(f"{func.__name__} 执行时间: {duration:.2f}s")
        return result
    return wrapper

@server.tool()
@monitor_performance
async def monitored_tool(input: str) -> str:
    return process(input)
```

---

## 🎯 最佳实践

1. **配置管理**
   - 使用环境变量管理敏感信息
   - 分为开发、测试、生产配置
   - 使用版本控制跟踪非敏感配置

2. **错误处理**
   - 实现优雅的错误处理
   - 提供有用的错误消息
   - 记录错误日志

3. **安全性**
   - 遵循最小权限原则
   - 验证和清理所有输入
   - 使用 HTTPS 和认证

4. **性能**
   - 实现缓存机制
   - 优化数据库查询
   - 使用异步 I/O

5. **可维护性**
   - 编写清晰的文档
   - 添加单元测试
   - 使用 CI/CD 自动化部署

---

#MCP #配置 #部署 #Docker #云部署 #故障排除
