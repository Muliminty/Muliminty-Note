在 React 中，Fiber 树和虚拟 DOM 树是两个密切相关但又有所区别的概念。它们都用于管理和优化 React 的渲染流程，但它们的结构、功能和作用范围有所不同。以下是对 Fiber 树和虚拟 DOM 树的详细对比：


1.定义与结构

虚拟 DOM 树

• 定义：虚拟 DOM 是一个轻量级的 JavaScript 对象树，用于抽象表示真实 DOM 的结构。它是由 React 的 JSX 编译而成的。

• 结构：虚拟 DOM 树是一个简单的树形结构，每个节点代表一个 DOM 元素或组件。节点包含属性（`props`）、子节点（`children`）等信息。

• 示例：

```javascript
  const virtualDOM = (
    <div id="root">
      <h1>Hello, World!</h1>
      <p>This is a paragraph.</p>
    </div>
  );
  ```



Fiber 树

• 定义：Fiber 树是 React 内部用于管理和优化渲染流程的数据结构。它是一个有向图结构，每个节点（Fiber 节点）代表一个组件或 DOM 元素。

• 结构：Fiber 树是一个更复杂的结构，每个 Fiber 节点包含更多的信息，例如：

• `tag`：节点类型（如函数组件、类组件、宿主组件等）。

• `type`：组件的具体类型（如`div`、`MyComponent`等）。

• `stateNode`：指向实际的 DOM 节点或组件实例。

• `props`：组件的属性。

• `child`：指向第一个子 Fiber 节点。

• `sibling`：指向同级的下一个 Fiber 节点。

• `return`：指向父 Fiber 节点。

• `alternate`：指向与当前 Fiber 节点对应的另一个 Fiber 节点（用于双缓存机制）。

• 示例：

```javascript
  const fiber = {
    tag: 'div',
    type: 'div',
    stateNode: null,
    props: { id: 'root', children: [...] },
    child: fiberChild1,
    sibling: fiberSibling,
    return: fiberParent,
    alternate: fiberAlternate
  };
  ```



2.功能与作用

虚拟 DOM 树

• 主要功能：虚拟 DOM 树主要用于高效地更新 UI。React 通过比较新旧虚拟 DOM 树的差异（Diff 算法），生成一系列的更新操作，并批量应用到真实 DOM 上。

• 作用范围：虚拟 DOM 树主要关注组件的 JSX 结构和属性变化，用于优化真实 DOM 的操作。

• 优点：

• 避免直接操作真实 DOM，减少性能开销。

• 通过 Diff 算法高效地更新 UI。


Fiber 树

• 主要功能：Fiber 树用于管理和优化 React 的渲染流程，支持渐进式渲染和并发模式。它通过分段渲染和可中断的渲染机制，优化了 React 的性能。

• 作用范围：Fiber 树不仅管理组件的渲染，还支持 Context 的依赖收集和更新传播。

• 优点：

• 支持分段渲染和可中断的渲染，避免长时间阻塞主线程。

• 支持并发模式，允许 React 在渲染过程中处理多个任务。

• 支持时间切片（Time Slicing）和 Suspense，优化用户体验。


3.构建与更新

虚拟 DOM 树

• 构建：当 React 应用首次渲染时，React 会根据组件的 JSX 结构构建出一棵虚拟 DOM 树。

• 更新：当组件的状态或属性发生变化时，React 会生成一个新的虚拟 DOM 树，并通过 Diff 算法比较新旧虚拟 DOM 树的差异，生成一系列的更新操作。


Fiber 树

• 构建：当 React 应用首次渲染时，React 会根据虚拟 DOM 树构建出一棵 Fiber 树。每个虚拟 DOM 节点会对应一个 Fiber 节点。

• 更新：当组件的状态或属性发生变化时，React 会重新构建一个新的 Fiber 树，并与当前的 Fiber 树进行比较，生成一系列的更新操作。这些更新操作会通过 React 的调度机制逐步应用到真实 DOM 上。


4.性能优化

虚拟 DOM 树

• 优化机制：通过 Diff 算法优化虚拟 DOM 树的更新，减少不必要的 DOM 操作。

• 限制：虚拟 DOM 树的更新是同步的，可能会阻塞主线程，尤其是在大型组件树中。


Fiber 树

• 优化机制：通过分段渲染和可中断的渲染机制，避免长时间阻塞主线程。支持时间切片（Time Slicing）和并发模式，优化用户体验。

• 限制：虽然 Fiber 树的更新机制更加复杂，但它的设计目标是提高性能和用户体验。


5.示例对比
假设有一个简单的 React 应用：

```javascript
function App() {
  return (
    <div id="root">
      <h1>Hello, World!</h1>
      <p>This is a paragraph.</p>
    </div>
  );
}
```



虚拟 DOM 树
虚拟 DOM 树的结构如下：

```javascript
{
  type: 'div',
  props: { id: 'root', children: [
    { type: 'h1', props: { children: 'Hello, World!' } },
    { type: 'p', props: { children: 'This is a paragraph.' } }
  ]}
}
```



Fiber 树
Fiber 树的结构如下：

```javascript
{
  tag: 'div',
  type: 'div',
  stateNode: null,
  props: { id: 'root', children: [...] },
  child: fiberChild1,
  sibling: null,
  return: fiberParent,
  alternate: fiberAlternate
}
```



总结

• 虚拟 DOM 树：主要用于高效地更新 UI，通过 Diff 算法优化真实 DOM 的操作。

• Fiber 树：用于管理和优化 React 的渲染流程，支持渐进式渲染和并发模式，通过分段渲染和可中断的渲染机制提高性能。

Fiber 树是 React 内部实现的细节，而虚拟 DOM 树是 React 开发者可以直接操作和理解的概念。理解它们之间的关系，可以帮助开发者更好地优化 React 应用的性能。
