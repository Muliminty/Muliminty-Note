# FormData API

> FormData API 提供了构造表单数据的能力，可以用于上传文件或发送表单数据。
> 
> **参考规范**：[XMLHttpRequest - FormData](https://xhr.spec.whatwg.org/#interface-formdata)

---

## 📚 目录

- [1. FormData 对象](#1-formdata-对象)
- [2. 添加数据](#2-添加数据)
- [3. 读取数据](#3-读取数据)
- [4. 文件上传](#4-文件上传)
- [5. 实际应用](#5-实际应用)

---

## 1. FormData 对象

### 1.1 FormData 概述

**FormData** 用于构造表单数据，可以包含文本字段和文件。

**特点**：
- 键值对数据：支持文本和文件
- 文件上传：可以添加 File 或 Blob 对象
- 自动编码：自动处理 multipart/form-data 编码

### 1.2 创建 FormData

```javascript
// 创建空的 FormData
const formData = new FormData();

// 从表单元素创建
const form = document.querySelector('form');
const formData = new FormData(form);
```

### 1.3 FormData 方法

```javascript
const formData = new FormData();

// 添加字段
formData.append('name', 'value');

// 设置字段
formData.set('name', 'value');

// 获取字段
formData.get('name');

// 获取所有同名字段
formData.getAll('name');

// 检查字段是否存在
formData.has('name');

// 删除字段
formData.delete('name');

// 遍历字段
formData.forEach((value, key) => {
  console.log(key, value);
});
```

---

## 2. 添加数据

### 2.1 append() - 添加字段

```javascript
const formData = new FormData();

// 添加文本字段
formData.append('username', 'john');
formData.append('email', 'john@example.com');

// 添加多个同名字段
formData.append('tags', 'javascript');
formData.append('tags', 'web');

// 添加文件
const file = fileInput.files[0];
formData.append('avatar', file);

// 添加文件（指定文件名）
formData.append('avatar', file, 'avatar.jpg');

// 添加 Blob
const blob = new Blob(['Hello, World!'], { type: 'text/plain' });
formData.append('document', blob, 'document.txt');
```

### 2.2 set() - 设置字段

```javascript
const formData = new FormData();

// 设置字段（会覆盖同名字段）
formData.set('username', 'john');
formData.set('username', 'jane'); // 覆盖 'john'

// 设置文件
const file = fileInput.files[0];
formData.set('avatar', file, 'avatar.jpg');
```

### 2.3 append() vs set()

```javascript
const formData = new FormData();

// append() - 添加字段（可以添加多个同名字段）
formData.append('tags', 'javascript');
formData.append('tags', 'web');
formData.getAll('tags'); // ['javascript', 'web']

// set() - 设置字段（会覆盖同名字段）
formData.set('tags', 'react');
formData.getAll('tags'); // ['react']
```

---

## 3. 读取数据

### 3.1 get() - 获取字段值

```javascript
const formData = new FormData();
formData.append('username', 'john');
formData.append('email', 'john@example.com');

// 获取字段值
const username = formData.get('username'); // 'john'
const email = formData.get('email'); // 'john@example.com'
const age = formData.get('age'); // null（不存在）
```

### 3.2 getAll() - 获取所有同名字段

```javascript
const formData = new FormData();
formData.append('tags', 'javascript');
formData.append('tags', 'web');
formData.append('tags', 'react');

// 获取所有同名字段
const tags = formData.getAll('tags'); // ['javascript', 'web', 'react']
```

### 3.3 has() - 检查字段是否存在

```javascript
const formData = new FormData();
formData.append('username', 'john');

// 检查字段是否存在
formData.has('username'); // true
formData.has('email'); // false
```

### 3.4 delete() - 删除字段

```javascript
const formData = new FormData();
formData.append('username', 'john');
formData.append('email', 'john@example.com');

// 删除字段
formData.delete('email');
formData.has('email'); // false
```

### 3.5 遍历字段

```javascript
const formData = new FormData();
formData.append('username', 'john');
formData.append('email', 'john@example.com');
formData.append('avatar', file);

// 使用 forEach
formData.forEach((value, key) => {
  console.log(key, value);
});

// 使用 for...of
for (const [key, value] of formData.entries()) {
  console.log(key, value);
}

// 使用 keys()
for (const key of formData.keys()) {
  console.log(key);
}

// 使用 values()
for (const value of formData.values()) {
  console.log(value);
}
```

---

## 4. 文件上传

### 4.1 单文件上传

```javascript
// 使用 FormData 上传文件
const file = fileInput.files[0];
const formData = new FormData();
formData.append('file', file);

fetch('/api/upload', {
  method: 'POST',
  body: formData,
})
  .then(response => response.json())
  .then(data => {
    console.log('Upload successful:', data);
  })
  .catch(error => {
    console.error('Upload failed:', error);
  });
```

### 4.2 多文件上传

```javascript
// 上传多个文件
const files = fileInput.files;
const formData = new FormData();

Array.from(files).forEach((file, index) => {
  formData.append(`file${index}`, file);
  // 或使用相同的字段名
  // formData.append('files', file);
});

fetch('/api/upload', {
  method: 'POST',
  body: formData,
})
  .then(response => response.json())
  .then(data => {
    console.log('Upload successful:', data);
  });
```

### 4.3 带进度监控的文件上传

```javascript
// 使用 XMLHttpRequest 上传文件（支持进度）
function uploadFileWithProgress(file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);
    
    // 监听上传进度
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percentComplete = (e.loaded / e.total) * 100;
        onProgress?.(percentComplete);
      }
    });
    
    // 监听完成
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(`Upload failed: ${xhr.statusText}`));
      }
    });
    
    // 监听错误
    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'));
    });
    
    xhr.open('POST', '/api/upload');
    xhr.send(formData);
  });
}

// 使用
const file = fileInput.files[0];
uploadFileWithProgress(file, (progress) => {
  console.log(`Upload progress: ${progress}%`);
}).then(data => {
  console.log('Upload successful:', data);
});
```

### 4.4 带额外字段的文件上传

```javascript
// 上传文件并附带额外字段
const file = fileInput.files[0];
const formData = new FormData();
formData.append('file', file);
formData.append('username', 'john');
formData.append('description', 'My file');

fetch('/api/upload', {
  method: 'POST',
  body: formData,
})
  .then(response => response.json())
  .then(data => {
    console.log('Upload successful:', data);
  });
```

---

## 5. 实际应用

### 5.1 表单提交

```javascript
// 从表单创建 FormData
const form = document.querySelector('form');
const formData = new FormData(form);

// 提交表单
fetch('/api/submit', {
  method: 'POST',
  body: formData,
})
  .then(response => response.json())
  .then(data => {
    console.log('Submit successful:', data);
  });
```

### 5.2 文件上传组件

```javascript
class FileUploader {
  constructor(options = {}) {
    this.url = options.url || '/api/upload';
    this.onProgress = options.onProgress;
    this.onSuccess = options.onSuccess;
    this.onError = options.onError;
  }
  
  upload(file, extraData = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    // 添加额外数据
    Object.entries(extraData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      // 监听上传进度
      if (this.onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            this.onProgress(percentComplete);
          }
        });
      }
      
      // 监听完成
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          this.onSuccess?.(data);
          resolve(data);
        } else {
          const error = new Error(`Upload failed: ${xhr.statusText}`);
          this.onError?.(error);
          reject(error);
        }
      });
      
      // 监听错误
      xhr.addEventListener('error', () => {
        const error = new Error('Upload failed');
        this.onError?.(error);
        reject(error);
      });
      
      xhr.open('POST', this.url);
      xhr.send(formData);
    });
  }
}

// 使用
const uploader = new FileUploader({
  url: '/api/upload',
  onProgress: (progress) => {
    console.log(`Upload progress: ${progress}%`);
  },
  onSuccess: (data) => {
    console.log('Upload successful:', data);
  },
  onError: (error) => {
    console.error('Upload failed:', error);
  },
});

const file = fileInput.files[0];
uploader.upload(file, {
  username: 'john',
  description: 'My file',
});
```

### 5.3 分片上传

```javascript
// 使用 FormData 进行分片上传
async function uploadChunk(chunk, chunkIndex, fileHash, fileName, totalChunks) {
  const formData = new FormData();
  formData.append('chunk', chunk);
  formData.append('chunkIndex', chunkIndex);
  formData.append('fileHash', fileHash);
  formData.append('fileName', fileName);
  formData.append('totalChunks', totalChunks);
  
  const response = await fetch('/api/upload/chunk', {
    method: 'POST',
    body: formData,
  });
  
  return response.json();
}

// 使用
const file = fileInput.files[0];
const chunkSize = 2 * 1024 * 1024; // 2MB
const chunks = Math.ceil(file.size / chunkSize);

for (let i = 0; i < chunks; i++) {
  const start = i * chunkSize;
  const end = Math.min(start + chunkSize, file.size);
  const chunk = file.slice(start, end);
  
  await uploadChunk(chunk, i, 'fileHash', file.name, chunks);
}
```

### 5.4 图片上传并预览

```javascript
function uploadImageWithPreview(file) {
  return new Promise((resolve, reject) => {
    // 创建预览
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.src = e.target.result;
      document.body.appendChild(img);
    };
    reader.readAsDataURL(file);
    
    // 上传文件
    const formData = new FormData();
    formData.append('image', file);
    
    fetch('/api/upload/image', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        console.log('Upload successful:', data);
        resolve(data);
      })
      .catch(error => {
        console.error('Upload failed:', error);
        reject(error);
      });
  });
}

// 使用
const file = fileInput.files[0];
uploadImageWithPreview(file);
```

### 5.5 表单验证

```javascript
function validateFormData(formData) {
  const errors = [];
  
  // 检查必填字段
  if (!formData.get('username')) {
    errors.push('Username is required');
  }
  
  if (!formData.get('email')) {
    errors.push('Email is required');
  }
  
  // 检查文件
  const file = formData.get('avatar');
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      errors.push('File size must be less than 5MB');
    }
    
    if (!file.type.startsWith('image/')) {
      errors.push('File must be an image');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

// 使用
const formData = new FormData();
formData.append('username', 'john');
formData.append('email', 'john@example.com');
formData.append('avatar', file);

const validation = validateFormData(formData);
if (validation.valid) {
  // 提交表单
  fetch('/api/submit', {
    method: 'POST',
    body: formData,
  });
} else {
  console.error('Validation errors:', validation.errors);
}
```

### 5.6 转换 FormData 为对象

```javascript
function formDataToObject(formData) {
  const object = {};
  formData.forEach((value, key) => {
    if (object[key]) {
      if (Array.isArray(object[key])) {
        object[key].push(value);
      } else {
        object[key] = [object[key], value];
      }
    } else {
      object[key] = value;
    }
  });
  return object;
}

// 使用
const formData = new FormData();
formData.append('username', 'john');
formData.append('email', 'john@example.com');
formData.append('tags', 'javascript');
formData.append('tags', 'web');

const object = formDataToObject(formData);
console.log(object);
// {
//   username: 'john',
//   email: 'john@example.com',
//   tags: ['javascript', 'web']
// }
```

---

## 🔗 相关链接

### 相关 API
- [File API](./File-API.md) — 文件对象
- [Blob API](./Blob-API.md) — 二进制大对象
- [FileReader API](./FileReader-API.md) — 文件读取
- [Fetch API](./浏览器API.md) — 网络请求

### 实际应用
- [前端大文件上传](../../../../00-经验技巧/前端大文件上传.md) — 大文件上传实现

---

**最后更新**：2025  
**参考规范**：[XMLHttpRequest - FormData](https://xhr.spec.whatwg.org/#interface-formdata)

---

#javascript #FormDataAPI #表单数据 #文件上传 #浏览器API

