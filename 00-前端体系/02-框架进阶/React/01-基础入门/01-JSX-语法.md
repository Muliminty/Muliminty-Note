# JSX 语法

> JSX 是 React 的声明式语法，让你可以用类似 HTML 的方式写 JavaScript 代码。

---

## 1. 一句话概括主题

JSX 是 JavaScript 的扩展语法，让你可以在 JavaScript 代码中写类似 HTML 的标记，React 会把它转换成真正的 JavaScript 代码。

---

## 2. 它是什么（像和朋友聊天一样解释）

想象一下，你要在 JavaScript 里写一个按钮，以前你可能要这样写：

```javascript
const button = document.createElement('button');
button.textContent = '点击我';
button.className = 'my-button';
```

这样写很麻烦，而且不够直观。JSX 就像给你一个"魔法笔"，让你可以直接这样写：

```jsx
const button = <button className="my-button">点击我</button>
```

是不是看起来就像 HTML？但它是 JavaScript！React 会自动帮你转换成上面的那种写法。

**简单理解**：JSX = JavaScript + XML（类似 HTML 的标记语言），让你用写 HTML 的方式写 JavaScript。

---

## 3. 能解决什么问题 + 为什么重要

### 解决的问题

1. **代码更直观**：用类似 HTML 的方式写界面，一眼就能看出结构
2. **减少错误**：不需要手动创建 DOM 元素，React 帮你处理
3. **提高效率**：写起来更快，维护起来更容易

### 为什么重要

- **React 的核心**：没有 JSX，React 就失去了最大的优势
- **开发体验**：让前端开发从"命令式"（告诉浏览器怎么做）变成"声明式"（告诉浏览器要什么）
- **团队协作**：代码更容易理解和维护

---

## 4. 核心知识点拆解

### 4.1 JSX 语法规则

#### 基本规则

1. **必须有一个根元素**
   ```jsx
   // ❌ 错误：多个根元素
   return (
     <h1>标题</h1>
     <p>内容</p>
   )
   
   // ✅ 正确：一个根元素
   return (
     <div>
       <h1>标题</h1>
       <p>内容</p>
     </div>
   )
   ```

2. **标签必须闭合**
   ```jsx
   // ❌ 错误：标签未闭合
   <img src="photo.jpg">
   
   // ✅ 正确：自闭合标签
   <img src="photo.jpg" />
   ```

3. **使用 className 而不是 class**
   ```jsx
   // ❌ 错误：class 是 JavaScript 的保留字
   <div class="container">
   
   // ✅ 正确：使用 className
   <div className="container">
   ```

### 4.2 JSX 表达式

你可以在 JSX 中使用 `{}` 来插入 JavaScript 表达式：

```jsx
const name = "小明";
const age = 18;

// 在 JSX 中使用变量
<div>
  <p>姓名：{name}</p>
  <p>年龄：{age}</p>
</div>
```

**可以放什么**：
- 变量：`{name}`
- 计算：`{1 + 1}`、`{age * 2}`
- 函数调用：`{getName()}`
- 数组：`{items.map(...)}`

**不能放什么**：
- if/else 语句（但可以用三元运算符）
- for 循环（但可以用 map）
- 对象（但可以放对象的属性）

### 4.3 JSX 属性

#### 字符串属性

```jsx
// 字符串用引号
<img src="photo.jpg" alt="照片" />
```

#### 表达式属性

```jsx
const url = "photo.jpg";
const isActive = true;

// 表达式用大括号
<img src={url} />
<button disabled={!isActive}>按钮</button>
```

#### 布尔属性

```jsx
// disabled={true} 可以简写为 disabled
<button disabled>按钮</button>
// 等同于
<button disabled={true}>按钮</button>
```

### 4.4 JSX 条件渲染

#### 方法一：三元运算符

```jsx
const isLoggedIn = true;

return (
  <div>
    {isLoggedIn ? <p>欢迎回来！</p> : <p>请先登录</p>}
  </div>
);
```

#### 方法二：逻辑与运算符

```jsx
const hasMessages = true;

return (
  <div>
    {hasMessages && <p>你有新消息</p>}
  </div>
);
```

#### 方法三：if/else 语句（在函数中）

```jsx
function Greeting({ isLoggedIn }) {
  if (isLoggedIn) {
    return <p>欢迎回来！</p>;
  }
  return <p>请先登录</p>;
}
```

### 4.5 JSX 列表渲染

使用 `map` 方法渲染列表：

```jsx
const items = ['苹果', '香蕉', '橙子'];

return (
  <ul>
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);
```

**重要**：必须给每个列表项添加 `key` 属性，帮助 React 识别哪些项改变了。详见 [[列表渲染-Key的使用|列表渲染 Key 的使用]]。

---

## 5. 示例代码（可运行 + 逐行注释）

### 示例 1：基础 JSX 组件

```jsx
// 导入 React（React 18+ 可以省略）
import React from 'react';

// 定义一个函数组件
function Welcome() {
  // 定义变量
  const userName = "小明";
  const currentTime = new Date().toLocaleTimeString();
  
  // 返回 JSX
  return (
    <div className="welcome-container">
      {/* 这是 JSX 注释，用 {/* */} 包裹 */}
      <h1>欢迎，{userName}！</h1>
      <p>当前时间：{currentTime}</p>
      <button onClick={() => alert('你好！')}>
        点击我
      </button>
    </div>
  );
}

// 导出组件
export default Welcome;
```

### 示例 2：条件渲染和列表渲染

```jsx
function TodoList() {
  // 定义待办事项列表
  const todos = [
    { id: 1, text: '学习 React', completed: true },
    { id: 2, text: '写代码', completed: false },
    { id: 3, text: '运动', completed: false }
  ];
  
  // 计算未完成的数量
  const uncompletedCount = todos.filter(todo => !todo.completed).length;
  
  return (
    <div className="todo-list">
      {/* 条件渲染：显示未完成数量 */}
      {uncompletedCount > 0 ? (
        <p>还有 {uncompletedCount} 个任务未完成</p>
      ) : (
        <p>🎉 所有任务都完成了！</p>
      )}
      
      {/* 列表渲染：显示所有待办事项 */}
      <ul>
        {todos.map(todo => (
          <li 
            key={todo.id}  // 必须的 key 属性
            style={{
              textDecoration: todo.completed ? 'line-through' : 'none'
            }}
          >
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
```

---

## 6. 常见错误与踩坑

### 错误 1：忘记闭合标签

```jsx
// ❌ 错误
<img src="photo.jpg">

// ✅ 正确
<img src="photo.jpg" />
```

**为什么错**：JSX 要求所有标签都必须闭合，即使是自闭合标签也要用 `/>`。

### 错误 2：在 JSX 中直接写对象

```jsx
// ❌ 错误：不能直接渲染对象
const user = { name: '小明', age: 18 };
return <p>{user}</p>  // 会报错！

// ✅ 正确：渲染对象的属性
return <p>{user.name}，{user.age}岁</p>
```

**为什么错**：React 不知道如何渲染一个对象，只能渲染基本类型（字符串、数字等）。

### 错误 3：忘记给列表项添加 key

```jsx
// ❌ 错误：没有 key
{items.map(item => <li>{item}</li>)}

// ✅ 正确：有 key
{items.map((item, index) => <li key={index}>{item}</li>)}
```

**为什么错**：没有 key 时，React 无法高效地更新列表，可能导致性能问题和渲染错误。

### 错误 4：在 JSX 中使用 class 而不是 className

```jsx
// ❌ 错误：class 是 JavaScript 的保留字
<div class="container">

// ✅ 正确：使用 className
<div className="container">
```

**为什么错**：`class` 是 JavaScript 的保留字，不能用作属性名。

---

## 7. 实际应用场景

### 场景 1：用户界面组件

```jsx
// 用户卡片组件
function UserCard({ user }) {
  return (
    <div className="user-card">
      <img src={user.avatar} alt={user.name} />
      <h3>{user.name}</h3>
      <p>{user.bio}</p>
      {user.isVip && <span className="vip-badge">VIP</span>}
    </div>
  );
}
```

### 场景 2：动态表单

```jsx
// 动态表单组件
function DynamicForm({ fields }) {
  return (
    <form>
      {fields.map(field => (
        <div key={field.id}>
          <label>{field.label}</label>
          <input 
            type={field.type} 
            placeholder={field.placeholder}
          />
        </div>
      ))}
      <button type="submit">提交</button>
    </form>
  );
}
```

### 场景 3：条件显示内容

```jsx
// 根据登录状态显示不同内容
function App({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? (
        <Dashboard />
      ) : (
        <LoginForm />
      )}
    </div>
  );
}
```

---

## 8. 给新手的练习题（可立即实践）

### 基础题：创建一个个人信息卡片

**要求**：
1. 显示姓名、年龄、城市
2. 如果年龄大于 18，显示"成年人"，否则显示"未成年人"
3. 使用 JSX 语法

**参考代码**：
```jsx
function PersonCard() {
  const name = "你的名字";
  const age = 20;  // 改成你的年龄试试
  const city = "你的城市";
  
  return (
    <div>
      <h2>{name}</h2>
      <p>年龄：{age}</p>
      <p>城市：{city}</p>
      <p>{age >= 18 ? "成年人" : "未成年人"}</p>
    </div>
  );
}
```

### 进阶题：待办事项列表

**要求**：
1. 创建一个待办事项数组
2. 使用 map 渲染列表
3. 已完成的事项显示删除线
4. 统计未完成的数量

**提示**：
- 使用 `textDecoration: 'line-through'` 显示删除线
- 使用 `filter` 方法统计未完成数量

---

## 9. 用更简单的话再总结一遍（方便复习）

**JSX 是什么**：
- 就是让你在 JavaScript 里写"类似 HTML"的代码
- React 会自动把它转换成真正的 JavaScript

**核心要点**：
1. 必须有一个根元素
2. 标签要闭合（自闭合用 `/>`）
3. 用 `{}` 插入 JavaScript 表达式
4. 用 `className` 而不是 `class`
5. 列表要用 `map`，记得加 `key`

**记住**：
- JSX = JavaScript + XML
- 看起来像 HTML，但它是 JavaScript
- React 帮你转换成真正的代码

---

## 10. 知识体系延伸 & 继续学习方向

### 相关知识点

- [[组件（Components）|组件]] - JSX 用来写组件
- [[Props（属性）|Props]] - 在 JSX 中传递属性
- [[State（状态）|State]] - 在 JSX 中使用状态
- [[条件渲染|条件渲染]] - JSX 条件渲染详解
- [[列表渲染|列表渲染]] - JSX 列表渲染详解

### 继续学习方向

1. **组件基础**：学习如何用 JSX 创建组件
2. **Props 传递**：学习如何在 JSX 中传递数据
3. **事件处理**：学习如何在 JSX 中处理用户交互
4. **状态管理**：学习如何在 JSX 中使用状态

---

**最后更新**：2025

#react #jsx #前端框架 #基础入门

