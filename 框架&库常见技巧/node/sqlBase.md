## 技术分享：基于 SQL 语句的通用 ORM 基类设计

### 背景介绍

在项目开发中，频繁操作数据库是一个常见的任务。为了避免每次操作数据库都重复编写 SQL 语句和参数处理逻辑，通常会封装一个基础类，用以构建通用的数据库操作逻辑。这篇技术分享文档将介绍一个通用的 SQL 基类 `SQLBase`，它封装了对数据库进行增删改查的常见操作，并支持动态构建带有过滤条件和分页功能的 SQL 查询。

---

### 核心功能介绍

`SQLBase` 类主要有以下几个核心功能：

1. **插入记录**：生成插入数据的 SQL 语句，并处理数据验证、空值及默认值等逻辑。
2. **带过滤和分页的查询**：根据提供的过滤条件和分页参数，动态构建 SQL 查询。
3. **查询所有记录**：构建简单的查询语句以获取表中的所有记录。
4. **更新记录**：根据记录的 ID 及传入的数据生成更新 SQL 语句。
5. **删除记录**：根据记录的 ID 构建删除 SQL 语句。
6. **读取指定 ID 的记录**：读取指定 ID 的单条记录。

---

### 1. 类的初始化

```javascript
class SQLBase {
  constructor(tableName, tableStructure) {
    this.tableName = tableName;           // 表名
    this.tableStructure = tableStructure; // 表结构，定义每一列的名称和类型
  }
}
```

该类初始化时，接收表名和表结构作为参数。表结构是一个包含列名和列类型的数组，用于帮助生成动态 SQL 语句。

---

### 2. 插入记录

```javascript
create(data) {
  // 验证数据和表结构有效性
  if (typeof data !== 'object' || !Array.isArray(this.tableStructure)) {
    throw new Error('输入数据或表结构无效。');
  }

  const columns = [];
  const values = [];

  // 遍历表结构，构建 SQL 语句
  this.tableStructure.forEach(({ name, type }) => {
    if (type.includes('INTEGER PRIMARY KEY AUTOINCREMENT')) return; // 忽略自增主键

    if (data.hasOwnProperty(name)) {
      columns.push(name);
      values.push(data[name]);
    } else if (!type.includes('DEFAULT')) {
      columns.push(name);
      values.push(null); // 如果没有值且无默认值，则使用 null
    }
  });

  const sql = `INSERT INTO ${this.tableName} (${columns.join(', ')}) VALUES (${values.map(() => '?').join(', ')})`;
  return { sql, values };
}
```

**功能描述**：
- 动态生成 `INSERT INTO` SQL 语句。
- 自动跳过自增主键列，并处理缺少值时的 `null` 值填充。
- 返回构建好的 SQL 语句及其对应的参数值数组。

---

### 3. 带过滤和分页的查询

```javascript
buildFilteredPaginationQuery(filters, page, pageSize) {
  const p = Number(page) || 1;
  const ps = Number(pageSize) || 10;
  const conditions = [];
  const values = [];

  for (const key in filters) {
    if (filters[key] !== '' && this.tableStructure.find(column => column.name === key)) {
      conditions.push(`${key} = ?`);
      values.push(filters[key]);
    }
  }

  const offset = (p - 1) * ps;
  let sql = `SELECT * FROM ${this.tableName}`;
  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(' AND ')}`;
  }
  sql += ` LIMIT ?, ?`;
  values.push(offset, ps);

  return { sql, values };
}
```

**功能描述**：
- 支持多条件过滤，自动构建 `WHERE` 子句。
- 实现分页功能，自动计算 `LIMIT` 和 `OFFSET` 参数。
- 返回包含 SQL 查询语句及其对应的参数数组。

---

### 4. 查询所有记录

```javascript
selectAllRecords() {
  const sql = `SELECT * FROM ${this.tableName}`;
  return { sql, values: [] };
}
```

**功能描述**：
- 构建查询所有记录的 SQL 语句。
- 简单直接的查询逻辑，返回 SQL 语句及空参数数组。

---

### 5. 更新记录

```javascript
updateRecord(id, data) {
  const updates = [];
  for (const column of this.tableStructure) {
    if (data.hasOwnProperty(column.name)) {
      updates.push(`${column.name} = ?`);
    }
  }

  const sql = `UPDATE ${this.tableName} SET ${updates.join(', ')} WHERE id = ?`;
  const values = updates.map(update => data[update.split(' ')[0]]);
  values.push(id);

  return { sql, values };
}
```

**功能描述**：
- 根据传入的 `data` 动态生成更新 SQL 语句。
- 更新时仅修改传入的数据列，自动构建 `SET` 子句。
- 返回生成的 SQL 语句及对应的参数值数组。

---

### 6. 删除记录

```javascript
deleteRecord(id) {
  const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
  return { sql, values: [id] };
}
```

**功能描述**：
- 构建删除指定 ID 记录的 SQL 语句。
- 返回删除 SQL 语句及其对应的参数值数组。

---

### 7. 读取指定 ID 的记录

```javascript
readRecord(id) {
  const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
  return { sql, values: [id] };
}
```

**功能描述**：
- 构建查询指定 ID 记录的 SQL 语句。
- 返回查询 SQL 语句及其对应的参数值数组。

---

### 完整代码

```js
class SQLBase {

  constructor(tableName, tableStructure) {
    this.tableName = tableName;
    this.tableStructure = tableStructure;
  }

  /**
   * 新增数据SQL语句构建。
   * @param {object} data 要插入的数据对象，键为列名，值为要插入的值。
   * @returns {object} 包含 SQL 查询和对应值的对象。
   * @throws {Error} 如果输入数据或表结构无效，则抛出错误。
   */
  create(data) {
    // 验证输入数据和表结构的有效性
    if (typeof data !== 'object' || !Array.isArray(this.tableStructure)) {
      throw new Error('输入数据或表结构无效。');
    }

    const columns = [];
    const values = [];

    // 遍历表结构并构建 columns 和 values 数组
    this.tableStructure.forEach(({ name, type }) => {
      // 跳过自增的 ID 列
      if (type.includes('INTEGER PRIMARY KEY AUTOINCREMENT')) {
        return;
      }

      // 检查数据中是否包含该列的值
      if (data.hasOwnProperty(name)) {
        columns.push(name);
        values.push(data[name]);
      } else {
        // 如果数据中不包含该列的值，但是该列有默认值，直接跳过
        if (type.includes('DEFAULT')) {
          return;
        }

        // 当缺少值时添加 null 到 values 数组
        columns.push(name);
        values.push(null);
      }
    });

    // 使用模板字符串简化 SQL 构建，省略自增的 ID 列和包含默认值的列
    const sql = `INSERT INTO ${this.tableName} (${columns.join(', ')}) VALUES (${values.map(() => '?').join(', ')})`;

    return { sql, values };
  }



  /**
   * 构建带有过滤和分页功能的查询。
   * @param {object} filters - 包含过滤条件的对象。
   * @param {number} page - 要返回的页码。
   * @param {number} pageSize - 每页的大小。
   * @returns {object} - 返回一个包含 SQL 查询字符串和参数值数组的对象。
   */
  buildFilteredPaginationQuery(filters, page, pageSize) {
    // 将页码和每页大小转换为数字，如果未提供，则默认为1和10
    const p = Number(page) || 1;
    const ps = Number(pageSize) || 10;
    const conditions = []; // 存储条件语句的数组
    const values = []; // 存储参数值的数组

    // 遍历过滤器对象的键值对
    for (const key in filters) {
      // 检查过滤器的值是否为空字符串且表结构中存在该字段
      if (filters[key] !== '' && this.tableStructure.find(column => column.name === key)) {
        conditions.push(`${key} = ?`); // 添加等值查询条件
        values.push(filters[key]); // 将过滤器的值添加到参数值数组中
      }
    }

    // 计算偏移量
    const offset = (p - 1) * ps;

    let sql = `SELECT * FROM ${this.tableName}`; // 初始 SQL 查询语句

    // 如果存在过滤条件，则在查询语句中添加 WHERE 子句
    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    sql += ` LIMIT ?, ?`; // 添加分页限制
    values.push(offset, ps); // 将偏移量和每页大小添加到参数值数组中

    // 返回构建的 SQL 查询语句和参数值数组
    return { sql, values };
  }



  /**
   * 构建查询所有记录的 SQL 查询语句。
   * @returns {Object} - 包含构建的 SQL 查询语句和空参数值数组的对象。
   */
  selectAllRecords() {
    const sql = `SELECT * FROM ${this.tableName}`;
    return { sql, values: [] };
  }


  /**
   * 构建更新数据SQL语句。
   * @param {number} id - 要更新的记录的 ID。
   * @param {object} data - 包含要更新的列及其对应新值的对象。
   * @returns {object} - 返回一个包含 SQL 查询字符串和参数值数组的对象。
   */
  updateRecord(id, data) {
    // 输出日志，以便调试

    // 用于存储更新的列和对应的值的数组
    const updates = [];

    // 遍历表结构中的每一列
    for (const column of this.tableStructure) {
      // 如果传入的数据中包含当前列名，则将该列添加到更新列表中
      if (data.hasOwnProperty(column.name)) {
        updates.push(`${column.name} = ?`);
      }
    }

    // 构建 SQL 更新语句
    const sql = `UPDATE ${this.tableName} SET ${updates.join(', ')} WHERE id = ?`;

    // 仅将传递的值添加到参数值数组
    const values = updates.map(update => data[update.split(' ')[0]]);

    // 将记录 ID 添加到参数值数组的末尾
    values.push(id);

    // 返回包含 SQL 查询字符串和参数值数组的对象
    return { sql, values };
  }



  /**
   * 删除记录。
   * @param {number} id - 要删除的记录的 ID。
   * @returns {object} - 返回一个包含 SQL 查询字符串和参数值数组的对象，用于执行删除操作。
   */
  deleteRecord(id) {
    // 构建 SQL 删除语句
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;

    // 返回包含 SQL 查询字符串和记录 ID 的参数值数组的对象
    return { sql, values: [id] };
  }

  /**
   * 从数据库中读取指定 ID 的记录。
   * @param {number} id 要读取的记录的 ID。
   * @returns {object} 包含 SQL 查询和对应值的对象。
   */
  readRecord(id) {
    // 构建 SQL 查询，仅选择指定 ID 的记录
    const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    return { sql, values: [id] };
  }
}

module.exports = {
  SQLBase
};


```

### 总结

通过 `SQLBase` 类，我们实现了一个基于 SQL 语句的通用 ORM 基类，能够有效简化数据库的增删改查操作。该类具有以下优点：
1. **灵活性**：支持动态生成 SQL 语句，适应不同的表结构和数据内容。
2. **通用性**：通过构造函数传入表名和表结构，适用于任何数据库表。
3. **易用性**：提供了常用的 CRUD 操作接口，开发者只需调用方法，即可生成 SQL 语句并执行。

这类基类在实际项目开发中能够显著提高代码复用性和可维护性，适用于各种复杂的数据库操作场景。