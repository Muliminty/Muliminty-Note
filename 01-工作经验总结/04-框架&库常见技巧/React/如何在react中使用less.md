# 如何在react中使用[[../../../01--前端基础/CSS/预处理器/Less]]

[create-react-app中如何使用less,手把手教会less的用法](../../../%E5%89%AA%E8%97%8F/react/create-react-app%E4%B8%AD%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8less%2C%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BC%9Aless%E7%9A%84%E7%94%A8%E6%B3%95.md)

## 解决npm run eject报错

**报错原因**
git问题，你的版本库有未提交的文件，因为reject后会多出来一些文件。为了不影响。你应该把这些文件加到ignore里或者删掉。

**错误处理**

```JSX
git init
git add .
git commit -m 'save'
npm run eject

```

## 关于样式不生效

我来公布正确答案吧:要使用 css-module 需要将 css 文件命名为fileName.module.[[../../../01--前端基础/CSS/预处理器/Less]]，然后就能在组件中引入并正常使用了，如下：
注意默认情况下后缀必须是.module.less 才能用 css-module 的写法
比如下面代码：

```JSX
import React, { Component } from "react";
import { Button } from "antd";
import styles1 from "./index.module.less";
class Hello extends Component {
render() {
return (   <div className={styles1.main}>     hello     <div className={styles1.text}>world</div>     <Button type="primary">你好</Button>     <div className="text1">heihei</div>   </div> );
}
}
export default Hello;
```

这样就会生效了
import styles './App.less', 是不是少了一个from
import styles from './App.less'
其次就是看你是否开始的module: true, 也就是所谓的模块化！具体的需要看你的配置问价了！一搬网上都会有的