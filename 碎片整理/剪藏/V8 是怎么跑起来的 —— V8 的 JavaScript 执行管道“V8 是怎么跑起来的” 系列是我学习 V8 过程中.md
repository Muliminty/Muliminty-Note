[V8 是怎么跑起来的 —— V8 的 JavaScript 执行管道“V8 是怎么跑起来的” 系列是我学习 V8 过程中 - 掘金](https://juejin.cn/post/6844903990073753613)

> 本文作者：[ThornWu（汤圆）](https://juejin.cn/user/3579665590257896 "https://juejin.cn/user/3579665590257896")，HIGO 前端工程师。

## 作者有话说

“V8 是怎么跑起来的” 系列是我学习 V8 过程中的总结。从一年前正式成为前端工程师开始，我便有意识地了解和学习 V8。我也发现，在技术社区中鲜有内容新鲜的、原创度高的中文资料，于是开始将我学习过程中的总结分享出来。

由于工作繁忙，我已经半年没有更新博客。这个系列的引子是 4 月写的一篇 [《V8 是怎么跑起来的 —— V8 中的对象表示》](https://juejin.cn/post/6844903833571688462 "https://juejin.cn/post/6844903833571688462")，我们通过使用 Chrome DevTools 验证的方式介绍了 V8 中的对象表示。

本文是这个系列真正意义的第一篇文章。文章的定位是这个系列的大纲，将按照 JavaScript 在 V8 中的执行流程，顺序介绍每一步的操作，并澄清一个社区中流传甚广的 “错误”。本文不会过于深究其中的细节（后续篇章将展开），您可以在评论中留下您想了解 V8 引擎的部分，也许下一篇选题会采纳并优先介绍。

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/8/16e48ec439392875~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

祝阅读愉快。

## 1. 为什么是 V8

> Any application that can be written in JavaScript, will eventually be written in JavaScript.

相信很多的朋友都听过前端界的一个著名定律，叫做 `Atwood’s Law`。2007 年，Jeff Atwood 提出 “所有可以用 JavaScript 编写的应用程序最终都会用 JavaScript 编写”。转眼 12 年过去，现在，我们的确可以看到，JavaScript 在浏览器端、服务端、桌面端、移动端、IoT 领域都发挥着作用。

另一方面，截至目前（2019-11-08），Chrome 在全平台的市场占有率已经达到 [64.92%](https://link.juejin.cn/?target=https%3A%2F%2Fgs.statcounter.com%2Fbrowser-market-share "https://gs.statcounter.com/browser-market-share")（数据来源：StatCounter）。作为 Chrome 的 JavaScript 引擎，V8 在 Chrome 扩大市场占有率方面也起到十分关键的作用。

作为最强大的 JavaScript 引擎之一，V8 同样是无处不在。在浏览器端，它支撑着 Chrome 以及众多 Chromium 内核的浏览器运行。在服务端，它是 Node.js 及 Deno 框架的执行环境。在桌面端和 IoT 领域，也同样有 V8 的一席之地。

## 2. 关于 V8 的知识点

V8 是使用 C++ 编写的高性能 `JavaScript` 和 `WebAssembly` 引擎，支持包括我们熟悉的 ia32、x64、arm 在内的八种处理器架构。

### V8 的发布周期

- 大约每隔六周，就会有一个新的 V8 版本推出
- V8 版本与 Chrome 版本对应，如 V8 v7.8 对应 Chrome 78

### V8 的竞品

- Chakra（前 Edge JavaScript 引擎）
- JavaScript Core（Safari）
- SpiderMonkey（Firefox）

### V8 的重要部件

- Ignition（基线编译器）
- TurboFan（优化编译器）
- Orinoco（垃圾回收器）
- Liftoff（WebAssembly 基线编译器）

> Liftoff 是从 V8 6.8 开始启用的针对 WebAssembly 的基线编译器。尽管 6.8 版本是在 2018 年 8 月推出的，但目前社区上有很多在这个时间后发布的介绍 V8 的文章还没有提及 Liftoff。文章中是否包含 Liftoff 也可以作为文章内容是否陈旧的标志。

由于 WebAssembly 不属于本文的讨论范围，下文将省略关于 Liftoff 的介绍。

## 3. V8 的 JavaScript 执行管道

早期 V8 执行管道由基线编译器 Full-Codegen 与优化编译器 CrankShaft 组成。（V8 执行管道经过多次调整，本文只选取早期执行管道中较为关键的一个阶段，对执行管道演进过程感兴趣的同学可以通过 [V8 相关演讲](https://link.juejin.cn/?target=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DM1FBosB5tjM "https://www.youtube.com/watch?v=M1FBosB5tjM")进行了解）。

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/8/16e48ec43aed2172~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

其中，基线编译器更注重编译速度，而优化编译器更注重编译后代码的执行速度。综合使用基线编译器和优化编译器，使 JavaScript 代码拥有更快的冷启动速度，在优化后拥有更快的执行速度。

这个架构存在诸多问题，例如，Crankshaft 只能优化 JavaScript 的一个子集；编译管道中层与层之间缺乏隔离，在某些情况下甚至需要同时为多个处理器架构编写汇编代码等等。

为了解决架构混乱和扩展困难的问题，经过多年演进，V8 目前形成了由解析器、基线编译器 Ignition 和优化编译器 TurboFan 组成的 JavaScript 执行管道。

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/8/16e48ec4395d10ee~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

解析器将 JavaScript 源代码转换成 AST，基线编译器将 AST 编译为字节码，当代码满足一定条件时，将被优化编译器重新编译生成优化的字节码。

这里我们不得不提一下分层思想。在执行管道改进的过程中，通过引入 IR（Intermediate representation，中间表示），有效地提升了系统可扩展性，降低了关联模块的耦合度及系统的复杂度。

举个例子，有 A、B、C 三个特性需要迁移到两个处理器平台。在引入 IR 之前，需要有 3 * 2 = 6 种代码实现，在引入 IR 之后，需要 3 + 2 = 5 种代码实现。可以看出，一个是乘法的关系，一个是加法的关系。当需要实现很多特性并适配多种处理器架构时，引入 IR 的优势便大大增加了。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/8/16e48ec43ba573e7~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/8/16e48ec44aa2d94b~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

下面我们将结合一段代码，分析 JavaScript 在 V8 中是如何进行处理的。

```
// example1.js
function addTwo(a, b) {
  return a + b
}
```

## 4. 解析器与 AST

解析代码需要时间，所以 JavaScript 引擎会尽可能避免完全解析源代码文件。另一方面，在一次用户访问中，页面中会有很多代码不会被执行到，比如，通过用户交互行为触发的动作。

正因为如此，所有主流浏览器都实现了惰性解析（Lazy Parsing）。解析器不必为每个函数生成 AST（Abstract Syntax tree，抽象语法树），而是可以决定“预解析”（Pre-parsing）或“完全解析”它所遇到的函数。

预解析会检查源代码的语法并抛出语法错误，但不会解析函数中变量的作用域或生成 AST。完全解析则将分析函数体并生成源代码对应的 AST 数据结构。相比正常解析，预解析的速度快了 2 倍。

生成 AST 主要经过两个阶段：分词和语义分析。AST 旨在通过一种结构化的树形数据结构来描述源代码的具体语法组成，常用于语法检查（静态代码分析）、代码混淆、代码优化等。

我们可以借助 [AST Explorer](https://link.juejin.cn/?target=https%3A%2F%2Fastexplorer.net "https://astexplorer.net") 工具生成 JavaScript 代码的 AST。

```
// example1.js
function addTwo(a, b) {
  return a + b
}
```

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/8/16e48ec439f3afed~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

需要注意的是，上图仅描述 AST 的大致结构。V8 有一套自己的 [AST 表示方式](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fv8%2Fv8%2Fblob%2Fmaster%2Fsrc%2Fast%2Fast.h "https://github.com/v8/v8/blob/master/src/ast/ast.h")，生成的 AST 结构有所差异。

## 5. 基线编译器 Ignition 与字节码

V8 引入 JIT（Just In Time，即时编译）技术，通过 Ignition 基线编译器快速生成字节码进行执行。

字节码是机器码的抽象。如果字节码的设计与物理 CPU 的计算模型相同，那么将字节码编译成机器代码就会更加容易。这就是为什么解释器通常是寄存器或堆栈机器。Ignition 是一个带有累加器的寄存器。（[《Understanding V8’s Bytecode》](https://link.juejin.cn/?target=https%3A%2F%2Fmedium.com%2Fdailyjs%2Funderstanding-v8s-bytecode-317d46c94775 "https://medium.com/dailyjs/understanding-v8s-bytecode-317d46c94775")）

和之前的基线编译器 Full-Codegen 相比，Ignition 生成的是体积更小的字节码（Full-Codegen 生成的是机器码）。字节码可以直接被优化编译器 TurboFan 用于生成图（TurboFan 对代码的优化基于图），避免优化编译器在优化代码时需要对 JavaScript 源代码重新进行解析。

使用 `d8` 工具（V8 的开发者 Shell，可通过编译 V8 源码得到，编译流程请参照[《Building V8 with GN》](https://link.juejin.cn/?target=https%3A%2F%2Fv8.dev%2Fdocs%2Fbuild-gn "https://v8.dev/docs/build-gn")）可以查看 Ignition 编译生成的字节码。

```
d8 --print-bytecode example1.js
```

```
[generated bytecode for function:  (0x2d5c6af1efe9 <SharedFunctionInfo>)]
Parameter count 1
Register count 3
Frame size 24
         0x2d5c6af1f0fe @    0 : 12 00             LdaConstant [0]
         0x2d5c6af1f100 @    2 : 26 fb             Star r0
         0x2d5c6af1f102 @    4 : 0b                LdaZero 
         0x2d5c6af1f103 @    5 : 26 fa             Star r1
         0x2d5c6af1f105 @    7 : 27 fe f9          Mov <closure>, r2
         0x2d5c6af1f108 @   10 : 61 2c 01 fb 03    CallRuntime [DeclareGlobals], r0-r2
         0x2d5c6af1f10d @   15 : a7                StackCheck 
         0x2d5c6af1f10e @   16 : 0d                LdaUndefined 
         0x2d5c6af1f10f @   17 : ab                Return 
Constant pool (size = 1)
0x2d5c6af1f0b1: [FixedArray] in OldSpace
 - map: 0x2d5c38940729 <Map>
 - length: 1
           0: 0x2d5c6af1f021 <FixedArray[4]>
Handler Table (size = 0)
```

Ignition 中所有的字节码操作符可以在 [V8 源码](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fv8%2Fv8%2Fblob%2Fmaster%2Fsrc%2Finterpreter%2Fbytecodes.h "https://github.com/v8/v8/blob/master/src/interpreter/bytecodes.h") 中找到，感兴趣的同学可以自行查看。

## 6. 优化编译器 TurboFan 与优化和去优化

编译器需要考虑的函数输入类型变化越少，生成的代码就越小、越快。

众所周知，JavaScript 是弱类型语言。ECMAScript 标准中有大量的多义性和类型判断，因此通过基线编译器生成的代码执行效率低下。

举个例子，`+` 运算符的一个操作数就可能是整数、浮点数、字符串、布尔值以及其它的引用类型，更别提它们之间的各种组合（可以感受一下 [ECMAScript 标准中对于 `+` 的定义](https://link.juejin.cn/?target=https%3A%2F%2Ftc39.es%2Fecma262%2F%23sec-addition-operator-plus "https://tc39.es/ecma262/#sec-addition-operator-plus")）。

```
function addTwo(a, b) {
  return a + b;
}
addTwo(2, 3);                // 3
addTwo(8.6, 2.2);            // 10.8
addTwo("hello ", "world");   // "hello world"
addTwo("true or ", false);   // "true or false"
// 还有很多组合...
```

但这并不意味着 JavaScript 代码没有办法被优化。对于特定的程序逻辑，其接收的参数往往是类型固定的。正因为如此，V8 引入了类型反馈技术。在进行运算的时候，V8 使用类型反馈对所有参数进行动态检查。

简单来说，对于重复执行的代码，如果多次执行都传入类型相同的参数，那么 V8 会假设之后每一次执行的参数类型也是相同的，并对代码进行优化。优化后的代码中会保留基本的类型检查。如果之后的每次执行参数类型未改变，V8 将一直执行优化过的代码。而当之后某一次执行时传入的参数类型发生变化时，V8 将会“撤销”之前的优化操作，这一步称为“去优化”（Deoptimization）。

下面我们稍微修改一下上面的代码，分析其在 V8 中的优化过程。

```
// example2.js
function addTwo (a, b) {
  return a + b;
}

for (let j = 0; j < 100000; j++) {
  if (j < 80000) {
    addTwo(10, 10);
  } else {
    addTwo('hello', 'world');
  }
}
```

```
d8 --trace-opt --trace-deopt example2.js
```

```
[marking 0x2ecfb2a5f229 <JSFunction (sfi = 0x2ecfb2a5f049)> for optimized recompilation, reason: hot and stable]
[compiling method 0x2ecfb2a5f229 <JSFunction (sfi = 0x2ecfb2a5f049)> using TurboFan OSR]
[optimizing 0x2ecfb2a5f229 <JSFunction (sfi = 0x2ecfb2a5f049)> - took 5.268, 5.305, 0.023 ms]
[deoptimizing (DEOPT soft): begin 0x2ecfb2a5f229 <JSFunction (sfi = 0x2ecfb2a5f049)> (opt #0) @2, FP to SP delta: 96, caller sp: 0x7ffee48218c8]
            ;;; deoptimize at <example2.js:10:5>, Insufficient type feedback for call
  reading input frame  => bytecode_offset=80, args=1, height=5, retval=0(#0); inputs:
      0: 0x2ecfb2a5f229 ;  [fp -  16]  0x2ecfb2a5f229 <JSFunction (sfi = 0x2ecfb2a5f049)>
      1: 0x2ecfbcf815c1 ;  [fp +  16]  0x2ecfbcf815c1 <JSGlobal Object>
      2: 0x2ecfb2a418c9 ;  [fp -  80]  0x2ecfb2a418c9 <NativeContext[253]>
      3: 0x2ecf2a140d09 ; (literal  4) 0x2ecf2a140d09 <Odd Oddball: optimized_out>
      4: 0x000000027100 ; rcx 80000
      5: 0x2ecfb2a5f299 ; (literal  6) 0x2ecfb2a5f299 <JSFunction addTwo (sfi = 0x2ecfb2a5f0b1)>
      6: 0x2ecfb2a5efd1 ; (literal  7) 0x2ecfb2a5efd1 <String[#5]: hello>
      7: 0x2ecfb2a5efe9 ; (literal  8) 0x2ecfb2a5efe9 <String[#5]: world>
      8: 0x2ecf2a140d09 ; (literal  4) 0x2ecf2a140d09 <Odd Oddball: optimized_out>
  translating interpreted frame  => bytecode_offset=80, variable_frame_size=48, frame_size=104
    0x7ffee48218c0: [top +  96] <- 0x2ecfbcf815c1 <JSGlobal Object> ;  stack parameter (input #1)
    -------------------------
    0x7ffee48218b8: [top +  88] <- 0x00010bd36b5a ;  caller's pc
    0x7ffee48218b0: [top +  80] <- 0x7ffee48218d8 ;  caller's fp
    0x7ffee48218a8: [top +  72] <- 0x2ecfb2a418c9 <NativeContext[253]> ;  context (input #2)
    0x7ffee48218a0: [top +  64] <- 0x2ecfb2a5f229 <JSFunction (sfi = 0x2ecfb2a5f049)> ;  function (input #0)
    0x7ffee4821898: [top +  56] <- 0x2ecfb2a5f141 <BytecodeArray[99]> ;  bytecode array
    0x7ffee4821890: [top +  48] <- 0x00000000010a <Smi 133> ;  bytecode offset
    -------------------------
    0x7ffee4821888: [top +  40] <- 0x2ecf2a140d09 <Odd Oddball: optimized_out> ;  stack parameter (input #3)
    0x7ffee4821880: [top +  32] <- 0x000000027100 <Smi 80000> ;  stack parameter (input #4)
    0x7ffee4821878: [top +  24] <- 0x2ecfb2a5f299 <JSFunction addTwo (sfi = 0x2ecfb2a5f0b1)> ;  stack parameter (input #5)
    0x7ffee4821870: [top +  16] <- 0x2ecfb2a5efd1 <String[#5]: hello> ;  stack parameter (input #6)
    0x7ffee4821868: [top +   8] <- 0x2ecfb2a5efe9 <String[#5]: world> ;  stack parameter (input #7)
    0x7ffee4821860: [top +   0] <- 0x2ecf2a140d09 <Odd Oddball: optimized_out> ;  accumulator (input #8)
[deoptimizing (soft): end 0x2ecfb2a5f229 <JSFunction (sfi = 0x2ecfb2a5f049)> @2 => node=80, pc=0x00010bd394e0, caller sp=0x7ffee48218c8, took 0.331 ms]
[marking 0x2ecfb2a5f229 <JSFunction (sfi = 0x2ecfb2a5f049)> for optimized recompilation, reason: hot and stable]
[marking 0x2ecfb2a5f299 <JSFunction addTwo (sfi = 0x2ecfb2a5f0b1)> for optimized recompilation, reason: small function]
[compiling method 0x2ecfb2a5f299 <JSFunction addTwo (sfi = 0x2ecfb2a5f0b1)> using TurboFan]
[compiling method 0x2ecfb2a5f229 <JSFunction (sfi = 0x2ecfb2a5f049)> using TurboFan OSR]
[optimizing 0x2ecfb2a5f229 <JSFunction (sfi = 0x2ecfb2a5f049)> - took 0.161, 0.441, 0.018 ms]
[optimizing 0x2ecfb2a5f299 <JSFunction addTwo (sfi = 0x2ecfb2a5f0b1)> - took 0.096, 0.231, 0.007 ms]
[completed optimizing 0x2ecfb2a5f299 <JSFunction addTwo (sfi = 0x2ecfb2a5f0b1)>]
```

在这段代码中，我们执行了 100,000 次 `+` 操作，其中前 80,000 次是两个整数相加，后 20,000 次是两个字符串相加。

通过跟踪 V8 的优化记录，我们可以可以看到，代码第 10 行（即第 80,001 次执行时）由于参数类型由整数变为字符串，触发了去优化操作。

需要注意的是，去优化的开销昂贵，在实际编写函数时要尽量避免触发去优化。

## 7. 垃圾回收

当内存不再需要的时候，会被周期性运行的垃圾回收器回收。

任何垃圾回收器都有一些必须定期完成的基本任务。

1. 确定存活/死亡对象
2. 回收/再利用死亡对象所占用的内存
3. 压缩/整理内存（可选）

V8 的垃圾回收主要有三个阶段：标记、清除和整理。

### 世代假说

世代假说（generational hypothesis），也称为弱分代假说（weak generational hypothesis）。这个假说表明，大多数新生的对象在分配之后就会死亡（“用后即焚”），而老的对象通常倾向于永生。

V8 的垃圾回收基于世代假说，将内存分为新生代和老生代。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/8/16e48ec4631be4d6~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

图源：[V8 博客](https://link.juejin.cn/?target=https%3A%2F%2Fv8.dev%2Fblog%2Ftrash-talk "https://v8.dev/blog/trash-talk")

如图所示，新生代内部进一步细分为 Nursery 和 Intermediate 子世代（划分只是逻辑上的）。新生对象会被分配到新生代的 Nursery 子世代。若对象在第一次垃圾回收中存活，它的标志位将发生改变，进入逻辑上的 Intermediate 子世代，在物理存储上仍存在于新生代中。如果对象在下一次垃圾回收中再次存活，就会进入老生代。对象从新生代进入到老生代的过程叫做晋升（promotion）。

V8 在新生代和老生代采用了不同的垃圾回收策略，使垃圾回收更有针对性、更加高效。同时，V8 对新生代和老生代的内存大小也进行了限制。

|名称|算法|大小|
|---|---|---|
|新生代|Parallel Scavenge 算法|32MB（64位）/ 16MB（32位）|
|老生代|标记清除、标记整理算法|1400MB（64位）/ 700MB（32 位）|

需要注意的是，随着内存增大，垃圾回收的次数会减少，但每次所需的时间也会增加，将会对应用的性能和响应能力产生负面影响，因此内存并不是越大越好。

### 新生代

V8 使用 Parallel Scavenge（并行清理）算法，它与 Halstead 算法类似（在 V8 v6.2 版本之前使用的是类 Cheney 算法），其核心是复制算法。

复制算法是一种以空间换时间的方式。

V8 将新生代拆分为大小相同的两个半空间，分别称为 Form 空间 和 To 空间。垃圾回收时，V8 会检查 From 空间中的存活对象，将这些对象复制到 To 空间。之后，V8 将直接释放死亡对象所对应的空间。每次完成复制后，From 和 To 的位置将发生互换。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/8/16e48ec466e78375~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/8/16e48ec4680bc4d4~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

当一个对象经过一次复制依然存活，该对象将被移动到老生代，这个过程称为晋升。

### 老生代

根据世代假说，老生代的对象倾向于永生，即它们很少需要被回收，这意味着在老生代使用复制算法是不可行的。V8 在老生代中使用了标记清除和标记整理算法进行垃圾回收。

#### 标记清除（Mark-Sweep）

标记清除已经诞生了半个多世纪。它的算法原理十分简单。垃圾回收器从根节点开始，标记根直接引用的对象，然后递归标记这些对象的直接引用对象。对象的可达性作为是否“存活”的依据。

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/8/16e48ec46c8981a3~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

标记清除算法所花费的时间与活动对象的数量成正比。

#### 标记整理（Mark-Compact）

标记整理算法是将复制算法和标记清除算法结合的产物。

当我们进行标记清除之后，就可能会产生内存碎片，这些碎片对我们程序进行内存分配时不利的。

举个极端的例子，在下图中，蓝色的对象是需要我们分配内存的新对象，在内存整理之前，所有的碎片空间都无法容纳完整的对象，而在内存整理之后，碎片空间被合并成一个大的空间，也能容纳下新对象。

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/8/16e48ec4752739dd~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

标记整理算法的优缺点都十分明显。它的优点是，能够让堆利用更加充分有效。它的缺点是，它需要额外的扫描时间和对象移动时间，并且花费的时间与堆的大小成正比。

### 最大保留空间 —— 一个社区流传已久的 “错误”

V8 会在堆内存中为新老生代预留空间，引申出一个最大保留空间（Max Reserved）的概念。影响最大保留空间大小的因素主要有 `max_old_generation_size_`（老生代最大空间）和 `max_semi_space_size_`（新生代最大半空间）。其中，前者在 Node 中可以通过 `--max-old-space-size` 指定。

社区中流传已久的计算方式是 “最大保留空间 = 4 * 新生代最大半空间 + 老生代最大空间”，其源头应该是来自朴灵老师的[《深入浅出 Node.js》](https://link.juejin.cn/?target=https%3A%2F%2Fbook.douban.com%2Fsubject%2F25768396%2F "https://book.douban.com/subject/25768396/")。但从这本书出版后（2013 年 12 月）到现在，最大保留空间的计算方式实际上进行了两次调整。

**5.1.277 及之前版本（《深入浅出 Node.js》对应的版本）**

```
// Returns the maximum amount of memory reserved for the heap.  For
// the young generation, we reserve 4 times the amount needed for a
// semi space.  The young generation consists of two semi spaces and
// we reserve twice the amount needed for those in order to ensure
// that new space can be aligned to its size.
intptr_t MaxReserved() {
  return 4 * reserved_semispace_size_ + max_old_generation_size_;
}
```

**5.1.278 版本**

```
// Returns the maximum amount of memory reserved for the heap.
intptr_t MaxReserved() {
  return 2 * max_semi_space_size_ + max_old_generation_size_;
}
```

**7.4.137 版本**

```
size_t Heap::MaxReserved() {
  const size_t kMaxNewLargeObjectSpaceSize = max_semi_space_size_;
  return static_cast<size_t>(2 * max_semi_space_size_ +
                             kMaxNewLargeObjectSpaceSize +
                             max_old_generation_size_);
}
```

简单来说，这两次调整在数值上是将 “新生代最大半空间” 的系数从 4 倍变为 2 倍再变为 3 倍。

根据 [Node.js 的 Release 记录](https://link.juejin.cn/?target=https%3A%2F%2Fnodejs.org%2Fen%2Fdownload%2Freleases%2F "https://nodejs.org/en/download/releases/")，以上 V8 版本与 Node.js 版本的对应关系为：

|V8 版本|Node.js 版本|
|---|---|
|5.1.277 及之前版本|6.4.0 及之前版本|
|5.1.278 - 7.4.136|6.4.0 之后，12.0.0 之前版本|
|7.4.137 及之后版本|12.0.0 及之后版本|

考虑到 Node.js 6.4.0 版本发布时间较早，为 2016 年 8 月，目前 LTS 版本也不再维护，可以合理地推断目前使用比例较大的计算方式为第二种和第三种。然而，社区中的资料鲜有提及这两次变更的（本人只找到一篇[知乎专栏](https://link.juejin.cn/?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F70854476 "https://zhuanlan.zhihu.com/p/70854476")里提到了第二种计算方式），与此同时仍有很多新发布的文章仍然使用第一种计算方式而没有注明 Node.js 版本，容易让读者认为最大保留空间计算方式没有发生变化，大量过时的信息显然已经造成了 “错误”。

## 8. 代码缓存

在 Chrome 浏览器中有很多功能都或多或少影响了 JavaScript 的执行过程，其中一个功能是代码缓存（Code Caching）。

在用户访问相同的页面，并且该页面关联的脚本文件没有任何改动的情况下，代码缓存技术会让 JavaScript 的加载和执行变得更快。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/8/16e48ec46d3ecfb0~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

图源：[V8 博客](https://link.juejin.cn/?target=https%3A%2F%2Fv8.dev%2Fblog%2Fcode-caching-for-devs "https://v8.dev/blog/code-caching-for-devs")

代码缓存被分为 cold、warm、hot 三个等级。

1. 用户首次请求 JS 文件时（即 cold run），Chrome 将下载该文件并将其提供给 V8 进行编译，并将该文件缓存到磁盘中。
    
2. 当用户第二次请求这个 JS 文件时（即 warm run），Chrome 将从浏览器缓存中获取该文件，并将其再次交给 V8 进行编译。在 warm run 阶段编译完成后，编译的代码会被反序列化，作为元数据附加到缓存的脚本文件中。
    
3. 当用户第三次请求这个 JS 文件时（即 hot run），Chrome 从缓存中获取文件和元数据，并将两者交给 V8。V8 将跳过编译阶段，直接反序列化元数据。
    

## 相关链接

### 参考资料

- [V8 博客](https://link.juejin.cn/?target=https%3A%2F%2Fv8.dev%2F "https://v8.dev/")
- [V8 源码](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fv8%2Fv8 "https://github.com/v8/v8")

## 招贤纳士

HIGO 是中国有名的全球时尚买手店，由美丽说创始人徐易容先生亲自带领，曾独家冠名跑男第三季。我们的梦想是让中国拥有全世界最好的美感和设计。

我们赞颂喜欢创造新东西的人们。他们热诚、挑剔、有趣。我们相信，他们会让世界变得更美好。我们是这样的一群人，如果你也是，欢迎你加入！

简历请投递至 [wenchenghua@higohappy.com](https://juejin.cn/post/wenchenghua@higohappy.com "wenchenghua@higohappy.com")。