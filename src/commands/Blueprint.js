/**
 * Blueprint.js - 蓝图相关命令
 * 
 * 用法说明：
 *   import { arrange, zoomIn, zoomOut, resetZoom, importBlueprint, exportBlueprint } from './commands/Blueprint'
 *   
 *   // 整理节点布局
 *   arrange()
 *   
 *   // 缩放操作
 *   zoomIn()           // 放大
 *   zoomOut()          // 缩小
 *   resetZoom()        // 重置缩放
 *   
 *   // 导入导出
 *   importBlueprint(jsonData)    // 导入蓝图数据
 *   exportBlueprint()            // 导出蓝图数据
 * 
 * 核心职责：
 *   提供蓝图自身可调节的命令，包括整理、缩放、导入导出等
 */

import { getState, setState } from '../store'                       // 导入状态获取和设置函数
import { arrangeNodes } from '../utils/layout'                      // 导入节点整理布局函数

/**
 * arrange - 整理节点布局
 * 
 * 用法示例：
 *   arrange()                                                     // 使用默认配置整理
 *   arrange({ gapX: 300, gapY: 150 })                             // 自定义间距整理
 * 
 * @param {Object} options - 配置选项，可选
 */
export function arrange(options = {}) {
  const { nodes, edges } = getState()                               // 获取当前所有节点和连接线
  
  if (nodes.length === 0) return                                    // 如果没有节点，直接返回

  const newPositions = arrangeNodes(nodes, edges, options)          // 计算新的节点位置

  const updatedNodes = nodes.map(node => {                          // 遍历所有节点，更新位置
    const newPos = newPositions.find(p => p.id === node.id)        // 找到该节点的新位置
    if (!newPos) return node                                       // 如果没找到，保持原样
    return { ...node, x: newPos.x, y: newPos.y }                   // 返回更新位置后的节点
  })

  setState({ nodes: updatedNodes })                                 // 更新store中的节点数据
}

/**
 * zoomIn - 放大视口
 * 
 * 用法示例：
 *   zoomIn()                                                      // 放大0.1倍
 *   zoomIn(0.2)                                                   // 放大0.2倍
 * 
 * @param {number} step - 放大步长，默认0.1
 */
export function zoomIn(step = 0.1) {
  const { viewport } = getState()                                   // 获取当前视口状态
  const newZoom = Math.min(viewport.zoom + step, 3)                 // 计算新缩放值，最大3倍
  setState({ viewport: { ...viewport, zoom: newZoom } })            // 更新视口缩放
}

/**
 * zoomOut - 缩小视口
 * 
 * 用法示例：
 *   zoomOut()                                                     // 缩小0.1倍
 *   zoomOut(0.2)                                                  // 缩小0.2倍
 * 
 * @param {number} step - 缩小步长，默认0.1
 */
export function zoomOut(step = 0.1) {
  const { viewport } = getState()                                   // 获取当前视口状态
  const newZoom = Math.max(viewport.zoom - step, 0.1)               // 计算新缩放值，最小0.1倍
  setState({ viewport: { ...viewport, zoom: newZoom } })            // 更新视口缩放
}

/**
 * resetZoom - 重置缩放
 * 
 * 用法示例：
 *   resetZoom()                                                   // 重置为1倍
 *   resetZoom(1.5)                                                // 重置为1.5倍
 * 
 * @param {number} targetZoom - 目标缩放值，默认1
 */
export function resetZoom(targetZoom = 1) {
  const { viewport } = getState()                                   // 获取当前视口状态
  setState({ viewport: { ...viewport, zoom: targetZoom } })         // 重置视口缩放
}

/**
 * setViewport - 设置视口状态
 * 
 * 用法示例：
 *   setViewport({ x: 100, y: 100 })                               // 设置平移
 *   setViewport({ zoom: 1.5 })                                    // 设置缩放
 *   setViewport({ x: 100, y: 100, zoom: 1.5 })                    // 同时设置
 * 
 * @param {Object} newViewport - 新的视口状态，可部分更新
 */
export function setViewport(newViewport) {
  const { viewport } = getState()                                   // 获取当前视口状态
  setState({ viewport: { ...viewport, ...newViewport } })           // 合并更新视口状态
}

/**
 * importBlueprint - 导入蓝图数据
 * 
 * 用法示例：
 *   importBlueprint(jsonData)                                     // 导入JSON对象
 *   importBlueprint('{"nodes":[],"edges":[]}')                    // 导入JSON字符串
 * 
 * @param {Object|string} data - 蓝图数据，可以是对象或JSON字符串
 * @returns {boolean} - 导入是否成功
 */
export function importBlueprint(data) {
  let blueprintData = data                                          // 保存数据到变量

  if (typeof data === 'string') {                                   // 如果是字符串
    try {
      blueprintData = JSON.parse(data)                             // 尝试解析JSON
    } catch (e) {
      console.error('导入失败：JSON解析错误', e)                    // 解析失败时输出错误
      return false                                                 // 返回失败
    }
  }

  const nodes = blueprintData.nodes || []                           // 获取节点数据，默认空数组
  const edges = blueprintData.edges || []                           // 获取连接线数据，默认空数组
  const name = blueprintData.name || '我的架构'                      // 获取蓝图名称，默认"我的架构"

  setState({                                                        // 更新store状态
    nodes,                                                         // 更新节点
    edges,                                                         // 更新连接线
    blueprintName: name,                                           // 更新蓝图名称
    selectedIds: [],                                               // 清空选择
    viewport: { x: 0, y: 0, zoom: 1 }                              // 重置视口
  })

  return true                                                       // 返回成功
}

/**
 * exportBlueprint - 导出蓝图数据
 * 
 * 用法示例：
 *   const data = exportBlueprint()                                // 导出为对象
 *   const jsonStr = exportBlueprint(true)                         // 导出为JSON字符串
 * 
 * @param {boolean} asString - 是否返回JSON字符串，默认false返回对象
 * @returns {Object|string} - 蓝图数据
 */
export function exportBlueprint(asString = false) {
  const { nodes, edges, blueprintName } = getState()                // 获取蓝图数据

  const data = {                                                    // 组装导出数据
    name: blueprintName,                                           // 蓝图名称
    nodes,                                                         // 节点数据
    edges                                                          // 连接线数据
  }

  if (asString) {                                                   // 如果需要返回字符串
    return JSON.stringify(data, null, 2)                           // 格式化输出JSON字符串
  }

  return data                                                       // 返回对象
}

/**
 * setBlueprintName - 设置蓝图名称
 * 
 * 用法示例：
 *   setBlueprintName('我的新架构')                                  // 设置蓝图名称
 * 
 * @param {string} name - 新的蓝图名称
 */
export function setBlueprintName(name) {
  if (!name || typeof name !== 'string') return                     // 如果名称无效，直接返回
  setState({ blueprintName: name })                                 // 更新蓝图名称
}
