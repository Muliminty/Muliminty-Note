# 根据对象的type进行分组合并成tree

```React
//从后台获取的对象数组，根据对象的type进行分组合并成tree树形展示数据
const dataArr = [
  { type: '治理层', name: 'hive_82', reserve: '2', id: 1 },
  { type: '原始数据层', name: 'qwe', reserve: '1', id: 2 },
  { type: '贴源层', name: 'mysql_exchangis', reserve: '3', id: 3 },
  { type: '治理层', name: 'links_188', reserve: '1', id: 4 },
  { type: '贴源层', name: 'mysql_ces', reserve: '2', id: 5 }
]
const treeData = dataArr.reduce((cur, next) => {
  const obj = cur.find(curItem => curItem.label === next.type)
  if (obj) {
    if (obj.children.indexOf(next.id) === -1) { //去重处理
      // console.log(obj.children.indexOf(next.id))
      obj.children.push({
        ...next,
        label: next.name
      })
    }
  } else {
    const newObj = {
      label: next.type,
      children: [{
        ...next,
        label: next.name
      }]
    }
    cur.push(newObj)
  }
  return cur
}, [])

console.log(treeData)

// 合并后的结果：
let resultData = [
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
      { type: '治理层', name: 'mysql_ces', reserve: '2', id: 5, label: 'mysql_ces' }
    ]
  }
]


// let list = [{name:'wxq'},{name:'wxq1'}]
// console.log(list.indexOf({name:'wxq'})
```
