# React Context 与自定义 Hooks 架构实战

## 一、前言

在复杂的 React 应用中，状态管理和逻辑复用一直是开发者面临的挑战。传统的 Redux 方案虽然强大，但对于中小型项目来说可能过于复杂。本文将介绍一种基于 **Context API + 自定义 Hooks** 的轻量级架构模式，通过实际项目案例展示如何优雅地组织代码、管理状态和处理业务逻辑。

### 技术背景

- **React Hooks**：函数式组件的状态和生命周期管理
- **Context API**：跨组件状态共享
- **自定义 Hooks**：逻辑复用和代码组织

### 解决的问题

1. 避免 Redux 的复杂性和样板代码
2. 实现逻辑复用和代码组织
3. 提供清晰的状态管理方案
4. 保持代码的可维护性和可测试性

---

## 二、架构设计模式

### 2.1 Context + Hooks 组合架构

#### 为什么选择 Context 而非 Redux？

**Redux 的痛点：**
- 需要大量的样板代码（actions、reducers、types）
- 学习曲线陡峭
- 对于中小型项目可能过度设计

**Context + Hooks 的优势：**
- 零依赖，React 原生支持
- 代码量少，易于理解
- 灵活性强，可以根据需求定制

#### Context 与 Hooks 的分工

```
┌─────────────────────────────────────┐
│         Context (状态容器)            │
│  - 提供全局状态和方法                │
│  - 通过 Provider 注入                │
└─────────────────────────────────────┘
              ▲
              │
┌─────────────────────────────────────┐
│     自定义 Hooks (逻辑层)             │
│  - 状态管理 Hooks                    │
│  - 业务逻辑 Hooks                    │
│  - 工具类 Hooks                      │
└─────────────────────────────────────┘
              ▲
              │
┌─────────────────────────────────────┐
│      组件层 (视图层)                 │
│  - 通过 useStore 获取状态和方法      │
│  - 专注于 UI 渲染                    │
└─────────────────────────────────────┘
```

#### 架构分层

1. **状态层（Context）**：提供全局状态和方法
2. **逻辑层（Hooks）**：封装业务逻辑和状态管理
3. **视图层（Components）**：专注于 UI 渲染

### 2.2 模块化组织策略

#### 目录结构设计

```
MemberManage/
├── components/          # UI 组件
│   ├── DepartmentTree.jsx
│   ├── MemberDetailView.jsx
│   └── ...
├── hooks/              # 自定义 Hooks
│   ├── useViewState.js      # 视图状态管理
│   ├── useModalState.js     # 弹窗状态管理
│   ├── useForms.js          # 表单实例管理
│   ├── useDepartmentManage.js  # 部门管理逻辑
│   ├── useMemberOperations.js  # 成员操作逻辑
│   ├── useMemberDetail.js      # 成员详情管理
│   ├── useSearch.js            # 搜索功能
│   └── useRoleList.js          # 角色列表
├── contexts/           # Context 定义
│   └── MemberManageContext.jsx
├── constants.js        # 常量定义
├── utils.js            # 工具函数
└── index.jsx           # 主入口组件
```

#### Hook 分类原则

1. **状态管理类**：`useViewState`、`useModalState`、`useForms`
   - 职责：管理 UI 状态
   - 特点：纯状态管理，无副作用

2. **业务逻辑类**：`useDepartmentManage`、`useMemberOperations`
   - 职责：封装业务逻辑
   - 特点：包含 API 调用、数据处理

3. **工具增强类**：`useSearch`、`useRoleList`
   - 职责：提供特定功能
   - 特点：可复用性强

---

## 三、Context API 技术实现

### 3.1 Context 创建与封装

#### 基础 Context 创建

```javascript
import React, { createContext, useContext } from 'react'

// 创建 Context
const MemberManageContext = createContext(null)

// Provider 组件
export const MemberManageProvider = ({ value, children }) => {
  return (
    <MemberManageContext.Provider value={value}>
      {children}
    </MemberManageContext.Provider>
  )
}

// 自定义 Hook 封装
export const useMemberManageStore = () => {
  const context = useContext(MemberManageContext)
  if (!context) {
    throw new Error('useMemberManageStore must be used within MemberManageProvider')
  }
  return context
}
```

#### 技术要点

1. **错误边界处理**：在 Hook 中检查 Context 是否存在，避免在 Provider 外使用
2. **类型安全**：通过 TypeScript 或 JSDoc 提供类型提示
3. **命名规范**：使用 `use` 前缀，符合 React Hooks 规范

### 3.2 Store 对象组合技术

#### 多 Hook 返回值合并

在主组件中，将多个 Hook 的返回值合并成一个 Store 对象：

```javascript
function Index() {
  // 多个 Hooks
  const viewState = useViewState()
  const modalState = useModalState()
  const forms = useForms()
  const departmentManage = useDepartmentManage({...})
  const memberOperations = useMemberOperations({...})
  
  // 组合 Store 对象
  const store = {
    // 视图状态
    ...viewState,
    // 弹窗状态
    ...modalState,
    // 表单实例
    ...forms,
    // 部门管理
    treeData: departmentManage.treeData,
    fetchDepartmentTree: departmentManage.fetchDepartmentTree,
    // 成员操作
    fetchMemberList: memberOperations.fetchMemberList,
    handleToggleMemberStatus: memberOperations.handleToggleMemberStatus,
    // ... 更多方法
  }
  
  return (
    <MemberManageProvider value={store}>
      {/* 子组件 */}
    </MemberManageProvider>
  )
}
```

#### 方法包装与参数传递

对于需要额外参数的方法，使用包装函数：

```javascript
// 包装方法，处理参数传递
const submitDepartment = (values) => {
  departmentManage.submitDepartment(
    values, 
    modalState.isAddDept, 
    modalState.currentDeptInfo
  )
}

// 将包装方法放入 Store
const store = {
  // ...
  submitDepartment,  // 使用包装后的方法
  // ...
}
```

#### 避免 Context 值频繁变化

**问题**：每次渲染都会创建新的 Store 对象，导致所有消费 Context 的组件重新渲染。

**解决方案**：使用 `useMemo` 缓存 Store 对象

```javascript
const store = useMemo(() => ({
  ...viewState,
  ...modalState,
  // ...
}), [
  // 只依赖真正变化的状态
  viewState.currentView,
  modalState.departmentModalVisible,
  // ...
])
```

**注意**：过度使用 `useMemo` 可能带来性能问题，需要根据实际情况权衡。

---

## 四、自定义 Hooks 设计模式

### 4.1 状态管理 Hooks 模式

#### useViewState：视图状态集中管理

```javascript
import { useState } from 'react'
import { VIEW_TYPES } from '../constants'

export const useViewState = () => {
  const [currentView, setCurrentView] = useState(VIEW_TYPES.DEPARTMENT)
  const [currentDepartmentId, setCurrentDepartmentId] = useState(null)
  const [currentMemberId, setCurrentMemberId] = useState(null)
  const [memberFilter, setMemberFilter] = useState('all')
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [selectedKeys, setSelectedKeys] = useState([])
  const [expandedKeys, setExpandedKeys] = useState([])

  return {
    currentView,
    setCurrentView,
    currentDepartmentId,
    setCurrentDepartmentId,
    currentMemberId,
    setCurrentMemberId,
    memberFilter,
    setMemberFilter,
    selectedRowKeys,
    setSelectedRowKeys,
    selectedKeys,
    setSelectedKeys,
    expandedKeys,
    setExpandedKeys,
  }
}
```

**设计要点：**
- 单一职责：只管理视图相关状态
- 状态隔离：每个状态独立管理
- 统一返回：返回所有状态和设置函数

#### useModalState：弹窗状态统一管理

```javascript
import { useState } from 'react'

export const useModalState = () => {
  const [departmentModalVisible, setDepartmentModalVisible] = useState(false)
  const [deleteDeptModalVisible, setDeleteDeptModalVisible] = useState(false)
  const [isAddDept, setIsAddDept] = useState(true)
  const [currentDeptInfo, setCurrentDeptInfo] = useState(null)
  const [resetPasswordVisible, setResetPasswordVisible] = useState(false)
  const [resetPasswordUserId, setResetPasswordUserId] = useState(null)
  // ... 更多弹窗状态

  return {
    departmentModalVisible,
    setDepartmentModalVisible,
    // ... 返回所有状态
  }
}
```

**设计要点：**
- 集中管理：所有弹窗状态在一个 Hook 中
- 命名规范：使用 `visible` 后缀表示显示状态
- 关联状态：相关状态放在一起（如 `resetPasswordVisible` 和 `resetPasswordUserId`）

#### useForms：多表单实例管理

```javascript
import { Form } from 'antd'

export const useForms = () => {
  const [form] = Form.useForm()              // 部门表单
  const [memberForm] = Form.useForm()        // 成员表单
  const [resetPasswordForm] = Form.useForm() // 重置密码表单

  return {
    form,
    memberForm,
    resetPasswordForm,
  }
}
```

**设计要点：**
- 实例隔离：每个表单使用独立的 Form 实例
- 命名清晰：使用有意义的名称区分不同表单

### 4.2 业务逻辑 Hooks 模式

#### useDepartmentManage：复杂业务逻辑封装

```javascript
import { useState, useEffect, useMemo } from 'react'
import { useRequest } from '@umijs/max'
import { getDepartmentTree, createDepartment, updateDepartment } from '../../services/systemConfig.service'

export const useDepartmentManage = ({
  currentDepartmentId,
  setCurrentDepartmentId,
  // ... 其他依赖
}) => {
  const [treeData, setTreeData] = useState([])

  // 获取部门树
  const fetchDepartmentTree = async () => {
    try {
      const response = await getDepartmentTree()
      const treeData = response?.result || []
      setDepartmentTreeDataState({ data: treeData })
    } catch (error) {
      console.error('获取部门树失败:', error)
    }
  }

  // 使用 useMemo 计算派生状态
  const departmentDetail = useMemo(() => {
    if (!currentDepartmentId || !departmentTreeDataState?.data?.length) {
      return null
    }
    const dept = findDepartmentById(departmentTreeDataState.data, currentDepartmentId)
    return dept ? {
      id: dept.id,
      name: dept.name,
      // ...
    } : null
  }, [currentDepartmentId, departmentTreeDataState])

  // 使用 useRequest 管理异步操作
  const { run: submitDepartment, loading: submitDeptLoading } = useRequest(
    async (values, isAdd, currentDeptInfo) => {
      if (isAdd) {
        await createDepartment(params)
      } else {
        await updateDepartment(params)
      }
      fetchDepartmentTree()
    },
    { manual: true }
  )

  return {
    treeData,
    departmentDetail,
    fetchDepartmentTree,
    submitDepartment,
    submitDeptLoading,
    // ...
  }
}
```

**设计要点：**
- **参数设计**：使用对象参数，便于扩展和维护
- **依赖注入**：通过参数传入依赖，而不是在 Hook 内部直接调用
- **状态计算**：使用 `useMemo` 优化派生状态计算
- **异步管理**：使用 `useRequest` 统一管理异步操作和 loading 状态

#### useMemberOperations：异步操作管理

```javascript
import { useCallback } from 'react'
import { useRequest } from '@umijs/max'
import { getManagerUserList, updateMemberStatus } from '../../services/systemConfig.service'

export const useMemberOperations = ({
  currentDepartmentId,
  memberFilter,
  // ... 其他依赖
}) => {
  // 使用 useCallback 稳定函数引用
  const fetchMemberList = useCallback(async (params) => {
    if (!currentDepartmentId) {
      return { data: [], success: true, total: 0 }
    }

    try {
      const response = await getManagerUserList({
        deptId: currentDepartmentId,
        includeSubDepts: memberFilter === 'all',
        ...params
      })
      // 数据处理和格式化
      return { data: formattedList, success: true, total }
    } catch (error) {
      console.error('获取成员列表失败:', error)
      return { data: [], success: false, total: 0 }
    }
  }, [currentDepartmentId, memberFilter])

  // 状态切换操作
  const handleToggleMemberStatus = async (record) => {
    setStatusLoadingMap(prev => ({ ...prev, [record.id]: true }))
    try {
      const newStatus = record.status === 1 ? 0 : 1
      await updateMemberStatus({ id: record.id, status: newStatus })
      message.success('操作成功')
      memberTableActionRef.current?.reload()
    } catch (error) {
      message.error('操作失败')
    } finally {
      setStatusLoadingMap(prev => {
        const newMap = { ...prev }
        delete newMap[record.id]
        return newMap
      })
    }
  }

  return {
    fetchMemberList,
    handleToggleMemberStatus,
    // ...
  }
}
```

**设计要点：**
- **useCallback**：稳定函数引用，避免不必要的重新创建
- **错误处理**：统一的 try-catch 错误处理
- **Loading 管理**：使用 Map 管理多个异步操作的 loading 状态
- **数据格式化**：在 Hook 内部完成数据转换，组件只关心展示

#### useMemberDetail：数据获取与缓存

```javascript
import { useRef } from 'react'
import { useRequest } from '@umijs/max'
import { getManagerUserDetail } from '../../services/systemConfig.service'

export const useMemberDetail = ({
  setCurrentMemberId,
  setCurrentView,
  currentView,
}) => {
  const pendingMemberIdRef = useRef(null)

  const {
    data: memberDetail,
    loading: memberDetailLoading,
    run: fetchMemberDetail,
    mutate: mutateMemberDetail
  } = useRequest(
    async (memberId) => {
      if (!memberId) return { data: null }
      const response = await getManagerUserDetail({ id: memberId })
      return { data: response?.result || null }
    },
    {
      manual: true,
      onSuccess: (data, params) => {
        const requestedMemberId = params?.[0]
        if (data?.data?.id && pendingMemberIdRef.current === requestedMemberId) {
          setCurrentMemberId(requestedMemberId)
          setCurrentView(VIEW_TYPES.MEMBER_DETAIL)
          pendingMemberIdRef.current = null
        }
      }
    }
  )

  return {
    memberDetail,
    memberDetailLoading,
    fetchMemberDetail,
    mutateMemberDetail,
  }
}
```

**设计要点：**
- **useRequest**：使用 `@umijs/max` 的 `useRequest` 管理数据获取
- **manual 模式**：手动触发请求，而不是自动执行
- **mutate**：提供直接更新缓存数据的方法
- **useRef**：使用 ref 跟踪待处理的请求，避免竞态条件

### 4.3 功能增强 Hooks 模式

#### useSearch：防抖、前端过滤 + 后端搜索

```javascript
import { useState, useMemo, useCallback } from 'react'
import debounce from 'lodash/debounce'
import { getManagerUserList } from '../../services/systemConfig.service'

export const useSearch = ({ departmentTreeDataState }) => {
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')

  // 前端搜索部门（递归搜索）
  const searchDepartmentsInTree = (nodes, keyword, results = []) => {
    if (!nodes || !Array.isArray(nodes)) return results
    nodes.forEach((node) => {
      const nodeName = node.name || node.title || ''
      if (nodeName.toLowerCase().includes(keyword.toLowerCase())) {
        results.push({ id: node.id, name: nodeName, type: 'department' })
      }
      if (node.children?.length) {
        searchDepartmentsInTree(node.children, keyword, results)
      }
    })
    return results
  }

  // 后端搜索成员（异步）
  const searchMembers = async (keyword) => {
    try {
      const response = await getManagerUserList({
        pageNum: 1,
        pageSize: 100,
        nickname: keyword
      })
      // 处理搜索结果
      return memberResults
    } catch (error) {
      console.error('搜索成员失败:', error)
      return []
    }
  }

  // 执行成员搜索（内部函数）
  const performMemberSearch = useCallback(async (keyword) => {
    if (!keyword) {
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    try {
      const memberResults = await searchMembers(keyword)
      const departmentResults = searchDepartmentsInTree(
        departmentTreeDataState?.data || [], 
        keyword
      )
      setSearchResults([...departmentResults, ...memberResults])
    } catch (error) {
      const departmentResults = searchDepartmentsInTree(
        departmentTreeDataState?.data || [], 
        keyword
      )
      setSearchResults(departmentResults)
    } finally {
      setIsSearching(false)
    }
  }, [departmentTreeDataState])

  // 防抖的成员搜索函数
  const debouncedMemberSearch = useMemo(
    () => debounce(performMemberSearch, 500),
    [performMemberSearch]
  )

  // 执行搜索（带防抖）
  const handleSearch = useCallback((value) => {
    const keyword = value?.trim() || ''
    setSearchKeyword(keyword)

    if (!keyword) {
      debouncedMemberSearch.cancel() // 取消待执行的防抖函数
      setIsSearching(false)
      setSearchResults([])
      return
    }

    // 部门搜索：前端过滤（同步，立即执行）
    const departmentResults = searchDepartmentsInTree(
      departmentTreeDataState?.data || [], 
      keyword
    )
    setSearchResults(departmentResults)

    // 成员搜索：防抖处理（延迟执行，避免频繁调用接口）
    debouncedMemberSearch(keyword)
  }, [debouncedMemberSearch, departmentTreeDataState])

  return {
    searchResults,
    isSearching,
    searchKeyword,
    handleSearch,
  }
}
```

**技术要点：**

1. **混合搜索策略**
   - 部门搜索：前端递归过滤，立即返回结果
   - 成员搜索：后端 API 调用，需要防抖处理

2. **防抖实现**
   - 使用 `lodash.debounce` 实现防抖
   - 通过 `useMemo` 缓存防抖函数
   - 使用 `cancel()` 方法取消待执行的请求

3. **错误处理**
   - 即使成员搜索失败，也显示部门搜索结果
   - 保证用户体验的连续性

#### useRoleList：数据获取与缓存

```javascript
import { useMemo } from 'react'
import { useRequest } from '@umijs/max'
import { getRoleList } from '../../services/systemConfig.service'

export const useRoleList = () => {
  const { data: roleList = [] } = useRequest(async () => {
    try {
      const { result } = await getRoleList({ pageNum: 1, pageSize: 500 })
      const newList = result?.list?.filter(
        item => item.name && item.id && item.status === 0
      ) || []
      return { 
        data: newList.map(item => ({ label: item.name, value: item.id })) 
      }
    } catch (error) {
      console.error('获取角色列表失败:', error)
      return { data: [] }
    }
  })

  // 使用 useMemo 计算派生值
  const normalMemberRoleId = useMemo(() => {
    const normalRole = roleList.find(
      item => item.label === '普通成员' || item.label === '普通用户'
    )
    return normalRole?.value || roleList[0]?.value
  }, [roleList])

  return {
    roleList,
    normalMemberRoleId,
  }
}
```

**设计要点：**
- **数据转换**：在 Hook 内部完成数据格式转换
- **派生值计算**：使用 `useMemo` 优化计算
- **默认值处理**：提供合理的默认值

---

## 五、Hook 实现技术细节

### 5.1 useRequest 集成

#### manual 模式使用场景

`useRequest` 的 `manual: true` 模式适用于需要手动触发的场景：

```javascript
const { run: fetchData, loading } = useRequest(
  async (params) => {
    const response = await api.getData(params)
    return response.data
  },
  { 
    manual: true  // 不会自动执行，需要手动调用 run()
  }
)

// 在需要的时候调用
useEffect(() => {
  fetchData({ id: 123 })
}, [])
```

**适用场景：**
- 需要特定条件才触发的请求
- 用户操作触发的请求
- 需要传递动态参数的请求

#### loading 状态管理

```javascript
// 单个请求的 loading
const { loading } = useRequest(api.getData)

// 多个请求的 loading（使用 Map）
const [statusLoadingMap, setStatusLoadingMap] = useState({})

const handleToggleStatus = async (record) => {
  setStatusLoadingMap(prev => ({ ...prev, [record.id]: true }))
  try {
    await updateStatus(record.id)
  } finally {
    setStatusLoadingMap(prev => {
      const newMap = { ...prev }
      delete newMap[record.id]
      return newMap
    })
  }
}
```

### 5.2 状态同步机制

#### useEffect 依赖管理

```javascript
// 自动选择根部门
useEffect(() => {
  if (departmentTreeDataState?.data?.length && 
      !hasInitializedRef.current && 
      !currentDepartmentId) {
    const rootDept = findRootDepartment(departmentTreeDataState.data)
    if (rootDept) {
      handleDepartmentSelect(rootDept.id, rootNode)
      hasInitializedRef.current = true
    }
  }
}, [departmentTreeDataState, currentDepartmentId, handleDepartmentSelect, hasInitializedRef])
```

**注意点：**
- 依赖数组要包含所有使用的变量和函数
- 使用 `useRef` 避免重复执行
- 函数依赖使用 `useCallback` 稳定引用

#### useRef 避免闭包陷阱

```javascript
const pendingMemberIdRef = useRef(null)

const handleViewMemberDetail = (memberId) => {
  pendingMemberIdRef.current = memberId
  fetchMemberDetail(memberId)
}

// 在请求成功后检查
onSuccess: (data, params) => {
  const requestedMemberId = params?.[0]
  if (data?.data?.id && pendingMemberIdRef.current === requestedMemberId) {
    // 处理成功逻辑
    pendingMemberIdRef.current = null
  }
}
```

**使用场景：**
- 跟踪异步操作的标识
- 避免闭包陷阱
- 存储不需要触发渲染的值

#### 状态更新时序控制

```javascript
// 先更新状态，再执行操作
const handleEdit = () => {
  setIsAddDept(false)
  setCurrentDeptInfo(node)
  form.setFieldsValue({ name: node.title })
  setDepartmentModalVisible(true)
}

// 异步操作后的状态更新
const handleSubmit = async () => {
  await submitData()
  fetchDepartmentTree()  // 刷新数据
  setDepartmentModalVisible(false)  // 关闭弹窗
  form.resetFields()  // 重置表单
}
```

### 5.3 回调函数稳定化

#### useCallback 使用场景

```javascript
// 需要作为依赖的函数
const fetchMemberList = useCallback(async (params) => {
  // 使用 currentDepartmentId
  const response = await getManagerUserList({
    deptId: currentDepartmentId,
    ...params
  })
  return response
}, [currentDepartmentId, memberFilter])  // 依赖数组

// 传递给子组件的回调
const handleSelect = useCallback((keys, info) => {
  setSelectedKeys(keys)
  if (info.node) {
    handleDepartmentSelect(info.node.id, info.node)
  }
}, [handleDepartmentSelect])  // 依赖其他函数
```

**使用原则：**
- 作为其他 Hook 依赖的函数
- 传递给子组件的回调函数
- 在 `useEffect` 中使用的函数

#### 依赖数组设计

```javascript
// 依赖所有使用的变量
useCallback(() => {
  // 使用了 currentDepartmentId 和 memberFilter
  doSomething(currentDepartmentId, memberFilter)
}, [currentDepartmentId, memberFilter])

// 依赖其他 Hook 返回的函数
useCallback(() => {
  fetchData()
  updateState()
}, [fetchData, updateState])
```

**注意：**
- 遗漏依赖可能导致闭包陷阱
- 过度依赖可能导致频繁重新创建
- 使用 ESLint 的 `exhaustive-deps` 规则检查

#### 避免无限循环

```javascript
// ❌ 错误：会导致无限循环
useEffect(() => {
  fetchData(currentId)
}, [fetchData, currentId])  // fetchData 每次都是新函数

// ✅ 正确：使用 useCallback 稳定函数引用
const fetchData = useCallback(async (id) => {
  // ...
}, [/* 依赖 */])

useEffect(() => {
  fetchData(currentId)
}, [fetchData, currentId])  // fetchData 引用稳定
```

---

## 六、性能优化技术

### 6.1 计算优化

#### useMemo 使用场景

```javascript
// 树形数据转换（计算成本高）
const treeData = useMemo(() => {
  return buildTreeData(departmentTreeDataState.data)
}, [departmentTreeDataState])

// 派生状态计算
const departmentDetail = useMemo(() => {
  if (!currentDepartmentId || !departmentTreeDataState?.data?.length) {
    return null
  }
  const dept = findDepartmentById(departmentTreeDataState.data, currentDepartmentId)
  return dept ? { id: dept.id, name: dept.name } : null
}, [currentDepartmentId, departmentTreeDataState])

// 选项数据转换
const departmentTreeSelectOptions = useMemo(() => {
  if (!departmentTreeDataState?.data) return []
  return convertTreeToTreeSelectOptions(departmentTreeDataState.data)
}, [departmentTreeDataState])
```

**使用原则：**
- 计算成本高的操作
- 派生状态的计算
- 数据格式转换

**避免过度使用：**
- 简单计算不需要 `useMemo`
- 依赖频繁变化时，`useMemo` 可能没有收益

#### 避免重复计算

```javascript
// ❌ 错误：每次渲染都重新计算
const filteredData = data.filter(item => item.status === status)

// ✅ 正确：使用 useMemo 缓存结果
const filteredData = useMemo(() => {
  return data.filter(item => item.status === status)
}, [data, status])
```

### 6.2 防抖与节流实现

#### lodash debounce 集成

```javascript
import debounce from 'lodash/debounce'

// 创建防抖函数
const performSearch = useCallback(async (keyword) => {
  // 搜索逻辑
}, [dependencies])

// 使用 useMemo 缓存防抖函数
const debouncedSearch = useMemo(
  () => debounce(performSearch, 500),
  [performSearch]
)

// 清理防抖函数
useEffect(() => {
  return () => {
    debouncedSearch.cancel()
  }
}, [debouncedSearch])
```

#### 防抖函数清理

```javascript
const handleSearch = useCallback((value) => {
  const keyword = value?.trim() || ''
  
  if (!keyword) {
    debouncedSearch.cancel()  // 取消待执行的防抖函数
    setSearchResults([])
    return
  }
  
  debouncedSearch(keyword)
}, [debouncedSearch])
```

#### 输入法组合事件处理（IME composition）

处理中文输入时的组合事件：

```javascript
const [isComposing, setIsComposing] = useState(false)
const [localInputValue, setLocalInputValue] = useState('')

<Input
  value={isComposing ? localInputValue : searchKeyword}
  onCompositionStart={() => setIsComposing(true)}
  onCompositionEnd={(e) => {
    setIsComposing(false)
    const value = e.target.value
    setLocalInputValue(value)
    if (onSearchChange) {
      onSearchChange(e)
    }
  }}
  onChange={(e) => {
    const value = e.target.value
    if (isComposing) {
      setLocalInputValue(value)
      return
    }
    if (onSearchChange) {
      onSearchChange(e)
    }
  }}
/>
```

**技术要点：**
- `onCompositionStart`：开始输入法组合
- `onCompositionEnd`：结束输入法组合
- 在组合期间只更新本地状态，不触发搜索

### 6.3 渲染优化

#### 条件渲染策略

```javascript
// 加载状态管理
if (loading || roleLoading || !member) {
  return <Spin />
}

// 避免渲染空数据
{searchKeyword ? (
  filteredTreeData.length > 0 ? (
    <Tree treeData={filteredTreeData} />
  ) : (
    <div>未找到匹配的部门</div>
  )
) : (
  <Tree treeData={treeData} />
)}
```

#### 避免不必要的重渲染

```javascript
// 使用 React.memo 优化子组件
const DepartmentTree = React.memo(({ treeData, selectedKeys, ... }) => {
  // ...
})

// 使用 useMemo 优化 props
const treeData = useMemo(() => buildTreeData(rawData), [rawData])
```

---

## 七、代码组织技术方案

### 7.1 Hook 设计规范

#### 命名规范

```javascript
// ✅ 正确：使用 use 前缀
export const useViewState = () => { }
export const useDepartmentManage = () => { }

// ❌ 错误：不使用 use 前缀
export const viewState = () => { }
export const getDepartmentManage = () => { }
```

#### 参数对象化设计

```javascript
// ✅ 正确：对象参数，易于扩展
export const useDepartmentManage = ({
  currentDepartmentId,
  setCurrentDepartmentId,
  form,
  // ...
}) => {
  // ...
}

// ❌ 错误：多个独立参数，难以扩展
export const useDepartmentManage = (
  currentDepartmentId,
  setCurrentDepartmentId,
  form,
  // ...
) => {
  // ...
}
```

#### 返回值结构规范

```javascript
// 统一的返回值结构
return {
  // 状态
  treeData,
  departmentDetail,
  // 方法
  fetchDepartmentTree,
  handleEditDepartment,
  // 加载状态
  submitDeptLoading,
  deleteDeptLoading,
}
```

#### JSDoc 注释规范

```javascript
/**
 * 部门管理 Hook
 * 负责部门树数据、部门 CRUD、部门移动等功能
 * 
 * @param {Object} params - Hook 参数对象
 * @param {string|null} params.currentDepartmentId - 当前选中的部门ID
 * @param {Function} params.setCurrentDepartmentId - 设置当前部门ID的函数
 * @returns {Object} 返回部门管理相关的状态和方法
 * @returns {Array} returns.treeData - 部门树数据
 * @returns {Function} returns.fetchDepartmentTree - 获取部门树的方法
 */
export const useDepartmentManage = ({ ... }) => {
  // ...
}
```

### 7.2 依赖管理策略

#### Hook 之间的依赖注入

```javascript
// 主组件中注入依赖
const viewState = useViewState()
const forms = useForms()

const departmentManage = useDepartmentManage({
  currentDepartmentId: viewState.currentDepartmentId,
  setCurrentDepartmentId: viewState.setCurrentDepartmentId,
  form: forms.form,
  // ...
})
```

**优势：**
- 依赖关系清晰
- 易于测试
- 避免循环依赖

#### 避免循环依赖

```javascript
// ❌ 错误：循环依赖
// useA 依赖 useB，useB 依赖 useA

// ✅ 正确：单向依赖
// useA -> useB -> useC
```

#### 参数传递 vs Context 获取

```javascript
// 参数传递：适合明确的依赖关系
const departmentManage = useDepartmentManage({
  currentDepartmentId: viewState.currentDepartmentId,
  form: forms.form,
})

// Context 获取：适合跨层级访问
const { currentDepartmentId, form } = useMemberManageStore()
```

**选择原则：**
- 明确的依赖关系：使用参数传递
- 跨层级访问：使用 Context
- 避免过度使用 Context

### 7.3 错误处理模式

#### try-catch 统一处理

```javascript
const fetchDepartmentTree = async () => {
  try {
    const response = await getDepartmentTree()
    setDepartmentTreeDataState({ data: response.result })
  } catch (error) {
    console.error('获取部门树失败:', error)
    message.error('获取部门树失败')
    setDepartmentTreeDataState({ data: [] })
  }
}
```

#### 错误边界设计

```javascript
// Context 使用错误边界
export const useMemberManageStore = () => {
  const context = useContext(MemberManageContext)
  if (!context) {
    throw new Error('useMemberManageStore must be used within MemberManageProvider')
  }
  return context
}
```

#### 用户友好的错误提示

```javascript
try {
  await updateStatus(params)
  message.success('操作成功')
} catch (error) {
  console.error('操作失败:', error)
  message.error(error.message || '操作失败，请重试')
}
```

---

## 八、Context 使用最佳实践

### 8.1 Provider 设计

#### Provider 位置选择

```javascript
// ✅ 正确：在需要共享状态的组件树根部
function App() {
  return (
    <MemberManageProvider value={store}>
      <MemberManagePage />
    </MemberManageProvider>
  )
}

// ❌ 错误：Provider 位置过深
function App() {
  return (
    <div>
      <Header />
      <MemberManageProvider value={store}>
        <Content />
      </MemberManageProvider>
    </div>
  )
}
```

#### value 对象稳定性

```javascript
// ❌ 错误：每次渲染都创建新对象
<MemberManageProvider value={{
  ...viewState,
  ...modalState,
}}>

// ✅ 正确：使用 useMemo 缓存
const store = useMemo(() => ({
  ...viewState,
  ...modalState,
}), [viewState, modalState])

<MemberManageProvider value={store}>
```

### 8.2 Store 对象组织

#### 状态与方法分离

```javascript
const store = {
  // 状态
  currentView,
  currentDepartmentId,
  departmentModalVisible,
  // 方法
  setCurrentView,
  fetchDepartmentTree,
  handleEditDepartment,
}
```

#### 命名空间设计

```javascript
// 可以按功能分组（可选）
const store = {
  view: {
    currentView,
    setCurrentView,
  },
  department: {
    treeData,
    fetchDepartmentTree,
  },
  member: {
    memberList,
    fetchMemberList,
  },
}
```

**注意：** 分组会增加访问层级，需要权衡。

### 8.3 性能考虑

#### 避免 Context 值频繁变化

```javascript
// 使用 useMemo 稳定 Store 对象
const store = useMemo(() => ({
  ...viewState,
  ...modalState,
}), [
  // 只依赖真正变化的状态
  viewState.currentView,
  modalState.departmentModalVisible,
])
```

#### 拆分 Context 的策略

```javascript
// 如果 Store 对象过大，可以考虑拆分
const ViewContext = createContext(null)
const DepartmentContext = createContext(null)
const MemberContext = createContext(null)

// 或者使用多个 Provider
<ViewProvider>
  <DepartmentProvider>
    <MemberProvider>
      <App />
    </MemberProvider>
  </DepartmentProvider>
</ViewProvider>
```

**拆分原则：**
- 按功能域拆分
- 避免过度拆分
- 考虑组件树的实际使用情况

#### 与 useMemo 结合使用

```javascript
// 在消费 Context 的组件中使用 useMemo
function MemberList() {
  const { memberList, fetchMemberList } = useMemberManageStore()
  
  const filteredList = useMemo(() => {
    return memberList.filter(item => item.status === 1)
  }, [memberList])
  
  return <div>{/* ... */}</div>
}
```

---

## 九、常见技术问题与解决方案

### 9.1 Hook 依赖问题

#### 依赖数组遗漏

```javascript
// ❌ 错误：遗漏依赖
useEffect(() => {
  fetchData(currentId)
}, [])  // 缺少 currentId 依赖

// ✅ 正确：包含所有依赖
useEffect(() => {
  fetchData(currentId)
}, [currentId, fetchData])
```

**解决方案：**
- 使用 ESLint 的 `exhaustive-deps` 规则
- 仔细检查 Hook 内部使用的所有变量

#### 闭包陷阱

```javascript
// ❌ 错误：闭包陷阱
const [count, setCount] = useState(0)
useEffect(() => {
  const timer = setInterval(() => {
    console.log(count)  // 始终是初始值 0
  }, 1000)
  return () => clearInterval(timer)
}, [])

// ✅ 正确：使用函数式更新
useEffect(() => {
  const timer = setInterval(() => {
    setCount(prev => {
      console.log(prev)  // 获取最新值
      return prev + 1
    })
  }, 1000)
  return () => clearInterval(timer)
}, [])
```

#### 无限循环问题

```javascript
// ❌ 错误：导致无限循环
useEffect(() => {
  setData(processData(data))  // data 变化触发 effect，effect 又更新 data
}, [data])

// ✅ 正确：使用 useMemo 或 useCallback
const processedData = useMemo(() => processData(data), [data])
```

### 9.2 Context 性能问题

#### 不必要的重渲染

```javascript
// ❌ 错误：Store 对象每次都是新的
function Index() {
  const store = {
    ...viewState,
    ...modalState,
  }
  return <MemberManageProvider value={store}>...</MemberManageProvider>
}

// ✅ 正确：使用 useMemo 缓存
function Index() {
  const store = useMemo(() => ({
    ...viewState,
    ...modalState,
  }), [viewState, modalState])
  return <MemberManageProvider value={store}>...</MemberManageProvider>
}
```

#### Context 拆分策略

如果 Context 值变化频繁导致性能问题，可以考虑拆分：

```javascript
// 将频繁变化的状态和稳定状态分开
const StableContext = createContext(null)  // 稳定的方法
const StateContext = createContext(null)   // 频繁变化的状态
```

### 9.3 状态同步问题

#### 异步操作后的状态更新

```javascript
// ✅ 正确：在异步操作成功后更新状态
const handleSubmit = async () => {
  try {
    await submitData()
    fetchDepartmentTree()  // 刷新数据
    setDepartmentModalVisible(false)  // 关闭弹窗
  } catch (error) {
    message.error('操作失败')
  }
}
```

#### 竞态条件处理

```javascript
// 使用 ref 跟踪请求 ID
const pendingRequestIdRef = useRef(null)

const fetchData = async (id) => {
  const requestId = Date.now()
  pendingRequestIdRef.current = requestId
  
  const data = await api.getData(id)
  
  // 只处理最新的请求
  if (pendingRequestIdRef.current === requestId) {
    setData(data)
  }
}
```

---

## 十、总结与扩展

### 技术方案总结

**Context + Hooks 架构的优势：**

1. **轻量级**：无需引入额外的状态管理库
2. **灵活性**：可以根据需求定制架构
3. **可维护性**：代码组织清晰，易于理解和维护
4. **可测试性**：Hooks 可以独立测试

**适用场景：**

- 中小型项目的状态管理
- 需要逻辑复用的场景
- 团队熟悉 React Hooks 的项目

**不适用场景：**

- 超大型项目（可能需要 Redux）
- 需要时间旅行调试（Redux DevTools）
- 需要中间件支持（Redux middleware）

### 与其他方案的对比

| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| Context + Hooks | 轻量、灵活、易学 | 性能需注意、无 DevTools | 中小型项目 |
| Redux | 强大、生态丰富、DevTools | 复杂、样板代码多 | 大型项目 |
| Zustand | 简单、性能好 | 生态相对较小 | 中小型项目 |
| MobX | 响应式、易用 | 需要装饰器、体积较大 | 中大型项目 |

### 可改进方向

1. **TypeScript 支持**：添加类型定义，提供更好的类型安全
2. **性能监控**：添加性能监控工具，识别性能瓶颈
3. **单元测试**：为 Hooks 添加完整的单元测试
4. **文档完善**：使用工具自动生成 API 文档

### 最佳实践建议

1. **合理使用 Context**：不要将所有状态都放入 Context
2. **Hook 单一职责**：每个 Hook 只负责一个功能域
3. **性能优化**：合理使用 `useMemo` 和 `useCallback`
4. **错误处理**：统一的错误处理机制
5. **代码规范**：遵循 React Hooks 的最佳实践

---

## 结语

Context + Hooks 架构模式为 React 应用提供了一种轻量级、灵活的状态管理方案。通过合理的架构设计和代码组织，可以在不引入复杂状态管理库的情况下，实现清晰、可维护的代码结构。

希望本文能够帮助你在实际项目中更好地应用这种架构模式。如有问题或建议，欢迎交流讨论。
