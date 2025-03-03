#### 1. **基本概念**
- **LHS（Left-Hand Side）**：变量在赋值操作的**左侧**时触发的查询，目的是**找到变量的容器**以便赋值。
- **RHS（Right-Hand Side）**：变量在赋值操作的**右侧**或作为函数参数时触发的查询，目的是**获取变量的值**。

#### 2. **核心区别**
| 特征                | LHS                          | RHS                          |
|---------------------|------------------------------|------------------------------|
| 目的                | 找到变量以**赋值**           | 找到变量以**读取值**          |
| 触发场景            | `a = 2`、函数参数赋值        | `console.log(a)`、函数调用    |
| 作用域链失败行为    | 非严格模式：创建全局变量<br>严格模式：抛出 `ReferenceError` | 直接抛出 `ReferenceError` |

---

#### 3. **典型示例**
```javascript
function foo(a) {          // LHS：参数 a = 2
  var b = a;                // RHS：读取 a 的值 → LHS：赋值给 b
  return a + b;             // 两次 RHS：读取 a 和 b 的值
}

var c = foo(2);             // RHS：查找 foo 函数 → LHS：赋值给 c
```

#### 4. **错误处理**
- **RHS 失败**：
  ```javascript
  console.log(d); // ReferenceError: d is not defined
  ```
- **LHS 失败（非严格模式）**：
  ```javascript
  function baz() { e = 1; } // 自动创建全局变量 e
  baz(); console.log(e);    // 输出 1
  ```
- **LHS 失败（严格模式）**：
  ```javascript
  "use strict";
  function baz() { e = 1; } // ReferenceError: e is not defined
  ```

---

#### 5. **特殊场景**
- **对象属性赋值**：
  ```javascript
  obj.a = 2;  // RHS 查找 obj → 属性 a 的赋值不视为 LHS
  ```
- **函数声明**：
  ```javascript
  function test() {} // LHS：函数名 test 在声明时被隐式赋值
  ```

#### 6. **严格模式的影响**
- 严格模式下，隐式变量创建被禁止，LHS 失败直接报错。
- 避免意外全局变量，提升代码安全性。

---

#### 7. **总结**
- **LHS**：找容器，用于赋值（注意作用域泄露风险）。
- **RHS**：找值，用于计算和操作。
- 两者都通过作用域链查找，但失败时的行为差异是关键区别。

通过理解 LHS/RHS，能更清晰分析变量作用域、调试 `ReferenceError`，并写出更严谨的代码。