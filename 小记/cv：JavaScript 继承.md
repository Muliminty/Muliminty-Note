
JavaScript 中的继承是面向对象编程的重要特性之一。它允许子类继承父类的属性和方法，进而实现代码复用。在 JavaScript 中有多种方式可以实现继承，每种方式有其优缺点。本文将详细介绍几种常见的继承方式，包括原型链继承、构造函数继承、组合继承、原型式继承以及 `class` 继承，并对其优缺点进行分析。

## 1. 原型链继承

原型链继承是 JavaScript 中最基础的继承方式。通过将子类的 `prototype` 指向父类的实例，子类便能够访问父类的属性和方法。

### 1.1 原型链继承示例

```javascript
function Parent() {
   this.isShow = true;
   this.info = {
       name: "yhd",
       age: 18,
   };
}

Parent.prototype.getInfo = function() {
   console.log(this.info);
   console.log(this.isShow); // true
};

function Child() {};
Child.prototype = new Parent();

let child1 = new Child();
child1.info.gender = "男";
child1.getInfo();  // {name: "yhd", age: 18, gender: "男"}

let child2 = new Child();
child2.getInfo();  // {name: "yhd", age: 18, gender: "男"}
child2.isShow = false;

console.log(child2.isShow); // false
```

### 1.2 原型链继承的问题

1. **共享引用类型属性**：父类的所有引用属性（如 `info`）会被所有子类共享。修改一个子类的引用属性，其他子类也会受到影响。
2. **无法传递构造函数参数**：原型链继承无法给父类构造函数传参。

### 1.3 原型链继承的优点

- **方法复用**：父类的方法可以被多个子类共享，避免了方法重复创建。

---

## 2. 盗用构造函数继承（构造函数继承）

通过在子类构造函数中调用父类构造函数，可以为每个实例创建独立的属性，避免了原型链继承中的引用共享问题。

### 2.1 盗用构造函数继承示例

```javascript
function Parent() {
  this.info = {
    name: "yhd",
    age: 19,
  };
}

function Child() {
    Parent.call(this);  // 继承父类属性
}

let child1 = new Child();
child1.info.gender = "男";
console.log(child1.info); // {name: "yhd", age: 19, gender: "男"}

let child2 = new Child();
console.log(child2.info); // {name: "yhd", age: 19}
```

### 2.2 盗用构造函数继承的问题

1. **方法无法复用**：每次创建子类实例时，构造函数中的方法会被重新创建，因此不能复用。
2. **只能继承属性**：该方式仅继承父类的实例属性，无法继承父类的原型方法。

### 2.3 盗用构造函数的优点

- **解决了引用类型共享问题**：每个实例都有自己的属性。
- **可以传递参数**：子类可以通过 `call()` 向父类构造函数传递参数。

### 2.4 传递参数

```javascript
function Parent(name) {
    this.info = { name: name };
}

function Child(name) {
    Parent.call(this, name);  // 传递参数
    this.age = 18;
}

let child1 = new Child("yhd");
console.log(child1.info.name); // "yhd"
console.log(child1.age); // 18
```

---

## 3. 组合继承

组合继承结合了原型链继承和构造函数继承的优点。它通过原型链继承父类的方法，通过构造函数继承父类的属性，从而实现了方法复用和属性独立。

### 3.1 组合继承示例

```javascript
function Parent(name) {
   this.name = name;
   this.colors = ["red", "blue", "yellow"];
}

Parent.prototype.sayName = function () {
   console.log(this.name);
};

function Child(name, age) {
   Parent.call(this, name);  // 继承父类属性
   this.age = age;
}

Child.prototype = new Parent();  // 继承父类方法

Child.prototype.sayAge = function () {
   console.log(this.age);
};

let child1 = new Child("yhd", 19);
child1.colors.push("pink");
console.log(child1.colors);  // ["red", "blue", "yellow", "pink"]
child1.sayAge();  // 19
child1.sayName(); // "yhd"

let child2 = new Child("wxb", 30);
console.log(child2.colors);  // ["red", "blue", "yellow"]
child2.sayAge();  // 30
child2.sayName(); // "wxb"
```

### 3.2 组合继承的问题

1. **调用父类构造函数两次**：在组合继承中，父类构造函数被调用两次：一次是在子类构造函数中调用 `Parent.call(this, name)`，另一次是在 `Child.prototype` 赋值时。这会造成性能上的浪费。

### 3.3 组合继承的优点

- **方法复用**：父类的方法由原型链继承，因此可以共享。
- **属性独立**：每个子类实例都有独立的属性，解决了引用类型共享的问题。

---

## 4. 原型式继承

原型式继承通过一个对象的浅复制来实现继承。它允许创建一个新对象并将一个现有对象作为其原型。

### 4.1 原型式继承示例

```javascript
function objectCopy(obj) {
  function Fun() {};
  Fun.prototype = obj;
  return new Fun();
}

let person = {
  name: "yhd",
  age: 18,
  friends: ["jack", "tom", "rose"],
  sayName: function() {
    console.log(this.name);
  }
};

let person1 = objectCopy(person);
person1.name = "wxb";
person1.friends.push("lily");
person1.sayName();  // wxb

let person2 = objectCopy(person);
person2.name = "gsr";
person2.friends.push("kobe");
person2.sayName();  // gsr

console.log(person.friends); // ["jack", "tom", "rose", "lily", "kobe"]
```

### 4.2 原型式继承的问题

2. **共享引用类型属性**：父类的引用类型属性会被所有子类共享，因此修改一个实例的属性会影响其他实例。

### 4.3 原型式继承的优点

- **简单易懂**：实现方式简单，可以通过 `Object.create()` 或 `objectCopy()` 进行原型复制。

---

## 5. `class` 实现继承

ES6 引入的 `class` 语法使得继承更加直观。`class` 本质上是对原型链继承和构造函数继承的一种语法糖。

### 5.1 `class` 继承示例

```javascript
class Parent {
    constructor(name, sex) {
        this.name = name;
        this.sex = sex;
    }
    sing() {
        console.log(this.sex);
    }
}

class Child extends Parent {
    song() {
        super.sing();
    }
    tell() {
        console.log(super.name);
    }
}

let xx = new Child('xx', 'boy');
xx.song();  // boy
xx.tell();  // undefined
```

### 5.2 `class` 继承的特点

- `class` 继承更简洁且易于理解。
- `super` 关键字用于调用父类的方法和构造函数。
- 支持实例方法和静态方法。

---

## 6. 总结

- **原型链继承**：实现简单，但无法解决引用类型共享和构造函数传参问题。
- **盗用构造函数继承**：解决了引用类型共享问题，但不能复用父类方法。
- **组合继承**：综合了两者的优点，但存在性能浪费。
- **原型式继承**：实现简单，但引用类型共享的问题未解决。
- **`class` 继承**：语法糖，简洁易懂，适合现代 JavaScript 开发。

每种继承方式都有其适用场景，在实际开发中需要根据需求选择合适的继承方式。