# Martin Fowler 访谈：AI 如何重塑软件工程

> **播客来源**：[
> How AI will change software engineering – with Martin Fowler](https://www.youtube.com/watch?v=CQmI4XKTa0U)  
> **嘉宾**：Martin Fowler（Thoughtworks 首席科学家、《重构》作者、敏捷宣言签署者）  
> **翻译整理**：Muliminty（AI 辅助整理）  
> **主题**：AI 对软件工程的颠覆性影响、实践原则与未来趋势

---

## 访谈概览

本次访谈探讨了 AI 对软件工程的根本性影响，Martin Fowler 分享了从确定性到非确定性范式的转变，以及开发者如何在 AI 时代保持竞争力。

**核心观点**：

- AI 不是工具，是范式革命：从确定性到概率性
- 警惕"氛围编程"：必须理解 AI 生成的代码
- 重构比以往更重要：AI 生成代码需要人工整理
- 敏捷原则在 AI 时代更加重要

---

## 开场

**主持人**：Welcome to The Pragmatic Engineer Podcast. Today we're joined by Martin Fowler, one of the most influential figures in software engineering, author of _Refactoring_, _Patterns of Enterprise Application Architecture_, and a signatory of the Agile Manifesto. Martin, thanks for being here.

**主持人**：欢迎收听《实用工程师》播客。今天我们邀请到了 Martin Fowler，软件工程领域最具影响力的人物之一，《重构》《企业应用架构模式》的作者，也是《敏捷宣言》的签署者。Martin，感谢你的到来。

**Martin Fowler**：Great to be here. Thanks for having me.

**Martin Fowler**：很高兴来到这里。谢谢邀请。

**主持人**：You've been in this industry for over 40 years. You've seen every major shift—from mainframes to personal computers, from waterfall to agile, from monoliths to microservices. Where does AI fit into this? Is this just another tool, or is it something bigger?

**主持人**：你在这个行业已经超过 40 年了。你见证了每一次重大转变——从大型机到个人电脑，从瀑布式到敏捷，从单体架构到微服务。AI 在这个历程中处于什么位置？它只是又一个工具，还是更大的变革？

**Martin Fowler**：I think this is the biggest change in my career. It's not just another layer of abstraction, like moving from assembly to high-level languages. This is a fundamental shift from a deterministic world to a non-deterministic one. That's a paradigm shift we've never seen before in software.

**Martin Fowler**：我认为这是我职业生涯中最大的变化。它不仅仅是又一层抽象，比如从汇编语言到高级语言的转变。这是从确定性世界到非确定性世界的根本性转变。这是我们在软件领域从未见过的范式转变。

---

## 一、AI：从确定性到非确定性的范式革命

**Martin Fowler**：For 50 years, software engineering has been deterministic. Same input, same output. Code is either right or wrong. We built our entire discipline around that certainty—unit tests, code reviews, static analysis, all rely on predictability.

**Martin Fowler**：50 年来，软件工程一直是确定性的。相同的输入，相同的输出。代码要么对，要么错。我们围绕这种确定性构建了整个学科——单元测试、代码审查、静态分析，都依赖于可预测性。

Now with large language models, we have non-determinism. The same prompt can give you different results. The output is probabilistic, not binary. That's a completely different way of thinking. We have to learn to tolerate uncertainty, like structural engineers design bridges with safety margins. If we ignore this, especially in safety-critical systems, we're going to have serious accidents.

现在有了大语言模型，我们有了非确定性。相同的提示可能给出不同的结果。输出是概率性的，而非二元的。这是完全不同的思维方式。我们必须学会容忍不确定性，就像结构工程师设计桥梁时会留出安全余量一样。如果我们忽视这一点，特别是在安全关键系统中，我们将面临严重的事故。

**主持人**：So this is bigger than just "AI writes code." It changes how we think about software itself?

**主持人**：所以这不仅仅是"AI 写代码"这么简单。它改变了我们对软件本身的思考方式？

**Martin Fowler**：Exactly. We're moving from "engineering certainty" to "engineering probability." Our job isn't just to write correct code anymore—it's to manage the gap between intent and outcome, to control risk in a world of ambiguity.

**Martin Fowler**：正是如此。我们正在从"工程确定性"转向"工程概率性"。我们的工作不再只是编写正确的代码——而是要管理意图与结果之间的差距，在模糊的世界中控制风险。

---

## 二、警惕"氛围编程"（Vibe Coding）：只生成不理解，切断学习循环

**主持人**：A lot of developers are using AI to write entire functions or even files without reading the code. They call it "vibe coding"—just get something that works. What's your take?

**主持人**：很多开发者使用 AI 编写整个函数甚至整个文件，却不阅读代码。他们称之为"氛围编程"——只要能跑就行。你怎么看？

**Martin Fowler**：Vibe coding is dangerous. The problem isn't that AI writes code—it's that you stop understanding it. When you don't read the code, you break the learning loop: idea → code → feedback → understanding. You become a passive consumer, not an engineer.

**Martin Fowler**：氛围编程是危险的。问题不在于 AI 写代码——而是你停止理解代码了。当你不阅读代码时，你打破了学习循环：想法 → 代码 → 反馈 → 理解。你变成了被动的消费者，而不是工程师。

The code AI generates is often messy, hard to modify, and full of hidden assumptions. If you use this for production systems that need to be maintained for years, you're building a ticking time bomb. Vibe coding is only acceptable for throwaway prototypes, one-off scripts, or exploratory work—never for long-lived systems.

AI 生成的代码往往混乱、难以修改，且充满隐藏的假设。如果你将这种代码用于需要维护多年的生产系统，你就是在建造一颗定时炸弹。氛围编程只适用于一次性原型、临时脚本或探索性工作——绝不能用于长期运行的系统。

**主持人**：So the key is to always understand what the AI is producing?

**主持人**：所以关键是要始终理解 AI 在产生什么？

**Martin Fowler**：Absolutely. You have to be able to read, review, and modify every line. AI is a powerful intern, but interns make mistakes. You can't just merge their PRs without checking.

**Martin Fowler**：绝对如此。你必须能够阅读、审查和修改每一行代码。AI 是一个强大的实习生，但实习生会犯错。你不能不检查就直接合并他们的 PR。

---

## 三、AI 理解遗留代码：技术雷达最高优先级推荐

**Martin Fowler**：Where AI really shines is understanding legacy code. At Thoughtworks, we've put "AI for legacy code understanding" at the top of our Technology Radar—strongly recommend.

**Martin Fowler**：AI 真正擅长的是理解遗留代码。在 Thoughtworks，我们将"AI 用于遗留代码理解"放在技术雷达的最高优先级——强烈推荐。

The process is: semantic analysis of code → store structure in a graph database → use RAG to let AI explain the system. It's like having an archaeologist dig through a 10-year-old codebase and map out all the dependencies, data flows, and hidden logic.

流程是：代码语义分析 → 将结构存储在图数据库中 → 使用 RAG 让 AI 解释系统。这就像让考古学家挖掘一个 10 年历史的代码库，并绘制出所有依赖关系、数据流和隐藏逻辑。

AI can't fix the human-made complexity—like bad architecture from political decisions—but it can drastically reduce the time it takes to get up to speed. That's a huge win for teams maintaining old systems.

AI 无法修复人为造成的复杂性——比如因政治决策导致的糟糕架构——但它可以大幅缩短上手所需的时间。这对维护旧系统的团队来说是一个巨大的胜利。

**主持人**：So AI is better at understanding than writing legacy code?

**主持人**：所以 AI 在理解遗留代码方面比编写遗留代码更擅长？

**Martin Fowler**：For now, yes. Understanding is a pattern-matching problem AI excels at. Modifying legacy code safely requires deep domain knowledge and careful refactoring—things AI still struggles with.

**Martin Fowler**：目前来说，是的。理解是 AI 擅长的模式匹配问题。安全地修改遗留代码需要深入的领域知识和仔细的重构——这些仍然是 AI 的弱项。

---

## 四、与 AI 协同的实操原则：把 AI 当"能力强但不靠谱的实习生"

**Martin Fowler**：Here's how to work with AI effectively:

**Martin Fowler**：以下是如何有效与 AI 协作：

1. **Small slices**: Never ask AI to write a big chunk. Work in tiny, reviewable pieces.
   **小步快跑**：永远不要让 AI 写大块代码。以小而可审查的片段工作。

2. **Strict review**: Treat every AI output as a PR from a junior dev. Check every line.
   **严格审查**：将每个 AI 输出视为初级开发者的 PR。检查每一行。

3. **Test coverage**: Tests are your safety net. AI's non-determinism makes tests more important, not less.
   **测试覆盖**：测试是你的安全网。AI 的非确定性使测试变得更加重要，而不是更不重要。

4. **Know tool limits**: AI is bad at refactoring, renaming, and deterministic tasks. Use your IDE for that.
   **了解工具限制**：AI 在重构、重命名和确定性任务方面表现不佳。使用你的 IDE 来处理这些。

5. **Hybrid approach**: Let AI handle intent and generation; use deterministic tools for execution and validation.
   **混合方法**：让 AI 处理意图和生成；使用确定性工具进行执行和验证。

**主持人**：So it's a partnership, not replacement?

**主持人**：所以这是一种合作关系，而不是替代？

**Martin Fowler**：Exactly. AI amplifies good engineers and makes bad engineers dangerous. The gap between those who understand and those who don't will widen dramatically.

**Martin Fowler**：正是如此。AI 会放大优秀工程师的能力，也会让糟糕的工程师变得危险。理解者与不理解者之间的差距将急剧扩大。

---

## 五、AI 时代，重构比以往更重要

**Martin Fowler**：AI can generate code fast—but it generates technical debt fast too. Refactoring is more critical than ever. It's how you turn messy AI output into maintainable, understandable code.

**Martin Fowler**：AI 可以快速生成代码——但它也会快速产生技术债务。重构比以往任何时候都更加关键。这是你将混乱的 AI 输出转化为可维护、可理解代码的方式。

The key to refactoring is small steps, composability, and constant verification. AI can't do high-quality refactoring—your IDE and your judgment are still essential. The workflow should be: AI generates draft → human reviews → human refactors in small steps → tests pass.

重构的关键是小步前进、可组合性和持续验证。AI 无法进行高质量的重构——你的 IDE 和判断力仍然至关重要。工作流程应该是：AI 生成草稿 → 人工审查 → 人工小步重构 → 测试通过。

**主持人**：So refactoring isn't dead—it's the antidote to AI chaos?

**主持人**：所以重构并没有消亡——它是 AI 混乱的解药？

**Martin Fowler**：Precisely. Refactoring is how we impose order on the non-deterministic output of AI. It's the bridge between AI's speed and engineering's discipline.

**Martin Fowler**：正是如此。重构是我们对 AI 的非确定性输出施加秩序的方式。它是 AI 的速度与工程纪律之间的桥梁。

---

## 六、未来方向：与 AI 共建领域专用语言（DSL）

**Martin Fowler**：The future of human-AI collaboration isn't natural language—it's domain-specific languages (DSLs). We need to build precise, shared vocabularies that sit between natural language and code.

**Martin Fowler**：人机协作的未来不是自然语言——而是领域专用语言（DSL）。我们需要构建精确的、共享的词汇表，介于自然语言和代码之间。

This aligns with Domain-Driven Design (DDD). A good DSL reduces ambiguity, makes AI's output more predictable, and lets us communicate complex ideas clearly. AI lowers the cost of building these languages, so we can do it more often.

这与领域驱动设计（DDD）一致。一个好的 DSL 可以减少歧义，使 AI 的输出更加可预测，并让我们清晰地沟通复杂想法。AI 降低了构建这些语言的成本，所以我们可以更频繁地使用它们。

**主持人**：So we're moving toward "intent engineering" rather than just prompt engineering?

**主持人**：所以我们正在走向"意图工程"，而不仅仅是提示工程？

**Martin Fowler**：Yes. Prompt engineering is a short-term hack. DSLs are a long-term solution for reliable, scalable human-AI collaboration.

**Martin Fowler**：是的。提示工程是短期的权宜之计。DSL 是可靠、可扩展的人机协作的长期解决方案。

---

## 七、敏捷在 AI 时代：核心理念更重要

**主持人**：You're one of the authors of the Agile Manifesto. Does agile still matter in the age of AI?

**主持人**：你是《敏捷宣言》的作者之一。在 AI 时代，敏捷仍然重要吗？

**Martin Fowler**：Agile isn't just relevant—it's essential. The core ideas of agile—small batches, fast feedback, human-in-the-loop validation—are exactly what we need to manage AI's non-determinism.

**Martin Fowler**：敏捷不仅相关——它是必不可少的。敏捷的核心思想——小批次、快速反馈、人在回路中的验证——正是我们管理 AI 非确定性所需要的。

AI lets us iterate faster, so we should make our cycles even shorter. Small steps, quick experiments, constant learning. AI speeds up execution, but humans must control direction. The judgment of what to build and why remains purely human.

AI 让我们迭代更快，所以我们应该让周期更短。小步前进、快速实验、持续学习。AI 加速了执行，但人类必须控制方向。关于构建什么以及为什么的判断仍然是纯粹的人类职责。

**主持人**：So agile is the framework for taming AI?

**主持人**：所以敏捷是驯服 AI 的框架？

**Martin Fowler**：Absolutely. Agile is how we keep AI from running wild. It's the discipline that prevents speed from turning into chaos.

**Martin Fowler**：绝对如此。敏捷是我们防止 AI 失控的方式。它是防止速度变成混乱的纪律。

---

## 八、设计模式：热度下降，但思维永存

**主持人**：Design patterns were huge 20 years ago. Now young developers don't talk about them as much. Are patterns obsolete?

**主持人**：20 年前设计模式非常热门。现在年轻开发者谈论它们的频率降低了。模式过时了吗？

**Martin Fowler**：Patterns haven't gone away—they've moved. Cloud providers have turned many generic patterns into products (like serverless, managed databases). So developers don't have to implement them from scratch.

**Martin Fowler**：模式并没有消失——它们转移了。云提供商将许多通用模式转化为产品（如无服务器、托管数据库）。所以开发者不必从头实现它们。

But pattern thinking is still vital. Every organization builds its own domain-specific patterns and vocabularies. Patterns are just a shared language for discussing complex designs. That need never goes away.

但模式思维仍然至关重要。每个组织都会构建自己的领域特定模式和词汇表。模式只是讨论复杂设计的共享语言。这种需求永远不会消失。

**主持人**：So the idea of patterns is timeless, even if the specific ones change?

**主持人**：所以模式的思想是永恒的，即使具体的模式会变化？

**Martin Fowler**：Yes. The vocabulary changes, but the need to communicate complex ideas efficiently is eternal.

**Martin Fowler**：是的。词汇会变化，但高效沟通复杂想法的需求是永恒的。

---

## 九、行业判断：AI 泡沫存在，就业冲击来自利率而非 AI

**主持人**：There's a lot of hype around AI, but also a lot of layoffs in tech. What's your take on the current climate?

**主持人**：围绕 AI 有很多炒作，但科技行业也有很多裁员。你对当前形势怎么看？

**Martin Fowler**：We're in an AI bubble, and it will burst. But AI has real value. The contradiction is: on one side, we have massive AI investment; on the other, industry-wide layoffs. The layoffs aren't because of AI—they're because the zero-interest rate era ended. Capital got tighter, and companies are cutting costs.

**Martin Fowler**：我们正处于 AI 泡沫中，它会破裂。但 AI 有真正的价值。矛盾在于：一方面，我们有大量的 AI 投资；另一方面，全行业都在裁员。裁员不是因为 AI——而是因为零利率时代结束了。资本变得更紧张，公司正在削减成本。

Software development as a career is safe. The demand for solving problems, understanding users, and building systems will only grow. AI changes how we work, but it doesn't eliminate the need for human engineers.

软件开发作为职业是安全的。对解决问题、理解用户和构建系统的需求只会增长。AI 改变了我们的工作方式，但它不会消除对人类工程师的需求。

**主持人**：So AI is a disruptor, not a job killer?

**主持人**：所以 AI 是颠覆者，而不是工作杀手？

**Martin Fowler**：Disruptor, yes. Job killer, no. It will change jobs, but not eliminate them. The best engineers will adapt and thrive.

**Martin Fowler**：颠覆者，是的。工作杀手，不是。它会改变工作，但不会消除它们。最优秀的工程师会适应并茁壮成长。

---

## 十、给开发者的核心建议

**Martin Fowler**：For developers, especially young ones:

**Martin Fowler**：对于开发者，尤其是年轻开发者：

1. **Find a human mentor**: AI can't teach judgment or experience. Learn from people who've been there.
   **找到人类导师**：AI 无法教授判断力或经验。向有经验的人学习。

2. **Be skeptical**: Don't trust AI blindly. Ask "why?" Verify everything. Treat AI as a tool, not an authority.
   **保持怀疑**：不要盲目信任 AI。问"为什么？"验证一切。将 AI 视为工具，而不是权威。

3. **Master core skills**: The ability to understand requirements, communicate, decompose problems, and make tradeoffs—these are AI-proof.
   **掌握核心技能**：理解需求、沟通、分解问题和做出权衡的能力——这些是 AI 无法替代的。

4. **Learn probability**: Read _Thinking, Fast and Slow_ by Daniel Kahneman. We need to think in probabilities now.
   **学习概率思维**：阅读丹尼尔·卡尼曼的《思考，快与慢》。我们现在需要用概率来思考。

5. **Don't rush to judgment**: With new tech, wait, experiment, and form your own opinion. Don't jump on bandwagons.
   **不要急于下结论**：对于新技术，等待、实验，形成自己的观点。不要随波逐流。

**主持人**：Any final thoughts?

**主持人**：还有什么最后的想法吗？

**Martin Fowler**：AI is the biggest shift in my lifetime. But the fundamentals of software engineering—clarity, discipline, understanding—still rule. Our job is to harness AI's power while keeping control. The human mind is still the most important tool we have.

**Martin Fowler**：AI 是我一生中最大的转变。但软件工程的基础——清晰、纪律、理解——仍然占主导地位。我们的工作是在保持控制的同时利用 AI 的力量。人类思维仍然是我们拥有的最重要的工具。

**主持人**：Martin, thank you so much for your insights. This has been an incredible conversation.

**主持人**：Martin，非常感谢你的见解。这是一次令人难以置信的对话。

**Martin Fowler**：My pleasure. Thanks again.

**Martin Fowler**：不客气。再次感谢。
