### 词法作用域（Lexical Scope）

**词法作用域**（也称为静态作用域）是指变量的作用域在代码编写时就已经确定，而不是在运行时确定。换句话说，作用域是由代码的结构（如函数、块等）决定的，而不是由函数的调用方式决定的。

#### 特点：
1. **静态性**：作用域在代码编写时就已经确定，不会在运行时改变。
2. **嵌套性**：内部作用域可以访问外部作用域的变量，但外部作用域不能访问内部作用域的变量。
3. **基于代码结构**：作用域的划分基于代码的物理结构（如函数、块等）。

#### 示例：
```javascript
let x = 10;

function outer() {
    let y = 20;
    
    function inner() {
        let z = 30;
        console.log(x + y + z); // 60
    }
    
    inner();
}

outer();
```
在这个例子中，`inner` 函数可以访问 `x`、`y` 和 `z`，因为 `inner` 的作用域嵌套在 `outer` 和全局作用域中。

### 词法环境（Lexical Environment）

**词法环境**是 JavaScript 引擎用来管理作用域和变量的内部数据结构。每个词法环境都有一个环境记录（Environment Record）和一个对外部词法环境的引用（outer reference）。

#### 组成：
1. **环境记录（Environment Record）**：存储变量和函数声明的实际位置。
2. **外部词法环境引用（Outer Lexical Environment Reference）**：指向外部的词法环境，用于实现作用域链。

#### 示例：
```javascript
let x = 10;

function outer() {
    let y = 20;
    
    function inner() {
        let z = 30;
        console.log(x + y + z); // 60
    }
    
    inner();
}

outer();
```
在这个例子中：
- `inner` 函数的词法环境包含 `z`，并引用 `outer` 函数的词法环境。
- `outer` 函数的词法环境包含 `y`，并引用全局词法环境。
- 全局词法环境包含 `x`。

### 关系

- **词法作用域**是概念，描述作用域的静态性和嵌套性。
- **词法环境**是实现词法作用域的具体机制，通过环境记录和外部引用来管理变量和作用域链。

### 总结

- **词法作用域**决定了变量的可见性和生命周期。
- **词法环境**是 JavaScript 引擎用来实现词法作用域的内部机制。

