# GSAP 与 Vue 集成

> 如何在 Vue 项目中使用 GSAP 创建动画效果。

---

## 📚 Vue 集成概述

### Vue 3 集成方式

Vue 3 提供了多种方式集成 GSAP：

- **模板引用（ref）**：获取 DOM 元素
- **生命周期钩子**：在组件挂载后初始化动画
- **组合式 API**：使用 `onMounted`、`onUnmounted`

---

## 🚀 基础集成

### 安装

```bash
npm install gsap
```

### 基础示例（Vue 3 组合式 API）

```vue
<template>
  <div ref="boxRef" class="box">动画盒子</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { gsap } from "gsap";

const boxRef = ref(null);

onMounted(() => {
  gsap.to(boxRef.value, {
    x: 100,
    duration: 1,
    ease: "power2.out"
  });
});
</script>
```

### 基础示例（Vue 2 / Options API）

```vue
<template>
  <div ref="box" class="box">动画盒子</div>
</template>

<script>
import { gsap } from "gsap";

export default {
  mounted() {
    gsap.to(this.$refs.box, {
      x: 100,
      duration: 1,
      ease: "power2.out"
    });
  }
};
</script>
```

---

## 🎯 使用模板引用

### 单个元素（Vue 3）

```vue
<template>
  <div ref="boxRef" class="box">淡入盒子</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { gsap } from "gsap";

const boxRef = ref(null);

onMounted(() => {
  gsap.from(boxRef.value, {
    opacity: 0,
    y: 50,
    duration: 1
  });
});
</script>
```

### 多个元素（Vue 3）

```vue
<template>
  <div>
    <div ref="box1Ref">盒子 1</div>
    <div ref="box2Ref">盒子 2</div>
    <div ref="box3Ref">盒子 3</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { gsap } from "gsap";

const box1Ref = ref(null);
const box2Ref = ref(null);
const box3Ref = ref(null);

onMounted(() => {
  const tl = gsap.timeline();
  
  tl.to(box1Ref.value, { x: 100, duration: 1 })
    .to(box2Ref.value, { y: 100, duration: 1 }, "-=0.5")
    .to(box3Ref.value, { rotation: 360, duration: 1 });
});
</script>
```

### Vue 2 方式

```vue
<template>
  <div>
    <div ref="box1">盒子 1</div>
    <div ref="box2">盒子 2</div>
    <div ref="box3">盒子 3</div>
  </div>
</template>

<script>
import { gsap } from "gsap";

export default {
  mounted() {
    const tl = gsap.timeline();
    
    tl.to(this.$refs.box1, { x: 100, duration: 1 })
      .to(this.$refs.box2, { y: 100, duration: 1 }, "-=0.5")
      .to(this.$refs.box3, { rotation: 360, duration: 1 });
  }
};
</script>
```

---

## 🎨 动画清理

### Vue 3 组合式 API

```vue
<template>
  <div ref="boxRef" class="box">动画元素</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { gsap } from "gsap";

const boxRef = ref(null);
let animation = null;

onMounted(() => {
  animation = gsap.to(boxRef.value, {
    x: 100,
    duration: 1
  });
});

onUnmounted(() => {
  if (animation) {
    animation.kill();
  }
});
</script>
```

### Timeline 清理

```vue
<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { gsap } from "gsap";

const boxRef = ref(null);
let tl = null;

onMounted(() => {
  tl = gsap.timeline();
  tl.to(boxRef.value, { x: 100, duration: 1 })
    .to(boxRef.value, { y: 100, duration: 1 });
});

onUnmounted(() => {
  if (tl) {
    tl.kill();
  }
});
</script>
```

### ScrollTrigger 清理

```vue
<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const boxRef = ref(null);

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger);
  
  gsap.to(boxRef.value, {
    x: 100,
    scrollTrigger: {
      trigger: boxRef.value,
      start: "top center"
    }
  });
});

onUnmounted(() => {
  ScrollTrigger.getAll().forEach(st => st.kill());
});
</script>
```

---

## 🎬 实战案例

### 案例 1：列表项依次出现

```vue
<template>
  <ul>
    <li
      v-for="(item, index) in items"
      :key="index"
      :ref="el => setItemRef(el, index)"
      class="list-item"
    >
      {{ item }}
    </li>
  </ul>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { gsap } from "gsap";

const props = defineProps({
  items: Array
});

const itemRefs = ref([]);

const setItemRef = (el, index) => {
  if (el) {
    itemRefs.value[index] = el;
  }
};

onMounted(async () => {
  await nextTick();
  
  gsap.from(itemRefs.value, {
    opacity: 0,
    y: 50,
    duration: 0.5,
    stagger: 0.1,
    ease: "power2.out"
  });
});
</script>
```

### 案例 2：卡片悬停效果

```vue
<template>
  <div
    ref="cardRef"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    class="card"
  >
    <slot />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { gsap } from "gsap";

const cardRef = ref(null);

const handleMouseEnter = () => {
  gsap.to(cardRef.value, {
    scale: 1.05,
    y: -10,
    duration: 0.3,
    ease: "power2.out"
  });
};

const handleMouseLeave = () => {
  gsap.to(cardRef.value, {
    scale: 1,
    y: 0,
    duration: 0.3,
    ease: "power2.in"
  });
};
</script>
```

### 案例 3：模态框动画

```vue
<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      ref="backdropRef"
      class="modal-backdrop"
      @click="handleClose"
    >
      <div ref="modalRef" class="modal" @click.stop>
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick } from "vue";
import { gsap } from "gsap";

const props = defineProps({
  isOpen: Boolean
});

const emit = defineEmits(["update:isOpen"]);

const backdropRef = ref(null);
const modalRef = ref(null);

const handleClose = () => {
  emit("update:isOpen", false);
};

watch(() => props.isOpen, async (newVal) => {
  if (newVal) {
    await nextTick();
    
    gsap.fromTo(backdropRef.value,
      { opacity: 0 },
      { opacity: 1, duration: 0.3 }
    );
    
    gsap.fromTo(modalRef.value,
      { opacity: 0, scale: 0.8, y: 50 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.4,
        ease: "back.out(1.7)"
      }
    );
  } else {
    if (modalRef.value) {
      gsap.to(modalRef.value, {
        opacity: 0,
        scale: 0.8,
        y: 50,
        duration: 0.3
      });
    }
    
    if (backdropRef.value) {
      gsap.to(backdropRef.value, {
        opacity: 0,
        duration: 0.3
      });
    }
  }
});
</script>
```

### 案例 4：滚动触发动画

```vue
<template>
  <div ref="elementRef">
    <slot />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const elementRef = ref(null);

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger);
  
  gsap.from(elementRef.value, {
    opacity: 0,
    y: 50,
    duration: 1,
    scrollTrigger: {
      trigger: elementRef.value,
      start: "top 80%",
      toggleActions: "play none none reverse"
    }
  });
});

onUnmounted(() => {
  ScrollTrigger.getAll().forEach(st => st.kill());
});
</script>
```

### 案例 5：数字计数动画

```vue
<template>
  <span ref="counterRef">{{ displayValue }}</span>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { gsap } from "gsap";

const props = defineProps({
  target: Number
});

const counterRef = ref(null);
const displayValue = ref(0);

watch(() => props.target, (newVal) => {
  gsap.to(displayValue, {
    value: newVal,
    duration: 2,
    snap: { value: 1 },
    ease: "power2.out",
    onUpdate: function() {
      displayValue.value = Math.floor(this.targets()[0].value);
    }
  });
}, { immediate: true });
</script>
```

---

## 🛠️ 自定义 Composable

### useGSAP Composable

```javascript
// composables/useGSAP.js
import { ref, onMounted, onUnmounted } from "vue";
import { gsap } from "gsap";

export function useGSAP(animationFn) {
  const elementRef = ref(null);
  let animation = null;
  
  onMounted(() => {
    if (elementRef.value) {
      animation = animationFn(elementRef.value);
    }
  });
  
  onUnmounted(() => {
    if (animation) {
      if (animation.kill) {
        animation.kill();
      } else if (Array.isArray(animation)) {
        animation.forEach(anim => anim.kill());
      }
    }
  });
  
  return elementRef;
}
```

### 使用 Composable

```vue
<template>
  <div ref="boxRef" class="box">动画盒子</div>
</template>

<script setup>
import { useGSAP } from "@/composables/useGSAP";
import { gsap } from "gsap";

const boxRef = useGSAP((element) => {
  return gsap.to(element, {
    x: 100,
    duration: 1
  });
});
</script>
```

---

## 💡 最佳实践

### 1. 使用 nextTick 等待 DOM 更新

```vue
<script setup>
import { onMounted, nextTick } from "vue";

onMounted(async () => {
  await nextTick(); // 等待 DOM 更新完成
  
  gsap.to(boxRef.value, { x: 100 });
});
</script>
```

### 2. 在 onUnmounted 中清理

```vue
<script setup>
import { onMounted, onUnmounted } from "vue";

let animation = null;

onMounted(() => {
  animation = gsap.to(boxRef.value, { x: 100 });
});

onUnmounted(() => {
  if (animation) {
    animation.kill();
  }
});
</script>
```

### 3. 使用 watch 响应数据变化

```vue
<script setup>
import { ref, watch } from "vue";
import { gsap } from "gsap";

const props = defineProps({
  isVisible: Boolean
});

const boxRef = ref(null);

watch(() => props.isVisible, (newVal) => {
  if (newVal) {
    gsap.to(boxRef.value, { opacity: 1, duration: 0.5 });
  } else {
    gsap.to(boxRef.value, { opacity: 0, duration: 0.5 });
  }
});
</script>
```

---

## 🔗 相关资源

- [Vue 3 官方文档](https://vuejs.org/)
- [GSAP Vue 集成指南](https://greensock.com/docs/v3/React)
- [上一节：React 集成](./10-React集成.md)

---

#GSAP #Vue #Vue集成 #前端动画
