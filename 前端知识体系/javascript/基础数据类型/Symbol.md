# Symbol

+ Symbol函数接收`一个可选参数`，方便代码阅读和后期调试
+ 用`Object.getOwnPropertyNames()`，`Object.keys()`或者`for...in`等方法无法显示Symbol属性名
+ `Object.getOwnPropertySymbols()`方法返回包含所有Symbol属性的数组
+ Symbol不能使用`new`因为是原始值
+ `Symbol.for()`创建共享Symbol，如果已存在，直接返回已有的Symbol
+ Symbol创建的原始值都是唯一的
+ Symbol.keyFor返回已登记Symbol的键

> 参考链接 :
>> [哔哩哔哩 -- JavaScript Symbol 类型的注意事项 -- 技术蛋老师](https://www.bilibili.com/video/BV1Qy4y187EG?vd_source=65ac026bfc17d6d4d2c44c1ae1a66a66)
