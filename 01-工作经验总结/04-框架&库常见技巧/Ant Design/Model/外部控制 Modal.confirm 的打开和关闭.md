如果你想在外部控制 `Modal.confirm` 的打开和关闭，可以使用以下方法：

```jsx
import { Modal } from "antd";

let modalInstance;

const openModal = () => {
  modalInstance = Modal.confirm({
    title: "Do you Want to delete these items?",
    content: "Some descriptions",
    onOk() {
      console.log("OK");
    },
    onCancel() {
      console.log("Cancel");
    },
  });
};

const closeModal = () => {
  modalInstance.destroy();
};

// 打开 Modal
openModal();

// 关闭 Modal
closeModal();
```

在这个示例中，我们通过 `Modal.confirm` 打开一个 `Modal`，并将返回的实例赋值给 `modalInstance`。然后，我们可以通过调用 `modalInstance.destroy()` 来关闭 `Modal`。

希望这个解决方案对你有帮助！如果你还有其他问题，请随时提问。