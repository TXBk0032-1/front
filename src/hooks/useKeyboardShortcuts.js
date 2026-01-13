/**
 * useKeyboardShortcuts - 键盘快捷键 Hook
 * 
 * 统一管理所有键盘快捷键
 * 把快捷键逻辑从主组件中抽离出来，让代码更清晰
 * 
 * 支持的快捷键：
 * - Ctrl+Z: 撤销
 * - Ctrl+Y / Ctrl+Shift+Z: 重做
 * - Ctrl+C: 复制
 * - Ctrl+V: 粘贴
 * - Delete: 删除（React Flow 内置支持）
 */

import { useEffect } from "react";

/**
 * @param {Object} handlers - 快捷键对应的处理函数
 * @param {Function} handlers.undo - 撤销函数
 * @param {Function} handlers.redo - 重做函数
 * @param {Function} handlers.copy - 复制函数
 * @param {Function} handlers.paste - 粘贴函数
 */
const useKeyboardShortcuts = ({ undo, redo, copy, paste }) => {
  useEffect(() => {
    /**
     * 键盘事件处理器
     * 
     * 注意：Delete 键删除功能由 React Flow 内置支持
     * 只需要在 ReactFlow 组件上设置 deleteKeyCode="Delete" 即可
     */
    const handleKeyDown = (event) => {
      // 检查是否按下了 Ctrl 键（Mac 上是 Cmd 键）
      const isCtrlOrCmd = event.ctrlKey || event.metaKey;

      // Ctrl+Z: 撤销（但不是 Ctrl+Shift+Z）
      if (isCtrlOrCmd && event.key === "z" && !event.shiftKey) {
        event.preventDefault(); // 阻止浏览器默认的撤销行为
        undo();
        return;
      }

      // Ctrl+Y 或 Ctrl+Shift+Z: 重做
      if (isCtrlOrCmd && (event.key === "y" || (event.shiftKey && event.key === "z"))) {
        event.preventDefault();
        redo();
        return;
      }

      // Ctrl+C: 复制
      if (isCtrlOrCmd && event.key === "c") {
        event.preventDefault();
        copy();
        return;
      }

      // Ctrl+V: 粘贴
      if (isCtrlOrCmd && event.key === "v") {
        event.preventDefault();
        paste();
        return;
      }
    };

    // 注册全局键盘事件监听
    window.addEventListener("keydown", handleKeyDown);

    // 组件卸载时移除监听器（防止内存泄漏）
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [undo, redo, copy, paste]); // 依赖项：当这些函数变化时重新注册监听器
};

export default useKeyboardShortcuts;
