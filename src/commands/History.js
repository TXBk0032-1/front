/**
 * History.js - 历史记录命令
 * 
 * 用法说明：
 *   import { record, undo, redo } from './commands/History'
 *   
 *   // 记录当前状态
 *   record()
 *   
 *   // 撤销
 *   undo()
 *   
 *   // 重做
 *   redo()
 * 
 * 核心职责：
 *   提供历史记录相关的所有命令，包括记录、撤销、重做
 *   用于支持撤销/重做操作
 */

import { getState, setState } from '../store'                       // 导入状态获取和设置函数

const MAX_HISTORY = 50                                              // 最大历史记录数量，防止内存占用过大

/**
 * record - 记录当前状态到历史
 * 
 * 用法示例：
 *   record()                                                      // 记录当前状态
 *   record('创建节点')                                             // 带描述的记录
 * 
 * @param {string} description - 操作描述，可选，用于调试
 */
export function record(description = '') {
  const { nodes, edges, history, historyIndex } = getState()        // 获取当前状态
  console.log(`[History] Recording: ${description}. Current Index: ${historyIndex}, History Length: ${history.length}`); // 打印记录日志

  const snapshot = {                                                // 创建状态快照
    nodes: JSON.parse(JSON.stringify(nodes)),                      // 深拷贝节点数据
    edges: JSON.parse(JSON.stringify(edges)),                      // 深拷贝连接线数据
    description,                                                   // 操作描述
    timestamp: Date.now()                                          // 记录时间戳
  }

  let newHistory = history.slice(0, historyIndex + 1)               // 截取历史到当前索引位置（丢弃之后的记录）

  newHistory.push(snapshot)                                         // 添加新快照

  if (newHistory.length > MAX_HISTORY) {                            // 如果超过最大数量
    newHistory = newHistory.slice(-MAX_HISTORY)                    // 只保留最近的记录
  }

  setState({                                                        // 更新状态
    history: newHistory,                                           // 更新历史记录
    historyIndex: newHistory.length - 1                            // 更新当前索引
  })
}

/**
 * undo - 撤销操作
 * 
 * 用法示例：
 *   undo()                                                        // 撤销一步
 * 
 * @returns {boolean} - 是否成功撤销
 */
export function undo() {
  const { history, historyIndex } = getState()                      // 获取历史记录和当前索引
  console.log(`[History] Undo attempt. Current Index: ${historyIndex}`); // 打印撤销尝试日志

  if (historyIndex <= 0) {                                          // 如果已经是最早的状态
    console.log('undo: 已经是最早的状态，无法撤销')                  // 输出提示
    return false                                                   // 返回失败
  }

  const prevIndex = historyIndex - 1                                // 计算上一个索引
  const snapshot = history[prevIndex]                               // 获取上一个快照

  if (!snapshot) {                                                  // 如果快照不存在
    console.error('undo: 快照不存在')                              // 输出错误
    return false                                                   // 返回失败
  }

  setState({                                                        // 更新状态
    nodes: JSON.parse(JSON.stringify(snapshot.nodes)),             // 恢复节点数据（深拷贝防止引用问题）
    edges: JSON.parse(JSON.stringify(snapshot.edges)),             // 恢复连接线数据
    historyIndex: prevIndex                                        // 更新当前索引
  })

  return true                                                       // 返回成功
}

/**
 * redo - 重做操作
 * 
 * 用法示例：
 *   redo()                                                        // 重做一步
 * 
 * @returns {boolean} - 是否成功重做
 */
export function redo() {
  const { history, historyIndex } = getState()                      // 获取历史记录和当前索引
  console.log(`[History] Redo attempt. Current Index: ${historyIndex}, History Length: ${history.length}`); // 打印重做尝试日志

  if (historyIndex >= history.length - 1) {                         // 如果已经是最新的状态
    console.log('redo: 已经是最新的状态，无法重做')                  // 输出提示
    return false                                                   // 返回失败
  }

  const nextIndex = historyIndex + 1                                // 计算下一个索引
  const snapshot = history[nextIndex]                               // 获取下一个快照

  if (!snapshot) {                                                  // 如果快照不存在
    console.error('redo: 快照不存在')                              // 输出错误
    return false                                                   // 返回失败
  }

  setState({                                                        // 更新状态
    nodes: JSON.parse(JSON.stringify(snapshot.nodes)),             // 恢复节点数据
    edges: JSON.parse(JSON.stringify(snapshot.edges)),             // 恢复连接线数据
    historyIndex: nextIndex                                        // 更新当前索引
  })

  return true                                                       // 返回成功
}

/**
 * canUndo - 检查是否可以撤销
 * 
 * 用法示例：
 *   if (canUndo()) { undo() }                                     // 检查后再撤销
 * 
 * @returns {boolean} - 是否可以撤销
 */
export function canUndo() {
  const { historyIndex } = getState()                               // 获取当前索引
  return historyIndex > 0                                           // 索引大于0表示可以撤销
}

/**
 * canRedo - 检查是否可以重做
 * 
 * 用法示例：
 *   if (canRedo()) { redo() }                                     // 检查后再重做
 * 
 * @returns {boolean} - 是否可以重做
 */
export function canRedo() {
  const { history, historyIndex } = getState()                      // 获取历史记录和当前索引
  return historyIndex < history.length - 1                          // 索引小于最大索引表示可以重做
}

/**
 * clearHistory - 清空历史记录
 * 
 * 用法示例：
 *   clearHistory()                                                // 清空所有历史记录
 */
export function clearHistory() {
  setState({                                                        // 更新状态
    history: [],                                                   // 清空历史记录
    historyIndex: -1                                               // 重置索引
  })
}

/**
 * getHistoryInfo - 获取历史记录信息
 * 
 * 用法示例：
 *   const info = getHistoryInfo()
 *   console.log(info.canUndo, info.canRedo, info.current)
 * 
 * @returns {Object} - 历史记录信息对象
 */
export function getHistoryInfo() {
  const { history, historyIndex } = getState()                      // 获取历史记录和当前索引

  return {                                                          // 返回历史信息对象
    total: history.length,                                         // 总记录数
    current: historyIndex,                                         // 当前索引
    canUndo: historyIndex > 0,                                     // 是否可以撤销
    canRedo: historyIndex < history.length - 1                     // 是否可以重做
  }
}
