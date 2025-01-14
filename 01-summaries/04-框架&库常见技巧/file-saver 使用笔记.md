# file-saver 使用笔记

**file-saver** 是一个用于浏览器端下载文件的 JavaScript 库，常用于生成并下载文件，如导出 Excel 文件、PDF 文件等。该库简化了文件下载的过程，无需服务器端支持，适用于生成动态内容并下载。

## 1. 安装

首先，使用 `npm` 或 `yarn` 安装 `file-saver`：

```bash
npm install file-saver
```

或

```bash
yarn add file-saver
```

## 2. 基本用法

### 2.1 导出文本文件

```javascript
import { saveAs } from 'file-saver';

const text = 'Hello, World!';
const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });

saveAs(blob, 'hello.txt');
```

这段代码创建了一个包含文本内容的 Blob 对象，并使用 `saveAs` 方法将文件保存为 `hello.txt`。

### 2.2 导出 JSON 文件

```javascript
import { saveAs } from 'file-saver';

const json = { name: 'John', age: 30 };
const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json;charset=utf-8' });

saveAs(blob, 'data.json');
```

这个例子演示了如何导出 JSON 数据为文件。通过 `JSON.stringify` 方法将 JavaScript 对象转换为 JSON 字符串。

### 2.3 导出图片文件

```javascript
import { saveAs } from 'file-saver';

const imageUrl = 'https://example.com/image.png';
fetch(imageUrl)
  .then(response => response.blob())
  .then(blob => {
    saveAs(blob, 'image.png');
  })
  .catch(error => console.error('Error downloading image:', error));
```

上面的代码演示了如何下载并保存一个远程图片文件。通过 `fetch` 请求获取图片内容，并将其转换为 Blob 对象，然后使用 `saveAs` 保存。

### 2.4 导出 Excel 文件（与 ExcelJS 一起使用）

结合 **ExcelJS**，您可以生成并导出 Excel 文件：

```javascript
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';

const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Sheet 1');
worksheet.addRow(['Name', 'Age']);
worksheet.addRow(['John', 30]);
worksheet.addRow(['Jane', 28]);

workbook.xlsx.writeBuffer().then(buffer => {
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, 'data.xlsx');
});
```

这段代码演示了如何使用 **ExcelJS** 创建一个简单的 Excel 文件，并通过 `file-saver` 导出为 `.xlsx` 文件。

## 3. 配置选项

`saveAs` 方法可以接受两个参数：

- **Blob**：文件数据，通常是通过 `new Blob()` 创建的。
- **filename**：保存文件的名称。

```javascript
saveAs(blob, 'filename.ext');
```

### 3.1 类型配置

可以通过 `Blob` 构造函数指定文件类型（MIME 类型），这有助于浏览器正确处理文件：

- `text/plain`：普通文本文件。
- `application/json`：JSON 文件。
- `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`：Excel 文件。
- `application/pdf`：PDF 文件。
- `image/png`：PNG 图片。

例如：

```javascript
const blob = new Blob([data], { type: 'application/pdf' });
saveAs(blob, 'document.pdf');
```

### 3.2 自动下载与取消下载

在某些情况下，您可能需要处理文件保存操作的取消或中止。`file-saver` 支持在文件保存时中止操作（例如，下载中止）。

```javascript
const blob = new Blob([data], { type: 'application/octet-stream' });
const fileSaver = saveAs(blob, 'file.dat');

// 在必要时可以通过取消操作
fileSaver.abort();
```

### 3.3 文件路径与自定义名称

文件名可以在调用 `saveAs` 时动态指定，这为文件导出提供了更大的灵活性。您可以根据需求调整文件名，或者根据用户输入来命名文件。

```javascript
const fileName = `report_${new Date().toISOString()}.csv`;
saveAs(blob, fileName);
```

## 4. 兼容性

`file-saver` 支持现代浏览器，尤其是在 **Chrome**、**Firefox** 和 **Edge** 中表现良好。对于 IE11 和早期版本的浏览器，它使用 **Blob.js** 作为兼容性填充。

如果需要支持旧版本的浏览器，可以引入 `FileSaver.js` 的 polyfill。

## 5. 总结

**file-saver** 是一个轻量级的 JavaScript 库，简化了浏览器端的文件保存操作。结合不同的 Blob 类型，您可以导出文本、JSON、图片、Excel 文件等，并灵活控制文件名和文件类型。它的 API 简单且易用，非常适合前端开发中生成动态文件并提供下载的场景。

## 6. 完整示例

```javascript
import { saveAs } from 'file-saver';

// 创建一个文本文件并导出
const text = 'Hello, file-saver!';
const textBlob = new Blob([text], { type: 'text/plain;charset=utf-8' });
saveAs(textBlob, 'hello.txt');

// 创建一个 JSON 文件并导出
const jsonData = { name: 'Alice', age: 25 };
const jsonBlob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json;charset=utf-8' });
saveAs(jsonBlob, 'user.json');

// 导出 Excel 文件
import * as ExcelJS from 'exceljs';

const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Sheet 1');
worksheet.addRow(['Name', 'Age']);
worksheet.addRow(['John', 30]);
worksheet.addRow(['Jane', 28]);

workbook.xlsx.writeBuffer().then(buffer => {
  const excelBlob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(excelBlob, 'data.xlsx');
});
```

---

通过这些方法，您可以轻松地在前端生成并下载各种类型的文件，提升用户体验并增强应用的功能性。