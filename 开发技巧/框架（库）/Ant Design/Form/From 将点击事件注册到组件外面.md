# From 将点击事件注册到组件外面

> 需要注册表单实例

## 函数组件

```JSX
const AppletModal = (props) => {
    const [form] = Form.useForm();
    render(){
		return(
			<Form ref={form}></Form>
		)
	}
}

```
## 类组件

```JSX
import { FormInstance } from 'antd/lib/form';

class AppletEdit extends React.Component{
    form = React.createRef();
    render(){
		return(
			<Form ref={this.form}></Form>
		)
	}
}

```

注册完成后

```JSX
//对应点击事件，一般是绑定在模态框的点击事件
click = ()=>{
      form
      .validateFields()
      .then(values => {
        console.log('values: ', values);

      })
      .catch(errorInfo => {

      });
}
```