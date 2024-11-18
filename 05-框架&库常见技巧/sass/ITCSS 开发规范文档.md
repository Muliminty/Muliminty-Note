## ITCSS 开发规范文档

### 1. 目录结构

在 `src/styles` 目录下，按照 ITCSS 的层次结构组织样式文件：

```
src/
├── styles/
│   ├── _settings.scss       // 全局变量和常量
│   ├── _tools.scss          // Mixins 和函数
│   ├── _generic.scss        // 全局重置和标准化样式
│   ├── _elements.scss       // 基础 HTML 元素样式
│   ├── _objects.scss        // 布局对象和通用组件样式
│   ├── _components.scss     // 具体组件样式
│   ├── _trumps.scss         // 高特异性样式
│   └── main.scss            // 汇总所有样式
├── components/
│   ├── Button/
│   │   ├── Button.jsx        // Button 组件逻辑
│   │   ├── Button.module.scss // Button 组件模块样式
│   ├── Card/
│   │   ├── Card.jsx          // Card 组件逻辑
│   │   ├── Card.module.scss // Card 组件模块样式
├── App.jsx                   // 主应用组件
└── index.jsx                 // 应用入口文件
```

### 2. 文件内容和规范

#### 2.1 **Settings**

定义全局变量、常量和基础设置。

```scss
// src/styles/_settings.scss
$primary-color: #007bff;
$font-family: Arial, sans-serif;
$base-font-size: 16px;
$border-radius: 4px;
```

#### 2.2 **Tools**

定义 SCSS mixins 和函数。

```scss
// src/styles/_tools.scss
@mixin border-radius($radius) {
  border-radius: $radius;
}

@function rem($px) {
  @return $px / $base-font-size * 1rem;
}
```

#### 2.3 **Generic**

全局重置和标准化样式。

```scss
// src/styles/_generic.scss
html, body {
  margin: 0;
  padding: 0;
  font-family: $font-family;
  font-size: $base-font-size;
}

* {
  box-sizing: border-box;
}
```

#### 2.4 **Elements**

基础 HTML 元素样式。

```scss
// src/styles/_elements.scss
h1 {
  font-size: rem(32px);
  margin-bottom: rem(16px);
}

p {
  margin-bottom: rem(16px);
}
```

#### 2.5 **Objects**

布局对象和通用样式。

```scss
// src/styles/_objects.scss
.container {
  width: 80%;
  margin: 0 auto;
  padding: rem(20px);
}

.media {
  display: flex;
  align-items: center;
}

.media__image {
  margin-right: rem(16px);
}
```

#### 2.6 **Components**

具体组件的样式。

```scss
// src/styles/_components.scss
.button {
  background-color: $primary-color;
  color: #fff;
  padding: rem(10px) rem(20px);
  border: none;
  border-radius: $border-radius;
  cursor: pointer;

  &:hover {
    background-color: darken($primary-color, 10%);
  }
}

.card {
  border: 1px solid #ddd;
  border-radius: $border-radius;
  padding: rem(16px);
  background-color: #fff;
}
```

#### 2.7 **Trumps**

高特异性样式，例如布局调整和隐藏元素。

```scss
// src/styles/_trumps.scss
.hidden {
  display: none !important;
}

.clearfix::after {
  content: "";
  display: table;
  clear: both;
}
```

#### 2.8 **Main**

汇总所有 ITCSS 层次样式。

```scss
// src/styles/main.scss
@import './settings';
@import './tools';
@import './generic';
@import './elements';
@import './objects';
@import './components';
@import './trumps';
```

### 3. 组件样式

- 每个组件应有独立的模块化样式文件。
- 使用 `*.module.scss` 文件来实现 CSS Modules，以避免样式冲突。

**Button 组件示例：**

```scss
// src/components/Button/Button.module.scss
@import '../../styles/_components.scss';

.button {
  @extend .button;
}
```

```jsx
// src/components/Button/Button.jsx
import React from 'react';
import styles from './Button.module.scss';

const Button = ({ children }) => (
  <button className={styles.button}>{children}</button>
);

export default Button;
```

**Card 组件示例：**

```scss
// src/components/Card/Card.module.scss
@import '../../styles/_components.scss';

.card {
  @extend .card;
}
```

```jsx
// src/components/Card/Card.jsx
import React from 'react';
import styles from './Card.module.scss';

const Card = ({ children }) => (
  <div className={styles.card}>{children}</div>
);

export default Card;
```

### 4. 开发和维护实践

- **样式文件命名**：遵循一致的命名规范，确保文件名和类名具有描述性。
- **注释**：在样式文件中添加必要的注释，解释复杂的样式规则和使用场景。
- **定期审查**：定期审查和优化样式代码，确保符合 ITCSS 层次结构，避免样式冲突和冗余。
- **工具使用**：使用 `stylelint` 等工具来保持样式一致性和质量。
- **文档化**：为样式文件和组件样式添加文档，以便团队成员理解和使用。

### 5. 示例

**应用入口文件：**

```jsx
// src/index.jsx
import './styles/main.scss'; // 导入所有 ITCSS 层次样式

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));
```

通过遵循以上规范，你可以在 Vite + React 项目中有效实施 ITCSS，确保样式的高效管理和维护。