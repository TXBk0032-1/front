/**
 * Header.jsx - 顶部栏组件
 * 
 * 布局结构：
 *   顶部栏
 *     文字LOGO
 *       内容：炼丹蓝图
 *     架构重命名输入框
 *       默认内容：我的架构
 *     功能按钮组
 *       获取节点
 *       运行
 *       导入
 *       导出
 *       整理节点
 * 
 * 核心职责：
 *   展示Logo、蓝图名称输入框和功能按钮
 *   绑定store实现数据自动更新
 */

import '../styles/Header.css'                                       // 导入顶部栏样式
import { useStore, getState, setState } from '../store'             // 导入store相关函数
import { importBlueprint, exportBlueprint } from '../commands/Blueprint' // 导入蓝图命令
import { arrangeNodes } from '../utils/layout'                      // 导入节点整理工具
import ws from '../ws'                                              // 导入WebSocket管理器

/**
 * Logo - 文字Logo组件
 * 
 * 显示"炼丹蓝图"标题
 */
function Logo() {
  return (                                                          // 返回Logo元素
    <h1 className="logo">炼丹蓝图</h1>                              /* 显示Logo文字 */
  )
}

/**
 * NameInput - 架构重命名输入框组件
 * 
 * 用于修改蓝图名称，默认内容为"我的架构"
 */
function NameInput() {
  const name = useStore(s => s.blueprintName)                       // 从store获取蓝图名称

  const handleChange = (e) => {                                     // 输入框变化事件处理
    setState({ blueprintName: e.target.value })                    // 更新store中的蓝图名称
  }

  return (                                                          // 返回输入框元素
    <input                                                          /* 蓝图名称输入框 */
      type="text"                                                   /* 文本类型 */
      className="blueprint-name-input"                              /* 样式类名 */
      placeholder="我的架构"                                        /* 占位符文字，默认内容 */
      value={name}                                                  /* 绑定store中的名称 */
      onChange={handleChange}                                       /* 绑定变化事件 */
    />
  )
}

/**
 * ActionButtons - 功能按钮组组件
 * 
 * 包含：获取节点、运行、导入、导出 四个按钮
 */
function ActionButtons() {

  /**
   * handleGetNodes - 获取节点按钮点击事件
   * 
   * 从后端获取节点注册表数据
   */
  const handleGetNodes = async () => {                              // 获取节点按钮点击处理
    try {
      await ws.getRegistry()                                       // 调用WebSocket获取节点注册表
      console.log('节点获取成功')                                   // 输出成功提示
    } catch (err) {
      console.error('获取节点失败:', err.message)                  // 输出错误信息
    }
  }

  /**
   * handleRun - 运行按钮点击事件
   * 
   * 发送蓝图数据到后端运行
   */
  const handleRun = async () => {                                   // 运行按钮点击处理
    try {
      await ws.runBlueprint()                                      // 调用WebSocket运行蓝图
      console.log('蓝图运行完成')                                   // 输出完成提示
    } catch (err) {
      console.error('运行失败:', err.message)                      // 输出错误信息
    }
  }

  /**
   * handleImport - 导入按钮点击事件
   * 
   * 打开文件选择器导入蓝图JSON文件
   */
  const handleImport = () => {                                      // 导入按钮点击处理
    const input = document.createElement('input')                  // 创建文件输入元素
    input.type = 'file'                                            // 设置为文件类型
    input.accept = '.json'                                         // 只接受JSON文件

    input.onchange = (e) => {                                      // 文件选择完成事件
      const file = e.target.files[0]                               // 获取选中的文件
      if (!file) return                                            // 如果没有文件，直接返回

      const reader = new FileReader()                              // 创建文件读取器
      reader.onload = (event) => {                                 // 文件读取完成事件
        try {
          const data = JSON.parse(event.target.result)             // 解析JSON数据
          importBlueprint(data)                                    // 调用导入命令
          console.log('导入成功')                                   // 输出成功提示
        } catch (err) {
          console.error('导入失败:', err.message)                  // 输出错误信息
        }
      }
      reader.readAsText(file)                                      // 以文本方式读取文件
    }

    input.click()                                                   // 触发文件选择器
  }

  /**
   * handleExport - 导出按钮点击事件
   * 
   * 将蓝图数据导出为JSON文件下载
   */
  const handleExport = () => {                                      // 导出按钮点击处理
    const jsonStr = exportBlueprint(true)                          // 获取蓝图JSON字符串
    const blob = new Blob([jsonStr], { type: 'application/json' }) // 创建Blob对象
    const url = URL.createObjectURL(blob)                          // 创建下载URL

    const a = document.createElement('a')                          // 创建下载链接元素
    a.href = url                                                   // 设置下载URL
    a.download = 'blueprint.json'                                  // 设置下载文件名
    a.click()                                                       // 触发下载

    URL.revokeObjectURL(url)                                        // 释放URL对象
    console.log('导出成功')                                         // 输出成功提示
  }

  /**
   * handleArrange - 整理节点按钮点击事件
   * 
   * 使用layout工具自动整理节点布局
   */
  const handleArrange = () => {                                     // 整理节点按钮点击处理
    try {
      const state = getState()                                      // 获取当前状态
      const { nodes, edges } = state                                // 获取节点和边

      if (!nodes || nodes.length === 0) {                           // 检查是否有节点
        console.log('没有节点需要整理')                              // 输出提示
        return
      }

      const newPositions = arrangeNodes(nodes, edges)               // 调用整理工具计算新位置

      // 更新节点位置
      const updatedNodes = nodes.map(node => {                      // 遍历所有节点
        const newPos = newPositions.find(p => p.id === node.id)    // 查找新位置
        if (newPos) {                                               // 如果找到新位置
          return {                                                  // 返回更新后的节点
            ...node,
            position: { x: newPos.x, y: newPos.y }
          }
        }
        return node                                                 // 否则返回原节点
      })

      setState({ nodes: updatedNodes })                            // 更新store中的节点
      console.log('节点整理完成')                                   // 输出成功提示
    } catch (err) {
      console.error('整理节点失败:', err.message)                   // 输出错误信息
    }
  }

  return (                                                          // 返回按钮组元素
    <>

      <button                                                       /* 运行按钮 */
        className="btn btn-run"                                     /* 样式类名 */
        onClick={handleRun}                                         /* 绑定点击事件 */
      >运行</button>

      <button                                                       /* 导入按钮 */
        className="btn btn-import"                                  /* 样式类名 */
        onClick={handleImport}                                      /* 绑定点击事件 */
      >导入</button>

      <button                                                       /* 导出按钮 */
        className="btn btn-export"                                  /* 样式类名 */
        onClick={handleExport}                                      /* 绑定点击事件 */
      >导出</button>

      <button                                                       /* 整理节点按钮 */
        className="btn btn-arrange"                                 /* 样式类名 */
        onClick={handleArrange}                                     /* 绑定点击事件 */
      >整理节点</button>
    </>
  )
}

/**
 * Header - 顶部栏主组件
 * 
 * 用法示例：
 *   <Header />                                                    // 在App中使用
 */
function Header() {
  return (                                                          // 返回顶部栏元素
    <header className="header">                                     {/* 顶部栏容器 */}

      <div className="left-area">                                   {/* 左侧区域 */}
        <Logo />                                                    {/* Logo组件 */}
      </div>

      <div className="middle-area">                                 {/* 中间区域 */}
        <NameInput />                                               {/* 架构重命名输入框 */}
      </div>

      <div className="right-area">                                  {/* 右侧区域 */}
        <ActionButtons />                                           {/* 功能按钮组 */}
      </div>

    </header>
  )
}

export default Header                                               // 导出顶部栏组件
