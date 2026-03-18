# this 绑定（this Binding）

`this` 的绑定规则和上下文。

---

## 📚 this 绑定规则

### 1. 默认绑定（Default Binding）

非严格模式下，`this` 指向全局对象（浏览器中是 `window`）：

```javascript
function greet() {
  console.log(this); // window（浏览器中）
}

greet();
```

严格模式下，`this` 为 `undefined`：

```javascript
'use strict';
function greet() {
  console.log(this); // undefined
}

greet();
```

---

### 2. 隐式绑定（Implicit Binding）

方法调用时，`this` 指向调用该方法的对象：

```javascript
const person = {
  name: 'Alice',
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }
};

person.greet(); // "Hello, I'm Alice"（this 指向 person）
```

### 隐式绑定丢失

```javascript
const person = {
  name: 'Alice',
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }
};

const greet = person.greet;
greet(); // "Hello, I'm undefined"（this 丢失，指向全局对象）
```

---

### 3. 显式绑定（Explicit Binding）

使用 `call`、`apply`、`bind` 显式指定 `this`：

#### call()

```javascript
function greet(greeting) {
  console.log(`${greeting}, I'm ${this.name}`);
}

const person = { name: 'Alice' };
greet.call(person, 'Hello'); // "Hello, I'm Alice"
```

#### apply()

```javascript
function greet(greeting, punctuation) {
  console.log(`${greeting}, I'm ${this.name}${punctuation}`);
}

const person = { name: 'Alice' };
greet.apply(person, ['Hello', '!']); // "Hello, I'm Alice!"
```

#### bind()

```javascript
function greet() {
  console.log(`Hello, I'm ${this.name}`);
}

const person = { name: 'Alice' };
const boundGreet = greet.bind(person);
boundGreet(); // "Hello, I'm Alice"
```

---

### 4. new 绑定（new Binding）

使用 `new` 调用构造函数时，`this` 指向新创建的对象：

```javascript
function Person(name) {
  this.name = name;
}

const person = new Person('Alice');
console.log(person.name); // "Alice"
```

---

### 5. 箭头函数绑定（Arrow Function Binding）

箭头函数不绑定 `this`，继承外层作用域的 `this`：

```javascript
const person = {
  name: 'Alice',
  greet: function() {
    setTimeout(() => {
      console.log(`Hello, I'm ${this.name}`); // this 指向 person
    }, 100);
  }
};

person.greet(); // "Hello, I'm Alice"
```

对比普通函数：

```javascript
const person = {
  name: 'Alice',
  greet: function() {
    setTimeout(function() {
      console.log(`Hello, I'm ${this.name}`); // this 指向 window
    }, 100);
  }
};

person.greet(); // "Hello, I'm undefined"
```

---

## 🎯 绑定优先级

优先级从高到低：

1. **new 绑定** > **显式绑定** > **隐式绑定** > **默认绑定**
2. **箭头函数**（不参与优先级，继承外层）

```javascript
// 示例：new 绑定优先级最高
function Person(name) {
  this.name = name;
}

const obj = {};
const person = Person.call(obj, 'Alice'); // 显式绑定
console.log(obj.name); // "Alice"

const person2 = new Person('Bob'); // new 绑定
console.log(person2.name); // "Bob"
```

---

## 💡 常见场景

### 1. 事件处理

```javascript
class Button {
  constructor(text) {
    this.text = text;
    this.element = document.createElement('button');
    this.element.textContent = text;
    // 需要绑定 this
    this.element.addEventListener('click', this.handleClick.bind(this));
  }
  
  handleClick() {
    console.log(`Button "${this.text}" clicked`);
  }
}
```

### 2. 回调函数

```javascript
class DataFetcher {
  constructor(url) {
    this.url = url;
  }
  
  fetch() {
    // 使用箭头函数保持 this
    fetch(this.url)
      .then(response => {
        this.handleResponse(response);
      });
  }
  
  handleResponse(response) {
    console.log(`Fetched from ${this.url}`);
  }
}
```

### 3. 方法作为回调

```javascript
const person = {
  name: 'Alice',
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }
};

// ❌ this 丢失
setTimeout(person.greet, 100);

// ✅ 使用 bind
setTimeout(person.greet.bind(person), 100);

// ✅ 使用箭头函数
setTimeout(() => person.greet(), 100);
```

---

## ⚠️ 注意事项

### 1. 箭头函数不能改变 this

```javascript
const person = {
  name: 'Alice',
  greet: () => {
    console.log(this.name); // this 指向外层（可能是 window）
  }
};

person.greet(); // undefined
```

### 2. 严格模式影响

```javascript
'use strict';
function greet() {
  console.log(this); // undefined（非严格模式是 window）
}

greet();
```

### 3. 类方法自动绑定（实验性）

```javascript
class Person {
  name = 'Alice';
  
  // 使用箭头函数自动绑定
  greet = () => {
    console.log(`Hello, I'm ${this.name}`);
  }
}
```

---

## 🔗 相关链接

- [对象](./对象.md) — 对象基础
- [类](./类.md) — ES6 类语法
- [原型与继承](./原型与继承.md) — 原型链机制
- [箭头函数](../07-函数式编程/箭头函数.md) — 箭头函数详解

---

**参考**：
- [MDN: this](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this)
- [You Don't Know JS: this & Object Prototypes](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/this%20%26%20object%20prototypes/README.md)

---

#javascript #this #绑定 #context #arrow-function
