#表单技巧 

![](附件/Pasted%20image%2020250213162706.png)

在开发表单时，有时我们需要支持动态增减表单项的功能，例如用户可以自由添加和删除输入项。Ant Design Pro 提供了 `ProForm` 和 `Form.List` 来帮助我们方便地实现这一功能。今天我们就来分享一下如何通过 `ProForm.Item` 和 `Form.List` 实现一个可动态增减的表单项。

#### 1. 使用 `ProForm.Item` 和 `Form.List` 组件

`ProForm.Item` 是 `ProForm` 的表单项容器，常用于单一字段的管理。而 `Form.List` 组件则适用于当你有一组相似的字段时，可以动态地添加或删除它们。通过结合 `ProForm.Item` 和 `Form.List`，我们可以实现动态增删表单项。

以下是一个完整的示例，展示了如何使用 `ProForm.Item` 配合 `Form.List` 来实现动态添加和删除输入框。

```tsx
import React from 'react';
import { Button, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { ProForm, ProFormText } from '@ant-design/pro-form';
import { Form } from 'antd';

const DynamicForm = ({ t }) => {
  return (
    <ProForm
      onFinish={async (values) => {
        console.log(values);
      }}
    >
      <ProForm.Item
        label={t('publicInfo.ProductInfo.model')}
        name="devModel"
        rules={[{ required: true, message: t('publicInfo.ProductInfo.model1') }]}
        initialValue={['']} // 设置初始值
      >
        <Form.List name="devModel">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <Space
                  className="devModelList"
                  key={key}
                  align="baseline"
                  style={{ display: 'flex', marginBottom: 8 }}
                >
                  <ProFormText
                    {...restField}
                    name={[name]}
                    rules={[{ required: true, message: t('publicInfo.ProductInfo.model1') }]}
                  />

                  {/* 最后一个显示添加按钮，其他显示删除按钮 */}
                  {index === fields.length - 1 ? (
                    <Button
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                    />
                  ) : (
                    <Button
                      danger
                      onClick={() => remove(name)}
                      icon={<DeleteOutlined />}
                    />
                  )}
                </Space>
              ))}
            </>
          )}
        </Form.List>
      </ProForm.Item>
    </ProForm>
  );
};

export default DynamicForm;
```

#### 2. 解析代码

我们使用了以下几个关键组件和方法来实现动态表单项的增删：

- **`ProForm.Item`**：用于包装每一个表单项。这里的 `name="devModel"` 表示该表单项绑定的是一个 `devModel` 字段，`rules` 设置了验证规则，`initialValue` 设置了初始值。
    
- **`Form.List`**：这个组件允许我们在表单中动态管理一组数据。在该组件的回调函数中，`fields` 数组表示当前表单中的所有项，而 `add` 和 `remove` 方法分别用于添加和删除表单项。
    
- **`ProFormText`**：这是一个用于输入文本的表单控件。我们使用它来呈现每一项输入框。通过 `restField` 属性传递给它，以确保它正确地绑定到 `Form.List` 中的每一项。
    
- **`Space`**：为了美观，我们使用了 `Space` 组件来布局每一项输入框和按钮，使它们呈现水平排列。
    

#### 3. 关键细节

- **动态增减表单项**：当点击“添加”按钮时，`add()` 方法会在表单中添加一个新的输入框。点击“删除”按钮时，`remove(name)` 方法会删除当前的输入框。这使得用户能够自由地管理输入项数量。
    
- **最后一项显示添加按钮**：在表单中，我们通过判断 `index === fields.length - 1` 来确定当前输入框是否为最后一项。如果是最后一项，则显示添加按钮；否则显示删除按钮。
    
- **表单验证**：每个表单项都通过 `rules` 属性添加了验证规则，确保每个输入框都被填充。`required: true` 表示该项是必填的。
    


