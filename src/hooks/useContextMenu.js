/**
 * useContextMenu - 右键菜单 Hook
 *
 * 管理节点右键菜单的显示和隐藏
 * 就像你在桌面上右键点击文件，会弹出一个菜单一样
 *
 * 功能：
 * - 右键点击节点时显示菜单
 * - 支持多选：如果右键点击的节点在选中列表里，就操作所有选中的节点
 * - 点击其他地方时关闭菜单
 * - 提供菜单的位置和目标节点信息
 */

import { useState, useCallback, useEffect } from "react";

/**
 * @param {Array} nodes - 当前的节点数组（用于判断选中状态）
 * @returns {Object} 右键菜单相关的状态和方法
 */
const useContextMenu = (nodes) => {
  // 菜单状态：null 表示关闭
  // 格式：{ x: 屏幕X坐标, y: 屏幕Y坐标, nodeIds: 目标节点ID数组 }
  const [contextMenu, setContextMenu] = useState(null);

  /**
   * 打开右键菜单
   * 在节点上右键点击时调用
   *
   * 智能判断：
   * - 如果点击的节点已经被选中，就操作所有选中的节点
   * - 如果点击的节点没被选中，就只操作这一个节点
   */
  const openContextMenu = useCallback((event, node) => {
    // 阻止浏览器默认的右键菜单
    event.preventDefault();
    
    // 获取所有选中的节点
    const selectedNodes = nodes.filter((n) => n.selected);
    
    // 判断点击的节点是否在选中列表里
    const isClickedNodeSelected = selectedNodes.some((n) => n.id === node.id);
    
    // 确定要操作的节点列表
    let targetNodeIds;
    if (isClickedNodeSelected && selectedNodes.length > 0) {
      // 点击的节点在选中列表里，操作所有选中的节点
      targetNodeIds = selectedNodes.map((n) => n.id);
    } else {
      // 点击的节点没被选中，只操作这一个
      targetNodeIds = [node.id];
    }
    
    // 记录菜单位置和目标节点
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      nodeIds: targetNodeIds,
    });
  }, [nodes]);

  /**
   * 关闭右键菜单
   */
  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  /**
   * 处理画布右键点击（非节点区域）
   * 关闭菜单，同时阻止浏览器默认菜单
   */
  const handlePaneContextMenu = useCallback((event) => {
    event.preventDefault();
    closeContextMenu();
  }, [closeContextMenu]);

  /**
   * 处理画布左键点击
   * 点击空白区域时关闭菜单
   */
  const handlePaneClick = useCallback(() => {
    closeContextMenu();
  }, [closeContextMenu]);

  /**
   * 处理节点左键点击
   * 点击节点时也关闭菜单（如果有的话）
   */
  const handleNodeClick = useCallback(() => {
    closeContextMenu();
  }, [closeContextMenu]);

  // 监听全局点击事件，点击菜单外部时关闭菜单
  // 这是为了处理一些边缘情况，比如点击了页面其他元素
  useEffect(() => {
    // 菜单没打开就不用监听
    if (!contextMenu) return;

    const handleClickOutside = (event) => {
      // 检查点击是否在菜单内部
      const menuElement = document.querySelector(".context-menu");
      if (menuElement && !menuElement.contains(event.target)) {
        closeContextMenu();
      }
    };

    // 用捕获阶段监听，这样即使子元素阻止了冒泡也能捕获到
    document.addEventListener("mousedown", handleClickOutside, true);
    document.addEventListener("click", handleClickOutside, true);

    // 组件卸载或菜单关闭时移除监听
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [contextMenu, closeContextMenu]);

  return {
    // 状态
    contextMenu,           // 菜单状态（null 或 { x, y, nodeId }）
    
    // 方法
    openContextMenu,       // 打开菜单（绑定到 onNodeContextMenu）
    closeContextMenu,      // 关闭菜单
    
    // 事件处理器（直接绑定到 ReactFlow）
    handlePaneContextMenu, // 画布右键（绑定到 onPaneContextMenu）
    handlePaneClick,       // 画布左键（绑定到 onPaneClick）
    handleNodeClick,       // 节点左键（绑定到 onNodeClick）
  };
};

export default useContextMenu;
