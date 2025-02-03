#面试 #promise #promise/状态吸收

# Promise 的状态吸收

在 JavaScript 的异步编程中，`Promise` 是一个非常重要的概念。它表示一个异步操作的最终结果，可能是成功（`fulfilled`）或失败（`rejected`）。而在 `Promise` 的使用过程中，有一个关键的概念叫做 **状态吸收**（也称为“状态锁定”或“状态稳定”）。本文将详细讲解 `Promise` 的状态吸收及其在面试中的重要性。

## 一、Promise 的基本概念

### 1. 什么是 Promise？

`Promise` 是 JavaScript 中用于处理异步操作的对象。它代表了一个可能现在、将来或永远不会完成的操作的结果。`Promise` 有三种状态：

1. **Pending（进行中）**：初始状态，表示异步操作尚未完成。
    
2. **Fulfilled（已成功）**：表示异步操作成功完成，且有一个确定的值。
    
3. **Rejected（已失败）**：表示异步操作失败，且有一个确定的错误原因。
    

### 2. Promise 的状态转换

`Promise` 的状态转换是单向且不可逆的：

- **Pending → Fulfilled**：当异步操作成功完成时，状态从 `Pending` 变为 `Fulfilled`。
    
- **Pending → Rejected**：当异步操作失败时，状态从 `Pending` 变为 `Rejected`。
    
- **Fulfilled/Rejected → 不可变**：一旦状态变为 `Fulfilled` 或 `Rejected`，就无法再改变。
    

## 二、Promise 的状态吸收

### 1. 什么是状态吸收？

`Promise` 的状态吸收是指一旦 `Promise` 的状态从 `Pending` 变为 `Fulfilled` 或 `Rejected`，其状态就**不可再改变**。这种特性确保了 `Promise` 的行为是可预测的，并且避免了意外的状态变化。

### 2. 状态吸收的含义

- **状态不可逆**：一旦 `Promise` 的状态变为 `Fulfilled` 或 `Rejected`，就无法再变回 `Pending` 或切换到另一种状态。
    
- **值不可变**：对于 `Fulfilled` 的 `Promise`，其结果值是固定的；对于 `Rejected` 的 `Promise`，其错误原因也是固定的。
    

### 3. 示例代码

以下代码展示了 `Promise` 的状态吸收行为：

```javascript
const myPromise = new Promise((resolve, reject) => {
  resolve("Success!"); // 状态变为 Fulfilled
});

// 尝试改变状态（无效）
setTimeout(() => {
  myPromise.resolve("New Success!"); // 无效，状态已被吸收
}, 1000);

// 输出结果
myPromise.then((value) => {
  console.log(value); // 输出 "Success!"
});
```

在这个例子中：

4. `myPromise` 的状态在创建时变为 **Fulfilled**，并且值为 `"Success!"`。
    
5. 即使在 1 秒后尝试再次调用 `resolve`，状态也不会改变，因为状态已经被“吸收”。
    
6. 最终，`then` 方法接收到的值仍然是 `"Success!"`。
    

### 4. 状态吸收的意义

7. **保证一致性**：状态吸收确保了 `Promise` 的行为是可预测的，避免了状态的意外变化。
    
8. **简化逻辑**：开发者无需担心 `Promise` 的状态会在某个时刻被意外改变，从而简化了异步逻辑的处理。
    
9. **支持链式调用**：状态吸收是 `Promise` 链式调用的基础，确保了每个 `Promise` 的状态是稳定的。
    

## 三、Promise 的链式调用

### 1. 什么是链式调用？

`Promise` 的链式调用是指在一个 `Promise` 上调用 `then` 或 `catch` 方法，返回一个新的 `Promise`，从而形成一个调用链。链式调用依赖于 `Promise` 的状态吸收特性，确保每个 `Promise` 的状态是稳定的。

### 2. 示例代码

以下代码展示了 `Promise` 的链式调用：

JavaScript复制

```javascript
const myPromise = new Promise((resolve, reject) => {
  resolve("Step 1");
});

myPromise
  .then((value) => {
    console.log(value); // 输出 "Step 1"
    return "Step 2";
  })
  .then((value) => {
    console.log(value); // 输出 "Step 2"
    return "Step 3";
  })
  .then((value) => {
    console.log(value); // 输出 "Step 3"
  });
```

在这个例子中，每个 `then` 方法都会返回一个新的 `Promise`，形成一个调用链。每个 `Promise` 的状态都是稳定的，确保了链式调用的正确性。

## 四、面试中的常见问题

### 1. Promise 的状态吸收有什么作用？

- **答案**：`Promise` 的状态吸收确保了 `Promise` 的行为是可预测的，避免了状态的意外变化。它保证了一旦 `Promise` 的状态变为 `Fulfilled` 或 `Rejected`，就无法再改变，从而简化了异步逻辑的处理，支持链式调用。
    

### 2. 为什么 Promise 的状态是不可逆的？

- **答案**：`Promise` 的状态不可逆是为了确保异步操作的结果是确定的，避免状态的意外变化。这种设计使得 `Promise` 的行为更加可预测，简化了异步逻辑的处理，支持链式调用。
    

### 3. 如何理解 Promise 的链式调用？

- **答案**：`Promise` 的链式调用是指在一个 `Promise` 上调用 `then` 或 `catch` 方法，返回一个新的 `Promise`，从而形成一个调用链。链式调用依赖于 `Promise` 的状态吸收特性，确保每个 `Promise` 的状态是稳定的，从而保证了链式调用的正确性。


## 五、总结

`Promise` 的状态吸收是 JavaScript 异步编程中的一个重要概念。它确保了 `Promise` 的行为是可预测的，避免了状态的意外变化，支持链式调用，简化了异步逻辑的处理。在面试中，理解 `Promise` 的状态吸收及其意义是非常重要的，能够展示你对异步编程的深入理解。


---

举个例子
#### 场景描述

假设你在网上订购了一本书，书店承诺会在 3 天内发货。这个订单的状态可以类比为 `Promise` 的状态变化。

1. **Pending（进行中）**：你下单后，书店开始处理你的订单，但书还没有发货。此时订单状态是 `Pending`。
    
2. **Fulfilled（已成功）**：书店处理完订单，书已经发货，状态变为 `Fulfilled`。
    
3. **Rejected（已失败）**：如果书店发现库存不足，无法发货，状态会变为 `Rejected`。
    

### 状态吸收的类比

- **状态不可逆**：一旦书发货了（`Fulfilled`），订单状态就固定为 `Fulfilled`，书店不能再改回 `Pending` 或变为 `Rejected`。
    
- **值不可变**：书发货后，你收到的书是固定的，书店不能在发货后告诉你换了一本书。
    

### 示例代码


```javascript
const orderBook = () => {
  return new Promise((resolve, reject) => {
    // 模拟订单处理
    setTimeout(() => {
      resolve("书已发货！"); // 状态变为 Fulfilled
    }, 3000);
  });
};

const myOrder = orderBook();

// 尝试改变状态（无效）
setTimeout(() => {
  myOrder.resolve("订单已取消！"); // 无效，状态已被吸收
}, 5000);

// 输出结果
myOrder.then((value) => {
  console.log(value); // 输出 "书已发货！"
});
```

### 解释

4. **订单处理**：`orderBook` 函数返回一个 `Promise`，模拟订单处理过程。
    
5. **状态变为 Fulfilled**：3 秒后，`Promise` 的状态变为 `Fulfilled`，值为 `"书已发货！"`。
    
6. **尝试改变状态**：5 秒后，尝试再次调用 `resolve`，但此时状态已经被“吸收”，无法再改变。
    
7. **最终结果**：`then` 方法接收到的值仍然是 `"书已发货！"`，说明状态已经被锁定。
    
