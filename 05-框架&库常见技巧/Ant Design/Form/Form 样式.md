### label对齐方式
通过设置 labelAlign 属性为 "right"，使得所有 Label 都右对齐显示。
```jsx
import { Form, DatePicker, Select } from 'antd';

const { RangePicker } = DatePicker;
const { Option } = Select;

// 在你的组件中...
<Form
  // 其他属性
  labelAlign="right" // 设置 Label 右对齐
>
  <Form.Item
    name="createdAt"
    label="注册时间"
    labelCol={{ span: 6 }} // 设置 Label 的宽度
    wrapperCol={{ span: 18 }} // 设置表单项的宽度
  >
    <RangePicker
      style={{ width: '100%' }}
      showTime={{ format: 'HH:mm' }}
      format="YYYY-MM-DD HH:mm"
      onChange={() => {
        actionRef.current.reload();
      }}
    />
  </Form.Item>
  <Form.Item
    name="employeeStatus"
    label="员工"
    labelCol={{ span: 6 }} // 设置 Label 的宽度
    wrapperCol={{ span: 18 }} // 设置表单项的宽度
    initialValue="all"
  >
    <Select style={{ width: '100%' }} onChange={() => { handleSubmit({}) }}>
      <Option value="all">全部员工</Option>
      <Option value="RESIGNED">未激活员工</Option>
    </Select>
  </Form.Item>
</Form>
```