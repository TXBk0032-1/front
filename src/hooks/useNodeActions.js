/**
 * useNodeActions - 节点操作 Hook
 * 
 * 处理右键菜单里的节点操作：
 * - 复制并粘贴（在原位置偏移一点创建副本）
 * - 删除节点（同时删除相关连线）
 * 
 * 支持批量操作：可以同时操作多个节点
 */

import { useCallback } from "react";
import { createNode } from "../utils/createNode";

/**
 * @param {Array} nodes - 当前的节点数组
 * @param {Function} setNodes - 设置节点的函数
 * @param {Function} setEdges - 设置连线的函数
 * @param {Object} nodeIdCounterRef - 节点ID计数器的 ref
 * @param {Function} saveToHistory - 保存历史记录的函数
 * @returns {Object} 节点操作方法
 */
const useNodeActions = (nodes, setNodes, setEdges, nodeIdCounterRef, saveToHistory) => {
  
  /**
   * 复制并粘贴节点（支持批量）
   * 
   * 找到目标节点，在它们右下方偏移一点的位置创建副本
   * 如果原节点有自定义名称，副本也会继承这个名称
   * 
   * @param {string|string[]} nodeIds - 要复制的节点ID（单个或数组）
   */
  const duplicateNodes = useCallback((nodeIds) => {
    // 统一转成数组处理
    const ids = Array.isArray(nodeIds) ? nodeIds : [nodeIds];
    
    // 找到所有目标节点
    const targetNodes = nodes.filter((n) => ids.includes(n.id));
    if (targetNodes.length === 0) return;
    
    // 先保存历史，方便撤销
    saveToHistory();
    
    // 为每个节点创建副本
    const newNodes = targetNodes.map((targetNode) => {
      // 生成新ID
      const newId = `node-${nodeIdCounterRef.current++}`;
      
      // 新位置：在原节点右下方偏移50像素
      const newPosition = {
        x: targetNode.position.x + 50,
        y: targetNode.position.y + 50,
      };
      
      // 创建新节点
      const newNode = createNode(newId, targetNode.data.nodeKey, newPosition);
      
      // 如果原节点有自定义名称，也复制过来
      if (targetNode.data.customLabel) {
        newNode.data.customLabel = targetNode.data.customLabel;
        newNode.data.label = targetNode.data.customLabel;
      }
      
      return newNode;
    });
    
    // 添加到画布
    setNodes((nds) => nds.concat(newNodes));
  }, [nodes, saveToHistory, nodeIdCounterRef, setNodes]);

  /**
   * 删除节点（支持批量）
   * 
   * 删除指定的节点，同时删除所有连接到这些节点的连线
   * 
   * @param {string|string[]} nodeIds - 要删除的节点ID（单个或数组）
   */
  const deleteNodes = useCallback((nodeIds) => {
    // 统一转成数组处理
    const ids = Array.isArray(nodeIds) ? nodeIds : [nodeIds];
    
    // 先保存历史
    saveToHistory();
    
    // 删除节点
    setNodes((nds) => nds.filter((n) => !ids.includes(n.id)));
    
    // 删除相关的连线（起点或终点在删除列表里的连线都要删）
    setEdges((eds) =>
      eds.filter((e) => !ids.includes(e.source) && !ids.includes(e.target))
    );
  }, [saveToHistory, setNodes, setEdges]);

  return {
    duplicateNodes,  // 复制并粘贴节点（支持批量）
    deleteNodes,     // 删除节点（支持批量）
  };
};

export default useNodeActions;
