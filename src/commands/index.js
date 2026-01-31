/**
 * index.js - 全局命令挂载
 * 
 * 用法说明：
 *   // 在main.jsx中导入此文件即可
 *   import './commands'
 *   
 *   // 然后在任意位置都可以通过window调用命令
 *   window.cmd.createNode('Conv2D', { x: 100, y: 100 })
 *   window.cmd.undo()
 *   window.cmd.zoomIn()
 * 
 * 核心职责：
 *   将所有命令函数挂载到window.cmd上，实现全局可随意调用
 */

// ========== 导入蓝图相关命令 ==========
import {                                                            // 从Blueprint.js导入蓝图命令
  arrange,                                                         // 整理节点布局
  zoomIn,                                                          // 放大视口
  zoomOut,                                                         // 缩小视口
  resetZoom,                                                       // 重置缩放
  setViewport,                                                     // 设置视口状态
  importBlueprint,                                                 // 导入蓝图数据
  exportBlueprint,                                                 // 导出蓝图数据
  setBlueprintName                                                 // 设置蓝图名称
} from './Blueprint'

// ========== 导入节点相关命令 ==========
import {                                                            // 从Node.js导入节点命令
  selectNode,                                                      // 选中节点
  toggleSelectNode,                                                // 切换节点选中状态
  clearSelect,                                                     // 清空节点选择
  createNode,                                                      // 创建节点
  deleteNode,                                                      // 删除节点
  deleteSelectedNodes,                                             // 删除选中的节点
  renameNode,                                                      // 重命名节点
  updateNodeParam,                                                 // 更新节点参数
  moveNode,                                                        // 移动节点
  getNodeById,                                                     // 根据ID获取节点
  getSelectedNodes                                                 // 获取选中的节点
} from './Node'

// ========== 导入连接线相关命令 ==========
import {                                                            // 从Edge.js导入连接线命令
  createEdge,                                                      // 创建连接线
  deleteEdge,                                                      // 删除连接线
  getEdgesByNode,                                                  // 获取节点相关的连接线
  getEdgeByPort,                                                   // 获取端口的连接线
  getConnectedEdgeFromInputPort                                    // 获取输入端口的连接线
} from './Edge'

// ========== 导入历史记录命令 ==========
import {                                                            // 从History.js导入历史记录命令
  record,                                                          // 记录状态
  undo,                                                            // 撤销
  redo,                                                            // 重做
  canUndo,                                                         // 检查是否可撤销
  canRedo,                                                         // 检查是否可重做
  clearHistory,                                                    // 清空历史记录
  getHistoryInfo                                                   // 获取历史记录信息
} from './History'

// ========== 导入剪贴板命令 ==========
import {                                                            // 从Clipboard.js导入剪贴板命令
  copy,                                                            // 复制节点
  paste,                                                           // 粘贴节点
  copyAndPaste,                                                    // 复制并粘贴
  hasClipboardContent,                                             // 检查剪贴板内容
  clearClipboard                                                   // 清空剪贴板
} from './Clipboard'

// ========== 导入自动记录功能 ==========
import { initAutoRecord } from './AutoRecord'                       // 导入自动记录初始化函数

// ========== 创建命令对象 ==========
const cmd = {                                                       // 创建包含所有命令的对象

  // ----- 蓝图命令 -----
  arrange,                                                         // 整理节点布局
  zoomIn,                                                          // 放大视口
  zoomOut,                                                         // 缩小视口
  resetZoom,                                                       // 重置缩放
  setViewport,                                                     // 设置视口状态
  importBlueprint,                                                 // 导入蓝图数据
  exportBlueprint,                                                 // 导出蓝图数据
  setBlueprintName,                                                // 设置蓝图名称

  // ----- 节点命令 -----
  selectNode,                                                      // 选中节点
  toggleSelectNode,                                                // 切换节点选中状态
  clearSelect,                                                     // 清空节点选择
  createNode,                                                      // 创建节点
  deleteNode,                                                      // 删除节点
  deleteSelectedNodes,                                             // 删除选中的节点
  renameNode,                                                      // 重命名节点
  updateNodeParam,                                                 // 更新节点参数
  moveNode,                                                        // 移动节点
  getNodeById,                                                     // 根据ID获取节点
  getSelectedNodes,                                                // 获取选中的节点

  // ----- 连接线命令 -----
  createEdge,                                                      // 创建连接线
  deleteEdge,                                                      // 删除连接线
  getEdgesByNode,                                                  // 获取节点相关的连接线
  getEdgeByPort,                                                   // 获取端口的连接线
  getConnectedEdgeFromInputPort,                                   // 获取输入端口的连接线

  // ----- 历史记录命令 -----
  record,                                                          // 记录状态
  undo,                                                            // 撤销
  redo,                                                            // 重做
  canUndo,                                                         // 检查是否可撤销
  canRedo,                                                         // 检查是否可重做
  clearHistory,                                                    // 清空历史记录
  getHistoryInfo,                                                  // 获取历史记录信息

  // ----- 剪贴板命令 -----
  copy,                                                            // 复制节点
  paste,                                                           // 粘贴节点
  copyAndPaste,                                                    // 复制并粘贴
  hasClipboardContent,                                             // 检查剪贴板内容
  clearClipboard                                                   // 清空剪贴板
}

// ========== 挂载到window ==========
window.cmd = cmd                                                    // 将命令对象挂载到window上，实现全局访问

// ========== 初始化历史记录 ==========
record('初始状态')                                                   // 记录初始状态，确保第一次操作后可以撤销

// ========== 初始化自动记录 ==========
initAutoRecord()                                                    // 启用基于鼠标事件的自动历史记录

// ========== 导出命令对象 ==========
export default cmd                                                  // 默认导出命令对象，支持import方式使用

// ========== 同时导出所有命令函数 ==========
export {                                                            // 具名导出所有命令，支持按需导入
  // 蓝图命令
  arrange,
  zoomIn,
  zoomOut,
  resetZoom,
  setViewport,
  importBlueprint,
  exportBlueprint,
  setBlueprintName,
  // 节点命令
  selectNode,
  toggleSelectNode,
  clearSelect,
  createNode,
  deleteNode,
  deleteSelectedNodes,
  renameNode,
  updateNodeParam,
  moveNode,
  getNodeById,
  getSelectedNodes,
  // 连接线命令
  createEdge,
  deleteEdge,
  getEdgesByNode,
  getEdgeByPort,
  getConnectedEdgeFromInputPort,
  // 历史记录命令
  record,
  undo,
  redo,
  canUndo,
  canRedo,
  clearHistory,
  getHistoryInfo,
  // 剪贴板命令
  copy,
  paste,
  copyAndPaste,
  hasClipboardContent,
  clearClipboard
}
