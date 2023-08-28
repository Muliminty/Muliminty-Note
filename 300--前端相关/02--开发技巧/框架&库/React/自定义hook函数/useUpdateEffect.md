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

由于inputs参数是一个动态的变量，ESLint无法静态地确定它的值。因此，它会发出警告，建议你使用一个固定的、可静态验证的数组字面量作为依赖项。

为了解决这个问题，可以对inputs变量进行相关的处理，以确保它是一个固定的、可静态验证的数组。一种常见的做法是使用useMemo钩子将inputs变量包装成一个稳定的引用：

在这个例子中，我们使用了useMemo将inputs变量包装成了stableInputs，然后将stableInputs作为useEffect的依赖项。这样，ESLint就能够确定该依赖项是固定的，并且能够静态地验证它。
``` js
//升级版

import { useRef, useEffect, useMemo } from "react";
function useUpdateEffect(fn, inputs) {
  const didMountRef = useRef(false);
  const prevInputsRef = useRef(inputs);
  const stableInputs = useMemo(() => inputs, [inputs]);

  // 使用useEffect函数，当didMountRef的值发生变化时，执行fn函数
  useEffect(() => {
    // 如果didMountRef的值为true，则执行fn函数
    if (didMountRef.current) {
      // 判断stableInputs是否每一项的值都相等
      const isSame = stableInputs.every((value, index) => value === prevInputsRef.current[index]);
      // 如果不相等，则执行fn函数
      if (!isSame) {
        fn();
      }
    } else {
      // 否则，将didMountRef的值设置为true
      didMountRef.current = true;
    }
    // 将上一次输入设置为当前输入
    prevInputsRef.current = stableInputs;
  }, [fn, stableInputs]);

}

// 导出一个函数，用于更新依赖
export default useUpdateEffect;
```

```javaScript
useUpdateEffect(() => {
  // 测试
    console.log(22)
}, [user]);

```
