/**
 * ToolBar.jsx - 工具栏组件
 * 
 * 包含：
 * - 撤销/重做按钮
 * - 缩放控制
 * - 整理布局按钮
 */
import { useStore } from '../store';
import { zoomIn, zoomOut, resetViewport } from '../utils/blueprint/viewport';

import undoIcon from '../assets/ToolBar/undo.svg';
import redoIcon from '../assets/ToolBar/redo.svg';
import zoomInIcon from '../assets/ToolBar/zoom-in.svg';
import zoomOutIcon from '../assets/ToolBar/zoom-out.svg';
import arrangeIcon from '../assets/ToolBar/arrange.svg';
import '../styles/ToolBar.css';


// 提取按钮组件
const ToolBarButton = ({ icon, alt, title, onClick }) => (
  <button className="toolbar-btn" title={title} onClick={onClick}>
    <img src={icon} alt={alt} />
  </button>
);

function ToolBar() {
  const zoom = useStore((state) => state.viewport.zoom);

  return (
    <div className="toolbar">
      {/* 历史操作 */}
      <div className="toolbar-group">
        <ToolBarButton icon={undoIcon} alt="撤销" title="撤销 (Ctrl+Z)" />
        <ToolBarButton icon={redoIcon} alt="重做" title="重做 (Ctrl+Y)" />
      </div>



      {/* 缩放控制 */}
      <div className="toolbar-group">
        <ToolBarButton icon={zoomOutIcon} alt="缩小" title="缩小" onClick={() => zoomOut(0.8)} />
        <span className="zoom-display" title="点击重置视图" onClick={resetViewport}>
          {`${Math.round(zoom * 100)}%`}
        </span>
        <ToolBarButton icon={zoomInIcon} alt="放大" title="放大" onClick={() => zoomIn(1.2)} />
      </div>



      {/* 整理布局 */}
      <div className="toolbar-group">
        <ToolBarButton icon={arrangeIcon} alt="整理" title="自动整理布局" />
      </div>
    </div>
  );
}

export default ToolBar;
