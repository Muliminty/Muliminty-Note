# 实现一个迷你版的 React
在本文中，我们将从头开始实现一个简化版的 React，包括核心的虚拟 DOM、事件处理、状态管理和组件系统。通过这一实践，你将深入理解 React 的核心原理，并为构建更复杂的前端框架打下基础。

---

#### 一、项目概述

我们将实现一个极简版的 React，具备以下功能：

1. **虚拟 DOM**：通过 `createElement` 方法生成虚拟 DOM。
2. **DOM 渲染**：将虚拟 DOM 渲染为真实 DOM。
3. **函数组件**：支持简单的函数组件，利用 React 风格的声明式编程。
4. **状态管理**：实现 `useState` Hook，支持状态更新并触发渲染。

项目的核心代码如下：

```html
<!DOCTYPE html>
<html>
<head>
  <title>Mini React</title>
</head>
<body>
  <div id="root"></div>

  <script>
    // 创建虚拟 DOM
    function createElement(type, props, ...children) {
      return {
        type,
        props: {
          ...props,
          children: children.map(child =>
            typeof child === "object" ? child : createTextElement(child)
          ),
        },
      };
    }

    function createTextElement(text) {
      return {
        type: "TEXT_ELEMENT",
        props: {
          nodeValue: text,
          children: [],
        },
      };
    }

    // 渲染虚拟 DOM
    function render(element, container) {
      if (typeof element.type === "function") {
        const childElement = element.type(element.props);
        return render(childElement, container);
      }

      const dom = element.type === "TEXT_ELEMENT"
        ? document.createTextNode("")
        : document.createElement(element.type);

      const isProperty = key => key !== "children";
      const isEvent = key => key.startsWith("on");

      Object.keys(element.props)
        .filter(isProperty)
        .forEach(name => {
          dom[name] = element.props[name];
        });

      Object.keys(element.props)
        .filter(isEvent)
        .forEach(name => {
          const eventType = name.toLowerCase().substring(2);
          dom.addEventListener(eventType, element.props[name]);
        });

      element.props.children.forEach(child => render(child, dom));

      container.appendChild(dom);
    }

    // 状态管理
    let hookIndex = 0;
    let hooks = [];

    function useState(initial) {
      const currentIndex = hookIndex++;
      hooks[currentIndex] = hooks[currentIndex] || initial;

      function setState(newState) {
        hooks[currentIndex] = newState;
        scheduleRender();
      }

      return [hooks[currentIndex], setState];
    }

    let isRendering = false;
    function scheduleRender() {
      if (!isRendering) {
        isRendering = true;
        requestAnimationFrame(() => {
          document.getElementById("root").innerHTML = "";
          hookIndex = 0;
          render(createElement(App), document.getElementById("root"));
          isRendering = false;
        });
      }
    }

    // 示例组件
    function Counter() {
      const [count, setCount] = useState(0);

      return (
        createElement("div", null,
          createElement("h1", null, "Count: ", count),
          createElement("button", { 
            onClick: () => setCount(count + 1) 
          }, "+"),
          createElement("button", { 
            onClick: () => setCount(count - 1) 
          }, "-")
        )
      );
    }

    function App() {
      return createElement(Counter);
    }

    // 初始渲染
    scheduleRender();
  </script>
</body>
</html>
```

---

#### 二、核心功能解析

##### 1. **虚拟 DOM 的创建：`createElement` 和 `createTextElement`**

首先，我们需要实现虚拟 DOM（Virtual DOM）。这是 React 性能优化的关键。虚拟 DOM 是对 UI 结构的一种描述，它是一个简单的 JavaScript 对象，而不是直接操作 DOM 节点。通过虚拟 DOM，React 能够高效地更新真实 DOM，减少不必要的 DOM 操作。

`createElement` 方法是用来创建虚拟 DOM 元素的：

```javascript
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}
```

- `type` 表示元素的类型（如 `"div"`、`"button"` 等）。
- `props` 包含元素的属性（如 `className`、`onClick` 等）。
- `children` 是子元素，可以是字符串、数字或嵌套的虚拟 DOM 元素。

`createTextElement` 用于创建文本节点，所有文本都会被包装为 `TEXT_ELEMENT`，并持有 `nodeValue` 属性：

```javascript
function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}
```

##### 2. **虚拟 DOM 渲染：`render`**

`render` 函数负责将虚拟 DOM 转换为真实 DOM 元素，并插入到页面中。它会递归地创建所有子元素，并为它们添加事件监听器：

```javascript
function render(element, container) {
  if (typeof element.type === "function") {
    const childElement = element.type(element.props);
    return render(childElement, container);
  }

  const dom = element.type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(element.type);

  Object.keys(element.props)
    .filter(key => key !== "children")
    .forEach(name => {
      dom[name] = element.props[name];
    });

  Object.keys(element.props)
    .filter(key => key.startsWith("on"))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, element.props[name]);
    });

  element.props.children.forEach(child => render(child, dom));

  container.appendChild(dom);
}
```

- 该函数首先检查 `element.type` 是否为函数组件。如果是，它会递归地调用组件，渲染出子组件。
- 然后，我们根据节点的类型创建相应的真实 DOM 元素。如果是文本元素，我们创建文本节点；如果是普通元素（如 `div`），我们创建相应的 DOM 元素。
- 之后，我们为所有非 `children` 属性设置 DOM 属性，处理事件监听器。

##### 3. **状态管理：`useState`**

在 React 中，状态是组件重新渲染的核心。我们通过 `useState` Hook 来管理组件状态。`useState` 使用一个数组来存储每个组件的状态，每次状态更新都会触发重新渲染。

```javascript
function useState(initial) {
  const currentIndex = hookIndex++;
  hooks[currentIndex] = hooks[currentIndex] || initial;

  function setState(newState) {
    hooks[currentIndex] = newState;
    scheduleRender();
  }

  return [hooks[currentIndex], setState];
}
```

- `useState` 会返回当前状态值和更新状态的函数 `setState`。
- `setState` 会更新状态并触发重新渲染。

##### 4. **重新渲染机制：`scheduleRender`**

每当状态更新时，`setState` 会调用 `scheduleRender` 函数，这样我们就可以在浏览器空闲时执行渲染，避免多次渲染导致性能问题。`scheduleRender` 会清空容器，并重新调用 `render` 来渲染新的组件树：

```javascript
function scheduleRender() {
  if (!isRendering) {
    isRendering = true;
    requestAnimationFrame(() => {
      document.getElementById("root").innerHTML = "";
      hookIndex = 0;
      render(createElement(App), document.getElementById("root"));
      isRendering = false;
    });
  }
}
```

---

#### 三、运行效果

打开这个 HTML 文件，你会看到一个简单的计数器应用，支持点击按钮来增加和减少计数。这个过程展示了如何通过组件化思想和 `useState` 管理组件状态，同时保持代码的简洁和高效。

---

#### 四、进一步优化方向

虽然我们已经实现了一个简化版的 React，但仍然有许多改进的空间：

1. **支持类组件**：目前只支持函数组件，类组件也是 React 中常见的组件形式，未来可以添加支持。
2. **优化渲染性能**：通过实现更复杂的 Diff 算法，优化虚拟 DOM 和真实 DOM 之间的比较，从而减少不必要的 DOM 更新。
3. **添加更多 Hooks**：如 `useEffect`、`useContext` 等，进一步增强框架的功能和灵活性。

通过这个迷你项目，我们基本实现了 React 的核心功能。希望这篇文章能帮助你理解 React 的

