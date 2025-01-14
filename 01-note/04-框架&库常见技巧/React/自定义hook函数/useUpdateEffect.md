#react/自定义hook 
# useUpdateEffect

> useUpdateEffect 用法等同于 useEffect，但是会忽略首次执行，只在依赖更新时执行。


``` js
import { useRef } from 'react';
import { useEffect } from 'react';

/**
 * 创建一个用于 useEffect 钩子的更新效果的自定义钩子。
 * 此自定义钩子确保在初次渲染之后才调用效果回调。
 * @param {function} hook - 要使用的 useEffect 钩子函数（例如 useEffect、useLayoutEffect）。
 * @returns {function} - 自定义更新效果钩子函数。
 */
const createUpdateEffect = (hook) => (effect, deps) => {
  const isMounted = useRef(false);

  // for react-refresh
  hook(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  hook(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      return effect();
    }
  }, deps);
};

/**
 * 利用 createUpdateEffect 函数创建一个带有 useEffect 钩子的更新效果的自定义钩子。
 */
export const useUpdateEffect = createUpdateEffect(useEffect);

export default createUpdateEffect;

```

```javaScript
useUpdateEffect(() => {
  // 测试
    console.log(22)
}, [user]);

```
