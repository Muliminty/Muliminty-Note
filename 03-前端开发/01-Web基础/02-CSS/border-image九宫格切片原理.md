---
title: "border-image 九宫格切片原理"
date: "2026-09-16"
lastModified: "2026-09-16"
status: "成熟"
tags: ["CSS", "基础入门", "问题排错"]
moc: "[[!MOC-CSS]]"
stage: "基础入门"
prerequisites: []
description: "解释 border-image 的九宫格切片、绘制与拉伸机制，并分析切片接缝的原因和规避方案。"
aliases: ["CSS 九宫格", "border-image 切片", "border-image 接缝"]
publish: true
toc: true
---

# border-image 九宫格切片原理

## 1. `border-image` 是什么

`border-image` 用一张图片绘制元素边框。浏览器会先把源图片切成九个区域，再把这些区域映射到元素的四个角、四条边和中心区域。

它适合以下场景：

- 两端装饰必须保持形状，中间区域允许拉伸的横幅；
- 四角不能变形，边框纹理可以平铺或拉伸的面板；
- 游戏 UI、活动页和运营页中的特殊边框。

它解决的核心问题是：**只拉伸允许变形的区域，保留角部或端部装饰。**

## 2. 九宫格如何切分

`border-image-slice` 使用上、右、下、左四条切割线，将源图片分成九个区域：

```text
┌────────┬──────────────────┬────────┐
│ 左上角 │      上边        │ 右上角 │
├────────┼──────────────────┼────────┤
│ 左边   │      中心        │ 右边   │
├────────┼──────────────────┼────────┤
│ 左下角 │      下边        │ 右下角 │
└────────┴──────────────────┴────────┘
```

九个区域的绘制规则如下：

| 源图片区域 | 映射位置 | 默认行为 |
| --- | --- | --- |
| 四个角 | 元素边框的四角 | 保持为独立切片，不参与边缘方向的平铺 |
| 上、下边 | 元素上、下边框 | 沿水平方向拉伸或平铺 |
| 左、右边 | 元素左、右边框 | 沿垂直方向拉伸或平铺 |
| 中心 | 元素中间 | 默认丢弃；设置 `fill` 后绘制 |

切片只发生在源图片上，不会真的修改图片文件。

## 3. 核心属性的职责

### 3.1 `border-image-source`

指定源图片：

```css
.banner {
  border-image-source: url('./banner.png');
}
```

它只负责提供图像，不决定切片位置和最终边框宽度。

### 3.2 `border-image-slice`

定义源图片中的切割线：

```css
.banner {
  border-image-slice: 20 30 20 95 fill;
}
```

数值顺序与 `margin` 相同：

```text
上 右 下 左
```

需要区分两种值：

- 无单位数字：表示源图片坐标。位图中可以近似理解为源图片像素，但语法上不能写 `px`；
- 百分比：相对于源图片自身宽高计算。

`fill` 表示保留并绘制中心区域。没有 `fill` 时，中心区域默认透明。

### 3.3 `border-image-width`

控制图片边框在元素上的绘制宽度。若省略，通常由 `border-width` 提供边框区域：

```css
.banner {
  border-width: 0 30px 0 95px;
  border-style: solid;
  border-image-slice: 0 30 0 95 fill;
}
```

`border-image-slice` 和 `border-width` 是两个独立概念：

- `border-image-slice` 决定从源图片哪里切；
- `border-width` 或 `border-image-width` 决定切片在页面上绘制多宽。

二者恰好写成相同数字，并不代表它们使用同一个坐标系。

### 3.4 `border-image-repeat`

决定边缘切片如何填满目标区域：

| 值 | 行为 |
| --- | --- |
| `stretch` | 拉伸切片，默认值 |
| `repeat` | 按原尺寸重复，末端可能被截断 |
| `round` | 调整单元尺寸，使重复内容完整铺满 |
| `space` | 保持单元尺寸，用空隙分配剩余空间 |

### 3.5 `border-image-outset`

允许图片边框超出元素的边框盒，但不会改变布局占位。它适合阴影、光效等向外扩展的装饰，不适合代替正常间距。

## 4. 横向自适应横幅示例

假设源图片尺寸为 `412 × 75`，左侧 `95px` 是奖杯，右侧 `30px` 是星标，中间蓝色区域允许拉伸：

```jsx
<div
  className={styles.myRankText}
  style={{ borderImageSource: `url(${myRankBanner})` }}
>
  <span>我的本期双周榜排名：暂无排名</span>
</div>
```

```css
.myRankText {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: fit-content;
  min-width: 412px;
  height: 75px;
  padding-right: 16px;
  padding-left: 16px;
  border-width: 0 30px 0 95px;
  border-style: solid;
  border-image-slice: 0 30 0 95 fill;
  color: #fff;
  white-space: nowrap;
}
```

渲染过程：

1. 浏览器在源图片左侧 `95`、右侧 `30` 的位置切片；
2. 左侧奖杯映射到元素左边框区域；
3. 右侧星标映射到元素右边框区域；
4. `fill` 使中间蓝色区域绘制到元素中心；
5. `width: fit-content` 根据文字宽度扩展元素；
6. 中心区域横向拉伸，两端装饰维持独立切片。

## 5. 为什么会出现纵向细线

横幅中出现的淡色纵线通常是**切片接缝**，不是 CSS 边框。

常见原因包括以下几类。

### 5.1 切割线穿过渐变或半透明像素

如果切割线正好位于描边、阴影、抗锯齿或渐变区域，边缘切片与中心切片会带有不同的边缘颜色。二者拼接后，色差表现为纵向细线。

### 5.2 小数物理像素取整

移动端常通过 `rem`、缩放或高 DPR 映射尺寸。CSS 像素换算到设备物理像素后可能不是整数，浏览器必须取整或重采样，拼接边界因此出现不足一个 CSS 像素的亮线或暗线。

例如：

```text
CSS 切片宽度 × DPR = 95.5 物理像素
```

浏览器无法直接绘制半个物理像素，只能通过抗锯齿混合相邻像素。

### 5.3 拉伸时的双线性插值

中心区域被拉伸后，浏览器会对像素进行插值。切片边缘参与采样时，可能混入切割线另一侧的透明或不同颜色像素，形成淡色接缝。

### 5.4 源图本身存在边缘污染

PNG 透明区域中的 RGB 信息、导出工具生成的半透明描边，以及缩放后残留的抗锯齿像素，也可能在拉伸时变得可见。

## 6. 如何避免切片接缝

### 6.1 把切割线放在纯色区域

优先选择连续多个像素颜色完全相同的位置切割，不要穿过：

- 渐变边缘；
- 外发光或阴影；
- 圆角抗锯齿区域；
- 半透明描边；
- 装饰图案的边缘。

可在图片编辑器中逐像素检查切割线两侧颜色。

### 6.2 避免切片落在小数物理像素

调试时检查：

```js
const rect = element.getBoundingClientRect();
console.log(rect.width, window.devicePixelRatio);
```

尽量让关键边界满足：

```text
CSS 尺寸 × devicePixelRatio ≈ 整数
```

但响应式布局、浏览器缩放和不同 DPR 会让这个条件难以长期保证，因此它只能降低风险，不能彻底消除接缝。

### 6.3 给切片预留同色缓冲区

设计素材时，让切割线附近保留数个像素的纯色区域。即使发生插值，采样结果仍然是相同颜色。

这是从素材源头解决问题的首选方式。

### 6.4 使用三段式结构彻底隔离装饰

当切片接缝在目标 WebView 中无法稳定消除时，将素材拆成三段：

```text
[固定左图] [可拉伸的纯色或渐变中段] [固定右图]
```

```css
.banner {
  position: relative;
  display: inline-flex;
  align-items: center;
  min-height: 75px;
  padding: 0 30px 0 95px;
  background: linear-gradient(180deg, #1267ff, #0647e7);
  white-space: nowrap;
}

.banner::before,
.banner::after {
  position: absolute;
  top: 0;
  height: 100%;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  content: '';
}

.banner::before {
  left: 0;
  width: 96px;
  background-image: url('./banner-left.png');
}

.banner::after {
  right: 0;
  width: 31px;
  background-image: url('./banner-right.png');
}
```

左右装饰可以向中间覆盖 `1px`，隐藏不同内核中的采样缝。该方案需要额外素材，但在 Android WebView、高 DPR 和缩放环境中通常更稳定。

## 7. 方案选择

| 场景 | 推荐方案 |
| --- | --- |
| 四角和边框均为规则纯色 | `border-image` |
| 中间纹理可重复 | `border-image-repeat: repeat/round` |
| 两端固定、中间为纯色或简单渐变 | 三段式结构 |
| 素材包含阴影、半透明描边和复杂渐变 | 优先三段式结构 |
| 必须兼容多个移动端 WebView | 三段式结构并重叠 `1px` |

`border-image` 适合结构规整、切割线附近颜色稳定的素材。它不是所有可拉伸图片的通用无缝方案。

## 8. 排查清单

发现切片接缝时，按以下顺序检查：

1. 确认细线是否与 `border-image-slice` 的左右切割线重合；
2. 放大源图，检查切割位置是否经过半透明、描边或渐变像素；
3. 临时更换纯色测试图，确认问题来自素材还是布局；
4. 检查元素尺寸、根字号、页面缩放和 DPR 是否产生小数物理像素；
5. 分别在桌面浏览器、iOS WebView 和 Android WebView 中验证；
6. 微调切片位置，观察接缝是否随切片边界移动；
7. 无法稳定消除时，改用三段式结构。

## 9. 结论

`border-image` 的本质是“源图片切片 + 目标边框映射”，而不是普通背景图缩放。理解时应始终区分三个坐标：

- 源图片的切片坐标；
- 元素边框的绘制宽度；
- 设备最终使用的物理像素。

九宫格可以保留装饰区域并拉伸中间区域，但拼接质量依赖素材边界、尺寸取整和浏览器采样算法。对接缝零容忍时，拆成固定左图、可拉伸中段和固定右图通常更可靠。

## 关联知识

- [CSS 专题入口](./!MOC-CSS.md)
- [布局：Flex 与 Grid](./布局-Flex-Grid.md)

