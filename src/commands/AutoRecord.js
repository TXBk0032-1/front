/**
 * AutoRecord.js - 自动历史记录
 *
 * 用法说明：
 *   import { initAutoRecord, checkAndRecord } from './commands/AutoRecord'
 *
 *   // 在应用初始化时调用
 *   initAutoRecord()
 *
 *   // 在特定事件中手动调用
 *   checkAndRecord()  // 例如在拖拽结束时
 *
 * 核心职责：
 *   监听鼠标操作和拖拽事件，在操作完成后自动记录历史
 *   避免频繁操作（如拖拽）导致历史记录爆满
 *
 * 工作原理：
 *   对比当前状态和历史记录当前项，如果不同则记录
 *   撤销/重做后状态等于历史记录，自动跳过不记录
 */

import { getState } from '../store'                                 // 导入状态获取函数
import { record } from './History'                                  // 导入历史记录函数

/**
 * checkAndRecord - 检查状态变化并记录
 *
 * 用法示例：
 *   checkAndRecord()                                              // 检查并记录
 *   checkAndRecord('拖拽结束')                                     // 带描述的记录
 *
 * 功能说明：
 *   对比当前状态和历史记录当前项，如果不同则自动记录
 *   如果相同（如撤销/重做后），则自动跳过
 *
 * @param {string} description - 操作描述，可选
 */
export function checkAndRecord(description = '操作完成') {
  const { nodes, edges, history, historyIndex } = getState()        // 获取当前状态和历史记录

  const currentSnapshot = history[historyIndex]                     // 获取历史记录当前项

  if (!currentSnapshot) {                                           // 如果没有历史记录
    record(description)                                             // 直接记录
    return                                                          // 返回
  }

  const currentNodesStr = JSON.stringify(nodes)                     // 序列化当前节点
  const currentEdgesStr = JSON.stringify(edges)                     // 序列化当前连接线

  const historyNodesStr = JSON.stringify(currentSnapshot.nodes)     // 序列化历史节点
  const historyEdgesStr = JSON.stringify(currentSnapshot.edges)     // 序列化历史连接线

  const nodesChanged = currentNodesStr !== historyNodesStr          // 检查节点是否变化
  const edgesChanged = currentEdgesStr !== historyEdgesStr          // 检查连接线是否变化

  if (nodesChanged || edgesChanged) {                               // 如果有任何变化
    record(description)                                             // 自动记录历史
  }
}

/**
 * handleMouseUp - 处理鼠标松开事件
 * 
 * 用法示例：
 *   document.addEventListener('mouseup', handleMouseUp)
 * 
 * 功能说明：
 *   在鼠标松开时检查状态并记录
 */
function handleMouseUp() {
  checkAndRecord('鼠标操作')                                         // 调用统一的检查记录函数
}

/**
 * initAutoRecord - 初始化自动记录功能
 * 
 * 用法示例：
 *   initAutoRecord()                                              // 在应用启动时调用
 * 
 * 功能说明：
 *   添加全局鼠标事件监听器，实现自动历史记录
 */
export function initAutoRecord() {
  document.addEventListener('mouseup', handleMouseUp)               // 监听鼠标松开事件

  console.log('[AutoRecord] 自动历史记录已启用')                    // 输出日志
}

/**
 * destroyAutoRecord - 销毁自动记录功能
 * 
 * 用法示例：
 *   destroyAutoRecord()                                           // 在应用卸载时调用
 * 
 * 功能说明：
 *   移除全局事件监听器，清理资源
 */
export function destroyAutoRecord() {
  document.removeEventListener('mouseup', handleMouseUp)            // 移除鼠标松开监听

  console.log('[AutoRecord] 自动历史记录已禁用')                    // 输出日志
}
