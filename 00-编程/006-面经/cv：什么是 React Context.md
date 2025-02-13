# React Context 面试题解析：深入理解与应用指南

---

#### **1. 什么是 React Context？**
**答案**  
React Context 是 React 提供的一种组件间数据传递机制，用于解决跨层级组件的“prop drilling”（属性透传）问题。它允许数据在组件树中自上而下传递，无需手动逐层传递 props。

**核心组成**：
- **`createContext`**：创建 Context 对象，包含 `Provider` 和 `Consumer`。
- **`Provider`**：提供数据的组件，通过 `value` 属性传递数据。
- **`Consumer`** 或 **`useContext` Hook**：消费数据的组件或方式。

---

#### **2. 为什么需要 React Context？**
**答案**  
当多个层级的组件需要共享某些全局数据（如主题、用户信息、语言偏好）时，使用 props 逐层传递会导致代码冗余且难以维护。Context 通过集中管理数据，实现跨层级组件的高效通信。

---

#### **3. 如何使用 React Context？**
**步骤示例**：
```javascript
// 1. 创建 Context
const ThemeContext = React.createContext('light');

// 2. 提供数据（Provider）
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}

// 3. 消费数据（Consumer 或 useContext）
function Toolbar() {
  const theme = useContext(ThemeContext);
  return <div style={{ background: theme === 'dark' ? '#333' : '#FFF' }}>当前主题：{theme}</div>;
}
```

---

#### **4. React Context 的优缺点**
**优点**：
- 解决跨层级组件通信问题。
- 简化全局状态管理（如主题、用户信息）。
- 减少不必要的 props 传递，代码更清晰。

**缺点**：
- **过度渲染问题**：Provider 的 `value` 变化会导致所有 Consumer 重新渲染，即使依赖的数据未变化。
- 不适合高频更新的场景（如动画）。
- 复杂状态逻辑仍需结合其他状态管理工具（如 Redux）。

---

#### **5. Context 与 Redux 的区别**
| **特性**       | **React Context**               | **Redux**                     |
|----------------|----------------------------------|-------------------------------|
| **用途**       | 解决组件间共享数据               | 复杂状态管理、中间件支持       |
| **性能**       | 可能引发过度渲染                 | 通过 Selector 优化渲染         |
| **调试工具**   | 无内置工具                       | Redux DevTools 强大支持        |
| **适用场景**   | 低频更新数据（如主题、用户信息） | 高频更新、复杂业务逻辑         |

---

#### **6. 如何避免 Context 引起的性能问题？**
- **拆分 Context**：按功能将数据拆分到多个 Context，减少单个 Context 变化的影响范围。
- **使用 `useMemo`/`memo`**：缓存 Provider 的 `value` 或子组件。
  ```javascript
  function App() {
    const [user, setUser] = useState(null);
    const value = useMemo(() => ({ user, setUser }), [user]);
    return <UserContext.Provider value={value}>...</UserContext.Provider>;
  }
  ```
- **避免直接传递对象字面量**：防止每次渲染生成新对象，触发不必要的更新。

---

#### **7. 实际应用场景**
- **主题切换**：全局管理 UI 主题（亮色/暗色）。
- **多语言支持**：动态切换应用语言。
- **用户认证**：共享用户登录状态及权限。
- **全局配置**：如 API 端点、功能开关。

---

#### **8. 常见问题与解决方案**
**Q1：Context 的默认值何时生效？**  
当组件没有匹配到 Provider 时，默认值生效。若存在 Provider 但未传 `value`，默认值为 `undefined`。

**Q2：多个 Context 如何嵌套使用？**  
通过多个 Provider 包裹组件树：
```javascript
<UserContext.Provider value={user}>
  <ThemeContext.Provider value={theme}>
    <App />
  </ThemeContext.Provider>
</UserContext.Provider>
```

**Q3：Class 组件如何消费 Context？**  
通过 `static contextType` 或 `Consumer`：
```javascript
class MyComponent extends React.Component {
  static contextType = ThemeContext;
  render() {
    const theme = this.context;
    return <div>{theme}</div>;
  }
}
```

---

#### **总结**
React Context 是解决组件跨层级通信的利器，尤其适合低频更新的全局数据。但在高频更新或复杂场景下，需结合性能优化手段或选择 Redux 等状态管理工具。理解其原理和适用场景，能显著提升代码质量和开发效率。