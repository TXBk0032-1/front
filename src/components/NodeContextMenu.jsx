/**
 * NodeContextMenu - 节点右键菜单组件
 * 
 * 当用户右键点击节点时显示的菜单
 * 支持单选和多选两种模式：
 * 
 * 单选模式（选中1个节点）：
 * - 复制并粘贴：复制节点并立即粘贴
 * - 删除节点：删除当前节点
 * - 重命名：打开重命名弹窗
 * 
 * 多选模式（选中多个节点）：
 * - 复制并粘贴：批量复制所有选中的节点
 * - 删除节点：批量删除所有选中的节点
 * - 重命名：隐藏（因为不能同时重命名多个节点）
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
 * @param {number} props.nodeCount - 选中的节点数量（用于显示批量操作提示）
 * @param {Function} props.onCopyPaste - 复制并粘贴的回调
 * @param {Function} props.onDelete - 删除节点的回调
 * @param {Function} props.onRename - 重命名的回调
 * @param {Function} props.onClose - 关闭菜单的回调
 */
const NodeContextMenu = ({ x, y, nodeCount = 1, onCopyPaste, onDelete, onRename, onClose }) => {
  // 处理菜单项点击：执行操作后关闭菜单
  const handleClick = (action) => {
    action();
    onClose();
  };

  // 是否是多选模式
  const isMultiple = nodeCount > 1;

  // 根据选中数量生成标签文字
  const copyLabel = isMultiple ? `复制并粘贴 (${nodeCount}个)` : "复制并粘贴";
  const deleteLabel = isMultiple ? `删除节点 (${nodeCount}个)` : "删除节点";

  return (
    <div className="context-menu" style={{ left: x, top: y }}>
      <MenuItem
        icon={copyPasteIcon}
        label={copyLabel}
        onClick={() => handleClick(onCopyPaste)}
      />
      <MenuItem
        icon={deleteIcon}
        label={deleteLabel}
        onClick={() => handleClick(onDelete)}
      />
      {/* 多选时不显示重命名选项 */}
      {!isMultiple && (
        <MenuItem
          icon={renameIcon}
          label="重命名"
          onClick={() => handleClick(onRename)}
        />
      )}
    </div>
  );
};

export default NodeContextMenu;
