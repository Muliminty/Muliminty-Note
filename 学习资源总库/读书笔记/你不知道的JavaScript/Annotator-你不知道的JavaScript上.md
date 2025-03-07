---
annotation-target: ../../小册/PDF/你不知道的JavaScript（上卷）.pdf
---




>%%
>```annotation-json
>{"created":"2024-12-18T03:44:28.895Z","text":"### **解析/语法分析（Parsing）的核心概念总结：**\n\n1. **定义**  \n   - **解析（Parsing）：** 解析是将词法单元（Token）序列转化为树状结构的过程，该树反映了程序的语法结构。  \n   - 生成的树状结构称为**抽象语法树（Abstract Syntax Tree, AST）**。\n\n2. **抽象语法树（AST）**  \n   - AST 是一种表示程序语法结构的分层树形结构，节点类型和层次关系对应代码的语法规则。  \n   - AST 中的每个节点都有具体的含义，比如变量声明、赋值表达式等。\n\n3. **示例：代码 `var a = 2;` 的解析过程**  \n   - **词法单元流（Tokens）：**  \n     `['var', 'a', '=', '2', ';']`\n   - **抽象语法树（AST）：**  \n     ```plaintext\n     VariableDeclaration\n     ├── Identifier (a)\n     └── AssignmentExpression\n         └── NumericLiteral (2)\n     ```\n     - 顶层节点：`VariableDeclaration`，表示变量声明。  \n     - 子节点：`Identifier` 表示变量名称，`AssignmentExpression` 表示赋值操作。  \n     - `AssignmentExpression` 的子节点：`NumericLiteral`，表示赋值的值是数值 2。\n\n4. **解析的意义**  \n   - 解析是从线性结构（Token 流）转化为分层的语法结构，便于后续语义分析和代码生成。  \n   - AST 是编译器或解释器优化代码和生成目标代码的关键数据结构。\n\n---\n\n### **总结**\n解析是编译器的重要步骤，通过将 Token 流构造为抽象语法树（AST），为代码的深度理解和操作奠定基础。AST 使得程序的语法结构清晰明了，能够很好地支持后续的优化、语义检查和代码生成。","updated":"2024-12-18T03:44:28.895Z","document":{"title":"","link":[{"href":"urn:x-pdf:b461c29b2ae560e1cb6142263aa3e67a"}],"documentFingerprint":"b461c29b2ae560e1cb6142263aa3e67a"},"uri":"urn:x-pdf:b461c29b2ae560e1cb6142263aa3e67a","target":[{"source":"urn:x-pdf:b461c29b2ae560e1cb6142263aa3e67a","selector":[{"type":"TextPositionSelector","start":24928,"end":24944},{"type":"TextQuoteSelector","exact":"解析/语法分析（Parsing）","prefix":"分时，调用的是有状态的解析规则，那么这个过程就被称为词法 分析。","suffix":"• 这个过程是将词法单元流（数组）转换成一个由元素逐级嵌套所组成"}]}]}
>```
>%%
>*%%PREFIX%%分时，调用的是有状态的解析规则，那么这个过程就被称为词法 分析。%%HIGHLIGHT%% ==解析/语法分析（Parsing）== %%POSTFIX%%• 这个过程是将词法单元流（数组）转换成一个由元素逐级嵌套所组成*
>%%LINK%%[[#^offe8ry8xbg|show annotation]]
>%%COMMENT%%
>### **解析/语法分析（Parsing）的核心概念总结：**
>
>1. **定义**  
>   - **解析（Parsing）：** 解析是将词法单元（Token）序列转化为树状结构的过程，该树反映了程序的语法结构。  
>   - 生成的树状结构称为**抽象语法树（Abstract Syntax Tree, AST）**。
>
>1. **抽象语法树（AST）**  
>   - AST 是一种表示程序语法结构的分层树形结构，节点类型和层次关系对应代码的语法规则。  
>   - AST 中的每个节点都有具体的含义，比如变量声明、赋值表达式等。
>
>1. **示例：代码 `var a = 2;` 的解析过程**  
>   - **词法单元流（Tokens）：**  
>     `['var', 'a', '=', '2', ';']`
>   - **抽象语法树（AST）：**  
>     ```plaintext
>     VariableDeclaration
>     ├── Identifier (a)
>     └── AssignmentExpression
>         └── NumericLiteral (2)
>     ```
>     - 顶层节点：`VariableDeclaration`，表示变量声明。  
>     - 子节点：`Identifier` 表示变量名称，`AssignmentExpression` 表示赋值操作。  
>     - `AssignmentExpression` 的子节点：`NumericLiteral`，表示赋值的值是数值 2。
>
>1. **解析的意义**  
>   - 解析是从线性结构（Token 流）转化为分层的语法结构，便于后续语义分析和代码生成。  
>   - AST 是编译器或解释器优化代码和生成目标代码的关键数据结构。
>
>---
>
>### **总结**
>解析是编译器的重要步骤，通过将 Token 流构造为抽象语法树（AST），为代码的深度理解和操作奠定基础。AST 使得程序的语法结构清晰明了，能够很好地支持后续的优化、语义检查和代码生成。
>%%TAGS%%
>
^offe8ry8xbg


>%%
>```annotation-json
>{"created":"2024-12-18T03:44:50.318Z","text":"### 分词（Tokenizing）和词法分析（Lexing）的核心概念总结：\n\n1. **定义**  \n   - **分词（Tokenizing）：** 将字符组成的字符串分解为具有语义意义的代码块（词法单元）。  \n   - **词法分析（Lexing）：** 在分词的基础上，利用有状态的规则判断某个字符或字符序列是否属于独立的词法单元。\n\n2. **词法单元（Token）**  \n   - 词法单元是编程语言中最小的、有意义的代码片段。例如：`var`、`a`、`=`、`2`、`;`。  \n   - 是否将空格识别为词法单元，取决于空格在具体语言中的语法作用。\n\n3. **分词 vs. 词法分析的区别**  \n   - **分词：** 通常是无状态的，即简单地将字符划分为独立的词法单元。  \n   - **词法分析：** 使用有状态的解析规则，考虑上下文来决定某些字符组合是否属于某个词法单元。\n\n4. **示例**  \n   - 程序代码：`var a = 2;`  \n   - 词法单元（Token）：`var`、`a`、`=`、`2`、`;`  \n   - **分词：** 直接按字符序列分割。  \n   - **词法分析：** 判断 `a` 是变量名还是其他标识符，根据上下文规则解析。\n\n---\n\n### 总结  \n分词和词法分析都属于编译器的词法处理阶段。分词更简单，注重切分字符，而词法分析更复杂，需要基于规则解析词法单元。两者的区别在于是否考虑状态和上下文，但通常它们会被视为同一个过程。","updated":"2024-12-18T03:44:50.318Z","document":{"title":"","link":[{"href":"urn:x-pdf:b461c29b2ae560e1cb6142263aa3e67a"}],"documentFingerprint":"b461c29b2ae560e1cb6142263aa3e67a"},"uri":"urn:x-pdf:b461c29b2ae560e1cb6142263aa3e67a","target":[{"source":"urn:x-pdf:b461c29b2ae560e1cb6142263aa3e67a","selector":[{"type":"TextPositionSelector","start":24616,"end":24642},{"type":"TextQuoteSelector","exact":"分词/词法分析（Tokenizing/Lexing）","prefix":"中，程序中的一段源代码在执行之前会经历三个步骤，统称为“编译”。","suffix":"• 这个过程会将由字符组成的字符串分解成（对编程语言来说）有意义"}]}]}
>```
>%%
>*%%PREFIX%%中，程序中的一段源代码在执行之前会经历三个步骤，统称为“编译”。%%HIGHLIGHT%% ==分词/词法分析（Tokenizing/Lexing）== %%POSTFIX%%• 这个过程会将由字符组成的字符串分解成（对编程语言来说）有意义*
>%%LINK%%[[#^6tavdxoqd5f|show annotation]]
>%%COMMENT%%
>### 分词（Tokenizing）和词法分析（Lexing）的核心概念总结：
>
>1. **定义**  
>   - **分词（Tokenizing）：** 将字符组成的字符串分解为具有语义意义的代码块（词法单元）。  
>   - **词法分析（Lexing）：** 在分词的基础上，利用有状态的规则判断某个字符或字符序列是否属于独立的词法单元。
>
>1. **词法单元（Token）**  
>   - 词法单元是编程语言中最小的、有意义的代码片段。例如：`var`、`a`、`=`、`2`、`;`。  
>   - 是否将空格识别为词法单元，取决于空格在具体语言中的语法作用。
>
>1. **分词 vs. 词法分析的区别**  
>   - **分词：** 通常是无状态的，即简单地将字符划分为独立的词法单元。  
>   - **词法分析：** 使用有状态的解析规则，考虑上下文来决定某些字符组合是否属于某个词法单元。
>
>1. **示例**  
>   - 程序代码：`var a = 2;`  
>   - 词法单元（Token）：`var`、`a`、`=`、`2`、`;`  
>   - **分词：** 直接按字符序列分割。  
>   - **词法分析：** 判断 `a` 是变量名还是其他标识符，根据上下文规则解析。
>
>---
>
>### 总结  
>分词和词法分析都属于编译器的词法处理阶段。分词更简单，注重切分字符，而词法分析更复杂，需要基于规则解析词法单元。两者的区别在于是否考虑状态和上下文，但通常它们会被视为同一个过程。
>%%TAGS%%
>
^6tavdxoqd5f


>%%
>```annotation-json
>{"created":"2024-12-18T03:47:20.477Z","updated":"2024-12-18T03:47:20.477Z","document":{"title":"","link":[{"href":"urn:x-pdf:b461c29b2ae560e1cb6142263aa3e67a"}],"documentFingerprint":"b461c29b2ae560e1cb6142263aa3e67a"},"uri":"urn:x-pdf:b461c29b2ae560e1cb6142263aa3e67a","target":[{"source":"urn:x-pdf:b461c29b2ae560e1cb6142263aa3e67a","selector":[{"type":"TextPositionSelector","start":25199,"end":25203},{"type":"TextQuoteSelector","exact":"代码生成","prefix":"点有一个叫作NumericLiteral（它的值是2）的子节点。","suffix":"• 将AST 转换为可执行代码的过程称被称为代码生成。这个过程与"}]}]}
>```
>%%
>*%%PREFIX%%点有一个叫作NumericLiteral（它的值是2）的子节点。%%HIGHLIGHT%% ==代码生成== %%POSTFIX%%• 将AST 转换为可执行代码的过程称被称为代码生成。这个过程与*
>%%LINK%%[[#^haeo2ibr84n|show annotation]]
>%%COMMENT%%
>
>%%TAGS%%
>
^haeo2ibr84n


>%%
>```annotation-json
>{"created":"2024-12-18T03:48:14.200Z","updated":"2024-12-18T03:48:14.200Z","document":{"title":"","link":[{"href":"urn:x-pdf:b461c29b2ae560e1cb6142263aa3e67a"}],"documentFingerprint":"b461c29b2ae560e1cb6142263aa3e67a"},"uri":"urn:x-pdf:b461c29b2ae560e1cb6142263aa3e67a","target":[{"source":"urn:x-pdf:b461c29b2ae560e1cb6142263aa3e67a","selector":[{"type":"TextPositionSelector","start":25843,"end":25846},{"type":"TextQuoteSelector","exact":"作用域","prefix":"编译，然后做好执行它的准备，并且通常马上就会执行它。1.2 理解","suffix":"我们学习作用域的方式是将这个过程模拟成几个人物之间的对话。那么，"}]}]}
>```
>%%
>*%%PREFIX%%编译，然后做好执行它的准备，并且通常马上就会执行它。1.2 理解%%HIGHLIGHT%% ==作用域== %%POSTFIX%%我们学习作用域的方式是将这个过程模拟成几个人物之间的对话。那么，*
>%%LINK%%[[#^ax3mx3kpfxm|show annotation]]
>%%COMMENT%%
>
>%%TAGS%%
>
^ax3mx3kpfxm
