接口是一系列抽象方法的声明，是一些方法特征的集合，这些方法都应该是抽象的，需要由具体的类去实现，然后第三方就可以通过这组抽象方法调用，让具体的类执行具体的方法。

# 定义

TypeScript 接口定义如下：

```TypeScript
interface interface_name { 

}
```

**简单的例子**

```ts
interface Person {
    name: string;
    age: number;
}

let tom: Person = {
    name: 'Tom',
    age: 25
};
```

上面的例子中，我们定义了一个接口 `Person`，接着定义了一个变量 `tom`，它的类型是 `Person`。这样，我们就约束了 `tom` 的形状必须和接口 `Person` 一致。

定义的变量比接口少了一些属性是不允许的：

```ts
interface Person {
    name: string;
    age: number;
}

let tom: Person = {
    name: 'Tom',
    age: 25,
    gender: 'male'
};

// index.ts(9,5): error TS2322: Type '{ name: string; age: number; gender: string; }' is not assignable to type 'Person'.
//   Object literal may only specify known properties, and 'gender' does not exist in type 'Person'.
```

# 可选属性

接口里的属性不全都是必需的。 有些是只在某些条件下存在，或者根本不存在。 

```ts
interface Person {
    name: string;
    age?: number;
}

let tom: Person = {
    name: 'Tom'
};
```

```ts
interface Person {
    name: string;
    age?: number;
}

let tom: Person = {
    name: 'Tom',
    age: 25
};
```

可选属性的含义是该属性可以不存在。

这时**仍然不允许添加未定义的属性**：

```ts
interface Person {
    name: string;
    age?: number;
}

let tom: Person = {
    name: 'Tom',
    age: 25,
    gender: 'male'
};

// examples/playground/index.ts(9,5): error TS2322: Type '{ name: string; age: number; gender: string; }' is not assignable to type 'Person'.
//   Object literal may only specify known properties, and 'gender' does not exist in type 'Person'.
```

# 任意属性

[掘金 -- suukii](https://juejin.cn/post/6855449252785717256#comment)

我们在自定义类型的时候，有可能会希望一个接口允许有任意的属性签名，这时候 `任意属性` 就派上用场了。

任意属性有两种定义的方式：一种属性签名是 `string` 类型的，另一种属性签名是 `number` 类型的。

## string 类型任意属性

第一种，属性签名是 `string`，比如对象的属性：


```TypeScript
interface A {
    [prop: string]: number;
}

const obj: A = {
    a: 1,
    b: 3,
};
```

`[prop: string]: number` 的意思是，`A` 类型的对象可以有任意属性签名，`string` 指的是对象的键都是字符串类型的，`number` 则是指定了属性值的类型。

`prop` 类似于函数的形参，是可以取其他名字的。

## number 类型任意属性

第二种，属性签名是 `number` 类型的，比如数组下标：


```TypeScript
interface B {
    [index: number]: string;
}

const arr: B = ['suukii'];
```

`[index: number]: string` 的意思是，`B` 类型的数组可以有任意的数字下标，而且数组的成员的类型必须是 `string`。

同样的，`index` 也只是类似于函数形参的东西，用其他标识符也是完全可以的。

## 同时定义任意属性和其他类型的属性

另外还有一个需要注意的点，**一旦定义了任意属性，那么其他属性(确定属性、可选属性、只读属性等)的类型都必须是它的类型的子集**。

比如说我们想要一个 `Person` 接口，它有一个必选属性 `name` 和一个可选属性 `age`，另外还可以有其他 `string` 类型的任意属性签名。那么 `Person` 接口可能会被定义成这样：

```TypeScript
interface Person {
    name: string;
    age?: number;
    [prop: string]: string;
}

// Property 'age' of type 'number' is not assignable to string index type 'string'.
```

但其实这样子的定义是不成立的，因为 `[prop: string]: string` 的存在，规定了其他属性的类型也必须是 `string`，如果想要解决报错，我们可以使用联合类型：


```TypeScript
interface Person {
    name: string;
    age?: number;
    [prop: string]: string | number;
}
```

对于 `number` 类型的任意属性签名，情况也是一样的：

```TypeScript
type MyArray = {
    0: string;
    [index: number]: number;
};
// Property '0' of type 'string' is not assignable to numeric index type 'number'.
```

但是，`number` 类型的任意属性签名不会影响其他 `string` 类型的属性签名：

```TypeScript
type Arg = {
    [index: number]: number;
    length: string;
};
```

如上，虽然指定了 `number` 类型的任意属性的类型是 `number`，但 `length` 属性是 `string` 类型的签名，所以不受前者的影响。

但是反过来就不一样了，如果接口定义了 `string` 类型的任意属性签名，它不仅会影响其他 `string` 类型的签名，也会影响其他 `number` 类型的签名。这一点可以参考**两种任意类型签名并存时，`number` 类型的签名指定的值类型必须是 `string` 类型的签名指定的值类型的子集**这句话。

# 只读属性

有时候我们希望对象中的一些字段只能在创建的时候被赋值，那么可以用 `readonly` 定义只读属性：

```ts
interface Person {
    readonly id: number;
    name: string;
    age?: number;
    [propName: string]: any;
}

let tom: Person = {
    id: 89757,
    name: 'Tom',
    gender: 'male'
};

tom.id = 9527;

// index.ts(14,5): error TS2540: Cannot assign to 'id' because it is a constant or a read-only property.
```

上例中，使用 `readonly` 定义的属性 `id` 初始化后，又被赋值了，所以报错了。

**注意，只读的约束存在于第一次给对象赋值的时候，而不是第一次给只读属性赋值的时候**：

```ts
interface Person {
    readonly id: number;
    name: string;
    age?: number;
    [propName: string]: any;
}

let tom: Person = {
    name: 'Tom',
    gender: 'male'
};

tom.id = 89757;

// index.ts(8,5): error TS2322: Type '{ name: string; gender: string; }' is not assignable to type 'Person'.
//   Property 'id' is missing in type '{ name: string; gender: string; }'.
// index.ts(13,5): error TS2540: Cannot assign to 'id' because it is a constant or a read-only property.
```

上例中，报错信息有两处，第一处是在对 `tom` 进行赋值的时候，没有给 `id` 赋值。

第二处是在给 `tom.id` 赋值的时候，由于它是只读属性，所以报错了。

# 接口继承

接口继承就是说接口可以通过其他接口来扩展自己。

Typescript 允许接口继承多个接口。

继承使用关键字 extends。

单接口继承语法格式：

```TypeScript
Child_interface_name extends super_interface_name
```

多接口继承语法格式：

```TypeScript
Child_interface_name extends super_interface1_name, super_interface2_name,…,super_interfaceN_name
```

继承的各个接口使用逗号 , 分隔。

## 单继承实例

```TypeScript
interface Person { age:number } 
interface Musician extends Person { instrument:string } 
var drummer = <Musician>{};
drummer.age = 27 
drummer.instrument = "Drums" 
console.log("年龄: "+drummer.age) 
console.log("喜欢的乐器: "+drummer.instrument)

// 输出结果为：
// 年龄:  27
// 喜欢的乐器:  Drums

```

