
[前端史上最简单且实用的大文件上传npm库本文介绍大文件上传的概念，带你搞懂什么是大文件上传以及大文件上传解决了什么痛点。 - 掘金](https://juejin.cn/post/7474812310444834851#heading-22)

本文介绍大文件上传的概念，带你搞懂什么是大文件上传以及大文件上传解决了什么痛点。另外还将介绍大文件上传的一些功能点以及难点。最后推出一款非常好用的大文件上传库，可以做到开箱即用，无论是vue2/vu3、react还是jquery原生js开发。并且内置了诸如错误重传策略，断点续传、重传、重试和暂停等功能，即使你从未做过大文件上传，你也可以使用的随心应手。

npm库：[enlarge-file-upload](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fenlarge-file-upload "https://www.npmjs.com/package/enlarge-file-upload")

线上演示地址：[jiang-12-13.com:8988/](https://link.juejin.cn/?target=http%3A%2F%2Fjiang-12-13.com%3A8988%2F "http://jiang-12-13.com:8988/")

### 概念

#### 1. 什么是大文件上传？

大文件上传是指将体积较大的文件（通常指几十MB到GB级别的文件）从客户端（如浏览器）传输到服务器的过程。由于文件体积较大，直接使用传统的文件上传方式可能会导致上传失败、网络超时或服务器资源占用过高等问题。因此，大文件上传通常需要采用分片上传、断点续传、并行上传等特殊技术手段来确保上传的稳定性和效率。

---

#### 2. 大文件上传能解决什么问题？

大文件上传主要解决以下问题：

- **网络稳定性问题**：避免因网络波动或中断导致上传失败。
- **服务器资源限制**：减少服务器内存和CPU资源的占用，防止因上传大文件导致服务器崩溃。
- **用户体验问题**：提供上传进度、断点续传等功能，提升用户在使用大文件上传时的体验。
- **文件完整性验证**：确保上传的文件在传输过程中没有损坏或丢失。

---

#### 3. 大文件上传和普通文件上传的优势在哪里？

- **支持大体积文件**：普通文件上传通常难以处理大文件（如GB级别），而大文件上传通过分片技术可以解决这一问题。
- **断点续传**：普通文件上传一旦中断需要重新上传，而大文件上传支持从中断点继续上传，节省时间和带宽。
- **并行上传**：大文件上传可以将文件分成多个分片并行上传，提升上传速度。
- **资源优化**：通过对文件分片上传，减少服务器内存占用，提升服务器性能。
- **进度监控**：大文件上传可以提供更精准的上传进度显示，方便用户了解上传状态。

---

#### 4. 大文件上传需要攻破的功能点有哪些？（从前端角度）

从前端角度来看，实现大文件上传需要解决以下关键功能点：

#### (1) **文件分片（Chunking）**

- 将大文件按照固定大小（如 1MB 或 5MB）分成多个小文件（分片）。
- 使用 `File API`（如 `File.slice()`）进行文件切割。

#### (2) **分片上传**

- 将每个分片通过 `XMLHttpRequest` 或 `Fetch API` 上传到服务器。
- 支持并行上传（同时上传多个分片）以提升效率。

#### (3) **断点续传（Resume Upload）**

- 在上传中断后，能够记录已上传的分片，下次继续上传未完成的分片。
- 需要前端与服务器配合，通常服务器会记录已上传的分片信息（如文件哈希值或分片索引）。

#### (4) **上传进度监控**

- 使用 `XMLHttpRequest` 的 `progress` 事件或 `Fetch API` 的 `ReadableStream` 实时监控上传进度。
- 计算已上传文件的百分比并展示给用户。

#### (5) **文件完整性校验**

- 在上传完成后，计算文件的哈希值（如 MD5 或 SHA-256）并与服务器端校验，确保文件完整无误。
- 使用 `FileReader` 读取文件内容并生成哈希值。

#### (6) **错误处理与重试机制**

- 处理上传过程中可能出现的网络错误、服务器错误等问题。
- 为每个分片设置重试机制，确保上传失败的分片能够重新上传。

#### (7) **并发控制**

- 控制同时上传的分片数量，避免过多请求占用带宽或服务器资源。
- 使用队列或 Promise 池管理并发上传任务。

#### (8) **用户体验优化**

- 提供清晰的 UI 反馈，如进度条、上传速度、剩余时间等。
- 支持拖拽上传、文件选择、批量上传等功能。

#### (9) **安全性考虑**

- 防止恶意文件上传，使用文件类型校验、文件大小限制等手段。
- 对敏感数据进行加密传输（如使用 HTTPS）。

### 大文件上传库介绍

需要自己从0到1手写一个大文件上传库确实困难，有非常多的功能点需要实现，并非短期内可以做到。这里推荐一个非常好用的大文件上传库 [enlarge-file-upload](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fenlarge-file-upload "https://www.npmjs.com/package/enlarge-file-upload") 实现了上述的所有功能，可以做到开箱即用，无论是vue2/vu3、react还是jquery原生js开发，都可以使用这个库

#### 1. 安装

```
npm i enlarge-file-upload
```

#### 2. 参数介绍

```
/**
 * 本库计算文件hash值，使用的是 crypto-js 依赖包进行计算，版本为 4.0.0 版
 * 链接：https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
 */

/**
 * descript 入参详解
 * @param {Number} chunkSize? 文件单个切片大小，默认5MB
 * @param {Number} concurrency? 并发上传数量，默认5
 * @param {Number} maxRetries? 失败重试次数，默认3
 * @param {Number} startOffset? 断点续传偏移量，默认0
 * @param {Array} includeChunks? 需要上传的切片索引，默认上传所有切片
 * 如果startOffset和includeChunks参数同时存在，且startOffset不为0，默认优先使用startOffset参数
 * @param {Boolen} hash? 是否开启hash计算，默认不开启，可选参数
 * @param {Boolen} awaitHash? 是否等待hash值，默认等待，可选参数(仅在hash为true时生效)
 * awaitHash参数，如果上传文件较小时可以开启等待；如果文件超大，建议关闭，大文件hash值计算时间较长，避免等待阻塞主线程
 * @param {Function} uploadFunction 上传函数，必传参数
 * @param {Function} onProgress? 上传进度回调函数，可选
 * @param {Function} onSpeed? 上传速度回调函数，可选
 * @param {Function} onSuccess? 上传成功后回调函数，可选
 * @param {Function} beginHash? 开始计算Hash值回调函数，可选（只会在上传前调用一次，且hash.open必须true）
 * @param {Function} endHash? Hash值计算完毕回调函数，可选（只会在上传前调用一次，且hash.open必须true）
 */
// 参数示例
const config = {
  chunkSize: 5 * 1024 * 1024,
  concurrency: 5,
  maxRetries: 3,
  startOffset:0,
  includeChunks,
  hash: false,
  awaitHash: false,
  uploadFunction,
  onProgress,
  onSuccess
  onSpeed,
  beginHash,
  endHash
};

/**
 * descript fileUploadTool方法返回一个对象，包含上传方法、暂停方法、继续方法等
 * upload 上传方法
 * pause 暂停方法
 * resume 继续方法
 * state 状态对象，包含上传进度、hash值、上传速度等（具体请看对应的TS属性State）
 */
// 方法调用
const { upload, pause, resume, state } = fileUploadTool(config);

```

## 使用案例

#### jquery原生 js 中使用示例

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>文件上传</title>
  </head>
  <script src="https://cdn.jsdelivr.net/npm/enlarge-file-upload/dist/upload.min.js"></script>
  <!-- 引入 Axios 库，用于发送 HTTP 请求 -->
  <script src="https://cdn.jsdelivr.net/npm/axios"></script>

  <body>
    <input type="file" id="fileInput" />
    <button id="pauseButton">暂停上传</button>
    <button id="resumeButton">继续上传</button>
    <div id="progress">上传进度：0%</div>
    <div id="speed">上传速度：0 MB/s</div>
    <script>
      // 定义上传函数
      async function uploadFunction({ chunk, index, hash, cancelToken }) {
        const formData = new FormData();
        formData.append("chunk", chunk);
        formData.append("hash", hash);
        formData.append("index", index);
        await axios.post("http://localhost:3000/api/users", formData, {
          cancelToken,
        });
      }

      // 使用示例
      const config = {
        chunkSize: 5 * 1024 * 1024, // 5MB
        concurrency: 5,
        maxRetries: 3,
        // startOffset: 6, // 从索引为10的切片位置开始传
        // includeChunks:[1,6], // 只上传索引为1和6的切片,只有startOffset为0或空时才生效
        uploadFunction,
        onProgress: (progress) => {
          document.getElementById(
            "progress"
          ).innerText = `上传进度：${state.progress.toFixed(2)}%`;
        },
        onSuccess: () => {
          console.log("上传完毕");
        },
        onSpeed: (speed) => {
          document.getElementById("speed").innerText = `上传速度：${speed}`;
        },
      };

      const { upload, pause, resume, state } = createUploader(config);
      const fileInput = document.getElementById("fileInput");
      fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];
        upload(file);
      });
      // 暂停上传
      document.getElementById("pauseButton").addEventListener("click", () => {
        pause();
      });
      // 继续上传
      document.getElementById("resumeButton").addEventListener("click", () => {
        resume();
      });
    </script>
  </body>
</html>
```

#### **在 vue3 中使用**

```
<template>
  <div>
    <input type="file" @change="handleFileChange" />
    <button @click="handlePause">暂停上传</button>
    <button @click="handleResume">继续上传</button>
    <div>上传进度：{{ progress.toFixed(2) }}%</div>
    <div>上传速度：{{ speed }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import createUploader from "enlarge-file-upload";
import type { Config, UploadOptions } from "enlarge-file-upload"; // TS导入类型
import axios from "axios";

const progress = ref<number>(0);
const speed = ref<string>("0 MB/s");

// 定义上传函数
async function uploadFunction({
  chunk,
  index,
  hash,
  cancelToken,
}: UploadOptions): Promise<void> {
  const formData = new FormData();
  formData.append("chunk", chunk);
  formData.append("hash", hash);
  formData.append("index", index.toString());
  await axios.post("http://localhost:3000/api/users", formData, {
    cancelToken,
  });
}

// 使用 computed 来生成 uploader 配置，类型为 Config
const uploaderConfig = computed<Config>(() => ({
  chunkSize: 0.01 * 1024 * 1024, // 5MB
  concurrency: 5,
  maxRetries: 3,
  uploadFunction,
  onProgress: (progressValue: number) => {
    progress.value = progressValue;
  },
  onSuccess: () => {
    console.log("上传完毕");
  },
  onSpeed: (speedValue: string) => {
    speed.value = speedValue;
  },
}));

const uploader = ref<ReturnType<typeof createUploader> | null>(null);
uploader.value = createUploader(uploaderConfig.value);

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    uploader.value?.upload(file);
  }
};

const handlePause = () => {
  uploader.value?.pause();
};

const handleResume = () => {
  uploader.value?.resume();
};
</script>

<style scoped></style>
```

#### **在 vue2 中使用**

```
<template>
  <div>
    <input type="file" @change="handleFileChange" />
    <button @click="handlePause">暂停上传</button>
    <button @click="handleResume">继续上传</button>
    <div>上传进度：{{ progress.toFixed(2) }}%</div>
    <div>上传速度：{{ speed }}</div>
  </div>
</template>

<script>
import Vue from "vue";
import createUploader from "enlarge-file-upload";
import axios from "axios";

export default Vue.extend({
  data() {
    return {
      progress: 0, // 进度
      speed: "0 MB/s", // 速度
      uploader: null, // 上传器实例
    };
  },
  methods: {
    // 定义上传函数
    async uploadFunction({ chunk, index, hash, cancelToken }) {
      const formData = new FormData();
      formData.append("chunk", chunk);
      formData.append("hash", hash);
      formData.append("index", index.toString());
      await axios.post("http://localhost:3000/api/users", formData, {
        cancelToken,
      });
    },

    // 文件选择处理
    handleFileChange(event) {
      const file = event.target.files?.[0];
      if (file && this.uploader) {
        this.uploader.upload(file);
      }
    },

    // 暂停上传
    handlePause() {
      if (this.uploader) {
        this.uploader.pause();
      }
    },

    // 继续上传
    handleResume() {
      if (this.uploader) {
        this.uploader.resume();
      }
    },
  },
  created() {
    const uploaderConfig = {
      chunkSize: 5 * 1024 * 1024, // 5MB
      concurrency: 5,
      maxRetries: 3,
      uploadFunction: this.uploadFunction,
      onProgress: (progressValue) => {
        this.progress = progressValue;
      },
      onSuccess: () => {
        console.log("上传完毕");
      },
      onSpeed: (speedValue) => {
        this.speed = speedValue;
      },
    };

    // 创建上传器实例
    this.uploader = createUploader(uploaderConfig);
  },
});
</script>

<style scoped></style>
```

#### React 中使用示例

**在 react 中，这里的 useMemo 是必须要使用的，避免组件渲染的时候，重新创建 uploader 对象**

```
import React, { useState, useMemo } from "react";
import createUploader from "enlarge-file-upload";
import type { Config, UploadOptions } from "enlarge-file-upload";
import axios from "axios";

const FileUpload = () => {
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState("0 MB/s");

  // 定义上传函数
  async function uploadFunction({
    chunk,
    index,
    hash,
    cancelToken,
  }: UploadOptions) {
    const formData = new FormData();
    formData.append("chunk", chunk);
    formData.append("hash", hash);
    formData.append("index", index);
    await axios.post("http://localhost:3000/api/users", formData, {
      cancelToken,
    });
  }

  const uploaderConfig: Config = useMemo(
    () => ({
      chunkSize: 5 * 1024 * 1024, // 5MB
      concurrency: 5,
      maxRetries: 3,
      // startOffset: 6, // 从索引为10的切片位置开始传
      // includeChunks:[1,6], // 只上传索引为1和6的切片,只有startOffset为0或空时才生效
      uploadFunction,
      onProgress: (progress) => {
        setProgress(progress);
      },
      onSuccess: () => {
        console.log("上传完毕");
      },
      onSpeed: (speed) => {
        setSpeed(speed);
      },
    }),
    []
  );

  const uploader = useMemo(
    () => createUploader(uploaderConfig),
    [uploaderConfig]
  );

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    uploader?.upload(file);
  };

  const handlePause = () => {
    uploader?.pause();
  };

  const handleResume = () => {
    uploader?.resume();
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handlePause}>暂停上传</button>
      <button onClick={handleResume}>继续上传</button>
      <div>上传进度：{progress.toFixed(2)}%</div>
      <div>上传速度：{speed}</div>
    </div>
  );
};

export default FileUpload;
```

#### 封装为 react Hooks

**一个简单的封装，如有特殊需求，可以基于这个 hooks 进行二次修改**

```
import { useState, useMemo, useCallback } from "react";
import createUploader from "enlarge-file-upload";
import type { Config, UploadOptions } from "enlarge-file-upload";
import axios from "axios";

const useFileUploader = () => {
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState("0 MB/s");

  const uploadFunction = useCallback(
    async ({ chunk, index, hash, cancelToken }: UploadOptions) => {
      const formData = new FormData();
      formData.append("chunk", chunk);
      formData.append("hash", hash);
      formData.append("index", index);
      await axios.post("http://localhost:3000/api/users", formData, {
        cancelToken,
      });
    },
    []
  );

  const uploaderConfig: Config = useMemo(
    () => ({
      chunkSize: 5 * 1024 * 1024, // 5MB
      concurrency: 5,
      maxRetries: 3,
      // startOffset: 6, // 从索引为10的切片位置开始传
      // includeChunks:[1,6], // 只上传索引为1和6的切片,只有startOffset为0或空时才生效
      uploadFunction,
      onProgress: (progress) => {
        setProgress(progress);
      },
      onSuccess: () => {
        console.log("Upload complete");
      },
      onSpeed: (speed) => {
        setSpeed(speed);
      },
    }),
    [uploadFunction]
  );

  const uploader = useMemo(
    () => createUploader(uploaderConfig),
    [uploaderConfig]
  );

  const uploadFile = useCallback(
    (file) => {
      uploader?.upload(file);
    },
    [uploader]
  );

  const pauseUpload = useCallback(() => {
    uploader?.pause();
  }, [uploader]);

  const resumeUpload = useCallback(() => {
    uploader?.resume();
  }, [uploader]);

  return {
    progress,
    speed,
    uploadFile,
    pauseUpload,
    resumeUpload,
  };
};

export default useFileUploader;
```

#### 使用上面封装好的 Hooks 示例

```
import React from "react";
import useFileUploader from "./useFileUploader.tsx";

const FileUpload = () => {
  const { progress, speed, uploadFile, pauseUpload, resumeUpload } =
    useFileUploader();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    uploadFile(file);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={pauseUpload}>Pause Upload</button>
      <button onClick={resumeUpload}>Resume Upload</button>
      <div>Upload Progress: {progress.toFixed(2)}%</div>
      <div>Upload Speed: {speed}</div>
    </div>
  );
};

export default FileUpload;
```

参考地址：[www.npmjs.com/package/enl…](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fenlarge-file-upload "https://www.npmjs.com/package/enlarge-file-upload")