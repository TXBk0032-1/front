/**
 * useHistory.js - 撤销/重做功能
 * 
 * 像 Photoshop 的历史记录面板一样，追踪节点和连线的变化
 * 
 * 工作原理：
 * - 历史栈（past）：存储过去的状态，用于撤销
 * - 未来栈（future）：存储被撤销的状态，用于重做
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
  const isUndoingRef = useRef(false);                                            // 标记：是否正在撤销/重做


  // ========== 保存历史 ==========

  const saveToHistory = useCallback(() => {
    if (isUndoingRef.current) return;                                            // 第1步：撤销/重做时不记录
    const snapshot = createSnapshot(nodes, edges);                               // 第2步：创建当前状态的快照
    pastRef.current.push(snapshot);                                              // 第3步：推入历史栈
    if (pastRef.current.length > MAX_HISTORY) pastRef.current.shift();           // 第4步：超过最大数量就删除最老的
    futureRef.current = [];                                                      // 第5步：清空未来栈（因为历史已改变）
  }, [nodes, edges]);


  // ========== 撤销 ==========

  const undo = useCallback(() => {
    if (pastRef.current.length === 0) return;                                    // 第1步：没有历史记录，无法撤销
    isUndoingRef.current = true;                                                 // 第2步：标记正在撤销
    const currentSnapshot = createSnapshot(nodes, edges);                        // 第3步：保存当前状态
    futureRef.current.push(currentSnapshot);                                     // 第4步：推入未来栈
    const previousSnapshot = pastRef.current.pop();                              // 第5步：从历史栈弹出上一个状态
    setNodes(previousSnapshot.nodes);                                            // 第6步：恢复节点
    setEdges(previousSnapshot.edges);                                            // 第7步：恢复连线
    setTimeout(() => { isUndoingRef.current = false; }, 0);                      // 第8步：延迟重置标记（等状态更新完）
  }, [nodes, edges, setNodes, setEdges]);


  // ========== 重做 ==========

  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return;                                  // 第1步：没有未来记录，无法重做
    isUndoingRef.current = true;                                                 // 第2步：标记正在重做
    const currentSnapshot = createSnapshot(nodes, edges);                        // 第3步：保存当前状态
    pastRef.current.push(currentSnapshot);                                       // 第4步：推入历史栈
    const nextSnapshot = futureRef.current.pop();                                // 第5步：从未来栈弹出下一个状态
    setNodes(nextSnapshot.nodes);                                                // 第6步：恢复节点
    setEdges(nextSnapshot.edges);                                                // 第7步：恢复连线
    setTimeout(() => { isUndoingRef.current = false; }, 0);                      // 第8步：延迟重置标记
  }, [nodes, edges, setNodes, setEdges]);


  // ========== 返回 ==========

  return {
    saveToHistory,                                                               // 保存当前状态
    undo,                                                                        // 撤销
    redo,                                                                        // 重做
    isUndoingRef,                                                                // 是否正在撤销/重做
  };
};


// ========== 辅助函数 ==========

/** 创建状态快照（深拷贝） */
function createSnapshot(nodes, edges) {
  return {
    nodes: JSON.parse(JSON.stringify(nodes)),                                    // 深拷贝节点
    edges: JSON.parse(JSON.stringify(edges)),                                    // 深拷贝连线
  };
}


export default useHistory;
