/**
 * clipboard.js - 剪贴板工具函数
 * 
 * 提供复制/粘贴功能的辅助函数
 */

/**
 * 计算节点数组的中心点
 * @param {Array} nodes - 节点数组
 * @returns {Object} 中心点坐标 { x, y }
 */
export function calcCenter(nodes) {
  if (nodes.length === 0) return { x: 0, y: 0 };
  
  const sumX = nodes.reduce((sum, n) => sum + n.position.x, 0);
  const sumY = nodes.reduce((sum, n) => sum + n.position.y, 0);
  
  return {
    x: sumX / nodes.length,
    y: sumY / nodes.length
  };
}

/**
 * 给每个节点添加相对于中心点的位置
 * @param {Array} nodes - 节点数组
 * @param {Object} center - 中心点坐标
 * @returns {Array} 带有相对位置的节点数组
 */
export function addRelativePosition(nodes, center) {
  return nodes.map((node) => ({
    ...node,
    relativePosition: {
      x: node.position.x - center.x,
      y: node.position.y - center.y
    }
  }));
}

/**
 * 在指定位置创建新节点
 * @param {Array} clipboardNodes - 剪贴板中的节点
 * @param {Object} pasteCenter - 粘贴的中心位置
 * @param {Function} createNode - 创建节点的函数
 * @param {Function} getNextId - 获取下一个ID的函数
 * @returns {Array} 新节点数组
 */
export function createNodesAtPosition(clipboardNodes, pasteCenter, createNode, getNextId) {
  return clipboardNodes.map((node) => {
    const newId = getNextId();
    const newPosition = {
      x: pasteCenter.x + node.relativePosition.x,
      y: pasteCenter.y + node.relativePosition.y
    };
    return createNode(newId, node.data.nodeKey, newPosition);
  });
}
