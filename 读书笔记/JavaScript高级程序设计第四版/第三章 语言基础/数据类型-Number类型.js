//进制类型
let octalNum1 = 070; // 八进制的 56 

// let octalNum2 = 079; // 无效的八进制值，当成 79 处理

let octalNum3 = 08; // 无效的八进制值，当成 8 处理

let hexNum1 = 0xA; // 十六进制 10 
let hexNum2 = 0x1f; // 十六进制 31

// NaN

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

