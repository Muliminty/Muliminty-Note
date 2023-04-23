[[../../../剪藏/JavaScript/JavaScript中 FileReader 对象详解|原文]]

**`FileReader`** 对象允许 Web 应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容，使用 [`File`](https://developer.mozilla.org/zh-CN/docs/Web/API/File) 或 [`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) 对象指定要读取的文件或数据。

其中 File 对象可以是来自用户在一个[`<input>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/input)元素上选择文件后返回的[`FileList`](https://developer.mozilla.org/zh-CN/docs/Web/API/FileList)对象，也可以来自拖放操作生成的 [`DataTransfer`](https://developer.mozilla.org/zh-CN/docs/Web/API/DataTransfer)对象，还可以是来自在一个[`HTMLCanvasElement`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement)上执行`mozGetAsFile()`方法后返回结果。

重要提示：FileReader 仅用于以安全的方式从用户（远程）系统读取文件内容 它不能用于从文件系统中按路径名简单地读取文件。要在 JavaScript 中按路径名读取文件，应使用标准 Ajax 解决方案进行服务器端文件读取，如果读取跨域，则使用 CORS 权限。

#### 属性

| 属性 | 描述 |
|--|--|
| FileReader.error | 一个DOMException，表示在读取文件时发生的错误 。 |
| FileReader.result | 返回文件的内容。只有在读取操作完成后，此属性才有效，返回的数据的格式取决于是使用哪种读取方法来执行读取操作的 |
| FileReader.readyState | 表示FileReader状态的数字。 EMPTY 0 还没有加载任何数据。 LOADING 1 数据正在被加载。DONE 2 已完成全部的读取请求。 |

#### 方法

FileReader 的实例拥有 4 个方法，其中 3 个用以读取文件，另一个用来中断读取。 下面的表格列出了这些方法以及他们的参数和功能，

需要注意的是 ，无论读取成功或失败，方法并不会返回读取结果，这一结果存储在 result属性中。

| 属性 | 描述 |
|--|--|
| FileReader.abort() | 	中止读取操作。在返回时，readyState 属性为 DONE。 |
| FileReader.readAsArrayBuffer() | 开始读取指定的 Blob 中的内容。 一旦完成，result 属性中保存的将是被读取文件的 ArrayBuffer 数据对象。 |
| FileReader.readAsBinaryString() | 开始读取指定的 Blob 中的内容。一旦完成，result 属性中将包含所读取文件的原始二进制数据。 |
| FileReader.readAsDataURL() | 开始读取指定的 Blob 中的内容。一旦完成，result 属性中将包含一个 data: URL 格式的 Base64 字符串以表示所读取文件的内容。 |
| FileReader.readAsText() | 开始读取指定的Blob中的内容。一旦完成，result 属性中将包含一个字符串以表示所读取的文件内容。 |


#### 事件处理

FileReader 包含了一套完整的事件模型，用于捕获读取文件时的状态，下面这个表格归纳了这些事件。

| 属性 | 描述 |
|--|--|
| FileReader.onabort | 处理 abort 事件。该事件在读取操作被中断时触发。 |
| FileReader.onerror | 处理 error 事件。该事件在读取操作发生错误时触发。 |
| FileReader.onload | 处理 load 事件。该事件在读取操作完成时触发。 |
| FileReader.onloadstart | 处理 loadstart 事件。该事件在读取操作开始时触发。 |
| FileReader.onloadend | 处理 loadend 事件。该事件在读取操作结束时（要么成功，要么失败）触发。 |
| FileReader.onprogress | 处理 progress 事件。该事件在读取Blob时触发。 |


