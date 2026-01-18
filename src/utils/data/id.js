/**
 * id.js - ID 生成工具函数
 * 
 * 提供唯一ID生成功能
 */

/**
 * 生成节点ID
 * @param {number} counter - 当前计数器值
 * @returns {string} 节点ID
 */
export function generateNodeId(counter) {
  return `node-${counter}`;
}

/**
 * 生成连线ID
 * @param {string} sourceId - 源节点ID
 * @param {string} sourceHandle - 源端口ID
 * @param {string} targetId - 目标节点ID
 * @param {string} targetHandle - 目标端口ID
 * @returns {string} 连线ID
 */
export function generateEdgeId(sourceId, sourceHandle, targetId, targetHandle) {
  return `e-${sourceId}-${sourceHandle}-${targetId}-${targetHandle}`;
}

/**
 * 生成唯一ID（基于时间戳和随机数）
 * @param {string} prefix - ID 前缀
 * @returns {string} 唯一ID
 */
export function generateUniqueId(prefix = 'id') {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * 从节点ID中提取数字
 * @param {string} nodeId - 节点ID (如 "node-123")
 * @returns {number} 数字部分
 */
export function extractNodeNumber(nodeId) {
  const match = nodeId.match(/node-(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * 计算节点数组中最大的ID数字
 * @param {Array} nodes - 节点数组
 * @returns {number} 最大ID数字
 */
export function getMaxNodeNumber(nodes) {
  if (!nodes || nodes.length === 0) return 0;
  
  return nodes.reduce((max, node) => {
    const num = extractNodeNumber(node.id);
    return Math.max(max, num);
  }, 0);
}
