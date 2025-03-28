- **对象基础**
  - 对象的定义与字面量语法
  - 属性的访问方式：点符号 vs. 方括号
  - 动态添加/删除属性
  - 对象方法（函数作为属性）
  - 对象引用特性（浅拷贝 vs. 深拷贝）

- **构造函数**
  - `new` 关键字的作用机制
  - 构造函数与普通函数的区别
  - 手动实现构造函数返回值的影响

- **原型（Prototype）**
  - 原型对象（`prototype` 属性）
  - 隐式原型引用（`__proto__`，已弃用，建议用 `Object.getPrototypeOf()`）
  - 原型链的继承机制
  - `constructor` 属性的作用与修正
  - 原型链的终点：`Object.prototype` → `null`

- **创建对象的模式**
  - 工厂模式（简单封装）
  - 构造函数模式（实例独立属性）
  - 原型模式（共享属性与方法）
  - 组合模式（构造函数 + 原型，最常用）
  - ES6 的 `class` 语法（语法糖，本质基于原型）

- **继承的实现方式**
  - 原型链继承（缺点：引用属性共享）
  - 构造函数继承（缺点：方法无法复用）
  - 组合继承（原型链 + 构造函数，优化版）
  - 原型式继承（`Object.create()` 的底层逻辑）
  - 寄生组合继承（最理想的继承方案）
  - ES6 `extends` 与 `super` 关键字

- **关键方法与操作**
  - `Object.create()`（指定原型创建对象）
  - `Object.getPrototypeOf()` / `Object.setPrototypeOf()`
  - `instanceof` 的原理与局限性
  - `Object.prototype.isPrototypeOf()`
  - `hasOwnProperty()` 检测自身属性
  - `in` 操作符（遍历原型链属性）

- **属性描述符**
  - 数据描述符：`value`, `writable`, `enumerable`, `configurable`
  - 存取描述符：`get`, `set`
  - `Object.defineProperty()` / `Object.defineProperties()`
  - `Object.getOwnPropertyDescriptor()`

- **ES6+ 特性扩展**
  - 属性与方法简写（`{ x, method() {} }`）
  - 计算属性名（`{ [key]: value }`）
  - `super` 关键字在对象方法中的使用
  - 对象扩展运算符（`{ ...obj }` 浅拷贝）

- **常见问题与陷阱**
  - 修改内置对象原型的风险（如 `Array.prototype`）
  - 原型链过长导致的性能问题
  - `for...in` 遍历时原型属性的干扰
  - 循环引用与深拷贝的实现挑战

- **最佳实践**
  - 优先使用 `Object.create(null)` 创建纯净字典对象
  - 避免直接修改 `__proto__`，使用标准 API
  - 使用 `class` 语法简化面向对象代码
  - 明确区分实例属性与原型属性

- **示例：原型链关系验证**
  ```javascript
  function Person() {}
  const p = new Person();
  // 原型链：p → Person.prototype → Object.prototype → null
  console.log(p instanceof Person); // true
  console.log(Object.getPrototypeOf(p) === Person.prototype); // true
  ```