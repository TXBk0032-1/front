/**
 * Edge.js - 连接线相关命令
 * 
 * 用法说明：
 *   import { createEdge, deleteEdge } from './commands/Edge'
 *   
 *   // 创建连接线
 *   createEdge({
 *     from: { nodeId: 'node_1', portName: 'output' },
 *     to: { nodeId: 'node_2', portName: 'input' }
 *   })
 *   
 *   // 删除连接线
 *   deleteEdge('edge_123')
 *   deleteEdge({ nodeId: 'node_2', portName: 'input' })  // 删除连接到指定端口的线
 * 
 * 核心职责：
 *   提供连接线相关的所有命令，包括创建和删除连接线
 */

import { getState, setState } from '../store'                       // 导入状态获取和设置函数
import { generateEdgeId } from '../utils/generateId'                // 导入连接线ID生成函数

/**
 * createEdge - 创建连接线
 * 
 * 用法示例：
 *   createEdge({
 *     from: { nodeId: 'node_1', portName: 'output' },
 *     to: { nodeId: 'node_2', portName: 'input' }
 *   })
 *   
 *   // 简写形式
 *   createEdge('node_1', 'output', 'node_2', 'input')
 * 
 * @param {Object|string} configOrFromNodeId - 配置对象，或起始节点ID
 * @param {string} fromPortName - 起始端口名（当第一个参数是字符串时使用）
 * @param {string} toNodeId - 目标节点ID（当第一个参数是字符串时使用）
 * @param {string} toPortName - 目标端口名（当第一个参数是字符串时使用）
 * @returns {Object|null} - 返回创建的连接线对象，失败返回null
 */
export function createEdge(configOrFromNodeId, fromPortName, toNodeId, toPortName) {
  const { edges } = getState()                                      // 获取当前连接线列表

  let from, to                                                      // 声明起始和目标端口对象

  if (typeof configOrFromNodeId === 'object') {                     // 如果是配置对象
    from = configOrFromNodeId.from                                 // 获取起始端口信息
    to = configOrFromNodeId.to                                     // 获取目标端口信息
  } else if (typeof configOrFromNodeId === 'string') {              // 如果是字符串形式的参数
    from = { nodeId: configOrFromNodeId, portName: fromPortName }  // 组装起始端口对象
    to = { nodeId: toNodeId, portName: toPortName }                // 组装目标端口对象
  } else {
    console.error('createEdge: 参数格式错误')                       // 参数格式不正确
    return null                                                    // 返回null
  }

  if (!from?.nodeId || !from?.portName) {                           // 检查起始端口信息是否完整
    console.error('createEdge: 起始端口信息不完整')                 // 输出错误
    return null                                                    // 返回null
  }

  if (!to?.nodeId || !to?.portName) {                               // 检查目标端口信息是否完整
    console.error('createEdge: 目标端口信息不完整')                 // 输出错误
    return null                                                    // 返回null
  }

  const existingEdge = edges.find(e =>                              // 检查是否已存在相同的连接
    e.to?.nodeId === to.nodeId &&                                  // 目标节点相同
    e.to?.portName === to.portName                                 // 目标端口相同
  )

  if (existingEdge) {                                               // 如果目标端口已有连接
    console.warn('createEdge: 目标端口已有连接，将替换原连接')       // 输出警告
    deleteEdge(existingEdge.id)                                    // 删除原有连接
  }

  const edgeId = generateEdgeId()                                   // 生成唯一的连接线ID

  const newEdge = {                                                 // 创建新连接线对象
    id: edgeId,                                                    // 连接线ID
    from: {                                                        // 起始端口信息
      nodeId: from.nodeId,                                         // 起始节点ID
      portName: from.portName                                      // 起始端口名
    },
    to: {                                                          // 目标端口信息
      nodeId: to.nodeId,                                           // 目标节点ID
      portName: to.portName                                        // 目标端口名
    }
  }

  const currentEdges = getState().edges                             // 重新获取当前连接线列表（可能已被deleteEdge修改）
  setState({ edges: [...currentEdges, newEdge] })                   // 将新连接线添加到列表

  return newEdge                                                    // 返回创建的连接线
}

/**
 * deleteEdge - 删除连接线
 * 
 * 用法示例：
 *   deleteEdge('edge_123')                                        // 通过ID删除
 *   deleteEdge({ nodeId: 'node_2', portName: 'input' })           // 删除连接到指定端口的线
 *   deleteEdge(['edge_1', 'edge_2'])                              // 批量删除
 * 
 * @param {string|Object|Array} idOrPortOrIds - 连接线ID、端口对象或ID数组
 */
export function deleteEdge(idOrPortOrIds) {
  const { edges } = getState()                                      // 获取当前连接线列表

  if (Array.isArray(idOrPortOrIds)) {                               // 如果是ID数组
    const idSet = new Set(idOrPortOrIds)                           // 转换为Set，提高查找效率
    const newEdges = edges.filter(e => !idSet.has(e.id))           // 过滤掉要删除的连接线
    setState({ edges: newEdges })                                  // 更新连接线列表
    return
  }

  if (typeof idOrPortOrIds === 'string') {                          // 如果是连接线ID
    const newEdges = edges.filter(e => e.id !== idOrPortOrIds)     // 过滤掉该连接线
    setState({ edges: newEdges })                                  // 更新连接线列表
    return
  }

  if (typeof idOrPortOrIds === 'object') {                          // 如果是端口对象
    const { nodeId, portName, type } = idOrPortOrIds               // 解构端口信息

    const newEdges = edges.filter(e => {                           // 过滤连接线
      if (type === 'output' || type === 'from') {                  // 如果指定是输出端口
        return !(e.from?.nodeId === nodeId &&                      // 检查起始端口
                 e.from?.portName === portName)
      }
      if (type === 'input' || type === 'to') {                     // 如果指定是输入端口
        return !(e.to?.nodeId === nodeId &&                        // 检查目标端口
                 e.to?.portName === portName)
      }
      return !(                                                    // 如果没指定类型，检查两端
        (e.from?.nodeId === nodeId && e.from?.portName === portName) ||
        (e.to?.nodeId === nodeId && e.to?.portName === portName)
      )
    })

    setState({ edges: newEdges })                                  // 更新连接线列表
  }
}

/**
 * getEdgesByNode - 获取与指定节点相关的所有连接线
 * 
 * 用法示例：
 *   getEdgesByNode('node_123')                                    // 获取所有相关连接线
 *   getEdgesByNode('node_123', 'input')                           // 只获取输入连接线
 *   getEdgesByNode('node_123', 'output')                          // 只获取输出连接线
 * 
 * @param {string} nodeId - 节点ID
 * @param {string} type - 连接类型，可选：'input'只获取输入、'output'只获取输出
 * @returns {Array} - 返回连接线数组
 */
export function getEdgesByNode(nodeId, type) {
  const { edges } = getState()                                      // 获取当前连接线列表

  return edges.filter(e => {                                        // 过滤与该节点相关的连接线
    const isFrom = e.from?.nodeId === nodeId                       // 是否是该节点的输出
    const isTo = e.to?.nodeId === nodeId                           // 是否是该节点的输入

    if (type === 'input') return isTo                              // 只返回输入连接线
    if (type === 'output') return isFrom                           // 只返回输出连接线
    return isFrom || isTo                                          // 返回所有相关连接线
  })
}

/**
 * getEdgeByPort - 获取连接到指定端口的连接线
 * 
 * 用法示例：
 *   getEdgeByPort('node_123', 'input_0')                          // 获取连接到该端口的线
 *   getEdgeByPort({ nodeId: 'node_123', portName: 'input_0' })    // 使用对象格式
 * 
 * @param {string|Object} nodeIdOrPort - 节点ID或端口对象
 * @param {string} portName - 端口名（当第一个参数是字符串时使用）
 * @returns {Object|null} - 返回连接线对象，不存在则返回null
 */
export function getEdgeByPort(nodeIdOrPort, portName) {
  const { edges } = getState()                                      // 获取当前连接线列表

  let targetNodeId, targetPortName                                  // 声明目标节点ID和端口名

  if (typeof nodeIdOrPort === 'object') {                           // 如果是对象
    targetNodeId = nodeIdOrPort.nodeId                             // 从对象获取节点ID
    targetPortName = nodeIdOrPort.portName                         // 从对象获取端口名
  } else {
    targetNodeId = nodeIdOrPort                                    // 直接使用节点ID
    targetPortName = portName                                      // 使用传入的端口名
  }

  return edges.find(e =>                                            // 查找匹配的连接线
    (e.from?.nodeId === targetNodeId && e.from?.portName === targetPortName) ||
    (e.to?.nodeId === targetNodeId && e.to?.portName === targetPortName)
  ) || null                                                         // 没找到返回null
}

/**
 * getConnectedEdgeFromInputPort - 获取连接到输入端口的连接线
 * 
 * 用法示例：
 *   getConnectedEdgeFromInputPort('node_123', 'input_0')
 * 
 * @param {string} nodeId - 节点ID
 * @param {string} portName - 输入端口名
 * @returns {Object|null} - 返回连接线对象，不存在则返回null
 */
export function getConnectedEdgeFromInputPort(nodeId, portName) {
  const { edges } = getState()                                      // 获取当前连接线列表

  return edges.find(e =>                                            // 查找连接到该输入端口的连接线
    e.to?.nodeId === nodeId &&                                     // 目标节点匹配
    e.to?.portName === portName                                    // 目标端口匹配
  ) || null                                                         // 没找到返回null
}
