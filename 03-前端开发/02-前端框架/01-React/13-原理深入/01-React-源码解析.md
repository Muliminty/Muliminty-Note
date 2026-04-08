# React 源码解析

> 深入理解 React 的底层实现原理和源码架构

---

## 目录

1. [React 架构概览](#react-架构概览)
2. [Fiber 架构](#fiber-架构)
3. [调度器（Scheduler）](#调度器scheduler)
4. [协调器（Reconciler）](#协调器reconciler)
5. [渲染器（Renderer）](#渲染器renderer)
6. [Diff 算法](#diff-算法)
7. [Hooks 实现原理](#hooks-实现原理)
8. [事件系统](#事件系统)

---

## React 架构概览

### 三层架构

```
┌─────────────────────────────────────┐
│         React 应用层                 │
│  (Components, Hooks, JSX)          │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│         React 核心层                 │
│  (Reconciler, Scheduler)          │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│         React 渲染层                 │
│  (ReactDOM, React Native)          │
└─────────────────────────────────────┘
```

### 核心模块

1. **Scheduler（调度器）**：任务调度和优先级管理
2. **Reconciler（协调器）**：Fiber 节点协调和 Diff 算法
3. **Renderer（渲染器）**：平台特定的渲染实现

---

## Fiber 架构

### Fiber 节点结构

```javascript
// 简化的 Fiber 节点结构
interface Fiber {
  // 节点类型
  tag: WorkTag
  key: string | null
  elementType: any
  type: any
  
  // 状态
  stateNode: any
  return: Fiber | null
  child: Fiber | null
  sibling: Fiber | null
  
  // 工作相关
  pendingProps: any
  memoizedProps: any
  memoizedState: any
  updateQueue: UpdateQueue | null
  
  // 副作用
  flags: Flags
  subtreeFlags: Flags
  deletions: Fiber[] | null
  
  // 调度相关
  lanes: Lanes
  childLanes: Lanes
  alternate: Fiber | null
}
```

### Fiber 树结构

```javascript
// 组件树
<App>
  <Header />
  <Main>
    <Article />
    <Sidebar />
  </Main>
</App>

// 对应的 Fiber 树
App (Fiber)
├── Header (Fiber)
├── Main (Fiber)
    ├── Article (Fiber)
    └── Sidebar (Fiber)
```

### 双缓冲机制

```javascript
// current: 当前显示的 Fiber 树
// workInProgress: 正在构建的新 Fiber 树

// 渲染完成后交换
current = workInProgress
workInProgress = null
```

---

## 调度器（Scheduler）

### 时间切片

```javascript
// 时间切片：将工作分成多个时间块
function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress)
  }
}

function shouldYield() {
  // 检查是否应该让出控制权
  return getCurrentTime() >= deadline
}
```

### 优先级管理

```javascript
// 优先级定义
const ImmediatePriority = 1
const UserBlockingPriority = 2
const NormalPriority = 3
const LowPriority = 4
const IdlePriority = 5

// 根据优先级调度任务
function scheduleCallback(priorityLevel, callback) {
  // 根据优先级插入任务队列
}
```

---

## 协调器（Reconciler）

### 工作循环

```javascript
function workLoop() {
  while (workInProgress !== null) {
    workInProgress = performUnitOfWork(workInProgress)
  }
}

function performUnitOfWork(fiber) {
  // 1. 开始工作（beginWork）
  const next = beginWork(fiber)
  
  if (next === null) {
    // 2. 完成工作（completeWork）
    completeUnitOfWork(fiber)
  }
  
  return next
}
```

### beginWork

```javascript
function beginWork(current, workInProgress, renderLanes) {
  // 根据组件类型执行不同的更新逻辑
  switch (workInProgress.tag) {
    case FunctionComponent:
      return updateFunctionComponent(current, workInProgress, renderLanes)
    case ClassComponent:
      return updateClassComponent(current, workInProgress, renderLanes)
    case HostComponent:
      return updateHostComponent(current, workInProgress, renderLanes)
    // ...
  }
}
```

### completeWork

```javascript
function completeWork(current, workInProgress, renderLanes) {
  const newProps = workInProgress.pendingProps
  
  switch (workInProgress.tag) {
    case HostComponent:
      // 创建或更新 DOM 节点
      if (current !== null && workInProgress.stateNode != null) {
        updateHostComponent(current, workInProgress, renderLanes, newProps)
      } else {
        const instance = createInstance(workInProgress.type, newProps)
        appendAllChildren(instance, workInProgress)
        workInProgress.stateNode = instance
      }
      break
    // ...
  }
  
  return null
}
```

---

## 渲染器（Renderer）

### ReactDOM 渲染流程

```javascript
// 1. 创建根节点
const root = createRoot(container)

// 2. 渲染
root.render(<App />)

// 3. 内部流程
// - 创建 Fiber 树
// - 执行协调
// - 提交到 DOM
```

### 提交阶段

```javascript
function commitRoot(root) {
  // 1. BeforeMutation：DOM 变更前
  commitBeforeMutationEffects(root)
  
  // 2. Mutation：DOM 变更
  commitMutationEffects(root)
  
  // 3. Layout：DOM 变更后
  commitLayoutEffects(root)
}
```

---

## Diff 算法

### Diff 策略

1. **单节点 Diff**：比较单个元素
2. **多节点 Diff**：比较多个子元素

### 单节点 Diff

```javascript
function reconcileSingleElement(returnFiber, currentFirstChild, element) {
  const key = element.key
  let child = currentFirstChild
  
  while (child !== null) {
    if (child.key === key) {
      // key 相同，可以复用
      if (child.elementType === element.type) {
        // type 也相同，复用节点
        deleteRemainingChildren(returnFiber, child.sibling)
        const existing = useFiber(child, element.props)
        existing.return = returnFiber
        return existing
      }
    }
    child = child.sibling
  }
  
  // 没有找到可复用的节点，创建新节点
  const created = createFiberFromElement(element)
  created.return = returnFiber
  return created
}
```

### 多节点 Diff

```javascript
function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren) {
  // 1. 第一轮遍历：处理更新的节点
  // 2. 第二轮遍历：处理新增的节点
  // 3. 第三轮遍历：处理删除的节点
}
```

### Key 的作用

```javascript
// 有 key：可以准确识别节点，高效复用
<ul>
  <li key="1">Item 1</li>
  <li key="2">Item 2</li>
</ul>

// 无 key：使用索引，可能导致错误的复用
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>
```

---

## Hooks 实现原理

### Hooks 数据结构

```javascript
// Hooks 存储在 Fiber 节点的 memoizedState 中
interface Hook {
  memoizedState: any // 当前状态值
  baseState: any // 基础状态
  baseQueue: Update | null // 更新队列
  queue: UpdateQueue | null // 更新队列
  next: Hook | null // 下一个 Hook
}
```

### useState 实现

```javascript
function useState(initialState) {
  const hook = updateWorkInProgressHook()
  const queue = hook.queue
  
  // 处理更新
  const dispatch = dispatchSetState.bind(null, currentlyRenderingFiber, queue)
  
  return [hook.memoizedState, dispatch]
}

function dispatchSetState(fiber, queue, action) {
  const update = {
    action,
    next: null,
  }
  
  // 将更新加入队列
  enqueueUpdate(fiber, queue, update)
  
  // 调度更新
  scheduleUpdateOnFiber(fiber)
}
```

### useEffect 实现

```javascript
function useEffect(create, deps) {
  const hook = updateWorkInProgressHook()
  const nextDeps = deps === undefined ? null : deps
  let destroy = undefined
  
  if (currentHook !== null) {
    const prevEffect = currentHook.memoizedState
    destroy = prevEffect.destroy
    if (nextDeps !== null) {
      const prevDeps = prevEffect.deps
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        // 依赖未变化，跳过
        pushEffect(hookEffectTag, create, destroy, nextDeps)
        return
      }
    }
  }
  
  // 依赖变化，需要执行
  hook.memoizedState = pushEffect(
    HookHasEffect | hookEffectTag,
    create,
    destroy,
    nextDeps
  )
}
```

---

## 事件系统

### 合成事件（SyntheticEvent）

```javascript
// React 的事件系统
// 1. 事件委托到根节点
// 2. 使用合成事件对象
// 3. 统一的事件处理

function handleClick(e) {
  // e 是 SyntheticEvent，不是原生事件
  e.preventDefault()
  e.stopPropagation()
}
```

### 事件处理流程

```javascript
// 1. 事件注册
// 2. 事件触发
// 3. 事件捕获/冒泡
// 4. 事件处理
```

---

## 总结

React 源码的核心概念：

1. ✅ **Fiber 架构**：可中断的渲染机制
2. ✅ **调度器**：任务优先级和时间切片
3. ✅ **协调器**：Diff 算法和节点协调
4. ✅ **渲染器**：平台特定的渲染实现
5. ✅ **Hooks**：基于链表的 Hooks 系统
6. ✅ **事件系统**：合成事件和事件委托

---

*最后更新：2025-12-12*
