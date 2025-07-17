# modalWithForm 组件文档

antd 3

`modalWithForm` 是一个高阶组件，用于快速创建带有表单的模态框（Modal）。它基于 Ant Design 的 `Modal` 和 `Form` 组件构建，提供了动态字段配置、自定义组件、校验规则等功能。

## 功能特性

- 支持动态配置表单字段
- 内置表单验证功能
- 自动处理异步提交的 loading 状态
- 支持自定义模态框属性
- 自动清理 DOM 节点，避免内存泄漏
- 内置输入长度统计功能

## API

### 配置参数 (config)

| 参数名 | 类型 | 说明 | 默认值 | 必填 |
|--------|------|------|--------|------|
| title | string | 模态框标题 | - | 是 |
| fields | Array<Object> | 表单字段配置数组 | - | 是 |
| onOk | Function | 点击"确定"后的回调函数，参数为表单数据对象 | - | 否 |
| onCancel | Function | 点击"取消"或关闭时的回调函数 | - | 否 |
| footer | React.ReactNode \| false | 自定义底部按钮区域，传 false 可隐藏 footer | 默认按钮组 | 否 |
| modalProps | Object | 传给 Modal 的原生 props | - | 否 |

### fields 字段配置

每个字段对象可以包含以下属性：

| 属性名 | 类型 | 说明 | 默认值 |
|--------|------|------|--------|
| name | string | 字段名（唯一标识，用于表单值 key） | - |
| label | string | 表单项标签（用于 FormItem 的 label） | - |
| rules | Array<Object> | 校验规则数组（同 antd Form 使用方式） | - |
| component | React.ReactElement | 表单控件组件 | `<Input />` |
| componentProps | Object | 传递给 `component` 的额外 props | - |
| initialValue | any | 初始值（配合 `getFieldDecorator` 使用） | - |
| maxLength | number | 限制输入最大长度，同时在右侧显示字数统计 | - |
| showCount | boolean | 是否强制显示输入计数（配合 maxLength） | - |
| rest | Object | 其余会透传到 Form.Item 上（如 `help`、`extra`） | - |

## 使用示例

### 基本用法

```javascript
import modalWithForm from './modalWithForm';

modalWithForm({
  title: '编辑用户',
  fields: [
    {
      name: 'username',
      label: '用户名',
      rules: [{ required: true, message: '请输入用户名' }],
      component: <Input />,
      componentProps: { placeholder: '请输入用户名' },
      maxLength: 20,
    },
    {
      name: 'status',
      label: '状态',
      component: <Select>
        <Select.Option value="active">启用</Select.Option>
        <Select.Option value="inactive">禁用</Select.Option>
      </Select>,
      componentProps: { placeholder: '请选择状态' },
    },
  ],
  onOk: async (formValues) => {
    await api.updateUser(formValues);
  },
  modalProps: { width: 600 },
});
```

### 自定义底部按钮

```javascript
modalWithForm({
  title: '自定义底部',
  fields: [
    // ...字段配置
  ],
  footer: (
    <div>
      <Button key="custom" type="danger">
        自定义按钮
      </Button>
    </div>
  ),
});
```

### 隐藏底部按钮

```javascript
modalWithForm({
  title: '无底部按钮',
  fields: [
    // ...字段配置
  ],
  footer: false,
});
```

## 实现细节

1. **DOM 管理**：组件会自动创建和销毁 DOM 节点，避免内存泄漏
2. **表单验证**：内置表单验证功能，支持 Ant Design 的所有验证规则
3. **异步处理**：当 `onOk` 返回 Promise 时，自动处理 loading 状态和模态框关闭
4. **输入计数**：当设置 `maxLength` 时，自动显示当前输入长度和最大长度
5. **无障碍**：模态框关闭后会自动 blur 当前焦点元素，避免 aria 警告

## 注意事项

1. 组件依赖于 Ant Design 的 `Modal`、`Form`、`Input`、`Button` 等组件，请确保已正确安装
2. 在 React 16 及以下版本中，需要使用 `Form.create()` 包裹表单组件
3. 如果需要在回调函数中访问组件实例，可以使用 `wrappedComponentRef` 属性


## 完整代码

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { Modal, Button, Form, Input } from 'antd';

const FormItem = Form.Item;


/**
 * 弹出一个带表单的模态框，支持动态字段配置、自定义组件、校验规则、loading 等。
 *
 * @function modalWithForm
 * @param {Object} config 配置对象，用于自定义弹窗和表单内容
 * @param {string} config.title 模态框标题
 * @param {Array<Object>} config.fields 表单字段配置数组
 * @param {string} config.fields[].name 字段名（唯一标识，用于表单值 key）
 * @param {string} config.fields[].label 表单项标签（用于 FormItem 的 label）
 * @param {Array<Object>} [config.fields[].rules] 校验规则数组（同 antd Form 使用方式）
 * @param {React.ReactElement} [config.fields[].component] 表单控件组件（默认为 `<Input />`）
 * @param {Object} [config.fields[].componentProps] 传递给 `component` 的额外 props
 * @param {any} [config.fields[].initialValue] 初始值（配合 `getFieldDecorator` 使用）
 * @param {number} [config.fields[].maxLength] 限制输入最大长度，同时在右侧显示字数统计
 * @param {boolean} [config.fields[].showCount] 是否强制显示输入计数（配合 maxLength）
 * @param {Object} [config.fields[].rest] 其余会透传到 Form.Item 上（如 `help`、`extra`）
 *
 * @param {Function} [config.onOk] 点击“确定”后的回调函数，参数为表单数据对象（如返回 Promise，将自动处理 loading 和关闭）
 * @param {Function} [config.onCancel] 点击“取消”或关闭时的回调函数
 * @param {React.ReactNode|false} [config.footer] 自定义底部按钮区域，传 false 可隐藏 footer
 * @param {Object} [config.modalProps] 传给 Modal 的原生 props（如 `width`、`maskClosable` 等）
 *
 * @example
 * modalWithForm({
 *   title: '编辑用户',
 *   fields: [
 *     {
 *       name: 'username',
 *       label: '用户名',
 *       rules: [{ required: true, message: '请输入用户名' }],
 *       component: <Input />,
 *       componentProps: { placeholder: '请输入用户名' },
 *       maxLength: 20,
 *     },
 *     {
 *       name: 'status',
 *       label: '状态',
 *       component: <Select>
 *         <Select.Option value="active">启用</Select.Option>
 *         <Select.Option value="inactive">禁用</Select.Option>
 *       </Select>,
 *       componentProps: { placeholder: '请选择状态' },
 *     },
 *   ],
 *   onOk: async (formValues) => {
 *     await api.updateUser(formValues);
 *   },
 *   modalProps: { width: 600 },
 * });
 */

function modalWithForm(config) {
  const div = document.createElement('div');
  document.body.appendChild(div);

  let formRef = null;

  const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  const DynamicForm = Form.create()(
    class extends React.Component {
      renderField = (field) => {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const {
          name,
          label,
          rules,
          component = <Input style={{ width: '100%' }} />,
          maxLength,
          initialValue,
          componentProps = {},
          ...rest
        } = field;

        return (
          <FormItem label={label} key={name} {...formLayout} {...rest}>
            {getFieldDecorator(name, { rules, initialValue })(
              React.cloneElement(component, {
                maxLength,
                ...componentProps,
              })
            )}
            {typeof maxLength === 'number' && (
              <span style={{ color: '#bfbfbf', marginLeft: 10, position: 'absolute' }}>
                {getFieldValue(name)?.length || 0}/{maxLength}
              </span>
            )}
          </FormItem>
        );
      };


      render() {
        return <Form layout="horizontal">{config.fields.map(this.renderField)}</Form>;
      }
    }
  );

  class ModalWrapper extends React.Component {
    state = {
      visible: true,
      confirmLoading: false, //  loading 状态
    };

    close = () => {
      this.setState({ visible: false });
    };

    handleOk = () => {
      if (!formRef || !formRef.props || !formRef.props.form) {
        console.warn('Form 未准备好');
        return;
      }

      const { form } = formRef.props;
      form.validateFields((err, values) => {
        if (!err) {
          const ret = config.onOk?.(values);
          if (ret && ret.then) {
            this.setState({ confirmLoading: true }); //  开启 loading
            ret
              .then(() => {
                this.setState({ confirmLoading: false });
                this.close();
              })
              .catch(() => {
                this.setState({ confirmLoading: false });
              });
          } else {
            this.close();
          }
        }
      });
    };

    handleCancel = () => {
      if (typeof config.onCancel === 'function') {
        config.onCancel();
      }
      this.close();
    };

    render() {
      return (
        <Modal
          visible={this.state.visible}
          title={config.title}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          confirmLoading={this.state.confirmLoading} // ✅ 传入 loading 状态
          afterClose={() => {
            // blur 防止 aria 警告
            if (document.activeElement?.blur) {
              document.activeElement.blur();
            }
            ReactDOM.unmountComponentAtNode(div);
            if (div.parentNode) {
              div.parentNode.removeChild(div);
            }
          }}
          footer={
            config.footer !== undefined
              ? config.footer
              : [
                <Button key="cancel" onClick={this.handleCancel}>
                  取消
                </Button>,
                <Button
                  key="ok"
                  type="primary"
                  onClick={this.handleOk}
                  loading={this.state.confirmLoading}
                >
                  确定
                </Button>,
              ]
          }
          {...config.modalProps}
        >
          <DynamicForm wrappedComponentRef={ref => { formRef = ref; }} />
        </Modal>
      );
    }
  }

  ReactDOM.render(<ModalWrapper />, div);
}

export default modalWithForm;

```