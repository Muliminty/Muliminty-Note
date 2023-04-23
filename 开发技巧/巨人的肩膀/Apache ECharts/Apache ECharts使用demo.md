# Apache ECharts使用demo

[官方文档](https://echarts.apache.org/handbook/zh/get-started/)

[echarts——各个配置项详细说明总结](/%E5%89%AA%E8%97%8F/Apache%20ECharts/echarts%E2%80%94%E2%80%94%E5%90%84%E4%B8%AA%E9%85%8D%E7%BD%AE%E9%A1%B9%E8%AF%A6%E7%BB%86%E8%AF%B4%E6%98%8E%E6%80%BB%E7%BB%93.md)

导入

```JSX
import ReactEcharts from 'echarts-for-react'
```

配置

> 配置 （  这个配置直接在官网看示例就好了）

```JSX
const pieOption = {
  title: {
    text: '文章类型',
    left: 'left',
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b} : {c} ( {d}% )',
  },
  series: [
    {
      name: '文章类型',
      type: 'pie',
      radius: [20, 140],
      center: ['50%', '50%'],
      roseType: 'area',
      itemStyle: {
        borderRadius: 20,
      },
      data: [],
    },
  ],
}
```

使用

```JSX
<ReactEcharts 
   option={pieOption}
   notMerge={true} 
   lazyUpdate={true}
/>
```
