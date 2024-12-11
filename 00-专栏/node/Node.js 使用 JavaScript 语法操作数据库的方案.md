# Node.js 使用 JavaScript 语法操作数据库的方案

在 Node.js 中，可以通过原生数据库驱动或使用 ORM（对象关系映射）来操作数据库。以下是关于如何在 Node.js 中使用 JavaScript 语法操作数据库的详细整理，包括两种主要方式：直接使用 SQL 和使用 ORM。

---

#### 1. 使用原生 SQL 语法

##### 1.1 MySQL / MariaDB

- **安装数据库驱动**：

  ```bash
  npm install mysql2
  ```

- **操作示例**：

  ```javascript
  const mysql = require('mysql2');

  // 创建数据库连接
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'my_database'
  });

  // 查询数据
  connection.query('SELECT * FROM users WHERE age > ?', [30], (err, results, fields) => {
    if (err) {
      console.error('查询错误:', err);
    } else {
      console.log('查询结果:', results);
    }
    connection.end();  // 关闭连接
  });
  ```

##### 1.2 PostgreSQL

- **安装数据库驱动**：

  ```bash
  npm install pg
  ```

- **操作示例**：

  ```javascript
  const { Client } = require('pg');

  // 创建数据库连接
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'my_database',
    password: 'password',
    port: 5432
  });

  // 查询数据
  client.connect()
    .then(() => client.query('SELECT * FROM users WHERE age > $1', [30]))
    .then((result) => {
      console.log('查询结果:', result.rows);
    })
    .catch((err) => {
      console.error('查询错误:', err);
    })
    .finally(() => {
      client.end();  // 关闭连接
    });
  ```

---

#### 2. 使用 ORM（对象关系映射）

ORM 可以简化数据库操作，通过 JavaScript 对象进行数据库的 CRUD 操作，而不需要编写 SQL 语句。

##### 2.1 Sequelize (适用于关系型数据库)

- **安装 Sequelize 和数据库驱动**：

  ```bash
  npm install sequelize mysql2
  ```

- **操作示例**：

  ```javascript
  const { Sequelize, DataTypes } = require('sequelize');

  // 创建 Sequelize 实例
  const sequelize = new Sequelize('mysql://root:password@localhost:3306/my_database');

  // 定义模型
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  // 插入数据
  async function createUser() {
    await sequelize.authenticate();  // 确保连接成功
    await User.sync();  // 创建表（如果不存在）

    const user = await User.create({
      name: 'John Doe',
      age: 30
    });

    console.log('用户创建成功:', user.toJSON());
  }

  // 查询数据
  async function getUsers() {
    const users = await User.findAll();  // 查找所有用户
    console.log('所有用户:', users.map(user => user.toJSON()));
  }

  // 更新数据
  async function updateUser() {
    const user = await User.findOne({ where: { name: 'John Doe' } });
    if (user) {
      user.age = 31;
      await user.save();  // 保存更新
      console.log('用户更新成功:', user.toJSON());
    }
  }

  // 删除数据
  async function deleteUser() {
    const user = await User.findOne({ where: { name: 'John Doe' } });
    if (user) {
      await user.destroy();  // 删除用户
      console.log('用户删除成功');
    }
  }

  // 调用示例
  createUser();
  getUsers();
  updateUser();
  deleteUser();
  ```

通过 Sequelize，你可以通过 JavaScript 对象来进行数据库操作，ORM 会自动生成 SQL 查询执行。

##### 2.2 Mongoose (适用于 MongoDB)

Mongoose 是 MongoDB 的官方 ORM，允许通过 JavaScript 对象进行 MongoDB 操作，而无需编写 MongoDB 查询语法。

- **安装 Mongoose**：

  ```bash
  npm install mongoose
  ```

- **操作示例**：

  ```javascript
  const mongoose = require('mongoose');

  // 连接到 MongoDB 数据库
  mongoose.connect('mongodb://localhost:27017/my_database', { useNewUrlParser: true, useUnifiedTopology: true });

  // 定义模型
  const userSchema = new mongoose.Schema({
    name: String,
    age: Number
  });

  const User = mongoose.model('User', userSchema);

  // 插入数据
  async function createUser() {
    const user = new User({
      name: 'Jane Doe',
      age: 28
    });

    await user.save();  // 保存到数据库
    console.log('用户创建成功:', user);
  }

  // 查询数据
  async function getUsers() {
    const users = await User.find();  // 查找所有用户
    console.log('所有用户:', users);
  }

  // 更新数据
  async function updateUser() {
    const user = await User.findOne({ name: 'Jane Doe' });
    if (user) {
      user.age = 29;
      await user.save();  // 保存更新
      console.log('用户更新成功:', user);
    }
  }

  // 删除数据
  async function deleteUser() {
    await User.deleteOne({ name: 'Jane Doe' });  // 删除用户
    console.log('用户删除成功');
  }

  // 调用示例
  createUser();
  getUsers();
  updateUser();
  deleteUser();
  ```

通过 Mongoose，你可以直接使用 JavaScript 对象进行 CRUD 操作，ORM 会自动处理查询构造。

##### 2.3 TypeORM (适用于关系型数据库)

TypeORM 是一个支持 TypeScript 和 JavaScript 的 ORM，支持多种关系型数据库，如 MySQL, PostgreSQL, SQLite 和 SQL Server。

- **安装 TypeORM 和数据库驱动**：

  ```bash
  npm install typeorm mysql2
  ```

- **操作示例**：

  ```javascript
  const { createConnection, Entity, PrimaryGeneratedColumn, Column } = require('typeorm');

  // 定义模型（实体）
  @Entity()
  class User {
    @PrimaryGeneratedColumn()
    id;

    @Column()
    name;

    @Column()
    age;
  }

  // 创建数据库连接并操作
  async function connectAndOperate() {
    const connection = await createConnection({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'my_database',
      entities: [User],
      synchronize: true,  // 自动同步数据库表结构
    });

    // 插入数据
    const userRepository = connection.getRepository(User);
    const user = new User();
    user.name = 'Alice';
    user.age = 25;
    await userRepository.save(user);

    // 查询数据
    const users = await userRepository.find();
    console.log('查询结果:', users);

    // 关闭连接
    await connection.close();
  }

  connectAndOperate();
  ```

通过 TypeORM，你可以通过 JavaScript 对象进行数据库操作，ORM 会自动生成 SQL 语句进行执行。

---

### 3. 总结

- **原生 SQL 语法**：使用数据库驱动（如 `mysql2`, `pg`）直接编写 SQL 查询来操作数据库。适合需要完全控制查询语句的场景。
- **ORM（对象关系映射）**：通过框架如 **Sequelize**, **Mongoose** 或 **TypeORM**，使用 JavaScript 对象进行数据库操作，避免手写 SQL。适合需要简化开发过程和提高代码可维护性的场景。

对于关系型数据库，推荐使用 **Sequelize** 或 **TypeORM**；对于 MongoDB，推荐使用 **Mongoose**。ORM 提供了更高层次的抽象，减少了数据库操作的复杂度，同时提升了开发效率。