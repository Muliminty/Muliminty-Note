#antd/Upload #开发技巧/文件上传 

```JSX
    const UploadProps = {
        name: 'file',
        action: "",
        accept: ".xls,.xlsx",
        maxCount: 1,
        headers: { authorization: 'authorization-text' },
        beforeUpload: (file) => {},
        customRequest: async (options) => { setFile(options.file); options.onSuccess(true, options.file) },
        onRemove: () => { setFile(null) },
        onChange(info) {
            if (info.file.status === 'done') message.success(`${info.file.name} ${t("common.addSuccess")}`);
            if (info.file.status === 'error') message.error(`${info.file.name} ${t("common.opFail")}`);
        },
    };
```

## accept

接受上传的文件类型, 详见 [input accept Attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept)

例子：限制只能选择 xls xlsx 文件
```JavaScript
	<Upload accept=".xls,.xlsx">
        <Button type="primary">保存文件</Button>
    </Upload>
```

![alt](../附件/Pasted%20image%2020230427162931.png)

## customRequest

通过覆盖默认的上传行为，可以自定义自己的上传实现

可以实现组件点击上传之后不直接上传文件，而是在表单的提交按钮点击的时候再上传

```JSX

    const [file, setFile] = useState(options.file); // 保存 customRequest回调的file文件
    const UploadProps = {
        customRequest: async (options) => { setFile(options.file); options.onSuccess(true, options.file) }, 
        {...其他属性}
    };
    
    /**
     * 表单点击上传
     */
    const handleStartImport = async () => {
        let formData = new FormData();
        formData.append('empExcelFile', new Blob([file]));
        let res = await employeeImport(formData)
    }

    
	<Upload {...UploadProps}>
        <Button type="primary">保存文件</Button>
    </Upload>
    <Button type="primary" onClick={handleStartImport}>点击上传</Button>
```

customRequest: async (options) => { setFile(options.file);}
查看参数options的详细信息：

![alt](../附件/Pasted%20image%2020230428112458.png)

可以发现onProgress事件与onSuccess事件，onProgress是上传进度相关的，onSuccess是上传成功监听事件。

- 调用onSuccess事件，解决loading一直加载的问题：

```JSX
onSuccess(response, file);
```

- 设置进度条相关监听，解决进度条显示不正常的问题：
  
```JSX
    onUploadProgress: ({ total, loaded }) => {
        onProgress({ percent: Math.round(loaded / total * 100).toFixed(2) }, file);
    }
```

## beforeUpload

上传文件之前的钩子，参数为上传的文件，若返回 `false` 则停止上传。支持返回一个 Promise 对象，Promise 对象 reject 时则停止上传，resolve 时开始上传（ resolve 传入 `File` 或 `Blob` 对象则上传 resolve 传入对象）；也可以返回 `Upload.LIST_IGNORE`，此时列表中将不展示此文件。 **注意：IE9 不支持该方法**

