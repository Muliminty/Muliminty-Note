# react 使用qrcode.react插件生成二维码并下载

## 1. 安装qrcode.react插件

```jsx
yarn add qrcode.react
// or 
npm install qrcode.react --save
```

## 2. 使用qrcode.react插件生成二维码

- 引入

```jsx
import QRCode from 'qrcode.react';
```

- 使用

```jsx
<QRCode
    id="qrCode"
    value="https://www.jianshu.com/u/992656e8a8a6"
    size={200} // 二维码的大小
    fgColor="#000000" // 二维码的颜色
    style={{ margin: 'auto' }}
    imageSettings={{ // 二维码中间的logo图片
        src: 'logoUrl',
        height: 100,
        width: 100,
        excavate: true, // 中间图片所在的位置是否镂空
     }}
 />                
```

下载

```jsx
<Button type="link" onClick={this.ClickDownLoad}>
下载二维码
</Button>
```

```jsx
 ClickDownLoad = (codeid, e) => {
  const canvasImg = document.getElementById('qrcode');
  console.log(canvasImg, 'canvasImg');
  console.log(canvasImg.toDataURL('image/png'), 'canvasImg.toDataURL');
  // const canvasImg = document.getElementById('qrCode'); // 获取canvas类型的二维码
  // const img = new Image();
  const url = canvasImg.toDataURL('image/png'); // 将canvas对象转换为图片的data url
  this.downloadFile('测试.png', url);
 };

 //下载
 downloadFile = (fileName, content) => {
  let aLink = document.createElement('a');
  let blob = this.base64ToBlob(content); //new Blob([content]);

  let evt = document.createEvent('HTMLEvents');
  evt.initEvent('click', true, true); //initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
  aLink.download = fileName;
  aLink.href = URL.createObjectURL(blob);

  // aLink.dispatchEvent(evt);
  //aLink.click()
  aLink.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window})); //兼容火狐
 };
 //base64转blob
 base64ToBlob = code => {
  let parts = code.split(';base64,');
  let contentType = parts[0].split(':')[1];
  let raw = window.atob(parts[1]);
  let rawLength = raw.length;

  let uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
   uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], {type: contentType});
 };
```
