
TypeScript 在 JavaScript 基础上进行了增强，最大的特点是 **静态类型**。你可以给变量、函数等定义类型，TypeScript 会在编译阶段检查类型错误。

#### 1.1 **安装 TypeScript**
首先，你需要安装 TypeScript 编译器：
```bash
npm install -g typescript
```

#### 1.2 **类型声明**
你可以为变量、函数、类等声明类型：

```typescript
let num: number = 10;
let str: string = 'Hello, TypeScript';
let isActive: boolean = true;
```

#### 1.3 **函数类型**
TypeScript 支持为函数指定参数和返回值的类型：
```typescript
function greet(name: string): string {
  return `Hello, ${name}`;
}
```

#### 1.4 **数组和元组**
```typescript
let arr: number[] = [1, 2, 3]; // 数字类型数组
let tuple: [string, number] = ['Alice', 30]; // 元组类型
```

#### 1.5 **对象类型**
你可以指定对象的结构：
```typescript
let person: { name: string, age: number } = { name: 'Alice', age: 30 };
```

### 2. **高级类型**
TypeScript 提供了许多高级类型，用于描述更复杂的数据结构。

#### 2.1 **联合类型 (Union Types)**
允许变量是多种类型之一：
```typescript
let id: string | number;
id = 'abc';
id = 123;
```

#### 2.2 **交叉类型 (Intersection Types)**
将多个类型合并为一个类型：
```typescript
type User = { name: string };
type Employee = { id: number };
type EmployeeUser = User & Employee; // 交叉类型
let employee: EmployeeUser = { name: 'Alice', id: 123 };
```

#### 2.3 **类型别名 (Type Aliases)**
可以为类型创建别名，简化复杂的类型声明：
```typescript
type Point = { x: number, y: number };
let p: Point = { x: 10, y: 20 };
```

#### 2.4 **枚举 (Enums)**
枚举类型是 TypeScript 提供的特殊类型，它是一个数值集合：
```typescript
enum Direction {
  Up = 1,
  Down,
  Left,
  Right
}
let move: Direction = Direction.Up;
```

### 3. **接口 (Interfaces)**
接口是 TypeScript 中用于定义对象结构的关键特性。它比类型别名更适合描述对象和类的形状。

```typescript
interface Person {
  name: string;
  age: number;
}

let john: Person = { name: 'John', age: 25 };
```

接口可以扩展其他接口：

```typescript
interface Employee extends Person {
  id: number;
}
let employee: Employee = { name: 'Alice', age: 30, id: 123 };
```

### 4. **类 (Classes)**
TypeScript 支持类，并且你可以在类中使用类型注解。

```typescript
class Person {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  greet(): string {
    return `Hello, my name is ${this.name}`;
  }
}

let person = new Person('Alice', 25);
```

### 5. **泛型 (Generics)**
泛型是 TypeScript 的强大特性，允许你在定义函数或类时，不预先指定具体的类型，而是在调用时传入类型。

```typescript
function identity<T>(arg: T): T {
  return arg;
}

let result = identity<string>('Hello');
```

你也可以用泛型约束类型：

```typescript
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}
```

### 6. **配置和编译**
TypeScript 使用 `tsconfig.json` 文件来配置项目。在项目根目录中创建一个 `tsconfig.json` 文件来指定编译选项。

```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "./dist"
  }
}
```

通过运行 `tsc` 命令来编译 TypeScript 文件：
```bash
tsc
```

### 7. **TypeScript 与 JavaScript 配合使用**
你可以在现有的 JavaScript 项目中逐步引入 TypeScript。你只需将文件扩展名改为 `.ts`，并开始逐步添加类型。

### 8. **TypeScript 的类型推断**
TypeScript 强大的地方在于它的类型推断。即使你不显式地声明类型，TypeScript 也会根据上下文推断变量类型：

```typescript
let message = 'Hello, TypeScript'; // 类型推断为 string
```

### 9. **TypeScript 和 React**
在 React 中使用 TypeScript 可以为组件的 props 和 state 添加类型，帮助在开发过程中捕获类型错误。

```tsx
import React from 'react';

interface AppProps {
  title: string;
}

const App: React.FC<AppProps> = ({ title }) => {
  return <h1>{title}</h1>;
};
```

