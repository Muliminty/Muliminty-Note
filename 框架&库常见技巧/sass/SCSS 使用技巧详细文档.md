### SCSS 使用技巧详细文档

本详细文档包含了常见的 SCSS 使用技巧和一些问题的解决方案。这些内容有助于提升 SCSS 的编写效率和代码可维护性。

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
本章节介绍了一些常用的 SCSS 技巧，包括变量定义、混入、媒体查询等。这些技巧有助于提升 SCSS 的编写效率和代码可维护性。

### 变量和混入

#### 全局变量定义
全局变量定义是 SCSS 的基础。通过定义变量，可以方便地在不同的地方复用相同的值，提升代码的可维护性。

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

#### 混入媒体查询
混入（Mixins）可以定义一段样式代码，并在需要的地方进行调用，提高代码的复用性。

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

### 媒体查询与响应式设计

#### 媒体查询条件
在 SCSS 中使用媒体查询可以实现响应式设计。以下是如何在不同的屏幕尺寸下应用不同的样式。

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

### 背景图片透明度
设置背景图片透明度可以通过 `rgba` 函数实现。

```scss
$theme-color: rgb(122, 193, 67);
$theme-color-50: rgba(122, 193, 67, 0.5);
```

### 优化与代码整洁
为了让 SCSS 代码更整洁和易于维护，可以将常用的媒体查询条件、变量和混入集中管理，并使用合理的命名和注释。

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
    margin: 0 $type-area-ipad;
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

通过使用上述技巧和结构，SCSS 代码将更加简洁、清晰且易于维护。添加新断点或修改现有样式变得更加方便。