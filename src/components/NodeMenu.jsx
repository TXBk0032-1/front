/**
 * NodeMenu.jsx - 节点右键菜单组件
 *
 * 包含：
 * - 复制粘贴
 * - 删除节点
 * - 重命名
 */


import copyPasteIcon from '@/assets/ContextMenu/copy-paste.svg';
import deleteIcon from '@/assets/ContextMenu/delete-node.svg';
import renameIcon from '@/assets/ContextMenu/rename.svg';

import '@/styles/NodeMenu.css';

// ========== 菜单项组件 ==========

const MenuItem = ({ icon, label, onClick }) => (
  <div className="context-menu-item" onClick={onClick}>
    <div className="icon-container">
      <img src={icon} alt={label} className="menu-icon" />
    </div>
    <span className="menu-label">{label}</span>
  </div>
);

// ========== 主组件 ==========

function NodeMenu() {

  return (
    <div className="context-menu">
      <MenuItem icon={copyPasteIcon} label="复制粘贴" />
      <MenuItem icon={deleteIcon} label="删除节点" />
      <MenuItem icon={renameIcon} label="重命名" />
    </div>
  );
}

export default NodeMenu;
