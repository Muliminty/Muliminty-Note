
| 名称 | 说明 | 类型 |
|--|--|--|
| validator | 自定义校验，接收 Promise 作为返回值。[示例](https://ant-design.gitee.io/components/form-cn#components-form-demo-register)参考 | ([rule](https://ant-design.gitee.io/components/form-cn#rule), value) => Promise |



```JSX

    const setMaxLength = (rule, value) => {
        const Check = { name: 36, age: 9 }
        const max = Check[label] === undefined ? Number.MAX_VALUE : Check[label]
        const message = `${getlabel()}最大长度${max}个字符`
        const IS_CHAECK = value?.length > max
        if (IS_CHAECK) return Promise.reject({ max, message });// 校验失败
        if (!IS_CHAECK) return Promise.resolve(); // 校验成功
    
    }
    <Form
            form={form}
            layout="horizontal"
            name="form_in_modal"
            initialValues={{}}
        >
            <Form.Item
                name={label}
                label={getlabel()}
                rules={[
                    {required: true,message: `不能为空`},
                    {validator: setMaxLength},
                ]}
            >
                <Input />

            </Form.Item>
        </Form>
```