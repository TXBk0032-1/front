/**
 * position.js - 坐标转换工具
 * 
 * 用法说明：
 *   import { screenToCanvas, canvasToScreen } from './utils/position'
 *   
 *   // 屏幕坐标转画布坐标（比如把鼠标点击位置转为画布上的位置）
 *   const canvasPos = screenToCanvas(mouseX, mouseY, viewport)
 *   
 *   // 画布坐标转屏幕坐标（比如把节点位置转为屏幕上显示的位置）
 *   const screenPos = canvasToScreen(nodeX, nodeY, viewport)
 * 
 * 核心职责：
 *   实现画布坐标与屏幕坐标的相互转换
 *   考虑视口的平移(x,y)和缩放(zoom)因素
 */

import { getState } from '../store'                                 // 导入获取全局状态的函数

/**
 * screenToCanvas - 屏幕坐标转画布坐标
 * 
 * 用法示例：
 *   screenToCanvas(100, 200)                                      // 使用store中的viewport
 *   screenToCanvas(100, 200, { x: 50, y: 50, zoom: 1.5 })         // 使用自定义viewport
 *   screenToCanvas({ x: 100, y: 200 })                            // 传入对象格式
 *   screenToCanvas(event)                                         // 传入鼠标事件对象
 * 
 * @param {number|Object|Event} xOrObj - X坐标，或包含x/y的对象，或鼠标事件
 * @param {number} y - Y坐标（当第一个参数是数字时必填）
 * @param {Object} viewport - 视口状态，可选，默认从store获取
 * @returns {Object} - 返回 { x, y } 画布坐标
 */
export function screenToCanvas(xOrObj, y, viewport) {
  let screenX, screenY                                              // 声明屏幕坐标变量

  if (typeof xOrObj === 'number') {                                 // 如果第一个参数是数字
    screenX = xOrObj                                               // 直接使用作为X坐标
    screenY = y                                                    // 第二个参数作为Y坐标
  } else if (xOrObj?.clientX !== undefined) {                      // 如果是鼠标事件对象
    screenX = xOrObj.clientX                                       // 从事件中获取X坐标
    screenY = xOrObj.clientY                                       // 从事件中获取Y坐标
  } else if (xOrObj?.x !== undefined) {                            // 如果是普通对象
    screenX = xOrObj.x                                             // 从对象中获取X坐标
    screenY = xOrObj.y                                             // 从对象中获取Y坐标
  } else {                                                          // 参数格式不正确
    return { x: 0, y: 0 }                                          // 返回默认坐标
  }

  const vp = viewport || getState().viewport                        // 获取视口状态，优先使用传入的，否则从store获取
  const { x: offsetX, y: offsetY, zoom } = vp                      // 解构视口的偏移量和缩放比例

  const canvasX = (screenX - offsetX) / zoom                        // 计算画布X坐标：(屏幕坐标 - 偏移量) / 缩放比例
  const canvasY = (screenY - offsetY) / zoom                        // 计算画布Y坐标：(屏幕坐标 - 偏移量) / 缩放比例

  return { x: canvasX, y: canvasY }                                 // 返回画布坐标
}

/**
 * canvasToScreen - 画布坐标转屏幕坐标
 * 
 * 用法示例：
 *   canvasToScreen(100, 200)                                      // 使用store中的viewport
 *   canvasToScreen(100, 200, { x: 50, y: 50, zoom: 1.5 })         // 使用自定义viewport
 *   canvasToScreen({ x: 100, y: 200 })                            // 传入对象格式
 * 
 * @param {number|Object} xOrObj - X坐标，或包含x/y的对象
 * @param {number} y - Y坐标（当第一个参数是数字时必填）
 * @param {Object} viewport - 视口状态，可选，默认从store获取
 * @returns {Object} - 返回 { x, y } 屏幕坐标
 */
export function canvasToScreen(xOrObj, y, viewport) {
  let canvasX, canvasY                                              // 声明画布坐标变量

  if (typeof xOrObj === 'number') {                                 // 如果第一个参数是数字
    canvasX = xOrObj                                               // 直接使用作为X坐标
    canvasY = y                                                    // 第二个参数作为Y坐标
  } else if (xOrObj?.x !== undefined) {                            // 如果是普通对象
    canvasX = xOrObj.x                                             // 从对象中获取X坐标
    canvasY = xOrObj.y                                             // 从对象中获取Y坐标
  } else {                                                          // 参数格式不正确
    return { x: 0, y: 0 }                                          // 返回默认坐标
  }

  const vp = viewport || getState().viewport                        // 获取视口状态，优先使用传入的，否则从store获取
  const { x: offsetX, y: offsetY, zoom } = vp                      // 解构视口的偏移量和缩放比例

  const screenX = canvasX * zoom + offsetX                          // 计算屏幕X坐标：画布坐标 * 缩放比例 + 偏移量
  const screenY = canvasY * zoom + offsetY                          // 计算屏幕Y坐标：画布坐标 * 缩放比例 + 偏移量

  return { x: screenX, y: screenY }                                 // 返回屏幕坐标
}

/**
 * getMouseCanvasPosition - 获取鼠标在画布上的位置
 * 
 * 用法示例：
 *   getMouseCanvasPosition(event)                                 // 传入鼠标事件
 *   getMouseCanvasPosition(event, containerRef.current)           // 传入容器元素，计算相对位置
 * 
 * @param {Event} event - 鼠标事件对象
 * @param {HTMLElement} container - 容器元素，可选，用于计算相对位置
 * @returns {Object} - 返回 { x, y } 画布坐标
 */
export function getMouseCanvasPosition(event, container) {
  let screenX = event.clientX                                       // 获取鼠标在视口中的X坐标
  let screenY = event.clientY                                       // 获取鼠标在视口中的Y坐标

  if (container) {                                                  // 如果传入了容器元素
    const rect = container.getBoundingClientRect()                 // 获取容器的边界信息
    screenX = event.clientX - rect.left                            // 计算相对于容器的X坐标
    screenY = event.clientY - rect.top                             // 计算相对于容器的Y坐标
  }

  return screenToCanvas(screenX, screenY)                           // 转换为画布坐标并返回
}
