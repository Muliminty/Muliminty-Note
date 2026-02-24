[Site Unreachable](https://zhuanlan.zhihu.com/p/690410849?utm_psn=1886478352740767502)

> Steam Deck是一款由[Valve Corporation](https://zhida.zhihu.com/search?content_id=241555123&content_type=Article&match_order=1&q=Valve+Corporation&zhida_source=entity)开发的便携式游戏主机，于2022年7月首次公布。它采用了自定义的[AMD APU芯片](https://zhida.zhihu.com/search?content_id=241555123&content_type=Article&match_order=1&q=AMD+APU%E8%8A%AF%E7%89%87&zhida_source=entity)，配备了7英寸触摸屏，支持1280*800p分辨率，并内置控制器。Steam Deck旨在为玩家提供一种在移动环境下享受PC游戏的方式，用户可以通过Steam账号访问其Steam游戏库，并通过操作系统基于Linux的[SteamOS](https://zhida.zhihu.com/search?content_id=241555123&content_type=Article&match_order=1&q=SteamOS&zhida_source=entity)来运行游戏。

去年年底的时候入手了一台SD 原生512G，为什么没有买64G改1T双系统呢，一是我觉得我基本不怎么玩盗版，二是我觉得steamOS的proton对原生游戏会有更好的优化，就不折腾装windows了。后面了解到通过插件的方式，能够轻松实现proton启动windows原生exe文件（当然前提是要proton兼容），windows系统可能真的就只剩XGP和galgame需求了。（不会有人用SD办公吧..）

## 国内加速

拿到机子第一反应是比较懵逼，因为系统是基于Linux的，完全不清楚要怎么在这个陌生的环境下翻墙，甚至第一次开机更新steam都等了很久很久，这个过程很痛苦。

首先是要加速steam，这个有很多方法，我想到了用了很久的[steamcommunity302](https://zhida.zhihu.com/search?content_id=241555123&content_type=Article&match_order=1&q=steamcommunity302&zhida_source=entity)，去羽翼城大佬的blog翻了一下，找到了[For steamdeck版](https://link.zhihu.com/?target=https%3A//www.dogfight360.com/blog/10327/)。是先在PC端生成一个证书，再拷贝到Linux本地运行.sh文件注入，它会默认生成一个启动项，这样无论是steamOS还是桌面模式开机，都会自动启动加速。至于怎么copy from PC to SD，我是买了一个USB转TYPE-C的U盘。

其次Linux系统下的商店（[Flathub](https://zhida.zhihu.com/search?content_id=241555123&content_type=Article&match_order=1&q=Flathub&zhida_source=entity)）也是打不开的，如果想要用浏览器上网或者串流PS5，需要用到各种基于Linux的软件。所以换成了国内源，这个是上海交大镜像缓存的Linux商店。

```
# 禁止只读权限 
sudo steamos-readonly disable 
# 将商店源改成镜像源 
sudo flatpak remote-modify flathub --url=https://mirror.sjtu.edu.cn/flathub
```

最后就是科学上网了，其实使用下来，steamcommunity302能满足绝大多数场合的加速需要了，然而如果是想要浏览外网或加速网游，还是需要外挂梯子。目前最简单的办法还是基于steamOS插件商店开发的ToMoon插件，相当于在Linux下外挂Clash。

感谢kurisu

## Decky Loader

插件商店是SD客制化的起点，下面是他的官方github界面。不过没翻墙下载比较慢，可以直接使用ToMoon作者的国内分流，Teminal输入 `curl -L http://dl.ohmydeck.net | sh` 安装。

你可以在[这里](https://link.zhihu.com/?target=https%3A//testing.deckbrew.xyz/)预览官方收集到的插件一览，不过很多大佬（如tomoon作者）开发的插件并没有于官方端发布，需要在开发者模式下输入url手动下载与更新。

其中最好用的就是[CSS Loader](https://link.zhihu.com/?target=https%3A//deckthemes.com/)，他是SD自己的Stylish，可以进一步客制主题、背景、音乐、按键等等功能。算是提升颜值和功能性的一大利器，我个人比较推荐hero art、更好的blur、左右菜单、上下边栏、圆角UI、更改按键颜色、更好的音量UI这几个美化插件。

另外一个重要的美化插件是[SteamGridDB](https://zhida.zhihu.com/search?content_id=241555123&content_type=Article&match_order=1&q=SteamGridDB&zhida_source=entity)，和网页版一样，只是它通过插件商店集成到菜单，能够更方便地更换库游戏的艺术作品（封面、头图、图标及LOGO）。

最后推荐CheatDeck插件，目前最简单的SD开修改器的方法，完美兼容windows下的风灵月影，操作简单，不再需要原来桌面模式大白菜生成快捷方式的方法。

再推荐的话就是HLTP和protonDB，分别是能够显示游戏平均通关时长和proton兼容性。

## 打补丁

这里讲一下原理，Linux通过proton兼容层运行Windows软件，所以Linux下存储的游戏本质是win软件。所以对于覆盖类的补丁，例如汉化补丁、MOD、DLC解锁补丁，使用方法和PC相同；对于exe类可执行文件，可以添加非steam游戏到库，使用proton运行并执行覆盖或安装。

### 学习版游戏

这是不是意味着可以直接玩盗版了呢？对于盗版游戏，存在一个环境问题，有些游戏不能正常运行。SteamDeck运行盗版游戏，大多数人都用的添加Steam库然后强制打开兼容层，如官方自带的或者[GE-Proton](https://zhida.zhihu.com/search?content_id=241555123&content_type=Article&match_order=1&q=GE-Proton&zhida_source=entity)，这些都是模拟Windows环境。但他们只模拟了最基础的WIndows环境，如果还需要一些特殊的支持，比如最常见的[VC++](https://zhida.zhihu.com/search?content_id=241555123&content_type=Article&match_order=1&q=VC%2B%2B&zhida_source=entity)、[Directx9](https://zhida.zhihu.com/search?content_id=241555123&content_type=Article&match_order=1&q=Directx9&zhida_source=entity)等等，如果没有这些环境，那么就会运行报错。如果你买的是正版，那么Steam会自动补充这些环境，但你要玩的是盗版，那么steam只会给你一个最基础的Windows环境，里面空空如也，就会遇到各种报错。

Proton的模拟方法，他是每个游戏单独创建环境目录，所以不同游戏的环境相互独立。所以解决方法是把盗版游戏都尽量模拟到同一个环境，然后尽可能打上所有的环境软件，从而提高盗版的兼容性，增加运行成功的概率。

> 1.下载VC++的Windows版本安装包，这里拿VC举例子，具体你缺什么就找什么，最好找Windows10 64位的，32位大概率安不上。 或者直接找All in One Runtimes这个软件，会自动找缺失的运行库。  
> 2.先和安其他盗版游戏一样，把安装包（exe文件）导入Steam库，然后右键属性强制使用Proton兼容层。这里注意你用谁就一直用谁，不要随便换。比如你用GE-Proton，就一直用，不要一会GE，一会官方。  
> 3.重点来了，先不要启动游戏，在启动项添加如下代码 ：  
> STEAM_COMPAT_DATA_PATH=/home/deck/.local/share/Steam/steamapps/compatdata/1234567890（你选的文件夹）%command%  
> 这里注意，路径最后的数字选一个已经存在的文件夹。可以选一个之前导入过的盗版游戏生成的，也可以第一次不添加该代码，让系统自动生成一个，第二次开始再加这段代码，填入之前生成的数字。这个文件夹就是你后来所有盗版游戏、运行库的安装路径，之后再安任何环境，盗版游戏都添加这段代码。  
> 解释一下原理，这个代码的作用就是不再让系统每个游戏都生成独立文件夹，而是共用你选的这一个文件夹，这样你安装的环境就会让每一个盗版游戏都能适用。也能让多个运行库存在于同一个环境中。 然后你可以挨个添加常用的环境，如DotNet4.0，Directx9，VC++，WMP等。  
> 再强调一下，Proton模拟的环境是Win10 64bit。如果你找的游戏太老了，不支持64位系统，那你再怎么折腾也没法运行，只能直接安装wine来模拟32位环境，但那就是另一个方法了。

### 不兼容的非steam游戏

即使在steam上的正版游戏，依然有大量不兼容的情况，proton仍有bug。对于非staem游戏，例如大多数galgame，无法直接用proton打开。首先是多数日厂游戏的转区问题，需要挂载LE，其次更多的是AVG的游戏引擎不兼容。所以有这方面折腾需求的，建议一步到位折腾windows双系统。

## Proton-GE

这是基于Proton Experimental WINE做的一版非官方proton，简单来说，当你发现不兼容的游戏时，可以试试GE版本能不能运行。同时，它声称能够提高一部分性能，但官方版本也在不断更新迭代，兼容性和性能优化也是越来越好的。

## PS5串流

后续还想讲讲PS5串流，等有时间再写吧。