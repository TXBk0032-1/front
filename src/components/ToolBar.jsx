/**
 * ToolBar.jsx - 工具栏组件
 * 
 * 用法说明：
 *   在Blueprint组件中渲染
 *   <ToolBar />
 * 
 * 组件职责：
 *   1. 显示工具栏按钮（开发目标.txt第35-42行）
 *   2. 提供撤销/反撤销功能
 *   3. 提供缩放控制功能
 *   4. 提供整理布局功能
 * 
 * 工具栏项目（开发目标.txt第35-42行）：
 *   - 撤销
 *   - 反撤销
 *   - 放大
 *   - 缩放数值显示（点击重置缩放）
 *   - 缩小
 *   - 整理
 */

import { useStore } from "../store"                               // 导入store的hook
import undoIcon from "../assets/ToolBar/undo.svg"                 // 导入撤销图标
import redoIcon from "../assets/ToolBar/redo.svg"                 // 导入重做图标
import zoomInIcon from "../assets/ToolBar/zoom-in.svg"            // 导入放大图标
import zoomOutIcon from "../assets/ToolBar/zoom-out.svg"          // 导入缩小图标
import arrangeIcon from "../assets/ToolBar/arrange.svg"           // 导入整理图标
import "../styles/ToolBar.css"                                    // 导入工具栏样式

// ========== 工具栏按钮组件 ==========

/**
 * ToolBarButton - 工具栏按钮组件
 * 
 * 用法示例：
 *   <ToolBarButton icon={iconUrl} alt="撤销" title="撤销 (Ctrl+Z)" onClick={handleClick} />
 * 
 * 参数说明：
 *   icon - 图标路径
 *   alt - 图片alt属性
 *   title - 鼠标悬停提示
 *   onClick - 点击回调函数
 */
const ToolBarButton = ({ icon, alt, title, onClick, disabled }) => { // 工具栏按钮组件，接收icon、alt、title、onClick、disabled五个参数
  return (                                                        // 返回按钮JSX结构
    <button
      className="toolbar-btn"
      title={title}
      onClick={onClick}
      disabled={disabled}                                         // 设置按钮禁用状态
    >
      <img src={icon} alt={alt} />
    </button>
  )
}

// ========== 工具栏主组件 ==========

/**
 * ToolBar - 工具栏组件
 * 
 * 用法示例：
 *   <ToolBar />
 * 
 * 功能说明（开发目标.txt第74-80行）：
 *   - 撤销
 *   - 反撤销
 *   - 放大
 *   - 缩放数值显示与重置
 *   - 缩小
 *   - 整理节点
 */
const ToolBar = () => {                                           // 工具栏主组件

  const zoom = useStore(s => s.viewport.zoom)                     // 从store获取当前缩放比例
  const historyIndex = useStore(s => s.historyIndex)              // 从store获取当前历史索引
  const historyLength = useStore(s => s.history.length)           // 从store获取历史记录总数

  const zoomPercent = Math.round(zoom * 100)                      // 计算缩放百分比

  const canUndo = historyIndex > 0                                // 判断是否可以撤销：索引大于0
  const canRedo = historyIndex < historyLength - 1                // 判断是否可以重做：索引小于最大索引

  // ========== 按钮点击处理 ==========

  const handleUndo = () => {                                      // 处理撤销点击（开发目标.txt第36行：撤销，第75行）
    window.cmd.undo()                                             // 调用全局命令：撤销
  }

  const handleRedo = () => {                                      // 处理反撤销点击（开发目标.txt第37行：反撤销，第76行）
    window.cmd.redo()                                             // 调用全局命令：重做
  }

  const handleZoomIn = () => {                                    // 处理放大点击（开发目标.txt第38行：放大，第77行）
    window.cmd.zoomIn()                                           // 调用全局命令：放大
  }

  const handleZoomOut = () => {                                   // 处理缩小点击（开发目标.txt第41行：缩小，第79行）
    window.cmd.zoomOut()                                          // 调用全局命令：缩小
  }

  const handleResetZoom = () => {                                 // 处理重置缩放点击（开发目标.txt第39-40行：缩放数值显示，点击重置缩放，第78行）
    window.cmd.resetZoom()                                        // 调用全局命令：重置缩放
  }

  const handleArrange = () => {                                   // 处理整理点击（开发目标.txt第42行：整理，第80行）
    window.cmd.arrange()                                          // 调用全局命令：整理节点
  }

  // ========== 渲染工具栏 ==========

  return (                                                        // 返回工具栏JSX结构
    <div className="toolbar">

      {/* 历史操作组 - 撤销和反撤销 */}
      <div className="toolbar-group">
        <ToolBarButton                                            // 撤销按钮
          icon={undoIcon}                                         // 撤销图标
          alt="撤销"                                               // 图片描述
          title="撤销 (Ctrl+Z)"                                    // 悬停提示
          onClick={handleUndo}                                    // 点击回调
          disabled={!canUndo}                                     // 根据canUndo状态禁用按钮
        />
        <ToolBarButton                                            // 反撤销按钮
          icon={redoIcon}                                         // 重做图标
          alt="重做"                                               // 图片描述
          title="重做 (Ctrl+Y)"                                    // 悬停提示
          onClick={handleRedo}                                    // 点击回调
          disabled={!canRedo}                                     // 根据canRedo状态禁用按钮
        />
      </div>

      {/* 缩放控制组 - 缩小、缩放显示、放大 */}
      <div className="toolbar-group">
        <ToolBarButton                                            // 缩小按钮
          icon={zoomOutIcon}                                      // 缩小图标
          alt="缩小"                                               // 图片描述
          title="缩小"                                             // 悬停提示
          onClick={handleZoomOut}                                 // 点击回调
        />
        <span                                                     // 缩放数值显示（开发目标.txt第39-40行）
          className="zoom-display"                                // 样式类
          title="点击重置视图"                                      // 悬停提示：点击重置缩放
          onClick={handleResetZoom}                               // 点击回调：重置缩放
        >
          {`${zoomPercent}%`}
        </span>
        <ToolBarButton                                            // 放大按钮
          icon={zoomInIcon}                                       // 放大图标
          alt="放大"                                               // 图片描述
          title="放大"                                             // 悬停提示
          onClick={handleZoomIn}                                  // 点击回调
        />
      </div>

      {/* 整理布局组 */}
      {/* <div className="toolbar-group">                             
        <ToolBarButton                                            // 整理按钮
          icon={arrangeIcon}                                      // 整理图标
          alt="整理"                                               // 图片描述
          title="自动整理布局"                                      // 悬停提示
          onClick={handleArrange}                                 // 点击回调
        />
      </div> */}
    </div>
  )
}

export default ToolBar                                            // 导出工具栏组件
