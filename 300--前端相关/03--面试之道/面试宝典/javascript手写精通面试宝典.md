
# 手写题

## 常见算法

### 函数防抖debounce

> 在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时。

**简单理解：**

>防抖就是回城，每一次触发事件就会重新读秒

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <input type="text" id="inp">
</body>
<script>
    let input = document.querySelector('#inp')
    input.addEventListener('input', function (e) {
        let val = e.target.value
        debounceAjax(val)
    })

    function debounce(fun, time = 0) {
        return function (args) {
            let _args = args
            clearTimeout(fun.id)
            fun.id = setTimeout(function () {
                fun(_args)
            }, time)
        }
    }
    function ajax(content) {
        console.log('content: ', content);
    }
    let debounceAjax = debounce(ajax, 500)

</script>

</html>
```

### 函数节流throttle
>
> 让一个函数无法在很短的时间间隔内连续调用

**简单理解：**
> 简单理解为技能cd，5秒只能释放一次

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <input type="text" id="inp">
</body>
<script>
    let input = document.querySelector('#inp')
    input.addEventListener('input', function (e) {
        let val = e.target.value
        debounceAjax(val)
    })
    function throttle(fun, time = 0) {
        let start = 0
        return function (args) {
            let now = new Date().getTime()
            if (now - start > time) {
                fun(args)
                start = now
            }
        }
    }
    function ajax(content) {
        console.log('content: ', content);
    }
    let debounceAjax = throttle(ajax, 3000)
</script>

</html>
```
