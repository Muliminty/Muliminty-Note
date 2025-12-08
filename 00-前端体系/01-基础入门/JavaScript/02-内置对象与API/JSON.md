# JSON 对象（JSON Object）

> JavaScript JSON 对象：数据转换的"翻译官"，就像把中文翻译成英文，再把英文翻译回中文，让不同系统之间能够"对话"。

---

## 1. 一句话概括主题

JSON 是 JavaScript 的内置对象，用于在 JavaScript 对象和 JSON 字符串之间进行转换，是前后端数据交换的标准格式。

---

## 2. 它是什么

想象一下，JSON 就像数据转换的"翻译官"：
- **对象转字符串** → `JSON.stringify()` 把 JavaScript 对象变成字符串
- **字符串转对象** → `JSON.parse()` 把字符串变回 JavaScript 对象
- **数据交换** → 前端发送数据给后端，后端返回数据给前端，都用 JSON 格式

**举例**：
```javascript
// 就像把中文翻译成英文，再翻译回来
const person = { name: "张三", age: 25 };  // JavaScript 对象
const jsonStr = JSON.stringify(person);    // '{"name":"张三","age":25}' - 变成字符串
const person2 = JSON.parse(jsonStr);       // { name: "张三", age: 25 } - 变回对象
```

---

## 3. 能解决什么问题 + 为什么重要

### 解决的问题

1. **数据序列化**：将 JavaScript 对象转换为字符串，方便存储和传输
2. **数据反序列化**：将字符串转换回 JavaScript 对象，恢复数据结构
3. **前后端通信**：API 请求和响应都使用 JSON 格式
4. **数据存储**：将数据以 JSON 格式存储到 localStorage、数据库等
5. **配置文件**：很多配置文件使用 JSON 格式（如 package.json）

### 为什么重要

- **Web 开发标准**：JSON 是前后端数据交换的事实标准
- **日常开发必备**：几乎每个 Web 应用都会用到 JSON
- **简单易用**：JSON 语法简单，易于理解和操作
- **广泛支持**：所有现代编程语言都支持 JSON

---

## 4. 核心知识点拆解

### 4.1 JSON 格式规则

#### JSON 数据类型

JSON 支持以下数据类型：

```javascript
// 1. 字符串（必须用双引号）
"hello"  // ✅ 正确
'hello'  // ❌ 错误（JSON 不支持单引号）

// 2. 数字
123
3.14
-10

// 3. 布尔值
true
false

// 4. null
null

// 5. 对象
{
  "name": "张三",
  "age": 25
}

// 6. 数组
[1, 2, 3, "hello", true]

// 7. 嵌套结构
{
  "users": [
    { "name": "张三", "age": 25 },
    { "name": "李四", "age": 30 }
  ]
}
```

#### JSON 语法限制

```javascript
// ❌ 不支持的内容
{
  "date": new Date(),           // 函数、Date 对象等会被忽略或转换
  "func": function() {},        // 函数会被忽略
  "undefined": undefined,       // undefined 会被忽略
  "symbol": Symbol("test"),     // Symbol 会被忽略
  "comment": "value" // 注释    // JSON 不支持注释
}

// ✅ 正确的 JSON
{
  "name": "张三",
  "age": 25,
  "isActive": true,
  "tags": ["前端", "JavaScript"]
}
```

### 4.2 JSON.stringify() - 对象转字符串

#### 基本用法

```javascript
// 简单对象
const obj = { name: "张三", age: 25 };
JSON.stringify(obj);  // '{"name":"张三","age":25}'

// 数组
const arr = [1, 2, 3];
JSON.stringify(arr);  // '[1,2,3]'

// 嵌套对象
const nested = {
  user: { name: "张三", age: 25 },
  tags: ["前端", "JavaScript"]
};
JSON.stringify(nested);
// '{"user":{"name":"张三","age":25},"tags":["前端","JavaScript"]}'
```

#### 第二个参数：replacer（替换器）

**数组形式**：只序列化指定的属性

```javascript
const obj = { name: "张三", age: 25, city: "北京" };
JSON.stringify(obj, ["name", "age"]);  // '{"name":"张三","age":25}'（只包含 name 和 age）
```

**函数形式**：自定义序列化逻辑

```javascript
const obj = { name: "张三", age: 25, password: "123456" };

// 过滤掉 password 字段
JSON.stringify(obj, (key, value) => {
  if (key === "password") {
    return undefined;  // 返回 undefined 会忽略该属性
  }
  return value;
});
// '{"name":"张三","age":25}'
```

#### 第三个参数：space（格式化）

```javascript
const obj = { name: "张三", age: 25, city: "北京" };

// 不格式化（默认）
JSON.stringify(obj);
// '{"name":"张三","age":25,"city":"北京"}'

// 格式化（缩进 2 个空格）
JSON.stringify(obj, null, 2);
// {
//   "name": "张三",
//   "age": 25,
//   "city": "北京"
// }

// 格式化（缩进 4 个空格）
JSON.stringify(obj, null, 4);
// {
//     "name": "张三",
//     "age": 25,
//     "city": "北京"
// }

// 使用字符串作为缩进
JSON.stringify(obj, null, "---");
// {
// ---"name": "张三",
// ---"age": 25,
// ---"city": "北京"
// }
```

#### toJSON() 方法

对象可以定义 `toJSON()` 方法来自定义序列化行为：

```javascript
const obj = {
  name: "张三",
  age: 25,
  date: new Date(),
  toJSON() {
    return {
      name: this.name,
      age: this.age,
      date: this.date.toISOString()  // 自定义日期格式
    };
  }
};

JSON.stringify(obj);
// '{"name":"张三","age":25,"date":"2024-12-04T12:00:00.000Z"}'
```

### 4.3 JSON.parse() - 字符串转对象

#### 基本用法

```javascript
// 解析简单对象
const jsonStr = '{"name":"张三","age":25}';
const obj = JSON.parse(jsonStr);
console.log(obj);  // { name: "张三", age: 25 }

// 解析数组
const arrStr = '[1,2,3,"hello"]';
const arr = JSON.parse(arrStr);
console.log(arr);  // [1, 2, 3, "hello"]

// 解析嵌套结构
const nestedStr = '{"user":{"name":"张三","age":25}}';
const nested = JSON.parse(nestedStr);
console.log(nested.user.name);  // "张三"
```

#### 第二个参数：reviver（恢复器）

用于在解析过程中转换值：

```javascript
const jsonStr = '{"name":"张三","age":25,"date":"2024-12-04T12:00:00.000Z"}';

// 将 date 字符串转换为 Date 对象
const obj = JSON.parse(jsonStr, (key, value) => {
  if (key === "date") {
    return new Date(value);  // 转换为 Date 对象
  }
  return value;
});

console.log(obj.date instanceof Date);  // true
```

### 4.4 常见数据类型处理

#### Date 对象

```javascript
// Date 对象会被转换为 ISO 字符串
const obj = { date: new Date() };
JSON.stringify(obj);  // '{"date":"2024-12-04T12:00:00.000Z"}'

// 解析时需要手动转换回 Date
const jsonStr = '{"date":"2024-12-04T12:00:00.000Z"}';
const obj = JSON.parse(jsonStr, (key, value) => {
  if (key === "date") {
    return new Date(value);
  }
  return value;
});
```

#### undefined、函数、Symbol

```javascript
const obj = {
  name: "张三",
  age: undefined,        // 会被忽略
  func: function() {},  // 会被忽略
  symbol: Symbol("test") // 会被忽略
};

JSON.stringify(obj);  // '{"name":"张三"}'
```

#### null

```javascript
const obj = { name: "张三", value: null };
JSON.stringify(obj);  // '{"name":"张三","value":null}'（null 会被保留）
```

#### 循环引用

```javascript
// ❌ 循环引用会导致错误
const obj = { name: "张三" };
obj.self = obj;  // 循环引用
JSON.stringify(obj);  // TypeError: Converting circular structure to JSON

// ✅ 解决方案：使用 replacer 过滤
JSON.stringify(obj, (key, value) => {
  if (key === "self") {
    return undefined;  // 忽略循环引用
  }
  return value;
});
```

### 4.5 常见误解说明与纠正

#### 误解 1：JSON 就是 JavaScript 对象

❌ **错误理解**：
```javascript
// 认为可以直接写 JavaScript 对象
const json = { name: "张三", age: 25 };  // 这是 JavaScript 对象，不是 JSON
```

✅ **正确理解**：
- **JSON** 是字符串格式，用于数据交换
- **JavaScript 对象** 是内存中的数据结构
- JSON 是 JavaScript 对象的字符串表示

```javascript
// JavaScript 对象
const obj = { name: "张三", age: 25 };

// JSON 字符串（用于传输和存储）
const jsonStr = JSON.stringify(obj);  // '{"name":"张三","age":25}'

// 从 JSON 字符串恢复对象
const obj2 = JSON.parse(jsonStr);  // { name: "张三", age: 25 }
```

#### 误解 2：JSON 支持所有 JavaScript 类型

❌ **错误理解**：
```javascript
// 认为可以序列化函数、Date 对象等
const obj = {
  func: function() {},
  date: new Date()
};
JSON.stringify(obj);  // 函数会被忽略，Date 会变成字符串
```

✅ **正确理解**：
- JSON 只支持基本数据类型（字符串、数字、布尔值、null、对象、数组）
- 函数、undefined、Symbol 会被忽略
- Date 对象会被转换为 ISO 字符串

```javascript
// 需要自定义序列化
const obj = {
  date: new Date(),
  toJSON() {
    return {
      date: this.date.toISOString()
    };
  }
};
```

#### 误解 3：JSON.parse() 可以解析任何字符串

❌ **错误理解**：
```javascript
// 认为可以解析任何格式的字符串
JSON.parse("hello world");  // ❌ 错误：不是有效的 JSON
JSON.parse("{name: '张三'}");  // ❌ 错误：属性名没有引号
```

✅ **正确理解**：
- JSON 字符串必须符合严格的 JSON 语法
- 属性名必须用双引号
- 字符串必须用双引号（不能用单引号）

```javascript
// ✅ 正确的 JSON 格式
JSON.parse('{"name":"张三","age":25}');  // 正确

// ❌ 错误的格式
JSON.parse("{name: '张三'}");  // 错误：属性名和值都需要双引号
JSON.parse("{'name': '张三'}");  // 错误：不能用单引号
```

---

## 5. 示例代码（可运行 + 逐行注释）

```javascript
// ===== 示例 1：前后端数据交换 =====

// 前端：发送数据到后端
const userData = {
  name: "张三",
  age: 25,
  email: "zhangsan@example.com"
};

// 1. 将对象转换为 JSON 字符串
const jsonData = JSON.stringify(userData);
// '{"name":"张三","age":25,"email":"zhangsan@example.com"}'

// 2. 发送到后端（模拟）
console.log("发送数据：", jsonData);

// 后端：接收并解析数据（模拟）
const receivedData = JSON.parse(jsonData);
console.log("接收数据：", receivedData);
// { name: "张三", age: 25, email: "zhangsan@example.com" }

// ===== 示例 2：数据存储到 localStorage =====

// 1. 保存数据
const settings = {
  theme: "dark",
  language: "zh-CN",
  notifications: true
};

// 转换为 JSON 字符串并存储
localStorage.setItem("settings", JSON.stringify(settings));

// 2. 读取数据
const savedSettings = JSON.parse(localStorage.getItem("settings"));
console.log(savedSettings);
// { theme: "dark", language: "zh-CN", notifications: true }

// ===== 示例 3：处理包含 Date 的对象 =====

function serializeWithDate(obj) {
  // 1. 使用 replacer 处理 Date 对象
  return JSON.stringify(obj, (key, value) => {
    // 如果是 Date 对象，转换为 ISO 字符串
    if (value instanceof Date) {
      return {
        __type: "Date",
        __value: value.toISOString()
      };
    }
    return value;
  });
}

function deserializeWithDate(jsonStr) {
  // 2. 使用 reviver 恢复 Date 对象
  return JSON.parse(jsonStr, (key, value) => {
    // 如果是标记为 Date 的对象，转换为 Date
    if (value && value.__type === "Date") {
      return new Date(value.__value);
    }
    return value;
  });
}

// 使用示例
const obj = {
  name: "张三",
  createdAt: new Date()
};

const jsonStr = serializeWithDate(obj);
console.log(jsonStr);
// '{"name":"张三","createdAt":{"__type":"Date","__value":"2024-12-04T12:00:00.000Z"}}'

const restored = deserializeWithDate(jsonStr);
console.log(restored.createdAt instanceof Date);  // true

// ===== 示例 4：过滤敏感信息 =====

function safeStringify(obj, sensitiveKeys = ["password", "token"]) {
  // 使用 replacer 过滤敏感字段
  return JSON.stringify(obj, (key, value) => {
    // 如果键在敏感列表中，返回 "[REDACTED]"
    if (sensitiveKeys.includes(key)) {
      return "[REDACTED]";
    }
    return value;
  });
}

const user = {
  name: "张三",
  email: "zhangsan@example.com",
  password: "123456",
  token: "secret-token"
};

const safeJson = safeStringify(user);
console.log(safeJson);
// '{"name":"张三","email":"zhangsan@example.com","password":"[REDACTED]","token":"[REDACTED]"}'

// ===== 示例 5：格式化 JSON 输出 =====

const data = {
  users: [
    { name: "张三", age: 25 },
    { name: "李四", age: 30 }
  ],
  total: 2
};

// 格式化输出（缩进 2 个空格）
const formatted = JSON.stringify(data, null, 2);
console.log(formatted);
// {
//   "users": [
//     {
//       "name": "张三",
//       "age": 25
//     },
//     {
//       "name": "李四",
//       "age": 30
//     }
//   ],
//   "total": 2
// }

// ===== 示例 6：处理 API 响应 =====

// 模拟 API 响应
const apiResponse = '{"status":"success","data":{"users":[{"name":"张三","age":25}]}}';

// 1. 解析响应
const response = JSON.parse(apiResponse);

// 2. 检查状态
if (response.status === "success") {
  // 3. 处理数据
  const users = response.data.users;
  users.forEach(user => {
    console.log(`${user.name}，${user.age}岁`);
  });
}
```

---

## 6. 常见错误与踩坑

### 错误 1：JSON 字符串格式错误

**错误代码**：
```javascript
// 属性名没有用双引号
JSON.parse("{name: '张三'}");  // ❌ SyntaxError

// 使用了单引号
JSON.parse("{'name': '张三'}");  // ❌ SyntaxError

// 末尾有多余的逗号
JSON.parse('{"name":"张三","age":25,}');  // ❌ SyntaxError
```

**为什么错**：
- JSON 语法非常严格，必须符合规范
- 属性名和字符串值必须用双引号
- 不能有多余的逗号

**正确方式**：
```javascript
// ✅ 正确的 JSON 格式
JSON.parse('{"name":"张三","age":25}');  // 正确

// 或者使用 JSON.stringify 确保格式正确
const obj = { name: "张三", age: 25 };
const jsonStr = JSON.stringify(obj);  // 自动生成正确格式
JSON.parse(jsonStr);  // 安全解析
```

### 错误 2：忘记处理 Date 对象

**错误代码**：
```javascript
const obj = {
  name: "张三",
  createdAt: new Date()
};

const jsonStr = JSON.stringify(obj);
// '{"name":"张三","createdAt":"2024-12-04T12:00:00.000Z"}'

const restored = JSON.parse(jsonStr);
console.log(restored.createdAt);  // "2024-12-04T12:00:00.000Z"（字符串，不是 Date）
console.log(restored.createdAt instanceof Date);  // false
```

**为什么错**：
- `JSON.stringify()` 会将 Date 对象转换为 ISO 字符串
- `JSON.parse()` 不会自动转换回 Date 对象
- 需要手动处理

**正确方式**：
```javascript
// 方式 1：使用 reviver
const jsonStr = JSON.stringify(obj);
const restored = JSON.parse(jsonStr, (key, value) => {
  // 检查是否是日期字符串（简单判断）
  if (key === "createdAt" && typeof value === "string") {
    return new Date(value);
  }
  return value;
});

// 方式 2：使用 toJSON 和 reviver 配合
const obj = {
  name: "张三",
  createdAt: new Date(),
  toJSON() {
    return {
      name: this.name,
      createdAt: this.createdAt.toISOString()
    };
  }
};
```

### 错误 3：循环引用导致序列化失败

**错误代码**：
```javascript
const obj = { name: "张三" };
obj.self = obj;  // 循环引用

JSON.stringify(obj);  // ❌ TypeError: Converting circular structure to JSON
```

**为什么错**：
- 对象包含对自身的引用，形成循环
- JSON.stringify 无法处理循环引用

**正确方式**：
```javascript
// 方式 1：使用 replacer 过滤
JSON.stringify(obj, (key, value) => {
  if (key === "self") {
    return undefined;  // 忽略循环引用
  }
  return value;
});

// 方式 2：使用 WeakSet 跟踪已访问的对象
function safeStringify(obj) {
  const seen = new WeakSet();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return "[Circular]";  // 标记为循环引用
      }
      seen.add(value);
    }
    return value;
  });
}
```

---

## 7. 实际应用场景

### 场景 1：API 请求和响应

```javascript
// 发送 POST 请求
async function createUser(userData) {
  // 1. 将对象转换为 JSON
  const jsonData = JSON.stringify(userData);
  
  // 2. 发送请求
  const response = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: jsonData
  });
  
  // 3. 解析响应
  const result = await response.json();  // 自动调用 JSON.parse()
  return result;
}

// 使用
createUser({ name: "张三", age: 25 });
```

### 场景 2：本地存储

```javascript
// 保存用户偏好设置
function saveSettings(settings) {
  localStorage.setItem("settings", JSON.stringify(settings));
}

// 读取设置
function loadSettings() {
  const jsonStr = localStorage.getItem("settings");
  if (jsonStr) {
    return JSON.parse(jsonStr);
  }
  return null;
}

// 使用
saveSettings({ theme: "dark", language: "zh-CN" });
const settings = loadSettings();
```

### 场景 3：深拷贝对象

```javascript
// 使用 JSON 实现深拷贝（有限制）
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// 注意：这种方法有局限性
// - 不能处理函数、undefined、Symbol
// - Date 对象会变成字符串
// - 不能处理循环引用

const obj = { name: "张三", age: 25 };
const cloned = deepClone(obj);
```

### 场景 4：配置文件解析

```javascript
// 读取 package.json
const fs = require("fs");
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));

console.log(packageJson.name);  // 项目名称
console.log(packageJson.version);  // 版本号
```

---

## 8. 给新手的练习题

### 基础题

**练习 1：对象转 JSON**
```javascript
// 任务：将对象转换为 JSON 字符串
const obj = { name: "张三", age: 25, city: "北京" };
// 你的代码...

// 参考答案：
const jsonStr = JSON.stringify(obj);
console.log(jsonStr);  // '{"name":"张三","age":25,"city":"北京"}'
```

**练习 2：JSON 转对象**
```javascript
// 任务：将 JSON 字符串转换为对象
const jsonStr = '{"name":"张三","age":25,"city":"北京"}';
// 你的代码...

// 参考答案：
const obj = JSON.parse(jsonStr);
console.log(obj.name);  // "张三"
```

**练习 3：格式化 JSON**
```javascript
// 任务：将对象格式化为易读的 JSON 字符串（缩进 2 个空格）
const obj = { name: "张三", age: 25, tags: ["前端", "JavaScript"] };
// 你的代码...

// 参考答案：
const formatted = JSON.stringify(obj, null, 2);
console.log(formatted);
```

### 进阶题

**练习 4：过滤敏感信息**
```javascript
// 任务：序列化对象时，将 password 和 token 字段替换为 "[REDACTED]"
function safeStringify(obj) {
  // 你的代码...
}

// 测试
const user = { name: "张三", password: "123456", token: "abc123" };
console.log(safeStringify(user));
// 应该输出：'{"name":"张三","password":"[REDACTED]","token":"[REDACTED]"}'

// 参考答案：
function safeStringify(obj) {
  return JSON.stringify(obj, (key, value) => {
    if (key === "password" || key === "token") {
      return "[REDACTED]";
    }
    return value;
  });
}
```

**练习 5：处理 Date 对象**
```javascript
// 任务：序列化和反序列化包含 Date 对象的对象
function serialize(obj) {
  // 你的代码...
}

function deserialize(jsonStr) {
  // 你的代码...
}

// 测试
const obj = { name: "张三", createdAt: new Date() };
const jsonStr = serialize(obj);
const restored = deserialize(jsonStr);
console.log(restored.createdAt instanceof Date);  // 应该输出 true

// 参考答案：
function serialize(obj) {
  return JSON.stringify(obj, (key, value) => {
    if (value instanceof Date) {
      return { __type: "Date", __value: value.toISOString() };
    }
    return value;
  });
}

function deserialize(jsonStr) {
  return JSON.parse(jsonStr, (key, value) => {
    if (value && value.__type === "Date") {
      return new Date(value.__value);
    }
    return value;
  });
}
```

---

## 9. 用更简单的话再总结一遍（方便复习）

**JSON 就是数据转换的"翻译官"**：
- `JSON.stringify()` - 把对象变成字符串（序列化）
- `JSON.parse()` - 把字符串变回对象（反序列化）
- JSON 格式严格：属性名和字符串必须用双引号，不支持函数、undefined、Symbol
- Date 对象会变成字符串，需要手动处理
- 前后端通信、本地存储都用 JSON 格式

**记忆口诀**：
- **J**SON - JavaScript Object Notation
- **S**tringify - 对象转字符串
- **P**arse - 字符串转对象
- **N**otation - 数据表示法

---

## 10. 知识体系延伸 & 继续学习方向

### 继续学习方向

1. **相关内置对象**：
   - [[Object]] - 对象的基本操作
   - [[Array]] - 数组的序列化和反序列化
   - [[String]] - 字符串处理

2. **相关主题**：
   - [[数据类型]] - 理解 JSON 支持的数据类型
   - [[异步编程]] - 处理异步 API 请求和响应
   - [[网络请求]] - Fetch API、Axios 等

3. **进阶学习**：
   - [[数据持久化]] - localStorage、sessionStorage、IndexedDB
   - [[API 设计]] - RESTful API、GraphQL
   - [[数据验证]] - JSON Schema 验证

### 遵守仓库规范

- 使用双链格式 `[[xxx]]` 链接相关知识点
- 参考 [[内置对象概述]] 了解内置对象分类
- 参考 [[!MOC-javascript]] 了解完整知识体系

---

**参考资源**：
- [MDN JSON](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON)
- [JSON 官方网站](https://www.json.org/)
- [JSON Schema](https://json-schema.org/)

---

#javascript #JSON #内置对象 #数据序列化 #数据交换

