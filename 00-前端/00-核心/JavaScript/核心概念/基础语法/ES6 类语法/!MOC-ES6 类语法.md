- **类的基本定义**
  - 使用 `class` 关键字定义类，语法更接近传统面向对象语言。
  - 示例：
    ```javascript
    class Person {
      constructor(name) {
        this.name = name;
      }
    }
    ```

- **`constructor` 方法**
  - 类的构造函数，用于初始化实例属性。
  - 每个类只能有一个 `constructor`，未定义时默认生成空构造函数。
  - 通过 `new` 创建实例时自动调用。

- **实例属性和方法**
  - 实例属性可在 `constructor` 内定义（如 `this.property = value`）。
  - 类体中定义的方法会添加到原型对象上，供所有实例共享：
    ```javascript
    class Person {
      sayHello() {
        console.log(`Hello, ${this.name}!`);
      }
    }
    ```

- **静态方法和静态属性**
  - 静态方法用 `static` 修饰，属于类本身而非实例：
    ```javascript
    class MathUtils {
      static add(a, b) {
        return a + b;
      }
    }
    MathUtils.add(1, 2); // 直接通过类调用
    ```
  - ES6 不支持静态属性语法，但可通过赋值实现：
    ```javascript
    class MyClass {}
    MyClass.staticProperty = 42;
    ```
  - ES2022+ 支持 `static` 声明静态属性：
    ```javascript
    class MyClass {
      static staticProperty = 42;
    }
    ```

- **继承与 `extends`、`super`**
  - 使用 `extends` 实现继承：
    ```javascript
    class Student extends Person {
      constructor(name, grade) {
        super(name); // 必须先调用父类构造函数
        this.grade = grade;
      }
    }
    ```
  - `super` 在构造函数中指向父类构造函数，在方法中指向父类原型。

- **私有属性和方法**
  - ES6 无原生支持，常用 `_` 前缀约定表示私有。
  - ES2022+ 支持私有字段（`#` 前缀）：
    ```javascript
    class Counter {
      #count = 0; // 私有属性
      #increment() { // 私有方法
        this.#count++;
      }
    }
    ```

- **Getter 和 Setter**
  - 使用 `get` 和 `set` 定义属性的访问拦截逻辑：
    ```javascript
    class Rectangle {
      constructor(width, height) {
        this._width = width;
        this._height = height;
      }
      get area() {
        return this._width * this._height;
      }
    }
    ```

- **类表达式**
  - 类可以像函数一样以表达式形式定义：
    ```javascript
    const MyClass = class {
      constructor() {}
      method() {}
    };
    ```

- **注意事项**
  - **无提升**：类声明不会提升，必须先定义后使用。
  - **严格模式**：类体默认处于严格模式。
  - **必须使用 `new`**：直接调用类会报错（如 `Person()` 无效）。
  - **方法不可枚举**：类方法默认 `enumerable: false`。

- **与原型继承的关系**
  - `class` 是语法糖，本质仍基于原型链。
  - 类方法定义在原型上（如 `Person.prototype.sayHello`）。
  - `typeof MyClass` 返回 `"function"`（类本质是构造函数）。

- **Mixins 模式**
  - 通过组合多个类的功能实现“伪多重继承”：
    ```javascript
    const Serializable = Base => class extends Base {
      serialize() {
        return JSON.stringify(this);
      }
    };
    class User extends Serializable(Person) {}
    ```