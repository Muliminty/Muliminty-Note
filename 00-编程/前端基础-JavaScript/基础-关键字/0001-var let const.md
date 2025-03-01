关于 `var let const` 变量声明 的完整知识体系梳理，从基础到深度逐步递进：

首先让我们先熟悉一个 `var` 这个关键字
### **一、基础认知（青铜段位）**
#### 1. 声明方式
```javascript
var name = "小明";  // 声明并初始化
var age;           // 声明不初始化 → 默认值 undefined
```

#### 2. 变量提升（Hoisting）
```javascript
console.log(a);  // undefined（不会报错）
var a = 10;
// 等效于：
var a;
console.log(a);
a = 10;
```

#### 3. 函数作用域
```javascript
function test() {
  var inner = "内部变量";
  if (true) {
    var secret = "秘密"; 
  }
  console.log(secret); // "秘密"（if块不产生作用域）
}
```

---

### **二、进阶特性（白银段位）**
#### 1. 全局变量绑定
```javascript
var globalVar = "全局";
console.log(window.globalVar); // "全局"（浏览器环境）
```

#### 2. 重复声明
```javascript
var x = 1;
var x = 2;    // 合法
console.log(x); // 2
```

#### 3. 暂时性死区对比
```javascript
console.log(a); // undefined（var声明提升）
var a = 1;

console.log(b); // ReferenceError（let的TDZ）
let b = 2;
```

---

### **三、典型陷阱（黄金段位）**
#### 1. 循环闭包陷阱
```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i)); // 输出3次3
}
// 解决方案：立即执行函数或改用let
```

#### 2. 变量覆盖
```javascript
var userId = "A123";
function printId() {
  console.log(userId); // undefined（声明提升覆盖外层）
  var userId = "B456";
}
```

#### 3. 意外全局变量
```javascript
function leak() {
  leaked = "未声明直接赋值"; // 自动成为全局变量
  var valid = "正常局部变量";
}
```

---

### **四、深度原理（铂金段位）**
#### 1. 执行上下文中的变量环境
```javascript
// 执行上下文结构
ExecutionContext = {
  VariableEnvironment: {
    a: undefined,  // var声明在此
    func: <function>
  },
  LexicalEnvironment: {...} // let/const在此
}
```

#### 2. Babel转译策略
```javascript
// 原始代码
function demo() {
  var a = 1;
  {
    var b = 2;
  }
}

// Babel转译后（ES5）
function demo() {
  var a = 1;
  var b = 2;
}
```

#### 3. 严格模式变化
```javascript
'use strict';
delete window.globalVar; // 禁止删除var声明的全局变量
var eval = 10;          // 禁止覆盖eval
```

---

### **五、现代应用（钻石段位）**
#### 1. 模块模式中的私有变量
```javascript
var Counter = (function() {
  var count = 0; // 真正的私有变量
  
  return {
    increment() { count++ },
    get() { return count }
  };
})();
```

#### 2. 惰性加载函数
```javascript
var getData = (function() {
  var cachedData; // 利用闭包缓存
  
  return function() {
    if (!cachedData) {
      cachedData = heavyOperation();
    }
    return cachedData;
  }
})();
```

#### 3. 兼容性垫片（Polyfill）
```javascript
// 模拟块级作用域（ES3时代技巧）
(function() {
  var tmp = calculateValue();
  // 使用tmp的代码
})();
```

---

### **六、专家级认知（王者段位）**
#### 1. 引擎优化差异
```javascript
// V8引擎对重复var声明的优化策略：
function optFunc() {
  var a = 1;
  var a = 2; // 被优化为直接赋值
}
```

#### 2. 内存回收特性
```javascript
function createClosure() {
  var bigData = new Array(1e6).fill("*");
  return function() { /* 持有bigData引用 */ };
}
// 闭包不释放时，var变量无法被GC回收
```

#### 3. 与 `with` 语句的交互
```javascript
var x = 1;
with ({x: 2}) {
  console.log(x); // 2（with对象优先）
  var y = 3;      // y会被声明到外部函数作用域
}
console.log(y);   // 3
```

---

### **总结：现代最佳实践**
1. 优先使用 `const`，其次 `let`
2. 仅在需要函数级作用域/提升特性时使用 `var`
3. 使用 ESLint 规则 `no-var` 强制避免使用
4. 理解遗留代码中的 `var` 行为
5. 在需要精确控制变量生命周期的场景合理使用（如性能优化）

```javascript
// 现代推荐模式
(function() {
  // 使用IIFE创建独立作用域
  const current = new Date();
  var legacyVar = "旧代码"; // 需要保留的var声明
  // 主逻辑使用const/let
})();
```