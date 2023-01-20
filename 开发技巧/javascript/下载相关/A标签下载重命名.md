
# 下载重命名

> [参考链接](https://blog.csdn.net/xi_nuo/article/details/104795963)

```javascript
/**
 * 下载
 * @param  {String} url 目标文件地址
 * @param  {String} filename 想要保存的文件名称
 */
function courseDownload(url, filename) {
    getBlob(url, function(blob) {
        saveAs(blob, filename);
    })
}
function getBlob(url,cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = function() {
        if (xhr.status === 200) {
            cb(xhr.response);
        }
    };
    xhr.send();
}
/**
 * 保存
 * @param  {Blob} blob
 * @param  {String} filename 想要保存的文件名称
 */
function saveAs(blob, filename) {
    if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement('a');
        var body = document.querySelector('body');
 
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
 
        // fix Firefox
        link.style.display = 'none';
        body.appendChild(link);
 
        link.click();
        body.removeChild(link);
 
        window.URL.revokeObjectURL(link.href);
    }
}

```
