```
import {

  Attachments,

  Bubble,

  Conversations,

  Prompts,

  Sender,

  Welcome,

  useXAgent,

  useXChat,

} from '@ant-design/x';

import { createStyles } from 'antd-style';

import React, { useEffect } from 'react';

import {

  CloudUploadOutlined,

  CommentOutlined,

  EllipsisOutlined,

  FireOutlined,

  HeartOutlined,

  PaperClipOutlined,

  PlusOutlined,

  ReadOutlined,

  ShareAltOutlined,

  SmileOutlined,

} from '@ant-design/icons';

import { Badge, Button, Space } from 'antd';

const renderTitle = (icon, title) => (

  <Space align="start">

    {icon}

    <span>{title}</span>

  </Space>

);

const defaultConversationsItems = [

  {

    key: '0',

    label: 'What is Ant Design X?',

  },

];

const useStyle = createStyles(({ token, css }) => {

  return {

    layout: css`

      width: 100%;

      min-width: 1000px;

      height: calc(100vh - 60px);

      border-radius: ${token.borderRadius}px;

      display: flex;

      background: ${token.colorBgContainer};

      font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;

  

      .ant-prompts {

        color: ${token.colorText};

      }

    `,

    menu: css`

      background: ${token.colorBgLayout}80;

      width: 280px;

      height: 100%;

      display: flex;

      flex-direction: column;

    `,

    conversations: css`

      padding: 0 12px;

      flex: 1;

      overflow-y: auto;

    `,

    chat: css`

      height: 100%;

      width: 100%;

      max-width: 700px;

      margin: 0 auto;

      box-sizing: border-box;

      display: flex;

      flex-direction: column;

      padding: ${token.paddingLG}px;

      gap: 16px;

    `,

    messages: css`

      flex: 1;

    `,

    placeholder: css`

      padding-top: 32px;

    `,

    sender: css`

      box-shadow: ${token.boxShadow};

    `,

    logo: css`

      display: flex;

      height: 72px;

      align-items: center;

      justify-content: start;

      padding: 0 24px;

      box-sizing: border-box;

  

      img {

        width: 24px;

        height: 24px;

        display: inline-block;

      }

  

      span {

        display: inline-block;

        margin: 0 8px;

        font-weight: bold;

        color: ${token.colorText};

        font-size: 16px;

      }

    `,

    addBtn: css`

      background: #1677ff0f;

      border: 1px solid #1677ff34;

      width: calc(100% - 24px);

      margin: 0 12px 24px 12px;

    `,

  };

});

  

const placeholderPromptsItems = [

  {

    key: '1',

    label: renderTitle(

      <FireOutlined

        style={{

          color: '#FF4D4F',

        }}

      />,

      'Hot Topics',

    ),

    description: 'What are you interested in?',

    children: [

      {

        key: '1-1',

        description: `What's new in X?`,

      },

      {

        key: '1-2',

        description: `What's AGI?`,

      },

      {

        key: '1-3',

        description: `Where is the doc?`,

      },

    ],

  },

  {

    key: '2',

    label: renderTitle(

      <ReadOutlined

        style={{

          color: '#1890FF',

        }}

      />,

      'Design Guide',

    ),

    description: 'How to design a good product?',

    children: [

      {

        key: '2-1',

        icon: <HeartOutlined />,

        description: `Know the well`,

      },

      {

        key: '2-2',

        icon: <SmileOutlined />,

        description: `Set the AI role`,

      },

      {

        key: '2-3',

        icon: <CommentOutlined />,

        description: `Express the feeling`,

      },

    ],

  },

];

const senderPromptsItems = [

  {

    key: '1',

    description: '提示词',

    icon: (

      <FireOutlined

        style={{

          color: '#FF4D4F',

        }}

      />

    ),

  },

  {

    key: '2',

    description: '提示词2',

    icon: (

      <ReadOutlined

        style={{

          color: '#1890FF',

        }}

      />

    ),

  },

];

const roles = {

  ai: {

    placement: 'start',

    typing: {

      step: 5,

      interval: 20,

    },

    styles: {

      content: {

        borderRadius: 16,

      },

    },

  },

  local: {

    placement: 'end',

    variant: 'shadow',

  },

};

const Independent = () => {

  // ==================== Style ====================

  const { styles } = useStyle();

  

  // ==================== State ====================

  const [headerOpen, setHeaderOpen] = React.useState(false);

  const [content, setContent] = React.useState('');

  const [conversationsItems, setConversationsItems] = React.useState(defaultConversationsItems);

  const [activeKey, setActiveKey] = React.useState(defaultConversationsItems[0].key);

  const [attachedFiles, setAttachedFiles] = React.useState([]);

  

  // ==================== Runtime ====================

  const [agent] = useXAgent({

    request: async ({ message }, cb) => {

      const { onSuccess, onUpdate, onError } = cb;

      handleChat({ message }, { onUpdate, onError, onSuccess });

    },

  });

  

  const { onRequest, messages, setMessages } = useXChat({

    agent,

  });

  
  

  const handleChat = async ({ message }, { onUpdate, onError, onSuccess }) => {

    console.log('messages: ---------', messages);

    try {

      // 模拟的响应数据

      const mockData = [

        "Hello, ",

        "this is a ",

        "simulated ",

        "stream ",

        "response.",

        "以下是一些用于测试的文本示例，涵盖了不同长度、语言和风格的文本片段。你可以根据需要选择或组合这些文本来测试你的流式输出功能。以下是一些用于测试的文本示例，涵盖了不同长度、语言和风格的文本片段。你可以根据需要选择或组合这些文本来测试你的流式输出功能。以下是一些用于测试的文本示例，涵盖了不同长度、语言和风格的文本片段。你可以根据需要选择或组合这些文本来测试你的流式输出功能。以下是一些用于测试的文本示例，涵盖了不同长度、语言和风格的文本片段。你可以根据需要选择或组合这些文本来测试你的流式输出功能。以下是一些用于测试的文本示例，涵盖了不同长度、语言和风格的文本片段。你可以根据需要选择或组合这些文本来测试你的流式输出功能。"

      ];

  

      // 模拟流式输出

      const simulateStream = async (data, interval = 500) => {

        let res = ''

        for (let index = 0; index < data.length; index++) {

          await new Promise((resolve) => setTimeout(resolve, interval)); // 模拟延迟

          res = `${res}${data[index]}`

          data[index] && onUpdate(res); // 通过回调传递每一块数据

        }

        return res

      };

      console.log('开始请求')

      // 模拟流式输出

      let res = await simulateStream(mockData);

      console.log('请求结束')

      onSuccess(res)

  

    } catch (error) {

      console.error('Error:', error);

      onError(error); // 传递错误

    }

  

  };

  

  // ==================== Event ====================

  const onSubmit = (nextContent) => {

    if (!nextContent) return;

    onRequest(nextContent);

    setContent('');

  };

  const onPromptsItemClick = (info) => {

    onRequest(info.data.description);

  };

  const onAddConversation = () => {

    setConversationsItems([

      ...conversationsItems,

      {

        key: `${conversationsItems.length}`,

        label: `New Conversation ${conversationsItems.length}`,

      },

    ]);

    setActiveKey(`${conversationsItems.length}`);

  };

  const onConversationClick = (key) => {

    setActiveKey(key);

  };

  const handleFileChange = (info) => setAttachedFiles(info.fileList);

  

  // ==================== Nodes ====================

  const placeholderNode = (

    <Space direction="vertical" size={16} className={styles.placeholder}>

      <Welcome

        variant="borderless"

        icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"

        title="Hello"

        description="请开始聊天~"

        extra={

          <Space>

            <Button icon={<ShareAltOutlined />} />

            <Button icon={<EllipsisOutlined />} />

          </Space>

        }

      />

      <Prompts

        title="Do you want?"

        items={placeholderPromptsItems}

        styles={{

          list: {

            width: '100%',

          },

          item: {

            flex: 1,

          },

        }}

        onItemClick={onPromptsItemClick}

      />

    </Space>

  );

  const items = messages.map(({ id, message, status }) => ({

    key: id,

    loading: status === 'loading',

    role: status === 'local' ? 'local' : 'ai',

    content: message,

  }));

  const attachmentsNode = (

    <Badge dot={attachedFiles.length > 0 && !headerOpen}>

      <Button type="text" icon={<PaperClipOutlined />} onClick={() => setHeaderOpen(!headerOpen)} />

    </Badge>

  );

  const senderHeader = (

    <Sender.Header

      title="Attachments"

      open={headerOpen}

      onOpenChange={setHeaderOpen}

      styles={{

        content: {

          padding: 0,

        },

      }}

    >

      <Attachments

        beforeUpload={() => false}

        items={attachedFiles}

        onChange={handleFileChange}

        placeholder={(type) =>

          type === 'drop'

            ? {

              title: 'Drop file here',

            }

            : {

              icon: <CloudUploadOutlined />,

              title: 'Upload files',

              description: 'Click or drag files to this area to upload',

            }

        }

      />

    </Sender.Header>

  );

  const logoNode = (

    <div className={styles.logo}>

      {/* <img

        src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original"

        draggable={false}

        alt="logo"

      /> */}

      <span>logo zlink</span>

    </div>

  );

  

  // ==================== Render =================

  return (

    <div className={styles.layout}>

      <div className={styles.menu}>

        {/* 🌟 Logo */}

        {logoNode}

        {/* 🌟 添加会话 */}

        <Button

          onClick={onAddConversation}

          type="link"

          className={styles.addBtn}

          icon={<PlusOutlined />}

        >

          新建会话

        </Button>

        {/* 🌟 会话管理 */}

        <Conversations

          items={conversationsItems}

          className={styles.conversations}

          activeKey={activeKey}

          onActiveChange={onConversationClick}

        />

      </div>

      <div className={styles.chat}>

        {/* 🌟 消息列表 */}

        <Bubble.List

  

          items={

            messages.length > 0 ?

              messages.map(({ id, message, status }) => ({

                key: id,

                role: status === 'local' ? 'local' : 'ai',

                content: message,

              }))

              : [

                {

                  content: placeholderNode,

                  variant: 'borderless',

                },

              ]

          }

          roles={roles}

          className={styles.messages}

        />2

        {/* 🌟 提示词 */}

        <Prompts items={senderPromptsItems} onItemClick={onPromptsItemClick} />

        {/* 🌟 输入框 */}

        <Sender

          value={content}

          header={senderHeader}

          onSubmit={onSubmit}

          onChange={setContent}

          prefix={attachmentsNode}

          loading={agent.isRequesting()}

          className={styles.sender}

        />

      </div>

    </div>

  );

};

export default Independent;
```