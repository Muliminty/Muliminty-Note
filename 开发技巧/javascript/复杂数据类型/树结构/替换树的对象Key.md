# 替换树的对象Key

```javascript
const mapTree = org => {
    const haveChildren = Array.isArray(org.children) && org.children.length > 0;
    // 可以根据实际开发需要返回自己想要的key值
    //分别将我们查询出来的值做出改变他的key
    return {
         id : org.key,
         text: org.text,
         data: {...org},
        //判断它是否存在子集，若果存在就进行再次进行遍历操作，知道不存在子集便对其他的元素进行操作
         children:haveChildren ? org.children.map(i => mapTree(i)) : [],
     }
};
let arr = []
gxqTree= jsonData.map(org => mapTree(org) )
console.log(gxqTree)
```


```javascript
let newTree = newTree.map(v => mapTree(v)) 
```
