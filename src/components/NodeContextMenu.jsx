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
 * 使用新的卡片式布局：图标在上，文字在下
 */
const MenuItem = ({ icon, label, onClick }) => (
  <div className="context-menu-item" onClick={onClick}>
    <div className="icon-container">                                             {/* 图标容器 */}
      <img src={icon} alt={label} className="menu-icon" />                       {/* 图标 */}
    </div>
    <span className="menu-label">{label}</span>                                  {/* 文字 */}
  </div>
);


// ==================== 主组件 ====================

/**
 * NodeContextMenu - 右键菜单主体
 *
 * @param {number} x - 菜单X坐标
 * @param {number} y - 菜单Y坐标
 * @param {string} position - 菜单位置：'below' 显示在节点下方，'above' 显示在节点上方
 * @param {number} scale - 缩放比例，菜单会随画布缩放
 * @param {function} onCopyPaste - 复制并粘贴回调
 * @param {function} onDelete - 删除回调
 * @param {function} onRename - 重命名回调
 * @param {function} onClose - 关闭菜单回调
 */
const NodeContextMenu = ({ x, y, position = 'below', scale = 1, onCopyPaste, onDelete, onRename, onClose }) => {
  
  /**
   * 处理菜单项点击
   * 执行操作后关闭菜单
   */
  const handleClick = (action) => {
    action();                                                                    // 执行操作
    onClose();                                                                   // 关闭菜单
  };

  // 限制缩放范围，避免菜单太大或太小
  const clampedScale = Math.max(0.5, Math.min(1.5, scale));

  // 根据位置计算样式
  // 使用 transform 实现精确居中和缩放
  // x 是节点中心的屏幕坐标，使用 translateX(-50%) 让菜单水平居中
  // 如果是 'above'，菜单显示在节点上方，使用 translateY(-100%) 让菜单在 y 坐标上方
  // 如果是 'below'，菜单显示在节点下方，直接使用 top: y
  const positionStyle = position === 'above'
    ? {
        left: x,
        top: y,
        transform: `translate(-50%, -100%) scale(${clampedScale})`,              // 水平居中 + 向上偏移 + 缩放
        transformOrigin: 'center bottom',                                        // 缩放原点在底部中心
      }
    : {
        left: x,
        top: y,
        transform: `translateX(-50%) scale(${clampedScale})`,                    // 水平居中 + 缩放
        transformOrigin: 'center top',                                           // 缩放原点在顶部中心
      };

  return (
    <div className="context-menu" style={positionStyle}>                         {/* 菜单容器 */}
      <MenuItem icon={copyPasteIcon} label="复制粘贴" onClick={() => handleClick(onCopyPaste)} />
      <MenuItem icon={deleteIcon} label="删除节点" onClick={() => handleClick(onDelete)} />
      <MenuItem icon={renameIcon} label="重命名" onClick={() => handleClick(onRename)} />
    </div>
  );
};

export default NodeContextMenu;
