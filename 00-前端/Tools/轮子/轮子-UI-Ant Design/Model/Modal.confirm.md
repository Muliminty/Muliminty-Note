# Modal.confirm

```JSX
	renderDelModal = () => {
		this.DelModal = Modal.confirm({
			title: '删除后将不可恢复，确定删除吗？',
			icon: <img src={WarnIcon} className="icon" />,
			content: '每次删除操作最多只能删除5000条数据哦',
			okText: '确定',
			className: 'operate_confirm',
			cancelText: '取消',
			onOk: close => {
				this.delModalOk(close);
			}
		});
		return this.DelModal;
	};



```

```JSX

delModalOk = async close => {
  
  this.DelModal.update({
    okButtonProps: {loading: true}
  });
  
  setTimeout(() => {
    this.DelModal.update({
      okButtonProps: {loading: false}
    });
  }, 2000);
  
  
  close();
  
	};
```