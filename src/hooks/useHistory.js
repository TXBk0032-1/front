/**
 * useHistory - 撤销/重做功能
 * 
 * 像 Photoshop 的历史记录面板一样，追踪节点和连线的变化
 * 
 * 使用方法：
 * 1. 修改之前调用 saveToHistory() 保存当前状态
 * 2. Ctrl+Z 调用 undo() 撤销
 * 3. Ctrl+Y 调用 redo() 重做
 */

import { useCallback, useRef } from "react";                                     // React hooks

const MAX_HISTORY = 50;                                                          // 最多保存50步历史（防止内存爆炸）


const useHistory = (nodes, edges, setNodes, setEdges) => {
  
  const pastRef = useRef([]);                                                    // 历史栈：存储过去的状态
  const futureRef = useRef([]);                                                  // 未来栈：存储被撤销的状态
  const isUndoingRef = useRef(false);                                            // 标记是否正在撤销/重做

  // ==================== 保存历史 ====================

  /**
   * 保存当前状态到历史记录
   * 注意：应该在"修改之前"调用，保存的是修改前的状态
   */
  const saveToHistory = useCallback(() => {
    if (isUndoingRef.current) return;                                            // 撤销/重做时不记录
    const snapshot = {                                                           // 创建当前状态的快照
      nodes: JSON.parse(JSON.stringify(nodes)),                                  // 深拷贝节点
      edges: JSON.parse(JSON.stringify(edges)),                                  // 深拷贝连线
    };
    pastRef.current.push(snapshot);                                              // 推入历史栈
    if (pastRef.current.length > MAX_HISTORY) {                                  // 如果超过最大数量
      pastRef.current.shift();                                                   // 删除最老的记录
    }
    futureRef.current = [];                                                      // 清空未来栈（因为历史已改变）
  }, [nodes, edges]);

  // ==================== 撤销 ====================

  /**
   * 撤销 - 回到上一步
   */
  const undo = useCallback(() => {
    if (pastRef.current.length === 0) return;                                    // 没有历史记录，无法撤销
    isUndoingRef.current = true;                                                 // 标记正在撤销
    const currentSnapshot = {                                                    // 保存当前状态到未来栈
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    };
    futureRef.current.push(currentSnapshot);                                     // 推入未来栈
    const previousSnapshot = pastRef.current.pop();                              // 从历史栈弹出上一个状态
    setNodes(previousSnapshot.nodes);                                            // 恢复节点
    setEdges(previousSnapshot.edges);                                            // 恢复连线
    setTimeout(() => { isUndoingRef.current = false; }, 0);                      // 延迟重置标记（等状态更新完）
  }, [nodes, edges, setNodes, setEdges]);

  // ==================== 重做 ====================

  /**
   * 重做 - 恢复被撤销的操作
   */
  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return;                                  // 没有未来记录，无法重做
    isUndoingRef.current = true;                                                 // 标记正在重做
    const currentSnapshot = {                                                    // 保存当前状态到历史栈
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    };
    pastRef.current.push(currentSnapshot);                                       // 推入历史栈
    const nextSnapshot = futureRef.current.pop();                                // 从未来栈弹出下一个状态
    setNodes(nextSnapshot.nodes);                                                // 恢复节点
    setEdges(nextSnapshot.edges);                                                // 恢复连线
    setTimeout(() => { isUndoingRef.current = false; }, 0);                      // 延迟重置标记
  }, [nodes, edges, setNodes, setEdges]);

  // ==================== 返回 ====================

  return {
    saveToHistory,                                                               // 保存当前状态
    undo,                                                                        // 撤销
    redo,                                                                        // 重做
    isUndoingRef,                                                                // 是否正在撤销/重做
  };
};

export default useHistory;
