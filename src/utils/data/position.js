export function calcPositionAroundNode(nodeData, flowToScreenPosition, zoom, direction = 'above') {
  const nodeHeight = nodeData.measured?.height || 100;                           // 获取节点高度（默认100）
  const nodeCenterScreen = flowToScreenPosition({                                // 计算节点中心的屏幕坐标
    x: nodeData.position.x,
    y: nodeData.position.y,
  });
  const gap = 10 * zoom;                                                         // 面板与节点的间距（随缩放变化）
  
  // 根据方向计算Y坐标
  const isAbove = direction === 'above';
  const nodeEdgeScreen = flowToScreenPosition({                                  // 计算节点边缘的屏幕坐标
    x: nodeData.position.x,
    y: nodeData.position.y + (isAbove ? -1 : 1) * nodeHeight / 2,               // nodeOrigin是[0.5,0.5]，所以根据方向加减一半高度
  });
  
  return {
    x: nodeCenterScreen.x,                                                       // X坐标：节点中心
    y: isAbove ? nodeEdgeScreen.y - gap : nodeEdgeScreen.y + gap,               // Y坐标：根据方向在节点上方或下方
    position: direction,                                                         // 位置标记
    scale: zoom,                                                                 // 缩放比例
  };
}
