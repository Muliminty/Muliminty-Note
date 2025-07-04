## 1. Mac M系列芯片的笔记本使用nvm安装Node16以下版本的Node环境失败

使用`nvm install 14.21.3`命令安装Node 14的时候，首先是提示找不到需要下载的Node源文件，然后一直在输出安装过程中的一些依赖包名，跑了好几分钟也没有着落，最后才报了一个安装失败的结果，尝试多次都是一样。

#### 解决办法

参考issues ：[github.com/nvm-sh/nvm/…](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fnvm-sh%2Fnvm%2Fissues%2F2944 "https://github.com/nvm-sh/nvm/issues/2944") Nvm install fails with version 14.17.1 · Issue #2641 · nvm-sh/nvm · GitHub（[github.com/nvm-sh/nvm/…](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fnvm-sh%2Fnvm%2Fissues%2F2641%25EF%25BC%2589 "https://github.com/nvm-sh/nvm/issues/2641%EF%BC%89")

因为Mac的M系列芯片在安装16版本之前的node时，需要使用 rosetta 终端。

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/91697a36ba904f86b5bc5826c60a416b~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgbGl1bmlhbnNpbGVuY2U=:q75.awebp?rk3s=f64ab15b&x-expires=1752202800&x-signature=BTpBgP8Y7H8dyp9SCQlBqJ6Gq8c%3D)

可以在「访达」里通过搜索名称找到「终端」，然后右击查看简介。

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/e8798b526062490884f05b750915116c~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgbGl1bmlhbnNpbGVuY2U=:q75.awebp?rk3s=f64ab15b&x-expires=1752202800&x-signature=oU4aaNZKafv0FCTGSHF4%2FI3ZQHI%3D)

在这里勾上「使用Rosetta打开」。

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/81d8f74614854ed59185c207466f6d00~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgbGl1bmlhbnNpbGVuY2U=:q75.awebp?rk3s=f64ab15b&x-expires=1752202800&x-signature=aD3NmjjX4zOUYeviS1qk%2Bj3eA8o%3D)

然后，一定要关闭「终端」，重启「终端」。 这时候再运行`nvm install 14.21.3`就可以work了。

### 一些关于Rosetta的额外信息

> "使用 Rosetta 打开" 是 macOS 中的一项功能，主要用于在 Apple Silicon（如 M1、M1 Pro、M1 Max、M1 Ultra 以及 M2 等芯片）设备上运行为 Intel 架构设计的应用程序。

#### Rosetta 2 简介

Rosetta 2 是苹果公司开发的一种翻译层，它使得基于 Intel 架构的应用程序能够在 Apple Silicon 芯片上运行。它在后台自动工作，将为 Intel 编译的指令翻译为 Apple Silicon 可以理解的指令。这种转换通常是无缝的，因此用户可以在 Apple Silicon 设备上运行未被原生移植的应用程序。

#### "使用 Rosetta 打开" 选项的作用

在 Apple Silicon 设备上，某些应用程序或工具可能会同时包含适用于 Intel 和 Apple Silicon 的代码，称为“通用二进制”。这些应用程序可以在这两种架构上原生运行。

在某些情况下，用户可能需要特意以 Intel 模式运行应用程序，即使存在 Apple Silicon 的原生版本。例如：

1. **兼容性需求**：某些插件或扩展可能仅在 Intel 模式下工作。
2. **开发和测试**：开发人员可能需要测试他们的应用程序在 Intel 环境中的表现。

#### 注意事项

- **性能**：通过 Rosetta 2 翻译的应用程序通常会比原生 Apple Silicon 应用程序略慢，因为存在指令翻译的开销。不过，Rosetta 2 的性能相当优秀，能够让大多数应用程序平稳运行。
- **兼容性**：并非所有应用程序都能够在 Rosetta 2 上顺利运行。少数应用程序可能会因为底层技术差异而无法正确工作。

“使用 Rosetta 打开”功能是 Apple 为了保证过渡到自家芯片（Apple Silicon）的平稳进行而设计的工具，确保用户能够继续使用现有的 Intel 架构应用程序。如果你的工作流中需要使用某些特定的 Intel 工具或插件，可以使用这个选项来保证兼容性。

## 2. Mac M系列芯片的笔记本安装python2失败

有一个老项目的环境安装时候提示：

> gyp verb check python checking for Python executable "python2" in the PATH

这个报错是因为 `node-gyp` 工具正在检查系统中是否安装了 Python 2，因为它需要 Python 来编译 C++ 插件。`node-gyp` 是一个 `Node.js` 的构建工具，主要用于编译那些包含本地 C/C++ 代码的 `Node.js` 插件。历史上，它依赖 `Python 2` 作为构建脚本的执行环境。

首选的安装方式，我使用了`Homebrew`，

```
brew install python@2
```

但是失败了，报错信息：

> No available formula with the name "python@2". Did you mean bpython, ipython, jython or cython?

因为`Homebrew`现在不再提供python@2的安装了，因为 Python 2 已经在 2020 年 1 月 1 日正式结束支持（EOL），Homebrew 团队也已经从其核心仓库中移除了 Python 2 的支持。为了解决python2的安装，这里引入`pyenv`。

> pyenv 是一个用于管理多个 Python 版本的工具，它可以安装和管理多种版本的 Python，包括已过时的 Python 2。你可以通过 Homebrew 安装 pyenv 并使用它来安装 Python 2。

这里先用`Homebrew`安装`pyenv`:

```
brew install pyenv
```

然后用`pyenv`来安装python2，我这里装的是python 2.7.18:

```
pyenv install 2.7.18

// 设置默认python版本
pyenv global 2.7.18
```

为了确保 pyenv 的命令在你的 Shell 中可用，你需要在 Shell 配置文件中添加 pyenv 的初始化代码。根据你使用的 Shell，不同的配置文件包括：

- **Bash**: ~/.bashrc 或 ~/.bash_profile
- **Zsh**: ~/.zshrc

添加以下内容到你的 Shell 配置文件：

```
# Load pyenv automatically by adding
# the following to ~/.zshrc:

export PATH="$HOME/.pyenv/bin:$PATH"
eval "$(pyenv init --path)"
eval "$(pyenv init -)"
```

加载配置：

```
source ~/.zshrc  # 或者 source ~/.bashrc
```

检查安装的 Python 2 是否可以直接运行：

```
python --version
```

它应该输出类似 Python 2.7.18 的信息。

## 3、容器部署时候报错node-sass相关的错误

node-sass真是一个神奇的东西，前端项目里用到这个的，很多都是要用Node v14才能跑起来。不然就报错。 这不，有个老项目，是本地构建可以成功，但是一去容器化部署的时候，就报错构建故障，报错内容：

```

error /workspace/source-code/node_modules/node-sass: Command failed.
Exit code: 1
Command: node scripts/build.js
Arguments: 
Directory: /workspace/source-code/node_modules/node-sass
Output:
Building: /usr/local/bin/node /workspace/source-code/node_modules/node-gyp/bin/node-gyp.js rebuild --verbose --libsass_ext= --libsass_cflags= --libsass_ldflags= --libsass_library=
gyp info it worked if it ends with ok
gyp verb cli [
gyp verb cli   '/usr/local/bin/node',
gyp verb cli   '/workspace/source-code/node_modules/node-gyp/bin/node-gyp.js',
gyp verb cli   'rebuild',
gyp verb cli   '--verbose',
gyp verb cli   '--libsass_ext=',
gyp verb cli   '--libsass_cflags=',
gyp verb cli   '--libsass_ldflags=',
gyp verb cli   '--libsass_library='
gyp verb cli ]
gyp info using node-gyp@7.1.2
gyp info using node@14.17.5 | linux | x64
gyp verb command rebuild []
gyp verb command clean []
gyp verb clean removing "build" directory
gyp verb command configure []
gyp verb find Python Python is not set from command line or npm configuration
gyp verb find Python Python is not set from environment variable PYTHON
gyp verb find Python checking if "python3" can be used
gyp verb find Python - executing "python3" to get executable path
gyp verb find Python - executable path is "/usr/bin/python3"
gyp verb find Python - executing "/usr/bin/python3" to get version
gyp verb find Python - version is "3.5.3"
gyp info find Python using Python version 3.5.3 found at "/usr/bin/python3"
gyp verb get node dir no --target version specified, falling back to host node version: 14.17.5
gyp verb command install [ '14.17.5' ]
gyp verb install input version string "14.17.5"
gyp verb install installing version: 14.17.5
gyp verb install --ensure was passed, so won't reinstall if already installed
gyp verb install version not already installed, continuing with install 14.17.5
gyp verb ensuring nodedir is created /tekton/home/.cache/node-gyp/14.17.5
gyp verb created nodedir /tekton/home/.cache
gyp http GET https://nodejs.org/download/release/v14.17.5/node-v14.17.5-headers.tar.gz
gyp WARN install got an error, rolling back install
gyp verb command remove [ '14.17.5' ]
gyp verb remove using node-gyp dir: /tekton/home/.cache/node-gyp
gyp verb remove removing target version: 14.17.5
gyp verb remove removing development files for version: 14.17.5
gyp ERR! configure error 
gyp ERR! stack Error: connect ETIMEDOUT 104.20.23.46:443
gyp ERR! stack     at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1148:16)
gyp ERR! System Linux 5.10.134-16.1.al8.x86_64
gyp ERR! command "/usr/local/bin/node" "/workspace/source-code/node_modules/node-gyp/bin/node-gyp.js" "rebuild" "--verbose" "--libsass_ext=" "--libsass_cflags=" "--libsass_ldflags=" "--libsass_library="
gyp ERR! cwd /workspace/source-code/node_modules/node-sass
gyp ERR! node -v v14.17.5
gyp ERR! node-gyp -v v7.1.2
gyp ERR! not ok 
Build failed with error code: 1
info Visit https://yarnpkg.com/en/docs/cli/install for documentation about this command.
('code is : ', 256)
Traceback (most recent call last):
  File "./build/ci-build.py", line 187, in <module>
    commandFailExit("/bin/bash -c pwd && %s" % appInfo['build_opts'])
  File "./build/ci-build.py", line 42, in commandFailExit
    raise Exception("命令执行失败" + command)
Exception: 命令执行失败/bin/bash -c pwd && yarn install  && yarn build:pre
```

看报错内容，是请求下载node的时候失败了，CI侧的同学帮忙排查后指出，问题的源头在于报错信息的第一行node-sass这里就已经请求失败了。我们npmrc指定的源是`https://registry.npmmirror.com`。而这个容器集群所有在IP是在国外的，因此在请求nodejs的相关地址去做下载的时候会失败。

最后给出的建议是：单独在.npmrc文件里再指定一下node-sass的下载路径：

```
sass_binary_site=https://npmmirror.com/mirrors/node-sass/
```

再在容器里指定构建build命令时候就ok了。 参考issue：[github.com/lmk123/blog…](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Flmk123%2Fblog%2Fissues%2F28 "https://github.com/lmk123/blog/issues/28")

node-sass也确实是一个奇葩，有些文章里就有人加以抛弃掉node-sass，用别的库来替代，比如：**《前端工程中，node-sass 替换为 dart-sass 方案》**， [www.zhihu.com/tardis/zm/a…](https://link.juejin.cn/?target=https%3A%2F%2Fwww.zhihu.com%2Ftardis%2Fzm%2Fart%2F609000672%3Fsource_id%3D1005 "https://www.zhihu.com/tardis/zm/art/609000672?source_id=1005")

#### Q：每一个npm包都可以像这样 通过一个特定key来在Npmrc文件里指定下载路径吗？

并不是所有的 npm 包都可以通过特定的 key 在 `.npmrc` 文件中指定下载路径。只有一些需要下载二进制文件或其他特殊依赖的 npm 包，通常会提供类似的配置选项。这些配置选项通常由包的维护者定义，用于覆盖默认的下载路径或行为。

### 常见支持自定义下载路径的包：

1. **`node-sass`**:
    
    - 配置项：`sass_binary_site`
    - 作用：指定 `node-sass` 的二进制文件下载地址。
2. **`puppeteer`**:
    
    - 配置项：`PUPPETEER_DOWNLOAD_HOST`
    - 作用：指定 Puppeteer 的 Chromium 浏览器下载地址。
3. **`electron`**:
    
    - 配置项：`ELECTRON_MIRROR`
    - 作用：指定 Electron 的二进制文件下载镜像。
4. **`canvas`**:
    
    - 配置项：`CANVAS_BINARY_HOST_MIRROR`
    - 作用：指定 `node-canvas` 的二进制文件下载地址。
5. **`sharp`**:
    
    - 配置项：`SHARP_DIST_BASE_URL`
    - 作用：指定 `sharp` 图像处理库的二进制文件下载路径。

### 配置方式：

对于这些包，你可以在 `.npmrc` 文件中添加相应的配置项，以指定下载路径。例如：

```
sass_binary_site=https://npmmirror.com/mirrors/node-sass/
PUPPETEER_DOWNLOAD_HOST=https://npmmirror.com/mirrors/puppeteer/
ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
```

### 对于其他包：

对于大多数 npm 包，尤其是纯 JavaScript 实现的包，不涉及二进制文件下载，因此也不需要类似的配置项。包的下载和安装通常是通过 npm 的 `registry` 配置来决定的。

### 总结：

只有部分需要下载二进制文件或其他特殊依赖的 npm 包支持通过 `.npmrc` 中的特定 key 来指定下载路径。这些配置项由包的维护者定义，通常用于解决网络连接问题或加快下载速度。其他大多数 npm 包则依赖于全局的 `registry` 配置进行下载。