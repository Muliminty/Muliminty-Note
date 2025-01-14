## React 嵌套路由详解

在 React 项目中，嵌套路由是实现多层路由结构的核心功能。它允许开发者根据页面结构和组件层级动态渲染对应的子路由内容，使应用更具模块化和可维护性。

---

### 一、嵌套路由的基础概念

**嵌套路由**指的是在父路由中包含子路由，通过 `react-router-dom` 提供的 `<Outlet>` 组件渲染子路由的内容。其核心思想是将路由层级与组件层级对应绑定。

#### 核心组件
- **`<Routes>`**：用于定义路由列表。
- **`<Route>`**：用于定义单个路由。
- **`<Outlet>`**：父路由中用于渲染子路由内容的占位符。
- **`useNavigate`**：提供编程式导航功能。

---

### 二、嵌套路由的使用步骤

#### 1. 安装 `react-router-dom`
确保安装了 `react-router-dom` v6 或更高版本：
```bash
npm install react-router-dom
```

#### 2. 配置嵌套路由

**路由结构示例**
假设有以下页面结构：
- 父页面：`NestedRoute`
- 子页面：
  - `About`
  - `Setting`

目录结构：
```
src/
  pages/
    NestedRoute/
      index.jsx       // 父路由组件
      About.jsx       // About 子路由组件
      Setting.jsx     // Setting 子路由组件
```

#### 3. 父组件定义路由布局

**NestedRoute.jsx**
```jsx
import { Outlet, useNavigate } from 'react-router-dom';
import styles from './NestedRoute.module.scss';

const NestedRoute = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <h1>嵌套路由</h1>
            {/* 导航部分 */}
            <nav className={styles.nav}>
                <button onClick={() => navigate('/NestedRoute/about')} className={styles.navButton}>
                    About
                </button>
                <button onClick={() => navigate('/NestedRoute/setting')} className={styles.navButton}>
                    Setting
                </button>
            </nav>
            {/* 子路由内容 */}
            <Outlet />
        </div>
    );
};

export default NestedRoute;
```

#### 4. 子路由组件

**About.jsx**
```jsx
const About = () => {
    return <div>About Page</div>;
};

export default About;
```

**Setting.jsx**
```jsx
const Setting = () => {
    return <div>Setting Page</div>;
};

export default Setting;
```

#### 5. 定义路由配置

**App.jsx**
```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NestedRoute from './pages/NestedRoute';
import About from './pages/NestedRoute/About';
import Setting from './pages/NestedRoute/Setting';

const App = () => {
    return (
        <Router>
            <Routes>
                {/* 父路由 */}
                <Route path="/NestedRoute" element={<NestedRoute />}>
                    {/* 子路由 */}
                    <Route path="about" element={<About />} />
                    <Route path="setting" element={<Setting />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
```

---

### 三、动态渲染子路由内容

通过 `<Outlet>` 动态渲染子路由内容。`<Outlet>` 充当一个占位符，告诉父路由在此处渲染与当前路径匹配的子路由内容。

#### 子路由匹配的路径规则
- `/NestedRoute/about`：渲染 `About` 组件。
- `/NestedRoute/setting`：渲染 `Setting` 组件。

> 子路由的路径是相对父路由的路径，因此在定义时无需写完整路径。

---

### 四、编程式导航

React Router 提供了 `useNavigate` 钩子函数，可以在代码中实现动态路由跳转。

#### 示例
```jsx
import { useNavigate } from 'react-router-dom';

const MyComponent = () => {
    const navigate = useNavigate();

    const handleGoToAbout = () => {
        navigate('/NestedRoute/about');
    };

    return (
        <button onClick={handleGoToAbout}>
            Go to About
        </button>
    );
};
```

---

### 五、完整代码示例

以下是一个完整的嵌套路由实现代码：

#### `NestedRoute.module.scss`
```scss
.container {
    padding: 20px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 5px;
}

.nav {
    margin-bottom: 20px;
    display: flex;
    gap: 10px;
}

.navButton {
    padding: 8px 12px;
    border: none;
    background-color: #007bff;
    color: #fff;
    border-radius: 3px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.navButton:hover {
    background-color: #0056b3;
}
```

#### 路由配置文件 `App.jsx`
```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NestedRoute from './pages/NestedRoute';
import About from './pages/NestedRoute/About';
import Setting from './pages/NestedRoute/Setting';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/NestedRoute" element={<NestedRoute />}>
                    <Route path="about" element={<About />} />
                    <Route path="setting" element={<Setting />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
```

---

### 六、常见问题与解决方法

#### 1. 子路由不显示
**原因**：父组件中未使用 `<Outlet>`。
**解决**：在父组件中添加 `<Outlet>` 占位符。

#### 2. 样式未生效或布局错乱
**原因**：`<Outlet>` 容器缺少样式。
**解决**：给 `<Outlet>` 容器添加 `min-height` 或其他布局样式。

#### 3. 路由路径错误
**原因**：未正确配置子路由路径。
**解决**：确保子路由路径是相对父路由的路径。

#### 4. 子路由懒加载
使用 `React.lazy` 实现子路由懒加载：
```jsx
const About = React.lazy(() => import('./pages/NestedRoute/About'));
const Setting = React.lazy(() => import('./pages/NestedRoute/Setting'));
```

---

### 七、小结

嵌套路由是 React 中构建复杂路由系统的基础。通过合理组织父子路由和组件层级，配合 `useNavigate` 实现动态跳转，可以构建一个灵活、模块化的应用。同时，注意路由配置的正确性和组件样式的分离，提升开发效率与维护性。