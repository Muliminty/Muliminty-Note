# TypeScript MOC

> TypeScript 是 JavaScript 的超集，添加了静态类型系统，提供编译时类型检查、更好的 IDE 支持和代码可维护性。
> 
> **学习路径**：学习 TypeScript 前需要掌握 [JavaScript 基础](../JavaScript/!MOC-javascript.md)。TypeScript 常与前端框架（[React](../../02-框架进阶/React/!MOC-React.md)、[Vue](../../02-框架进阶/Vue/!MOC-Vue.md)、[Angular](../../02-框架进阶/Angular/!MOC-Angular.md)）配合使用。

---

## 📚 核心笔记

### 基础篇

| 笔记 | 说明 |
|------|------|
| [01-基础类型](./01-基础类型.md) | 原始类型、数组、元组、枚举、any/unknown/never |
| [02-接口与类型别名](./02-接口与类型别名.md) | Interface vs Type、继承、声明合并 |
| [03-函数类型](./03-函数类型.md) | 参数类型、返回值、重载、泛型函数 |

### 进阶篇

| 笔记 | 说明 |
|------|------|
| [04-泛型](./04-泛型.md) | 泛型基础、约束、内置工具类型 |
| [05-高级类型](./05-高级类型.md) | 联合/交叉类型、条件类型、映射类型、模板字面量 |
| [06-类型推断与守卫](./06-类型推断与守卫.md) | 类型推断、类型守卫、断言函数、控制流分析 |

### 工程篇

| 笔记 | 说明 |
|------|------|
| [07-模块与声明文件](./07-模块与声明文件.md) | ES Module、.d.ts 声明文件、@types |
| [08-tsconfig配置](./08-tsconfig配置.md) | 编译选项、项目配置、常用模板 |

---

## 🎯 学习路线

```
基础类型 → 接口与类型别名 → 函数类型
    ↓
  泛型 → 高级类型 → 类型推断与守卫
    ↓
模块与声明文件 → tsconfig 配置
    ↓
  框架实战（React/Vue + TypeScript）
```

---

## 🔧 常用工具类型速查

### 对象操作

```typescript
Partial<T>      // 所有属性可选
Required<T>     // 所有属性必选
Readonly<T>     // 所有属性只读
Pick<T, K>      // 选取指定属性
Omit<T, K>      // 排除指定属性
Record<K, V>    // 创建键值对类型
```

### 联合类型操作

```typescript
Exclude<T, U>   // 从 T 中排除 U
Extract<T, U>   // 从 T 中提取 U
NonNullable<T>  // 排除 null 和 undefined
```

### 函数操作

```typescript
Parameters<T>   // 提取函数参数类型
ReturnType<T>   // 提取函数返回类型
ConstructorParameters<T>  // 提取构造函数参数
InstanceType<T> // 提取实例类型
```

### 字符串操作

```typescript
Uppercase<S>    // 转大写
Lowercase<S>    // 转小写
Capitalize<S>   // 首字母大写
Uncapitalize<S> // 首字母小写
```

---

## 📝 最佳实践

1. **始终开启 strict 模式**
2. **优先使用 `unknown` 而非 `any`**
3. **使用类型守卫代替类型断言**
4. **接口用于公共 API，类型用于内部**
5. **利用类型推断，避免过度注解**
6. **使用 `import type` 优化打包**

---

## 🔗 相关资源

- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [TypeScript 中文文档](https://www.tslang.cn/)
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [Type Challenges](https://github.com/type-challenges/type-challenges)

---

## 📂 关联笔记

- [JavaScript 基础](../JavaScript/!MOC-javascript.md) — TypeScript 的基础
- [React](../../02-框架进阶/React/!MOC-React.md) — React + TypeScript 实践
- [Vue](../../02-框架进阶/Vue/!MOC-Vue.md) — Vue 3 + TypeScript 实践
- [Babel 转换管线](../../03-工程化实践/工具链与构建/02-编译工具/Babel转换管线.md) — 编译工具
- [TypeScript Compiler](../../03-工程化实践/工具链与构建/02-编译工具/TypeScript-Compiler.md) — 编译器详解

---

#typescript #类型系统 #前端开发
