/**
 * layout.js - 节点整理布局计算工具（端口感知的Sugiyama算法改进版）
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
 *   根据节点之间的连接关系和端口位置，自动计算节点的合理布局位置
 *   使用端口感知的Sugiyama算法，使连线更趋于水平，减少交叉
 */

// ==================== 阶段1：图预处理 ====================

/**
 * 环检测与消除
 * 使用DFS检测图中的环，临时反转环边使图变为DAG
 * 
 * @param {Map} nodeMap - 节点映射表
 * @param {Map} outEdges - 出边映射表
 * @returns {Array} - 需要反转的边列表 [{from, to, sourceHandle, targetHandle}]
 */
function detectAndRemoveCycles(nodeMap, outEdges) {
  const visited = new Set()           // 已访问节点
  const visiting = new Set()          // 正在访问的节点（栈中）
  const reversedEdges = []            // 需要反转的边

  function dfs(nodeId) {
    visited.add(nodeId)
    visiting.add(nodeId)

    const targets = outEdges.get(nodeId) || []
    for (const edge of targets) {
      const targetId = edge.to
      const sourceHandle = edge.sourceHandle
      const targetHandle = edge.targetHandle

      if (visiting.has(targetId)) {
        // 发现环，记录这条边需要反转
        reversedEdges.push({
          from: nodeId,
          to: targetId,
          sourceHandle,
          targetHandle
        })
        // 临时反转边方向
        const targetOutEdges = outEdges.get(targetId) || []
        targetOutEdges.push({
          to: nodeId,
          sourceHandle: targetHandle,
          targetHandle: sourceHandle,
          reversed: true
        })
        // 从原节点的出边中移除
        const idx = outEdges.get(nodeId).indexOf(edge)
        if (idx !== -1) {
          outEdges.get(nodeId).splice(idx, 1)
        }
      } else if (!visited.has(targetId)) {
        dfs(targetId)
      }
    }

    visiting.delete(nodeId)
  }

  // 对每个未访问节点执行DFS
  for (const nodeId of nodeMap.keys()) {
    if (!visited.has(nodeId)) {
      dfs(nodeId)
    }
  }

  return reversedEdges
}

/**
 * 构建邻接关系
 * 为每个节点建立入边和出边列表
 * 
 * @param {Array} nodes - 节点数组
 * @param {Array} edges - 边数组
 * @returns {Object} - { nodeMap, inEdges, outEdges }
 */
function buildAdjacency(nodes, edges) {
  const nodeMap = new Map()
  const inEdges = new Map()
  const outEdges = new Map()

  // 初始化节点映射表
  nodes.forEach(n => {
    nodeMap.set(n.id, {
      id: n.id,
      x: n.position?.x || 0,
      y: n.position?.y || 0,
      width: n.width || 150,
      height: n.height || 80,
      inputPorts: n.data?.inputHandles || [],
      outputPorts: n.data?.outputHandles || [],
      level: -1
    })
    inEdges.set(n.id, [])
    outEdges.set(n.id, [])
  })

  // 构建边关系
  edges.forEach(e => {
    const fromId = e.source || e.from?.nodeId || e.fromNodeId
    const toId = e.target || e.to?.nodeId || e.toNodeId
    const sourceHandle = e.sourceHandle
    const targetHandle = e.targetHandle

    if (!fromId || !toId) return
    if (!nodeMap.has(fromId) || !nodeMap.has(toId)) return

    const edge = {
      from: fromId,
      to: toId,
      sourceHandle,
      targetHandle
    }

    inEdges.get(toId).push(edge)
    outEdges.get(fromId).push(edge)
  })

  return { nodeMap, inEdges, outEdges }
}

// ==================== 阶段2：层分配 ====================

/**
 * 使用最长路径法分配层级
 * 
 * @param {Map} nodeMap - 节点映射表
 * @param {Map} inEdges - 入边映射表
 * @param {Map} outEdges - 出边映射表
 * @returns {Array} - 层级数组，每层包含节点ID
 */
function assignLayers(nodeMap, inEdges, outEdges) {
  const levels = []
  const queue = []

  // 找到所有入度为0的节点作为第0层
  for (const [nodeId, node] of nodeMap) {
    if (inEdges.get(nodeId).length === 0) {
      queue.push(nodeId)
      node.level = 0
    }
  }

  // BFS遍历分配层级
  while (queue.length > 0) {
    const size = queue.length
    const currentLevel = []

    for (let i = 0; i < size; i++) {
      const nodeId = queue.shift()
      currentLevel.push(nodeId)

      const targets = outEdges.get(nodeId) || []
      for (const edge of targets) {
        const targetNode = nodeMap.get(edge.to)
        if (targetNode.level === -1) {
          targetNode.level = nodeMap.get(nodeId).level + 1
          queue.push(edge.to)
        }
      }
    }

    if (currentLevel.length > 0) {
      levels.push(currentLevel)
    }
  }

  // 处理孤立节点
  for (const [nodeId, node] of nodeMap) {
    if (node.level === -1) {
      node.level = levels.length
      if (!levels[levels.length]) {
        levels.push([])
      }
      levels[levels.length - 1].push(nodeId)
    }
  }

  return levels
}

/**
 * 插入虚拟节点处理跨层边
 * 
 * @param {Array} levels - 层级数组
 * @param {Map} nodeMap - 节点映射表
 * @param {Map} outEdges - 出边映射表
 * @param {Map} inEdges - 入边映射表
 * @returns {Object} - { levels, nodeMap, dummyNodesMap, originalEdges }
 */
function insertDummyNodes(levels, nodeMap, outEdges, inEdges) {
  const dummyNodesMap = new Map()  // 虚拟节点映射
  const originalEdges = []         // 原始边记录
  let dummyCounter = 0

  // 遍历所有边
  for (const [fromId, edges] of outEdges) {
    for (let i = edges.length - 1; i >= 0; i--) {
      const edge = edges[i]
      const fromNode = nodeMap.get(fromId)
      const toNode = nodeMap.get(edge.to)
      const span = toNode.level - fromNode.level

      if (span > 1) {
        // 需要插入虚拟节点
        originalEdges.push({ ...edge })

        // 从原节点的出边中移除
        edges.splice(i, 1)

        // 从目标节点的入边中移除
        const targetInEdges = inEdges.get(edge.to)
        const idx = targetInEdges.findIndex(e => e.from === fromId)
        if (idx !== -1) {
          targetInEdges.splice(idx, 1)
        }

        // 创建虚拟节点链
        let prevId = fromId
        for (let layer = fromNode.level + 1; layer < toNode.level; layer++) {
          const dummyId = `dummy_${dummyCounter++}`
          const dummyNode = {
            id: dummyId,
            x: 0,
            y: 0,
            width: 10,
            height: 10,
            inputPorts: [],
            outputPorts: [],
            level: layer,
            isDummy: true,
            originalEdge: edge
          }

          nodeMap.set(dummyId, dummyNode)
          dummyNodesMap.set(dummyId, dummyNode)

          // 添加到对应层
          levels[layer].push(dummyId)

          // 创建边 prevId -> dummyId
          const edgeToDummy = {
            from: prevId,
            to: dummyId,
            sourceHandle: prevId === fromId ? edge.sourceHandle : null,
            targetHandle: null,
            isDummyEdge: true
          }
          outEdges.get(prevId).push(edgeToDummy)
          inEdges.get(dummyId).push(edgeToDummy)

          prevId = dummyId
        }

        // 创建最后一条边 prevId -> toId
        const edgeToTarget = {
          from: prevId,
          to: edge.to,
          sourceHandle: null,
          targetHandle: edge.targetHandle,
          isDummyEdge: true
        }
        outEdges.get(prevId).push(edgeToTarget)
        inEdges.get(edge.to).push(edgeToTarget)
      }
    }
  }

  return { levels, nodeMap, dummyNodesMap, originalEdges }
}

// ==================== 阶段3：交叉最小化 ====================

/**
 * 计算端口在节点中的相对Y位置
 * 
 * @param {Object} node - 节点对象
 * @param {string} handleId - 端口ID
 * @param {boolean} isInput - 是否为输入端口
 * @returns {number} - 相对Y位置（0-1之间）
 */
function getPortRelativeY(node, handleId, isInput) {
  const ports = isInput ? node.inputPorts : node.outputPorts
  const index = ports.indexOf(handleId)
  if (index === -1) return 0.5
  return (index + 1) / (ports.length + 1)
}

/**
 * 计算端口的实际Y坐标
 * 
 * @param {Object} node - 节点对象
 * @param {string} handleId - 端口ID
 * @param {boolean} isInput - 是否为输入端口
 * @returns {number} - 实际Y坐标
 */
function getPortActualY(node, handleId, isInput) {
  const relativeY = getPortRelativeY(node, handleId, isInput)
  return node.y + node.height * relativeY
}

/**
 * 计算两条边是否交叉
 * 
 * @param {Object} edge1 - 边1 {from, to, sourceHandle, targetHandle}
 * @param {Object} edge2 - 边2 {from, to, sourceHandle, targetHandle}
 * @param {Map} nodeMap - 节点映射表
 * @returns {boolean} - 是否交叉
 */
function edgesCross(edge1, edge2, nodeMap) {
  const node1From = nodeMap.get(edge1.from)
  const node1To = nodeMap.get(edge1.to)
  const node2From = nodeMap.get(edge2.from)
  const node2To = nodeMap.get(edge2.to)

  const y1_from = getPortActualY(node1From, edge1.sourceHandle, false)
  const y1_to = getPortActualY(node1To, edge1.targetHandle, true)
  const y2_from = getPortActualY(node2From, edge2.sourceHandle, false)
  const y2_to = getPortActualY(node2To, edge2.targetHandle, true)

  // 交叉条件：起点顺序与终点顺序相反
  return (y1_from < y2_from && y1_to > y2_to) || (y1_from > y2_from && y1_to < y2_to)
}

/**
 * 计算相邻两层之间的交叉数
 * 
 * @param {Array} layer1 - 第1层节点ID数组
 * @param {Array} layer2 - 第2层节点ID数组
 * @param {Map} outEdges - 出边映射表
 * @param {Map} nodeMap - 节点映射表
 * @returns {number} - 交叉数
 */
function countCrossings(layer1, layer2, outEdges, nodeMap) {
  let count = 0
  const edges = []

  // 收集所有跨越这两层的边
  for (const nodeId of layer1) {
    const nodeEdges = outEdges.get(nodeId) || []
    for (const edge of nodeEdges) {
      if (layer2.includes(edge.to)) {
        edges.push(edge)
      }
    }
  }

  // 计算交叉
  for (let i = 0; i < edges.length; i++) {
    for (let j = i + 1; j < edges.length; j++) {
      if (edgesCross(edges[i], edges[j], nodeMap)) {
        count++
      }
    }
  }

  return count
}

/**
 * 计算节点的端口感知重心值
 * 
 * @param {string} nodeId - 节点ID
 * @param {Array} prevLayer - 上一层节点ID数组
 * @param {Array} nextLayer - 下一层节点ID数组
 * @param {Map} inEdges - 入边映射表
 * @param {Map} outEdges - 出边映射表
 * @param {Map} nodeMap - 节点映射表
 * @param {string} direction - 'down' 或 'up'
 * @returns {number} - 重心值
 */
function calculateBarycenter(nodeId, prevLayer, nextLayer, inEdges, outEdges, nodeMap, direction) {
  const node = nodeMap.get(nodeId)
  let sum = 0
  let count = 0

  if (direction === 'down') {
    // 基于上一层计算
    const incoming = inEdges.get(nodeId) || []
    for (const edge of incoming) {
      if (prevLayer.includes(edge.from)) {
        const fromNode = nodeMap.get(edge.from)
        const fromPortY = getPortActualY(fromNode, edge.sourceHandle, false)
        const toPortY = getPortActualY(node, edge.targetHandle, true)
        // 端口偏移补偿：目标点 = 源节点Y + 源端口偏移 - 目标端口偏移
        const targetY = fromNode.y + (fromPortY - fromNode.y) - (toPortY - node.y)
        sum += targetY
        count++
      }
    }
  } else {
    // 基于下一层计算
    const outgoing = outEdges.get(nodeId) || []
    for (const edge of outgoing) {
      if (nextLayer.includes(edge.to)) {
        const toNode = nodeMap.get(edge.to)
        const fromPortY = getPortActualY(node, edge.sourceHandle, false)
        const toPortY = getPortActualY(toNode, edge.targetHandle, true)
        // 端口偏移补偿：目标点 = 目标节点Y + 目标端口偏移 - 源端口偏移
        const targetY = toNode.y + (toPortY - toNode.y) - (fromPortY - node.y)
        sum += targetY
        count++
      }
    }
  }

  return count > 0 ? sum / count : node.y
}

/**
 * 双向层扫描迭代算法
 * 
 * @param {Array} levels - 层级数组
 * @param {Map} nodeMap - 节点映射表
 * @param {Map} inEdges - 入边映射表
 * @param {Map} outEdges - 出边映射表
 * @param {number} maxIterations - 最大迭代次数
 * @returns {Array} - 优化后的层级数组
 */
function bidirectionalSweep(levels, nodeMap, inEdges, outEdges, maxIterations = 10) {
  let bestLevels = JSON.parse(JSON.stringify(levels))
  let bestCrossings = Infinity

  for (let iter = 0; iter < maxIterations; iter++) {
    // 向下扫描
    for (let k = 1; k < levels.length; k++) {
      const prevLayer = levels[k - 1]
      const currentLayer = levels[k]

      // 计算每个节点的重心值
      const barycenters = currentLayer.map(nodeId => ({
        id: nodeId,
        barycenter: calculateBarycenter(nodeId, prevLayer, [], inEdges, outEdges, nodeMap, 'down')
      }))

      // 按重心值排序
      barycenters.sort((a, b) => a.barycenter - b.barycenter)
      levels[k] = barycenters.map(b => b.id)
    }

    // 向上扫描
    for (let k = levels.length - 2; k >= 0; k--) {
      const nextLayer = levels[k + 1]
      const currentLayer = levels[k]

      // 计算每个节点的重心值
      const barycenters = currentLayer.map(nodeId => ({
        id: nodeId,
        barycenter: calculateBarycenter(nodeId, [], nextLayer, inEdges, outEdges, nodeMap, 'up')
      }))

      // 按重心值排序
      barycenters.sort((a, b) => a.barycenter - b.barycenter)
      levels[k] = barycenters.map(b => b.id)
    }

    // 计算总交叉数
    let totalCrossings = 0
    for (let k = 0; k < levels.length - 1; k++) {
      totalCrossings += countCrossings(levels[k], levels[k + 1], outEdges, nodeMap)
    }

    // 记录最佳结果
    if (totalCrossings < bestCrossings) {
      bestCrossings = totalCrossings
      bestLevels = JSON.parse(JSON.stringify(levels))
    }
  }

  return bestLevels
}

/**
 * 贪婪交换局部优化
 * 
 * @param {Array} levels - 层级数组
 * @param {Map} nodeMap - 节点映射表
 * @param {Map} inEdges - 入边映射表
 * @param {Map} outEdges - 出边映射表
 * @returns {Array} - 优化后的层级数组
 */
function greedySwap(levels, nodeMap, inEdges, outEdges) {
  for (let k = 0; k < levels.length; k++) {
    let changed = true

    while (changed) {
      changed = false
      const layer = levels[k]

      for (let i = 0; i < layer.length - 1; i++) {
        // 计算交换前的交叉数
        let crossBefore = 0
        if (k > 0) {
          crossBefore += countCrossings(levels[k - 1], layer, outEdges, nodeMap)
        }
        if (k < levels.length - 1) {
          crossBefore += countCrossings(layer, levels[k + 1], outEdges, nodeMap)
        }

        // 临时交换
        [layer[i], layer[i + 1]] = [layer[i + 1], layer[i]]

        // 计算交换后的交叉数
        let crossAfter = 0
        if (k > 0) {
          crossAfter += countCrossings(levels[k - 1], layer, outEdges, nodeMap)
        }
        if (k < levels.length - 1) {
          crossAfter += countCrossings(layer, levels[k + 1], outEdges, nodeMap)
        }

        // 如果交叉数减少，保持交换；否则撤销
        if (crossAfter >= crossBefore) {
          [layer[i], layer[i + 1]] = [layer[i + 1], layer[i]]
        } else {
          changed = true
        }
      }
    }
  }

  return levels
}

// ==================== 阶段4：坐标计算 ====================

/**
 * 计算X坐标（层间距离）
 * 
 * @param {Array} levels - 层级数组
 * @param {Map} nodeMap - 节点映射表
 * @param {number} baseGapX - 基础水平间距
 * @returns {Array} - 每层的X起始位置
 */
function calculateXCoordinates(levels, nodeMap, baseGapX) {
  const layerX = []
  let currentX = 0

  for (let k = 0; k < levels.length; k++) {
    layerX.push(currentX)

    // 计算当前层最大节点宽度
    let maxWidth = 0
    for (const nodeId of levels[k]) {
      const node = nodeMap.get(nodeId)
      if (node.width > maxWidth) {
        maxWidth = node.width
      }
    }

    // 计算下一层的X位置
    if (k < levels.length - 1) {
      currentX += maxWidth + baseGapX
    }
  }

  return layerX
}

/**
 * 计算Y坐标（层内位置）
 * 
 * @param {Array} levels - 层级数组
 * @param {Map} nodeMap - 节点映射表
 * @param {Map} inEdges - 入边映射表
 * @param {Map} outEdges - 出边映射表
 * @param {number} baseGapY - 基础垂直间距
 * @returns {Array} - 每层的Y起始位置
 */
function calculateYCoordinates(levels, nodeMap, inEdges, outEdges, baseGapY) {
  const layerY = []

  for (let k = 0; k < levels.length; k++) {
    const layer = levels[k]

    // 方法A：紧凑布局
    let currentY = 0
    for (const nodeId of layer) {
      const node = nodeMap.get(nodeId)
      node.y = currentY
      currentY += node.height + baseGapY
    }

    // 方法B：重心对齐微调
    for (let iter = 0; iter < 2; iter++) {
      for (let i = 0; i < layer.length; i++) {
        const nodeId = layer[i]
        const node = nodeMap.get(nodeId)

        // 计算重心目标位置
        let targetY = node.y
        let sum = 0
        let count = 0

        // 基于上一层
        if (k > 0) {
          const incoming = inEdges.get(nodeId) || []
          for (const edge of incoming) {
            if (levels[k - 1].includes(edge.from)) {
              const fromNode = nodeMap.get(edge.from)
              const fromPortY = getPortActualY(fromNode, edge.sourceHandle, false)
              const toPortY = getPortActualY(node, edge.targetHandle, true)
              sum += fromNode.y + (fromPortY - fromNode.y) - (toPortY - node.y)
              count++
            }
          }
        }

        // 基于下一层
        if (k < levels.length - 1) {
          const outgoing = outEdges.get(nodeId) || []
          for (const edge of outgoing) {
            if (levels[k + 1].includes(edge.to)) {
              const toNode = nodeMap.get(edge.to)
              const fromPortY = getPortActualY(node, edge.sourceHandle, false)
              const toPortY = getPortActualY(toNode, edge.targetHandle, true)
              sum += toNode.y + (toPortY - toNode.y) - (fromPortY - node.y)
              count++
            }
          }
        }

        if (count > 0) {
          targetY = sum / count
        }

        // 检查移动是否会重叠
        let minY = 0
        let maxY = Infinity

        if (i > 0) {
          const prevNode = nodeMap.get(layer[i - 1])
          minY = prevNode.y + prevNode.height + baseGapY
        }

        if (i < layer.length - 1) {
          const nextNode = nodeMap.get(layer[i + 1])
          maxY = nextNode.y - baseGapY - node.height
        }

        // 限制在安全范围内
        node.y = Math.max(minY, Math.min(maxY, targetY))
      }
    }

    layerY.push(0)
  }

  return layerY
}

/**
 * 检测并解决节点-边重叠
 * 
 * @param {Array} levels - 层级数组
 * @param {Map} nodeMap - 节点映射表
 * @param {Map} outEdges - 出边映射表
 * @param {number} baseGapY - 基础垂直间距
 */
function resolveNodeEdgeOverlaps(levels, nodeMap, outEdges, baseGapY) {
  const maxIterations = 5

  for (let iter = 0; iter < maxIterations; iter++) {
    let hasConflict = false

    // 检测所有边与节点的冲突
    for (const [fromId, edges] of outEdges) {
      for (const edge of edges) {
        const fromNode = nodeMap.get(fromId)
        const toNode = nodeMap.get(edge.to)

        // 跳过虚拟节点
        if (fromNode.isDummy || toNode.isDummy) continue

        const x1 = fromNode.x + fromNode.width
        const y1 = getPortActualY(fromNode, edge.sourceHandle, false)
        const x2 = toNode.x
        const y2 = getPortActualY(toNode, edge.targetHandle, true)

        // 检查边穿过的中间层节点
        for (let k = fromNode.level + 1; k < toNode.level; k++) {
          for (const nodeId of levels[k]) {
            const node = nodeMap.get(nodeId)
            if (node.isDummy) continue

            // 检查边是否穿过节点
            const edgeYAtNode = y1 + (y2 - y1) * (node.x - x1) / (x2 - x1)
            const nodeCenterY = node.y + node.height / 2

            // 如果边穿过节点区域
            if (edgeYAtNode > node.y && edgeYAtNode < node.y + node.height) {
              hasConflict = true

              // 判断移动方向
              if (edgeYAtNode < nodeCenterY) {
                // 边从上半部分穿过，节点下移
                const minMove = edgeYAtNode - node.y + 10
                node.y += minMove
              } else {
                // 边从下半部分穿过，节点上移
                const minMove = (node.y + node.height) - edgeYAtNode + 10
                node.y -= minMove
              }

              // 检查是否与相邻节点重叠，级联移动
              const layer = levels[k]
              const idx = layer.indexOf(nodeId)

              if (idx > 0) {
                const prevNode = nodeMap.get(layer[idx - 1])
                if (node.y < prevNode.y + prevNode.height + baseGapY) {
                  node.y = prevNode.y + prevNode.height + baseGapY
                }
              }

              if (idx < layer.length - 1) {
                const nextNode = nodeMap.get(layer[idx + 1])
                if (node.y + node.height > nextNode.y - baseGapY) {
                  nextNode.y = node.y + node.height + baseGapY
                }
              }
            }
          }
        }
      }
    }

    if (!hasConflict) break
  }
}

// ==================== 阶段5：后处理与优化 ====================

/**
 * 整体布局居中
 * 
 * @param {Map} nodeMap - 节点映射表
 * @param {number} canvasWidth - 画布宽度
 * @param {number} canvasHeight - 画布高度
 */
function centerLayout(nodeMap, canvasWidth = 2000, canvasHeight = 1500) {
  let minX = Infinity, maxX = -Infinity
  let minY = Infinity, maxY = -Infinity

  for (const node of nodeMap.values()) {
    if (node.isDummy) continue
    minX = Math.min(minX, node.x)
    maxX = Math.max(maxX, node.x + node.width)
    minY = Math.min(minY, node.y)
    maxY = Math.max(maxY, node.y + node.height)
  }

  const offsetX = (canvasWidth - (maxX - minX)) / 2 - minX
  const offsetY = (canvasHeight - (maxY - minY)) / 2 - minY

  for (const node of nodeMap.values()) {
    if (!node.isDummy) {
      node.x += offsetX
      node.y += offsetY
    }
  }
}

// ==================== 主函数 ====================

/**
 * arrangeNodes - 整理节点布局（端口感知的Sugiyama算法）
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
  const gapX = options.gapX || 250
  const gapY = options.gapY || 100
  const startX = options.startX || 100
  const startY = options.startY || 100

  if (!nodes || nodes.length === 0) return []

  // 阶段1：图预处理
  const { nodeMap, inEdges, outEdges } = buildAdjacency(nodes, edges)
  const reversedEdges = detectAndRemoveCycles(nodeMap, outEdges)

  // 阶段2：层分配
  let levels = assignLayers(nodeMap, inEdges, outEdges)
  const { levels: levelsWithDummies, nodeMap: nodeMapWithDummies, dummyNodesMap } =
    insertDummyNodes(levels, nodeMap, outEdges, inEdges)

  levels = levelsWithDummies

  // 阶段3：交叉最小化
  levels = bidirectionalSweep(levels, nodeMapWithDummies, inEdges, outEdges, 10)
  levels = greedySwap(levels, nodeMapWithDummies, inEdges, outEdges)

  // 阶段4：坐标计算
  const layerX = calculateXCoordinates(levels, nodeMapWithDummies, gapX)
  const layerY = calculateYCoordinates(levels, nodeMapWithDummies, inEdges, outEdges, gapY)

  // 应用X坐标
  for (let k = 0; k < levels.length; k++) {
    for (const nodeId of levels[k]) {
      const node = nodeMapWithDummies.get(nodeId)
      node.x = layerX[k]
    }
  }

  // 解决节点-边重叠
  resolveNodeEdgeOverlaps(levels, nodeMapWithDummies, outEdges, gapY)

  // 阶段5：后处理
  centerLayout(nodeMapWithDummies)

  // 添加起始偏移
  for (const node of nodeMapWithDummies.values()) {
    if (!node.isDummy) {
      node.x += startX
      node.y += startY
    }
  }

  // 构建结果
  const result = []
  for (const node of nodeMapWithDummies.values()) {
    if (!node.isDummy) {
      result.push({
        id: node.id,
        x: node.x,
        y: node.y
      })
    }
  }

  return result
}