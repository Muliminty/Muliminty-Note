# MCP 最佳实践与安全指南

> 本指南总结了 MCP 开发、部署和使用的最佳实践，重点关注安全性、性能优化和可维护性。

---

## 🔐 安全性最佳实践

### 1. 输入验证与清理

**原则**：永远不要信任用户输入，所有外部数据都应该被视为不可信。

```python
import re
from typing import Optional

# 正确：严格的输入验证
@server.tool()
async def query_database(query: str) -> str:
    # 验证 SQL 查询
    if not query or len(query) > 10000:
        return "错误：查询长度超出限制"

    # 只允许 SELECT 查询
    if not re.match(r'^\s*SELECT\s+', query, re.IGNORECASE):
        return "错误：只允许 SELECT 查询"

    # 检测危险的 SQL 关键字
    dangerous_keywords = ['DROP', 'DELETE', 'UPDATE', 'INSERT', 'ALTER', 'EXEC']
    for keyword in dangerous_keywords:
        if keyword in query.upper():
            return f"错误：不允许使用 {keyword}"

    # 执行查询（使用参数化查询）
    try:
        result = await execute_safe_query(query)
        return result
    except Exception as e:
        return f"查询错误: {str(e)}"

# 错误：直接执行用户输入
@server.tool()
async def unsafe_query(query: str) -> str:
    # 不要这样做！存在 SQL 注入风险
    return await execute_raw_query(query)
```

### 2. 权限最小化原则

**原则**：只授予必要的最小权限，避免过度授权。

```python
import os
from pathlib import Path

# 配置允许的路径
ALLOWED_PATHS = [
    "/safe/directory1",
    "/safe/directory2"
]

def is_path_allowed(path: str) -> bool:
    """检查路径是否在允许的范围内"""
    resolved_path = Path(path).resolve()

    for allowed in ALLOWED_PATHS:
        allowed_path = Path(allowed).resolve()
        try:
            resolved_path.relative_to(allowed_path)
            return True
        except ValueError:
            continue
    return False

@server.tool()
async def read_file(file_path: str) -> str:
    # 验证路径
    if not is_path_allowed(file_path):
        return "错误：路径不在允许的范围内"

    # 检查路径遍历攻击
    if ".." in file_path or file_path.startswith("/"):
        return "错误：无效的路径"

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        return f"读取文件失败: {str(e)}"
```

### 3. 环境变量管理

**原则**：敏感信息（API 密钥、密码等）必须存储在环境变量中，绝不能硬编码。

```python
import os
from typing import Optional

# 好的做法：从环境变量读取
class Config:
    def __init__(self):
        self.api_key = os.getenv("MY_API_KEY")
        self.db_password = os.getenv("DB_PASSWORD")
        self.encryption_key = os.getenv("ENCRYPTION_KEY")

        # 验证必需的环境变量
        if not self.api_key:
            raise ValueError("MY_API_KEY 环境变量未设置")

config = Config()

# 坏的做法：硬编码敏感信息
# API_KEY = "sk-1234567890abcdef"  # 永远不要这样做！
```

**配置文件示例**：
```json
{
  "mcp_servers": [
    {
      "name": "secure-service",
      "command": "python",
      "args": ["server.py"],
      "env": {
        "API_KEY": "${API_KEY}",  # 使用环境变量引用
        "DB_PASSWORD": "${DB_PASSWORD}"
      }
    }
  ]
}
```

### 4. 认证与授权

```python
from typing import Dict, Optional
import jwt

# 用户权限映射
USER_PERMISSIONS = {
    "user1": ["read", "write"],
    "admin": ["read", "write", "delete", "admin"]
}

def verify_token(token: str) -> Optional[Dict]:
    """验证 JWT token"""
    try:
        payload = jwt.decode(
            token,
            os.getenv("JWT_SECRET"),
            algorithms=["HS256"]
        )
        return payload
    except jwt.InvalidTokenError:
        return None

def check_permission(user: str, action: str) -> bool:
    """检查用户权限"""
    permissions = USER_PERMISSIONS.get(user, [])
    return action in permissions

@server.tool()
async def admin_operation(token: str, data: str) -> str:
    # 验证 token
    payload = verify_token(token)
    if not payload:
        return "错误：无效的认证令牌"

    user = payload.get("username")
    # 检查权限
    if not check_permission(user, "admin"):
        return f"错误：用户 {user} 没有执行此操作的权限"

    # 执行操作
    return "操作成功"
```

### 5. 敏感数据处理

```python
import re

def mask_sensitive_data(data: str, patterns: list) -> str:
    """掩码敏感数据"""
    masked = data
    for pattern, mask in patterns:
        masked = re.sub(pattern, mask, masked)
    return masked

@server.tool()
async def process_data(input_data: str) -> str:
    # 处理数据
    result = process(input_data)

    # 掩码敏感信息
    masked_result = mask_sensitive_data(
        result,
        [
            (r'\b\d{16}\b', '****-****-****-****'),  # 信用卡号
            (r'\b\d{3}-\d{2}-\d{4}\b', '***-**-****'),  # SSN
            (r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', '***@***.***'),  # 邮箱
            (r'["\']?password["\']?\s*[:=]\s*["\']?[^"\'\s]+["\']?', 'password=***'),  # 密码
        ]
    )

    # 记录日志时使用掩码后的数据
    logger.info(f"处理结果: {masked_result}")

    return result
```

---

## ⚡ 性能优化

### 1. 缓存策略

```python
from functools import lru_cache
from datetime import datetime, timedelta
import hashlib
import json

# 简单的内存缓存
class CacheManager:
    def __init__(self):
        self.cache = {}
        self.expirations = {}

    def get(self, key: str) -> Optional[any]:
        """获取缓存"""
        if key not in self.cache:
            return None

        # 检查是否过期
        if datetime.now() > self.expirations[key]:
            del self.cache[key]
            del self.expirations[key]
            return None

        return self.cache[key]

    def set(self, key: str, value: any, ttl_seconds: int = 300):
        """设置缓存"""
        self.cache[key] = value
        self.expirations[key] = datetime.now() + timedelta(seconds=ttl_seconds)

cache = CacheManager()

@server.tool()
async def cached_api_call(endpoint: str) -> str:
    cache_key = hashlib.md5(endpoint.encode()).hexdigest()

    # 尝试从缓存获取
    cached_result = cache.get(cache_key)
    if cached_result:
        return f"[缓存] {cached_result}"

    # 调用 API
    result = await fetch_from_api(endpoint)

    # 存入缓存（5分钟有效期）
    cache.set(cache_key, result, ttl_seconds=300)

    return result

# 使用 lru_cache（适用于参数较少的场景）
@lru_cache(maxsize=128)
def expensive_computation(param1: int, param2: str) -> str:
    """缓存计算结果"""
    # 耗时的计算...
    return result
```

### 2. 异步 I/O

```python
import asyncio
import aiohttp
from concurrent.futures import ThreadPoolExecutor

# 异步 HTTP 请求
async def fetch_multiple_urls(urls: list) -> list:
    """并发获取多个 URL"""
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_url(session, url) for url in urls]
        results = await asyncio.gather(*tasks)
        return results

async def fetch_url(session, url: str) -> str:
    async with session.get(url) as response:
        return await response.text()

@server.tool()
async def parallel_fetch(urls: list) -> str:
    """并发获取多个网页内容"""
    results = await fetch_multiple_urls(urls)
    return json.dumps(results, ensure_ascii=False)

# 使用线程池处理 CPU 密集型任务
executor = ThreadPoolExecutor(max_workers=4)

@server.tool()
async def cpu_intensive_task(data: str) -> str:
    """CPU 密集型任务（在线程池中执行）"""
    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(
        executor,
        process_heavy_computation,
        data
    )
    return result
```

### 3. 连接池管理

```python
import asyncpg
from contextlib import asynccontextmanager

class DatabasePool:
    def __init__(self, dsn: str):
        self.dsn = dsn
        self.pool = None

    async def init(self):
        """初始化连接池"""
        self.pool = await asyncpg.create_pool(
            self.dsn,
            min_size=2,
            max_size=10
        )

    async def close(self):
        """关闭连接池"""
        if self.pool:
            await self.pool.close()

    @asynccontextmanager
    async def acquire(self):
        """获取连接"""
        async with self.pool.acquire() as conn:
            yield conn

# 全局连接池
db_pool = DatabasePool(os.getenv("DATABASE_URL"))

# 在服务器启动时初始化
async def on_startup():
    await db_pool.init()

@server.tool()
async def query_database(sql: str) -> str:
    """执行数据库查询"""
    async with db_pool.acquire() as conn:
        rows = await conn.fetch(sql)
        return json.dumps([dict(row) for row in rows], ensure_ascii=False)
```

### 4. 批量操作优化

```python
@server.tool()
async def batch_operations(items: list) -> str:
    """批量处理操作"""
    # 好的做法：批量插入
    async with db_pool.acquire() as conn:
        await conn.executemany(
            "INSERT INTO items (name, value) VALUES ($1, $2)",
            [(item["name"], item["value"]) for item in items]
        )
        return f"成功插入 {len(items)} 条记录"

# 坏的做法：逐条插入
@server.tool()
async def inefficient_batch(items: list) -> str:
    # 不要这样做！效率低下
    for item in items:
        await insert_item(item)
    return "完成"
```

---

## 🧪 测试最佳实践

### 1. 单元测试

```python
import pytest
from your_server import add, subtract, multiply

class TestMathTools:
    """测试数学工具"""

    @pytest.mark.asyncio
    async def test_add_positive_numbers(self):
        """测试正数相加"""
        result = await add(2, 3)
        assert "5" in result

    @pytest.mark.asyncio
    async def test_add_negative_numbers(self):
        """测试负数相加"""
        result = await add(-2, -3)
        assert "-5" in result

    @pytest.mark.asyncio
    async def test_add_zero(self):
        """测试加零"""
        result = await add(5, 0)
        assert "5" in result

    @pytest.mark.asyncio
    async def test_invalid_input(self):
        """测试无效输入"""
        result = await add("abc", 3)  # 类型错误
        assert "错误" in result
```

### 2. 集成测试

```python
import pytest
from testcontainers.postgres import PostgresContainer

@pytest.fixture
async def postgres_container():
    """PostgreSQL 测试容器"""
    with PostgresContainer("postgres:16") as postgres:
        yield postgres

@pytest.mark.asyncio
async def test_database_integration(postgres_container):
    """测试数据库集成"""
    # 使用测试数据库
    connection = await asyncpg.connect(postgres_container.get_connection_url())

    # 创建测试表
    await connection.execute("""
        CREATE TABLE test_items (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL
        )
    """)

    # 插入测试数据
    await connection.execute(
        "INSERT INTO test_items (name) VALUES ($1)",
        "test"
    )

    # 验证数据
    result = await connection.fetchval(
        "SELECT name FROM test_items WHERE id = 1"
    )
    assert result == "test"

    await connection.close()
```

### 3. Mock 测试

```python
from unittest.mock import AsyncMock, patch
import aiohttp

@pytest.mark.asyncio
async def test_external_api_mock():
    """测试外部 API（使用 Mock）"""
    # Mock HTTP 响应
    mock_response = AsyncMock()
    mock_response.text.return_value = '{"data": "test"}'

    with patch.object(aiohttp.ClientSession, 'get', return_value=mock_response):
        result = await fetch_from_api("http://example.com/api")
        assert '{"data": "test"}' in result
```

---

## 📊 监控与日志

### 1. 结构化日志

```python
import logging
import json
from datetime import datetime

# 配置结构化日志
class StructuredFormatter(logging.Formatter):
    def format(self, record):
        log_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "function": record.funcName,
            "line": record.lineno
        }

        if hasattr(record, "extra"):
            log_data.update(record.extra)

        return json.dumps(log_data, ensure_ascii=False)

# 配置日志
logger = logging.getLogger(__name__)
handler = logging.StreamHandler()
handler.setFormatter(StructuredFormatter())
logger.addHandler(handler)
logger.setLevel(logging.INFO)

# 使用日志
@server.tool()
async def logged_operation(input: str) -> str:
    logger.info(
        "开始执行操作",
        extra={
            "operation": "process",
            "input_length": len(input),
            "user_id": "user123"
        }
    )

    try:
        result = process(input)
        logger.info("操作成功", extra={"result_length": len(result)})
        return result
    except Exception as e:
        logger.error("操作失败", extra={"error": str(e)})
        raise
```

### 2. 性能监控

```python
import time
from functools import wraps
from collections import defaultdict

# 性能指标收集器
class PerformanceMonitor:
    def __init__(self):
        self.metrics = defaultdict(list)

    def record(self, name: str, duration: float):
        """记录性能指标"""
        self.metrics[name].append(duration)

    def get_stats(self, name: str) -> dict:
        """获取统计信息"""
        durations = self.metrics[name]
        if not durations:
            return {}

        return {
            "count": len(durations),
            "min": min(durations),
            "max": max(durations),
            "avg": sum(durations) / len(durations)
        }

monitor = PerformanceMonitor()

def monitor_performance(func):
    """性能监控装饰器"""
    @wraps(func)
    async def wrapper(*args, **kwargs):
        start = time.time()
        try:
            result = await func(*args, **kwargs)
            duration = time.time() - start
            monitor.record(func.__name__, duration)
            return result
        except Exception as e:
            duration = time.time() - start
            monitor.record(f"{func.__name__}_error", duration)
            raise
    return wrapper

@server.tool()
@monitor_performance
async def monitored_tool(input: str) -> str:
    return process(input)

# 获取性能统计
@server.tool()
async def get_performance_stats() -> str:
    """获取性能统计"""
    return json.dumps(monitor.metrics, ensure_ascii=False, indent=2)
```

### 3. 健康检查

```python
from fastapi import FastAPI
import psutil
import asyncpg

app = FastAPI()

@app.get("/health")
async def health_check():
    """健康检查端点"""
    health_status = {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat()
    }

    # 检查数据库连接
    try:
        async with db_pool.acquire() as conn:
            await conn.fetchval("SELECT 1")
        health_status["database"] = "connected"
    except Exception as e:
        health_status["status"] = "unhealthy"
        health_status["database"] = f"disconnected: {str(e)}"

    # 检查系统资源
    health_status["cpu_usage"] = psutil.cpu_percent()
    health_status["memory_usage"] = psutil.virtual_memory().percent

    # 检查磁盘空间
    disk = psutil.disk_usage('/')
    health_status["disk_usage"] = {
        "used": disk.used,
        "free": disk.free,
        "percent": disk.percent
    }

    return health_status
```

---

## 🚀 错误处理最佳实践

### 1. 优雅的错误处理

```python
from typing import Union
import traceback

class MCPError(Exception):
    """自定义 MCP 错误"""
    def __init__(self, message: str, code: str = "ERROR"):
        self.message = message
        self.code = code
        super().__init__(message)

def handle_error(error: Exception) -> dict:
    """统一错误处理"""
    if isinstance(error, MCPError):
        return {
            "success": False,
            "code": error.code,
            "message": error.message
        }
    else:
        return {
            "success": False,
            "code": "INTERNAL_ERROR",
            "message": "内部服务器错误",
            "details": str(error)
        }

@server.tool()
async def robust_operation(input: str) -> str:
    """健壮的操作处理"""
    try:
        # 验证输入
        if not input or len(input) > 1000:
            raise MCPError("输入无效", "INVALID_INPUT")

        # 执行操作
        result = await process(input)

        return json.dumps({
            "success": True,
            "data": result
        }, ensure_ascii=False)

    except MCPError as e:
        logger.error(f"MCP 错误: {e.message}")
        return json.dumps(handle_error(e), ensure_ascii=False)

    except Exception as e:
        logger.error(f"未预期的错误: {str(e)}")
        logger.error(traceback.format_exc())
        return json.dumps(handle_error(e), ensure_ascii=False)
```

### 2. 重试机制

```python
import asyncio
from typing import Callable, TypeVar

T = TypeVar('T')

async def retry(
    func: Callable[..., T],
    max_retries: int = 3,
    delay: float = 1.0,
    backoff: float = 2.0,
    exceptions: tuple = (Exception,)
) -> T:
    """重试机制"""
    last_error = None
    current_delay = delay

    for attempt in range(max_retries):
        try:
            return await func()
        except exceptions as e:
            last_error = e
            if attempt < max_retries - 1:
                logger.warning(
                    f"重试 {attempt + 1}/{max_retries}: {str(e)}",
                    extra={"delay": current_delay}
                )
                await asyncio.sleep(current_delay)
                current_delay *= backoff
            else:
                logger.error(f"达到最大重试次数: {str(e)}")

    raise last_error

@server.tool()
async def operation_with_retry(url: str) -> str:
    """带重试机制的操作"""
    async def fetch():
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                response.raise_for_status()
                return await response.text()

    try:
        result = await retry(fetch, max_retries=3)
        return f"成功: {result}"
    except Exception as e:
        return f"失败: {str(e)}"
```

---

## 📚 文档和可维护性

### 1. 完整的 API 文档

```python
@server.tool()
async def complex_tool(
    param1: str,
    param2: int,
    optional_param: Optional[bool] = False
) -> str:
    """
    复杂工具的完整文档

    参数:
        param1: 第一个参数，必须是有效的字符串，长度在1-100之间
        param2: 第二个参数，必须是正整数
        optional_param: 可选参数，默认为 False

    返回:
        操作结果的 JSON 字符串

    示例:
        >>> complex_tool("test", 42)
        '{"success": true, "result": "..."}'

    错误:
        ValueError: 如果参数无效
        ConnectionError: 如果连接失败
    """
    # 实现逻辑
    pass
```

### 2. 配置管理

```python
from dataclasses import dataclass
from typing import Optional
import json

@dataclass
class ServerConfig:
    """服务器配置"""
    host: str = "0.0.0.0"
    port: int = 8080
    debug: bool = False
    max_connections: int = 100
    log_level: str = "INFO"

    @classmethod
    def from_dict(cls, data: dict) -> 'ServerConfig':
        """从字典创建配置"""
        return cls(**{k: v for k, v in data.items() if k in cls.__annotations__})

    @classmethod
    def from_file(cls, filepath: str) -> 'ServerConfig':
        """从文件加载配置"""
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return cls.from_dict(data)

# 使用配置
config = ServerConfig.from_file("config.json")

@server.tool()
async def configurable_operation() -> str:
    """使用配置的操作"""
    logger.info(f"调试模式: {config.debug}")
    # 实现逻辑
    pass
```

---

## 🎯 总结

### 安全检查清单

- [ ] 所有输入都经过验证和清理
- [ ] 敏感信息存储在环境变量中
- [ ] 实现了最小权限原则
- [ ] 使用认证和授权机制
- [ ] 实现了速率限制
- [ ] 日志中不记录敏感信息

### 性能检查清单

- [ ] 使用缓存减少重复计算
- [ ] 异步 I/O 操作并发执行
- [ ] 使用连接池管理数据库连接
- [ ] 批量操作而非逐条处理
- [ ] 监控性能指标

### 可维护性检查清单

- [ ] 编写完整的单元测试
- [ ] 实现结构化日志
- [ ] 编写清晰的 API 文档
- [ ] 使用配置文件管理设置
- [ ] 实现优雅的错误处理
- [ ] 监控系统健康状态

遵循这些最佳实践，可以构建出安全、高效、可维护的 MCP 服务器。

---

#MCP #最佳实践 #安全性 #性能优化 #测试 #监控
