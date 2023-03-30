# Sass

## Sass 变量

变量用于存储一些信息，它可以重复使用。
Sass 变量可以存储以下信息：
●字符串
●数字
●颜色值
●布尔值
●列表
●null 值
Sass 变量使用 $ 符号：
$variablename: value;

举个例子

```scss
$myFont: Helvetica, sans-serif;
$myColor: red;
$myFontSize: 18px;
$myWidth: 680px;

body {
  font-family: $myFont;
  font-size: $myFontSize;
  color: $myColor;
}

#container {
  width: $myWidth;
}
```

将以上代码转换为 CSS 代码，如下所示：

```scss
body {
  font-family: Helvetica, sans-serif;
  font-size: 18px;
  color: red;
}

#container {
  width: 680px;
}
```

## Sass 作用域

Sass 变量的作用域只能在当前的层级上有效果，如下所示 h1 的样式为它内部定义的 green，p 标签则是为 red。

```scss
$myColor: red;

h1 {
  $myColor: green;   // 只在 h1 里头有用，局部作用域
  color: $myColor;
}

p {
  color: $myColor;
}
```

将以上代码转换为 CSS 代码，如下所示：

```scss
h1 {
  color: green;
}

p {
  color: red;
}
```

**!global**<br>
当然 Sass 中我们可以使用 !global 关键词来设置变量是全局的：

```scss
$myColor: red;

h1 {
  $myColor: green !global;  // 全局作用域
  color: $myColor;
}

p {
  color: $myColor;
}
```

现在 p 标签的样式就会变成 green。

将以上代码转换为 CSS 代码，如下所示：

```scss
h1 {
  color: green;
}

p {
  color: green;
}
```

## Sass 嵌套规则与属性

Sass 嵌套 CSS 选择器类似于 HTML 的嵌套规则。

如下我们嵌套一个导航栏的样式：

```scss
nav {
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  li {
    display: inline-block;
  }
  a {
    display: block;
    padding: 6px 12px;
    text-decoration: none;
  }
}
```

实例中，ul, li, 和 a 选择器都嵌套在 nav 选择器中

将以上代码转换为 CSS 代码，如下所示：

```scss
nav ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
nav li {
  display: inline-block;
}
nav a {
  display: block;
  padding: 6px 12px;
  text-decoration: none;
}
```

## Sass 嵌套属性

很多 CSS 属性都有同样的前缀，例如：font-family, font-size 和 font-weight ， text-align, text-transform 和 text-overflow。

在 Sass 中，我们可以使用嵌套属性来编写它们：

```scss
font: {
  family: Helvetica, sans-serif;
  size: 18px;
  weight: bold;
}

text: {
  align: center;
  transform: lowercase;
  overflow: hidden;
}
```

将以上代码转换为 CSS 代码，如下所示：

```scss
font-family: Helvetica, sans-serif;
font-size: 18px;
font-weight: bold;

text-align: center;
text-transform: lowercase;
text-overflow: hidden;
```

> 注意： font、 border 后面必须加上冒号。

## Sass @import

Sass 可以帮助我们减少 CSS 重复的代码，节省开发时间。

我们可以安装不同的属性来创建一些代码文件，如：变量定义的文件、颜色相关的文件、字体相关的文件等。

## Sass 导入文件

类似 CSS，Sass 支持 @import 指令。

@import 指令可以让我们导入其他文件等内容。

CSS @import 指令在每次调用时，都会创建一个额外的 HTTP 请求。但，Sass @import 指令将文件包含在 CSS 中，不需要额外的 HTTP 请求。

Sass @import 指令语法如下：

```scss
@import filename;
```

注意：包含文件时不需要指定文件后缀，Sass 会自动添加后缀 .scss。

此外，你也可以导入 CSS 文件。

导入后我们就可以在主文件中使用导入文件等变量。

以下实例，导入 variables.scss、colors.scss 和 reset.scss 文件。

```scss
@import "variables";
@import "colors";
@import "reset";
```

接下来我们创建一个 reset.scss 文件：

```scss
// reset.scss 文件代码：
html,
body,
ul,
ol {
  margin: 0;
  padding: 0;
}
```

然后我们在 standard.scss 文件中使用 @import 指令导入 reset.scss 文件：

```scss
// standard.scss 文件代码：
@import "reset";

body {
  font-family: Helvetica, sans-serif;
  font-size: 18px;
  color: red;
}
```

将以上代码转换为 CSS 代码，如下所示：

```scss
html, body, ul, ol {
  margin: 0;
  padding: 0;
}

body {
  font-family: Helvetica, sans-serif;
  font-size: 18px;
  color: red;
}
```

## Sass Partials

如果你不希望将一个 Sass 的代码文件编译到一个 CSS 文件，你可以在文件名的开头添加一个下划线。这将告诉 Sass 不要将其编译到 CSS 文件。

但是，在导入语句中我们不需要添加下划线。

Sass Partials 语法格式：

```scss
_filename;
```

以下实例创建一个 _colors.scss 的文件，但是不会编译成_colors.css 文件：

```scss
// _colors.scss 文件代码：
$myPink: #EE82EE;
$myBlue: #4169E1;
$myGreen: #8FBC8F;
```

如果要导入该文件，则不需要使用下划线：

```scss
@import "colors";

body {
  font-family: Helvetica, sans-serif;
  font-size: 18px;
  color: $myBlue;
}
```

> 注意：请不要将带下划线与不带下划线的同名文件放置在同一个目录下，比如，_colors.scss 和 colors.scss 不能同时存在于同一个目录下，否则带下划线的文件将会被忽略。

## Sass @mixin 与 @include

@mixin 指令允许我们定义一个可以在整个样式表中重复使用的样式。

@include 指令可以将混入（mixin）引入到文档中。

### 定义一个混入

混入(mixin)通过 @mixin 指令来定义。 @mixin name { property: value; property: value; ... }

以下实例创建一个名为 "important-text" 的混入：

```scss
@mixin important-text {
  color: red;
  font-size: 25px;
  font-weight: bold;
  border: 1px solid blue;
}
```

> 注意：Sass 的连接符号 - 与下划线符号 _ 是相同的，也就是 @mixin important-text { } 与 @mixin important_text { } 是一样的混入。

### 使用混入

@include 指令可用于包含一混入：

```scss
// Sass @include 混入语法：
selector {
  @include mixin-name;
}
```

因此，包含 important-text 混入代码如下：

```scss
.danger {
  @include important-text;
  background-color: green;
}
```

将以上代码转换为 CSS 代码，如下所示：

```scss
.danger {
  color: red;
  font-size: 25px;
  font-weight: bold;
  border: 1px solid blue;
  background-color: green;
}
```

混入中也可以包含混入，如下所示：

```scss
@mixin special-text {
  @include important-text;
  @include link;
  @include special-border;
}
```

### 向混入传递变量

混入可以接收参数。

我们可以向混入传递变量。

定义可以接收参数的混入：

```scss
/* 混入接收两个参数 */
@mixin bordered($color, $width) {
  border: $width solid $color;
}

.myArticle {
  @include bordered(blue, 1px);  // 调用混入，并传递两个参数
}

.myNotes {
  @include bordered(red, 2px); // 调用混入，并传递两个参数
}
```

以上实例的混入参数为设置边框的属性 (color 和 width) 。

将以上代码转换为 CSS 代码，如下所示：

```scss
.myArticle {
  border: 1px solid blue;
}

.myNotes {
  border: 2px solid red;
}
```

混入的参数也可以定义默认值，语法格式如下：

```scss
@mixin bordered($color: blue, $width: 1px) {
  border: $width solid $color;
}
```

在包含混入时，你只需要传递需要的变量名及其值：

```scss
@mixin sexy-border($color, $width: 1in) {
  border: {
    color: $color;
    width: $width;
    style: dashed;
  }
}
p { @include sexy-border(blue); }
h1 { @include sexy-border(blue, 2in); }
```

将以上代码转换为 CSS 代码，如下所示：

```scss
p {
  border-color: blue;
  border-width: 1in;
  border-style: dashed; 
}

h1 {
  border-color: blue;
  border-width: 2in;
  border-style: dashed;
}
```

### 可变参数

有时，不能确定一个混入（mixin）或者一个函数（function）使用多少个参数，这时我们就可以使用 ... 来设置可变参数。

例如，用于创建盒子阴影（box-shadow）的一个混入（mixin）可以采取任何数量的 box-shadow 作为参数。

```scss
@mixin box-shadow($shadows...) {
      -moz-box-shadow: $shadows;
      -webkit-box-shadow: $shadows;
      box-shadow: $shadows;
}

.shadows {
  @include box-shadow(0px 4px 5px #666, 2px 6px 10px #999);
}
```

将以上代码转换为 CSS 代码，如下所示：

```scss
.shadows {
  -moz-box-shadow: 0px 4px 5px #666, 2px 6px 10px #999;
  -webkit-box-shadow: 0px 4px 5px #666, 2px 6px 10px #999;
  box-shadow: 0px 4px 5px #666, 2px 6px 10px #999;
}
```

### 浏览器前缀使用混入

```scss
@mixin transform($property) {
  -webkit-transform: $property;
  -ms-transform: $property;
  transform: $property;
}

.myBox {
  @include transform(rotate(20deg));
}
```

将以上代码转换为 CSS 代码，如下所示：

```scss
.myBox {
  -webkit-transform: rotate(20deg);
  -ms-transform: rotate(20deg);
  transform: rotate(20deg);
}
```

## Sass @extend 与 继承

@extend 指令告诉 Sass 一个选择器的样式从另一选择器继承。

如果一个样式与另外一个样式几乎相同，只有少量的区别，则使用 @extend 就显得很有用。

以下 Sass 实例中，我们创建了一个基本的按钮样式 .button-basic，接着我们定义了两个按钮样式 .button-report 与 .button-submit，它们都继承了 .button-basic ，它们主要区别在于背景颜色与字体颜色，其他的样式都是一样的。

```scss
.button-basic  {
  border: none;
  padding: 15px 30px;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
}

.button-report  {
  @extend .button-basic;
  background-color: red;
}

.button-submit  {
  @extend .button-basic;
  background-color: green;
  color: white;
}
```

将以上代码转换为 CSS 代码，如下所示：

```scss
.button-basic, .button-report, .button-submit {
  border: none;
  padding: 15px 30px;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
}

.button-report  {
  background-color: red;
}

.button-submit  {
  background-color: green;
  color: white;
}
```

使用 @extend 后，我们在 HTML 按钮标签中就不需要指定多个类 class="button-basic button-report" ，只需要设置 class="button-report" 类就好了。

@extend 很好的体现了代码的复用

