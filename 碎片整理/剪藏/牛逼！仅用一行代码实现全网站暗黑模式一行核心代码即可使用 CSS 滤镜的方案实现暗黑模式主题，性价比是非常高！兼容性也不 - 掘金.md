[牛逼！仅用一行代码实现全网站暗黑模式一行核心代码即可使用 CSS 滤镜的方案实现暗黑模式主题，性价比是非常高！兼容性也不 - 掘金](https://juejin.cn/post/7490602578011570202)

推荐文章：

[2024 年了！ CSS 终于加入了 light-dark 函数！](https://juejin.cn/post/7443828372775764006 "https://juejin.cn/post/7443828372775764006")

[我受够了 HBuilder X 开发 uni-app 项目](https://juejin.cn/post/7441800634569687079 "https://juejin.cn/post/7441800634569687079")

[经历了PMP和软考高项，我独立开发了一款软考刷题小程序](https://juejin.cn/post/7357141293111525416 "https://juejin.cn/post/7357141293111525416")

## 一. 暗黑模式

什么是网站的暗黑模式（`Dark Mode`）？相信大家应该都了解，其实它可以看作是一种用户色彩设计风格，主要采用**深色背景**和**浅色文字**，与传统的**亮色背景**和**深色文字**的设计形成对比，比如像下面这样。

掘金网站的暗黑模式效果：

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/31d4db993613443e887ab03e9d38c5c1~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5qKm5bel5Y6C:q75.awebp?rk3s=f64ab15b&x-expires=1744886053&x-signature=lZcxGd%2FFD%2BBFMwwe%2F3pHFrNkFxQ%3D)

它的主要目的是为了**提高用户的视觉舒适度**，**减少眼睛疲劳**，同时也能在夜间**提供更好的阅读体验**。所以暗黑模式能有以下几个潜在的好处：

1. **减少眼睛疲劳**：在低光环境下使用暗黑模式可以减轻眼睛的压力和疲劳感。
    
2. **改善阅读体验**：对于某些用户来说，在暗色背景下阅读可以提供更好的可视性，使我们浏览网页时更加舒适。
    
3. **节省电量**：暗黑模式可以通过关闭黑色像素来实际减少屏幕耗电，这对于移动设备尤其重要。
    

许多的应用开发框架以及网站都提供了切换到暗黑模式的功能选项，比如我通过使用 `VitePress` 建立的网站，自带暗黑模式功能的切换：

![juejin1.gif](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/683fe9ca368b4f79b9cc6faaa70ae16f~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5qKm5bel5Y6C:q75.awebp?rk3s=f64ab15b&x-expires=1744886053&x-signature=TGgQO0LC6%2FB%2FmxNoYN7aXddZshk%3D)

> gif图录制原因，可能不太清晰，可访问：[www.anyup.cn/site/index.…](https://link.juejin.cn/?target=https%3A%2F%2Fwww.anyup.cn%2Fsite%2Findex.html "https://www.anyup.cn/site/index.html")

所以，它类似于主题切换的功能，它又不同于主题切换那么复杂。它的实现原理其实也很简单，用一句话描述就是：通过不同的状态（`light` 和 `dark`）使用不同的样式，从而达到不同的展示效果。

关于如何实现暗黑模式？我们**传统的实现方案**或许是：

- **使用 CSS 变量**
- **媒体查询**
- **监听系统主题变化事件**

通过结合上述方法来动态调整页面样式，来实现暗黑模式。

比如下面的代码：

```
/* 默认的亮色模式样式：light */
:root {
  --background-color: #ffffff;
  --text-color: #000000;
  --border-color: #d3d3d3;
}

body {
  background-color: var(--background-color);
  color: var(--text-color);
  border-color: var(--border-color);
}

/* 暗黑模式的样式：dark */
@media (prefers-color-scheme: dark) {
  :root {
    --background-color: #121212;
    --text-color: #e0e0e0;
    --border-color: #3a3a3a;
  }
}
```

以上这样的代码实现，可能需要我们有两套模式：`light`（明亮） 和 `dark`（暗黑），在明亮模式下声明一套样式，在暗黑模式下再声明一套样式。这样可以实现暗黑模式切换的功能，但它的缺点也很明显：

- **维护成本高**：对于大型项目来说，确保所有元素的颜色、背景等都支持暗黑模式适配可能会变得复杂。
    
- **增加代码量**：需要创建并维护两套样式表，一套用于亮色主题，另一套用于暗色主题，增加了代码量和复杂性。
    

以上这种方式能够实现网站暗黑模式，但是我们今天这篇文章，不会使用这样的方式，因为这样实现太繁琐，且维护成本太高，可能每个页面都需要按照暗黑模式来定制一些样式。

因此我们今天将介绍如何使用**一行代码实现全网站暗黑模式**！体验一下 **CSS 滤镜的魔力**！

## 二. 实现方案

首先，先来看实现效果，以给掘金网站加入暗黑模式为例，**暗黑版掘金网站效果如下**：

![juejin3.gif](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/cd5b6ff27faa4520906f53c5346f8eea~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5qKm5bel5Y6C:q75.awebp?rk3s=f64ab15b&x-expires=1744886053&x-signature=jVkF0IiloUYHTN8eghAj4mRdcpE%3D)

应粉丝要求，又加入了 **element-plus** 同款主题切换效果！

![juejin-dark.gif](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/840a48ebcebf4e84a64ace9c06a52127~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5qKm5bel5Y6C:q75.awebp?rk3s=f64ab15b&x-expires=1744886053&x-signature=R1WAoJE9OULErsoFQUNAk1eqvSE%3D)

**码上掘金代码片段演示示例**，点击左侧 `切换主题` 进行切换，亲身操作试一下：

> 说明：以下的掘金网页为iframe嵌入，只能全局使用CSS滤镜效果，更多细致的样式优化无法实现，可能存在背景图片视频显示效果不完美，不影响真实情况开发效果。仅做效果演示使用！

啧啧！乍一看，感觉还不错。难以想象是使用一行核心代码实现的网站暗黑模式，整体来说，效果还算可以了，最起码我是特别满足的！

### 划重点了

**上面的暗黑效果，主要是使用以下核心代码来实现**：

```
html {
  filter: invert(1) hue-rotate(180deg);
}
```

好神奇，解释一下以上这行代码是什么含义：

**CSS 滤镜** `filter` 属性允许你对元素应用图形效果，如模糊或颜色偏移。而 `filter: invert(1) hue-rotate(180deg)` 是一组特定的滤镜组合，用来改变选定元素的颜色表现。

下面详细解释一下它代表的含义：

1. **invert(1)**:
    
    - `invert()` 函数用于反转输入图像中的颜色。参数定义了转换的程度。如果参数是 1（或者 100%），则会完全反转颜色，即每个颜色通道的值都会被替换为其补色。例如：黑色变成白色，白色变为黑色等。
        
    - 当使用 `invert(1)` 时，则表示将图像的颜色彻底反转，即是：黑色变成白色，白色变为黑色。
        
2. **hue-rotate(180deg)**:
    
    - `hue-rotate()` 函数按照给定的角度旋转色彩轮上的颜色，其实就是冲淡颜色。这里的“角度”是指在标准色轮上转动多少度。色轮是一个圆形图表，显示了不同颜色如何根据它们的色调相互关联。
        
    - 当使用 `hue-rotate(180deg)` 时，意味着所有颜色都会在其原始位置基础上沿着色轮顺时针方向移动 180 度。比如红色会变成青色、绿色变成洋红色、蓝色变成黄色等，因为这些是在色轮上相对的颜色。
        

结合起来看，首先通过 `invert(1)` 将图像的所有颜色都进行了反转处理，然后通过 `hue-rotate(180deg)` 再进行一次颜色的大幅度调整，这种组合可以产生非常独特的视觉效果。

所以，对于希望快速实现网站的暗黑模式，使用 CSS 的 `filter` 属性可以是一个非常简便的方法。通过 `invert(1)` 将颜色反转，再用 `hue-rotate(180deg)` 调整色相，可以达到一个基本的暗黑效果。

这种方法的优点是简单快捷，**但它也有缺点**，因为它可能无法很好地处理图像和其他颜色复杂的内容。

比如：对于图片，如果直接使用 `filter: invert(1) hue-rotate(180deg)`，它的颜色会变得非常奇怪，比如下面这张图，对我的掘金个人主页进行使用，图片变成了如下的效果：

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/f27547bfe2bb412eb2183b4f53d27339~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5qKm5bel5Y6C:q75.awebp?rk3s=f64ab15b&x-expires=1744886053&x-signature=vQPOJRI%2BRfxfqRqbOlEBIvjR8Pk%3D)

### 还能优化

其实不止图片，像一些媒体类型的元素，例如**背景、图片、视频**等，都是不能直接处理的，简单一些就是保持其原样就可以了。那么问题来了，由于我们是全局使用的滤镜效果，那么我们如何让图片保持原样呢？

因为 `filter` 是使用滤镜的反相和色相旋转实现，那么对这些媒体元素再次使用滤镜的反相和色相旋转就可以复原了。

因此我们对这些元素再次使用 `filter: invert(1) hue-rotate(180deg)` 来进行复原：

```
html {
  filter: invert(1) hue-rotate(180deg);
} 

/*图片、视频等元素不需要处理*/
img, 
video,
.logo,
.icon /*可继续添加可以不用处理的元素*/ {
  filter: invert(1) hue-rotate(180deg);
}
```

优化后我们再次看一下暗黑模式下图片，同样的图片它的效果如下：

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/d82b91ac44b84b42be47a871da8217c2~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5qKm5bel5Y6C:q75.awebp?rk3s=f64ab15b&x-expires=1744886053&x-signature=UCNX%2FmuPHLRTfy8CkJh%2F%2B35onHE%3D)

从以上的效果图中可以看到图片效果已经好多了！

因此，我们总结一下方案：使用 `filter` 滤镜进行全局使用，对一些**图片、视频、背景类**等不需要使用滤镜的元素的进行复原。

总结下来代码如下：

```
/*对设置data-theme='dark'下的所有元素进行反转*/
[data-theme='dark'] {
  filter: invert(1) hue-rotate(180deg);
  /*对不需要反转的元素进行复原，可按照自己需求追加*/
  img,
  video,
  .avatar,
  .image,
  .thumb
  .icon {
    filter: none;
  }
}
```

**怎么样？是不是很简单！**

我们再来看一下 `filter` 的兼容性，除了 IE 外，主流浏览器在较低版本下都是支持了，所以我们可以放心的使用它，兼容性如下图所示：

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/afd2202b2e9742ee96e871db2611fe44~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5qKm5bel5Y6C:q75.awebp?rk3s=f64ab15b&x-expires=1744886053&x-signature=JTc33DejuqoCqiK24EjUdxDcA3o%3D)

## 三. 其他方案

除了以上介绍的实现方式，我们也可以使用另一个方案：`light-dark()`

详细了解：[2024 年了！ CSS 终于加入了 light-dark 函数！](https://juejin.cn/post/7443828372775764006 "https://juejin.cn/post/7443828372775764006")

它在 MDN 文档上的简介如下：

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/91d430c909cf499a9013b23d33d1b55c~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5qKm5bel5Y6C:q75.awebp?rk3s=f64ab15b&x-expires=1744886053&x-signature=lw%2BNuXGPaGw%2BHmoY%2F8SeceYtJ7A%3D)

`light-dark()` 是在 2024 年 5 月新加入的一种新的 CSS 属性值函数，主要用于在**浅色模式**和**深色模式**下分别指定不同的样式值。

它的语法也很简单，只需要传两个值：`light-dark(light-color, dark-color)`

例如，我们要分别设置在**浅色模式**和**深色模式**下不同的背景颜色和字体颜色：

- 在浅色模式下，背景色为白色（`#ffffff`），字体为黑色（`#333333`）
    
- 在深色模式下，背景色为深灰色（`#1e1e1e`），字体为白色（`#f0f0f0`）
    

如下代码设置：

```
:root {
  color-scheme: light dark;
}
body {
  color: light-dark(#333333, #f0f0f0);
  background-color: light-dark(#ffffff, #1e1e1e);
}
```

使用变量，可以更加简单些，如下：

```
:root  {
    --bg-color: light-dark(#ffffff,  #1e1e1e);
    --text-color: light-dark(#333333,  #f0f0f0);
}

body  {
  color: var(--text-color);
  background-color: var(--bg-color);
}
```

可以看到 `light-dark` 为我们实现暗黑模式又新增了一种可能性，但是同样的也需要我们在书写代码时对元素的颜色进行声明，表明在明亮模式和暗黑模式下该如何展示！

虽然是 `light-dark` 刚加入的样式函数，但是它在主流浏览器上都是支持的，但是要注意下支持的版本，兼容性如下图所示：

![image.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/a14e5aef82af47539af431f6a920ebcb~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5YmN56uv5qKm5bel5Y6C:q75.awebp?rk3s=f64ab15b&x-expires=1744886053&x-signature=QCO2BVa5eyPyux83uj7xPu%2F0ixo%3D)

## 四. 总结

传统的实现方式原理很简单，可能需要我们有两套模式：`light`（明亮） 和 `dark`（暗黑），再通过不同的状态（`light` 和 `dark`）使用不同的样式，从而达到不同的效果展示，无形中会增加了代码量和复杂度，不推荐！

虽然使用 CSS 滤镜 `filter` 的方案确实有**瑕疵**，但是我们也是可以进行**按需优化**的，同时你要考虑代码量的话，它的性价比是非常高的！兼容性也不差，尤其适合已经开发完毕的大型网站进行暗黑模式切换，强烈推荐！

2024 年新加入的 `light-dark()`  是一种新的 CSS 属性值函数，用于在**浅色模式**和**深色模式**下分别指定不同的样式值，为我们实现暗黑模式增加了更多可能性，但是同样需要开发不同的代码进行声明，推荐次之！

当然，不同的场景下可能使用的方案选取也会有变化，如果是已经开发完毕的网站新增暗黑模式主题时，使用 CSS 滤镜 `filter` 的实现方式无疑是最快最有效的方式！

|开发方式|方案|推荐指数|
|---|---|---|
|传统模式|两套样式表适配|⭐️|
|CSS 滤镜 `filter`|一行核心代码实现  <br>`filter: invert(1) hue-rotate(180deg)`|⭐️ ⭐️ ⭐️ ⭐️ ⭐️|
|CSS 函数 `light-dark()`|使用变量和 `light-dark()` 函数|⭐️ ⭐️ ⭐️|

## 五. 相关文档

[filter - MDN 文档](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FCSS%2Ffilter "https://developer.mozilla.org/en-US/docs/Web/CSS/filter")

[light-dark - MDN 文档](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FCSS%2Fcolor_value%2Flight-dark "https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark")

你使用过 CSS 滤镜吗？你有更快更完美的实现暗黑模式的方案吗？欢迎评论区讨论一下吧！