#表单技巧/多级联动
ProFormDependency 是 Ant Design Pro Form 中的一种属性，用于实现表单项之间的依赖关系。通过设置 ProFormDependency，当某个依赖项发生变化时，可以触发被依赖项的显示、隐藏、禁用等行为。

ProFormDependency 的用法如下：

1. 引入 ProFormDependency 组件：

```jsx
import { ProFormDependency } from '@ant-design/pro-form';
```

2. 在需要设置依赖关系的表单项上使用 ProFormDependency 属性：

```jsx
<ProFormDependency name={['checkbox']} ignoreFormItem>
  {({ checkbox }) => {
    return (
      <>
        {checkbox?.includes('1') && (
          <ProFormText
            name="input1"
            label="Input 1"
          />
        )}
        {checkbox?.includes('2') && (
          <ProFormText
            name="input2"
            label="Input 2"
          />
        )}
      </>
    );
  }}
</ProFormDependency>

```

在上述示例中，我们将需要设置依赖关系的表单项包裹在 ProFormDependency 组件内部，并设置 name 属性为触发依赖的表单项的名称。在函数参数中，可以通过解构赋值获取到被依赖项的值，然后根据值进行判断来决定显示哪些表单项。

```jsx
<ProFormCheckbox.Group
  name="checkbox"
  label="Checkbox"
  options={[
    {
      label: 'Option 1',
      value: '1',
    },
    {
      label: 'Option 2',
      value: '2',
    },
  ]}
/>

```

在上述示例中，我们使用 ProFormCheckbox.Group 组件设置了一个复选框组，并通过 name 属性设置了触发依赖项变化的名称。

这样，当复选框的选项发生变化时，ProFormDependency 中的回调函数就会被触发。根据被依赖项的值，可以动态地显示、隐藏或禁用相应的表单项。

注意事项：

+ ProFormDependency 必须作为表单项的直接父组件。
+ 在函数参数中解构赋值获取到的被依赖项的值是一个数组，因为可能会有多个触发依赖的表单项。
+ 需要根据业务需求使用条件语句来控制表单项的显示、隐藏或禁用。