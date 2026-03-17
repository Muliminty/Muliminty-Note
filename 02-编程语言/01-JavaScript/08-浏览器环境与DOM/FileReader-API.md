# FileReader API（FileReader API）

> FileReader API 提供了异步读取文件内容的能力，可以读取 File 或 Blob 对象的内容。
> 
> **参考规范**：[File API - FileReader](https://www.w3.org/TR/FileAPI/#dfn-filereader)

---

## 📚 目录

- [1. FileReader 对象](#1-filereader-对象)
- [2. 读取方法](#2-读取方法)
- [3. 事件处理](#3-事件处理)
- [4. 读取结果](#4-读取结果)
- [5. 实际应用](#5-实际应用)

---

## 1. FileReader 对象

### 1.1 FileReader 概述

**FileReader** 用于异步读取文件内容。

**特点**：
- 异步读取：不会阻塞主线程
- 支持多种格式：文本、ArrayBuffer、Data URL
- 事件驱动：通过事件监听处理读取结果

### 1.2 创建 FileReader

```javascript
const reader = new FileReader();
```

### 1.3 FileReader 属性

```javascript
const reader = new FileReader();

// 读取状态
reader.readyState;  // 0: EMPTY, 1: LOADING, 2: DONE

// 读取结果
reader.result;      // 读取结果（根据读取方法不同而不同）

// 错误信息
reader.error;       // 错误对象（如果有错误）
```

**readyState 值**：
- `0` (EMPTY)：尚未加载任何数据
- `1` (LOADING)：数据正在被加载
- `2` (DONE)：读取操作已完成

---

## 2. 读取方法

### 2.1 readAsText() - 读取为文本

```javascript
const reader = new FileReader();
const file = fileInput.files[0];

reader.onload = (e) => {
  const text = e.target.result;
  console.log(text);
};

reader.readAsText(file);

// 指定编码
reader.readAsText(file, 'UTF-8');
reader.readAsText(file, 'GBK');
```

**使用示例**：
```javascript
function readTextFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

// 使用
const file = fileInput.files[0];
readTextFile(file).then(text => {
  console.log(text);
});
```

### 2.2 readAsDataURL() - 读取为 Data URL

```javascript
const reader = new FileReader();
const file = fileInput.files[0];

reader.onload = (e) => {
  const dataURL = e.target.result;
  console.log(dataURL); // "data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=="
  
  // 使用 Data URL
  const img = document.createElement('img');
  img.src = dataURL;
  document.body.appendChild(img);
};

reader.readAsDataURL(file);
```

**使用示例**：
```javascript
function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// 图片预览
const file = fileInput.files[0];
readAsDataURL(file).then(dataURL => {
  const img = document.createElement('img');
  img.src = dataURL;
  document.body.appendChild(img);
});
```

### 2.3 readAsArrayBuffer() - 读取为 ArrayBuffer

```javascript
const reader = new FileReader();
const file = fileInput.files[0];

reader.onload = (e) => {
  const arrayBuffer = e.target.result;
  const uint8Array = new Uint8Array(arrayBuffer);
  console.log(uint8Array);
};

reader.readAsArrayBuffer(file);
```

**使用示例**：
```javascript
function readAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

// 计算文件 Hash
async function calculateFileHash(file) {
  const arrayBuffer = await readAsArrayBuffer(file);
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
```

### 2.4 readAsBinaryString() - 读取为二进制字符串（已废弃）

```javascript
// 不推荐使用，已废弃
const reader = new FileReader();
reader.readAsBinaryString(file);
```

**注意**：`readAsBinaryString()` 已废弃，推荐使用 `readAsArrayBuffer()` 替代。

---

## 3. 事件处理

### 3.1 事件类型

```javascript
const reader = new FileReader();

// 读取开始
reader.onloadstart = (e) => {
  console.log('Load start');
};

// 读取进度
reader.onprogress = (e) => {
  if (e.lengthComputable) {
    const percentLoaded = (e.loaded / e.total) * 100;
    console.log(`Progress: ${percentLoaded}%`);
  }
};

// 读取完成
reader.onload = (e) => {
  console.log('Load complete');
  console.log('Result:', e.target.result);
};

// 读取中断
reader.onabort = (e) => {
  console.log('Load aborted');
};

// 读取错误
reader.onerror = (e) => {
  console.error('Load error:', e.target.error);
};

// 读取结束
reader.onloadend = (e) => {
  console.log('Load end');
};
```

### 3.2 使用 addEventListener

```javascript
const reader = new FileReader();

reader.addEventListener('loadstart', (e) => {
  console.log('Load start');
});

reader.addEventListener('progress', (e) => {
  if (e.lengthComputable) {
    const percentLoaded = (e.loaded / e.total) * 100;
    console.log(`Progress: ${percentLoaded}%`);
  }
});

reader.addEventListener('load', (e) => {
  console.log('Load complete');
  console.log('Result:', e.target.result);
});

reader.addEventListener('error', (e) => {
  console.error('Load error:', e.target.error);
});

reader.addEventListener('loadend', (e) => {
  console.log('Load end');
});
```

### 3.3 读取进度

```javascript
function readFileWithProgress(file, onProgress) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const percentLoaded = (e.loaded / e.total) * 100;
        onProgress?.(percentLoaded);
      }
    };
    
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

// 使用
const file = fileInput.files[0];
readFileWithProgress(file, (progress) => {
  console.log(`Progress: ${progress}%`);
}).then(arrayBuffer => {
  console.log('Read complete');
});
```

---

## 4. 读取结果

### 4.1 结果类型

**readAsText()**：
```javascript
reader.readAsText(file);
reader.onload = (e) => {
  const text = e.target.result; // 字符串
  console.log(typeof text); // "string"
};
```

**readAsDataURL()**：
```javascript
reader.readAsDataURL(file);
reader.onload = (e) => {
  const dataURL = e.target.result; // "data:text/plain;base64,..."
  console.log(typeof dataURL); // "string"
};
```

**readAsArrayBuffer()**：
```javascript
reader.readAsArrayBuffer(file);
reader.onload = (e) => {
  const arrayBuffer = e.target.result; // ArrayBuffer
  console.log(arrayBuffer instanceof ArrayBuffer); // true
};
```

### 4.2 错误处理

```javascript
const reader = new FileReader();

reader.onerror = (e) => {
  const error = e.target.error;
  console.error('Error code:', error.code);
  console.error('Error name:', error.name);
  console.error('Error message:', error.message);
};

reader.onloadend = (e) => {
  if (e.target.error) {
    console.error('Read failed:', e.target.error);
  } else {
    console.log('Read successful:', e.target.result);
  }
};

reader.readAsText(file);
```

**错误类型**：
- `NotFoundError`：文件未找到
- `NotReadableError`：文件不可读
- `AbortError`：读取被中止
- `SecurityError`：安全错误

### 4.3 取消读取

```javascript
const reader = new FileReader();

reader.readAsText(file);

// 取消读取
reader.abort();

reader.onabort = (e) => {
  console.log('Read aborted');
};
```

---

## 5. 实际应用

### 5.1 图片预览

```javascript
function previewImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.onload = () => resolve(img);
      img.onerror = reject;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// 使用
const file = fileInput.files[0];
previewImage(file).then(img => {
  document.body.appendChild(img);
});
```

### 5.2 文本文件读取

```javascript
function readTextFile(file, encoding = 'UTF-8') {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsText(file, encoding);
  });
}

// 使用
const file = fileInput.files[0];
readTextFile(file).then(text => {
  console.log(text);
  const pre = document.createElement('pre');
  pre.textContent = text;
  document.body.appendChild(pre);
});
```

### 5.3 JSON 文件读取

```javascript
function readJSONFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        resolve(json);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

// 使用
const file = fileInput.files[0];
readJSONFile(file).then(json => {
  console.log(json);
}).catch(error => {
  console.error('Failed to read JSON:', error);
});
```

### 5.4 CSV 文件读取

```javascript
function readCSVFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n');
      const headers = lines[0].split(',');
      const data = lines.slice(1).map(line => {
        const values = line.split(',');
        const obj = {};
        headers.forEach((header, index) => {
          obj[header.trim()] = values[index]?.trim();
        });
        return obj;
      });
      resolve(data);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

// 使用
const file = fileInput.files[0];
readCSVFile(file).then(data => {
  console.log(data);
});
```

### 5.5 文件 Hash 计算

```javascript
function calculateFileHash(file, algorithm = 'SHA-256') {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target.result;
        const hashBuffer = await crypto.subtle.digest(algorithm, arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        resolve(hash);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

// 使用
const file = fileInput.files[0];
calculateFileHash(file).then(hash => {
  console.log('File hash:', hash);
});
```

### 5.6 大文件分片读取

```javascript
function readFileInChunks(file, chunkSize = 2 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let offset = 0;
    
    function readNextChunk() {
      const blob = file.slice(offset, offset + chunkSize);
      const reader = new FileReader();
      
      reader.onload = (e) => {
        chunks.push(e.target.result);
        offset += chunkSize;
        
        if (offset < file.size) {
          readNextChunk();
        } else {
          resolve(chunks);
        }
      };
      
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    }
    
    readNextChunk();
  });
}

// 使用
const file = fileInput.files[0];
readFileInChunks(file, 2 * 1024 * 1024).then(chunks => {
  console.log('Total chunks:', chunks.length);
  chunks.forEach((chunk, index) => {
    console.log(`Chunk ${index}:`, chunk.byteLength, 'bytes');
  });
});
```

### 5.7 图片压缩

```javascript
function compressImage(file, quality = 0.8, maxWidth = 1920) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
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
const file = fileInput.files[0];
compressImage(file, 0.8, 1920).then(blob => {
  console.log('Original size:', file.size);
  console.log('Compressed size:', blob.size);
});
```

### 5.8 多文件读取

```javascript
function readMultipleFiles(files) {
  const readers = Array.from(files).map(file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve({
        file,
        result: e.target.result,
      });
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  });
  
  return Promise.all(readers);
}

// 使用
const files = fileInput.files;
readMultipleFiles(files).then(results => {
  results.forEach(({ file, result }) => {
    console.log(`File: ${file.name}, Size: ${file.size}`);
    const img = document.createElement('img');
    img.src = result;
    document.body.appendChild(img);
  });
});
```

---

## 🔗 相关链接

### 相关 API
- [File API](./File-API.md) — 文件对象
- [Blob API](./Blob-API.md) — 二进制大对象
- [FormData API](./FormData-API.md) — 表单数据

### 实际应用
- [前端大文件上传](../../../../10-实战案例/01-前端实战/前端大文件上传.md) — 大文件上传实现

---

**最后更新**：2025  
**参考规范**：[File API - FileReader](https://www.w3.org/TR/FileAPI/#dfn-filereader)

---

#javascript #FileReaderAPI #文件读取 #浏览器API
