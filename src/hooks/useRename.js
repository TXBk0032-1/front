/**
 * useRename - 重命名功能 Hook
 * 
 * 管理节点重命名弹窗的显示和逻辑
 * 用户可以通过两种方式触发重命名：
 * 1. 右键菜单点击"重命名"
 * 2. 双击节点
 * 
 * 重命名后，节点会显示用户自定义的名称
 */

import { useState, useCallback } from "react";

/**
 * @param {Array} nodes - 当前的节点数组
 * @param {Function} setNodes - 设置节点的函数
 * @param {Function} saveToHistory - 保存历史记录的函数
 * @returns {Object} 重命名相关的状态和方法
 */
const useRename = (nodes, setNodes, saveToHistory) => {
  // 重命名目标：null 表示弹窗关闭
  // 格式：{ nodeId: 节点ID, currentName: 当前名称 }
  const [renameTarget, setRenameTarget] = useState(null);

  /**
   * 打开重命名弹窗
   * 通过节点ID找到节点，然后打开弹窗
   */
  const openRenameModal = useCallback((nodeId) => {
    const targetNode = nodes.find((n) => n.id === nodeId);
    if (!targetNode) return;
    
    setRenameTarget({
      nodeId: targetNode.id,
      // 优先显示自定义名称，没有的话就显示默认名称
      currentName: targetNode.data.customLabel || targetNode.data.label,
    });
  }, [nodes]);

  /**
   * 关闭重命名弹窗
   */
  const closeRenameModal = useCallback(() => {
    setRenameTarget(null);
  }, []);

  /**
   * 确认重命名
   * 更新节点的显示名称
   */
  const confirmRename = useCallback((newName) => {
    if (!renameTarget) return;
    
    // 先保存历史，方便撤销
    saveToHistory();
    
    // 更新节点数据
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === renameTarget.nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              label: newName,           // 显示的名称
              customLabel: newName,     // 标记为自定义名称
            },
          };
        }
        return node;
      })
    );
  }, [renameTarget, saveToHistory, setNodes]);

  return {
    // 状态
    renameTarget,      // 重命名目标（null 或 { nodeId, currentName }）
    isRenameOpen: renameTarget !== null,  // 弹窗是否打开
    
    // 方法
    openRenameModal,   // 打开弹窗
    closeRenameModal,  // 关闭弹窗
    confirmRename,     // 确认重命名
  };
};

export default useRename;
