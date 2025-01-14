
## `<input type="file"> `想把后面的未选择任何文件字样去掉，怎么做？
[参考地址](https://segmentfault.com/q/1010000009349810)

![](附件/Input.png)

```HTML
<form method="post" enctype="multipart/form-data">
  <div>
    <label for="file">选择要上传的文件</label>
    <input type="file" id="file" name="file"  />
  </div>
  <div>
    <button>提交</button>
  </div>
</form>

```

```CSS
div {
  margin-bottom: 10px;
}
input[type="file"] {
  color: transparent;
}
```

## 怎么禁止谷歌浏览器密码自动填入

可以尝试使用以下方法来禁止谷歌浏览器的自动填充密码功能：

1. 设置 Input 组件的 `autoComplete` 属性为 "off"：

```jsx
<ProFormText.Password autoComplete="off" />
```

2. 使用一个隐藏的输入框来吸引浏览器的自动填充：

```jsx
 <input type="password" style={{ position: 'absolute', right: -10000 }} tabIndex={-1} />
<ProFormText.Password autoComplete="off" />
```

这将在密码输入框之前插入一个隐藏的文本输入框，浏览器会将自动填充的数据应用于隐藏的文本输入框，而不是密码输入框。

请注意，这些方法仍无法完全保证禁用谷歌浏览器的自动填充密码功能，因为浏览器行为是由用户的偏好和设置决定的。
