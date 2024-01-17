
# 对象参数处理成 URL 查询参数

### 方法一

```javascript
function objectToQueryString(obj) {
  const params = new URLSearchParams();

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      params.append(key, obj[key]);
    }
  }

  return params.toString();
}

const obj = {
  name: 'Alice',
  age: 30,
  city: 'New York'
};

const queryString = objectToQueryString(obj);
console.log(queryString); // 输出 "name=Alice&age=30&city=New%20York"
```

### 更简洁的方法

```javascript
function objectToQueryString(obj) {
  return Object.entries(obj)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

const obj = {
  name: 'Alice',
  age: 30,
  city: 'New York'
};

const queryString = objectToQueryString(obj);
console.log(queryString); // 输出 "name=Alice&age=30&city=New%20York"
```

在这两种方法中，`objectToQueryString` 函数用于将对象参数处理成URL查询参数的形式。第一种方法使用了 `URLSearchParams()` 对象，而第二种方法则利用了 `Object.entries()` 和 `Array.map()` 方法来实现。两种方法都能够将对象转换为查询参数字符串，以便于拼接到URL中进行网络请求。

## 最简短的

`new URLSearchParams(params).toString()` 是一个用于处理 URL 查询参数的方法。这个方法会将传入的参数对象转换为符合 URL 查询参数规范的字符串形式。

在 JavaScript 中，URLSearchParams 对象用于处理 URL 的查询参数部分，它提供了一种简单的方式来操作 URL 查询参数，比如添加新参数、获取现有参数等。

当你调用 `new URLSearchParams(params)` 时，传入的 `params` 可以是一个对象，也可以是一个包含键值对的数组。例如：

```javascript
const params = {
  name: 'Alice',
  age: 30
};
const searchParams = new URLSearchParams(params);
console.log(searchParams.toString()); // 输出 "name=Alice&age=30"
```

或者：

```javascript
const params = [
  ['name', 'Alice'],
  ['age', 30]
];
const searchParams = new URLSearchParams(params);
console.log(searchParams.toString()); // 输出 "name=Alice&age=30"
```

无论是对象还是数组形式的参数，`new URLSearchParams(params)` 都会将其转换为 URL 查询参数的形式。而之后调用 `toString()` 方法，则会返回最终的查询参数字符串。

在网络请求中，我们经常需要将参数对象转换为符合 URL 规范的字符串形式，以便将其拼接到 URL 中进行发送。`new URLSearchParams(params).toString()` 提供了一个简单且方便的方式来实现这一目的。

另外，还提供了一个示例代码 `getPermissionList`，演示了如何将额外的参数拼接到URL中，以便于发起网络请求。

```javascript
export const getPermissionList = (params, hideLoading = true) => {
  const queryParams = new URLSearchParams(params).toString();
  const url = `${api}/partner/auth/app/permission?${queryParams}`;
  return request({
    url,
    method: 'get',
    hideLoading,
  });
};
```

这个函数示例展示了在实际网络请求中如何使用URL查询参数，并将其拼接到URL中，以获取权限列表的数据。
