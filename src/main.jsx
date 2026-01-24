/**
 * main.jsx - 应用入口文件
 * 
 * 用法说明：
 *   作为Vite项目的入口文件，由index.html引用
 * 
 * 职责说明：
 *   1. 初始化React应用
 *   2. 初始化全局命令（挂载到window.cmd）
 *   3. 提供ReactFlowProvider上下文
 *   4. 渲染App根组件
 * 
 * 初始化顺序：
 *   1. 导入全局命令（自动挂载到window.cmd）
 *   2. 导入WebSocket管理器
 *   3. 创建React根节点并渲染
 */

import { StrictMode } from "react"                                // 导入React的StrictMode，用于开发模式检查
import { createRoot } from "react-dom/client"                     // 导入createRoot函数，用于创建React根节点
import { ReactFlowProvider } from "@xyflow/react"                 // 导入ReactFlowProvider，提供ReactFlow上下文
import "./commands/index"                                         // 导入全局命令模块，自动将命令挂载到window.cmd（开发目标.txt第137-138行）
import App from "./App.jsx"                                       // 导入App根组件
import "./styles/Global.css"                                      // 导入全局样式

// ========== 获取根节点 ==========

const rootElement = document.getElementById("root")               // 获取HTML中的root元素作为React挂载点

// ========== 创建React根节点 ==========

const root = createRoot(rootElement)                              // 使用createRoot创建React 18的根节点

// ========== 渲染应用 ==========

root.render(                                                      // 渲染React应用
  <StrictMode>                                                    
    <ReactFlowProvider>                                           
      <App />                                                     
    </ReactFlowProvider>
  </StrictMode>
)
