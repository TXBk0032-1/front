/**
 * useKeyboardShortcuts.js - 键盘快捷键
 * 
 * 统一管理所有键盘快捷键：
 * - Ctrl+Z: 撤销
 * - Ctrl+Y / Ctrl+Shift+Z: 重做
 * - Ctrl+C: 复制
 * - Ctrl+V: 粘贴
 * - Delete: 删除（React Flow 内置支持）
 */

import { useEffect } from "react";                                               // React hooks


const useKeyboardShortcuts = ({ undo, redo, copy, paste }) => {
  
  useEffect(() => {
    
    const handleKeyDown = (event) => {
      const isCtrl = event.ctrlKey || event.metaKey;                             // 是否按下 Ctrl（Mac 上是 Cmd）
      const key = event.key.toLowerCase();                                       // 按下的键（转小写）
      
      if (isCtrl && key === "z" && !event.shiftKey) {                            // Ctrl+Z: 撤销
        event.preventDefault();                                                  // 阻止浏览器默认撤销
        undo();                                                                  // 执行撤销
        return;
      }
      
      if (isCtrl && (key === "y" || (event.shiftKey && key === "z"))) {          // Ctrl+Y 或 Ctrl+Shift+Z: 重做
        event.preventDefault();                                                  // 阻止默认行为
        redo();                                                                  // 执行重做
        return;
      }
      
      if (isCtrl && key === "c") {                                               // Ctrl+C: 复制
        event.preventDefault();                                                  // 阻止默认复制
        copy();                                                                  // 执行复制
        return;
      }
      
      if (isCtrl && key === "v") {                                               // Ctrl+V: 粘贴
        event.preventDefault();                                                  // 阻止默认粘贴
        paste();                                                                 // 执行粘贴
        return;
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);                           // 注册全局键盘监听
    return () => window.removeEventListener("keydown", handleKeyDown);           // 清理：移除监听
    
  }, [undo, redo, copy, paste]);
};


export default useKeyboardShortcuts;
