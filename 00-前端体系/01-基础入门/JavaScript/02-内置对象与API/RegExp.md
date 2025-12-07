# RegExp 对象（Regular Expression）

> JavaScript 正则表达式：文本匹配的"万能钥匙"，就像搜索引擎的高级搜索功能，能精确找到你想要的任何文本模式。

---

## 1. 一句话概括主题

RegExp 是 JavaScript 的内置对象，用于定义文本匹配模式，通过正则表达式可以高效地搜索、匹配、替换和验证文本内容。

---

## 2. 它是什么（像和朋友聊天一样解释）

想象一下，RegExp 就像搜索引擎的高级搜索功能：
- **精确查找** → `/hello/` 找到所有 "hello"
- **模糊匹配** → `/hel.o/` 匹配 "helxo"、"helpo" 等
- **批量替换** → 把所有 "cat" 替换成 "dog"
- **格式验证** → 检查邮箱、手机号格式是否正确

**举例**：
```javascript
// 就像在文档中搜索一样
const text = "我的邮箱是 user@example.com";
const emailPattern = /\w+@\w+\.\w+/;  // 匹配邮箱格式
console.log(emailPattern.test(text));  // true - 找到了邮箱
```

---

## 3. 能解决什么问题 + 为什么重要

### 解决的问题

1. **文本搜索**：在大量文本中快速找到特定模式
2. **格式验证**：验证用户输入（邮箱、手机号、身份证等）
3. **文本替换**：批量替换符合某种模式的文本
4. **数据提取**：从文本中提取特定信息（如提取所有数字）
5. **文本解析**：解析复杂格式的文本（如 URL、JSON 字符串）

### 为什么重要

- **开发必备技能**：表单验证、文本处理都离不开正则
- **效率提升**：用几行正则就能完成复杂的文本处理
- **面试高频考点**：正则表达式是前端面试必考内容
- **实际应用广泛**：数据清洗、日志分析、文本解析等场景

---

## 4. 核心知识点拆解

### 4.1 创建正则表达式

#### 字面量方式（推荐）

```javascript
const pattern = /hello/;  // 匹配 "hello"
const flags = /hello/gi;  // g=全局，i=忽略大小写
```

#### 构造函数方式

```javascript
const pattern = new RegExp("hello");  // 匹配 "hello"
const flags = new RegExp("hello", "gi");  // g=全局，i=忽略大小写

// 动态创建（字符串拼接）
const word = "hello";
const pattern = new RegExp(word, "i");  // 可以动态构建
```

**两种方式对比**：
- **字面量**：简洁、性能好，适合固定模式
- **构造函数**：灵活，可以动态构建，适合模式需要变化的情况

### 4.2 正则表达式标志（Flags）

```javascript
// i - ignoreCase（忽略大小写）
/hello/i.test("Hello");  // true

// g - global（全局匹配）
"hello hello".match(/hello/);   // ["hello"]（只匹配第一个）
"hello hello".match(/hello/g);  // ["hello", "hello"]（匹配所有）

// m - multiline（多行模式）
/^hello/m.test("hello\nworld");  // true（^ 匹配每行开头）

// s - dotAll（点号匹配换行）
/hello.world/s.test("hello\nworld");  // true（. 可以匹配 \n）

// u - unicode（Unicode 支持）
/\u{1F600}/u.test("😀");  // true（支持 Unicode 转义）

// y - sticky（粘性匹配）
const regex = /hello/y;
regex.lastIndex = 6;
regex.test("hello world");  // false（必须从 lastIndex 开始匹配）
```

### 4.3 字符类（Character Classes）

#### 基本字符类

```javascript
// \d - 数字（0-9）
/\d/.test("abc123");  // true

// \D - 非数字
/\D/.test("abc");  // true

// \w - 单词字符（字母、数字、下划线）
/\w/.test("a");  // true
/\w/.test("_");  // true

// \W - 非单词字符
/\W/.test(" ");  // true

// \s - 空白字符（空格、制表符、换行等）
/\s/.test(" ");  // true

// \S - 非空白字符
/\S/.test("a");  // true

// . - 任意字符（除换行符外）
/./.test("a");  // true
/./.test("\n");  // false（默认不匹配换行）
```

#### 自定义字符类

```javascript
// [abc] - 匹配 a、b 或 c
/[abc]/.test("apple");  // true（匹配到 a）

// [a-z] - 匹配 a 到 z 的任意小写字母
/[a-z]/.test("Hello");  // true（匹配到 e）

// [0-9] - 匹配 0 到 9 的数字
/[0-9]/.test("abc123");  // true

// [^abc] - 匹配除 a、b、c 外的任意字符
/[^abc]/.test("def");  // true（匹配到 d）

// [a-zA-Z0-9] - 匹配字母和数字
/[a-zA-Z0-9]/.test("_");  // false
```

### 4.4 量词（Quantifiers）

```javascript
// * - 0 次或多次
/ab*/.test("a");    // true（b 出现 0 次）
/ab*/.test("ab");   // true（b 出现 1 次）
/ab*/.test("abbb"); // true（b 出现多次）

// + - 1 次或多次
/ab+/.test("a");    // false（b 必须至少出现 1 次）
/ab+/.test("ab");   // true

// ? - 0 次或 1 次（可选）
/ab?/.test("a");    // true（b 出现 0 次）
/ab?/.test("ab");   // true（b 出现 1 次）
/ab?/.test("abb");  // true（只匹配前两个字符）

// {n} - 恰好 n 次
/ab{2}/.test("abb");  // true（b 恰好出现 2 次）

// {n,} - n 次或更多
/ab{2,}/.test("abbb");  // true（b 至少 2 次）

// {n,m} - n 到 m 次
/ab{2,4}/.test("abbb");  // true（b 出现 2-4 次）
```

**贪婪 vs 非贪婪**：
```javascript
// 贪婪匹配（默认）
"<div>content</div>".match(/<.*>/);  // ["<div>content</div>"]（匹配尽可能多）

// 非贪婪匹配（加 ?）
"<div>content</div>".match(/<.*?>/);  // ["<div>"]（匹配尽可能少）
```

### 4.5 位置锚点（Anchors）

```javascript
// ^ - 字符串开头
/^hello/.test("hello world");  // true
/^hello/.test("world hello");  // false

// $ - 字符串结尾
/world$/.test("hello world");  // true
/world$/.test("world hello");  // false

// \b - 单词边界
/\bhello\b/.test("hello world");  // true
/\bhello\b/.test("helloworld");   // false（hello 不是独立单词）

// \B - 非单词边界
/\Bhello\B/.test("helloworld");  // true
```

### 4.6 分组和捕获（Groups and Capturing）

#### 捕获组

```javascript
// 基本捕获
const match = "2024-12-04".match(/(\d{4})-(\d{2})-(\d{2})/);
console.log(match[0]);  // "2024-12-04"（完整匹配）
console.log(match[1]);  // "2024"（第一个捕获组）
console.log(match[2]);  // "12"（第二个捕获组）
console.log(match[3]);  // "04"（第三个捕获组）

// 命名捕获组（ES2018）
const match = "2024-12-04".match(/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/);
console.log(match.groups.year);   // "2024"
console.log(match.groups.month);  // "12"
console.log(match.groups.day);    // "04"
```

#### 非捕获组

```javascript
// (?:...) - 非捕获组（不保存匹配结果）
"hello world".match(/(?:hello) (world)/);
// match[0] = "hello world"
// match[1] = "world"（只有 world 被捕获）

// 正向先行断言（positive lookahead）
"hello world".match(/hello(?= world)/);  // 匹配 "hello"，但后面必须是 " world"

// 负向先行断言（negative lookahead）
"hello world".match(/hello(?! world)/);  // 匹配 "hello"，但后面不能是 " world"

// 正向后行断言（positive lookbehind）
"hello world".match(/(?<=hello )world/);  // 匹配 "world"，但前面必须是 "hello "

// 负向后行断言（negative lookbehind）
"hello world".match(/(?<!hi )world/);  // 匹配 "world"，但前面不能是 "hi "
```

#### 反向引用

```javascript
// \1, \2... - 引用前面的捕获组
/(\w+)\s+\1/.test("hello hello");  // true（匹配重复的单词）

// 在替换中使用
"2024-12-04".replace(/(\d{4})-(\d{2})-(\d{2})/, "$3/$2/$1");  // "04/12/2024"
```

### 4.7 常用正则表达式方法

#### test() - 测试是否匹配

```javascript
const pattern = /hello/;
console.log(pattern.test("hello world"));  // true
console.log(pattern.test("hi world"));     // false
```

#### exec() - 执行匹配（返回详细信息）

```javascript
const pattern = /(\d+)/g;
let match;
while ((match = pattern.exec("123 and 456")) !== null) {
  console.log(match[0]);  // "123", 然后 "456"
  console.log(match.index);  // 0, 然后 8
}
```

#### match() - 字符串方法，匹配正则

```javascript
// 不使用 g 标志
"hello hello".match(/hello/);  // ["hello", index: 0, input: "hello hello", groups: undefined]

// 使用 g 标志
"hello hello".match(/hello/g);  // ["hello", "hello"]（返回所有匹配）
```

#### matchAll() - 返回所有匹配的迭代器

```javascript
const matches = "hello hello".matchAll(/hello/g);
for (const match of matches) {
  console.log(match[0]);  // "hello", "hello"
}
```

#### search() - 查找匹配位置

```javascript
"hello world".search(/world/);  // 6（返回第一个匹配的位置）
"hello world".search(/xyz/);    // -1（未找到）
```

#### replace() - 替换匹配内容

```javascript
// 基本替换
"hello world".replace(/world/, "JavaScript");  // "hello JavaScript"

// 全局替换
"hello hello".replace(/hello/g, "hi");  // "hi hi"

// 使用函数替换
"hello world".replace(/\w+/g, (match) => match.toUpperCase());  // "HELLO WORLD"

// 使用捕获组
"2024-12-04".replace(/(\d{4})-(\d{2})-(\d{2})/, "$3/$2/$1");  // "04/12/2024"
```

#### split() - 按正则分割字符串

```javascript
"a,b;c d".split(/[,;\s]/);  // ["a", "b", "c", "d"]
"2024-12-04".split(/-/);    // ["2024", "12", "04"]
```

### 4.8 常见误解说明与纠正

#### 误解 1：正则表达式很复杂，难以学习

❌ **错误理解**：
- 认为正则表达式语法复杂，难以掌握
- 遇到问题就放弃使用正则

✅ **正确理解**：
- 正则表达式有规律可循，从简单到复杂逐步学习
- 常用模式可以记忆，复杂模式可以查阅文档
- 实际开发中，80% 的场景只需要 20% 的正则语法

```javascript
// 简单模式：匹配数字
/\d+/  // 一个或多个数字

// 中等模式：匹配邮箱
/\w+@\w+\.\w+/  // 单词字符@单词字符.单词字符

// 复杂模式：匹配复杂邮箱（需要更多规则）
/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
```

#### 误解 2：全局标志 g 只影响 match()

❌ **错误理解**：
- 认为 `g` 标志只影响 `match()` 方法
- 不知道 `g` 标志会影响 `exec()` 的行为

✅ **正确理解**：
- `g` 标志会影响所有匹配方法的行为
- `exec()` 配合 `g` 标志可以多次调用，每次从上次结束位置继续
- `test()` 配合 `g` 标志也会更新 `lastIndex`

```javascript
// 不使用 g 标志
const pattern1 = /hello/;
pattern1.exec("hello hello");  // ["hello", ...]
pattern1.exec("hello hello");  // ["hello", ...]（每次都从头开始）

// 使用 g 标志
const pattern2 = /hello/g;
pattern2.exec("hello hello");  // ["hello", ...]
pattern2.exec("hello hello");  // ["hello", ...]（从上次结束位置继续）
```

#### 误解 3：字符类中的特殊字符不需要转义

❌ **错误理解**：
```javascript
/[.]/.test("a");  // false（在字符类中，. 就是字面量点，不需要转义）
```

✅ **正确理解**：
- 在字符类 `[]` 中，大部分特殊字符失去特殊含义
- 但 `]`、`\`、`^`、`-` 在字符类中仍需要特殊处理
- 在字符类外，特殊字符需要转义

```javascript
// 字符类中，. 就是字面量点
/[.]/.test(".");  // true
/[.]/.test("a");  // false

// 字符类外，. 需要转义才能匹配字面量点
/\./.test(".");   // true
/\./.test("a");   // false

// 字符类中，- 需要转义或放在开头/结尾
/[a-z]/.test("b");  // true（- 表示范围）
/[\-a]/.test("-");  // true（转义后是字面量）
/[-a]/.test("-");   // true（放在开头也是字面量）
```

---

## 5. 示例代码（可运行 + 逐行注释）

```javascript
// ===== 示例 1：验证邮箱格式 =====

function validateEmail(email) {
  // 1. 定义邮箱正则表达式
  // ^ 开头，$ 结尾，确保整个字符串匹配
  // [a-zA-Z0-9._%+-]+ 用户名部分：字母、数字、点、下划线、百分号、加号、减号，至少一个
  // @ 必须包含 @ 符号
  // [a-zA-Z0-9.-]+ 域名部分：字母、数字、点、减号，至少一个
  // \. 必须包含点（转义）
  // [a-zA-Z]{2,} 顶级域名：至少两个字母
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  // 2. 测试是否匹配
  return emailPattern.test(email);
}

console.log(validateEmail("user@example.com"));  // true
console.log(validateEmail("invalid.email"));     // false
console.log(validateEmail("user@.com"));         // false

// ===== 示例 2：提取文本中的所有数字 =====

function extractNumbers(text) {
  // 1. 定义数字正则（匹配整数和小数）
  // \d+ 一个或多个数字
  // (\.\d+)? 可选的小数部分（点 + 一个或多个数字）
  const numberPattern = /\d+(\.\d+)?/g;  // g 标志：全局匹配
  
  // 2. 使用 match 方法提取所有匹配
  return text.match(numberPattern) || [];  // 如果没有匹配，返回空数组
}

const text = "价格是 99.99 元，数量是 10 个";
console.log(extractNumbers(text));  // ["99.99", "10"]

// ===== 示例 3：格式化手机号 =====

function formatPhoneNumber(phone) {
  // 1. 移除所有非数字字符
  const digits = phone.replace(/\D/g, "");  // \D 匹配非数字，g 全局替换
  
  // 2. 验证是否为 11 位手机号
  if (!/^\d{11}$/.test(digits)) {
    return "无效的手机号";
  }
  
  // 3. 格式化为 138-1234-5678
  // (\d{3}) 前三位
  // (\d{4}) 中间四位
  // (\d{4}) 后四位
  return digits.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
}

console.log(formatPhoneNumber("13812345678"));    // "138-1234-5678"
console.log(formatPhoneNumber("138 1234 5678"));  // "138-1234-5678"
console.log(formatPhoneNumber("138-1234-5678"));  // "138-1234-5678"

// ===== 示例 4：提取 URL 的各个部分 =====

function parseURL(url) {
  // 1. 定义 URL 正则表达式（使用命名捕获组）
  // (?<protocol>https?) 协议部分：http 或 https
  // :// 必须包含 ://
  // (?<host>[^/]+) 主机部分：非 / 字符，至少一个
  // (?<path>/.*)? 路径部分：可选，以 / 开头
  const urlPattern = /^(?<protocol>https?):\/\/(?<host>[^/]+)(?<path>\/.*)?$/;
  
  // 2. 执行匹配
  const match = url.match(urlPattern);
  
  // 3. 如果没有匹配，返回 null
  if (!match) {
    return null;
  }
  
  // 4. 返回解析结果
  return {
    protocol: match.groups.protocol,  // "https"
    host: match.groups.host,          // "example.com"
    path: match.groups.path || "/"     // "/path/to/page" 或 "/"
  };
}

const url = "https://example.com/path/to/page";
console.log(parseURL(url));
// { protocol: "https", host: "example.com", path: "/path/to/page" }

// ===== 示例 5：移除 HTML 标签 =====

function removeHTMLTags(html) {
  // 1. 定义 HTML 标签正则
  // < 开始标签
  // [^>]+ 一个或多个非 > 字符（标签名和属性）
  // > 结束标签
  // g 标志：全局匹配（移除所有标签）
  return html.replace(/<[^>]+>/g, "");
}

const html = "<div>Hello <span>World</span></div>";
console.log(removeHTMLTags(html));  // "Hello World"

// ===== 示例 6：验证密码强度 =====

function validatePassword(password) {
  // 1. 定义各种规则的正则
  const hasLower = /[a-z]/.test(password);      // 包含小写字母
  const hasUpper = /[A-Z]/.test(password);      // 包含大写字母
  const hasDigit = /\d/.test(password);         // 包含数字
  const hasSpecial = /[!@#$%^&*]/.test(password); // 包含特殊字符
  const hasLength = password.length >= 8;       // 长度至少 8 位
  
  // 2. 计算强度分数
  let strength = 0;
  if (hasLower) strength++;
  if (hasUpper) strength++;
  if (hasDigit) strength++;
  if (hasSpecial) strength++;
  if (hasLength) strength++;
  
  // 3. 返回强度等级
  if (strength <= 2) return "弱";
  if (strength <= 4) return "中";
  return "强";
}

console.log(validatePassword("abc123"));      // "弱"
console.log(validatePassword("Abc123!"));     // "中"
console.log(validatePassword("Abc123!@#XYZ")); // "强"
```

---

## 6. 常见错误与踩坑

### 错误 1：忘记转义特殊字符

**错误代码**：
```javascript
const pattern = /3.14/;  // 想匹配 "3.14"
console.log(pattern.test("3x14"));  // true（. 匹配任意字符）
```

**为什么错**：
- `.` 在正则中是特殊字符，匹配任意字符（除换行符外）
- 没有转义导致匹配了 "3x14" 而不是 "3.14"

**正确方式**：
```javascript
const pattern = /3\.14/;  // 转义点号
console.log(pattern.test("3.14"));  // true
console.log(pattern.test("3x14"));  // false
```

### 错误 2：全局标志导致的状态问题

**错误代码**：
```javascript
const pattern = /hello/g;
console.log(pattern.test("hello"));  // true
console.log(pattern.test("hello"));  // false（第二次调用返回 false）
```

**为什么错**：
- 使用 `g` 标志时，`test()` 和 `exec()` 会更新 `lastIndex` 属性
- 第一次匹配后，`lastIndex` 变为 5（匹配结束位置）
- 第二次从位置 5 开始匹配，找不到 "hello"，返回 false

**正确方式**：
```javascript
// 方式 1：不使用 g 标志（如果只需要测试一次）
const pattern = /hello/;
console.log(pattern.test("hello"));  // true
console.log(pattern.test("hello"));  // true

// 方式 2：重置 lastIndex
const pattern = /hello/g;
console.log(pattern.test("hello"));  // true
pattern.lastIndex = 0;  // 重置
console.log(pattern.test("hello"));  // true

// 方式 3：每次创建新正则
function testPattern(text) {
  return /hello/g.test(text);
}
```

### 错误 3：量词的贪婪匹配导致意外结果

**错误代码**：
```javascript
const html = "<div>content</div><div>more</div>";
const match = html.match(/<div>.*<\/div>/);
console.log(match[0]);  // "<div>content</div><div>more</div>"（匹配了整个字符串）
```

**为什么错**：
- `.*` 是贪婪匹配，会匹配尽可能多的字符
- 从第一个 `<div>` 开始，一直匹配到最后一个 `</div>`

**正确方式**：
```javascript
// 方式 1：使用非贪婪匹配
const match = html.match(/<div>.*?<\/div>/);
console.log(match[0]);  // "<div>content</div>"（只匹配第一个）

// 方式 2：使用更精确的模式
const match = html.match(/<div>[^<]*<\/div>/);  // [^<] 匹配非 < 字符
```

---

## 7. 实际应用场景

### 场景 1：表单验证

```javascript
// 验证各种表单输入
const validators = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^1[3-9]\d{9}$/,  // 中国手机号
  idCard: /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/,
  url: /^https?:\/\/.+/,
};

function validate(field, value) {
  const pattern = validators[field];
  return pattern ? pattern.test(value) : true;
}

console.log(validate("email", "user@example.com"));  // true
console.log(validate("phone", "13812345678"));        // true
```

### 场景 2：数据清洗

```javascript
// 清洗用户输入的数据
function cleanInput(input) {
  return input
    .trim()                           // 去除首尾空格
    .replace(/\s+/g, " ")            // 多个空格合并为一个
    .replace(/[^\w\s\u4e00-\u9fa5]/g, "");  // 只保留字母、数字、中文、空格
}

const dirty = "  hello    world!!!  ";
console.log(cleanInput(dirty));  // "hello world"
```

### 场景 3：文本高亮

```javascript
// 在文本中高亮关键词
function highlightText(text, keyword) {
  // 转义特殊字符，避免被当作正则
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`(${escaped})`, "gi");
  return text.replace(pattern, "<mark>$1</mark>");
}

const text = "Hello world, hello JavaScript";
console.log(highlightText(text, "hello"));
// "<mark>Hello</mark> world, <mark>hello</mark> JavaScript"
```

---

## 8. 给新手的练习题

### 基础题

**练习 1：验证手机号**
```javascript
// 任务：验证中国手机号（11位，以1开头，第二位是3-9）
function validatePhone(phone) {
  // 你的代码...
}

// 测试
console.log(validatePhone("13812345678"));  // true
console.log(validatePhone("12812345678"));  // false（第二位不是3-9）
console.log(validatePhone("1381234567"));   // false（不是11位）

// 参考答案：
function validatePhone(phone) {
  return /^1[3-9]\d{9}$/.test(phone);
}
```

**练习 2：提取所有邮箱**
```javascript
// 任务：从文本中提取所有邮箱地址
function extractEmails(text) {
  // 你的代码...
}

// 测试
const text = "联系我：user1@example.com 或 user2@test.com";
console.log(extractEmails(text));  // ["user1@example.com", "user2@test.com"]

// 参考答案：
function extractEmails(text) {
  const pattern = /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g;
  return text.match(pattern) || [];
}
```

### 进阶题

**练习 3：格式化日期字符串**
```javascript
// 任务：将 "2024-12-04" 格式化为 "2024年12月04日"
function formatDate(dateStr) {
  // 你的代码...
}

// 测试
console.log(formatDate("2024-12-04"));  // "2024年12月04日"

// 参考答案：
function formatDate(dateStr) {
  return dateStr.replace(/(\d{4})-(\d{2})-(\d{2})/, "$1年$2月$3日");
}
```

**练习 4：验证密码强度**
```javascript
// 任务：验证密码是否包含大小写字母、数字和特殊字符，长度至少8位
function isStrongPassword(password) {
  // 你的代码...
}

// 测试
console.log(isStrongPassword("Abc123!@"));  // true
console.log(isStrongPassword("abc123"));     // false（缺少大写和特殊字符）
console.log(isStrongPassword("Abc123"));    // false（缺少特殊字符）

// 参考答案：
function isStrongPassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/.test(password);
}
```

---

## 9. 用更简单的话再总结一遍（方便复习）

**RegExp 就是文本匹配的"万能钥匙"**：
- 创建：`/pattern/` 或 `new RegExp("pattern")`
- 标志：`i`（忽略大小写）、`g`（全局）、`m`（多行）
- 字符类：`\d`（数字）、`\w`（单词字符）、`\s`（空白）、`[abc]`（自定义）
- 量词：`*`（0次或多次）、`+`（1次或多次）、`?`（0次或1次）、`{n,m}`（n到m次）
- 位置：`^`（开头）、`$`（结尾）、`\b`（单词边界）
- 分组：`()`（捕获组）、`(?:)`（非捕获组）、`\1`（反向引用）
- 方法：`test()`（测试）、`exec()`（执行）、`match()`（匹配）、`replace()`（替换）

**记忆口诀**：
- **R**egular - 规则模式
- **E**xpression - 表达式
- **G**lobal - 全局匹配
- **E**scape - 转义特殊字符

---

## 10. 知识体系延伸 & 继续学习方向

### 继续学习方向

1. **相关内置对象**：
   - [[String]] - 字符串方法配合正则使用
   - [[Array]] - 处理正则匹配结果

2. **相关主题**：
   - [[数据类型]] - 理解 RegExp 是对象类型
   - [[函数]] - 在 replace 中使用函数

3. **进阶学习**：
   - [[正则表达式高级技巧]] - 复杂模式、性能优化
   - [[文本处理]] - 实际项目中的文本处理场景
   - [[表单验证]] - 完整的表单验证方案

### 遵守仓库规范

- 使用双链格式 `[[xxx]]` 链接相关知识点
- 参考 [[内置对象概述]] 了解内置对象分类
- 参考 [[!MOC-javascript]] 了解完整知识体系

---

**参考资源**：
- [MDN RegExp](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
- [正则表达式可视化工具](https://regexr.com/)
- [正则表达式测试工具](https://regex101.com/)

---

#javascript #RegExp #正则表达式 #内置对象 #文本匹配

