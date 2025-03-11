
| **类别**               | **内容**                                               | **示例/说明**                                                                                         |
| -------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **编译时确定**            |                                                      |                                                                                                   |
| 1. **变量/函数声明提升**     | `var`、`function` 声明会被提升到作用域顶部（声明提升，赋值不提升）。           | ```javascript console.log(a); // undefined var a = 10; ```                                        |
| 2. **词法作用域结构**       | 作用域嵌套关系、标识符的静态作用域在代码编写时确定（词法作用域）。                    | ```javascript function outer() { let x = 1; function inner() { console.log(x); } } ```            |
| 3. **语法检查**          | 语法错误（如括号不匹配、非法标识符）在解析阶段抛出。                           | ```javascript let 1a = 10; // SyntaxError ```                                                     |
| 4. **箭头函数的 `this`**  | 箭头函数的 `this` 在定义时确定，继承外层作用域的 `this`（编译时绑定）。          | ```javascript const obj = { fn: () => { console.log(this); } }; // this 指向外层（如window） ```         |
| **运行时确定**            |                                                      |                                                                                                   |
| 1. **`this` 的值**     | 普通函数的 `this` 由调用方式决定（如 `obj.fn()`、`fn.call(ctx)`）。   | ```javascript function test() { console.log(this); } test(); // window test.call(obj); // obj ``` |
| 2. **作用域链的实际引用**     | 执行上下文创建时，确定当前作用域链（变量环境 + 外部引用）。                      | 闭包中访问外层变量时，运行时查找作用域链。                                                                             |
| 3. **变量赋值**          | 变量赋值操作在运行时执行（包括 `let`/`const` 的初始化）。                 | ```javascript let a = 10; // 声明在编译时处理，赋值在运行时 ```                                                  |
| 4. **动态作用域行为**       | `eval()`、`with` 等动态代码可能修改作用域链（严格模式下被限制）。             | ```javascript function dyn() { eval('var x = 10'); console.log(x); // 10（非严格模式） ```               |
| 5. **原型链查找**         | 对象属性的访问通过运行时原型链逐级查找。                                 | ```javascript obj.toString() // 运行时查找 Object.prototype.toString ```                               |
| 6. **事件循环与异步**       | 宏任务（如 `setTimeout`）、微任务（如 `Promise`）的执行顺序由运行时事件循环管理。 | ```javascript setTimeout(() => {}, 0); // 回调由事件循环调度 ```                                           |
| 7. **动态 `import()`** | 动态导入模块在运行时异步加载。                                      | ```javascript import('./module.js').then(...); ```                                                |

---

### **关键差异总结**
- **编译时**：静态分析代码结构，处理声明、作用域嵌套、语法检查等，不执行代码。
- **运行时**：动态执行代码，处理赋值、`this`、作用域链实例化、异步任务等。

### **经典示例：`this` 的动态性**
```javascript
const obj = {
  name: "Alice",
  sayName: function() { console.log(this.name); }
};

const fn = obj.sayName;
obj.sayName(); // "Alice"（this 指向 obj）
fn();          // undefined（非严格模式下 this 指向 window）
```

### **注意**
- **严格模式**：`use strict` 下，未绑定的 `this` 为 `undefined`，避免隐式全局污染。
- **箭头函数**：其 `this` 在编译时绑定，无法通过 `call`/`apply` 修改。

理解编译时和运行时的机制，能帮助开发者避免作用域、`this` 等常见陷阱，写出更可靠的代码。