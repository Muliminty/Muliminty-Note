# useEffect 完整指南 - 深入理解 React 副作用处理

> 参考：[A Complete Guide to useEffect](https://overreacted.io/a-complete-guide-to-useeffect/) - Dan Abramov  
> 本文档是对 Dan Abramov 经典文章的详细整理和扩展，帮助你真正理解 `useEffect` 的工作原理。

---

## 目录

1. [核心心智模型：每个渲染都有它自己的 Props 和 State](#核心心智模型)
2. [每个渲染都有它自己的事件处理函数](#每个渲染都有它自己的事件处理函数)
3. [每个渲染都有它自己的 Effects](#每个渲染都有它自己的-effects)
4. [清理函数的工作原理](#清理函数的工作原理)
5. [同步，而非生命周期](#同步而非生命周期)
6. [依赖数组：教 React 如何对比 Effects](#依赖数组教-react-如何对比-effects)
7. [不要对 React 撒谎关于依赖](#不要对-react-撒谎关于依赖)
8. [两种诚实对待依赖的策略](#两种诚实对待依赖的策略)
9. [函数依赖的处理](#函数依赖的处理)
10. [竞态条件处理](#竞态条件处理)
11. [常见问题解答](#常见问题解答)
12. [实战技巧与最佳实践](#实战技巧与最佳实践)

---

## 核心心智模型

### 🤔 问题：count 是如何"自动更新"的？

让我们从一个简单的计数器开始：

```jsx
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

**关键问题**：`count` 是如何"自动更新"的？它是不是某种"数据绑定"、"观察者"或"代理"？

很多人第一次学习 React 时，可能会认为 `count` 是一个"响应式"的变量，它会自动"监听"状态的变化并更新。这种直觉在刚开始学习时很有用，但**这不是准确的心智模型**。

###  真相：count 只是一个普通的数字

**答案**：不是！`count` 只是一个普通的数字，就像这样：

```jsx
const count = 42;
// ...
<p>You clicked {count} times</p>
```

它没有任何魔法。它不是一个"数据绑定"、不是"观察者"、不是"代理"，也不是其他任何特殊的东西。它就是一个普通的数字。

###  渲染的本质：函数被多次调用

**关键理解**：每次组件渲染时，React 都会**重新调用**你的组件函数。这不是"更新"一个组件，而是**重新执行**函数。

让我们看看这个过程：

```jsx
// 第一次渲染 - React 调用 Counter()
function Counter() {
  const count = 0; // useState() 返回 0
  // ...
  <p>You clicked {count} times</p>  // 显示 0
  // ...
}

// 点击按钮后，React 再次调用 Counter()
function Counter() {
  const count = 1; // useState() 这次返回 1
  // ...
  <p>You clicked {count} times</p>  // 显示 1
  // ...
}

// 再次点击后，React 又调用 Counter()
function Counter() {
  const count = 2; // useState() 这次返回 2
  // ...
  <p>You clicked {count} times</p>  // 显示 2
  // ...
}
```

**重要理解**：
- 每次调用 `setCount`，React 会**再次调用**你的组件函数
- 每次渲染时，`count` 都是该次渲染的**常量**（就像函数参数一样）
- `count` 不会在渲染过程中改变，它是该次渲染的**快照**

###  类比：函数参数

这就像普通函数调用一样：

```jsx
function greet(name) {
  console.log('Hello, ' + name);
}

greet('Alice');  // 输出: Hello, Alice
greet('Bob');    // 输出: Hello, Bob
```

每次调用 `greet` 时，`name` 参数都是不同的值，但**在单次调用内部，`name` 是常量**。

React 组件也是这样：
- 每次渲染时，`count` 是常量
- 不同渲染之间，`count` 可能不同
- 但在单次渲染内部，`count` 永远不会改变

###  为什么这很重要？

这行代码：

```jsx
<p>You clicked {count} times</p>
```

它**只是将数字值嵌入到渲染输出中**。这个数字由 React 提供。当我们调用 `setCount` 时，React 会用不同的 `count` 值再次调用组件，然后更新 DOM 以匹配最新的渲染输出。

**核心要点**：
- 在任何特定渲染中，`count` 常量不会随时间改变
- 是我们的组件被再次调用，每次渲染都"看到"它自己的 `count` 值
- 这些值在渲染之间是**隔离的**

### 实际例子：理解渲染隔离

让我们看一个更具体的例子：

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  
  console.log('渲染时 count 的值:', count);
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => {
        console.log('点击时 count 的值:', count);
        setCount(count + 1);
      }}>
        Click me
      </button>
    </div>
  );
}
```

**执行流程**：
1. 第一次渲染：`count = 0`，控制台输出 "渲染时 count 的值: 0"
2. 点击按钮：控制台输出 "点击时 count 的值: 0"，然后调用 `setCount(0 + 1)`
3. 第二次渲染：`count = 1`，控制台输出 "渲染时 count 的值: 1"
4. 再次点击：控制台输出 "点击时 count 的值: 1"，然后调用 `setCount(1 + 1)`
5. 第三次渲染：`count = 2`，控制台输出 "渲染时 count 的值: 2"

**关键观察**：
- 每次渲染时，`count` 都是该次渲染的常量
- 点击按钮时，使用的是**该次渲染**的 `count` 值
- 每次渲染都是独立的，互不干扰

---

## 每个渲染都有它自己的事件处理函数

###  闭包陷阱：一个让人"意外"的例子

让我们看一个更复杂的例子，这个例子会让很多 React 新手感到困惑：

```jsx
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

** 测试场景**（来，跟着我一起做）：
1. 疯狂点击 "Click me"，把计数器增加到 3
2. 点击 "Show alert" 按钮
3. 在等待 3 秒的过程中，继续点击 "Click me"，把计数器增加到 5
4. 3 秒后，alert 弹出来了

**🤔 问题来了**：alert 会显示什么？3 还是 5？

** 答案**：3！是不是有点意外？

如果你猜的是 5，那说明你可能还在用"响应式"的思维模式。但 React 不是这样工作的！

###  为什么是 3？因为每个函数都有自己的"记忆"

因为事件处理函数"捕获"了点击时的状态。就像拍照一样，每个函数都"拍"下了它被创建时的状态快照。

让我们看看每次渲染时发生了什么，就像看一部慢动作电影：

```jsx
// 第一次渲染，count = 0
function Counter() {
  const count = 0;
  function handleAlertClick() {
    setTimeout(() => {
      alert('You clicked on: ' + 0); // 捕获了 0
    }, 3000);
  }
  // ...
  <button onClick={handleAlertClick} /> // 这个按钮"记住"了 0
}

// 点击后，count = 1
function Counter() {
  const count = 1;
  function handleAlertClick() {
    setTimeout(() => {
      alert('You clicked on: ' + 1); // 捕获了 1
    }, 3000);
  }
  // ...
  <button onClick={handleAlertClick} /> // 这个按钮"记住"了 1
}

// 再次点击后，count = 2
function Counter() {
  const count = 2;
  function handleAlertClick() {
    setTimeout(() => {
      alert('You clicked on: ' + 2); // 捕获了 2
    }, 3000);
  }
  // ...
  <button onClick={handleAlertClick} /> // 这个按钮"记住"了 2
}
```

**关键理解**：
- 每次渲染都会创建**新的** `handleAlertClick` 函数
- 每个函数都"记住"了它被创建时的 `count` 值
- 当你点击按钮时，触发的是**那个特定渲染**创建的函数

### 🎪 普通函数的类比：这不是 React 的"魔法"

这不是 React 特有的，普通函数也是这样工作的！React 只是遵循了 JavaScript 的基本规则：

```jsx
function sayHi(person) {
  const name = person.name;  // 就像拍照，拍下了这一刻的 name
  setTimeout(() => {
    alert('Hello, ' + name);  // 3秒后，还是显示拍照时的 name
  }, 3000);
}

let someone = {name: 'Dan'};
sayHi(someone);  // 拍下了 "Dan"

someone = {name: 'Yuzhi'};  // 外部变量变了
sayHi(someone);  // 但这次拍下的是 "Yuzhi"

someone = {name: 'Dominic'};  // 又变了
sayHi(someone);  // 这次拍下的是 "Dominic"
```

**关键理解**：
- 外部的 `someone` 变量被重新赋值多次（就像 React 中组件状态会改变）
- 但**在 `sayHi` 内部，有一个与特定调用关联的局部 `name` 常量**
- 这个常量是局部的，所以在调用之间是隔离的！
- 就像每次拍照都拍下了不同的瞬间，但每张照片里的内容不会改变

**更生动的比喻**：想象你在不同的时间点给朋友拍照：
- 早上 8 点拍了一张，照片里是"穿睡衣的 Dan"
- 中午 12 点拍了一张，照片里是"穿正装的 Dan"
- 晚上 8 点拍了一张，照片里是"穿运动服的 Dan"

每张照片都"记住"了拍照时的状态，即使后来 Dan 换了衣服，照片里的内容也不会改变。React 的函数也是这样！

---

## 每个渲染都有它自己的 Effects

###  Effects 也是"拍照"的：它们和事件处理函数一样！

现在让我们看看 effects。**它们和事件处理函数完全一样！** 没有特殊待遇，没有魔法，就是普通的函数。

```jsx
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

**🤔 问题来了**：effect 是如何读取最新的 `count` 状态的？

很多人可能会想："啊，effect 一定有什么特殊机制，能自动获取最新的 `count`！" 就像有一个"魔法窗口"，effect 透过这个窗口能看到最新的状态。

** 答案**：**完全不是！** 不是 `count` 变量在"不变"的 effect 中改变，而是**每次渲染时 effect 函数本身都不同**！

就像每次渲染都创建了一个新的 effect 函数，每个函数都"记住"了它被创建时的 `count` 值。

每次渲染时，effect 函数都"看到"它所属渲染的 `count` 值：

```jsx
// 第一次渲染
function Counter() {
  // ...
  useEffect(
    // 第一次渲染的 effect 函数
    () => {
      document.title = `You clicked ${0} times`;
    }
  );
}

// 点击后
function Counter() {
  // ...
  useEffect(
    // 第二次渲染的 effect 函数
    () => {
      document.title = `You clicked ${1} times`;
    }
  );
}

// 再次点击后
function Counter() {
  // ...
  useEffect(
    // 第三次渲染的 effect 函数
    () => {
      document.title = `You clicked ${2} times`;
    }
  );
}
```

###  Effects 是渲染结果的一部分：就像"待办事项清单"

**概念上，你可以把 effects 想象成渲染结果的一部分**。

就像你渲染 UI 时说："这是我要显示的界面，**还有**，记得在显示完后帮我更新一下标题！"

严格来说，它们不是（为了允许 Hook 组合而不需要笨拙的语法或运行时开销）。但在我们构建的心智模型中，effect 函数**属于**特定渲染，就像事件处理函数一样。

###  渲染流程详解：看 React 如何"工作"

让我们详细看看第一次渲染发生了什么，就像看一场戏剧：

**🎪 第一幕：初始渲染**

1. **React**（导演）："给我状态为 `0` 时的 UI！"
2. **你的组件**（演员）：
   - "这是渲染结果：`<p>You clicked 0 times</p>`"
   - "还有，记住完成后运行这个 effect：`() => { document.title = 'You clicked 0 times' }`"
   - （就像演员说："我演完了，记得帮我更新一下标题！"）
3. **React**（导演）："好的。更新 UI。浏览器，我正在添加一些东西到 DOM。"
4. **浏览器**（舞台）："好的，我已经把它绘制到屏幕上了。"
5. **React**（导演）："好的，现在我要运行你给我的 effect。"
   - 运行 `() => { document.title = 'You clicked 0 times' }`
   - （就像导演说："好的，现在帮你更新标题！"）

**🎪 第二幕：点击后的渲染**

1. **你的组件**（演员）："React，将我的状态设置为 `1`！"
2. **React**（导演）："给我状态为 `1` 时的 UI！"
3. **你的组件**（演员）：
   - "这是渲染结果：`<p>You clicked 1 times</p>`"
   - "还有，记住完成后运行这个 effect：`() => { document.title = 'You clicked 1 times' }`"
4. **React**（导演）："好的。更新 UI。浏览器，我改变了 DOM。"
5. **浏览器**（舞台）："好的，我已经把你的更改绘制到屏幕上了。"
6. **React**（导演）："好的，现在我要运行属于刚才渲染的 effect。"
   - 运行 `() => { document.title = 'You clicked 1 times' }`

** 关键观察**：
- 每次渲染，组件都会"提交"一个新的 effect 函数
- React 会在浏览器绘制完成后运行这个 effect
- 每个 effect 都"记住"了它被创建时的 props 和 state

---

## 每个渲染都有它自己的...一切

### 🧪 思考实验：快速点击会发生什么？

考虑这段代码，这是一个经典的"陷阱"例子：

```jsx
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

** 实验步骤**：
1. 快速连续点击按钮 5 次（在 3 秒内）
2. 观察控制台输出

**🤔 问题**：日志会是什么样子？会是 `5, 5, 5, 5, 5` 吗？

** 答案**：不是！你会看到一系列日志，每个都属于特定渲染，因此有它自己的 `count` 值：`1, 2, 3, 4, 5`

** 为什么会这样？**

因为每次渲染都创建了一个新的 effect 函数，每个函数都"记住"了它被创建时的 `count` 值：
- 第一次渲染：effect 记住 `count = 0`，3 秒后输出 `0`
- 点击后第二次渲染：effect 记住 `count = 1`，3 秒后输出 `1`
- 再次点击后第三次渲染：effect 记住 `count = 2`，3 秒后输出 `2`
- ...以此类推

就像每个 effect 都"拍"了一张照片，照片里记录的是拍照时的 `count` 值！

### 🆚 与类组件的对比：为什么类组件会"出错"？

这不是类组件中 `this.state` 的工作方式。很容易错误地认为这个类实现是等价的：

```jsx
componentDidUpdate() {
  setTimeout(() => {
    console.log(`You clicked ${this.state.count} times`);
  }, 3000);
}
```

** 但是！** 在类组件中，如果你快速点击 5 次，你会看到 `5, 5, 5, 5, 5` 被记录 5 次！

**🤔 为什么？**

因为 `this.state.count` 总是指向**最新的** count，而不是属于特定渲染的。就像 `this.state` 是一个"活"的引用，总是指向最新的值。

** 生动的比喻**：
- **函数组件**：就像每次拍照都拍下了不同的瞬间，每张照片都是独立的
- **类组件**：就像所有照片都指向同一个"实时监控摄像头"，所有照片都显示最新的画面

** 关键理解**：
- **闭包在闭包的值从不改变时很棒**。这使得它们易于思考，因为你本质上是在引用常量
- 正如我们讨论的，props 和 state 在特定渲染中从不改变
- 这就是为什么函数组件的闭包行为是"正确"的，而类组件的 `this.state` 行为反而容易导致 bug

---

## 清理函数的工作原理

### 🧹 清理函数：React 的"善后工作"

考虑这段代码，这是一个订阅好友状态的例子：

```jsx
useEffect(() => {
  ChatAPI.subscribeToFriendStatus(props.id, handleStatusChange);
  return () => {
    ChatAPI.unsubscribeFromFriendStatus(props.id, handleStatusChange);
  };
});
```

** 场景设置**：
- 第一次渲染时 `props` 是 `{id: 10}`
- 第二次渲染时是 `{id: 20}`

**🤔 你可能会认为发生这样的事情**（这是很多人的直觉）：
1. React 清理 `{id: 10}` 的 effect（取消订阅）
2. React 渲染 `{id: 20}` 的 UI
3. React 运行 `{id: 20}` 的 effect（订阅新的）

** 但这不是实际情况！** React 的执行顺序会让你意外！

### ⏰ 实际的执行顺序：React 的"优化策略"

React 只在[让浏览器绘制](https://medium.com/@dan_abramov/this-benchmark-is-indeed-flawed-c3d6b5b6f97f)之后运行 effects。这使得你的应用更快，因为大多数 effects 不需要阻塞屏幕更新。Effect 清理也被延迟了。

** 实际的执行顺序**（就像看一场精心编排的演出）：

1. **React 渲染 `{id: 20}` 的 UI**（先让用户看到新界面）
2. **浏览器绘制**。我们在屏幕上看到 `{id: 20}` 的 UI（用户看到新界面了）
3. **React 清理 `{id: 10}` 的 effect**（现在才取消旧的订阅）
4. **React 运行 `{id: 20}` 的 effect**（然后订阅新的）

** 为什么这样？**

React 的哲学是：**先让用户看到新界面，再处理副作用**。这样用户不会感觉到卡顿。

###  清理函数也"拍照"：它也有自己的记忆

你可能会想：**"等等，如果清理函数在 props 变为 `{id: 20}` 之后运行，它如何仍然'看到'旧的 `{id: 10}` props？"**

这是一个很好的问题！答案可能会让你意外：

** 答案**：清理函数不读取"最新"的 props，它读取属于定义它的渲染的 props！

就像清理函数也"拍"了一张照片，照片里记录的是它被创建时的 props 值。

```jsx
// 第一次渲染，props 是 {id: 10}
function Example() {
  // ...
  useEffect(
    // 第一次渲染的 effect
    () => {
      ChatAPI.subscribeToFriendStatus(10, handleStatusChange);
      // 第一次渲染的清理函数
      return () => {
        ChatAPI.unsubscribeFromFriendStatus(10, handleStatusChange);
      };
    }
  );
}

// 下一次渲染，props 是 {id: 20}
function Example() {
  // ...
  useEffect(
    // 第二次渲染的 effect
    () => {
      ChatAPI.subscribeToFriendStatus(20, handleStatusChange);
      // 第二次渲染的清理函数
      return () => {
        ChatAPI.unsubscribeFromFriendStatus(20, handleStatusChange);
      };
    }
  );
}
```

** 即使世界末日，第一次渲染 effect 的清理函数"看到"的 props 也永远是 `{id: 10}`。**

就像那张照片永远不会改变，即使后来 `props.id` 变成了 20、30、100，那张照片里永远记录着 `{id: 10}`。

这就是为什么 React 可以在绘制后立即处理 effects，并默认使你的应用更快。如果我们的代码需要，旧的 props 仍然在那里，就像照片一样被保存着。

---

## 同步，而非生命周期

###  React 的设计哲学：目的地比过程更重要

React 最棒的事情之一是它统一了描述初始渲染结果和更新。这[减少了程序的熵](https://overreacted.io/the-bug-o-notation/)。

假设我的组件是这样的：

```jsx
function Greeting({ name }) {
  return (
    <h1 className="Greeting">
      Hello, {name}
    </h1>
  );
}
```

** 两种渲染路径**：
- **路径 A**：先渲染 `<Greeting name="Dan" />`，然后渲染 `<Greeting name="Yuzhi" />`
- **路径 B**：直接渲染 `<Greeting name="Yuzhi" />`

**结果**：无论走哪条路径，最终我们都会看到 "Hello, Yuzhi"。

** 关键哲学**：
- **人们说**："重要的是过程，不是目的地"
- **React 说**："在 React 中，恰恰相反。**重要的是目的地，不是过程。**"

** 生动的对比**：

**jQuery 风格**（关注过程）：
```js
// 过程：先移除，再添加
$('.button').removeClass('active');
$('.button').addClass('disabled');
```

**React 风格**（关注目的地）：
```jsx
// 目的地：直接描述最终状态
<button className={isDisabled ? 'disabled' : 'active'}>
```

React 不关心你是如何到达这个状态的，它只关心**最终应该是什么样子**。

###  Effects 也是同步：不是"生命周期"，而是"同步"

**React 根据我们当前的 props 和 state 同步 DOM**。渲染时没有"挂载"或"更新"的区别。

** 关键理解**：
- 不是"组件挂载了，运行这个 effect"
- 而是"props 和 state 是这样的，同步外部世界到这个状态"

你应该以类似的方式思考 effects。**`useEffect` 让你根据我们的 props 和 state 同步 React 树之外的东西。**

```jsx
function Greeting({ name }) {
  useEffect(() => {
    document.title = 'Hello, ' + name;  // 同步：让标题和 name 保持一致
  });
  return (
    <h1 className="Greeting">
      Hello, {name}
    </h1>
  );
}
```

** 常见的错误思维**：
-  "这是首次渲染，所以运行这个 effect"
-  "这是更新，所以运行那个 effect"
-  "name 是 'Dan'，所以标题应该是 'Hello, Dan'"

这与熟悉的*挂载/更新/卸载*心智模型有微妙的不同。真正内化这一点很重要。

** 如果你试图编写一个根据组件是否首次渲染而表现不同的 effect，你是在逆流而上！** 

就像你在说："如果我是第一次来这里，我要做 A；如果我是第二次来，我要做 B。" 但 React 说："不，你只需要告诉我，当 name 是 'Dan' 时应该做什么。"

** 核心原则**：
- 无论我们是用 props A、B 和 C 渲染，还是直接渲染 C，都不应该重要
- 虽然可能有一些临时差异（例如，在获取数据时），但最终结果应该是相同的
- **同步，而不是响应生命周期事件**

---

## 依赖数组：教 React 如何对比 Effects

### 🤔 问题：每次渲染都运行 effect 可能不高效

当然，在**每次**渲染时运行所有 effects 可能不高效（在某些情况下，会导致无限循环，就像永动机一样！）。

那么如何修复这个问题？

###  React 如何对比 DOM：聪明的优化策略

我们已经从 DOM 本身学到了这一课。React 不会在每次重新渲染时都"暴力"地更新所有东西，而是**聪明地**只更新实际改变的部分。

就像你只洗脏了的衣服，而不是把所有衣服都洗一遍！

当你更新：

```jsx
<h1 className="Greeting">
  Hello, Dan
</h1>
```

到：

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

它遍历它们的每个 prop，确定 `children` 已更改需要 DOM 更新，但 `className` 没有。所以它只需要：

```jsx
domNode.innerText = 'Hello, Yuzhi';
// 不需要接触 domNode.className
```

### 🤔 能否对 effects 做类似的事情？

例如，也许我们的组件因为状态改变而重新渲染：

```jsx
function Greeting({ name }) {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    document.title = 'Hello, ' + name;
  });

  return (
    <h1 className="Greeting">
      Hello, {name}
      <button onClick={() => setCounter(counter + 1)}>
        Increment
      </button>
    </h1>
  );
}
```

** 问题**：我们的 effect 不使用 `counter` 状态。**我们的 effect 将 `document.title` 与 `name` prop 同步，但 `name` prop 是相同的。** 

在每次 counter 更改时重新分配 `document.title` 似乎不太理想，就像你每次换衣服都要重新写一遍你的名字一样！

**🤔 React 能否直接对比 effects？**

```jsx
let oldEffect = () => { document.title = 'Hello, Dan'; };
let newEffect = () => { document.title = 'Hello, Dan'; };
// React 能看到这些函数做同样的事情吗？
```

** 答案：不能！** React 无法在不调用它的情况下猜测函数做什么。

就像你不能只看两个人的外表就判断他们是否在做同样的事情。React 也无法"看穿"函数内部，它只能看到函数的引用，而不知道函数实际做了什么。

（源代码并不真正包含特定值，它只是闭包了 `name` prop，就像函数"记住"了它被创建时的值。）

###  依赖数组的解决方案：给 React 一个"提示"

这就是为什么如果你想避免不必要地重新运行 effects，你可以向 `useEffect` 提供一个依赖数组（也称为"deps"）参数：

```jsx
useEffect(() => {
  document.title = 'Hello, ' + name;
}, [name]); // 我们的 deps - 就像给 React 一个"提示"
```

** 这就像我们告诉 React**：
> "嘿，我知道你看不到这个函数内部（就像我看不到你的想法一样），但我**保证**它只使用 `name` 和渲染作用域中的其他东西。如果 `name` 没变，你就不用运行这个 effect 了！"

**🤝 React 的回应**：
> "好的，我相信你！如果 `name` 没变，我就不运行这个 effect 了。"

** 工作原理**：

如果这些值中的每一个在当前和上次运行此 effect 时都相同，则没有什么需要同步的，所以 React 可以跳过 effect：

```jsx
const oldEffect = () => { document.title = 'Hello, Dan'; };
const oldDeps = ['Dan'];  // 上次的依赖

const newEffect = () => { document.title = 'Hello, Dan'; };
const newDeps = ['Dan'];  // 这次的依赖

// React 无法窥视函数内部，但它可以比较 deps。
// 由于所有 deps 都相同（'Dan' === 'Dan'），它不需要运行新的 effect。
// 就像："哦，name 还是 'Dan'，那就不用更新标题了！"
```

**🚨 但如果依赖变了**：

如果依赖数组中即使有一个值在渲染之间不同，我们知道运行 effect 不能跳过。同步所有东西！

```jsx
const oldDeps = ['Dan'];
const newDeps = ['Yuzhi'];  // 变了！

// React："哦，name 从 'Dan' 变成了 'Yuzhi'，那我得运行 effect 更新标题了！"
```

---

## 不要对 React 撒谎关于依赖

### 撒谎的后果

对 React 撒谎关于依赖有不好的后果。直观上，这是有道理的，但我看到几乎所有尝试 `useEffect` 的人，如果他们有类组件的心智模型，都会试图欺骗规则。（我一开始也这样做过！）

```jsx
function SearchResults() {
  async function fetchData() {
    // ...
  }

  useEffect(() => {
    fetchData();
  }, []); // 这样可以吗？不总是——有更好的写法。
}
```

"但我只想在挂载时运行它！"，你会说。现在，记住：如果你指定了 deps，**effect 内部使用的组件内部的所有值都必须在那里**。包括 props、state、函数——组件中的任何东西。

有时当你这样做时，会导致问题。例如，也许你看到无限重新获取循环，或者 socket 被重新创建太多次。**解决该问题的方法不是移除依赖。** 我们很快就会看到解决方案。

### 当依赖撒谎时会发生什么

如果 deps 包含 effect 使用的每个值，React 知道何时重新运行它：

```jsx
useEffect(() => {
  document.title = 'Hello, ' + name;
}, [name]);
```

*(依赖不同，所以我们重新运行 effect。)*

但如果我们为此 effect 指定 `[]`，新的 effect 函数不会运行：

```jsx
useEffect(() => {
  document.title = 'Hello, ' + name;
}, []); // 错误：name 在 deps 中缺失
```

*(依赖相等，所以我们跳过 effect。)*

在这种情况下，问题可能看起来很明显。但直觉会在其他情况下欺骗你，类解决方案会从你的记忆中"跳出来"。

###  经典的 setInterval 陷阱：一个让人"抓狂"的例子

例如，假设我们正在编写一个每秒递增的计数器。对于类，我们的直觉是："设置间隔一次并销毁一次"。

当我们心理上将此代码转换为 `useEffect` 时，我们本能地添加 `[]` 到 deps。

** 你的想法**：
> "我想让它运行一次，所以用 `[]` 应该没问题！"
> "这看起来很简单..."

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);  //  陷阱在这里！

  return <h1>{count}</h1>;
}
```

** 然而，这个例子[只递增一次](https://codesandbox.io/s/91n5z8jo7r)。**

*糟糕。* 就像你设置了一个闹钟，但它只响了一次就再也不响了！

**🤔 为什么会这样？** 让我们看看发生了什么...

### 🤯 为什么只递增一次？揭秘"陷阱"的真相

在第一次渲染中，`count` 是 `0`。因此，第一次渲染 effect 中的 `setCount(count + 1)` 意味着 `setCount(0 + 1)`。

** 关键问题**：由于我们因为 `[]` deps 从未重新运行 effect，它将每秒继续调用 `setCount(0 + 1)`！

就像你设置了一个闹钟，但闹钟"记住"的是第一次设置时的值，永远都不会变！

```jsx
// 第一次渲染，状态是 0
function Counter() {
  // ...
  useEffect(
    // 第一次渲染的 effect - 这个 effect "记住"了 count = 0
    () => {
      const id = setInterval(() => {
        setCount(0 + 1); // 总是 setCount(1) - 永远都是 0 + 1！
      }, 1000);
      return () => clearInterval(id);
    },
    [] // 永不重新运行 - 所以 effect 永远"记住" count = 0
  );
}

// 每次下一次渲染，状态是 1
function Counter() {
  // ...
  useEffect(
    // 这个 effect 总是被忽略，因为
    // 我们对空 deps 撒谎了。
    // React："哦，依赖数组是空的，和上次一样，那我就不运行这个 effect 了！"
    () => {
      const id = setInterval(() => {
        setCount(1 + 1);  // 这个永远不会运行！
      }, 1000);
      return () => clearInterval(id);
    },
    []
  );
}
```

** 问题的根源**：

我们通过说我们的 effect 不依赖于组件内部的值来对 React 撒谎，但实际上它确实依赖！

我们的 effect 使用 `count`——组件内部的值（但在 effect 外部）：

```jsx
const count = // ...  // count 在组件作用域中

useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1);  // 使用了 count，但 count 不在依赖数组中！
  }, 1000);
  return () => clearInterval(id);
}, []);  //  撒谎：说 effect 不依赖任何值
```

** 因此，指定 `[]` 作为依赖将创建一个 bug。** React 将比较依赖，发现依赖数组是空的（和上次一样），然后跳过更新此 effect。

** 教训**：
- 像这样的问题很难思考（就像数学题一样，看起来简单但容易出错）
- 因此，我鼓励你采用硬性规则：**始终诚实对待 effect 依赖，并指定它们全部**
- （如果你想在你的团队中强制执行，我们提供了一个 [lint 规则](https://github.com/facebook/react/issues/14920)，就像考试时的监考老师一样！）

---

## 两种诚实对待依赖的策略

###  策略 1：修复依赖数组（最简单的方法）

有两种策略可以诚实对待依赖。你通常应该从第一种开始，然后在需要时应用第二种。

** 第一种策略是修复依赖数组以包含 effect 内部使用的组件内部的所有值。** 

让我们将 `count` 作为依赖：

```jsx
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1);
  }, 1000);
  return () => clearInterval(id);
}, [count]);  //  现在诚实了：告诉 React effect 依赖 count
```

** 这使依赖数组正确了！** 它可能不是*理想的*（因为每次 count 改变都会重新创建 interval），但这是我们需要修复的第一个问题。

** 现在会发生什么**：
- `count` 的更改将重新运行 effect
- 每个下一个间隔引用其渲染中的 `count` 在 `setCount(count + 1)` 中
- 就像每次 count 改变，我们都会重新设置闹钟，但这次闹钟会"记住"新的 count 值

```jsx
// 第一次渲染，状态是 0
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
}

// 第二次渲染，状态是 1
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
}
```

这将[修复问题](https://codesandbox.io/s/0x0mnlyq8l)，但我们的间隔将在 `count` 更改时被清除并重新设置。这可能是不希望的：

**😅 就像每次 count 改变，我们都会重新设置闹钟，这可能会让用户感到"卡顿"。**

*(依赖不同，所以我们重新运行 effect。)*

###  策略 2：使 Effects 自给自足（更优雅的方法）

**第二种策略是改变我们的 effect 代码，使其不需要比我们想要的更频繁更改的值。** 

我们不想对依赖撒谎——我们只想改变我们的 effect 以拥有*更少*的依赖。就像我们想让 effect 更"独立"，不需要依赖那么多东西。

** 目标**：我们想要摆脱 effect 中的 `count` 依赖。

```jsx
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1);  // 使用了 count
  }, 1000);
  return () => clearInterval(id);
}, [count]);  // count 在依赖数组中
```

**🤔 要做到这一点，我们需要问自己**：**我们使用 `count` 做什么？** 

看起来我们只在 `setCount` 调用中使用它。在这种情况下，我们实际上根本不需要 effect 作用域中的 `count`。

** 解决方案：函数式更新**

当我们想要基于先前状态更新状态时，我们可以使用 `setState` 的[函数式更新形式](https://reactjs.org/docs/hooks-reference.html#functional-updates)：

```jsx
useEffect(() => {
  const id = setInterval(() => {
    setCount(c => c + 1);  //  使用函数式更新，不需要 count！
  }, 1000);
  return () => clearInterval(id);
}, []);  //  现在依赖数组可以是空的，因为我们不依赖 count 了！
```

** 我喜欢将这些情况视为"假依赖"**：
- 是的，`count` 看起来是必要的依赖，因为我们在 effect 内部写了 `setCount(count + 1)`
- 然而，我们真正需要的 `count` 只是将其转换为 `count + 1` 并"发送回"React
- 但 React*已经知道*当前的 `count`！
- **我们只需要告诉 React 递增状态——无论它现在是什么**

** 类比**：
- **之前**：就像你告诉朋友"给我当前的钱数，然后加 1"
- **现在**：就像你告诉朋友"不管你现在有多少钱，给我加 1"

这正是 `setCount(c => c + 1)` 所做的。你可以将其视为"发送指令"给 React 关于状态应该如何改变。这种"更新器形式"在其他情况下也有帮助，比如当你[批量多个更新](/react-as-a-ui-runtime/#batching)时。

** 注意，我们实际上*做了工作*来移除依赖。我们没有作弊。** 我们的 effect 不再从渲染作用域读取 `counter` 值：

*(依赖相等，所以我们跳过 effect。)*

** 结果**：
- 即使这个 effect 只运行一次，属于第一次渲染的间隔回调也完全能够在每次间隔触发时发送 `c => c + 1` 更新指令
- 它不再需要知道当前的 `counter` 状态。React 已经知道了
- 就像闹钟不需要知道现在几点，它只需要知道"每次响的时候，时间加 1"就行了！

---

## 函数式更新和 Google Docs

### 同步的心智模型

记住我们如何谈论同步作为 effects 的心智模型？同步的一个有趣方面是你经常希望保持系统之间的"消息"与它们的状态解耦。

例如，在 Google Docs 中编辑文档实际上不会将*整个*页面发送到服务器。这将非常低效。相反，它发送用户尝试执行的操作的表示。

虽然我们的用例不同，但类似的哲学适用于 effects。**从 effects 内部向组件发送最少的必要信息是有帮助的。** 像 `setCount(c => c + 1)` 这样的更新器形式传达的信息严格少于 `setCount(count + 1)`，因为它没有被当前计数"污染"。它只表达动作（"递增"）。

在 React 中思考涉及[找到最小状态](https://reactjs.org/docs/thinking-in-react.html#step-3-identify-the-minimal-but-complete-representation-of-ui-state)。这是相同的原则，但用于更新。

### useReducer：更强大的模式

**然而，即使 `setCount(c => c + 1)` 也不是那么好。** 它看起来有点奇怪，并且它在能做什么方面非常有限。例如，如果我们有两个状态变量，它们的值相互依赖，或者如果我们需要基于 prop 计算下一个状态，它不会帮助我们。

幸运的是，`setCount(c => c + 1)` 有一个更强大的姐妹模式。它的名字是 `useReducer`。

### 使用 useReducer 解耦更新

让我们修改前面的例子，有两个状态变量：`count` 和 `step`。我们的间隔将按 `step` 输入的值递增计数：

```jsx
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

注意**我们没有作弊**。由于我开始在 effect 内部使用 `step`，我将其添加到依赖中。这就是代码正确运行的原因。

这个例子中的当前行为是更改 `step` 会重启间隔——因为它是依赖之一。在许多情况下，这正是你想要的！拆除 effect 并重新设置它没有什么错，除非我们有充分的理由，否则我们不应该避免这样做。

但是，假设我们希望间隔时钟在 `step` 更改时不重置。我们如何从 effect 中移除 `step` 依赖？

**当设置状态变量依赖于另一个状态变量的当前值时，你可能想尝试用 `useReducer` 替换它们两者。**

当你发现自己写 `setSomething(something => ...)` 时，是考虑使用 reducer 的好时机。Reducer 让你**解耦表达组件中发生的"动作"与状态如何响应它们而更新**。

让我们在 effect 中用 `dispatch` 依赖替换 `step` 依赖：

```jsx
const [state, dispatch] = useReducer(reducer, initialState);
const { count, step } = state;

useEffect(() => {
  const id = setInterval(() => {
    dispatch({ type: 'tick' }); // 而不是 setCount(c => c + step);
  }, 1000);
  return () => clearInterval(id);
}, [dispatch]);
```

你可能会问我："这有什么更好的？"答案是**React 保证 `dispatch` 函数在整个组件生命周期中都是常量。所以上面的例子永远不需要重新订阅间隔。**

我们解决了问题！

*(你可以从 deps 中省略 `dispatch`、`setState` 和 `useRef` 容器值，因为 React 保证它们是静态的。但指定它们也没有坏处。)*

### Reducer 集中更新逻辑

不是从 effect 内部读取状态，而是分派一个编码*发生了什么*信息的*动作*。这允许我们的 effect 与 `step` 状态保持解耦。我们的 effect 不关心我们*如何*更新状态，它只是告诉我们*发生了什么*。Reducer 集中更新逻辑：

```jsx
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

---

## 为什么 useReducer 是 Hooks 的"作弊模式"

### 🎮 useReducer：React Hooks 的"外挂"

我们已经看到了如何在 effect 需要基于先前状态或另一个状态变量设置状态时移除依赖。**但如果我们需要*props*来计算下一个状态怎么办？** 

例如，也许我们的 API 是 `<Counter step={1} />`。当然，在这种情况下，我们不能避免指定 `props.step` 作为依赖？

** 实际上，我们可以！** 我们可以将*reducer 本身*放在组件内部以读取 props：

```jsx
function Counter({ step }) {
  const [count, dispatch] = useReducer(reducer, 0);

  function reducer(state, action) {
    if (action.type === 'tick') {
      return state + step;  //  reducer 可以访问 props！
    } else {
      throw new Error();
    }
  }

  useEffect(() => {
    const id = setInterval(() => {
      dispatch({ type: 'tick' });  // 发送"动作"，不需要知道 step
    }, 1000);
    return () => clearInterval(id);
  }, [dispatch]);  //  dispatch 是稳定的，不需要 step！

  return <h1>{count}</h1>;
}
```

** 这种模式禁用了一些优化，所以尽量不要到处使用它**，但如果你需要，你完全可以从 reducer 访问 props。

就像你有一个"万能钥匙"，可以打开任何锁，但不要到处用，只在需要的时候用！

** 即使在这种情况下，`dispatch` 身份仍然保证在重新渲染之间是稳定的。** 

所以如果你想，你可以从 effect deps 中省略它。它不会导致 effect 重新运行。就像 `dispatch` 是一个"永远不变"的引用！

###  这如何工作？揭秘"作弊模式"的原理

你可能想知道：**"这怎么可能工作？当从属于另一个渲染的 effect 内部调用时，reducer 如何'知道'props？"**

这是一个很好的问题！答案可能会让你意外：

** 答案是**：当你 `dispatch` 时，React 只是记住动作——但它会在**下一次渲染时**调用你的 reducer。到那时，新的 props 将在作用域中，你不会在 effect 内部。

** 执行流程**：
1. Effect 中调用 `dispatch({ type: 'tick' })`
2. React："好的，我记住了这个动作"
3. React 在下一次渲染时调用 reducer
4. 此时，reducer 可以访问最新的 props（因为它在组件作用域中）
5. Reducer 使用最新的 `step` 值更新状态

**🎮 这就是为什么我喜欢将 `useReducer` 视为 Hooks 的"作弊模式"**：
- 它让我解耦更新逻辑与描述发生了什么
- 这反过来帮助我从 effects 中移除不必要的依赖
- 并避免比必要更频繁地重新运行它们

就像你有一个"时间机器"，可以在未来访问最新的值！

---

## 函数依赖的处理

###  将函数移入 Effect：一个常见的"陷阱"

一个常见的错误是认为函数不应该是依赖。例如，这似乎可以工作：

```jsx
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
  }, []); // 这样可以吗？🤔
}
```

** 你的想法**：
> "`fetchData` 是一个函数，函数不会变，所以不需要放在依赖数组里吧？"
> "这代码能运行，应该没问题！"

** 明确地说，这段代码*确实*有效。** 但就像你考试时蒙对了答案，不代表你真的理解了！

**🚨 但简单地省略局部函数的问题是，随着组件增长，很难判断我们是否处理了所有情况！**

就像你在房间里藏了一堆东西，现在看起来没问题，但以后可能会忘记它们的存在！

想象我们的代码是这样拆分的，每个函数都大五倍：

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

现在假设我们稍后在这些函数之一中使用一些状态或 prop：

```jsx
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

如果我们忘记更新调用这些函数的任何 effects 的 deps（可能通过其他函数！），我们的 effects 将无法同步来自 props 和 state 的更改。这听起来不太好。

###  解决方案：将函数移入 Effect（最简单的方法）

幸运的是，这个问题有一个简单的解决方案。**如果你只在 effect 内部使用某些函数，直接将它们移入该 effect：**

```jsx
function SearchResults() {
  // ...
  useEffect(() => {
    //  我们将这些函数移入内部！
    // 就像把东西放在一个盒子里，这样就不会丢失了
    function getFetchUrl() {
      return 'https://hn.algolia.com/api/v1/search?query=react';
    }

    async function fetchData() {
      const result = await axios(getFetchUrl());
      setData(result.data);
    }

    fetchData();
  }, []); //  Deps 是正确的 - 因为函数在 effect 内部，不依赖外部作用域
  // ...
}
```

** 好处是什么？**

我们不再需要考虑"传递依赖"。我们的依赖数组不再撒谎：**我们真正*没有*在 effect 中使用组件外部作用域的任何东西。**

就像你把所有需要的东西都放在一个盒子里，这样就不会忘记任何东西了！

如果我们稍后编辑 `getFetchUrl` 以使用 `query` 状态，我们更可能注意到我们正在 effect*内部*编辑它——因此，我们需要将 `query` 添加到 effect 依赖中：

```jsx
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
  }, [query]); //  Deps 是正确的
  // ...
}
```

通过添加此依赖，我们不仅仅是"安抚 React"。当查询更改时重新获取数据*是有意义的*。**`useEffect` 的设计迫使你注意数据流中的更改，并选择我们的 effects 应该如何同步它——而不是忽略它直到我们的产品用户遇到 bug。**

###  使用 useCallback：当函数需要"共享"时

有时你可能不想将函数移入 effect。例如：
- 同一组件中的几个 effects 可能调用相同的函数，你不想复制粘贴其逻辑（就像不想重复写作业一样）
- 或者它可能是 prop（来自父组件）

**🤔 你应该在 effect 依赖中跳过这样的函数吗？**

我认为不应该。再次，**effects 不应该对它们的依赖撒谎。** 就像你不能在考试中作弊一样！

** 通常有更好的解决方案。**

**🚨 一个常见的误解**："函数永远不会改变"。

但正如我们在整篇文章中学到的，这与事实相去甚远！确实，**在组件内部定义的函数在每次渲染时都会改变！**

就像每次渲染都创建了一个新的函数，即使函数的内容看起来一样，但它们是不同的对象！

** 这本身就是一个问题。** 假设两个 effects 调用 `getFetchUrl`：

```jsx
function SearchResults() {
  function getFetchUrl(query) {
    return 'https://hn.algolia.com/api/v1/search?query=' + query;
  }

  useEffect(() => {
    const url = getFetchUrl('react');
    // ... 获取数据并做一些事情 ...
  }, []); //  缺少依赖：getFetchUrl

  useEffect(() => {
    const url = getFetchUrl('redux');
    // ... 获取数据并做一些事情 ...
  }, []); //  缺少依赖：getFetchUrl
}
```

在这种情况下，你可能不想将 `getFetchUrl` 移入任一 effect，因为你无法共享逻辑。

另一方面，如果你对 effect 依赖"诚实"，你可能会遇到问题。由于我们的两个 effects 都依赖于 `getFetchUrl`（**它在每次渲染时都不同**），我们的依赖数组是无用的：

```jsx
function SearchResults() {
  //  在每次渲染时重新触发所有 effects
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
}
```

### 解决方案 1：将函数提升到组件外部

**首先，如果函数不使用组件作用域中的任何东西，你可以将其提升到组件外部，然后在 effects 中自由使用它：**

```jsx
//  不受数据流影响
function getFetchUrl(query) {
  return 'https://hn.algolia.com/api/v1/search?query=' + query;
}

function SearchResults() {
  useEffect(() => {
    const url = getFetchUrl('react');
    // ... 获取数据并做一些事情 ...
  }, []); //  Deps 是正确的

  useEffect(() => {
    const url = getFetchUrl('redux');
    // ... 获取数据并做一些事情 ...
  }, []); //  Deps 是正确的
}
```

不需要在 deps 中指定它，因为它不在渲染作用域中，不能受数据流影响。它不能意外依赖 props 或 state。

### 解决方案 2：使用 useCallback

或者，你可以将其包装到 [`useCallback` Hook](https://reactjs.org/docs/hooks-reference.html#usecallback) 中：

```jsx
function SearchResults() {
  //  当它自己的 deps 相同时保持身份
  const getFetchUrl = useCallback((query) => {
    return 'https://hn.algolia.com/api/v1/search?query=' + query;
  }, []);  //  Callback deps 是正确的

  useEffect(() => {
    const url = getFetchUrl('react');
    // ... 获取数据并做一些事情 ...
  }, [getFetchUrl]); //  Effect deps 是正确的

  useEffect(() => {
    const url = getFetchUrl('redux');
    // ... 获取数据并做一些事情 ...
  }, [getFetchUrl]); //  Effect deps 是正确的
}
```

`useCallback` 本质上是添加另一层依赖检查。它在另一端解决问题——**不是避免函数依赖，而是使函数本身只在必要时更改**。

---

## 竞态条件处理

### 🏁 竞态条件：一个让人"头疼"的问题

一个经典的类组件数据获取示例可能看起来像这样：

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

** 正如你可能知道的，这段代码是有 bug 的。** 它不处理更新。就像你只会在第一次加载时获取数据，之后就不会更新了！

所以你可以在网上找到的第二个经典示例是这样的：

```jsx
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

** 这绝对更好！** 但它仍然有 bug。就像你修复了一个问题，但还有另一个问题在等着你！

**🏁 竞态条件：请求的"赛跑"**

原因是请求可能乱序到达。就像两个人在赛跑，但跑得快的可能后出发，最后反而先到达！

** 场景**：
- 我正在获取 `{id: 10}` 的文章（请求 A 开始）
- 用户切换到 `{id: 20}`（请求 B 开始）
- 但 `{id: 20}` 的请求先到达（请求 B 完成）
- 然后 `{id: 10}` 的请求才到达（请求 A 完成）
- **结果**：开始较早但完成较晚的请求会错误地覆盖我的状态！

** 就像你点了外卖 A，然后又点了外卖 B，但外卖 B 先到了，你吃了外卖 B，然后外卖 A 才到，但你已经不想要外卖 A 了！**

这称为**竞态条件**，在混合 `async` / `await`（假设某些东西等待结果）与自上而下的数据流（props 或 state 可能在我们处于异步函数中间时更改）的代码中很典型。

###  使用 Effect 处理竞态条件：给请求"打标记"

Effects 不会神奇地解决这个问题，尽管如果你尝试直接将 `async` 函数传递给 effect，它们会警告你。

** 就像 React 在说**："嘿，你不能直接把 async 函数给我，这样会有问题！"

** 解决方案 1：如果支持取消**

如果你使用的异步方法支持取消，那很好！你可以在清理函数中取消异步请求。

就像你可以取消外卖订单一样！

** 解决方案 2：使用布尔值标记（最简单的方法）**

或者，最简单的临时方法是使用布尔值跟踪它：

```jsx
function Article({ id }) {
  const [article, setArticle] = useState(null);

  useEffect(() => {
    let didCancel = false;  //  给这个请求打一个"标记"

    async function fetchData() {
      const article = await API.fetchArticle(id);
      if (!didCancel) {  //  检查：这个请求是否被"取消"了？
        setArticle(article);
      }
      // 如果 didCancel 是 true，说明用户已经切换到了其他文章
      // 我们就不更新状态了，就像"这个外卖我不要了"
    }

    fetchData();

    return () => {
      didCancel = true;  //  清理函数：标记这个请求为"已取消"
    };
  }, [id]);

  // ...
}
```

** 工作原理**：
- 当 `id` 改变时，effect 会重新运行
- 清理函数会将 `didCancel` 设置为 `true`，标记旧的请求为"已取消"
- 如果旧的请求完成时，`didCancel` 是 `true`，我们就忽略它
- 就像你点了新外卖，旧外卖到了你也不要了！

[这篇文章](https://www.robinwieruch.de/react-hooks-fetch-data/)更详细地介绍了如何处理错误和加载状态，以及如何将该逻辑提取到自定义 Hook 中。如果你有兴趣了解更多关于使用 Hooks 进行数据获取的信息，我建议你查看一下。

---

## 常见问题解答

### ❓ Q1: 如何用 useEffect 复制 componentDidMount？

** 你的想法**：
> "我在类组件里用 `componentDidMount`，现在想用 `useEffect` 复制它！"

虽然你可以 `useEffect(fn, [])`，但它**不是完全等价的**。与 `componentDidMount` 不同，它会**捕获** props 和 state。所以即使在回调中，你也会看到初始的 props 和 state。

** 解决方案**：
- 如果需要看到"最新"的值，可以将其写入 ref（就像用 ref 作为"后门"）
- 但通常有更简单的方式来组织代码，避免这样做
- **重要的是**：effects 的心智模型不同于生命周期方法，应该"用 effects 思考"，而不是寻找生命周期方法的等价物

** 核心思想**：不要试图"复制"生命周期方法，而是思考"如何同步外部世界到当前状态"。

---

### ❓ Q2: 如何在 useEffect 中正确获取数据？`[]` 是什么意思？

`[]` 表示 effect 不使用任何参与 React 数据流的值，因此可以安全地只应用一次。但如果实际使用了值，这通常是 bug 的来源。

** 就像你在说**："这个 effect 不依赖任何东西！"但实际上它依赖了，只是你没告诉 React。

** 正确做法**：
- 学习一些策略（主要是 `useReducer` 和 `useCallback`）来**移除依赖**，而不是错误地省略它
- 就像你通过"重构"来解决问题，而不是"撒谎"
- 参考：[React Hooks 数据获取指南](https://www.robinwieruch.de/react-hooks-fetch-data/)

---

### ❓ Q3: 是否需要将函数指定为 effect 依赖？

** 你的困惑**：
> "函数也会变吗？函数不是永远一样的吗？"

** 答案是：不是！** 在组件内部定义的函数在每次渲染时都会改变！

** 推荐做法**：
1. 将不需要 props 或 state 的函数**提升到组件外部**（就像把东西放在"公共区域"）
2. 将只在 effect 中使用的函数**放在 effect 内部**（就像把东西放在"专用盒子"里）
3. 如果 effect 仍然使用渲染作用域中的函数（包括来自 props 的函数），在定义它们的地方用 `useCallback` 包装（就像给函数"打标记"，让它只在必要时改变）

** 为什么重要**：函数可以"看到" props 和 state 的值，所以它们参与数据流。就像函数是"活"的，会随着 props 和 state 的变化而变化。

---

### ❓ Q4: 为什么有时会出现无限重新获取循环？

** 症状**：
- 你的应用一直在发送请求
- 控制台里请求日志刷屏
- 页面卡死或变慢

** 可能的原因**：
1. 在 effect 中进行数据获取时没有第二个依赖参数（就像你忘记告诉 React 什么时候停止）
2. 在依赖数组中指定了一个**总是变化**的值（就像你告诉 React 每次都要运行，但依赖每次都不同）

** 解决方案**：
- 不要移除你使用的依赖（或盲目指定 `[]`）- 这就像"掩耳盗铃"
- 从源头修复问题：将函数放在 effect 内部、提升到外部，或用 `useCallback` 包装
- 使用 `useMemo` 避免重新创建对象（就像避免每次都创建新东西）

---

### ❓ Q5: 为什么有时在 effect 中看到旧的 state 或 prop 值？

** 你的困惑**：
> "我在 effect 里用了最新的 state，但为什么看到的是旧值？"

** 答案**：Effects 总是"看到"定义它们的渲染中的 props 和 state。这有助于防止 bug，但在某些情况下可能很烦人。

就像 effect "拍"了一张照片，照片里记录的是拍照时的值，即使后来值变了，照片也不会变。

** 解决方案**：
- 对于这些情况，可以在可变 ref 中显式维护某个值（就像用 ref 作为"可变存储"）
- 如果看到旧的 props 或 state 但不期望这样，可能遗漏了一些依赖（就像你忘记告诉 React 某个值变了）
- 使用 [lint 规则](https://github.com/facebook/react/issues/14920) 来训练自己识别它们（就像有一个"老师"帮你检查）

---

## 实战技巧与最佳实践

###  技巧 1：使用 ESLint 插件（强烈推荐！）

** 强烈推荐**：使用 `eslint-plugin-react-hooks` 插件，它会自动检查你的依赖数组：

```bash
npm install eslint-plugin-react-hooks --save-dev
```

```json
{
  "plugins": ["react-hooks"],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"  // 这个规则会检查依赖数组
  }
}
```

** 好处**：
- 就像有一个"老师"实时检查你的代码
- 会在你遗漏依赖时提醒你（就像考试时的监考老师）
- 帮助你养成好习惯（就像每天刷牙一样，养成习惯就不容易忘记）

** 使用体验**：
> 当你写代码时，ESLint 会在编辑器里显示警告：
> " React Hook useEffect has a missing dependency: 'count'"
> 
> 就像有个朋友在旁边提醒你："嘿，你忘记把 count 加进去了！"

---

###  技巧 2：依赖数组检查清单

在写 effect 时，问自己这些问题（就像考试前的检查清单）：

1.  Effect 中使用了哪些 props？
2.  Effect 中使用了哪些 state？
3.  Effect 中使用了哪些函数？
4.  这些值都在依赖数组里吗？

如果答案都是"是"，那你的 effect 就是"诚实"的！就像考试时你检查了所有题目，确保没有遗漏。

---

###  技巧 3：提取自定义 Hooks（让代码更优雅）

如果 effect 逻辑复杂，考虑提取为自定义 Hook。就像把复杂的逻辑封装起来，让组件更简洁。

** 不好的做法**：把所有逻辑都放在组件里

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    let didCancel = false;
    async function fetchUser() {
      setLoading(true);
      const userData = await API.getUser(userId);
      if (!didCancel) {
        setUser(userData);
        setLoading(false);
      }
    }
    fetchUser();
    return () => { didCancel = true; };
  }, [userId]);
  
  // ... 组件逻辑被 effect 逻辑"淹没"了
  if (loading) return <div>Loading...</div>;
  return <div>{user.name}</div>;
}
```

** 好的做法**：提取为自定义 Hook

```jsx
// 自定义 Hook：封装数据获取逻辑
function useUser(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    let didCancel = false;
    async function fetchUser() {
      setLoading(true);
      const userData = await API.getUser(userId);
      if (!didCancel) {
        setUser(userData);
        setLoading(false);
      }
    }
    fetchUser();
    return () => { didCancel = true; };
  }, [userId]);
  
  return { user, loading };
}

// 组件：专注于 UI 逻辑
function UserProfile({ userId }) {
  const { user, loading } = useUser(userId);  //  一行搞定！
  
  if (loading) return <div>Loading...</div>;
  return <div>{user.name}</div>;
}
```

** 好处**：
- 逻辑复用（就像写了一个工具函数，可以在多个地方用）
- 组件更简洁（就像把复杂的东西放在工具箱里，需要时拿出来用）
- 更容易测试（就像测试一个独立的函数，比测试整个组件简单）

---

###  技巧 4：避免过度优化（不要为了优化而优化）

** 记住**：不是所有的 effect 都需要优化！就像不是所有问题都需要复杂解决方案一样。

** 简单的情况，不需要优化**：

```jsx
function Greeting({ name }) {
  useEffect(() => {
    document.title = `Hello, ${name}`;
  }, [name]);  // 简单直接，不需要过度思考
  return <h1>Hello, {name}</h1>;
}
```

** 过度优化：为了优化而优化**：

```jsx
function Greeting({ name }) {
  const memoizedName = useMemo(() => name, [name]);  // 😅 这有必要吗？
  const updateTitle = useCallback(() => {
    document.title = `Hello, ${memoizedName}`;
  }, [memoizedName]);
  
  useEffect(() => {
    updateTitle();
  }, [updateTitle]);
  
  return <h1>Hello, {name}</h1>;
}
```

** 原则**：
- 先让代码工作，再考虑优化
- 不要为了优化而优化
- 只有在真正有性能问题时才优化

就像你不需要为了去楼下买个东西就开车，走路就够了！

---

###  技巧 5：理解 effect 的执行时机

**⏰ Effect 的执行时机**：
1. 组件渲染完成后
2. 浏览器绘制屏幕后
3. 然后才运行 effect

** 为什么这样设计？**

因为大多数 effects 不需要阻塞屏幕更新。就像你先让用户看到新界面，然后再处理"后台任务"。

** 如果你需要同步执行**（在浏览器绘制之前），使用 `useLayoutEffect`：

```jsx
// useEffect：异步执行（不阻塞绘制）
useEffect(() => {
  // 浏览器绘制后才执行
}, []);

// useLayoutEffect：同步执行（阻塞绘制）
useLayoutEffect(() => {
  // 浏览器绘制前就执行
}, []);
```

** 使用建议**：
- 大多数情况用 `useEffect`（默认选择）
- 只有在需要同步 DOM 操作时才用 `useLayoutEffect`（比如测量 DOM 尺寸）

---

## 参考资源

- [原文：A Complete Guide to useEffect](https://overreacted.io/a-complete-guide-to-useeffect/) - Dan Abramov 的经典文章
- [React Hooks FAQ](https://reactjs.org/docs/hooks-faq.html) - 官方常见问题
- [React as a UI Runtime](https://overreacted.io/react-as-a-ui-runtime/) - 深入理解 React 运行时
- [React Hooks 数据获取指南](https://www.robinwieruch.de/react-hooks-fetch-data/) - 数据获取最佳实践

---

##  总结：关键要点

** 核心思想**（记住这些，你就掌握了 `useEffect`）：

1. **停止通过熟悉的类生命周期方法的棱镜来看 `useEffect` Hook**
   -  不要想："这是挂载，这是更新"
   -  要想："这是同步，这是同步"
   - 就像不要用"旧地图"导航新路线

2. **Effects 的心智模型更接近于实现同步，而不是响应生命周期事件**
   - 就像"让外部世界和 React 状态保持同步"
   - 而不是"在某个生命周期做某件事"
   - 就像你同步手机和电脑的照片，让它们保持一致

3. **理解"每个渲染都有它自己的 props 和 state"是掌握 `useEffect` 的关键**
   - 就像每次渲染都"拍"了一张照片
   - 每张照片都记录了当时的 props 和 state
   - 照片不会变，但可以拍新的照片
   - 这是理解所有 React Hooks 的基础！

4. **诚实对待依赖**
   - 不要对 React 撒谎（就像不能对老师撒谎一样）
   - 使用 ESLint 插件帮助检查（就像有个"监考老师"）
   - 如果依赖有问题，从源头修复，不要省略（就像不能"掩耳盗铃"）

5. **使用正确的工具**
   - `useCallback` 用于稳定函数引用（就像给函数"打标记"）
   - `useMemo` 用于稳定对象引用（就像给对象"打标记"）
   - `useReducer` 用于复杂状态逻辑（就像"作弊模式"）
   - 函数式更新用于基于前一个状态更新（就像"发送指令"）

** 记住**：
- 理解这些概念需要时间（就像学任何新东西一样）
- 但一旦理解了，你会发现 `useEffect` 其实很简单、很强大！
- 就像学会了骑自行车，你就永远不会忘记

** 最后**：
- 多练习，多思考
- 遇到问题不要慌，先理解原理
- 使用 ESLint 插件帮助检查
- 参考官方文档和 Dan Abramov 的博客

** 现在，去写更好的 React 代码吧！**

---

**最后更新**：2025  
**参考来源**：Dan Abramov 的 [A Complete Guide to useEffect](https://overreacted.io/a-complete-guide-to-useeffect/)  
**作者建议**：这篇文章很长，但值得花时间仔细阅读。就像读一本好书，需要慢慢品味。
