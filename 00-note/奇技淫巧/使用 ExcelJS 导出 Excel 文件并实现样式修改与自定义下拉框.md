# 使用 ExcelJS 导出 Excel 文件并实现样式修改与自定义下拉框

**ExcelJS** 是一个用于操作 Excel 文件的强大 JavaScript 库。本文将介绍如何使用 ExcelJS 导出 Excel 文件，修改 Excel 样式，设置数据验证（如下拉框），并导出生成的 Excel 文件。

---

## 1. 安装依赖

首先，安装 **ExcelJS** 和 **file-saver** 库：

```bash
npm install exceljs file-saver
```

---

## 2. 实现功能

### 2.1 初始化 Excel 配置

定义一些常量，便于后续的样式和下拉框配置。

```javascript
const holidayTypes = [
  { value: 1, label: '年假' },
  { value: 2, label: '调休' },
  { value: 3, label: '事假' },
  { value: 4, label: '病假' },
  { value: 5, label: '婚假' },
];

const EXCEL_CONFIG = {
  startRow: 4,
  endRow: 100,
  column: 'C',
  holidayTypes,
};

const STYLE_CONFIG = {
  row1: {
    font: { bold: true, size: 14, name: '微软雅黑', color: { argb: '000000' } },
    alignment: { horizontal: 'center', vertical: 'middle' },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF' } },
    height: 33,
  },
  row2: {
    font: { bold: true, size: 10, name: '微软雅黑', color: { argb: 'f9a831' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF' } },
    height: 120,
    alignment: { horizontal: 'left', vertical: 'center', wrapText: true },
  },
  row3: {
    font: { bold: true, name: '微软雅黑', color: { argb: '000000' } },
    alignment: { horizontal: 'center', vertical: 'middle' },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'f8f8f8' } },
    height: 30,
  },
  rowDefault: {
    height: 33,
    alignment: { horizontal: 'center', vertical: 'middle' },
  }
};
```

### 2.2 应用样式

通过 ExcelJS 应用自定义样式。设置标题行、表头和默认行的样式。

```javascript
const applyRowStyles = (worksheet, rowsConfig) => {
  rowsConfig.forEach((rowConfig, index) => {
    const row = worksheet.getRow(index + 1);
    Object.assign(row, rowConfig);
  });

  // 设置默认样式
  for (let rowNum = 3; rowNum <= worksheet.rowCount; rowNum++) {
    const row = worksheet.getRow(rowNum);
    Object.assign(row, STYLE_CONFIG.rowDefault);
  }
};
```

### 2.3 设置列宽

设置每一列的宽度，以确保内容不会被截断：

```javascript
const applyColumnWidths = (worksheet) => {
  worksheet.columns.forEach(column => {
    column.width = 15;  // 设置列宽为15（适应文字内容）
  });
};
```

### 2.4 自定义数据验证（下拉框）

设置数据验证，使特定列具有下拉框，用户只能选择合法值。

```javascript
const convertToFormulae = (types) => {
  const labels = types.map(item => item.label).join(',');
  return [`"${labels}"`];
};

const applyDataValidation = (worksheet, column, startRow, endRow, holidayTypes) => {
  const validation = {
    type: 'list',
    allowBlank: true,
    formulae: convertToFormulae(holidayTypes),
    showErrorMessage: true,
    errorTitle: '输入错误',
    error: '请选择合法假期类型',
  };

  for (let rowNum = startRow; rowNum <= endRow; rowNum++) {
    worksheet.getCell(`${column}${rowNum}`).dataValidation = validation;
  }
};
```

### 2.5 导出 Excel 文件

将生成的 Excel 数据、样式和验证通过 **ExcelJS** 写入文件，并使用 **file-saver** 保存文件。

```javascript
const exportExcel = async () => {
  message.loading('正在生成模板，请稍候...', 0);

  try {
    // 1. 加载模板文件
    const response = await fetch('http://localhost:3000/api/getExcelData');

    if (!response.ok || !response.headers.get('Content-Type').includes('spreadsheetml.sheet')) {
      throw new Error('加载模板失败，请稍后重试');
    }

    // 2. 获取 Excel 文件并解析
    const data = await response.blob();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(await data.arrayBuffer());

    // 3. 获取工作表并应用样式与数据验证
    const worksheet = workbook.worksheets[0];
    applyRowStyles(worksheet, [STYLE_CONFIG.row1, STYLE_CONFIG.row2, STYLE_CONFIG.row3]);
    applyDataValidation(worksheet, EXCEL_CONFIG.column, EXCEL_CONFIG.startRow, EXCEL_CONFIG.endRow, EXCEL_CONFIG.holidayTypes);
    applyColumnWidths(worksheet);  // 添加列宽设置

    // 4. 导出文件
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, '员工假期余额导入表.xlsx');

    message.success('模板已生成并下载');
  } catch (error) {
    console.error('生成模板失败:', error);
    message.error(`模板生成失败：${error.message || '请稍后重试'}`);
  } finally {
    message.destroy();
  }
};
```

### 2.6 导出按钮组件

创建一个按钮组件，当用户点击时，生成并下载 Excel 文件。

```javascript
const HolidayBalanceExportButton = () => (
  <Button type="primary" icon={<DownloadOutlined />} onClick={exportExcel}>
    点击此下载模板
  </Button>
);
```

---

## 3. 完整代码示例

```javascript
const holidayTypes = [
  { value: 1, label: '年假' },
  { value: 2, label: '调休' },
  { value: 3, label: '事假' },
  { value: 4, label: '病假' },
  { value: 5, label: '婚假' },
];

const EXCEL_CONFIG = {
  startRow: 4,
  endRow: 100,
  column: 'C',
  holidayTypes,
};

const STYLE_CONFIG = {
  row1: {
    font: { bold: true, size: 14, name: '微软雅黑', color: { argb: '000000' } },
    alignment: { horizontal: 'center', vertical: 'middle' },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF' } },
    height: 33,
  },
  row2: {
    font: { bold: true, size: 10, name: '微软雅黑', color: { argb: 'f9a831' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF' } },
    height: 120,
    alignment: { horizontal: 'left', vertical: 'center', wrapText: true },
  },
  row3: {
    font: { bold: true, name: '微软雅黑', color: { argb: '000000' } },
    alignment: { horizontal: 'center', vertical: 'middle' },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'f8f8f8' } },
    height: 30,
  },
  rowDefault: {
    height: 33,
    alignment: { horizontal: 'center', vertical: 'middle' },
  }
};

const applyRowStyles = (worksheet, rowsConfig) => {
  rowsConfig.forEach((rowConfig, index) => {
    const row = worksheet.getRow(index + 1);
    Object.assign(row, rowConfig);
  });

  for (let rowNum = 3; rowNum <= worksheet.rowCount; rowNum++) {
    const row = worksheet.getRow(rowNum);
    Object.assign(row, STYLE_CONFIG.rowDefault);
  }
};

const applyColumnWidths = (worksheet) => {
  worksheet.columns.forEach(column => {
    column.width = 15;
  });
};

const convertToFormulae = (types) => {
  const labels = types.map(item => item.label).join(',');
  return [`"${labels}"`];
};

const applyDataValidation = (worksheet, column, startRow, endRow, holidayTypes) => {
  const validation = {
    type: 'list',
    allowBlank: true,
    formulae: convertToFormulae(holidayTypes),
    showErrorMessage: true,
    errorTitle: '输入错误',
    error: '请选择合法假期类型',
  };

  for (let rowNum = startRow; rowNum <= endRow; rowNum++) {
    worksheet.getCell(`${column}${rowNum}`).dataValidation = validation;
  }
};

const exportExcel = async () => {
  message.loading('正在生成模板，请稍候...', 0);

  try {
    const response = await fetch('http://localhost:3000/api/getExcelData');
    if (!response.ok || !response.headers.get('Content-Type').includes('spreadsheetml.sheet')) {
      throw new Error('加载模板失败，请稍后重试');
    }

    const data = await response.blob();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(await data.arrayBuffer());

    const worksheet = workbook.worksheets[0];
    applyRowStyles(worksheet, [STYLE_CONFIG.row1, STYLE_CONFIG.row2, STYLE_CONFIG.row3]);
    applyDataValidation(worksheet, EXCEL_CONFIG.column, EXCEL_CONFIG.startRow, EXCEL_CONFIG.endRow, EXCEL_CONFIG.holidayTypes);
    applyColumnWidths(worksheet);

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, '员工假期余额导入表.xlsx');

    message.success('模板已生成并下载');
  } catch (error) {
    console.error('生成模板失败:', error);
    message.error(`模板生成失败：${error.message || '请稍后重试'}`);
  } finally {
    message.destroy();
  }
};
```

---

## 4. 总结

本文展示了如何使用 **ExcelJS**：

- 导出 **Excel** 文件。
- 修改 Excel 文件的 **样式**。
- 设置 **数据验证**，例如下拉框。
- 将生成的文件保存到本地。

通过这些步骤，您可以灵活地处理和导出符合需求的 Excel 文件。