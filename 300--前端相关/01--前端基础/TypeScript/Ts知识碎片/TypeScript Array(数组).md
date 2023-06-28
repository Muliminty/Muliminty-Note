在 TypeScript 中有两种定义数组的方式：

-   **直接定义：** 通过 number[] 的形式来指定这个类型元素均为number类型的数组类型，推荐使用这种写法。
-   **数组泛型：** 通过 Array 的形式来定义，使用这种形式定义时，tslint 可能会警告让我们使用第一种形式定义，可以通过在 `tslint.json` 的 rules 中加入 `"array-type": [false]` 就可以关闭 tslint 对这条的检测。

```typescript
let list1: number[] = [1, 2, 3]; // 推荐写法
let list2: Array<number> = [1, 2, 3];
```

以上两种定义数组类型的方式虽然本质上没有任何区别，但是更推荐使用第一种形式来定义。一方面可以避免与 JSX 语法冲突，另一方面可以减少代码量。

**定义联合类型数组**

注意，这两种写法中的 number 指定的是数组元素的类型，也可以在这里将数组的元素指定为其他任意类型。如果要指定一个数组里的元素既可以是数值也可以是字符串，那么可以使用这种方式： `number|string[]`。

```ts
let arr:(number | string)[];
arr3 = [1, 'b', 2, 'c'];
```

**通过接口指定对象成员的数组**

```ts
interface Arrobj{
    name:string,
    age:number
}
let arr3:Arrobj[]=[{name:'jimmy',age:22}]
```
