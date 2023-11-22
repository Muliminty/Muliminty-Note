new关键字执行时做了哪些

1. 创建了一个新对象
2. 将这个新对象与构造函数用原型链链接起来
3. 将构造函数的this指向新的对象，执行构造函数的代码赋值
4. 如果构造函数没有返回一个对象就返回新创建的对象否则返回构造函数返回的对象

```js

function Cat(color = 'blue', age = 0) {
  this.color = color
  this.age = age

}
function cry() {
  console.log('喵喵喵');

}
Cat.prototype.cry = cry


// 第一版
function myNew1(Fun) {
  // 创建一个要返回的实例
  let result = {}
  // shift 删除第一项 并返回 会影响原数组  
  // 这里就是将构造函数设置为 Constructor 然后剩下的参数就是arguments
  let Constructor = [].shift.call(arguments);

  // 将实例的 __proto__ 属性指向构造函数的原型对象
  result.__proto__ = Constructor.prototype;
  Constructor.apply(result, arguments);

  return result
}
let miao = myNew1(Cat)

console.log('miao: ', miao);

// 第二版
function myNew2(Fun) {
  // 创建一个要返回的实例
  let result = {}
  // shift 删除第一项 并返回 会影响原数组  
  // 这里就是将构造函数设置为 Constructor 然后剩下的参数就是arguments
  let Constructor = [].shift.call(arguments);

  // 将实例的 __proto__ 属性指向构造函数的原型对象
  result.__proto__ = Constructor.prototype;

  // 处理构造函数返回值的情况
  var ret = Constructor.apply(result, arguments);//借用外部传入的构造器给obj设置属性

  return typeof ret === 'object' ? ret : result;//确保构造器总是返回一个对象
}
```

