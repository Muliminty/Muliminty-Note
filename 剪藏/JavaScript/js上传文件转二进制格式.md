---
link: https://blog.csdn.net/qq_35703552/article/details/121224798
title: js上传文件转二进制格式
description: html部分  &lt;Upload	  ref="upload"	      :on-success="uploadSuccess"	      :headers="uploadHeaders"	      :show-upload-list="false"	      :action="actionUrl"	      :max-size="2048"	      :accept="accept"	      :format="format"	      :on-format-err
keywords: js文件转二进制上传
author: 咖喱&土豆 Csdn认证博客专家 Csdn认证企业博客 码龄7年 暂无认证
date: 2021-11-09T06:28:07.000Z
publisher: null
stats: paragraph=5 sentences=37, words=169
---
## html部分

```js
  <Upload
	  ref="upload"
	      :on-success="uploadSuccess"
	      :headers="uploadHeaders"
	      :show-upload-list="false"
	      :action="actionUrl"
	      :max-size="2048"
	      :accept="accept"
	      :format="format"
	      :on-format-error="handleFormatError"
	      :before-upload="beforeUpload"
	  >
      <span class="upload">上传模板</span>
  </Upload>
```

## js部分

```js
   beforeUpload(file) {
                let name = file.name.replace(/.+\./, '');
                if (name === 'pdf' || name === 'doc' || name === 'docx' || name === 'xlsx') {
                    let that = this;
                    let filename = file.name;
                    let reader = new FileReader();
                    reader.readAsArrayBuffer(file);
                    reader.onload = function () {
                        let blob = new Blob([reader.result]);
                        let formdata = new FormData();
                        formdata.append('formFile', blob, filename);
                        upLoad.UploadFileForOss(formdata).then((res) => {
                            console.log(res);
                            if (res.succeeded) {
                                for (let i = 0; i < that.formDynamic.items.length; i++) {
                                    if (
                                        that.formDynamic.items[i].policyFileType ===
                                            that.uploadFileIdentification.policyFileType &&
                                        that.formDynamic.items[i].uuid === that.uploadFileIdentification.uuid
                                    ) {
                                        that.formDynamic.items[i].templateName = filename;
                                        that.formDynamic.items[i].templateUrl = res.data;
                                    }
                                }
                            }
                        });
                    };
                } else {
                    this.$Message.error('请上传word和pdf文件!');
                }
                return false;
            },
```

采用iview的上传组件实现，原生input也一样实现
