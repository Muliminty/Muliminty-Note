# html-react-parser

`html-react-parser` 是一个用于解析 HTML 字符串并将其转换为 React 组件的库。它提供了灵活的 API，可以处理各种 HTML 标记和属性，并将它们转换为相应的 React 元素。

下面是一个详细的 `html-react-parser` 使用教程：

1. 安装依赖：

```shell
npm install html-react-parser
```

2. 导入所需模块：

```jsx
import React from 'react';
import parse from 'html-react-parser';
```

3. 解析 HTML 字符串：

```jsx
const html = '<div><h1>Title</h1><p>Paragraph</p></div>';

const parsedHtml = parse(html);
```

在上述代码中，我们传递一个 HTML 字符串给 `parse` 函数，并将返回的结果存储在 `parsedHtml` 变量中。`parsedHtml` 将是一个 React 组件，表示解析后的 HTML 内容。

4. 渲染解析后的内容：

```jsx
function MyComponent() {
  return <div>{parsedHtml}</div>;
}
```

在组件的 JSX 中，您可以直接使用 `parsedHtml` 变量，将解析后的 HTML 内容渲染到页面上。

除了基本的用法外，`html-react-parser` 还提供了一些高级功能，例如：

- 自定义节点处理：您可以通过传递一个回调函数作为第二个参数来自定义节点处理方式。这个回调函数接收一个对象参数，包含当前节点的类型和属性信息。

```jsx
const options = {
  replace: (domNode) => {
    if (domNode.type === 'tag' && domNode.name === 'p') {
      return <span>{domNode.children}</span>;
    }
  },
};

const parsedHtml = parse(html, options);
```

- 过滤非允许的标签：您可以使用 `html-react-parser` 提供的 `isValidNode` 函数来过滤非允许的标签，以增加安全性。

```jsx
import { isValidNode } from 'html-react-parser';

const options = {
  isValidNode: (domNode) => {
    return domNode.type !== 'script'; // 过滤掉 <script> 标签
  },
};

const parsedHtml = parse(html, options);
```

这只是 `html-react-parser` 的一些基本用法和高级功能示例。您可以参考官方文档（<https://www.npmjs.com/package/html-react-parser）获取更多详细信息和示例代码。>

希望这个教程对您有所帮助！如果您还有其他问题，请随时提问。

---

如果您想将 `img` 标签替换为 Ant Design 的 `Image` 组件，可以按照以下步骤操作：

1. 导入 Ant Design 的 `Image` 组件：

```jsx
import { Image } from 'antd';
```

2. 设置 `html-react-parser` 的 `replace` 配置项来自定义节点处理方式：

```jsx
const options = {
  replace: (node) => {
    if (node.name === 'img') {
      return (
        <Image
          src={node.attribs.src}
          alt={node.attribs.alt}
          preview={false} // 禁用预览功能
        />
      );
    }
  },
};

const parsedHtml = parse(html, options);
```

在上述代码中，我们通过传递一个回调函数给 `replace` 配置项，来自定义节点处理方式。当解析到 `img` 标签时，我们将其替换为 Ant Design 的 `Image` 组件，并传递 `src` 和 `alt` 属性作为 `Image` 组件的 props。我们还禁用了 `Image` 组件的预览功能，以避免用户在点击图片时打开大图预览。

3. 渲染解析后的内容：

```jsx
function MyComponent() {
  return <div>{parsedHtml}</div>;
}
```

在组件的 JSX 中，您可以直接使用 `parsedHtml` 变量，将解析后的 HTML 内容渲染到页面上。

这样就完成了将 `img` 标签替换为 Ant Design 的 `Image` 组件的过程。希望这可以帮助到您！
