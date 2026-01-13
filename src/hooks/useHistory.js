/**
 * useHistory - 撤销/重做功能的 Hook
 * 
 * 这个 hook 用来追踪节点和连线的变化历史
 * 就像 Photoshop 的历史记录面板一样
 * 
 * 使用方法：
 * 1. 在做任何修改之前，调用 saveToHistory() 保存当前状态
 * 2. 按 Ctrl+Z 调用 undo() 撤销
 * 3. 按 Ctrl+Y 调用 redo() 重做
 */

import { useCallback, useRef } from "react";

// 最多保存多少步历史记录（防止内存爆炸）
const MAX_HISTORY_LENGTH = 50;

/**
 * @param {Array} nodes - 当前的节点数组
 * @param {Array} edges - 当前的连线数组
 * @param {Function} setNodes - 设置节点的函数
 * @param {Function} setEdges - 设置连线的函数
 */
const useHistory = (nodes, edges, setNodes, setEdges) => {
  // 历史记录栈：存储过去的状态（用于撤销）
  const pastRef = useRef([]);
  
  // 未来记录栈：存储被撤销的状态（用于重做）
  const futureRef = useRef([]);
  
  // 标记是否正在执行撤销/重做操作
  // 这个标记很重要，因为撤销/重做本身也会触发状态变化
  // 如果不标记，就会把撤销操作也记录到历史里，导致混乱
  const isUndoingRef = useRef(false);

  /**
   * 保存当前状态到历史记录
   * 
   * 注意：这个函数应该在"修改之前"调用，而不是修改之后
   * 因为我们要保存的是"修改前的状态"，这样撤销才能回到修改前
   */
  const saveToHistory = useCallback(() => {
    // 如果正在撤销/重做，不要记录（避免重复记录）
    if (isUndoingRef.current) return;

    // 深拷贝当前状态，推入历史栈
    // 用 JSON 序列化是最简单的深拷贝方式
    pastRef.current.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    });

    // 限制历史记录数量
    if (pastRef.current.length > MAX_HISTORY_LENGTH) {
      pastRef.current.shift(); // 删除最老的记录
    }

    // 有新操作时，清空未来栈
    // 因为历史已经改变了，之前撤销的操作不能再重做了
    futureRef.current = [];
  }, [nodes, edges]);

  /**
   * 撤销 - 回到上一步
   */
  const undo = useCallback(() => {
    // 没有历史记录，无法撤销
    if (pastRef.current.length === 0) return;

    // 标记正在撤销
    isUndoingRef.current = true;

    // 把当前状态推入未来栈（用于重做）
    futureRef.current.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    });

    // 从历史栈弹出上一个状态
    const previous = pastRef.current.pop();
    setNodes(previous.nodes);
    setEdges(previous.edges);

    // 延迟重置标记
    // 用 setTimeout 是因为 React 的状态更新是异步的
    // 需要等状态更新完成后再重置标记
    setTimeout(() => {
      isUndoingRef.current = false;
    }, 0);
  }, [nodes, edges, setNodes, setEdges]);

  /**
   * 重做 - 恢复被撤销的操作
   */
  const redo = useCallback(() => {
    // 没有未来记录，无法重做
    if (futureRef.current.length === 0) return;

    isUndoingRef.current = true;

    // 把当前状态推入历史栈
    pastRef.current.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    });

    // 从未来栈弹出下一个状态
    const next = futureRef.current.pop();
    setNodes(next.nodes);
    setEdges(next.edges);

    setTimeout(() => {
      isUndoingRef.current = false;
    }, 0);
  }, [nodes, edges, setNodes, setEdges]);

  return {
    saveToHistory,  // 保存当前状态
    undo,           // 撤销
    redo,           // 重做
    isUndoingRef,   // 是否正在撤销/重做（外部可能需要判断）
  };
};

export default useHistory;
