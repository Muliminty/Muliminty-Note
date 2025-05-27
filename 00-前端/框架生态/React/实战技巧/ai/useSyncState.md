import React from 'react';
// 导出一个默认的函数 useSyncState，该函数用于同步状态管理
export default function useSyncState(defaultValue) {
  // 使用 React 的 useState 钩子创建一个强制更新的函数 forceUpdate
  // 初始状态为 0，forceUpdate 函数用于强制组件重新渲染
  const [, forceUpdate] = React.useState(0);
  // 使用 React 的 useRef 钩子创建一个可变的引用 stateRef
  // 如果 defaultValue 是一个函数，则调用该函数获取初始值，否则直接使用 defaultValue 作为初始值
  const stateRef = React.useRef(typeof defaultValue === 'function' ? defaultValue() : defaultValue);
  // 使用 React 的 useCallback 钩子创建一个稳定的 setState 函数
  // setState 函数用于更新状态，接受一个 action 参数，可以是函数或新的状态值
  const setState = React.useCallback(action => {
    // 如果 action 是一个函数，则调用该函数并传入当前状态值，返回新的状态值
    // 否则直接将 action 作为新的状态值
    stateRef.current = typeof action === 'function' ? action(stateRef.current) : action;
    // 调用 forceUpdate 函数，强制组件重新渲染
    forceUpdate(prev => prev + 1);
  }, []); // 空依赖数组表示 setState 函数在组件生命周期内不会改变
  // 使用 React 的 useCallback 钩子创建一个稳定的 getState 函数
  // getState 函数用于获取当前状态值
  const getState = React.useCallback(() => stateRef.current, []);
  // 返回当前状态值、setState 函数和 getState 函数
  return [stateRef.current, setState, getState];
}