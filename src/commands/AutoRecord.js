/**
 * AutoRecord.js - 自动历史记录
 * 
 * 用法说明：
 *   import { initAutoRecord } from './commands/AutoRecord'
 *   
 *   // 在应用初始化时调用
 *   initAutoRecord()
 * 
 * 核心职责：
 *   监听鼠标操作，在操作完成后自动记录历史
 *   避免频繁操作（如拖拽）导致历史记录爆满
 * 
 * 工作原理：
 *   1. 鼠标按下时：保存当前状态快照
 *   2. 鼠标松开时：对比状态是否变化
 *   3. 如果变化：自动调用record()记录历史
 */

import { getState } from '../store'                                 // 导入状态获取函数
import { record } from './History'                                  // 导入历史记录函数

let snapshotBeforeAction = null                                     // 保存操作前的状态快照

/**
 * captureSnapshot - 捕获当前状态快照
 * 
 * 用法示例：
 *   captureSnapshot()                                             // 保存当前nodes和edges的快照
 * 
 * @returns {Object} - 返回状态快照对象
 */
function captureSnapshot() {
    const { nodes, edges } = getState()                               // 获取当前节点和连接线

    return {                                                          // 返回快照对象
        nodes: JSON.stringify(nodes),                                  // 序列化节点数据用于对比
        edges: JSON.stringify(edges)                                   // 序列化连接线数据用于对比
    }
}

/**
 * hasStateChanged - 检查状态是否发生变化
 * 
 * 用法示例：
 *   if (hasStateChanged(snapshot)) { record() }                   // 状态变化时记录
 * 
 * @param {Object} snapshot - 之前保存的快照
 * @returns {boolean} - 状态是否发生变化
 */
function hasStateChanged(snapshot) {
    if (!snapshot) return false                                       // 如果没有快照，返回false

    const currentSnapshot = captureSnapshot()                         // 获取当前状态快照

    const nodesChanged = currentSnapshot.nodes !== snapshot.nodes     // 检查节点是否变化
    const edgesChanged = currentSnapshot.edges !== snapshot.edges     // 检查连接线是否变化

    return nodesChanged || edgesChanged                               // 任一变化即返回true
}

/**
 * handleMouseDown - 处理鼠标按下事件
 * 
 * 用法示例：
 *   document.addEventListener('mousedown', handleMouseDown)
 * 
 * 功能说明：
 *   在鼠标按下时保存当前状态快照，用于后续对比
 */
function handleMouseDown() {
    snapshotBeforeAction = captureSnapshot()                          // 保存操作前的状态快照
}

/**
 * handleMouseUp - 处理鼠标松开事件
 * 
 * 用法示例：
 *   document.addEventListener('mouseup', handleMouseUp)
 * 
 * 功能说明：
 *   在鼠标松开时检查状态是否变化，如果变化则自动记录历史
 */
function handleMouseUp() {
    if (!snapshotBeforeAction) return                                 // 如果没有快照，直接返回

    if (hasStateChanged(snapshotBeforeAction)) {                      // 检查状态是否变化
        record('操作完成')                                               // 自动记录历史
    }

    snapshotBeforeAction = null                                       // 清空快照
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
    document.addEventListener('mousedown', handleMouseDown)           // 监听鼠标按下事件
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
    document.removeEventListener('mousedown', handleMouseDown)        // 移除鼠标按下监听
    document.removeEventListener('mouseup', handleMouseUp)            // 移除鼠标松开监听

    snapshotBeforeAction = null                                       // 清空快照

    console.log('[AutoRecord] 自动历史记录已禁用')                    // 输出日志
}
