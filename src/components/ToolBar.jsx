/**
 * ToolBar.jsx - 工具栏组件
 * 
 * 包含：
 * - 撤销/重做按钮
 * - 缩放控制
 * - 整理布局按钮
 */

import { useReactFlow, useViewport } from '@xyflow/react';
import useStore from '@/store';
import { getLayoutedElements, DEFAULT_ELK_OPTIONS } from '@/utils/canvas/layout';

import undoIcon from '@/assets/ToolBar/undo.svg';
import redoIcon from '@/assets/ToolBar/redo.svg';
import zoomInIcon from '@/assets/ToolBar/zoom-in.svg';
import zoomOutIcon from '@/assets/ToolBar/zoom-out.svg';
import arrangeIcon from '@/assets/ToolBar/arrange.svg';

import '@/styles/ToolBar.css';

function ToolBar() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const viewport = useViewport();
  
  const { 
    nodes, 
    edges, 
    setNodes, 
    setEdges,
    past,
    future,
    undo, 
    redo 
  } = useStore();

  // 缩放百分比
  const zoomPercent = Math.round(viewport.zoom * 100);

  // 撤销
  const handleUndo = () => {
    undo();
  };

  // 重做
  const handleRedo = () => {
    redo();
  };

  // 放大
  const handleZoomIn = () => {
    zoomIn();
  };

  // 缩小
  const handleZoomOut = () => {
    zoomOut();
  };

  // 重置缩放
  const handleResetZoom = () => {
    fitView();
  };

  // 整理布局
  const handleArrange = async () => {
    const layouted = await getLayoutedElements(nodes, edges, DEFAULT_ELK_OPTIONS);
    if (layouted) {
      setNodes(layouted.nodes);
      setEdges(layouted.edges);
      setTimeout(() => fitView(), 50);
    }
  };

  return (
    <div className="toolbar">
      {/* 历史操作 */}
      <div className="toolbar-group">
        <button 
          className="toolbar-btn" 
          onClick={handleUndo}
          disabled={past.length === 0}
          title="撤销 (Ctrl+Z)"
        >
          <img src={undoIcon} alt="撤销" />
        </button>
        <button 
          className="toolbar-btn" 
          onClick={handleRedo}
          disabled={future.length === 0}
          title="重做 (Ctrl+Y)"
        >
          <img src={redoIcon} alt="重做" />
        </button>
      </div>

      <div className="toolbar-divider" />

      {/* 缩放控制 */}
      <div className="toolbar-group">
        <button 
          className="toolbar-btn" 
          onClick={handleZoomOut}
          title="缩小"
        >
          <img src={zoomOutIcon} alt="缩小" />
        </button>
        <span 
          className="zoom-display" 
          onClick={handleResetZoom}
          title="点击重置视图"
        >
          {zoomPercent}%
        </span>
        <button 
          className="toolbar-btn" 
          onClick={handleZoomIn}
          title="放大"
        >
          <img src={zoomInIcon} alt="放大" />
        </button>
      </div>

      <div className="toolbar-divider" />

      {/* 整理布局 */}
      <div className="toolbar-group">
        <button 
          className="toolbar-btn" 
          onClick={handleArrange}
          title="自动整理布局"
        >
          <img src={arrangeIcon} alt="整理" />
        </button>
      </div>
    </div>
  );
}

export default ToolBar;
