### **React-Live 使用笔记**

#### **概述**
`react-live` 是一个强大的库，允许在 React 应用中嵌入实时、交互式的代码编辑器。它适用于创建代码演示、实时预览和学习工具，支持动态渲染用户输入的 React 代码。

---

#### **安装**
使用 npm 安装 `react-live`：

```bash
npm install react-live
```

---

#### **核心组件**

- **`LiveProvider`**：核心组件，管理代码状态和实时执行。
  - 属性：
    - `code`: 初始代码内容。
    - `scope`: 提供自定义组件或库给编辑器使用。
    - `transformCode`: 自定义代码转换逻辑。

- **`LiveEditor`**：代码编辑器，允许用户动态编辑代码。
- **`LivePreview`**：实时展示编辑器中代码的渲染结果。
- **`LiveError`**：展示代码中的错误信息。

---

#### **基本用法**

以下是一个包含代码编辑器、实时预览和错误提示的示例：

```javascript
import React from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';

const App = () => {
  const code = `
    <div>
      <h1>Hello, React Live!</h1>
      <p>This is an interactive React code editor.</p>
    </div>
  `;

  return (
    <LiveProvider code={code}>
      <div style={{ display: 'flex', gap: '10px' }}>
        <LiveEditor style={{ flex: 1, border: '1px solid #ddd', padding: '10px' }} />
        <div style={{ flex: 1, padding: '10px' }}>
          <h2>Preview:</h2>
          <LivePreview />
          <LiveError />
        </div>
      </div>
    </LiveProvider>
  );
};

export default App;
```

---

#### **高级用法**

##### 1. **支持自定义组件**
通过 `scope` 属性向编辑器提供自定义组件或函数：

```javascript
import React from 'react';
import { LiveProvider, LiveEditor, LivePreview } from 'react-live';

// 自定义组件
const CustomComponent = () => <div style={{ color: 'blue' }}>This is a custom component!</div>;

const App = () => {
  const code = `<CustomComponent />`;

  return (
    <LiveProvider code={code} scope={{ CustomComponent }}>
      <LiveEditor />
      <LivePreview />
    </LiveProvider>
  );
};

export default App;
```

---

##### 2. **自定义样式**
通过 `style` 属性调整编辑器和预览区域的外观：

```javascript
<LiveProvider code={code}>
  <div style={{ display: 'flex', gap: '20px' }}>
    <LiveEditor
      style={{
        flex: 1,
        border: '1px solid #ccc',
        fontSize: '16px',
        backgroundColor: '#f0f0f0',
      }}
    />
    <LivePreview
      style={{
        flex: 1,
        padding: '10px',
        border: '1px solid #ccc',
        backgroundColor: '#fafafa',
      }}
    />
  </div>
</LiveProvider>
```

---

##### 3. **配置编译器**
`react-live` 使用 `babel` 编译代码，可以通过 `transformCode` 属性自定义代码转换逻辑，支持 JSX、TypeScript 等语法。

```javascript
import React from 'react';
import { LiveProvider, LiveEditor, LivePreview } from 'react-live';
import { babel } from 'react-live';

const App = () => {
  const code = `
    const greeting = 'Hello, React Live!';
    <div>{greeting}</div>
  `;

  return (
    <LiveProvider code={code} transformCode={babel}>
      <LiveEditor />
      <LivePreview />
    </LiveProvider>
  );
};

export default App;
```

---

#### **错误处理**
使用 `LiveError` 显示编辑器中的代码错误：

```javascript
<LiveProvider code={code}>
  <LiveEditor />
  <LivePreview />
  <LiveError style={{ color: 'red', marginTop: '10px' }} />
</LiveProvider>
```

---

#### **总结**

`react-live` 的核心功能：
- 实现代码编辑器的实时预览。
- 支持自定义组件、样式和编译配置。
- 提供错误提示，便于调试和教学。

适用场景：
- 创建实时交互式代码编辑工具。
- 搭建学习和演示平台。
- 构建代码沙盒和快速原型开发工具。