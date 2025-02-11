[😈leader:你知道Pnpm为何如此强大吗？说说怎么用Pnpm治理冗余重复依赖(万字精华干货)本文深入剖析了包管理工 - 掘金](https://juejin.cn/post/7469605640186839090#heading-10)

本文主要介绍了前端包管理工具的发展，重点探讨了`pnpm`的相关内容。从`npm`的诞生及发展中存在的问题，到`yarn`的优势与局限，引出`pnpm`。详细阐述了`pnpm`的特点，如安装速度快、磁盘空间利用高效，其依赖管理方式包括硬链接、软链接等机制，还介绍了幽灵依赖产生的原因及`pnpm`的处理方式，以及`pnpm`项目的依赖治理方案。最后指出`pnpm`虽有优势但生态仍在成长。

关联问题: pnpm如何处理冲突 npm有何优化方法 yarn缺陷能解决吗

### 前言

在现代前端开发中，高效的包管理和依赖治理对于项目的健康发展至关重要。随着项目规模的不断扩大，传统的 **npm** 和 **yarn** 在处理依赖关系时可能会遇到诸如**依赖重复安装**、**磁盘空间浪费**、**依赖版本冲突**等问题。而 `pnpm`（performant npm）作为新一代包管理工具，不仅显著提升了安装效率，还为项目依赖治理带来了全新的解决方案。

本文将深入探讨 `pnpm` 的核心特性及其在实际项目中的应用。我们将从以下几个方面展开：

> - 包管理工具的发展历程以及`pnpm`的独特优势
> - 产生**幽灵依赖**的根本原因探究
> - 什么是依赖结构的**不确定性**
> - `pnpm` 的工作原理及其相比 **npm** / **yarn** 的优势
> - 基于 `pnpm` 的依赖治理最佳实践

通过本文的介绍，希望能够帮助你更好地理解和使用 `pnpm`，建立起完善的依赖管理体系。(看完还不懂任你说！😘)

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/41a9a95919b8411d8794b6c2df0ba0b7~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP5bqEenp6:q75.awebp?rk3s=f64ab15b&x-expires=1739786437&x-signature=H2nbK%2BjTx7XRihkc4%2FM4qDeFo9E%3D)

## npm 的诞生与发展

在 Web 开发的早期阶段，JavaScript 代码主要以简单的**脚本**形式存在，开发者通常通过**手动**下载和管理代码库。随着 2009 年 **Node.js** 的诞生，JavaScript 开始在服务器端大放异彩，开发者对模块化开发和依赖管理的需求也随之增长。

在这样的背景下，Isaac Z. Schlueter 于 2010 年创建了 `npm`（Node Package Manager）。作为 **Node.js** 的标准包管理工具，`npm` 优雅地解决了**模块安装**、**版本管理**和**依赖管理**等问题。它引入了革命性的 `node_modules` 目录结构，允许每个项目维护自己的依赖，实现了依赖的局部安装，使得不同项目能够使用不同版本的包而不会产生冲突。

`npm` 的出现极大地促进了 JavaScript 生态系统的发展。开发者可以轻松地发布、共享和复用代码，这导致了开源社区的蓬勃发展。截至目前，`npm` 注册表已经成为世界上最大的软件注册库，拥有超过 200 万个包，每周下载量超过 350 亿次。

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/fac527c8249e472289675b15fe561c09~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP5bqEenp6:q75.awebp?rk3s=f64ab15b&x-expires=1739786437&x-signature=%2Bz%2Bbw4micQ5MzLxRblosyfXIw4o%3D)

然而，随着项目规模的扩大和依赖数量的增加，`npm` 的一些固有问题开始显现：

> 1. `node_modules` 体积膨胀：由于依赖嵌套和重复安装，一个简单的项目可能产生数百兆的 `node_modules` 目录
> 2. 安装效率低下：重复的依赖下载和磁盘写入操作导致安装速度慢
> 3. 依赖结构复杂：**扁平化**算法可能导致依赖关系难以预测
> 4. 磁盘空间浪费：相同的依赖包在不同项目中**重复存储**

这些问题推动了包管理工具的进一步发展，催生了 `Yarn`（2016）和 `pnpm`（2017）等新一代包管理工具的诞生。

## 嵌套依赖模型存在的问题

在 npm2 及以前，每个包会将其依赖安装在自己的 `node_modules` 目录下，这意味着每个依赖也会带上自己的依赖，形成一个嵌套的结构，结构如下：： ![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/d0e26e5f1265463d927284ba9dc2015e~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP5bqEenp6:q75.awebp?rk3s=f64ab15b&x-expires=1739786437&x-signature=1RuGFaTEptNEwO%2Bo%2FI9uyugtwFk%3D)

假如嵌套的层数很深呢？

```
node_modules 
└─ 依赖A 
   ├─ index.js 
   ├─ package.json 
   └─ node_modules 
       └─ 依赖B 
       ├─ index.js 
       ├─ package.json
       └─ node_modules 
           └─ 依赖C 
           ├─ index.js 
           ├─ package.json 
           └─ node_modules 
               └─ 依赖D 
               ├─ index.js 
               └─ package.json
```

可以发现， 这样的结构虽然解决了版本冲突、依赖隔离等问题，但却有几个致命的缺点：

> - **磁盘空间占用**：每个依赖都会安装自己的依赖，导致了大量的重复，特别是在多个包共享同一依赖的场景下。
> - **深层嵌套问题**：这种嵌套结构在文件系统中造成了非常长的路径，然而大多数 Windows 工具、实用程序和 shell 最多只能处理长达 260 个字符的文件和文件夹路径。一旦超过，安装脚本就会开始出错，而且无法再使用常规方法删除 `node_modules` 文件夹。相关 **issue**：[github.com/nodejs/node…](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fnodejs%2Fnode-v0.x-archive%2Fissues%2F6960 "https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fnodejs%2Fnode-v0.x-archive%2Fissues%2F6960")
> - **安装和更新缓慢**：每次安装或更新依赖时，npm 需要处理和解析整个依赖树，过程非常缓慢。

## npm3架构与yarn

为解决这些问题，npm 在第三个版本进行了重构：[github.com/npm…](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fnpm%2Fnpm%2Freleases%2Ftag%2Fv3.0.0 "https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fnpm%2Fnpm%2Freleases%2Ftag%2Fv3.0.0")

通过将依赖扁平化，尽可能地减少了重复的包版本，有效减少了**项目的总体积**，同时也避免了 npm 早期的**深层嵌套**问题。

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/c48d28e08cf24437a01fa6d7ad4627a1~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP5bqEenp6:q75.awebp?rk3s=f64ab15b&x-expires=1739786437&x-signature=zlAMRrikW1OlrJNN3q0CmJwEtlA%3D)

扁平化结构如下：

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/e24d57dee62b4e23a9ff5b75fc7f4b05~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP5bqEenp6:q75.awebp?rk3s=f64ab15b&x-expires=1739786437&x-signature=XWydMwtMdXsQcukrtrx45i0ok4E%3D) 代码结构：

```
node_modules 
└─ 依赖A  
    ├─ index.js 
    ├─ package.json 
    └─ node_modules 
└─ 依赖C   
    ├─ index.js 
    ├─ package.json 
    └─ node_modules 
└─ 依赖B 
    ├─ index.js 
    ├─ package.json 
    └─ node_modules 
```

`node_modules`下所有的依赖都会平铺到同一层级。由于**require**寻找包的机制，如果A和C都依赖了B，那么A和C在自己的`node_modules`中未找到依赖C的时候会向上寻找，并最终在与他们同级的`node_modules`中找到依赖包C。 这样**就不会出现重复下载的情况。而且依赖层级嵌套也不会太深。因为没有重复的下载，所有的A和C都会寻找并依赖于同一个B包。自然也就解决了实例无法共享数据的问题**

## Yarn 的诞生与局限

### Yarn 的诞生背景

2016 年，Facebook 团队面对 `npm` 在大型项目中的种种问题，如安装不确定性、性能低下等，推出了新的包管理工具 `Yarn`（Yet Another Resource Negotiator）。`Yarn` 在发布之初就展现出了显著的优势：

1. **确定性安装**：通过 `yarn.lock` 文件确保了在不同环境下安装的依赖版本完全一致
2. **并行下载**：利用并行下载提升了安装速度
3. **离线模式**：引入缓存机制，支持离线安装
4. **更好的命令行界面**：提供了更友好的命令行交互体验

这些改进使得 `Yarn` 迅速获得了开发者的青睐，成为了 `npm` 的有力竞争者。

### Yarn 仍然存在的问题

然而，`Yarn` 虽然解决了 `npm` 的一些问题，但在核心设计上仍然沿用了与 `npm` 相似的依赖管理模式，因此存在一些根本性问题：

1. **依赖存储效率问题**

> - 仍然采用扁平化的 `node_modules` 结构
> - 不同项目的相同依赖包会被重复存储，造成磁盘空间浪费
> - 在 `monorepo` 项目中，即使使用 `workspace` 功能，依赖重复问题依然存在

2. **幽灵依赖（Phantom Dependencies）**
    
    ```
    {
      "dependencies": {
        "express": "4.17.1"  // express 依赖了 body-parser
      }
    }
    ```
    
    - 由于扁平化处理，项目可以直接使用未声明在 `package.json` 中的依赖
    - 这种隐式依赖可能导致潜在的问题和不可预测的行为

文章后面会详细补充**什么是幽灵依赖**以及如何解决～

3. **依赖管理的不确定性**
    - 扁平化算法的复杂性可能导致依赖树的结构难以预测
    - 不同的安装顺序可能产生不同的 `node_modules` 结构

文章后面会举case详细补充**什么是依赖管理的不确定性**～

4. **安装性能**
    
    ```
    # 在大型项目中，即使使用缓存
    yarn install  # 仍然需要大量的文件复制操作
    ```
    
    - 虽然有并行下载，但文件复制和链接操作仍然耗时
    - 大型项目的首次安装和清理重装仍然较慢
5. **磁盘空间占用**
    
    - 即使是小型项目，`node_modules` 目录也可能占用数百 MB 空间
    - 对于维护多个项目的开发者来说，磁盘空间消耗巨大

这些问题的存在，促使开发社区继续探索更好的解决方案。`pnpm` 的出现，通过创新的依赖管理方式，为这些问题提供了更优的解决方案：

> - 采用**内容寻址存储**，通过**硬链接**共享依赖
> - 使用**符号链接**创建严格的依赖结构
> - 避免依赖重复安装和幽灵依赖
> - 显著减少磁盘空间占用

这使得 `pnpm` 在包管理工具的演进中代表了一个重要的技术突破，为前端工程化带来了新的可能。

最后在详细介绍`pnpm`之前，我来给大家演示一下**幽灵依赖**👻和**依赖结构的不确定性**(`lock`文件产生的原因)

## 何为幽灵依赖

由于这个扁平化结构的特点，想必大家都遇到了这样的体验，自己明明就只安装了一个依赖包，打开`node_modules`文件夹一看，里面却有一大堆。 例如我们在终端执行:

```
npm init -y

npm i express -S
```

这时候我们打开 `node_modules` 文件夹,你会惊奇的发现： ![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/6c09b05147d64ea1b1e7e4cbdb26b31b~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP5bqEenp6:q75.awebp?rk3s=f64ab15b&x-expires=1739786437&x-signature=%2FYAA617NZthWREOhUoNgXdCAqn4%3D)

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/4590d59aa80449a69f5a20f57125551f~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP5bqEenp6:q75.awebp?rk3s=f64ab15b&x-expires=1739786437&x-signature=nZSPlB%2FCS0ZmNl9rhgwrNWRJJSs%3D) 我明明只安装了 `express`,怎么 `node_modules` 下会出现那么多包?其实很简单,那是因为 `express` 依赖了一些包,而依赖的这些包又会依赖其它包...`npm` 则是把这些包拍平了放到了 `node_modules` 下,这也就导致 `node_modules` 里出现了这么多包

这就衍生了一个问题：

> 假设： 引入依赖a，a依赖又依赖于b，逻辑上则结构就应该是：

```
> -node_module/a 
> -node_module/a/node_module/b
```

但是在扁平化展开后则变成了:

```
> -node_module/a > -node_module/b
```

这样说那岂不是.....😈

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/fa6fa8f5c1874ac2ad68d80b9dd4968c~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP5bqEenp6:q75.awebp?rk3s=f64ab15b&x-expires=1739786437&x-signature=tBmXuJ3Ns65RKD5UhYYldGrEhsQ%3D)

把安装`express`的时候自动下载的`body-parser`拿出来测试一下嘿嘿😈😈

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/79bf4bbd66aa4537b23f2218f792acc8~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP5bqEenp6:q75.awebp?rk3s=f64ab15b&x-expires=1739786437&x-signature=kkw4UY58qkOuVDXbEhMVi1LGsuU%3D)

```
import bd from "body-parser"; 
console.log(bd); //成功输出了
```

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/e1a0b0d5b4604e5aab73a5e03f710d15~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP5bqEenp6:q75.awebp?rk3s=f64ab15b&x-expires=1739786437&x-signature=71r3EZh0%2FX98nBWgZGdK8txavX8%3D)这会带来什么后果和隐患呢？

> - 当 `express` 在未来版本中移除或更换 `body-parser` 依赖时，你的项目将意外破损(直接崩了)
> - 你无法控制 `body-parser` 的具体版本，完全依赖于 `express` 的依赖声明

## 依赖结构的不确定性

这个怎么理解，为什么会产生这种问题呢？我们来仔细想想，加入有如下一种依赖结构：

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/7c21e08204c3415c8fad8a4679797dd2~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP5bqEenp6:q75.awebp?rk3s=f64ab15b&x-expires=1739786437&x-signature=QvEzVoslWZgveFFDOnDhvPfh6Pk%3D) foo包与bar包同时依赖了`base64-js`包的不同版本，**由于同一目录下不能出现两个同名文件，所以这种情况下同一层级只能存在一个版本的包，另外一个版本还是要被嵌套依赖。**

那么问题又来了，既然是要一个扁平化一个嵌套，那么执行`npm/yarn install` 的时候，通过扁平化处理之后：

究竟是这样呢？

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/68126f3a6aec4c5b9ac881e59fd52335~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP5bqEenp6:q75.awebp?rk3s=f64ab15b&x-expires=1739786437&x-signature=FZBFh4MKFV5MCTC%2BXUzDQzmxBys%3D) 还是这样：

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/d3eeb70bc5c64c20a3fe824b01ae08a2~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP5bqEenp6:q75.awebp?rk3s=f64ab15b&x-expires=1739786437&x-signature=1BOmXK4NlYzzdMd1j%2BwCcZ9C9aY%3D)

答案：这两种结构都有可能

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/160751f1b5c24ef880d091c9181fcd49~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP5bqEenp6:q75.awebp?rk3s=f64ab15b&x-expires=1739786437&x-signature=AMQTPvViIsPW2ob4Xhr8oBsXlRU%3D) 

准确点说**哪个版本的包被提升，取决于包的安装顺序！** 取决于 foo 和 bar 在 `package.json`中的位置，如果 foo 声明在前面，那么就是前面的结构，否则是后面的结构

这就是为什么会产生依赖结构的`不确定`问题，也是 `lock 文件`诞生的原因，无论是`package-lock.json`(npm 5.x 才出现)还是`yarn.lock`，都是为了保证 install 之后都产生确定的`node_modules`结构。

因此，npm/yarn 本身还是存在`扁平化算法复杂`和`package非法访问`的问题，影响性能和安全。

## pnpm王牌登场 -- 网状+平铺结构

`pnpm` (performant npm) 是一个快速、节省磁盘空间的包管理工具。它于 2017 年发布，是 `npm` 的替代品，专注于解决传统包管理工具存在的问题。

就这么简单，说白了它跟`npm`与`yarn`没有区别，都是包管理工具。但它的独特之处在于：

> - 包安装速度极快
> - 磁盘空间利用非常高效

### 安装包速度快

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/30706e9813c94a1898f05b127322d972~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP5bqEenp6:q75.awebp?rk3s=f64ab15b&x-expires=1739786437&x-signature=vEFfaW2gZMro0pByvoNPwueUkSA%3D) 从上图可以看出，`pnpm`的包安装速度明显快于其它包管理工具。那么它为什么会比其它包管理工具快呢？

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/35af57eed28f40e98c7d2614e8922539~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP5bqEenp6:q75.awebp?rk3s=f64ab15b&x-expires=1739786437&x-signature=%2BvNG0k7Zm121Ajyau4R%2BtJ7OEWw%3D)

我们来可以来看一下各自的安装流程：

`npm` / `yarn` :

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/a86a08a9bdd94e8cacf52fd45f001a65~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP5bqEenp6:q75.awebp?rk3s=f64ab15b&x-expires=1739786437&x-signature=r0d5IjV6LPeAznywdayuryJ8SGo%3D)

> 1. **resolving**：首先他们会解析依赖树，决定要`fetch`哪些安装包。
> 2. **fetching**：安装去`fetch`依赖的`tar`包。这个阶段可以同时下载多个，来增加速度。
> 3. **wrting**：然后解压包，根据文件构建出真正的依赖树，这个阶段需要大量文件`IO`操作。

`pnpm` :

![pnpm.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/086f38858545470eaecf84b3469310e1~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP5bqEenp6:q75.awebp?rk3s=f64ab15b&x-expires=1739786437&x-signature=7%2F5BOHnoSPjsbRYezP0f8bEYjpk%3D)

上图是pnpm的安装流程，可以看到针对每个包的三个流程都是**平行**的，并行处理所以速度当然会快很多。不过pnpm会多一个阶段，就是通过链接组织起真正的依赖树目录结构。

### 依赖管理

pnpm使用的是`npm 2.x`类似的嵌套结构，同时使用`.pnpm` 以平铺的形式储存着所有的包。然后使用`Store + Links`和文件资源进行关联。

> 简单说pnpm把会包下载到一个公共目录，如果某个依赖在 `sotre` 目录中存在了话，那么就会直接从 store 目录里面去 `hard-link`，避免了二次安装带来的时间消耗，如果依赖在 `store` 目录里面不存在的话，就会去下载一次。通过`Store + hard link`的方式，使得项目中不存在NPM依赖地狱问题，从而完美解决了`npm3+`和`yarn`中的包重复问题。

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/99f81b3506c548e88a4573bcd64fedc3~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP5bqEenp6:q75.awebp?rk3s=f64ab15b&x-expires=1739786437&x-signature=pxuHAJL5JRnNM1rDIc5fykoJKSk%3D)

我们分别用`npm`与`pnpm`来安装**vite**对比看一下：

|npm|pnpm|
|---|---|
|![npm-demo.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/4088cc1e6a154965ba0a9dc5f9653f8e~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP5bqEenp6:q75.awebp?rk3s=f64ab15b&x-expires=1739786437&x-signature=VUWJ0pCu3UXHAjB4sibuvwMn8ig%3D)|![pnpm-demo.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/918cc39c4c98437bb6e837913458476d~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP5bqEenp6:q75.awebp?rk3s=f64ab15b&x-expires=1739786437&x-signature=CJyD7s9zsslHqWHZTUjLyBS6bWY%3D)|
|所有依赖包平铺在`node_modules`目录，包括直接依赖包以及其他次级依赖包|`node_modules`目录下只有`.pnpm`和直接依赖包，没有其他次级依赖包|
|没有符号链接（软链接）|直接依赖包的后面有符号链接（软链接）的标识|

### 软链接 和 硬链接 机制

硬链接：pnpm 通过使用全局的 `.pnpm-store` 来存储下载的包，使用硬链接来重用存储在全局存储中的包文件，这样不同项目中相同的包无需重复下载，节约磁盘空间。 ![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/359633a00f664b5c83966472b8d0af63~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP5bqEenp6:q75.awebp?rk3s=f64ab15b&x-expires=1739786437&x-signature=%2FU%2BvOBQQTKboIqBNIrHlESESzag%3D)

---

软链接：pnpm 将各类包的不同版本平铺在 `node_modules/.pnpm` 下，对于那些需要构建的包，它使用符号链接连接到存储在项目中的实际位置。这种方式使得包的安装非常快速，并且节约磁盘空间。

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/6da1e87b2bf34a4cb9593da98c2bcb05~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP5bqEenp6:q75.awebp?rk3s=f64ab15b&x-expires=1739786437&x-signature=2ITwxzD%2BzOBnVHutw9p1F7XWVXc%3D)

举个例子，项目中依赖了 A，这时候可以通过创建软链接，在 `node_modules` 根目录下创建 A 软链指向了 `node_modules/.pnpm/A/node_modules/A`。此时如果 A 依赖 B，pnpm 同样会把 B 放置在 `.pnpm` 中，A 同样可以通过 软链接依赖到 B，避免了嵌套过深的情况。

---

> **依赖处理方式：依赖包 ---(软链接)--- > .pnpm ----(硬链接) ---> 全局的 Store**

我们使用刚刚的`express`来举个🌰：

执行`pnpm install` :

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/aa30d7ce2d34446aa6e0ded443b91f6a~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP5bqEenp6:q75.awebp?rk3s=f64ab15b&x-expires=1739786437&x-signature=zHzCgOxg207beQQJVgU8NExSOas%3D)

1. 打开 node_modules 可以看到，确实不是扁平化的了，依赖了 `express`，那 node_modules 下就只有 `express`，没有**幽灵依赖**
2. 同时下面还有个 `.pnpm` 文件夹，展开 `.pnpm` 后可以看到，所有的依赖都在这里**铺平了**

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/ab1f954a88274cee905d39a2b1dc972d~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP5bqEenp6:q75.awebp?rk3s=f64ab15b&x-expires=1739786437&x-signature=NPxQBwqFsgAV7Bm2UYQaEe5bC1s%3D)

3. 所有的依赖都是从全局 `store` 硬连接到了 `node_modules/.pnpm` 下，然后包和包之间的依赖关系是通过软链接组织的
4. `.pnpm`是个一个虚拟`store`（Virtual store），里面的依赖包**硬链接**到真实`Store`（Content-addressable store）中，真实`Store`才是依赖包文件真正的存储位置
5. `package.json`中的依赖（比如express）通过**软链接**，指向`.pnpm`下对应的依赖包
6. 每次pnpm安装先检查`Store`，如果已经存在，直接通过**硬链接**的形式连接到`.pnpm`；如果不存在，则先**下载**，然后再**硬链接**

类似如下的🌰：

```
node_modules
└── A // symlink to .pnpm/A@1.0.0/node_modules/A
└── B // symlink to .pnpm/B@1.0.0/node_modules/B
└── .pnpm
    ├── A@1.0.0
    │   └── node_modules
    │       └── A -> <store>/A
    │           ├── index.js
    │           └── package.json
    └── B@1.0.0
        └── node_modules
            └── B -> <store>/B
                ├── index.js
                └── package.json
```

`node_modules` 中的 A 和 B 两个目录会软连接到 `.pnpm` 这个目录下的真实依赖中，而这些真实依赖则是通过 `hard link` 存储到全局的 `store` 目录中。

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/ab4efa560e394b27b9109b81615b8ee9~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP5bqEenp6:q75.awebp?rk3s=f64ab15b&x-expires=1739786437&x-signature=YGSq29xx4VhHaVdbAId7VydYk%2Fk%3D)

---

对于**store**，你应该记住：

> pnpm下载的依赖全部都存储到`store`中去了，`store`是pnpm在硬盘上的公共存储空间。
> 
> pnpm的`store`在Mac/linux中默认会设置到`{home dir}>/.pnpm-store/v3`；windows下会设置到当前盘符的根目录下。使用名为 .pnpm-store的文件夹名称。
> 
> 项目中所有`.pnpm/依赖名@版本号/node_modules/`下的软连接都会连接到pnpm的`store`中去。

## 幽灵依赖产生的根本原因

然而就算使用 pnpm，幽灵依赖还是难以根除，我们不妨分析一下幽灵依赖产生的根本原因。

### 包管理工具的依赖解析机制

这就是前面介绍的平铺式带来的问题，这边就不重复讲述了。

### 第三方库历史问题

由于历史原因或开发者的疏忽，有些项目可能没有正确地声明所有直接使用的依赖。对于三方依赖，幽灵依赖已经被当做了默认的一种功能来使用，提 issue 修复的话，周期很长，对此 pnpm 也没有任何办法，只能做出妥协。

下面是 pnpm 的处理方式：

- **对直接依赖严格管理**：对于项目的直接依赖，pnpm 保持严格的依赖隔离，确保项目只能访问到它在`package.json` 中声明的依赖。
    
- **对间接依赖妥协处理**：考虑到一些第三方库可能依赖于未直接声明的包（幽灵依赖），pnpm 默认启用了 `hoist` 配置。这个配置会将一些间接依赖提升（hoist）到一个特殊的目录 `node_modules/.pnpm/node_modules`中。这样做的目的是在保持依赖隔离的同时，允许某些特殊情况下的间接依赖被访问。
    

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/92b5d45e6aea4d3c8addad3e5b4dd5bd~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP5bqEenp6:q75.awebp?rk3s=f64ab15b&x-expires=1739786437&x-signature=LRyJwPWyFCZ0G5BqvgTRpugTG38%3D)

### JavaScript 模块解析策略

Node.js 的模块解析策略允许从当前文件夹的 `node_modules` 开始，向上遍历文件系统，直到找到所需模块。

这种解析策略，虽然提供了灵活性，也使得幽灵依赖更容易产生，因为它允许模块加载那些未直接声明在项目`package.json` 中的依赖。

综合来看，幽灵依赖在目前是无法根除的，只能通过一些额外的处理进行管控，比如 eslint 对幽灵依赖的检查规则、pnpm 的 `hoist` 配置等。

## pnpm 项目的依赖治理方案

对于依赖治理，大概涉及到以下几个部分：

- 冗余依赖治理：例如**遗留的未使用依赖**、**重复声明的依赖**、**过时的依赖版本**，导致 `package.json` 愈发混乱。
- 重叠依赖治理：例如 `monorepo` 项目中根目录和子项目的**重复依赖**，加大了 `package.json` 的管理成本，**同一依赖的多个版本并存**,依赖版本冲突。

### 冗余依赖治理

例如**遗留的未使用依赖**、**重复声明的依赖**、**过时的依赖版本**

对于冗余的情况，可以按照如下顺序检查：

1. 执行 `pnpm why <package-name>`，用来找出项目中一个特定的包被谁所依赖，给出包的依赖来源。
2. 全局搜索包名，检查是否有被引入。
3. 了解包的作用，判断项目中是否存在包的引用。
4. 删除包，执行 `pnpm i` 后，分别运行、打包项目，查看是否有明显问题。

按照顺序执行完毕后，仍然可能存在问题，这是没法完全避免的，可以进一步通过测试进行排查。

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/6d08db89dc264f40bff6e3c15dca6d48~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP5bqEenp6:q75.awebp?rk3s=f64ab15b&x-expires=1739786437&x-signature=aYmu9GLf20NIyvaQ%2FlvvBHuEW%2F0%3D)

### 重叠依赖治理

对于 monorepo 而言，依赖的管理就比较复杂了，这边可以通过人肉+脚本的方式进行治理。

为方便识别重叠依赖，可以编写一个脚本，遍历子项目中的 package.json 将与根目录重叠的依赖进行输出：

```
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk'; // 引入 chalk

// 获取当前文件的目录路径，确保脚本可以在不同环境下正确执行
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 修改后的读取 package.json 文件函数保持不变
function readPackageJson(filePath) {
  try {
    const jsonData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(jsonData);
  } catch (error) {
    console.error(`读取文件失败: ${filePath}`, error);
    return null;
  }
}

// 修改后的比较依赖函数保持不变
function compareDependencies(rootDeps, childDeps, depType, childName) {
  const overlaps = [];
  for (const [dep, version] of Object.entries(childDeps)) {
    if (rootDeps[dep]) {
      const versionCompare = (rootDeps[dep] === version)
      // 如果子项目中的依赖在根目录中也存在，则记录下来
      overlaps.push(`${dep}: ${chalk.blueBright(version)} (在根目录中为: ${chalk.blueBright(rootDeps[dep])}) ${versionCompare ? chalk.green('✔') : chalk.red('✘')}`);
    }
  }
  return {
    overlaps: overlaps.length > 0 ? `${chalk.greenBright('- 重叠的',depType)}\n` + overlaps.join('\n') + '\n\n' : '',
  };
}

function main() {
  const rootPackageJsonPath = path.join(__dirname, 'package.json');
  const rootPackageJson = readPackageJson(rootPackageJsonPath);
  if (!rootPackageJson) {
    console.error('无法读取根目录的 package.json 文件');
    return;
  }

  // 修改输出为终端输出，使用 chalk 增加颜色
  console.log(chalk.bold('📖 依赖分析报告\n'));

  const packagesDir = path.join(__dirname, 'packages');
  const childDirs = fs.readdirSync(packagesDir).filter(child => fs.statSync(path.join(packagesDir, child)).isDirectory());

  for (const child of childDirs) {
    const childPackageJsonPath = path.join(packagesDir, child, 'package.json');
    const childPackageJson = readPackageJson(childPackageJsonPath);
    if (childPackageJson) {
      console.log(chalk.bold(`🟢 子项目 ${child}`));
      ['dependencies', 'devDependencies', 'peerDependencies'].forEach(depType => {
        const { overlaps } = compareDependencies(
          rootPackageJson[depType] || {},
          childPackageJson[depType] || {},
          depType,
          child
        );
        console.log(overlaps);
      });
    }
  }
}

main();
```

核心流程就是先遍历所有子项目的 `package.json` ,然后通过`compareDependencies`方法检查子项目的依赖是否在根目录存在,然后对重叠的依赖进行版本一致性检查，最后对 分别处理不同类型的依赖（`dependencies` / `devDependencies` / `peerDependencies`）

执行效果如下：

```
📖 依赖分析报告

🟢 子项目 A
- 重叠的 dependencies
@babel/runtime-corejs3: ^7.14.0 (在根目录中为: ^7.14.0) ✔
……

- 重叠的 devDependencies
@commitlint/cli: ^13.1.0 (在根目录中为: ^13.1.0) ✔
@commitlint/config-conventional: ^13.1.0 (在根目录中为: ^13.1.0) ✔
……

🟢 子项目 B

- 重叠的 devDependencies
typescript: ^4.4.0 (在根目录中为: ^4.3.5) ✘
zx: ^4.2.0 (在根目录中为: ^4.2.0) ✔
chalk: ^4.1.0 (在根目录中为: ^4.1.0) ✔
```

通过这种方式我们就可以有目的性的去逐个检查依赖，依据一种合理的 `monorepo` 依赖管理模式进行处理，下面是一种合适的处理规则：

- 将共享的**开发时**依赖移至根目录的 `package.json`，如 jest、eslint、lint-stage。
- 对于需要特定版本以保证兼容性的依赖，考虑使用 `resolutions` 字段强制解析为特定版本。
- 为需要发包的工具、类库提供 `peerDependencies` 字段。
- 对于运行时依赖，如果所有子项目都有依赖，将删除子项目中的声明，提升至根目录，同时在需要发包的工具、类库的 `peerDependencies` 中声明相关的依赖。
- 发包时，通过调用脚本将目标子项目中的 `peerDependencies` 内容转移至 `dependicies` 中

## 最后

虽然 pnpm 的优势非常明显，但目前 pnpm 的生态还在成长阶段，一些功能还没法在网络上找到最佳实践，这需要一定的时间去沉淀，但经过权衡，拥抱 pnpm 无疑是一个非常好的选择！

最后，如果这篇文章对你有帮助，可以给作者点赞关注支持一波～

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/ba02561813dd45d8b1c080e43e24237d~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP5bqEenp6:q75.awebp?rk3s=f64ab15b&x-expires=1739786437&x-signature=V0lN4ZGeQM5XNOK4zwZ2LLCStAg%3D)

参考资料：

[pnpm.io/zh/blog/202…](https://link.juejin.cn/?target=https%3A%2F%2Fpnpm.io%2Fzh%2Fblog%2F2020%2F05%2F27%2Fflat-node-modules-is-not-the-only-way "https://pnpm.io/zh/blog/2020/05/27/flat-node-modules-is-not-the-only-way")

[juejin.cn/post/735826…](https://juejin.cn/post/7358267939441950720#heading-25 "https://juejin.cn/post/7358267939441950720#heading-25")

[juejin.cn/post/705334…](https://juejin.cn/post/7053340250210795557#heading-4 "https://juejin.cn/post/7053340250210795557#heading-4")