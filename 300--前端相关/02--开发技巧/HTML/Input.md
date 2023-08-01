
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