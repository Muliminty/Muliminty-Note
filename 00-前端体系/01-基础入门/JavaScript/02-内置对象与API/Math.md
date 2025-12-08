# Math 对象（Math Object）

> JavaScript Math 对象：数学运算的"计算器"，就像你手机上的计算器，能帮你做各种数学运算。

---

## 1. 一句话概括主题

Math 是 JavaScript 的内置对象，提供了常用的数学运算方法和常量，无需创建实例即可使用。

---

## 2. 它是什么

想象一下，Math 就像你手机上的计算器：
- **算数运算** → `Math.max()` 找最大值，`Math.min()` 找最小值
- **四舍五入** → `Math.round()` 四舍五入，`Math.floor()` 向下取整
- **随机数** → `Math.random()` 生成随机数
- **三角函数** → `Math.sin()`、`Math.cos()` 计算三角函数
- **幂运算** → `Math.pow()` 计算幂，`Math.sqrt()` 开平方

**举例**：
```javascript
// 就像用计算器一样
Math.max(1, 5, 3);      // 5 - 找最大值
Math.round(3.7);        // 4 - 四舍五入
Math.random();          // 0-1 之间的随机数
Math.sqrt(16);         // 4 - 开平方
```

---

## 3. 能解决什么问题 + 为什么重要

### 解决的问题

1. **数值计算**：最大值、最小值、绝对值等基本运算
2. **数值取整**：四舍五入、向上取整、向下取整
3. **随机数生成**：生成随机数用于抽奖、验证码等
4. **数学函数**：三角函数、对数函数、指数函数等
5. **数值比较**：比较多个数值的大小

### 为什么重要

- **日常开发必备**：很多业务逻辑需要数学计算
- **性能优化**：Math 方法经过优化，性能好
- **游戏开发**：游戏中的物理计算、随机事件都用到 Math
- **数据可视化**：图表绘制、动画效果都需要数学计算

---

## 4. 核心知识点拆解

### 4.1 Math 对象的特点

**静态对象**：
- Math 是静态对象，不需要创建实例
- 所有方法和属性都通过 `Math.` 访问
- 不能使用 `new Math()` 创建实例

```javascript
// ✅ 正确用法
Math.max(1, 2, 3);
Math.PI;

// ❌ 错误用法
const math = new Math();  // TypeError: Math is not a constructor
```

### 4.2 数学常量

```javascript
// Math.E - 自然对数的底数（约 2.718）
Math.E;  // 2.718281828459045

// Math.PI - 圆周率（约 3.14159）
Math.PI;  // 3.141592653589793

// Math.LN2 - 2 的自然对数（约 0.693）
Math.LN2;  // 0.6931471805599453

// Math.LN10 - 10 的自然对数（约 2.303）
Math.LN10;  // 2.302585092994046

// Math.LOG2E - 以 2 为底 E 的对数（约 1.443）
Math.LOG2E;  // 1.4426950408889634

// Math.LOG10E - 以 10 为底 E 的对数（约 0.434）
Math.LOG10E;  // 0.4342944819032518

// Math.SQRT2 - 2 的平方根（约 1.414）
Math.SQRT2;  // 1.4142135623730951

// Math.SQRT1_2 - 1/2 的平方根（约 0.707）
Math.SQRT1_2;  // 0.7071067811865476
```

### 4.3 取整方法

#### Math.round() - 四舍五入

```javascript
Math.round(3.4);   // 3
Math.round(3.5);   // 4
Math.round(3.6);   // 4
Math.round(-3.5);  // -3（注意：-3.5 四舍五入为 -3）
Math.round(-3.6);  // -4
```

#### Math.floor() - 向下取整（地板函数）

```javascript
Math.floor(3.7);   // 3
Math.floor(3.2);   // 3
Math.floor(-3.2);  // -4（向下取整，向负无穷方向）
```

#### Math.ceil() - 向上取整（天花板函数）

```javascript
Math.ceil(3.2);    // 4
Math.ceil(3.7);    // 4
Math.ceil(-3.2);   // -3（向上取整，向正无穷方向）
```

#### Math.trunc() - 截断小数部分（ES6）

```javascript
Math.trunc(3.7);   // 3
Math.trunc(3.2);   // 3
Math.trunc(-3.7);  // -3（直接截断，不四舍五入）
```

**取整方法对比**：
```javascript
const num = 3.7;
Math.round(num);  // 4（四舍五入）
Math.floor(num);  // 3（向下取整）
Math.ceil(num);   // 4（向上取整）
Math.trunc(num);  // 3（截断）

const negNum = -3.7;
Math.round(negNum);  // -4
Math.floor(negNum);  // -4（向负无穷）
Math.ceil(negNum);   // -3（向正无穷）
Math.trunc(negNum);  // -3（截断）
```

### 4.4 最大值和最小值

#### Math.max() - 返回最大值

```javascript
Math.max(1, 2, 3);        // 3
Math.max(1, 5, 3, 9, 2);  // 9
Math.max(-1, -5, -3);     // -1

// 处理数组
const numbers = [1, 5, 3, 9, 2];
Math.max(...numbers);     // 9（使用扩展运算符）
Math.max.apply(null, numbers);  // 9（使用 apply）
```

#### Math.min() - 返回最小值

```javascript
Math.min(1, 2, 3);        // 1
Math.min(1, 5, 3, 9, 2);  // 1
Math.min(-1, -5, -3);     // -5

// 处理数组
const numbers = [1, 5, 3, 9, 2];
Math.min(...numbers);     // 1
```

### 4.5 绝对值

#### Math.abs() - 返回绝对值

```javascript
Math.abs(5);    // 5
Math.abs(-5);   // 5
Math.abs(0);    // 0
Math.abs(-0);   // 0
```

### 4.6 随机数

#### Math.random() - 生成 0 到 1 之间的随机数

```javascript
Math.random();  // 0.0 到 1.0 之间的随机数（不含 1.0）

// 生成 0 到 n 之间的随机整数
function randomInt(n) {
  return Math.floor(Math.random() * n);
}

// 生成 min 到 max 之间的随机整数（包含 min 和 max）
function randomIntBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 生成 min 到 max 之间的随机浮点数
function randomFloatBetween(min, max) {
  return Math.random() * (max - min) + min;
}
```

**实际应用**：
```javascript
// 随机颜色
function randomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

// 随机数组元素
function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 随机打乱数组（Fisher-Yates 洗牌算法）
function shuffle(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
```

### 4.7 幂运算和开方

#### Math.pow() - 计算幂

```javascript
Math.pow(2, 3);   // 8（2 的 3 次方）
Math.pow(5, 2);    // 25（5 的平方）
Math.pow(16, 0.5); // 4（16 的 0.5 次方，即开平方）

// ES6 使用 ** 运算符（更简洁）
2 ** 3;   // 8
5 ** 2;   // 25
16 ** 0.5; // 4
```

#### Math.sqrt() - 开平方

```javascript
Math.sqrt(16);   // 4
Math.sqrt(25);   // 5
Math.sqrt(2);    // 1.4142135623730951
```

#### Math.cbrt() - 开立方（ES6）

```javascript
Math.cbrt(8);    // 2
Math.cbrt(27);   // 3
Math.cbrt(-8);   // -2
```

### 4.8 三角函数

```javascript
// Math.sin() - 正弦
Math.sin(0);           // 0
Math.sin(Math.PI / 2);  // 1

// Math.cos() - 余弦
Math.cos(0);           // 1
Math.cos(Math.PI / 2);  // 0（约等于，实际是 6.123...e-17）

// Math.tan() - 正切
Math.tan(0);           // 0
Math.tan(Math.PI / 4);  // 1（约等于）

// Math.asin() - 反正弦
Math.asin(0);          // 0
Math.asin(1);          // π/2

// Math.acos() - 反余弦
Math.acos(1);          // 0
Math.acos(0);          // π/2

// Math.atan() - 反正切
Math.atan(0);          // 0
Math.atan(1);          // π/4

// Math.atan2() - 两个参数的反正切（更常用）
Math.atan2(1, 1);      // π/4（计算角度）
```

**注意**：三角函数使用弧度制，不是角度制。

```javascript
// 角度转弧度
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

// 弧度转角度
function toDegrees(radians) {
  return radians * (180 / Math.PI);
}

Math.sin(toRadians(90));  // 1（90 度的正弦值）
```

### 4.9 对数函数

```javascript
// Math.log() - 自然对数（以 e 为底）
Math.log(Math.E);     // 1
Math.log(1);          // 0

// Math.log10() - 以 10 为底的对数（ES6）
Math.log10(100);      // 2
Math.log10(1000);     // 3

// Math.log2() - 以 2 为底的对数（ES6）
Math.log2(8);         // 3
Math.log2(16);        // 4

// 计算任意底数的对数
function logBase(base, x) {
  return Math.log(x) / Math.log(base);
}

logBase(2, 8);  // 3（以 2 为底 8 的对数）
```

### 4.10 其他数学方法

#### Math.sign() - 符号函数（ES6）

```javascript
Math.sign(5);    // 1（正数）
Math.sign(-5);   // -1（负数）
Math.sign(0);    // 0
Math.sign(-0);   // -0
Math.sign(NaN);  // NaN
```

#### Math.hypot() - 计算欧几里得距离（ES6）

```javascript
// 计算直角三角形的斜边长度
Math.hypot(3, 4);        // 5（√(3² + 4²) = 5）
Math.hypot(3, 4, 5);    // 约 7.07（三维空间距离）
```

#### Math.imul() - 32 位整数乘法（ES6）

```javascript
// 用于高性能计算
Math.imul(2, 4);  // 8
```

### 4.11 常见误解说明与纠正

#### 误解 1：Math 需要创建实例

❌ **错误理解**：
```javascript
const math = new Math();  // ❌ 错误
math.max(1, 2, 3);
```

✅ **正确理解**：
- Math 是静态对象，不需要创建实例
- 直接使用 `Math.方法名()` 调用

```javascript
Math.max(1, 2, 3);  // ✅ 正确
```

#### 误解 2：Math.random() 生成整数

❌ **错误理解**：
```javascript
Math.random();  // 返回 0-1 之间的浮点数，不是整数
```

✅ **正确理解**：
- `Math.random()` 返回 0 到 1 之间的浮点数（不含 1.0）
- 需要配合 `Math.floor()` 才能生成整数

```javascript
// 生成 0-9 的随机整数
Math.floor(Math.random() * 10);

// 生成 1-10 的随机整数
Math.floor(Math.random() * 10) + 1;
```

#### 误解 3：Math.round() 总是向上取整

❌ **错误理解**：
```javascript
Math.round(3.5);  // 4（向上）
Math.round(-3.5); // -3（不是 -4，注意负数的情况）
```

✅ **正确理解**：
- `Math.round()` 是四舍五入，不是简单的向上取整
- 对于负数，`-3.5` 四舍五入为 `-3`（向 0 方向）

```javascript
Math.round(3.5);   // 4
Math.round(-3.5);  // -3（不是 -4）
Math.floor(-3.5);  // -4（向下取整）
Math.ceil(-3.5);   // -3（向上取整）
```

---

## 5. 示例代码（可运行 + 逐行注释）

```javascript
// ===== 示例 1：计算数组的最大值和最小值 =====

const numbers = [23, 45, 12, 67, 34, 89, 56];

// 1. 使用扩展运算符
const max = Math.max(...numbers);  // 89 - 展开数组作为参数
const min = Math.min(...numbers);  // 12

// 2. 使用 apply（ES5 方式）
const max2 = Math.max.apply(null, numbers);  // 89
const min2 = Math.min.apply(null, numbers);  // 12

console.log({ max, min });

// ===== 示例 2：生成随机验证码 =====

function generateCode(length = 6) {
  // 1. 定义字符集（数字和字母）
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";
  
  // 2. 循环生成指定长度的验证码
  for (let i = 0; i < length; i++) {
    // 3. 随机选择一个字符
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }
  
  return code;
}

console.log(generateCode(6));   // "A3B9K2"
console.log(generateCode(4));   // "7X2M"

// ===== 示例 3：格式化数字（保留小数位） =====

function formatNumber(num, decimals = 2) {
  // 1. 乘以 10 的 decimals 次方
  const multiplier = Math.pow(10, decimals);
  
  // 2. 四舍五入
  const rounded = Math.round(num * multiplier);
  
  // 3. 除以 10 的 decimals 次方，恢复小数位
  return rounded / multiplier;
}

console.log(formatNumber(3.14159, 2));  // 3.14
console.log(formatNumber(3.14159, 3));  // 3.142
console.log(formatNumber(3.1, 2));      // 3.1

// ===== 示例 4：计算两点之间的距离 =====

function distance(x1, y1, x2, y2) {
  // 1. 计算 x 和 y 的差值
  const dx = x2 - x1;
  const dy = y2 - y1;
  
  // 2. 使用勾股定理计算距离
  // 距离 = √(dx² + dy²)
  return Math.sqrt(dx * dx + dy * dy);
  
  // 或者使用 Math.hypot（更简洁）
  // return Math.hypot(dx, dy);
}

console.log(distance(0, 0, 3, 4));  // 5（3-4-5 直角三角形）

// ===== 示例 5：生成随机颜色 =====

function randomColor() {
  // 1. 生成 0-255 之间的随机整数（RGB 值）
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  
  // 2. 返回 RGB 格式的颜色
  return `rgb(${r}, ${g}, ${b})`;
  
  // 或者返回十六进制格式
  // return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

console.log(randomColor());  // "rgb(123, 45, 67)"

// ===== 示例 6：计算圆的面积和周长 =====

function circleInfo(radius) {
  // 1. 计算面积：π × r²
  const area = Math.PI * Math.pow(radius, 2);
  
  // 2. 计算周长：2 × π × r
  const circumference = 2 * Math.PI * radius;
  
  return {
    radius,
    area: Math.round(area * 100) / 100,  // 保留两位小数
    circumference: Math.round(circumference * 100) / 100
  };
}

console.log(circleInfo(5));
// { radius: 5, area: 78.54, circumference: 31.42 }

// ===== 示例 7：限制数值范围（夹紧函数） =====

function clamp(value, min, max) {
  // 1. 如果值小于最小值，返回最小值
  // 2. 如果值大于最大值，返回最大值
  // 3. 否则返回原值
  return Math.min(Math.max(value, min), max);
}

console.log(clamp(15, 0, 10));   // 10（超过最大值）
console.log(clamp(-5, 0, 10));   // 0（小于最小值）
console.log(clamp(5, 0, 10));     // 5（在范围内）

// ===== 示例 8：计算百分比 =====

function percentage(value, total) {
  // 1. 计算百分比
  const percent = (value / total) * 100;
  
  // 2. 四舍五入到整数
  return Math.round(percent);
}

console.log(percentage(25, 100));  // 25
console.log(percentage(1, 3));    // 33（四舍五入）
```

---

## 6. 常见错误与踩坑

### 错误 1：Math.random() 的范围理解错误

**错误代码**：
```javascript
// 想生成 1-10 的随机整数
const num = Math.random() * 10;  // 0-10 之间的浮点数，不是整数
```

**为什么错**：
- `Math.random()` 返回 0-1 之间的浮点数
- 需要配合 `Math.floor()` 才能得到整数
- 范围计算错误

**正确方式**：
```javascript
// 生成 1-10 的随机整数（包含 1 和 10）
const num = Math.floor(Math.random() * 10) + 1;

// 通用公式：生成 min-max 的随机整数（包含 min 和 max）
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
```

### 错误 2：Math.max() 不能直接处理数组

**错误代码**：
```javascript
const numbers = [1, 5, 3, 9, 2];
Math.max(numbers);  // NaN（不能直接传数组）
```

**为什么错**：
- `Math.max()` 接受多个参数，不接受数组
- 需要展开数组或使用 `apply()`

**正确方式**：
```javascript
// 方式 1：使用扩展运算符（推荐）
const max = Math.max(...numbers);

// 方式 2：使用 apply
const max2 = Math.max.apply(null, numbers);

// 方式 3：使用 reduce
const max3 = numbers.reduce((a, b) => Math.max(a, b));
```

### 错误 3：负数取整的误解

**错误代码**：
```javascript
// 误解：认为 Math.round(-3.5) 会得到 -4
Math.round(-3.5);  // -3（不是 -4）
```

**为什么错**：
- `Math.round()` 是四舍五入，对于 `-3.5`，它向 0 方向取整，得到 `-3`
- 如果需要向下取整，应该使用 `Math.floor()`

**正确方式**：
```javascript
const num = -3.5;

Math.round(num);  // -3（四舍五入）
Math.floor(num);  // -4（向下取整，向负无穷）
Math.ceil(num);   // -3（向上取整，向正无穷）
Math.trunc(num);  // -3（截断）

// 根据需求选择合适的方法
```

---

## 7. 实际应用场景

### 场景 1：数据可视化

```javascript
// 计算图表数据的最大值和最小值
function getChartRange(data) {
  const values = data.flat();  // 展平多维数组
  return {
    min: Math.min(...values),
    max: Math.max(...values),
    range: Math.max(...values) - Math.min(...values)
  };
}

const chartData = [[10, 20, 30], [15, 25, 35], [5, 15, 25]];
console.log(getChartRange(chartData));
// { min: 5, max: 35, range: 30 }
```

### 场景 2：游戏开发

```javascript
// 随机生成敌人位置
function spawnEnemy() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    health: Math.floor(Math.random() * 100) + 50  // 50-150 的生命值
  };
}

// 计算伤害（带随机波动）
function calculateDamage(baseDamage) {
  const variance = 0.2;  // 20% 的波动
  const min = baseDamage * (1 - variance);
  const max = baseDamage * (1 + variance);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
```

### 场景 3：价格计算

```javascript
// 计算折扣后的价格（保留两位小数）
function calculatePrice(originalPrice, discount) {
  const discounted = originalPrice * (1 - discount);
  return Math.round(discounted * 100) / 100;  // 保留两位小数
}

console.log(calculatePrice(99.99, 0.2));  // 79.99（8 折）
```

### 场景 4：分页计算

```javascript
// 计算总页数
function getTotalPages(totalItems, itemsPerPage) {
  return Math.ceil(totalItems / itemsPerPage);  // 向上取整
}

console.log(getTotalPages(100, 10));  // 10 页
console.log(getTotalPages(101, 10));  // 11 页（需要多一页）
```

---

## 8. 给新手的练习题

### 基础题

**练习 1：找最大值和最小值**
```javascript
// 任务：找出数组中的最大值和最小值
const numbers = [23, 45, 12, 67, 34, 89, 56];
// 你的代码...

// 参考答案：
const max = Math.max(...numbers);  // 89
const min = Math.min(...numbers);   // 12
```

**练习 2：生成随机数**
```javascript
// 任务：生成 1-100 之间的随机整数
// 你的代码...

// 参考答案：
const randomNum = Math.floor(Math.random() * 100) + 1;
```

**练习 3：四舍五入**
```javascript
// 任务：将 3.14159 四舍五入保留 2 位小数
const num = 3.14159;
// 你的代码...

// 参考答案：
const rounded = Math.round(num * 100) / 100;  // 3.14
```

### 进阶题

**练习 4：计算两点距离**
```javascript
// 任务：计算点 (0, 0) 和点 (3, 4) 之间的距离
function distance(x1, y1, x2, y2) {
  // 你的代码...
}

// 测试
console.log(distance(0, 0, 3, 4));  // 应该输出 5

// 参考答案：
function distance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
  // 或使用 Math.hypot(dx, dy);
}
```

**练习 5：限制数值范围**
```javascript
// 任务：实现 clamp 函数，将值限制在 min 和 max 之间
function clamp(value, min, max) {
  // 你的代码...
}

// 测试
console.log(clamp(15, 0, 10));   // 应该输出 10
console.log(clamp(-5, 0, 10));   // 应该输出 0
console.log(clamp(5, 0, 10));    // 应该输出 5

// 参考答案：
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
```

---

## 9. 用更简单的话再总结一遍（方便复习）

**Math 就是数学运算的"计算器"**：
- 不需要创建实例，直接使用 `Math.方法名()`
- 常用方法：`max()`、`min()`、`round()`、`floor()`、`ceil()`、`random()`、`sqrt()`、`pow()`
- 常用常量：`Math.PI`（圆周率）、`Math.E`（自然对数底数）
- `Math.random()` 生成 0-1 之间的随机数，需要配合 `Math.floor()` 生成整数
- `Math.max()` 和 `Math.min()` 不能直接处理数组，需要使用扩展运算符

**记忆口诀**：
- **M**ax/Min - 最大值/最小值
- **A**bs - 绝对值
- **T**runc/Round - 截断/四舍五入
- **H**ypot - 距离计算

---

## 10. 知识体系延伸 & 继续学习方向

### 继续学习方向

1. **相关内置对象**：
   - [[Number]] - 数字类型和 Number 对象
   - [[Array]] - 数组的数学运算

2. **相关主题**：
   - [[数据类型]] - 理解数字类型
   - [[运算符]] - 数学运算符

3. **进阶学习**：
   - [[算法]] - 数学算法实现
   - [[数据可视化]] - 图表绘制中的数学计算
   - [[游戏开发]] - 游戏中的物理计算

### 遵守仓库规范

- 使用双链格式 `[[xxx]]` 链接相关知识点
- 参考 [[内置对象概述]] 了解内置对象分类
- 参考 [[!MOC-javascript]] 了解完整知识体系

---

**参考资源**：
- [MDN Math](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math)
- [Math.js 库](https://mathjs.org/) - 更强大的数学计算库

---

#javascript #Math #内置对象 #数学运算 #数值计算

