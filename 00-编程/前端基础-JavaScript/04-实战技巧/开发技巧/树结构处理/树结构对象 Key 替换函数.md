# **树结构对象 Key 替换函数**

## **功能概述**
通过递归处理树结构数据，将每个节点的 Key 和字段名称替换为自定义的命名格式，同时保留原始节点数据以便后续调试或扩展。

---

## **函数实现**

### 1. **节点处理函数**
负责对单个节点的 Key 和字段进行转换。

```javascript
/**
 * @description 替换单个节点的 Key
 * @param {Object} node - 单个节点对象
 * @returns {Object} 替换后的节点对象
 */
const mapTreeKeys = (node) => {
    // 判断是否有子节点
    const hasChildren = Array.isArray(node.children) && node.children.length > 0;

    return {
        id: node.key,       // 替换 key 为 id
        text: node.text,    // 保留 text 字段
        data: { ...node },  // 将原始节点完整存入 data 中
        children: hasChildren ? node.children.map(mapTreeKeys) : [], // 递归处理子节点
    };
};
```

---

### 2. **树处理函数**
对树结构数组进行整体处理，调用节点处理函数逐个替换 Key。

```javascript
/**
 * @description 替换树结构中所有节点 Key
 * @param {Array} tree - 原始树的数组结构
 * @returns {Array} 替换后的树结构
 */
const replaceTreeKeys = (tree) => {
    return tree.map(mapTreeKeys);
};
```

---

### **测试代码**

#### 输入数据
```javascript
const originalTree = [
    {
        key: 1,
        text: '节点1',
        children: [
            {
                key: 2,
                text: '节点1-1',
                children: [],
            },
            {
                key: 3,
                text: '节点1-2',
                children: [
                    { key: 4, text: '节点1-2-1', children: [] },
                ],
            },
        ],
    },
    {
        key: 5,
        text: '节点2',
        children: [],
    },
];
```

#### 调用函数
```javascript
const newTree = replaceTreeKeys(originalTree);
console.log(newTree);
```

#### 输出结果
```javascript
[
    {
        id: 1,
        text: "节点1",
        data: { key: 1, text: "节点1", children: [...] },
        children: [
            {
                id: 2,
                text: "节点1-1",
                data: { key: 2, text: "节点1-1", children: [] },
                children: [],
            },
            {
                id: 3,
                text: "节点1-2",
                data: { key: 3, text: "节点1-2", children: [...] },
                children: [
                    {
                        id: 4,
                        text: "节点1-2-1",
                        data: { key: 4, text: "节点1-2-1", children: [] },
                        children: [],
                    },
                ],
            },
        ],
    },
    {
        id: 5,
        text: "节点2",
        data: { key: 5, text: "节点2", children: [] },
        children: [],
    },
];
```

---

完整代码

```javaScript
/**
 * @description 替换树结构对象的 Key，并深度遍历处理子节点
 * @param {Object} node 单个节点对象
 * @returns {Object} 替换后的节点对象
 */
const mapTreeKeys = (node) => {
    // 判断当前节点是否有子节点
    const hasChildren = Array.isArray(node.children) && node.children.length > 0;

    // 返回替换后的节点
    return {
        id: node.key,       // 替换 key 为 id
        text: node.text,    // 保留 text 字段
        data: { ...node },  // 将原始节点的所有属性存入 data 中
        children: hasChildren ? node.children.map(mapTreeKeys) : [], // 递归处理子节点
    };
};

/**
 * @description 替换树结构中所有节点 Key 的函数
 * @param {Array} tree 原始树的数组结构
 * @returns {Array} 替换后的树结构
 */
const replaceTreeKeys = (tree) => {
    return tree.map(mapTreeKeys);
};

// 测试数据
const originalTree = [
    {
        key: 1,
        text: '节点1',
        children: [
            {
                key: 2,
                text: '节点1-1',
                children: [],
            },
            {
                key: 3,
                text: '节点1-2',
                children: [
                    { key: 4, text: '节点1-2-1', children: [] },
                ],
            },
        ],
    },
    {
        key: 5,
        text: '节点2',
        children: [],
    },
];

// 替换 Key
const newTree = replaceTreeKeys(originalTree);
console.log(newTree);

```
## **实现细节**

### **核心方法**
- **`Array.prototype.map`**：
  用于遍历和转换树节点及其子节点，返回新的树状结构。

- **递归调用**：
  若节点包含子节点（`children`），递归调用处理子节点，直到最深层级。

---

### **优化点**
1. **解耦逻辑**：
   - 将单节点处理（`mapTreeKeys`）与整体树处理（`replaceTreeKeys`）分离，便于单独测试和复用。
   
2. **动态扩展性**：
   - 原始节点数据完整保存在 `data` 字段中，方便后续调试或扩展功能。

3. **容错性**：
   - 使用 `Array.isArray` 检查子节点的合法性，避免 `children` 为非数组或 `undefined` 时抛出错误。

---

## **适用场景**
- **树状结构数据的字段重命名**
  - 比如后端返回的树结构字段命名不符合前端需求（如 `key` 改为 `id`），需要统一格式化。
  
- **保留原始数据以便追溯**
  - 例如在需要调试或动态扩展功能时，通过 `data` 字段可随时获取完整节点信息。

---

## **注意事项**
1. **确保数据结构一致性**：
   - 确保输入的树状结构每个节点都包含合法的 `children` 字段（即使为空数组）。

2. **深度拷贝需求**：
   - 目前仅将原始节点浅拷贝到 `data` 中，若有深拷贝需求可使用工具库（如 `lodash`）。

3. **灵活扩展**：
   - 根据实际需求，可以在 `mapTreeKeys` 函数中增加额外的字段映射逻辑。

---

## **总结**
该方法逻辑清晰，代码模块化，适用于多种树结构数据的 Key 替换需求，兼顾灵活性和可维护性，能够方便地应用于实际开发项目。