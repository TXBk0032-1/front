/**
 * useContextMenu - 右键菜单控制
 * 
 * 管理节点右键菜单的显示和隐藏
 * 支持多选：如果右键点击的节点在选中列表里，就操作所有选中的节点
 * 支持动态位置：根据节点在屏幕上的位置决定菜单显示在上方还是下方
 */

import { useState, useCallback, useEffect } from "react";                        // React hooks
import { useReactFlow } from "@xyflow/react";                                    // React Flow hooks


const useContextMenu = (nodes) => {
  
  // 菜单状态：null 表示关闭，否则包含 { x, y, nodeIds, position }
  const [contextMenu, setContextMenu] = useState(null);
  
  // 获取 React Flow 实例，用于坐标转换
  const { getNode, flowToScreenPosition } = useReactFlow();

  // ==================== 打开菜单 ====================

  /**
   * 打开右键菜单
   * 智能判断：如果点击的节点已被选中，就操作所有选中的节点
   * 动态位置：根据节点在屏幕上的位置决定菜单显示在上方还是下方
   */
  const openContextMenu = useCallback((event, node) => {
    event.preventDefault();                                                      // 阻止浏览器默认右键菜单
    
    const selectedNodes = nodes.filter((n) => n.selected);                       // 获取所有选中的节点
    const isClickedNodeSelected = selectedNodes.some((n) => n.id === node.id);   // 判断点击的节点是否在选中列表里
    
    let targetNodeIds;                                                           // 要操作的节点ID列表
    if (isClickedNodeSelected && selectedNodes.length > 0) {                     // 如果点击的节点在选中列表里
      targetNodeIds = selectedNodes.map((n) => n.id);                            // 操作所有选中的节点
    } else {                                                                     // 否则
      targetNodeIds = [node.id];                                                 // 只操作点击的这一个节点
    }
    
    // 获取节点信息
    const nodeData = getNode(node.id);
    if (!nodeData) return;
    
    // 获取节点的高度（使用 measured 或默认值）
    const nodeHeight = nodeData.measured?.height || 100;
    
    // 注意：nodeOrigin 是 [0.5, 0.5]，所以 nodeData.position 是节点中心的坐标
    // 将节点的 flow 坐标转换为屏幕坐标
    // 计算节点中心点的屏幕位置（position 已经是中心）
    const nodeCenterScreen = flowToScreenPosition({
      x: nodeData.position.x,
      y: nodeData.position.y,
    });
    
    // 计算节点顶部和底部的屏幕位置
    // 由于 position 是中心，顶部 = 中心 - 高度/2，底部 = 中心 + 高度/2
    const nodeTopScreen = flowToScreenPosition({
      x: nodeData.position.x,
      y: nodeData.position.y - nodeHeight / 2,
    });
    const nodeBottomScreen = flowToScreenPosition({
      x: nodeData.position.x,
      y: nodeData.position.y + nodeHeight / 2,
    });
    
    // 判断节点在屏幕的上半部分还是下半部分
    const screenHeight = window.innerHeight;
    const isNodeInUpperHalf = nodeCenterScreen.y < screenHeight / 2;
    
    // 菜单与节点的间距
    const menuGap = 10;
    
    let menuX, menuY, position;
    
    // 菜单 X 坐标：节点中心的屏幕 X 坐标（CSS transform 会处理居中）
    menuX = nodeCenterScreen.x;
    
    if (isNodeInUpperHalf) {
      // 节点在上半部分，菜单显示在节点正下方
      menuY = nodeBottomScreen.y + menuGap;
      position = 'below';
    } else {
      // 节点在下半部分，菜单显示在节点正上方
      menuY = nodeTopScreen.y - menuGap;
      position = 'above';
    }
    
    setContextMenu({                                                             // 设置菜单状态
      x: menuX,                                                                  // 菜单X坐标（节点中心）
      y: menuY,                                                                  // 菜单Y坐标
      nodeIds: targetNodeIds,                                                    // 目标节点ID列表
      position: position,                                                        // 菜单位置：'above' 或 'below'
    });
  }, [nodes, getNode, flowToScreenPosition]);

  // ==================== 关闭菜单 ====================

  /**
   * 关闭右键菜单
   */
  const closeContextMenu = useCallback(() => {
    setContextMenu(null);                                                        // 清空菜单状态
  }, []);

  // ==================== 画布事件处理 ====================

  /**
   * 画布空白处右键
   * 关闭菜单，同时阻止浏览器默认菜单
   */
  const handlePaneContextMenu = useCallback((event) => {
    event.preventDefault();                                                      // 阻止默认菜单
    closeContextMenu();                                                          // 关闭菜单
  }, [closeContextMenu]);

  /**
   * 画布空白处左键点击
   */
  const handlePaneClick = useCallback(() => {
    closeContextMenu();                                                          // 关闭菜单
  }, [closeContextMenu]);

  /**
   * 节点左键点击
   */
  const handleNodeClick = useCallback(() => {
    closeContextMenu();                                                          // 关闭菜单
  }, [closeContextMenu]);

  // ==================== 点击外部关闭 ====================

  /**
   * 监听全局点击，点击菜单外部时关闭菜单
   */
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

  // ==================== 返回 ====================

  return {
    contextMenu,                                                                 // 菜单状态
    openContextMenu,                                                             // 打开菜单
    closeContextMenu,                                                            // 关闭菜单
    handlePaneContextMenu,                                                       // 画布右键处理
    handlePaneClick,                                                             // 画布点击处理
    handleNodeClick,                                                             // 节点点击处理
  };
};

export default useContextMenu;
