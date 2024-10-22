# Ant Design Select组件下拉选项随页面滚动与Select框分离问题

　在开发过程中，会使用很多的Select、DatePicker等组件，当这些组件在可滚动的区域内滚动时，你会发现该组件的选项框也会跟着滚动，产生分离。如下图所示。

## 解决方法

通过查询相应的官方API，发现官方给我们提供了getPopupContainer属性，该属性是菜单渲染的父节点，默认是body。只要添加该属性，设置好父节点，就可以解决这种分离。

官方案例：
<iframe src="https://codepen.io/afc163/pen/zEjNOy?editors=0010"/>

```
const {
  Select
} = antd;

const Option = Select.Option;

var Hello = React.createClass({
  render() {
    return <div style={{margin: 10, overflow: 'scroll', height: 200}}>
      <h2>修复滚动区域的浮层移动问题 / please try open select and scroll the area</h2>
      <div style={{padding: 100, height: 1000, background: '#eee', position: 'relative' }} id="area">
        <h4>可滚动的区域 / scrollable area</h4>
        <Select defaultValue="lucy" style={{ width: 120 }} getPopupContainer={() => document.getElementById('area')}>
          <Option value="jack">Jack</Option>
          <Option value="lucy">Lucy</Option>
          <Option value="yiminghe">yiminghe</Option>
        </Select>
      </div>
    </div>;
  }
});

ReactDOM.render(<Hello />,
  document.getElementById('container')
);
```

参考：https://www.cnblogs.com/minorf/p/13039683.html