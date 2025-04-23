[前端自给自足UI设计稿（Claude AI 版本）前端自给自足UI设计稿（Claude AI 版本） 先看效果 输入：健 - 掘金](https://juejin.cn/post/7477399364533485622)

![](https://p26-piu.byteimg.com/tos-cn-i-8jisjyls3a/56e8bdf2a6294cb6973add3e4ce07f02~tplv-8jisjyls3a-image.image)

## 前端自给自足UI设计稿（Claude AI 版本）

> [原文链接（更多案例已更新）](https://link.juejin.cn/?target=https%3A%2F%2Fjustin3go.com%2Fposts%2F2025%2F03%2F03-front-end-self-sufficient-ui-design-claude-ai-version "https://justin3go.com/posts/2025/03/03-front-end-self-sufficient-ui-design-claude-ai-version")

### 先看效果

输入：健康类 APP

> AI 开始思考并设计功能，以及统一设计风格；然后调用可视化插件进行 HTML 的预览（这些步骤你也可以在 Cursor 等编辑器完成，然后直接预览 HTML 即可）

效果如下：

![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/d5ac94446af64d288578b8a22af886a6~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVzdGluM2dv:q75.awebp?rk3s=f64ab15b&x-expires=1745896259&x-signature=xPwPlbqciqQI5vgypQRZUAgzIY0%3D)

> 然后，AI 继续问我是否继续，继续哪一个模块。

输入：继续【运动计划模块】

![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/802ec2a97ce641768b5161586319af0a~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVzdGluM2dv:q75.awebp?rk3s=f64ab15b&x-expires=1745896259&x-signature=rXUXuj8vFA2VhpbhI%2BEJ9PYI7hc%3D)

同样，输入：继续【饮食管理模块】

![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/d02d6606b1e64abcafd93453a9845866~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVzdGluM2dv:q75.awebp?rk3s=f64ab15b&x-expires=1745896259&x-signature=p5qdVCxuj%2FL2Fx4XnbS%2FEIdr1ZQ%3D)

最后，输入：继续【社区功能】

![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/853162dd0a574e888a35b085a3581543~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVzdGluM2dv:q75.awebp?rk3s=f64ab15b&x-expires=1745896259&x-signature=faglcym%2BUsfesgflGIoHMKgOP2s%3D)

### 提示词如下

```
## 你是谁

你是一位资深全栈工程师，设计工程师，拥有丰富的全栈开发经验及极高的审美造诣，擅长现代化设计风格，擅长移动端设计及开发。

## 你要做什么

1. 用户将提出一个【APP 需求】
2. 参考 ui_ux_design 设计这个【APP 需求】，模拟产品经理提出需求和信息架构，请自己构思好功能需求和界面

> 下面这两个步骤，每一个小功能（根据功能划分，可能有多个页面）就输出一个html，输出完成后提示用户是否继续，如果用户输入继续，则继续根据按照下面步骤输出下一个功能的 UI/UX 参考图

3. 然后使用 html + tailwindcss 设计 UI/UX 参考图
4. 调用【Artifacts】插件可视化预览该 UI/UX 图（可视化你编写的 html 代码）

## 要求

- 要高级有质感（运用玻璃拟态等视觉效果），遵守设计规范，注重UI细节
- 请引入 tailwindcss CDN 来完成，而不是编写 style 样式，图片使用 unslash，界面中不要有滚动条出现
- 图标使用 Lucide Static CDN 方式引入，如`https://unpkg.com/lucide-static@latest/icons/XXX.svg`，而不是手动输出 icon svg 路径
- 将一个功能的所有页面写入到一个 html 中（为每个页面创建简单的 mockup 边框预览，横向排列），每个页面在各自的 mockup 边框内相互独立，互不影响
- 思考过程仅思考功能需求、设计整体风格等，不要在思考时就写代码，仅在最终结果中输出代码
```

基本思路：

就是通过 HTML + Tailwind 生成对应的代码然后运行即可，使用 CDN 方式引入 Taiwind 方便直接预览，而不用执行漫长的`npm install`了

一些小技巧：

- 使用 Lucia Icon CDN 避免 AI 消耗大量 Token 来绘制 SVG 路径
- 使用分功能分块，然后继续的方式，避免出现截断问题（目前 Claude 3.7 截断问题非常严重，所以暂时使用 Claude 3.5 替代，效果也还不错）
- 提前想好功以及整体设计风格，方便后续分功能设计页面时进行参考

### 其他模型呢

2025-03-03 尝试的，其他模型效果大部分都不行，Claude 3.7 效果还行，但经常被截断，不够稳定，可以观望一下。

其他模型仅仅尝试过两个非推理模型，大家可以自行尝试。

#### GPT-4o

![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/eae869c2b68b4da88810ef463de3eac3~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVzdGluM2dv:q75.awebp?rk3s=f64ab15b&x-expires=1745896259&x-signature=jvg2rHETnuou4%2Bdx1TWX3ZHW%2FQA%3D)

#### DeepSeek

![](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/6e61f0099b5c414b8e7d6e709e6cb2f2~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVzdGluM2dv:q75.awebp?rk3s=f64ab15b&x-expires=1745896259&x-signature=NXVzrVwEcHQ7eCqQLc8xSA6TRdA%3D)

### 参考

参考自如下两位博主的思路分享

- [Cursor 让普通人也能轻松设计一套 APP 精美 UI 2.0 版本](https://link.juejin.cn/?target=https%3A%2F%2Fx.com%2Fhuangzh65903362%2Fstatus%2F1895991413881651504 "https://x.com/huangzh65903362/status/1895991413881651504")
- [你好，我是「今天又是被取代的一天」服务，这是我 300 秒做的 UI/UX 设计（我是 claude3.7 thinking btw](https://link.juejin.cn/?target=https%3A%2F%2Fx.com%2Ffengbuyou%2Fstatus%2F1894801574716940616 "https://x.com/fengbuyou/status/1894801574716940616")

本文收录于以下专栏

![cover](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/95414745836549ce9143753e2a30facd~tplv-k3u1fbpfcp-jj:100:75:0:0:q75.avis)

![avatar](https://p6-passport.byteacctimg.com/img/user-avatar/ec1d0d4df4a714ccb859b85542d73571~40x40.awebp)