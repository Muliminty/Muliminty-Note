[快速掌握 Tailwind：最流行的原子化 CSS 框架Tailwind 是流行的原子化 css 框架。 有多流行呢？ - 掘金](https://juejin.cn/post/7231539903649398843?searchId=202504241148013AEC1EA407613548280A)

Tailwind 是流行的原子化 css 框架。

有多流行呢？

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/43cb29ccb69f462cbb7cfaec866d122c~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=900&h=292&s=100628&e=png&b=ffffff)

它现在有 68k star 了，要知道 express 才 60k：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3b34e4e5df2147f9a1b85f6d49804292~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=804&h=264&s=60978&e=png&b=ffffff)

那什么是原子化 css？

我们平时写 css 是这样的：

```
<div class="aaa"></div>
```

```
.aaa {
    font-size: 16px;
    border: 1px solid #000;
    padding: 4px;
}
```

在 html 里指定 class，然后在 css 里定义这个 class 的样式。

也就是 class 里包含多个样式：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aecedc8ad6344918b19bedfb5505a54a~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1096&h=638&s=127672&e=png&b=ffffff)

而原子化 css 是这样的写法：

```
<div class="text-base p-1 border border-black border-solid"></div>
```

```
.text-base {
    font-size: 16px;
}
.p-1 {
    padding: 4px;
}
.border {
    border-width: 1px;
}
.border-black {
    border-color: black;
}
.border-solid {
    border-style: solid;
}
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/25e18f4e6eb3470986c8735964f486da~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1696&h=648&s=206422&e=png&b=ffffff)

定义一些细粒度的 class，叫做原子 class，然后在 html 里直接引入这些原子化的 class。

这个原子化 css 的概念还是很好理解的，但它到底有啥好处呢? 它解决了什么问题？

口说无凭，我们试下 tailwind 就知道了，它就是一个提供了很多原子 class 的 css 框架。

我们通过 crerate-react-app 创建一个 react 项目：

```
npx create-react-app tailwind-test
```

然后进入 tailwind-test 目录，执行

```
npm install -D tailwindcss
npx tailwindcss init
```

安装 tailwindcss 依赖，创建 tailwindcss 配置文件。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f7930ae6846d438ebd7d83586fceaac4~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=802&h=420&s=96574&e=png&b=1e1e1e)

tailwind 实际上是一个 postcss 插件，因为 cra 内部已经做了 postcss 集成 tailwind 插件的配置，这一步就不用做了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc7f7d94bf4e419dabb2cf60446f78c0~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1648&h=976&s=480956&e=png&b=202020)

然后在入口 css 里加上这三行代码：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd6778fe2dc74822b3735b6c83b55777~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=526&h=256&s=54123&e=png&b=1e1e1e)

这三行分别是引入 tailwind 的基础样式、组件样式、工具样式的。

之后就可以在组件里用 tailwind 提供的 class 了：

```
import './App.css';

function App() {
  return (
    <div className='text-base p-1 border border-black border-solid'>guang</div>
  );
}

export default App;
```

我们执行 npm run start 把开发服务跑起来。

可以看到，它正确的加上了样式：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a8c82e20547b4b06a8c523f7e0edd04a~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=870&h=202&s=36844&e=png&b=ffffff)

用到的这些原子 class 就是 tailwind 提供的：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/05094ce1ae1d4adf9a57b5ab74e4bea0~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1356&h=522&s=287199&e=png&b=fefdfd)

这里的 p-1 是 padding:0.25rem，你也可以在配置文件里修改它的值：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/966b4d4f72aa41bcbd111f752d82f1a3~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=810&h=618&s=127847&e=png&b=1f1f1f)

在 tailwind.config.js 的 theme.extend 修改 p-1 的值，设置为 30px。

刷新页面，就可以看到 p-1 的样式变了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb389cb5661a4f84a040e9cb87dbbbce~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1210&h=578&s=218911&e=png&b=fdfdfd)

.text-base 是 font-size、line-height 两个样式，这种通过数组配置：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/055a97a29ade4afab612340ada86a4c6~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=792&h=736&s=162774&e=png&b=1f1f1f)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a7fa0353bb24d23a1c3d82c501d338e~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1180&h=468&s=229879&e=png&b=fcfbfb)

也就是说所有 tailwind 提供的所有内置原子 class 都可以配置。

但这些都是全局的更改，有的时候你想临时设置一些值，可以用 [] 语法。

比如 text-[14px]，它就会生成 font-size:14px 的样式：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/82af77d4f8da48dc8a4a742a762e4398~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1082&h=524&s=184209&e=png&b=fefefe)

比如 aspect-[4/3]，就是这样的样式：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/259366d7084241789e49a9a428131f28~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1056&h=458&s=218525&e=png&b=ecf2f9)

我们平时经常指定 hover 时的样式，在 tailwind 里怎么指定呢？

很简单，这样写：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a77e52e52d7a4545b3587668f018dec0~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1154&h=448&s=103528&e=png&b=1f1f1f)

生成的就是带状态的 class：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4f42c891999c44e3a4d2140fb440abca~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1080&h=314&s=149842&e=png&b=fcfcfc)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b3cfb7a2d5444cb39603b5f01e787012~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=860&h=336&s=43299&e=gif&f=15&b=fcfcfc)

此外，写响应式的页面的时候，我们要指定什么宽度的时候用什么样式，这个用 tailwind 怎么写呢？

也是一样的写法：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a865f8e38a9e4c92b5abcbea3a2651e9~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1110&h=490&s=106411&e=png&b=1f1f1f)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c9ce674e44414a3e85fcced80085f670~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1740&h=436&s=435221&e=gif&f=21&b=fcfcfc)

生成的是这样的代码：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a466932569514c0c840fe0035f99ff73~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1022&h=508&s=169828&e=png&b=fdfcfc)

这个断点位置自然也是可以配置的：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/805f82920d75400ba0a307dea0ace8cb~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=808&h=786&s=176390&e=png&b=1f1f1f)

可以看到 md 断点对应的宽度变了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eebd397537274b4693738c97383325d5~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1594&h=614&s=327342&e=png&b=ffffff)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ae904d37de049b880badfed8aacfcc9~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1628&h=732&s=760413&e=gif&f=17&b=fdfdfd)

光这些就很方便了。

之前要这么写：

```
<div class="aaa"></div>
```

```
.aaa {
    background: red;
    font-size: 16px;
}

.aaa:hover {
    font-size: 30px;
}

@media(min-width:768px) {
    .aaa {
        background: blue;
    }
}
```

现在只需要这样：

```
<div class="text-[14px] bg-red-500 hover:text-[30px] md:bg-blue-500"></div>
```

省去了很多样板代码，还省掉了 class 的命名。

并且这些 class 都可以通过配置来统一修改。

感受到原子化 css 的好处了么？

tailwind 文档提到了 3 个好处：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dbac4dde269c4b58bbcf52c7873447bf~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1648&h=668&s=434405&e=png&b=ffffff)

不用起 class 名字，这点简直太爽了，我就经常被起 class 名字折磨。

css 不会一直增长，因为如果你用之前的写法可能是这样的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a2304e0d40eb4889b92cd898fe78979c~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=396&h=310&s=51482&e=png&b=1e1e1e)

多个 class 里都包含了类似的样式，但你需要写多次，而如果用了原子 class，就只需要定义一次就好了。

css 没有模块作用域，所以可能你在这里加了一个样式，结果别的地方样式错乱了。

而用原子 class 就没这种问题，因为样式是只是作用在某个 html 标签的。

我觉得光这三点好处就能够说服我用它了，特别是不用起 class 名字这点。

当然，社区也有一些反对的声音，我们来看看他们是怎么说的：

**一堆 class，可读性、可维护性太差了**

真的么？

这种把 css 写在 html 里的方式应该是更高效才对。

想想为啥 vue 要创造个单文件组件的语法，把 js、css、template 放在一个文件里写，不就是为了紧凑么？

之前你要在 css、js 文件里反复跳来跳去的，查找某个 class 的样式是啥，现在不用这么跳了，直接在 html 里写原子样式，它不香么？

而且 tailwindcss 就前面提到的那么几个语法，没啥学习成本，很容易看懂才对。

**但是还要每次去查文档哪些 class 对应什么样式呀**

这个可以用 tailwind css 提供的 vscode 插件来解决：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a6a69fce59034989800b424d2bfda9a7~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1514&h=1028&s=816500&e=png&b=1f1f1f)

安装这个 Tailwind CSS IntelliSense 之后的体验是这样的：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8adcfd3c52bc4a0bb9c06392a1434910~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2122&h=1078&s=387358&e=gif&f=18&b=222021)

有智能提示，可以查看它对应的样式。

不需要记。

**难以调试**

在 chrome devtools 里可以直接看到有啥样式，而且样式之间基本没有交叉，很容易调试：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cf37f8087da4406b9d13e29cf8670f96~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1536&h=686&s=402296&e=png&b=fdfcfc)

相反，我倒是觉得之前那种写法容易多个 class 的样式相互覆盖，还要确定优先级和顺序，那个更难调试才对：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a57d24ddeda24c05b888dbe77b7e5bfe~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=840&h=692&s=255663&e=png&b=fefdfd)

**类型太长了而且重复多次**

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/11687714e4044a67ad4e67c84d33acef~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1558&h=884&s=428979&e=png&b=222c3d)

这种问题可以用 @layer @apply 指令来扩展：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/010f4acf2c7e48f09d62260a67905965~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1938&h=344&s=128611&e=png&b=1e1e1e)

前面讲过 @tailwind 是引入不同的样式的，而 @layer 就是在某一层样式做修改和扩充，里面可以用 @apply 应用其他样式。

效果是这样的：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2956afd271aa4c49912fc3e8d1a85a2b~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=906&h=416&s=88521&e=png&b=1f1f1f)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/50654d7d033143afba709d6944ab0392~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1818&h=518&s=393898&e=png&b=fdfcfc)

**内置 class 不能满足我的需求**

其实上面那个 @layer 和 @apply 就能扩展内置原子 class。

但如果你想跨项目复用，那可以开发个 tailwind 插件

```
const plugin = require('tailwindcss/plugin');

module.exports = plugin(function({ addUtilities }) {
    addUtilities({
        '.guang': {
            background: 'blue',
            color: 'yellow'
        },
        '.guangguang': {
            'font-size': '70px'
        }
    })
})
```

在 tailwind.config.js 里引入：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e87fda951404486ca635d4dce5cdf20f~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=904&h=860&s=196287&e=png&b=1e1e1e)

这样就可以用这个新加的原子 class 了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4bda8233be614380b21024c8b9481663~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1068&h=416&s=98230&e=png&b=1e1e1e)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/03ffad6493234519abc76b795db33a53~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1548&h=518&s=239704&e=png&b=fefefe)

插件的方式或者 @layer 的方式都可以扩展。

**tailwind 的 class 名和我已有的 class 冲突了咋办？**

比如我本来有个 border 的 class：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8849532b5b8d46c399fb8ce31f7a750c~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=422&h=154&s=12781&e=png&b=1e1e1e)

而 tailwind 也有，不就冲突了么？

这个可以通过加 prefix 解决：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/391a3bb491324a31a3fad76abcc560e4~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=828&h=512&s=70737&e=png&b=1f1f1f)

不过这样所有的原子 class 都得加 prefix 了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/468ff84a39fd477980b1a46c1ae9ff0e~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1208&h=388&s=56853&e=png&b=1e1e1e)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7a0a1ce212ce4a169fd50056a3ac326a~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1296&h=454&s=148512&e=png&b=fefdfd)

知道了什么是原子 css 以及 tailwind 的用法之后，我们再来看看它的实现原理。

tailwind 可以单独跑，也可以作为 postcss 插件来跑。这是因为如果单独跑的话，它也会跑起 postcss，然后应用 tailwind 的插件：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5f5e082f60564af69b942d45e8ca605d~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1268&h=1340&s=457561&e=png&b=1f1f1f)

所以说，**tailwind 本质上就是个 postcss 插件**。

postcss 是一个 css 编译器，它是 parse、transform、generate 的流程。

在 astexplorer.net 可以看到 postcss 的 AST：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0984ec9ef913416daa9efe3781201fe8~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1970&h=1066&s=255874&e=png&b=f6f5f5)

而 postcss 就是通过 AST 来拿到 @tailwind、@layer、@apply 这些它扩展的指令，分别作相应的处理，也就是对 AST 的增删改查。

那它是怎么扫描到 js、html 中的 className 的呢？

这是因为它有个 extractor 的东西，用来通过正则匹配文本中的 class，之后添加到 AST 中，最终生成代码。

extractor 的功能看下测试用例就明白了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bfb065c57ed34f0e99899eb87275fafa~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1114&h=714&s=284649&e=png&b=1f1f1f)

所以说，**tailwind 就是基于 postcss 的 AST 实现的 css 代码生成工具，并且做了通过 extractor 提取 js、html 中 class 的功能。**

tailwind 还有种叫 JIT 的编译方式，这个原理也容易理解，本来是全部引入原子 css 然后过滤掉没有用到的，而 JIT 的话就是根据提取到的 class 来动态引入原子 css，更高效一点。

最后，为啥这个 css 框架叫 tailwind 呢？

因为作者喜欢叫做 kiteboarding 风筝冲浪的运动。

就是这样的，一个风筝，一个冲浪板：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b17c133b1b1d48b59bc3029886dbe944~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=438&h=410&s=224190&e=png&b=aac4d7)

这种运动在顺风 tailwind 和逆风 headwind 下有不同的技巧。而 tailwind 的时候明显更加省力。

所以就给这个 css 框架起名叫 tailwind 了。

确实，我也觉得用这种方式来写 css 更加省力、高效，不用写 class 名字了，代码更简洁了，还不容易样式冲突了。

## 总结

tailwind 是一个流行的原子化 css 框架。

传统 css 写法是定义 class，然后在 class 内部写样式，而原子化 css 是预定义一些细粒度 class，通过组合 class 的方式完成样式编写。

tailwind 用起来很简单：

所有预定义的 class 都可以通过配置文件修改值，也可以通过 aaa-[14px] 的方式定义任意值的 class。

所有 class 都可以通过 hover:xxx、md:xxx 的方式来添加某个状态下的样式，响应式的样式，相比传统的写法简洁太多了。

它的优点有很多，我个人最喜欢的就是不用起 class 的名字了，而且避免了同样的样式在多个 class 里定义多次导致代码重复，并且局部作用于某个标签，避免了全局污染。

它可以通过 @layer、@apply 或者插件的方式扩展原子 class，支持 prefix 来避免 class 名字冲突。

tailwind 本质上就是一个 postcss 插件，通过 AST 来分析 css 代码，对 css 做增删改，并且可以通过 extractor 提取 js、html 中的 class，之后基于这些来生成最终的 css 代码。

是否感受到了 tailwind 的简洁高效，易于扩展？就是这些原因让它成为了最流行的原子化 css 框架。

> 更多内容可以看我的小册 [《React 通关秘籍》](https://juejin.cn/book/7294082310658326565 "https://juejin.cn/book/7294082310658326565")