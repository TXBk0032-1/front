/**
 * Node.jsx - 节点组件
 * 
 * 用法说明：
 *   在ReactFlow的nodeTypes中注册使用
 *   const nodeTypes = { custom: Node }
 *   <ReactFlow nodeTypes={nodeTypes} />
 * 
 * 组件职责：
 *   1. 渲染节点的输入端口组、节点名称、输出端口组
 *   2. 处理节点的点击、右键、双击事件
 *   3. 调用全局命令来修改store实现节点操作
 * 
 * 节点交互逻辑（开发目标.txt第51-62行）：
 *   - 当被鼠标单击：如果按下Ctrl则切换选择当前节点，否则清空节点选择
 *   - 当被鼠标右键点击：选择当前节点，绑定节点菜单和节点面板的跟随id为当前节点id，显示节点菜单和节点面板
 *   - 双击节点：重命名节点
 */

import { Handle, Position } from "@xyflow/react"                  // 导入ReactFlow的Handle组件和Position常量
import { setState, getState } from "../store"                     // 导入store的状态操作函数
import "../styles/Node.css"                                       // 导入节点样式

// ========== 节点主组件 ==========

const Node = ({ id, data }) => {                                  // 节点组件，接收id和data作为props，id是节点唯一标识，data包含节点数据

  const color = data?.color || "rgb(137, 146, 235)"               // 节点颜色，如果没有传入则使用默认紫色
  const label = data?.label || "未命名节点"                         // 节点名称，如果没有传入则使用默认名称
  const inputs = data?.inputs || []                               // 输入端口数组，如果没有传入则为空数组
  const outputs = data?.outputs || []                             // 输出端口数组，如果没有传入则为空数组

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
    const currentLabel = node?.data?.label || ""                  // 获取当前节点的名称
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
        {inputs.map((port, index) => (                            // 遍历输入端口数组
          <div key={`in-${index}`} className="port-item">         
            <Handle                                               // ReactFlow的端口组件
              type="target"                                       // 输入端口类型是target
              position={Position.Left}                            // 端口位置在左侧
              id={port.id}                                        // 端口id
              className="handle"                                  // 端口样式类
            />
            <span className="input-label">{port.label}</span>     
          </div>
        ))}
      </div>

      {/* 中间：节点名称（开发目标.txt第24行） */}
      <div className="title-container">                           
        <div className="title">{label}</div>                      
      </div>

      {/* 右侧：输出端口组（开发目标.txt第25-27行） */}
      <div className="port-container">                            
        {outputs.map((port, index) => (                           // 遍历输出端口数组
          <div key={`out-${index}`} className="port-item">        
            <span className="output-label">{port.label}</span>    
            <Handle                                               // ReactFlow的端口组件
              type="source"                                       // 输出端口类型是source
              position={Position.Right}                           // 端口位置在右侧
              id={port.id}                                        // 端口id
              className="handle"                                  // 端口样式类
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Node                                               // 导出节点组件供Blueprint.jsx使用
