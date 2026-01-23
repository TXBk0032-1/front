import { useStore } from '../store';
import { hideNodeMenu } from '../utils/blueprint/nodeMenu';
import { showRenameModal } from '../utils/blueprint/renameModal';
import { calcPositionAroundNode } from '../utils/data/position';

// 使用react flow的转换函数 flowToScreenPosition 来计算位置
import { useReactFlow } from '@xyflow/react';

import copyPasteIcon from '../assets/ContextMenu/copy-paste.svg';
import deleteIcon from '../assets/ContextMenu/delete-node.svg';
import renameIcon from '../assets/ContextMenu/rename.svg';

import '../styles/NodeMenu.css';

// ========== 菜单项组件 ==========
const MenuItem = ({ icon, label, onClick }) => (
  <div className="node-menu-item" onClick={onClick || (() => hideNodeMenu())}>
    <div className="icon-container">
      <img src={icon} alt={label} className="menu-icon" />
    </div>
    <span className="menu-label">{label}</span>
  </div>
);

// ========== 主组件 ==========

function NodeMenu() {
  const { visible, nodeId } = useStore((s) => s.nodeMenu);
  const nodes = useStore((s) => s.nodes);
  const viewport = useStore((s) => s.viewport);
  const { flowToScreenPosition } = useReactFlow();
  if (!visible || !nodeId) return null;

  const targetNode = nodes.find(n => n.id === nodeId);

  if (!targetNode) return null;

  const menuPosition = calcPositionAroundNode(targetNode, flowToScreenPosition, viewport.zoom, 'above');
  // 根据viewport来进行菜单的缩放
  const scale = viewport.zoom;
  const positionStyle = calcPositionStyle(menuPosition.x, menuPosition.y, scale);


  return (
    <div
      id='node-menu'
      className="node-menu"
      style={positionStyle}
    >
      <MenuItem icon={copyPasteIcon} label="复制粘贴" />
      <MenuItem icon={deleteIcon} label="删除节点" />
      <MenuItem 
        icon={renameIcon} 
        label="重命名" 
        onClick={() => {
          hideNodeMenu(); // 隐藏节点菜单
          showRenameModal(); // 显示重命名弹窗
        }}
      />
    </div>
  );
}
function calcPositionStyle(x, y, scale) {
  return {
    left: x,
    top: y,
    transform: `translate(-50%, -100%) scale(${scale})`,                       // 水平居中 + 向上偏移 + 缩放
    transformOrigin: 'center bottom',                                          // 缩放原点在底部中心
  };
}
export default NodeMenu;
