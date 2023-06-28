## **声明文件的定义**

[[../../../../100--剪藏/TypeScript/TypeScript相关文章/Ts 声明文件 -- TypeScript系列🔥尾声篇, 什么是声明文件(declare)#什么是声明文件?|什么是声明文件]]通俗地来讲，在 TypeScript 中以 `.d.ts` 为后缀的文件，我们称之为 TypeScript 声明文件。它的主要作用是描述 JavaScript 模块内所有导出接口的类型信息。

## **什么时候需要写 TS 声明文件**

在日常的开发中，绝大多数时候是不需要我们单独去编写一个 TS 声明文件的。如果我们的文件本身是用 TS 编写的，在编译的时候让 TS 自动生成声明文件，并在发布的时候将 `.d.ts` 文件一起发布即可。

总结了以下三种情况，需要我们手动定义声明文件：

1.  通过 script 标签引入的第三方库

一些通过 [CDN](https://cloud.tencent.com/product/cdn?from=20065&from_column=20065) 的当时映入的小的工具包，挂载了一些全局的方法，如果在 TS 中直接使用的话，会报 TS 语法错误，这时候就需要我们对这些全局的方法进行 TS 声明。

1.  使用的第三方 npm 包，但是没有提供声明文件

第三方 npm 包如果有提供声明文件的话，一般会以两种形式存在：一是 `@types/xxx`，另外是在源代码中提供 `.d.ts` 声明文件。第一种的话一般是一些使用量比较高的库会提供，可以通过 `npm i @type/xxx` 尝试安装。如果这两种都不存在的话，那就需要我们自己来定义了。

1.  自身团队内比较优秀的 JS 库或插件，为了提升开发体验

## **如何编写 TS 声明文件**

[[../../../../100--剪藏/TypeScript/TypeScript相关文章/Ts 声明文件 -- TypeScript系列🔥尾声篇, 什么是声明文件(declare)#🔥如何写声明文件?|如何写声明文件]]

对于不同形式的声明文件，写法上会有一定的差异。这里需要特别注意一点的是：声明文件中只是对类型的定义，不能进行**赋值**。

### **📌 全局变量**

全局变量的声明文件主要有以下几种语法：

```javascript
declare let/const  // 声明全局变量
declare function   // 声明全局方法
declare class      // 声明全局类
declare enum       // 声明全局枚举类型 
declare namespace  // 声明（含有子属性的）全局对象
interface/type     // 声明全局类型
```

这里需要注意的是只是定义类型，不能进行**赋值**。

```javascript
// 变量
declare let userName: string;

declare const wx: any;

// 函数、函数重载
declare function getName(uid: number): string;
declare function getName(): string;
declare function getName(cb: () => any): any;

// 类
declare class Course {
  cid: number;
  constructor(cid){};
  getCoursePrice(): number;
}

// 枚举
declare enum Status {
  Loading,
  Success,
  Failed,
}

// 接口 interface declare 可以不需要
interface CourseInfo {
  cid: number;
  name: string;
}

interface CGIData<T> {
  data: T;
  retcode: 0;
}

// 命名空间
declare namespace User {
  // 局部 Test.User
  interface User {
    name: string;
    age: number;
  }

  function getUserInfo(name: string): User {
    return "";
  }
  namespace fn {
    function extend(obj: any): any;
  }
}

// 声明合并
declare function User(id: number): string;
```

## **最后**

如何让 TS 在编译时自动生成 `.d.ts` 文件呢？只需要在 `tsconfig.json` 配置文件中开启即可，TS 编译时就会自动生成 `.d.ts` 声明文件：

```javascript
{
  "compilerOptions": {
    "declaration": true
  }
}
```

## **参考**

[TypeScript入门教程–声明文件](https://cloud.tencent.com/developer/article/2033803)