#react/自定义hook 

```jsx
import { useState, useRef, useEffect } from 'react'


/**
 * 组件全屏hook
 * 
 * 用法 
 * const [isFullScreen, fullScreen, exitFullScreen, fullScreenRef] = useFullScreen()
 * 
 */
function useFullScreen() {
    const fullScreenRef = useRef()// 需要全屏的div

    const [isFullScreen, setIsFullScreen] = useState(false);// 是否全屏

    useEffect(() => {
        // 监听页面全屏事件
        window.onresize = () => {
            // 全屏
            if (document.fullscreenElement) {
                setIsFullScreen(true)
            }
            // 不是全屏
            else {
                setIsFullScreen(false)
            }
        }

    }, [])
    // 全屏
    const fullScreen = () => {
        if (!isFullScreen) {
            fullScreenRef.current.requestFullscreen();
        }
    }

    // 退出全屏
    const exitFullScreen = () => {
        document.exitFullscreen();
    }

    return [isFullScreen, fullScreen, exitFullScreen, fullScreenRef]
}




export default useFullScreen

```