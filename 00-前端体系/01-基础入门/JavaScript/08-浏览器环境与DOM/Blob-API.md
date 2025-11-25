# Blob API（Blob API）

> Blob（Binary Large Object）API 提供了对二进制数据的操作能力，是 File API 的基础。
> 
> **参考规范**：[File API - Blob](https://www.w3.org/TR/FileAPI/#blob)

---

## 📚 目录

- [1. Blob 对象](#1-blob-对象)
- [2. Blob 创建](#2-blob-创建)
- [3. Blob 操作](#3-blob-操作)
- [4. Blob URL](#4-blob-url)
- [5. 实际应用](#5-实际应用)

---

## 1. Blob 对象

### 1.1 Blob 概述

**Blob** 表示不可变的二进制数据对象。

**特点**：
- 不可变：创建后无法修改
- 二进制数据：可以存储任何类型的二进制数据
- 大小和类型：包含数据的 MIME 类型和大小

### 1.2 Blob 属性

```javascript
const blob = new Blob(['Hello, World!'], { type: 'text/plain' });

// 大小（字节）
blob.size;        // 13

// MIME 类型
blob.type;        // "text/plain"
```

### 1.3 Blob 构造函数

```javascript
// 基本语法
new Blob(blobParts, options);

// blobParts: 数组，包含字符串、ArrayBuffer、Blob 等
// options: 可选配置对象
//   - type: MIME 类型（默认 "text/plain"）
//   - endings: 行结束符处理（"transparent" 或 "native"）
```

---

## 2. Blob 创建

### 2.1 从字符串创建

```javascript
// 文本 Blob
const textBlob = new Blob(['Hello, World!'], { type: 'text/plain' });

// HTML Blob
const htmlBlob = new Blob(['<h1>Hello</h1>'], { type: 'text/html' });

// JSON Blob
const jsonBlob = new Blob([JSON.stringify({ name: 'John' })], {
  type: 'application/json',
});

// CSV Blob
const csvBlob = new Blob(['name,age\nJohn,30'], { type: 'text/csv' });
```

### 2.2 从 ArrayBuffer 创建

```javascript
// 创建 ArrayBuffer
const buffer = new ArrayBuffer(8);
const view = new Uint8Array(buffer);
view[0] = 72; // 'H'
view[1] = 101; // 'e'
view[2] = 108; // 'l'
view[3] = 108; // 'l'
view[4] = 111; // 'o'

// 从 ArrayBuffer 创建 Blob
const blob = new Blob([buffer], { type: 'application/octet-stream' });
```

### 2.3 从多个数据源创建

```javascript
// 组合多个数据源
const blob = new Blob([
  'Hello, ',
  new Uint8Array([87, 111, 114, 108, 100]), // "World"
  '!',
], { type: 'text/plain' });
```

### 2.4 从 Blob 创建

```javascript
const blob1 = new Blob(['Hello'], { type: 'text/plain' });
const blob2 = new Blob([' World'], { type: 'text/plain' });

// 组合多个 Blob
const combinedBlob = new Blob([blob1, blob2], { type: 'text/plain' });
```

---

## 3. Blob 操作

### 3.1 切片（slice）

```javascript
const blob = new Blob(['Hello, World!'], { type: 'text/plain' });

// 切片（从索引 0 开始，取 5 个字节）
const chunk1 = blob.slice(0, 5); // "Hello"

// 切片（从索引 7 开始，取到末尾）
const chunk2 = blob.slice(7); // "World!"

// 切片（从索引 7 开始，取 5 个字节）
const chunk3 = blob.slice(7, 12); // "World"

// 切片（指定 MIME 类型）
const chunk4 = blob.slice(0, 5, 'text/plain');
```

### 3.2 读取为文本

```javascript
const blob = new Blob(['Hello, World!'], { type: 'text/plain' });

// 读取为文本（Promise）
blob.text().then(text => {
  console.log(text); // "Hello, World!"
});

// 使用 async/await
async function readBlobText(blob) {
  const text = await blob.text();
  console.log(text);
}
```

### 3.3 读取为 ArrayBuffer

```javascript
const blob = new Blob(['Hello, World!'], { type: 'text/plain' });

// 读取为 ArrayBuffer（Promise）
blob.arrayBuffer().then(buffer => {
  const view = new Uint8Array(buffer);
  console.log(view); // Uint8Array(13) [72, 101, 108, 108, 111, ...]
});

// 使用 async/await
async function readBlobBuffer(blob) {
  const buffer = await blob.arrayBuffer();
  console.log(buffer);
}
```

### 3.4 读取为流

```javascript
const blob = new Blob(['Hello, World!'], { type: 'text/plain' });

// 获取 ReadableStream
const stream = blob.stream();

// 读取流
const reader = stream.getReader();
reader.read().then(({ done, value }) => {
  if (!done) {
    console.log(value); // Uint8Array
  }
});
```

### 3.5 转换为 Data URL

```javascript
const blob = new Blob(['Hello, World!'], { type: 'text/plain' });

// 使用 FileReader（传统方式）
const reader = new FileReader();
reader.onload = (e) => {
  console.log(e.target.result); // "data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=="
};
reader.readAsDataURL(blob);

// 使用 Promise 封装
function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// 使用
blobToDataURL(blob).then(dataURL => {
  console.log(dataURL);
});
```

---

## 4. Blob URL

### 4.1 创建 Blob URL

```javascript
const blob = new Blob(['Hello, World!'], { type: 'text/plain' });

// 创建 Blob URL
const blobURL = URL.createObjectURL(blob);
console.log(blobURL); // "blob:http://localhost:3000/abc123-def456-..."

// 使用 Blob URL
const link = document.createElement('a');
link.href = blobURL;
link.download = 'file.txt';
link.textContent = 'Download';
document.body.appendChild(link);
```

### 4.2 释放 Blob URL

```javascript
const blob = new Blob(['Hello, World!'], { type: 'text/plain' });
const blobURL = URL.createObjectURL(blob);

// 使用 Blob URL
// ...

// 释放 Blob URL（释放内存）
URL.revokeObjectURL(blobURL);
```

### 4.3 图片预览

```javascript
// 从文件创建 Blob URL
const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const blobURL = URL.createObjectURL(file);
  
  // 显示图片
  const img = document.createElement('img');
  img.src = blobURL;
  document.body.appendChild(img);
  
  // 使用完后释放
  img.onload = () => {
    URL.revokeObjectURL(blobURL);
  };
});
```

### 4.4 视频预览

```javascript
// 视频预览
const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const blobURL = URL.createObjectURL(file);
  
  // 显示视频
  const video = document.createElement('video');
  video.src = blobURL;
  video.controls = true;
  document.body.appendChild(video);
  
  // 使用完后释放
  video.onload = () => {
    URL.revokeObjectURL(blobURL);
  };
});
```

---

## 5. 实际应用

### 5.1 文件下载

```javascript
// 下载文本文件
function downloadText(text, filename) {
  const blob = new Blob([text], { type: 'text/plain' });
  const blobURL = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = blobURL;
  link.download = filename;
  link.click();
  
  URL.revokeObjectURL(blobURL);
}

// 下载 JSON 文件
function downloadJSON(data, filename) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const blobURL = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = blobURL;
  link.download = filename;
  link.click();
  
  URL.revokeObjectURL(blobURL);
}

// 下载 CSV 文件
function downloadCSV(data, filename) {
  const csv = data.map(row => row.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const blobURL = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = blobURL;
  link.download = filename;
  link.click();
  
  URL.revokeObjectURL(blobURL);
}
```

### 5.2 图片压缩

```javascript
// 图片压缩
function compressImage(file, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// 使用
const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  const compressedBlob = await compressImage(file, 0.8);
  console.log('Original size:', file.size);
  console.log('Compressed size:', compressedBlob.size);
});
```

### 5.3 文件分片

```javascript
// 文件分片
function chunkBlob(blob, chunkSize = 1024 * 1024) {
  const chunks = [];
  let start = 0;
  
  while (start < blob.size) {
    const end = Math.min(start + chunkSize, blob.size);
    const chunk = blob.slice(start, end);
    chunks.push(chunk);
    start = end;
  }
  
  return chunks;
}

// 使用
const blob = new Blob([/* large data */]);
const chunks = chunkBlob(blob, 2 * 1024 * 1024); // 2MB chunks
console.log('Total chunks:', chunks.length);
```

### 5.4 合并 Blob

```javascript
// 合并多个 Blob
function mergeBlobs(blobs, type = 'application/octet-stream') {
  return new Blob(blobs, { type });
}

// 使用
const blob1 = new Blob(['Hello, ']);
const blob2 = new Blob(['World!']);
const merged = mergeBlobs([blob1, blob2], 'text/plain');

merged.text().then(text => {
  console.log(text); // "Hello, World!"
});
```

### 5.5 数据转换

```javascript
// Blob 转 Base64
async function blobToBase64(blob) {
  const dataURL = await blobToDataURL(blob);
  return dataURL.split(',')[1];
}

// Base64 转 Blob
function base64ToBlob(base64, type = 'application/octet-stream') {
  const binary = atob(base64);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }
  return new Blob([array], { type });
}

// 使用
const blob = new Blob(['Hello, World!'], { type: 'text/plain' });
blobToBase64(blob).then(base64 => {
  console.log(base64); // "SGVsbG8sIFdvcmxkIQ=="
  
  const newBlob = base64ToBlob(base64, 'text/plain');
  newBlob.text().then(text => {
    console.log(text); // "Hello, World!"
  });
});
```

### 5.6 文件上传

```javascript
// 使用 Blob 上传文件
async function uploadBlob(blob, filename) {
  const formData = new FormData();
  formData.append('file', blob, filename);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
  
  return response.json();
}

// 使用
const blob = new Blob(['Hello, World!'], { type: 'text/plain' });
uploadBlob(blob, 'file.txt').then(result => {
  console.log('Upload successful:', result);
});
```

---

## 🔗 相关链接

### 相关 API
- [File API](./File-API.md) — 文件对象（File 继承自 Blob）
- [FileReader API](./FileReader-API.md) — 文件读取
- [FormData API](./FormData-API.md) — 表单数据和文件上传

### 实际应用
- [前端大文件上传](../../../../00-经验技巧/前端大文件上传.md) — 大文件上传实现

---

**最后更新**：2025  
**参考规范**：[File API - Blob](https://www.w3.org/TR/FileAPI/#blob)

---

#javascript #BlobAPI #二进制数据 #浏览器API

