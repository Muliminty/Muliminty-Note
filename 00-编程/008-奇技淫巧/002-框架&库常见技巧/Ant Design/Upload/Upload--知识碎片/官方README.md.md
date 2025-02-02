#antd/Upload
[官方Github](https://github.com/react-component/upload/tree/master)

# rc-upload



## Development

```
git clone https://github.com/react-component/upload.git
```

```
npm install
npm start
```

## Example

http://localhost:8000/

online example: https://upload.react-component.vercel.app/

## Feature

* support IE11+, Chrome, Firefox, Safari

## install

[![rc-upload](https://nodei.co/npm/rc-upload.png)](https://npmjs.org/package/rc-upload)

## Usage

```js
var Upload = require('rc-upload');
var React = require('react');
React.render(<Upload />, container);
```

## API

### props

|name|type|default| description|
|-----|---|--------|----|
|name | string | file| file param post to server |
|style | object | {}| root component inline style |
|className | string | - | root component className |
|disabled | boolean | false | whether disabled |
|component | "div"|"span" | "span"| wrap component name |
|action| string &#124; function(file): string &#124; Promise&lt;string&gt; | | form action url |
|method | string | post | request method |
|directory| boolean | false | support upload whole directory |
|data| object/function(file) | | other data object to post or a function which returns a data object(a promise object which resolve a data object) |
|headers| object | {} | http headers to post, available in modern browsers |
|accept | string | | input accept attribute |
|capture | string | | input capture attribute |
|multiple | boolean | false | only support ie10+|
|onStart | function| | start upload file |
|onError| function| | error callback |
|onSuccess | function | | success callback |
|onProgress | function || progress callback, only for modern browsers|
|beforeUpload| function |null| before upload check, return false or a rejected Promise will stop upload, only for modern browsers|
|customRequest | function | null | provide an override for the default xhr behavior for additional customization|
|withCredentials | boolean | false | ajax upload with cookie send |
|openFileDialogOnClick | boolean | true | useful for drag only upload as it does not trigger on enter key or click event |

#### onError arguments

1. `err`: request error message
2. `response`: request response, not support on iframeUpload
3. `file`: upload file

### onSuccess arguments

1. `result`: response body
2. `file`: upload file
3. `xhr`: xhr header, only for modern browsers which support AJAX upload. since
   2.4.0


### customRequest

Allows for advanced customization by overriding default behavior in AjaxUploader. Provide your own XMLHttpRequest calls to interface with custom backend processes or interact with AWS S3 service through the aws-sdk-js package.

> 允许通过覆盖AjaxUploader中的默认行为进行高级自定义。提供您自己的XMLHttpRequest调用，以与自定义后端进程接口，或通过AWS-sdk-js包与AWS S3服务交互。

customRequest callback is passed an object with:

>customRequest回调传递了一个对象，该对象带有：

* `onProgress: (event: { percent: number }): void`
* `onError: (event: Error, body?: Object): void`
* `onSuccess: (body: Object): void`
* `data: Object`
* `filename: String`
* `file: File`
* `withCredentials: Boolean`
* `action: String`
* `headers: Object`


### methods

abort(file?: File) => void: abort the uploading file

## License

rc-upload is released under the MIT license.