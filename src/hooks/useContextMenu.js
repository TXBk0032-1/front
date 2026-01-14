/**
 * useContextMenu - 右键菜单控制
 * 
 * 管理节点右键菜单的显示和隐藏
 * 支持多选：如果右键点击的节点在选中列表里，就操作所有选中的节点
 */

import { useState, useCallback, useEffect } from "react";                        // React hooks


const useContextMenu = (nodes) => {
  
  // 菜单状态：null 表示关闭，否则包含 { x, y, nodeIds }
  const [contextMenu, setContextMenu] = useState(null);

  // ==================== 打开菜单 ====================

  /**
   * 打开右键菜单
   * 智能判断：如果点击的节点已被选中，就操作所有选中的节点
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
    
    setContextMenu({                                                             // 设置菜单状态
      x: event.clientX,                                                          // 菜单X坐标
      y: event.clientY,                                                          // 菜单Y坐标
      nodeIds: targetNodeIds,                                                    // 目标节点ID列表
    });
  }, [nodes]);

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
