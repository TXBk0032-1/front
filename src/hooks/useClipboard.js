/**
 * useClipboard.js - 复制/粘贴功能
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
  const { screenToFlowPosition } = useReactFlow();                               // 屏幕坐标转画布坐标


  // ========== 追踪鼠标位置 ==========

  const trackMousePosition = useCallback((event) => {
    mousePositionRef.current = { x: event.clientX, y: event.clientY };           // 记录鼠标屏幕坐标
  }, []);


  // ========== 复制 ==========

  const copy = useCallback(() => {
    const selectedNodes = nodes.filter((node) => node.selected);                 // 第1步：找出所有选中的节点
    if (selectedNodes.length === 0) return;                                      // 第2步：没有选中节点，不执行
    const center = calcCenter(selectedNodes);                                    // 第3步：计算选中节点的中心点
    const nodesWithRelativePos = addRelativePosition(selectedNodes, center);     // 第4步：给每个节点添加相对位置
    setClipboard({ nodes: nodesWithRelativePos });                               // 第5步：保存到剪贴板
  }, [nodes]);


  // ========== 粘贴 ==========

  const paste = useCallback(() => {
    if (!clipboard || clipboard.nodes.length === 0) return;                      // 第1步：剪贴板为空，不执行
    const pasteCenter = screenToFlowPosition(mousePositionRef.current);          // 第2步：把鼠标坐标转换成画布坐标
    saveToHistory();                                                             // 第3步：保存历史
    const newNodes = createNodesAtPosition(clipboard.nodes, pasteCenter, createNode, nodeIdCounterRef);  // 第4步：创建新节点
    setNodes((currentNodes) => currentNodes.concat(newNodes));                   // 第5步：添加到画布
  }, [clipboard, screenToFlowPosition, setNodes, createNode, nodeIdCounterRef, saveToHistory]);


  // ========== 返回 ==========

  return {
    copy,                                                                        // 复制选中节点
    paste,                                                                       // 粘贴节点
    trackMousePosition,                                                          // 追踪鼠标位置
  };
};


// ========== 辅助函数 ==========

/** 计算节点数组的中心点 */
function calcCenter(nodes) {
  const sumX = nodes.reduce((sum, n) => sum + n.position.x, 0);                   // X坐标总和
  const sumY = nodes.reduce((sum, n) => sum + n.position.y, 0);                   // Y坐标总和
  return {
    x: sumX / nodes.length,                                                      // 中心点X
    y: sumY / nodes.length,                                                      // 中心点Y
  };
}

/** 给每个节点添加相对于中心点的位置 */
function addRelativePosition(nodes, center) {
  return nodes.map((node) => ({
    ...node,
    relativePosition: {                                                          // 相对于中心点的偏移
      x: node.position.x - center.x,
      y: node.position.y - center.y,
    },
  }));
}

/** 在指定位置创建新节点 */
function createNodesAtPosition(clipboardNodes, pasteCenter, createNode, nodeIdCounterRef) {
  return clipboardNodes.map((node) => {
    const newId = `node-${nodeIdCounterRef.current++}`;                          // 生成新ID
    const newPosition = {                                                        // 计算新位置
      x: pasteCenter.x + node.relativePosition.x,                                // 粘贴中心 + 相对偏移X
      y: pasteCenter.y + node.relativePosition.y,                                // 粘贴中心 + 相对偏移Y
    };
    return createNode(newId, node.data.nodeKey, newPosition);                    // 创建新节点
  });
}


export default useClipboard;
