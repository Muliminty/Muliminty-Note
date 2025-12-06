# String 对象（String Object）

> JavaScript 字符串对象：文本处理的核心工具，就像文字编辑器的所有功能都装在一个工具箱里。

---

## 1. 一句话概括主题

String 是 JavaScript 的内置对象，用于处理文本数据，提供了丰富的字符串操作方法，是前端开发中最常用的工具之一。

---

## 2. 它是什么（像和朋友聊天一样解释）

想象一下，String 就像你手机上的文本编辑器：
- **复制粘贴** → `slice()`、`substring()`
- **查找替换** → `indexOf()`、`replace()`
- **大小写转换** → `toUpperCase()`、`toLowerCase()`
- **去除空格** → `trim()`
- **分割文本** → `split()`

**举例**：
```javascript
// 就像编辑文档一样处理字符串
const name = "  张三  ";
const cleanName = name.trim();  // "张三" - 去除空格
const upperName = cleanName.toUpperCase();  // "张三" - 转大写（中文不变）
```

---

## 3. 能解决什么问题 + 为什么重要

### 解决的问题

1. **文本处理**：格式化、搜索、替换文本内容
2. **数据验证**：验证用户输入格式（邮箱、手机号等）
3. **数据转换**：字符串与其他类型的相互转换
4. **国际化**：处理多语言文本

### 为什么重要

- **日常开发必备**：几乎每个应用都需要处理文本
- **用户交互核心**：表单验证、搜索功能都依赖字符串操作
- **性能关键**：正确使用字符串方法能提升应用性能
- **面试必考**：字符串操作是前端面试高频考点

---

## 4. 核心知识点拆解

### 4.1 字符串创建

**字面量创建**（推荐）：
```javascript
const str1 = "hello";      // 双引号
const str2 = 'world';      // 单引号
const str3 = `template`;   // 模板字符串（ES6）
```

**构造函数创建**（不推荐）：
```javascript
const str = new String("hello");  // 创建 String 对象
console.log(typeof str);  // "object"（不是 "string"）
```

**模板字符串**（ES6，推荐）：
```javascript
const name = "张三";
const age = 25;
const message = `我是${name}，今年${age}岁`;  // "我是张三，今年25岁"
```

### 4.2 字符串属性

**length** - 字符串长度：
```javascript
const str = "hello";
console.log(str.length);  // 5
```

**注意**：`length` 是只读属性，不能修改。

### 4.3 字符串查找方法

#### indexOf() / lastIndexOf() - 查找子字符串位置

```javascript
const str = "hello world";
console.log(str.indexOf("world"));      // 6 - 第一次出现的位置
console.log(str.indexOf("o"));          // 4 - 第一个 "o" 的位置
console.log(str.lastIndexOf("o"));      // 7 - 最后一个 "o" 的位置
console.log(str.indexOf("xyz"));        // -1 - 未找到
```

#### includes() - 检查是否包含（ES6）

```javascript
const str = "hello world";
console.log(str.includes("world"));  // true
console.log(str.includes("xyz"));     // false
```

#### startsWith() / endsWith() - 检查开头/结尾（ES6）

```javascript
const str = "hello world";
console.log(str.startsWith("hello"));  // true
console.log(str.endsWith("world"));    // true
```

### 4.4 字符串截取方法

#### slice() - 截取字符串（推荐）

```javascript
const str = "hello world";
console.log(str.slice(0, 5));    // "hello" - 从索引 0 到 5（不含5）
console.log(str.slice(6));        // "world" - 从索引 6 到末尾
console.log(str.slice(-5));       // "world" - 从倒数第 5 个字符开始
console.log(str.slice(6, -1));    // "worl" - 从索引 6 到倒数第 1 个
```

#### substring() - 截取字符串

```javascript
const str = "hello world";
console.log(str.substring(0, 5));  // "hello"
console.log(str.substring(6));    // "world"
```

**slice() vs substring()**：
- `slice()` 支持负数索引，`substring()` 不支持
- `substring()` 会自动交换参数（如果 start > end），`slice()` 不会

#### substr() - 截取字符串（已废弃）

```javascript
// ⚠️ 已废弃，不推荐使用
const str = "hello world";
console.log(str.substr(6, 5));  // "world" - 从索引 6 开始，截取 5 个字符
```

### 4.5 字符串修改方法

#### toUpperCase() / toLowerCase() - 大小写转换

```javascript
const str = "Hello World";
console.log(str.toUpperCase());  // "HELLO WORLD"
console.log(str.toLowerCase());  // "hello world"
```

#### trim() / trimStart() / trimEnd() - 去除空格（ES6）

```javascript
const str = "  hello world  ";
console.log(str.trim());        // "hello world" - 去除首尾空格
console.log(str.trimStart());   // "hello world  " - 去除开头空格
console.log(str.trimEnd());     // "  hello world" - 去除结尾空格
```

#### replace() / replaceAll() - 替换字符串

```javascript
const str = "hello world hello";
console.log(str.replace("hello", "hi"));      // "hi world hello" - 只替换第一个
console.log(str.replaceAll("hello", "hi"));   // "hi world hi" - 替换所有（ES2021）
console.log(str.replace(/hello/g, "hi"));     // "hi world hi" - 使用正则替换所有
```

### 4.6 字符串分割和连接

#### split() - 分割字符串

```javascript
const str = "apple,banana,orange";
console.log(str.split(","));        // ["apple", "banana", "orange"]
console.log(str.split(",", 2));     // ["apple", "banana"] - 限制分割数量
console.log("hello".split(""));     // ["h", "e", "l", "l", "o"] - 分割为字符数组
```

#### concat() - 连接字符串

```javascript
const str1 = "hello";
const str2 = "world";
console.log(str1.concat(" ", str2));  // "hello world"
// 更推荐使用 + 或模板字符串
console.log(str1 + " " + str2);       // "hello world"
console.log(`${str1} ${str2}`);       // "hello world"
```

### 4.7 字符串填充方法（ES6）

#### padStart() / padEnd() - 填充字符串

```javascript
const str = "5";
console.log(str.padStart(3, "0"));  // "005" - 前面填充 0，总长度 3
console.log(str.padEnd(3, "0"));    // "500" - 后面填充 0

// 实际应用：格式化日期
const month = "3";
console.log(month.padStart(2, "0"));  // "03" - 月份格式化
```

### 4.8 字符串重复（ES6）

#### repeat() - 重复字符串

```javascript
const str = "ha";
console.log(str.repeat(3));  // "hahaha"
```

### 4.9 字符串匹配方法

#### match() - 正则匹配

```javascript
const str = "hello world";
console.log(str.match(/o/g));  // ["o", "o"] - 匹配所有 "o"
```

#### search() - 搜索位置

```javascript
const str = "hello world";
console.log(str.search("world"));  // 6 - 返回匹配位置
```

### 4.10 常见误解说明与纠正

#### 误解 1：字符串是可变的

❌ **错误理解**：
```javascript
const str = "hello";
str[0] = "H";  // 尝试修改
console.log(str);  // "hello" - 没有改变
```

✅ **正确理解**：
- 字符串是**不可变的**（immutable）
- 所有字符串方法都返回**新字符串**，不修改原字符串
- 需要重新赋值才能使用新字符串

```javascript
const str = "hello";
const newStr = str.replace("h", "H");  // 返回新字符串
console.log(str);     // "hello" - 原字符串不变
console.log(newStr);  // "Hello" - 新字符串
```

#### 误解 2：字符串可以用数组方法

❌ **错误理解**：
```javascript
const str = "hello";
str.push("!");  // ❌ 错误：字符串没有 push 方法
```

✅ **正确理解**：
- 字符串不是数组，不能使用数组方法
- 需要先转换为数组，操作后再转回字符串

```javascript
const str = "hello";
const arr = str.split("");  // 转为数组
arr.push("!");              // 数组操作
const newStr = arr.join(""); // 转回字符串
console.log(newStr);  // "hello!"
```

#### 误解 3：字符串比较用 ==

❌ **错误理解**：
```javascript
const str1 = new String("hello");
const str2 = "hello";
console.log(str1 == str2);   // true（类型转换）
console.log(str1 === str2);  // false（类型不同）
```

✅ **正确理解**：
- 使用 `===` 进行严格比较
- 避免使用 `new String()` 创建字符串对象

```javascript
const str1 = "hello";
const str2 = "hello";
console.log(str1 === str2);  // true - 推荐方式
```

---

## 5. 示例代码（可运行 + 逐行注释）

```javascript
// ===== 示例 1：用户输入格式化 =====

function formatUserName(input) {
  // 1. 去除首尾空格
  let name = input.trim();
  
  // 2. 转换为小写
  name = name.toLowerCase();
  
  // 3. 首字母大写（只处理英文）
  if (name.length > 0) {
    name = name[0].toUpperCase() + name.slice(1);
  }
  
  return name;
}

console.log(formatUserName("  john doe  "));  // "John doe"
console.log(formatUserName("MARY"));         // "Mary"

// ===== 示例 2：邮箱验证 =====

function validateEmail(email) {
  // 1. 去除空格
  email = email.trim();
  
  // 2. 检查是否包含 @
  if (!email.includes("@")) {
    return false;
  }
  
  // 3. 检查 @ 的位置（不能在开头或结尾）
  const atIndex = email.indexOf("@");
  if (atIndex === 0 || atIndex === email.length - 1) {
    return false;
  }
  
  // 4. 检查是否包含点号
  const dotIndex = email.lastIndexOf(".");
  if (dotIndex === -1 || dotIndex < atIndex) {
    return false;
  }
  
  return true;
}

console.log(validateEmail("test@example.com"));  // true
console.log(validateEmail("invalid.email"));     // false

// ===== 示例 3：文本搜索高亮 =====

function highlightText(text, keyword) {
  // 1. 检查关键词是否存在
  if (!text.includes(keyword)) {
    return text;
  }
  
  // 2. 替换所有匹配的关键词（不区分大小写）
  const regex = new RegExp(keyword, "gi");  // g: 全局, i: 忽略大小写
  return text.replace(regex, `<mark>${keyword}</mark>`);
}

const text = "JavaScript is a programming language. JavaScript is popular.";
console.log(highlightText(text, "javascript"));
// "JavaScript is a programming language. JavaScript is popular."
// （实际 HTML 中会高亮显示）

// ===== 示例 4：URL 参数解析 =====

function parseURLParams(url) {
  // 1. 找到查询字符串部分
  const queryIndex = url.indexOf("?");
  if (queryIndex === -1) {
    return {};
  }
  
  // 2. 提取查询字符串
  const queryString = url.slice(queryIndex + 1);
  
  // 3. 分割参数
  const params = {};
  const pairs = queryString.split("&");
  
  for (const pair of pairs) {
    const [key, value] = pair.split("=");
    params[decodeURIComponent(key)] = decodeURIComponent(value || "");
  }
  
  return params;
}

const url = "https://example.com?name=张三&age=25&city=北京";
console.log(parseURLParams(url));
// { name: "张三", age: "25", city: "北京" }

// ===== 示例 5：字符串模板处理 =====

function processTemplate(template, data) {
  let result = template;
  
  // 替换所有 {{key}} 格式的占位符
  for (const [key, value] of Object.entries(data)) {
    const placeholder = `{{${key}}}`;
    result = result.replaceAll(placeholder, value);
  }
  
  return result;
}

const template = "你好，{{name}}！你今年{{age}}岁，来自{{city}}。";
const data = { name: "张三", age: 25, city: "北京" };
console.log(processTemplate(template, data));
// "你好，张三！你今年25岁，来自北京。"
```

---

## 6. 常见错误与踩坑

### 错误 1：忘记字符串是不可变的

**错误代码**：
```javascript
let str = "hello";
str.toUpperCase();  // 返回新字符串，但没有赋值
console.log(str);   // "hello" - 没有改变
```

**为什么错**：
- 字符串方法返回新字符串，不修改原字符串
- 没有将返回值赋给变量

**正确方式**：
```javascript
let str = "hello";
str = str.toUpperCase();  // 重新赋值
console.log(str);  // "HELLO"
```

### 错误 2：使用 == 比较字符串

**错误代码**：
```javascript
const str1 = new String("hello");
const str2 = "hello";
if (str1 == str2) {  // true，但类型不同
  // 可能产生意外行为
}
```

**为什么错**：
- `==` 会进行类型转换，可能产生意外结果
- `new String()` 创建的是对象，不是原始字符串

**正确方式**：
```javascript
const str1 = "hello";
const str2 = "hello";
if (str1 === str2) {  // 严格比较
  // 正确
}

// 或者转换为字符串再比较
const str1 = new String("hello");
const str2 = "hello";
if (String(str1) === str2) {  // 转换为字符串
  // 正确
}
```

### 错误 3：混淆 slice() 和 substring()

**错误代码**：
```javascript
const str = "hello world";
console.log(str.slice(5, 2));   // "" - 空字符串（start > end）
console.log(str.substring(5, 2));  // "llo" - 自动交换参数，可能不是预期结果
```

**为什么错**：
- `slice()` 和 `substring()` 行为不同
- `substring()` 会自动交换参数，可能导致意外结果

**正确方式**：
```javascript
const str = "hello world";
// 使用 slice()，支持负数索引
console.log(str.slice(2, 5));   // "llo"
console.log(str.slice(-5));     // "world"

// 或者明确使用 substring()
const start = Math.min(2, 5);
const end = Math.max(2, 5);
console.log(str.substring(start, end));  // "llo"
```

---

## 7. 实际应用场景

### 场景 1：表单验证

```javascript
// 验证手机号格式
function validatePhone(phone) {
  const cleaned = phone.trim().replace(/\s+/g, "");  // 去除空格
  return /^1[3-9]\d{9}$/.test(cleaned);  // 验证 11 位手机号
}

console.log(validatePhone("138 0013 8000"));  // true
console.log(validatePhone("12345678901"));     // false
```

### 场景 2：数据格式化

```javascript
// 格式化金额（添加千分位）
function formatCurrency(amount) {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

console.log(formatCurrency(1234567.89));  // "1,234,567.89"
```

### 场景 3：文本处理

```javascript
// 提取文章摘要（前 100 个字符）
function getSummary(text, maxLength = 100) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + "...";
}

const article = "这是一篇很长的文章内容...";
console.log(getSummary(article, 10));  // "这是一篇很长的文章..."
```

### 场景 4：URL 处理

```javascript
// 从 URL 中提取域名
function getDomain(url) {
  const match = url.match(/https?:\/\/([^\/]+)/);
  return match ? match[1] : null;
}

console.log(getDomain("https://www.example.com/path"));  // "www.example.com"
```

---

## 8. 给新手的练习题

### 基础题

**练习 1：字符串反转**
```javascript
// 任务：将字符串 "hello" 反转为 "olleh"
const str = "hello";
// 你的代码...

// 参考答案：
const reversed = str.split("").reverse().join("");
console.log(reversed);  // "olleh"
```

**练习 2：首字母大写**
```javascript
// 任务：将 "hello world" 转换为 "Hello World"（每个单词首字母大写）
const str = "hello world";
// 你的代码...

// 参考答案：
const result = str
  .split(" ")
  .map(word => word[0].toUpperCase() + word.slice(1))
  .join(" ");
console.log(result);  // "Hello World"
```

**练习 3：去除重复字符**
```javascript
// 任务：去除字符串中的重复字符，保留第一次出现的
const str = "hello";
// 你的代码...

// 参考答案：
const unique = str
  .split("")
  .filter((char, index, arr) => arr.indexOf(char) === index)
  .join("");
console.log(unique);  // "helo"
```

### 进阶题

**练习 4：字符串压缩**
```javascript
// 任务：将 "aaabbbcc" 压缩为 "a3b3c2"
function compress(str) {
  // 你的代码...
}

// 测试
console.log(compress("aaabbbcc"));  // "a3b3c2"
console.log(compress("abc"));       // "a1b1c1"

// 参考答案：
function compress(str) {
  let result = "";
  let count = 1;
  
  for (let i = 0; i < str.length; i++) {
    if (str[i] === str[i + 1]) {
      count++;
    } else {
      result += str[i] + count;
      count = 1;
    }
  }
  
  return result;
}
```

**练习 5：回文检测**
```javascript
// 任务：检测字符串是否为回文（正反读都一样）
function isPalindrome(str) {
  // 你的代码...
}

// 测试
console.log(isPalindrome("racecar"));  // true
console.log(isPalindrome("hello"));    // false

// 参考答案：
function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  return cleaned === cleaned.split("").reverse().join("");
}
```

---

## 9. 用更简单的话再总结一遍（方便复习）

**String 就是处理文本的工具箱**：
- 字符串是**不可变的**，所有方法都返回新字符串
- 常用方法：`slice()`（截取）、`replace()`（替换）、`split()`（分割）、`trim()`（去空格）
- 查找用 `indexOf()` 或 `includes()`
- 大小写转换用 `toUpperCase()` 和 `toLowerCase()`
- 模板字符串 `${}` 比字符串拼接更方便

**记忆口诀**：
- **S**lice - 截取
- **R**eplace - 替换
- **I**ndexOf - 查找
- **N**ew String - 创建（不推荐）
- **G**et length - 获取长度

---

## 10. 知识体系延伸 & 继续学习方向

### 继续学习方向

1. **相关内置对象**：
   - [[Array]] - 数组操作（字符串和数组经常配合使用）
   - [[RegExp]] - 正则表达式（字符串匹配的强大工具）

2. **相关主题**：
   - [[数据类型]] - 理解字符串是原始类型
   - [[模板字符串]] - ES6 模板字符串详解
   - [[Unicode]] - 理解字符编码

3. **进阶学习**：
   - [[国际化]] - 多语言字符串处理
   - [[性能优化]] - 字符串操作的性能优化

### 遵守仓库规范

- 使用双链格式 `[[xxx]]` 链接相关知识点
- 参考 [[内置对象概述]] 了解内置对象分类
- 参考 [[!MOC-javascript]] 了解完整知识体系

---

**参考资源**：
- [MDN String](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String)
- [ECMAScript String Objects](https://tc39.es/ecma262/#sec-string-objects)

---

#javascript #String #内置对象 #字符串处理

