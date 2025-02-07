# JavaScript 原型链的详细解析

JavaScript 中的原型链是一个非常重要的概念，理解原型链有助于我们更好地理解对象的继承、属性查找以及性能优化等方面。在这篇文章中，我们将深入解析原型链的工作原理、如何利用原型链进行继承、以及一些常见的问题和最佳实践。

---

## 1. 什么是原型链？

在 JavaScript 中，**每一个对象**都有一个与之关联的**原型对象**。原型对象本身也是一个对象，它也有一个原型对象，这样形成了一个**链式结构**，我们称之为 **原型链**。

### 1.1 原型链的构成

- 每个对象都有一个内置的属性 `[[Prototype]]`，它指向对象的原型。
- 对象通过原型链继承了原型对象的属性和方法。当我们访问对象的属性时，JavaScript 引擎会在对象自身查找，如果没有找到，会沿着原型链向上查找，直到找到该属性或达到 `null` 为止。

**基本原型链结构**：

- **对象**：每个对象都有一个 `[[Prototype]]`，它指向其构造函数的原型对象。
- **构造函数**：构造函数本身也是对象，它有一个 `prototype` 属性，指向构造函数的原型对象。

### 1.2 示例

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.sayHello = function() {
  console.log(`Hello, ${this.name}`);
};

const person = new Person('John');

person.sayHello(); // Hello, John
```

在这个例子中：

- `person` 对象没有 `sayHello` 方法，所以 JavaScript 引擎会沿着原型链查找。首先会去 `Person.prototype` 查找，找到了 `sayHello` 方法。
- `person` 的原型是 `Person.prototype`，而 `Person.prototype` 的原型是 `Object.prototype`，最终原型链的末端是 `null`。

## 2. 原型链的工作原理

### 2.1 每个对象的原型链

每个对象在创建时，都会有一个默认的原型对象。例如，所有通过构造函数创建的实例，其原型都是该构造函数的 `prototype` 对象。并且每个对象的原型链会一直指向其父对象的原型，直到原型链的最顶端。

#### 例子：基本原型链

```javascript
function Animal(name) {
  this.name = name;
}

Animal.prototype.sayName = function() {
  console.log(`My name is ${this.name}`);
};

const dog = new Animal('Rex');

dog.sayName(); // My name is Rex
console.log(dog.__proto__ === Animal.prototype); // true
console.log(Animal.prototype.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__); // null
```

**原型链关系**：

- `dog.__proto__` 指向 `Animal.prototype`。
- `Animal.prototype.__proto__` 指向 `Object.prototype`。
- `Object.prototype.__proto__` 是 `null`，表示原型链的顶端。

### 2.2 属性查找过程

当访问对象的属性时，JavaScript 引擎会首先检查对象自身是否包含该属性。如果没有，它会沿着原型链继续查找，直到找到该属性或者原型链的末端（`null`）。

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.sayHello = function() {
  console.log(`Hello, ${this.name}`);
};

const person = new Person('John');

console.log(person.name); // John
console.log(person.sayHello); // [Function: sayHello]
```

在访问 `person.sayHello` 时，JavaScript 会先检查 `person` 本身是否有 `sayHello` 属性，如果没有，则会在 `Person.prototype` 上查找。

### 2.3 `Object.prototype`

所有对象的原型链最终都会指向 `Object.prototype`，这是原型链的顶端。`Object.prototype` 是所有 JavaScript 对象的基类，它提供了一些常用的方法，如 `toString`、`hasOwnProperty` 等。

```javascript
const obj = {};
console.log(obj.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__); // null
```

## 3. 原型链继承

原型链继承是 JavaScript 实现继承的一种方式。通过将一个对象的原型指向另一个对象，我们可以实现属性和方法的继承。

### 3.1 基本的原型链继承

```javascript
function Animal(name) {
  this.name = name;
}

Animal.prototype.sayName = function() {
  console.log(`My name is ${this.name}`);
};

function Dog(name, breed) {
  Animal.call(this, name); // 调用父类构造函数
  this.breed = breed;
}

Dog.prototype = Object.create(Animal.prototype); // 继承 Animal 的原型
Dog.prototype.constructor = Dog; // 修正构造函数指向

const dog = new Dog('Rex', 'Golden Retriever');
dog.sayName(); // My name is Rex
console.log(dog.breed); // Golden Retriever
```

在这个例子中，`Dog` 继承了 `Animal` 的属性和方法。通过 `Object.create(Animal.prototype)` 将 `Dog.prototype` 指向 `Animal.prototype`，实现了原型链继承。

### 3.2 原型链继承的缺点

- **共享引用类型的属性**：如果父类原型上有引用类型的属性，那么子类所有实例都会共享这个属性，导致数据污染。
- **无法向父类传递参数**：在传统的原型链继承中，无法传递参数给父类构造函数。

### 3.3 解决原型链继承的缺点

通过 `Object.create()` 创建一个新的对象，避免共享引用类型的属性，同时也能传递父类构造函数的参数。

```javascript
function Dog(name, breed) {
  Animal.call(this, name); // 调用父类构造函数
  this.breed = breed;
}

Dog.prototype = Object.create(Animal.prototype); // 继承父类原型
Dog.prototype.constructor = Dog; // 修正构造函数指向
```

## 4. 原型链的常见问题

### 4.1 `__proto__` 和 `prototype`

- **`prototype`**：是构造函数的属性，用于设置该构造函数的实例的原型。
- **`__proto__`**：是对象的属性，指向该对象的原型对象。每个对象都有一个 `__proto__` 属性，用于访问原型链。

### 4.2 `instanceof` 和 `constructor`

- **`instanceof`**：用于判断对象是否是某个构造函数的实例。
- **`constructor`**：是对象的构造函数指针，可以通过它来判断对象的类型。

```javascript
const dog = new Dog('Rex', 'Golden Retriever');
console.log(dog instanceof Dog); // true
console.log(dog.constructor === Dog); // true
```

### 4.3 `Object.create()` 和原型链

`Object.create()` 创建一个新对象，并设置它的原型。它是一种创建新对象并继承原型的方法。

```javascript
const newObj = Object.create(Animal.prototype);
```

## 5. 总结

JavaScript 的原型链是一个强大且灵活的机制，用于实现继承和属性查找。通过理解原型链的工作原理，我们可以更好地利用它来管理对象的继承关系、优化性能并避免常见的错误。理解原型链有助于我们编写更高效、可维护的代码。

[JS原型链与继承别再被问倒了我面试过很多同学，其中能把原型继承讲明白的寥寥无几，能把new操作符讲明白的就更少了。](../剪藏/000-Inbox/JS原型链与继承别再被问倒了我面试过很多同学，其中能把原型继承讲明白的寥寥无几，能把new操作符讲明白的就更少了。希望这%20-%20掘金.md)

![](https://image-static.segmentfault.com/217/369/2173695793-d09719e75573427e)