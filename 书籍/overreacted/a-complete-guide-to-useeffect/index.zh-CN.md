---
title: useEffect 完整指南
date: '2019-03-09'
spoiler: 副作用是数据流的一部分。
cta: 'react'
tags:
  - react
lang: zh-CN
---

你写了一些使用 [Hooks](https://reactjs.org/docs/hooks-intro.html) 的组件。也许甚至是一个小应用。你大体上很满意。你对 API 很熟悉，并且在这个过程中学到了一些技巧。你甚至创建了一些[自定义 Hooks](https://reactjs.org/docs/hooks-custom.html) 来提取重复的逻辑（减少了 300 行代码！），并向你的同事展示了。"干得好"，他们说。

但有时候当你使用 `useEffect` 时，这些片段并不能很好地组合在一起。你有一种挥之不去的感觉，觉得自己遗漏了什么。它似乎类似于类的生命周期方法...但真的是这样吗？你发现自己会问这样的问题：

* 🤔 如何用 `useEffect` 来替代 `componentDidMount`？
* 🤔 如何在 `useEffect` 中正确获取数据？`[]` 是什么意思？
* 🤔 我是否需要将函数指定为 effect 的依赖项？
* 🤔 为什么我有时会遇到无限重新获取的循环？
* 🤔 为什么我有时会在 effect 中看到旧的 state 或 prop 值？

当我刚开始使用 Hooks 时，我也被这些问题困扰。即使在编写初始文档时，我对一些细微之处也没有完全掌握。后来我有了一些"顿悟"时刻，我想与你分享。**这篇深度文章会让这些问题的答案对你来说变得显而易见。**

要*看到*答案，我们需要退一步。这篇文章的目标不是给你一个要点清单。它是帮助你真正"理解" `useEffect`。不会有太多需要学习的东西。事实上，我们大部分时间都在*忘记*之前学的东西。

**只有当我停止通过熟悉的类生命周期方法的棱镜来看待 `useEffect` Hook 时，一切才对我变得清晰起来。**

>"忘记你所学到的东西。" — 尤达

![尤达嗅着空气。标题："我闻到了培根的味道。"](./img/yoda.jpg)

---

**本文假设你对 [`useEffect`](https://reactjs.org/docs/hooks-effect.html) API 有一定的了解。**

**这篇文章也*非常*长。它就像一本小书。这只是我喜欢的格式。但如果你很匆忙或不太在意，我在下面写了一个 TLDR。**

**如果你不喜欢深度文章，你可能想等到这些解释出现在其他地方。就像 React 在 2013 年推出时一样，人们需要一些时间来认识不同的心智模型并教授它。**

---

## TLDR

如果你不想阅读整篇文章，这里有一个快速的 TLDR。如果某些部分没有意义，你可以向下滚动直到找到相关内容。

如果你计划阅读整篇文章，可以随意跳过它。我会在最后链接到它。

**🤔 问题：如何用 `useEffect` 来替代 `componentDidMount`？**

虽然你可以使用 `useEffect(fn, [])`，但它并不是完全等价的。与 `componentDidMount` 不同，它会*捕获* props 和 state。所以即使在回调函数内部，你也会看到初始的 props 和 state。如果你想看到"最新"的某个值，你可以将它写入一个 ref。但通常有一种更简单的方法来组织代码，这样你就不需要这样做。请记住，effect 的心智模型与 `componentDidMount` 和其他生命周期方法不同，试图找到它们的完全等价物可能会让你更加困惑而不是有所帮助。要提高效率，你需要"用 effect 思考"，它们的心智模型更接近于实现同步，而不是响应生命周期事件。

**🤔 问题：如何在 `useEffect` 中正确获取数据？`[]` 是什么意思？**

[这篇文章](https://www.robinwieruch.de/react-hooks-fetch-data/)是关于使用 `useEffect` 获取数据的一个很好的入门。一定要读到最后！它没有这篇文章那么长。`[]` 表示 effect 不使用任何参与 React 数据流的值，因此可以安全地只应用一次。当值实际上*被使用*时，这也是一个常见的 bug 来源。你需要学习一些策略（主要是 `useReducer` 和 `useCallback`），这些策略可以*消除*对依赖项的需求，而不是错误地省略它。

**🤔 问题：我是否需要将函数指定为 effect 的依赖项？**

建议是将不需要 props 或 state 的函数*提升*到组件外部，并将仅在 effect 中使用的函数*拉入*该 effect 内部。如果在那之后，你的 effect 仍然使用渲染作用域中的函数（包括来自 props 的函数），请在定义它们的地方用 `useCallback` 包装它们，然后重复这个过程。为什么这很重要？函数可以"看到"来自 props 和 state 的值——所以它们参与数据流。我们的 FAQ 中有[更详细的答案](https://reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies)。

**🤔 问题：为什么我有时会遇到无限重新获取的循环？**

如果你在 effect 中进行数据获取而没有第二个依赖项参数，就会发生这种情况。没有它，effect 会在每次渲染后运行——而设置 state 会再次触发 effect。如果你在依赖数组中指定了一个*总是*变化的值，也可能发生无限循环。你可以通过逐个移除它们来判断是哪一个。然而，移除你使用的依赖项（或盲目地指定 `[]`）通常是错误的修复方法。相反，应该从源头修复问题。例如，函数可能导致这个问题，将它们放在 effect 内部、提升它们或使用 `useCallback` 包装它们会有所帮助。为了避免重新创建对象，`useMemo` 可以起到类似的作用。

**🤔 为什么我有时会在 effect 中看到旧的 state 或 prop 值？**

Effect 总是"看到"它们被定义时的渲染中的 props 和 state。这[有助于防止 bug](../how-are-function-components-different-from-classes/index.md)，但在某些情况下可能会很烦人。对于这些情况，你可以在可变 ref 中显式维护某个值（链接文章在最后解释了这一点）。如果你认为你看到的是来自旧渲染的某些 props 或 state，但你不期望这样，你可能遗漏了一些依赖项。尝试使用[lint 规则](https://github.com/facebook/react/issues/14920)来训练自己看到它们。几天后，它就会成为你的第二天性。另请参阅我们 FAQ 中的[这个答案](https://reactjs.org/docs/hooks-faq.html#why-am-i-seeing-stale-props-or-state-inside-my-function)。

---

我希望这个 TLDR 对你有帮助！否则，让我们开始吧。

---

## 每次渲染都有自己的 Props 和 State

在我们讨论 effect 之前，我们需要先讨论渲染。

这是一个计数器。仔细看高亮的行：

```jsx {6}
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

这意味着什么？`count` 是否以某种方式"监视"我们 state 的变化并自动更新？当你学习 React 时，这可能是一个有用的第一直觉，但它*不是*一个[准确的心智模型](https://overreacted.io/react-as-a-ui-runtime/)。

**在这个例子中，`count` 只是一个数字。** 它不是神奇的"数据绑定"、"监视器"、"代理"或其他任何东西。它就是一个普通的数字，就像这样：

```jsx
const count = 42;
// ...
<p>You clicked {count} times</p>
// ...
```

第一次渲染我们的组件时，我们从 `useState()` 得到的 `count` 变量是 `0`。当我们调用 `setCount(1)` 时，React 会再次调用我们的组件。这次，`count` 将是 `1`。以此类推：

```jsx {3,11,19}
// 第一次渲染
function Counter() {
  const count = 0; // 由 useState() 返回
  // ...
  <p>You clicked {count} times</p>
  // ...
}

// 点击后，我们的函数再次被调用
function Counter() {
  const count = 1; // 由 useState() 返回
  // ...
  <p>You clicked {count} times</p>
  // ...
}

// 再次点击后，我们的函数再次被调用
function Counter() {
  const count = 2; // 由 useState() 返回
  // ...
  <p>You clicked {count} times</p>
  // ...
}
```

**每当我们更新 state 时，React 都会调用我们的组件。每个渲染结果都"看到"自己的 `count` state 值，这是函数内部的*常量*。**

所以这行代码不会做任何特殊的数据绑定：

```jsx
<p>You clicked {count} times</p>
```

**它只是将一个数字值嵌入到渲染输出中。** 这个数字由 React 提供。当我们调用 `setCount` 时，React 会用不同的 `count` 值再次调用我们的组件。然后 React 更新 DOM 以匹配我们最新的渲染输出。

关键要点是，任何特定渲染中的 `count` 常量不会随时间变化。是我们的组件被再次调用——每次渲染都"看到"自己的 `count` 值，这些值在渲染之间是隔离的。

*（关于这个过程的深入概述，请查看我的文章 [React as a UI Runtime](https://overreacted.io/react-as-a-ui-runtime/)。）*

## 每次渲染都有自己的事件处理函数

到目前为止还不错。事件处理函数呢？

看这个例子。它在三秒后显示一个带有 `count` 的警告：

```jsx {4-8,16-18}
function Counter() {
  const [count, setCount] = useState(0);

  function handleAlertClick() {
    setTimeout(() => {
      alert('You clicked on: ' + count);
    }, 3000);
  }

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
      <button onClick={handleAlertClick}>
        Show alert
      </button>
    </div>
  );
}
```

假设我执行以下步骤序列：

* **增加**计数器到 3
* **按下**"Show alert"
* **在超时触发之前**将其增加到 5

![计数器演示](./img/counter.gif)

你期望警告显示什么？它会显示 5（警告时的计数器 state）还是 3（我点击时的 state）？

----

*剧透警告*

---

继续，[自己试试吧！](https://codesandbox.io/s/w2wxl3yo0l)

如果行为对你来说不太合理，想象一个更实际的例子：一个聊天应用，当前收件人 ID 在 state 中，还有一个发送按钮。[这篇文章](https://overreacted.io/how-are-function-components-different-from-classes/)深入探讨了原因，但正确答案是 3。

警告会"捕获"我点击按钮时的 state。

*（也有方法可以实现另一种行为，但我现在专注于默认情况。在构建心智模型时，区分"最小阻力路径"和可选的逃生舱口很重要。）*

---

但它是如何工作的呢？

我们已经讨论过，`count` 值对于函数的每次特定调用都是常量。值得强调的是——**我们的函数会被调用多次（每次渲染一次），但每次调用时，函数内部的 `count` 值都是常量，并设置为特定值（该次渲染的 state）。**

这不是 React 特有的——普通函数也以类似的方式工作：

```jsx {2}
function sayHi(person) {
  const name = person.name;
  setTimeout(() => {
    alert('Hello, ' + name);
  }, 3000);
}

let someone = {name: 'Dan'};
sayHi(someone);

someone = {name: 'Yuzhi'};
sayHi(someone);

someone = {name: 'Dominic'};
sayHi(someone);
```

在[这个例子](https://codesandbox.io/s/mm6ww11lk8)中，外部的 `someone` 变量被重新赋值了几次。（就像在 React 的某个地方，*当前*的组件 state 可以改变一样。）**然而，在 `sayHi` 内部，有一个局部的 `name` 常量，它与特定调用中的 `person` 相关联。** 这个常量是局部的，所以在调用之间是隔离的！因此，当超时触发时，每个警告都会"记住"自己的 `name`。

这解释了我们的事件处理函数如何在点击时捕获 `count`。如果我们应用相同的替换原则，每次渲染都"看到"自己的 `count`：

```jsx {3,15,27}
// 第一次渲染
function Counter() {
  const count = 0; // 由 useState() 返回
  // ...
  function handleAlertClick() {
    setTimeout(() => {
      alert('You clicked on: ' + count);
    }, 3000);
  }
  // ...
}

// 点击后，我们的函数再次被调用
function Counter() {
  const count = 1; // 由 useState() 返回
  // ...
  function handleAlertClick() {
    setTimeout(() => {
      alert('You clicked on: ' + count);
    }, 3000);
  }
  // ...
}

// 再次点击后，我们的函数再次被调用
function Counter() {
  const count = 2; // 由 useState() 返回
  // ...
  function handleAlertClick() {
    setTimeout(() => {
      alert('You clicked on: ' + count);
    }, 3000);
  }
  // ...
}
```

所以实际上，每次渲染都返回自己的 `handleAlertClick` "版本"。每个版本都"记住"自己的 `count`：

```jsx {6,10,19,23,32,36}
// 第一次渲染
function Counter() {
  // ...
  function handleAlertClick() {
    setTimeout(() => {
      alert('You clicked on: ' + 0);
    }, 3000);
  }
  // ...
  <button onClick={handleAlertClick} /> // 内部包含 0 的那个
  // ...
}

// 点击后，我们的函数再次被调用
function Counter() {
  // ...
  function handleAlertClick() {
    setTimeout(() => {
      alert('You clicked on: ' + 1);
    }, 3000);
  }
  // ...
  <button onClick={handleAlertClick} /> // 内部包含 1 的那个
  // ...
}

// 再次点击后，我们的函数再次被调用
function Counter() {
  // ...
  function handleAlertClick() {
    setTimeout(() => {
      alert('You clicked on: ' + 2);
    }, 3000);
  }
  // ...
  <button onClick={handleAlertClick} /> // 内部包含 2 的那个
  // ...
}
```

这就是为什么[在这个演示中](https://codesandbox.io/s/w2wxl3yo0l)事件处理函数"属于"特定的渲染，当你点击时，它会继续使用*来自*该渲染的 `counter` state。

**在任何特定的渲染内部，props 和 state 永远保持不变。** 但如果 props 和 state 在渲染之间是隔离的，那么使用它们的任何值（包括事件处理函数）也是如此。它们也"属于"特定的渲染。所以即使事件处理函数内部的异步函数也会"看到"相同的 `count` 值。

*旁注：我在上面的 `handleAlertClick` 函数中直接内联了具体的 `count` 值。这种心智替换是安全的，因为 `count` 在特定渲染中不可能改变。它被声明为 `const` 并且是一个数字。对于其他值（如对象）也可以安全地这样思考，但前提是我们同意避免改变 state。使用新创建的对象调用 `setSomething(newObj)` 而不是改变它是可以的，因为属于之前渲染的 state 是完整的。*

## 每次渲染都有自己的 Effects

这本来应该是一篇关于 effect 的文章，但我们还没有讨论 effect！我们现在来纠正这一点。事实证明，effect 并没有什么不同。

让我们回到[文档](https://reactjs.org/docs/hooks-effect.html)中的一个例子：

```jsx {4-6}
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

**这里有一个问题：effect 如何读取最新的 `count` state？**

也许，有某种"数据绑定"或"监视"机制，使 `count` 在 effect 函数内部实时更新？也许 `count` 是 React 在我们组件内部设置的可变变量，这样我们的 effect 总是能看到最新的值？

不是的。

我们已经知道 `count` 在特定组件渲染中是常量。事件处理函数"看到"它们"属于"的渲染中的 `count` state，因为 `count` 是它们作用域中的变量。effect 也是如此！

**不是 `count` 变量在"不变"的 effect 内部以某种方式改变。而是*effect 函数本身*在每次渲染时都不同。**

每个版本都"看到"它"属于"的渲染中的 `count` 值：

```jsx {5-8,17-20,29-32}
// 第一次渲染
function Counter() {
  // ...
  useEffect(
    // 第一次渲染的 effect 函数
    () => {
      document.title = `You clicked ${0} times`;
    }
  );
  // ...
}

// 点击后，我们的函数再次被调用
function Counter() {
  // ...
  useEffect(
    // 第二次渲染的 effect 函数
    () => {
      document.title = `You clicked ${1} times`;
    }
  );
  // ...
}

// 再次点击后，我们的函数再次被调用
function Counter() {
  // ...
  useEffect(
    // 第三次渲染的 effect 函数
    () => {
      document.title = `You clicked ${2} times`;
    }
  );
  // ..
}
```

React 会记住你提供的 effect 函数，并在刷新 DOM 更改并让浏览器绘制屏幕后运行它。

所以即使我们在这里谈论的是单个概念上的*effect*（更新文档标题），它在每次渲染时都由*不同的函数*表示——每个 effect 函数都"看到"它"属于"的特定渲染中的 props 和 state。

**从概念上讲，你可以想象 effect 是*渲染结果的一部分*。**

严格来说，它们不是（为了[允许 Hook 组合](https://overreacted.io/why-do-hooks-rely-on-call-order/)而不会产生笨拙的语法或运行时开销）。但在我们正在构建的心智模型中，effect 函数*属于*特定的渲染，就像事件处理函数一样。

---

为了确保我们有扎实的理解，让我们回顾一下第一次渲染：

* **React:** 当 state 是 `0` 时，给我 UI。
* **你的组件:**
  * 这是渲染结果：
  `<p>You clicked 0 times</p>`。
  * 另外，完成后记得运行这个 effect：`() => { document.title = 'You clicked 0 times' }`。
* **React:** 好的。更新 UI。嘿浏览器，我正在向 DOM 添加一些内容。
* **浏览器:** 好的，我已经把它绘制到屏幕上了。
* **React:** 好的，现在我要运行你给我的 effect。
  * 运行 `() => { document.title = 'You clicked 0 times' }`。

---

现在让我们回顾一下点击后发生的事情：

* **你的组件:** 嘿 React，把我的 state 设置为 `1`。
* **React:** 当 state 是 `1` 时，给我 UI。
* **你的组件:**
  * 这是渲染结果：
  `<p>You clicked 1 times</p>`。
  * 另外，完成后记得运行这个 effect：`() => { document.title = 'You clicked 1 times' }`。
* **React:** 好的。更新 UI。嘿浏览器，我已经更改了 DOM。
* **浏览器:** 好的，我已经把你的更改绘制到屏幕上了。
* **React:** 好的，现在我要运行属于我刚才做的渲染的 effect。
  * 运行 `() => { document.title = 'You clicked 1 times' }`。

---

## 每次渲染都有自己的...一切

**我们现在知道 effect 在每次渲染后运行，在概念上是组件输出的一部分，并且"看到"来自该特定渲染的 props 和 state。**

让我们尝试一个思想实验。考虑这段代码：

```jsx {4-8}
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      console.log(`You clicked ${count} times`);
    }, 3000);
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

如果我快速连续点击几次，日志会是什么样子？

---

*剧透警告*

---

你可能会认为这是一个陷阱，最终结果不直观。不是的！我们会看到一系列日志——每个都属于特定的渲染，因此有自己的 `count` 值。你可以[自己试试](https://codesandbox.io/s/lyx20m1ol)：

![按顺序记录 1, 2, 3, 4, 5 的屏幕录制](./img/timeout_counter.gif)

你可能会想："当然是这样工作的！还能怎么工作？"

嗯，`this.state` 在类中不是这样工作的。很容易错误地认为这个[类实现](https://codesandbox.io/s/kkymzwjqz3)是等价的：

```jsx
  componentDidUpdate() {
    setTimeout(() => {
      console.log(`You clicked ${this.state.count} times`);
    }, 3000);
  }
```

然而，`this.state.count` 总是指向*最新的* count，而不是属于特定渲染的那个。所以你会看到每次都记录 `5`：

![按顺序记录 5, 5, 5, 5, 5 的屏幕录制](./img/timeout_counter_class.gif)

我认为这很讽刺，Hooks 如此依赖 JavaScript 闭包，但却是类实现遭受了[经典的超时中错误值的困惑](https://wsvincent.com/javascript-closure-settimeout-for-loop/)，这通常与闭包相关。这是因为在这个例子中，困惑的真正来源是突变（React 在类中改变 `this.state` 指向最新的 state），而不是闭包本身。

**当你关闭的值从不改变时，闭包是很好的。这使得它们很容易思考，因为你本质上是在引用常量。** 正如我们讨论的，props 和 state 在特定渲染中从不改变。顺便说一下，我们可以修复类版本...通过[使用闭包](https://codesandbox.io/s/w7vjo07055)。

## 逆流而上

在这一点上，重要的是我们要明确地指出：**组件渲染内部的每个**函数（包括事件处理函数、effect、它们内部的超时或 API 调用）都会捕获定义它的渲染调用的 props 和 state。

所以这两个例子是等价的：

```jsx {4}
function Example(props) {
  useEffect(() => {
    setTimeout(() => {
      console.log(props.counter);
    }, 1000);
  });
  // ...
}
```

```jsx {2,5}
function Example(props) {
  const counter = props.counter;
  useEffect(() => {
    setTimeout(() => {
      console.log(counter);
    }, 1000);
  });
  // ...
}
```

**你在组件内部"早期"读取 props 或 state 并不重要。** 它们不会改变！在单个渲染的作用域内，props 和 state 保持不变。（解构 props 使这一点更加明显。）

当然，有时你*想要*读取最新的值，而不是在 effect 中定义的某个回调中捕获的值。最简单的方法是使用 refs，如[这篇文章](https://overreacted.io/how-are-function-components-different-from-classes/)最后一节所述。

请注意，当你想从*过去*渲染的函数中读取*未来*的 props 或 state 时，你是在逆流而上。这不是*错误的*（在某些情况下是必要的），但打破范式可能看起来不那么"干净"。这是一个有意的后果，因为它有助于突出哪些代码是脆弱的并依赖于时序。在类中，这种情况发生时不太明显。

这是[我们计数器示例的一个版本](https://codesandbox.io/s/rm7z22qnlp)，它复制了类行为：

```jsx {3,6-7,9-10}
function Example() {
  const [count, setCount] = useState(0);
  const latestCount = useRef(count);

  useEffect(() => {
    // 设置可变的最新值
    latestCount.current = count;
    setTimeout(() => {
      // 读取可变的最新值
      console.log(`You clicked ${latestCount.current} times`);
    }, 3000);
  });
  // ...
```

![按顺序记录 5, 5, 5, 5, 5 的屏幕录制](./img/timeout_counter_refs.gif)

在 React 中改变某些东西可能看起来很奇怪。然而，这正是 React 本身在类中重新分配 `this.state` 的方式。与捕获的 props 和 state 不同，你不能保证读取 `latestCount.current` 会在任何特定的回调中给你相同的值。根据定义，你可以随时改变它。这就是为什么它不是默认的，你必须选择使用它。

## 那么清理呢？

正如[文档解释的](https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup)，一些 effect 可能有一个清理阶段。本质上，它的目的是"撤销"一个 effect，用于订阅等情况。

考虑这段代码：

```jsx
  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.id, handleStatusChange);
    };
  });
```

假设第一次渲染时 `props` 是 `{id: 10}`，第二次渲染时是 `{id: 20}`。你*可能*认为会发生这样的事情：

* React 清理 `{id: 10}` 的 effect。
* React 渲染 `{id: 20}` 的 UI。
* React 运行 `{id: 20}` 的 effect。

（这不是实际情况。）

使用这种心智模型，你可能认为清理"看到"旧的 props，因为它在重新渲染之前运行，然后新的 effect"看到"新的 props，因为它在重新渲染之后运行。这是直接从类生命周期中提取的心智模型，**在这里并不准确**。让我们看看为什么。

React 只在[让浏览器绘制](https://medium.com/@dan_abramov/this-benchmark-is-indeed-flawed-c3d6b5b6f97f)之后运行 effect。这使你的应用更快，因为大多数 effect 不需要阻塞屏幕更新。Effect 清理也会延迟。**之前的 effect 在*重新渲染*新 props *之后*被清理：**

* **React 渲染 `{id: 20}` 的 UI。**
* 浏览器绘制。我们在屏幕上看到 `{id: 20}` 的 UI。
* **React 清理 `{id: 10}` 的 effect。**
* React 运行 `{id: 20}` 的 effect。

你可能想知道：如果清理在 props 改变为 `{id: 20}` *之后*运行，之前的 effect 的清理如何仍然"看到"旧的 `{id: 10}` props？

我们之前来过这里... 🤔

![似曾相识（《黑客帝国》电影中的猫场景）](./img/deja_vu.gif)

引用上一节：

>组件渲染内部的每个函数（包括事件处理函数、effect、它们内部的超时或 API 调用）都会捕获定义它的渲染调用的 props 和 state。

现在答案很清楚了！Effect 清理不会读取"最新"的 props，无论这意味着什么。它读取属于定义它的渲染的 props：

```jsx {8-11}
// 第一次渲染，props 是 {id: 10}
function Example() {
  // ...
  useEffect(
    // 第一次渲染的 effect
    () => {
      ChatAPI.subscribeToFriendStatus(10, handleStatusChange);
      // 第一次渲染的 effect 的清理
      return () => {
        ChatAPI.unsubscribeFromFriendStatus(10, handleStatusChange);
      };
    }
  );
  // ...
}

// 下一次渲染，props 是 {id: 20}
function Example() {
  // ...
  useEffect(
    // 第二次渲染的 effect
    () => {
      ChatAPI.subscribeToFriendStatus(20, handleStatusChange);
      // 第二次渲染的 effect 的清理
      return () => {
        ChatAPI.unsubscribeFromFriendStatus(20, handleStatusChange);
      };
    }
  );
  // ...
}
```

王国会兴起并化为灰烬，太阳会脱落外层成为白矮星，最后的文明会结束。但没有什么能让第一次渲染 effect 的清理"看到"的 props 变成 `{id: 10}` 以外的任何东西。

这就是允许 React 在绘制后立即处理 effect 的原因——并默认使你的应用更快。如果我们的代码需要，旧的 props 仍然在那里。

## 同步，而不是生命周期

关于 React，我最喜欢的事情之一是它统一了描述初始渲染结果和更新。这[减少了程序的熵](https://overreacted.io/the-bug-o-notation/)。

假设我的组件看起来像这样：

```jsx
function Greeting({ name }) {
  return (
    <h1 className="Greeting">
      Hello, {name}
    </h1>
  );
}
```

无论我是先渲染 `<Greeting name="Dan" />` 然后渲染 `<Greeting name="Yuzhi" />`，还是直接渲染 `<Greeting name="Yuzhi" />`。最终，我们都会看到 "Hello, Yuzhi"。

人们说："重要的是过程，而不是目的地"。对于 React，情况正好相反。**重要的是目的地，而不是过程。** 这就是 jQuery 代码中 `$.addClass` 和 `$.removeClass` 调用（我们的"过程"）与在 React 代码中指定 CSS 类*应该是什么*（我们的"目的地"）之间的区别。

**React 根据我们当前的 props 和 state 同步 DOM。** 在渲染时，"挂载"或"更新"之间没有区别。

你应该以类似的方式思考 effect。**`useEffect` 让你根据我们的 props 和 state *同步* React 树之外的东西。**

```jsx {2-4}
function Greeting({ name }) {
  useEffect(() => {
    document.title = 'Hello, ' + name;
  });
  return (
    <h1 className="Greeting">
      Hello, {name}
    </h1>
  );
}
```

这与熟悉的*挂载/更新/卸载*心智模型有细微差别。真正内化这一点很重要。**如果你试图编写一个根据组件是否是第一次渲染而表现不同的 effect，你是在逆流而上！** 如果我们的结果依赖于"过程"而不是"目的地"，我们就无法同步。

无论我们是用 props A、B 和 C 渲染，还是直接用 C 渲染，都不应该重要。虽然可能有一些临时差异（例如，当我们正在获取数据时），但最终结果应该是相同的。

当然，在*每次*渲染时运行所有 effect 可能效率不高。（在某些情况下，它会导致无限循环。）

那么我们如何修复这个问题呢？

## 教 React 比较你的 Effects

我们已经从 DOM 本身学到了这一课。React 不会在每次重新渲染时都接触 DOM，而是只更新实际更改的 DOM 部分。

当你更新

```jsx
<h1 className="Greeting">
  Hello, Dan
</h1>
```

到

```jsx
<h1 className="Greeting">
  Hello, Yuzhi
</h1>
```

React 看到两个对象：

```jsx
const oldProps = {className: 'Greeting', children: 'Hello, Dan'};
const newProps = {className: 'Greeting', children: 'Hello, Yuzhi'};
```

它遍历它们的每个 props，确定 `children` 已更改并需要 DOM 更新，但 `className` 没有。所以它可以只做：

```jsx
domNode.innerText = 'Hello, Yuzhi';
// 不需要接触 domNode.className
```

**我们能否对 effect 也做类似的事情？在不需要应用 effect 时避免重新运行它们会很好。**

例如，也许我们的组件因为 state 更改而重新渲染：

```jsx {11-13}
function Greeting({ name }) {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    document.title = 'Hello, ' + name;
  });

  return (
    <h1 className="Greeting">
      Hello, {name}
      <button onClick={() => setCounter(count + 1)}>
        Increment
      </button>
    </h1>
  );
}
```

但我们的 effect 不使用 `counter` state。**我们的 effect 将 `document.title` 与 `name` prop 同步，但 `name` prop 是相同的。** 在每次 counter 更改时重新分配 `document.title` 似乎不太理想。

好的，那么 React 能否...比较 effect？

```jsx
let oldEffect = () => { document.title = 'Hello, Dan'; };
let newEffect = () => { document.title = 'Hello, Dan'; };
// React 能看到这些函数做同样的事情吗？
```

不太可能。React 无法在不调用函数的情况下猜测函数的作用。（源代码并不真正包含特定值，它只是关闭了 `name` prop。）

这就是为什么如果你想避免不必要地重新运行 effect，你可以向 `useEffect` 提供一个依赖数组（也称为"deps"）参数：

```jsx {3}
  useEffect(() => {
    document.title = 'Hello, ' + name;
  }, [name]); // 我们的 deps
```

**这就像我们告诉 React："嘿，我知道你看不到这个函数*内部*，但我保证它只使用 `name`，而不使用渲染作用域中的其他任何东西。"**

如果这些值在当前和上次运行此 effect 时都相同，那么没有什么需要同步的，所以 React 可以跳过这个 effect：

```jsx
const oldEffect = () => { document.title = 'Hello, Dan'; };
const oldDeps = ['Dan'];

const newEffect = () => { document.title = 'Hello, Dan'; };
const newDeps = ['Dan'];

// React 无法窥视函数内部，但它可以比较 deps。
// 由于所有 deps 都相同，它不需要运行新的 effect。
```

如果依赖数组中的任何一个值在渲染之间不同，我们知道不能跳过运行 effect。同步所有东西！

## 不要对 React 撒谎依赖项

对 React 撒谎依赖项会有不好的后果。直观地说，这是有道理的，但我看到几乎所有使用类的心智模型尝试 `useEffect` 的人都试图欺骗规则。（我一开始也这样做过！）

```jsx
function SearchResults() {
  async function fetchData() {
    // ...
  }

  useEffect(() => {
    fetchData();
  }, []); // 这样可以吗？不总是——有更好的写法。
  // ...
}
```

*（[Hooks FAQ](https://reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) 解释了应该怎么做。我们会在[下面](#moving-functions-inside-effects)回到这个例子。）*

"但我只想在挂载时运行它！"，你会说。现在，请记住：如果你指定了 deps，**effect 使用的组件内部*所有*值*必须*在那里**。包括 props、state、函数——组件中的任何东西。

有时当你这样做时，会导致问题。例如，也许你看到无限重新获取循环，或者 socket 被重新创建得太频繁。**解决这个问题的方法*不是*移除依赖项。** 我们很快就会看到解决方案。

但在我们跳到解决方案之前，让我们更好地理解这个问题。

## 当依赖项撒谎时会发生什么

如果 deps 包含 effect 使用的每个值，React 知道何时重新运行它：

```jsx {3}
  useEffect(() => {
    document.title = 'Hello, ' + name;
  }, [name]);
```

![effect 相互替换的图表](./img/deps-compare-correct.gif)

*（依赖项不同，所以我们重新运行 effect。）*

但如果我们为这个 effect 指定 `[]`，新的 effect 函数就不会运行：

```jsx {3}
  useEffect(() => {
    document.title = 'Hello, ' + name;
  }, []); // 错误：name 在 deps 中缺失
```

![effect 相互替换的图表](./img/deps-compare-wrong.gif)

*（依赖项相同，所以我们跳过 effect。）*

在这种情况下，问题可能很明显。但在其他情况下，直觉可能会欺骗你，类解决方案会从你的记忆中"跳出来"。

例如，假设我们正在编写一个每秒递增的计数器。使用类，我们的直觉是："设置一次 interval，销毁一次"。这是我们可以如何做的[例子](https://codesandbox.io/s/n5mjzjy9kl)。当我们在心理上将这段代码转换为 `useEffect` 时，我们本能地在 deps 中添加 `[]`。"我想让它运行一次"，对吧？

```jsx {9}
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return <h1>{count}</h1>;
}
```

然而，这个例子[只*递增*一次](https://codesandbox.io/s/91n5z8jo7r)。*糟糕。*

如果你的心智模型是"依赖项让我指定何时想要重新触发 effect"，这个例子可能会给你带来存在主义危机。你*想要*触发一次，因为这是一个 interval——那么为什么它会导致问题呢？

然而，如果你知道依赖项是我们向 React 提供的关于 effect 从渲染作用域使用的*所有*内容的提示，这就说得通了。它使用 `count`，但我们用 `[]` 撒谎说它不使用。这只是时间问题，这迟早会咬我们一口！

在第一次渲染中，`count` 是 `0`。因此，第一次渲染的 effect 中的 `setCount(count + 1)` 意味着 `setCount(0 + 1)`。**由于我们因为 `[]` deps 而从不重新运行 effect，它会每秒继续调用 `setCount(0 + 1)`：**

```jsx {8,12,21-22}
// 第一次渲染，state 是 0
function Counter() {
  // ...
  useEffect(
    // 第一次渲染的 effect
    () => {
      const id = setInterval(() => {
        setCount(0 + 1); // 总是 setCount(1)
      }, 1000);
      return () => clearInterval(id);
    },
    [] // 从不重新运行
  );
  // ...
}

// 每次下一次渲染，state 是 1
function Counter() {
  // ...
  useEffect(
    // 这个 effect 总是被忽略，因为
    // 我们对 React 撒谎说 deps 是空的。
    () => {
      const id = setInterval(() => {
        setCount(1 + 1);
      }, 1000);
      return () => clearInterval(id);
    },
    []
  );
  // ...
}
```

我们通过说我们的 effect 不依赖于组件内部的值来对 React 撒谎，但实际上它确实依赖！

我们的 effect 使用 `count`——组件内部的值（但在 effect 外部）：

```jsx {1,5}
  const count = // ...

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
```

因此，将 `[]` 指定为依赖项会创建一个 bug。React 会比较依赖项，并跳过更新这个 effect：

![过时 interval 闭包的图表](./img/interval-wrong.gif)

*（依赖项相同，所以我们跳过 effect。）*

像这样的问题很难思考。因此，我鼓励你将其作为硬性规则，始终对 effect 依赖项诚实，并指定所有依赖项。（如果你想在你的团队中强制执行这一点，我们提供了一个[lint 规则](https://github.com/facebook/react/issues/14920)。）

## 对依赖项诚实的两种方法

有两种策略来对依赖项诚实。你通常应该从第一种开始，然后在需要时应用第二种。

**第一种策略是修复依赖数组，以包含组件内部在 effect 内部使用的*所有*值。** 让我们将 `count` 作为依赖项：

```jsx {3,6}
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1);
  }, 1000);
  return () => clearInterval(id);
}, [count]);
```

这使依赖数组正确。它可能不是*理想的*，但这是我们需要修复的第一个问题。现在 `count` 的更改将重新运行 effect，每个下一个 interval 在 `setCount(count + 1)` 中引用其渲染的 `count`：

```jsx {8,12,24,28}
// 第一次渲染，state 是 0
function Counter() {
  // ...
  useEffect(
    // 第一次渲染的 effect
    () => {
      const id = setInterval(() => {
        setCount(0 + 1); // setCount(count + 1)
      }, 1000);
      return () => clearInterval(id);
    },
    [0] // [count]
  );
  // ...
}

// 第二次渲染，state 是 1
function Counter() {
  // ...
  useEffect(
    // 第二次渲染的 effect
    () => {
      const id = setInterval(() => {
        setCount(1 + 1); // setCount(count + 1)
      }, 1000);
      return () => clearInterval(id);
    },
    [1] // [count]
  );
  // ...
}
```

这将[修复问题](https://codesandbox.io/s/0x0mnlyq8l)，但我们的 interval 会在 `count` 更改时被清除并重新设置。这可能是不理想的：

![重新订阅 interval 的图表](./img/interval-rightish.gif)

*（依赖项不同，所以我们重新运行 effect。））

---

**第二种策略是更改我们的 effect 代码，使其不需要比我们想要的更频繁更改的值。** 我们不想对依赖项撒谎——我们只想更改我们的 effect 以拥有*更少*的依赖项。

让我们看看一些移除依赖项的常见技术。

---

## 使 Effects 自给自足

我们想要摆脱 effect 中的 `count` 依赖项。

```jsx {3,6}
  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [count]);
```

要做到这一点，我们需要问自己：**我们使用 `count` 做什么？** 看起来我们只在 `setCount` 调用中使用它。在这种情况下，我们实际上根本不需要作用域中的 `count`。当我们想要基于先前的 state 更新 state 时，我们可以使用 `setState` 的[函数更新形式](https://reactjs.org/docs/hooks-reference.html#functional-updates)：

```jsx {3}
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
```

我喜欢将这些情况视为"虚假依赖项"。是的，`count` 是一个必要的依赖项，因为我们在 effect 内部写了 `setCount(count + 1)`。然而，我们真正需要的只是将 `count` 转换为 `count + 1` 并"发送回"React。但 React *已经知道*当前的 `count`。**我们需要告诉 React 的只是增加 state——无论它现在是什么。**

这正是 `setCount(c => c + 1)` 所做的。你可以将其视为向 React 发送关于 state 应该如何更改的"指令"。这种"更新器形式"在其他情况下也很有帮助，比如当你[批量多个更新](/react-as-a-ui-runtime/#batching)时。

**请注意，我们实际上*做了工作*来移除依赖项。我们没有作弊。我们的 effect 不再从渲染作用域读取 `counter` 值：**

![有效的 interval 图表](./img/interval-right.gif)

*（依赖项相同，所以我们跳过 effect。）*

你可以[在这里试试](https://codesandbox.io/s/q3181xz1pj)。

即使这个 effect 只运行一次，属于第一次渲染的 interval 回调也完全能够在每次 interval 触发时发送 `c => c + 1` 更新指令。它不再需要知道当前的 `counter` state。React 已经知道了。

## 函数更新和 Google Docs

还记得我们如何谈论同步是 effect 的心智模型吗？同步的一个有趣方面是，你经常希望保持系统之间的"消息"与它们的状态无关。例如，在 Google Docs 中编辑文档实际上不会将*整个*页面发送到服务器。那会非常低效。相反，它发送用户尝试做什么的表示。

虽然我们的用例不同，但类似的哲学适用于 effect。**只从 effect 内部向组件发送最少的必要信息是有帮助的。** 像 `setCount(c => c + 1)` 这样的更新器形式传达的信息严格少于 `setCount(count + 1)`，因为它没有被当前的 count"污染"。它只表达动作（"递增"）。在 React 中思考涉及[找到最小的 state](https://reactjs.org/docs/thinking-in-react.html#step-3-identify-the-minimal-but-complete-representation-of-ui-state)。这是相同的原则，但用于更新。

编码*意图*（而不是结果）类似于 Google Docs [解决](https://medium.com/@srijancse/how-real-time-collaborative-editing-work-operational-transformation-ac4902d75682)协作编辑的方式。虽然这有点牵强，但函数更新在 React 中扮演类似的角色。它们确保来自多个源（事件处理函数、effect 订阅等）的更新可以正确地批量应用并以可预测的方式应用。

**然而，即使 `setCount(c => c + 1)` 也不是那么好。** 它看起来有点奇怪，而且它能做的事情非常有限。例如，如果我们有两个值相互依赖的 state 变量，或者如果我们需要基于 prop 计算下一个 state，它不会帮助我们。幸运的是，`setCount(c => c + 1)` 有一个更强大的姐妹模式。它的名字是 `useReducer`。

## 将更新与操作解耦

让我们修改前面的例子，使其有两个 state 变量：`count` 和 `step`。我们的 interval 将按 `step` 输入的值递增计数：

```jsx {7,10}
function Counter() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + step);
    }, 1000);
    return () => clearInterval(id);
  }, [step]);

  return (
    <>
      <h1>{count}</h1>
      <input value={step} onChange={e => setStep(Number(e.target.value))} />
    </>
  );
}
```

（这是[演示](https://codesandbox.io/s/zxn70rnkx)。）

请注意，**我们没有作弊**。由于我开始在 effect 内部使用 `step`，我将其添加到依赖项中。这就是代码正确运行的原因。

这个例子中的当前行为是更改 `step` 会重启 interval——因为它是依赖项之一。在许多情况下，这正是你想要的！拆除 effect 并重新设置它没有什么错，除非我们有充分的理由，否则我们不应该避免这样做。

然而，假设我们希望 interval 时钟在 `step` 更改时不会重置。我们如何从 effect 中移除 `step` 依赖项？

**当设置一个 state 变量依赖于另一个 state 变量的当前值时，你可能想尝试用 `useReducer` 替换它们两者。**

当你发现自己写 `setSomething(something => ...)` 时，是时候考虑使用 reducer 了。Reducer 让你**将表达组件中发生的"操作"与 state 如何响应它们而更新解耦**。

让我们在 effect 中用 `dispatch` 依赖项替换 `step` 依赖项：

```jsx {1,6,9}
const [state, dispatch] = useReducer(reducer, initialState);
const { count, step } = state;

useEffect(() => {
  const id = setInterval(() => {
    dispatch({ type: 'tick' }); // 而不是 setCount(c => c + step);
  }, 1000);
  return () => clearInterval(id);
}, [dispatch]);
```

（参见[演示](https://codesandbox.io/s/xzr480k0np)。）

你可能会问我："这有什么更好的？"答案是**React 保证 `dispatch` 函数在整个组件生命周期内是常量。所以上面的例子永远不需要重新订阅 interval。**

我们解决了问题！

*（你可以从 deps 中省略 `dispatch`、`setState` 和 `useRef` 容器值，因为 React 保证它们是静态的。但指定它们也没有坏处。）*

不是在 effect *内部*读取 state，而是分派一个*操作*，该操作编码关于*发生了什么*的信息。这允许我们的 effect 与 `step` state 保持解耦。我们的 effect 不关心*如何*更新 state，它只是告诉我们*发生了什么*。而 reducer 集中了更新逻辑：

```jsx {8,9}
const initialState = {
  count: 0,
  step: 1,
};

function reducer(state, action) {
  const { count, step } = state;
  if (action.type === 'tick') {
    return { count: count + step, step };
  } else if (action.type === 'step') {
    return { count, step: action.step };
  } else {
    throw new Error();
  }
}
```

（如果你之前错过了，这是[演示](https://codesandbox.io/s/xzr480k0np)。）

## 为什么 useReducer 是 Hooks 的作弊模式

我们已经看到了如何在 effect 需要基于先前的 state 或另一个 state 变量设置 state 时移除依赖项。**但如果我们需要*props*来计算下一个 state 呢？** 例如，也许我们的 API 是 `<Counter step={1} />`。当然，在这种情况下，我们不能避免将 `props.step` 指定为依赖项？

实际上，我们可以！我们可以将*reducer 本身*放在组件内部以读取 props：

```jsx {1,6}
function Counter({ step }) {
  const [count, dispatch] = useReducer(reducer, 0);

  function reducer(state, action) {
    if (action.type === 'tick') {
      return state + step;
    } else {
      throw new Error();
    }
  }

  useEffect(() => {
    const id = setInterval(() => {
      dispatch({ type: 'tick' });
    }, 1000);
    return () => clearInterval(id);
  }, [dispatch]);

  return <h1>{count}</h1>;
}
```

这种模式禁用了一些优化，所以尽量不要到处使用它，但如果你需要，你完全可以从 reducer 访问 props。（这是[演示](https://codesandbox.io/s/7ypm405o8q)。）

**即使在这种情况下，`dispatch` 身份仍然保证在重新渲染之间是稳定的。** 所以如果你想，你可以从 effect deps 中省略它。它不会导致 effect 重新运行。

你可能想知道：这怎么可能工作？当从属于另一个渲染的 effect 内部调用时，reducer 如何"知道"props？答案是当你 `dispatch` 时，React 只是记住操作——但它会在下一次渲染时*调用*你的 reducer。到那时，新的 props 将在作用域中，你不会在 effect 内部。

**这就是为什么我喜欢将 `useReducer` 视为 Hooks 的"作弊模式"。它让我将更新逻辑与描述发生的事情解耦。这反过来帮助我从 effect 中移除不必要的依赖项，并避免比必要更频繁地重新运行它们。**

## 将函数移到 Effects 内部

一个常见的错误是认为函数不应该是依赖项。例如，这看起来可能有效：

```jsx {13}
function SearchResults() {
  const [data, setData] = useState({ hits: [] });

  async function fetchData() {
    const result = await axios(
      'https://hn.algolia.com/api/v1/search?query=react',
    );
    setData(result.data);
  }

  useEffect(() => {
    fetchData();
  }, []); // 这样可以吗？
  // ...
}
```

*（[这个例子](https://codesandbox.io/s/8j4ykjyv0)改编自 Robin Wieruch 的一篇很棒的文章——[看看](https://www.robinwieruch.de/react-hooks-fetch-data/)！）*

明确地说，这段代码*确实*有效。**但简单地省略本地函数的问题是，随着组件的增长，很难判断我们是否处理了所有情况！**

想象一下我们的代码是这样拆分的，每个函数都大了五倍：

```jsx
function SearchResults() {
  // 想象这个函数很长
  function getFetchUrl() {
    return 'https://hn.algolia.com/api/v1/search?query=react';
  }

  // 想象这个函数也很长
  async function fetchData() {
    const result = await axios(getFetchUrl());
    setData(result.data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  // ...
}
```

现在假设我们后来在这些函数之一中使用了一些 state 或 prop：

```jsx {6}
function SearchResults() {
  const [query, setQuery] = useState('react');

  // 想象这个函数也很长
  function getFetchUrl() {
    return 'https://hn.algolia.com/api/v1/search?query=' + query;
  }

  // 想象这个函数也很长
  async function fetchData() {
    const result = await axios(getFetchUrl());
    setData(result.data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  // ...
}
```

如果我们忘记更新调用这些函数的任何 effect 的 deps（可能，通过其他函数！），我们的 effect 将无法同步来自 props 和 state 的更改。这听起来不太好。

幸运的是，有一个简单的解决方案。**如果你只在某个 effect *内部*使用某些函数，直接将它们*移入*该 effect：**

```jsx {4-12}
function SearchResults() {
  // ...
  useEffect(() => {
    // 我们将这些函数移入内部！
    function getFetchUrl() {
      return 'https://hn.algolia.com/api/v1/search?query=react';
    }

    async function fetchData() {
      const result = await axios(getFetchUrl());
      setData(result.data);
    }

    fetchData();
  }, []); // ✅ Deps 是正确的
  // ...
}
```

（[这是演示](https://codesandbox.io/s/04kp3jwwql)。）

那么好处是什么？我们不再需要考虑"传递依赖项"。我们的依赖数组不再撒谎：**我们确实*没有*在 effect 中使用组件外部作用域的任何东西**。

如果我们后来编辑 `getFetchUrl` 以使用 `query` state，我们更可能注意到我们正在 effect *内部*编辑它——因此，我们需要将 `query` 添加到 effect 依赖项：

```jsx {6,15}
function SearchResults() {
  const [query, setQuery] = useState('react');

  useEffect(() => {
    function getFetchUrl() {
      return 'https://hn.algolia.com/api/v1/search?query=' + query;
    }

    async function fetchData() {
      const result = await axios(getFetchUrl());
      setData(result.data);
    }

    fetchData();
  }, [query]); // ✅ Deps 是正确的
  // ...
}
```

（这是[演示](https://codesandbox.io/s/pwm32zx7z7)。）

通过添加这个依赖项，我们不仅仅是"安抚 React"。当 query 更改时重新获取数据*是有意义的*。**`useEffect` 的设计迫使你注意数据流中的更改，并选择我们的 effect 应该如何同步它——而不是忽略它，直到我们的产品用户遇到 bug。**

感谢来自 `eslint-plugin-react-hooks` 插件的 `exhaustive-deps` lint 规则，你可以[在编辑器中输入时分析 effect](https://github.com/facebook/react/issues/14920)，并接收关于缺少哪些依赖项的建议。换句话说，机器可以告诉你哪些数据流更改没有被组件正确处理。

![Lint 规则 gif](./img/exhaustive-deps.gif)

非常棒。

## 但我不能把这个函数放在 Effect 内部

有时你可能不想将函数*移入*effect。例如，同一组件中的多个 effect 可能调用相同的函数，你不想复制粘贴其逻辑。或者它可能是一个 prop。

你应该在 effect 依赖项中跳过这样的函数吗？我认为不应该。同样，**effect 不应该对它们的依赖项撒谎。** 通常有更好的解决方案。一个常见的误解是"函数永远不会改变"。但正如我们在整篇文章中学到的，这与事实相去甚远。实际上，在组件内部定义的函数在每次渲染时都会改变！

**这本身就是一个问题。** 假设两个 effect 调用 `getFetchUrl`：

```jsx
function SearchResults() {
  function getFetchUrl(query) {
    return 'https://hn.algolia.com/api/v1/search?query=' + query;
  }

  useEffect(() => {
    const url = getFetchUrl('react');
    // ... 获取数据并做一些事情 ...
  }, []); // 🔴 缺少依赖项：getFetchUrl

  useEffect(() => {
    const url = getFetchUrl('redux');
    // ... 获取数据并做一些事情 ...
  }, []); // 🔴 缺少依赖项：getFetchUrl

  // ...
}
```

在这种情况下，你可能不想将 `getFetchUrl` 移入任一 effect，因为你无法共享逻辑。

另一方面，如果你对 effect 依赖项"诚实"，你可能会遇到问题。由于我们的两个 effect 都依赖于 `getFetchUrl` **（它在每次渲染时都不同）**，我们的依赖数组是无用的：

```jsx {2-5}
function SearchResults() {
  // 🔴 在每次渲染时重新触发所有 effect
  function getFetchUrl(query) {
    return 'https://hn.algolia.com/api/v1/search?query=' + query;
  }

  useEffect(() => {
    const url = getFetchUrl('react');
    // ... 获取数据并做一些事情 ...
  }, [getFetchUrl]); // 🚧 Deps 是正确的，但它们变化太频繁

  useEffect(() => {
    const url = getFetchUrl('redux');
    // ... 获取数据并做一些事情 ...
  }, [getFetchUrl]); // 🚧 Deps 是正确的，但它们变化太频繁

  // ...
}
```

一个诱人的解决方案是只在 deps 列表中跳过 `getFetchUrl` 函数。然而，我认为这不是一个好的解决方案。这使得我们很难注意到何时*正在*向数据流添加需要由 effect 处理的更改。这会导致像我们之前看到的"永不更新的 interval"这样的 bug。

相反，还有两个更简单的解决方案。

**首先，如果函数不使用组件作用域中的任何东西，你可以将其提升到组件外部，然后在 effect 中自由使用它：**

```jsx {1-4}
// ✅ 不受数据流影响
function getFetchUrl(query) {
  return 'https://hn.algolia.com/api/v1/search?query=' + query;
}

function SearchResults() {
  useEffect(() => {
    const url = getFetchUrl('react');
    // ... 获取数据并做一些事情 ...
  }, []); // ✅ Deps 是正确的

  useEffect(() => {
    const url = getFetchUrl('redux');
    // ... 获取数据并做一些事情 ...
  }, []); // ✅ Deps 是正确的

  // ...
}
```

不需要在 deps 中指定它，因为它不在渲染作用域中，不会受到数据流的影响。它不会意外依赖于 props 或 state。

或者，你可以将其包装到 [`useCallback` Hook](https://reactjs.org/docs/hooks-reference.html#usecallback) 中：

```jsx {2-5}
function SearchResults() {
  // ✅ 当它自己的 deps 相同时保持身份
  const getFetchUrl = useCallback((query) => {
    return 'https://hn.algolia.com/api/v1/search?query=' + query;
  }, []);  // ✅ Callback deps 是正确的

  useEffect(() => {
    const url = getFetchUrl('react');
    // ... 获取数据并做一些事情 ...
  }, [getFetchUrl]); // ✅ Effect deps 是正确的

  useEffect(() => {
    const url = getFetchUrl('redux');
    // ... 获取数据并做一些事情 ...
  }, [getFetchUrl]); // ✅ Effect deps 是正确的

  // ...
}
```

`useCallback` 本质上是添加另一层依赖项检查。它在另一端解决问题——**与其避免函数依赖项，我们让函数本身只在必要时更改**。

让我们看看为什么这种方法有用。之前，我们的例子显示了两个搜索结果（用于 `'react'` 和 `'redux'` 搜索查询）。但假设我们想添加一个输入，以便你可以搜索任意 `query`。所以 `getFetchUrl` 现在将从本地 state 读取它，而不是将 `query` 作为参数。

我们会立即看到它缺少 `query` 依赖项：

```jsx {5}
function SearchResults() {
  const [query, setQuery] = useState('react');
  const getFetchUrl = useCallback(() => { // 没有 query 参数
    return 'https://hn.algolia.com/api/v1/search?query=' + query;
  }, []); // 🔴 缺少依赖项：query
  // ...
}
```

如果我修复我的 `useCallback` deps 以包含 `query`，任何在 deps 中有 `getFetchUrl` 的 effect 都会在 `query` 更改时重新运行：

```jsx {4-7}
function SearchResults() {
  const [query, setQuery] = useState('react');

  // ✅ 在 query 更改之前保持身份
  const getFetchUrl = useCallback(() => {
    return 'https://hn.algolia.com/api/v1/search?query=' + query;
  }, [query]);  // ✅ Callback deps 是正确的

  useEffect(() => {
    const url = getFetchUrl();
    // ... 获取数据并做一些事情 ...
  }, [getFetchUrl]); // ✅ Effect deps 是正确的

  // ...
}
```

感谢 `useCallback`，如果 `query` 相同，`getFetchUrl` 也保持不变，我们的 effect 不会重新运行。但如果 `query` 更改，`getFetchUrl` 也会更改，我们将重新获取数据。这很像当你在 Excel 电子表格中更改某个单元格时，使用它的其他单元格会自动重新计算。

这只是拥抱数据流和同步心态的结果。**相同的解决方案适用于从父级传递的函数 props：**

```jsx {4-8}
function Parent() {
  const [query, setQuery] = useState('react');

  // ✅ 在 query 更改之前保持身份
  const fetchData = useCallback(() => {
    const url = 'https://hn.algolia.com/api/v1/search?query=' + query;
    // ... 获取数据并返回它 ...
  }, [query]);  // ✅ Callback deps 是正确的

  return <Child fetchData={fetchData} />
}

function Child({ fetchData }) {
  let [data, setData] = useState(null);

  useEffect(() => {
    fetchData().then(setData);
  }, [fetchData]); // ✅ Effect deps 是正确的

  // ...
}
```

由于 `fetchData` 只在 `Parent` 内部的 `query` state 更改时更改，我们的 `Child` 不会重新获取数据，直到它实际上对应用来说是必要的。

## 函数是数据流的一部分吗？

有趣的是，这种模式在类中被破坏了，这真正显示了 effect 和生命周期范式之间的区别。考虑这个翻译：

```jsx {5-8,18-20}
class Parent extends Component {
  state = {
    query: 'react'
  };
  fetchData = () => {
    const url = 'https://hn.algolia.com/api/v1/search?query=' + this.state.query;
    // ... 获取数据并做一些事情 ...
  };
  render() {
    return <Child fetchData={this.fetchData} />;
  }
}

class Child extends Component {
  state = {
    data: null
  };
  componentDidMount() {
    this.props.fetchData();
  }
  render() {
    // ...
  }
}
```

你可能会想："来吧 Dan，我们都知道 `useEffect` 就像 `componentDidMount` 和 `componentDidUpdate` 的组合，你不能一直敲这个鼓！"**但这甚至与 `componentDidUpdate` 都不起作用：**

```jsx {8-13}
class Child extends Component {
  state = {
    data: null
  };
  componentDidMount() {
    this.props.fetchData();
  }
  componentDidUpdate(prevProps) {
    // 🔴 这个条件永远不会为 true
    if (this.props.fetchData !== prevProps.fetchData) {
      this.props.fetchData();
    }
  }
  render() {
    // ...
  }
}
```

当然，`fetchData` 是一个类方法！（或者，更准确地说，是一个类属性——但这不会改变任何事情。）它不会因为 state 更改而不同。所以 `this.props.fetchData` 将保持等于 `prevProps.fetchData`，我们永远不会重新获取。那么让我们删除这个条件？

```jsx
  componentDidUpdate(prevProps) {
    this.props.fetchData();
  }
```

哦等等，这在*每次*重新渲染时都会获取。（在树的上方添加动画是发现它的有趣方法。）也许让我们将其绑定到特定的 query？

```jsx
  render() {
    return <Child fetchData={this.fetchData.bind(this, this.state.query)} />;
  }
```

但随后 `this.props.fetchData !== prevProps.fetchData` *总是* `true`，即使 `query` 没有更改！所以我们会*总是*重新获取。

使用类解决这个难题的唯一真正方法是咬紧牙关，将 `query` 本身传递给 `Child` 组件。`Child` 实际上最终不会*使用* `query`，但它可以在更改时触发重新获取：

```jsx {10,22-24}
class Parent extends Component {
  state = {
    query: 'react'
  };
  fetchData = () => {
    const url = 'https://hn.algolia.com/api/v1/search?query=' + this.state.query;
    // ... 获取数据并做一些事情 ...
  };
  render() {
    return <Child fetchData={this.fetchData} query={this.state.query} />;
  }
}

class Child extends Component {
  state = {
    data: null
  };
  componentDidMount() {
    this.props.fetchData();
  }
  componentDidUpdate(prevProps) {
    if (this.props.query !== prevProps.query) {
      this.props.fetchData();
    }
  }
  render() {
    // ...
  }
}
```

多年来使用 React 的类，我已经习惯了传递不必要的 props 并破坏父组件的封装，以至于我直到一周前才意识到我们为什么必须这样做。

**对于类，函数 props 本身并不是数据流的真正一部分。** 方法关闭可变 `this` 变量，所以我们不能依赖它们的身份来表示任何东西。因此，即使我们只想要一个函数，我们也必须传递一堆其他数据，以便能够"比较"它。我们无法知道从父级传递的 `this.props.fetchData` 是否依赖于某些 state，以及该 state 是否刚刚更改。

**使用 `useCallback`，函数可以完全参与数据流。** 我们可以说，如果函数输入更改，函数本身已更改，但如果没有，它保持不变。感谢 `useCallback` 提供的粒度，像 `props.fetchData` 这样的 props 的更改可以自动向下传播。

类似地，[`useMemo`](https://reactjs.org/docs/hooks-reference.html#usememo) 让我们对复杂对象做同样的事情：

```jsx
function ColorPicker() {
  // 不会破坏 Child 的浅相等 prop 检查
  // 除非颜色实际更改。
  const [color, setColor] = useState('pink');
  const style = useMemo(() => ({ color }), [color]);
  return <Child style={style} />;
}
```

**我想强调的是，到处放 `useCallback` 是相当笨拙的。** 这是一个很好的逃生舱口，当函数既向下传递*又*从某些子级的 effect 内部调用时很有用。或者如果你试图防止破坏子组件的记忆化。但 Hooks 更适合[完全避免向下传递回调](https://reactjs.org/docs/hooks-faq.html#how-to-avoid-passing-callbacks-down)。

在上面的例子中，如果 `fetchData` 要么在我的 effect 内部（它本身可以提取到自定义 Hook），要么是顶级导入，我会更喜欢。我想保持 effect 简单，其中的回调没有帮助。（"如果某些 `props.onComplete` 回调在请求进行中时更改怎么办？"）你可以[模拟类行为](#swimming-against-the-tide)，但这不能解决竞态条件。

## 说到竞态条件

使用类的经典数据获取示例可能看起来像这样：

```jsx
class Article extends Component {
  state = {
    article: null
  };
  componentDidMount() {
    this.fetchData(this.props.id);
  }
  async fetchData(id) {
    const article = await API.fetchArticle(id);
    this.setState({ article });
  }
  // ...
}
```

正如你可能知道的，这段代码是有 bug 的。它不处理更新。所以你可以在网上找到的第二个经典例子是这样的：

```jsx {8-12}
class Article extends Component {
  state = {
    article: null
  };
  componentDidMount() {
    this.fetchData(this.props.id);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.fetchData(this.props.id);
    }
  }
  async fetchData(id) {
    const article = await API.fetchArticle(id);
    this.setState({ article });
  }
  // ...
}
```

这绝对更好！但它仍然有 bug。它仍然有 bug 的原因是请求可能乱序到达。所以如果我正在获取 `{id: 10}`，切换到 `{id: 20}`，但 `{id: 20}` 请求先到达，开始较早但完成较晚的请求会错误地覆盖我的 state。

这被称为竞态条件，这在混合 `async` / `await`（假设某些东西等待结果）与自上而下的数据流（props 或 state 可能在我们处于异步函数中间时更改）的代码中很典型。

Effect 不会神奇地解决这个问题，尽管如果你尝试将 `async` 函数直接传递给 effect，它们会警告你。（我们需要改进该警告，以更好地解释你可能遇到的问题。）

如果你使用的 async 方法支持取消，那就太好了！你可以在清理函数中直接取消 async 请求。

或者，最简单的临时方法是使用布尔值跟踪它：

```jsx {5,9,16-18}
function Article({ id }) {
  const [article, setArticle] = useState(null);

  useEffect(() => {
    let didCancel = false;

    async function fetchData() {
      const article = await API.fetchArticle(id);
      if (!didCancel) {
        setArticle(article);
      }
    }

    fetchData();

    return () => {
      didCancel = true;
    };
  }, [id]);

  // ...
}
```

[这篇文章](https://www.robinwieruch.de/react-hooks-fetch-data/)更详细地介绍了如何处理错误和加载状态，以及如何将该逻辑提取到自定义 Hook 中。如果你有兴趣了解更多关于使用 Hooks 获取数据的信息，我建议你查看它。

## 提高标准

使用类生命周期心态，副作用的行为与渲染输出不同。渲染 UI 由 props 和 state 驱动，并保证与它们一致，但副作用不是。这是一个常见的 bug 来源。

使用 `useEffect` 的心态，默认情况下事情是同步的。副作用成为 React 数据流的一部分。对于每个 `useEffect` 调用，一旦你做对了，你的组件就能更好地处理边缘情况。

然而，做对的前期成本更高。这可能很烦人。编写能够很好地处理边缘情况的同步代码本质上比触发与渲染不一致的一次性副作用更困难。

如果 `useEffect` 意味着是你大部分时间使用的*工具*，这可能会令人担忧。然而，它是一个低级构建块。对于 Hooks 来说，这是早期阶段，所以每个人总是使用低级 Hook，特别是在教程中。但在实践中，随着好的 API 获得动力，社区可能会开始转向更高级的 Hooks。

我看到不同的应用创建自己的 Hooks，如 `useFetch`，它封装了应用的一些认证逻辑，或使用主题上下文的 `useTheme`。一旦你有了这些工具箱，你就不会*那么*经常使用 `useEffect`。但它带来的弹性使构建在它之上的每个 Hook 都受益。

到目前为止，`useEffect` 最常用于数据获取。但数据获取并不完全是同步问题。这尤其明显，因为我们的 deps 通常是 `[]`。我们甚至同步什么？

从长远来看，[用于数据获取的 Suspense](https://reactjs.org/blog/2018/11/27/react-16-roadmap.html#react-16x-mid-2019-the-one-with-suspense-for-data-fetching) 将允许第三方库拥有一种一流的方式来告诉 React 暂停渲染，直到某些异步（任何东西：代码、数据、图像）准备就绪。

随着 Suspense 逐渐覆盖更多数据获取用例，我预计 `useEffect` 将作为高级用户工具淡入背景，用于你实际上想要将 props 和 state 同步到某些副作用的情况。与数据获取不同，它自然地处理这种情况，因为它就是为此设计的。但在此之前，像[这里显示的](https://www.robinwieruch.de/react-hooks-fetch-data/)自定义 Hooks 是重用数据获取逻辑的好方法。

## 最后

现在你几乎知道了我所知道的关于使用 effect 的一切，看看开头的 [TLDR](#tldr)。它有意义吗？我遗漏了什么吗？（我还没有用完纸！）

我很想在 Twitter 上听到你的消息！感谢阅读。

---

