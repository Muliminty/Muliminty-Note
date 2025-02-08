# JavaScript 树结构处理方法

---

树结构（Tree Structure）是开发中常见的数据结构之一，广泛应用于菜单导航、分类目录、权限管理、文件系统等场景。JavaScript 在处理树结构时有一系列常用的方法论和技巧。

---

## **基础概念**

### **什么是树结构？**
树是一种层次结构数据，每个节点可以有多个子节点，但只有一个父节点（根节点除外）。

- **节点 (Node)**：树中的每个元素。
- **根节点 (Root)**：树的起点，没有父节点。
- **子节点 (Child)**：从父节点派生的节点。
- **叶子节点 (Leaf)**：没有子节点的节点。
- **层级 (Level)**：节点在树中所属的深度。

### **常见的树结构数据表示**
在 JavaScript 中，树结构通常用嵌套的对象或数组表示。

```javascript
const tree = [
  {
    id: 1,
    name: "Root",
    children: [
      {
        id: 2,
        name: "Child 1",
        children: [
          { id: 4, name: "Grandchild 1", children: [] },
          { id: 5, name: "Grandchild 2", children: [] },
        ],
      },
      { id: 3, name: "Child 2", children: [] },
    ],
  },
];
```

---

## **树结构的常用操作**

### **1. 遍历树**
遍历是树结构处理的核心，主要包括 **深度优先遍历 (DFS)** 和 **广度优先遍历 (BFS)**。

#### **深度优先遍历 (Depth First Search, DFS)**

- **特点**：优先访问子节点，直到叶子节点后再返回上一层。
- **实现方式**：递归或栈。

##### **代码示例：递归实现 DFS**

```javascript
function dfs(tree, callback) {
  for (const node of tree) {
    callback(node); // 处理当前节点
    if (node.children) {
      dfs(node.children, callback); // 递归处理子节点
    }
  }
}

// 示例
dfs(tree, (node) => console.log(node.name));
```

##### **代码示例：非递归实现 DFS**

```javascript
function dfsIterative(tree, callback) {
  const stack = [...tree]; // 使用栈
  while (stack.length) {
    const node = stack.pop();
    callback(node);
    if (node.children) {
      stack.push(...node.children.reverse()); // 逆序压栈，确保左侧优先
    }
  }
}

// 示例
dfsIterative(tree, (node) => console.log(node.name));
```

#### **广度优先遍历 (Breadth First Search, BFS)**

- **特点**：逐层访问节点。
- **实现方式**：队列。

##### **代码示例：实现 BFS**

```javascript
function bfs(tree, callback) {
  const queue = [...tree]; // 使用队列
  while (queue.length) {
    const node = queue.shift(); // 从队列头部取出
    callback(node);
    if (node.children) {
      queue.push(...node.children); // 将子节点加入队列
    }
  }
}

// 示例
bfs(tree, (node) => console.log(node.name));
```

---

### **2. 查找节点**

#### **根据条件查找单个节点**
例如，查找 `id=5` 的节点。

```javascript
function findNode(tree, id) {
  for (const node of tree) {
    if (node.id === id) return node; // 找到匹配节点
    if (node.children) {
      const result = findNode(node.children, id); // 递归查找子节点
      if (result) return result;
    }
  }
  return null; // 未找到
}

// 示例
const node = findNode(tree, 5);
console.log(node); // { id: 5, name: "Grandchild 2", children: [] }
```

#### **根据条件查找多个节点**
例如，查找所有名称包含 `Child` 的节点。

```javascript
function findNodes(tree, predicate) {
  let results = [];
  for (const node of tree) {
    if (predicate(node)) results.push(node);
    if (node.children) {
      results = results.concat(findNodes(node.children, predicate));
    }
  }
  return results;
}

// 示例
const nodes = findNodes(tree, (node) => node.name.includes("Child"));
console.log(nodes);
```

---

### **3. 添加节点**

#### **向特定节点添加子节点**
例如，向 `id=3` 的节点添加一个新子节点。

```javascript
function addNode(tree, parentId, newNode) {
  for (const node of tree) {
    if (node.id === parentId) {
      node.children = node.children || [];
      node.children.push(newNode);
      return true; // 成功添加
    }
    if (node.children) {
      const added = addNode(node.children, parentId, newNode);
      if (added) return true;
    }
  }
  return false; // 未找到父节点
}

// 示例
addNode(tree, 3, { id: 6, name: "New Child", children: [] });
console.log(tree);
```

---

### **4. 删除节点**

#### **根据 ID 删除节点**

```javascript
function deleteNode(tree, id) {
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].id === id) {
      tree.splice(i, 1); // 删除节点
      return true;
    }
    if (tree[i].children) {
      const deleted = deleteNode(tree[i].children, id);
      if (deleted) return true;
    }
  }
  return false; // 未找到节点
}

// 示例
deleteNode(tree, 4);
console.log(tree);
```

---

### **5. 更新节点**

#### **根据 ID 更新节点内容**

```javascript
function updateNode(tree, id, updates) {
  for (const node of tree) {
    if (node.id === id) {
      Object.assign(node, updates); // 更新节点
      return true;
    }
    if (node.children) {
      const updated = updateNode(node.children, id, updates);
      if (updated) return true;
    }
  }
  return false; // 未找到节点
}

// 示例
updateNode(tree, 5, { name: "Updated Grandchild" });
console.log(tree);
```

---

### **6. 将扁平数据转换为树结构**

有时数据以扁平数组的形式存储，需要将其转换为树。

#### **扁平数据示例**

```javascript
const flatData = [
  { id: 1, name: "Root", parentId: null },
  { id: 2, name: "Child 1", parentId: 1 },
  { id: 3, name: "Child 2", parentId: 1 },
  { id: 4, name: "Grandchild 1", parentId: 2 },
  { id: 5, name: "Grandchild 2", parentId: 2 },
];
```

#### **实现转换**

```javascript
function buildTree(flatData) {
  const idMap = {};
  const tree = [];

  // 建立 ID 映射
  flatData.forEach((item) => {
    idMap[item.id] = { ...item, children: [] };
  });

  // 构造树结构
  flatData.forEach((item) => {
    if (item.parentId === null) {
      tree.push(idMap[item.id]);
    } else {
      idMap[item.parentId].children.push(idMap[item.id]);
    }
  });

  return tree;
}

// 示例
const treeData = buildTree(flatData);
console.log(treeData);
```

---

## **总结**
- **遍历操作**：DFS（递归/非递归）和 BFS 是树操作的基础。
- **查找节点**：可以通过递归定位符合条件的节点。
- **添加/删除/更新**：依赖遍历找到目标节点后进行操作。
- **扁平数据转换**：利用 ID 映射和树层级关系重建树。

树结构的处理需要在遍历和递归上打好基础，通过灵活的组合可以应对复杂场景。