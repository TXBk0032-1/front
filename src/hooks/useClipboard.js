/**
 * useClipboard - 复制粘贴功能的 Hook
 * 
 * 实现节点的复制粘贴功能
 * 复制时会记住节点的相对位置，粘贴时以鼠标位置为中心放置
 * 
 * 使用方法：
 * 1. 选中一些节点
 * 2. 按 Ctrl+C 复制
 * 3. 移动鼠标到想要的位置
 * 4. 按 Ctrl+V 粘贴
 */

import { useCallback, useState, useRef } from "react";
import { useReactFlow } from "@xyflow/react";

/**
 * @param {Array} nodes - 当前的节点数组
 * @param {Function} setNodes - 设置节点的函数
 * @param {Function} createNode - 创建节点的函数
 * @param {Object} nodeIdCounterRef - 节点ID计数器的 ref
 * @param {Function} saveToHistory - 保存历史记录的函数
 */
const useClipboard = (nodes, setNodes, createNode, nodeIdCounterRef, saveToHistory) => {
  // 剪贴板：存储复制的节点数据
  const [clipboard, setClipboard] = useState(null);
  
  // 鼠标位置：用于确定粘贴位置
  const mousePositionRef = useRef({ x: 0, y: 0 });

  // 获取 React Flow 的坐标转换函数
  const { screenToFlowPosition } = useReactFlow();

  /**
   * 追踪鼠标位置
   * 需要绑定到画布的 onMouseMove 事件
   */
  const trackMousePosition = useCallback((event) => {
    mousePositionRef.current = {
      x: event.clientX,
      y: event.clientY,
    };
  }, []);

  /**
   * 复制选中的节点
   * 
   * 工作原理：
   * 1. 找出所有被选中的节点
   * 2. 计算这些节点的中心点
   * 3. 保存每个节点相对于中心点的位置
   * 
   * 为什么要保存相对位置？
   * 因为粘贴时，我们希望节点以鼠标位置为中心
   * 而不是保持原来的绝对位置
   */
  const copy = useCallback(() => {
    // 找出所有选中的节点
    const selectedNodes = nodes.filter((node) => node.selected);
    
    // 没有选中任何节点，不执行复制
    if (selectedNodes.length === 0) return;

    // 计算选中节点的中心点
    const centerX = selectedNodes.reduce((sum, node) => sum + node.position.x, 0) / selectedNodes.length;
    const centerY = selectedNodes.reduce((sum, node) => sum + node.position.y, 0) / selectedNodes.length;

    // 保存到剪贴板
    // 每个节点都记录它相对于中心点的偏移量
    setClipboard({
      nodes: selectedNodes.map((node) => ({
        ...node,
        relativePosition: {
          x: node.position.x - centerX,
          y: node.position.y - centerY,
        },
      })),
    });
  }, [nodes]);

  /**
   * 粘贴节点
   * 
   * 工作原理：
   * 1. 获取鼠标当前位置（作为粘贴中心点）
   * 2. 根据剪贴板中的相对位置，计算每个节点的新位置
   * 3. 创建新节点并添加到画布
   */
  const paste = useCallback(() => {
    // 剪贴板为空，不执行粘贴
    if (!clipboard || clipboard.nodes.length === 0) return;

    // 把鼠标屏幕坐标转换成画布坐标
    const pasteCenter = screenToFlowPosition(mousePositionRef.current);

    // 保存历史（用于撤销）
    saveToHistory();

    // 创建新节点
    const newNodes = clipboard.nodes.map((node) => {
      // 生成新的节点ID
      const newId = `node-${nodeIdCounterRef.current++}`;
      
      // 计算新位置：粘贴中心点 + 相对偏移
      const newPosition = {
        x: pasteCenter.x + node.relativePosition.x,
        y: pasteCenter.y + node.relativePosition.y,
      };

      // 使用 createNode 函数创建节点
      // 注意：我们需要保留原节点的 nodeKey，这样才能正确创建同类型的节点
      return createNode(newId, node.data.nodeKey, newPosition);
    });

    // 添加新节点到画布
    setNodes((nds) => nds.concat(newNodes));
  }, [clipboard, screenToFlowPosition, setNodes, createNode, nodeIdCounterRef, saveToHistory]);

  return {
    copy,                   // 复制选中节点
    paste,                  // 粘贴节点
    trackMousePosition,     // 追踪鼠标位置（绑定到 onMouseMove）
  };
};

export default useClipboard;
