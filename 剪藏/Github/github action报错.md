最近在部署GitHub pages时报了这样一个错误：
Error: Action failed with "The process '/usr/bin/git' failed with exit code 128"
通过翻阅资料找到解决办法：
首先打开Actions报错的仓库，找到仓库下的settings->Actions->General

![Alt text](img/image-2024年8月14日.png)

往下翻找到Workflow permissions，勾选下面的选项即可

![Alt text](img/image-1-2024年8月14日.png)

返回Actions，重新部署即可成功

![Alt text](img/image-2-2024年8月14日.png)


来自: 【经验分享】【Github】Error: Action failed with “The process ‘/usr/bin/git‘ failed with exit code 128“_github actions部署 128-CSDN博客