/**
 * NodeMenu.jsx - 节点右键菜单组件
 *
 * 包含：
 * - 复制粘贴
 * - 删除节点
 * - 重命名
 */

import { useMemo, useEffect } from 'react';
import { useReactFlow, useViewport } from '@xyflow/react';
import useStore from '@/store';
import { calcPositionAboveNode } from '@/utils/canvas/position';
import { clampScale } from '@/utils/canvas/zoom';
import { createNode } from '@/utils/createNode';

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
  const { getNode, flowToScreenPosition } = useReactFlow();
  const viewport = useViewport();
  
  const {
    contextMenu,
    closeContextMenu,
    duplicateNodes,
    deleteNodes,
    openRenameModal,
    closePropertyPanel
  } = useStore();

  // 计算菜单位置
  const menuPosition = useMemo(() => {
    if (!contextMenu) return null;
    const nodeData = getNode(contextMenu.targetNodeId);
    if (!nodeData) return null;
    return calcPositionAboveNode(nodeData, flowToScreenPosition, viewport.zoom);
  }, [contextMenu, getNode, flowToScreenPosition, viewport]);

  // 点击外部关闭
  useEffect(() => {
    if (!contextMenu) return;

    const handleClickOutside = (event) => {
      const menuElement = document.querySelector('.context-menu');
      const isClickInside = menuElement && menuElement.contains(event.target);
      if (!isClickInside) closeContextMenu();
    };

    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('click', handleClickOutside, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [contextMenu, closeContextMenu]);

  // 不显示
  if (!contextMenu || !menuPosition) return null;

  const clampedScale = clampScale(menuPosition.scale);

  // 计算位置样式
  const positionStyle = menuPosition.position === 'above'
    ? {
        left: menuPosition.x,
        top: menuPosition.y,
        transform: `translate(-50%, -100%) scale(${clampedScale})`,
        transformOrigin: 'center bottom'
      }
    : {
        left: menuPosition.x,
        top: menuPosition.y,
        transform: `translateX(-50%) scale(${clampedScale})`,
        transformOrigin: 'center top'
      };

  // 复制粘贴
  const handleCopyPaste = () => {
    duplicateNodes(contextMenu.nodeIds, createNode);
    closeContextMenu();
    closePropertyPanel();
  };

  // 删除
  const handleDelete = () => {
    deleteNodes(contextMenu.nodeIds);
    closeContextMenu();
    closePropertyPanel();
  };

  // 重命名
  const handleRename = () => {
    openRenameModal(contextMenu.nodeIds);
    closeContextMenu();
    closePropertyPanel();
  };

  return (
    <div className="context-menu" style={positionStyle}>
      <MenuItem icon={copyPasteIcon} label="复制粘贴" onClick={handleCopyPaste} />
      <MenuItem icon={deleteIcon} label="删除节点" onClick={handleDelete} />
      <MenuItem icon={renameIcon} label="重命名" onClick={handleRename} />
    </div>
  );
}

export default NodeMenu;
