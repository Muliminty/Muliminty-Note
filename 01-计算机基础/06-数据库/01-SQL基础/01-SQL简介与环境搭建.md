# SQL 简介与环境搭建

## 什么是数据库

**数据库 (Database)** 是按照数据结构来组织、存储和管理数据的仓库。

### 数据库类型

| 类型 | 特点 | 代表产品 |
|------|------|----------|
| **关系型数据库 (RDBMS)** | 表格形式存储，支持 SQL | MySQL、PostgreSQL、Oracle |
| **文档数据库** | JSON 文档存储 | MongoDB、CouchDB |
| **键值数据库** | Key-Value 存储 | Redis、DynamoDB |
| **列式数据库** | 按列存储，适合分析 | ClickHouse、Cassandra |
| **图数据库** | 图结构存储 | Neo4j、JanusGraph |

## 什么是 SQL

**SQL (Structured Query Language)** 是用于管理关系型数据库的标准语言。

### SQL 的分类

| 类别 | 全称 | 功能 | 关键字 |
|------|------|------|--------|
| **DDL** | Data Definition Language | 定义数据库结构 | CREATE、ALTER、DROP |
| **DML** | Data Manipulation Language | 操作数据 | INSERT、UPDATE、DELETE |
| **DQL** | Data Query Language | 查询数据 | SELECT |
| **DCL** | Data Control Language | 权限控制 | GRANT、REVOKE |
| **TCL** | Transaction Control Language | 事务控制 | COMMIT、ROLLBACK |

## 环境搭建

### 方式一：Docker 快速搭建（推荐）

#### MySQL

```bash
# 拉取镜像并运行
docker run --name mysql-dev \
  -e MYSQL_ROOT_PASSWORD=root123 \
  -e MYSQL_DATABASE=test_db \
  -p 3306:3306 \
  -d mysql:8.0

# 进入 MySQL 命令行
docker exec -it mysql-dev mysql -uroot -proot123
```

#### PostgreSQL

```bash
# 拉取镜像并运行
docker run --name postgres-dev \
  -e POSTGRES_PASSWORD=root123 \
  -e POSTGRES_DB=test_db \
  -p 5432:5432 \
  -d postgres:15

# 进入 psql 命令行
docker exec -it postgres-dev psql -U postgres -d test_db
```

### 方式二：本地安装

#### macOS

```bash
# 使用 Homebrew 安装 MySQL
brew install mysql
brew services start mysql

# 使用 Homebrew 安装 PostgreSQL
brew install postgresql@15
brew services start postgresql@15
```

#### Windows

1. 下载 MySQL Installer: https://dev.mysql.com/downloads/installer/
2. 运行安装程序，选择 Developer Default
3. 按提示完成安装

### 方式三：使用 SQLite（零配置）

SQLite 是一个轻量级的嵌入式数据库，无需安装服务器。

```bash
# macOS/Linux 已内置，直接使用
sqlite3 test.db

# Windows 下载: https://www.sqlite.org/download.html
```

## 图形化客户端工具

| 工具 | 支持数据库 | 特点 |
|------|-----------|------|
| **DBeaver** | 全部 | 开源免费，功能强大 |
| **Navicat** | 全部 | 商业软件，界面友好 |
| **DataGrip** | 全部 | JetBrains 出品，IDE 风格 |
| **TablePlus** | 全部 | macOS 原生，颜值高 |
| **MySQL Workbench** | MySQL | 官方工具，免费 |
| **pgAdmin** | PostgreSQL | 官方工具，免费 |

## 第一个 SQL 命令

连接数据库后，尝试以下命令：

```sql
-- 查看所有数据库
SHOW DATABASES;           -- MySQL
\l                        -- PostgreSQL

-- 创建数据库
CREATE DATABASE learn_sql;

-- 使用数据库
USE learn_sql;            -- MySQL
\c learn_sql              -- PostgreSQL

-- 查看当前数据库中的表
SHOW TABLES;              -- MySQL
\dt                       -- PostgreSQL
```

## 创建第一张表

```sql
-- 创建用户表
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,  -- MySQL
    -- id SERIAL PRIMARY KEY,           -- PostgreSQL
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    age INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入数据
INSERT INTO users (name, email, age) VALUES 
('张三', 'zhangsan@example.com', 25),
('李四', 'lisi@example.com', 30),
('王五', 'wangwu@example.com', 28);

-- 查询数据
SELECT * FROM users;
```

## SQL 书写规范

### 1. 关键字大写（推荐）

```sql
-- 推荐
SELECT name, email FROM users WHERE age > 25;

-- 不推荐（但也能执行）
select name, email from users where age > 25;
```

### 2. 使用缩进和换行

```sql
-- 推荐：复杂查询使用换行
SELECT 
    u.name,
    u.email,
    COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.age > 25
GROUP BY u.id
HAVING order_count > 5
ORDER BY order_count DESC;
```

### 3. 表名和列名使用小写加下划线

```sql
-- 推荐
CREATE TABLE user_orders (
    order_id INT,
    user_id INT,
    created_at TIMESTAMP
);

-- 不推荐
CREATE TABLE UserOrders (
    OrderId INT,
    UserId INT
);
```

## 总结

- **SQL** 是操作关系型数据库的标准语言
- 推荐使用 **Docker** 快速搭建数据库环境
- 使用图形化工具（如 DBeaver）可以提高效率
- 遵循 SQL 书写规范，提高代码可读性

---

**下一节**：[[02-数据查询基础]] — SELECT 语句详解

---

#sql #数据库 #入门
