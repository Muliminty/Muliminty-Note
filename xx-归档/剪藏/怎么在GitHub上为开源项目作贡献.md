[Site Unreachable](https://zhuanlan.zhihu.com/p/23457016)

GitHub 是目前最流行的 Git 代码仓库托管网站，本文将一步步讲解怎么在 GitHub 上为开源项目作贡献 (make contributions)。

GitHub 上有很多非常流行的开源项目，比如 [Ruby on Rails](https://zhida.zhihu.com/search?content_id=1568876&content_type=Article&match_order=1&q=Ruby+on+Rails&zhida_source=entity), [jQuery](https://zhida.zhihu.com/search?content_id=1568876&content_type=Article&match_order=1&q=jQuery&zhida_source=entity), [Docker](https://zhida.zhihu.com/search?content_id=1568876&content_type=Article&match_order=1&q=Docker&zhida_source=entity), [Go](https://zhida.zhihu.com/search?content_id=1568876&content_type=Article&match_order=1&q=Go&zhida_source=entity) 等等。

**通常人们为开源项目作贡献的方式是使用 pull request 。**一个 pull request, 是一个包含了很多信息的补丁，并且允许人们在 GitHub 上讨论。

以下内容就是教你怎么给一个项目提交 pull request 。

## **1. 选择你想作贡献的项目**

如果你决定为一个项目作贡献，很可能是因为你在使用这个项目，并且你发现了一个 bug, 或者认为有一个功能的实现方式很糟糕。

你可以浏览 GitHub 的当下最流行项目 [[Explore · GitHub](https://link.zhihu.com/?target=https%3A//github.com/explore)], 或者搜索关键词找到特定的项目。**当你准备为一个项目作贡献时，你要确认一下这个项目还有没有人维护，否则你的 pull request 可能永远不会有任何反馈。**

如果你没找到 bug 或者没有更好的想法，你可以看看这个项目的 issues 部分，在里面找一些开放的任务。维护者会在 issues 上加一些标签，你可以很容易地发现一些还没有分配的任务。

![](https://pic2.zhimg.com/v2-8941e168e08dc25e7ec4990ca545e663_1440w.png)

有时候，维护者会把简单的任务高亮，鼓励新的贡献者加入项目，比如图中的 "easy fix" 标签。

## **2. 查看怎么作贡献**

这一步很重要，可以**防止你用错误的方式去作贡献，这会浪费你还有维护者的很多时间**。

有些流行的项目，比如 Linux kernel, git 是把 GitHub 当作一个镜像，但他们不会在 GitHub　上接受任何贡献。

当你打开这个项目的主页，你可以先看看一些注释，维护者可能会提到怎么为项目作贡献。

通常有一个专门的文件叫做 CONTRIBUTING.md, 里面会有详细的说明。不过有时候你会在 [README.md](https://zhida.zhihu.com/search?content_id=1568876&content_type=Article&match_order=1&q=README.md&zhida_source=entity) 的结尾处看到贡献说明。

![](https://pic3.zhimg.com/v2-1cb9ffaaa0b4bf36b65de895ae364226_1440w.png)

开始工作之前，最好检查一下已经存在的 issues 和 pull requests, 这样确保你不会重复做别人已经在做的事情。

## **3. [Fork](https://zhida.zhihu.com/search?content_id=1568876&content_type=Article&match_order=1&q=Fork&zhida_source=entity) 这个项目**

当你确定这个项目接受 pull requests，并且你发现的 bug 或者想法还没有人发现，那么你可以 fork 这个项目了。

![](https://pica.zhimg.com/v2-9056e065a0fb386ed00a68455d14995a_1440w.png)

Fork 一个项目会在你的 GitHub 主页创建一个项目的拷贝，一模一样。这只需要点击项目主页右上角的 fork 按钮。

## **4. [Clone](https://zhida.zhihu.com/search?content_id=1568876&content_type=Article&match_order=1&q=Clone&zhida_source=entity) 已经 fork 的项目**

当你 fork 一个项目之后，你需要把它克隆到你的电脑上，这样你才能开始工作。

要 clone 这个项目，你先打开你自己的 GitHub 主页，找到 fork 过来的项目，打开后点击右上角的 "Clone or download" 按钮，得到复制的地址。

![](https://pic4.zhimg.com/v2-0f114fda797356331e99d487b29f13c5_1440w.png)

GitHub 为克隆项目提供了两种传输协议： [HTTPS](https://zhida.zhihu.com/search?content_id=1568876&content_type=Article&match_order=1&q=HTTPS&zhida_source=entity) 和 [SSH](https://zhida.zhihu.com/search?content_id=1568876&content_type=Article&match_order=1&q=SSH&zhida_source=entity) 。关于这个主题的更多内容可以看[这里](https://link.zhihu.com/?target=https%3A//help.github.com/articles/which-remote-url-should-i-use/)。这里假设你决定使用 HTTPS 。

当你复制了项目 URL，你可以在 Git 客户端或者 shell 里 clone 项目：

```
$ git clone https://github.com/YOUR_USERNAME/PROJECT.git
```

Clone 一个项目会在你的硬盘上创建一个文件夹，里面有项目的所有文件，还有跟踪文件变化的 git 文件夹。

## **5. 设置克隆过来的项目**

进入克隆过来的项目文件夹，将原来项目的 URL 添加到你的本地代码仓库，这样你就可以随时从原来的项目 pull 最新的修改:

```
$ git remote add upstream https://github.com/PROJECT_USERNAME/PROJECT.git
```

我用 upstream (上游) 作为远程仓库的名字，这是 GitHub 的风格，但是你可以用任何名字。

现在远程仓库列表是这样的:

```
$ git remote -v
origin https://github.com/YOUR_USERNAME/PROJECT.git (fetch)
origin https://github.com/YOUR_USERNAME/PROJECT.git (push)
upstream https://github.com/PROJECT_USERNAME/PROJECT.git (fetch)
upstream https://github.com/PROJECT_USERNAME/PROJECT.git (push)
```

  

## **6. 创建一个分支**

在修改 bug 或者添加功能之前，你先要创建一个本地分支，这是你将要开展工作的地方。用这个命令：

```
$ git checkout -b BRANCH_NAME
```

这会创建一个新分支，而且在你的本地仓库里，处于激活状态。**你最好用一个可以描述你要做什么的分支名字。**

你可以查看当前在哪个分支上：

```
$ git branch
  master
* BRANCH_NAME
```

当前激活的分支前面有一个 ***** 。

## **7. 开展工作**

现在你可以开始修改项目。你最好一次只关注一个功能或者 bug, 这极为重要。尝试在一个 pull request 里做好几件事会产生混乱，因为要将它们分开处理将变得不可能。

当你在修改项目时，**请记住经常从上游 (upstream) 分支 pull 最新的修改**，或至少在你把自己的修改 push 到你的 fork 之前，从上游拉回一次新的变动。这会强制你在提交 pull request 之前，修正可能的冲突部分。

## **8. 提起 pull request**

当你需要做的修改完成之后，你需要把你的修改 push 到你在 GitHub 上的 fork 上:

```
$ git push origin BRANCH_NAME
```

现在你用浏览器打开你的 GitHub, 点开你 fork 的项目，你会在项目顶上看到一个绿色的按钮，它可以用来 提起 pull request:

![](https://pic2.zhimg.com/v2-7ccad6e1616b7feba23c7c1a3f560f97_1440w.png)

点击这个按钮，你会看到一个页面，显示你的分支和原来的分支之间不同的部分。

在点击确定之前，记住一定要检查一下所有修改都很没有问题，并且包含了足够的信息，能够**让维护者知道你干了什么，为什么这么干**。

## **9. 后续跟踪**

上帝保佑，希望项目的维护者会查看你的 pull request, 然后给你一些反馈，或者通知你他很快会合并你的改动。他们也可能请你做一些修改，当然也可能拒绝接受你的贡献。不论什么，都会在 GitHub 上讨论，任何人评论你的 pull request, 你都会通过 Email 收到通知。

## **10. 收拾干净**

当你的贡献被合并到主项目，或者被拒绝，你就可以删掉你工作的分支了。

删除本地仓库里的分支：

```
$ git branch -D BRANCH_NAME
```

删除 GitHub 上的分支：

```
$ git push origin --delete BRANCH_NAME
```

  

## **结语**

希望这些能帮助你明白怎样去给 GitHub 上的开源项目作贡献。如果你有任何问题，欢迎留下评论。如果你觉得有用，请点赞或分享给别人。

编译自：

[How to contribute to an open source project on GitHub](https://link.zhihu.com/?target=http%3A//blog.davidecoppola.com/2016/11/howto-contribute-to-open-source-project-on-github/)