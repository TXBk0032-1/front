/**
 * NodeMenu.jsx - 节点右键菜单组件
 *
 * 包含：
 * - 复制粘贴
 * - 删除节点
 * - 重命名
 */


import { useStore } from '../store';
import { hideNodeMenu, updateNodeMenuPosition } from '../utils/blueprint/nodeMenu';

import copyPasteIcon from '../assets/ContextMenu/copy-paste.svg';
import deleteIcon from '../assets/ContextMenu/delete-node.svg';
import renameIcon from '../assets/ContextMenu/rename.svg';

import '../styles/NodeMenu.css';

// ========== 菜单项组件 ==========

const MenuItem = ({ icon, label }) => (
  <div className="context-menu-item" onClick={() => hideNodeMenu()}>
    <div className="icon-container">
      <img src={icon} alt={label} className="menu-icon" />
    </div>
    <span className="menu-label">{label}</span>
  </div>
);

// ========== 主组件 ==========

function NodeMenu() {
  const nodeMenu = useStore((state) => state.nodeMenu);

  if (!nodeMenu.visible) {
    return null;
  }
  updateNodeMenuPosition();
  return (
    <div
      className="context-menu"
      style={{
        left: nodeMenu.x,
        top: nodeMenu.y
      }}
    >
      <MenuItem icon={copyPasteIcon} label="复制粘贴" />
      <MenuItem icon={deleteIcon} label="删除节点" />
      <MenuItem icon={renameIcon} label="重命名" />
    </div>
  );
}

export default NodeMenu;
