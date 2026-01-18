/**
 * position.js - 位置计算工具函数
 * 
 * 提供计算浮动面板位置的通用函数
 */

/**
 * 计算浮动面板的位置（显示在节点上方）
 * @param {Object} nodeData - 节点数据（包含 position 和 measured）
 * @param {Function} flowToScreenPosition - 画布坐标转屏幕坐标的函数
 * @param {number} zoom - 当前画布缩放比例
 * @returns {Object} 位置信息 { x, y, position, scale }
 */
export function calcPositionAboveNode(nodeData, flowToScreenPosition, zoom) {
  const nodeHeight = nodeData.measured?.height || 100;
  
  const nodeTopScreen = flowToScreenPosition({
    x: nodeData.position.x,
    y: nodeData.position.y - nodeHeight / 2
  });
  
  const nodeCenterScreen = flowToScreenPosition({
    x: nodeData.position.x,
    y: nodeData.position.y
  });
  
  const gap = 10 * zoom;
  
  return {
    x: nodeCenterScreen.x,
    y: nodeTopScreen.y - gap,
    position: 'above',
    scale: zoom
  };
}

/**
 * 计算浮动面板的位置（显示在节点下方）
 * @param {Object} nodeData - 节点数据（包含 position 和 measured）
 * @param {Function} flowToScreenPosition - 画布坐标转屏幕坐标的函数
 * @param {number} zoom - 当前画布缩放比例
 * @returns {Object} 位置信息 { x, y, position, scale }
 */
export function calcPositionBelowNode(nodeData, flowToScreenPosition, zoom) {
  const nodeHeight = nodeData.measured?.height || 100;
  
  const nodeBottomScreen = flowToScreenPosition({
    x: nodeData.position.x,
    y: nodeData.position.y + nodeHeight / 2
  });
  
  const nodeCenterScreen = flowToScreenPosition({
    x: nodeData.position.x,
    y: nodeData.position.y
  });
  
  const gap = 10 * zoom;
  
  return {
    x: nodeCenterScreen.x,
    y: nodeBottomScreen.y + gap,
    position: 'below',
    scale: zoom
  };
}

/**
 * 计算面板位置样式
 * @param {number} x - X坐标
 * @param {number} y - Y坐标
 * @param {string} position - 位置 'above' | 'below'
 * @param {number} scale - 缩放比例
 * @returns {Object} CSS样式对象
 */
export function calcPositionStyle(x, y, position, scale) {
  if (position === 'above') {
    return {
      left: x,
      top: y,
      transform: `translate(-50%, -100%) scale(${scale})`,
      transformOrigin: 'center bottom'
    };
  } else {
    return {
      left: x,
      top: y,
      transform: `translateX(-50%) scale(${scale})`,
      transformOrigin: 'center top'
    };
  }
}
