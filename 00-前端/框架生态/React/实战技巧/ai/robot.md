import {
  Bubble,
  Prompts,
  Sender,
  Welcome,
  useXAgent,
} from '@ant-design/x';
import React, { useEffect, useState, useImperativeHandle, useRef, forwardRef } from 'react';
import {
  CopyOutlined,
  ProductOutlined
} from '@ant-design/icons';
import useXChat from '@/hook/useXChat';
import { UserOutlined } from '@ant-design/icons';
import { Button, Flex, theme, Dropdown, Space } from 'antd';
import markdownit from 'markdown-it';
import icon from '@/assets/images/chat-icon.png';
import { auth, utils } from "zlink-front";
import { parseHTML } from './parseHTML'
import { getBots } from '@/api/ai'
import { useTranslation } from "react-i18next";
import './robot.scss'
import {
  getPromptsFromBot,
  roles,
} from './constants.js';
// import { useLocation } from 'react-router-dom';
import { useMessage } from "@/hook/useMessage";

const { getTimeZone } = utils


const md = markdownit({
  html: true,
  breaks: true,
});


const Robot = forwardRef((props, ref) => {
  const currentBot = useRef(null);
  const { t } = useTranslation();
  const prompts = getPromptsFromBot(currentBot.current, t);
  const [content, setContent] = React.useState('');
  const [loading, setLoading] = useState(false);

  // 修改tabs为状态变量
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  const { token } = theme.useToken();
  const divRef = useRef(null); // 新增 ref 用于测量 div 宽度

  const { createMessage: message } = useMessage();

  useEffect(() => {
    if (divRef.current) {
      const divWidth = divRef?.current?.offsetWidth;
      // 根据 div 宽度动态计算 text-indent 值
      const calculatedIndent = `${divWidth + 5}px`; // 例如设置为宽度的 10%
      const textarea = document.querySelector('.ant-sender-input')
      textarea.style.textIndent = calculatedIndent; // 应用计算后的 text-indent 值
    }
  }, [props?.open, activeTab]);

  useEffect(() => {
    setTimeout(() => {
      const textarea = document.querySelector('.ant-sender-input');
      // 添加滚动事件监听器
      const handleScroll = () => {
        const scrollTop = textarea.scrollTop;
        const senderBots = document.querySelector('.sender-bots');
        if (senderBots) {
          senderBots.style.transform = `translateY(-${scrollTop}px)`;
          // senderBots.style.transition = 'transform 0.2s ease';
        }
      };

      textarea.addEventListener('scroll', handleScroll);

      // 清理事件监听器
      return () => {
        textarea.removeEventListener('scroll', handleScroll);
      };
    }, 0);
  }, [props?.open]);

  // 在useEffect中调用getBots接口
  useEffect(() => {
    const fetchBots = async () => {
      try {
        const res = await getBots();
        setTabs(res);
        setActiveTab(res[0].id); // 默认选中第一个
        currentBot.current = res[0];
      } catch (error) {
        console.error('获取知识库失败:', error);
      }
    };

    fetchBots();
  }, []);


  const handleTabClick = (id) => {
    setActiveTab(id);
    currentBot.current = tabs.find(tab => tab.id === id);
  };


  // 使用 useImperativeHandle 来暴露给父组件的方法
  useImperativeHandle(ref, () => ({
    clear: () => {
      setMessages([]);
    },
  }));

  async function fetchStream(url, options = {}, { onSuccess, onUpdate, onError }) {
    try {
      setLoading(true)
      const response = await fetch(url, options);

      if (response.status === 200) {
        message.error(t('components.aiChat.loginExpired'));
        setTimeout(() => {
          window.location.href = '/login'; // 跳转到登录页
        }, 1500);
      }

      if (!response.ok) {
        if (response.status === 401) {
          message.error(t('components.aiChat.loginExpired'));
          setTimeout(() => {
            window.location.href = '/login'; // 跳转到登录页
          }, 1500);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 获取流对象
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      let buffer = ''; // 缓存数据
      let result = [];

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;
        // await sleep(300);
        // 解码数据块并拼接
        buffer += decoder.decode(value, { stream: true });

        // 处理分块数据，提取完整事件
        const events = buffer.split('\n\n'); // SSE 事件以 \n\n 结尾
        buffer = events.pop(); // 最后一部分可能是未完成的数据，存入 buffer
        for (const event of events) {

          const rawData = event.replace(/^data:/, '').trim(); // 只取 data 部分
          if (event.startsWith('data:')) {
            if (rawData === 'done') {
              onSuccess('')
              setLoading(false)

              break;
            }
            try {
              const parsedData = JSON.parse(rawData); // 解析 JSON


              !parsedData.done && result.push(parsedData);

              parsedData?.type === "answer" && parsedData?.content && await onUpdate(parsedData.content)
              if (parsedData.status === 'done') {
                onSuccess('')
                setLoading(false)
              }
            } catch (err) {
              console.warn('JSON 解析失败:', rawData);
            }
          }
        }

      }
      onSuccess('')
    } catch (error) {
      onError(error);
      console.error('请求失败:', error);
    } finally {
      setLoading(false)
    }
  }


  const [agent] = useXAgent({
    request: async ({ message }, cb) => {
      const { onSuccess, onUpdate, onError } = cb;
      const token = auth.getToken()

      if (!token) {
        message.error(t('components.aiChat.pleaseLogin'));
        return;
      }
      try {
        const url = `/ai-api/v2.0/zlink/ai/chat`;

        await fetchStream(url, {
          method: 'POST',
          headers: {
            'Accept-Encoding': 'identity',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
            'Source': 'pc',
            'Current-Timezone': getTimeZone(),
          },
          body: JSON.stringify({
            question: message,
            user: props?.name || '',
            botType: currentBot?.current?.type,
            // 加时间戳
            requestId: Date.now() // 添加当前时间戳
          }),
          message: message
          ,
        }, { onSuccess, onUpdate, onError });
      } catch (error) {
        onError(error);
        console.error('请求失败:', error);
      }
    },
  });

  const { onRequest, messages, setMessages, end } = useXChat({
    agent,
    requestPlaceholder: '',
  });


  const onSubmit = (nextContent) => {
    if (!nextContent) return;
    onRequest(nextContent);
    setContent('');
  };

  const onPromptsItemClick = (info) => {
    onRequest(info.data.description);
  };


  const placeholderNode = (
    <Space direction="vertical" size={16} className={'placeholder'}>
      <Welcome
        variant="borderless"
        icon={<img src={icon} />}
        title={t('components.aiChat.welcomeTitle')}
        description={t('components.aiChat.welcomeDesc')}
      />
      <Prompts
        title={t('components.aiChat.promptTitle')}
        items={prompts.placeholder}
        wrap
        // styles={{
        //   item: {
        //     flex: 'none',
        //     width: 'calc(50% - 6px)',
        //   },
        // }}
        styles={{
          list: {
            width: '100%',
          },
          item: {
            flex: 'none',
            width: 'calc(50% - 6px)',
          },
        }}
        onItemClick={onPromptsItemClick}
      />

    </Space>
  );

  const renderMarkdown = (content) => {
    const value = md.render(`${content}`)
    return <div className='markdown-body'>
      {parseHTML(value)}
    </div>
  };


  const renderTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const items = messages.map(({ id, message, status, timestamp }) => ({
    key: id,
    loading: status === 'loading',
    header: (
      status === 'local' ?
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: '#888' }}>
            {renderTime(timestamp)}
          </span>
          {props?.name || 'local'}
        </div> :
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {status === 'local' ? (props?.name || 'local') : t('components.aiChat.aiName')}
          <span style={{ fontSize: 12, color: '#888' }}>
            {renderTime(timestamp)}
          </span>
        </div>
    ),
    role: status === 'local' ? 'local' : 'ai',
    avatar: status === 'local'
      ? { icon: <UserOutlined />, style: { color: '#f56a00', backgroundColor: '#fde3cf' } }
      : { icon: <UserOutlined />, style: { color: '#fff', backgroundColor: '#87d068' } },
    content: renderMarkdown(message),
    classNames: status === 'local' ? 'local' : 'ai',
    footer: status !== 'loading' && (
      <Space className='chat-toolbar'>
        {/* <Button color="default" variant="text" size="small" icon={<SyncOutlined />} /> */}
        <Button color="default"
          style={{ border: 'none', height: '24px' }}
          variant="text" size="small" icon={<CopyOutlined />} onClick={() => copyText(message)} />
      </Space>
    )
  }));

  const copyText = (val) => {
    // 现代浏览器剪贴板API
    if (navigator.clipboard) {
      navigator.clipboard.writeText(val)
        .then(() => {
          message.success(t('components.aiChat.copySuccess'));
        })
        .catch((error) => {
          console.error('剪贴板API失败:', error);
          fallbackCopyText(val); // 降级方案
        });
    } else {
      fallbackCopyText(val); // 传统浏览器降级方案
    }
  };

  // 传统复制方案
  const fallbackCopyText = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';  // 避免滚动到页面底部
    textArea.style.opacity = 0;

    document.body.appendChild(textArea);
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        message.success(t('components.aiChat.copySuccess'));
      } else {
        message.error(t('components.aiChat.copyFailed'));
      }
    } catch (err) {
      console.error('传统复制方法失败:', err);
      message.error(t('components.aiChat.copyFailed'));
    } finally {
      document.body.removeChild(textArea);
    }
  };

  const [textareaHeight, setTextareaHeight] = useState(0);
  useEffect(() => {
    const length = content?.length || 0;
    if (length === 0) setTextareaHeight(0)
    if (length > 0) {
      setTimeout(() => {
        const textarea = document.querySelector('.ant-sender-input')
        const textareaHeight = textarea?.scrollHeight || 0;
        setTextareaHeight(textareaHeight)
      }, 0);
    }
  }, [content]);

  const iconStyle = {
    fontSize: 18,
    color: token.colorText,
  };

  return (
    <div className={'layout'}>
      <div className={'robot-chat'}>
        <Bubble.List
          // messageRender={renderMarkdown}
          items={
            items.length > 0
              ? items
              : [{
                content: placeholderNode,
                variant: 'borderless',
                rootClassName: 'placeholder-node'
              }]
          }
          roles={roles}
          className={'messages'}
        />
        <Prompts
          items={prompts.sender}
          onItemClick={onPromptsItemClick} />
        <Sender
          value={content}
          onSubmit={onSubmit}
          onCancel={() => {
            setLoading(false);
            end('--')
          }}
          onChange={setContent}
          loading={loading}
          className={'sender'}
          actions={false}
          header={(
            <div
              ref={divRef}
              className='sender-bots'
              style={{
                top: textareaHeight ?
                  textareaHeight > 26 ? "14px" : "14px"
                  : "14px",
                left: '17px'
              }}
            >
              {tabs.filter((tab) => tab.id === activeTab)[0]?.name}
            </div>
          )}
          autoSize={{ minRows: 2, maxRows: 6 }}
          footer={({ components }) => {
            const { SendButton, LoadingButton, SpeechButton } = components;
            return (
              <Flex justify="space-between" align="center">
                <Flex gap="small" align="center">
                  <Dropdown
                    overlayStyle={{ zIndex: '999999' }}
                    menu={{
                      items: tabs?.map((e) => ({
                        key: e.id,
                        label: e.name
                      })),
                      onClick: ({ item, key, keyPath, domEvent }) => {
                        handleTabClick(key)
                      }
                    }}
                    placement="top"
                  >
                    <Button icon={<ProductOutlined />}>{t('components.aiChat.skillsButton')}</Button>
                  </Dropdown>
                </Flex>
                <Flex align="center">
                  {loading ? (
                    <LoadingButton type="default" />
                  ) : (
                    <SendButton type="primary" disabled={content.length <= 0} />
                  )}
                </Flex>
              </Flex>
            );
          }}
        />
      </div>
    </div >
  );
});

export default Robot;