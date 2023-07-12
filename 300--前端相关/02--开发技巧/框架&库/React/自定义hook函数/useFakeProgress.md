#开发技巧/进度条  #react/自定义hook 

基于fake-progress的进度条伪造hook
用法
progress：进度条数值
start：进度条开始
end：进度条结束
```jsx


  const [progress, start, end] = useFakeProgress({ timeConstant: 30 * 1000 }) // 进度条

```


源码
```JSX
import { useState, useRef, useEffect } from "react";
import FakeProgress from '@/utils/fake-progress'

const useFakeProgress = ({ timeConstant }) => {
    const { current: progressObj } = useRef(
        new FakeProgress({
            timeConstant: timeConstant || 1000// 30s 进度条停止在99
        })
    )
    const [progress, setProgress] = useState(0);// 进度条进度
    const { current: timeObj } = useRef({
        id: null,
        Valve: false
    })// 定时器

    useEffect(() => {
        if (timeObj.Valve) {
            timeObj.id = setInterval(() => {
                setProgress(progressObj.progress)
            }, 100)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeObj.Valve])


    /**
     * 进度条开始
     */
    const start = () => {
        timeObj.Valve = true
        progressObj.start()
    }

    /**
     * 进度条结束
     */
    const end = () => {
        progressObj.end()// 结束进度条
        timeObj.Valve = false
        clearInterval(timeObj.id)
        setProgress(1)
    }

    const handleSetProgress = (v) => { setProgress(v) }

    return [progress, start, end, handleSetProgress]
}

export default useFakeProgress
```

FakeProgress源码

```js
/**
 * Represents a fakeProgress
 * @constructor
 * @param {object} options - options of the contructor
 * @param {object} [options.timeConstant=1000] - the timeConstant in milliseconds (see https://en.wikipedia.org/wiki/Time_constant)
 * @param {object} [options.autoStart=false] - if true then the progress auto start
 */

class FakeProgress {
    constructor(opts) {
        if (!opts) {
            opts = {};
        }
        // 时间快慢
        this.timeConstant = opts.timeConstant || 1000;
        // 自动开始
        this.autoStart = opts.autoStart || false;
        this.parent = opts.parent;
        this.parentStart = opts.parentStart;
        this.parentEnd = opts.parentEnd;
        this.progress = 0;
        this._intervalFrequency = 100;
        this._running = false;
        if (this.autoStart) {
            this.start();
        }
    }
    /**
     * Start fakeProgress instance
     * @method
     */
    start() {
        this._time = 0;
        this._intervalId = setInterval(
            this._onInterval.bind(this),
            this._intervalFrequency
        );
    }
    _onInterval() {
        this._time += this._intervalFrequency;
        this.setProgress(1 - Math.exp((-1 * this._time) / this.timeConstant));
    }
    /**
     * Stop fakeProgress instance and set progress to 1
     * @method
     */
    end() {
        this.stop();
        this.setProgress(1);
    }
    /**
     * Stop fakeProgress instance
     * @method
     */
    stop() {
        clearInterval(this._intervalId);
        this._intervalId = null;
    }
    /**
     * Create a sub progress bar under the first progres
     * @method
     * @param {object} options - options of the FakeProgress contructor
     * @param {object} [options.end=1] - the progress in the parent that correspond of 100% of the child
     * @param {object} [options.start=fakeprogress.progress] - the progress in the parent that correspond of 0% of the child
     */
    createSubProgress(opts) {
        const parentStart = opts.start || this.progress;
        const parentEnd = opts.end || 1;
        const options = Object.assign({}, opts, {
            parent: this,
            parentStart: parentStart,
            parentEnd: parentEnd,
            start: null,
            end: null,
        });

        const subProgress = new FakeProgress(options);
        return subProgress;
    }
    /**
     * SetProgress of the fakeProgress instance and updtae the parent
     * @method
     * @param {number} progress - the progress
     */
    setProgress(progress) {
        this.progress = progress;
        if (this.parent) {
            this.parent.setProgress(
                (this.parentEnd - this.parentStart) * this.progress + this.parentStart
            );
        }
    }
}


export default FakeProgress



```
