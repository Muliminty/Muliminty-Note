# Vuex从入门到实战

## Vuex概述

### 1.1 官方解释

`Vuex` 是一个专为 `Vue.js` 应用程序开发的状态管理模式。

+ 它采用集中式存储管理 应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化
+ `Vuex` 也集成到 `Vue` 的官方调试工具 `devtools extension`，提供了诸如零配置的 time-travel 调试、状态快照导入导出等高级调试功能。

![输入图片描述](Vuex%E4%BB%8E%E5%85%A5%E9%97%A8%E5%88%B0%E5%AE%9E%E6%88%98_md_files/Snipaste_2023-02-20_16-13-14_20230220161339.png?v=1&type=image&token=V1:Ipi-z-5v6nuUVXOyKeBoKRLN8fnAc8Sa7A8LKP6ICU4)

### 1.2 大白话

状态管理模式、集中式存储管理这些名词听起来就非常高大上，让人捉摸不透。

其实，可以简单的将其看成把需要多个组件共享的变量全部存储在一个对象里面。

然后，将这个对象放在顶层的Vue实例中，让其他组件可以使用。

那么，多个组件是不是就可以共享这个对象中的所有变量属性了呢？

如果是这样的话，为什么官方还要专门出一个插件Vuex呢？难道我们不能自己封装一个对象来管理吗？

当然可以，只是我们要先想想VueJS带给我们最大的便利是什么呢？没错，就是响应式。

如果你自己封装实现一个对象能不能保证它里面所有的属性做到响应式呢？当然也可以，只是自己封装可能稍微麻烦一些。

不用怀疑，Vuex就是为了提供这样一个在多个组件间共享状态的插件，用它就可以了。

### 1.3 组件间共享数据的方式

+ 父向子传值：v-bind属性绑定
+ 子向父传值：v-on事件绑定
+ 兄弟组件之间共享数据：EventBus
  + $on 接收数据的组件
  + $emit 发送数据的组件
上述只适合小范围内数据共享，如果是复杂应用的话，就不再合适了。

### 1.4 再看Vuex是什么

Vuex是实现组件全局状态(数据)管理的一种机制，可以方便的实现组件之间数据的共享

如图：

在不使用Vuex进行状态管理时，如果要从最下面的紫色组件传递数据的话，还是比较繁琐，也不便于维护。

在使用Vuex进行状态管理时，只需要一个共享Store组件，紫色组件将数据写入Store中，其他使用的组件直接从Store中读取即可。

![输入图片描述](Vuex%E4%BB%8E%E5%85%A5%E9%97%A8%E5%88%B0%E5%AE%9E%E6%88%98_md_files/Snipaste_2023-02-20_16-15-56_20230220161618.png?v=1&type=image&token=V1:CPmx-qwkaew7iMsYw_ItXDj1YA2Onh4ihUvYR7wZSbQ)

### 1.5 使用Vuex统一管理好处

+ 能够在Vuex中集中管理共享的数据，易于开发和后期维护
+ 能够高效地实现组件之间的数据共享，提高开发效率
+ 存储在Vuex中的数据都是响应式的，能够实时保持数据与页面的同步

## 状态管理

### 2.1 单页面状态管理

我们知道，要在单个组件中进行状态管理是一件非常简单的事情，如图

![输入图片描述](Vuex%E4%BB%8E%E5%85%A5%E9%97%A8%E5%88%B0%E5%AE%9E%E6%88%98_md_files/Snipaste_2023-02-20_16-18-29_20230220161851.png?v=1&type=image&token=V1:1fN0zG9WZMLoBX4fR0qARtZ2wWuTG2vM7_Wmo18P83M)

+ State：指的就是我们的状态，可以暂时理解为组件中data中的属性
+ View：视图层，可以针对State的变化， 显示不同的信息
+ Actions：这里的Actions主要是用户的各种操作，如点击、输入等，会导致状态发生变化

简单加减法案例，代码如下：

```javascript
<template>
  <div>
    <div>当前计数为：{{counter}}</div>
    <button @click="counter+=1">+1</button>
    <button @click="counter-=1">11</button>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      counter: 0
    };
  }
};
</script>

```

+ 在这个案例中，有没有状态需要管理呢？肯定是有的，就是个数counter
+ counter需要某种方式被记录下来，也就是上述中的的State部分
+ counter的值需要被显示在洁面皂，这个就是上述中的View部分
+ 界面发生某些操作(比如此时的+1、-1)，需要去更新状态，这就是上述中的Actions部分

这就是一个最基本的单页面状态管理。

### 2.2 多页面状态管理

Vue已经帮我们做好了单个界面的状态管理，但是如果是多个界面呢，比如

+ 多个视图View都依赖同一个状态（一个状态改了，多个界面需要进行更新）
+ 不同界面的Actions都想修改同一个状态

也就是说对于某些状态(状态1/状态2/状态3)来说只属于我们某一个视图，但是也有一些状态(状态a/状态b/状态c)属于多个试图共同想要维护的，那怎么办呢？

+ 状态1/状态2/状态3你放在自己的组件中，自己管理自己用，没问题
+ 但是状态a/状态b/状态c我们希望交给一个大管家来统一帮助我们管理

没错，Vuex就是为我们提供这个大管家的工具。

### 2.3 全局单例模式

我们现在要做的就是将共享的状态抽出来，交给我们的大管家，统一进行管理，每个视图按照规定，进行访问和修改操作。

这就是Vuex的基本思想

### 2.4 管理哪些状态

如果你做过大型开放，你一定遇到过多个状态，在多个界面间的共享问题。

+ 比如用户的登录状态、用户名称、头像、地理位置信息等
+ 比如商品的收藏、购物车中的物品等

这些状态信息，我们都可以放在统一放在Vuex中，对它进行保存和管理，而且它们还是响应式的

```javaScript
一般情况下，只有组件之间共享的数据，才有必要存储到Vuex中。
对于组件中的私有数据，依旧存储在组件自身的data中即可。
```

## Vuex的基本使用

### 3.1 安装

```javaScript
npm install vuex --save
```

### 3.2 导入

```javaScript
import Vuex from 'vuex'

Vue.use(Vuex)
```

### 3.3 创建store对象

```javaScript
const store = new Vuex.Store({
 // state中存放的就是全局共享数据
 state:{
  count: 0
 }
})

```

### 3.4 挂载store对象

```javaScript
new Vue({
 el: '#app',
 render: h=>h(app)m
 router,
 store
})

```

## Vuex的核心概念

State是提供唯一的公共数据源，所有共享的数据都要统一放到Store的State中进行存储。

如果状态信息是保存到多个Store对象中的，那么之后的管理和维护等都会变得特别困难，所以Vuex也使用了单一状态树(单一数据源Single Source of Truth)来管理应用层级的全部状态。

单一状态树能够让我们最直接的方式找到某个状态的片段，而且在之后的维护和调试过程中，也可以非常方便的管理和维护。

### 4.1 State

#### 4.1.1 概念

State是提供唯一的公共数据源，所有共享的数据都要统一放到Store的State中进行存储。

如果状态信息是保存到多个Store对象中的，那么之后的管理和维护等都会变得特别困难，所以Vuex也使用了单一状态树(单一数据源Single Source of Truth)来管理应用层级的全部状态。

单一状态树能够让我们最直接的方式找到某个状态的片段，而且在之后的维护和调试过程中，也可以非常方便的管理和维护。

```javaScript
export default new Vuex.Store({
  state: {
    count: 0
  },
}

```

#### 4.1.2 State数据访问方式一

通过this.$store.state.全局数据名称访问，

```javaScript
<h3>当前最新Count值为：{{this.$store.state.count}}</h3>

```

#### 4.1.3 State数据访问方式二

从vuex中按需导入mapState函数

import { mapState } from 'vuex'

通过刚才导入的mapState函数，将当前组件需要的全局数据，映射为当前组件的computed计算属性：

```javaScript
<template>
  <div>
    <h3>当前最新Count值为：{{ count }}</h3>
    <button>-1</button>
  </div>
</template>

<script>

import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["count"])
  }
};
</script>

```

### 4.2 Mutation

#### 4.2.1 引入

如果想修改count的值，要怎么做呢？

也许聪明的你，已经想到，直接在组件中对this.$store.state.count进行操作即可，代码如下：

```javaScript
<template>
  <div>
    <h3>当前最新Count值为：{{this.$store.state.count}}</h3>
    <button @click="add">+1</button>
  </div>
</template>

<script>
export default {
  methods: {
    add() {
      this.$store.state.count++;
    }
  }
};
</script>

```

测试发现，这可以实现需求，完成+1操作。

但是，这种方法在vuex中是严格禁止的，那要怎么做呢？这时，就需要使用Mutation了。

#### 4.2.2 概念

Mutation用于变更存储在Store中的数据。

只能通过mutation变更Store数据，不可以直接操作Store中的数据
通过这种方式，虽然操作稍微繁琐一些，但可以集中监控所有数据的变化，二直接操作Store数据是无法进行监控的

#### 4.2.3 定义Mutation函数

在mutations中定义函数，如下：

```javaScript
  mutations: {
    // 自增
    add(state) {
      state.count++
    }
  }

```

定义的函数会有一个默认参数state，这个就是存储在Store中的state对象。

#### 4.2.4 调用Mutation函数

Mutation中不可以执行异步操作，如需异步，请在Action中处理

##### 4.2.4.1 方式一

在组件中，通过this.$store.commit(方法名)完成触发，如下：

```javaScript
export default {
  methods: {
    add() {
      //   this.$store.state.count++;
      this.$store.commit("add");
    }
  }
};

```

##### 4.2.4.2 方式二

在组件中导入mapMutations函数

```javaScript
import { mapMutations } from 'vuex'

```

通过刚才导入的mapMutations函数，将需要的mutations函数映射为当前组件的methods方法：

```javaScript
methods:{
 ...mapMutations(['add','addN']),
 // 当前组件设置的click方法
 addCount(){
  this.add()
 }
}

```

#### 4.3 Mutation传递参数

在通过mutation更新数据的时候，有时候需携带一些额外的参数，此处，参数被成为mutation的载荷Payload。

如果仅有一个参数时，那payload对应的就是这个参数值

![输入图片描述](Vuex%E4%BB%8E%E5%85%A5%E9%97%A8%E5%88%B0%E5%AE%9E%E6%88%98_md_files/Snipaste_2023-02-20_16-38-24_20230220163855.png?v=1&type=image&token=V1:lKNOIdPKimTGPHkiBHF36kHoOUbEfyRRSsQKhUH5n28)

如果是多参数的话，那就会以对象的形式传递，此时的payload是一个对象，可以从对象中取出相关的数据。

在mutations中定义函数时，同样可以接收参数，示例如下：

```javaScript
mutations: {
    // 自增
    add(state) {
      state.count++
    },
    // 带参数
    addNum(state, payload) {
      state.count += payload.number
    }
  }

```

在组件中，调用如下：

```javaScript
methods: {
  add() {
    //   this.$store.state.count++;
    this.$store.commit("add");
  },
  addNum() {
    this.$store.commit("addNum", {
      number: 10
    });
  }
}

```

...

#### 4.4 Mutation响应规则

#### 4.5 Mutation常量类型

##### 4.5.1 引入

##### 4.5.2 解决方案

### 4.3 Action

#### 4.3.1 参数context

#### 4.3.2 使用方式一

#### 4.3.3 使用方式二

#### 4.3.4 使用方式三

#### 4.3.5 Actions携带参数

#### 4.3.6 Actions与Promise结合

### 4.4 Getter

#### 4.4.1 使用方式一

#### 4.4.2 使用方式二

### 4.5 Modules

#### 4.5.1 概念

#### 4.5.2 使用

### 4.6 优化
