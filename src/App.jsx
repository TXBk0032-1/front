/**
 * App.jsx - 应用入口组件
 * 
 * 使用 Zustand 进行状态管理的重构版本
 * 
 * 布局结构：
 * - Header（顶部菜单栏）
 * - Sidebar（侧边栏/节点面板）
 * - Blueprint（蓝图画布）
 */

import { useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Blueprint from './components/Blueprint';
import useStore from './store';
import './styles/Global.css';

function App() {
  // 注册键盘快捷键
  const { undo, redo, copySelectedNodes, pasteNodes } = useStore();

  useEffect(() => {
    const handleKeyDown = (event) => {
      const isCtrl = event.ctrlKey || event.metaKey;
      const key = event.key.toLowerCase();

      // Ctrl+Z: 撤销
      if (isCtrl && key === 'z' && !event.shiftKey) {
        event.preventDefault();
        undo();
        return;
      }

      // Ctrl+Y 或 Ctrl+Shift+Z: 重做
      if (isCtrl && (key === 'y' || (event.shiftKey && key === 'z'))) {
        event.preventDefault();
        redo();
        return;
      }

      // Ctrl+C: 复制
      if (isCtrl && key === 'c') {
        event.preventDefault();
        copySelectedNodes();
        return;
      }

      // Ctrl+V: 粘贴
      if (isCtrl && key === 'v') {
        event.preventDefault();
        // 粘贴需要在 Blueprint 组件中处理，因为需要 screenToFlowPosition
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, copySelectedNodes, pasteNodes]);

  return (
    <div className="app-container">
      <Header />
      <div className="workspace">
        <Sidebar />
        <div className="flex-1 h-full">
          <ReactFlowProvider>
            <Blueprint />
          </ReactFlowProvider>
        </div>
      </div>
    </div>
  );
}

export default App;
