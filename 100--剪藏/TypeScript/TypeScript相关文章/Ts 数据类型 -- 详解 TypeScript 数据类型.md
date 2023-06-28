---
link: https://juejin.cn/post/6997576373728444446
title: TS入门篇 | 详解 TypeScript 数据类型
description: “这是我参与8月更文挑战的第10天，活动详情查看： 8月更文挑战” 一、简单基础类型 在说TypeScript数据类型之前，先来看看在TypeScript中定义数据类型的基本语法。 在语法层面，缺省类
keywords: 前端,TypeScript
author: 首页 首页 沸点 课程 直播 活动 竞赛 商城 App 插件 搜索历史 清空 创作者中心 写文章 发沸点 写笔记 写代码 草稿箱 创作灵感 查看更多 会员 登录
date: 2021-08-18T01:30:41.000Z
publisher: 稀土掘金
stats: paragraph=133 sentences=91, words=1027
---
## 一、简单基础类型

在说TypeScript数据类型之前，先来看看在TypeScript中定义数据类型的基本语法。

在语法层面，缺省类型注解的 TypeScript 与 JavaScript 完全一致。因此，可以把 TypeScript 代码的编写看作是为 JavaScript 代码添加类型注解。

在 TypeScript 语法中，类型的标注主要通过类型后置语法来实现：" **变量: 类型**"

```typescript
let num = 996
let num: number = 996
复制代码
```

上面代码中，第一行的语法是同时符合 JavaScript 和 TypeScript 语法的，这里隐式的定义了num是数字类型，我们就不能再给num赋值为其他类型。而第二行代码显式的声明了变量num是数字类型，同样，不能再给num赋值为其他类型，否则就会报错。

在 JavaScript 中，原始类型指的是 **非对象且没有方法**的数据类型，包括：number、boolean、string、null、undefined、symbol、bigInt。

| JavaScript原始基础类型 | TypeScript类型 |
|--|--|
| number    | number    |
| boolean   | boolean   |
| string    | string    |
| null      | null      |
| undefined | undefined |
| symbol    | symbol    |
| bigInt    | bigInt    |

需要注意 **number**和 **Number**的区别：TypeScript中指定类型的时候要用 number ，这是TypeScript的类型关键字。而 Number 是 JavaScript 的原生构造函数，用它来创建数值类型的值，这两个是不一样的。包括 **string**、 **boolean**等都是TypeScript的类型关键字，而不是JavaScript语法。

### 1. number

TypeScript 和 JavaScript 一样，所有数字都是 **浮点数**，所以只有一个 number 类型。

TypeScript 还支持 ES6 中新增的二进制和八进制字面量，所以 TypeScript 中共支持 **2、8、10和16**这四种进制的数值：

```typescript
let num: number;
num = 123;
num = "123";
num = 0b1111011;
num = 0o173;
num = 0x7b;
复制代码
```

### 2. string

字符串类型可以使用单引号和双引号来包裹内容，但是如果使用 Tslint 规则，会对引号进行检测，使用单引号还是双引号可以在 Tslint 规则中进行配置。除此之外，还可以使用 ES6 中的模板字符串来拼接变量和字符串会更为方便。

```typescript
let str: string = "Hello World";
str = "Hello TypeScript";
const first = "Hello";
const last = "TypeScript";
str = `${first} ${last}`;
console.log(str)
复制代码
```

### 3. boolean

类型为布尔值类型的变量的值只能是true或者false。除此之外，赋值给布尔值的值也可以是一个计算之后结果为布尔值的表达式：

```typescript
let bool: boolean = false;
bool = true;

let bool: boolean = !!0
console.log(bool)
复制代码
```

### 4. null和undefined

在 JavaScript 中，undefined和 null 是两个基本数据类型。在 TypeScript 中，这两者都有各自的类型，即 undefined 和 null，也就是说它们既是实际的值，也是类型。这两种类型的实际用处不是很大。

```typescript
let u: undefined = undefined;
let n: null = null;
复制代码
```

注意，第一行代码可能会报一个tslint的错误： `Unnecessary initialization to 'undefined'`，就是不能给一个变量赋值为undefined。但实际上给变量赋值为undefined是完全可以的，所以如果想让代码合理化，可以配置tslint，将" `no-unnecessary-initializer`"设置为 `false`即可。

默认情况下，undefined 和 null 是所有类型的子类型，可以赋值给任意类型的值，也就是说可以把 undefined 赋值给 void 类型，也可以赋值给 number 类型。当在 `tsconfig.json` 的"compilerOptions"里设置为 "strictNullChecks": true 时，就必须严格对待了。这时 undefined 和 null 将只能赋值给它们自身或者 void 类型。这样也可以规避一些错误。

### 5. bigInt

BigInt是ES6中新引入的数据类型，它是一种内置对象，它提供了一种方法来表示大于 2- 1 的整数，BigInt可以表示任意大的整数。

使用 `BigInt` 可以安全地存储和操作大整数，即使这个数已经超出了JavaScript构造函数 Number 能够表示的安全整数范围。

我们知道，在 JavaScript 中采用双精度浮点数，这导致精度有限，比如 `Number.MAX_SAFE_INTEGER` 给出了可以安全递增的最大可能整数，即 `2- 1`，来看一个例子:

```typescript
const max = Number.MAX_SAFE_INTEGER;
const max1 = max + 1
const max2 = max + 2
max1 === max2
复制代码
```

可以看到，最终返回了true，这就是超过精读范围造成的问题，而 `BigInt`正是解决这类问题而生的:

```typescript
const max = BigInt(Number.MAX_SAFE_INTEGER);
const max1 = max + 1n
const max2 = max + 2n
max1 === max2
复制代码
```

这里需要用 `BigInt(number)` 把 Number 转化为 `BigInt`，同时如果类型是 `BigInt` ，那么数字后面需要加 `n`。

在TypeScript中， `number` 类型虽然和 `BigInt` 都表示数字，但是实际上两者类型是完全不同的:

```typescript
declare let foo: number;
declare let bar: bigint;
foo = bar;
bar = foo;
复制代码
```

### 6. symbol

symbol我们平时用的比较少，所以可能了解也不是很多，这里就详细来说说symbol。

symbol 是 ES6 新增的一种基本数据类型，它用来表示独一无二的值，可以通过 Symbol 构造函数生成。

```typescript
const s = Symbol();
typeof s;
复制代码
```

注意：Symbol 前面不能加 new关键字，直接调用即可创建一个独一无二的 symbol 类型的值。

可以在使用 Symbol 方法创建 symbol 类型值的时候传入一个参数，这个参数需要是一个字符串。如果传入的参数不是字符串，会先自动调用传入参数的 toString 方法转为字符串：

```typescript
const s1 = Symbol("TypeScript");
const s2 = Symbol("Typescript");
console.log(s1 === s2);
复制代码
```

上面代码的第三行可能会报一个错误：This condition will always return 'false' since the types 'unique symbol' and 'unique symbol' have no overlap. 这是因为编译器检测到这里的 s1 === s2 始终是false，所以编译器提醒这代码写的多余，建议进行优化。

上面使用Symbol创建了两个symbol对象，方法中都传入了相同的字符串，但是两个symbol值仍然是false，这就说明了 Symbol 方法会返回一个独一无二的值。Symbol 方法传入的这个字符串，就是方便我们区分 symbol 值的。可以调用 symbol 值的 toString 方法将它转为字符串：

```typescript
const s1 = Symbol("Typescript");
console.log(s1.toString());
console.log(Boolean(s));
console.log(!s);
复制代码
```

在TypeScript中使用symbol就是指定一个值的类型为symbol类型：

```typescript
let a: symbol = Symbol()
复制代码
```

TypeScript 中还有一个 **unique symbol** 类型，它是symbol的子类型，这种类型的值只能由 `Symbol()`或 `Symbol.for()`创建，或者通过指定类型来指定变量是这种类型。这种类型的值只能用于常量的定义和用于属性名。需要注意，定义unique symbol类型的值，必须用 const 而不能用let来声明。下面来看在TypeScript中使用Symbol值作为属性名的例子：

```typescript
const key1: unique symbol = Symbol()
let key2: symbol = Symbol()
const obj = {
    [key1]: 'value1',
    [key2]: 'value2'
}
console.log(obj[key1])
console.log(obj[key2])
复制代码
```

在ES6中，对象的属性是支持表达式的，可以使用于一个变量来作为属性名，这对于代码的简化有很多用处，表达式必须放在大括号内：

```typescript
let prop = "name";
const obj = {
  [prop]: "TypeScript"
};
console.log(obj.name);
复制代码
```

symbol 也可以作为属性名，因为symbol的值是独一无二的，所以当它作为属性名时，不会与其他任何属性名重复。当需要访问这个属性时，只能使用这个symbol值来访问（必须使用方括号形式来访问）：

```typescript
let name = Symbol();
let obj = {
  [name]: "TypeScript"
};
console.log(obj);

console.log(obj[name]);
console.log(obj.name);
复制代码
```

在使用obj.name访问时，实际上是字符串name，这和访问普通字符串类型的属性名是一样的，要想访问属性名为symbol类型的属性时，必须使用方括号。方括号中的name才是我们定义的symbol类型的变量name。

使用 Symbol 类型值作为属性名，这个属性是不会被 for...in遍历到的，也不会被 Object.keys() 、 Object.getOwnPropertyNames() 、 JSON.stringify() 等方法获取到：

```typescript
const name = Symbol("name");
const obj = {
  [name]: "TypeScript",
  age: 18
};
for (const key in obj) {
  console.log(key);
}

console.log(Object.keys(obj));
console.log(Object.getOwnPropertyNames(obj));
console.log(JSON.stringify(obj));
复制代码
```

虽然这些方法都不能访问到Symbol类型的属性名，但是Symbol类型的属性并不是私有属性，可以使用 `Object.getOwnPropertySymbols` 方法获取对象的所有symbol类型的属性名：

```typescript
const name = Symbol("name");
const obj = {
  [name]: "TypeScript",
  age: 18
};
const SymbolPropNames = Object.getOwnPropertySymbols(obj);
console.log(SymbolPropNames);
console.log(obj[SymbolPropNames[0]]);
复制代码
```

除了这个方法，还可以使用ES6提供的 Reflect 对象的静态方法 Reflect.ownKeys ，它可以返回所有类型的属性名，Symbol 类型的也会返回：

```typescript
const name = Symbol("name");
const obj = {
  [name]: "TypeScript",
  age: 18
};
console.log(Reflect.ownKeys(obj));
复制代码
```

Symbol 包含两个静态方法， for 和 keyFor 。

**1）Symbol.for()**

用Symbol创建的symbol类型的值都是独一无二的。使用 Symbol.for 方法传入字符串，会先检查有没有使用该字符串调用 Symbol.for 方法创建的 symbol 值。如果有，返回该值；如果没有，则使用该字符串新创建一个。使用该方法创建 symbol 值后会在全局范围进行注册。

```typescript
const iframe = document.createElement("iframe");
iframe.src = String(window.location);
document.body.appendChild(iframe);

iframe.contentWindow.Symbol.for("TypeScript") === Symbol.for("TypeScript");
复制代码
```

上面代码中，创建了一个iframe节点并把它放在body中，通过这个 iframe 对象的 contentWindow 拿到这个 iframe 的 window 对象，在 iframe.contentWindow上添加一个值就相当于在当前页面定义一个全局变量一样。可以看到，在 iframe 中定义的键为 TypeScript 的 symbol 值在和在当前页面定义的键为'TypeScript'的symbol 值相等，说明它们是同一个值。

**2）Symbol.keyFor()**

该方法传入一个 symbol 值，返回该值在全局注册的键名：

```typescript
const sym = Symbol.for("TypeScript");
console.log(Symbol.keyFor(sym));
复制代码
```

## 二、复杂基础类型

看完简单的数据类型，下面就来看看比较复杂的数据类型，包括JavaScript中的数组和对象，以及TypeScript中新增的元组、枚举、Any、void、never、unknown。

### 1. array

在 TypeScript 中有两种定义数组的方式：

* **直接定义：** 通过 number[] 的形式来指定这个类型元素均为number类型的数组类型，推荐使用这种写法。
* **数组泛型：** 通过 Array 的形式来定义，使用这种形式定义时，tslint 可能会警告让我们使用第一种形式定义，可以通过在 `tslint.json` 的 rules 中加入 `"array-type": [false]` 就可以关闭 tslint 对这条的检测。

```typescript
let list1: number[] = [1, 2, 3];
let list2: Array<number> = [1, 2, 3];
```

以上两种定义数组类型的方式虽然本质上没有任何区别，但是更推荐使用第一种形式来定义。一方面可以避免与 JSX 语法冲突，另一方面可以减少代码量。

注意，这两种写法中的 number 指定的是数组元素的类型，也可以在这里将数组的元素指定为其他任意类型。如果要指定一个数组里的元素既可以是数值也可以是字符串，那么可以使用这种方式： `number|string[]`。

### 2. object

在JavaScript中，object是引用类型，它存储的是值的引用。在TypeScript中，当想让一个变量或者函数的参数的类型是一个对象的形式时，可以使用这个类型：

```typescript
let obj: object
obj = { name: 'TypeScript' }
obj = 123
console.log(obj.name)
复制代码
```

可以看到，当给一个对象类型的变量赋值一个对象时，就会报错。对象类型更适合以下场景:

```typescript
function getKeys (obj: object) {
  return Object.keys(obj)
}
getKeys({ a: 'a' })
getKeys(123)
复制代码
```

### 3. 元组--Tuple

在 JavaScript 中并没有元组的概念，作为一门动态类型语言，它的优势是支持多类型元素数组。但是出于较好的扩展性、可读性和稳定性考虑，我们通常会把不同类型的值通过键值对的形式塞到一个对象中，再返回这个对象，而不是使用没有任何限制的数组。TypeScript 的元组类型正好弥补了这个不足，使得定义包含固定个数元素、每个元素类型未必相同的数组成为可能。

元组可以看做是数组的扩展，它**表示已知元素数量和类型的数组**，它特别适合用来实现多值返回。确切的说，就是已知数组中每一个位置上的元素的类型，可以通过元组的索引为元素赋值：：

```typescript
let arr: [string, number, boolean];
arr = ["a", 2, false];
arr = [2, "a", false];
arr = ["a", 2];
arr[1] = 996
复制代码
```

可以看到，定义的arr元组中，元素个数和元素类型都是确定的，当为arr赋值时，各个位置上的元素类型都要对应，元素个数也要一致。

当访问元组元素时，TypeScript也会对元素做类型检查，如果元素是一个字符串，那么它只能使用字符串方法，如果使用别的类型的方法，就会报错。

在TypeScript 新的版本中，TypeScript会对元组做越界判断。**超出规定个数的元素称作越界元素**，元素赋值**必须类型和个数都对应**，不能超出定义的元素个数。

在新的版本中，[string, number]元组类型的声明效果上可以看做等同于下面的声明：

```typescript
interface Tuple extends Array<number | string> {
   0: string;
   1: number;
   length: 2;
}
复制代码
```

这里定义了接口 Tuple ，它继承数组类型，并且数组元素的类型是 number 和 string 构成的联合类型，这样接口 Tuple 就拥有了数组类型所有的特性。并且指定索引为0的值为 string 类型，索引为1的值为 number 类型，同时指定 length 属性的类型字面量为 2，这样在指定一个类型为这个接口 Tuple 时，这个值必须是数组，而且如果元素个数超过2个时，它的length就不是2是大于2的数了，就不满足这个接口定义了，所以就会报错；当然，如果元素个数不够2个也会报错，因为索引为0或1的值缺失。

### 4.  枚举

TypeScript 在 ES 原有类型基础上加入枚举类型，使得在 TypeScript 中也可以给一组数值赋予名字，这样对开发者比较友好。枚举类型使用enum来定义：

```typescript
enum Roles {
  SUPER_ADMIN,
  ADMIN,
  USER
}
复制代码
```

```typescript
enum Roles {
  SUPER_ADMIN = 0,
  ADMIN = 1,
  USER = 2
}

const superAdmin = Roles.SUPER_ADMIN;
console.log(superAdmin);
console.log(Roles[1])
复制代码
```

除此之外，还可以修改这个数值，让SUPER_ADMIN = 1，这样后面的值就分别是2和3。当然还可以给每个值赋予不同的、不按顺序排列的值：

```typescript
enum Roles {
   SUPER_ADMIN = 1,
   ADMIN = 3,
   USER = 7
}
复制代码
```

### 5. any

在编写代码时，有时并不清楚一个值是什么类型，这时就需要用到any类型，它是一个任意类型，定义为any类型的变量就会绕过TypeScript的静态类型检测。对于声明为any类型的值，可以对其进行任何操作，包括获取事实上并不存在的属性、方法，并且 TypeScript 无法检测其属性是否存在、类型是否正确。

我们可以将一个值定义为any类型，也可以在定义数组类型时使用any来指定数组中的元素类型为任意类型：

```typescript
let value: any;
value = 123;
value = "abc";
value = false;

const array: any[] = [1, "a", true];
复制代码
```

any 类型会在对象的调用链中进行传导，即any 类型对象的任意属性的类型都是 any，如下代码所示：

```typescript
let obj: any = {};
let z = obj.x.y.z;
z();
复制代码
```

需要注意：不要滥用any类型，如果代码中充满了any，那TypeScript和JavaScript就毫无区别了，所以除非有充足的理由，否则应该尽量避免使用 any ，并且开启禁用隐式 any 的设置。

void 和 any 相反，any 是表示任意类型，而 void 是表示没有类型，就是什么类型都不是。这在 **定义函数，并且函数没有返回值时会用到**：

```typescript
const consoleText = (text: string): void => {
  console.log(text);
};
复制代码
```

需要注意： **void** 类型的变量只能赋值为 undefined 和 null ，其他类型不能赋值给 **void** 类型的变量。

### 7. never

never 类型指永远不存在值的类型，它是那些 **总会抛出异常**或 **根本不会有返回值的函数表达式的返回值**类型，当变量被永不为真的类型保护所约束时，该变量也是 never 类型。

下面的函数，总是会抛出异常，所以它的返回值类型是never，用来表明它的返回值是不存在的：

```typescript
const errorFunc = (message: string): never => {
   throw new Error(message);
};
复制代码
```

never 类型是任何类型的子类型，所以它可以赋值给任何类型；而没有类型是 never 的子类型，所以除了它自身以外，其他类型（包括 any 类型）都不能为 never 类型赋值。

```typescript
let neverVariable = (() => {
   while (true) {}
})();
neverVariable = 123;
复制代码
```

上面代码定义了一个立即执行函数，函数体是一个死循环，这个函数调用后的返回值类型为 never，所以赋值之后 neverVariable 的类型是 never 类型，当给neverVariable 赋值 123 时，就会报错，因为除它自身外任何类型都不能赋值给 never 类型。

基于 never 的特性，我们可以把 never 作为接口类型下的属性类型，用来禁止操作接口下特定的属性：

```typescript
const props: {
  id: number,
  name?: never
} = {
  id: 1
}
props.name = null;
props.name = 'str';
props.name = 1;
复制代码
```

可以看到，无论给 props.name 赋什么类型的值，它都会提示类型错误，这就相当于将 name 属性设置为了只读 。

### 8. unknown

unknown 是TypeScript在3.0版本新增的类型，主要用来描述类型并不确定的变量。它看起来和any很像，但是还是有区别的，unknown相对于any更安全。

对于any，来看一个例子：

```typescript
let value: any
console.log(value.name)
console.log(value.toFixed())
console.log(value.length)
复制代码
```

上面这些语句都不会报错，因为value是any类型，所以后面三个操作都有合法的情况，当value是一个对象时，访问name属性是没问题的；当value是数值类型的时候，调用它的toFixed方法没问题；当value是字符串或数组时获取它的length属性是没问题的。

当指定值为unknown类型的时候，如果没有 **缩小类型范围**的话，是不能对它进行任何操作的。总之，unknown类型的值不能随便操作。那什么是类型范围缩小呢？下面来看一个例子：

```typescript
function getValue(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  return String(value);
}
复制代码
```

这里由于把value的类型缩小为Date实例的范围内，所以进行了value.toISOString()，也就是使用ISO标准将 Date 对象转换为字符串。

使用以下方式也可以缩小类型范围：

```typescript
let result: unknown;
if (typeof result === 'number') {
  result.toFixed();
}
复制代码
```

关于 unknown 类型，在使用时需要注意以下几点：

* 任何类型的值都可以赋值给 unknown 类型：

```typescript
let value1: unknown;
value1 = "a";
value1 = 123;
复制代码
```

* unknown 不可以赋值给其它类型，只能赋值给 unknown 和 any 类型：

```typescript
let value2: unknown;
let value3: string = value2;
value1 = value2;
复制代码
```

* unknown 类型的值不能进行任何操作：

```typescript
let value4: unknown;
value4 += 1;
复制代码
```

* 只能对 unknown 进行等或不等操作，不能进行其它操作：

```typescript
value1 === value2;
value1 !== value2;
value1 += value2;
复制代码
```

* unknown 类型的值不能访问其属性、作为函数调用和作为类创建实例：

```typescript
let value5: unknown;
value5.age;
value5();
new value5();
复制代码
```

在实际使用中，如果有类型无法确定的情况，要尽量避免使用 any，因为 any 会丢失类型信息，一旦一个类型被指定为 any，那么在它上面进行任何操作都是合法的，所以会有意想不到的情况发生。因此如果遇到无法确定类型的情况，要先考虑使用 unknown。

**最后，** 这篇文章就到这里了，主要介绍了TypeScript中基本的数据类型，下一篇文章就来详细学习一下枚举类型。
