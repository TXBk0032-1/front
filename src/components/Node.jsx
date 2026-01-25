/**
 * Node.jsx - 节点组件
 * 
 * 用法说明：
 *   在ReactFlow的nodeTypes中注册使用
 *   const nodeTypes = { baseNode: Node }
 *   <ReactFlow nodeTypes={nodeTypes} />
 * 
 * 组件职责：
 *   1. 渲染节点的输入端口组、节点名称、输出端口组
 *   2. 处理节点的点击、右键、双击事件
 *   3. 处理输入端口的拖拽断线重连逻辑
 *   4. 调用全局命令来修改store实现节点操作
 * 
 * 节点交互逻辑（开发目标.txt第51-62行）：
 *   - 当被鼠标单击：如果按下Ctrl则切换选择当前节点，否则清空节点选择
 *   - 当被鼠标右键点击：选择当前节点，绑定节点菜单和节点面板的跟随id为当前节点id，显示节点菜单和节点面板
 *   - 双击节点：重命名节点
 * 
 * 端口交互逻辑（开发目标.txt第63-69行）：
 *   - 当输入端口被鼠标按下且已有连接：
 *     - 获取该连接线的输出端口
 *     - 断开与该输出端口的连接
 *     - 重新建立与输出端口连接到鼠标
 */

import { Handle, Position, useEdges, useReactFlow } from "@xyflow/react"  // 导入ReactFlow的Handle组件、Position常量和hooks
import { setState, getState } from "../store"                     // 导入store的状态操作函数
import "../styles/Node.css"                                       // 导入节点样式

const DRAG_THRESHOLD = 5                                          // 拖拽检测阈值，鼠标移动超过5像素才算拖拽

// ========== 输入端口组件 ==========

/**
 * InputPort - 输入端口组件
 * 
 * 用法示例：
 *   <InputPort portName="输入A" nodeId="node_1" edges={edges} setEdges={setEdges} />
 * 
 * 参数说明：
 *   portName - 端口名称，同时作为端口id和显示标签
 *   nodeId - 所属节点的id，用于查找连接线
 *   edges - 当前所有连接线数组（来自useEdges）
 *   setEdges - 更新连接线的函数（来自useReactFlow）
 * 
 * 端口交互逻辑（开发目标.txt第63-69行）：
 *   - 当被鼠标按下且端口已被连接：拖拽断线重连
 */
const InputPort = ({ portName, nodeId, edges, setEdges }) => {    // 输入端口组件，接收端口名、节点id、edges和setEdges

  const handleMouseDown = (event) => {                            // 处理鼠标按下事件（开发目标.txt第64行：当被鼠标按下）
    const connectedEdge = findConnectedEdge(edges, nodeId, portName)  // 查找连接到当前输入端口的连接线（开发目标.txt第66行：如果端口已经被连接）
    if (!connectedEdge) return                                    // 如果没有连接线则直接返回，允许ReactFlow正常处理
    event.stopPropagation()                                       // 阻止事件冒泡
    startDragDetection(event, connectedEdge, setEdges)            // 开始拖拽检测
  }

  return (                                                        // 返回输入端口JSX结构
    <div className="port-item">
      <Handle                                                     // ReactFlow的端口组件
        type="target"                                             // 输入端口类型是target
        position={Position.Left}                                  // 端口位置在左侧（开发目标.txt第22行：端口在左侧）
        id={portName}                                             // 端口id就是端口名，registry中端口格式是字符串数组
        className="handle"                                        // 端口样式类
        onMouseDown={handleMouseDown}                             // 绑定鼠标按下事件
      />
      <span className="input-label">{portName}</span>             {/* 端口名直接显示 */}
    </div>
  )
}

// ========== 输出端口组件 ==========

/**
 * OutputPort - 输出端口组件
 * 
 * 用法示例：
 *   <OutputPort portName="输出A" />
 * 
 * 参数说明：
 *   portName - 端口名称，同时作为端口id和显示标签
 */
const OutputPort = ({ portName }) => (                            // 输出端口组件，接收端口名
  <div className="port-item">
    <span className="output-label">{portName}</span>              {/* 端口名直接显示 */}
    <Handle                                                       // ReactFlow的端口组件
      type="source"                                               // 输出端口类型是source
      position={Position.Right}                                   // 端口位置在右侧（开发目标.txt第27行：端口在右侧）
      id={portName}                                               // 端口id就是端口名，registry中端口格式是字符串数组
      className="handle"                                          // 端口样式类
    />
  </div>
)

// ========== 节点主组件 ==========

const Node = ({ id, data }) => {                                  // 节点组件，接收id和data作为props，id是节点唯一标识，data包含节点数据

  const edges = useEdges()                                        // 获取当前所有连接线（ReactFlow的响应式hook）
  const { setEdges } = useReactFlow()                             // 获取更新连接线的函数（ReactFlow的响应式hook）

  const color = data?.color || "rgb(137, 146, 235)"               // 节点颜色，如果没有传入则使用默认紫色
  const label = data?.name || data?.label || "未命名节点"           // 节点名称，优先使用name字段，其次label，最后默认名称
  const ports = data?.ports || { in: [], out: [] }                // 端口定义，格式为 { in: ["端口名"], out: ["端口名"] }
  const inputs = ports.in || []                                   // 输入端口名数组，从ports.in获取
  const outputs = ports.out || []                                 // 输出端口名数组，从ports.out获取

  // ========== 事件处理函数 ==========

  const handleClick = (event) => {                                // 处理鼠标单击事件
    event.stopPropagation()                                       // 阻止事件冒泡，防止触发蓝图的空白点击
    const isCtrl = event.ctrlKey || event.metaKey                 // 检查是否按下了Ctrl键（Mac上是Command键）
    if (isCtrl) {                                                 // 如果按下Ctrl（开发目标.txt第52-56行：如果按下Ctrl则切换选择当前节点）
      window.cmd.toggleSelectNode(id)                             // 调用切换选中命令，切换当前节点的选中状态
    } else {                                                      // 否则清空节点选择（开发目标.txt第55-56行：否则清空节点选择）
      window.cmd.clearSelect()                                    // 清空所有选中
      window.cmd.selectNode(id)                                   // 选中当前节点
    }
  }

  const handleContextMenu = (event) => {                          // 处理鼠标右键点击事件（开发目标.txt第57-60行）
    event.preventDefault()                                        // 阻止浏览器默认的右键菜单
    event.stopPropagation()                                       // 阻止事件冒泡
    window.cmd.selectNode(id)                                     // 选择当前节点（开发目标.txt第58行）
    setState({                                                    // 绑定节点菜单和节点面板的跟随id为当前节点id（开发目标.txt第59行）
      nodeMenu: { visible: true, nodeId: id },                    // 显示节点菜单并绑定到当前节点
      nodePanel: { visible: true, nodeId: id }                    // 显示节点面板并绑定到当前节点（开发目标.txt第60行：显示节点菜单和节点面板）
    })
  }

  const handleDoubleClick = (event) => {                          // 处理鼠标双击事件（开发目标.txt第61-62行：双击节点重命名节点）
    event.stopPropagation()                                       // 阻止事件冒泡
    window.cmd.selectNode(id)                                     // 先选中当前节点
    const node = getState().nodes.find(n => n.id === id)          // 从store中找到当前节点
    const currentLabel = node?.data?.name || ""                   // 获取当前节点的名称，ReactFlow格式中name在data里面
    setState({                                                    // 设置重命名弹窗状态
      renameModal: {                                              // 打开重命名弹窗
        visible: true,                                            // 显示弹窗
        nodeIds: [id],                                            // 要重命名的节点id数组
        placeholder: currentLabel,                                // 占位符为当前名称
        value: currentLabel                                       // 输入框初始值为当前名称
      }
    })
  }

  // ========== 渲染节点 ==========

  return (                                                        // 返回节点JSX结构
    <div                                                          // 节点容器div
      className="container"                                       // 使用Node.css中定义的container类
      style={{ background: color, "--node-color": color }}        // 设置背景色和CSS变量
      onClick={handleClick}                                       // 绑定点击事件处理函数
      onDoubleClick={handleDoubleClick}                           // 绑定双击事件处理函数
      onContextMenu={handleContextMenu}                           // 绑定右键事件处理函数
    >
      {/* 左侧：输入端口组（开发目标.txt第21-23行） */}
      <div className="port-container">
        {inputs.map((portName, index) => (                        // 遍历输入端口名数组，registry中ports.in格式为["端口名"]
          <InputPort                                              // 使用InputPort组件渲染输入端口
            key={`in-${index}`}                                   // React需要的key
            portName={portName}                                   // 端口名
            nodeId={id}                                           // 节点id
            edges={edges}                                         // 传入edges供查找连接线
            setEdges={setEdges}                                   // 传入setEdges供断开连接线
          />
        ))}
      </div>

      {/* 中间：节点名称（开发目标.txt第24行） */}
      <div className="title-container">
        <div className="title">{label}</div>
      </div>

      {/* 右侧：输出端口组（开发目标.txt第25-27行） */}
      <div className="port-container">
        {outputs.map((portName, index) => (                       // 遍历输出端口名数组，registry中ports.out格式为["端口名"]
          <OutputPort                                             // 使用OutputPort组件渲染输出端口
            key={`out-${index}`}                                  // React需要的key
            portName={portName}                                   // 端口名
          />
        ))}
      </div>
    </div>
  )
}

// ========== 辅助函数 ==========

/**
 * findConnectedEdge - 查找连接到指定输入端口的连接线
 * 
 * 用法示例：
 *   const edge = findConnectedEdge(edges, "node_1", "输入A")
 * 
 * 参数说明：
 *   edges - 所有连接线数组
 *   nodeId - 目标节点id
 *   handleId - 目标端口id（端口名）
 * 
 * 返回值：找到的连接线对象，或undefined
 */
function findConnectedEdge(edges, nodeId, handleId) {             // 查找连接到指定输入端口的连接线
  return edges.find(                                              // 在edges数组中查找
    (edge) => edge.target === nodeId && edge.targetHandle === handleId  // 匹配目标节点id和目标端口id
  )
}

/**
 * startDragDetection - 开始拖拽检测
 * 
 * 用法示例：
 *   startDragDetection(mouseDownEvent, edgeToRemove, setEdges)
 * 
 * 功能说明：
 *   监听鼠标移动，当超过阈值时断开连接线并模拟从源端口开始拖拽
 */
function startDragDetection(event, connectedEdge, setEdges) {     // 开始拖拽检测，接收鼠标事件、要断开的连接线和setEdges函数
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
    setEdges((eds) => eds.filter((e) => e.id !== connectedEdge.id))  // 使用ReactFlow的setEdges删除连接线（开发目标.txt第68行：断开与该输出端口的连接）
    simulateMouseDownOnSourcePort(connectedEdge, moveEvent)       // 模拟从源端口开始拖拽（开发目标.txt第69行：重新建立与输出端口连接到鼠标）
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

/**
 * simulateMouseDownOnSourcePort - 模拟在源端口上触发鼠标按下事件
 * 
 * 用法示例：
 *   simulateMouseDownOnSourcePort(edge, mouseEvent)
 * 
 * 功能说明（开发目标.txt第67-69行）：
 *   1. 获取该连接线的输出端口DOM元素
 *   2. 在源端口上触发模拟的mousedown事件
 *   3. 让ReactFlow开始从源端口拖拽连线到鼠标位置
 */
function simulateMouseDownOnSourcePort(connectedEdge, moveEvent) {  // 模拟从源端口开始拖拽
  const sourceSelector = `[data-nodeid="${connectedEdge.source}"][data-handleid="${connectedEdge.sourceHandle}"]`  // 构建源端口的CSS选择器（开发目标.txt第67行：获取该连接线的输出端口）
  const sourceHandle = document.querySelector(sourceSelector)     // 查找源端口DOM元素
  if (!sourceHandle) return                                       // 如果找不到则直接返回

  const fakeMouseDown = new MouseEvent("mousedown", {             // 创建模拟的鼠标按下事件（开发目标.txt第69行：重新建立与输出端口连接到鼠标）
    bubbles: true,                                                // 允许事件冒泡
    cancelable: true,                                             // 允许取消事件
    clientX: moveEvent.clientX,                                   // 使用当前鼠标X坐标
    clientY: moveEvent.clientY,                                   // 使用当前鼠标Y坐标
    button: 0                                                     // 左键点击
  })
  sourceHandle.dispatchEvent(fakeMouseDown)                       // 在源端口上触发模拟的鼠标按下事件，让ReactFlow开始拖拽连线
}

export default Node                                               // 导出节点组件供Blueprint.jsx使用
