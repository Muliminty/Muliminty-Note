# Array 对象（Array Object）

> JavaScript 数组对象：创建、访问、操作方法和使用技巧
> 
> **学习路径**：
> - 📖 **入门**：数组基础、常用方法
> - 🚀 **进阶**：数组迭代、高级方法、性能优化
> - 💡 **高级**：数组扩展、类数组转换、最佳实践

---

## 📚 知识体系

### 1. 数组基础（Array Basics）

#### 1.1 数组创建

**字面量创建**：
```javascript
const arr1 = [1, 2, 3];
const arr2 = ['a', 'b', 'c'];
const arr3 = [1, 'a', true, null, undefined];
const arr4 = [];  // 空数组
```

**构造函数创建**：
```javascript
const arr1 = new Array();        // 空数组
const arr2 = new Array(5);       // 长度为 5 的稀疏数组
const arr3 = new Array(1, 2, 3); // [1, 2, 3]
```

**Array.of() 创建**（ES6）：
```javascript
Array.of(1, 2, 3);      // [1, 2, 3]
Array.of(5);            // [5]（不是长度为 5 的数组）
Array.of();             // []
```

**Array.from() 创建**（ES6）：
```javascript
// 从类数组对象创建
Array.from('hello');              // ['h', 'e', 'l', 'l', 'o']
Array.from({ length: 5 });        // [undefined, undefined, undefined, undefined, undefined]
Array.from({ length: 5 }, (_, i) => i); // [0, 1, 2, 3, 4]

// 从可迭代对象创建
Array.from(new Set([1, 2, 3]));   // [1, 2, 3]
```

#### 1.2 数组访问

**索引访问**：
```javascript
const arr = [1, 2, 3];
arr[0];        // 1
arr[1];        // 2
arr[arr.length - 1]; // 3（最后一个元素）
```

**数组属性**：
```javascript
const arr = [1, 2, 3];
arr.length;    // 3
arr.length = 5; // 扩展数组长度
arr.length = 2; // 截断数组
```

**稀疏数组**：
```javascript
const arr = [1, , 3];  // 稀疏数组，索引 1 处为空
arr[1];                // undefined
arr.length;            // 3
'1' in arr;            // false（索引 1 不存在）
```

#### 1.3 数组检测

**Array.isArray()**：
```javascript
Array.isArray([1, 2, 3]);    // true
Array.isArray({});            // false
Array.isArray('hello');       // false
Array.isArray(null);          // false
```

**instanceof 检测**：
```javascript
[1, 2, 3] instanceof Array;   // true
```

---

### 2. 修改原数组的方法（Mutator Methods）

这些方法会修改原数组。

#### 2.1 添加元素

**push()** - 在数组末尾添加元素：
```javascript
const arr = [1, 2, 3];
arr.push(4);           // 返回新长度 4
arr.push(5, 6);        // 返回新长度 6
console.log(arr);      // [1, 2, 3, 4, 5, 6]
```

**unshift()** - 在数组开头添加元素：
```javascript
const arr = [1, 2, 3];
arr.unshift(0);        // 返回新长度 4
arr.unshift(-1, -2);   // 返回新长度 6
console.log(arr);      // [-1, -2, 0, 1, 2, 3]
```

#### 2.2 删除元素

**pop()** - 删除并返回数组最后一个元素：
```javascript
const arr = [1, 2, 3];
const last = arr.pop(); // 返回 3
console.log(arr);       // [1, 2]
```

**shift()** - 删除并返回数组第一个元素：
```javascript
const arr = [1, 2, 3];
const first = arr.shift(); // 返回 1
console.log(arr);          // [2, 3]
```

#### 2.3 修改数组

**splice()** - 删除、插入或替换元素：
```javascript
const arr = [1, 2, 3, 4, 5];

// 删除元素
arr.splice(1, 2);           // 从索引 1 开始删除 2 个元素，返回 [2, 3]
console.log(arr);           // [1, 4, 5]

// 插入元素
arr.splice(1, 0, 'a', 'b'); // 从索引 1 开始插入，不删除元素
console.log(arr);           // [1, 'a', 'b', 4, 5]

// 替换元素
arr.splice(1, 2, 'x', 'y'); // 从索引 1 开始删除 2 个元素，插入新元素
console.log(arr);           // [1, 'x', 'y', 4, 5]
```

**reverse()** - 反转数组：
```javascript
const arr = [1, 2, 3];
arr.reverse();
console.log(arr); // [3, 2, 1]
```

**sort()** - 排序数组：
```javascript
const arr = [3, 1, 4, 1, 5];
arr.sort();                    // 默认按字符串排序
console.log(arr);              // [1, 1, 3, 4, 5]

// 数字排序
arr.sort((a, b) => a - b);     // 升序
arr.sort((a, b) => b - a);     // 降序

// 对象排序
const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 20 }
];
users.sort((a, b) => a.age - b.age);
```

**fill()** - 填充数组（ES6）：
```javascript
const arr = new Array(5).fill(0);     // [0, 0, 0, 0, 0]
arr.fill(1, 1, 3);                    // 从索引 1 到 3（不含）填充 1
console.log(arr);                     // [0, 1, 1, 0, 0]
```

**copyWithin()** - 复制数组元素（ES6）：
```javascript
const arr = [1, 2, 3, 4, 5];
arr.copyWithin(0, 3);                 // 从索引 3 复制到索引 0
console.log(arr);                     // [4, 5, 3, 4, 5]
```

---

### 3. 不修改原数组的方法（Accessor Methods）

这些方法不会修改原数组，返回新数组或新值。

#### 3.1 连接和切片

**concat()** - 连接数组：
```javascript
const arr1 = [1, 2];
const arr2 = [3, 4];
const arr3 = arr1.concat(arr2);      // [1, 2, 3, 4]
const arr4 = arr1.concat(arr2, [5, 6]); // [1, 2, 3, 4, 5, 6]
console.log(arr1);                   // [1, 2]（原数组不变）
```

**slice()** - 提取数组片段：
```javascript
const arr = [1, 2, 3, 4, 5];
arr.slice(1, 3);        // [2, 3]（从索引 1 到 3，不含 3）
arr.slice(2);           // [3, 4, 5]（从索引 2 到末尾）
arr.slice(-2);          // [4, 5]（最后 2 个元素）
arr.slice(1, -1);       // [2, 3, 4]（从索引 1 到倒数第 1 个）
```

**join()** - 将数组转换为字符串：
```javascript
const arr = [1, 2, 3];
arr.join();             // "1,2,3"
arr.join('-');          // "1-2-3"
arr.join('');           // "123"
```

#### 3.2 查找和索引

**indexOf()** - 查找元素索引：
```javascript
const arr = [1, 2, 3, 2, 1];
arr.indexOf(2);         // 1
arr.indexOf(2, 2);      // 3（从索引 2 开始查找）
arr.indexOf(5);         // -1（未找到）
```

**lastIndexOf()** - 从后向前查找元素索引：
```javascript
const arr = [1, 2, 3, 2, 1];
arr.lastIndexOf(2);     // 3
arr.lastIndexOf(2, 2);  // 1（从索引 2 向前查找）
```

**includes()** - 检查数组是否包含元素（ES7）：
```javascript
const arr = [1, 2, 3];
arr.includes(2);        // true
arr.includes(4);        // false
arr.includes(2, 2);     // false（从索引 2 开始查找）
```

**find()** - 查找第一个满足条件的元素（ES6）：
```javascript
const arr = [1, 2, 3, 4, 5];
arr.find(x => x > 3);   // 4
arr.find(x => x > 10);  // undefined
```

**findIndex()** - 查找第一个满足条件的元素索引（ES6）：
```javascript
const arr = [1, 2, 3, 4, 5];
arr.findIndex(x => x > 3);  // 3
arr.findIndex(x => x > 10); // -1
```

#### 3.3 数组转换

**toString()** - 转换为字符串：
```javascript
const arr = [1, 2, 3];
arr.toString();         // "1,2,3"
```

**toLocaleString()** - 转换为本地化字符串：
```javascript
const arr = [1000, new Date()];
arr.toLocaleString();   // "1,000,2024/1/1 12:00:00"（根据 locale 不同而不同）
```

---

### 4. 数组迭代方法（Iteration Methods）

这些方法用于遍历数组，不会修改原数组（除非在回调函数中修改）。

#### 4.1 遍历方法

**forEach()** - 遍历数组：
```javascript
const arr = [1, 2, 3];
arr.forEach((value, index, array) => {
  console.log(value, index);
});
// 输出：
// 1 0
// 2 1
// 3 2
```

**map()** - 映射数组，返回新数组：
```javascript
const arr = [1, 2, 3];
const doubled = arr.map(x => x * 2);
console.log(doubled);   // [2, 4, 6]
console.log(arr);       // [1, 2, 3]（原数组不变）
```

**filter()** - 过滤数组，返回新数组：
```javascript
const arr = [1, 2, 3, 4, 5];
const evens = arr.filter(x => x % 2 === 0);
console.log(evens);     // [2, 4]
```

**reduce()** - 累积计算，返回单一值：
```javascript
const arr = [1, 2, 3, 4, 5];
const sum = arr.reduce((acc, curr) => acc + curr, 0);
console.log(sum);       // 15

// 计算最大值
const max = arr.reduce((acc, curr) => Math.max(acc, curr));
console.log(max);       // 5

// 数组转对象
const obj = arr.reduce((acc, curr, index) => {
  acc[index] = curr;
  return acc;
}, {});
console.log(obj);       // { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5 }
```

**reduceRight()** - 从右到左累积计算：
```javascript
const arr = [1, 2, 3, 4];
const result = arr.reduceRight((acc, curr) => acc - curr);
console.log(result);    // -2（4 - 3 - 2 - 1）
```

#### 4.2 测试方法

**some()** - 测试是否至少有一个元素满足条件：
```javascript
const arr = [1, 2, 3, 4, 5];
arr.some(x => x > 3);   // true
arr.some(x => x > 10);  // false
```

**every()** - 测试是否所有元素都满足条件：
```javascript
const arr = [1, 2, 3, 4, 5];
arr.every(x => x > 0);  // true
arr.every(x => x > 3);  // false
```

#### 4.3 扁平化方法（ES2019）

**flat()** - 扁平化数组：
```javascript
const arr = [1, [2, 3], [4, [5, 6]]];
arr.flat();             // [1, 2, 3, 4, [5, 6]]
arr.flat(2);            // [1, 2, 3, 4, 5, 6]
arr.flat(Infinity);     // [1, 2, 3, 4, 5, 6]（完全扁平化）
```

**flatMap()** - 映射后扁平化：
```javascript
const arr = [1, 2, 3];
arr.flatMap(x => [x, x * 2]);  // [1, 2, 2, 4, 3, 6]
// 等价于 arr.map(x => [x, x * 2]).flat()
```

---

### 5. ES6+ 新增方法

#### 5.1 数组创建

**Array.from()** - 从类数组或可迭代对象创建数组：
```javascript
// 从字符串
Array.from('hello');    // ['h', 'e', 'l', 'l', 'o']

// 从 Set
Array.from(new Set([1, 2, 2, 3])); // [1, 2, 3]

// 从 Map
Array.from(new Map([['a', 1], ['b', 2]])); // [['a', 1], ['b', 2]]

// 带映射函数
Array.from([1, 2, 3], x => x * 2); // [2, 4, 6]
Array.from({ length: 5 }, (_, i) => i); // [0, 1, 2, 3, 4]
```

**Array.of()** - 创建数组：
```javascript
Array.of(1, 2, 3);      // [1, 2, 3]
Array.of(5);            // [5]
Array.of();             // []
```

#### 5.2 查找方法

**find()** - 查找第一个满足条件的元素：
```javascript
const arr = [1, 2, 3, 4, 5];
arr.find(x => x > 3);   // 4
```

**findIndex()** - 查找第一个满足条件的元素索引：
```javascript
const arr = [1, 2, 3, 4, 5];
arr.findIndex(x => x > 3);  // 3
```

**includes()** - 检查是否包含元素：
```javascript
const arr = [1, 2, 3];
arr.includes(2);        // true
arr.includes(4);        // false
```

#### 5.3 填充和复制

**fill()** - 填充数组：
```javascript
const arr = new Array(5).fill(0);     // [0, 0, 0, 0, 0]
arr.fill(1, 1, 3);                    // [0, 1, 1, 0, 0]
```

**copyWithin()** - 复制数组元素：
```javascript
const arr = [1, 2, 3, 4, 5];
arr.copyWithin(0, 3);                 // [4, 5, 3, 4, 5]
```

#### 5.4 扁平化方法（ES2019）

**flat()** - 扁平化数组：
```javascript
const arr = [1, [2, 3], [4, [5, 6]]];
arr.flat(2);            // [1, 2, 3, 4, 5, 6]
```

**flatMap()** - 映射后扁平化：
```javascript
const arr = [1, 2, 3];
arr.flatMap(x => [x, x * 2]);  // [1, 2, 2, 4, 3, 6]
```

#### 5.5 数组迭代器（ES6）

**keys()** - 返回数组索引的迭代器：
```javascript
const arr = ['a', 'b', 'c'];
for (const index of arr.keys()) {
  console.log(index);   // 0, 1, 2
}
```

**values()** - 返回数组值的迭代器：
```javascript
const arr = ['a', 'b', 'c'];
for (const value of arr.values()) {
  console.log(value);   // 'a', 'b', 'c'
}
```

**entries()** - 返回数组键值对的迭代器：
```javascript
const arr = ['a', 'b', 'c'];
for (const [index, value] of arr.entries()) {
  console.log(index, value);   // 0 'a', 1 'b', 2 'c'
}
```

---

### 6. 数组扩展和高级用法

#### 6.1 稀疏数组

**稀疏数组创建**：
```javascript
const arr = [1, , 3];   // 稀疏数组
arr.length;             // 3
arr[1];                 // undefined
'1' in arr;             // false
```

**稀疏数组遍历**：
```javascript
const arr = [1, , 3];
arr.forEach(x => console.log(x));  // 1, 3（跳过空元素）
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);  // 1, undefined, 3
}
```

#### 6.2 类数组对象转换

**arguments 对象**：
```javascript
function test() {
  const arr = Array.from(arguments);
  console.log(arr);     // [1, 2, 3]
}
test(1, 2, 3);
```

**NodeList 对象**：
```javascript
const nodes = document.querySelectorAll('div');
const arr = Array.from(nodes);
// 或使用扩展运算符
const arr2 = [...nodes];
```

**字符串**：
```javascript
const str = 'hello';
const arr = Array.from(str);  // ['h', 'e', 'l', 'l', 'o']
// 或使用扩展运算符
const arr2 = [...str];
```

#### 6.3 数组去重

**使用 Set**：
```javascript
const arr = [1, 2, 2, 3, 3, 3];
const unique = [...new Set(arr)];  // [1, 2, 3]
```

**使用 filter**：
```javascript
const arr = [1, 2, 2, 3, 3, 3];
const unique = arr.filter((value, index) => arr.indexOf(value) === index);
```

**使用 reduce**：
```javascript
const arr = [1, 2, 2, 3, 3, 3];
const unique = arr.reduce((acc, curr) => {
  if (!acc.includes(curr)) {
    acc.push(curr);
  }
  return acc;
}, []);
```

#### 6.4 数组分组

**使用 reduce**：
```javascript
const arr = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 25 }
];
const grouped = arr.reduce((acc, curr) => {
  const key = curr.age;
  if (!acc[key]) {
    acc[key] = [];
  }
  acc[key].push(curr);
  return acc;
}, {});
// { 25: [{ name: 'Alice', age: 25 }, { name: 'Charlie', age: 25 }], 30: [{ name: 'Bob', age: 30 }] }
```

#### 6.5 数组分块

**使用循环**：
```javascript
function chunk(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}
chunk([1, 2, 3, 4, 5], 2);  // [[1, 2], [3, 4], [5]]
```

**使用 reduce**：
```javascript
function chunk(arr, size) {
  return arr.reduce((acc, curr, index) => {
    const chunkIndex = Math.floor(index / size);
    if (!acc[chunkIndex]) {
      acc[chunkIndex] = [];
    }
    acc[chunkIndex].push(curr);
    return acc;
  }, []);
}
```

---

### 7. 性能优化

#### 7.1 方法选择

**修改原数组 vs 创建新数组**：
```javascript
// 修改原数组（更快）
arr.push(4);
arr.pop();
arr.reverse();

// 创建新数组（更安全，但可能更慢）
const newArr = arr.concat([4]);
const newArr2 = arr.slice(0, -1);
const newArr3 = [...arr].reverse();
```

**循环 vs 迭代方法**：
```javascript
// for 循环（最快）
for (let i = 0; i < arr.length; i++) {
  // 处理 arr[i]
}

// for...of（较快）
for (const item of arr) {
  // 处理 item
}

// forEach（较慢，但更简洁）
arr.forEach(item => {
  // 处理 item
});
```

#### 7.2 大型数组优化

**使用迭代器**：
```javascript
// 避免创建中间数组
const largeArray = Array.from({ length: 1000000 }, (_, i) => i);
const result = largeArray
  .filter(x => x % 2 === 0)
  .map(x => x * 2)
  .slice(0, 10);
```

**使用生成器**：
```javascript
function* filterMap(arr, filterFn, mapFn) {
  for (const item of arr) {
    if (filterFn(item)) {
      yield mapFn(item);
    }
  }
}
const result = Array.from(filterMap(largeArray, x => x % 2 === 0, x => x * 2));
```

#### 7.3 内存优化

**避免创建不必要的数组**：
```javascript
// 不好：创建多个中间数组
const result = arr
  .map(x => x * 2)
  .filter(x => x > 10)
  .slice(0, 5);

// 更好：使用 reduce 一次完成
const result = arr.reduce((acc, curr) => {
  const doubled = curr * 2;
  if (doubled > 10 && acc.length < 5) {
    acc.push(doubled);
  }
  return acc;
}, []);
```

---

### 8. 最佳实践

#### 8.1 方法链式调用

**合理使用链式调用**：
```javascript
const result = arr
  .filter(x => x > 0)
  .map(x => x * 2)
  .reduce((acc, curr) => acc + curr, 0);
```

**避免过度链式调用**：
```javascript
// 不好：过度链式调用，难以理解
const result = arr
  .filter(x => x > 0)
  .map(x => x * 2)
  .filter(x => x < 100)
  .map(x => x + 1)
  .reduce((acc, curr) => acc + curr, 0);

// 更好：分步骤，更清晰
const positive = arr.filter(x => x > 0);
const doubled = positive.map(x => x * 2);
const filtered = doubled.filter(x => x < 100);
const incremented = filtered.map(x => x + 1);
const result = incremented.reduce((acc, curr) => acc + curr, 0);
```

#### 8.2 不可变数据

**使用不可变操作**：
```javascript
// 添加元素
const newArr = [...arr, newItem];
const newArr2 = arr.concat(newItem);

// 删除元素
const newArr = arr.filter(item => item !== target);

// 更新元素
const newArr = arr.map(item => item.id === targetId ? { ...item, ...updates } : item);
```

#### 8.3 错误处理

**检查数组是否存在**：
```javascript
function processArray(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError('Expected an array');
  }
  if (arr.length === 0) {
    return [];
  }
  // 处理数组
}
```

**处理空数组**：
```javascript
const result = arr.length > 0 ? arr.map(x => x * 2) : [];
// 或
const result = (arr || []).map(x => x * 2);
```

---

## 🎯 学习路径

### 阶段一：基础入门

**目标**：掌握数组的基本操作和常用方法

**学习顺序**：
1. 数组创建和访问
2. 数组属性（length）
3. 添加和删除元素（push、pop、shift、unshift）
4. 数组切片和连接（slice、concat）
5. 数组查找（indexOf、includes）
6. 数组遍历（forEach、for...of）

**学习检查点**：
- ✅ 能够创建和访问数组
- ✅ 能够添加和删除数组元素
- ✅ 能够查找数组中的元素
- ✅ 能够遍历数组

---

### 阶段二：进阶实践

**目标**：掌握数组的迭代方法和高级操作

**学习顺序**：
1. 数组映射和过滤（map、filter）
2. 数组累积（reduce、reduceRight）
3. 数组测试（some、every）
4. 数组排序（sort）
5. 数组扁平化（flat、flatMap）
6. 数组去重和分组

**学习检查点**：
- ✅ 能够使用 map 和 filter 处理数组
- ✅ 能够使用 reduce 进行复杂计算
- ✅ 能够对数组进行排序
- ✅ 能够处理嵌套数组

---

### 阶段三：高级应用

**目标**：掌握数组的性能优化和最佳实践

**学习顺序**：
1. 数组性能优化
2. 大型数组处理
3. 数组扩展和类数组转换
4. 不可变数据操作
5. 数组最佳实践

**学习检查点**：
- ✅ 能够优化数组操作性能
- ✅ 能够处理大型数组
- ✅ 能够转换类数组对象
- ✅ 能够编写高质量的数组操作代码

---

## 🔗 相关链接

### 前置知识
- [数据类型](../01-语言核心/数据类型.md) — 数组是对象类型
- [控制结构](../01-语言核心/控制结构.md) — 循环结构用于遍历数组
- [函数](../01-语言核心/函数.md) — 回调函数在数组方法中使用

### 进阶学习
- [Set 和 Map](./Set和Map.md) — 其他集合数据结构
- [函数式编程](../07-函数式编程/README.md) — 函数式编程中的数组操作
- [异步编程](../04-异步编程/README.md) — 异步数组操作

### 相关文档
- [内置对象概述](./内置对象概述.md) — 内置对象分类和概览
- [String 对象](./String.md) — 字符串操作（类似数组）
- [其他内置对象](./其他内置对象.md) — Object、Function 等

---

## 📌 方法速查表

### 修改原数组的方法
| 方法 | 说明 | 返回值 |
|------|------|--------|
| `push()` | 在末尾添加元素 | 新长度 |
| `pop()` | 删除并返回最后一个元素 | 删除的元素 |
| `shift()` | 删除并返回第一个元素 | 删除的元素 |
| `unshift()` | 在开头添加元素 | 新长度 |
| `splice()` | 删除、插入或替换元素 | 删除的元素数组 |
| `reverse()` | 反转数组 | 原数组 |
| `sort()` | 排序数组 | 原数组 |
| `fill()` | 填充数组 | 原数组 |
| `copyWithin()` | 复制数组元素 | 原数组 |

### 不修改原数组的方法
| 方法 | 说明 | 返回值 |
|------|------|--------|
| `concat()` | 连接数组 | 新数组 |
| `slice()` | 提取数组片段 | 新数组 |
| `join()` | 转换为字符串 | 字符串 |
| `indexOf()` | 查找元素索引 | 索引或 -1 |
| `lastIndexOf()` | 从后查找元素索引 | 索引或 -1 |
| `includes()` | 检查是否包含元素 | 布尔值 |
| `toString()` | 转换为字符串 | 字符串 |
| `toLocaleString()` | 转换为本地化字符串 | 字符串 |

### 迭代方法
| 方法 | 说明 | 返回值 |
|------|------|--------|
| `forEach()` | 遍历数组 | undefined |
| `map()` | 映射数组 | 新数组 |
| `filter()` | 过滤数组 | 新数组 |
| `reduce()` | 累积计算 | 累积值 |
| `reduceRight()` | 从右累积计算 | 累积值 |
| `some()` | 测试是否至少有一个满足条件 | 布尔值 |
| `every()` | 测试是否所有都满足条件 | 布尔值 |
| `find()` | 查找第一个满足条件的元素 | 元素或 undefined |
| `findIndex()` | 查找第一个满足条件的元素索引 | 索引或 -1 |
| `flat()` | 扁平化数组 | 新数组 |
| `flatMap()` | 映射后扁平化 | 新数组 |

### ES6+ 新增方法
| 方法 | 说明 | 返回值 |
|------|------|--------|
| `Array.from()` | 从类数组或可迭代对象创建数组 | 新数组 |
| `Array.of()` | 创建数组 | 新数组 |
| `Array.isArray()` | 检查是否为数组 | 布尔值 |
| `keys()` | 返回索引迭代器 | 迭代器 |
| `values()` | 返回值迭代器 | 迭代器 |
| `entries()` | 返回键值对迭代器 | 迭代器 |

---

**最后更新**：2025  
**维护规范**：每次新增数组相关内容后，在本文档中更新

---

#javascript #数组 #Array #内置对象 #api

