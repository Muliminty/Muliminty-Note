
在JavaScript中，事件委托和事件代理是指通过将事件监听器添加到一个元素的父元素上，来处理其子元素上的事件。这种技术可以简化代码，提高性能，并且可以处理动态添加的子元素。

**事件委托（Event Delegation）：**

事件委托是一种将事件处理逻辑委托给父元素的技术。当子元素上的事件被触发时，事件会冒泡到父元素，并通过事件委托器来处理。这样做的好处是，我们只需要为父元素添加一个事件监听器，就可以处理所有子元素上的事件，无需为每个子元素单独添加事件监听器。

下面是一个示例代码：

HTML:
```html
<ul id="myList">
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>
```

JavaScript:
```javascript
const list = document.getElementById('myList');

list.addEventListener('click', function(event) {
  if(event.target.tagName === 'LI') {
    console.log('Clicked on: ' + event.target.innerHTML);
  }
});
```

在上述代码中，我们为父元素`myList`添加了一个点击事件监听器。当任何一个`li`元素被点击时，事件会冒泡到父元素，并通过判断`event.target`的标签名来确定是哪个子元素被点击。然后我们可以根据需要进行相应的处理。

**事件代理（Event Delegation）：**

事件代理是一种将事件处理委托给另一个元素的技术。与事件委托类似，我们可以将事件监听器添加到一个父元素上，来处理其子元素上的事件。但是，事件代理更进一步，它可以将事件处理委托给任意的祖先元素，而不仅仅是父元素。

下面是一个示例代码：

HTML:
```html
<div id="container">
  <button>Add Item</button>
  <ul id="myList">
    <!-- 动态添加的子元素 -->
  </ul>
</div>
```

JavaScript:
```javascript
const container = document.getElementById('container');

container.addEventListener('click', function(event) {
  if(event.target.tagName === 'BUTTON') {
    const listItem = document.createElement('li');
    listItem.innerHTML = 'New Item';
    document.getElementById('myList').appendChild(listItem);
  }
});
```

在上述代码中，我们为祖先元素`container`添加了一个点击事件监听器。当按钮被点击时，我们动态创建一个`li`元素，并将其作为子元素添加到`myList`中。这里我们利用了事件代理的特性，将按钮点击事件委托给了祖先元素`container`，来处理动态添加的子元素。