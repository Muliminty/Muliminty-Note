# React.memo() 和 useMemo() 的用法和区别

+ React.memo() 是一个高阶组件，我们可以使用它来包装我们不想重新渲染的组件，除非其中的 props 发生变化
+ useMemo() 是一个 React Hook，我们可以使用它在组件中包装函数。 我们可以使用它来确保该函数中的值仅在其依赖项之一发生变化时才重新计算

 [稀土掘金-腾讯IMWeb团队](https://juejin.cn/post/6991837003537088542)。
