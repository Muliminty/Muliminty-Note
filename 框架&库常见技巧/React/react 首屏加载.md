# react 首屏加载

根节点直接添加加载效果，在加载完成后删除加载节点


```HTML
<!DOCTYPE html>
<html>

<head>
	<title>11111111</title>
	<meta charset="utf-8" />
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta name="referrer" content="no-referrer">
</head>
<body>
	
    <!-- 加载图片  -->
		<img style="width: 100px; height: 100px;" src='.../'>
	</div>

	<div id="app"></div>
</body>
<script>
	var root = document.getElementById('loading');
	root.style.height = "100%";
	console.log(document.readyState, 1111111111);
	document.onreadystatechange = function () {
		let string = document.readyState;
		console.log(string, 'string');
		if (string === 'complete') root.remove()
	}
</script>
</html>
```