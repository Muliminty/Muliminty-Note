安装之前的网络问题参考


https://www.bilibili.com/video/BV1M54y1N7fx/?spm_id_from=333.1391.0.0



安装
```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

执行之后

```sh
muliminty@mulimintydeMacBook-Air ~ % curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 16631  100 16631    0     0    197      0  0:01:24  0:01:24 --:--:--  1887
=> Downloading nvm from git to '/Users/muliminty/.nvm'
=> Cloning into '/Users/muliminty/.nvm'...
remote: Enumerating objects: 382, done.
remote: Counting objects: 100% (382/382), done.
remote: Compressing objects: 100% (325/325), done.
remote: Total 382 (delta 43), reused 178 (delta 29), pack-reused 0 (from 0)
Receiving objects: 100% (382/382), 385.93 KiB | 26.00 KiB/s, done.
Resolving deltas: 100% (43/43), done.
* (HEAD detached at FETCH_HEAD)
  master
=> Compressing and cleaning up git repository

=> Profile not found. Tried ~/.bashrc, ~/.bash_profile, ~/.zprofile, ~/.zshrc, and ~/.profile.
=> Create one of them and run this script again
   OR
=> Append the following lines to the correct file yourself:

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

=> Close and reopen your terminal to start using nvm or run the following to use it now:

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
muliminty@mulimintydeMacBook-Air ~ % 

```

下面是 ai 回复的操作流程

---

您的 NVM 安装已经成功完成了关键步骤，但还需要完成后续配置。根据输出显示：

```text
Profile not found. Tried ~/.bashrc, ~/.bash_profile, ~/.zprofile, ~/.zshrc, and ~/.profile.
Create one of them and run this script again OR append the following lines...
```

之后下面内容参考

projects/Muliminty-Note/01-计算机科学体系/操作系统/macos/使用 Vim 编辑 .zshrc 文件的详细流程.md