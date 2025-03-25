[![语雀](https://mdn.alipayobjects.com/huamei_0prmtq/afts/img/A*PXAJTYXseTsAAAAAAAAAAAAADvuFAQ/original)](https://www.yuque.com/dashboard)为什么我们要删掉 100% 的 useEffect

  [为什么我们要删掉 100% 的 useEffect](https://www.yuque.com/jiango/code/good-bye-use-effect)
  
TLDR  
冷知识：新版 React 官方文档仅介绍 useEffect 这一个 API 就用了 3w 中文字符，所以我猜大部分开发者都没有完整阅读过新版官网中与 useEffect 相关的 5 篇教程。  
阅读指南  
因为本文篇幅很长，差不多也是 3w 中文字符，所以提前对各个章节进行了介绍，大家可以按章节顺序阅读，也可以先挑感兴趣的章节先行阅读：  
●第一章：可以选择仅阅读加粗部分，主要是讲背景和目标，移除所有 useEffect 是我们实现目标的关键过程之一。  
●第二章：回顾了笔者从传统的 Class 组件过渡到 React Hook 时的学习感受。  
●第三章：列举了我们团队在实际使用 useEffect 时遇到的各种实际问题，这些问题大大降低了我们在复杂中后台场景中的研发效率。  
●第四章：介绍了 useInit 解决方案：如何用 Init Hook 和少量的 Watch Hook 来完全代替 useEffect。  
●第五章：辩证地分析了 React Hook 中 Effect 概念和“同步”的设计哲学，并讨论了这些设计到底带来了什么收益。  
●第六章：补充介绍了 useInit 解决方案的设计由来，帮助大家更好的理解这套新的 React Hook 编码范式。  
  
GitHub 源码：[ZCY-FE/fool-proofing-hooks](https://github.com/ZCY-FE/fool-proofing-hooks)  
  
重点内容标记  
如果你想快速阅读本文，可以重点关注以下加粗内容：  
●一般的重点内容会使用黑色加粗字体  
●文章论述过程中重要的转折点会使用红色加粗字体  
●重要结论类的内容会使用橘橙色加粗字体  
●不同方案对比后的优势点会使用绿色加粗字体  
  
欢迎讨论  
欢迎各种形式的友好讨论：  
●登录语雀后进行划词评论（选中部分文本后点击悬浮出来的评论 icon 即可），或直接在末尾评论区留言  
●在 [知乎文章](https://zhuanlan.zhihu.com/p/32311328673) 的评论区留言  
●在 [掘金文章](https://juejin.cn/post/7484801077018099723) 的评论区留言  
  
  
正文分界线  
  
一、背景  
1、聊聊代码屎山  
最近几年学习到了一个很重要的观点：在重构一个屎山项目时，最重要的指标就是如何保证下一次重构不会很快到来，所以重构的技术方案中必须要包含如何让代码“保鲜”的方法，否则重构结束后，换一几拨人维护几个来回，整个代码仓库又会迅速劣化成屎山。  
知乎问题“为什么祖传代码被称为「屎山」？”中 [程墨Morgan的回答](https://www.zhihu.com/question/272065178/answer/591282072) 从经济学的角度分析了写出好代码的客观条件。不过其中说到的管理层问题我认为未必是因为短视，而是视角不一样：作为程序员我们肯定希望有充足的时间和精力去做最好的设计，写最好的代码；但是在竞争激烈的市场环境中，很多时候快速支持业务落地才能抢占市场份额和用户心智，因此就有了各种倒排项目。当然作为打工人谁也不想天天加班，也有一些情况需要有高质量代码的支撑，在这些场景中就必须投入充足的时间和精力去做好编码前的设计工作：比如已经初步占据市场的产品需要通过周期性的高效迭代进一步巩固市场地位，比如公司的战略就是通过越级的产品体验来吸引用户……  
这些思考让我觉得干净整洁的代码可能在很多时候就是不符合经济学规律的。举个不恰当的比喻：我们无法要求一座摩天大楼的施工现场在施工期间每天都保持一尘不染、各类管线布局做到最好的模块化和最好的布局设计，能保证最基本的安全和质量这两个要求就已经非常好了。如果长远的未来业务需要转型，没有人能预知“在这座大楼上进行翻修改造”和“换地皮用新技术建造一栋新的大楼”哪个能让我们完成未来的商业目标。  
不过作为技术人员，特别是当我们要继续维护和迭代屎山代码时，除了不断地提高对屎山代码的适应能力，更要从屎山代码的问题中反思如何去避坑。  
在这个过程中，我想起了多年前当入行时被推荐阅读过的一本关于软件构建的巨著[《 Code Complete 代码大全 》](https://book.douban.com/subject/1477390/)，当年只是浅读了几章之后就再也没有看过。在回看所有我们遇到的问题时，其实绝大多数的解决思路或者说最佳实践早已在这本编写于 2006 年的书中被列出来了，只是因为书中文字比例较高，且列举的各种代码示例所用的编程语言和我们目前工作中用的技术栈并不一样，所以很难一下子代入到我们日常的编码工作中，但是关于软件构建的核心思想都是一样的，只是需要我们看这本书时多花点时间，静下心来将这些理念应用到我们当下的编码工作中。  
下面我基于自己的理解来介绍两个编码过程中要确保的要点，也是本文的出发点，在[《 Code Complete 代码大全 》](https://book.douban.com/subject/1477390/)中也有类似的理念介绍：  
2、确保代码意图清晰明确  
React Hook 发布于 2018 年，最近一次看到讨论官方 Hook 的技术文章是关于 useMemo 和 useCallback 的[《 请删掉99%的useMemo 》](https://mp.weixin.qq.com/s/aQclSEHFER-Tsr2LaYtm-A)和[《「好文翻译」为什么你可以删除 90% 的 useMemo 和 useCallback ？》](https://juejin.cn/post/7251802404877893689)。  
对于 useMemo 和 useCallback，我个人的结论更简单粗暴：尽量别在业务代码中使用 useMemo 和 useCallback，纯纯增加代码噪音，不用这两个 Hook 不需要理由，用到的地方则需要明确说明理由。并且很多页面的性能/体验短板大多也不在 js 的执行阶段。我们完全可以等到页面真的遇到此类性能问题时再来考虑这些优化方案，并且在函数组件的时代，PureComponent 式的优化方案在迭代中是极其脆弱的，应该优先用其他方式解决性能问题，比如更合理的组件设计。  
提到以上这两篇文章的原因是，文章中提到的一个问题点和本文的其中一个出发点是十分类似的：  
  
  
即：我们如何保证自己代码的意图在后续的迭代中被正确且精准地传达给后来人而不被破坏？否则我们就只能不断地去品味屎山代码，艰难地从中抿出前人的智慧，因为在每个项目的开发中，我们都既是前人，也是后来人。  
3、确保代码结构的一致性  
本文的另一个出发点起源于我个人：我在看自己过往写的业务代码时，发现如果让我再写一次，在一些逻辑细节的设计上，可能会有点不一样。并不是因为这段时间间隔中我自己有了什么成长或者新的见解，而是当时写代码的时候有 Way A 和 Way B 两种思路确实差不多，随便选了 A（确实差不多所以当时想再多也没用，一些不影响最终效果的实现细节我们也没时间去纠结）。过段时间后再来看这个代码我会再次纠结一会：“是不是用 Way B 很好呢，所以这次的新增功能我试试用 Way B 迭代上去吧” or “之前既然用的是 Way A 那么继续用 Way A 吧，保持一致性”。导致实际上后续每次迭代功能时我都要纠结一遍，代码一致性也没那么好。  
作为一个老牌强迫症，我决定给自己定一个清晰的规则，在实现同一类功能时，尽量让代码能够保持跨越时间的结构一致性，但是很快我发现，我要花更多的精力和一起协作的同事去沟通和同步我的想法，而且这个进展很慢且不可复制。因此我发现这个问题对团队的意义比对个人要大得多，在开发协作中我们每天都在遇到代码结构一致性、以及规范执行一致性等问题的挑战。  
4、更高的目标  
上述这些问题最终会影响整个项目长期的可读性和可维护性，直接决定团队平时的开发效率，间接影响系统的稳定性。而且只有解决了以上这两个问题，我们在平时开发的时候才有精力真正去关注和讨论一些更高级、更重要的东西，例如怎么将复杂的需求转变为拥有最佳设计的业务组件、如何将复杂的业务逻辑进行合理的分层拆分等等。  
要解决上述的两个问题，其实要求很简单，落地却很难：  
●代码意图的正确传达：代码可以看上去平平无奇但一定要确保最高的可读性，必要时写一些注释，千万别在业务代码中炫技，越接近自然语言的代码可读性越强。要是写得连产品都能看得懂，你是最牛的！  
●保持代码结构一致性：对能用的开发工具进行精挑细选，缩减开发中实现方式的可选项。在最新版本的海拉鲁大陆中，你只能装备大师之剑，余料建造也不行，赶紧去救公主，越快越好！  
  
在这个过程中，我们发现 useEffect 是一个绕不过去的话题。当然也有其他话题，我们内部暂且把这些话题都归到了前端的研发范式中。在正文具体展开之前容许我先叠个甲：本文的部分观点较为主观，因为没有条件进行详尽的沟通调研和数据统计，但是欢迎大家参与讨论。  
二、初见 React Hook  
1、第一印象  
本人大概在 19 年开始学习和使用 React Hook，作为一个有 Class Component 类组件开发经验的新手，简单回忆和总结了当时通过官方文档学习函数组件过程中的关键疑问/感慨：  
●每次函数组件 update 就是简单地把最外层函数重新执行一遍，拿到 UI 视图渲染结果，那么：  
○既然每次执行都是独立的，那组件内多次调用 useState 时为什么不需要传入特定的 key 来区分这些 state，不然应该会乱套？（答案是基于顺序而不是基于 key，类似 Map 和 Array 的区别）  
○每次执行的时候所有方法都要重新定义一遍，感觉相比类组件，好浪费啊。用了 useCallback 也避免不了定义环节，只是每次定义完了，再来个判断逻辑来决定要不要用，感觉更浪费了！（专门有个 [FAQ](https://zh-hans.legacy.reactjs.org/docs/hooks-faq.html#are-hooks-slow-because-of-creating-functions-in-render) 也讲到这个了）  
●当我开始试图在函数组件中寻找对标类组件生命周期的解决方案时，我对 useEffect 的理解如下：  
○当 useEffect 第二个参数不传时，就等同于 componentDidUpdate 这个类组件中的生命周期。  
○当 useEffect 依赖传入空数组 [] 时可以实现 componentDidMount 和 componentWillUnmount 的能力，但是这个场景能不能给个语义更好的 API 命名，比如 useDidMount，每次都要传入空数组也很多余。  
○当 useEffect 传入状态依赖时，每当依赖数组中的状态发生了变化，useEffect 的回调函数中的副作用逻辑就会执行。  
○当 useEffect 传入依赖并实现一些 addEventListener 之类的事情时，为了解决闭包问题，竟然会在每次接收到消息后去解绑、再绑定、解绑、再绑定...... 仿佛闭包问题本身才是函数组件 + useEffect 带来的 “副作用”。  
  
2、副作用的概念  
最后就是对于所谓的 effect 本身，什么是副作用，在当时的[React](https://zh-hans.legacy.reactjs.org/docs/hooks-effect.html) 官方文档是这么描述的：  
  
  
当时也没有多想，就大概知道了 UI 渲染（状态 -> JSX）之外的逻辑都属于副作用的范畴。  
3、监听思维 vs  副作用思维  
当我开始在业务中使用 useEffect 并尝试把所有的 http 接口请求都放到里面时，我突然感觉到：如果这么写代码，useEffect 不就是 Vue 2 里的 watch 么？  
因为我 Vue 的实际使用经验较少，知道 watch 这个 API 但是没真正用过，所以在写这篇文章之前我一直以为 Vue 的 watch  是以数组形式声明监听项的，写这篇文章时，我特意去查了一下，发现一个小差别就是 Vue 2 中一次只能监听一个状态（当然也能通过监听计算属性实现多个状态的监听）：  
  
在我的研发习惯中，一般都会避免使用 Vue watch 和 React componentDidUpdate 等 API 去实现业务逻辑，而是优先用其他方式，因为监听类的逻辑是很难维护的。然而当 React Hook 把数据请求都视为副作用时，结合 useEffect 那不就是在引导所有开发者尝试用监听的逻辑去实现业务逻辑么，想象一下就觉得很可怕。当然我也可以选择继续保持原本的研发习惯，把由用户事件（鼠标、键盘、触屏等操作）触发的请求写在事件处理函数中。所以当时对于如何使用 useEffect 我纠结了很久，为了回忆当时的学习过程，我甚至还找到了一份 3 年前的笔记，对于什么时候要用监听的思维进行了总结（现在看来是完全错误的）：  
  
其实在这几年经历了更多的业务实战“磨炼”后，我早已忘记了当时写在我笔记中的这个结论，如果让我给一个如何在业务代码中使用 useEffect 的新结论：我只会在为了模拟 componentDidMount 和 componentWillUnmount 这两个生命周期时主动使用空数组 [] 依赖的 useEffect；对于其他大部分场景中的副作用逻辑，我一定会优先将这些逻辑直接实现在用户事件响应函数中；实在万不得已时，我才会用 useEffect 去模拟 componentDidUpdate 生命周期中的监听类逻辑。  
但是当年的这个认知一直保留了下来，包括在看其他同事的代码时我也是这么去解读，并且持续到现在，即：  
“useEffect + deps（非空数组）”  =  “监听状态/属性后执行特定逻辑”  
并且在准备写这篇文章期间，我特意观察过同事之间的技术讨论，包括各种社区里的技术文章，当我们提及 useEffect 时，“监听”这个词出现的频率是很高的：  
  
然而认真阅读过官方文档的人都知道，useEffect 的设计意图并不是让我们用于实现监听类逻辑，而是用于实现副作用。不过两种理解方式或者说思维模式写出来的代码功能是一样的，殊途同归。  
个人认为有一个问题可以判断你日常使用 useEffect 时用的是监听思维，还是用副作用思维：你会先声明 useEffect 依赖数组的所有依赖项？还是先实现 useEffect 回调函数中的所有逻辑？  
三、现实中的 useEffect 地狱  
在第一章介绍的背景下，我分类总结了我认为在实际开发过程中 useEffect 存在的问题，以下大部分代码示例并没有引起实际功能的 bug。但是就像文本第一章中所说的，这些问题最终会影响整个项目长期的可读性和可维护性，直接决定团队的开发效率，间接影响系统的稳定性。  
1、大量不够健壮的空依赖  
在我们的前端工程中，使用 useEffect 时依赖数组为空的情况大概占比 50%，例如：  
这个代码的问题如下：  
语义化问题  
如果只是为了替代 componentDidMount， 使用例如 ahooks 的 useMount 可能会更语义化，且可以少写一个空数组。  
判断依赖问题  
如果在工程中参考 [代码检查（Linting）](https://zh-hans.react.dev/learn/editor-setup#linting)启用 react-hooks/exhaustive-deps 这个官方 ESLint 规则后，实际上还会有一个提示：  
  
假设开发者的意图很明确，就是只要在 componentDidMount 中只执行一次，完整的代码如下：  
目前看来因为 fetchProjectList 的实现上没有用到任何如 props 和 state 这样的响应式值（参考[依赖应该和代码保持一致](https://zh-hans.react.dev/learn/removing-effect-dependencies#dependencies-should-match-the-code)）。当然如果 fetchProjectData 是组件内定义的函数，也要再看一下 fetchProjectData 的实现，这里我们假设它是外部函数。  
然后假设半年后另一个开发人员需要在这个功能基础上迭代，在 fetchProjectData 对应的接口中增加入参 bizId，而 bizId 来源于组件外部：  
很简单，第二个开发人员直接透传 bizId 到了请求的入参中，但是忘记将 bizId 放到 useEffect 的依赖中。但如果 bizId 是不会变化的，其实也不会有功能性问题，万一在整个页面的生命周期中的 bizId 是会变化的，那么就可能出现问题，我猜测这种 bug 可能会在开发阶段逃逸，大概率在测试阶段被测试人员发现。  
但是业务还有很多类似的因为漏写依赖导致的问题，可能因为原本的依赖项较多，导致漏依赖问题很难被发现，可能要到真线上某个真实用户的进行页面操作才会发现：  
如果想要在开发阶段非常自然地发现这类问题，有一个标准的办法就是把 react-hooks/exhaustive-deps 这个 ESLint 规则从 warn 级修改为 error 级。不再用肉眼去判断各个函数的实现中是否包含 state 和 props，而是无脑跟着 linter 提示走。  
 如果一个前端团队决定把 ESLint 规则调整为 error 级，那么就能彻底预防可能会到来的 bug，并且大多数的空依赖 useEffect 都不将再是空依赖。不知道有多少团队是这么做的，至少目前我们没有这么做，我个人认为这么做最大的问题就是后续阅读这些代码时，没法区分哪些逻辑实际上是只会在 componentDidMount 时执行的（即想知道在上例中的 bizId 是否会变化，只看当前组件的代码是无法知晓的），即前序开发者的部分代码意图信息完全丢失了。  
这违背了软件工程中的一条重要原则“优先去书写能够自说明的代码”，即优先用代码本身而非注释等其他形式来说明代码意图（在[《 Code Complete 代码大全 》](https://book.douban.com/subject/1477390/)中就有一个章节就讨论了这个话题）。  
当我要在此基础上继续开发时，最保险的方式就是假定所有 useEffect 中依赖的状态都是会不断变化的，我会认为在这种假设的前提下写代码对心智的消耗很大，因为你可能还要考虑当前组件中除了 useEffect 之外的逻辑是否也支持这些依赖不断变化，比如所有的子组件（特别是那些二、三方包内的组件，因为历史原因或者公司内团队规范差异，这些组件被编写时可能没有被限制必须严格遵守 react-hooks/exhaustive-deps 规则）。  
如果我们依旧将这个 ESLint 规则保持为 warn 级，除了容易出现的 bug 之外，还有一个小问题：在阅读他人的代码时，react-hooks/exhaustive-deps 这个 ESLint 规则完全无法帮我们判断历史代码中的空依赖是否是正确的，因为规则无法判断人的意图和对需求的理解，还是要我们用肉眼去判断，这会引发一个恶性循环：不断降低开发者对于 react-hooks/exhaustive-deps 这个规则的使用频率和信任度（包括开发人员在自己开发的时候）。  
所以对于“判断依赖”这个问题，我认为这两种方式各有千秋，也各有问题，我们也没有想到更好的解决办法。  
对于目前 react-hooks/exhaustive-deps 的使用情况，我简单在团队内做过一个调查：  
  
从这个简单的调查可以得出一个团队内的初步结论，目前能够较好遵守这个 ESLint 规则的人应该不到 50%，还有很多人会通过人工阅读代码来判断是否需要添加依赖项（一般都是在模拟 componentDidMount 时就忽略 linter 规则校验了）  
我自己选了【c】完全不看，因为我在绝大多数情况下使用 useEffect 是为了模拟 componentDidMount，在阅读他人代码时我也用监听思维去理解。但是完全不参考 linter 提示，会对开发者的细心程度要求比较高，而且脑子不能犯浑，因为一些复杂场景中会有很多层级的父子函数，需要人工去排查所有的父子函数中用到的响应式值。  
2、useCallback 的传染性  
大量的冗余代码  
当我在阅读那些按照官方推荐严格遵守 react-hooks/exhaustive-deps 规则的同事写的代码时，我觉得这些代码也开始变得越来越冗余：  
只要父级函数被 useCallback 包裹了，所有的子子孙孙的函数都必须要被 useCallback 包裹，这些 useCallback 和 deps 不代表任何业务意义，全部都是代码噪音，开发者为什么要关心这些东西？让我感觉不是 React 在给我们提效，而是我们在给 React 当牛马。  
难以自动化  
那有没有什么方法能避免这个问题呢，React 当初在官方文档可是给我们画了饼的：  
  
如果这个饼能吃到，那既不用开发者吭哧吭哧干苦力，在源码中也不会出现这些 useCallback 和 deps 造成代码噪音。但是当我如第二章中说的用“监听”去理解 useEffect 时，就发现了这个功能貌似无法实现，因为监听了什么状态，并不意味着我处理监听回调的时候只能用到这些状态：  
如上的例子中，若要实现这个打印诉求，依赖数组中的状态和回调函数中真实使用到的状态就是不一样的，构建过程是无法区分这种场景和常规的副作用场景的。除非对这个状态量就是不一致的场景通过注释等的形式进行标记，然而从 React Hook 推出到现在已经这么多年过去了，做这个事情的前提就要对整个 React Hook 生态以及所有公司自己的业务代码做一次大排查标记出这种场景，这显然是不太可能的。  
3、过度的响应式编程  
useEffect vs 事件响应函数  
React 这个前端框架的名字之所以叫做 “React”，我猜应该是因为相比于 jQuery 等上一代开发模式，在 React 中当数据发生变化时，框架会根据状态的变化来自动更新 UI 视图，而不需要开发者手动调用DOM API 修改 UI 视图，即实现了一种从状态到 UI 视图的响应式编程（Reactive Programming）。  
当我们将所有的副作用逻辑（数据请求、设置订阅等）都写在了 useEffect 中时，其实就是实现了从状态到副作用逻辑的响应式编程，更直白地说就是 react 自动地监听我们声明的依赖，自动地执行回调函数。这和我们在使用 Class Component 类组件开发时，将组件的所有的副作用逻辑都写在 componentDidUpdate 中是没有本质差别的。  
我认为这么做最大的问题不在于首次开发阶段，而在于阅读历史代码逻辑和迭代开发时，比如有一个后台项目列表页，以及常见的底部页码翻页功能：  
比如当我们修改了 fetchProjectList 内的逻辑，比如增加了一个状态依赖 pageSize，我们需要梳理哪些场景会触发接口请求并将此作为测试重点，我们需要经历以下步骤：  
●明确 fetchProjectList 会在哪些场景中被调用：  
○若只在这个 useEffect 中被调用，只需要看 useCallback 依赖什么时候会变化即可  
○若还有 useEffect 之外的地方调用，则需要单独列出来  
●明确 pageNo 会在哪些场景中变化：  
○先找到 pageNo 对应的 setPageNo  
○再找到所有引用并执行 setPageNo 的地方  
●明确 pageSize 会在哪些场景中变化：  
○先找到 pageSize 对应的 setPageSize  
○再找到所有引用并执行 setPageSize 的地方  
●明确 props.projectType 会在哪些场景中变化：  
○先找到父组件中的 projectType={stateX}  
○再找到 stateX 对应的 setStateX  
○最后找到所有引用并执行 setStateX 的地方  
●分析以上三个状态变化的场景  
○合并因为状态初始化或者同时改变而合并请求的情况  
○最后得到我们需要的重点测试的场景  
  
以上过程非常繁琐，在更复杂的业务场景中会大大降低代码的可读性，就是我在第二章提到过这很可怕的原因：响应式的设计会将原本连贯的函数调用链被切分成很多个副作用逻辑片段+事件响应函数片段，每个逻辑片段内的函数调用链是完整的，片段和片段之间的关系则是极其分散的（像一些状态管理方案中的 dispatch 方法，其实也有类似问题，即丢失了直接的调用关系）。  
作为对比，如果将项目列表接口的请求逻辑实现在事件处理函数中：  
当修改了 fetchProjectList 内的逻辑时，因为我们已经在用户事件响应函数中主动控制了请求的触发时机，而不是让请求在 useEffect 中“自动触发”，所以我们只需要找到所有引用 fetchProjectList 的地方就可以了，一步搞定：  
  
不过这样实现还有一个细节差异：对比 useEffect 的实现方式，这里的 fetchProjectList 需要增加 params 入参。我曾设想过为什么不能像类组件的 this.setState 一样增加第二个回调函数参数：  
为什么副作用逻辑响应式会有上述难以排查实际调用方的问题，但是对于 UI 视图响应式设计我们貌似没有感知到类似的问题，我认为主要是因为副作用逻辑大多时候会有多个状态依赖，但是阅读和梳理 UI 视图逻辑时，我们一次大多只看一个状态即可，比如：“list 数据从哪来？”、“visible 什么时候会变成 true ？”等等。而且 UI 响应式（或者说状态机的设计）确实比上一代直接操作 DOM 的开发模式要便捷。  
如果你平常也是这么使用 useEffect 的，却没有明显地感受到这个问题，可能是因为你对当前在开发的前端工程非常熟悉（代码都是你写的），或者对这一类功能的逻辑非常熟悉（比如常见的列表查询），你自然地能想到测试重点而不用仔细梳理代码逻辑，这个其实就是严重依赖开发者的素质和业务知识传递的效率。  
当我们逐渐习惯在一些相对简单的功能场景中把这类副作用逻辑都写在 useEffect 中后，某一天我们要去实现一些逻辑更加复杂的交互功能时，会自然而然地去保持这种研发习惯，在正向开发的时候你可能感受不到大的阻力，但是当开发完成后，换另一名同事来进行 Code Review 时，不提前了解需求的情况下根本不能快速看懂代码逻辑。  
举一个比列表翻页再略微复杂一点的示例让大家更清晰地感受到这个问题。比如在一个项目详情页中，每个项目都有若干个公告，用户可以单选某个公告，被选中的公告会自动展示相关的发布信息和问题反馈信息：  
这个示例和官方文档提到过的 [链式计算](https://zh-hans.react.dev/learn/you-might-not-need-an-effect#chains-of-computations) 很相似，只是这里的 useEffect 中真的有请求数据类的副作用，问题在于我们很难直观地从这种代码中看出来某个用户事件被触发之后，JavaScirpt 到底会执行些什么逻辑，并且真实项目中不可能有这么多注释，并且在一些逻辑更加复杂的用户事件处理函数中，可能需要同时触发提交类接口请求和数据查询类接口请求。  
所以我们去掉注释，根据实际业务需求来编码，而不是一股脑将所有请求都放到 useEffect 中，由用户事件触发的副作用逻辑都移到 select 事件响应函数中：  
**改写之后逻辑变得清晰多了，自定义 Hook 之间的联动逻辑变成了简单的串行或者并行逻辑。**但你可能发现代码行数突然变多了，因为我们把很多原本自定义 Hook 中的函数和 state 都临时挪了出来，本文后续会在介绍我们的 useEffect 的替代方案时再讨论如何封装一个自定义 Hook。  
这里再提一个很重要的点，改写后代码的 handleAnnouncementRowSelect 事件处理函数，其实还做了子函数的拆分。并不是只有代码需要复用时我们才应该创建子函数，强烈推荐所有人都阅读一下[《 Code Complete 代码大全 》](https://book.douban.com/subject/1477390/)中的第 7 章 “高质量的子程序” 学习如何通过拆分子函数降低逻辑复杂度、对关键过程进行抽象。比如一个更复杂的提交操作，如果按书中介绍的原则来写，不论过程多么复杂，逻辑都会很清晰：  
不过要让事件响应函数中的代码都写成这种非常优雅的串行逻辑，其实需要一些额外的前端技巧。因为很可能其中一个中间过程是唤起一个弹框让用户在弹框中执行一些操作，那么我们在事件响应函数中的逻辑很可能就会以 setSomeModalVisible(true) 结尾，但其实整个提交过程才执行了一半，导致事件响应函数中无法包含完整的处理逻辑。这种时候往往需要我们从当前的事件响应函数末尾跳跃到 handleSomeModalOk / handleSomeModalCancel 这些弹框类组件的事件回调中继续阅读代码。不过这是另一个话题了，不属于本文范畴，准备以后另外开坑再来讨论。  
混乱的编码抉择  
回到上述后台列表翻页的场景，两种请求数据的实现方式（useEffect 和事件响应函数）我们可能都在业务代码中看到，但是对于另外一些数据请求的副作用，我们却大多不会选择 useEffect 来实现。比如有文章展示页面，需要点击“展开详情”按钮才会触发详情接口请求，我们大多会直接写在事件处理函数中：  
如果使用 useEffect 来实现则有种脱裤子放屁的感觉，代码如下：  
还有一些接口请求类的副作用逻辑，根本想不到会去用 useEffect 来实现：  
那上述的几个例子中的接口请求类副作用差异点在哪呢？仔细分析之后会发现有以下几个关键点：  
1这个副作用逻辑会不会在 didMount 时触发？会不会在用户事件中触发？  
2若会在用户事件中触发，是否也会触发 state 状态变化？并且对应的 state 状态是否会作为副作用逻辑的入参（比如请求的入参）？  
  
基于以上几个关键点，对副作用进行分类梳理：  
  
可以从梳理结果中看到，其中有三个场景都可以有两种实现方式，并且选择实现方式时的标准非常模糊。  
所以为了保持代码结构一致性，以及确保函数调用关系的完整性，对于这个问题我们的结论很明确：由用户事件触发的副作用逻辑，禁止使用 useEffect 来实现，直接实现在对应的用户事件中即可。  
4、useEffect 解决不了的问题  
继续上述的副作用分类话题，对于“只需要 componentDidMount 中触发的副作用”，其实这个描述并不准确，当我们用 useEffect 实现这类问题时，为了解决闭包问题，实际上设置监听类的逻辑会在依赖变化的时候反复触发，这和在类组件中设置监听完全不同：  
当 stateA 或 stateB 不断变化时，在不停地执行 removeEventListener -> addEventListener -> removeEventListener -> addEventListener -> removeEventListener -> addEventListener ......  
OK，至少功能没问题就行，CPU 也不会有情绪，并且开发者日常可以忽略这个事情，正常根据 ESLint 规则去给副作用添加标准的依赖即可。但下面有几个特殊的场景：  
定时器功能异常  
功能描述：页面上有个 Input 输入框，用户随时可以修改，然后希望每秒打印一下 Input 输入框中当前的值。  
非常标准的 useEffect 用法，但是在用户频繁输入导致 inputValue 变化间隔小于 1 秒时，会导致在这期间内所有的定时器都还没触发过就被清除了，即这个 log 逻辑在用户频繁输入期间是失效的。有一个常规的解决方案就是另起一个 ref 去实时同步 inputValue 的值（虽然这违背了最小状态量的原则）：  
你可以说这种是低级问题，笔者水平不够，这种问题本来就应该用 ref 来解决，好玩的是我去问了好几个 AI（其中 ChatGPT 用的是免费版），问题描述如下：帮我用 react 函数组件实现一个功能：页面上有个 Input 输入框，用户随时可以修改，然后希望每秒打印一下 Input 输入框中当前的值。  
除了 DeepSeek 之外的 AI，首次回答都完美踩坑，只有 DeepSeek 直接想到了要用 Input 自带的 ref 拿到 DOM 元素从而获取输入框的值，还节省了同步逻辑，牛啤！  
为什么我们以前没注意到这个问题呢，因为大多数情况下状态变化不会这么频繁，误差也仅出现在状态变化的时候，产品功能上大多都没感知到这点误差，但从逻辑上这是不严谨的。并且这个功能如果用类组件来实现时，完全不会遇到这个问题：  
不应该的 WebSocket 性能问题  
和设置定时器类似，设置 WebSocket 通信这个场景并不会因为依赖状态的变化导致功能问题，但是会导致性能问题，因为这时候不像 addEventListener 那样只是不断使唤 CPU，而是重复调用网络 IO 接口进行 WebSocket 建连和断连，要不断使唤网线了（大误）。  
解决这个问题的常规思路也是额外创建 ref，把 state 和 props 在 ref 中同步额外维护一份：  
一样的还有如果用类组件来实现时，也不会遇到这个问题，这里就不写代码了。  
5、错误使用 useEffect  
缺乏警示性  
关于这个话题，官方文档有单独的文章来说明[《 你可能不需要 Effect 》](https://zh-hans.react.dev/learn/you-might-not-need-an-effect)，我要补充的观点是，因为 useEffect 聚合了太多能力，在一些场景不够有警示性，导致真的有人写错了的时候，在 Code Review 环节容易被忽略。  
比如下面这个真实的低级错误：  
如果这个代码中没有命名规范的问题，其实就是官方文档中提到过的错误示例[根据 props 或 state 来更新 state](https://zh-hans.react.dev/learn/you-might-not-need-an-effect#updating-state-based-on-props-or-state)，在这个场景中根本不需要 useState 和 useEffect，直接在组件内转换 props.projectList 成一个常规的变量即可：  
站在犯这个错的新手开发者角度：工程中到处都在用 useEffect，学习路径中可能并没有很明显感知到这个问题，并且目前为止功能没出问题。  
站在 Code Review 执行者角度：没想到 changeIds 竟然是一个 setState 方法，因为显示器一屏没法同时看到 useState 和 useEffect，想当然地以为 changeIds 里面包含了副作用逻辑。  
但是在类组件中，这个功能需要在 componentDidUpdate 这个独立的生命周期中去实现，当我们看到 componentDidUpdate 的时候，应该就有一种 danger 危险的感觉，习惯性要去多看一眼，因为用到这个 API 时很多人都会犯错误。官方文档在生命周期的介绍文章中也明确指出过：  
  
找不出问题的错误用法  
如果上面的例子是稍微有一点 React Hook 研发经验的开发者都可以避免的，我们再来看下面这两个例子：  
乍一眼看这些 useEffect 会觉得没什么问题，因为完整的官方 useEffect 错误示例教学[《 你可能不需要 Effect 》](https://zh-hans.react.dev/learn/you-might-not-need-an-effect#notifying-parent-components-about-state-changes)中也没有提到这种很常见的情况。我甚至去问了很多目前流行的 AI 大模型“这个代码有什么问题吗”，所有的 AI 都没有指出：   
这两个示例中的 setTipModalVisible / setSelectedProjectId 并不是副作用逻辑，理论上不应该放在 useEffect 中，因为这些代码都是用监听思维而不是副作用思维写出来的，并且像 useUserInfo 这类封装了 useEffect 的基础业务 Hook 会不断地引导我们去写一些监听类的逻辑，形成恶性循环。  
6、问题小结  
最后再总结一下我们在 useEffect 实际使用中遇到的各类问题：  
1空数组的 useEffect 存在明显的语义化问题；需要书写依赖项时，准确声明依赖项和保留清晰的代码意图之间又存在无法调和的矛盾。  
2当 useEffect 的依赖中出现用 useCallback 包裹的函数，代码中会出现大量的关于依赖项声明的冗余代码，且目前看来这些繁琐而没有业务意义的工作难以自动化，一直需要开发者人工维护。  
3useEffect 会引导开发者去编写难以维护的“监听”类的逻辑，这些逻辑在复杂场景下的可读性非常差，只能靠团队规范来避免这种情况。  
4有些场景直接按 useEffect 最标准的方式去实现时会出现功能性问题，无疑又增加了使用难度。  
5useEffect 集合了太多使用场景，一些特殊的场景应该配合更具有警示性的 API，降低开发者犯错的概率；甚至还有一些结合自定义 Hook 的场景中，看上去最合适的方式就是在 useEffect 内书写一些非副作用逻辑。  
  
四、全新的 useInit 解决方案  
1、避开依赖项声明  
在第二章中提到过我不会将由用户事件触发的接口请求写到 useEffect 中。那如果遇到了一个组件的某个 props 确实会变化怎么办？比如  组件的 id 是会动态变化的，需要监听 id 的变化去重新请求项目详情信息。这种情况我会选择利用 key 让这个组件销毁然后重新创建一个新的组件实例：  
官方对于这个特性的介绍：[《 当 props 变化时重置所有 state 》](https://zh-hans.react.dev/learn/you-might-not-need-an-effect#resetting-all-state-when-a-prop-changes)和[《 有 key 的非可控组件 》](https://zh-hans.legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key)，这样每当遇到需要监听的 props 时，优先考虑能否使用 key 这个技巧让原组件销毁，不需要考虑属性变化之后组件内部要如何修改保证可以适应这种变化（重置一些状态等），因为组件一次生命周期内 id 和 bizType 是永远不会变化的。因此我平常很少写 useEffect 依赖，直到有一次参与一个研发周期比较长的重点项目重构，必须要用 addEventListener 设置很多监听器时：  
为了避免闭包问题，必须要在 useEffect 中声明依赖，因为我日常开发完全不会参考 react-hooks/exhaustive-deps 这个 ESLint 校验规则（就是这么倔...），所以只能人工判断在依赖中声明必要的 state 和 props，因为开发周期比较长，我知道后续事件响应函数的实现逻辑肯定会变化，依赖也必定会再次变化，所以我保留了几个 todo 的注释提醒自己。直到项目后期要开始逐渐清理项目中的 todo 时，我发现这几个确认依赖的 todo 最保险的还是在上线当前再清理，因为你不知道上线前会不会有 bug 要改动事件响应函数里的逻辑，所以我想了一个办法来解决这个问题：  
我用 ref 来规避了闭包问题，既然已经规避了闭包问题，那就再也不需要声明依赖，因为这个代码没有很好的可读性（无法自说明），所以我给每个 useEffect 都加了很多一样的注释。再往后就是基于这个模式进行的深入思考和自定义 Hook 设计讨论，最终的产物就是两个自定义 Hook（源码详见 [fool-proofing-hooks](https://github.com/ZCY-FE/fool-proofing-hooks)）：Init Hook 和 Watch Hook：  
2、“重新学习 React Hook”  
在开始介绍这两个 Hook 之前，请大家先忘掉副作用的概念，也忘掉 React Hook，更不知道 useEffect。让时间重新回到 2018 年，你是一个有一定类组件开发经验的前端工程师，你看到 React 正式发布了 React Hook，你开始跟着官方文档学习：  
1先看了 Hook 简介 和 Hook 概览  
2然后学习了 State Hook，也就是 useState 的使用  
3从这里开始打住，在这个“平行世界”里你并没有学习 useEffect 而是学习了 useInit  
  
  
“平行世界”的官方文档：当你想在 componentDidMount 和 componentWillUnmount 这两个生命周期中编写逻辑时，你可以使用 useInit 这个等价于以上两个生命周期的 Hook：  
useInit 基础示例  
useInit 进阶示例  
如何理解 self 和第二个参数 funcMap  
●会被多次异步执行的业务逻辑，都应该封装成方法放到 funcMap 中，类似于在 class 组件中定义了一个单独的事件处理函数，然后 self 就能像 class 中的 this 实例一样去实时访问到没有闭包问题的事件处理函数。  
●声明了 funcMap，那么 useInit  回调中的逻辑就应该只剩下非常少量的代码：  
○设置各类监听器（addEventListener / WebSocket / setInterval 等等），并把 self 上的方法直接作为处理函数。  
○清理对应的监听器。  
  
●funcMap 上 95% 的情况中都只需要声明一个方法，因为代码要做到关注点分离，即一个 hook 只做一件事，而一件事则只应该只有一个入口函数。另外 5% 的场景是考虑到可能部分监听器有多种回调需要处理，或者类似的外部事件需要批量监听，配置不同的 handler。  
  
唯一的陷阱  
如果完全按照上面的说明来定义 funcMap 和使用 self，则不会遇到闭包问题。但是给出最常见的错误示例，也是很重要的：  
在 useInit 的设置监听器逻辑中，已经将如何处理自定义事件这件事抽象在了 handleMyEvent 这个子函数内，那么和处理自定义事件相关的所有逻辑（细节实现、子函数、高阶函数等等）都不应该再出现在 handleMyEvent 中，所以这个功能正确的实现方式是：  
用 useWatch 填补最后的空白  
让我们继续给上面的例子增加复杂度，假设组件 props 接受一个 mode 参数，根据 mode 来决定具体监听什么类型的事件：  
DataComponent 组件要根据 mode 决定监听事件 A 还是事件 B，而 mode 又是一个会变化的 props，且在这个场景中还有另一个 useInit 在 mode 初始化之前会先执行 fetchInitialData 这个动作，若在父组件中等到 mode 异步确定后再渲染 <DataComponent /> 组件，则会导致 fetchInitialData 的执行时机被延后（当然如果业务能接受这点性能差异，那这么做是最简单的）。  
 基于 mode 的 if 逻辑明显属于设置监听器逻辑的一部分，所以这个 if 逻辑就应该实现在 useInit 中，但是当执行 useInit 回调的时候，mode 的值肯定是 pending，出问题了。  
其实我们可以先想象一下如果用类组件这个功能该如何实现。既然 mode 是会被父组件异步初始化的，那必然不能将设置事件监听器的逻辑写在 componentDidMount 中，必须要用到 componentDidUpdate 这个生命周期：  
当一个功能我们在类组件中只能通过在 componentDidUpdate 中判断属性或状态的变化来实现的时候，在函数组件中，我们则可以使用 Watch Hook 提供的 props / state 监听能力来实现：  
谨慎使用 useWatch  
但是要注意 useWatch 是一个 danger 的用于实现监听类逻辑的 Hook，真正适用的场景其实比较少（绝大部分场景有更适合的方案）。当你想用 useWatch 实现某个功能，或者在代码中看到 useWatch 时，请优先确认能否用以下方案实现这个功能：  
●如果要监听的依赖项是自身 state：  
○优先让当前组件在 setState 的时候通过函数调用直接触发对应逻辑。  
●如果要监听的依赖项是 props：  
○如果这个 props 在整个组件生命周期中都是不会变化的，那么请使用 useInit 来实现这个逻辑。  
○如果这个 props 只是需要进行异步初始化，则可以在父组件中等异步初始化完成后再渲染当前组件。  
○如果这个 props 确实是会不断变化，则：  
■优先考虑在父组件中给当前组件设置 key 实现组件在依赖项变化时自动销毁并创建新组件，具体参考[《 当 props 变化时重置所有 state 》](https://zh-hans.react.dev/learn/you-might-not-need-an-effect#resetting-all-state-when-a-prop-changes)和[《 有 key 的非可控组件 》](https://zh-hans.legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key)。在一些需要异步初始化的业务组件中，可能会出现的 UI 界面抖动问题，可以使用骨架图、CSS Transitions 等方式解决。  
■可以考虑将依赖项变化时要执行的逻辑抽离成独立的函数方法，通过 useImperativeHandle 将函数方法挂载到 ref 上，从而让父组件直接调用该方法，例如一些弹框/抽屉类组件可以通过 ref 向外暴露一些 showModal/showDrawer 方法避免在这些组件内部监听 visible 属性执行部分 state 的重置逻辑。但若 props 透传层级过深，或抽离的函数方法不适合被父组件调用（比如父组件不应该关心这个子组件内部过程），则不适用这个方式。  
  
如果以上方案都不能很好地实现你的功能，那么你才可能需要使用 useWatch。在使用过程中，请注意以下几个点：  
最后在用到 useWatch 的场景中，也建议主动找靠谱的同事进行 Code Review 相互确认一下，以及确保有合适的注释能让代码有较高的可读性。  
至此，现在这个“平行世界”的 React Hook 方案已经介绍完了，在编写平时的业务代码时，相比于原本的 useEffect 方案：  
●你几乎不用写依赖（除了极少数场景需要必须要用到 useWatch 时，要明确要监听的数据是什么）  
●很少会感知到闭包问题  
  
再配合第一章中对于 useCallback 和 useMemo 的观点：PureComponent 式的优化方案在迭代中是极其脆弱的，应该优先用其他方式解决性能问题：  
●你完全不用写 useCallback，是的我们顺便也消除了 100% 的 useCallback  
●你几乎不会用到 useMemo（仅在基于 state / props 进行昂贵的衍生计算时需要使用）  
  
PS: 不过在写一些需要封装到 npm 包中的非常基础的业务 Hook 时，因为考虑到 npm 包引用方的环境不可控（比如除了修复问题之外不再进行功能迭代的历史项目工程），在确保代码质量的前提下，在向外暴露变量时还是要尽量用一下 useMemo 和 useCallback 正确包裹。  
回顾第三章中提到的所有 useEffect 的问题，我们的新方案基本都很好地解决或者规避了。  
Perfect ! 立马在团队内找几个前端工程试行这套新的 React Hook 编码范式，以后新的需求对应的实现代码不允许再使用 useCallback和 useEffect。  
3、自定义 Hook 设计问题  
依赖异步数据的初始化逻辑  
在试行这套新的方案时，很快我们遇到了一个问题，useInit 和很多原有的自定义 Hook 不太兼容，例如我们原本封装了一个公共的自定义 Hook 叫做 useProjectInfo：  
当某次迭代中，服务端在接口返回中增加了一些配置信息或者需要将 projectInfo 中的部分数据单独作为 state 时，原本用 useEffect 我们可能会这么写：  
这种代码 useEffect 用法在我们团队中是比较常见的，我们用 useWatch 也能实现：  
但是如果这么玩，useWatch 的使用也会在工程中泛滥，这种用法根本不在我们 useWatch 的设计预期内，因为这些逻辑本质上还是属于组件初始化阶段的一次性逻辑，所以我们尝试过新增了一个 Hook 支持这种依赖异步数据的组件初始化逻辑（目前该 Hook 已被废弃）：  
相比于 useEffect 和 useWatch 语义化确实更强了，也能复用各种已有的业务 Hook，而且还可以同时处理多个异步依赖：  
看起起来很不错，除了 isReady 的判断有点丑，但如果某个页面在迭代后 articleInfo 和 announcementInfo 的请求入参中需要额外传入 projectInfo 中的部分数据（这里不讨论服务端接口合并，这是两个话题），我们不得不调整自定义业务 Hook 中的逻辑，让他们支持类似 ahooks 中的 [useRequest 手动触发模式](https://ahooks.js.org/zh-CN/hooks/use-request/basic#%E6%89%8B%E5%8A%A8%E8%A7%A6%E5%8F%91)：  
或者我们干脆也让 useProjectInfo 支持 manual 模式，这样我们也就可以用回 useInit 了：  
关于自定义 Hook 的额外规范  
例子说完了，分析以上场景，感觉 useInitWhenReady 在一些场景中确实有必要，那我们为什么还是把这个 Hook 废弃了呢？其实主要是回到了我们第一章中的观点：“代码意图的正确传达”和“保持代码结构一致性”。  
●在最后示例中，使用 useInit 的代码语义化明显好于 useInitWhenReady，因为只看这十行左右的代码，你无法知道 projectInfo 是从哪来的。其实很多时候如何判断语义化是否优秀，可以把代码当作自然语言（中文 / 英语）来阅读，越通顺越好，这样才能更好地确保代码意图的正确传达。  
●在上面的几次迭代中，因为多了一个 Hook 之后实现方式的选择变多，导致我们的代码结构在不断地变化：  
○引入 useInitWhenReady  
○修改部分自定义业务 Hook 额外支持 manual 手动模式  
○修改全部自定义业务 Hook 额外支持 manual 手动模式  
○删除 useInitWhenReady 改回 useInit  
○......  
○而且我们完全有理由去猜测，以后 useInitWhenReady 会被用在一些不在设计意图内的错误场景中，比如下面这种骚操作：  
  
所以最后的结论是弃用 useInitWhenReady，并在我们全新的 React Hook 编码范式中，对所有的业务自定义 Hook 设计有一层额外的约束：  
●封装了业务接口请求的自定义 Hook 只能包含状态和函数的定义，不能在自定义 Hook 内包含会自动执行的逻辑，即不能包含 useInit 和 useWatch 这两个 Hook。  
●不过可以将 useInit 和 useWatch 其封装到绑定监听器类的自定义 Hook 中（例如 [useOnlineStatus](https://zh-hans.react.dev/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component)），因为绑定监听器的逻辑一般不会有执行顺序要求，而且监听回调本质上也不是由组件内部触发的。  
  
那么所有常见的数据请求类的自定义 Hook 都应该是类似这样的，有点类似只支持 manual 手动模式的 [useRequest](https://ahooks.js.org/zh-CN/hooks/use-request/basic#%E6%89%8B%E5%8A%A8%E8%A7%A6%E5%8F%91)，但和 useRequset 不同的是，无论是手动触发请求的函数还是 Hook 本身，都会返回 state，一个用于 UI 渲染，一个用于 JS 逻辑：  
这种封装方式既保证了良好的可读性，只看所有的 useInit 就可以清晰地了解初始化逻辑。也确保了在不断的需求迭代中，代码整体结构尽量不发生大的变化，因为所有的初始化逻辑调整都将收敛在 useInit 中：  
不过这样自定义 Hook 设计规范后期是无法实现目前社区中 SWR 类的缓存优化的（例如 [useSWR](https://swr.vercel.app/zh-CN)）。不过在这个 [useSWR 的入门示例](https://swr.vercel.app/zh-CN/docs/getting-started) 中，我倒认为  用受控组件形式去接收 user 对象也没啥大问题，如果在使用了 useSWR 后当这个 Navbar 组件需要跨业务场景复用时，你反而会发现这个组件和具体数据接口耦合了。还有一些确实要在短时间内减少网络接口请求的场景中（比如移动端弱网场景），其实可以先让服务端先用传统的 HTTP 缓存策略进行优化，这样的缓存策略也不会入侵到前端代码，且哪些接口能缓存、可以缓存多久本来就是服务端要评估和维护的。  
至此，对于我们新的 React Hook 编码范式的介绍已结束！  
五、Effect 和“同步”  
在梳理完本文第三章中描述的那些问题时，我首先想到的就是用一个新的方案去代替 useEffect，但是当我们要推广和介绍 useInit 方案前，真正理解 Effect Hook 是很有必要的，所以本章将较为深入且辩证地讨论 Effect Hook 的设计哲学，并涉及到了几个关键的问题：  
1为什么 React Hook 要引入**副作用（Side Effects）**这个概念，以及 React 中的 Effect 表示什么？  
2React 官方文档为什么没有强调不应该用 Effect 处理用户事件（包括获取数据），而只是委婉地提了一句，甚至举了很多充满迷惑性的示例。  
3支持了 React Hook 函数组件为什么选择了同步的心智模型（useEffect），而不是继续沿用生命周期的心智模型，否则当初官方完全可以搞一套类似 useMount / useUpdate / useUnmount 的 Hook，前者到底好在哪？  
  
1、Side Effects  
函数式编程  
首先，副作用（Side Effects）的概念应该是来源于函数式编程，因为我其实并不了解函数式编程，所以问了下 DeepSeek，以下是 DeepSeek 回答的部分内容：  
  
不可变数据 很好理解，比如 JavaScript 中通过字面量形式创建的对象、数组等引用类型数据，都是可变的数据，变量定义好了之后可以在任意能访问到这个变量的地方去修改对象、数组。我们可以通过 Object.freeze 或者借助其他第三方库创建不可变的数据。  
那什么是 纯函数 呢？继续问：  
  
OK，现在关于 函数式编程、纯函数、副作用 的概念很清晰了。  
useEffect 的 Effect  
再来看 React 对于 Effect 的定义：  
  
从 React 官方介绍中可以看出，在 React 中有两个地方可以触发副作用（改变程序状态或外部系统的行为）：  
●由用户事件触发的副作用，比如用户点击事件的事件响应函数中触发了一个 HTTP 接口调用，或读取了 localStorage 中的值等。  
●渲染过程自身引发的副作用，比如根据 title 这个 state 去修改 document.title，或根据 URL 中的 query 参数去查询数据等。  
只有前者才被定义为 Effect，所以我们完全可以为 useEffect 是 useSideEffectNotTriggeredByUserEvent 的简称，因为在这个定义中由用户事件触发的副作用完全不属于 Effect ！  
果然只是我们用错了 useEffect，这么看来如果正确使用 useEffect ，那么根本就不会遇到本文第三章中“过度的响应式编程”里提到的问题。然而我 Google 简单搜了下，在 2023 年 6 月（新版官方文档发布）之前，绝大部分关于 Hook 的讨论都没有提到这个观点，我只搜到 [《 为什么你不应该在 React 中直接使用 useEffect 从 API 获取数据 》](https://blog.skk.moe/post/why-you-should-not-fetch-data-directly-in-use-effect/) 这一篇技术文章提到了一句“绝大部分触发网络请求的原因都是用户操作，应该在 Event Handler 中发送网络请求”。所以即使官方文档这么定义了，由用户事件触发的副作用不属于 Effect 并不是开发者的共识（可能因为官方举的文字示例都是由用户事件引发的提交类 HTTP 接口，但是查询类 HTTP 接口一样属于副作用）。  
React 中的副作用  
当我继续认真对比 函数式编程 和 React 中副作用的概念时，我还发现了一个问题：如果改变函数外部状态的行为都属于副作用，那么 React 函数组件中的 setState 是不是也应该属于副作用，而且函数组件执行过程中的入参是 props，在整个组件的生命周期中，即使 props 不变，函数组件返回的 JSX 是不固定的，因为每次 update 函数组件都从函数外部读取了可能会变化的 state 状态。  
但是看官方对于 Effect 的各种示例中从来没有提到过 setState，也从来没有说过 setState 不是副作用，所以我只能调戏 DeepSeek 了，我新建了三个会话（避免在大模型一个会话里根据上下文出现墙头草行为）分别问了以下三个问题：  
1为什么 React 函数组件中的 setState 属于副作用？  
2为什么 React 函数组件中的 setState 不属于副作用？  
3React 函数组件中的 setState 是否属于副作用？  
  
从 DeepSeek 的回答中，我也感受到了正反两种观点，不过第 3 个问题的回答是认为 setState 不属于副作用的。在这几个问题的回答中，最能说服我的可能是 DeepSeek 提到的以下这部分观点：  
  
  
React 只是借鉴了函数式编程的思想，特别是将视角限定在函数组件的单次渲染时，setState 并没有修改因闭包而形成的时间切片中 state 的值（在这个比喻中类组件的 this 和函数组件的 ref 就像是可以穿越到未来的时光机）。  
2、重新认识 useEffect  
在知道了由用户事件触发的副作用不属于 Effect 后，我就在想本文第三章提到的这些问题会不会都是错误使用 useEffect 造成的？所以我决定重新仔仔细细地看一遍 React 官方文档。又恰好 2023 年 6 月上线了新的 React 官方文档[《 介绍 react.dev 》](https://zh-hans.react.dev/blog/2023/03/16/introducing-react-dev)，在新版官方文档的教程中已经完全抛弃了类组件和生命周期的概念，因此我也可以体验一下从零开始的 React Hook 学习路径。  
脱围机制 vs 基础 Hook  
首先通过观察新版官方教程中 [《 脱围机制（Escape Hatches） 》](https://zh-hans.react.dev/learn/escape-hatches) 左侧的目录设计，你会发现 ref 和 Effect 等的介绍都归属于“脱围机制”，官方文档也指出了这是一个高级的功能，并且和“脱围机制”这个名字表示的意义一样，官方也说了大多数应用不应该用到这些功能。  
  
然而这和我们日常的感知是截然相反的，我从来没见过哪个用到了 React Hook 的前端页面可以不使用 useEffect 来实现业务功能。为什么 useEfect 不像 useState 一样是被作为一个必要且基础的 Hook 来介绍，而是当作一个貌似 React 初学者可以先不用学习的高级 Hook 来介绍，我不理解。  
陡峭的 useEffect 学习曲线  
我们继续看官方对于 useEffect 的介绍过程，总共分了五章  
1[《 使用 Effect 进行同步 》](https://zh-hans.react.dev/learn/synchronizing-with-effects)介绍了 useEffect 正确的使用方法，如何确定 useEffect 依赖项。  
2[《 你可能不需要 Effect 》](https://zh-hans.react.dev/learn/you-might-not-need-an-effect)介绍了一些不应该使用 useEffect 的场景。  
3[《 响应式 Effect 的生命周期 》](https://zh-hans.react.dev/learn/lifecycle-of-reactive-effects)分析了 useEffect 回调函数的触发逻辑。  
4[《 将事件从 Effect 中分开 》](https://zh-hans.react.dev/learn/separating-events-from-effects)这个标题很怪，其实是介绍了在一类特殊的场景中，如果用原来官方标准的判断 useEffect 依赖的方式去实现，则会遇到功能性问题，为了应对这个场景而介绍了一个还没有发布的实验性 Hook 及其对应的局限性。  
5[《 移除 Effect 依赖 》](https://zh-hans.react.dev/learn/removing-effect-dependencies)强调了依赖项必须和回调中实际的引用情况保持一致，以及保持了一致却还是出现问题时要如何调整代码和依赖项。  
  
当我把自己想象成一个初学者时，我认为前两章还可以接受，但是再加上后三章，我不得不说相比于老版官方文档，新版文档对于 useEffect 的介绍实在是太详细了，面面俱到，而且如此之多的章节和示例，真的能让大部分开发者学明白吗？  
下面这个图真的不只是搞笑的（我现在就认为 useEffect 就是构建屎山的一把利器）：  
  
我后来统计了一下官方文档的中文字符数，介绍 useEffect 这一个 Hook 的 5 篇官方中文教程（除去两侧的目录和每篇教程底部的挑战习题）加起来大概有 2.9w 个中文字符。  
  
作为对比本文全文也有大概 3w 个中文字符（快逃！），但是其中介绍 useEffect 替代方案的第四章中文字符还不到 7k，不到官方文档的四分之一，而且还介绍了两个 Hook，平均一个 3.5k，简直物超所值！   
用户事件触发的接口请求  
React 官方文档中从用途上把 HTTP 接口请求的概念分为了“数据请求”（应该指 GET 请求）和“POST 请求”。  
阅读 [《 你可能不需要 Effect 》](https://zh-hans.react.dev/learn/you-might-not-need-an-effect) 这个章节时，我对于其中关于“由用户事件触发的接口请求”的描述和示例产生了极大的困惑。其中 [如何移除不必要的 Effect](https://zh-hans.react.dev/learn/you-might-not-need-an-effect#how-to-remove-unnecessary-effects)、[发送 POST 请求](https://zh-hans.react.dev/learn/you-might-not-need-an-effect#sending-a-post-request)、[获取数据](https://zh-hans.react.dev/learn/you-might-not-need-an-effect#fetching-data) 这三个小节都提到了相关描述和示例：  
  
对于 如果使用 Effect 来处理用户事件，当一个 Effect 运行时，你无法知道用户做了什么（例如，点击了哪个按钮） 这个说法，我非常非常认同，也就是本文在第三章中“过度的响应式编程”里提到的，使用 useEffect 时会丢失“从用户行为到接口请求”之间的函数调用关系，特别是当页面逻辑变得复杂时会让这个问题成倍地放大。  
然而在 [获取数据](https://zh-hans.react.dev/learn/you-might-not-need-an-effect#fetching-data) 中，却说分页请求的逻辑放在 useEffect 中没有问题，但是我们之前看过 React 对于 Effect 的定义其实是 side effects that are not triggered by user events，而这里乍一眼看上去就是用户点击下一页等交互操作触发的接口请求：  
  
按照示例中对代码逻辑的分析，我理解完整的代码应该是 query 在父组件中并不是一个 state 状态，用户每次修改关键词后事件处理函数会将其自动填充到当前的 URL 中，路由更新让父组件重新渲染，父组件从 URL 中读取 query 参数并传递给子组件：  
基于这个设定确实 query 的变化不是由用户事件直接触发的，所以文中 query 的来源不重要 这句话勉强说得通。但是从 handleNextPageClick 触发的翻页逻辑中看出，表示页码的 page 状态并不需要填充到 URL 中，是一个很常规的用户事件直接触发接口请求的逻辑，那么文中 page 的来源不重要 这句话就是完全错误的，因此点击下一页按钮触发的数据请求，就应该放在事件响应函数中，所以代码应该这么写：  
调整过后的代码的功能和原来完全一样，但是你会发现 useEffect 中的依赖项数组中只有 query，而回调函数中却依赖了 query 和 page 两个状态！所以我怀疑是因为这样写会导致依赖项和 react-hooks/exhaustive-deps 这个 ESLint 规则相冲突，所以官方的这个示例中就把所有的副作用逻辑都实现在了 useEffect 中，因为和 ESLint 规则冲突本质上是和 useEffect 的设计理念相违背了，参考[《 使用 Effect 进行同步 》](https://zh-hans.react.dev/learn/synchronizing-with-effects#step-2-specify-the-effect-dependencies)和[《 useEffect 》](https://zh-hans.react.dev/reference/react/useEffect#reference)中关于开发者应该如何书写依赖项的描述：  
  
  
不过如果从监听思维来解读修改后的代码是很好理解的：我们要监听 URL 中 query 的变化，一旦 query 变化后，就执行请求逻辑，请求逻辑会用到哪些状态和监听什么并没有直接关系。  
所以我个人认为，当你不需要把状态同步到 URL 中时，我们是不应该使用 useEffect 的，补充说明[《 你可能不需要 Effect 》](https://zh-hans.react.dev/learn/you-might-not-need-an-effect)中开头说那句话就是：  
绝大多数情况下，你不必使用 Effect 来处理用户事件（包括 GET 请求），请优先将用户事件相关的副作用逻辑写在事件处理函数中！  
绝大多数情况下，你不必使用 Effect 来处理用户事件（包括 GET 请求），请优先将用户事件相关的副作用逻辑写在事件处理函数中！  
绝大多数情况下，你不必使用 Effect 来处理用户事件（包括 GET 请求），请优先将用户事件相关的副作用逻辑写在事件处理函数中！  
然而我发现这么重要的事情，其实并不是 React 开发者们的共同认知，因为在 2018 年 React Hook 发布时的老版的官方文档中也没有提到不应该用 Effect 来处理用户事件，2023 年新版官方文档提出这个观点时，也只是配了这么一个充满迷惑性的 [获取数据](https://zh-hans.react.dev/learn/you-might-not-need-an-effect#fetching-data) 示例。  
我真的觉得这个事情的重要程度完全值得将 useEffect 改名为我前面所说的 useSideEffectNotTriggeredByUserEvent，因为 useEffect 这个名字就像有魔法一样，不断地在吸引开发者把所有的副作用逻辑尽可能地放到里面。  
更迷惑的是，官方教程还基于这个例子教你把 useEffect 进一步封装成自定义 Hook，并不是这个例子错了，而是这样会进一步引导开发者认为所有的 GET 请求都推荐这么封装：  
  
但是实际业务代码中，很大部分的由用户事件触发的接口请求，并不需要把接口入参同步到 URL 中，更不应该封装成这样的自定义 Hook，因为这样会进一步加大阅读事件响应函数中代码逻辑的难度，并且修改 useEffect 中的代码时难以评估影响面。   
所以为什么官方教程不在教程最显眼的位置，直接大大方方用一个代码示例告诉我们，这么做是不推荐的，比如：  
我觉得 React 官方是知道这件事情的，却刻意没有使用代码示例来强调说明。如果前端开发者们能在 2018 年就被明确地告知不应该用 Effect 处理用户事件，估计也不会有今天这篇文章。但 2025 年的今天，仅靠开发规范的约束已经完全无法让开发者们达成 useEffect 使用方式上的共识了（更别提本文第三章提到的各种其他问题）。  
为此我又往前看了看官方文档[《 使用 Effect 进行同步 》](https://zh-hans.react.dev/learn/synchronizing-with-effects#fetching-data)中的另一个 获取数据 的官方示例，这个示例中 useEffect 的依赖项是 userId，可以猜测这确实不是由用户触发的副作用。但是紧接其后的 深入探讨 中，提到了一篇作者为 Robin Wieruch 的博客[《 How to fetch data with React Hooks 》](https://www.robinwieruch.de/react-hooks-fetch-data/)，这篇博客就是“完美地”用 useEffect 来处理了由用户事件引起的副作用，最后甚至还额外加了一个 UI 渲染时用不到名为 activeSearch 的 state 作为 useEffect 的依赖项实现点击搜索按钮触发接口请求：  
  
我认为这简直是魔怔了，首先在 UI 渲染中用不到的变量，不应该定义为 state，其次 Effect 的定义是 由渲染自身引起的副作用，而 activeSearch 的变化并不会改变 UI 视图，所以这个 useEffect 其实是用监听思维写出来的！  
但是官方认为这个示例的问题不在于用 useEffect 来处理了由用户事件引起的副作用，也不在于用监听思维使用 useEffect，而在于直接使用 useEffect 无法支持 SSR、可能会产生网络瀑布、无法进行缓存优化、需要手动处理竞态条件等等：  
  
官方文档推荐了一些支持缓存的请求库，比如 [React Query](https://tanstack.com/query/latest/docs/framework/react/examples/pagination) 和 [useSWR](https://swr.vercel.app/zh-CN/docs/pagination)，然而在将业务中所有的获取数据逻辑都用这些类库来实现时，本质上其实也都是在用 useEffect 来处理由用户事件引起的副作用：  
  
  
被推荐的方案还有例如 [Next.js](https://nextjs.org/) 等的框架，这些框架支持了 [](https://zh-hans.react.dev/reference/react/Suspense#reference) 和流式服务器渲染（Streaming Server Rendering）等能力，对服务端渲染的支持上非常好，体现了 React 强大的生态。  
不过以上这些优化方案都是有适用场景的，当我们要构建一些有复杂交互逻辑的页面时，往往不需要用到以上的优化手段，我们需要的是先把代码逻辑写得足够清楚！  
所以我认为 React 没有在官方文档中着重强调“不应该用 useEffect 来处理由用户事件引起的获取数据类副作用逻辑”，是因为解决缓存、服务端渲染等问题的各种优化方案，非常适合用封装了 useEffect 的自定义 Hook 来实现，因此很自然地也顺带将所有的获取数据逻辑（不管是否由用户事件触发）都放到了 Effect 中，即便这和 Effect 的设计理念相冲突。  
强烈建议所有开发者评估一下对应的业务形态，如果前端交互逻辑是比较复杂的，并且不需要用到以上这些优化方案，请谨用 useEffect，更建议完整看完本文后考虑下是否要替换 useEffect 这个 Hook，否则随着产品功能的不断叠加，基于 useEffect 构建的页面会大大降低研发效率。  
在请求方法中处理竞态条件  
[获取数据](https://zh-hans.react.dev/learn/you-might-not-need-an-effect#fetching-data) 中也提到了 竞态条件 问题，但是这种场景下肯定是要优先使用防抖 debounce 来处理高频的用户输入事件，一般情况下防抖处理后出现竞态问题的几率就很低了，这也是为什么大多数情况下我们并没有感知到竞态问题的原因。  
但如果网络环境长期波动，或者服务端处理请求的时间有较大波动，我们还是要想办法解决竞态问题。同时我们依旧要避免将由用户事件触发的副作用逻辑实现在 Effect 中，所以解决方案就是直接在请求方法中处理竞态条件：  
牵强的 useEffectEvent  
[《 将事件从 Effect 中分开 》](https://zh-hans.react.dev/learn/separating-events-from-effects)这个章节的标题很绕，这一章其实是介绍了一类特殊的场景，如果用原来官方标准的判断 useEffect 依赖的方式去实现，则会遇到功能性问题。为了解决这个问题，官方介绍了一个还没有发布的实验性 API [useEffectEvent](https://zh-hans.react.dev/reference/react/experimental_useEffectEvent)。  
这一类特殊的场景，如果我们用监听思维去使用 useEffect 时，就很好描述：useEffect 要监听的依赖项和 useEffect 回调中实际要使用的依赖项不一致（其实就是本文第三章的“不应该的 WebSocket 性能问题”和“找不出问题的错误用法”中提及过的问题）。  
  
在截图的示例中，开发者的“本意”是只想监听 roomId，但是 useEffect 回调中依赖了一个会不断变化的 props.theme：  
●如果不把 theme 放到 useEffect 依赖中，则会遇到闭包问题，notification 提示中的 theme 可能会是旧的值。  
●如果把 theme 放到 useEffect 依赖中，每次 roomId 没变，只是 theme 变化时也会重新断连和建连并通过 notification 通知用户。  
  
陷入了两难，所以官方引入了一个实验性 API [useEffectEvent](https://zh-hans.react.dev/reference/react/experimental_useEffectEvent) 来解决这个问题：  
  
从官方文档的介绍来看，我认为 useEffectEvent 的实际功能和 ahooks 中的 [useMemoizedFn](https://ahooks.js.org/zh-CN/hooks/use-memoized-fn/) 没有任何区别，分析 useMemoizedFn 的 [源码](https://github.com/alibaba/hooks/blob/master/packages/hooks/src/useMemoizedFn/index.ts) 可以发现，其实 useMemoizedFn 也是利用了 ref 来保持引用地址不变并在每次组件 update 时更新函数内部实现，从而绕过了闭包问题，即用 useEffectEvent / useMemoizedFn 包裹后函数可以一直访问到最新的 state / props。不过 ahooks 中对 useMemoizedFn 的定位是性能优化，解决闭包问题则推荐用 [useLatest](https://ahooks.js.org/zh-CN/hooks/use-latest) 包裹单个的 state 或 props，但是我个人觉得 useMemoizedFn 来解决闭包问题比 useLatest 更合适。  
而 useEffectEvent 和 useMemoizedFn 唯一的不同可以通过下一个官方示例可以感受到：  
  
再次引用[《 使用 Effect 进行同步 》](https://zh-hans.react.dev/learn/synchronizing-with-effects#step-2-specify-the-effect-dependencies)和[《 useEffect 》](https://zh-hans.react.dev/reference/react/useEffect#reference)中提到的关于开发者应该如何书写依赖项的描述：_响应式值包括 props、state 以及所有直接在组件内部声明的变量和函数。_在这个示例中 onVisit 是一个在组件内部声明的变量，却不需要写到 useEffect 依赖中，所以 useEffectEvent 和 useMemoizedFn 唯一的不同就是官方的 ESLint 代码校验会自动忽略由 useEffectEvent 导出的函数，这是一个特例。  
在[《 将事件从 Effect 中分开 》](https://zh-hans.react.dev/learn/separating-events-from-effects)中还写了一篇注意事项来补充说明了另一个问题（截图中的红字是我个人的解读）：  
  
  
不过我感觉 setTimeout 这个例子很牵强，把 url 和 setTimeout 都放到 useEffectEvent 中不就好了：  
官方文档中提到的 [抑制依赖项检查是可行的吗？](https://zh-hans.react.dev/learn/separating-events-from-effects#is-it-okay-to-suppress-the-dependency-linter-instead)也说明了我们平常忽略 ESLIint 代码提示可能会造成的问题（不过这个例子也恰恰体现了本文提出的 useInit 解决方案的优势），并给出了最重要的目的：等 useEffectEvent 成为 React 稳定部分后，我们会推荐 永远不要抑制代码检查工具。     
在 [Effect Event 的局限性](https://zh-hans.react.dev/learn/separating-events-from-effects#limitations-of-effect-events) 中还提到了两条使用上的约定：  
●只在 Effect 内部调用他们。  
●永远不要把他们传给其他的组件或者 Hook。  
  
  
虾仁猪心的时候到了，如果你是从头阅读本文的，你可能会感受到：useEffectEvent 的最核心本质不是一个新的 API（单纯要解决闭包问题可以直接使用 [useMemoizedFn](https://ahooks.js.org/zh-CN/hooks/use-memoized-fn/) 这类 Hook），而是我在第三章“难以自动化”的最后提到过的，如果要在构建时自动化计算出 useEffect 依赖，需要所有开发者对现有代码做一个排查并进行一些“标记”，标记哪些变量是不需要进行 ESLint 依赖项自动检查的。因为自动化的前提就是有一个固定的规则可以让开发者无脑遵循，之前 “响应式值包括 props、state 以及所有直接在组件内部声明的变量和函数” 这个官方规则在某些场景下是有漏洞的，而 useEffectEvent 则填补了这个漏洞。  
不过你应该也能明显地感受到，用 useEffectEvent 来填补这个漏洞非常牵强，因为按照官网说的如何使用 useEffectEvent 这个 Hook 本身就并不无脑，相反你要十分小心地去确保每一个 useEffect 中的依赖项（排除 useEffectEvent 导出的特殊函数）和官方 ESLint 校验规则一致。整件事情让我觉得不是官方 ESLint 插件在帮助开发者提升编码效率，而是在让开发者帮助官方 ESLint 插件提高依赖检查的正确率，可能这也是为什么 useEffectEvent 这个 API 这么久了还一直处于实验性 API 的阶段。  
至于[《 将事件从 Effect 中分开 》](https://zh-hans.react.dev/learn/separating-events-from-effects)这个奇怪的标题，其实就是想要通过“响应式的 Effect”和“非响应式的用户事件”这两个基本概念衍生，从设计思想上引导开发者如何正确地使用 useEffectEvent。  
但其实 React 在 useEffect 这个 API 上就从来没有做到过统一开发者思想：从 2018 到 2025 年，所有的官方文档在介绍 useEffect 时都没有用到“监听依赖项”这类词汇（并且从 useEffect 入参把回调函数作为第一个参数而不是依赖项作为第一个参数），一直用的是“副作用”、“与外部系统同步”等等的概念。然而每次当我们讨论和 useEffect 有关的代码时，绝大部分人说的都是“监听了 xxx 请求得到 yyy”，而不是“yyy 通过网络和 xxx 进行同步”。  
所以我认为这是 React Hook 设计非常失败的地方，因为大部分开发者一直习惯用监听思维理解 useEffect，因此导致各种错误的使用方式层出不穷。而 React 官方的解决方案是继续堆叠这类和普通人习惯性认知相冲突的各种概念，妄想通过不断地“说教”来改变开发者的思维方式。  
最后额外提一句，[useEffectEvent](https://zh-hans.react.dev/reference/react/experimental_useEffectEvent) 或 [useMemoizedFn](https://ahooks.js.org/zh-CN/hooks/use-memoized-fn/) 这类 Hook 导出的函数若作为 render props 传递给子组件时，可能会出现子组件无法及时更新的问题：  
  
关键是这类问题是非常隐性的，如果 Panel 组件不用 React.memo 包裹或者 Page 组件写成下面这样这个问题就被掩盖了：   
  
在类组件中如果将类方法直接作为 render props 传递给 PureComponet 类型的子组件，也会出现这种“渲染优化过度”的情况。不过在函数组件中因为每次渲染时，在组件内定义的函数都是新的引用，其实原本不会出现这类问题。所以使用 [useEffectEvent](https://zh-hans.react.dev/reference/react/experimental_useEffectEvent) 或 [useMemoizedFn](https://ahooks.js.org/zh-CN/hooks/use-memoized-fn/)时还要注意不要用于 render props 这种场景。其实类组件中定义的所有原型方法如果作为 render props 也会有这个问题，因为原型方法的引用地址也是固定的，所以这也是函数组件优于类组件的一个方面。  
声明依赖项增加了复杂度  
[《 移除 Effect 依赖 》](https://zh-hans.react.dev/learn/removing-effect-dependencies)这一章节中强调了依赖项必须和回调中实际的引用情况保持一致，并列举了一些保持一致后还是出问题了的示例及其对应的解决方案，其中部分示例其实在官方文档前序章节都有介绍了。看完这个章节，我除了觉得声明依赖项又复杂又繁琐之外，还想对其中的一个示例提出异议：  
  
这种场景非常非常多，因此忽略 linter 校验的开发者也非常多，而 React 还是一直坚持倡导将 roomId 写到 useEffect 依赖中，我认为将 roomId 写到 useEffect 中反而会让代码丢失开发者的设计意图，即你无法知道这个 roomId 在组件的单次生命周期中到底是会变的还是不会变的。  
当然如果 useEffect 保持空依赖 []，当 ChatRoom 这个组件作为一个需要编写详细文档的基础组件时，需要指出 props.roomId 是不是响应式的，即开发者在首次渲染  时就必须确定 roomId 的值并确保在整个 ChatRoom 组件的生命周期中不会变化。这种情况其实是很常见的，只是大多数此类 Component / Hook 的文档并没有显式地标记出这些属性，比如 ahooks 中的用于生成防抖函数的 [useDebounceFn](https://ahooks.js.org/zh-CN/hooks/use-debounce-fn) 方法，这个方法中的 wait 等参数就不是响应式的：  
我们在项目中可能还看到过直接使用 lodash [debounce](https://www.lodashjs.com/docs/lodash.debounce/) 的代码，但是在函数组件中直接使用 debounce 的代码其实都是不健壮的，因为这样实现的防抖功能在迭代中是非常脆弱的。比如将下面这个示例中的 ButtonA -> ButtonB -> ButtonC 想象成的功能的持续迭代过程：  
  
所以每当需要在函数组件中创建防抖函数时，我们应该在一开始就使用 useDebounceFn 这类封装好的 Hook 工具。回到 ahooks 的 [useDebounceFn](https://ahooks.js.org/zh-CN/hooks/use-debounce-fn) 方法，我们来看一下[源码](https://github.com/alibaba/hooks/blob/master/packages/hooks/src/useDebounceFn/index.ts)：  
  
下面是我尝试在 useDebounceFn 的源码基础上支持所有 options 参数响应式后的满血版 useDebounceFn（代码并没有经过严格的测试，请不要直接用于生产环境）：  
不过这就说明原本 ahooks 官方的 useDebounceFn 这个方法有缺陷吗？我认为完全不是，因为在绝大部分防抖的场景中，wait、maxWait、leading、trailing 这几个 debounce 的参数是不需要变化的（即不需要支持响应式），仅读取初始值完全够用了。在我实现 “满血版” useDebounceFn 的过程中，并不只是无脑让 useMemo 的依赖项和 linter 保持一致即可，还需要额外固定防抖函数的引用地址，以及在 options 参数变化时取消先前的防抖函数对应的在途延迟任务，并且这个代码还没有经过严格的测试，不知道有没有其他 bug。   
众所周知，占用相同的测试资源时，系统的稳定性和复杂度必定是负相关的。当一个功能已经可以满足绝大多数场景时，为了兼容极少部分场景而大大增加系统复杂度是需要进行认真评估的，因为增加了复杂度之后，要保证原本的稳定性，需要投入更多的测试成本，所以我们应该优先考虑能否优化或者调整这些少数场景的实现方式，从而降低整个系统的复杂度。  
在阅读完所有官网文档中关于 useEffect 章节后，我个人更加确信围绕依赖项的各类问题（如何确定依赖项、使用户事件响应逻辑变得难以阅读、忽略依赖检查引发问题、修改依赖困难、代码噪音等等），就是从类组件过渡到函数组件后引入的最大问题。  
3、A Complete Guide to useEffect  
那么到底为什么 React Hook 当初要设计 useEffect 这么一个难用的 Hook 呢？并且我也很好奇，难道别的团队也一直没有感受到这些问题吗？所以我又问了 DeepSeek：  
前端技术社区里有没有批判 useEffect 的观点或者文章等内容？  
  
DeepSeek 提到了 Dan Abramov 的这篇写于 2019 年的文章[《 A Complete Guide to useEffect 》](https://overreacted.io/a-complete-guide-to-useeffect/)，所以我又尝试从这篇文章中寻找 useEffect 设计的由来：  
解释闭包特性  
文章的前三个章节 Each Render Has Its Own Xxx 中解释了在函数组件中，因为闭包特性，其实每次渲染中所有的变量（props、state、事件处理程序）都是一次渲染的快照，以及每次渲染过程中都伴随着一次 effect 的执行（当不传递 useEffect 的第二个参数时）。  
在快照中访问未来的状态  
Each Render Has Its Own… Everything 这个章节中提到了类组件的 setTimeout 中的 this.state.count 会一直取到最新值的问题，并且原文也给出了如何取到点击时的值的解决方案：  
  
类组件中这类代码确实比较脆弱，建议添加上注释表明代码意图，否则在迭代中稍作调整就会意外地读取到最新值/点击时的值：  
而函数组件中，默认只能拿到点击时的值，但是当你想要拿到最新值时，你必须不断地将 count 状态额外同步到 ref 中：  
所以考虑到代码在迭代中的稳定性，虽然函数组件读取最新值代码会更冗余一点，但是这也将两种模式明显地区分开来了，函数组件确实是更优的设计。  
不过文章中还表达了一个观点：_在过去的渲染快照中试图访问未来的状态，是一种逆势而为（Swimming Against the Tide）。_但我认为这两种情况完全没有好坏之分，要拿到最新值还是点击时的值，完全取决于需求目的，两者只是实现功能时不同的选择。而且若按照这个观点去评价的话，那后来提出的 [useEffectEvent](https://zh-hans.react.dev/reference/react/experimental_useEffectEvent) 这个 API 是不是可以说是官方 逆势而为 的方法了，因为这个 API 本质上也是从历史的渲染快照中访问到未来的状态。  
最后，这个话题其实只和闭包有关，与 Effect 关系不大，所以继续看……  
同步思维的由来  
Synchronization, Not Lifecycle 这一章中介绍了同步概念的由来：  
  
原文提到，相比于 jQuery 需要关注 DOM 操作过程，React 生来就只需要关注渲染结果，即在 React 中重要的是目的地，而不是过程。而之前类组件中只有 UI 渲染是关注目的地（没有 mount 和 update 的区别，都是直接执行 render 函数），而生命周期这一套则是面向过程的，因为开发者要感知到 mount / update / unmount 这个心智模型。  
所以在支持了 Hook 的函数组件中不仅仅是 UI 渲染，所有的事物都将只关注目的地。为此函数组件中 UI 渲染之外的所有逻辑（现在被称为副作用），就像 UI 渲染是 根据 props 和 state “同步” DOM，剩余的逻辑也需要开发者改成 用根据 props 和 state “同步” React 组件树之外的事物 的心智模型（而不是原本 mount / update / unmount 的心智模型）进行开发。  
感觉是统一了 React 组件内所有事物的心智模型：关注目的地、同步。**讲实话还是挺抽象的，充满哲学意味，但是这么做本身的目的是什么呢？只是为了统一中心思想？这样做相比于在函数组件中也搞一套类似 useMount / useUpdate / useUnmount 的生命周期 Hook 有什么额外的优势呢？**不知道，继续看……  
setInterval 频繁创建问题  
Decoupling Updates from Actions 和 Why useReducer Is the Cheat Mode of Hooks 这两章中介绍了如何使用 useReducer 去解决 setInterval 被频繁创建的问题。  
  
不过我觉得这个方法太绕了，真还不如用 ref 绕过闭包问题，或者使用 [useEffectEvent](https://zh-hans.react.dev/reference/react/experimental_useEffectEvent) 来得直接，正常人想不到的（对不起，还是忍不住吐槽了）。而且利用 useReducer 的这个方法本质上是把多个状态强行合并成了一个状态，然后继续用 setState 的函数式更新来绕过闭包问题，但是很多业务场景中这些状态就应该是独立的，并不适合合并状态。  
  
把 reducer 定义在函数组件内部来解决 props 的闭包问题，emm...... 确实有种官方大佬下场教你后门骚操作的感觉。  
这个话题依旧只和闭包有关，与 Effect 关系也不大，还是继续看……  
Just let it throw !  
在 Moving Functions Inside Effects 这章中，我感觉我终于找到我想知道的东西了！  
  
因为看到这里之前我的观点和 Dan 截然相反，我认为大部分情况下 We’re just “appeasing React”，也就是我在本文的第三章的“大量的冗余代码”中提到的感觉：不是 React 在给我们提效，而是我们在给 React 当牛马。但是 Dan 提到了一个很重要的观点：  
The design of useEffect forces you to notice the change in our data flow and choose how our effects should synchronize it — instead of ignoring it until our product users hit a bug.  
useEffect 的设计迫使我们要注意到数据流中的变化，并思考我们的 Effect 应该如何同步它，而不是忽略它，否则我们产品的真实用户可能会遇到因此产生的 Bug。  
我大概 get 到 Dan 的意思了：如果我们严格遵守 useEfect 的依赖项声明规则，那么我们的系统在应对外部变量的变化时，将会变得非常健壮，因为这能让整个 React 系统都能根据 useEffect 依赖项进行完美的“同步”。我想到一个不恰当的比喻：用 useEffect 这套新的 React 哲学构建出来的高楼，默认能抗八级地震，非常可靠！  
然后我顺着这个思路继续想，那我们业务中有没有遇到过类似的因为外部变量变化导致的真线问题呢（因为我们团队显然没有严格遵守 useEfect 的依赖项声明规则，空数组 [] 的依赖项声明随处可见）？我突然想到了一个实际遇到过的问题，背景是有一个项目页面，不同页面状态复用同一个页面级组件，即匹配了多个路由：  
问题出在同一个项目在不同 action 状态之间跳转的时候：  
新成员说得很对，但很显然这个 class 组件只在 componentDidMount 中判断了 action，如果使用 react-router 的 [History](https://developer.mozilla.org/zh-CN/docs/Web/API/History) 路由进行跳转，React 会沿用原来的组件实例，导致 targetAction 对应的初始化逻辑不会被执行。当时我们的解决方案是通过定义多个路由和多个页面级组件的方式让 React 无法复用组件：  
后来我们还发现，react-router 只要路由不同，即使组件相同，也不会复用组件实例，所以还有一个更简单的骚操作，组件源码完全不用改，定义多个路由且依旧保持 action 为动态路由参数，但是每个路由仅限定一个 action 枚举值：  
当时在处理这个问题时，我们根本没有考虑过让 ProjectPage 组件及其所有的子组件都监听 action 的变化，使其支持在整个页面的生命周期内支持 action 的变化，原因也非常明显：支持了组件销毁之后的 History 路由切换在体验上也已经比直接修改 location.href 触发整个页面资源的重新加载好了很多。进一步让整个页面完全支持 action 动态变化能够带来的性能受益完全取决于不同 action 之间页面的差异化逻辑有多少，差异化逻辑越多，受益越小。况且这是一个复杂的历史页面，综合考虑下来，这么做的 ROI（投入产出比） 实在是太低了。  
但是如果这个页面及其所有子组件都是由一个完全遵守了 useEffect 依赖项声明规则的开发者来实现的，就能完全避免这个问题了！因为整个页面可以完美地根据 action 进行“同步”：  
在我 get 到这个意思的时候，我确实是被震撼到了，感觉 useEffect 是非常超前的设计，甚至有几分 上工治未病 的感觉。  
但是当我冷静下来仔细思考时，我发现了一个很大的漏洞：有些时候即使我们将某些组件中原本刻意声明了空依赖 [] 的 useEffect 改成真实的依赖项，也无法得到一个“完美的响应式组件”（可以兼容任意 props 在中途变化的组件），因为我们忘了要重置 state 状态。  
还是举我们常见的中后台列表查询页的例子，再额外加上一个列表数据批量选择后删除的功能，假设 URL 中的 projectType 在一个页面的生命周期中是不会变化的，代码如下：  
系统正常运行完全没有问题，假设在一个意想不到的场景中，projectType 中途变化了，但是你会发现 pageNo 和 selectedProjectIds 这两个状态并没有重置：  
其中 selectedProjectIds 没有清空的问题甚至让我觉得还不如 useEffect 的依赖中写个空数组，因为那样虽然 projectType 变化之后列表数据完全不会变化，但是至少不会导致用户误删数据。所以我感觉用 useEffect 这套新的 React 哲学构建出来的高楼，其实并抗不住八级地震，反而更像是一座非常昂贵（需要开发者维护好所有依赖项）但却一碰就碎的水晶琉璃塔（纯粹个人观点）。  
然后当我试图在这个代码的基础上修复这两个问题时，发生了一个更诡异的事情，我不自觉地写出了一个完全错误的 useEffect 示例：  
你可能还会发现，我在第二个 useEffect 中实现的其实并不是副作用逻辑，setState 类的方法是完全属于 UI 渲染的逻辑，因为第二个 useEffect 是我用监听思维写出来的！但是问题确实是被我修复了。  
这貌似形成了一个悖论，当我想通过完全遵守 useEffect 依赖项声明规则来得到一个“完美的响应式组件”时，我却依赖了一个完全不遵守依赖项声明规则的 useEffect……我认为这是 Effect “同步”心智模型中非常大的漏洞。  
抛开这个悖论，当我们再来分析一下做完全做到遵守 useEffect 依赖项声明规则这个事情，其实是非常难的，并且非常脆弱的，综合考量下来的 ROI 也是非常低的：  
●整个前端工程，包括所有依赖的二方包、三方包中的所有代码都要遵守 useEffect 依赖项声明规则，首先涉及的代码范围非常广，三方包甚至是不可控的，其次在每个组件中去关注所有 Effect 中的数据流变化，是非常耗费开发人员心智的，极端的例子就是前面提到过的“满血版” useDebounceFn，常见的例子就是这里的列表批量删除。  
●目前的正式版 React 对应的 useEffect 依赖项声明规则是有漏洞的，但若真的在正式版本中引入了 [useEffectEvent](https://zh-hans.react.dev/reference/react/experimental_useEffectEvent) 这个 API，对开发者的心智负担又会大大增加，加上原本就有很多人在用监听思维使用 useEffect，可想而知 eslint-disable-next-line 的情况依旧会很多，这是典型的破窗效应。  
●Dan 在后续的 Are Functions Part of the Data Flow? 这一章中也说了，如果整个工程中存在类组件，类组件的原型方法因为引用地址是固定的（我们前面提到过的 render props 问题也是这个原因），将类方法传递给子组件的 useEffect 依赖项时，是对这种数据流的一种破坏，即类组件会让这个模式在迭代中变得非常脆弱，因此整个前端工程包括所有依赖的二方包、三方包最好不包含任何类组件。  
  
再回到刚才的示例，事实上：  
●若 projectType 变化时，要重置组件内的所有 state，那我们应该在父组件中（这里虽然没有父组件但也可以设计一个例如 withProjectType 的高阶组件）给当前组件设置 key={projectType} 使 ProjectListPage 组件在 projectType 变化时自动销毁并创建新组件（具体参考[《 当 props 变化时重置所有 state 》](https://zh-hans.react.dev/learn/you-might-not-need-an-effect#resetting-all-state-when-a-prop-changes)和[《 有 key 的非可控组件 》](https://zh-hans.legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key)）。  
●若 projectType 变化时，只需要组件内的部分 state，那你只能写一个上方示例中的监听思维的 useEffect 去重置部分 state，或者重构 ProjectListPage 组件，将需要重置的 state 和不需要重置的 state 分别收敛到不同的子组件中，并给中一个子组件设置 key={projectType} 实现部分 state 的重置。  
  
然而不管是哪种情况，是否遵守 useEffect 的依赖项声明规则并没有什么差别，或者说遵守了 useEffect 的依赖项声明规则并不能提前预防问题的发生，甚至可能帮倒忙（在上面的示例中，增加了用户误删数据的可能性）。  
在我们的 useInit 方案中，如果设计上不需要过考虑 projectType 的变化，那就不用特意去关注什么数据流的变化：  
所以我理想中的研发流程是这样的：  
1首先在平时开发时，对于一个组件的 props 属性（以及其他外部系统的变量），哪些是会变的，哪些是不会变的，我们要有明确的预期（根据产品需求制定技术方案的时候要确定），根据这个预期去写代码：若 props 已明确不会变化，那么对应的逻辑则只需要事先在 didMount 中；若 props 是明确会变化的，则需要用合适的方法去兼容这种变化。  
2如果遇到原本预期不会变化的 props 出现了变化，则需要分两种情况：若分析后认为该 props 确实应该变化，说明技术方案制定得有问题，需要重新执行 1 的流程；若认为该 props 不应该变化，则应该调整代码让这个 props 不再变化。  
  
至于如何兼容 props 属性（以及其他外部系统的变量）的变化，在本文第四章的“谨慎使用 useWatch”中已经有详细的说明，监听思维（即列表查询示例中用于重置状态的 useEffect）应该是我们最后的手段。  
这其实就是原本的类组件的研发习惯，因为这很符合开发者的直觉，原本的类组件研发中我们并没有感知到这个点是非常严重的痛点问题，类组件的问题主要还是在于逻辑复用困难以及围绕 this 出现的一堆“麻烦事”，所以在 React Hook 中花费这么多精力去维护依赖项是很没有道理的，这不仅没有带来什么收益，反而引来了另一堆围绕依赖项的“麻烦事”。  
最后再次明确我的观点：当我们已经在正向研发环节做好了代码设计这个环节的工作，并不需要提前去关注所有组件的数据流变化，而应该基于实际需求去关注数据流变化，不要过于担心因为数据流变化而引发意想不到的问题。万一问题真的发生了：  
Just let it throw !  
竞态条件  
在 Speaking of Race Conditions 这一章中提到了 useEffect 如何处理竞态条件，但是这个问题在类组件中也是一样可以处理的。前面我们已经介绍了在请求方法中使用 标识符 和 AbortController 这两种实现方式处理竞态条件，在类组件中只需将 ref 换成 this 即可。所以这一点上也并不能体现 Effect 的“同步”模型优于生命周期模型。   
“更上一层楼”  
看到 Raising the Bar 这一章时，我感觉虽然这一章没有出现任何代码，但是这里说的全部都是重点中的重点！也说明了  React 核心团队成员们其实也很清楚我前面所说的这些关于 useEffect 的情况。  
  
●试图使用 useEffect 对应的“同步”思维去处理所有理论上的边缘情况，这个前期成本非常高（需要耗费开发者非常多的额外精力），并且相比于那种只在 didMount 时执行一次的副作用逻辑，要困难得多。  
●官方对 useEffect 的定位其实是一个底层的 API，在 React Hook 发展的初期可能在各种教程中频繁出现，并且开发者平时也会用到，但是随着社区生态的发展，对于大多数人而言 useEffect 应该是一个使用频率非常非常低 Hook，业务代码中应该使用进一步封装过后的更高级的 Hook 来实现各种功能。  
●目前为止开发者们使用 useEffect 最多的场景还是声明空数组 [] 依赖项，然后在回调中进行数据接口的请求，这是完全违背“同步”理念的。  
  
在空数组 [] 依赖项的 useEffect 中获取接口数据的情况，直到现在 2025 年也依旧还是很常见，所以有没有一种可能不是 React 用户有问题，而是这个“同步”的设计理念本身就是在 逆势而为 ？  
依靠社区生态的发展逐渐降低 useEffect 使用频率的这个观点，让我想起了 React 对自己的定位，从始至终 React 都认为自己只是一个用于构建 UI 界面的库，而不是一个框架：  
  
所以副作用除了作为函数式编程中的一个概念，还可以认为 React 这个库本身并不应该负责 UI 渲染之外的所有逻辑，useEffect 只是 React 干的“副业”。但是说 React 是一个普通的库也不对，负责 UI 渲染的库是整个前端技术栈选型的基础，只要选择了 React，在 UI 渲染之外的其他技术需求，也只能在 React 生态中选择合适的三方库，因为不同的 UI 渲染库对于副作用的支持形式是不一样的（在 React 中原来是组件生命周期，现在是 useEffect）。所以 useEffect 更像是一些大公司的开放平台给各种 ISV 公司提供的 API，并不是应该让用户直接使用的能力！  
那么使用 useInit / useWatch 完全替代 useEffect 也是非常合理了，只不过我们还把 Effect 副作用和“同步”的理念也一锅端了，有点倒反天罡、欺师灭祖的味了……   
六、useInit 方案的设计由来  
首先这两个替代 Hook 的设计思路，肯定是站在了 useEffect 这个巨人的肩膀上，例如清理函数（cleanup callback）的设计让两个 callback（setup 和 cleanup）天然就有了共享的私有作用域，非常巧妙。  
在此之外，本章会简单讲述一下我们新的 React Hook 编码范式的其他设计由来，帮助大家更好的理解用 useInit 和少量 useWatch 替代 useEffect 的这套范式。  
1、忘不掉的 Class 模型  
当我们在学习 React Hook 的时候，有一个非常重要的观点：我们要先学会忘记类组件和生命周期，因为之前的学习经验会阻碍你进一步学习。我们要重新用同步思维取代生命周期的概念，告诉 React 如何对比 Effects，以及不要对 Dependencies 撒谎……  
“Unlearn what you have learned.” — Yoda  
我们可以尝试忘记类组件、忘记生命周期，但是 React Hook 必须要确保当我们已经在用新的思维写代码时，在大部分场景下实现相同的功能，都应该优于类组件和生命周期。可就我观察到的事实，并非如此，所以我认为 Class 这个模型，包括生命周期等的概念本身是非常适合用在 UI 组件这个场景中的，不能因为 this 和复用代码的问题，就忘记了它的优点。  
“If you don’t know where you’re from, you’ll never know where you’re going.” — 鲁迅  
言归正传，比如当我们设计 state 的时候，有一个原则是只把渲染过程需要用到的变量作为 state，那么有时候一些渲染过程用不到的，不需要响应式的变量定义在哪里呢？在类组件中，我们可以直接定义在实例上，我觉得这非常合理，比如之前的定时器示例：  
在函数组件中，我们需要用 ref 来做类似的事情，比如在项目列表页点击某一条数据的“分派”按钮，先唤起一个通用弹框进行分派目标的选择，然后调用接口进行分派：  
我认为 projectInfoRef 这个语义是不好的，因为 ref 的原本表示的是一个组件的引用，只看命名可能会觉得这是  组件的引用。而且每次对其赋值和读取的时候都要用到 current 这一层没有任何语义的“命名空间”。所以我写了一个自定义 Hook 来模仿类组件中的 this 实现更好的语义化：  
改写上述例子之后代码结构没有变化，语义会更好一些：  
并且当你深入了解过社区里的各种函数组件闭包解决方案时，你会发现所有的方案其实都离不开 useRef，在这些场景中 ref 并不是指原生组件或者自定义组件的引用（reference），而是更像 class 组件中不需要触发响应式更新且没有闭包问题的实例属性。  
2、类组件 vs 函数组件  
在团队内试行这套新的编码范式之前，我详细对比并分享过类组件和函数组件的优缺点：  
  
很明显，支持了 Hook 之后的函数组件在解决了类组件的问题之后，却带来了新的问题。导致很多原来在类组件中我们可以直接写原生代码就能快速实现的功能，在函数组件中变得十分复杂，以至于我们需要依赖一些三方 Hook 工具来协助完成这些功能。  
比如防抖功能在类组件中可以直接使用 loadsh 的 debounce 方法实现，但是在函数组件中我们必须使用 useDebounceFn 这类工具 Hook 来完成。拥抱函数组件后，闭包问题等从根本上是无法避免的，所以我们应该设计一套能让开发者能尽可能避开这些问题的基础 Hook，而 useEffect 设计不仅没能让我们避开这些问题，还引入了更恶心的依赖项管理问题。  
所以我们的设计思路就是把两者的优点都结合起来，把缺点都规避掉，扬长避短。  
3、繁简一致的编码思路  
在使用 useEffect 时，我需要不断地和新加入我们团队的成员沟通如何用好 useEffect，然而在 useInit 方案中，我根本不再需要花费精力去做沟通这么基础的事情。新的 useInit 方案也只是在原本的 React Hook 基础上去掉副作用的概念，只是保留了组件实例的心智模型，以及初始化和监听的概念（勉强算简化后的生命周期）。  
在习惯了这个方式写代码时，除了第四章中提到的可以极大地避免依赖项声明、闭包问题、不必要的 useCallback 和 useMemo，还有一个关键的优势：**不论遇到什么场景，写代码的思路都是一样的。**当遇到[《 将事件从 Effect 中分开 》](https://zh-hans.react.dev/learn/separating-events-from-effects)中提到的场景（类似第四章中的“useEffect 解决不了的问题”）时，用我们的方案去写代码，和其他任何常规的场景没有差别，更不需要引入一个新的 API，就像在类组件中这些场景原本就不是什么特殊情况：  
不过还是要再次提醒，即使这个代码实现起来很简单，但是在使用 useWatch 前，还是要参考第四章中“谨慎使用 useWatch” 里提到的方式去判断能否优先采用其他实现方案，因为其他实现方案相比于监听方案是更易维护的。  
并且我们的方案也没有类似 [Effect Event 的局限性](https://zh-hans.react.dev/learn/separating-events-from-effects#limitations-of-effect-events) 中提到的问题，因为 useInit 和 useWatch 在用 ref 解决闭包问题时，将“闭包消除魔法”的生效范围很好地控制在了 useInit 和 useWatch 中。  
4、防呆设计  
在我们团队对 useEffect 最初的讨论中，就认为 useEffect 太灵活了，看似门槛很低，其实非常容易玩脱，即 useEffect 大大提高了写出好代码的门槛，也正因为其灵活性，导致无法做到本文开头说的两个点：保持代码结构一致性 和 代码意图的正确传达。如果让我对 useEffect 的问题做一个抽象的总结，我会这么说：  
useEffect 看似很简单，然而要用好 useEffect 则对开发者的要求很高。就像你完全可以把自动挡汽车当作碰碰车开上路，但是如果每个人都只会油门刹车却不懂交通规则、不懂防御性驾驶，整个城市的交通会迅速陷入瘫痪。并且很多开发者其实并没有注意到使用 useEffect 还要注意这么多规则，这很可能是因为大多数时候这些额外的规则并没有带来对应的额外收益。  
前面提到过 Dan 认为 useEffect 的设计迫使我们要注意到数据流中的变化，从而能提前针对数据变化建立防御性措施，这其实属于系统稳定性的话题。即使这么做真的能带来稳定性收益，很多开发者依旧都没有完全遵守官方 ESlint 插件来写代码，我认为这其中有一个重要的设计原因，就是这个 useEffect 的设计中没有任何[防呆（Fool-proofing）](https://baike.baidu.com/item/%E9%98%B2%E5%91%86)措施：首先 react-hooks/exhaustive-deps 这个 ESLint 校验规则不防呆，不仅仅因为类组件生命周期的概念其实依旧深入人心，导致大多数开发者都是靠自己的感觉来决定要不要参考这个校验规则，而且本身这套校验规则就有漏洞，对应的 useEffectEvent 解决方案也还只是实验性 API；其次 useEffect 到底应该用在哪些场景，不应该用在哪些场景，这也非常不防呆，你需要阅读完官网 5 篇总计 3w 字的教程才可能搞明白……  
在工业生产中、在生活中，各种领域都有很多优秀的防呆设计：  
●电脑的固态、内存条上都有防止反向错误安装而设计的非对称缺口。  
●所有手机的关机都需要长按或二次确认以防误触。  
●各种场景中的显著标识：红色表示紧急，绿色表示通行等等。  
●……  
  
防呆设计通过一些限制手段或者显著标识来降低一个行为对于操作人精力、经验与专业知识的要求，从而达到预防错误的目的。不论新手、老手；不论你头脑清醒，还是疲惫不堪；不论是繁忙的并行工作，还是安静的专注工作，都能依靠防呆设计正确完成任务。  
回到 useInit 的设计，就像 initialization 这个单词表示的意思一样，你只能应该放一些组件初始化时的逻辑，并且因为就像 componentDidMount 一样，useInit 的 callback 只会执行一次，任谁也玩不出花来。而 useWatch 就是最后的兜底手段，用监听思维去实现一些逻辑，不过遗憾的是我们也只能通过一些显著的约定来告诉开发者，这是一个 danger 的 Hook，要谨慎使用。  
Over，感谢阅读！  

​

2 人点赞

- ![Jiango](https://cdn.nlark.com/yuque/0/2025/png/103305/1742831165430-avatar/9beba051-782f-41fa-8c40-e6f830f8b486.png?x-oss-process=image%2Fresize%2Cm_fill%2Cw_64%2Ch_64%2Fformat%2Cpng)
- ![Kffhi](https://cdn.nlark.com/yuque/0/2020/png/598722/1596107859783-avatar/e38c5f29-0533-4d0a-9fe9-602caa2d928e.png?x-oss-process=image%2Fresize%2Cm_fill%2Cw_64%2Ch_64%2Fformat%2Cpng)

所有评论（1）

[![Jiango](https://cdn.nlark.com/yuque/0/2025/png/103305/1742831165430-avatar/9beba051-782f-41fa-8c40-e6f830f8b486.png?x-oss-process=image%2Fresize%2Cm_fill%2Cw_64%2Ch_64%2Fformat%2Cpng)](https://www.yuque.com/jiango)

44006字

![语雀](https://mdn.alipayobjects.com/huamei_0prmtq/afts/img/A*IVdnTJqUp6gAAAAAAAAAAAAADvuFAQ/original)