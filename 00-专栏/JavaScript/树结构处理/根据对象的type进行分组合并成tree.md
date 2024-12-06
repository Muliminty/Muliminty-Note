# **基于对象 `type` 的分组合并，生成树形数据**

## **功能说明**
从后台获取的对象数组，根据对象的 `type` 字段，将数据分组并合并成树形结构。每组数据以 `type` 作为树节点的 `label`，对应的子节点包含原始对象数据，同时新增一个 `label` 字段，标识对象的 `name`。

---

## **核心代码**

### **实现逻辑**
```javascript
// 后台返回的原始数据
const dataArr = [
  { type: '治理层', name: 'hive_82', reserve: '2', id: 1 },
  { type: '原始数据层', name: 'qwe', reserve: '1', id: 2 },
  { type: '贴源层', name: 'mysql_exchangis', reserve: '3', id: 3 },
  { type: '治理层', name: 'links_188', reserve: '1', id: 4 },
  { type: '贴源层', name: 'mysql_ces', reserve: '2', id: 5 }
];

// 根据 type 分组合并成树形数据
const treeData = dataArr.reduce((cur, next) => {
  // 查找当前 type 是否已经存在于结果中
  const obj = cur.find(curItem => curItem.label === next.type);

  if (obj) {
    // 去重后添加子节点
    if (!obj.children.some(child => child.id === next.id)) {
      obj.children.push({
        ...next,
        label: next.name
      });
    }
  } else {
    // 创建新的分组
    const newObj = {
      label: next.type,
      children: [{
        ...next,
        label: next.name
      }]
    };
    cur.push(newObj);
  }

  return cur;
}, []);

console.log(treeData);
```

---

## **实现结果**

经过处理后的树形数据 `treeData`：
```javascript
[
  {
    label: '治理层',
    children: [
      { type: '治理层', name: 'hive_82', reserve: '2', id: 1, label: 'hive_82' },
      { type: '治理层', name: 'links_188', reserve: '1', id: 4, label: 'links_188' }
    ]
  },
  {
    label: '原始数据层',
    children: [
      { type: '原始数据层', name: 'qwe', reserve: '1', id: 2, label: 'qwe' }
    ]
  },
  {
    label: '贴源层',
    children: [
      { type: '贴源层', name: 'mysql_exchangis', reserve: '3', id: 3, label: 'mysql_exchangis' },
      { type: '贴源层', name: 'mysql_ces', reserve: '2', id: 5, label: 'mysql_ces' }
    ]
  }
]
```

---

## **代码拆解**

### 1. **初始化空数组**
```javascript
const treeData = dataArr.reduce((cur, next) => { /*...*/ }, []);
```
- `reduce` 的初始值是空数组 `[]`，用于存放最终的树形结构数据。

---

### 2. **查找分组**
```javascript
const obj = cur.find(curItem => curItem.label === next.type);
```
- 通过 `find` 方法在结果数组中查找当前对象的 `type` 是否已经存在分组。

---

### 3. **子节点去重处理**
```javascript
if (!obj.children.some(child => child.id === next.id)) {
  obj.children.push({ ...next, label: next.name });
}
```
- 遍历当前分组的子节点，通过 `id` 字段检查是否存在重复数据。
- 如果不存在重复数据，将子节点添加到分组中，并新增 `label` 属性。

---

### 4. **新增分组**
```javascript
const newObj = {
  label: next.type,
  children: [{
    ...next,
    label: next.name
  }]
};
cur.push(newObj);
```
- 当当前 `type` 不存在于结果数组时，创建新的分组，并将其加入结果数组。

---

## **关键点总结**

1. **查找分组**：
   - 通过 `find` 方法快速定位当前 `type` 是否已存在分组。

2. **避免重复**：
   - 使用 `some` 方法检测子节点是否重复，确保结果中没有重复的子节点。

3. **灵活扩展**：
   - 代码结构清晰，便于根据需求扩展（如动态调整分组依据、添加额外字段等）。

---

## **适用场景**

1. **数据分组展示**：
   - 将后台返回的平铺数据分组并展示为树形结构，便于嵌套展示。

2. **去重逻辑处理**：
   - 可避免后台返回数据中的重复项影响前端展示。

3. **组件树渲染**：
   - 处理后的树形数据可直接用于组件库（如 `Ant Design` 的 `Tree` 组件）进行渲染。

---

## **优化方向**

1. **性能优化**：
   - 对大规模数据可使用 `Map` 替代 `find` 方法，降低时间复杂度。

2. **动态字段**：
   - 提取公共字段处理逻辑，支持动态调整分组依据和子节点结构。

---

## **总结**

此方法利用 `reduce` 实现了数据的分组与合并，逻辑清晰、可读性强，适用于多种树形数据生成场景。同时，合理使用 `find` 和 `some` 方法确保了分组和去重的准确性，提升了代码的健壮性。