# File API（File API）

> File API 提供了对文件对象的访问和操作能力，允许 Web 应用读取文件信息、读取文件内容等。
> 
> **参考规范**：[File API](https://www.w3.org/TR/FileAPI/)

---

## 📚 目录

- [1. File 对象](#1-file-对象)
- [2. FileList 对象](#2-filelist-对象)
- [3. 文件选择](#3-文件选择)
- [4. 文件拖拽](#4-文件拖拽)
- [5. 文件信息](#5-文件信息)
- [6. 实际应用](#6-实际应用)

---

## 1. File 对象

### 1.1 File 对象概述

**File 对象**是 File API 的核心，表示文件系统中的文件。

**继承关系**：
- `File` 继承自 `Blob`
- `File` 是 `Blob` 的子类

**特点**：
- 只读的文件对象
- 包含文件的元数据（名称、大小、类型、最后修改时间等）
- 可以通过 `FileReader` 或 `Blob` 方法读取内容

### 1.2 File 对象属性

```javascript
const file = input.files[0];

// 文件名称
file.name;           // "example.txt"

// 文件大小（字节）
file.size;           // 1024

// 文件 MIME 类型
file.type;           // "text/plain"

// 最后修改时间
file.lastModified;   // 1609459200000 (时间戳)

// 最后修改日期
file.lastModifiedDate; // Date 对象（已废弃，但仍可使用）
```

### 1.3 File 对象方法

**继承自 Blob 的方法**：
- `slice()` - 切片文件
- `stream()` - 获取文件流
- `text()` - 读取为文本
- `arrayBuffer()` - 读取为 ArrayBuffer
- `blob()` - 转换为 Blob

```javascript
const file = input.files[0];

// 切片文件
const chunk = file.slice(0, 1024); // 前 1024 字节

// 获取文件流
const stream = file.stream();

// 读取为文本
const text = await file.text();

// 读取为 ArrayBuffer
const buffer = await file.arrayBuffer();
```

---

## 2. FileList 对象

### 2.1 FileList 概述

**FileList** 是文件对象的集合，类似于数组但不可直接迭代。

**特点**：
- 只读的类数组对象
- 通过索引访问文件
- 具有 `length` 属性
- 可以通过 `Array.from()` 转换为数组

### 2.2 FileList 使用

```javascript
const fileInput = document.getElementById('fileInput');

// 获取 FileList
const fileList = fileInput.files;

// 获取文件数量
console.log(fileList.length); // 文件数量

// 访问文件（通过索引）
const file1 = fileList[0];
const file2 = fileList[1];

// 转换为数组
const files = Array.from(fileList);

// 遍历文件
for (let i = 0; i < fileList.length; i++) {
  console.log(fileList[i].name);
}

// 使用 for...of（需要转换为数组）
for (const file of Array.from(fileList)) {
  console.log(file.name);
}
```

---

## 3. 文件选择

### 3.1 input 元素选择文件

**HTML**：
```html
<!-- 单选文件 -->
<input type="file" id="fileInput">

<!-- 多选文件 -->
<input type="file" id="fileInput" multiple>

<!-- 限制文件类型 -->
<input type="file" id="fileInput" accept="image/*">

<!-- 限制特定类型 -->
<input type="file" id="fileInput" accept=".jpg,.png,.gif">

<!-- 限制 MIME 类型 -->
<input type="file" id="fileInput" accept="image/jpeg,image/png">
```

**JavaScript**：
```javascript
const fileInput = document.getElementById('fileInput');

// 监听文件选择
fileInput.addEventListener('change', (e) => {
  const files = e.target.files;
  console.log('Selected files:', files);
  
  // 处理文件
  Array.from(files).forEach(file => {
    console.log('File name:', file.name);
    console.log('File size:', file.size);
    console.log('File type:', file.type);
  });
});
```

### 3.2 程序化触发文件选择

```javascript
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.multiple = true;
fileInput.accept = 'image/*';

// 触发文件选择
fileInput.click();

fileInput.addEventListener('change', (e) => {
  const files = e.target.files;
  // 处理文件
});
```

### 3.3 文件类型限制

```javascript
// 检查文件类型
function isValidFileType(file, allowedTypes) {
  return allowedTypes.includes(file.type);
}

// 检查文件扩展名
function isValidFileExtension(file, allowedExtensions) {
  const extension = file.name.split('.').pop().toLowerCase();
  return allowedExtensions.includes(extension);
}

// 使用示例
const file = fileInput.files[0];
if (isValidFileType(file, ['image/jpeg', 'image/png'])) {
  console.log('Valid image file');
}

if (isValidFileExtension(file, ['jpg', 'jpeg', 'png', 'gif'])) {
  console.log('Valid image file');
}
```

### 3.4 文件大小限制

```javascript
// 检查文件大小
function isValidFileSize(file, maxSize) {
  return file.size <= maxSize;
}

// 使用示例
const file = fileInput.files[0];
const maxSize = 5 * 1024 * 1024; // 5MB

if (isValidFileSize(file, maxSize)) {
  console.log('File size is valid');
} else {
  console.log('File is too large');
}
```

---

## 4. 文件拖拽

### 4.1 拖拽上传区域

**HTML**：
```html
<div id="dropZone" class="drop-zone">
  <p>拖拽文件到此区域上传</p>
</div>
```

**CSS**：
```css
.drop-zone {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s;
}

.drop-zone.dragover {
  border-color: #1890ff;
  background-color: #f0f7ff;
}
```

**JavaScript**：
```javascript
const dropZone = document.getElementById('dropZone');

// 防止默认行为
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragover');
});

// 处理文件拖拽
dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  
  const files = e.dataTransfer.files;
  console.log('Dropped files:', files);
  
  // 处理文件
  Array.from(files).forEach(file => {
    console.log('File:', file.name);
  });
});
```

### 4.2 拖拽事件

```javascript
const dropZone = document.getElementById('dropZone');

// 拖拽进入
dropZone.addEventListener('dragenter', (e) => {
  e.preventDefault();
  console.log('Drag enter');
});

// 拖拽悬停
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  console.log('Drag over');
});

// 拖拽离开
dropZone.addEventListener('dragleave', (e) => {
  e.preventDefault();
  console.log('Drag leave');
});

// 放下文件
dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  const files = e.dataTransfer.files;
  console.log('Files dropped:', files);
});
```

### 4.3 拖拽数据

```javascript
dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  
  // 获取文件列表
  const files = e.dataTransfer.files;
  
  // 获取数据类型
  const types = e.dataTransfer.types;
  console.log('Data types:', types);
  
  // 检查是否有文件
  if (types.includes('Files')) {
    console.log('Files dropped');
  }
  
  // 处理文件
  Array.from(files).forEach(file => {
    console.log('File:', file.name, file.size, file.type);
  });
});
```

---

## 5. 文件信息

### 5.1 获取文件信息

```javascript
function getFileInfo(file) {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
    lastModifiedDate: new Date(file.lastModified),
    extension: file.name.split('.').pop(),
  };
}

// 使用示例
const file = fileInput.files[0];
const info = getFileInfo(file);
console.log('File info:', info);
```

### 5.2 格式化文件大小

```javascript
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// 使用示例
const file = fileInput.files[0];
console.log('File size:', formatFileSize(file.size)); // "1.5 MB"
```

### 5.3 文件类型检测

```javascript
function getFileCategory(file) {
  const type = file.type;
  
  if (type.startsWith('image/')) {
    return 'image';
  } else if (type.startsWith('video/')) {
    return 'video';
  } else if (type.startsWith('audio/')) {
    return 'audio';
  } else if (type.startsWith('text/')) {
    return 'text';
  } else if (type.includes('pdf')) {
    return 'pdf';
  } else {
    return 'other';
  }
}

// 使用示例
const file = fileInput.files[0];
console.log('File category:', getFileCategory(file));
```

---

## 6. 实际应用

### 6.1 文件预览

```javascript
// 图片预览
function previewImage(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = document.createElement('img');
    img.src = e.target.result;
    document.body.appendChild(img);
  };
  reader.readAsDataURL(file);
}

// 文本预览
async function previewText(file) {
  const text = await file.text();
  const pre = document.createElement('pre');
  pre.textContent = text;
  document.body.appendChild(pre);
}
```

### 6.2 文件上传

```javascript
// 使用 FormData 上传
async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
  
  return response.json();
}

// 使用 XMLHttpRequest 上传（支持进度）
function uploadFileWithProgress(file, onProgress) {
  const xhr = new XMLHttpRequest();
  const formData = new FormData();
  formData.append('file', file);
  
  xhr.upload.addEventListener('progress', (e) => {
    if (e.lengthComputable) {
      const percentComplete = (e.loaded / e.total) * 100;
      onProgress?.(percentComplete);
    }
  });
  
  xhr.addEventListener('load', () => {
    if (xhr.status === 200) {
      console.log('Upload successful');
    }
  });
  
  xhr.open('POST', '/api/upload');
  xhr.send(formData);
}
```

### 6.3 文件验证

```javascript
function validateFile(file, options = {}) {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB
    allowedTypes = [],
    allowedExtensions = [],
  } = options;
  
  const errors = [];
  
  // 检查文件大小
  if (file.size > maxSize) {
    errors.push(`File size exceeds ${formatFileSize(maxSize)}`);
  }
  
  // 检查文件类型
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    errors.push('File type not allowed');
  }
  
  // 检查文件扩展名
  if (allowedExtensions.length > 0) {
    const extension = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      errors.push('File extension not allowed');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

// 使用示例
const file = fileInput.files[0];
const validation = validateFile(file, {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png'],
  allowedExtensions: ['jpg', 'jpeg', 'png'],
});

if (validation.valid) {
  console.log('File is valid');
} else {
  console.log('Validation errors:', validation.errors);
}
```

### 6.4 多文件处理

```javascript
// 处理多个文件
async function processFiles(files) {
  const results = [];
  
  for (const file of Array.from(files)) {
    try {
      const result = await processFile(file);
      results.push({ file: file.name, success: true, result });
    } catch (error) {
      results.push({ file: file.name, success: false, error: error.message });
    }
  }
  
  return results;
}

// 处理单个文件
async function processFile(file) {
  // 读取文件内容
  const content = await file.text();
  
  // 处理文件内容
  // ...
  
  return { processed: true };
}
```

---

## 🔗 相关链接

### 相关 API
- [Blob API](./10-Blob-API.md) — 二进制大对象（File 继承自 Blob）
- [FileReader API](./11-FileReader-API.md) — 文件读取
- [FormData API](./12-FormData-API.md) — 表单数据和文件上传

### 实际应用
- [前端大文件上传](../../../../10-实战案例/01-前端实战/前端大文件上传.md) — 大文件上传实现

---

**最后更新**：2025  
**参考规范**：[File API](https://www.w3.org/TR/FileAPI/)

---

#javascript #FileAPI #文件操作 #浏览器API
