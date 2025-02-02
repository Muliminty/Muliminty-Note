>源码路径
>react-main\packages\react\src\jsx\ReactJSXElement.js


### `React.createElement` 函数源码解读

`React.createElement` 是 React 中创建虚拟 DOM 元素的核心函数。它接收三个主要参数：
- **`type`**：组件类型，可以是字符串（表示内建的 HTML 标签）或函数/类（表示自定义组件）。
- **`config`**：包含属性和配置的对象。
- **`children`**：子元素，可以是多个或者单个元素。

下面是对其实现逻辑的详细解读：

---

### 1. **类型检查和警告（开发模式）**

在开发模式下，React 会对传入的 `type` 进行验证：

- **`isValidElementType(type)`**：用于判断 `type` 是否是有效的 React 元素类型。有效的 `type` 可以是：
  - **字符串类型**：表示内建的 HTML 元素，如 `'div'`、`'span'`。
  - **函数/类类型**：表示自定义的 React 组件。
- **错误警告**：
  - 如果 `type` 无效，React 会输出详细的错误信息，帮助开发者找到问题所在。例如：
    - 如果 `type` 是 `undefined` 或空对象，可能是忘记导出组件或导出错误。
    - 如果 `type` 是 `ReactElement`，可能是直接导出了 JSX 元素而非组件。

**开发模式中的检查逻辑：**
```js
if (__DEV__) {
  if (!isValidElementType(type)) {
    // 输出错误信息，帮助开发者定位问题
  }
}
```

---

### 2. **属性处理**

`config` 中的属性会被处理和验证，最终会分为两类：
- **保留字段**：
  - **`key`**：用于标识 React 元素的唯一性，帮助 React 高效更新 DOM。
  - **`__self` 和 `__source`**：仅在开发模式下使用，用于调试，标记元素的创建来源。
- **普通属性**：除去 `key`、`__self` 和 `__source` 后的属性，会被添加到 `props` 对象中。

**关键属性处理逻辑：**
```js
if (config != null) {
  if (hasValidKey(config)) {
    key = '' + config.key;  // 如果有 key，将其转为字符串
  }
  for (propName in config) {
    if (hasOwnProperty.call(config, propName) && propName !== 'key') {
      props[propName] = config[propName];  // 将剩余属性添加到 props 中
    }
  }
}
```

---

### 3. **子元素处理（Children）**

`children` 可以是一个或多个元素，如果是多个元素，它们将被收集到一个数组中。`props.children` 会存储这些子元素。

- **单个子元素**：直接赋值给 `props.children`。
- **多个子元素**：将所有子元素放入一个数组中，并赋值给 `props.children`。

**子元素处理逻辑：**
```js
const childrenLength = arguments.length - 2;
if (childrenLength === 1) {
  props.children = children;
} else if (childrenLength > 1) {
  const childArray = Array(childrenLength);
  for (let i = 0; i < childrenLength; i++) {
    childArray[i] = arguments[i + 2];
  }
  props.children = childArray;  // 子元素数组化
}
```

---

### 4. **默认属性处理（`defaultProps`）**

如果组件定义了 `defaultProps`，React 会将其与实际传入的 `props` 合并。只有当 `props` 中没有对应属性时，才会使用 `defaultProps`。

**默认属性处理逻辑：**
```js
if (type && type.defaultProps) {
  const defaultProps = type.defaultProps;
  for (propName in defaultProps) {
    if (props[propName] === undefined) {
      props[propName] = defaultProps[propName];  // 使用默认属性
    }
  }
}
```

---

### 5. **返回 `ReactElement`**

最终，`createElement` 返回一个 `ReactElement`。它是 React 用来描述组件的虚拟 DOM 对象。`ReactElement` 包含以下信息：
- **`type`**：组件类型（字符串或函数/类组件）。
- **`key`**：组件的唯一标识。
- **`props`**：组件的属性，包含传递的属性和合并后的默认属性。
- **开发环境调试信息**：包含 `__self`、`__source` 等调试信息。

**返回 `ReactElement` 的代码：**
```js
return ReactElement(
  type, 
  key, 
  undefined, 
  undefined, 
  getOwner(), 
  props, 
  __DEV__ && enableOwnerStacks ? Error('react-stack-top-frame') : undefined,
  __DEV__ && enableOwnerStacks ? createTask(getTaskName(type)) : undefined
);
```

---

### 6. **开发环境中的额外检查**

- **`defineKeyPropWarningGetter`**：如果组件有 `key` 属性，React 会为其定义一个警告 getter，确保 `key` 的使用符合 React 的要求。
- **`getOwner` 和 `createTask`**：React 追踪创建该元素的组件（`owner`），并为其关联一个任务，主要用于调试和堆栈追踪。

**调试信息处理逻辑：**
```js
if (__DEV__) {
  if (key) {
    const displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;
    defineKeyPropWarningGetter(props, displayName);
  }
}
```

---

### 总结

`React.createElement` 是 React 渲染的核心函数，它的主要职责是：
- **类型验证**：确保传入的 `type` 是有效的 React 元素类型。
- **属性和子元素处理**：包括 `key`、`children` 和合并默认属性。
- **返回虚拟 DOM（`ReactElement`）**：创建并返回一个标准化的 React 元素对象，用于 React 的渲染和更新。
- **开发模式检查**：在开发模式下，提供更多的错误检查和调试功能。


完整源码
```js
/**
 * Create and return a new ReactElement of the given type.
 * See https://reactjs.org/docs/react-api.html#createelement
 */
export function createElement(type, config, children) {
  if (__DEV__) {
    if (!enableOwnerStacks && !isValidElementType(type)) {
      // This is just an optimistic check that provides a better stack trace before
      // owner stacks. It's really up to the renderer if it's a valid element type.
      // When owner stacks are enabled, we instead warn in the renderer and it'll
      // have the stack trace of the JSX element anyway.
      //
      // This is an invalid element type.
      //
      // We warn in this case but don't throw. We expect the element creation to
      // succeed and there will likely be errors in render.
      let info = '';
      if (
        type === undefined ||
        (typeof type === 'object' &&
          type !== null &&
          Object.keys(type).length === 0)
      ) {
        info +=
          ' You likely forgot to export your component from the file ' +
          "it's defined in, or you might have mixed up default and named imports.";
      }

      let typeString;
      if (type === null) {
        typeString = 'null';
      } else if (isArray(type)) {
        typeString = 'array';
      } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
        typeString = `<${getComponentNameFromType(type.type) || 'Unknown'} />`;
        info =
          ' Did you accidentally export a JSX literal instead of a component?';
      } else {
        typeString = typeof type;
      }

      console.error(
        'React.createElement: type is invalid -- expected a string (for ' +
          'built-in components) or a class/function (for composite ' +
          'components) but got: %s.%s',
        typeString,
        info,
      );
    } else {
      // This is a valid element type.

      // Skip key warning if the type isn't valid since our key validation logic
      // doesn't expect a non-string/function type and can throw confusing
      // errors. We don't want exception behavior to differ between dev and
      // prod. (Rendering will throw with a helpful message and as soon as the
      // type is fixed, the key warnings will appear.)
      for (let i = 2; i < arguments.length; i++) {
        validateChildKeys(arguments[i], type);
      }
    }

    // Unlike the jsx() runtime, createElement() doesn't warn about key spread.
  }

  let propName;

  // Reserved names are extracted
  const props = {};

  let key = null;

  if (config != null) {
    if (__DEV__) {
      if (
        !didWarnAboutOldJSXRuntime &&
        '__self' in config &&
        // Do not assume this is the result of an oudated JSX transform if key
        // is present, because the modern JSX transform sometimes outputs
        // createElement to preserve precedence between a static key and a
        // spread key. To avoid false positive warnings, we never warn if
        // there's a key.
        !('key' in config)
      ) {
        didWarnAboutOldJSXRuntime = true;
        console.warn(
          'Your app (or one of its dependencies) is using an outdated JSX ' +
            'transform. Update to the modern JSX transform for ' +
            'faster performance: https://react.dev/link/new-jsx-transform',
        );
      }
    }

    if (hasValidKey(config)) {
      if (__DEV__) {
        checkKeyStringCoercion(config.key);
      }
      key = '' + config.key;
    }

    // Remaining properties are added to a new props object
    for (propName in config) {
      if (
        hasOwnProperty.call(config, propName) &&
        // Skip over reserved prop names
        propName !== 'key' &&
        // Even though we don't use these anymore in the runtime, we don't want
        // them to appear as props, so in createElement we filter them out.
        // We don't have to do this in the jsx() runtime because the jsx()
        // transform never passed these as props; it used separate arguments.
        propName !== '__self' &&
        propName !== '__source'
      ) {
        props[propName] = config[propName];
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  const childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    const childArray = Array(childrenLength);
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    if (__DEV__) {
      if (Object.freeze) {
        Object.freeze(childArray);
      }
    }
    props.children = childArray;
  }

  // Resolve default props
  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }
  if (__DEV__) {
    if (key) {
      const displayName =
        typeof type === 'function'
          ? type.displayName || type.name || 'Unknown'
          : type;
      defineKeyPropWarningGetter(props, displayName);
    }
  }

  return ReactElement(
    type,
    key,
    undefined,
    undefined,
    getOwner(),
    props,
    __DEV__ && enableOwnerStacks ? Error('react-stack-top-frame') : undefined,
    __DEV__ && enableOwnerStacks ? createTask(getTaskName(type)) : undefined,
  );
}
```