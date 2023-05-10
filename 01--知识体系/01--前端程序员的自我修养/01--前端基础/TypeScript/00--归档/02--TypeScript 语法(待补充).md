
## 声明语法
```TypeScript
let str: string = "Hello World";

变量名后面跟冒号表示定义变量类型

```

## 断言类型语法

```ts
值 as 类型
```

或

```ts
<类型>值
```
在 tsx 语法（React 的 jsx 语法的 ts 版）中必须使用前者，即 `值 as 类型`。

形如 `<Foo>` 的语法在 tsx 中表示的是一个 `ReactNode`，在 ts 中除了表示类型断言之外，也可能是表示一个[泛型](https://ts.xcatliu.com/advanced/generics.html)。

故建议大家在使用类型断言时，统一使用 `值 as 类型` 这样的语法，本书中也会贯彻这一思想。