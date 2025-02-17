
## **代码解析**

```javascript
var a = 2;

function add(b, c) {
  return b + c;
}

function addAll(b, c) {
  var d = 10;
  result = add(b, c);
  return a + result + d;
}

addAll(3, 6);
```

---

## **执行过程分析**

### **1. 代码执行前，JavaScript 引擎创建全局执行上下文**

在 JavaScript 代码执行前，会创建 **全局执行上下文（Global Execution Context，GEC）**，并将其压入 **执行上下文栈（ECS）**。

#### **全局执行上下文（GEC）**

- **变量对象（VO，Variable Object）**
    
    ```js
    {
      a: undefined,
      add: <function>,
      addAll: <function>,
      result: undefined // 因为 result 赋值时没有 `var`，会变成全局变量
    }
    ```
    
- **作用域链（Scope Chain）**
    - `[VO(Global)]`
- **this 指向**
    - 在浏览器环境中，`this === window`

---

### **2. 代码开始执行**

#### **(1) 解析全局代码**

- `var a = 2;`
    
    - `a` 赋值为 `2`。
- 定义函数 `add` 和 `addAll`，但**不会执行**，只是将它们存储在内存中。
    
- 解析完全局代码后，**全局执行上下文** 变为：
    
    ```js
    {
      a: 2,
      add: <function>,
      addAll: <function>,
      result: undefined
    }
    ```
    

---

### **3. 执行 `addAll(3,6)`**

当 `addAll(3,6)` 被调用时：

1. **创建 `addAll` 的执行上下文**
2. **`addAll` 进入执行上下文栈（ECS）**

#### **执行上下文栈变化**

|操作|执行上下文栈|
|---|---|
|代码开始|`[Global Execution Context]`|
|调用 `addAll(3,6)`|`[Global Execution Context, addAll Execution Context]`|

#### **`addAll` 的执行上下文**

- **变量对象（VO）**
    
    ```js
    {
      b: 3,
      c: 6,
      d: 10
    }
    ```
    
- **作用域链**
    - `[VO(addAll), VO(Global)]`
- **this**
    - 指向全局对象（`window`）

---

### **4. 执行 `addAll` 函数**

```js
var d = 10; 
```

- 在 `addAll` 的执行上下文中，声明 `d` 并赋值 `10`。

```js
result = add(b, c);
```

- `add(3,6)` 被调用，此时会创建 `add` 的执行上下文，并压入执行上下文栈。

---

### **5. 执行 `add(3,6)`**

1. **创建 `add` 的执行上下文**
2. **`add` 进入执行上下文栈（ECS）**

#### **执行上下文栈变化**

|操作|执行上下文栈|
|---|---|
|代码开始|`[Global Execution Context]`|
|调用 `addAll(3,6)`|`[Global Execution Context, addAll Execution Context]`|
|调用 `add(3,6)`|`[Global Execution Context, addAll Execution Context, add Execution Context]`|

#### **`add` 的执行上下文**

- **变量对象（VO）**
    
    ```js
    {
      b: 3,
      c: 6
    }
    ```
    
- **作用域链**
    - `[VO(add), VO(Global)]`
- **this**
    - 指向全局对象

---

### **6. 执行 `add` 函数**

```js
return b + c; // 3 + 6 = 9
```

- `add(3,6)` 返回 `9`。
- `add` 执行完毕，从执行上下文栈中弹出。

#### **执行上下文栈变化**

|操作|执行上下文栈|
|---|---|
|代码开始|`[Global Execution Context]`|
|调用 `addAll(3,6)`|`[Global Execution Context, addAll Execution Context]`|
|**`add` 出栈**|`[Global Execution Context, addAll Execution Context]`|

- `result = 9;`（`result` 在全局作用域中）

---

### **7. 继续执行 `addAll`**

```js
return a + result + d; // 2 + 9 + 10 = 21
```

- `addAll(3,6)` 返回 `21`。
- `addAll` 执行完毕，从执行上下文栈中弹出。

#### **执行上下文栈变化**

|操作|执行上下文栈|
|---|---|
|代码开始|`[Global Execution Context]`|
|**`addAll` 出栈**|`[Global Execution Context]`|

最终返回值 **21**。

---

## **8. 最终的全局作用域**

```js
{
  a: 2,
  add: <function>,
  addAll: <function>,
  result: 9
}
```

> ⚠️ 注意：**`result` 没有 `var` 声明，所以它会成为全局变量！**

---

## **总结**

1. **执行上下文栈（ECS）管理函数的执行过程，遵循“后进先出（LIFO）”原则**：
    
    - `addAll` 进入栈 → `add` 进入栈 → `add` 出栈 → `addAll` 出栈 → 全局执行完毕。
2. **作用域链决定变量的查找规则**：
    
    - 在 `addAll` 中访问 `a`，它不在 `addAll` 作用域内，所以会向上查找 `Global Execution Context`，找到 `a = 2`。
    - 在 `addAll` 访问 `result`，它没有 `var`，默认变为全局变量。
3. **全局变量 `result` 是隐式创建的，容易污染全局作用域**：
    
    - 解决方案：使用 `var` 或 `let` 在 `addAll` 内部声明 `result`：
        
        ```js
        function addAll(b, c) {
          var d = 10;
          var result = add(b, c); // 添加 `var`
          return a + result + d;
        }
        ```
        

---

## **最终返回值**

```js
addAll(3,6) // 21
```

🔹 **关键点**

- **执行上下文栈** 管理函数调用过程。
- **作用域链** 决定变量的查找。
- **全局变量污染**（`result` 未用 `var` 声明）。

这就是 JavaScript 代码的执行过程！🚀