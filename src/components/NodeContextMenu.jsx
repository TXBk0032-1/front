/**
 * NodeContextMenu - 节点右键菜单组件
 * 
 * 当用户右键点击节点时显示的菜单
 * 包含三个选项：
 * - 复制并粘贴：复制节点并立即粘贴到鼠标位置
 * - 删除节点：删除当前节点
 * - 重命名：打开重命名弹窗
 * 
 * 注意：菜单的关闭逻辑由父组件（App.jsx）通过 document 事件监听处理
 */

import "./NodeContextMenu.css";

// 导入图标
import copyPasteIcon from "../assets/ContextMenu/copy-paste.svg";
import deleteIcon from "../assets/ContextMenu/delete-node.svg";
import renameIcon from "../assets/ContextMenu/rename.svg";

/**
 * 菜单项组件
 * 每个菜单项包含图标和文字
 */
const MenuItem = ({ icon, label, onClick }) => (
  <div className="menu-item" onClick={onClick}>
    <img src={icon} alt={label} className="menu-icon" />
    <span className="menu-label">{label}</span>
  </div>
);

/**
 * NodeContextMenu - 右键菜单主组件
 * 
 * @param {Object} props
 * @param {number} props.x - 菜单显示的 X 坐标
 * @param {number} props.y - 菜单显示的 Y 坐标
 * @param {Function} props.onCopyPaste - 复制并粘贴的回调
 * @param {Function} props.onDelete - 删除节点的回调
 * @param {Function} props.onRename - 重命名的回调
 * @param {Function} props.onClose - 关闭菜单的回调
 */
const NodeContextMenu = ({ x, y, onCopyPaste, onDelete, onRename, onClose }) => {
  // 处理菜单项点击：执行操作后关闭菜单
  const handleClick = (action) => {
    action();
    onClose();
  };

  return (
    <div className="context-menu" style={{ left: x, top: y }}>
      <MenuItem
        icon={copyPasteIcon}
        label="复制并粘贴"
        onClick={() => handleClick(onCopyPaste)}
      />
      <MenuItem
        icon={deleteIcon}
        label="删除节点"
        onClick={() => handleClick(onDelete)}
      />
      <MenuItem
        icon={renameIcon}
        label="重命名"
        onClick={() => handleClick(onRename)}
      />
    </div>
  );
};

export default NodeContextMenu;
