/**
 * history.js - 历史记录工具函数
 * 
 * 提供撤销/重做功能的辅助函数
 * 实际状态管理在 store.js 中
 */

/**
 * 创建状态快照（深拷贝）
 * @param {Array} nodes - 节点数组
 * @param {Array} edges - 连线数组
 * @returns {Object} 状态快照
 */
export function createSnapshot(nodes, edges) {
  return {
    nodes: JSON.parse(JSON.stringify(nodes)),
    edges: JSON.parse(JSON.stringify(edges))
  };
}

/**
 * 判断节点变化是否需要保存历史记录
 * @param {Array} changes - 变化数组
 * @param {boolean} isUndoing - 是否正在撤销/重做
 * @returns {boolean} 是否需要保存
 */
export function checkShouldSaveHistory(changes, isUndoing) {
  if (isUndoing) return false;
  
  // 检查是否有节点停止拖拽
  const hasPositionEnd = changes.some(
    (c) => c.type === 'position' && c.dragging === false
  );
  
  // 检查是否有节点被删除
  const hasRemove = changes.some((c) => c.type === 'remove');
  
  return hasPositionEnd || hasRemove;
}

/**
 * 判断连线变化是否需要保存历史记录
 * @param {Array} changes - 变化数组
 * @param {boolean} isUndoing - 是否正在撤销/重做
 * @returns {boolean} 是否需要保存
 */
export function checkEdgesShouldSaveHistory(changes, isUndoing) {
  if (isUndoing) return false;
  return changes.some((c) => c.type === 'remove');
}
