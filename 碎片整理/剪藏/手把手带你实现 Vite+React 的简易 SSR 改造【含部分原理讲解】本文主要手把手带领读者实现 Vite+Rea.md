[手把手带你实现 Vite+React 的简易 SSR 改造【含部分原理讲解】本文主要手把手带领读者实现 Vite+Rea - 掘金](https://juejin.cn/post/7481124518151290915)

![](https://lf-web-assets.juejin.cn/obj/juejin-web/xitu_juejin_web/img/banner.a5c9f88.jpg)

## 1、前言

最近工作中接触到了`SSR`（服务端渲染），想必大家肯定对这个技术名词肯定不陌生。`SSR`也不是什么新兴技术，远古时代的`JSP`便是一种天然的服务端渲染。但随着`AJAX`技术的成熟以及各种前端框架(如`Vue`、`React`)的兴起，前后端分离的开发模式逐渐成为常态，前端只负责页面`UI`及逻辑的开发，而服务端只负责提供数据接口，这种开发方式下的页面渲染也叫客户端渲染(`Client Side Render`，简称`CSR`)。现代前端工具也提供了诸多`SSR`方案，如`React`的`Next`、`Vue`的`Nuxt`以及`Vite`或`Webpack`的`SSR`模式。

字面意思上就有看出，这两种渲染方式的差别就在于页面渲染的时机：

- 服务端渲染是页面在服务端的时候就渲染完成了；
- 而客户端渲染是页面在客户端（浏览器或者`WebView`之类的）进行渲染。

其它关于这两种渲染方式的介绍以及优缺点不再此处赘述，可以自行搜索或者询问伟大的AI或者阅读这篇博客【[一文搞懂：什么是SSR、SSG、CSR？前端渲染技术全解析](https://link.juejin.cn/?target=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000044882791 "https://segmentfault.com/a/1190000044882791")】。

下面手把手带你实现 Vite+React 的 SSR 服务端渲染，代码已上传至仓库【[react-ssr-demo](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FXC0703%2Freact-ssr-demo "https://github.com/XC0703/react-ssr-demo")】，SSR改造前的代码（即按照我的这篇博客【[我的 Vite + React + TS 前端工程化配置实践](https://juejin.cn/post/7308536984029102106 "https://juejin.cn/post/7308536984029102106")】设置的一个工程模板）在分支【[CSR_VERSION](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FXC0703%2Freact-ssr-demo%2Ftree%2FCSR_VERSION "https://github.com/XC0703/react-ssr-demo/tree/CSR_VERSION")】。

## 2、SSR改造实现

读者可以拿我上面提到的SSR改造前的代码【[CSR_VERSION](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FXC0703%2Freact-ssr-demo%2Ftree%2FCSR_VERSION "https://github.com/XC0703/react-ssr-demo/tree/CSR_VERSION")】跟着一起进行改造，改造的方法来源于[官方文档](https://link.juejin.cn/?target=https%3A%2F%2Fcn.vitejs.dev%2Fguide%2Fssr "https://cn.vitejs.dev/guide/ssr")。

### 2-1 CSR的逻辑

将`SSR`改造前的代码【[CSR_VERSION](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FXC0703%2Freact-ssr-demo%2Ftree%2FCSR_VERSION "https://github.com/XC0703/react-ssr-demo/tree/CSR_VERSION")】运行起来可以看到`CSR`下服务端确实只会返回空html页面： ![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/2d9147dbbdbb4f419c4bbbe42be3b613~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5piO6L-c5rmW5LmL6bG8:q75.awebp?rk3s=f64ab15b&x-expires=1742531220&x-signature=VyCXPqtbSyVu2wVSclabCm7S5Yg%3D) 然后在客户端重新加载`JS`脚本并执行之后才看到完整的页面，这部分耗时是`SSR`相比于`CSR`优化的部分: ![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/3608a09b800243719b8afbb26988ba74~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5piO6L-c5rmW5LmL6bG8:q75.awebp?rk3s=f64ab15b&x-expires=1742531220&x-signature=peeKEAODEHfRL%2FZVPiwcgHdELjQ%3D)

### 2-2 SSR改造的一些逻辑讲解

改造作出的代码变更可看这次提交：【[feat: SSR代码上传](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FXC0703%2Freact-ssr-demo%2Fcommit%2F1a8e27f0899c53c6100869f1cffed1575b54d90c%23diff-1cd8b18798a1a103bfe13bef54354c1f3a3bea29a31c8eea1a0c67a3a839b811 "https://github.com/XC0703/react-ssr-demo/commit/1a8e27f0899c53c6100869f1cffed1575b54d90c#diff-1cd8b18798a1a103bfe13bef54354c1f3a3bea29a31c8eea1a0c67a3a839b811")】，主要增加或修改了下面这五个文件：  
![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/93d50c5d76df449b9361c23fc1cb3229~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5piO6L-c5rmW5LmL6bG8:q75.awebp?rk3s=f64ab15b&x-expires=1742531220&x-signature=xMMlTBr2JiG1l0EYRJDjL%2B0Jx5w%3D)

核心做了以下工作：

- 修改`package.json`，增加运行服务端渲染脚本`server.js`的命令。
- 增加`server.js`，服务端渲染的核心逻辑：1、监听端口；2、区分生产环境还是开发环境，读取对应环境下的文件并执行；3、将执行结果和空`index.html`进行文档拼接（即服务端渲染）；4、将拼接后的`html`文件返回。
- 修改`index.html`文件，增加`<!--app-head-->`与`<!--app-html-->`插槽方便文档拼接，同时将加载`main.tsx`文件改为加载`entry-client.tsx`文件用于文档水合。
- 增加`entry-server.tsx`文件，用于服务端渲染，核心是预取数据后利用`renderToString API`将组件渲染为字符串，组件的具体内容便就此生成了。
- 增加`entry-client.tsx`文件，用于水合使得页面具有交互能力，核心是利用`hydrateRoot API`使得页面根据已有的预取数据重新执行`CSR`的`JavaScript`代码来进行页面注水。

可以看到，服务端渲染时请求返回的文档是一个只有样式和节点的文档，俗称“脱水页面”，没有JS逻辑导致页面没有交互能力： ![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/3c5e99edd6e4414dab132e9306d79710~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5piO6L-c5rmW5LmL6bG8:q75.awebp?rk3s=f64ab15b&x-expires=1742531220&x-signature=AyaiHGuQwPQi1Yx2qXmAxpuhZ2I%3D)

> 客户端`JS`加载完成后，会运行`react`，并且执行同构方法`ReactDOM.hydrate`，而不是平时用的 `ReactDOM.render`。

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/6bd69e0f633a4039aa4d769f187aca5e~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5piO6L-c5rmW5LmL6bG8:q75.awebp?rk3s=f64ab15b&x-expires=1742531220&x-signature=yc8loXEgGouGyyFrJBgRW%2FynWCM%3D)

> `react-dom`提供的`hydrate`方法类似`render`方法，用于二次渲染。
> 
> 它在渲染的时候会复用原本已经存在的`DOM`节点，减少重新生成节点以及删除原本`DOM`节点的开销，只进行事件处理绑定。
> 
> `hydrate`和`render`的区别就是`hydrate`会复用已有节点，`render`会重新渲染全部节点。
> 
> 所以`hydrate`主要用于二次渲染服务端渲染的节点，提高首次加载体验。
> 
> - 水合`hydrateRoot API`官方文档：[react.docschina.org/reference/r…](https://link.juejin.cn/?target=https%3A%2F%2Freact.docschina.org%2Freference%2Freact-dom%2Fclient%2FhydrateRoot "https://react.docschina.org/reference/react-dom/client/hydrateRoot")
> - 水合源码讲解博客（值得阅读，很详细！！！）：[blog.csdn.net/Tyro_java/a…](https://link.juejin.cn/?target=https%3A%2F%2Fblog.csdn.net%2FTyro_java%2Farticle%2Fdetails%2F135964174 "https://blog.csdn.net/Tyro_java/article/details/135964174")

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/fd30f1967de2492aa8b88d76a7c3ca30~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5piO6L-c5rmW5LmL6bG8:q75.awebp?rk3s=f64ab15b&x-expires=1742531220&x-signature=gunAU8PdM2%2FeZVlpH467mQ1ZF54%3D)

注水完成之后的页面才是可交互的。

### 2-3 从开发环境与生产环境的不同表现谈到Vite中CSS模块化的处理

#### 2-3-1 表现

改造后的工程运行开发环境（默认）下的效果执行以下命令即可：

```
pnpm install
pnpm start
```

若想运行生产环境的效果，则手动将环境判断取反后再执行以下命令即可： ![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/0dc74c58157744da8a66d52134b0778e~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5piO6L-c5rmW5LmL6bG8:q75.awebp?rk3s=f64ab15b&x-expires=1742531220&x-signature=fAapnI8smP3J5HfeURV0i9xw4w8%3D)

```
pnpm run build
pnpm start
```

笔者刚开始改造时在开发环境下运行发现页面会闪一下，而生产环境下的就不会： ![mp4.gif](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/8c576f38d98e492ab7d4b4c8533750d8~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5piO6L-c5rmW5LmL6bG8:q75.awebp?rk3s=f64ab15b&x-expires=1742531220&x-signature=mIYJFj9gZ8BKWT4mj5PLPq%2BgPzo%3D)

然后经过问题定位发现开发环境下服务端渲染返回的文档根本没有样式文件的加载！！！只有水合之后才进行样式文件的加载： ![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/46ed04f354d248e1ac720836a91bce6d~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5piO6L-c5rmW5LmL6bG8:q75.awebp?rk3s=f64ab15b&x-expires=1742531220&x-signature=KAW2dSKfIXcRXwnxZgflk5YJzD0%3D)

而生产环境中运行是立即引入了样式了： ![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/4162f2db15024e618eba98f1c8c5c352~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5piO6L-c5rmW5LmL6bG8:q75.awebp?rk3s=f64ab15b&x-expires=1742531220&x-signature=B5YTcKAAye%2FhYgHZCpGuNG3qd7I%3D)

#### 2-3-2 原因

**这是为什么呢？？？答案就在下面！！！继续往下看吧。**

`Vite`内置了对`CSS`的支持，并提供了高效的加载、模块化和热更新机制。处理`CSS`文件的过程：

- **读取`CSS`文件**：  
    当`Vite`在`JavaScript`模块中检测到对`CSS`文件的导入（例如`import './index.css'`），它会使用`Node.js`的`fs`模块读取该`CSS`文件的内容。
- **处理`CSS`内容**：`Vite`在处理`CSS`时，根据开发环境和生产环境采取不同的策略：

#### 2-3-3 解决

我的解决方式是手动增加开发环境下的样式文件处理，下面是我的`entry-server.tsx`文件

```
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';

import Home from '@/pages/home';

// 从 /src/**/*.less 中导入所有的 CSS 资源，并生成 <link> 标签
// 因为vite开发环境中样式的实现是通过创建一个 <style> 标签，将 CSS 内容插入到该 <style> 标签中， 然后再将 <style> 标签动态插入到 HTML 的 <head> 中。（即通过执行 JS 代码实现）
// 因此在服务端渲染时，需要手动将 CSS 链接插入到 HTML 的 <head> 中，使得开发环境中的样式生效
const cssAssets = import.meta.glob('/src/**/*.less', { eager: true, as: 'url' });
const cssLinks = Object.values(cssAssets)
	.map(url => `<link rel="stylesheet" href="${url}">`)
	.join('');

// 将 Home 组件渲染为 HTML 字符串
export function render() {
	const html = renderToString(
		<StrictMode>
			<Home />
		</StrictMode>
	);
	return {
		html, // 将 HTML 字符串插入到模板的 <!--app-html-->
		head: cssLinks // 将 CSS 链接插入到模板的 <!--app-head-->，使得开发环境中的样式生效
	};
}
```

可以看到，我增加了手动读取样式文件之后，此时在水合之后便已有样式文件，页面不再闪烁： ![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/f136341b58ac40c98b4275d8718e6421~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5piO6L-c5rmW5LmL6bG8:q75.awebp?rk3s=f64ab15b&x-expires=1742531220&x-signature=%2FhZzLcA%2FJMMJY3V%2B4cBRyUHhtM8%3D)

**注意，如果采用`CSS-in-JS`这种比较特殊的样式方案，则上面这种处理可能无效，下面是我问伟大的`DeepSeek`这种样式方案下的处理方法，但不知道有没有用，待读者去验证探索了：**

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/fad4a7aecf9d4b7e9531c79065f4bb9a~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5piO6L-c5rmW5LmL6bG8:q75.awebp?rk3s=f64ab15b&x-expires=1742531220&x-signature=JAHwLntoiYaEYuMtEfaQ98pn998%3D)

## 3、实际生产中SSR需要注意的点

上面我的`SSR`改造工程只是一个很简单的原理讲解`Demo`，实际生产中需要注意以下诸多问题：

- **`CSR`降级**。在某些比较极端的情况下，我们需要降级到 CSR，也就是客户端渲染。一般而言包括如下的降级场景：1、服务器端预取数据失败，需要降级到客户端获取数据；2、服务器出现异常，需要返回兜底的`CSR`模板，完全降级为`CSR`。3、本地开发调试，有时需要跳过`SSR`，仅进行`CSR`。笔者在日常生产中，手动或者被动降级后的处理都是在`useEffect`中（回到客户端了）判断有无数据，没有便需要手动再重新请求一次。`SSR`开关控制入口推荐在页面拼上类似`SSR=true`的参数实现。具体的降级处理待读者去探索，此处不再展开赘述。
- **`<ClientOnly>`功能**。类似于`Nuxt.js`的`client-only`组件用于仅在客户端渲染的组件。这对于那些依赖于浏览器 API 或仅在客户端环境中可用的功能（如`Window`或`Document`对象）的组件非常有用。
    - 注意服务端渲染时不能调用客户端才能用的API。笔者日常工作中接触到的前端页面基本都是`H5`页面，这种情况比较多，比如`某个组件需要根据设备类型渲染不同的样式`、`拿到视窗尺寸才进行不同的渲染`等。
    - 部分不在首屏的组件没必要走`SSR`渲染，比如一些弹窗组件、浮层半浮层组件、抽屉组件等，因为这部分组件可能是相对于当前`document.body`进行定位，即使服务端渲染模拟了`Document`对象，也不能挂载`DOM`。
    - 如果有业务逻辑非常依赖一些本来在客户端才能调用的API返回的结果（原本`CSR`下的的`JSBridge`暴露的能力），比如位置信息等，如果没有可能导致服务端渲染和客户端渲染不一致，产生服务端渲染前的预取数据的接口不通或者页面水合不一致闪烁问题。此时可能需要在服务端渲染环境再手动模拟实现一次（思路是页面在路由解析前就在客户端就调用相关能力，将请求结果带到`node`环境，然后在`node`环境模拟调用时返回已有的结果)。
    - 在进行同构渲染的时候，请务必保证客户端渲染出来的内容和服务端渲染的内容完全相同。如果客户端和服务端渲染出来的内容不一致，`React`会尝试对不一致的地方进行修复，而这些修复是非常耗时的。如果差异过大甚至会重新渲染整个应用（类似于`ReactDOM.render`）。
- **流式SSR+FCC优化**。
    - 流式`SSR`（`Streaming Server-Side Rendering`）是一种将服务端渲染和流式传输结合起来的技术。与传统的`SSR`不同，流式`SSR`可以在服务端渲染的同时，逐步将渲染结果传输到客户端，实现页面的渐进式展示。在流式`SSR`中，服务端会根据客户端的请求，逐步生成页面内容，并将它们作为流式数据流式传输到客户端。客户端可以在接收到一部分数据后，就开始逐步显示页面，而不需要等待整个页面渲染完成。这种方式可以有效提高页面的加载速度和用户体验。
    - `FCC`指的是（`first chunk cache`），一般用于移动端`H5`页面的流式`SSR`方案。`FCC`需要`Native`客户端配合，将首`chunk`缓存到本地，二开时享受极致的`FCP`（首`chunk`也可能是骨架屏，此时是避免二开时启动`Webview`容器时的白屏），用户体验较好。`FCC`比较适用于动态请求比较少的流式`SSR`，会有分段上屏的效果。
    - 当然对于移动端`H5`页面的首屏性能优化，`Webview`容器相关的优化也是很重要的一点了，比如`Webview`容器预热复用甚至借助`Webview`容器进行`snapshot`快照优化（`snapshot`比较适用于动态请求较多，性能较好的机器，先有一个`snapshot`占位，后渲染真实内容），当然这是另外的技术话题了，此处不再展开赘述。
    - ![226bbf1e40affd1e3742d54de91ae5b.jpg](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/4c5b1c3e47f042bcaeba56da84840730~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5piO6L-c5rmW5LmL6bG8:q75.awebp?rk3s=f64ab15b&x-expires=1742531220&x-signature=cKzeaxfCEKthaph9Ie6Ccq8NB%2Fc%3D)
- **`SSR`调试工具链的完善**。有一说一，笔者在日常工作中的`SSR`实践中发现`SSR`调试起来确实稍微困难一点，相关工具链的完善确实很重要，比如`SSR`下的抓包、性能监控、降级情况获取、流式`SSR`的各个`chunk`到达时间获取等工具。

本文收录于以下专栏

![cover](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3abdb2b2d06148f7b5b8298455a4047c~tplv-k3u1fbpfcp-jj:160:120:0:0:q75.avis)

本专栏旨在为初学和有一定前端基础的开发者提供有价值的前端学习内容。在本专栏中，将为您带来有关JavaScript、CSS、HTML以及各种前端框架和库的文章，通过这些文章，您可以不断提升自己的技能并开发出更加优秀的Web应用程序。