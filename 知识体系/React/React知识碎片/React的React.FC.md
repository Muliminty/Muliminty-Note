✏ `React.FC`是函数式组件，是在[TypeScript](https://so.csdn.net/so/search?q=TypeScript&spm=1001.2101.3001.7020)使用的一个泛型，FC就是FunctionComponent的缩写，事实上`React.FC`可以写成`React.FunctionComponent`：

```TypeScript
const App: React.FunctionComponent<{ message: string }> = ({ message }) => (
  <div>{message}</div>
);
```

✏ React.FC 包含了 PropsWithChildren 的泛型，不用显式的声明 props.children 的类型。React.FC<> 对于返回类型是显式的，而普通函数版本是隐式的（否则需要附加注释）。

✏ React.FC提供了类型检查和自动完成的静态属性：displayName，propTypes和defaultProps（注意：defaultProps与React.FC结合使用会存在一些问题）。

✏ 我们使用React.FC来写 React 组件的时候，是不能用setState的，取而代之的是useState()、useEffect等 Hook API。

例子（这里使用阿里的Ant Desgin Pro框架来演示）：

```TypeScript
const SampleModel: React.FC<{}> = () =>{   //React.FC<>为typescript使用的泛型
  	const [createModalVisible, handleModalVisible] = useState<boolean>(false); 
  	return{
  	{/** 触发模态框**/}
  	<Button style={{fontSize:'25px'}}  onClick={()=>handleModalVisible(true)} >样例</Button>
  	{/** 模态框组件**/}
  	<Model onCancel={() => handleModalVisible(false)} ModalVisible={createModalVisible} /> 
  }

```