### `react-highlight-words` 使用指南

`react-highlight-words` 是一个简单、功能强大的 React 组件库，用于高亮显示文本中的指定关键词。它非常适用于实现搜索结果中的关键词高亮显示。

#### 安装

首先，需要通过 npm 或 yarn 安装 `react-highlight-words`：

```sh
npm install react-highlight-words
```

或者

```sh
yarn add react-highlight-words
```

#### 基本用法

在你的 React 组件中导入并使用 `react-highlight-words`：

```jsx
import React from 'react';
import Highlighter from 'react-highlight-words';

const MyComponent = () => {
  const text = "React Highlight Words 是一个用于高亮显示文本中指定关键词的库。";
  const keywords = ["高亮显示", "文本", "关键词"];

  return (
    <Highlighter
      highlightClassName="YourHighlightClass"
      searchWords={keywords}
      autoEscape={true}
      textToHighlight={text}
    />
  );
};

export default MyComponent;
```

在这个例子中，`Highlighter` 组件会高亮显示 `text` 中包含的 `keywords`。

#### Props

`react-highlight-words` 提供了一些有用的 props 来控制其行为：

- **highlightClassName**: 为高亮的文本指定 CSS 类名。
- **highlightStyle**: 为高亮的文本指定内联样式。
- **searchWords**: 要高亮显示的关键词数组。
- **autoEscape**: 如果设置为 true，则会自动转义 `searchWords` 中的正则表达式字符（默认值为 false）。
- **textToHighlight**: 需要高亮显示关键词的文本。
- **sanitize**: 一个函数，用于对 `searchWords` 和 `textToHighlight` 进行预处理。可以用于去除特殊字符或进行其他字符串处理。
- **caseSensitive**: 如果设置为 true，则搜索时区分大小写（默认值为 false）。
- **findChunks**: 自定义查找关键词的方法，返回一个包含 start 和 end 属性的对象数组，表示每个关键词的位置。
- **activeClassName**: 在匹配关键词时指定的 CSS 类名。
- **activeIndex**: 指定高亮显示的关键词索引。

#### 自定义样式

你可以通过 `highlightClassName` 或 `highlightStyle` 自定义高亮显示的样式：

```jsx
import React from 'react';
import Highlighter from 'react-highlight-words';
import './styles.css'; // 假设你的 CSS 文件名为 styles.css

const MyComponent = () => {
  const text = "React Highlight Words 是一个用于高亮显示文本中指定关键词的库。";
  const keywords = ["高亮显示", "文本", "关键词"];

  return (
    <Highlighter
      highlightClassName="highlight"
      searchWords={keywords}
      autoEscape={true}
      textToHighlight={text}
    />
  );
};

export default MyComponent;
```

在 `styles.css` 文件中：

```css
.highlight {
  background-color: yellow;
  font-weight: bold;
}
```

或者使用内联样式：

```jsx
import React from 'react';
import Highlighter from 'react-highlight-words';

const MyComponent = () => {
  const text = "React Highlight Words 是一个用于高亮显示文本中指定关键词的库。";
  const keywords = ["高亮显示", "文本", "关键词"];

  return (
    <Highlighter
      highlightStyle={{ backgroundColor: 'yellow', fontWeight: 'bold' }}
      searchWords={keywords}
      autoEscape={true}
      textToHighlight={text}
    />
  );
};

export default MyComponent;
```

#### 使用 `sanitize` 函数

你可以使用 `sanitize` 函数对 `searchWords` 和 `textToHighlight` 进行预处理。例如，去除特殊字符：

```jsx
import React from 'react';
import Highlighter from 'react-highlight-words';

const MyComponent = () => {
  const text = "React Highlight Words 是一个用于高亮显示文本中指定关键词的库。";
  const keywords = ["高亮显示", "文本", "关键词"];

  const sanitize = (text) => text.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '');

  return (
    <Highlighter
      highlightClassName="highlight"
      searchWords={keywords}
      autoEscape={true}
      textToHighlight={text}
      sanitize={sanitize}
    />
  );
};

export default MyComponent;
```

#### 使用 `findChunks` 自定义查找方法

如果你需要自定义查找关键词的方法，可以使用 `findChunks`：

```jsx
import React from 'react';
import Highlighter from 'react-highlight-words';

const MyComponent = () => {
  const text = "React Highlight Words 是一个用于高亮显示文本中指定关键词的库。";
  const keywords = ["高亮显示", "文本", "关键词"];

  const findChunks = ({ searchWords, textToHighlight }) => {
    // 自定义查找逻辑
    const chunks = [];
    searchWords.forEach((word) => {
      let startIndex = textToHighlight.indexOf(word);
      while (startIndex !== -1) {
        chunks.push({ start: startIndex, end: startIndex + word.length });
        startIndex = textToHighlight.indexOf(word, startIndex + word.length);
      }
    });
    return chunks;
  };

  return (
    <Highlighter
      highlightClassName="highlight"
      searchWords={keywords}
      autoEscape={true}
      textToHighlight={text}
      findChunks={findChunks}
    />
  );
};

export default MyComponent;
```

#### 文本过长省略号处理

对于大段文本，可以使用 CSS 实现文本过长时的省略号处理。以下是一个完整的示例：

```jsx
import React from 'react';
import Highlighter from 'react-highlight-words';
import './styles.css'; // 假设你的 CSS 文件名为 styles.css

const MyComponent = () => {
  const text = "React Highlight Words 是一个用于高亮显示文本中指定关键词的库。" +
    "它可以帮助你轻松实现搜索结果中的关键词高亮显示，并且具有高度的灵活性。" +
    "无论是简单的单词匹配，还是复杂的正则表达式匹配，它都能胜任。" +
    "让我们来看看如何使用这个强大的库。";

  const keywords = ["高亮显示", "文本", "关键词", "库"];

  return (
    <div className="text-container">
      <Highlighter
        highlightClassName="highlight"
        searchWords={keywords}
        autoEscape={true}
        textToHighlight={text}
      />
    </div>
  );
};

export default MyComponent;
```

在 `styles.css` 文件中：

```css
.text-container {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* 显示两行，超过的部分将被省略 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}

.highlight {
  background-color: yellow;
  font-weight: bold;
}
```

#### 结论

`react-highlight-words` 是一个灵活且易于使用的 React 组件库，适用于高亮显示文本中的关键词。通过结合不同的 props 和自定义函数，你可以实现各种复杂的高亮显示需求。如果你在构建一个需要高亮显示搜索结果的应用程序，这个库无疑是一个不错的选择。通过添加 CSS 样式，可以轻松实现文本过长时的省略号处理，使你的界面更加美观和实用。
