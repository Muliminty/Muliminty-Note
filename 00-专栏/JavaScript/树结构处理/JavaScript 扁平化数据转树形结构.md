### JavaScript 扁平化数据转树形结构

#### 背景
在实际开发中，我们常需要将数据库或 API 返回的扁平化数据转换成树形结构，以便前端展示层使用（如菜单导航、组织架构图等）。以下是两种常见的实现方法，适用于不同的场景。

---

### 方法一：基于两个循环的方式

#### 实现逻辑
1. **构建映射表**：遍历扁平化数据，将 `id` 作为键，数据对象作为值存储到映射表中。
2. **组装树结构**：
   - 再次遍历数组，判断当前项是否有父级。
   - 如果有父级，加入父级的 `children` 属性中。
   - 如果没有父级，直接添加到结果数组中。

#### 代码实现

```javascript
function formatToTree({ arrayList, pidStr = 'pid', idStr = 'id', childrenStr = 'children' }) {
  const listObj = {}; // 存储 {id: item} 的映射
  const treeList = []; // 存储树形结构

  // 第一次遍历：将数组转为映射表
  arrayList.forEach(item => {
    listObj[item[idStr]] = item;
  });

  // 第二次遍历：组装树结构
  arrayList.forEach(item => {
    const parent = listObj[item[pidStr]];
    if (parent) {
      parent[childrenStr] = parent[childrenStr] || [];
      parent[childrenStr].push(item);
    } else {
      treeList.push(item);
    }
  });

  return treeList;
}

// 测试数据
const menuList = [
  { id: '1', menu_name: '设置', menu_url: 'setting', parent_id: 0 },
  { id: '1-1', menu_name: '权限设置', menu_url: 'setting.permission', parent_id: '1' },
  { id: '1-1-1', menu_name: '用户管理列表', menu_url: 'setting.permission.user_list', parent_id: '1-1' },
  { id: '1-2', menu_name: '菜单设置', menu_url: 'setting.menu', parent_id: '1' },
  { id: '2', menu_name: '订单', menu_url: 'order', parent_id: 0 },
  { id: '2-1', menu_name: '报单审核', menu_url: 'order.orderreview', parent_id: '2' }
];

// 调用方法
console.log(formatToTree({ arrayList: menuList, pidStr: 'parent_id' }));
```

#### 输出结果
```javascript
[
  {
    id: '1',
    menu_name: '设置',
    menu_url: 'setting',
    parent_id: 0,
    children: [
      {
        id: '1-1',
        menu_name: '权限设置',
        menu_url: 'setting.permission',
        parent_id: '1',
        children: [
          {
            id: '1-1-1',
            menu_name: '用户管理列表',
            menu_url: 'setting.permission.user_list',
            parent_id: '1-1'
          }
        ]
      },
      {
        id: '1-2',
        menu_name: '菜单设置',
        menu_url: 'setting.menu',
        parent_id: '1'
      }
    ]
  },
  {
    id: '2',
    menu_name: '订单',
    menu_url: 'order',
    parent_id: 0,
    children: [
      {
        id: '2-1',
        menu_name: '报单审核',
        menu_url: 'order.orderreview',
        parent_id: '2'
      }
    ]
  }
];
```

#### 优点
- **效率高**：两次遍历即可完成。
- **灵活性强**：支持自定义键名（如 `pid`、`id` 和 `children`）。

---

### 方法二：基于 Map 的方式

#### 实现逻辑
1. **创建映射表**：遍历数据，将每个数据对象存入 `Map`。
2. **构建树结构**：
   - 如果当前项的 `pid` 为 `0`（或其他指定的根节点标识），直接加入结果树。
   - 如果当前项有父级，则在父级的 `children` 中添加当前项。

#### 代码实现

```javascript
function arrayToTree(items, pidKey = 'pid', idKey = 'id') {
  const result = []; // 存放结果树
  const itemMap = new Map();

  // 第一次遍历：将数据转为 Map
  items.forEach(item => {
    itemMap.set(item[idKey], { ...item, children: [] });
  });

  // 第二次遍历：组装树结构
  items.forEach(item => {
    const treeItem = itemMap.get(item[idKey]);
    if (item[pidKey] === 0) {
      result.push(treeItem);
    } else {
      const parent = itemMap.get(item[pidKey]);
      if (parent) {
        parent.children.push(treeItem);
      }
    }
  });

  return result;
}

// 测试数据
const departments = [
  { id: 2, name: '部门2', pid: 1 },
  { id: 3, name: '部门3', pid: 1 },
  { id: 4, name: '部门4', pid: 3 },
  { id: 5, name: '部门5', pid: 4 },
  { id: 6, name: '部门6', pid: 0 },
  { id: 1, name: '部门1', pid: 0 }
];

// 调用方法
console.log(arrayToTree(departments));
```

#### 输出结果
```javascript
[
  {
    id: 6,
    name: '部门6',
    pid: 0,
    children: []
  },
  {
    id: 1,
    name: '部门1',
    pid: 0,
    children: [
      {
        id: 2,
        name: '部门2',
        pid: 1,
        children: []
      },
      {
        id: 3,
        name: '部门3',
        pid: 1,
        children: [
          {
            id: 4,
            name: '部门4',
            pid: 3,
            children: [
              {
                id: 5,
                name: '部门5',
                pid: 4,
                children: []
              }
            ]
          }
        ]
      }
    ]
  }
];
```

#### 优点
- **可读性好**：`Map` 提供了更直观的键值存储。
- **扩展性强**：便于扩展更多属性或功能。

---

### 方法比较

| 特性                | 方法一（对象映射）            | 方法二（Map 映射）           |
|---------------------|------------------------------|-----------------------------|
| **性能**            | 略高（对象查找较快）          | 稍低（`Map` 查找有额外开销） |
| **代码可读性**      | 较复杂                        | 更清晰                      |
| **扩展性**          | 一般                         | 较强                        |
| **适用场景**        | 简单场景                      | 数据较复杂、频繁修改的场景   |

---

### 总结
两种方法都可以满足绝大多数场景需求。在性能要求较高的场景中，推荐方法一；在更复杂的场景中（例如需要支持动态插入或删除树节点），推荐方法二。根据实际需求选择合适的实现方式。