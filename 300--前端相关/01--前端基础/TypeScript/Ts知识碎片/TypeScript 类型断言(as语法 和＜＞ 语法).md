# 官方原文

[基础类型 · TypeScript中文网 · TypeScript——JavaScript的超集](https://www.tslang.cn/docs/handbook/basic-types.html)

有时候你会遇到这样的情况，你会比TypeScript更了解某个值的详细信息。 通常这会发生在你清楚地知道一个实体具有比它现有类型更确切的类型。

通过<font color="#ffff00">类型断言</font>这种方式可以告诉编译器，“相信我，我知道自己在干什么”。 类型断言好比其它语言里的类型转换，但是不进行特殊的数据检查和解构。 它没有运行时的影响，只是在编译阶段起作用。 TypeScript会假设你，程序员，已经进行了必须的检查。

类型断言有两种形式。 其一是“尖括号”语法：

```Ts
let someValue: any = "this is a string"; 
let strLength: number = (<string>someValue).length;
```

另一个为`as`语法：

```Ts
let someValue: any = "this is a string"; 
let strLength: number = (someValue as string).length;
```

两种形式是等价的。 至于使用哪个大多数情况下是凭个人喜好；**然而，当你在TypeScript里使用JSX时，只有 `as`语法断言是被允许的。**
