
复制 `localStorage` + `sessionStorage` 内容 
```
(function() {
  const allData = {
    localStorage: { ...localStorage },
    sessionStorage: { ...sessionStorage }
  };
  console.log(allData);
  copy(allData); // Chrome 控制台支持 copy() 函数，直接复制到剪贴板
})();
