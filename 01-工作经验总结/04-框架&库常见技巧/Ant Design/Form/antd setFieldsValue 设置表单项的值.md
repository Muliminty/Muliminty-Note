# antd setFieldsValue 设置表单项的值

被设置了 name 属性的 Form.Item 包装的控件，表单控件会自动添加 value（或 valuePropName 指定的其他属性） onChange（或 trigger 指定的其他属性），数据同步将被 Form 接管，这会导致以下结果：

1. 你不再需要也不应该用 onChange 来做数据收集同步（你可以使用 Form 的 onValuesChange），但还是可以继续监听 onChange 事件。
2. 你不能用控件的 value 或 defaultValue 等属性来设置表单域的值，默认值可以用 Form 里的 initialValues 来设置。注意 initialValues 不能被 setState 动态更新，你需要用 setFieldsValue 来更新。
3. 你不应该用 setState，可以使用 form.setFieldsValue 来动态改变表单值。

## setFieldsValue是表单实例的方法，怎么获取表单实例呢？

1.函数式组件中，获取表单实例通过Form.useForm()获取

```JSX
	//生成表单实例
	const [form] = Form.useForm()
	/*将生成的表单实例连接到表单元素，
	给需要控制的表单元素设置form属性，newVal是新值*/
	form = {form}
	/*通过setFieldsValue设置表单item的值，其中，
	name是Form.item的name值*/
	form.setFieldsValue({
		name:newVal
	})

```

2.类组件中，使用ref获取表单实例

```JSX
//创建ref实例
formRef = React.createRef()
//在Form中绑定
ref = {this.formRef}
//在想要修改Form.Item的值的地方进行修改
this.formRef.current.resetFields();

```

3. 失去焦点清空空格

```js
  onBlur={({ target: { value } }) => { formRef.current.setFieldsValue({ 'name': value.replace(/\s*/g, "") }) }}
```