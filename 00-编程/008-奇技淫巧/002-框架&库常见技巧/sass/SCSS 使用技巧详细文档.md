### SCSS 使用技巧详细文档

欢迎来到 SCSS 的神奇世界！在这里，我们将揭示一些让你的 CSS 编写更加优雅、简洁且具备强大响应式能力的技巧。无论你是 SCSS 新手，还是已经是个小有经验的老手，这篇指南都会让你有所收获。准备好了吗？让我们一起开始吧！

---

#### 目录
1. [引言](#引言)
2. [变量和混入（Mixins）](#变量和混入)
    - [全局变量定义](#全局变量定义)
    - [混入媒体查询](#混入媒体查询)
3. [媒体查询与响应式设计](#媒体查询与响应式设计)
    - [媒体查询条件](#媒体查询条件)
4. [背景图片透明度](#背景图片透明度)
5. [优化与代码整洁](#优化与代码整洁)

---

### 引言
如果说 CSS 是一种语言，那 SCSS 就是它的超级版，拥有更多强大和便捷的功能。通过变量、嵌套、继承、混入等特性，SCSS 让你可以写出更具结构性、可维护性和重用性的代码。下面是一些常用的 SCSS 技巧和实践，它们将帮助你在日常开发中如鱼得水。

### 变量和混入

#### 全局变量定义
首先，来认识一下 SCSS 的变量定义。变量就像是代码中的小助手，帮你存储颜色、字体大小、间距等常用值。这样一来，你只需修改一个地方，便可以在整个项目中同步更新这些值，简直不要太方便。

**变量文件 (`_variables.scss`)：**

```scss
// 基准字体大小
$base-font-size: 16px;

// 标题字体大小
$h1-font-size-pc: 2.8rem; // 40px
$h1-font-size-ipad: 2rem; // 32px
$h1-font-size-phone: 1.3rem; // 20px

$h2-font-size-pc: 2.25rem; // 36px
$h2-font-size-ipad: 1.75rem; // 28px
$h2-font-size-phone: 1.2rem; // 20px

// p标签字体大小
$p-font-size-pc: 1rem;
$p-font-size-ipad: 0.875rem;
$p-font-size-phone: 0.75rem;

// 版心 
$type-area-pc: 9vw;
$type-area-ipad: 8vw;
$type-area-phone: 5vw;

// 主题色
$theme-color: rgb(122, 193, 67);

// 主题色透明度百分之五十
$theme-color-50: rgba(122, 193, 67, 0.5);

// 描述文本颜色
$description-color: #7B8090;

// 媒体查询条件
$breakpoint-pc: 1000px;
$breakpoint-ipad: 768px;
$breakpoint-phone: 480px;
```

这个变量文件就像是你的调色板和尺子，随时可以调用。

#### 混入媒体查询
混入（Mixins）是 SCSS 中的另一个法宝。通过混入，你可以定义一段样式代码，然后在需要的地方进行调用。这样可以减少代码重复，提升代码的可读性和维护性。

```scss
@mixin respond-to($device) {
  @if $device == 'pc' {
    @media (max-width: $breakpoint-pc) {
      @content;
    }
  } @else if $device == 'ipad' {
    @media (max-width: $breakpoint-ipad) {
      @content;
    }
  } @else if $device == 'phone' {
    @media (max-width: $breakpoint-phone) {
      @content;
    }
  }
}
```

有了这个混入，你就可以在不同的地方轻松地添加媒体查询了。只需简单一句 `@include respond-to('device')`，是不是很酷？

### 媒体查询与响应式设计

#### 媒体查询条件
响应式设计是现代 Web 开发的标配。SCSS 让媒体查询的编写变得更加直观和灵活。以下是如何在不同的屏幕尺寸下应用不同的样式。

```scss
@import 'variables';

.header {
  width: 100vw;
  height: 30vh;
  background-image: url(@/assets/image/home/banner.webp);
  background-size: cover;
  background-position: center center;
  display: flex;
  justify-content: center;
  align-items: start;
  flex-direction: column;
  padding: 0 $type-area-pc;

  @include respond-to('ipad') {
    align-items: center;
    height: 25vh;
    padding: 0 $type-area-ipad;
  }

  @include respond-to('phone') {
    align-items: center;
    height: 20vh;
    padding: 0 $type-area-phone;
  }

  .header_title {
    margin-top: -2vh;
    margin-bottom: 1vh;
    font-size: $h1-font-size-pc;
    font-weight: bold;

    @include respond-to('ipad') {
      font-size: $h1-font-size-ipad;
    }

    @include respond-to('phone') {
      font-size: $h1-font-size-phone;
    }
  }
}
```

使用变量和混入后，媒体查询不再是一件麻烦事，简直就像在写普通样式一样轻松。

### 背景图片透明度
在 SCSS 中设置背景图片的透明度，或者说让颜色带上透明度，只需使用 `rgba` 函数。这让你的背景颜色可以变得半透明，增加了一种细腻的视觉效果。

```scss
$theme-color: rgb(122, 193, 67);
$theme-color-50: rgba(122, 193, 67, 0.5);
```

是不是感觉瞬间高大上了呢？透明度处理好了，整个页面看起来都会更加柔和和谐。

### 优化与代码整洁
为了让 SCSS 代码更整洁和易于维护，你可以将常用的媒体查询条件、变量和混入集中管理，并使用合理的命名和注释。让我们来看一个优化后的例子。

**示例：**

```scss
@import '@/assets/scss/variables.scss';

.header {
  width: 100vw;
  height: 30vh;
  background-image: url(@/assets/image/home/banner.webp);
  background-size: cover;
  background-position: center center;
  display: flex;
  justify-content: center;
  align-items: start;
  flex-direction: column;
  padding: 0 $type-area-pc;

  @include respond-to('ipad') {
    align-items: center;
    height: 25vh;
    padding: 0 $type-area-ipad;
  }

  @include respond-to('phone') {
    align-items: center;
    height: 20vh;
    padding: 0 $type-area-phone;
  }

  .header_title {
    margin-top: -2vh;
    margin-bottom: 1vh;
    font-size: $h1-font-size-pc;
    font-weight: bold;

    @include respond-to('ipad') {
      font-size: $h1-font-size-ipad;
    }

    @include respond-to('phone') {
      font-size: $h1-font-size-phone;
    }
  }
}

.split_title {
  position: relative;
  font-size: $h2-font-size-pc;
  text-align: center;
  font-weight: bold;
  margin-bottom: 0.8vh;

  @include respond-to('ipad') {
    font-size: $h2-font-size-ipad;
  }

  @include respond-to('phone') {
    font-size: $h2-font-size-phone;
  }

  &:after {
    display: block;
    position: absolute;
    content: '';
    width: 80px;
    left: calc(50% - 40px);
    bottom: 8px;
    height: 6px;
    background-color: $theme-color-50;

    @include respond-to('ipad') {
      width: 60px;
      left: calc(50% - 30px);
    }

    @include respond-to('phone') {
      width: 50px;
      bottom: 3px;
      left: calc(50% - 25px);
    }
  }
}

.description {
  font-size: $p-font-size-pc;
  color: $description-color;
  text-align: center;

  @include respond-to('ipad') {
    font-size: $p-font-size-ipad;
    text-align: left;
  }

  @include respond-to('phone') {
    font-size: $p-font-size-phone;
    text-align: left;
  }
}

.video {
  margin: 0 $type-area-pc;
  padding-top: 3vh;
  background: linear-gradient(180deg, #FFFFFF 0%, #FAFCFC 100%);

  @include respond-to('ipad') {
    margin: 0 $type-area-ip

ad;
  }

  @include respond-to('phone') {
    margin: 0 $type-area-phone;
  }

  .video_card {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    :global {
      .ant-card {
        margin-top: 3vh;
        width: 23%;
        height: 23vh;
        min-height: 200px;

        @include respond-to('ipad') {
          width: 48%;
          height: 200px;
        }

        @include respond-to('phone') {
          width: 100%;
        }
      }

      .ant-card-cover {
        height: 60%;

        img {
          height: 100%;
          object-fit: cover;
        }
      }

      .ant-card-body {
        padding: 2vh 2vw;
      }

      .ant-card-meta-description {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
```

通过使用上述技巧和结构，你的 SCSS 代码将变得更加简洁、清晰且易于维护。添加新断点或修改现有样式也变得更加方便。

---

恭喜你！现在你已经掌握了 SCSS 的一些高级技巧和实践。希望这些内容能帮助你在日常开发中写出更加优雅的代码。记住，编写代码不仅仅是为了实现功能，更是为了创造美丽与高效。Happy coding!