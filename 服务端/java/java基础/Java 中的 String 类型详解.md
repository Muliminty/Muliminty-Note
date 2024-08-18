# Java 中的 String 类型详解

`String` 是 Java 编程语言中最常用的类之一，用于表示字符串（即字符序列）。尽管它看起来像是基本数据类型，但 `String` 实际上是一个引用类型，并且是不可变的对象。这意味着一旦创建了一个 `String` 对象，它的值就不能再改变。

## 1. 什么是 String

`String` 类用于表示字符串，即一系列字符的序列。它在 `java.lang` 包中定义，因此可以直接使用 `String` 类，而无需导入任何包。

### 示例：

```java
String greeting = "Hello, World!";
```

在这个示例中，`greeting` 是一个 `String` 类型的变量，它存储了 `"Hello, World!"` 这个字符串。

## 2. String 对象的创建方式

### 2.1 字面量方式

使用字面量（即双引号）可以直接创建字符串对象。这种方式会在 Java 的**字符串常量池**中查找是否存在相同内容的字符串，如果存在，则直接返回其引用；如果不存在，则会在常量池中创建一个新的字符串。

#### 示例：

```java
String str1 = "Hello";
String str2 = "Hello";
```

在上述代码中，`str1` 和 `str2` 实际上引用的是常量池中的同一个字符串对象。

### 2.2 使用 new 关键字

使用 `new` 关键字可以显式地创建一个新的 `String` 对象。即使字符串内容相同，`new` 关键字也会在堆内存中创建一个新的对象，而不是在字符串常量池中查找。

#### 示例：

```java
String str3 = new String("Hello");
String str4 = new String("Hello");
```

在这里，`str3` 和 `str4` 是两个不同的对象，它们在堆内存中分别占有空间，虽然它们的内容相同。

### 2.3 字符数组转换为字符串

你可以通过字符数组来创建 `String` 对象，这在处理字符流或需要动态构建字符串时非常有用。

#### 示例：

```java
char[] chars = {'J', 'a', 'v', 'a'};
String str5 = new String(chars);
```

`str5` 的内容将是 `"Java"`。

## 3. String 的不可变性

`String` 对象一旦被创建，它的内容就不能再被修改。这就是所谓的**不可变性**。当你对字符串进行任何修改操作时（如拼接、替换等），实际上会创建一个新的 `String` 对象，而原始对象保持不变。

### 3.1 为什么 String 是不可变的

- **线程安全**：不可变对象在多线程环境中是安全的，不需要额外的同步机制。
- **字符串常量池的优化**：由于字符串的不可变性，相同内容的字符串可以被多个引用共享，节省内存。
- **哈希值缓存**：`String` 的不可变性允许其哈希值在首次计算后被缓存，这在哈希表等数据结构中极大地提高了性能。

### 3.2 不可变性的示例

```java
String original = "Java";
String modified = original.concat(" Programming");
System.out.println(original); // 输出: Java
System.out.println(modified); // 输出: Java Programming
```

在这个示例中，`original` 字符串保持不变，而 `modified` 是一个新的字符串对象。

## 4. String 常用方法详解

`String` 类提供了丰富的方法来处理字符串。以下是一些常用的方法及其详细用法。

### 4.1 `length()`

返回字符串的长度（字符的数量）。

```java
String text = "Hello";
int length = text.length(); // length 为 5
```

### 4.2 `charAt(int index)`

返回字符串中指定索引处的字符。索引从 0 开始，最后一个字符的索引为 `length() - 1`。

```java
char letter = text.charAt(1); // letter 为 'e'
```

### 4.3 `substring(int beginIndex, int endIndex)`

返回从 `beginIndex` 开始到 `endIndex` 结束的子字符串，包含 `beginIndex` 处的字符，不包含 `endIndex` 处的字符。

```java
String sub = text.substring(1, 4); // sub 为 "ell"
```

### 4.4 `toUpperCase()` 和 `toLowerCase()`

将字符串转换为全大写或全小写字母。

```java
String upper = text.toUpperCase(); // upper 为 "HELLO"
String lower = text.toLowerCase(); // lower 为 "hello"
```

### 4.5 `indexOf(String str)`

返回指定子字符串在当前字符串中第一次出现的位置，如果未找到则返回 `-1`。

```java
int index = text.indexOf("lo"); // index 为 3
```

### 4.6 `lastIndexOf(String str)`

返回指定子字符串在当前字符串中最后一次出现的位置。

```java
int lastIndex = text.lastIndexOf("l"); // lastIndex 为 3
```

### 4.7 `replace(CharSequence target, CharSequence replacement)`

替换字符串中的所有出现的目标字符序列为指定的替换字符序列。

```java
String replaced = text.replace("l", "p"); // replaced 为 "Heppo"
```

### 4.8 `split(String regex)`

根据正则表达式拆分字符串，返回一个字符串数组。

```java
String[] words = text.split(" "); // 根据空格分割
```

### 4.9 `trim()`

去除字符串首尾的空白字符。

```java
String spaced = "  Hello  ";
String trimmed = spaced.trim(); // trimmed 为 "Hello"
```

### 4.10 `contains(CharSequence s)`

判断当前字符串是否包含指定的字符序列。

```java
boolean hasHello = text.contains("Hel"); // hasHello 为 true
```

### 4.11 `startsWith(String prefix)` 和 `endsWith(String suffix)`

分别判断字符串是否以指定前缀开始或以指定后缀结束。

```java
boolean starts = text.startsWith("He"); // starts 为 true
boolean ends = text.endsWith("lo");     // ends 为 true
```

## 5. String 和字符数组的互相转换

### 5.1 将 String 转换为字符数组

你可以使用 `toCharArray()` 方法将 `String` 转换为字符数组。这在需要对字符串进行字符级别操作时非常有用。

```java
char[] charArray = text.toCharArray(); // 返回 ['H', 'e', 'l', 'l', 'o']
```

### 5.2 将字符数组转换为 String

你可以通过 `new String(charArray)` 构造函数将字符数组转换为 `String` 对象。

```java
char[] letters = {'J', 'a', 'v', 'a'};
String word = new String(letters); // word 为 "Java"
```

## 6. String 的比较

在 Java 中，有两种常见的字符串比较方式：`==` 运算符和 `equals()` 方法。

### 6.1 使用 `==` 运算符

`==` 运算符比较的是两个字符串引用是否指向同一个对象。因此，它更适用于判断两个引用是否指向字符串池中的同一个对象。

```java
String str1 = "Java";
String str2 = "Java";
boolean isEqualReference = (str1 == str2); // true
```

### 6.2 使用 `equals()` 方法

`equals()` 方法比较的是两个字符串的内容是否相同。它应该是判断字符串相等的首选方式。

```java
String str3 = new String("Java");
String str4 = new String("Java");
boolean isEqualContent = str3.equals(str4); // true
```

### 6.3 `equalsIgnoreCase(String anotherString)`

此方法用于在忽略大小写的情况下比较两个字符串内容是否相等。

```java
boolean isEqualIgnoreCase = "java".equalsIgnoreCase("Java"); // true
```

## 7. String 的拼接与性能

在 Java 中，字符串拼接常见的方式有使用 `+` 运算符、`concat()` 方法，以及使用 `StringBuilder` 或 `StringBuffer`。其中，`+` 和 `concat()` 方法都用于简单拼接，但由于 `String` 的不可变性，每次拼接都会创建新的 `String` 对象，可能会造成性能损失。

### 7.1 使用 `+` 运算符

```java
String hello = "Hello";
String world = "World";
String greeting = hello + ", " + world + "!";
```

### 7.2 使用 `concat()` 方法

```java
String greeting = hello.concat(", ").concat(world).concat("!");
```

### 7.3 使用 `StringBuilder` 和 `StringBuffer`

`StringBuilder` 和 `StringBuffer` 是可变的字符序列，提供了更高效的字符串拼接方式。其中，`StringBuffer

` 是线程安全的，而 `StringBuilder` 不是。

```java
StringBuilder builder = new StringBuilder();
builder.append("Hello").append(", ").append("World").append("!");
String result = builder.toString();
```

在大量字符串拼接的场景中，使用 `StringBuilder` 会显著提高性能。

## 8. 总结

`String` 是 Java 中一个非常重要且常用的类。理解它的不可变性、常量池机制、以及常用操作方法，对编写高效、可靠的 Java 代码至关重要。在处理字符串时，选择合适的方法和数据结构，不仅可以提高代码的可读性，还能显著提升程序的性能。