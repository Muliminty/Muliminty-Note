
这种写法是一种常见的 React/JSX 中动态组合 CSS 类名的方式，它利用了 JavaScript 的布尔运算特性和数组的 `filter` 方法。

## 核心思路

1. 使用数组收集所有可能的类名
2. 利用布尔运算决定是否包含某个类名
3. 使用 `filter(Boolean)` 过滤掉 falsy 值（false, undefined, null 等）
4. 使用 `join(" ")` 将数组转换为空格分隔的字符串

## 示例代码

```jsx
import styles from './styles.module.css';

const DynamicClassNameDemo = ({ curPage, isApp, isWeiXin }) => {
  const classes = [
    styles.base, // 基础样式，始终应用
    curPage !== 0 && isApp && styles.app, // 仅在非首页且是App环境时应用
    curPage !== 0 && !isApp && !isWeiXin && styles.other, // 非首页、非App、非微信时应用
    curPage === 0 && styles.homePage, // 仅在首页时应用
  ].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      {/* 组件内容 */}
    </div>
  );
};

// 使用示例
<DynamicClassNameDemo 
  curPage={0} 
  isApp={false} 
  isWeiXin={false} 
/>
```

## 等价写法对比

### 传统条件拼接

```
let classes = styles.base;
if (curPage !== 0 && isApp) classes += ` ${styles.app}`;
if (curPage !== 0 && !isApp && !isWeiXin) classes += ` ${styles.other}`;
if (curPage === 0) classes += ` ${styles.homePage}`;
```

### 数组写法优势

1. ​**​更简洁​**​：避免了重复的条件判断和字符串拼接
2. ​**​更易读​**​：每个条件单独一行，逻辑清晰
3. ​**​更易维护​**​：添加或删除条件时只需增删数组元素

## 实际应用场景

这种写法特别适合以下情况：

1. 根据多个条件组合应用不同样式
2. 使用 CSS Modules 或 CSS-in-JS 时需要动态类名
3. 需要根据组件状态或属性应用不同样式

## 注意事项

1. 确保 `styles` 对象中存在对应的类名，否则会报错
2. 条件表达式应该返回类名字符串或 falsy 值
3. 对于复杂的条件逻辑，可以考虑提取为单独的函数

## 扩展用法

### 使用对象语法

```
const classes = [
  styles.base,
  {
    [styles.app]: curPage !== 0 && isApp,
    [styles.other]: curPage !== 0 && !isApp && !isWeiXin,
    [styles.homePage]: curPage === 0,
  }
].filter(Boolean).join(" ");
```

### 使用 classnames 库

```
import cn from 'classnames';

const classes = cn(
  styles.base,
  {
    [styles.app]: curPage !== 0 && isApp,
    [styles.other]: curPage !== 0 && !isApp && !isWeiXin,
    [styles.homePage]: curPage === 0,
  }
);
```
