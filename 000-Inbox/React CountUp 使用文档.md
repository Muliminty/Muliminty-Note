# React CountUp 使用文档

`react-countup` 是一个用于 React 应用的数字动画组件，可以实现数字从一个值过渡到另一个值的动画效果。

## 安装

你可以通过 npm 或者 yarn 来安装 `react-countup`：

```bash
npm install react-countup
```

```bash
yarn add react-countup
```

## 基本用法

在 React 组件中引入 `CountUp` 组件，并传入需要展示的数字作为 `end` 属性。

```jsx
import React from 'react';
import CountUp from 'react-countup';

const MyComponent = () => {
  return (
    <div>
      <CountUp end={100} />
    </div>
  );
}
```

## 属性

以下是 `react-countup` 支持的属性列表：

- `start`: 起始值，默认为 0。
- `end` (required): 结束值，必须指定。
- `duration`: 动画持续时间，以秒为单位，默认为 2 秒。
- `useEasing`: 是否启用缓动效果，默认为 true。
- `useGrouping`: 是否使用千位分隔符，默认为 true。
- `separator`: 自定义千位分隔符的字符，默认为 ','。
- `decimal`: 小数点后保留的位数，默认为 2。
- `prefix`: 数字前缀，例如 '$'。
- `suffix`: 数字后缀，例如 'k'。

## 示例

```jsx
import React from 'react';
import CountUp from 'react-countup';

const MyComponent = () => {
  return (
    <div>
      <CountUp
        start={-500}
        end={1000}
        duration={2.5}
        separator=" "
        decimals={2}
        decimal=","
        prefix="$"
      />
    </div>
  );
}
```

##

当使用 `react-countup` 组件时，你可以使用一些回调函数来监听动画的不同阶段。下面是几个常用的回调函数及其使用方法：

## `onStart`

该回调函数会在动画开始时触发。

```jsx
<CountUp
  end={100}
  onStart={() => {
    console.log('动画开始');
  }}
/>
```

## `onEnd`

该回调函数会在动画结束时触发。

```jsx
<CountUp
  end={100}
  onEnd={() => {
    console.log('动画结束');
  }}
/>
```

## `onUpdate`

该回调函数会在每次数字更新时触发。

```jsx
<CountUp
  end={100}
  onUpdate={(value) => {
    console.log('当前值:', value);
  }}
/>
```

## `onReset`

该回调函数会在动画重置时触发。

```jsx
<CountUp
  end={100}
  onReset={() => {
    console.log('动画重置');
  }}
/>
```

## `onPauseResume`

该回调函数会在动画暂停或恢复时触发。

```jsx
<CountUp
  end={100}
  onPauseResume={(paused) => {
    if (paused) {
      console.log('动画已暂停');
    } else {
      console.log('动画已恢复');
    }
  }}
/>
```

你可以根据需要选择使用这些回调函数，并根据回调函数的参数来执行相应的操作。希望对你有所帮助！如果有其他问题，请随时提问。
