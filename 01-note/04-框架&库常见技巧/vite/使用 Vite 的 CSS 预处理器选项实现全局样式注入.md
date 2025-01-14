<br/>

### 使用 Vite 的 CSS 预处理器选项实现全局样式注入

### 前言

每个前端开发者可能都遇到过这样的问题：项目中每个新的 CSS/SCSS 文件都需要重复导入同样的全局样式文件。这样的重复操作不仅枯燥乏味，还容易出错。本文将介绍如何在 Vite 项目中通过配置 Vite 的 CSS 预处理器选项，自动全局注入这些样式文件，省去重复导入的麻烦。

### 配置步骤

#### 1. 在 Vite 配置文件中配置全局样式

你可以在 `vite.config.js` 中配置 CSS 预处理器的选项，来实现全局注入样式的效果。

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/assets/scss/variables.scss";
          @import "@/assets/scss/antd.scss";
          @import "@/assets/scss/utils.scss";
        `
      }
    }
  }
});
```

这样配置后，每个 `.scss` 文件都会自动注入这些全局样式，你再也不需要在每个文件中手动导入它们。

#### 2. 验证效果

你可以创建一个新的 `.scss` 文件，验证全局样式是否被正确应用。例如：

```scss
// src/styles/test.scss
.my-new-component {
  color: $primary-color;
  @include clearfix;
}
```

如果 `$primary-color` 和 `clearfix` 是在全局样式文件中定义的，那么它们应该在这里正常工作。

### 背景原因

在大型项目中，通常会有一些通用的样式变量、mixin 和函数，它们需要在多个样式文件中使用。如果在每个文件中都手动导入这些全局样式文件，不仅增加了代码的冗余，还容易出错。

通过 Vite 的 CSS 预处理器选项配置，我们可以将这些全局样式自动注入到每个样式文件中，从而简化开发过程，减少重复代码，并降低出错的几率。

### 注意事项

1. **仅适用于预处理器**：这种方法仅适用于使用预处理器（如 SCSS、LESS）的项目，如果你使用纯 CSS，则需要其他方法。
2. **增加编译时间**：全局注入样式文件会在每次编译时都进行处理，可能会增加一些编译时间，但通常是可以接受的。

### 结论

通过配置 Vite 的 CSS 预处理器选项，我们可以轻松实现全局样式的自动注入，减少重复代码，提高开发效率。希望这篇文章能为你在 Vite 项目中管理全局样式提供一些帮助。

---

## 文章: 在 Vite React 项目中轻松实现全局样式注入

### 前言

如果你是一个前端开发者，你一定会遇到这样的情况：在每个新的样式文件中都需要重复导入全局样式文件。对于像我这样懒得重复劳动的人来说，这是一个相当头疼的问题。幸运的是，在 Vite 中，我们有一种优雅的方式来解决这个问题，那就是利用 Vite 的 CSS 预处理器选项。让我们一起看看如何实现吧！

### 背景故事

在我们的项目中，我们经常需要导入一些全局样式文件，比如变量、mixin 和工具类：

```scss
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/antd.scss';
@import '@/assets/scss/utils.scss';
```

每次创建新的样式文件时，我们都得重复写这些导入语句。这不仅是浪费时间，还增加了出错的机会。想象一下，如果有一天你漏掉了一个重要的全局样式文件，那将会是一场灾难！

### 解决方案：使用 Vite 的 CSS 预处理器选项

幸运的是，我们可以利用 Vite 的配置选项，自动将这些全局样式注入到每个样式文件中。这样，我们就再也不用手动导入它们了。

### 操作步骤

#### 1. 配置 Vite

首先，我们需要修改 `vite.config.js` 文件，添加 CSS 预处理器选项的配置：

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/assets/scss/variables.scss";
          @import "@/assets/scss/antd.scss";
          @import "@/assets/scss/utils.scss";
        `
      }
    }
  }
});
```

这段配置代码会将指定的全局样式文件自动注入到每个 `.scss` 文件中。

#### 2. 验证效果

接下来，我们创建一个新的 `.scss` 文件，看看效果如何：

```scss
// src/styles/test.scss
.my-new-component {
  color: $primary-color;
  @include clearfix;
}
```

如果 `$primary-color` 和 `clearfix` 是在全局样式文件中定义的，那么它们应该在这里正常工作。我们不需要在文件顶部手动导入这些全局样式了。

### 性能影响

你可能会担心这种方法会不会影响打包后的代码体积。实际上，这种全局注入方式不会显著增加打包后的文件大小。Vite 在打包过程中会智能地处理这些样式，只将实际使用到的部分包含在最终的打包结果中。因此，你大可不必担心性能问题。

### 结论

通过配置 Vite 的 CSS 预处理器选项，我们可以轻松实现全局样式的自动注入，从而减少重复代码，提高开发效率。希望这篇文章能为你在 Vite 项目中管理全局样式提供一些帮助。

### 幽默的总结

最后，让我们用一句话来总结这篇文章：再也不用手动导入全局样式，Vite 帮你搞定一切！Happy coding! 🚀

---

希望你喜欢这篇技术博客，并能通过这种方式在项目中简化全局样式的管理。如果你有其他更好的方法，欢迎在评论区分享！
