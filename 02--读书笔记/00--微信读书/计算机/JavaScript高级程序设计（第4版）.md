---
doc_type: weread-highlights-reviews
bookId: "34336683"
author: 马特·弗里斯比
cover: https://wfqqreader-1252317822.image.myqcloud.com/cover/683/34336683/t7_34336683.jpg
reviewCount: 0
noteCount: 4
isbn: 9787115545381
category: 计算机-编程设计
lastReadDate: 2022-11-12
---
# 元数据
> [!abstract] JavaScript高级程序设计（第4版）
> - ![ JavaScript高级程序设计（第4版）|200](https://wfqqreader-1252317822.image.myqcloud.com/cover/683/34336683/t7_34336683.jpg)
> - 书名： JavaScript高级程序设计（第4版）
> - 作者： 马特·弗里斯比
> - 简介： 本书是JavaScript经典图书的新版。第4版涵盖ECMAScript2019，全面、深入地介绍了JavaScript开发者必须掌握的前端开发技术，涉及JavaScript的基础特性和高级特性。书中详尽讨论了JavaScript的各个方面，从JavaScript的起源开始，逐步讲解到新出现的技术，其中重点介绍ECMAScript和DOM标准。在此基础上，接下来的各章揭示了JavaScript的基本概念，包括类、期约、迭代器、代理，等等。另外，书中深入探讨了客户端检测、事件、动画、表单、错误处理及JSON。本书同时也介绍了近几年来涌现的重要新规范，包括FetchAPI、模块、工作者线程、服务线程以及大量新API。
> - 出版时间 2020-09-11 00:00:00
> - ISBN： 9787115545381
> - 分类： 计算机-编程设计
> - 出版社： 人民邮电出版社

# 高亮划线

## 4.1 原始值与引用值


- 📌 原始值（primitive value）就是最简单的数据，引用值（reference value）则是由多个值构成的对象。 ^34336683-32-483-577
    - ⏱ 2022-11-12 13:01:02 
## 4.2 执行上下文与作用域


- 📌 就应该尽可能地多使用const声明，除非确实需要一个将来会重新赋值的变量。这样可以从根本上保证提前发现重新赋值导致的bug。 ^34336683-33-9374-9436
    - ⏱ 2022-04-19 09:49:46 

- 📌 注意，作用域链中的对象也有一个原型链，因此搜索可能涉及每个对象的原型链。 ^34336683-33-9623-9659
    - ⏱ 2022-04-19 13:17:05 
## 5.3 原始值包装类型


- 📌 为了方便操作原始值，ECMAScript提供了3种特殊的引用类型：Boolean、Number和String。 ^34336683-39-427-482
    - ⏱ 2022-04-20 21:44:40 

- 📌 在原始值包装类型的实例上调用typeof会返回"object"，所有原始值包装对象都会转换为布尔值true。另外，Object构造函数作为一个工厂方法，能够根据传入值的类型返回相应原始值包装类型的实例。比如：let obj = new Object("some text");console.log(obj instanceof String);   // true如果传给Object的是字符串，则会创建一个String的实例。如果是数值，则会创建Number的实例。 ^34336683-39-1817
    - ⏱ 2022-04-20 22:24:32 

- 📌 console.log(Number.isSafeInteger(-1 ＊ (2 ＊＊ 53) + 1));   // trueconsole.log(Number.isSafeInteger(2 ＊＊ 53));                // falseconsole.log(Number.isSafeInteger((2 ＊＊ 53) -1));         // true5.3.3 StringString是对应字符串的引用类型。要创建一个String对象，使用String构造函数并传入一个数值，如下例所示： ^34336683-39-8026
    - ⏱ 2022-04-21 22:20:48 

- 📌 ，第二个参数可以是一个字符串或一个函数。如果第一个参数是字符串，那么只会替换第一个子字符串。要想替换所有子字符串，第一个参数必须为正则表达式并且带全局标记，如下面的例子所示：let text = "cat, bat, sat, fat";letresult=text.replace("at", "ond");console.log(result);  //"cond, bat, sat, fat"result=text.replace(/at/g, "ond");console.log(result);  //"cond, bond, sond, fond"在这个例子中，字符串"at"先传给replace()函数，而替换文本是"ond"。结果是"cat"被修改为"cond"，而字符串的剩余部分保持不变。通过将第一个参数改为带全局标记的正则表达式，字符串中的所有"at"都被替换成了"ond"。第二个参数是字符串的情况下，有几个特殊的字符序列，可以用来插入正则表达式操作的值。 ^34336683-39-27586
    - ⏱ 2022-04-23 00:06:44 
# 读书笔记

# 本书评论
