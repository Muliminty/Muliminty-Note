# !!!ECMAScript 规范组织与 JS 知识体系对照

## 1️⃣ ECMAScript 规范整体结构

* **规范名称**：ECMA-262
* **版本**：ES5 / ES6（ES2015） / ES2016 / … / ES2025
* **主要作用**：

  * 定义 JavaScript 的语法（Syntax）、语义（Semantics）、运行时行为（Runtime）
  * 明确内置对象、类型系统、模块系统、错误机制等
  * 提供跨平台、跨引擎的统一标准

---

## 2️⃣ 核心章节及对应 JS 层级

### 2.1 基础与通用条款

* **Scope & Conformance**

  * 定义规范范围和遵循要求
  * JS层级：基础规范、兼容性

* **Normative References**

  * 引用 Unicode、ISO 标准
  * JS层级：辅助知识

* **Terms and Definitions**

  * 定义关键术语，如“值”“对象”“执行上下文”等
  * JS层级：语义基础

* **Conventions**

  * 规范约定、符号、文档风格
  * JS层级：文法层约定

---

### 2.2 数据类型与对象

* **ECMAScript Language Types**

  * 原始类型：Undefined, Null, Boolean, Number, BigInt, String, Symbol
  * 对象类型：Object, Array, Function, Date, RegExp 等
  * JS层级：运行时类型系统

* **ECMAScript Objects**

  * 内置对象方法及行为
  * JS层级：运行时对象、标准库

---

### 2.3 文法层（Syntax）

* **Expressions**（表达式）

  * 算术、逻辑、位运算、赋值、条件表达式
  * JS层级：文法层表达式

* **Statements & Declarations**（语句与声明）

  * if/else、switch、for/while、try/catch
  * var/let/const、function、class 声明
  * JS层级：文法层语句、静态语义

* **Classes**

  * class 定义、继承、静态方法
  * JS层级：文法层 + 面向对象语义

* **Modules**

  * import/export、动态导入
  * JS层级：文法层模块、运行时加载

* **Operators**

  * 运算符优先级、类型转换行为
  * JS层级：文法层 + 动态语义

---

### 2.4 语义层（Semantics）

* **Functions**

  * 函数声明、表达式、箭头函数
  * 调用时 this 绑定规则
  * JS层级：动态语义、执行模型

* **Control Abstractions**

  * Iterator、Generator、Async/Await
  * JS层级：语义层迭代器与异步机制

* **Runtime Semantics**

  * 执行上下文、作用域链、变量环境、调用栈
  * JS层级：动态语义、执行模型

* **Errors**

  * 内置错误类型及捕获机制
  * JS层级：运行时异常

---

### 2.5 运行时层（Runtime）

* **Memory Management**

  * 垃圾回收算法（标记-清除、分代回收）
  * 内存模型、闭包引用
  * JS层级：内存管理

* **Execution Model**

  * 执行上下文、调用栈、事件循环、任务队列
  * JS层级：执行模型、动态语义

* **Type Conversion**

  * ToNumber, ToString, ToBoolean 等
  * JS层级：类型系统、运行时语义

---

### 2.6 附录与扩展

* **Annexes**

  * 规范示例、兼容性表、历史说明
  * JS层级：辅助材料

* **New Features / Proposals**

  * 每年新增特性（ES2016+）
  * async iteration, BigInt, Proxy, Reflect, Top-level await
  * JS层级：跨层特性

---

## 3️⃣ ECMAScript 规范对应 JS 知识体系映射

| JS 层级 | 规范章节示例                                               | 内容说明                     |
| ----- | ---------------------------------------------------- | ------------------------ |
| 文法层   | Expressions, Statements, Operators, Classes, Modules | 语法结构、表达式、运算符、类和模块语法      |
| 语义层   | Functions, Control Abstractions, Runtime Semantics   | 调用机制、this绑定、迭代器、异步、执行上下文 |
| 运行时层  | Language Types, Objects, Memory Management           | 类型系统、对象行为、内存管理、垃圾回收      |
| 辅助层   | Annexes, Normative References                        | 示例、兼容性、引用标准              |

---

## 4️⃣ ECMAScript 特性分类（跨层）

* **静态语义**：var/let/const 提升，TDZ
* **动态语义**：原型链、this绑定、类型转换
* **运行时**：调用栈、事件循环、闭包、GC
* **跨层特性**：async/await、Proxy、Reflect、Top-level await

---

## 5️⃣ 对笔记与知识体系建设的启示

* **文法层笔记**：表达式、语句、类、模块、运算符
* **语义层笔记**：函数调用、迭代器、异步机制、作用域
* **运行时层笔记**：类型系统、内置对象、内存管理、执行模型
* **跨层笔记**：异步迭代、Proxy/Reflect、BigInt、Top-level await
* **MOC 结构**：可以直接按规范章节建立 MOC 文件，并双链原子笔记
* **更新维护**：每年 ES 新特性加入对应章节 MOC 与目录

---

如果你愿意，我可以帮你画一张 **“ECMAScript 规范章节 → JS 知识体系层级” 的可视化图**，用文字图或 ASCII 图展示文法、语义、运行时的层级和跨层特性。

你希望我画吗？
