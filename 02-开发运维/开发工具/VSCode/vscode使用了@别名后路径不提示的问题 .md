
scode官方提供一个方法：jsconfig.json
在项目根目录下，添加一个jsconfig.json文件，内容如下

```json
{
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "@/*": [
                "src/*"
            ]
        },
        "target": "ES6",
        "module": "commonjs",
        "allowSyntheticDefaultImports": true
    },
  //格式
    "resolveExtensions": [
        ".js",
        ".jsx"
    ],
    "include": [
        "src/**/*"
    ],
    "exclude": [
        "node_modules"
    ]
}
```