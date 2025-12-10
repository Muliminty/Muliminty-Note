# 组件（Components）

> 组件是 React 的构建块，就像搭积木一样，用小的组件组合成大的应用。

---

## 1. 一句话概括主题

组件是 React 中可复用的代码块，就像乐高积木一样，你可以用小的组件组合成复杂的用户界面。

---

## 2. 它是什么

想象你要建一个房子，你不会从一块砖开始，而是会用"门"、"窗"、"墙"这些已经做好的部件。React 组件就是这样的"部件"。

比如，你要做一个网站，你可以有：
- `Header` 组件（头部）
- `Sidebar` 组件（侧边栏）
- `Button` 组件（按钮）
- `Card` 组件（卡片）

然后把这些组件组合起来，就变成了一个完整的页面。

**简单理解**：组件 = 可复用的 UI 代码块，就像函数一样，可以重复使用。

---

## 3. 能解决什么问题 + 为什么重要

### 解决的问题

1. **代码复用**：写一次，用很多次，不用重复写代码
2. **易于维护**：修改一个组件，所有用到的地方都更新
3. **结构清晰**：把复杂的界面拆分成小的组件，更容易理解
4. **团队协作**：不同的人可以负责不同的组件

### 为什么重要

- **React 的核心**：React 就是基于组件的，没有组件就没有 React
- **现代前端开发的基础**：几乎所有现代前端框架都使用组件化
- **提高开发效率**：组件化让开发更快、更高效

---

## 4. 核心知识点拆解

### 4.1 函数组件 vs 类组件

#### 函数组件（推荐）

```jsx
// 函数组件：就是一个返回 JSX 的函数
function Welcome() {
  return <h1>欢迎！</h1>;
}
```

**特点**：
- 写法简单
- 性能更好
- React 官方推荐
- 配合 Hooks 使用（详见 [[useState Hook|useState]]）

#### 类组件（旧方式）

```jsx
// 类组件：使用 class 定义
class Welcome extends React.Component {
  render() {
    return <h1>欢迎！</h1>;
  }
}
```

**特点**：
- 可以使用生命周期方法
- 可以使用 state（状态）
- 现在不推荐使用，函数组件 + Hooks 更好

**建议**：新项目都用函数组件，除非有特殊需求。

### 4.2 组件组合

组件可以嵌套使用，就像俄罗斯套娃：

```jsx
// 小组件：按钮
function Button({ text }) {
  return <button>{text}</button>;
}

// 中组件：卡片
function Card({ title, content }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{content}</p>
      <Button text="点击我" />
    </div>
  );
}

// 大组件：页面
function App() {
  return (
    <div>
      <Card title="标题1" content="内容1" />
      <Card title="标题2" content="内容2" />
    </div>
  );
}
```

### 4.3 组件复用

同一个组件可以在不同地方使用：

```jsx
// 定义一个按钮组件
function MyButton({ text, onClick }) {
  return <button onClick={onClick}>{text}</button>;
}

// 在多个地方使用
function App() {
  return (
    <div>
      <MyButton text="登录" onClick={() => alert('登录')} />
      <MyButton text="注册" onClick={() => alert('注册')} />
      <MyButton text="退出" onClick={() => alert('退出')} />
    </div>
  );
}
```

### 4.4 组件命名规范

1. **首字母大写**：组件名必须首字母大写
   ```jsx
   // ✅ 正确
   function MyButton() { }
   
   // ❌ 错误
   function myButton() { }
   ```

2. **使用 PascalCase**：多个单词用大写字母分隔
   ```jsx
   // ✅ 正确
   function UserProfile() { }
   function TodoListItem() { }
   
   // ❌ 错误
   function userProfile() { }
   function todo-list-item() { }
   ```

### 4.5 组件文件组织

**推荐的文件结构**：

```
components/
├── Button/
│   ├── Button.jsx
│   └── Button.css
├── Card/
│   ├── Card.jsx
│   └── Card.css
└── Header/
    ├── Header.jsx
    └── Header.css
```

**或者简单的方式**：

```
components/
├── Button.jsx
├── Card.jsx
└── Header.jsx
```

---

## 5. 示例代码（可运行 + 逐行注释）

### 示例 1：基础组件组合

```jsx
// 导入 React
import React from 'react';

// 定义一个小组件：头像
function Avatar({ name, imageUrl }) {
  return (
    <div className="avatar">
      <img src={imageUrl} alt={name} />
      <span>{name}</span>
    </div>
  );
}

// 定义一个中组件：用户卡片
function UserCard({ user }) {
  return (
    <div className="user-card">
      {/* 使用 Avatar 组件 */}
      <Avatar name={user.name} imageUrl={user.avatar} />
      <p>邮箱：{user.email}</p>
      <p>城市：{user.city}</p>
    </div>
  );
}

// 定义主组件：用户列表
function UserList() {
  // 用户数据
  const users = [
    { 
      name: '小明', 
      email: 'xiaoming@example.com', 
      city: '北京',
      avatar: 'https://example.com/avatar1.jpg'
    },
    { 
      name: '小红', 
      email: 'xiaohong@example.com', 
      city: '上海',
      avatar: 'https://example.com/avatar2.jpg'
    }
  ];
  
  return (
    <div className="user-list">
      <h1>用户列表</h1>
      {/* 使用 map 渲染多个 UserCard 组件 */}
      {users.map(user => (
        <UserCard key={user.email} user={user} />
      ))}
    </div>
  );
}

// 导出主组件
export default UserList;
```

### 示例 2：可复用的按钮组件

```jsx
// 定义一个可复用的按钮组件
function Button({ 
  text,        // 按钮文字
  onClick,     // 点击事件
  variant = 'primary',  // 按钮样式（默认 primary）
  disabled = false       // 是否禁用（默认 false）
}) {
  // 根据 variant 决定样式类名
  const className = `btn btn-${variant}`;
  
  return (
    <button 
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

// 使用按钮组件
function App() {
  const handleClick = () => {
    alert('按钮被点击了！');
  };
  
  return (
    <div>
      {/* 主要按钮 */}
      <Button 
        text="提交" 
        onClick={handleClick}
        variant="primary"
      />
      
      {/* 次要按钮 */}
      <Button 
        text="取消" 
        onClick={() => console.log('取消')}
        variant="secondary"
      />
      
      {/* 禁用按钮 */}
      <Button 
        text="禁用按钮" 
        onClick={handleClick}
        disabled={true}
      />
    </div>
  );
}

export default App;
```

---

## 6. 常见错误与踩坑

### 错误 1：组件名没有首字母大写

```jsx
// ❌ 错误：React 会把它当作普通 HTML 标签
function button() {
  return <button>点击</button>;
}

// ✅ 正确：首字母大写
function Button() {
  return <button>点击</button>;
}
```

**为什么错**：React 用小写字母开头的当作 HTML 标签，大写字母开头的才是组件。

### 错误 2：在组件中直接修改 props

```jsx
// ❌ 错误：不能直接修改 props
function UserCard({ user }) {
  user.name = "新名字";  // 错误！
  return <div>{user.name}</div>;
}

// ✅ 正确：props 是只读的
function UserCard({ user }) {
  return <div>{user.name}</div>;
}
```

**为什么错**：props 是只读的，就像函数的参数一样，不能修改。要修改数据，需要使用 [[State（状态）|State]]。

### 错误 3：忘记导出组件

```jsx
// ❌ 错误：没有导出，其他文件无法使用
function MyComponent() {
  return <div>内容</div>;
}

// ✅ 正确：导出组件
function MyComponent() {
  return <div>内容</div>;
}
export default MyComponent;

// 或者
export default function MyComponent() {
  return <div>内容</div>;
}
```

**为什么错**：没有导出，其他文件就无法导入使用这个组件。

### 错误 4：组件返回多个根元素（React 16 之前）

```jsx
// ❌ 错误：React 16 之前不支持多个根元素
function App() {
  return (
    <h1>标题</h1>
    <p>内容</p>
  );
}

// ✅ 正确：用一个 div 包裹
function App() {
  return (
    <div>
      <h1>标题</h1>
      <p>内容</p>
    </div>
  );
}

// ✅ 或者使用 Fragment（React 16+）
function App() {
  return (
    <>
      <h1>标题</h1>
      <p>内容</p>
    </>
  );
}
```

---

## 7. 实际应用场景

### 场景 1：电商网站

```jsx
// 商品卡片组件
function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>¥{product.price}</p>
      <Button text="加入购物车" />
    </div>
  );
}

// 商品列表
function ProductList({ products }) {
  return (
    <div className="product-list">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### 场景 2：博客系统

```jsx
// 文章卡片
function ArticleCard({ article }) {
  return (
    <div className="article-card">
      <h2>{article.title}</h2>
      <p>{article.summary}</p>
      <span>{article.date}</span>
    </div>
  );
}

// 文章列表
function ArticleList({ articles }) {
  return (
    <div>
      {articles.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
```

### 场景 3：表单组件

```jsx
// 输入框组件
function Input({ label, value, onChange, type = 'text' }) {
  return (
    <div className="input-group">
      <label>{label}</label>
      <input 
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

// 登录表单
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  return (
    <form>
      <Input 
        label="邮箱"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
      />
      <Input 
        label="密码"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
      />
      <Button text="登录" />
    </form>
  );
}
```

---

## 8. 给新手的练习题（可立即实践）

### 基础题：创建一个个人名片组件

**要求**：
1. 创建一个 `BusinessCard` 组件
2. 显示姓名、职位、公司、邮箱
3. 使用合适的 HTML 标签

**参考代码**：
```jsx
function BusinessCard() {
  return (
    <div className="business-card">
      <h2>你的名字</h2>
      <p>职位：前端工程师</p>
      <p>公司：XX 公司</p>
      <p>邮箱：your@email.com</p>
    </div>
  );
}
```

### 进阶题：创建可复用的卡片组件

**要求**：
1. 创建一个通用的 `Card` 组件
2. 可以显示标题、内容、图片
3. 可以在多个地方使用，显示不同的内容

**提示**：
- 使用 props 传递数据
- 考虑哪些是必需的，哪些是可选的

---

## 9. 用更简单的话再总结一遍（方便复习）

**组件是什么**：
- 就是可复用的代码块
- 就像乐高积木，可以组合使用

**核心要点**：
1. 组件名首字母必须大写
2. 函数组件就是返回 JSX 的函数
3. 组件可以嵌套使用
4. props 是只读的，不能修改
5. 记得导出组件，才能在其他地方使用

**记住**：
- 组件 = 可复用的 UI 代码块
- 小的组件组合成大的应用
- 写一次，用很多次

---

## 10. 知识体系延伸 & 继续学习方向

### 相关知识点

- [[JSX 语法|JSX 语法]] - 组件用 JSX 写
- [[Props（属性）|Props]] - 组件之间传递数据
- [[State（状态）|State]] - 组件内部的数据
- [[事件处理|事件处理]] - 组件中的用户交互
- [[组件组合|组件组合]] - 如何组合组件

### 继续学习方向

1. **Props 详解**：学习如何给组件传递数据
2. **State 管理**：学习组件内部的数据管理
3. **事件处理**：学习如何处理用户交互
4. **组件设计模式**：学习如何设计好的组件

---

**最后更新**：2025

#react #组件 #前端框架 #基础入门

