/**
 * useClipboard - 复制/粘贴功能
 * 
 * 实现节点的复制粘贴：
 * 1. 选中节点后按 Ctrl+C 复制
 * 2. 移动鼠标到目标位置
 * 3. 按 Ctrl+V 粘贴
 * 
 * 复制时会记住节点的相对位置，粘贴时以鼠标位置为中心放置
 */

import { useCallback, useState, useRef } from "react";                           // React hooks
import { useReactFlow } from "@xyflow/react";                                    // React Flow hooks


const useClipboard = (nodes, setNodes, createNode, nodeIdCounterRef, saveToHistory) => {
  
  const [clipboard, setClipboard] = useState(null);                              // 剪贴板：存储复制的节点
  const mousePositionRef = useRef({ x: 0, y: 0 });                               // 鼠标位置：用于粘贴定位
  const { screenToFlowPosition } = useReactFlow();                               // 坐标转换函数

  // ==================== 追踪鼠标位置 ====================

  /**
   * 追踪鼠标位置
   * 绑定到画布的 onMouseMove 事件
   */
  const trackMousePosition = useCallback((event) => {
    mousePositionRef.current = { x: event.clientX, y: event.clientY };           // 记录鼠标屏幕坐标
  }, []);

  // ==================== 复制 ====================

  /**
   * 复制选中的节点
   * 保存每个节点相对于中心点的位置，方便粘贴时定位
   */
  const copy = useCallback(() => {
    const selectedNodes = nodes.filter((node) => node.selected);                 // 找出所有选中的节点
    if (selectedNodes.length === 0) return;                                      // 没有选中节点，不执行
    
    const sumX = selectedNodes.reduce((sum, n) => sum + n.position.x, 0);        // 计算X坐标总和
    const sumY = selectedNodes.reduce((sum, n) => sum + n.position.y, 0);        // 计算Y坐标总和
    const centerX = sumX / selectedNodes.length;                                 // 计算中心点X
    const centerY = sumY / selectedNodes.length;                                 // 计算中心点Y
    
    const nodesWithRelativePos = selectedNodes.map((node) => ({                  // 给每个节点添加相对位置
      ...node,
      relativePosition: {                                                        // 相对于中心点的偏移
        x: node.position.x - centerX,
        y: node.position.y - centerY,
      },
    }));
    
    setClipboard({ nodes: nodesWithRelativePos });                               // 保存到剪贴板
  }, [nodes]);

  // ==================== 粘贴 ====================

  /**
   * 粘贴节点
   * 以鼠标位置为中心，根据相对位置放置节点
   */
  const paste = useCallback(() => {
    if (!clipboard || clipboard.nodes.length === 0) return;                      // 剪贴板为空，不执行
    
    const pasteCenter = screenToFlowPosition(mousePositionRef.current);          // 把鼠标坐标转换成画布坐标
    saveToHistory();                                                             // 保存历史
    
    const newNodes = clipboard.nodes.map((node) => {                             // 为每个节点创建副本
      const newId = `node-${nodeIdCounterRef.current++}`;                        // 生成新ID
      const newPosition = {                                                      // 计算新位置
        x: pasteCenter.x + node.relativePosition.x,                              // 粘贴中心 + 相对偏移X
        y: pasteCenter.y + node.relativePosition.y,                              // 粘贴中心 + 相对偏移Y
      };
      return createNode(newId, node.data.nodeKey, newPosition);                  // 创建新节点
    });
    
    setNodes((currentNodes) => currentNodes.concat(newNodes));                   // 添加到画布
  }, [clipboard, screenToFlowPosition, setNodes, createNode, nodeIdCounterRef, saveToHistory]);

  // ==================== 返回 ====================

  return {
    copy,                                                                        // 复制选中节点
    paste,                                                                       // 粘贴节点
    trackMousePosition,                                                          // 追踪鼠标位置
  };
};

export default useClipboard;
