# SQL 性能优化

数据库性能优化是保证应用高效运行的关键。

## 性能分析工具

### EXPLAIN 执行计划

```sql
-- 查看执行计划
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';

-- 详细格式
EXPLAIN FORMAT=JSON SELECT * FROM users WHERE email = 'test@example.com';

-- MySQL 8.0+ 实际执行分析
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
```

### EXPLAIN 字段解读

| 字段 | 说明 |
|------|------|
| id | 查询序号，id 相同执行顺序从上到下 |
| select_type | 查询类型（SIMPLE、PRIMARY、SUBQUERY 等）|
| table | 访问的表 |
| type | 访问类型（性能关键指标）|
| possible_keys | 可能使用的索引 |
| key | 实际使用的索引 |
| key_len | 索引使用的字节数 |
| ref | 与索引比较的列 |
| rows | 预估扫描行数 |
| filtered | 过滤百分比 |
| Extra | 额外信息 |

### type 访问类型（从好到差）

| 类型 | 说明 | 性能 |
|------|------|------|
| system | 表只有一行 | 最好 |
| const | 主键或唯一索引等值查询 | 极好 |
| eq_ref | JOIN 使用主键或唯一索引 | 很好 |
| ref | 非唯一索引等值查询 | 好 |
| range | 索引范围扫描 | 较好 |
| index | 全索引扫描 | 一般 |
| ALL | 全表扫描 | 最差 |

### Extra 常见值

| 值 | 说明 |
|------|------|
| Using index | 覆盖索引，无需回表 |
| Using where | 需要在服务器层过滤 |
| Using temporary | 使用临时表 |
| Using filesort | 需要额外排序 |
| Using index condition | 索引条件下推 |

### 慢查询日志

```sql
-- 查看慢查询设置
SHOW VARIABLES LIKE 'slow_query%';
SHOW VARIABLES LIKE 'long_query_time';

-- 开启慢查询日志
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;  -- 超过 1 秒记录
SET GLOBAL slow_query_log_file = '/var/log/mysql/slow.log';
```

## 索引优化

### 索引设计原则

```sql
-- 1. 选择性高的列优先建索引
-- 选择性 = 不同值数量 / 总行数
SELECT 
    COUNT(DISTINCT email) / COUNT(*) AS email_selectivity,
    COUNT(DISTINCT gender) / COUNT(*) AS gender_selectivity
FROM users;
-- email 选择性高，适合建索引
-- gender 选择性低，不适合单独建索引

-- 2. 频繁查询条件的列
CREATE INDEX idx_status ON orders(status);

-- 3. JOIN 关联的列
CREATE INDEX idx_user_id ON orders(user_id);

-- 4. ORDER BY、GROUP BY 的列
CREATE INDEX idx_created_at ON orders(created_at);
```

### 复合索引设计

```sql
-- 遵循最左前缀原则
CREATE INDEX idx_dept_salary_age ON employees(department_id, salary, age);

-- ✅ 可以使用索引
SELECT * FROM employees WHERE department_id = 1;
SELECT * FROM employees WHERE department_id = 1 AND salary > 10000;
SELECT * FROM employees WHERE department_id = 1 AND salary > 10000 AND age > 25;

-- ❌ 无法使用索引（跳过了 department_id）
SELECT * FROM employees WHERE salary > 10000;
SELECT * FROM employees WHERE age > 25;
```

### 覆盖索引

```sql
-- 创建覆盖索引
CREATE INDEX idx_name_email ON users(name, email);

-- 查询只需要索引中的列，无需回表
SELECT name, email FROM users WHERE name = '张三';
-- EXPLAIN 显示 Using index
```

### 索引失效场景

```sql
-- 1. 对索引列使用函数
SELECT * FROM users WHERE YEAR(created_at) = 2024;  -- ❌
SELECT * FROM users WHERE created_at >= '2024-01-01' 
                      AND created_at < '2025-01-01';  -- ✅

-- 2. 隐式类型转换
SELECT * FROM users WHERE phone = 13800138000;  -- ❌ phone 是 VARCHAR
SELECT * FROM users WHERE phone = '13800138000';  -- ✅

-- 3. LIKE 以 % 开头
SELECT * FROM users WHERE name LIKE '%张';  -- ❌
SELECT * FROM users WHERE name LIKE '张%';  -- ✅

-- 4. OR 连接非索引列
SELECT * FROM users WHERE name = '张三' OR age = 25;  -- 可能失效
SELECT * FROM users WHERE name = '张三'
UNION
SELECT * FROM users WHERE age = 25;  -- 改用 UNION

-- 5. 使用 != 或 NOT IN
SELECT * FROM users WHERE status != 'deleted';  -- 可能失效

-- 6. 范围条件后的列无法使用索引
-- 索引 (a, b, c)
SELECT * FROM t WHERE a = 1 AND b > 10 AND c = 5;
-- 只能使用 a 和 b，c 无法使用
```

## 查询优化

### SELECT 优化

```sql
-- 1. 只查询需要的列
SELECT id, name, email FROM users;  -- ✅
SELECT * FROM users;  -- ❌

-- 2. 避免 SELECT DISTINCT（如果不必要）
SELECT DISTINCT department_id FROM employees;
-- 考虑是否可以用 GROUP BY 或者其他方式

-- 3. 使用 LIMIT 限制结果
SELECT * FROM logs ORDER BY created_at DESC LIMIT 100;
```

### JOIN 优化

```sql
-- 1. 小表驱动大表
SELECT * FROM small_table s
JOIN large_table l ON s.id = l.small_id;

-- 2. 确保 JOIN 列有索引
CREATE INDEX idx_user_id ON orders(user_id);

-- 3. 避免过多 JOIN（一般不超过 3-4 个）

-- 4. 使用 STRAIGHT_JOIN 强制表顺序（谨慎使用）
SELECT STRAIGHT_JOIN * FROM t1 JOIN t2 ON t1.id = t2.t1_id;
```

### WHERE 优化

```sql
-- 1. 避免在 WHERE 中对索引列计算
SELECT * FROM orders WHERE YEAR(order_date) = 2024;  -- ❌
SELECT * FROM orders 
WHERE order_date >= '2024-01-01' AND order_date < '2025-01-01';  -- ✅

-- 2. 使用 IN 替代多个 OR
SELECT * FROM users WHERE status IN ('active', 'pending');  -- ✅
SELECT * FROM users WHERE status = 'active' OR status = 'pending';  -- ❌

-- 3. 使用 EXISTS 替代 IN（大子查询时）
SELECT * FROM users u
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);  -- ✅

SELECT * FROM users WHERE id IN (SELECT user_id FROM orders);  -- 大数据量时较慢
```

### ORDER BY 优化

```sql
-- 1. 利用索引排序
CREATE INDEX idx_created ON orders(created_at);
SELECT * FROM orders ORDER BY created_at DESC LIMIT 20;

-- 2. 避免 filesort
-- 查看是否有 Using filesort
EXPLAIN SELECT * FROM users ORDER BY name;

-- 3. 复合索引覆盖排序
CREATE INDEX idx_status_created ON orders(status, created_at);
SELECT * FROM orders 
WHERE status = 'completed' 
ORDER BY created_at DESC;  -- 可以使用索引排序
```

### GROUP BY 优化

```sql
-- 1. 利用索引分组
CREATE INDEX idx_department ON employees(department_id);
SELECT department_id, COUNT(*) FROM employees GROUP BY department_id;

-- 2. 避免在 GROUP BY 后排序
SELECT department_id, COUNT(*) FROM employees 
GROUP BY department_id
ORDER BY NULL;  -- 如果不需要排序
```

### 分页优化

```sql
-- 传统分页（偏移量大时性能差）
SELECT * FROM orders ORDER BY id LIMIT 10 OFFSET 100000;  -- ❌ 需要扫描 100010 行

-- 优化1：使用游标分页
SELECT * FROM orders WHERE id > 100000 ORDER BY id LIMIT 10;  -- ✅

-- 优化2：延迟关联
SELECT o.* FROM orders o
JOIN (SELECT id FROM orders ORDER BY id LIMIT 10 OFFSET 100000) t
ON o.id = t.id;

-- 优化3：记住上一页最后一条
SELECT * FROM orders 
WHERE id > {last_id}  -- 上一页最后一条的 ID
ORDER BY id 
LIMIT 10;
```

## 表结构优化

### 数据类型选择

```sql
-- 1. 使用合适的类型
-- ❌ 使用 VARCHAR(255) 存储固定长度数据
-- ✅ 使用 CHAR(2) 存储省份代码
status CHAR(1),  -- 比 VARCHAR(10) 更高效

-- 2. 数值类型优于字符串
-- ❌ user_id VARCHAR(20)
-- ✅ user_id BIGINT

-- 3. 使用 DECIMAL 存储金额
price DECIMAL(10, 2),  -- 不要用 FLOAT

-- 4. 时间戳使用 TIMESTAMP
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

-- 5. IP 地址使用 INT
ip_address INT UNSIGNED,  -- 使用 INET_ATON() 和 INET_NTOA() 转换
```

### 表设计优化

```sql
-- 1. 适当冗余，避免 JOIN
-- 订单表可以冗余用户名，避免每次 JOIN users 表
CREATE TABLE orders (
    id BIGINT PRIMARY KEY,
    user_id BIGINT,
    user_name VARCHAR(50),  -- 冗余字段
    ...
);

-- 2. 拆分大表
-- 垂直拆分：将不常用列分到另一个表
-- 水平拆分：按时间或 ID 范围分表

-- 3. 使用分区表
CREATE TABLE orders (
    id BIGINT,
    order_date DATE,
    ...
) PARTITION BY RANGE (YEAR(order_date)) (
    PARTITION p2023 VALUES LESS THAN (2024),
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);
```

## 配置优化

### 关键配置参数

```sql
-- 查看配置
SHOW VARIABLES LIKE 'innodb_buffer_pool_size';
SHOW VARIABLES LIKE 'query_cache%';

-- InnoDB 缓冲池（建议设为物理内存的 70-80%）
innodb_buffer_pool_size = 8G

-- 连接数
max_connections = 500

-- 排序缓冲
sort_buffer_size = 4M

-- JOIN 缓冲
join_buffer_size = 4M

-- 临时表大小
tmp_table_size = 64M
max_heap_table_size = 64M
```

## 优化检查清单

### 查询层面

- [ ] 是否只查询需要的列
- [ ] WHERE 条件是否使用了索引
- [ ] 是否避免了 SELECT *
- [ ] JOIN 是否必要，是否有索引
- [ ] 是否避免了 N+1 查询
- [ ] 分页是否优化

### 索引层面

- [ ] 是否有冗余索引
- [ ] 复合索引列顺序是否合理
- [ ] 是否有未使用的索引
- [ ] 高频查询是否有覆盖索引

### 表设计层面

- [ ] 数据类型是否合适
- [ ] 是否需要分表/分区
- [ ] 是否需要适当冗余

## 总结

| 优化方向 | 方法 |
|----------|------|
| 索引优化 | 合理设计索引，避免索引失效 |
| 查询优化 | 减少数据扫描，利用索引 |
| 表优化 | 合适的数据类型，适当冗余 |
| 配置优化 | 调整数据库参数 |
| 架构优化 | 读写分离、分库分表、缓存 |

### 性能优化原则

1. **先测量后优化**：使用 EXPLAIN 分析
2. **优化影响最大的查询**：关注慢查询日志
3. **权衡读写性能**：索引提高读性能，但降低写性能
4. **持续监控**：建立性能基线，定期检查

---

**上一节**：[[09-视图与存储过程]]

---

#sql #性能优化 #索引优化 #查询优化
