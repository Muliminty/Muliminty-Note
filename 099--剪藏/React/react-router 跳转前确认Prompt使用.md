---
link: https://blog.csdn.net/Y_G_G/article/details/108101133
title: react-router 跳转前确认Prompt使用
description: 需求页面切换的时候，会遇到这样的需求：切换时需要判断内容区域编辑后是否保存了， 若没保存，则弹出提示框，提示保存。官网示例react router中的Prompt可以实现这样的功能。Prompt示例Prompt文档/** when:是否启用 *//** message:string | func */// 示例1&lt;Prompt  when={formIsHalfFilledOut}  message="Are you sure you want to leave?"/&gt
keywords: react prompt
author: Y_g_g Csdn认证博客专家 Csdn认证企业博客 码龄8年 暂无认证
date: 2022-10-28T13:09:19.000Z
publisher: null
stats: paragraph=22 sentences=29, words=309
---
#### 需求

页面切换的时候，会遇到这样的需求：切换时需要判断内容区域编辑后是否保存了， 若没保存，则弹出提示框，提示保存。

![](https://img-blog.csdnimg.cn/20200819150430654.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1lfR19H,size_16,color_FFFFFF,t_70#pic_center)

#### <a name="_5">;</a> 官网示例

react router中的Prompt可以实现这样的功能。
[Prompt示例](https://reactrouter.com/web/example/preventing-transitions)
[Prompt文档](https://reactrouter.com/core/api/Prompt)

```js

<Prompt
  when={formIsHalfFilledOut}
  message="Are you sure you want to leave?"
/>

<Prompt
  message={(location, action) => {
    if (action === 'POP') {
      console.log("Backing up...")
    }

    return location.pathname.startsWith("/app")
      ? true
      : `Are you sure you want to go to ${location.pathname}?`
  }}
/>
```

#### 实现

我们项目的技术栈umi+antd+react
弹框用的Antd的 Modal.confirm

```js
import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { useBoolean } from '@umijs/hooks';

import { useParams, history, Prompt } from 'umi';
import {
  ExclamationCircleOutlined
} from '@ant-design/icons';
import {  isEqual } from '@/utils/utils';
import { FormInstance } from 'antd/lib/form';

export default function BaseInfo() {
  const { id } = useParams<{ id: string }>();

  const [orginData, setOrigin] = useState({});

  const [modifyData, setModify] = useState({});

  const { state, setTrue, setFalse } = useBoolean(false);

  const [isFetching, fetchInfo] = useLoading(getServiceGroupDetail);
  useEffect(() => {
    (async () => {
      try {
        if (id !== '0') {
          const info = await fetchInfo(id);
          setOrigin({
            ...info
          });
          setModify({
            ...info
          });
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (isEqual(orginData, modifyData)) {
      setFalse();
    } else {
      setTrue();
    }
  }, [orginData, modifyData]);

  const nextStep = (pathname?: string) => {
    setFalse();
    pathname &&
      setTimeout(() => {
        history.push(pathname);
      });
  };
  return (
      {}
      {routerWillLeave(state, form, nextStep)}
  );
}

function routerWillLeave(
  isPrompt: boolean | undefined,
  formInstance: FormInstance,
  nextStep: (pathname?: string) => void
) {
  return (
    <div>
      <Prompt
        when={isPrompt}
        message={(location) => {
          if (!isPrompt) {
            return true;
          }
          Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: '暂未保存您所做的更改，是否保存？',
            okText: '保存',
            cancelText: '不保存',
            onOk() {
              formInstance?.submit();
              nextStep(location.pathname);
            },
            onCancel() {
              nextStep(location.pathname);
            }
          });
          return false;
        }}
      />
    </div>
  );
}

```

参考文档：[react-router中离开确认组件Prompt](https://juejin.im/post/6844903798322790407)
