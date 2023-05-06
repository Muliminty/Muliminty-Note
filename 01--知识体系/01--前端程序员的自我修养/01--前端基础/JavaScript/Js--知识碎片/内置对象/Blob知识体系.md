`Blob` 对象表示一个不可变、原始数据的类文件对象。它的数据可以按文本或二进制的格式进行读取，也可以转换成 [`ReadableStream`](https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream) 来用于数据操作。

Blob 表示的不一定是 JavaScript 原生格式的数据。[`File`](https://developer.mozilla.org/zh-CN/docs/Web/API/File) 接口基于 `Blob`，继承了 blob 的功能并将其扩展以支持用户系统上的文件。

## 使用 blob

要从其他非 blob 对象和数据构造一个 `Blob`，请使用 [`Blob()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob/Blob "Blob()") 构造函数。要创建一个 blob 数据的子集 blob，请使用 [`slice()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob/slice "slice()") 方法。要获取用户文件系统上的文件对应的 `Blob` 对象，请参阅 [`File`](https://developer.mozilla.org/zh-CN/docs/Web/API/File) 文档。

接受 `Blob` 对象的 API 也被列在 [`File`](https://developer.mozilla.org/zh-CN/docs/Web/API/File) 文档中。

## 构造函数

[[Blob知识碎片/Blob()|Blob()]]

返回一个新创建的 `Blob` 对象，其内容由参数中给定的数组拼接组成。

## 实例属性

[[Blob知识碎片/Blob.size|Blob.prototype.size]] `只读`
`Blob` 对象中所包含数据的大小（字节）。

[`Blob.prototype.type`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob/type)
一个字符串，表明该 `Blob` 对象所包含数据的 MIME 类型。如果类型未知，则该值为空字符串。

## 实例方法

[`Blob.prototype.arrayBuffer()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob/arrayBuffer)

返回一个 promise，其会兑现一个包含 `Blob` 所有内容的二进制格式的 [`ArrayBuffer`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)。

[`Blob.prototype.slice()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob/slice)

返回一个新的 `Blob` 对象，包含了源 `Blob` 对象中指定范围内的数据。

[`Blob.prototype.stream()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob/stream)

返回一个能读取 `Blob` 内容的 [`ReadableStream`](https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream)。

[`Blob.prototype.text()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob/text)

返回一个 promise，其会兑现一个包含 `Blob` 所有内容的 UTF-8 格式的字符串。

