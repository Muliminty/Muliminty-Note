-   useState用于异步更改状态的值，所以本身的异步的；
-   有个场景，在useState更改值后想马上使用改变后的值，这种情况我们可以换一种抒写方式  

![alt](附件/Pasted%20image%2020230426151310.png)

以上代码也就是说，我们可以把想同步获取最新的值的代码写入到回调函数中，通过这种方式进行处理；

```JSX
function handleAdd = ()=>{
setCount((count)=>{
	return count + 1 ;
})
}

```