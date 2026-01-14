/**
 * NodeContextMenu - 节点右键菜单
 *
 * 右键点击节点时显示的菜单
 * 统一显示三个选项：复制并粘贴、删除、重命名
 */

import "./NodeContextMenu.css";                                                  // 样式

import copyPasteIcon from "../assets/ContextMenu/copy-paste.svg";                // 复制粘贴图标
import deleteIcon from "../assets/ContextMenu/delete-node.svg";                  // 删除图标
import renameIcon from "../assets/ContextMenu/rename.svg";                       // 重命名图标


// ==================== 菜单项组件 ====================

/**
 * MenuItem - 单个菜单项
 */
const MenuItem = ({ icon, label, onClick }) => (
  <div className="menu-item" onClick={onClick}>
    <img src={icon} alt={label} className="menu-icon" />                         {/* 图标 */}
    <span className="menu-label">{label}</span>                                  {/* 文字 */}
  </div>
);


// ==================== 主组件 ====================

/**
 * NodeContextMenu - 右键菜单主体
 */
const NodeContextMenu = ({ x, y, onCopyPaste, onDelete, onRename, onClose }) => {
  
  /**
   * 处理菜单项点击
   * 执行操作后关闭菜单
   */
  const handleClick = (action) => {
    action();                                                                    // 执行操作
    onClose();                                                                   // 关闭菜单
  };

  return (
    <div className="context-menu" style={{ left: x, top: y }}>                   {/* 菜单容器 */}
      <MenuItem icon={copyPasteIcon} label="复制并粘贴" onClick={() => handleClick(onCopyPaste)} />
      <MenuItem icon={deleteIcon} label="删除节点" onClick={() => handleClick(onDelete)} />
      <MenuItem icon={renameIcon} label="重命名" onClick={() => handleClick(onRename)} />
    </div>
  );
};

export default NodeContextMenu;
