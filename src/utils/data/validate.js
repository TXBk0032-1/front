/**
 * validate.js - 数据验证工具函数
 * 
 * 提供蓝图数据验证功能
 */

/**
 * 验证蓝图数据格式是否正确
 * @param {Object} data - 蓝图数据
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validateBlueprint(data) {
  const errors = [];

  if (!data) {
    errors.push('蓝图数据为空');
    return { valid: false, errors };
  }

  if (!data.nodes) {
    errors.push('缺少节点数据 (nodes)');
  } else if (!Array.isArray(data.nodes)) {
    errors.push('节点数据必须是数组');
  }

  if (!data.edges) {
    errors.push('缺少连线数据 (edges)');
  } else if (!Array.isArray(data.edges)) {
    errors.push('连线数据必须是数组');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * 验证节点数据格式
 * @param {Object} node - 节点数据
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validateNode(node) {
  const errors = [];

  if (!node.id) {
    errors.push('节点缺少 id');
  }

  if (!node.position) {
    errors.push('节点缺少 position');
  } else {
    if (typeof node.position.x !== 'number') {
      errors.push('节点 position.x 必须是数字');
    }
    if (typeof node.position.y !== 'number') {
      errors.push('节点 position.y 必须是数字');
    }
  }

  if (!node.data) {
    errors.push('节点缺少 data');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * 验证连线数据格式
 * @param {Object} edge - 连线数据
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validateEdge(edge) {
  const errors = [];

  if (!edge.id) {
    errors.push('连线缺少 id');
  }

  if (!edge.source) {
    errors.push('连线缺少 source');
  }

  if (!edge.target) {
    errors.push('连线缺少 target');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
