
# less

​    less是一种动态样式语言，属于css预处理器的范畴，它扩展了 CSS 语言，

​    增加了变量、Mixin、函数等特性，使 CSS 更易维护和扩展

​    LESS 既可以在 客户端 上运行 ，也可以借助Node.js在服务端运行。

​    less的中文官网：<http://lesscss.cn/>

​    bootstrap中less教程：<http://www.bootcss.com/p/lesscss/>

## Less编译工具

​    koala 官网:www.koala-app.com

​

## less中的注释

​    以//开头的注释，不会被编译到css文件中

​    以/**/包裹的注释会被编译到css文件中  

​

## less中的变量

**使用@来申明一个变量：@pink：pink;**

### 1.作为普通属性值来使用：直接使用@pink

```less
/* 1.常规使用 */
@pink: pink;

div {
  color: @pink
}

//编译结果
div {
  color: pink;
}
```

### 2.作为选择器和属性名：#@{selector的值}的形式

```less
/* 2.作用选择器和属性名 */
@selName: container;
@proName: width;

.@{selName} {
  @{proName}: 100px;
}

//编译结果
.container {
  width: 100px;
}

```

### 3.作为URL：@{url}

```less
/* 3.作为URL */
@imgUrl: "./images/logo.png"

div {
  background: #FFF url("@{imgUrl}")
}

//编译结果
div {
  background: #FFF url("./images/logo.png")
}

```

### 4.变量的延迟加载

```less
div {
  color: @black
}

@black: #000000;

//编译结果
div {
  color: #000000;
}

```

### 5.变量的作用域

> - less会从当前作用域没找到，将往上查找（类似js）
> - 如果在某级作用域找到多个相同名称的变量，使用最后定义的那个（类似css）

```less
@var: 0;
.class {
  @var: 1;
  .brass {
    @var: 2;
    three: @var;
    @var: 3;
  }
  one: @var; //类似js，无法访问.brass内部
}

//编译结果
.class {
  one: 1;
}
.class .brass {
  three: 3; //使用最后定义的 @var: 3
}

```

## less中的嵌套规则

### **1.基本嵌套规则**

```less
/*css 写法*/
div {
  font-size: 14px;
}
div p {
 margin: 0 auto;
}

div p a {
  color: red;
}

// less写法
div {
  font-size: 14px;
  p {
    margin: 0 auto;
    a {
      color: red;
    }
  }
}
```

### **2.&的使用 表示当前选择器的所有父选择器**

[ctrl点击查看详细解释](https://blog.csdn.net/Imagirl1/article/details/103288230)

```less
//css写法
.bgcolor {
  background: #fff;
}
.bgcolor a {
  color: #888888;
}
.bgcolor a:hover {
  color: #ff6600;
}

//less写法
.bgcolor {
  background: #fff; 
  a {
    color: #888888;      
    &:hover {
      color: #ff6600;
    }
  }


```

### **3.改变选择器的顺序**

- 将&放到当前选择器之后，会将当前选择器移到最前面
- 只需记住 “& 代表当前选择器的所有父选择器”

```less
ul {
  li {
    .color &{
      background: #fff;
    }
  }
}

//编译结果
.color ul li {
  background: #fff;
}

```

## less中的混合

**混合就是将一系列属性从一个规则集引入到另一个规则集的方式**

### 1.普通混合

```less
//混合
.border {
  border-top: solid 1px black;
  border-bottom: solid 2px black;
}
#menu a {
  color: #eee;
  .border;
}

//编译结果
.border {
  border-top: solid 1px black;
  border-bottom: solid 2px black;
}

#menu a {
  color: #eee;
  border-top: solid 1px black;
  border-bottom: solid 2px black;
}

```

### 2.不带参数的混合

>- 从上面的代码发现，混合也被编译输出了
>
>- 在混合名字后加上括号，编译后不再输出

```less
//带参数的混合
.border(@color) {
  border-top: solid 1px @color;
  border-bottom: solid 2px @color;
}
#menu a {
  color: #eee;
  .border(#fff);
}

//编译结果
#menu a {
  color: #eee;
  border-top: solid 1px #ffffff;
  border-bottom: solid 2px #ffffff;
}

```

### 3.带参数的混合

```less
//带参数的混合
.border(@color) {
  border-top: solid 1px @color;
  border-bottom: solid 2px @color;
}
#menu a {
  color: #eee;
  .border(#fff);
}

//编译结果
#menu a {
  color: #eee;
  border-top: solid 1px #ffffff;
  border-bottom: solid 2px #ffffff;
}

```

### 4.带参数并且有默认值的混合

```less
//带参数且有默认值的混合
.border(@color: #fff) {
  border-top: solid 1px @color;
  border-bottom: solid 2px @color;
}
#menu a {
  color: #eee;
  .border;
}

#menu p {
  .border(#000);
}

//编译结果
#menu a {
  color: #eee;
  border-top: solid 1px #ffffff;
  border-bottom: solid 2px #ffffff;
}

#menu p {
  border-top: solid 1px #000000;
  border-bottom: solid 2px #000000;
}

```

### 5.带多个参数的混合

>- 多个参数时，参数之间可以用分号或逗号分隔
>- **注意逗号分隔的是“各个参数”还是“某个列表类型的参数”**

>- 两个参数，并且每个参数都是逗号分隔的列表：.name(1,2,3; something, ele)
>- 三个参数，并且每个参数都包含一个数字：.name(1,2,3)
>- 使用分号，调用包含一个逗号分割的css列表（一个参数）： .name(1,2,3; )
>- 逗号分割默认值（两个参数）：.name(@param1:red, blue)

```less
//less编写
.mixin(@color, @padding: xxx, @margin: 2) {
  color-3: @color;
  padding-3: @padding;
  margin: @margin @margin @margin @margin;
}

.div {
  .mixin(1,2,3; something, ele);  //2个参数
}
.div1 {
  .mixin(1,2,3);                  //3个参数
}
.div2 {
  .mixin(1,2,3; );                //1个参数
}

//编译输出
.div {
  color-3: 1, 2, 3;
  padding-3: something, ele;
  margin: 2 2 2 2;
}
.div1 {
  color-3: 1;
  padding-3: 2;
  margin: 3 3 3 3;
}
.div2 {
  color-3: 1, 2, 3;
  padding-3: xxx;
  margin: 2 2 2 2;
}
```

### 6.命名参数

> ​ 引用mixin时可以通过参数名称而不是参数的位置来为mixin提供参数值，任何参数都通过名称来引用，这样就不必按照特定的顺序来使用参数

   ```less
.mixin(@color: black; @margin: 10px; @padding: 20px) {
  color: @color;
  margin: @margin;
  padding: @padding;
}
.class1 {
  .mixin(@margin:20; @color: #33acfe);
}
.class2 {
  .mixin(#efca44; @padding: 40px);
}

//编译输出
.class1 {
  color: #33acfe;
  margin: 20px;
  padding: 20px;
}
.class2 {
  color: #efca44;
  margin: 10px;
  padding: 40px;
}

   ```

### 7.匹配模式

**自定义一个字符，使用时加上那个字符，就调用相应的规则**

```less
.border(all, @w: 5px) {
  border-radius: @w;
}
.border(t_l, @w: 5px) {
  border-top-left-radius: @w;
}
.border(b_l, @w: 5px) {
  border-bottom-left-radius: @w;
}
.border(b_r, @w: 5px) {
  border-bottom-right-radius: @w;
}

.border {
  .border(all, 50%);
}
//编译结果
.border {
  border-radius: 50%;
}

```

### 8.arguments变量

>- @arguments表示所有可变参数
>- 参数的先后顺序就是括号内的顺序 ，在赋值时，值的位置和个数也是一一对应的
>- 只有一个值，把值赋给第一个，两个值，赋给第一个和第二个......
>- 若想赋给第一个和第三个，必须把第二个参数的默认值写上

```less
.border(@x: solid, @c: red) {
  border: 21px @arguments;
}
.div1 {
  .border;
}
.div2 {
  .border(solid, black)
}

//编译输出
.div1 {
  border: 21px solid #ff0000;
}
.div2 {
  border: 21px solid #000000;
}

```

## less运算

​ **任何数值、颜色值和变量都可以进行运算**

### 数值类运算

>- less会自动推算数值的单位，不必每个值都加上单位
>- 运算符之间必须以空格分开，存在优先级问题时注意使用括号

```less
.wp {
  width: (450px - 50)*2;
}

//编译输出
.wp {
  width: 900px;
}

```

### 颜色值运算

>- 先将颜色值转换为rgb模式，运算完后再转换为16进制的颜色值并返回
>- 注意：取值为0-255，所以计算时不能超过这个区间，超过默认使用0或255
>- 注意：不能使用颜色名直接运算

```less
.content {
  color: #000000 + 8;
}

//rgb(0,0,0) + 8
//rgb(8,8,8)
//十六进制：#080808

//编译输出
.content {
  color: #080808; 
}

```

## less避免编译

## less继承

​    性能比混合高

​    灵活度比混合低

### 1.extend 关键字的使用

[extend 详解](https://blog.csdn.net/qq_19865749/article/details/52523178)

**extend 是 Less 的一个伪类。它可继承 所匹配声明中的全部样式。**

```less
/* Less */
.animation{
    transition: all .3s ease-out;
    .hide{
      transform:scale(0);
    }
}
#main{
    &:extend(.animation);
}
#con{
    &:extend(.animation .hide);
}

/* 生成后的 CSS */
.animation,#main{
  transition: all .3s ease-out;
}
.animation .hide , #con{
    transform:scale(0);
}

```

### 2.all 全局搜索替换

**使用选择器匹配到的 全部声明。**

```less
/* Less */
#main{
  width: 200px;
}
#main {
  &:after {
    content:"Less is good!";
  }
}
#wrap:extend(#main all) {}

/* 生成的 CSS */
#main,#wrap{
  width: 200px;
}
#main:after, #wrap:after {
    content: "Less is good!";
}

```

### 3.减少代码的重复性

> ​ 从表面 看来，extend 与 方法 最大的差别，就是 extend 是同个选择器共用同一个声明，而 方法 是使用自己的声明，这无疑 增加了代码的重复性。

方法示例 与上面的 extend 进行对比:

```less
/* Less */
.Method{
  width: 200px;
  &:after {
      content:"Less is good!";
  }
}
#main{
  .Method;
}
#wrap{
  .Method;
}

/* 生成的 CSS */
#main{
  width: 200px;
  &:after{
    content:"Less is good!";
  }  
}
#wrap{
  width: 200px;
  &:after{
    content:"Less is good!";
  }  
}

```

### 4.要点

*翻译官网*

>- 选择器和扩展之间 是允许有空格的：pre:hover :extend(div pre).
>- 可以有多个扩展: pre:hover:extend(div pre):extend(.bucket tr)
>- 注意这与pre:hover:extend(div pre, .bucket tr)一样。
>- 这是不可以的，扩展必须在最后 : pre:hover:extend(div pre).nth-child(odd)。
>- 如果一个规则集包含多个选择器，所有选择器都可以使用extend关键字。
