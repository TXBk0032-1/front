/**
 * useNodeActions.js - 节点操作
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

  // ========== 复制并粘贴 ==========

  const duplicateNodes = useCallback((nodeIds) => {
    const ids = normalizeToArray(nodeIds);                                       // 第1步：统一转成数组
    const targetNodes = nodes.filter((n) => ids.includes(n.id));                 // 第2步：找到所有目标节点
    if (targetNodes.length === 0) return;                                        // 第3步：没有目标节点，不执行
    saveToHistory();                                                             // 第4步：保存历史
    const newNodes = createDuplicatedNodes(targetNodes, nodeIdCounterRef);       // 第5步：创建副本节点
    setNodes((currentNodes) => currentNodes.concat(newNodes));                   // 第6步：添加到画布
  }, [nodes, saveToHistory, nodeIdCounterRef, setNodes]);


  // ========== 删除节点 ==========

  const deleteNodes = useCallback((nodeIds) => {
    const ids = normalizeToArray(nodeIds);                                       // 第1步：统一转成数组
    saveToHistory();                                                             // 第2步：保存历史
    setNodes((currentNodes) => currentNodes.filter((n) => !ids.includes(n.id))); // 第3步：删除节点
    setEdges((currentEdges) => removeRelatedEdges(currentEdges, ids));           // 第4步：删除相关连线
  }, [saveToHistory, setNodes, setEdges]);


  // ========== 返回 ==========

  return {
    duplicateNodes,                                                              // 复制并粘贴节点
    deleteNodes,                                                                 // 删除节点
  };
};


// ========== 辅助函数 ==========

/** 统一转成数组（支持单个ID或数组） */
function normalizeToArray(nodeIds) {
  return Array.isArray(nodeIds) ? nodeIds : [nodeIds];
}

/** 创建副本节点（在原位置右下方偏移） */
function createDuplicatedNodes(targetNodes, nodeIdCounterRef) {
  return targetNodes.map((targetNode) => {
    const newId = `node-${nodeIdCounterRef.current++}`;                          // 生成新ID
    const newPosition = {                                                        // 计算新位置
      x: targetNode.position.x + DUPLICATE_OFFSET,                               // X坐标偏移
      y: targetNode.position.y + DUPLICATE_OFFSET,                               // Y坐标偏移
    };
    const newNode = createNode(newId, targetNode.data.nodeKey, newPosition);     // 创建新节点
    if (targetNode.data.customLabel) {                                           // 如果原节点有自定义名称
      newNode.data.customLabel = targetNode.data.customLabel;                    // 复制自定义名称
      newNode.data.label = targetNode.data.customLabel;                          // 更新显示名称
    }
    return newNode;
  });
}

/** 删除与指定节点相关的连线 */
function removeRelatedEdges(edges, nodeIds) {
  return edges.filter((edge) =>                                                  // 过滤掉相关连线
    !nodeIds.includes(edge.source) && !nodeIds.includes(edge.target)             // 起点或终点在删除列表里的都删
  );
}


export default useNodeActions;
