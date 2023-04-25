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


[单元格自动省略](https://ant-design.gitee.io/components/table-cn#components-table-demo-ellipsis)[](https://github.com/ant-design/ant-design/edit/master/components/table/demo/ellipsis.tsx)

设置 `column.ellipsis` 可以让单元格内容根据宽度自动省略。

```JSX
// ellipsis: true,


import React from 'react';

import { Table } from 'antd';

import type { ColumnsType } from 'antd/es/table';

interface DataType {

  key: React.Key;

  name: string;

  age: number;

  address: string;

}

  

const columns: ColumnsType<DataType> = [

  {

    title: 'Name',

    dataIndex: 'name',

    key: 'name',

    render: (text) => <a>{text}</a>,

    width: 150,

  },

  {

    title: 'Age',

    dataIndex: 'age',

    key: 'age',

    width: 80,

  },

  {

    title: 'Address',

    dataIndex: 'address',

    key: 'address 1',

    ellipsis: true,

  },

  {

    title: 'Long Column Long Column Long Column',

    dataIndex: 'address',

    key: 'address 2',

    ellipsis: true,

  },

  {

    title: 'Long Column Long Column',

    dataIndex: 'address',

    key: 'address 3',

    ellipsis: true,

  },

  {

    title: 'Long Column',

    dataIndex: 'address',

    key: 'address 4',

    ellipsis: true,

  },

];

  

const data = [

  {

    key: '1',

    name: 'John Brown',

    age: 32,

    address: 'New York No. 1 Lake Park, New York No. 1 Lake Park',

    tags: ['nice', 'developer'],

  },

  {

    key: '2',

    name: 'Jim Green',

    age: 42,

    address: 'London No. 2 Lake Park, London No. 2 Lake Park',

    tags: ['loser'],

  },

  {

    key: '3',

    name: 'Joe Black',

    age: 32,

    address: 'Sydney No. 1 Lake Park, Sydney No. 1 Lake Park',

    tags: ['cool', 'teacher'],

  },

];

  

const App: React.FC = () => <Table columns={columns} dataSource={data} />;

  

export default App;
```
