```JSX

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

使用方法

```JSX
const [handleClick, handleDoubleClick] = useClickPreventionOnDoubleClick(
  () => {
    console.log("on click")
  }, () => {
    console.log("on double click")
  });


<div
  onDoubleClick={handleDoubleClick}
  onClick={handleClick}
>
  点击
</div>
```