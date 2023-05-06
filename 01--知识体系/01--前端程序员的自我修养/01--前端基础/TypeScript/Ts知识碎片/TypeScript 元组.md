
# TypeScript 元组

我们知道数组中元素的数据类型都一般是相同的（any[] 类型的数组可以不同），如果存储的元素数据类型不同，则需要使用元组。

元组中允许存储不同类型的元素，元组可以作为参数传递给函数。

创建元组的语法格式如下：

```typeScript
var tuple_name = [value1,value2,value3,…value n]
```

**实例**

声明一个元组并初始化：

```typeScript
var mytuple = [10,"Runoob"];
```

或者我们可以先声明一个空元组，然后再初始化：

```typeScript
var mytuple = []; 
mytuple[0] = 120 
mytuple[1] = 234
```

## 访问元组

元组中元素使用索引来访问，第一个元素的索引值为 0，第二个为 1，以此类推第 n 个为 n-1，语法格式如下:

```typeScript
tuple_name[index]
```

**实例**

以下实例定义了元组，包含了数字和字符串两种类型的元素：

```typeScript
var mytuple = [10,"Runoob"]; // 创建元组
console.log(mytuple[0]) 
console.log(mytuple[1])
```

编译以上代码，得到以下 JavaScript 代码：

```typeScript
var mytuple = [10, "Runoob"]; // 创建元组
console.log(mytuple[0]);
console.log(mytuple[1]);
```

输出结果

```typeScript
10
Runoob
```

## 元组运算

我们可以使用以下两个函数向元组添加新元素或者删除元素：

+ push() 向元组添加元素，添加在最后面。
+ pop() 从元组中移除元素（最后一个），并返回移除的元素。

```typeScript
var mytuple = [10,"Hello","World","typeScript"]; 
console.log("添加前元素个数："+mytuple.length)    // 返回元组的大小
 
mytuple.push(12)                                    // 添加到元组中
console.log("添加后元素个数："+mytuple.length) 
console.log("删除前元素个数："+mytuple.length) 
console.log(mytuple.pop()+" 元素从元组中删除") // 删除并返回删除的元素
        
console.log("删除后元素个数："+mytuple.length)
```

编译以上代码，得到以下 JavaScript 代码：

```javaScript
var mytuple = [10, "Hello", "World", "typeScript"];
console.log("添加前元素个数：" + mytuple.length); // 返回元组的大小
mytuple.push(12); // 添加到元组中
console.log("添加后元素个数：" + mytuple.length);
console.log("删除前元素个数：" + mytuple.length);
console.log(mytuple.pop() + " 元素从元组中删除"); // 删除并返回删除的元素
console.log("删除后元素个数：" + mytuple.length);
```

输出结果为：

```javaScript
添加前元素个数：4
添加后元素个数：5
删除前元素个数：5
12 元素从元组中删除
删除后元素个数：4
```

## 更新元组

元组是可变的，这意味着我们可以对元组进行更新操作：

```typeScript
var mytuple = [10, "Runoob", "Taobao", "Google"]; // 创建一个元组
console.log("元组的第一个元素为：" + mytuple[0]) 
 
// 更新元组元素
mytuple[0] = 121     
console.log("元组中的第一个元素更新为："+ mytuple[0])
```

编译以上代码，得到以下 JavaScript 代码：

```javaScript
var mytuple = [10, "Runoob", "Taobao", "Google"]; // 创建一个元组
console.log("元组的第一个元素为：" + mytuple[0]);
// 更新元组元素
mytuple[0] = 121;
console.log("元组中的第一个元素更新为：" + mytuple[0]);
```

输出结果为：

```javaScript
元组的第一个元素为：10
元组中的第一个元素更新为：121
```

## 解构元组

我们也可以把元组元素赋值给变量，如下所示：

```typeScript
var a =[10,"Runoob"] 
var [b,c] = a 
console.log( b )    
console.log( c )
```

编译以上代码，得到以下 JavaScript 代码：

```javaScript
var a = [10, "Runoob"];
var b = a[0], c = a[1];
console.log(b);
console.log(c);
```

输出结果为：

```javaScript
10
Runoob
```
