/**
 * useContextMenu.js - 右键菜单控制
 * 
 * 管理节点右键菜单的显示和隐藏
 * 支持多选：如果右键点击的节点在选中列表里，就操作所有选中的节点
 * 支持动态跟随：菜单会跟随节点移动和画布缩放
 */

import { useState, useCallback, useEffect, useMemo } from "react";               // React hooks
import { useReactFlow, useViewport } from "@xyflow/react";                       // React Flow hooks
import { calcPositionAboveNode } from "../utils/positionUtils";                  // 位置计算工具


const useContextMenu = (nodes) => {
  
  const [contextMenu, setContextMenu] = useState(null);                          // 菜单状态：null=关闭，否则={targetNodeId, nodeIds}
  const { getNode, flowToScreenPosition } = useReactFlow();                      // React Flow 工具函数
  const viewport = useViewport();                                                // 视口状态（包含缩放比例）


  // ========== 计算菜单位置 ==========

  const menuPosition = useMemo(() => {
    if (!contextMenu) return null;                                               // 第1步：菜单没打开，返回null
    const nodeData = getNode(contextMenu.targetNodeId);                          // 第2步：获取目标节点数据
    if (!nodeData) return null;                                                  // 第3步：节点不存在，返回null
    return calcPositionAboveNode(nodeData, flowToScreenPosition, viewport.zoom); // 第4步：计算位置（显示在节点上方）
  }, [contextMenu, getNode, flowToScreenPosition, viewport]);


  // ========== 打开菜单 ==========

  const openContextMenu = useCallback((event, node) => {
    event.preventDefault();                                                      // 第1步：阻止浏览器默认右键菜单
    const targetNodeIds = getTargetNodeIds(nodes, node);                         // 第2步：获取要操作的节点ID列表
    setContextMenu({                                                             // 第3步：设置菜单状态
      targetNodeId: node.id,                                                     // 目标节点ID（用于计算位置）
      nodeIds: targetNodeIds,                                                    // 要操作的节点ID列表
    });
  }, [nodes]);


  // ========== 关闭菜单 ==========

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);                                                        // 清空菜单状态
  }, []);


  // ========== 画布事件处理 ==========

  const handlePaneContextMenu = useCallback((event) => {                         // 画布空白处右键
    event.preventDefault();                                                      // 阻止默认菜单
    closeContextMenu();                                                          // 关闭菜单
  }, [closeContextMenu]);

  const handlePaneClick = useCallback(() => {                                    // 画布空白处左键点击
    closeContextMenu();                                                          // 关闭菜单
  }, [closeContextMenu]);

  const handleNodeClick = useCallback(() => {                                    // 节点左键点击
    closeContextMenu();                                                          // 关闭菜单
  }, [closeContextMenu]);


  // ========== 点击外部关闭 ==========

  useEffect(() => {
    if (!contextMenu) return;                                                    // 菜单没打开就不监听
    
    const handleClickOutside = (event) => {                                      // 点击事件处理
      const menuElement = document.querySelector(".context-menu");               // 获取菜单DOM元素
      const isClickInside = menuElement && menuElement.contains(event.target);   // 判断是否点击在菜单内部
      if (!isClickInside) closeContextMenu();                                    // 点击外部则关闭菜单
    };
    
    document.addEventListener("mousedown", handleClickOutside, true);            // 监听鼠标按下（捕获阶段）
    document.addEventListener("click", handleClickOutside, true);                // 监听点击（捕获阶段）
    
    return () => {                                                               // 清理函数
      document.removeEventListener("mousedown", handleClickOutside, true);       // 移除监听
      document.removeEventListener("click", handleClickOutside, true);           // 移除监听
    };
  }, [contextMenu, closeContextMenu]);


  // ========== 返回 ==========

  return {
    contextMenu,                                                                 // 菜单状态
    menuPosition,                                                                // 菜单位置
    openContextMenu,                                                             // 打开菜单
    closeContextMenu,                                                            // 关闭菜单
    handlePaneContextMenu,                                                       // 画布右键处理
    handlePaneClick,                                                             // 画布点击处理
    handleNodeClick,                                                             // 节点点击处理
  };
};


// ========== 辅助函数 ==========

/** 获取要操作的节点ID列表（智能判断单选/多选） */
function getTargetNodeIds(nodes, clickedNode) {
  const selectedNodes = nodes.filter((n) => n.selected);                         // 获取所有选中的节点
  const isClickedNodeSelected = selectedNodes.some((n) => n.id === clickedNode.id);  // 点击的节点是否在选中列表里
  
  if (isClickedNodeSelected && selectedNodes.length > 0) {                       // 如果点击的节点在选中列表里
    return selectedNodes.map((n) => n.id);                                       // 返回所有选中的节点ID
  } else {                                                                       // 否则
    return [clickedNode.id];                                                     // 只返回点击的这一个节点ID
  }
}


export default useContextMenu;
