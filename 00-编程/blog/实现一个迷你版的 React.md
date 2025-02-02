# 从零实现一个简化版 React

最近，我尝试从零实现一个简化版的 React 框架，目的是深入理解 React 的核心原理，包括虚拟 DOM、状态管理、组件化开发以及 JSX 的支持。

---

### **1. 为什么选择实现一个简化版 React？**

React 是现代前端开发中最流行的框架之一，其核心思想包括虚拟 DOM、组件化开发、状态管理等。尽管我已经使用 React 开发了多个项目，但我对其底层原理的理解仍然不够深入。为了彻底掌握 React 的工作原理，我决定从零实现一个简化版的 React。

我的目标包括：
- 理解虚拟 DOM 的创建和渲染过程。
- 实现状态管理（如 `useState`）。
- 支持 JSX 语法。
- 实现组件化开发。

---

### **2. 实现过程与心路历程**

#### **2.1 虚拟 DOM 的创建**
虚拟 DOM 是 React 的核心概念之一。它是一个轻量级的 JavaScript 对象，用于描述真实 DOM 的结构。我的第一步是实现虚拟 DOM 的创建。

**实现思路**：
- 定义一个 `createElement` 函数，用于创建虚拟 DOM 元素。
- 支持文本节点的创建，通过 `createTextElement` 函数将文本转换为虚拟 DOM。

**代码实现**：
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

**遇到的问题**：
- 如何区分普通元素和文本元素？
- 如何处理嵌套的子元素？

**解决方案**：
- 通过 `type` 字段区分普通元素和文本元素。
- 使用递归处理嵌套的子元素。

---

#### **2.2 虚拟 DOM 的渲染**
虚拟 DOM 需要被渲染为真实 DOM 才能显示在页面上。我实现了 `ReactDOM.render` 函数来完成这一任务。

**实现思路**：
- 根据虚拟 DOM 的类型创建真实 DOM 元素。
- 处理属性（包括普通属性、`style` 对象和事件绑定）。
- 递归渲染子元素。

**代码实现**：
```javascript
const ReactDOM = {
  render(element, container) {
    if (typeof element.type === "function") {
      const childElement = element.type(element.props);
      return this.render(childElement, container);
    }

    const dom =
      element.type == "TEXT_ELEMENT"
        ? document.createTextNode(element.props.nodeValue)
        : document.createElement(element.type);

    Object.keys(element.props)
      .filter(key => key !== "children")
      .forEach(name => {
        if (name === 'style') {
          const style = element.props[name];
          Object.keys(style).forEach(styleName => {
            const cssName = styleName.replace(/([A-Z])/g, '-$1').toLowerCase();
            dom.style[cssName] = style[styleName];
          });
        } else {
          dom[name] = element.props[name];
        }
      });

    Object.keys(element.props)
      .filter(key => key.startsWith("on"))
      .forEach(name => {
        const eventType = name.toLowerCase().substring(2);
        dom.addEventListener(eventType, element.props[name]);
      });

    element.props.children.forEach(child =>
      this.render(child, dom)
    );

    container.appendChild(dom);
  }
};
```

**遇到的问题**：
- 如何处理函数组件？
- 如何绑定事件？

**解决方案**：
- 通过递归处理函数组件。
- 使用 `addEventListener` 绑定事件。

---

#### **2.3 状态管理**
状态管理是 React 的另一个核心功能。我实现了 `useState` 来支持组件的状态管理。

**实现思路**：
- 使用一个数组 `hooks` 来存储状态。
- 通过 `hookIndex` 跟踪当前 Hook 的索引。
- 在状态更新时，触发重新渲染。

**代码实现**：
```javascript
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

function scheduleRender() {
  if (!isRendering) {
    isRendering = true;
    requestAnimationFrame(() => {
      document.getElementById("root").innerHTML = "";
      hookIndex = 0;
      ReactDOM.render(<App />, document.getElementById("root"));
      isRendering = false;
    });
  }
}
```

**遇到的问题**：
- 如何避免状态丢失？
- 如何触发重新渲染？

**解决方案**：
- 使用 `hooks` 数组存储状态。
- 通过 `scheduleRender` 触发重新渲染。

---

#### **2.4 支持 JSX 语法**
为了让代码更接近 React，我引入了 Babel 编译器来支持 JSX 语法。

**实现思路**：
- 在 HTML 中引入 Babel 编译器。
- 使用 `type="text/babel"` 标记脚本。

**代码实现**：
```html
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
  // JSX 代码
</script>
```

**遇到的问题**：
- 如何将 JSX 转换为 JavaScript？

**解决方案**：
- 使用 Babel 编译器自动转换 JSX。

---

### **3. 最终成果**
通过以上步骤，我成功实现了一个简化版的 React 框架，支持以下功能：
1. **虚拟 DOM**：创建和渲染虚拟 DOM。
2. **状态管理**：通过 `useState` 实现组件状态管理。
3. **组件化开发**：支持函数组件和 JSX 语法。
4. **事件绑定**：支持 `onClick` 等事件绑定。

以下是一个简单的计数器组件示例：
```javascript
function Counter() {
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <h1 style={{ color: "blue"}}>Count: {count}</h1>
      <button className='btn' onClick={() => setCount(count + 1)}>+</button>
      <button className='btn' onClick={() => setCount(count - 1)}>-</button>
    </div>
  );
}

function App() {
  return <Counter />;
}

ReactDOM.render(<App />, document.getElementById('root'));
```

---

### **4. 总结与收获**
通过这次实现，我深入理解了 React 的核心原理，包括虚拟 DOM、状态管理、组件化开发等。以下是我的几点收获：
1. **虚拟 DOM 的优势**：通过虚拟 DOM，可以减少直接操作真实 DOM 的开销，提升性能。
2. **状态管理的实现**：状态管理的核心在于如何高效地更新状态并触发重新渲染。
3. **组件化开发的意义**：组件化开发可以提高代码的复用性和可维护性。

如果你也对 React 的底层原理感兴趣，不妨尝试从零实现一个简化版的 React。相信你会有很多收获！

---

**GitHub 源码**：[Mini React 实现](https://github.com/Muliminty/demo/blob/main/single-file/mini-react.html)  

希望这篇博客对你有所帮助！如果你有任何问题或建议，欢迎在评论区留言讨论。