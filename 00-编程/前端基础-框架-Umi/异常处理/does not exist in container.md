#开发技巧/调试异常

```
@umijs/runtime“ does not exist in container
```
![](附件/does%20not%20exist%20in%20container.png)

### 解决方案

删除src 下 .umi 文件

### 原因

>.umi是临时文件夹，但是它是匹配当前项目插件的版本，以及一些对应的theme配置，layout配置，虽然我们是直接整个复制过来，但是插件版本上，我们不是使用的固定版本，而是^兼容版本，可能会造成一定的匹配问题