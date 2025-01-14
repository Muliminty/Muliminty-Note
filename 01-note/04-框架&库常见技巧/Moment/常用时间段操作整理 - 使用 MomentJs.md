# 常用时间段操作整理 - 使用 Moment.js

### 一、获取常用的时间段

#### 1. 获取当前时间

```javascript
const now = moment(); // 当前时间
```

#### 2. 获取今天的开始和结束时间

```javascript
const todayStart = moment().startOf('day'); // 今天开始时间
const todayEnd = moment().endOf('day'); // 今天结束时间
```

#### 3. 获取本周的开始和结束时间

```javascript
const thisWeekStart = moment().startOf('week'); // 本周开始时间（星期天为一周开始）
const thisWeekEnd = moment().endOf('week'); // 本周结束时间
```

#### 4. 获取本月的开始和结束时间

```javascript
const thisMonthStart = moment().startOf('month'); // 本月开始时间
const thisMonthEnd = moment().endOf('month'); // 本月结束时间
```

#### 5. 获取今年的开始和结束时间

```javascript
const thisYearStart = moment().startOf('year'); // 今年开始时间
const thisYearEnd = moment().endOf('year'); // 今年结束时间
```

### 二、获取相对的时间段

#### 1. 获取上周的开始和结束时间

```javascript
const lastWeekStart = moment().subtract(1, 'weeks').startOf('week'); // 上周开始时间
const lastWeekEnd = moment().subtract(1, 'weeks').endOf('week'); // 上周结束时间
```

#### 2. 获取下周的开始和结束时间

```javascript
const nextWeekStart = moment().add(1, 'weeks').startOf('week'); // 下周开始时间
const nextWeekEnd = moment().add(1, 'weeks').endOf('week'); // 下周结束时间
```

#### 3. 获取上个月的开始和结束时间

```javascript
const lastMonthStart = moment().subtract(1, 'months').startOf('month'); // 上个月开始时间
const lastMonthEnd = moment().subtract(1, 'months').endOf('month'); // 上个月结束时间
```

#### 4. 获取下个月的开始和结束时间

```javascript
const nextMonthStart = moment().add(1, 'months').startOf('month'); // 下个月开始时间
const nextMonthEnd = moment().add(1, 'months').endOf('month'); // 下个月结束时间
```

#### 5. 获取去年和明年的开始和结束时间

```javascript
const lastYearStart = moment().subtract(1, 'years').startOf('year'); // 去年开始时间
const lastYearEnd = moment().subtract(1, 'years').endOf('year'); // 去年结束时间

const nextYearStart = moment().add(1, 'years').startOf('year'); // 明年开始时间
const nextYearEnd = moment().add(1, 'years').endOf('year'); // 明年结束时间
```

### 三、获取特定的时间段

#### 1. 获取最近一周（过去7天）

```javascript
const pastWeekStart = moment().subtract(6, 'days').startOf('day'); // 最近一周开始时间
const pastWeekEnd = moment().endOf('day'); // 最近一周结束时间（今天结束）
```

#### 2. 获取最近一个月（过去30天）

```javascript
const pastMonthStart = moment().subtract(29, 'days').startOf('day'); // 最近一个月开始时间
const pastMonthEnd = moment().endOf('day'); // 最近一个月结束时间（今天结束）
```

#### 3. 获取最近一年（过去365天）

```javascript
const pastYearStart = moment().subtract(1, 'years').startOf('day'); // 最近一年开始时间
const pastYearEnd = moment().endOf('day'); // 最近一年结束时间（今天结束）
```

### 四、根据业务逻辑的特殊时间段

#### 1. 获取上一个季度和下一个季度的开始和结束时间

```javascript
const lastQuarterStart = moment().subtract(1, 'quarters').startOf('quarter'); // 上一个季度开始时间
const lastQuarterEnd = moment().subtract(1, 'quarters').endOf('quarter'); // 上一个季度结束时间

const nextQuarterStart = moment().add(1, 'quarters').startOf('quarter'); // 下一个季度开始时间
const nextQuarterEnd = moment().add(1, 'quarters').endOf('quarter'); // 下一个季度结束时间
```

#### 2. 获取上半年的开始和结束时间

```javascript
const firstHalfYearStart = moment().startOf('year'); // 上半年开始时间（1月1日）
const firstHalfYearEnd = moment().startOf('year').add(5, 'months').endOf('month'); // 上半年结束时间（6月30日）
```

#### 3. 获取下半年的开始和结束时间

```javascript
const secondHalfYearStart = moment().startOf('year').add(6, 'months'); // 下半年开始时间（7月1日）
const secondHalfYearEnd = moment().endOf('year'); // 下半年结束时间（12月31日）
```

### 五、获取指定的节假日时间

#### 1. 获取指定日期

```javascript
const newYearEve = moment('2024-12-31'); // 指定的日期 - 2024年的除夕夜
```

#### 2. 获取距离某个日期还有多少天

```javascript
const daysUntilNewYear = moment('2024-12-31').diff(moment(), 'days'); // 距离2024年12月31日还有多少天
```

### 六、格式化日期和时间

#### 1. 格式化为自定义格式

```javascript
const formattedDate = moment().format('YYYY-MM-DD HH:mm:ss'); // 格式化为年-月-日 时:分:秒
```

#### 2. 显示为相对时间

```javascript
const fromNow = moment().subtract(10, 'days').fromNow(); // 10天前
```

### 七、总结

Moment.js 是一个强大的时间处理库，可以简化复杂的时间计算和格式化工作。在日常开发中，使用这些常见的时间段处理技巧，可以提高开发效率和代码的可读性。根据具体的项目需求，灵活使用 Moment.js 的方法来处理各种时间段，将显著提升开发体验和代码的可维护性。

### 如何使用

1. 在项目中引入 Moment.js：
   
   ```bash
   npm install moment --save
   ```

2. 在代码中引入并使用 Moment.js：

   ```javascript
   const moment = require('moment');
   ```

3. 使用上述定义的时间段操作进行时间计算和格式化。将这些操作集成到一个通用的工具库中，可简化前端的时间处理逻辑。