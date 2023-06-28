
# 通过url链接下载图片

```javascript
    const downImg = _url => {
        const url = _url;
        fetch(url)
            .then(res => res.blob())
            .then(blob => {
                // 将链接地址字符内容转变成blob地址
                const aLink = document.createElement('a');
                aLink.href = URL.createObjectURL(blob);
                // 文件名字
                aLink.download = `2222.jpg`;
                document.body.appendChild(aLink);
                aLink.click();
                aLink.remove();
            });
    };
```
