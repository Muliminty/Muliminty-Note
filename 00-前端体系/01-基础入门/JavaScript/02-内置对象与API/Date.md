# Date 对象（Date Object）

> JavaScript 日期对象：处理时间和日期的工具，就像你手机上的日历和时钟合二为一。

---

## 1. 一句话概括主题

Date 是 JavaScript 的内置对象，用于处理日期和时间，提供了创建、获取、设置和格式化日期的方法。

---

## 2. 它是什么

想象一下，Date 就像你手机上的日历和时钟：
- **看时间** → `new Date()` 获取当前时间
- **设置闹钟** → `setHours()`、`setMinutes()` 设置特定时间
- **计算倒计时** → 两个日期相减得到时间差
- **格式化显示** → 将日期转换为 "2024-12-04" 这样的格式

**举例**：
```javascript
// 就像看手机上的时间一样
const now = new Date();  // 获取当前时间
console.log(now.getFullYear());  // 2024 - 看年份
console.log(now.getMonth() + 1);  // 12 - 看月份（注意要+1）
```

---

## 3. 能解决什么问题 + 为什么重要

### 解决的问题

1. **时间显示**：在页面上显示当前时间、日期
2. **时间计算**：计算两个日期之间的差值（倒计时、年龄等）
3. **时间格式化**：将日期转换为各种格式（"2024-12-04"、"12/04/2024" 等）
4. **时间验证**：验证用户输入的日期是否有效
5. **定时任务**：配合 `setTimeout`、`setInterval` 实现定时功能

### 为什么重要

- **日常开发必备**：几乎所有应用都需要处理时间
- **用户体验关键**：正确的时间显示和计算提升用户体验
- **业务逻辑核心**：订单时间、活动时间等业务逻辑都依赖日期处理
- **面试必考**：日期处理是前端面试常见考点

---

## 4. 核心知识点拆解

### 4.1 创建 Date 对象

#### 当前时间

```javascript
const now = new Date();  // 创建当前时间的 Date 对象
console.log(now);  // 2024-12-04T10:30:00.000Z（ISO 格式）
```

#### 指定时间创建

**方式 1：传入时间戳（毫秒）**
```javascript
const date1 = new Date(1701676800000);  // 2024-01-04 00:00:00
```

**方式 2：传入日期字符串**
```javascript
const date2 = new Date("2024-12-04");        // 2024-12-04 00:00:00
const date3 = new Date("2024-12-04 10:30:00");  // 2024-12-04 10:30:00
const date4 = new Date("December 4, 2024");  // 2024-12-04 00:00:00
```

**方式 3：传入年月日等参数**
```javascript
// new Date(year, monthIndex, day, hours, minutes, seconds, milliseconds)
const date5 = new Date(2024, 11, 4);  // 2024-12-04 00:00:00（注意：月份从 0 开始）
const date6 = new Date(2024, 11, 4, 10, 30, 0);  // 2024-12-04 10:30:00
```

**⚠️ 重要注意**：月份参数从 **0** 开始（0 = 1月，11 = 12月）

#### Date.now() - 获取当前时间戳

```javascript
const timestamp = Date.now();  // 1701676800000（毫秒数）
const date = new Date(timestamp);  // 转换为 Date 对象
```

#### Date.parse() - 解析日期字符串

```javascript
const timestamp = Date.parse("2024-12-04");  // 1701676800000
const date = new Date(timestamp);
```

### 4.2 获取日期和时间

#### 获取年份、月份、日期

```javascript
const date = new Date(2024, 11, 4, 10, 30, 0);

console.log(date.getFullYear());  // 2024 - 年份（4位数）
console.log(date.getYear());      // 124 - 年份（相对于1900，已废弃）
console.log(date.getMonth());     // 11 - 月份（0-11，注意要+1）
console.log(date.getDate());      // 4 - 日期（1-31）
console.log(date.getDay());       // 3 - 星期几（0=周日，1=周一...6=周六）
```

#### 获取时间（时、分、秒、毫秒）

```javascript
const date = new Date(2024, 11, 4, 10, 30, 45, 500);

console.log(date.getHours());    // 10 - 小时（0-23）
console.log(date.getMinutes());  // 30 - 分钟（0-59）
console.log(date.getSeconds());  // 45 - 秒（0-59）
console.log(date.getMilliseconds());  // 500 - 毫秒（0-999）
```

#### 获取时间戳

```javascript
const date = new Date();
console.log(date.getTime());      // 1701676800000 - 时间戳（毫秒）
console.log(date.valueOf());     // 1701676800000 - 同上
console.log(+date);              // 1701676800000 - 同上（简写）
```

#### UTC 时间方法

```javascript
const date = new Date(2024, 11, 4, 10, 30, 0);

// UTC 时间（协调世界时）
console.log(date.getUTCFullYear());  // 2024
console.log(date.getUTCMonth());     // 11
console.log(date.getUTCDate());      // 4
console.log(date.getUTCHours());     // 2（UTC 时间，比本地时间少8小时）
```

### 4.3 设置日期和时间

#### 设置年份、月份、日期

```javascript
const date = new Date();
date.setFullYear(2025);  // 设置年份
date.setMonth(0);        // 设置月份（0=1月）
date.setDate(15);        // 设置日期
```

#### 设置时间

```javascript
const date = new Date();
date.setHours(14);       // 设置小时
date.setMinutes(30);     // 设置分钟
date.setSeconds(0);      // 设置秒
date.setMilliseconds(0); // 设置毫秒
```

#### 设置时间戳

```javascript
const date = new Date();
date.setTime(1701676800000);  // 通过时间戳设置
```

### 4.4 日期格式化

#### 转换为字符串

```javascript
const date = new Date(2024, 11, 4, 10, 30, 0);

console.log(date.toString());      // "Wed Dec 04 2024 10:30:00 GMT+0800"
console.log(date.toDateString());   // "Wed Dec 04 2024"
console.log(date.toTimeString());   // "10:30:00 GMT+0800"
console.log(date.toISOString());    // "2024-12-04T02:30:00.000Z"（UTC时间）
console.log(date.toLocaleString()); // "2024/12/4 10:30:00"（本地格式）
console.log(date.toLocaleDateString()); // "2024/12/4"
console.log(date.toLocaleTimeString()); // "10:30:00"
```

#### 自定义格式化函数

```javascript
function formatDate(date, format = "YYYY-MM-DD") {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  
  return format
    .replace("YYYY", year)
    .replace("MM", month)
    .replace("DD", day)
    .replace("HH", hours)
    .replace("mm", minutes)
    .replace("ss", seconds);
}

const date = new Date(2024, 11, 4, 10, 30, 0);
console.log(formatDate(date));              // "2024-12-04"
console.log(formatDate(date, "YYYY/MM/DD")); // "2024/12/04"
console.log(formatDate(date, "YYYY-MM-DD HH:mm:ss")); // "2024-12-04 10:30:00"
```

### 4.5 日期计算

#### 时间差计算

```javascript
const date1 = new Date(2024, 0, 1);   // 2024-01-01
const date2 = new Date(2024, 11, 31); // 2024-12-31

const diff = date2 - date1;  // 时间差（毫秒）
const days = Math.floor(diff / (1000 * 60 * 60 * 24));  // 天数差
console.log(days);  // 365
```

#### 日期加减

```javascript
// 加一天
const date = new Date();
date.setDate(date.getDate() + 1);  // 明天

// 加一个月
date.setMonth(date.getMonth() + 1);

// 加一年
date.setFullYear(date.getFullYear() + 1);

// 使用时间戳加减（更灵活）
const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);  // 加一天
```

### 4.6 日期比较

```javascript
const date1 = new Date(2024, 0, 1);
const date2 = new Date(2024, 11, 31);

console.log(date1 < date2);   // true
console.log(date1 > date2);   // false
console.log(date1.getTime() === date2.getTime());  // false（严格比较）
```

### 4.7 常见误解说明与纠正

#### 误解 1：月份从 1 开始

❌ **错误理解**：
```javascript
const date = new Date(2024, 12, 4);  // 错误！12 月应该是 11
```

✅ **正确理解**：
- 月份参数从 **0** 开始（0 = 1月，11 = 12月）
- `getMonth()` 返回的也是 0-11

```javascript
const date = new Date(2024, 11, 4);  // 2024年12月4日
console.log(date.getMonth());  // 11（需要 +1 才是实际月份）
console.log(date.getMonth() + 1);  // 12（实际月份）
```

#### 误解 2：Date 对象是可变的

❌ **错误理解**：
```javascript
const date1 = new Date();
const date2 = date1;
date2.setDate(15);
console.log(date1.getDate());  // 15（date1 也被修改了）
```

✅ **正确理解**：
- Date 对象是**可变的**（mutable）
- 赋值是引用传递，不是值传递
- 需要创建新对象来避免修改原对象

```javascript
const date1 = new Date();
const date2 = new Date(date1);  // 创建新对象
date2.setDate(15);
console.log(date1.getDate());  // 原日期不变
console.log(date2.getDate());  // 15
```

#### 误解 3：时区问题

❌ **错误理解**：
```javascript
const date = new Date("2024-12-04");
console.log(date.getDate());  // 可能是 3 或 4，取决于时区
```

✅ **正确理解**：
- 日期字符串解析可能受时区影响
- 使用 `new Date(year, month, day)` 创建本地时间更可靠

```javascript
// 推荐：使用参数创建（本地时间）
const date1 = new Date(2024, 11, 4);  // 本地时间 2024-12-04

// 注意：字符串解析可能有时区问题
const date2 = new Date("2024-12-04");  // 可能是 UTC 时间
```

---

## 5. 示例代码（可运行 + 逐行注释）

```javascript
// ===== 示例 1：格式化当前时间 =====

function getCurrentTime() {
  // 1. 获取当前时间
  const now = new Date();
  
  // 2. 获取各个时间部分
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");  // 月份+1，补零
  const day = String(now.getDate()).padStart(2, "0");  // 日期补零
  const hours = String(now.getHours()).padStart(2, "0");  // 小时补零
  const minutes = String(now.getMinutes()).padStart(2, "0");  // 分钟补零
  const seconds = String(now.getSeconds()).padStart(2, "0");  // 秒补零
  
  // 3. 组合成格式化字符串
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

console.log(getCurrentTime());  // "2024-12-04 10:30:45"

// ===== 示例 2：计算两个日期的天数差 =====

function daysBetween(date1, date2) {
  // 1. 计算时间差（毫秒）
  const diff = Math.abs(date2 - date1);  // 使用绝对值，确保结果为正
  
  // 2. 转换为天数
  const oneDay = 24 * 60 * 60 * 1000;  // 一天的毫秒数
  return Math.floor(diff / oneDay);  // 向下取整
}

const d1 = new Date(2024, 0, 1);   // 2024-01-01
const d2 = new Date(2024, 11, 31); // 2024-12-31
console.log(daysBetween(d1, d2));  // 365

// ===== 示例 3：计算年龄 =====

function calculateAge(birthDate) {
  // 1. 获取当前日期
  const today = new Date();
  
  // 2. 计算年龄
  let age = today.getFullYear() - birthDate.getFullYear();
  
  // 3. 检查是否还没过生日
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;  // 还没过生日，年龄减1
  }
  
  return age;
}

const birthDate = new Date(1999, 5, 15);  // 1999-06-15
console.log(calculateAge(birthDate));  // 25（假设当前是2024年）

// ===== 示例 4：获取本周的开始和结束日期 =====

function getWeekRange(date = new Date()) {
  // 1. 获取当前是星期几（0=周日，1=周一...）
  const day = date.getDay();
  
  // 2. 计算本周一的日期（如果今天是周日，则周一是7天前）
  const mondayOffset = day === 0 ? -6 : 1 - day;  // 周一到当前日期的天数差
  const monday = new Date(date);
  monday.setDate(date.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);  // 设置为当天的 00:00:00
  
  // 3. 计算本周日的日期
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);  // 设置为当天的 23:59:59
  
  return { start: monday, end: sunday };
}

const week = getWeekRange();
console.log(week.start);  // 本周一 00:00:00
console.log(week.end);    // 本周日 23:59:59

// ===== 示例 5：倒计时功能 =====

function countdown(targetDate) {
  // 1. 获取当前时间和目标时间
  const now = new Date();
  const target = new Date(targetDate);
  
  // 2. 计算时间差
  const diff = target - now;
  
  // 3. 如果已经过了目标时间
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  
  // 4. 计算各个时间单位
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds };
}

const target = new Date(2024, 11, 25, 0, 0, 0);  // 2024-12-25 00:00:00
const remaining = countdown(target);
console.log(`距离目标还有：${remaining.days}天 ${remaining.hours}小时 ${remaining.minutes}分钟 ${remaining.seconds}秒`);
```

---

## 6. 常见错误与踩坑

### 错误 1：月份从 1 开始

**错误代码**：
```javascript
const date = new Date(2024, 12, 4);  // 错误！12 月应该是 11
console.log(date.getMonth());  // 0（实际是 2025年1月）
```

**为什么错**：
- Date 的月份参数从 0 开始（0 = 1月，11 = 12月）
- 传入 12 会被当作下一年的 1 月

**正确方式**：
```javascript
const date = new Date(2024, 11, 4);  // 2024年12月4日
console.log(date.getMonth() + 1);  // 12（显示时+1）
```

### 错误 2：日期对象引用问题

**错误代码**：
```javascript
const date1 = new Date();
const date2 = date1;  // 引用传递
date2.setDate(15);
console.log(date1.getDate());  // 15（date1 也被修改了）
```

**为什么错**：
- Date 对象是引用类型
- 直接赋值是引用传递，不是值传递
- 修改 date2 会影响 date1

**正确方式**：
```javascript
// 方式 1：创建新对象
const date1 = new Date();
const date2 = new Date(date1);  // 创建新对象
date2.setDate(15);
console.log(date1.getDate());  // 原日期不变

// 方式 2：使用时间戳
const date1 = new Date();
const date2 = new Date(date1.getTime());  // 通过时间戳创建新对象
```

### 错误 3：时区问题导致日期错误

**错误代码**：
```javascript
const date = new Date("2024-12-04");  // 可能解析为 UTC 时间
console.log(date.getDate());  // 可能是 3（取决于时区）
```

**为什么错**：
- 日期字符串解析可能受时区影响
- "2024-12-04" 可能被解析为 UTC 时间的 00:00:00
- 转换为本地时间后可能变成前一天的日期

**正确方式**：
```javascript
// 方式 1：使用参数创建（推荐）
const date = new Date(2024, 11, 4);  // 本地时间

// 方式 2：明确指定时间
const date = new Date("2024-12-04T00:00:00+08:00");  // 明确时区
```

---

## 7. 实际应用场景

### 场景 1：显示相对时间

```javascript
// "刚刚"、"5分钟前"、"2小时前"、"3天前"
function getRelativeTime(date) {
  const now = new Date();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (seconds < 60) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 30) return `${days}天前`;
  return date.toLocaleDateString();
}

const postDate = new Date(Date.now() - 5 * 60 * 1000);  // 5分钟前
console.log(getRelativeTime(postDate));  // "5分钟前"
```

### 场景 2：日期范围选择

```javascript
// 验证日期是否在范围内
function isDateInRange(date, startDate, endDate) {
  const d = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  d.setHours(0, 0, 0, 0);
  
  return d >= start && d <= end;
}

const selected = new Date(2024, 11, 15);
const start = new Date(2024, 11, 1);
const end = new Date(2024, 11, 31);
console.log(isDateInRange(selected, start, end));  // true
```

### 场景 3：工作日计算

```javascript
// 计算两个日期之间的工作日（排除周末）
function getWorkdays(startDate, endDate) {
  let count = 0;
  const current = new Date(startDate);
  const end = new Date(endDate);
  
  while (current <= end) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) {  // 不是周日(0)和周六(6)
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
}

const start = new Date(2024, 11, 1);  // 2024-12-01（周日）
const end = new Date(2024, 11, 7);    // 2024-12-07（周六）
console.log(getWorkdays(start, end));  // 5（周一到周五）
```

---

## 8. 给新手的练习题

### 基础题

**练习 1：格式化日期**
```javascript
// 任务：将日期格式化为 "2024年12月4日"
function formatChineseDate(date) {
  // 你的代码...
}

// 测试
const date = new Date(2024, 11, 4);
console.log(formatChineseDate(date));  // "2024年12月4日"

// 参考答案：
function formatChineseDate(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
}
```

**练习 2：判断是否为今天**
```javascript
// 任务：判断一个日期是否为今天
function isToday(date) {
  // 你的代码...
}

// 测试
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
console.log(isToday(today));      // true
console.log(isToday(yesterday));  // false

// 参考答案：
function isToday(date) {
  const today = new Date();
  return date.getFullYear() === today.getFullYear() &&
         date.getMonth() === today.getMonth() &&
         date.getDate() === today.getDate();
}
```

### 进阶题

**练习 3：获取本月的第一天和最后一天**
```javascript
// 任务：获取指定日期所在月份的第一天和最后一天
function getMonthRange(date) {
  // 你的代码...
  return { firstDay, lastDay };
}

// 测试
const date = new Date(2024, 11, 15);
const range = getMonthRange(date);
console.log(range.firstDay);  // 2024-12-01
console.log(range.lastDay);   // 2024-12-31

// 参考答案：
function getMonthRange(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);  // 下个月的第0天 = 本月的最后一天
  
  return { firstDay, lastDay };
}
```

**练习 4：计算两个日期之间的所有日期**
```javascript
// 任务：返回两个日期之间的所有日期数组
function getDatesBetween(startDate, endDate) {
  // 你的代码...
}

// 测试
const start = new Date(2024, 11, 1);
const end = new Date(2024, 11, 5);
console.log(getDatesBetween(start, end));
// [2024-12-01, 2024-12-02, 2024-12-03, 2024-12-04, 2024-12-05]

// 参考答案：
function getDatesBetween(startDate, endDate) {
  const dates = [];
  const current = new Date(startDate);
  const end = new Date(endDate);
  
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}
```

---

## 9. 用更简单的话再总结一遍（方便复习）

**Date 就是处理时间的工具箱**：
- 创建：`new Date()` 获取当前时间，`new Date(2024, 11, 4)` 创建指定日期
- **重要**：月份从 0 开始（0=1月，11=12月），`getMonth()` 返回 0-11
- 获取：`getFullYear()`、`getMonth()`、`getDate()`、`getHours()` 等
- 设置：`setFullYear()`、`setMonth()`、`setDate()` 等
- 计算：两个日期相减得到时间差（毫秒），再转换为天数、小时等
- 格式化：使用 `toLocaleString()` 或自定义函数格式化显示

**记忆口诀**：
- **D**ate - 日期对象
- **A**dd/Subtract - 加减日期
- **T**ime - 时间戳
- **E**rror - 注意月份从0开始

---

## 10. 知识体系延伸 & 继续学习方向

### 继续学习方向

1. **相关内置对象**：
   - [[String]] - 字符串格式化（日期转字符串）
   - [[Math]] - 数学运算（日期计算）

2. **相关主题**：
   - [[数据类型]] - 理解 Date 是对象类型
   - [[定时器]] - `setTimeout`、`setInterval` 配合 Date 使用

3. **进阶学习**：
   - [[国际化]] - 多时区日期处理
   - [[日期库]] - moment.js、day.js 等第三方库
   - [[性能优化]] - 日期操作的性能优化

### 遵守仓库规范

- 使用双链格式 `[[xxx]]` 链接相关知识点
- 参考 [[内置对象概述]] 了解内置对象分类
- 参考 [[!MOC-javascript]] 了解完整知识体系

---

**参考资源**：
- [MDN Date](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date)
- [ECMAScript Date Objects](https://tc39.es/ecma262/#sec-date-objects)

---

#javascript #Date #内置对象 #日期处理

