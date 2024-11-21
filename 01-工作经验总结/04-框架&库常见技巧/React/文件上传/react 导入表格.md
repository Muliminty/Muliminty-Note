安装 xlsx 插件

```
npm add xlsx
```


```JSX
import React, { useState, useEffect } from 'react';

import { Upload, Button, Table } from 'antd';

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

  
  

// 1：FileReader: 读取文件内容

// readAsText() 读取文本文件，(可以使用Txt打开的文件)

// readAsBinaryString(): 读取任意类型的文件，返回二进制字符串

// readAsDataURL: 方法可以将读取到的文件编码成DataURL ，可以将资料(例如图片、excel文件)内嵌在网页之中，不用放到外部文件

// abort: 中断读取

  

// 2：FileReader 提供一个完整的事件模型，用来捕获读取文件的状态

// onabort: 读取文件断片时触发

// onerror: 读取文件错误时触发

// onload: 文件读取成功时触发

// onloadend: 文件读取完毕之后，不管成功还是失败触发

// onloadstart: 开始读取文件时触发

// onprogress: 读取文件过程中触发

  

const UploadExcel = () => {

    const [wageTableData, setWageTableData] = useState([]);

    const uploadProps = {

        accept: ".xls,.xlsx,application/vnd.ms-excel",

        beforeUpload: (file) => {

            console.log('file: ', file);

            const f = file;

            const reader = new FileReader();

            console.log('reader: ', reader);

            reader.onload = (e) => {

                const datas = e.target.result;

                const workbook = XLSX.read(datas, {

                    type: 'binary'

                });

                const first_worksheet = workbook.Sheets[workbook.SheetNames[0]];

                console.log('first_worksheet: ', first_worksheet);

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

    useEffect(() => {

        console.log('wageTableData: ', wageTableData);

  

    }, [wageTableData])

    const handleImpotedJson = (jsonArr, file) => {

        jsonArr.splice(0, 1); // 去掉表头

        const jsonArrData = jsonArr.map((item, index) => {

            let jsonObj = {};

            jsonObj.index = index + 1;

            jsonObj.key = 'user-wage-' + index;

            item.forEach((im, i) => {

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

  
  

export default UploadExcel
```