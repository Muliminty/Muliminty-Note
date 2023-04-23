---
link: https://blog.csdn.net/weixin_42452015/article/details/108237074
title: React 之导入 Excel
description: 前言：最近做的后台管理系统，有一个导入 Excel 的功能，从网上查找了一些别人写的代码，直接借鉴过来，希望可以帮助到你。废话不多，直接上代码第一步：安装xlsx 插件yarn add xlsx第二步：使用 Antd 的上传组件，完成页面样式，主要代码&lt;Upload {...uploadProps}&gt;    &lt;Button type="primary"&gt;导入工资单&lt;/Button&gt;&lt;/Upload&gt;const u.
keywords: react hooks antd upload 导入文件execl
author: Cikayo Csdn认证博客专家 Csdn认证企业博客 码龄5年 暂无认证
date: 2023-02-10T07:34:43.000Z
publisher: null
stats: paragraph=22 sentences=38, words=449
---
### 前言：

最近做的后台管理系统，有一个导入 Excel 的功能，从网上查找了一些别人写的代码，直接借鉴过来，希望可以帮助到你。

废话不多，直接上代码

### 第一步：

安装 xlsx 插件

```js
yarn add xlsx
```

### 第二步：

使用 Antd 的上传组件，完成页面样式，主要代码

```js
<Upload {...uploadProps}>
    <Button type="primary">导入工资单</Button>
</Upload>
```

```js
const uploadProps = {
    accept: ".xls,.xlsx,application/vnd.ms-excel",
    beforeUpload: (file: any) => {
      const f = file;
      const reader = new FileReader();
      reader.onload =  (e: any) => {
        const datas = e.target.result;
        const workbook = XLSX.read(datas, {
          type: 'binary'
        });
        const first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonArr = XLSX.utils.sheet_to_json(first_worksheet, { header: 1 });
        handleImpotedJson(jsonArr, file);
      };
      reader.readAsBinaryString(f);
      return false;
    },
    onRemove: () => {
      setWageTableData([]);
    }
  }
```

```
const handleImpotedJson = (jsonArr: any, file: any) => {
    jsonArr.splice(0, 1); // &#x53BB;&#x6389;&#x8868;&#x5934;
    const jsonArrData = jsonArr.map((item: any, index: number) => {
      let jsonObj: any = {};
      jsonObj.index = index + 1;
      jsonObj.key = 'user-wage-' + index;
      item.forEach((im: any, i: number) => {
        jsonObj[tableColumns[i].dataIndex] = im;
      })
      return jsonObj;
    });
    setWageTableData(jsonArrData)
  }
```

**Excel 文件数据如下：**

![](https://img-blog.csdnimg.cn/20200826120139883.png)

**最后贴上完整代码：**

```js
import React, { useState } from 'react';
import { Upload, Button } from 'antd';
import * as XLSX from 'xlsx';
const tableColumns = [
  {
    title: '项',
    dataIndex: 'index',
  },
  {
    title: '员工ID',
    dataIndex: 'userId',
  },
  {
    title: '员工姓名',
    dataIndex: 'userName'
  },
  {
    title: '应发工资',
    dataIndex: 'userPayable',
  },
  {
    title: '绩效奖金',
    dataIndex: 'performanceBonus'
  },
  {
    title: '社保扣除',
    dataIndex: 'socialSecurityDeduction'
  },
  {
    title: '个税扣除',
    dataIndex: 'taxDeduction'
  },
  {
    title: '实发工资',
    dataIndex: 'userPaidWages',
  },
]
 
const WageManage = () => {
    const [wageTableData, setWageTableData] = useState<any[]>([]);
    const uploadProps = {
        accept: ".xls,.xlsx,application/vnd.ms-excel",
        beforeUpload: (file: any) => {
            const f = file;
            const reader = new FileReader();
            reader.onload =  (e: any) => {
                const datas = e.target.result;
                const workbook = XLSX.read(datas, {
                type: 'binary'
            });
            const first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonArr = XLSX.utils.sheet_to_json(first_worksheet, { header: 1 });
            handleImpotedJson(jsonArr, file);
        };
        reader.readAsBinaryString(f);
            return false;
        },
        onRemove: () => {
            setWageTableData([]);
        }
    }
  
    const handleImpotedJson = (jsonArr: any, file: any) => {
        jsonArr.splice(0, 1); // 去掉表头
        const jsonArrData = jsonArr.map((item: any, index: number) => {
            let jsonObj: any = {};
            jsonObj.index = index + 1;
            jsonObj.key = 'user-wage-' + index;
            item.forEach((im: any, i: number) => {
                jsonObj[tableColumns[i].dataIndex] = im;
            })
            return jsonObj;
        });
        setWageTableData(jsonArrData)
    }
    return (
        <div>
            <Upload {...uploadProps}>
              <Button type="primary">导入工资单</Button>
            </Upload>
            <Table
              columns={tableColumns}
              dataSource={wageTableData}
            />
        </div>    
    )
}
```

如果帮到你，请帮忙点个赞哦~谢谢~

[Cikayo个人博客![](https://csdnimg.cn/release/blog_editor_html/release1.9.5/ckeditor/plugins/CsdnLink/icons/icon-default.png?t=LA92)https://www.cikayo.com/;](https://www.cikayo.com/)
