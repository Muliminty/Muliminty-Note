console.log('-------------------------------进制类型-----------------------------');
let octalNum1 = 070; // 八进制的 56 
// let octalNum2 = 079; // 无效的八进制值，当成 79 处理
let octalNum3 = 08; // 无效的八进制值，当成 8 处理
let hexNum1 = 0xA; // 十六进制 10 
let hexNum2 = 0x1f; // 十六进制 31
console.log('-------------------------------NaN-----------------------------');
/**
 * 0 除任意数值在其他语言中通常都会导致错误，从而中止代码执
 * 行。但在 ECMAScript 中，0、+0 或0 相除会返回 NaN：
**/
console.log(0 / 0); // NaN 
console.log(-0 / +0); // NaN
/**
 * 如果分子是非 0 值，分母是有符号 0 或无符号 0，则会返回 Infinity 或-Infinity：
**/
console.log(5 / 0); // Infinity 
console.log(5 / -0); // -Infinity
console.log('-------------------------------isNaN()函数-----------------------------');
console.log(isNaN(NaN)); // true 
console.log(isNaN(10)); // false，10 是数值
console.log(isNaN("10")); // false，可以转换为数值 10 
console.log(isNaN("blue")); // true，不可以转换为数值
console.log(isNaN(true)); // false，可以转换为数值 1
console.log('-------------------------------数值转换-----------------------------');
let num1 = Number("Hello world!"); // NaN 
let num2 = Number(""); // 0 
let num3 = Number("000011"); // 11 
let num4 = Number(true); // 1
/**
 * 考虑到用 Number()函数转换字符串时相对复杂且有点反常规，
 * 通常在需要得到整数时可以优先使用 parseInt()函数。
**/
let num10 = parseInt("1234blue"); // 1234 
let num20 = parseInt(""); // NaN 
let num30 = parseInt("0xA"); // 10，解释为十六进制整数
let num40 = parseInt(22.5); // 22 
let num50 = parseInt("70"); // 70，解释为十进制值
let num60 = parseInt("0xf"); // 15，解释为十六进制整数
/**
 * 不同的数值格式很容易混淆，因此 parseInt()也接收第二个参数，用于指定底数（进制数）。如
 * 果知道要解析的值是十六进制，那么可以传入 16 作为第二个参数，以便正确解析：
**/
let num = parseInt("0xAF", 16); // 175
/**
 * 事实上，如果提供了十六进制参数，那么字符串前面的"0x"可以省掉：
**/
let num100 = parseInt("AF", 16); // 175 
let num200 = parseInt("AF"); // NaN
/**
 * 通过第二个参数，可以极大扩展转换后获得的结果类型。比如：
**/
let num1000 = parseInt("10", 2); // 2，按二进制解析
let num2000 = parseInt("10", 8); // 8，按八进制解析
let num3000 = parseInt("10", 10); // 10，按十进制解析
let num4000 = parseInt("10", 16); // 16，按十六进制解析

let num10000 = parseFloat("1234blue"); // 1234，按整数解析
let num20000 = parseFloat("0xA"); // 0 
let num30000 = parseFloat("22.5"); // 22.5 
let num40000 = parseFloat("22.34.5"); // 22.34 
let num50000 = parseFloat("0908.5"); // 908.5 
let num60000 = parseFloat("3.125e7"); // 31250000