/**
 * useRename - 重命名功能
 * 
 * 管理节点重命名弹窗的显示和逻辑
 * 触发方式：
 * 1. 右键菜单点击"重命名"
 * 2. 双击节点
 */

import { useState, useCallback } from "react";                                   // React hooks


const useRename = (nodes, setNodes, saveToHistory) => {
  
  // 重命名目标：null 表示弹窗关闭，否则包含 { nodeId, currentName }
  const [renameTarget, setRenameTarget] = useState(null);

  // ==================== 打开弹窗 ====================

  /**
   * 打开重命名弹窗
   */
  const openRenameModal = useCallback((nodeId) => {
    const targetNode = nodes.find((n) => n.id === nodeId);                       // 根据ID找到目标节点
    if (!targetNode) return;                                                     // 节点不存在，不执行
    
    const currentName = targetNode.data.customLabel || targetNode.data.label;    // 获取当前名称（优先自定义名称）
    setRenameTarget({ nodeId, currentName });                                    // 设置重命名目标
  }, [nodes]);

  // ==================== 关闭弹窗 ====================

  /**
   * 关闭重命名弹窗
   */
  const closeRenameModal = useCallback(() => {
    setRenameTarget(null);                                                       // 清空重命名目标
  }, []);

  // ==================== 确认重命名 ====================

  /**
   * 确认重命名
   * 更新节点的显示名称
   */
  const confirmRename = useCallback((newName) => {
    if (!renameTarget) return;                                                   // 没有重命名目标，不执行
    
    saveToHistory();                                                             // 保存历史
    
    setNodes((currentNodes) => currentNodes.map((node) => {                      // 更新节点
      if (node.id !== renameTarget.nodeId) return node;                          // 不是目标节点，保持不变
      return {                                                                   // 是目标节点，更新名称
        ...node,
        data: {
          ...node.data,
          label: newName,                                                        // 显示的名称
          customLabel: newName,                                                  // 标记为自定义名称
        },
      };
    }));
  }, [renameTarget, saveToHistory, setNodes]);

  // ==================== 返回 ====================

  return {
    renameTarget,                                                                // 重命名目标
    isRenameOpen: renameTarget !== null,                                         // 弹窗是否打开
    openRenameModal,                                                             // 打开弹窗
    closeRenameModal,                                                            // 关闭弹窗
    confirmRename,                                                               // 确认重命名
  };
};

export default useRename;
