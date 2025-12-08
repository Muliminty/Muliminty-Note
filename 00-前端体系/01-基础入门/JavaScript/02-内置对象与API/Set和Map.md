# Set 和 Map（Set and Map）

> JavaScript Set 和 Map：集合数据结构的"双胞胎"，Set 像没有重复值的数组，Map 像可以用任何类型做键的对象。

---

## 1. 一句话概括主题

Set 和 Map 是 ES6 新增的内置对象，Set 用于存储唯一值的集合，Map 用于存储键值对，它们都比传统数组和对象在某些场景下更高效。

---

## 2. 它是什么

想象一下：
- **Set** 就像一个"不重复的数组"：
  - 自动去重 → `new Set([1, 2, 2, 3])` 得到 `Set {1, 2, 3}`
  - 快速查找 → `set.has(2)` 比数组的 `includes()` 更快
  - 没有索引 → 不能通过索引访问，只能遍历

- **Map** 就像一个"可以用任何类型做键的对象"：
  - 对象键 → `obj[1]` 会被转为字符串 `"1"`
  - Map 键 → `map.set(1, "one")` 保持数字类型
  - 有序性 → Map 保持插入顺序，对象不保证

**举例**：
```javascript
// Set - 自动去重
const uniqueNumbers = new Set([1, 2, 2, 3, 3]);
console.log([...uniqueNumbers]);  // [1, 2, 3]

// Map - 可以用任何类型做键
const map = new Map();
map.set(1, "数字键");
map.set("1", "字符串键");
console.log(map.get(1));    // "数字键"
console.log(map.get("1"));  // "字符串键"（和上面的不同）
```

---

## 3. 能解决什么问题 + 为什么重要

### Set 解决的问题

1. **数组去重**：快速去除数组中的重复元素
2. **成员检测**：快速判断元素是否在集合中
3. **集合运算**：交集、并集、差集等集合操作
4. **性能优化**：`has()` 方法比数组的 `includes()` 更快

### Map 解决的问题

1. **任意类型键**：可以用对象、函数等作为键
2. **保持顺序**：Map 保持键值对的插入顺序
3. **大小获取**：`map.size` 直接获取键值对数量
4. **性能优化**：频繁增删键值对时性能更好

### 为什么重要

- **ES6 新特性**：现代 JavaScript 开发的标准工具
- **性能优势**：在特定场景下比数组和对象更高效
- **语义清晰**：Set 表示集合，Map 表示映射，代码更易理解
- **面试高频**：ES6 新特性是前端面试必考内容

---

## 4. 核心知识点拆解

### 4.1 Set 对象

#### 创建 Set

```javascript
// 方式 1：空 Set
const set1 = new Set();

// 方式 2：从数组创建
const set2 = new Set([1, 2, 3, 3, 2]);  // Set {1, 2, 3}（自动去重）

// 方式 3：从字符串创建
const set3 = new Set("hello");  // Set {"h", "e", "l", "o"}（去重）

// 方式 4：从其他可迭代对象创建
const set4 = new Set([1, 2, 3].values());
```

#### Set 的基本操作

```javascript
const set = new Set();

// add() - 添加元素
set.add(1);
set.add(2);
set.add(2);  // 重复添加，不会增加新元素
console.log(set);  // Set {1, 2}

// has() - 检查元素是否存在
set.has(1);  // true
set.has(3);  // false

// delete() - 删除元素
set.delete(1);  // true（删除成功）
set.delete(3);  // false（元素不存在）

// clear() - 清空 Set
set.clear();
console.log(set.size);  // 0

// size - 获取元素数量
console.log(set.size);  // 2
```

#### Set 的遍历

```javascript
const set = new Set([1, 2, 3]);

// for...of 遍历
for (const value of set) {
  console.log(value);  // 1, 2, 3
}

// forEach 遍历
set.forEach((value, valueAgain, set) => {
  // 注意：Set 的 forEach 回调参数是 (value, value, set)
  // 第二个参数也是 value（为了与 Map 的 forEach 保持一致）
  console.log(value);
});

// keys()、values()、entries()
for (const value of set.values()) {
  console.log(value);  // 1, 2, 3
}

for (const [key, value] of set.entries()) {
  // Set 中 key 和 value 相同
  console.log(key, value);  // 1 1, 2 2, 3 3
}
```

#### Set 与数组的转换

```javascript
// Set 转数组
const set = new Set([1, 2, 3]);
const arr1 = [...set];              // [1, 2, 3]
const arr2 = Array.from(set);      // [1, 2, 3]

// 数组去重（Set 的经典用法）
const numbers = [1, 2, 2, 3, 3, 4];
const unique = [...new Set(numbers)];  // [1, 2, 3, 4]
```

#### Set 的集合运算

```javascript
// 并集
function union(setA, setB) {
  return new Set([...setA, ...setB]);
}

// 交集
function intersection(setA, setB) {
  return new Set([...setA].filter(x => setB.has(x)));
}

// 差集（A 有但 B 没有）
function difference(setA, setB) {
  return new Set([...setA].filter(x => !setB.has(x)));
}

// 使用示例
const setA = new Set([1, 2, 3]);
const setB = new Set([2, 3, 4]);

console.log([...union(setA, setB)]);        // [1, 2, 3, 4]
console.log([...intersection(setA, setB)]); // [2, 3]
console.log([...difference(setA, setB)]);   // [1]
```

### 4.2 Map 对象

#### 创建 Map

```javascript
// 方式 1：空 Map
const map1 = new Map();

// 方式 2：从二维数组创建
const map2 = new Map([
  ["name", "张三"],
  ["age", 25],
  [1, "数字键"]
]);

// 方式 3：从对象创建（需要转换）
const obj = { name: "张三", age: 25 };
const map3 = new Map(Object.entries(obj));  // [["name", "张三"], ["age", 25]]
```

#### Map 的基本操作

```javascript
const map = new Map();

// set() - 设置键值对
map.set("name", "张三");
map.set("age", 25);
map.set(1, "数字键");
map.set(true, "布尔键");

// get() - 获取值
map.get("name");  // "张三"
map.get(1);       // "数字键"
map.get("1");     // undefined（字符串 "1" 和数字 1 不同）

// has() - 检查键是否存在
map.has("name");  // true
map.has("city");  // false

// delete() - 删除键值对
map.delete("name");  // true
map.delete("city");  // false

// clear() - 清空 Map
map.clear();

// size - 获取键值对数量
console.log(map.size);  // 2
```

#### Map 的遍历

```javascript
const map = new Map([
  ["name", "张三"],
  ["age", 25],
  ["city", "北京"]
]);

// for...of 遍历
for (const [key, value] of map) {
  console.log(key, value);
  // name 张三
  // age 25
  // city 北京
}

// forEach 遍历
map.forEach((value, key, map) => {
  console.log(key, value);
});

// keys() - 遍历键
for (const key of map.keys()) {
  console.log(key);  // name, age, city
}

// values() - 遍历值
for (const value of map.values()) {
  console.log(value);  // 张三, 25, 北京
}

// entries() - 遍历键值对
for (const [key, value] of map.entries()) {
  console.log(key, value);
}
```

#### Map 与对象的转换

```javascript
// Map 转对象
const map = new Map([
  ["name", "张三"],
  ["age", 25]
]);
const obj = Object.fromEntries(map);
// { name: "张三", age: 25 }

// 对象转 Map
const obj2 = { name: "李四", age: 30 };
const map2 = new Map(Object.entries(obj2));
// Map { "name" => "李四", "age" => 30 }
```

#### Map 的特殊用法

```javascript
// 使用对象作为键
const objKey1 = { id: 1 };
const objKey2 = { id: 2 };
const map = new Map();

map.set(objKey1, "值1");
map.set(objKey2, "值2");

console.log(map.get(objKey1));  // "值1"
console.log(map.get({ id: 1 }));  // undefined（不同对象引用）

// 使用函数作为键
const funcKey = () => {};
map.set(funcKey, "函数键的值");
console.log(map.get(funcKey));  // "函数键的值"
```

### 4.3 Set vs Array

| 特性 | Set | Array |
|------|-----|-------|
| 重复值 | 不允许 | 允许 |
| 索引访问 | 不支持 | 支持 |
| 查找性能 | O(1) | O(n) |
| 插入顺序 | 保持 | 保持 |
| 大小获取 | `size` | `length` |

```javascript
// Set 的优势：快速查找
const set = new Set([1, 2, 3, 4, 5]);
set.has(3);  // O(1) - 很快

const arr = [1, 2, 3, 4, 5];
arr.includes(3);  // O(n) - 需要遍历

// Set 的劣势：不能通过索引访问
const set = new Set([1, 2, 3]);
set[0];  // undefined（不能这样访问）

const arr = [1, 2, 3];
arr[0];  // 1（可以通过索引访问）
```

### 4.4 Map vs Object

| 特性 | Map | Object |
|------|-----|--------|
| 键类型 | 任意类型 | 字符串或 Symbol |
| 键顺序 | 保持插入顺序 | ES2015+ 保持（但有限制） |
| 大小获取 | `size` | 需要手动计算 |
| 默认键 | 无 | 有原型链 |
| 性能 | 频繁增删时更好 | 一般场景足够 |

```javascript
// Map 的优势：任意类型键
const map = new Map();
map.set(1, "数字键");
map.set("1", "字符串键");
map.set({}, "对象键");

const obj = {};
obj[1] = "数字键";      // 键被转为 "1"
obj["1"] = "字符串键";  // 覆盖上面的值
// obj[{}] = "对象键";   // 键被转为 "[object Object]"

// Map 的优势：保持顺序
const map = new Map();
map.set("c", 3);
map.set("a", 1);
map.set("b", 2);
console.log([...map.keys()]);  // ["c", "a", "b"]（保持插入顺序）

const obj = { c: 3, a: 1, b: 2 };
console.log(Object.keys(obj));  // ["c", "a", "b"]（ES2015+ 也保持顺序）

// Map 的优势：没有原型链
const map = new Map();
map.get("toString");  // undefined（不会从原型链继承）

const obj = {};
obj.toString;  // function toString() { ... }（从 Object.prototype 继承）
```

### 4.5 WeakSet 和 WeakMap（ES6）

#### WeakSet

```javascript
// WeakSet 只能存储对象，不能存储原始值
const weakSet = new WeakSet();

const obj1 = { name: "张三" };
const obj2 = { name: "李四" };

weakSet.add(obj1);
weakSet.add(obj2);

weakSet.has(obj1);  // true
weakSet.delete(obj1);  // true

// WeakSet 的特点：
// 1. 只能存储对象
// 2. 弱引用（对象被垃圾回收后，WeakSet 中的引用自动清除）
// 3. 不可遍历
// 4. 没有 size 属性
```

#### WeakMap

```javascript
// WeakMap 的键只能是对象，不能是原始值
const weakMap = new WeakMap();

const obj1 = { id: 1 };
const obj2 = { id: 2 };

weakMap.set(obj1, "值1");
weakMap.set(obj2, "值2");

weakMap.get(obj1);  // "值1"
weakMap.has(obj1);  // true
weakMap.delete(obj1);  // true

// WeakMap 的特点：
// 1. 键只能是对象
// 2. 弱引用（对象被垃圾回收后，WeakMap 中的键值对自动清除）
// 3. 不可遍历
// 4. 没有 size 属性
// 5. 常用于存储对象的私有数据
```

### 4.6 常见误解说明与纠正

#### 误解 1：Set 可以像数组一样通过索引访问

❌ **错误理解**：
```javascript
const set = new Set([1, 2, 3]);
console.log(set[0]);  // undefined（不能这样访问）
```

✅ **正确理解**：
- Set 没有索引，不能通过索引访问
- 需要转换为数组或使用遍历

```javascript
const set = new Set([1, 2, 3]);

// 方式 1：转换为数组
const arr = [...set];
console.log(arr[0]);  // 1

// 方式 2：遍历查找
let index = 0;
for (const value of set) {
  if (index === 0) {
    console.log(value);  // 1
    break;
  }
  index++;
}
```

#### 误解 2：Map 和对象完全一样

❌ **错误理解**：
```javascript
// 认为 Map 和对象可以互换使用
const map = new Map();
map.set(1, "值");
map[1];  // undefined（Map 不能用 [] 访问）
```

✅ **正确理解**：
- Map 使用 `get()` 和 `set()` 方法，不能用 `[]` 访问
- Map 的键可以是任意类型，对象的键只能是字符串或 Symbol
- Map 保持插入顺序，对象在 ES2015+ 也保持，但有特殊情况

```javascript
// Map 的正确用法
const map = new Map();
map.set(1, "值");
map.get(1);  // "值"

// 对象的用法
const obj = {};
obj[1] = "值";  // 键被转为 "1"
obj["1"];  // "值"
```

#### 误解 3：Set 和 Map 总是比数组和对象快

❌ **错误理解**：
- 认为 Set 和 Map 在所有场景下都比数组和对象快

✅ **正确理解**：
- Set 的 `has()` 比数组的 `includes()` 快，但创建 Set 有开销
- Map 在频繁增删时比对象快，但简单场景对象足够
- 需要根据具体场景选择合适的数据结构

```javascript
// 场景 1：只需要查找一次 - 数组可能更快
const arr = [1, 2, 3, 4, 5];
arr.includes(3);  // 直接查找

// 场景 2：需要多次查找 - Set 更快
const set = new Set([1, 2, 3, 4, 5]);
set.has(3);  // O(1) 查找
```

---

## 5. 示例代码（可运行 + 逐行注释）

```javascript
// ===== 示例 1：数组去重 =====

const numbers = [1, 2, 2, 3, 3, 4, 5, 5];

// 1. 使用 Set 去重（最简单）
const unique1 = [...new Set(numbers)];
console.log(unique1);  // [1, 2, 3, 4, 5]

// 2. 使用 filter 和 indexOf（传统方式）
const unique2 = numbers.filter((value, index) => numbers.indexOf(value) === index);
console.log(unique2);  // [1, 2, 3, 4, 5]

// ===== 示例 2：快速查找 =====

// 场景：检查用户是否有权限
const userRoles = ["admin", "editor", "viewer"];

// 方式 1：使用数组（慢）
function hasRoleArray(role) {
  return userRoles.includes(role);  // O(n)
}

// 方式 2：使用 Set（快）
const roleSet = new Set(userRoles);
function hasRoleSet(role) {
  return roleSet.has(role);  // O(1)
}

console.log(hasRoleSet("admin"));  // true
console.log(hasRoleSet("guest"));  // false

// ===== 示例 3：使用 Map 存储用户信息 =====

const userMap = new Map();

// 1. 添加用户（使用用户 ID 作为键）
userMap.set(1, { name: "张三", age: 25 });
userMap.set(2, { name: "李四", age: 30 });
userMap.set(3, { name: "王五", age: 28 });

// 2. 查找用户
const user = userMap.get(1);
console.log(user);  // { name: "张三", age: 25 }

// 3. 更新用户信息
userMap.set(1, { ...userMap.get(1), age: 26 });

// 4. 遍历所有用户
userMap.forEach((user, id) => {
  console.log(`用户 ${id}: ${user.name}`);
});

// ===== 示例 4：使用 Map 实现缓存 =====

class Cache {
  constructor() {
    this.cache = new Map();
  }
  
  // 设置缓存
  set(key, value, ttl = 60000) {  // 默认 60 秒过期
    const expireTime = Date.now() + ttl;
    this.cache.set(key, { value, expireTime });
  }
  
  // 获取缓存
  get(key) {
    const item = this.cache.get(key);
    if (!item) {
      return null;
    }
    
    // 检查是否过期
    if (Date.now() > item.expireTime) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }
  
  // 清除过期缓存
  clearExpired() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expireTime) {
        this.cache.delete(key);
      }
    }
  }
}

// 使用示例
const cache = new Cache();
cache.set("user:1", { name: "张三" }, 5000);  // 5 秒过期

console.log(cache.get("user:1"));  // { name: "张三" }
setTimeout(() => {
  console.log(cache.get("user:1"));  // null（已过期）
}, 6000);

// ===== 示例 5：集合运算 =====

// 计算两个数组的交集、并集、差集
function setOperations(arr1, arr2) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  
  // 并集
  const union = new Set([...set1, ...set2]);
  
  // 交集
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  
  // 差集（arr1 有但 arr2 没有）
  const difference = new Set([...set1].filter(x => !set2.has(x)));
  
  return {
    union: [...union],
    intersection: [...intersection],
    difference: [...difference]
  };
}

const arr1 = [1, 2, 3, 4];
const arr2 = [3, 4, 5, 6];
console.log(setOperations(arr1, arr2));
// {
//   union: [1, 2, 3, 4, 5, 6],
//   intersection: [3, 4],
//   difference: [1, 2]
// }

// ===== 示例 6：使用 WeakMap 存储私有数据 =====

// 使用 WeakMap 实现私有属性
const privateData = new WeakMap();

class User {
  constructor(name, age) {
    // 将私有数据存储在 WeakMap 中
    privateData.set(this, { name, age });
  }
  
  getName() {
    return privateData.get(this).name;
  }
  
  getAge() {
    return privateData.get(this).age;
  }
  
  setAge(age) {
    const data = privateData.get(this);
    data.age = age;
  }
}

const user = new User("张三", 25);
console.log(user.getName());  // "张三"
console.log(user.name);        // undefined（无法直接访问）
```

---

## 6. 常见错误与踩坑

### 错误 1：Set 通过索引访问

**错误代码**：
```javascript
const set = new Set([1, 2, 3]);
console.log(set[0]);  // undefined（不能这样访问）
```

**为什么错**：
- Set 没有索引，不能通过索引访问元素
- Set 是集合，不是数组

**正确方式**：
```javascript
// 方式 1：转换为数组
const arr = [...set];
console.log(arr[0]);  // 1

// 方式 2：遍历查找
let index = 0;
for (const value of set) {
  if (index === 0) {
    console.log(value);  // 1
    break;
  }
  index++;
}
```

### 错误 2：Map 使用 [] 访问

**错误代码**：
```javascript
const map = new Map();
map.set("name", "张三");
console.log(map["name"]);  // undefined（不能这样访问）
```

**为什么错**：
- Map 使用 `get()` 和 `set()` 方法，不能用 `[]` 访问
- `map["name"]` 是在访问 Map 对象的属性，不是 Map 的键值对

**正确方式**：
```javascript
const map = new Map();
map.set("name", "张三");
console.log(map.get("name"));  // "张三"
```

### 错误 3：WeakSet/WeakMap 存储原始值

**错误代码**：
```javascript
const weakSet = new WeakSet();
weakSet.add(1);  // ❌ TypeError: Invalid value used in weak set

const weakMap = new WeakMap();
weakMap.set("key", "value");  // ❌ TypeError: Invalid value used as weak map key
```

**为什么错**：
- WeakSet 只能存储对象
- WeakMap 的键只能是对象

**正确方式**：
```javascript
// WeakSet 只能存储对象
const weakSet = new WeakSet();
const obj = { name: "张三" };
weakSet.add(obj);  // ✅ 正确

// WeakMap 的键只能是对象
const weakMap = new WeakMap();
const keyObj = { id: 1 };
weakMap.set(keyObj, "value");  // ✅ 正确
```

---

## 7. 实际应用场景

### 场景 1：数组去重

```javascript
// 去除数组中的重复元素
const numbers = [1, 2, 2, 3, 3, 4, 5, 5];
const unique = [...new Set(numbers)];  // [1, 2, 3, 4, 5]

// 去除对象数组中的重复（根据某个属性）
const users = [
  { id: 1, name: "张三" },
  { id: 2, name: "李四" },
  { id: 1, name: "张三" }  // 重复
];

const uniqueUsers = Array.from(
  new Map(users.map(user => [user.id, user])).values()
);
// [{ id: 1, name: "张三" }, { id: 2, name: "李四" }]
```

### 场景 2：权限检查

```javascript
// 使用 Set 快速检查用户权限
const userPermissions = new Set(["read", "write", "delete"]);

function hasPermission(permission) {
  return userPermissions.has(permission);
}

console.log(hasPermission("read"));   // true
console.log(hasPermission("admin"));  // false
```

### 场景 3：数据缓存

```javascript
// 使用 Map 实现简单的缓存
const cache = new Map();

function getCachedData(key) {
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  // 从服务器获取数据
  const data = fetchDataFromServer(key);
  cache.set(key, data);
  return data;
}
```

### 场景 4：计数器

```javascript
// 使用 Map 统计元素出现次数
function countOccurrences(arr) {
  const counts = new Map();
  
  for (const item of arr) {
    counts.set(item, (counts.get(item) || 0) + 1);
  }
  
  return counts;
}

const fruits = ["apple", "banana", "apple", "orange", "banana", "apple"];
console.log(countOccurrences(fruits));
// Map { "apple" => 3, "banana" => 2, "orange" => 1 }
```

---

## 8. 给新手的练习题

### 基础题

**练习 1：数组去重**
```javascript
// 任务：去除数组中的重复元素
const numbers = [1, 2, 2, 3, 3, 4, 5, 5];
// 你的代码...

// 参考答案：
const unique = [...new Set(numbers)];  // [1, 2, 3, 4, 5]
```

**练习 2：检查元素是否存在**
```javascript
// 任务：使用 Set 快速检查数组中是否包含某个元素
const arr = [1, 2, 3, 4, 5];
// 你的代码...

// 参考答案：
const set = new Set(arr);
console.log(set.has(3));  // true
```

**练习 3：Map 基本操作**
```javascript
// 任务：创建 Map，添加键值对，然后获取值
// 你的代码...

// 参考答案：
const map = new Map();
map.set("name", "张三");
map.set("age", 25);
console.log(map.get("name"));  // "张三"
```

### 进阶题

**练习 4：计算两个数组的交集**
```javascript
// 任务：找出两个数组的共同元素
function intersection(arr1, arr2) {
  // 你的代码...
}

// 测试
console.log(intersection([1, 2, 3], [2, 3, 4]));  // [2, 3]

// 参考答案：
function intersection(arr1, arr2) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  return [...set1].filter(x => set2.has(x));
}
```

**练习 5：实现 LRU 缓存**
```javascript
// 任务：实现一个简单的 LRU（最近最少使用）缓存
class LRUCache {
  constructor(capacity) {
    // 你的代码...
  }
  
  get(key) {
    // 你的代码...
  }
  
  put(key, value) {
    // 你的代码...
  }
}

// 测试
const cache = new LRUCache(2);
cache.put(1, "a");
cache.put(2, "b");
console.log(cache.get(1));  // "a"
cache.put(3, "c");  // 删除键 2
console.log(cache.get(2));  // null

// 参考答案：
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  
  get(key) {
    if (!this.cache.has(key)) {
      return null;
    }
    
    // 将访问的键移到末尾（表示最近使用）
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }
  
  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // 删除最久未使用的键（第一个键）
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, value);
  }
}
```

---

## 9. 用更简单的话再总结一遍（方便复习）

**Set 和 Map 是 ES6 的新数据结构**：
- **Set**：不重复的集合，自动去重，`has()` 查找快，不能通过索引访问
- **Map**：键值对集合，键可以是任意类型，保持插入顺序，用 `get()`/`set()` 操作
- **WeakSet/WeakMap**：弱引用版本，只能存储对象，不可遍历
- Set 适合去重和快速查找，Map 适合需要任意类型键的场景

**记忆口诀**：
- **S**et - 集合，去重
- **M**ap - 映射，键值对
- **W**eak - 弱引用，只能对象

---

## 10. 知识体系延伸 & 继续学习方向

### 继续学习方向

1. **相关内置对象**：
   - [[Array]] - 数组操作（Set 和 Map 的对比）
   - [[Object]] - 对象操作（Map 的对比）

2. **相关主题**：
   - [[数据结构]] - 理解不同数据结构的特性
   - [[ES6新特性]] - ES6 的其他新特性

3. **进阶学习**：
   - [[算法]] - 使用 Set 和 Map 实现算法
   - [[性能优化]] - 数据结构选择的性能考虑
   - [[设计模式]] - 使用 WeakMap 实现私有属性

### 遵守仓库规范

- 使用双链格式 `[[xxx]]` 链接相关知识点
- 参考 [[内置对象概述]] 了解内置对象分类
- 参考 [[!MOC-javascript]] 了解完整知识体系

---

**参考资源**：
- [MDN Set](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set)
- [MDN Map](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [MDN WeakSet](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakSet)
- [MDN WeakMap](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)

---

#javascript #Set #Map #ES6 #数据结构 #内置对象

