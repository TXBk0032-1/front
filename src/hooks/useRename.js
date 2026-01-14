/**
 * useRename.js - 重命名功能
 * 
 * 管理节点重命名弹窗的显示和逻辑
 * 支持单个或多个节点同时重命名
 * 
 * 触发方式：
 * 1. 右键菜单点击"重命名"
 * 2. 双击节点
 */

import { useState, useCallback } from "react";                                   // React hooks


const useRename = (nodes, setNodes, saveToHistory) => {
  
  const [renameTarget, setRenameTarget] = useState(null);                        // 重命名目标：null=弹窗关闭，否则={nodeIds, currentName}


  // ========== 打开弹窗 ==========

  const openRenameModal = useCallback((nodeIdOrIds) => {
    const nodeIds = normalizeToArray(nodeIdOrIds);                               // 第1步：统一转为数组
    if (nodeIds.length === 0) return;                                            // 第2步：没有节点，不执行
    const firstNode = nodes.find((n) => n.id === nodeIds[0]);                    // 第3步：找到第一个节点
    if (!firstNode) return;                                                      // 第4步：节点不存在，不执行
    const currentName = firstNode.data.customLabel || firstNode.data.label;      // 第5步：获取当前名称
    setRenameTarget({ nodeIds, currentName });                                   // 第6步：设置重命名目标
  }, [nodes]);


  // ========== 关闭弹窗 ==========

  const closeRenameModal = useCallback(() => {
    setRenameTarget(null);                                                       // 清空重命名目标
  }, []);


  // ========== 确认重命名 ==========

  const confirmRename = useCallback((newName) => {
    if (!renameTarget || renameTarget.nodeIds.length === 0) return;              // 第1步：没有重命名目标，不执行
    saveToHistory();                                                             // 第2步：保存历史
    const targetIds = new Set(renameTarget.nodeIds);                             // 第3步：转为Set便于查找
    setNodes((currentNodes) =>                                                   // 第4步：更新节点
      currentNodes.map((node) => {
        if (!targetIds.has(node.id)) return node;                                // 不是目标节点，保持不变
        return updateNodeName(node, newName);                                    // 是目标节点，更新名称
      })
    );
  }, [renameTarget, saveToHistory, setNodes]);


  // ========== 返回 ==========

  const isMultiple = renameTarget?.nodeIds?.length > 1;                          // 是否多选模式

  return {
    renameTarget,                                                                // 重命名目标
    isRenameOpen: renameTarget !== null,                                         // 弹窗是否打开
    isMultiple,                                                                  // 是否多选模式
    openRenameModal,                                                             // 打开弹窗
    closeRenameModal,                                                            // 关闭弹窗
    confirmRename,                                                               // 确认重命名
  };
};


// ========== 辅助函数 ==========

/** 统一转为数组 */
function normalizeToArray(nodeIdOrIds) {
  return Array.isArray(nodeIdOrIds) ? nodeIdOrIds : [nodeIdOrIds];
}

/** 更新节点名称 */
function updateNodeName(node, newName) {
  return {
    ...node,
    data: {
      ...node.data,
      label: newName,                                                            // 显示的名称
      customLabel: newName,                                                      // 标记为自定义名称
    },
  };
}


export default useRename;
