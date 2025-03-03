# moment常用方法

```JSX
moment常用方法:
moment().endOf('day') // 今天的23:59:59.999
moment().endOf('year') // 今年的 12 月 31 日 23:59:59.999,还可以填month,week,hour等

moment().add(1, 'months') // 当前月份加一月,如今天2021-05-25,得到就是2021-06-25
moment().add(1, 'year') // 当前年加一年,如今天2021-05-25,得到就是2022-05-25
moment().subtract(1, 'months') // 当前月份减一月,如今天2021-05-25,得到就是2021-04-25
moment().subtract(1, 'year') // 当前年减一年,如今天2021-05-25,得到就是2020-05-25

var a = moment('2021-05-18');
var b = moment('2020-04-16');
a.diff(b, 'years') // 1,b-a的年份
a.diff(b, 'days') // 2,b-a的日期

moment().date() // 25今天的日期
moment().day() // 2 今天是星期几
moment().year() // 2021 今年的年份
moment().year(2022) // 2022-05-25 设置年份为2022
```