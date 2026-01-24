/**
 * layout.js - 节点整理布局计算工具
 * 
 * 用法说明：
 *   import { arrangeNodes } from './utils/layout'
 *   
 *   // 整理所有节点，返回新的节点位置数组
 *   const newPositions = arrangeNodes(nodes, edges)
 *   
 *   // 自定义间距整理
 *   const newPositions = arrangeNodes(nodes, edges, { gapX: 300, gapY: 150 })
 * 
 * 核心职责：
 *   根据节点之间的连接关系，自动计算节点的合理布局位置
 *   使用简单的层级布局算法，让蓝图看起来整洁有序
 */

/**
 * arrangeNodes - 整理节点布局
 * 
 * 用法示例：
 *   arrangeNodes(nodes, edges)                           // 使用默认间距整理
 *   arrangeNodes(nodes, edges, { gapX: 300 })            // 自定义水平间距
 *   arrangeNodes(nodes, edges, { gapX: 300, gapY: 150 }) // 自定义水平和垂直间距
 * 
 * @param {Array} nodes - 节点数组
 * @param {Array} edges - 连接线数组
 * @param {Object} options - 配置选项，可选
 * @returns {Array} - 返回带有新位置的节点数组
 */
export function arrangeNodes(nodes, edges, options = {}) {
  const gapX = options.gapX || 250                                  // 水平间距，默认250像素
  const gapY = options.gapY || 100                                  // 垂直间距，默认100像素
  const startX = options.startX || 100                              // 起始X坐标，默认100
  const startY = options.startY || 100                              // 起始Y坐标，默认100

  if (!nodes || nodes.length === 0) return []                       // 如果没有节点，直接返回空数组

  const nodeMap = new Map()                                         // 创建节点映射表，用于快速查找节点
  nodes.forEach(n => nodeMap.set(n.id, { ...n, level: -1 }))       // 将每个节点放入映射表，初始层级为-1

  const inDegree = new Map()                                        // 入度映射表，记录每个节点有多少个输入连接
  const outEdges = new Map()                                        // 出边映射表，记录每个节点连向哪些节点
  
  nodes.forEach(n => {                                              // 初始化每个节点的入度和出边
    inDegree.set(n.id, 0)                                          // 初始入度为0
    outEdges.set(n.id, [])                                         // 初始出边为空数组
  })

  edges.forEach(e => {                                              // 遍历所有连接线，计算入度和出边
    const fromId = e.from?.nodeId || e.fromNodeId                  // 获取连接线的起始节点id，兼容不同格式
    const toId = e.to?.nodeId || e.toNodeId                        // 获取连接线的目标节点id，兼容不同格式
    if (!fromId || !toId) return                                   // 如果起始或目标节点不存在，跳过
    if (!nodeMap.has(fromId) || !nodeMap.has(toId)) return         // 如果节点不在映射表中，跳过
    inDegree.set(toId, (inDegree.get(toId) || 0) + 1)              // 目标节点入度加1
    outEdges.get(fromId).push(toId)                                // 起始节点的出边添加目标节点
  })

  const levels = []                                                 // 层级数组，每个元素是该层的节点id数组
  const queue = []                                                  // BFS队列，用于广度优先遍历

  nodes.forEach(n => {                                              // 找出所有入度为0的节点作为第一层
    if (inDegree.get(n.id) === 0) {                                // 入度为0表示没有输入，是起始节点
      queue.push(n.id)                                             // 加入队列
      nodeMap.get(n.id).level = 0                                  // 设置层级为0
    }
  })

  while (queue.length > 0) {                                        // 广度优先遍历，计算每个节点的层级
    const size = queue.length                                      // 当前层的节点数量
    const currentLevel = []                                        // 当前层的节点id数组
    
    for (let i = 0; i < size; i++) {                               // 处理当前层的所有节点
      const nodeId = queue.shift()                                 // 取出队首节点
      currentLevel.push(nodeId)                                    // 加入当前层
      const node = nodeMap.get(nodeId)                             // 获取节点数据
      
      outEdges.get(nodeId).forEach(targetId => {                   // 遍历该节点的所有出边目标
        const targetNode = nodeMap.get(targetId)                   // 获取目标节点
        if (targetNode.level === -1) {                             // 如果目标节点还没有设置层级
          targetNode.level = node.level + 1                        // 设置为当前层级+1
          queue.push(targetId)                                     // 加入队列
        }
      })
    }
    
    if (currentLevel.length > 0) {                                 // 如果当前层有节点
      levels.push(currentLevel)                                    // 将当前层加入层级数组
    }
  }

  nodes.forEach(n => {                                              // 处理孤立节点（没有连接的节点）
    if (nodeMap.get(n.id).level === -1) {                          // 如果节点层级还是-1，说明是孤立节点
      nodeMap.get(n.id).level = levels.length                      // 将孤立节点放到最后一层
      if (!levels[levels.length]) levels.push([])                  // 如果最后一层不存在，创建它
      levels[levels.length - 1].push(n.id)                         // 将孤立节点加入最后一层
    }
  })

  const result = []                                                 // 结果数组，存储带有新位置的节点

  levels.forEach((levelNodes, levelIndex) => {                      // 遍历每一层，计算节点位置
    levelNodes.forEach((nodeId, nodeIndex) => {                    // 遍历该层的每个节点
      const node = nodeMap.get(nodeId)                             // 获取节点数据
      result.push({                                                // 将带有新位置的节点加入结果数组
        id: node.id,                                               // 节点id
        x: startX + levelIndex * gapX,                             // X坐标 = 起始X + 层级索引 * 水平间距
        y: startY + nodeIndex * gapY                               // Y坐标 = 起始Y + 节点索引 * 垂直间距
      })
    })
  })

  return result                                                     // 返回带有新位置的节点数组
}
