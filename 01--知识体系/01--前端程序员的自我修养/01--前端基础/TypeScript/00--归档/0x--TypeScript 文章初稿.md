
**前置背景**

假设你是一个已经熟练掌握了JavaScript的前端开发，但是对于Ts完全没接触过。这时大哥给你分配了一个Ts+React的项目需要你能够快速上手维护。

此时你打开项目看到的都是下面这些语法；

```TypeScript
let str: string = "Hello World"; // 1

function createArray<T>(length: number, value: T): Array<T> { // <T>
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

interface Person { name: string; age: number; } 
let tom: Person = { name: 'Tom', age: 25, gender: 'male' };

let someValue: any = "this is a string"; 
let strLength: number = (someValue as string).length;

let someValue: any = "this is a string"; 
let strLength: number = (<string>someValue).length;
```

作为一个熟练Js的前端开发，你应该可以大概看出这些代码是在做什么。 但是上面代码里面的 `<T>` 具体有什么功能，以及 `interface` 这个关键字的作用是什么。

这篇文章的目的就是让你能够快速了解语法的功能。



