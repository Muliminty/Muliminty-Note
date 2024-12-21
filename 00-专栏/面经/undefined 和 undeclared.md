在 JavaScript 中，`undefined` 和 `undeclared` 是两个不同的概念。

---

### 1. **`undefined`**
`undefined` 是 JavaScript 中的一种原始数据类型，表示变量已声明但尚未赋值，或者对象的某个属性不存在时的状态。

- **场景**：
  - 声明了变量但没有赋值：
    ```javascript
    let a;
    console.log(a); // undefined
    ```
  - 对象的属性不存在：
    ```javascript
    const obj = {};
    console.log(obj.name); // undefined
    ```
  - 明确给变量赋值为 `undefined`：
    ```javascript
    let b = undefined;
    console.log(b); // undefined
    ```

- **特征**：
  - `undefined` 是一个值，也是 JavaScript 的全局属性。
  - 可通过 `typeof` 检查：
    ```javascript
    typeof a; // "undefined"
    ```

---

### 2. **`undeclared`**
`undeclared` 指的是**未声明的变量**。这种变量在 JavaScript 中直接使用时会抛出 `ReferenceError` 错误。

- **场景**：
  - 直接访问从未声明过的变量：
    ```javascript
    console.log(myVar); // ReferenceError: myVar is not defined
    ```

  - 尝试使用未声明的对象属性时不会报错，而是返回 `undefined`：
    ```javascript
    const obj = {};
    console.log(obj.nonExistentProperty); // undefined
    ```

- **特征**：
  - 未通过 `var`、`let` 或 `const` 声明的变量在严格模式下（`'use strict'`）是非法的，会抛出错误。
  - 如果在非严格模式下使用未声明的变量，JavaScript 会隐式地将其添加为全局变量：
    ```javascript
    myVar = 10; // 非严格模式下隐式创建为全局变量
    console.log(myVar); // 10
    ```

---

### **区别总结**

| **特性**                | **`undefined`**                                  | **`undeclared`**                            |
|-------------------------|-------------------------------------------------|--------------------------------------------|
| **定义**               | 变量已声明，但未赋值。                            | 未声明的变量。                              |
| **值**                 | `undefined` 是一种合法值。                        | 不存在此变量，访问时会报错。                |
| **抛错情况**            | 不会报错，值是 `undefined`。                      | 直接访问会导致 `ReferenceError` 错误。      |
| **示例**               | `let a; console.log(a); // undefined`            | `console.log(myVar); // ReferenceError`    |

---

### **避免 `undeclared` 的方法**
1. **始终使用 `var`、`let` 或 `const` 声明变量**：
   ```javascript
   let myVar = 10;
   console.log(myVar); // 10
   ```

2. **启用严格模式**：
   严格模式下未声明的变量会直接抛出错误：
   ```javascript
   'use strict';
   myVar = 10; // ReferenceError: myVar is not defined
   ```

3. **使用代码质量工具**：
   使用工具如 ESLint 检查未声明的变量。

---

通过区分这两个概念，可以帮助你更好地理解 JavaScript 中变量的声明与使用规则，从而避免不必要的错误。