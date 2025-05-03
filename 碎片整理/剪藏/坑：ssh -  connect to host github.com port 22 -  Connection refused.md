[Site Unreachable](https://zhuanlan.zhihu.com/p/521340971)
## **问题现象**

本文以Windows系统为例进行说明，在个人电脑上使用[Git](https://zhida.zhihu.com/search?content_id=203985854&content_type=Article&match_order=1&q=Git&zhida_source=entity)命令来操作[GitHub](https://zhida.zhihu.com/search?content_id=203985854&content_type=Article&match_order=1&q=GitHub&zhida_source=entity)上的项目，本来都很正常，突然某一天开始，会提示如下错误`ssh: connect to host github.com port 22: Connection refused`。

```
$ git pull
ssh: connect to host github.com port 22: Connection refused
fatal: Could not read from remote repository.
​
Please make sure you have the correct access rights
and the repository exists.
```

## **排查思路**

`ssh: connect to host github.com port 22: Connection refused`这个错误提示的是连接`github.com`的22端口被拒绝了。

原本以为[http://github.com](https://link.zhihu.com/?target=http%3A//github.com)挂了，但是浏览器访问[http://github.com](https://link.zhihu.com/?target=http%3A//github.com)一切正常。

网上搜索这个报错，发现很多人遇到这个问题，大概有2个原因和对应解决方案：

### **使用GitHub的443端口**

22端口可能被防火墙屏蔽了，可以尝试连接GitHub的443端口。

````
$ vim ~/.ssh/config
```
# Add section below to it
Host github.com
  Hostname ssh.github.com
  Port 443
```
$ ssh -T git@github.com
Hi xxxxx! You've successfully authenticated, but GitHub does not
provide shell access.
````

这个解决方案的思路是：给`~/.ssh/config`文件里添加如下内容，这样ssh连接GitHub的时候就会使用443端口。

```
Host github.com
  Hostname ssh.github.com
  Port 443
```

如果`~/.ssh`目录下没有config文件，新建一个即可。

修改完`~/.ssh/config`文件后，使用`ssh -T git@github.com`来测试和GitHub的网络通信是否正常，如果提示`Hi xxxxx! You've successfully authenticated, but GitHub does not provide shell access.` 就表示一切正常了。

但是，这个方案在我这里行不通，修改后还是提示`ssh: connect to host github.com port 443: Connection refused`。

**这个方案有效的前提是**：执行命令`ssh -T -p 443 git@ssh.github.com`后不再提示`connection refused`，所以要尝试这个方案的小伙伴先执行这条命令测试下。

### **使用https协议，不要使用ssh协议**

在你的GitHub的本地repo目录，执行如下命令：

然后把里面的url配置项从git格式

```
url = git@github.com:username/repo.git
```

修改为https格式

```
url = https://github.com/username/repo.git
```

这个其实修改的是repo根目录下的`./git/config`文件。

**但是这个方法在我这里同样不生效**。

## **解决方案**

网上的招都没用，只能自力更生了。既然和GitHub建立ssh连接的时候提示`connection refused`，那我们就详细看看建立ssh连接的过程中发生了什么，可以使用`ssh -v`命令，`-v`表示verbose，会打出详细日志。

```
$ ssh -vT git@github.com
OpenSSH_9.0p1, OpenSSL 1.1.1o  3 May 2022
debug1: Reading configuration data /etc/ssh/ssh_config
debug1: Connecting to github.com [::1] port 22.
debug1: connect to address ::1 port 22: Connection refused
debug1: Connecting to github.com [127.0.0.1] port 22.
debug1: connect to address 127.0.0.1 port 22: Connection refused
ssh: connect to host github.com port 22: Connection refused
```

从上面的信息马上就发现了诡异的地方，连接[http://github.com](https://link.zhihu.com/?target=http%3A//github.com)的地址居然是`::1`和`127.0.0.1`。前者是IPV6的localhost地址，后者是IPV4的localhost地址。

到这里问题就很明确了，是[DNS解析](https://zhida.zhihu.com/search?content_id=203985854&content_type=Article&match_order=1&q=DNS%E8%A7%A3%E6%9E%90&zhida_source=entity)出问题了，导致[http://github.com](https://link.zhihu.com/?target=http%3A//github.com)域名被解析成了localhost的ip地址，就自然连不上GitHub了。

Windows下执行`ipconfig /flushdns` 清楚DNS缓存后也没用，最后修改hosts文件，增加一条github.com的域名映射搞定。

查找[http://github.com](https://link.zhihu.com/?target=http%3A//github.com)的ip地址可以使用[https://dnschecker.org/](https://link.zhihu.com/?target=https%3A//dnschecker.org/)来查询github.com在全球的ip地址，也可以通过

[https://api.github.com/meta](https://link.zhihu.com/?target=https%3A//api.github.com/meta) 查看github.com官方公布的IP地址

这个问题其实就是DNS解析被污染了，有2种可能：

- DNS解析被运营商劫持了
- 使用了科学上网工具

按照我上面写的解决方案操作即可解决。

## **最后大招**

如果你发现DNS解析并没有解析到127.0.0.1，但是执行ssh -vT [git@github.com](mailto:git@github.com)就是显示当前github.com解析的ip连接22端口和443端口失败，那就直接去[https://dnschecker.org/](https://link.zhihu.com/?target=https%3A//dnschecker.org/)或者[https://api.github.com/meta](https://link.zhihu.com/?target=https%3A//api.github.com/meta)找另外的可用ip。

然后修改自己电脑上的DNS解析host文件，把[http://github.com](https://link.zhihu.com/?target=http%3A//github.com)解析到新的ip，然后再测试。

## **References**

- [https://chaxuri.com/archives/43.html](https://link.zhihu.com/?target=https%3A//chaxuri.com/archives/43.html)
- [https://stackoverflow.com/questions/15589682/ssh-connect-to-host-github-com-port-22-connection-timed-out](https://link.zhihu.com/?target=https%3A//stackoverflow.com/questions/15589682/ssh-connect-to-host-github-com-port-22-connection-timed-out)
- [https://docs.github.com/en/authentication/troubleshooting-ssh/error-permission-denied-publickey](https://link.zhihu.com/?target=https%3A//docs.github.com/en/authentication/troubleshooting-ssh/error-permission-denied-publickey)
- [https://gist.github.com/Tamal/1cc77f88ef3e900aeae65f0e5e504794](https://link.zhihu.com/?target=https%3A//gist.github.com/Tamal/1cc77f88ef3e900aeae65f0e5e504794)