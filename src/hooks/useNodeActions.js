/**
 * useNodeActions - 节点操作
 * 
 * 处理右键菜单里的节点操作：
 * - 复制并粘贴（在原位置偏移一点创建副本）
 * - 删除节点（同时删除相关连线）
 * 
 * 支持批量操作
 */

import { useCallback } from "react";                                             // React hooks
import { createNode } from "../utils/createNode";                                // 创建节点的工具函数

const DUPLICATE_OFFSET = 50;                                                     // 复制节点的偏移量（像素）


const useNodeActions = (nodes, setNodes, setEdges, nodeIdCounterRef, saveToHistory) => {

  // ==================== 复制并粘贴 ====================

  /**
   * 复制并粘贴节点
   * 在原位置右下方偏移一点创建副本
   * 
   * @param {string|string[]} nodeIds - 要复制的节点ID（单个或数组）
   */
  const duplicateNodes = useCallback((nodeIds) => {
    const ids = Array.isArray(nodeIds) ? nodeIds : [nodeIds];                    // 统一转成数组
    const targetNodes = nodes.filter((n) => ids.includes(n.id));                 // 找到所有目标节点
    if (targetNodes.length === 0) return;                                        // 没有目标节点，不执行
    
    saveToHistory();                                                             // 保存历史
    
    const newNodes = targetNodes.map((targetNode) => {                           // 为每个节点创建副本
      const newId = `node-${nodeIdCounterRef.current++}`;                        // 生成新ID
      const newPosition = {                                                      // 计算新位置
        x: targetNode.position.x + DUPLICATE_OFFSET,                             // X坐标偏移
        y: targetNode.position.y + DUPLICATE_OFFSET,                             // Y坐标偏移
      };
      const newNode = createNode(newId, targetNode.data.nodeKey, newPosition);   // 创建新节点
      if (targetNode.data.customLabel) {                                         // 如果原节点有自定义名称
        newNode.data.customLabel = targetNode.data.customLabel;                  // 复制自定义名称
        newNode.data.label = targetNode.data.customLabel;                        // 更新显示名称
      }
      return newNode;
    });
    
    setNodes((currentNodes) => currentNodes.concat(newNodes));                   // 添加到画布
  }, [nodes, saveToHistory, nodeIdCounterRef, setNodes]);

  // ==================== 删除节点 ====================

  /**
   * 删除节点
   * 同时删除所有连接到这些节点的连线
   * 
   * @param {string|string[]} nodeIds - 要删除的节点ID（单个或数组）
   */
  const deleteNodes = useCallback((nodeIds) => {
    const ids = Array.isArray(nodeIds) ? nodeIds : [nodeIds];                    // 统一转成数组
    
    saveToHistory();                                                             // 保存历史
    setNodes((currentNodes) => currentNodes.filter((n) => !ids.includes(n.id))); // 删除节点
    setEdges((currentEdges) => currentEdges.filter((e) =>                        // 删除相关连线
      !ids.includes(e.source) && !ids.includes(e.target)                         // 起点或终点在删除列表里的都删
    ));
  }, [saveToHistory, setNodes, setEdges]);

  // ==================== 返回 ====================

  return {
    duplicateNodes,                                                              // 复制并粘贴节点
    deleteNodes,                                                                 // 删除节点
  };
};

export default useNodeActions;
