/**
 * positionUtils.js - 位置计算工具函数
 * 
 * 提供计算浮动面板位置的通用函数
 * 被 useContextMenu 和 usePropertyPanel 共用
 */


/**
 * 计算浮动面板的位置（显示在节点上方）
 * 
 * @param {Object} nodeData - 节点数据（包含 position 和 measured）
 * @param {Function} flowToScreenPosition - 画布坐标转屏幕坐标的函数
 * @param {number} zoom - 当前画布缩放比例
 * @returns {Object} 位置信息 { x, y, position, scale }
 */
export function calcPositionAboveNode(nodeData, flowToScreenPosition, zoom) {
  const nodeHeight = nodeData.measured?.height || 100;                           // 获取节点高度（默认100）
  const nodeTopScreen = flowToScreenPosition({                                   // 计算节点顶部的屏幕坐标
    x: nodeData.position.x,
    y: nodeData.position.y - nodeHeight / 2,                                     // nodeOrigin是[0.5,0.5]，所以要减去一半高度
  });
  const nodeCenterScreen = flowToScreenPosition({                                // 计算节点中心的屏幕坐标
    x: nodeData.position.x,
    y: nodeData.position.y,
  });
  const gap = 10 * zoom;                                                         // 面板与节点的间距（随缩放变化）
  
  return {
    x: nodeCenterScreen.x,                                                       // X坐标：节点中心
    y: nodeTopScreen.y - gap,                                                    // Y坐标：节点顶部上方
    position: 'above',                                                           // 位置标记
    scale: zoom,                                                                 // 缩放比例
  };
}


/**
 * 计算浮动面板的位置（显示在节点下方）
 * 
 * @param {Object} nodeData - 节点数据（包含 position 和 measured）
 * @param {Function} flowToScreenPosition - 画布坐标转屏幕坐标的函数
 * @param {number} zoom - 当前画布缩放比例
 * @returns {Object} 位置信息 { x, y, position, scale }
 */
export function calcPositionBelowNode(nodeData, flowToScreenPosition, zoom) {
  const nodeHeight = nodeData.measured?.height || 100;                           // 获取节点高度（默认100）
  const nodeBottomScreen = flowToScreenPosition({                                // 计算节点底部的屏幕坐标
    x: nodeData.position.x,
    y: nodeData.position.y + nodeHeight / 2,                                     // nodeOrigin是[0.5,0.5]，所以要加上一半高度
  });
  const nodeCenterScreen = flowToScreenPosition({                                // 计算节点中心的屏幕坐标
    x: nodeData.position.x,
    y: nodeData.position.y,
  });
  const gap = 10 * zoom;                                                         // 面板与节点的间距（随缩放变化）
  
  return {
    x: nodeCenterScreen.x,                                                       // X坐标：节点中心
    y: nodeBottomScreen.y + gap,                                                 // Y坐标：节点底部下方
    position: 'below',                                                           // 位置标记
    scale: zoom,                                                                 // 缩放比例
  };
}
