[没想到学会这个canvas库，竟能做这么多项目如果打算学习Canvas做图片设计、定制设计相关的工具，我建议你学习一下f - 掘金](https://juejin.cn/post/7459286862839054373)

![](https://p26-piu.byteimg.com/tos-cn-i-8jisjyls3a/56e8bdf2a6294cb6973add3e4ce07f02~tplv-8jisjyls3a-image.image)

大家好，我是一名前端工程师，也是开源图片编辑器[vue-fabric-editor](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fikuaitu%2Fvue-fabric-editor "https://github.com/ikuaitu/vue-fabric-editor")项目的作者，2024年5月从北京辞职，我便开始了自己的轻创业之路，**接触了不同的客户和业务场景**，回顾这半年，没想到学会`fabric.js`这个`Canvas`库，竟能做这么多项目。

如果你打算学习一个`Canvas`库或者做图片设计、定制设计相关的工具，我建议你学习一下`fabric.js` 这个库，它非常强大，可以做出很多有意思的项目，**希望我的项目经历能给你的技术选型做一些参考**。

- 开源项目：[vue-fabric-editor](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fikuaitu%2Fvue-fabric-editor "https://github.com/ikuaitu/vue-fabric-editor")
- 预览：[www.kuaitu.cc](https://link.juejin.cn/?target=https%3A%2F%2Fwww.kuaitu.cc "https://www.kuaitu.cc")

![1预览图.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/fbb7320252be48c9b664e2e5b83fe7db~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oSa5Z2k56em5bCR5Y2r:q75.awebp?rk3s=f64ab15b&x-expires=1744587805&x-signature=Mw5WuH%2Bc1vjlNqSe7trDw17yeyQ%3D)

## 项目经历

从北京回老家邯郸后，我陆续做了很多项目，包括证件照设计、锦旗/铭牌定制工具、Shopify定制插件、批量生成图片、手机版图片设计工具、服装设计、电商工具等，这些项目都离不开`fabric.js`这个库。回顾这段经历，**让我深刻体会到它的强大和广泛应用**。

## 图片设计

图片设计是我接触的第一个主要应用领域。项目最初源于一个小红书成语卡片设计工具的构想，随后逐步扩展到更广泛的设计场景，包括小红书封面、公众号头图、营销海报以及电商图片等多种自媒体内容制作。

这类应用的核心功能在于**自定义画布尺寸和元素排版，得益于fabric.js的原生支持**，实现起来相对简单。**我们主要工作是开发直观的属性编辑面板**，使用户能够便捷地调整所选元素的文字和图片属性。

当然如果做的完善一些，还需要`历史记录`、`标尺`、`辅助线对齐`、`快捷键`等，这些功能`fabric.js`并没有包含，需要我们自己实现，这些功能可以参考vue-fabric-editor 项目，它已经实现了这些功能。

还有很多细节的功能，比如组合保存、字体特效、图层拖拽、图片滤镜等，这些功能我们做的比较完善了。

![2 功能展示.gif](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/338a2151861a447bb653dd92c7782950~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oSa5Z2k56em5bCR5Y2r:q75.awebp?rk3s=f64ab15b&x-expires=1744587805&x-signature=992zS64EKxdapFw095uCTYGBn%2Fw%3D)

## 定制设计工具

图片设计的场景相对通用，没有太多定制化的需求。而定制类的设计工具则需要针对特定场景深度开发，比如证件照、锦旗/铭牌设计、相册设计等，**每个场景有不同的定制功能**。

证件照设计工具的核心在于自动化的处理。主要工作量集中在尺寸的匹配，**确保图片能自动调整到最佳大小**。同时，需要提供人物图片的裁剪功能，让用户能便捷地进行换装、切换证件尺寸、更换背景等操作。

![3.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/d086c10558a34554ae9f767092fcb1ae~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oSa5Z2k56em5bCR5Y2r:q75.awebp?rk3s=f64ab15b&x-expires=1744587805&x-signature=PKTWpD22CiXDvAuSrqE%2F2ob%2BhCY%3D)

![4.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/abebb431ec86447494122ec1137da867~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oSa5Z2k56em5bCR5Y2r:q75.awebp?rk3s=f64ab15b&x-expires=1744587805&x-signature=TUpaa%2BRVgjtZ4vRzWT%2FoHxvVrf0%3D)

**锦旗与铭牌设计则更注重文字内容的自动排版**。系统需要根据用户输入的抬头、落款、赠言等内容，自动计算最优的文字间距和整体布局，确保作品的美观性。特别是铭牌设计，还需要实现曲线文字功能，让文字能够优雅地沿着弧形排布。

![6.jpeg](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/9028ef5e628b49248682201af1a6cf25~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oSa5Z2k56em5bCR5Y2r:q75.awebp?rk3s=f64ab15b&x-expires=1744587805&x-signature=WE35Khd2frDIf0nI5y2uRMnlOpo%3D)

![5.jpeg](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/1efe188b89284770971b525760f34dc2~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oSa5Z2k56em5bCR5Y2r:q75.awebp?rk3s=f64ab15b&x-expires=1744587805&x-signature=GVOrWEBk21cfrtltClRScSvADug%3D)

**相册设计工具的重点是提供灵活的画布裁剪功能**。用户可以使用各种预设的形状模板来裁剪图片，需要确保裁剪后的图片既美观又协调，最终生成精美的画册作品，交互上方便用户拖拽图片快速放入裁剪区域。

![7相册功能.gif](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/e74722cda27d490e9596f3d6fcd12f1e~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oSa5Z2k56em5bCR5Y2r:q75.awebp?rk3s=f64ab15b&x-expires=1744587805&x-signature=%2FAevPhDcgEyrf3d2eoAgHv3O3Gw%3D)

## 电商工具

电商场景比图片设计更垂直，除了普通的平面设计，例如店铺装修、商品主图、详情图的设计，另外还需要对商品进行**换尺寸**、抠图、换背景、去水印、**涂抹消除**、超清放大等操作，这些对图片处理的要求更高一些。

![涂抹.gif](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/99dbc4710ad74681a67f1e1fd4681578~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oSa5Z2k56em5bCR5Y2r:q75.awebp?rk3s=f64ab15b&x-expires=1744587805&x-signature=YZ4tyGetPKz0rsUT%2F4%2BhtP%2FFVuE%3D)

![9.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/f31c35b45a02472f99b432fe340e6134~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oSa5Z2k56em5bCR5Y2r:q75.awebp?rk3s=f64ab15b&x-expires=1744587805&x-signature=y%2FLPLmzmGnMqueO%2B3DOnTspCQeU%3D)

## 批量生成

批量算是一个比较刚需的功能，比如电商的主图，很多需要根据不同产品到图片和价格来批量加边框和文字，以及节庆价格折扣等，来生成商品主图，结合图片和表格可以快速生成，减少设计师的重复工作量。

![12.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/53fc5a5802774be28c20fec7b1017399~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oSa5Z2k56em5bCR5Y2r:q75.awebp?rk3s=f64ab15b&x-expires=1744587805&x-signature=Ez8dvihXn8EST8NYz5aS6BPVywA%3D)

另一部分是偏打印的场景，比如批量制作一些商品的二维码条形码，用在超市价签、电子价签、一物一码、服装标签等场景，根据数据表格来批量生成。

![11.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/5376374658da452bbd599e39df575285~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oSa5Z2k56em5bCR5Y2r:q75.awebp?rk3s=f64ab15b&x-expires=1744587805&x-signature=9XcN2FH%2BhnZt0L8jJdgNx0fXQe4%3D)

这种项目**主要的工作量在交互上，如何将画布中的文字和图片元素与表格中的数据一一对应，并批量生成**，另外会有一些细节，比如条形码的尺寸、图片的尺寸如何与画布中的尺寸比例进行匹配，这些细节需要我们自己实现。

上边的方式是通过表格来批量生成图片，**还有一种是根据 API来批量生成图片**，很多场景其实没有编辑页面，只希望能够通过一个 API，传入模板和数据，直接生成图片，fabric.js 支持在nodejs 中使用，我们要做的就是根据模板和数据拼接 JSON，然后通过fabric.js 在后端生成图片，然后返回给前端，性能很好，实际测试 2 核 2G 的机器，每张图片在 100ms 左右。

很多营销内容和知识卡片、证书、奖状也可以通过批量生成图片API来实现。

![10.gif](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/2a7057b05e1d4fb8941f0c6719b1c037~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oSa5Z2k56em5bCR5Y2r:q75.awebp?rk3s=f64ab15b&x-expires=1744587805&x-signature=PHY2KBiZ7hC3k%2FH3M4JaHQ%2BCFOE%3D)

当然，还有一些更复杂的场景，比如不同的数据匹配不同的模板，不同的组件展示不同的形式等，包括错别字检测、翻译等，我们也为客户做了很多定制化的匹配规则。

![13.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/501a4d90f3364b7d8879b39f399129c1~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oSa5Z2k56em5bCR5Y2r:q75.awebp?rk3s=f64ab15b&x-expires=1744587805&x-signature=k4LU2UYNNQLtnXhaJewv1TzCw4M%3D)

## 服装/商品定制

服装/商品定制是让用户在设计平台上上传图片，然后将**图片贴图到对应的商品模板上，实现让用户快速预览设计效果的需求**。

这种场景一般会分为 2 类，一类是是针对 C 端用户，需要的是简单、直观，能够让用户上传一张图片，简单调整一下位置就能确认效果快速下单。

![14.gif](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/f82f4bc740a14a28868e4c3a28fcb8a1~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oSa5Z2k56em5bCR5Y2r:q75.awebp?rk3s=f64ab15b&x-expires=1744587805&x-signature=xddHGyuIOzkcrFf3uCmLUq6eQgI%3D)

我在这篇文章里做了详细介绍：[《fabric.js 实现服装/商品定制预览效果》](https://juejin.cn/post/7403245452215386150 "https://juejin.cn/post/7403245452215386150")。

另一类是针对小 B 端的用户，**他们对设计细节有更高的要求，比如领子、口袋、袖子等，不同的位置进行不同的元素贴图**，最后将这些元素组合成一个完整的服装效果图，最后需要生成预览图片，在电商平台售卖，完成设计后，还要将不同区域的图片进行存储，提供给生产厂家，厂家快速进行生产。

比如抱枕、手机壳、T恤、卫衣、帽子、鞋子、包包等，都可以通过类似服装设计的功能来实现。

![15.gif](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/5fadd37aecf94ec49ca50d7760b74ff7~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oSa5Z2k56em5bCR5Y2r:q75.awebp?rk3s=f64ab15b&x-expires=1744587805&x-signature=XmrvIRhtPzs1m7RD16a%2FB1hYqNc%3D)

很多开发者会提出疑问，是否需要介入 3D 的开发呢？ 我们也和很多客户沟通过，从业务的角度看，他回答是：**3D 的运营成本太高**。他们做的都是小商品，SKU 很多很杂，**如果每上一个商品就要进行 3D 建模，周期长并且成本高**，他们更希望的是通过 2D 的图片来实现，而且 2D 完全能够满足让用户快速预览确认效果的需求，所以 2D 的服装设计工具就成为了他们的首选。

## 包装设计

包装设计是让用户在设计平台上，上传自己的图片，然后将图片贴图都包装模板上，主要的场景是生成定制场景，比如纸箱、纸袋、纸盒、纸杯、纸质包装等，**这些场景需要根据不同的尺寸、形状、材质、颜色等进行定制化设计，最后生成预览图片**。

![16.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/ba7b32bd80e24062af9d84fcfc07c698~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oSa5Z2k56em5bCR5Y2r:q75.awebp?rk3s=f64ab15b&x-expires=1744587805&x-signature=1Z88%2Bxs3KwFbMFvss4P9aDYxaoY%3D)

因为设计到不同的形状和切面，**而且大部分是大批量定制生产，所以对细节比较谨慎，另外包装规格相对比较固定，所有用3D模型来实现就比较符合**。

另外，在确定设计效果后，需要导出刀版图，提供给生产厂家，厂家根据刀版图进行生产，所以需要将设计图导出为刀版图，这个功能 fabric.js 也支持，可以导出为 SVG 格式直接生产使用。

![17.gif](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/50e80ced02584a4abf794e26cec75a08~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oSa5Z2k56em5bCR5Y2r:q75.awebp?rk3s=f64ab15b&x-expires=1744587805&x-signature=CmBdYKLeGIru6yD9crQ1i1yS9KY%3D)

## AI结合

在AI 大火的阶段，就不得不提 AI 的场景了，无论在自媒体内容、电商、商品、服装设计的场景，都有 AI 介入的影子，举个例子，通过 AI生成内容来批量生成营销内容图片，通过 AI 来对电商图片进行换背景和图片翻译，通过 AI 生成印花图案来制作服装，通过 AI 来生成纹理图来生成纸盒包装，**太多太多的 AI 的应用场景，也是客户真金白银定制开发的功能**。

## 展望2025

**从图片设计的场景来看，我们的产品已经很成熟了**，也算是主力产品了，未来会持续迭代和优化，让体验更好，功能更强大，把细节做的更完善，例如支持打印、视频生成等功能。

从定制设计工具的场景来看，我**们积累了不同商品定制设计的经验，从技术和产品到角度看，我们还可以抽象出更好的解决方案**，让客户能够更高效、低成本的接入，提供给他们的客户使用，快速实现设计生产的打通。

2024 到 2025 ，从在家办公一个人轻创业，搬到了我们的办公室，期待未来越来创造更多价值。

![18.png](https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/c21ae29ab75646fa8608331943fef84c~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5oSa5Z2k56em5bCR5Y2r:q75.awebp?rk3s=f64ab15b&x-expires=1744587805&x-signature=mAJ1FIdTIUp%2BO6BQPtfqTZQ4noM%3D)

## 总结

半年的时间，**这些项目的需求`fabric.js`都帮我们实现了，所以如果你对`Canvas`感兴趣，我的亲身经历告诉你，学习`fabric.js`是一个不错的选择**。

另外，对我来说更重要的是，客户教会了我们很多业务知识，这些才是宝贵的业务知识和行业经验，一定要心存敬畏，保持空杯，只有这样我们才能做好在线设计工具解决方案。

这篇文章也算是我从 2024年离职出来到现在的一个年终总结了，**希望我们踩过的坑和积累的经验都变成有价值的服务，作为基石在2025年服务更多客户**，文章内容供大家一些参考，期待你的批评指正，一起成长，祝大家 2025年大展宏图。

给我们的开源项目一个Star吧：[github.com/ikuaitu/vue…](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fikuaitu%2Fvue-fabric-editor "https://github.com/ikuaitu/vue-fabric-editor") 😄。

本文收录于以下专栏

![cover](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/659df5b52b974b1cab59f443d22bcb94~tplv-k3u1fbpfcp-jj:100:75:0:0:q75.avis)

记录了vue-fabric-vue开源项目从0到1的开发过程，

上一篇

使用fabric.js 开发移动端 H5 图片编辑器