/**
 * Clipboard.js - 节点复制粘贴相关命令
 * 
 * 用法说明：
 *   import { copy, paste, copyAndPaste } from './commands/Clipboard'
 *   
 *   // 复制节点
 *   copy()                                                        // 复制当前选中的节点
 *   copy(['node_1', 'node_2'])                                    // 复制指定节点
 *   
 *   // 粘贴节点
 *   paste()                                                       // 在默认位置粘贴
 *   paste({ x: 100, y: 100 })                                     // 在指定位置粘贴
 *   
 *   // 复制并粘贴
 *   copyAndPaste()                                                // 复制选中节点并粘贴
 * 
 * 核心职责：
 *   提供节点复制粘贴相关的所有命令
 */

import { getState, setState } from '../store'                       // 导入状态获取和设置函数
import { generateNodeId, generateEdgeId } from '../utils/generateId' // 导入ID生成函数

/**
 * copy - 复制节点到剪贴板
 * 
 * 用法示例：
 *   copy()                                                        // 复制当前选中的节点
 *   copy('node_123')                                              // 复制指定节点
 *   copy(['node_1', 'node_2'])                                    // 复制多个节点
 * 
 * @param {string|Array} nodeIdOrIds - 节点ID或ID数组，可选，默认复制选中的节点
 * @returns {boolean} - 是否成功复制
 */
export function copy(nodeIdOrIds) {
  const { nodes, edges, selectedIds } = getState()                  // 获取当前节点、连接线和选中列表

  let idsToCopy = []                                                // 要复制的节点ID列表

  if (nodeIdOrIds === undefined) {                                  // 如果没有传入参数
    idsToCopy = selectedIds                                        // 使用当前选中的节点
  } else if (Array.isArray(nodeIdOrIds)) {                          // 如果是数组
    idsToCopy = nodeIdOrIds                                        // 直接使用
  } else if (typeof nodeIdOrIds === 'string') {                     // 如果是单个ID
    idsToCopy = [nodeIdOrIds]                                      // 包装成数组
  }

  if (idsToCopy.length === 0) {                                     // 如果没有节点可复制
    console.log('copy: 没有选中节点，无法复制')                     // 输出提示
    return false                                                   // 返回失败
  }

  const idSet = new Set(idsToCopy)                                  // 转换为Set，提高查找效率

  const nodesToCopy = nodes.filter(n => idSet.has(n.id))            // 过滤出要复制的节点

  const edgesToCopy = edges.filter(e => {                           // 过滤出节点之间的连接线
    const fromId = e.from?.nodeId                                  // 获取起始节点ID
    const toId = e.to?.nodeId                                      // 获取目标节点ID
    return idSet.has(fromId) && idSet.has(toId)                    // 只复制两端都在复制列表中的连接线
  })

  setState({                                                        // 更新剪贴板
    clipboard: {
      nodes: JSON.parse(JSON.stringify(nodesToCopy)),              // 深拷贝节点数据
      edges: JSON.parse(JSON.stringify(edgesToCopy))               // 深拷贝连接线数据
    }
  })

  return true                                                       // 返回成功
}

/**
 * paste - 粘贴剪贴板中的节点
 * 
 * 用法示例：
 *   paste()                                                       // 在偏移位置粘贴
 *   paste({ x: 100, y: 100 })                                     // 在指定位置粘贴
 *   paste({ offsetX: 50, offsetY: 50 })                           // 使用偏移量粘贴
 * 
 * @param {Object} options - 配置选项，可选
 * @returns {Object} - 返回粘贴的节点和连接线，失败返回null
 */
export function paste(options = {}) {
  const { clipboard, nodes, edges } = getState()                    // 获取剪贴板和当前数据

  if (!clipboard.nodes || clipboard.nodes.length === 0) {           // 如果剪贴板为空
    console.log('paste: 剪贴板为空，无法粘贴')                      // 输出提示
    return null                                                    // 返回null
  }

  const offsetX = options.offsetX ?? 50                             // X方向偏移，默认50
  const offsetY = options.offsetY ?? 50                             // Y方向偏移，默认50

  const oldToNewIdMap = new Map()                                   // 旧ID到新ID的映射表

  const newNodes = clipboard.nodes.map(node => {                    // 遍历剪贴板中的节点
    const newId = generateNodeId()                                 // 生成新ID
    oldToNewIdMap.set(node.id, newId)                              // 记录ID映射

    let newX = node.x + offsetX                                    // 计算新X坐标
    let newY = node.y + offsetY                                    // 计算新Y坐标

    if (options.x !== undefined && options.y !== undefined) {       // 如果指定了绝对位置
      const firstNode = clipboard.nodes[0]                         // 获取第一个节点
      const deltaX = node.x - firstNode.x                          // 计算相对第一个节点的X偏移
      const deltaY = node.y - firstNode.y                          // 计算相对第一个节点的Y偏移
      newX = options.x + deltaX                                    // 计算新X坐标
      newY = options.y + deltaY                                    // 计算新Y坐标
    }

    return {                                                       // 返回新节点对象
      ...node,                                                     // 复制原节点属性
      id: newId,                                                   // 使用新ID
      x: newX,                                                     // 使用新X坐标
      y: newY                                                      // 使用新Y坐标
    }
  })

  const newEdges = (clipboard.edges || []).map(edge => {            // 遍历剪贴板中的连接线
    const newFromId = oldToNewIdMap.get(edge.from?.nodeId)         // 获取新的起始节点ID
    const newToId = oldToNewIdMap.get(edge.to?.nodeId)             // 获取新的目标节点ID

    if (!newFromId || !newToId) return null                        // 如果ID映射不存在，跳过

    return {                                                       // 返回新连接线对象
      id: generateEdgeId(),                                        // 生成新ID
      from: {
        nodeId: newFromId,                                         // 新的起始节点ID
        portName: edge.from?.portName                              // 保持端口名不变
      },
      to: {
        nodeId: newToId,                                           // 新的目标节点ID
        portName: edge.to?.portName                                // 保持端口名不变
      }
    }
  }).filter(Boolean)                                                // 过滤掉null值

  const allNodes = [...nodes, ...newNodes]                          // 合并所有节点
  const allEdges = [...edges, ...newEdges]                          // 合并所有连接线

  const newSelectedIds = newNodes.map(n => n.id)                    // 选中新粘贴的节点

  setState({                                                        // 更新状态
    nodes: allNodes,                                               // 更新节点列表
    edges: allEdges,                                               // 更新连接线列表
    selectedIds: newSelectedIds                                    // 更新选中列表
  })

  return { nodes: newNodes, edges: newEdges }                       // 返回粘贴的内容
}

/**
 * copyAndPaste - 复制并粘贴
 * 
 * 用法示例：
 *   copyAndPaste()                                                // 复制选中节点并粘贴
 *   copyAndPaste('node_123')                                      // 复制指定节点并粘贴
 *   copyAndPaste(['node_1', 'node_2'], { offsetX: 100 })          // 复制多个节点并偏移粘贴
 * 
 * @param {string|Array} nodeIdOrIds - 节点ID或ID数组，可选
 * @param {Object} pasteOptions - 粘贴选项，可选
 * @returns {Object} - 返回粘贴的节点和连接线，失败返回null
 */
export function copyAndPaste(nodeIdOrIds, pasteOptions = {}) {
  const copyResult = copy(nodeIdOrIds)                              // 先复制
  if (!copyResult) return null                                      // 如果复制失败，返回null
  return paste(pasteOptions)                                        // 再粘贴并返回结果
}

/**
 * hasClipboardContent - 检查剪贴板是否有内容
 * 
 * 用法示例：
 *   if (hasClipboardContent()) { paste() }                        // 检查后再粘贴
 * 
 * @returns {boolean} - 剪贴板是否有内容
 */
export function hasClipboardContent() {
  const { clipboard } = getState()                                  // 获取剪贴板
  return clipboard.nodes && clipboard.nodes.length > 0              // 检查是否有节点
}

/**
 * clearClipboard - 清空剪贴板
 * 
 * 用法示例：
 *   clearClipboard()                                              // 清空剪贴板
 */
export function clearClipboard() {
  setState({                                                        // 更新状态
    clipboard: { nodes: [], edges: [] }                            // 清空剪贴板
  })
}
