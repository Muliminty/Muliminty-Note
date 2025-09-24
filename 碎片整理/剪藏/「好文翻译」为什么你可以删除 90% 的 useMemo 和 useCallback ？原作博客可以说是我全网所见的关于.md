
[「好文翻译」为什么你可以删除 90% 的 useMemo 和 useCallback ？原作博客可以说是我全网所见的关于 - 掘金](https://juejin.cn/post/7251802404877893689)

## 译者前言

之前发了一条掘金沸点：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/02a12444e43949f38fe9d3587801e52d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

下面有同学吐槽纯英文，我遂有了翻译的想法。翻译已得到原作者允许，原文地址见下。作者博客中还有许多好文章，英文还行的读者可以去看看，可以说是我全网所见的关于 React 性能优化方面最好的文章（评论区也极有营养，不要错过）。如果英文不好，也没关系，如果本文受欢迎，我后面也会考虑继续翻译下去。

[www.developerway.com/posts/how-t…](https://link.juejin.cn/?target=https%3A%2F%2Fwww.developerway.com%2Fposts%2Fhow-to-use-memo-use-callback "https://www.developerway.com/posts/how-to-use-memo-use-callback")

作者是：Nadia Makarevich

## 不多废话，正文开始

如<mark style="background: #CACFD9A6;">果你不是一个 </mark>React 纯新手，那么你大概对 `useMemo` 和 `useCallback` 已经比较熟悉了。如果你在负责开发或维护一个中等规模或大规模的应用，你有可能将你的应用程序的某些部分吐槽为 "难以理解的 `useMemo` 和 `useCallbacks` 链条，无法阅读和调试"。

这些 hooks 似乎有一种不受控制自行扩散的魔力，直到它们完全控制你的仓库。你会发现，你自己，以及你身边的同事，都正在四面八方孜孜不倦地写下它们。

你知道令人悲伤的一点是什么吗？这些都是**完完全全的无用功**。你当下就可以删除你代码中至少 90% 的 `useMemo` 和 `useCallback` ，与此同时你的应用跑起来完全 OK，甚至还比原来快了那么一丢丢。不要误会我的意思，我不是说 `useMemo` 和 `useCallback` 完全没用。只是他们的用途只被限制在少数非常特殊并且确定的场景下。除此之外，大部分时间里我们都在毫无意义地把业务代码包裹在它们里面。

这就是我今天要说的：开发者会犯哪些和 `useMemo` 与 `useCallback` 有关的错误？这两个 hooks 的真实目的是什么，并且我们该如何恰当地使用它们。

有两个主要原因导致了这两个 hooks 恶心地向四面八方扩散：

- 缓存（memorize） props，从而防止组件重渲染(re-render)
- 缓存某些值，从而避免在每次重渲染时执行开销昂贵的计算任务

我们将在下面的文章里仔细审视这两个原因，但第一点是：`useMemo` 和 `useCallback` 的目的到底是什么？

## 我们为什么需要 useMemo 和 useCallback ？

答案很简单：在每次**重渲染之间**缓存数据。如果一个值或函数被包裹在这两个 hooks 中，react 就会在首次渲染时缓存这个值或函数。在接下来的每次重渲染时，都会返回这个缓存的值。如果不使用它们，所有非原始类型的值，如 `array`、`object`，或 `function`，都会在每一次重渲染时被彻底重新创建。

如果你需要在每次重渲染时比较这些值，那么缓存它们是很有用的。这其实和普通的 javascript 没什么区别：

```
const a = { "test": 1 };
const b = { "test": 1'};
console.log(a === b); // 值为 false
const c = a; // "c" 仅仅是 "a" 的引用
console.log(a === c); // 值为 true
```

或者，更接近于我们的典型 React 应用的话，例子是这样的：

```
const Component = () => {  
  const a = { test: 1 };
  useEffect(() => {    
    // "a" 将会在每次重渲染时被比较
  }, [a]);
  // 你剩下的代码
};
```

`a` 是 `useEffect` hook 的依赖项。在 `Component` 的每次重渲染时， `React` 都会把它与的值与上次渲染时的值做比较. `a` 是一个在 `Component` 内部定义的 `object`，这意味着在每次重渲染时，`a` 都会被完完全全地重新创建(re-create)。因此，比较”重渲染之前的 `a`“ 和 ”重渲染之后的 `a`“，结果都会是 `false`，所以被 `useEffect` 包裹的函数也将会在每次重渲染的过程中触发调用。

为了避免以上结果，我们可以把 `a` 包裹在 `useMemo` 中：

```
const Component = () => {
  // 在每次重渲染之间保存 a
  const a = useMemo(() => ({ test: 1 }), []);

  useEffect(() => {
    // 只有当 a 的值真实发生改变时才会触发
  }, [a]);
  // 你剩下的代码
};
```

现在 `useEffect` 中的方法只有在 `a` 值确实发生变化的时候才会触发（不过在本例中这不会发生）。

`useCallback` 也是同样的道理，只不过它对于缓存函数更有用：

```
const Component = () => {
  // 在每次重渲染之间保存 onClick 方法
  const fetch = useCallback(() => {
    console.log('fetch some data here');  
  }, []);
  useEffect(() => {    
    // 只有当 fetch 的值真的发生该表的时候才会触发
    fetch();  
  }, [fetch]);
  // 你剩下的代码
};
```

在这里，需要记住的最重要的一件事是，`useMemo` 和 `useCallback` 只有在**重渲染的过程中**才有用。在初始渲染过程中，它们不仅是无用的，甚至是有害的：它们会让 React 做很多额外的工作。这意味着你的应用在初始渲染过程中会**稍稍更慢**一些。并且，如果你的应用有数百个这些 hooks 分布在各处，那么这些轻微的影响初始渲染的作用就可以被观察到。

## 缓存 props 以避免重渲染

既然我们已经知道了这俩 hooks 的作用，让我们考察一下它们。其中最重要的一点，也是最常被用到的一点，就是缓存 props 以避免重渲染。如果你的应用中也存在类似下面的代码片段，请给我吹个口哨：

1. 把 onClick 包裹在 useCallback 中以避免重渲染
    
    ```
    const Component = () => {
      const onClick = useCallback(
        () => {    /* do something */  }, []
      );
      return (
        <>
          <button onClick={onClick}>Click me</button>
         ... // 其他组件  
        </>  
      );
    };
    ```
    
2. 把 onClick 包裹在 useCallback 中以避免重渲染
    
    ```
    const Item = ({ item, onClick, value }) => <button onClick={onClick}>
      {item.name}</button>;
    const Component = ({ data }) => {
      const value = { a: someStateValue };
      const onClick = useCallback(() => {    /* do something on click */  }, []);
      return (
        <>
          {data.map((d) => (
            <Item item={d} onClick={onClick} value={value} />
          ))}
        </>
      );
    };
    ```
    
3. 把 value 包裹在 useMemo 中，因为它是被缓存的 onClick 的依赖：
    
    ```
    const Item = ({ item, onClick }) => <button onClick={onClick}>
      {item.name}
    </button>;
    const Component = ({ data }) => {
      const value = useMemo(() => ({ a: someStateValue }), [someStateValue]);
      const onClick = useCallback(() => {    console.log(value);  }, [value]);
      return (
        <>
          {data.map((d) => (<Item item={d} onClick={onClick} />))}
        </>
      );
    };
    ```
    

以上是否就是你曾经干过的，或者见别人干过的事儿？你是否同意 hook 解决了你想让它们解决的问题？如果你的答案是 yes，那么恭喜了，`useMemo` 和 `useCallback` 劫持了你，并且毫无必要地控制了你的生活。在以上所有的例子里，这两个 hooks 都**毫无作用。**它们让代码变得复杂，拖慢了初始渲染，却没有阻止任何事情（指重渲染）。

如果想要知道为什么，我们需要记住一件有关 React 如何工作的最重要的事：为什么一个组件会重渲染它自己。

## 为什么一个组件会重渲染它自己？

“当 state 或者 prop 发生变化的时候，组件就会重渲染自己”，这是一个有关 React 的共识。甚至 [React 官方文档](https://link.juejin.cn/?target=https%3A%2F%2Flegacy.reactjs.org%2Fdocs%2Freact-component.html%23updating "https://legacy.reactjs.org/docs/react-component.html#updating")也提到了这一点。我认为这一申明得出了一个错误的推论：“如果 prop 没有变化（比如，被缓存了），那组件就不会重渲染。”（译者注：以上推论是一个典型的逻辑错误，A 是 B 的充分条件，并不意味着 !A 是 !B 的充分条件。）

上面这句话之所以是错误的，就是因为还有一个重要的原因会导致组件重渲染：**当组件的父组件重渲染！**

或者说，如果我们从相反的角度考虑：当一个组件重渲染它自己的时候，它也会同时重渲染它的 children。看一下下面的代码示例：

```
const App = () => {
  const [state, setState] = useState(1);
  return (
    <div className="App">
      <button onClick={() => setState(state + 1)}>
        click to re-render {state}
      </button>
      <br />
      <Page />
    </div>
  );
};
```

`App` 组件有一些 state，也有一些 children，包括 `Page` 组件。打不过 button 被点击的时候，会发生什么呢？State 会变化，它会导致 App 的重渲染，并且会触发它重渲染它所有的 children，包括 `Page` 组件。在这过程中 `Page` 组件甚至没有 props！

现在，在 `Page` 组件中，如果我们存在一个这样的 children：

```
const Page = () => <Item />;
```

它完全是空的，既没有 state，也没有 props。但是当 App 重渲染的时候， Page 组件依旧会重渲染，并连同重渲染它内部的 Item 组件。App 组件的 state 变化触发了应用内的一整个重渲染链条。可以在这个 codesandbox 中看到[完整示例](https://link.juejin.cn/?target=https%3A%2F%2Fcodesandbox.io%2Fs%2Fparent-children-re-renders-gihtcw%3Ffile%3D%2Fsrc%2FApp.tsx "https://codesandbox.io/s/parent-children-re-renders-gihtcw?file=/src/App.tsx")。

唯一去打断这链条的办法，是去缓存组件内的子组件。我们能够用 `useMemo` 做到这些，更好的方法则是使用 [React.memo](https://link.juejin.cn/?target=https%3A%2F%2Flegacy.reactjs.org%2Fdocs%2Freact-api.html%23reactmemo "https://legacy.reactjs.org/docs/react-api.html#reactmemo") 工具函数。只有当组件被包裹在其以内时，React 才会在重渲染之前先停下来检查一下 props 是否产生了变化。

这样缓存一个组件：

```
const Page = () => <Item />;
const PageMemoized = React.memo(Page);
```

在一个包含 state 的 App 中使用它：

```
const App = () => {
  const [state, setState] = useState(1);
  return (
    ... // same code as before
    <PageMemoized />
  );
};
```

在以上，并且**只有**在以上场景中，props 是否被缓存才是重要的。

让我们想象 `Page` 组件存在一个 `onClick` prop，它接收一个函数。如果我在不缓存这个函数的情况下，把它传递给 `Page`，会发生什么呢？

```
const App = () => {
  const [state, setState] = useState(1);
  const onClick = () => {
    console.log('Do something on click');
  };
  return (
    // 不管 onClick 有没有缓存，page 都会重渲染
    <Page onClick={onClick} />
  );
};
```

`App` 会重渲染，React 会在 App 的 children 中找到 `Page` 组件，并且重渲染它。`onClick` 是否包裹在 `useCallback` 中并不重要。

那么如果我们把 `Page` 组件缓存起来了呢？

```
const PageMemoized = React.memo(Page);
const App = () => {
  const [state, setState] = useState(1);
  const onClick = () => {
    console.log('Do something on click');
  };
  return (
    // 因为 onClick 没有缓存，PageMemoized 「将会」重渲染
    <PageMemoized onClick={onClick} />
  );
};
```

`App` 会重渲染，React 会在它的 children 中发现 `PageMemoized` 组件，并意识到它被 `React.memo` 方法包裹，这会打断重渲染链条，React 会事先检查这个组件的 props 是否有变化。在这个例子里，既然 `onClick` 是一个未被缓存的函数，props 比较的结果就会是 `false`，那么 `PageMemoized` 组件就会重渲染它自己。

最后，让我们来看看 useCallback 的应用：

```
const PageMemoized = React.memo(Page);
const App = () => {
  const [state, setState] = useState(1);
  const onClick = useCallback(
    () => { console.log('Do something on click');  }, 
    []
  );
  return (
    // PageMemoized 因为 onClick 被缓存了，将「不会」重渲染
    <PageMemoized onClick={onClick} />
  );
};
```

现在，当 React 检查 `PageMemoized` 的 props 有无变化时，`onClick` 将会保持不变，只有在这种情况下， `PageMemoized` 才不会重渲染。

如果我给 PageMemoized 组件增加另一个非缓存的值，将会发生什么呢？就像下面的场景：

```
const PageMemoized = React.memo(Page);
const App = () => {
  const [state, setState] = useState(1);
  const onClick = useCallback(
    () => { console.log('Do something on click'); },
    []
  );
  return (
    // 因为 value 没有被缓存，page 「将会」重渲染
    <PageMemoized onClick={onClick} value={[1, 2, 3]} />
  );
};
```

React 停下来检查 `PageMemoized` 组件的 props 是否发生变化，`onClick` 确实没变化，但是 `value` 变化了，那么 `PageMemoized` 还是会重渲染！可以在[这里](https://link.juejin.cn/?target=https%3A%2F%2Fcodesandbox.io%2Fs%2Feverything-memoized-8oltqg%3Ffile%3D%2Fsrc%2FApp.tsx "https://codesandbox.io/s/everything-memoized-8oltqg?file=/src/App.tsx")看完整示例，试一下删除缓存，看看组件里的每样东西是如何重渲染的。

思考一下以上示例，我们可以得出结论，只有在唯一的一种场景下，缓存 props 才是有意义的：**当组件的每一个 prop，以及组件本身被缓存的时候**。

如果组件代码里有以下情形，我们可以毫无心理负担地删掉 `useMemo` 和 `useCallback`：

- 它们被作为 attributes ，直接地或作为依赖树的上层，被传递到某个 DOM 上
- 它们被作为 props，直接地或作为依赖树的上层，被传递到某个未被缓存的组件上
- 它们被作为 props，直接地或作为依赖树的上层，被传递到某个组件上，而那个组件至少有一个 prop 未被缓存

**但为啥不修复缓存（指给组件、及组件所有的 prop 加上缓存），而是要删掉它们呢？**那是因为：如果你因为组件的重渲染而出现了某些性能问题，你肯定已经注意到，并且修复掉它们了，对吧？（译者注：即给所有的 prop 和组件本身加上了缓存，不是以上列出的三情况之一了）。 😉剩下的既然没有性能问题，就也没必要去 fix 代码啦（直接删了更好）。删除无用的 `useMemo` 和 `useCallback` 将会简化你的代码，并且在初次渲染时稍稍提速，同时不会对现有的重渲染性能产生任何负面影响。

## 在每次重渲染时避免开销巨大的运算

就像上文以及 [React 官方文档](https://link.juejin.cn/?target=https%3A%2F%2Flegacy.reactjs.org%2Fdocs%2Fhooks-reference.html%23usememo "https://legacy.reactjs.org/docs/hooks-reference.html#usememo")提到的，`useMemo` 最主要的作用，就是在每次的渲染过程中避免开销巨大的运算。在叙述中，并没有提到什么算是“开销巨大”的运算。结果就是，开发者往往在 render 方法中滥用 `useMemo`。创建一个新日期对象？filer、或 map 、或 sort 一个数组？创建一个普通 object 对象？都用 `useMemo` 包裹一下吧！

好吧，让我们看一组数字。考虑我们有一个国家列表（大概有 250 个元素），并且我们希望在页面上展示它们，并且允许用户去执行排序操作。

```
const List = ({ countries }) => {
  // sorting list of countries here
  const sortedCountries = orderBy(countries, 'name', sort);
  return (
    <>
      {
        sortedCountries.map((country) => (
          <Item country={country} key={country.id} />
        ))
      }
    </>
  );
};
```

问题是：给 250 个元素排序属于开销巨大的操作么？感觉好像是，但到底是不是呢？我们可以将它用 `useMemo` 包裹以避免在重渲染中重新计算一遍，是吗？其实，这个问题的答案是很容易度量的，使用我们常用的 performance api 就行了。

```
const List = ({ countries }) => {
  const before = performance.now();
  const sortedCountries = orderBy(countries, 'name', sort);
  // this is the number we're after
  const after = performance.now() - before;
  return (    // same  )
};
```

最终结果如何呢？如果不缓存的话，在设置 6倍 CPU 减速的情况下（译者注：Chrome 开发者工具有这个功能，允许开发者模拟在低性能 PC 上的访问体验），给 250 个元素排序耗时**少于 2 毫秒。**作为比较，渲染这个列表——仅仅是原生的按钮上带文字——就消耗了 20 毫秒。多十倍啊！请看[完整示例](https://link.juejin.cn/?target=https%3A%2F%2Fcodesandbox.io%2Fs%2Fmeasure-without-memo-tnhggk%3Ffile%3D%2Fsrc%2Fpage.tsx "https://codesandbox.io/s/measure-without-memo-tnhggk?file=/src/page.tsx")。

在实际场景中，数组往往比示例中的更小，同时渲染的内容比示例中的更复杂，因此更慢。所以总的来说「计算」与「渲染」之间的耗时往往超过 10 倍。

与其说缓存数组操作，我们更应该缓存的是实际上是最耗时的计算——重渲染并更新组件。像下面这样：

```
const List = ({ countries }) => {
  const content = useMemo(() => {
    const sortedCountries = orderBy(countries, 'name', sort);
    return sortedCountries.map((country) =>
      <Item country={country} key={country.id} />
    );
  }, [countries, sort]);
  return content;
};
```

以上 `useMemo` 把大约 20ms 的重渲染时间，减少了不到 2ms（也就是 18ms 左右）。

考虑以上事实，我想说的关于缓存”开销巨大“操作的一条准则就是：除非你真的要搞类似大数阶乘，疯狂递归，大素数分解这样的操作，否则就在纯 javascript 操作中把 `useMemo` 删掉吧。重渲染元素才是你的瓶颈。请只在渲染树的重要部分使用 `useMemo`。

问题又来了，**那为啥一定要删掉它们呢**？把所有东西缓存起来不是更好吗？哪怕只让重渲染速度提升了 2ms，这里提升 2ms，那里提升 2ms，累加起来就很可观了呀。换个角度看，如果完全不写 `useMemo`，那么应用就会在这里慢 2ms，在那里又慢 2ms，很快我们的应用就会比它们原本能达到的程度慢的多了。

听起来很有道理 ，并且，如果不是考虑到另一点的话，以上推论确实 100% 说得通。这一点便是：缓存并不是毫无开销的。如果我们使用 `useMemo`，在初始渲染过程中 React 就需要缓存其值了——这当然也产生耗时。没错，这耗时很微小，在我们的应用中，缓存上述提到过的排序国家列表耗时不超过 1ms。但是！**这才会产生货真价实的叠加效应**！在初始渲染让你的应用第一次呈现在屏幕前的过程中，当前页面的**每一个**元素都会经历这一过程，这将导致 10~20 ms，或更糟糕的，接近 100ms 的不必要的延时。

与初始渲染相比，重渲染仅仅在页面某些部分改变时发生。在一个架构合理的应用中，只有这些特定区域的组件才会重渲染，而非整个应用（页面）。那么在一次寻常的重渲染中，总的“计算”的消耗和我们上面提到的例子（译者注：指 250 个元素的排序列表）相比，会高出多少呢？2~3 倍？，就假设有 5 倍好了，那也仅仅是节省了 10ms 的渲染时间，这么短的时间间隔我们的肉眼是无法察觉的，并且在十倍的渲染时间下，这 10 ms 也确实很不起眼。可作为代价的是，它确实拖慢了每次都会发生的初始渲染过程😔。

（译者总结：参与初始渲染的是整个页面相关的组件，参与重渲染的只是局部的组件，两者不是一个数量级。参与初始渲染的大量组件，被 `useMemo` 和 `useCallbak` 拖慢所产生的叠加明显，远远比参与重渲染的少量组件，被 `useMemo` 和 `useCallbak`所优化所产生的叠加效应来的明显！也就是说，资不抵债，这笔优化划不来。）

## 今天说得够多的了

上面确实传达了不少信息，希望你能觉得有用，并立马热情澎湃地回过头来 review 你的代码，从 `useMemo` 和 `useCallback` 的束缚中解脱出来。下面是一些简短的总结：

- `useCallback` 和 `useMemo` 仅仅在后续渲染（也就是重渲染）中起作用，在初始渲染中它们反而是有害的
- `useCallback` 和 `useMemo` 作用于 `props` 并不能避免组件重渲染。只有当每一个 `prop` 都被缓存，且组件本身也被缓存的情况下，重渲染才能被避免。只要有一丁点疏忽，那么你做的一切努力就打水漂了。所以说，简单点，把它们都删了吧。
- 把包裹了“纯 js 操作“的 `useMemo` 也都删了吧。与组件本身的渲染相比，它缓存数据带来的耗时减少是微不足道的，并且会在初始渲染时消耗额外的内存，造成可以被观察到的延迟。

最后的小提示：考虑到 `useMemo` 和 `useCallbak` 是如此复杂且脆弱，你应该把它们作为你性能优化计划中最后才考虑的一点。试试其他优化技巧吧，看一下我的其它文章，它们提到了这些技巧（译者注：若文章点赞过百，考虑再翻译一篇）

- [How to write performant React code: rules, patterns, do's and don'ts](https://link.juejin.cn/?target=https%3A%2F%2Fwww.developerway.com%2Fposts%2Fhow-to-write-performant-react-code "https://www.developerway.com/posts/how-to-write-performant-react-code")
- [Why custom react hooks could destroy your app performance](https://link.juejin.cn/?target=https%3A%2F%2Fwww.developerway.com%2Fposts%2Fwhy-custom-react-hooks-could-destroy-your-app-performance "https://www.developerway.com/posts/why-custom-react-hooks-could-destroy-your-app-performance")
- [How to write performant React apps with Context](https://link.juejin.cn/?target=https%3A%2F%2Fwww.developerway.com%2Fposts%2Fhow-to-write-performant-react-apps-with-context "https://www.developerway.com/posts/how-to-write-performant-react-apps-with-context")
- [React key attribute: best practices for performant lists](https://link.juejin.cn/?target=https%3A%2F%2Fwww.developerway.com%2Fposts%2Freact-key-attribute "https://www.developerway.com/posts/react-key-attribute")
- [React components composition: how to get it right](https://link.juejin.cn/?target=https%3A%2F%2Fwww.developerway.com%2Fposts%2Fcomponents-composition-how-to-get-it-right "https://www.developerway.com/posts/components-composition-how-to-get-it-right").

当然，不言而喻的是，测量优先！（没有数据就没有发言权）

希望今天是你在 `useMemo` 和 `useCallbak` 地狱中苦苦挣扎的最后一天！✌🏼