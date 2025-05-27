```
import { useEvent } from 'rc-util';
import React, { useEffect, useRef } from 'react';
import useSyncState from "./useSyncState";


function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 * 将输入转换为数组（如果是单个元素则包装为数组）
 * @param item 输入元素
 * @returns 数组形式
 */
function toArray(item) {
  return Array.isArray(item) ? item : [item];
}

/**
 * 自定义聊天钩子，管理聊天状态和请求逻辑
 * @param config 配置对象
 * @returns 包含聊天方法和状态的对象
 */
export default function useXChat(config) {
  // 解构配置参数
  const {
    defaultMessages,    // 初始消息列表
    agent,             // 请求代理实例
    requestFallback,   // 请求失败时的回退内容
    requestPlaceholder,// 加载占位内容
    parser             // 消息解析器
  } = config;

  const abortControllerRef = useRef(new AbortController()); // 新增AbortController引用
  const isAbortedRef = useRef(false);                        // 中断状态标记

  // ======================== 消息状态管理 ========================
  const idRef = React.useRef(0);  // 消息ID生成器
  const [messages, setMessages, getMessages] = useSyncState(() =>
    // 初始化消息列表，添加默认属性
    (defaultMessages || []).map((info, index) => ({
      id: `default_${index}`,  // 默认消息ID格式
      status: 'local',         // 初始状态为本地消息
      ...info                  // 合并传入的消息属性
    }))
  );

  /**
   * 创建新消息对象
   * @param message 消息内容
   * @param status 消息状态（local/loading/success/error）
   * @returns 消息对象
   */
  const createMessage = (message, status) => {
    const msg = {
      timestamp: Date.now(),// 当前时间戳
      id: `msg_${idRef.current}`,  // 生成唯一ID
      message,                    // 消息内容
      status                      // 消息状态
    };
    idRef.current += 1;           // 递增ID生成器
    return msg;
  };



  // ======================== 消息解析处理 ========================
  const parsedMessages = React.useMemo(() => {
    const list = [];
    messages.forEach(agentMsg => {
      // 使用自定义解析器处理原始消息
      const rawParsedMsg = parser ? parser(agentMsg.message) : agentMsg.message;
      // 确保消息转换为数组形式
      const bubbleMsgs = toArray(rawParsedMsg);

      // 为每个解析后的消息创建气泡消息对象
      bubbleMsgs.forEach((bubbleMsg, bubbleMsgIndex) => {
        let key = agentMsg.id;
        // 如果存在多个气泡消息，添加索引后缀
        if (bubbleMsgs.length > 1) {
          key = `${key}_${bubbleMsgIndex}`;
        }
        list.push({
          id: key,               // 唯一标识
          message: bubbleMsg,    // 解析后的消息内容
          status: agentMsg.status // 继承原始消息状态
        });
      });
    });
    return list;
  }, [messages]);

  // ======================== 请求处理逻辑 ========================
  /**
   * 过滤有效消息（排除加载中和错误状态）
   * @param msgs 原始消息列表
   * @returns 过滤后的消息内容列表
   */
  const getFilteredMessages = msgs =>
    msgs
      .filter(info => info.status !== 'loading' && info.status !== 'error')
      .map(info => info.message);

  // 获取当前有效消息（用于请求上下文）
  const getRequestMessages = () => getFilteredMessages(getMessages());


  const flog = useRef(true)


  /**
   * 处理消息请求的核心方法
   * @param message 用户输入的消息
   */
  const onRequest = useEvent(message => {
    if (!agent) throw new Error('Agent instance is required');
    isAbortedRef.current = false; // 新增状态重置

    let loadingMsgId = null; // 加载占位消息的ID

    // 添加用户消息和加载占位符
    setMessages(ori => {
      let nextMessages = [...ori, createMessage(message, 'local')];

      if (requestPlaceholder) {
        // 动态生成占位内容（支持函数形式）
        const placeholderMsg = typeof requestPlaceholder === 'function'
          ? requestPlaceholder(message, { messages: getFilteredMessages(nextMessages) })
          : requestPlaceholder;

        // 创建加载状态消息
        const loadingMsg = createMessage(placeholderMsg, 'loading');
        loadingMsgId = loadingMsg.id;
        nextMessages = [...nextMessages, loadingMsg];
      }
      return nextMessages;
    });

    // ==================== 请求处理核心 ====================
    let updatingMsgId = null; // 当前更新中的消息ID

    let updateQueue = Promise.resolve(); // 初始化队列

    const updateMessage = async (message, status) => {
      // 将新任务加入队列，等待前一任务完成
      updateQueue = updateQueue.then(async () => {
        // 新增中止状态检查
        if (isAbortedRef.current) return null;

        if (flog.current) {
          let msg = getMessages().find(info => info.id === updatingMsgId);

          // 创建新消息逻辑（保持不变）
          if (!msg) {
            msg = createMessage(message, status);
            setMessages(ori => {
              const oriWithoutPending = ori.filter(info => info.id !== loadingMsgId);
              return [...oriWithoutPending, msg];
            });
            updatingMsgId = msg.id;
          }
          // 更新现有消息逻辑
          else {
            const arr = message.split('');
            for (const char of arr) {
              // 添加 await 确保每次更新完成后再继续
              await new Promise(resolve => {
                setMessages(ori => ori.map(info => {
                  const newInfo = info.id === updatingMsgId
                    ? { ...info, message: `${info.message}${char}`, status: 'success' }
                    : info;
                  resolve(); // 在 setMessages 完成后 resolve
                  return newInfo;
                }));
              });
              await sleep(12); // 控制字符输出速度（可选）
            }
          }
          return msg;
        }
      }).catch(error => {
        console.error('任务执行失败:', error);
      });

      return updateQueue;
    };

    // 发起API请求
    agent.request(
      {
        message,
        messages: getRequestMessages(),
        signal: abortControllerRef.current.signal // 直接使用ref最新值
      }, // 请求参数
      {
        // 流式更新回调
        onUpdate: async message => {
          if (isAbortedRef.current) return; // 新增中止检查
          await updateMessage(message, 'success');
          flog.current = true;
        },

        // 请求成功回调
        onSuccess: async message => {
          if (isAbortedRef.current) return; // 新增中止检查
          await updateMessage(message, 'success');
        },

        // 错误处理回调
        onError: async error => {
          console.error('Request failed:', error);
          if (error.name === 'AbortError') { // 捕获终止异常
            console.log('请求已主动终止');
            return;
          }

          if (requestFallback) {
            // 生成回退内容（支持异步函数）
            const fallbackMsg = typeof requestFallback === 'function'
              ? await requestFallback(message, { error, messages: getRequestMessages() })
              : requestFallback;

            // 替换为错误状态消息
            setMessages(ori => [
              ...ori.filter(info =>
                info.id !== loadingMsgId &&
                info.id !== updatingMsgId
              ),
              createMessage(fallbackMsg, 'error')
            ]);
          } else {
            // 直接移除加载状态消息
            setMessages(ori =>
              ori.filter(info =>
                info.id !== loadingMsgId &&
                info.id !== updatingMsgId
              )
            );
          }
        }
      }
    );


  });

  // 结束
  const end = async () => {
    try {
      const prevController = abortControllerRef.current;
      if (prevController.signal.aborted) return;

      abortControllerRef.current = new AbortController();
      prevController.abort();
      isAbortedRef.current = true;

      setMessages(ori => {
        const lastMsg = ori[ori.length - 1];
        if (lastMsg?.status === 'loading') {
          return [
            ...ori.slice(0, -1),
            { ...lastMsg, status: 'error', message: '请求已终止' }
          ];
        }
        return ori;
      });
    } catch (e) {
      console.error('终止请求失败:', e);
    }
  };


  // 暴露给外部使用的接口
  return {
    onRequest,        // 触发请求的方法
    messages,         // 原始消息列表
    parsedMessages,   // 解析后的消息列表（用于渲染）
    setMessages,       // 手动设置消息的方法
    end,        // 在需要中断处调用的方法
  };
}

```