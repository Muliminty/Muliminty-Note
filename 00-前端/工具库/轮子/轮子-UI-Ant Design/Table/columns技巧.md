# columns技巧

## 按照时间排序

```JSX
{  //column中的时间列
        title: "发送请求时间",
        dataIndex: "createTime",
        key: "createTime",
        //排序方法
        sorter: (a, b) => { 
          let aTime = new Date(a.createTime).getTime();
          let bTime = new Date(b.createTime).getTime();
          console.log("a",a);
          return aTime - bTime;
        },
        width: "10vw"
      },

```

## 字段超出省略号
[csdn -- antd Table表格超出部分隐藏并显示省略号，鼠标悬停时显示出td的所有内容 -- 佩奇是个dog](https://blog.csdn.net/weixin_45738401/article/details/117257647)
```JSX
const columns = [
    {
      title: '收付性质',
      dataIndex: 'name',
      fixed: 'left',
      width: 100,
      onCell: ()=>{
        return {
          style:{
            maxWidth: 100,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            cursor: 'pointer'
          }
        }
      },
    },
    ]

```


