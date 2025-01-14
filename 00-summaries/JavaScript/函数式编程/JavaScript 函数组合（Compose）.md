# 技术文档：JavaScript 函数组合（Compose）

---

## **概述**
`compose` 是 JavaScript 中一个常用的函数式编程工具，用于将多个函数组合成一个函数。组合后的函数依次执行每个函数的逻辑（从右到左），并将输出作为下一函数的输入，从而实现代码的模块化与简洁化。

---

## **功能描述**
### **`compose` 函数的作用**
`compose` 函数将多个独立的函数组合成一个管道式操作，最终返回一个新的函数。

### **执行顺序**
1. 从右向左调用传入的函数。
2. 每个函数的输出作为下一个函数的输入。

---

## **函数实现**

```javascript
function compose() {
  var args = arguments; // 保存传入的函数
  var start = args.length - 1; // 从最后一个函数开始
  return function () {
    var i = start - 1; // 当前执行函数的索引
    var result = args[start].apply(this, arguments); // 执行最后一个函数并传入初始参数
    while (i >= 0) { // 从右到左依次执行剩余的函数
      result = args[i].call(this, result);
      i--;
    }
    return result; // 返回最终结果
  };
}
```

---

## **代码示例**

### **示例：组合字符串操作**

#### **定义三个字符串处理函数**
1. **`addHello`**：给字符串添加前缀 `hello`。
2. **`toUpperCase`**：将字符串转换为大写。
3. **`reverse`**：将字符串反转。

```javascript
function addHello(str) {
  return 'hello ' + str;
}

function toUpperCase(str) {
  return str.toUpperCase();
}

function reverse(str) {
  return str.split('').reverse().join('');
}
```

#### **使用 `compose` 进行组合**

```javascript
var composeFn = compose(reverse, toUpperCase, addHello);
console.log(composeFn('ttsy')); // 输出：YSTT OLLEH
```

---

## **执行过程分析**
以下为 `compose(reverse, toUpperCase, addHello)` 的执行流程：

1. **初始参数传递**：`composeFn('ttsy')`。
2. 执行最后一个函数 `addHello`：
   - 输入：`'ttsy'`
   - 输出：`'hello ttsy'`
3. 执行中间函数 `toUpperCase`：
   - 输入：`'hello ttsy'`
   - 输出：`'HELLO TTSY'`
4. 执行第一个函数 `reverse`：
   - 输入：`'HELLO TTSY'`
   - 输出：`'YSTT OLLEH'`
5. 返回最终结果：`'YSTT OLLEH'`。

---

## **应用场景**
1. **数据处理流水线**：
   - 组合多个数据转换函数，实现数据的统一处理。
2. **逻辑分层设计**：
   - 将复杂逻辑分解为多个简单函数，通过组合实现清晰的逻辑链。
3. **代码复用**：
   - `compose` 可以将通用操作模块化，提升代码的复用性。

---

## **扩展功能**

### **1. 支持异步函数**
通过修改 `compose`，支持异步函数（`async/await` 或 `Promise`）。

```javascript
function composeAsync() {
  var args = arguments;
  var start = args.length - 1;
  return async function () {
    var i = start - 1;
    var result = await args[start].apply(this, arguments);
    while (i >= 0) {
      result = await args[i].call(this, result);
      i--;
    }
    return result;
  };
}
```

使用方式与同步函数相同，但支持异步函数的操作。

---

### **2. 增加类型检查**
为传入的函数添加校验，确保输入函数有效。

```javascript
function compose() {
  var args = Array.from(arguments);
  if (args.some(fn => typeof fn !== 'function')) {
    throw new Error('All arguments to compose must be functions');
  }
  var start = args.length - 1;
  return function () {
    var i = start - 1;
    var result = args[start].apply(this, arguments);
    while (i >= 0) {
      result = args[i].call(this, result);
      i--;
    }
    return result;
  };
}
```

---

## **完整代码**

```javascript
// 通用函数组合工具
function compose() {
  var args = arguments;
  var start = args.length - 1;
  return function () {
    var i = start - 1;
    var result = args[start].apply(this, arguments);
    while (i >= 0) {
      result = args[i].call(this, result);
      i--;
    }
    return result;
  };
}

// 示例函数
function addHello(str) {
  return 'hello ' + str;
}

function toUpperCase(str) {
  return str.toUpperCase();
}

function reverse(str) {
  return str.split('').reverse().join('');
}

// 组合函数
var composeFn = compose(reverse, toUpperCase, addHello);

// 测试结果
console.log(composeFn('ttsy')); // 输出：YSTT OLLEH
```

---

## **总结**
1. **简化逻辑**：通过组合函数将多步逻辑整合成一个函数，提高可读性。
2. **模块化设计**：将复杂逻辑拆分为单一职责的小函数，组合使用。
3. **扩展性强**：可以支持同步与异步、增加校验等，适配更多场景。

`compose` 是函数式编程的经典工具，适合数据流操作和逻辑抽象的场景，尤其在现代前端框架（如 React 和 Vue）中非常实用。