#react/自定义hook 
# useUpdateEffect

> useUpdateEffect 用法等同于 useEffect，但是会忽略首次执行，只在依赖更新时执行。

```javaScript
function useUpdateEffect(fn, inputs) {
  const didMountRef = useRef(false);
  useEffect(() => {
  // 测试
    console.log(11)
    if (didMountRef.current) fn();
    else didMountRef.current = true;
  }, inputs);
}

```

```javaScript
useUpdateEffect(() => {
  // 测试
    console.log(22)
}, [user]);

```
