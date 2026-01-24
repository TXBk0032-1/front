/**
 * App.jsx - 应用入口组件
 * 
 * 用法说明：
 *   在main.jsx中渲染
 *   <App />
 * 
 * 组件职责：
 *   组织编辑器的整体布局结构
 * 
 * 布局结构（开发目标.txt第2-42行）：
 *   - 顶部栏（Header）
 *     - 文字LOGO
 *     - 架构重命名输入框
 *     - 功能按钮组
 *   - 主体（workspace）
 *     - 侧边栏（Sidebar）
 *       - 分类栏
 *       - 节点列表
 *     - 蓝图（Blueprint）
 *       - 节点
 *       - 节点菜单
 *       - 节点面板
 *       - 工具栏
 *   - 重命名弹窗（RenameModal）
 */

import Header from "./components/Header"                          // 导入顶部栏组件（开发目标.txt第3行：顶部栏）
import Sidebar from "./components/Sidebar"                        // 导入侧边栏组件（开发目标.txt第14行：侧边栏）
import Blueprint from "./components/Blueprint"                    // 导入蓝图组件（开发目标.txt第19行：蓝图）
import RenameModal from "./components/RenameModal"                // 导入重命名弹窗组件（开发目标.txt第89行：RenameModal.jsx）
import "./styles/Global.css"                                      // 导入全局样式

// ========== 应用主组件 ==========

/**
 * App - 应用主组件
 * 
 * 用法示例：
 *   <App />
 * 
 * 功能说明：
 *   组织编辑器的整体布局，包括顶部栏、侧边栏、蓝图和重命名弹窗
 */
const App = () => {                                               // 应用主组件

  return (                                                        // 返回应用JSX结构
    <div id="editor">                                             
      {/* 顶部栏 - 包含LOGO、架构名称输入框、功能按钮组（开发目标.txt第3-12行） */}
      <Header />                                                  

      {/* 主体工作区 - 包含侧边栏和蓝图（开发目标.txt第13行：主体） */}
      <main id="workspace">                                       
        {/* 侧边栏 - 包含分类栏和节点列表（开发目标.txt第14-18行） */}
        <Sidebar />                                               

        {/* 蓝图 - 包含节点、连接线、节点菜单、节点面板、工具栏（开发目标.txt第19-42行） */}
        <Blueprint />                                             
      </main>

      {/* 重命名弹窗 - 双击节点或点击重命名菜单时显示（开发目标.txt第61-62行、第30行） */}
      <RenameModal />                                             
    </div>
  )
}

export default App                                                // 导出应用主组件
