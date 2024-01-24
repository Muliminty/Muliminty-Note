---
link: https://juejin.cn/post/7093866983178895391
title: dnd kit列表项拖拽使用
description: dnd kit列表拖拽使用，其中的内容包含拖拽项目的使用，标签说明，单列表拖拽使用和多列表推拽使用说明。
keywords: React.js
author: 首页 首页 沸点 课程 直播 活动 竞赛 商城 App 插件 搜索历史 清空 创作者中心 写文章 发沸点 写笔记 写代码 草稿箱 创作灵感 查看更多 会员 登录 注册
date: 2022-05-04T13:07:39.000Z
publisher: 稀土掘金
stats: paragraph=71 sentences=80, words=825
---
## dnd kit列表拖拽使用

### 1、使用前提：

```bash
下载以下5个依赖：
    @dnd-kit/core
    @dnd-kit/accessibility
    @dnd-kit/sortable
    @dnd-kit/modifiers
    @dnd-kit/utilities
复制代码
```

### 2、使用说明

#### 2.1 标签说明

```css
1、DndContext：dnd kit的容器，想要使用拖拽操作，必须要有这个，并且滑动列表的拖拽事件都在这里写（onDragMove，onDragEnd等等）
2、SortableContext：滑动列表的容器，相当于ul，内部的列表配置好了可以拖拽（items为必填项，表示哪些列表在我这个容器中滑动，items为唯一标识的数组）
复制代码
```

#### 2.2 useSortable使用说明

```makefile
1、作用：将唯一标志变为一个列表的内部项
2、使用方式：useSortable({id:XXX})
3、返回值说明:
	1、setNodeRef:关联dom节点，使其成为一个可拖拽的项
	2、listeners：包含onKeyDown，onPointerDown方法，主要让节点可以进行拖拽
	3、transform：该节点被拖动时候的移动变化值
	4、transition：过渡效果
	5、isDragging：节点是否在拖拽
复制代码
```

### 3、具体用法

#### 3.1 单列表滑动

##### 3.1.1 可拖动的列表

仅仅只能拖动，不能更新列表

```react
import { DndContext } from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// 容器组件
export default function SingleTest() {
    const items = ["A","B","C"]
    return (

                {
                    items.map(val=>())
                }

    )
}

// 拖拽项组件
function Item(props:any) {
    const { id } = props
    const {setNodeRef,listeners,transform,transition } = useSortable({id})
    const styles = {
        transform:CSS.Transform.toString(transform),
        border: "1px solid red",
        marginTop: "10px"
    }

    return (
        {id}
    )

}
复制代码
```

##### 3.1.2 拖动后并更新列表

```JSX
import { DndContext } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

// 容器组件
export default function SingleTest() {
    const [items,setItems] = useState(["A","B","C"])

    // 拖拽结束后的操作
    function dragEndEvent(props:any) {
        const { active,over } = props
        const activeIndex = items.indexOf(active.id)
        const overIndex = items.indexOf(over.id)
        setItems(items=>{
            return arrayMove(items,activeIndex,overIndex)
        })
    }

    return (

                {
                    items.map(val=>())
                }

    )
}

// 拖拽项组件
function Item(props:any) {
    const { id } = props
    const {setNodeRef,listeners,transform,transition } = useSortable({id})
    const styles = {
        transform:CSS.Transform.toString(transform),
        border: "1px solid red",
        marginTop: "10px"
    }

    return (
        {id}
    )
}
复制代码
```

#### 3.2 多列表滑动

##### 3.2.1 多个可拖拽的列表

```JSX
import { DndContext } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

export default function SingleTest() {

    const [items,setItems] = useState({
        "A":["A1","A2","A3"],
        "B":["B1","B2","B3"]
    })

    // 找到容器
    function findContaniner(id:string) {
        if (id in items) {
            return id;
        }
        return Object.keys(items).find((key) =>
            items[key].find((item:string)=>item === id)
        );
    }

    // 设置从一个容器到另一个容器时候的变化
    function dragMoveEvent(props:any) {
        const { active,over } = props
        const overId = over?.id
        if(!overId) return
        const activeContainer = findContaniner(active?.id) || ""
        const overContainer = findContaniner(over?.id) || ""
        const dragItem = active.id

        if (!overContainer || !activeContainer) {
            return;
        }

        // 将activeContainer里删除拖拽元素，在overContainer中添加拖拽元素
        if(activeContainer !== overContainer) {
            const overIndex = items[overContainer].indexOf(over.id)
            const newIndex = overIndex >= 0 ? overIndex : items[overContainer].length + 1;
            const data = {
                ...items,
                [activeContainer]: items[activeContainer].filter((item:string)=>{
                    return item!==active.id
                }),
                [overContainer]:[
                    ...items[overContainer].slice(0,newIndex),
                    dragItem,
                    ...items[overContainer].slice(newIndex,items[overContainer].length)
                ]
            }
            setItems(data)
        }
    }

    // 设置移动结束后时候的改变
    const dragEndFn = (props:any) => {
        const { over,active } = props
        const overId = over?.id;
        const activeId = active?.id
        const activeContainer = findContaniner(activeId) || "";
        const overContainer = findContaniner(overId) || "";
        const activeItems = items[activeContainer]
        const overItems = items[overContainer]

        if (!activeContainer) return;
        if (!overId) return;

        if (overContainer) {
          const overIndex = overItems.findIndex((item:string)=> item === overId);
          const activeIndex = activeItems.findIndex((item:string)=> item === activeId);

          if (activeIndex !== overIndex) {
            setItems((items) => ({
              ...items,
              [overContainer]: arrayMove(
                overItems,
                activeIndex,
                overIndex
              ),
            }));
          }
        }
      }

    return (

                {
                    items['A'].map(val=>())
                }

            --------------------------------------------

                {
                    items['B'].map(val=>())
                }

    )
}

function Item(props:any) {
    const { id } = props
    const {setNodeRef,listeners,transform,transition } = useSortable({id})
    const styles = {
        transform:CSS.Transform.toString(transform),
        border: "1px solid red",
        marginTop: "10px"
    }

    return (
        {id}
    )

}
复制代码
```

===注意：此处有坑（系统自带的CSS方法在多列表时会出现一些问题，会导致不流畅）===

##### 3.2.2 解决系统自定义CSS方法带来的问题

```react
// 只需要重写单个拖拽项的styles即可（弃用系统自带CSS方法）
function Item(props:any) {
    const { id } = props
    const {setNodeRef,listeners,transform,transition } = useSortable({id})
    const styles = isDragging?{
        transform: `translate3d(0px, ${transform?.y}px, 0) scaleX(1) scaleY(1)`,
        border: "1px solid red",
        marginTop: "10px"
    }:undefined

    return (
        {id}
    )

}
复制代码
```

##### 3.3 解决拖拽带来的点击事件失效

```arduino
出现原因：
	1、点击事件onClick和拖拽事件的onPointerDown有部分重叠，导致点击的时候系统无法准确的知道你是click还是pointerDown
复制代码
```

```md
解决办法：
	1、添加sensor传感器，增加一个延迟，如下：
复制代码
```

```react
import { DndContext } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

export default function SingleTest() {

    const [items,setItems] = useState({
        "A":["A1","A2","A3"],
        "B":["B1","B2","B3"]
    })

    // 设置从一个容器到另一个容器时候的变化
    function dragMoveEvent(props:any) {}

    // 设置移动结束后时候的改变
    function dragEndFn(props:any){}

    const sensors = useSensors(useSensor(PointerSensor,{
        activationConstraint: {
          delay: 100,
          tolerance: 0,
        }
    }))

    return (

                {
                    items['A'].map(val=>())
                }

            ------------------------------------------------------

                {
                    items['B'].map(val=>())
                }

    )
}

// 单个拖拽项
function Item(props:any) {
    const { id } = props
    const {setNodeRef,listeners,transform,transition } = useSortable({id})
    const styles = {
        transform:CSS.Transform.toString(transform),
        border: "1px solid red",
        marginTop: "10px"
    }

    return (
        {id}
    )

}
复制代码
```
