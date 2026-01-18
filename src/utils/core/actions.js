/**
 * actions.js - 节点操作工具函数
 * 
 * 提供节点操作的辅助函数
 */

const DUPLICATE_OFFSET = 50;

/**
 * 创建副本节点（在原位置偏移）
 * @param {Array} targetNodes - 要复制的节点
 * @param {Function} createNode - 创建节点的函数
 * @param {Function} getNextId - 获取下一个ID的函数
 * @returns {Array} 新节点数组
 */
export function createDuplicatedNodes(targetNodes, createNode, getNextId) {
  return targetNodes.map((targetNode) => {
    const newId = getNextId();
    const newPosition = {
      x: targetNode.position.x + DUPLICATE_OFFSET,
      y: targetNode.position.y + DUPLICATE_OFFSET
    };
    const newNode = createNode(newId, targetNode.data.nodeKey, newPosition);
    
    // 复制自定义名称
    if (targetNode.data.customLabel) {
      newNode.data.customLabel = targetNode.data.customLabel;
      newNode.data.label = targetNode.data.customLabel;
    }
    
    return newNode;
  });
}

/**
 * 删除与指定节点相关的连线
 * @param {Array} edges - 连线数组
 * @param {Array} nodeIds - 节点ID数组
 * @returns {Array} 过滤后的连线数组
 */
export function removeRelatedEdges(edges, nodeIds) {
  const ids = Array.isArray(nodeIds) ? nodeIds : [nodeIds];
  return edges.filter(
    (edge) => !ids.includes(edge.source) && !ids.includes(edge.target)
  );
}

/**
 * 统一转成数组（支持单个ID或数组）
 * @param {string|Array} nodeIds - 节点ID或ID数组
 * @returns {Array} ID数组
 */
export function normalizeToArray(nodeIds) {
  return Array.isArray(nodeIds) ? nodeIds : [nodeIds];
}

/**
 * 获取要操作的节点ID列表（智能判断单选/多选）
 * @param {Array} nodes - 所有节点
 * @param {Object} clickedNode - 点击的节点
 * @returns {Array} 节点ID数组
 */
export function getTargetNodeIds(nodes, clickedNode) {
  const selectedNodes = nodes.filter((n) => n.selected);
  const isClickedNodeSelected = selectedNodes.some((n) => n.id === clickedNode.id);
  
  if (isClickedNodeSelected && selectedNodes.length > 0) {
    return selectedNodes.map((n) => n.id);
  } else {
    return [clickedNode.id];
  }
}

/**
 * 检查是否为单选模式
 * @param {Array} nodes - 所有节点
 * @param {Object} clickedNode - 点击的节点
 * @returns {boolean} 是否单选
 */
export function checkIsSingleSelect(nodes, clickedNode) {
  const selectedNodes = nodes.filter((n) => n.selected);
  const isClickedNodeSelected = selectedNodes.some((n) => n.id === clickedNode.id);
  return !isClickedNodeSelected || selectedNodes.length <= 1;
}
