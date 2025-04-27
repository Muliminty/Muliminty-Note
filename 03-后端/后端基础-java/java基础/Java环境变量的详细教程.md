### ​**一、准备工作**​

1. ​**下载并安装JDK**​
    - 访问Oracle官网或OpenJDK下载适合你操作系统的JDK版本。
    - 安装JDK，记录安装路径（如：`C:\Program Files\Java\jdk-21` 或 `/usr/lib/jvm/jdk-21`）。

---

### ​**二、Windows系统配置**​

#### ​**1. 配置JAVA_HOME**​

1. 右键点击【此电脑】→【属性】→【高级系统设置】→【环境变量】。
2. 在【系统变量】中点击【新建】：
    - 变量名：`JAVA_HOME`
    - 变量值：JDK安装路径（如：`C:\Program Files\Java\jdk-21`）

#### ​**2. 配置PATH变量**​

1. 在【系统变量】中找到`Path`，点击【编辑】→【新建】。
2. 添加两条路径：
    
    markdown
    
    复制
    
    ```markdown
    %JAVA_HOME%\bin
    %JAVA_HOME%\jre\bin
    ```
    

#### ​**3. 验证配置**​

打开命令提示符（CMD）输入：

bash

复制

```bash
java -version
javac -version
```

若显示版本信息，则配置成功。

---

### ​**三、macOS系统配置**​

#### ​**1. 配置JAVA_HOME**​

1. 打开终端（Terminal），输入：
    
    bash
    
    复制
    
    ```bash
    sudo nano ~/.bash_profile  # 或 ~/.zshrc（针对Zsh用户）
    ```
    
2. 添加以下内容：
    
    bash
    
    复制
    
    ```bash
    export JAVA_HOME=$(/usr/libexec/java_home)
    export PATH=$JAVA_HOME/bin:$PATH
    ```
    
3. 按 `Ctrl+O` 保存，`Ctrl+X` 退出编辑器。

#### ​**2. 生效配置**​

bash

复制

```bash
source ~/.bash_profile  # 或 source ~/.zshrc
```

#### ​**3. 验证配置**​

bash

复制

```bash
java -version
javac -version
```

---

### ​**四、Linux系统配置**​

#### ​**1. 配置JAVA_HOME**​

1. 打开终端，编辑环境变量文件：
    
    bash
    
    复制
    
    ```bash
    sudo nano /etc/profile  # 或 ~/.bashrc（当前用户）
    ```
    
2. 添加以下内容：
    
    bash
    
    复制
    
    ```bash
    export JAVA_HOME=/usr/lib/jvm/jdk-21  # 替换为你的JDK路径
    export PATH=$JAVA_HOME/bin:$PATH
    ```
    

#### ​**2. 生效配置**​

bash

复制

```bash
source /etc/profile  # 或 source ~/.bashrc
```

#### ​**3. 验证配置**​

bash

复制

```bash
java -version
javac -version
```

---

### ​**五、常见问题解决**​

1. ​**提示“命令未找到”​**​
    
    - 检查`JAVA_HOME`路径是否正确。
    - 确保`PATH`中包含了`$JAVA_HOME/bin`。
2. ​**多版本JDK切换**​
    
    - ​**macOS/Linux**​：使用`update-alternatives --config java`选择默认版本。
    - ​**Windows**​：在环境变量中修改`JAVA_HOME`路径。
3. ​**路径中有空格**​
    
    - Windows路径如`Program Files`需用双引号包裹：`"C:\Program Files\Java\jdk-21"`

---

通过以上步骤，Java环境变量即可配置完成！如有其他问题，欢迎随时提问。 😊