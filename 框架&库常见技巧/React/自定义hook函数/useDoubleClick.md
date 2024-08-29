### `useDoubleClick` 自定义 Hook 技术文档

`useDoubleClick` 是一个用于区分单击和双击事件的 React 自定义 Hook。它能够在用户单击时延迟触发单击事件处理函数，并在用户进行双击操作时取消该延迟，从而区分单击和双击行为。

#### 1. 使用场景

1. **区分单击和双击**：在一些应用场景中，需要区分用户的单击和双击操作。例如，用户单击可以选择或打开项目，双击则可以进入编辑模式。
2. **避免事件冲突**：通过延迟和取消操作，防止单击和双击事件的冲突，实现更加精确的用户交互体验。
3. **提升用户体验**：为用户提供更灵活的操作方式，同时避免因误操作导致的意外行为。

#### 2. 实现原理

`useDoubleClick` 通过引入一个可取消的 Promise（`cancellablePromise`），来实现延迟和取消功能。

- **单击事件**：用户单击时，创建一个延迟 300 毫秒的可取消 Promise（`waitForClick`）。在 300 毫秒内，如果没有检测到双击事件，Promise 将被解析并执行单击事件处理函数 `onClick`；如果检测到双击事件，则取消 Promise。
- **双击事件**：用户双击时，立即清除待处理的单击 Promise，执行双击事件处理函数 `onDoubleClick`。

#### 3. 使用介绍

##### 3.1 安装与引入

在你的项目中创建一个 `useDoubleClick.js` 文件，并粘贴以下代码：

```javascript

const cancellablePromise = promise => {
    let isCanceled = false;

    const wrappedPromise = new Promise((resolve, reject) => {
        promise.then(
            value => (isCanceled ? reject({ isCanceled, value }) : resolve(value)),
            error => reject({ isCanceled, error }),
        );
    });

    return {
        promise: wrappedPromise,
        cancel: () => (isCanceled = true),
    };
};

const useCancellablePromises = () => {
    const pendingPromises = useRef([]);

    const appendPendingPromise = promise =>
        pendingPromises.current = [...pendingPromises.current, promise];

    const removePendingPromise = promise =>
        pendingPromises.current = pendingPromises.current.filter(p => p !== promise);

    const clearPendingPromises = () => pendingPromises.current.map(p => p.cancel());

    const api = {
        appendPendingPromise,
        removePendingPromise,
        clearPendingPromises,
    };

    return api;
};
const delay = n => new Promise(resolve => setTimeout(resolve, n));

// 第一个参数为单击事件函数 第二个参数为双击事件函数  
const useDoubleClick = (onClick, onDoubleClick) => {
    const api = useCancellablePromises();

    const handleClick = () => {
        api.clearPendingPromises();
        const waitForClick = cancellablePromise(delay(300));
        api.appendPendingPromise(waitForClick);

        return waitForClick.promise
            .then(() => {
                api.removePendingPromise(waitForClick);
                onClick();
            })
            .catch(errorInfo => {
                api.removePendingPromise(waitForClick);
                if (!errorInfo.isCanceled) {
                    throw errorInfo.error;
                }
            });
    };

    const handleDoubleClick = () => {
        api.clearPendingPromises();
        onDoubleClick();
    };

    return [handleClick, handleDoubleClick];
};
```

##### 3.2 使用步骤

1. **引入 Hook**：在需要区分单击和双击事件的组件中引入 `useDoubleClick`。
2. **调用 Hook**：传入两个参数，分别为单击事件处理函数 `onClick` 和双击事件处理函数 `onDoubleClick`。
3. **绑定事件**：将返回的 `handleClick` 和 `handleDoubleClick` 函数绑定到需要监听的元素上。

##### 3.3 示例代码

```jsx
import React from 'react';
import useDoubleClick from './useDoubleClick';

const MyComponent = () => {
    const [handleClick, handleDoubleClick] = useDoubleClick(
        () => {
            console.log("单击事件触发");
        },
        () => {
            console.log("双击事件触发");
        }
    );

    return (
        <div
            onDoubleClick={handleDoubleClick}
            onClick={handleClick}
        >
            点击
        </div>
    );
};

export default MyComponent;
```

#### 4. 参数说明

- **`onClick`**：单击事件处理函数，当用户单击时在延迟后触发。
- **`onDoubleClick`**：双击事件处理函数，当用户双击时立即触发。

#### 5. 优势

- **提高用户体验**：避免单击和双击事件冲突，提供灵活的操作体验。
- **复用性高**：通过封装成 Hook，可以在不同的组件中轻松使用，提高代码的可维护性和一致性。
- **简单易用**：使用简单，不需要额外的依赖。

#### 6. 兼容性

- **浏览器支持**：该 Hook 依赖于 React Hooks 和 JavaScript 的 Promise 特性，现代浏览器均支持这些特性。

#### 7. 注意事项

- **延迟时间调整**：默认延迟时间为 300 毫秒，可以根据需要调整 `delay` 函数的时间。
- **事件冲突处理**：确保在绑定事件时避免重复定义 `onClick` 和 `onDoubleClick` 事件，防止冲突。

#### 8. 总结

`useDoubleClick` 是一个简单而高效的 React 自定义 Hook，用于区分单击和双击事件，通过引入可取消的 Promise 实现延迟和取消功能。它能够显著提升用户体验，使开发者能够更灵活地处理用户的交互操作。


