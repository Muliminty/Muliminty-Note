# Apache ECharts使用demo

[官方文档](https://echarts.apache.org/handbook/zh/get-started/)

[echarts——各个配置项详细说明总结](../../剪藏/Apache%20ECharts/echarts——各个配置项详细说明总结.md)

npm install echarts --save
npm install --save echarts-for-react


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
