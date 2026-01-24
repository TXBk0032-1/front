/**
 * NodePanel.jsx - 节点面板组件
 * 
 * 用法说明：
 *   在Blueprint组件中渲染，当右键点击节点时显示
 *   <NodePanel />
 * 
 * 组件职责：
 *   1. 显示节点属性面板（开发目标.txt第32-34行）
 *   2. 显示属性标题
 *   3. 根据节点列出所有参数
 *   4. 提供参数编辑功能
 * 
 * 面板内容（开发目标.txt第32-34行）：
 *   - 属性
 *   - 根据节点列出所有参数
 */

import { useStore, setState, getState } from "../store"          // 导入store的hook和状态操作函数
import { useReactFlow } from "@xyflow/react"                      // 导入ReactFlow的hook获取坐标转换函数
import { Input, Switch } from "@heroui/react"                     // 导入HeroUI的输入框和开关组件
import "../styles/NodePanel.css"                                  // 导入节点面板样式

// ========== 数字输入组件 ==========

/**
 * NumberInput - 数字输入组件
 * 
 * 用法示例：
 *   <NumberInput label="数量" value={10} onChange={v => console.log(v)} />
 * 
 * 参数说明：
 *   label - 参数名称
 *   value - 当前值
 *   onChange - 值改变时的回调函数
 */
const NumberInput = ({ label, value, onChange }) => {             // 数字输入组件，接收label、value、onChange三个参数
  return (                                                        // 返回数字输入JSX结构
    <div className="param-item">                                  
      <span className="param-label">{label}</span>                
      <Input                                                      // HeroUI输入框组件
        type="number"                                             // 输入类型为数字
        aria-label={label}                                        // 无障碍标签
        placeholder={label}                                       // 占位符
        value={String(value)}                                     // 当前值转为字符串
        onChange={e => onChange(Number(e.target.value))}          // 值改变时转为数字并回调
        className="param-input number-input"                      // 样式类
      />
    </div>
  )
}

// ========== 字符串输入组件 ==========

/**
 * StringInput - 字符串输入组件
 * 
 * 用法示例：
 *   <StringInput label="名称" value="test" onChange={v => console.log(v)} />
 * 
 * 参数说明：
 *   label - 参数名称
 *   value - 当前值
 *   onChange - 值改变时的回调函数
 */
const StringInput = ({ label, value, onChange }) => {             // 字符串输入组件，接收label、value、onChange三个参数
  return (                                                        // 返回字符串输入JSX结构
    <div className="param-item">                                  
      <span className="param-label">{label}</span>                
      <Input                                                      // HeroUI输入框组件
        type="text"                                               // 输入类型为文本
        aria-label={label}                                        // 无障碍标签
        placeholder={label}                                       // 占位符
        value={value}                                             // 当前值
        onChange={e => onChange(e.target.value)}                  // 值改变时回调
        className="param-input"                                   // 样式类
      />
    </div>
  )
}

// ========== 布尔开关组件 ==========

/**
 * BooleanSwitch - 布尔开关组件
 * 
 * 用法示例：
 *   <BooleanSwitch label="启用" value={true} onChange={v => console.log(v)} />
 * 
 * 参数说明：
 *   label - 参数名称
 *   value - 当前值
 *   onChange - 值改变时的回调函数
 */
const BooleanSwitch = ({ label, value, onChange }) => {           // 布尔开关组件，接收label、value、onChange三个参数
  return (                                                        // 返回布尔开关JSX结构
    <div className="param-item">                                  
      <span className="param-label">{label}</span>                
      <Switch                                                     // HeroUI开关组件
        size="md"                                                 // 中等尺寸
        isSelected={value}                                        // 当前选中状态
        onChange={onChange}                                       // 值改变时回调
      >
        <Switch.Control>                                          
          <Switch.Thumb />                                        
        </Switch.Control>
      </Switch>
    </div>
  )
}

// ========== 计算面板位置样式 ==========

/**
 * calcPositionStyle - 计算面板定位样式
 * 
 * 用法示例：
 *   calcPositionStyle(100, 200, 1.5)
 * 
 * 参数说明：
 *   x - 面板X坐标
 *   y - 面板Y坐标
 *   scale - 缩放比例
 */
const calcPositionStyle = (x, y, scale) => {                      // 计算定位样式，接收x、y坐标和缩放比例
  return {                                                        // 返回样式对象
    left: x,                                                      // 左边距
    top: y,                                                       // 上边距
    transform: `translate(-50%) scale(${scale})`,                 // 水平居中 + 缩放
    transformOrigin: "center top"                                 // 缩放原点在顶部中心
  }
}

// ========== 计算节点下方位置 ==========

/**
 * calcPositionBelowNode - 计算节点下方的面板位置
 * 
 * 用法示例：
 *   calcPositionBelowNode(node, flowToScreen, 1.0)
 * 
 * 参数说明：
 *   node - 节点对象
 *   flowToScreen - 画布坐标转屏幕坐标的函数
 *   zoom - 缩放比例
 */
const calcPositionBelowNode = (node, flowToScreen, zoom) => {     // 计算节点下方位置，接收节点、转换函数、缩放比例
  const nodeX = node.position?.x || 0                             // 获取节点X坐标，默认0
  const nodeY = node.position?.y || 0                             // 获取节点Y坐标，默认0
  const nodeWidth = node.measured?.width || 200                   // 获取节点宽度，默认200
  const nodeHeight = node.measured?.height || 60                  // 获取节点高度，默认60
  const centerX = nodeX + nodeWidth / 2                           // 计算节点中心X坐标
  const bottomY = nodeY + nodeHeight + 10 / zoom                  // 计算节点底部下方Y坐标，留出10像素间距
  const screenPos = flowToScreen({ x: centerX, y: bottomY })      // 将画布坐标转换为屏幕坐标
  return screenPos                                                // 返回屏幕坐标
}

// ========== 更新节点参数 ==========

/**
 * updateNodeParam - 更新节点参数值
 * 
 * 用法示例：
 *   updateNodeParam("node_1", "count", 10)
 * 
 * 参数说明：
 *   nodeId - 节点id
 *   paramKey - 参数键名
 *   paramValue - 参数新值
 */
const updateNodeParam = (nodeId, paramKey, paramValue) => {       // 更新节点参数，接收节点id、参数键名、参数值
  const nodes = getState().nodes                                  // 从store获取所有节点
  const newNodes = nodes.map(node => {                            // 遍历所有节点
    if (node.id !== nodeId) return node                           // 如果不是目标节点则原样返回
    const params = node.data?.params || {}                        // 获取节点参数对象
    const paramConfig = params[paramKey] || {}                    // 获取指定参数的配置
    const newParamConfig = { ...paramConfig, default: paramValue }  // 更新参数的default值
    const newParams = { ...params, [paramKey]: newParamConfig }   // 更新参数对象
    const newData = { ...node.data, params: newParams }           // 更新节点data
    return { ...node, data: newData }                             // 返回更新后的节点
  })
  setState({ nodes: newNodes })                                   // 更新store中的节点数据
}

// ========== 节点面板主组件 ==========

/**
 * NodePanel - 节点面板组件
 * 
 * 用法示例：
 *   <NodePanel />
 * 
 * 功能说明：
 *   从store读取nodePanel状态，当visible为true时显示面板
 *   面板位置跟随绑定的节点
 *   根据节点列出所有参数（开发目标.txt第34行）
 */
const NodePanel = () => {                                         // 节点面板主组件

  const { visible, nodeId } = useStore(s => s.nodePanel)          // 从store获取面板可见状态和绑定的节点id
  const nodes = useStore(s => s.nodes)                            // 从store获取所有节点
  const viewport = useStore(s => s.viewport)                      // 从store获取视口状态
  const { flowToScreenPosition } = useReactFlow()                 // 从ReactFlow获取坐标转换函数

  if (!visible) return null                                       // 如果面板不可见则不渲染
  if (!nodeId) return null                                        // 如果没有绑定节点则不渲染

  const targetNode = nodes.find(n => n.id === nodeId)             // 查找绑定的目标节点
  if (!targetNode) return null                                    // 如果找不到节点则不渲染

  const panelPos = calcPositionBelowNode(                         // 计算面板位置（在节点下方）
    targetNode,                                                   // 传入目标节点
    flowToScreenPosition,                                         // 传入坐标转换函数
    viewport.zoom                                                 // 传入缩放比例
  )
  const posStyle = calcPositionStyle(                             // 计算定位样式
    panelPos.x,                                                   // 传入X坐标
    panelPos.y,                                                   // 传入Y坐标
    viewport.zoom                                                 // 传入缩放比例
  )

  const nodeName = targetNode.data?.label || "未命名节点"          // 获取节点名称
  const params = targetNode.data?.params || {}                    // 获取节点参数对象（开发目标.txt第34行：根据节点列出所有参数）

  // ========== 参数改变处理 ==========

  const handleParamChange = (paramKey, paramValue) => {           // 处理参数值改变
    updateNodeParam(nodeId, paramKey, paramValue)                 // 调用更新函数更新参数值
  }

  // ========== 渲染参数编辑器 ==========

  const renderParamEditor = (paramKey, paramConfig) => {          // 根据参数类型渲染对应的编辑器
    const label = paramConfig.label || paramKey                   // 获取参数标签
    const type = paramConfig.type || "string"                     // 获取参数类型，默认字符串
    const value = paramConfig.default                             // 获取参数当前值

    if (type === "number") {                                      // 如果是数字类型
      return (                                                    // 返回数字输入组件
        <NumberInput
          key={paramKey}
          label={label}
          value={value}
          onChange={v => handleParamChange(paramKey, v)}
        />
      )
    }

    if (type === "boolean") {                                     // 如果是布尔类型
      return (                                                    // 返回布尔开关组件
        <BooleanSwitch
          key={paramKey}
          label={label}
          value={value}
          onChange={v => handleParamChange(paramKey, v)}
        />
      )
    }

    return (                                                      // 默认返回字符串输入组件
      <StringInput
        key={paramKey}
        label={label}
        value={value}
        onChange={v => handleParamChange(paramKey, v)}
      />
    )
  }

  // ========== 渲染面板 ==========

  return (                                                        // 返回节点面板JSX结构
    <div id="node-panel" className="node-panel" style={posStyle}> 
      <div className="panel-header">                              
        <span className="panel-title">{nodeName} 属性</span>       
      </div>
      <div className="panel-content">                             
        {Object.entries(params).map(([key, config]) =>            // 遍历所有参数
          renderParamEditor(key, config)                          // 渲染参数编辑器
        )}
      </div>
    </div>
  )
}

export default NodePanel                                          // 导出节点面板组件
