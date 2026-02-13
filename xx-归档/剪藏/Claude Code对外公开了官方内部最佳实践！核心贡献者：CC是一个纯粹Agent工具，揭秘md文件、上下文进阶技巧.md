[Site Unreachable](https://zhuanlan.zhihu.com/p/1938278468497413891)


来自

[Claude Code](https://zhida.zhihu.com/search?content_id=261553647&content_type=Article&match_order=1&q=Claude+Code&zhida_source=entity) 终于有了官方大佬出来分享内部的最佳实战哲学了。

两天前，[Anthropic](https://zhida.zhihu.com/search?content_id=261553647&content_type=Article&match_order=1&q=Anthropic&zhida_source=entity) 官方 YouTube 账号放出了一个AI应用技术团队的老大在旧金山的 [Code w/ Claude](https://zhida.zhihu.com/search?content_id=261553647&content_type=Article&match_order=1&q=Code+w%2F+Claude&zhida_source=entity) 会议上的分享内容。

![](https://pica.zhimg.com/v2-b124e9493acf92d721fe0d26f54ece06_1440w.jpg)

这个分享全程25分钟，可以说句句干货，讲述了 Claude Code 的诞生和最佳实践原则，用分享者 Cal Rueb 的话说就是揭开“引擎底盖”，看看底层就是是如何运作的。

Rueb 是 Anthropic 技术团队成员，加入公司已经近两年，是 CC 的核心贡献成员。

Rueb 现在主要负责设计该产品的提示词、系统提示、工具描述和结果处理，同时也参与评估工具更新后的效果。所以，Rueb 将 Claude Code描述为一组强大提示和工具，通过循环运行模型来完成负责任务的纯粹 Agent，并详细解释了 CC 的底层运作原理。

最佳实践部分 cover 了许多厉害的用例，从如何**使用 `claude.md` 文件到权限控制，从高效上下文管理到有效整合工作流、到进阶技巧，再到部署和[CI/CD](https://zhida.zhihu.com/search?content_id=261553647&content_type=Article&match_order=1&q=CI%2FCD&zhida_source=entity)的无头自动化。可谓最全的一次官方爆料。**

话不多说，这就为为大家奉上 Anthropic 的内部CC最佳实践。

![](https://picx.zhimg.com/v2-040e21f06d6e4ebaca0199b6b13a00d3_1440w.jpg)

**我是如何加入Claude Code团队的？**

大家好，我们开始吧。欢迎来到“Claude Code 最佳实践”分享会。

这次分享我会先从高层次介绍一下什么是 Claude Code，然后我们会稍微“揭开引擎盖”，看看它底层是如何工作的。了解工具的工作原理是很有价值的，接着我会讲讲它的使用场景，以及我们自己团队和用户总结出的最佳实践，帮助你更高效地使用这个工具。

![](https://pic1.zhimg.com/v2-29eaf896133b64d54a0c2b03649cae3c_1440w.jpg)

在正式开始之前，我想先简单介绍一下自己，以及我是怎么来到这个讲台上的。

我叫 Cal，我在大约一年半前加入了 Anthropic，帮助创建了一个叫“应用 AI（Applied AI）”的团队。我们团队的使命是帮助客户和合作伙伴，基于 Claude 打造出优秀的产品和功能。换句话说，我的日常工作之一就是不断地对 Claude 进行提示（prompting），以获得最佳输出。当然，我本身也热爱编程，我是那种经常有点子、启动很多项目，但很多都没做完的开发者——我有一整座“项目坟场”，里面堆满了我写了一半的代码。但我一直喜欢尝试新东西。

去年年底，有一天我在 Slack 上听说了一个新的工具，一些同事说它特别酷。于是那个星期五晚上，我下载了它的早期版本——后来就成了 Claude Code。我把它用在了我想做的一个笔记应用上，那整个周末的体验完全改变了我写代码、甚至是思考软件工程的方式。

我整个周末都在带着电脑，不停地试 Claude Code，看它工作。我敲下回车，然后切到浏览器刷新页面，看着一个强大而完整的应用一步步呈现在我面前。这种体验太震撼了。我比平时写代码能推进得远得多。

但我也有点小担心……毕竟**我知道模型的运行成本，我当时就在想：“我是不是用了太多 tokens（调用次数）？会不会被抓包？**”而实际上，我不知道的是 Claude Code 团队内部其实做了一个排行榜，统计每个 Anthropic 员工使用 Claude Code 的情况，而我那个周末直接冲到了榜首！

这也让我有机会认识了 Boris、Cat 和 Claude Code 的早期开发团队。我们聊了起来，我说，“我超喜欢这个工具，同时我对 prompt 设计也很熟，可以帮上忙吗？”之后我就加入了他们，成了核心贡献者之一。

我现在**主要负责设计提示词（prompts）、系统提示、工具描述和结果处理**，同时也参与**评估工具更新后的效果**：当我们更改 prompt 时，如何判断它是优化了还是反而把 Claude Code 搞坏了。

![](https://picx.zhimg.com/v2-16ddf15f73e10d8330d249da435d8c71_1440w.jpg)

**CC是纯粹的Agent工具，它底层如何工作的？**

好，说到这我们正式进入正题。

我目前对 Claude Code 的理解是这样的：它就像是你团队里那个“全靠终端”的同事。他们从来不用图形界面，只用命令行，非常厉害。

![](https://pic1.zhimg.com/v2-929f2f2b00529b6b355e1631876dd4cc_1440w.jpg)

我还记得当我还是一个初级工程师时，我有个导师 Tony。我常跑去请教他，“Tony，帮我看看这个 bug 怎么搞？”然后他会打开终端，飞快地用 bash、Vim 操作一堆命令，每次我都站在旁边震惊地想：“我也得学会这个啊！”（当然，后来也没学会。）

而 Claude Code 就像是你随时身边有个 Tony。

那 Claude Code 背后是怎么运作的呢？

在 Anthropic，我们有个理念叫“用最简单的方式解决问题”。Claude Code 就是一个我们称之为“纯粹 Agent（智能体）”的工具。也就是说，它本质上是一组说明书（prompt）、一组强大工具，然后模型会以循环方式运行，直到它觉得完成任务了。

Claude Code 所用的工具，是那种高手在终端上操作时用的工具——可以创建、编辑文件，可以运行命令行工具，也能用 MCP 拉取一些额外的资源。

![](https://pica.zhimg.com/v2-57071de60f01e8ab5059179f6dd9a1c2_1440w.jpg)

至于 **Claude 如何理解整个代码库呢**？一年前你如果要做一个编程 Agent，可能会想，“我得把所有代码文件都 index（索引）起来，做 embedding，搞一个 RAG 检索系统。”Claude Code 完全不这么干。它没有做索引。

它是**“探索式理解”**。就像你加入一个新团队，要了解代码库时你会怎么做？你会用搜索工具，比如 `grep`、`find`、`glob`，去一点点探索。Claude Code 也是这么做的。它会先搜一圈，再根据结果判断需不需要再搜，然后继续探索。这就是我们说的“agentic search”。

在这些基础能力之上，Claude Code 还有一个**很轻量的 UI 层**，能让你“看”到 Claude 是怎么工作的。还有**权限控制机制，**当它要做一些“危险操作”（比如写文件或运行命令）时会弹出提示让用户决定是否继续。我们也非常**注重安全**。

此外，由于 Claude 的模型不仅可以通过 Anthropic 的 API 使用，也可以通过 AWS 和 GCP 等云服务访问，所以你也可以很方便地在这些环境中运行 Claude Code。

![](https://pica.zhimg.com/v2-dd3eda818c227a546b66195b4401523e_1440w.jpg)

**CC到底能用来做什么**

很多人问我：“Cal，Claude Code 到底能用来做什么？”答案是：几乎什么都行。

首先是**熟悉新项目代码**。你可能刚加入一个团队，或是开始一个开源项目，一开始效率都很低，因为你在找方向。而 Claude Code 可以帮你快速熟悉代码，比如：“这个功能在哪实现的？”“看看这段代码过去几周的变动历程？”等等。

另外一个我觉得被低估的用途是——**Claude Code 作为你的“思维搭子”**。我经常在写代码前，会跟 Claude 聊一下，“我打算加一个功能，你能不能先看看代码库，大概搜搜我们要怎么做？给我几个实现方案。”Claude 会用 agentic search 探索，然后再回来跟我讲它找到的路径。这样我可以先评估，再决定怎么做。

当然，它也非常擅长写代码。无论是**从零开始构建项目**，还是**在已有代码基础上修改、扩展**，Claude Code 都能处理。我们团队自己的代码覆盖率非常高，就是因为 Claude Code 让写单元测试变得非常简单。

还有一点，我们的提交记录和 PR 信息也很优秀，因为我们每次提交时都会让 Claude Code **帮我们写 commit message 或 PR 描述**。

在代码生命周期的其他阶段，比如 **CI/CD、部署、debug** 等，Claude Code 也能大显身手。很多人会把它嵌入到工作流中，比如**用 SDK 无头调用、集成到 GitHub 中**等等。

此外，我们还听说不少用户在搞老代码迁移时（比如从老版本 Java 升级，或从 PHP 迁移到 React）会用 Claude Code 帮忙，因为它能把这些大型项目拆解得更有条理、让团队更有信心。

![](https://pic1.zhimg.com/v2-0e78f216e5c761567e879fb6f7285fa4_1440w.jpg)

最后别忘了，Claude Code 非常擅长命令行工具，比如 Git、Docker、BigQuery 等。你再也不用怕卡在 rebase 里出不来了，直接让 Claude Code 给你搞定，非常强大。

![](https://pica.zhimg.com/v2-3c21ba1c7d0510f890fbe48c68ea0e8e_1440w.jpg)

**秘籍来了！内部最佳实践**

我们说完用法，再来说说**最佳实践**。

第一条——**使用 `claude.md` 文件**。Claude Code 是个 Agent，它没有持久记忆。所以我们共享上下文的方式，是用这个 Markdown 文件。只要它在当前目录中，Claude Code 启动时就会把它“注入”到 prompt 里。

你可以写：单元测试的运行方式、项目结构、风格指南等等，让 Claude 更聪明地工作。你可以把这个文件加入 Git 项目里，所有人共享；也可以放在自己家目录，让 Claude 在任何项目中都能知道你的偏好。

![](https://pica.zhimg.com/v2-15b7401361894894983f3a2bc82c243a_1440w.jpg)

**第二条是权限控制**。Claude Code 默认对“读取”操作是自动批准的，但当它要**写入**文件或执行脚本命令时，就会弹出确认窗口，让你点“允许”或者“禁止”，这样就避免了潜在的破坏性操作。

我们继续讲权限管理这个话题。

使用权限管理并灵活配置它，会让你工作更高效。有个叫“自动接受模式”的功能：当你在使用 Cloud Code 时，按下 `Shift + Tab`，Claude 就会立刻开始工作。你还可以在设置中配置 Claude，比如对某些 bash 命令默认允许执行，比如你已经厌烦了反复确认 `npm run test`，就可以设定始终允许执行这个命令。

![](https://picx.zhimg.com/v2-fd5a1d0bc853221e625073e97b6bd6b9_1440w.jpg)

**在整合工作流方面**，有个**关键点**是：记住 Claude 在终端表现非常出色。如果你常用的一些工具支持命令行访问，比如 GitHub 就有一个强大的 CLI 工具叫 `gh`，你可以通过安装更多 CLI 工具或挂载更多 MCP 服务器，把更多工作交给 Claude 来做。

从经验来看，如果你在“本地安装 CLI 工具”和“安装 MCP 服务器”之间纠结，我建议优先考虑 CLI 工具。如果你有自己的内部工具，比如我们在 Anthropic 用的 `kube`，你也可以让 Claude 知道这些工具的存在，并写进 `claude.md` 文件中。

接下来是**“上下文管理”**。

Claude 是一个智能体，运行过程中会不断调用工具，累积上下文信息。Anthropic 的模型支持最多 20 万个 token 的上下文窗口，但你确实有可能会把这个窗口填满。

![](https://pic1.zhimg.com/v2-f40099f069e793b592f9a8c1aa746e48_1440w.jpg)

当你长时间和 Claude 协作，来回交互时，你会在界面右下角看到一个提示，说上下文快满了。那这时你**有两个选择**：

1. 输入 `/clear` 命令，清除当前上下文（但不会清除 `claude.md` 等关键文件），重新开始。
2. 输入 `/compact`，这会触发 Claude 总结当前会话的过程，相当于说：“我要离开，把这段工作移交给另一个开发者。”Claude 会生成一个总结，用这个总结作为新的上下文，继续任务。

我们花了很多时间打磨这个“compact”功能，让它在上下文窗口爆满时，能无缝接续下去。

![](https://pic2.zhimg.com/v2-3c1d7a158c5cc7cd58434dfa93a96673_1440w.jpg)

**高效工作流建议**

你该怎么更有效使用 Cloud Code？

**1. 用它做规划和任务拆解**

**不是一上来就“Claude，修这个 bug”。更好的方式是说：“Claude，我遇到了这个 bug。你能搜索一下，找出可能的原因，然后帮我规划一个修复方案吗？”这样你可以先验证 Claude 的思路，然后再决定是否执行。**

**2. 关注 To-Do 列表**

Claude 在处理大任务时会自动生成 To-Do 列表。你可以一边观察这个列表，一边判断它有没有跑偏。如果你发现不合理的条目，可以按 `Escape` 键打断并说：“Claude，我觉得这个 To-Do 不太对，咱们换个思路。”

![](https://pic3.zhimg.com/v2-9d6d6ee8d9f810bc21764b7cba141972_1440w.jpg)

**3. Smart Vibe Coding（有意识地使用 Claude 编码）**

虽然很诱人——只想敲回车让 Claude 自己完成一切，但其实你可以：

- 用测试驱动开发；
- 让 Claude 做小步提交，频繁运行测试；
- 加入类型检查和 lint 检查；
- 定期 commit，如果出错可以回滚。

**4. 利用截图进行调试**

Claude 基于多模态模型。你完全可以截图粘贴给它，或者直接说“Claude，请看 mock.png，然后帮我写这个网页”。

![](https://picx.zhimg.com/v2-4429a077e6dd2d4004765810f0b17e55_1440w.jpg)

**进阶技巧**

**1. 开启多个并行实例**

你可以试着开启多个 Claude 实例。我知道一些 Anthropic 的同事和客户，最多同时跑四个 Claude 实例，用 Tmux 或多个终端标签页来控制。这种“多 Agent 编排”的体验很有趣。虽然我自己最多能同时用两个，但我建议你也试试。

**2. 善用 Escape 键**

Claude 工作时，按 `Escape` 可以中断它，适时插话很关键。如果你按两次 `Escape`，还有隐藏功能：你可以回到上一个对话节点，重置当前工具链和 MCP 执行上下文。

![](https://pic3.zhimg.com/v2-9a39193c059981ed12613c1e1123a7fc_1440w.jpg)

**7. MCP 扩展和 Headless 自动化**

如果 Claude 的 bash 和 CLI 工具都搞不定某件事，这时就该考虑 [MCP Server](https://zhida.zhihu.com/search?content_id=261553647&content_type=Article&match_order=1&q=MCP+Server&zhida_source=entity) 了。

我们最感兴趣、也是目前仍在探索的方向是：**如何以编程方式调用 Claude。**

比如集成进 [GitHub Actions](https://zhida.zhihu.com/search?content_id=261553647&content_type=Article&match_order=1&q=GitHub+Actions&zhida_source=entity)。这是我们正在研究的方向，也欢迎你们去探索各种创意用法。

![](https://pic2.zhimg.com/v2-11018e21e4b02394dd30b24be396fab1_1440w.jpg)

**实时更新提示**

现在我切换到电脑，展示一些今天最新的变化：

- 输入 `/model`，你可以看到当前使用的 Claude 模型。比如我现在用的是 Sonnet，但我也可以切换到 Opus。
- 输入 `/config`，可以在配置中切换模型。
- 新模型支持“工具调用之间思考（think between tool calls）”。以前 Claude 只能在工具调用前思考，现在可以在中间过程也进行深度思考。你会看到 Claude 输出浅灰色文字，然后调用文件、读取信息、继续分析。

建议你在处理任务或排查 bug 时，插入 `think hard`，让 Claude 更深入思考。

![](https://pic1.zhimg.com/v2-4a6791e7d5f4584d933d561e00b1e89a_1440w.jpg)

**IDE 插件更新**

我们在 [VS Code](https://zhida.zhihu.com/search?content_id=261553647&content_type=Article&match_order=1&q=VS+Code&zhida_source=entity) 和 [JetBrains](https://zhida.zhihu.com/search?content_id=261553647&content_type=Article&match_order=1&q=JetBrains&zhida_source=entity) 系列中都做了深度集成。Claude 可以知道你当前所在的文件，并根据上下文进行处理。

![](https://pic4.zhimg.com/v2-268edbcabbbfc64a541ee489b760aca7_1440w.jpg)

**最后一点建议：保持关注！**

我们在 GitHub 上维护了一个开源项目 Claude Code，你可以在那里提交 issue，也可以订阅更新日志。即使是我本人都经常看不完我们发布的新功能。

![](https://pic4.zhimg.com/v2-001ac9a0b32824c0f5a50a40fc04320f_1440w.jpg)

**几个疑惑解答**

最后还有四分钟，我可以回答任何关于 Cloud Code 的问题，也可以现场演示。

**支持多个claude.md 文件吗？**

现场一位朋友问到：能否支持一个项目里多个 `claude.md` 文件？

回答：是的——不过要注意：**同一目录中不能存在多个 `claude.md`**，但你可以在子目录中放不同的 `claude.md` 文件。默认只会读取当前工作目录的那个，如果你打开的是一个 monorepo 顶层目录，那可能会“爆掉上下文”，所以 Claude 会自动过滤不相关的。

你也可以在 `claude.md` 文件里用 `@` 引用其他文件，来扩展 Claude 的记忆。

![](https://pic3.zhimg.com/v2-2f103c3f24ead07990b98d2ca35d76f6_1440w.jpg)

**关于 Claude 不听指令的问题**

有观众反馈说，明明在 `claude.md` 里写了不要生成注释，Claude 还是会在重构时写上一堆明显废话的注释。

答：**这个问题本质上是模型层面的问题，而不是 prompt 的问题**。我们在 3.7 版本中已经做了很多抑制注释生成的工作，在 Claude 4 中这个问题已经大大改善了。同时，Claude 4 对于 `claude.md` 的指令服从度也显著提升。建议你趁此机会重新检查一下 `claude.md` 文件，看是否需要精简或更新内容。

**关于多 Agent 的上下文继承**

最后有人问：能否让多个 Claude 实例共享上下文，比如 Agent 2 和 3 继承 Agent 1 的上下文？

目前官方**并未**支持原生功能，但你可以采用**“写入共享 markdown 文件”**的方法作为 workaround。例如：

- 让 Claude 把当前任务状态写进 `ticket.md`；
- 然后另一个 Claude 实例读取这个文件，并继续工作。

Claude code使用指南：[https://wuren-bj.feishu.cn/wiki/SiQdwDffdiSodIk5lchcgbJznzh?from=from_copylink](https://link.zhihu.com/?target=https%3A//wuren-bj.feishu.cn/wiki/SiQdwDffdiSodIk5lchcgbJznzh%3Ffrom%3Dfrom_copylink)

Claude code权限获取：[https://kdocs.cn/l/cexw8z6KuhTq](https://link.zhihu.com/?target=https%3A//kdocs.cn/l/cexw8z6KuhTq)