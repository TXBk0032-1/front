/**
 * serialize.js - 数据序列化工具函数
 * 
 * 提供蓝图数据序列化和反序列化功能
 */

/**
 * 序列化蓝图数据（用于保存/导出）
 * @param {Object} blueprint - 蓝图数据
 * @returns {string} JSON 字符串
 */
export function serializeBlueprint(blueprint) {
  // 移除函数引用，只保留数据
  const cleanedNodes = blueprint.nodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      onDoubleClick: undefined  // 移除回调函数
    }
  }));

  return JSON.stringify({
    nodes: cleanedNodes,
    edges: blueprint.edges,
    nodeIdCounter: blueprint.nodeIdCounter
  }, null, 2);
}

/**
 * 反序列化蓝图数据（用于加载/导入）
 * @param {string} jsonString - JSON 字符串
 * @returns {Object} 蓝图数据
 */
export function deserializeBlueprint(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('反序列化蓝图失败:', error);
    return null;
  }
}

/**
 * 深拷贝对象
 * @param {Object} obj - 要拷贝的对象
 * @returns {Object} 拷贝后的对象
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
