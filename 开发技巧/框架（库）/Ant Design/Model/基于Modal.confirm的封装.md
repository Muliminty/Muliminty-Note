# 基于Modal.confirm的封装

```JSX
import React from 'react';
import {Modal} from 'antd';
import hint2 from '../../../images/hint2.png';
import style from './style';

/**
 * 		直接在点击事件调用这个方法
 * 
 * 	
	const data = {
		title: '提示',
		content: '您还未保存页面内容，确定需要离开吗？',
		okText: '保存离开',
		cancelText: '不保存离开'
	};
	ConfirmModal(
		data,
		close => {
			console.log(1);
			close();
		},
		close => {
			console.log(2);
			close();
		}
	);
 * */

export default function ConfirmModal(props, ok, no) {
	const ModalCon = Modal.confirm({
		...props,
		title: props?.title || '标题',
		icon: <img src={hint2} className="icon" />,
		content: props?.content || '内容',
		okText: props?.okText || '确定',
		className: style.ConfirmModal,
		cancelText: props?.cancelText || '取消',
		onOk: close => {
			ModalCon.update({
				okButtonProps: {loading: true}
			});
			ok ? ok(() => close()) : close();
		},
		onCancel: close => {
			no ? no(() => close()) : close();
		}
	});
	return ModalCon;
}

```

```LESS
.ConfirmModal {
	:global {
		.ant-modal-content {
			width: 384px;
			height: 178px;
		}

		.ant-modal-body {
			padding: 42px 24px 20px 40px;
		}

		.ant-modal-confirm-btns {
			margin-top: 13px;
		}

		.ant-modal-confirm-title {
			margin-left: 10px;
			display: inline-block !important;
			vertical-align: bottom;
			font-size: 14px !important;
			font-weight: bold !important;
			color: rgba(0, 0, 0, 0.85) !important;
		}

		.ant-modal-confirm-content {
			font-size: 13px !important;
			font-weight: 400 !important;
			color: rgba(0, 0, 0, 0.65) !important;
			margin-left: 26px;
		}

		.ant-checkbox-checked::after {
			position: absolute;
			top: 0;
			left: -1px;
			width: 100%;
			height: 100%;
			border: 1px solid #1890ff;
			border-radius: 2px;
			visibility: hidden;
			animation: antCheckboxEffect 0.36s ease-in-out;
			animation-fill-mode: backwards;
			content: '';
		}
	}
}

```

```JSX
handleEdit = id => {
			const data = {
				title: '提示',
				content: '您还未保存页面内容，确定需要离开吗？',
				okText: '保存离开',
				cancelText: '不保存离开'
			};
			ConfirmModal(
				data,
				close => {
          close();
				},
				close => {
         close();
				}
			);
	};
```