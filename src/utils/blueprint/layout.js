/**
 * layout.js - 自动布局工具函数
 * 
 * 使用 ELK.js 对节点进行自动布局
 */

import ELK from 'elkjs/lib/elk.bundled.js';

const elk = new ELK();

/**
 * 默认的 ELK 布局选项
 */
export const DEFAULT_ELK_OPTIONS = {
  'elk.algorithm': 'layered',
  'elk.layered.spacing.nodeNodeBetweenLayers': '100',
  'elk.spacing.nodeNode': '80',
  'elk.direction': 'RIGHT'
};

/**
 * 对节点和连线进行自动布局
 * @param {Array} nodes - 节点数组
 * @param {Array} edges - 连线数组
 * @param {Object} options - ELK 布局选项
 * @returns {Promise<Object>} 布局后的节点和连线
 */
export async function getLayoutedElements(nodes, edges, options = DEFAULT_ELK_OPTIONS) {
  const isHorizontal = options?.['elk.direction'] === 'RIGHT';
  
  const graph = {
    id: 'root',
    layoutOptions: options,
    children: nodes.map((node) => ({
      ...node,
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      width: 150,
      height: 50
    })),
    edges: edges
  };

  try {
    const layoutedGraph = await elk.layout(graph);
    return {
      nodes: layoutedGraph.children.map((node) => ({
        ...node,
        position: { x: node.x, y: node.y }
      })),
      edges: layoutedGraph.edges
    };
  } catch (error) {
    console.error('布局计算失败:', error);
    return null;
  }
}
