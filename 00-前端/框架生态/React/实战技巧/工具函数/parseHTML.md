```
import React from "react";

import { Image } from "antd";

import './parseHTML.scss'

// 生成唯一的键值

function generateUniqueId() {

  return Math.random().toString(36).substr(2, 9);

}

  

// 解析 HTML 字符串并转换为 React 元素数组

export function parseHTML(htmlString) {

  // 创建一个虚拟的 div 元素

  const wrapper = document.createElement('div');

  // 将 HTML 字符串赋值给该虚拟元素的 innerHTML 属性，这样可以解析其中的 HTML 内容

  wrapper.innerHTML = htmlString;

  

  // 将虚拟元素的子节点转换为 React 元素数组

  const elements = Array.from(wrapper.childNodes).map((node) => convertNodeToElement(node));

  

  return elements;

}

  

// 将 HTML 节点转换为 React 元素

function convertNodeToElement(node) {

  

  if (node.nodeType === Node.TEXT_NODE) {

    // 如果是空白文本节点，则直接返回空字符串

    if (node.textContent.trim() === '') {

      return '';

    }

    // 如果是非空白文本节点，则返回文本内容

    return node.textContent;

  }

  
  

  const tagName = node.tagName.toLowerCase();

  const props = {};

  

  // // 样式配置常量

  // const STYLE_CONFIG = {

  //   baseStyles: {

  //     maxWidth: '100%',

  //     fontFamily: 'inherit',

  //     marginBottom: '0'

  //   },

  //   tagSpecificStyles: {

  //     img: { borderRadius: '4px', objectFit: 'cover' },

  //     video: { width: '100%', aspectRatio: '16/9' },

  //     li: {

  //       paddingLeft: '1.5em', // 添加列表项缩进

  //       position: 'relative'  // 为可能的项目符号定位做准备

  //     }

  //   }

  // };

  

  // 样式配置常量

  const STYLE_CONFIG = {

    baseStyles: {

      maxWidth: '100%',

      fontFamily: 'inherit',

      marginBottom: '0',

      // lineHeight: 1.6,          // 增加行高提升可读性

      color: '#333'             // 基础文字颜色

    },

    tagSpecificStyles: {

      // 标题系列

      h1: { fontSize: '2.4rem', fontWeight: 600, borderBottom: '2px solid #eee', paddingBottom: '0.5em' },

      h2: { fontSize: '2rem', fontWeight: 550, borderBottom: '1px solid #eee', paddingBottom: '0.4em' },

      h3: { fontSize: '1.8rem', fontWeight: 500 },

      // 列表样式

      ul: {

        margin: '1em 0',

        paddingLeft: 0,

        position: 'relative'

      },

      ol: {

        margin: '1em 0',

        paddingLeft: '1em'

      },

      li: {

        marginLeft: '1.5em',

        position: 'relative',

        listStyle: 'auto',      // 清除默认样式

        marginBottom: '1em'

      },

      // 引用样式

      blockquote: {

        backgroundColor: '#f8f9fa',

        padding: '1em',

        margin: '1em 0',

        color: '#666',

        fontStyle: 'italic'

      },

      // 代码块

      pre: {

        backgroundColor: '#f5f5f5',

        padding: '1em',

        borderRadius: '4px',

        overflowX: 'auto'

      },

      code: {

        fontFamily: 'Menlo, Monaco, Consolas, "Courier New", monospace',

        fontSize: '0.9em'

      },

      // 表格样式

      table: {

        borderCollapse: 'collapse',

        width: '100%',

        margin: '1em 0'

      },

      th: {

        backgroundColor: '#f8f9fa',

        border: '1px solid #ddd',

        padding: '0.8em',

        fontWeight: 600

      },

      td: {

        border: '1px solid #ddd',

        padding: '0.6em'

      },

      tr: {

        backgroundColor:'#fff'

      }

    }

  };

  
  

  // 处理行内样式

  const inlineStyles = Array.from(node.style);

  const style = {};

  inlineStyles.forEach((property) => {

    style[property] = node.style.getPropertyValue(property);

  });

  

  // 合并样式逻辑（替换原有样式赋值）

  props.style = {

    ...STYLE_CONFIG.baseStyles,

    ...(STYLE_CONFIG.tagSpecificStyles[tagName] || {}),

    ...style

  };

  
  

  // 根据标签名和属性进行特定处理

  if (tagName === 'img') {

  

    // 如果是 img 标签，则创建 Ant Design 的 Image 组件

    return <Image style={style} rootClassName='md-image' src={node.getAttribute('src')} alt={node.getAttribute('alt')} />;

  }

  

  if (tagName === 'a') {

    // 如果是 a 标签，则设置 target 属性为 '_blank'

    props.target = '_blank';

  }

  

  if (tagName === 'ul' || tagName === 'ol') {

    // 如果是无序列表或有序列表，则生成唯一的 key

    props.key = generateUniqueId();

  }

  

  if (tagName === 'li') {

    // 如果是列表项，则生成唯一的 key

    props.key = generateUniqueId();

  }

  

  if (tagName === 'br') {

    // 如果是 br 标签，则直接返回 <br /> 元素

    return React.createElement(tagName, props);

  }

  // p标签设置margin0

  if (tagName === 'p') {

    // 如果是 p 标签，则设置 margin 属性为 0

  }

  

  if (tagName === 'video') {

    // 如果是 video 标签，则创建 <video> 元素

    const videoElement = document.createElement('video');

    videoElement.style = style.cssText;

    // 将视频标签的宽度设置为页面宽度的50%

    // videoElement.style.width = '50vw';

    videoElement.poster = true;

    videoElement.controls = true;

  

    // 设置 src 属性

    const sourceElements = Array.from(node.getElementsByTagName('source'));

    sourceElements.forEach((sourceElement) => {

      const src = sourceElement.getAttribute('src');

      // const type = sourceElement.getAttribute('type');

      const source = document.createElement('source');

      source.src = src;

      // source.type = type;

      videoElement.appendChild(source);

    });

  

    // 设置其他属性

    const attributes = Array.from(node.attributes);

    attributes.forEach((attribute) => {

      const { name, value } = attribute;

      if (name !== 'src' && name !== 'style') {

        videoElement.setAttribute(name, value);

      }

    });

  

    // 包装为React组件并返回

    return <VideoPlayer videoElement={videoElement} />;

  }

  

  // 递归处理子节点

  const children = Array.from(node.childNodes).map((childNode) => convertNodeToElement(childNode));

  

  // 创建 React 元素并返回

  return React.createElement(tagName, props, children);

}

  

class VideoPlayer extends React.Component {

  videoRef = React.createRef();

  

  componentDidMount() {

    this.videoRef.current.appendChild(this.props.videoElement);

  }

  

  render() {

    return <div ref={this.videoRef} />;

  }

}
```

```
.md-image {


  .ant-image-preview-mask,

  .ant-image-preview-wrap {

    z-index: 9999;

  }

}
```