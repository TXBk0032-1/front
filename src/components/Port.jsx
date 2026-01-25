/**
 * Port.jsx - 端口组件
 * 
 * 用法说明：
 *   import { InputPort, OutputPort } from "./Port"
 *   <InputPort id="in_0" label="输入" nodeId="node_1" />
 *   <OutputPort id="out_0" label="输出" />
 * 
 * 组件职责：
 *   1. 渲染输入/输出端口的Handle和标签
 *   2. 处理输入端口的拖拽断线重连逻辑
 * 
 * 端口交互逻辑（开发目标.txt第63-69行）：
 *   - 当被鼠标按下：
 *     - 如果端口是输入口
 *       - 如果端口已经被连接
 *         - 获取该连接线的输出端口
 *         - 断开与该输出端口的连接
 *         - 重新建立与输出端口连接到鼠标
 */

import { Handle, Position } from "@xyflow/react"                  // 导入ReactFlow的Handle组件和Position常量
import { getState, setState } from "../store"                     // 导入store的状态操作函数

const DRAG_THRESHOLD = 5                                          // 拖拽检测阈值，鼠标移动超过5像素才算拖拽

// ========== 输入端口组件 ==========

/**
 * InputPort - 输入端口组件
 *
 * 用法示例：
 *   <InputPort id="in_0" label="输入A" nodeId="node_1" />
 *   <InputPort id="tensor" label="张量" nodeId="node_2" />
 *
 * 参数说明：
 *   id - 端口唯一标识
 *   label - 端口显示名称
 *   nodeId - 所属节点的id，用于查找连接线
 */
export const InputPort = ({ id, label, nodeId }) => {             // 输入端口组件，接收id、label、nodeId三个参数

  const handleMouseDown = (event) => {                            // 处理鼠标按下事件（开发目标.txt第64行：当被鼠标按下）
    const edges = getState().edges                                // 从store获取所有连接线
    const connectedEdge = edges.find(                             // 查找连接到当前输入端口的连接线（开发目标.txt第66行：如果端口已经被连接）
      e => e.target === nodeId && e.targetHandle === id           // 匹配目标节点id和目标端口id
    )
    if (!connectedEdge) return                                    // 如果没有连接线则直接返回，允许ReactFlow正常处理
    event.preventDefault()                                        // 阻止默认行为，阻止ReactFlow从InputPort发起连接
    event.stopPropagation()                                       // 阻止事件冒泡
    startDragDetection(event, connectedEdge)                      // 开始拖拽检测
  }

  return (                                                        // 返回输入端口JSX结构
    <div className="port-item">
      <Handle                                                     // ReactFlow的端口组件
        type="target"                                             // 输入端口类型是target
        position={Position.Left}                                  // 端口位置在左侧（开发目标.txt第22行：端口在左侧）
        id={id}                                                   // 端口id
        className="handle"                                        // 端口样式类
        onMouseDown={handleMouseDown}                             // 绑定鼠标按下事件
      />
      <span className="input-label">{label}</span>
    </div>
  )
}

// ========== 输出端口组件 ==========

/**
 * OutputPort - 输出端口组件
 * 
 * 用法示例：
 *   <OutputPort id="out_0" label="输出A" />
 *   <OutputPort id="result" label="结果" />
 * 
 * 参数说明：
 *   id - 端口唯一标识
 *   label - 端口显示名称
 */
export const OutputPort = ({ id, label }) => {                    // 输出端口组件，接收id和label两个参数

  return (                                                        // 返回输出端口JSX结构
    <div className="port-item">                                   
      <span className="output-label">{label}</span>               
      <Handle                                                     // ReactFlow的端口组件
        type="source"                                             // 输出端口类型是source
        position={Position.Right}                                 // 端口位置在右侧（开发目标.txt第27行：端口在右侧）
        id={id}                                                   // 端口id
        className="handle"                                        // 端口样式类
      />
    </div>
  )
}

// ========== 拖拽检测逻辑 ==========

/**
 * startDragDetection - 开始拖拽检测
 * 
 * 用法示例：
 *   startDragDetection(mouseDownEvent, edgeToRemove)
 * 
 * 功能说明：
 *   监听鼠标移动，当超过阈值时断开连接线并模拟从源端口开始拖拽
 */
const startDragDetection = (event, connectedEdge) => {            // 开始拖拽检测，接收鼠标事件和要断开的连接线
  const startX = event.clientX                                    // 记录鼠标按下时的X坐标
  const startY = event.clientY                                    // 记录鼠标按下时的Y坐标
  let hasDragged = false                                          // 标记是否已经触发拖拽

  const handleMouseMove = (moveEvent) => {                        // 处理鼠标移动事件
    const deltaX = Math.abs(moveEvent.clientX - startX)           // 计算X方向移动距离
    const deltaY = Math.abs(moveEvent.clientY - startY)           // 计算Y方向移动距离
    const isDragging = deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD  // 判断是否超过拖拽阈值
    if (hasDragged) return                                        // 如果已经触发过拖拽则直接返回
    if (!isDragging) return                                       // 如果还没超过阈值则继续等待
    hasDragged = true                                             // 标记已经触发拖拽
    removeEdgeAndSimulateDrag(connectedEdge, moveEvent)           // 断开连接线并模拟拖拽
    cleanup()                                                     // 清理事件监听
  }

  const handleMouseUp = () => cleanup()                           // 鼠标松开时清理事件监听

  const cleanup = () => {                                         // 清理函数，移除所有临时事件监听
    document.removeEventListener("mousemove", handleMouseMove)    // 移除鼠标移动监听
    document.removeEventListener("mouseup", handleMouseUp)        // 移除鼠标松开监听
  }

  document.addEventListener("mousemove", handleMouseMove)         // 添加鼠标移动监听
  document.addEventListener("mouseup", handleMouseUp)             // 添加鼠标松开监听
}

// ========== 断开连接并模拟拖拽 ==========

/**
 * removeEdgeAndSimulateDrag - 断开连接线并模拟从源端口拖拽
 *
 * 用法示例：
 *   removeEdgeAndSimulateDrag(edge, mouseEvent)
 *
 * 功能说明（开发目标.txt第67-69行）：
 *   1. 获取该连接线的输出端口
 *   2. 断开与该输出端口的连接
 *   3. 重新建立与输出端口连接到鼠标
 */
const removeEdgeAndSimulateDrag = (connectedEdge, moveEvent) => { // 断开连接并模拟拖拽，接收连接线和鼠标事件
  const sourceNodeId = connectedEdge.source                       // 获取源节点ID（开发目标.txt第67行：获取该连接线的输出端口）
  const sourceHandleId = connectedEdge.sourceHandle               // 获取源端口ID

  const sourceNode = document.querySelector(`[data-id="${sourceNodeId}"]`)  // 先查找源节点DOM元素
  if (!sourceNode) {                                              // 如果找不到源节点
    console.log('找不到源节点DOM:', sourceNodeId)                 // 输出调试信息
    return                                                        // 直接返回
  }

  const sourceHandle = sourceNode.querySelector(`.react-flow__handle[data-handleid="${sourceHandleId}"]`)  // 在节点内查找对应的handle
  if (!sourceHandle) {                                            // 如果找不到源端口
    console.log('找不到源端口DOM:', sourceHandleId)               // 输出调试信息
    return                                                        // 直接返回
  }

  const edges = getState().edges                                  // 获取当前所有连接线（先找到端口再断开，确保DOM存在）
  const newEdges = edges.filter(e => e.id !== connectedEdge.id)   // 过滤掉要断开的连接线（开发目标.txt第68行：断开与该输出端口的连接）
  setState({ edges: newEdges })                                   // 更新store中的连接线数据

  const handleRect = sourceHandle.getBoundingClientRect()         // 获取源端口的位置信息
  const handleCenterX = handleRect.left + handleRect.width / 2    // 计算端口中心X坐标
  const handleCenterY = handleRect.top + handleRect.height / 2    // 计算端口中心Y坐标

  const fakeMouseDown = new MouseEvent("mousedown", {             // 创建模拟的鼠标按下事件（开发目标.txt第69行：重新建立与输出端口连接到鼠标）
    bubbles: true,                                                // 允许事件冒泡
    cancelable: true,                                             // 允许取消事件
    clientX: handleCenterX,                                       // 使用源端口中心X坐标（从端口位置开始mousedown）
    clientY: handleCenterY,                                       // 使用源端口中心Y坐标（从端口位置开始mousedown）
    button: 0                                                     // 左键点击
  })
  sourceHandle.dispatchEvent(fakeMouseDown)                       // 在源端口上触发模拟的鼠标按下事件，让ReactFlow开始拖拽连线

  requestAnimationFrame(() => {                                   // 在下一帧触发鼠标移动事件，让连线跟随到用户鼠标位置
    const fakeMouseMove = new MouseEvent("mousemove", {           // 创建模拟的鼠标移动事件
      bubbles: true,                                              // 允许事件冒泡
      cancelable: true,                                           // 允许取消事件
      clientX: moveEvent.clientX,                                 // 移动到用户当前鼠标位置X
      clientY: moveEvent.clientY,                                 // 移动到用户当前鼠标位置Y
      button: 0                                                   // 左键
    })
    document.dispatchEvent(fakeMouseMove)                         // 在document上触发移动事件，让连接线跟随鼠标
  })
}

export default InputPort                                          // 默认导出InputPort组件
