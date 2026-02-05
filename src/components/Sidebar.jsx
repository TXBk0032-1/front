/**
 * Sidebar.jsx - 侧边栏组件
 * 
 * 布局结构：
 *   侧边栏
 *     分类栏
 *       节点分类项
 *     节点列表
 *       显示分类的节点
 * 
 * 对象操作逻辑：
 *   分类栏
 *     分类项
 *       当被鼠标点击
 *         切换显示该类别的所有节点
 * 
 * 核心职责：
 *   展示节点分类和节点列表，支持拖拽节点到蓝图
 */

import '../styles/SideBar.css'                                      // 导入侧边栏样式
import { useStore, setState } from '../store'                       // 导入store相关函数
import { useEffect } from 'react'
import ws from '../ws'
import { Button, Tooltip } from "@heroui/react";
/**
 * CategoryItem - 分类项组件
 * 
 * 用法示例：
 *   <CategoryItem category="neural" label="神经网络" color="#ff6b6b" />
 * 
 * @param {Object} props - 组件属性
 * @param {string} props.category - 分类键名
 * @param {string} props.label - 分类显示名称
 * @param {string} props.color - 分类颜色
 */
function CategoryItem({ category, label, color }) {
  const selected = useStore(s => s.selectedCategory)                // 从store获取当前选中的分类
  const isActive = selected === category                            // 判断当前分类是否选中

  /**
   * handleClick - 分类项点击事件
   * 
   * 当被鼠标点击时，切换显示该类别的所有节点
   */
  const handleClick = () => {                                       // 点击事件处理
    setState({ selectedCategory: category })                       // 切换显示该类别的所有节点
  }

  return (                                                          // 返回分类项元素
    <div                                                            /* 分类项容器 */
      className={`category-item ${isActive ? 'active' : ''}`}       /* 样式类名，选中时添加active */
      style={{                                                      /* 内联样式 */
        '--category-color': color,                                 /* CSS变量：分类颜色 */
        '--category-text-color': isActive ? '#fff' : color         /* CSS变量：文字颜色 */
      }}
      onClick={handleClick}                                         /* 绑定点击事件 */
    >
      {label}                                                       {/* 显示分类名称 */}
    </div>
  )
}

/**
 * CategoryBar - 分类栏组件
 * 
 * 显示所有分类项，点击可切换显示对应分类的节点
 */
function CategoryBar() {
  const registry = useStore(s => s.registry)                        // 从store获取节点注册表

  const categories = getCategoriesFromRegistry(registry)            // 从注册表提取分类信息

  return (                                                          // 返回分类栏元素
    <div className="category-bar">                                  {/* 分类栏容器 */}

      <CategoryItem                                                 /* 全部分类项 */
        category="all"                                              /* 分类键名 */
        label="全部"                                                /* 显示名称 */
        color="#8b92e5"                                                /* 颜色 */
      />

      {categories.map(cat => (                                      /* 遍历所有分类 */
        <CategoryItem                                               /* 分类项 */
          key={cat.key}                                             /* React key */
          category={cat.key}                                        /* 分类键名 */
          label={cat.label}                                         /* 显示名称 */
          color={cat.color}                                         /* 颜色 */
        />
      ))}

    </div>
  )
}

/**
 * getCategoriesFromRegistry - 从注册表提取分类信息
 * 
 * 后端返回结构: { categories: { id: { id, label, color, icon } }, nodes: { opcode: {...} } }
 * 
 * @param {Object} registry - 节点注册表对象
 * @returns {Array} - 分类信息数组 [{ key, label, color }, ...]
 */
function getCategoriesFromRegistry(registry) {
  if (!registry || !registry.categories) return []                  // 如果注册表无效，返回空数组

  const categories = registry.categories                            // 获取分类对象

  if (typeof categories !== 'object') return []                     // 如果不是对象，返回空数组

  return Object.entries(categories).map(([key, cat]) => ({          // 遍历分类对象，转换格式
    key: key,                                                       // 分类键名
    label: cat.label || key,                                        // 分类显示名称
    color: cat.color || '#8b92e5'                                   // 分类颜色
  }))
}

/**
 * NodeItem - 节点项组件
 * 
 * 用法示例：
 *   <NodeItem node={nodeData} color="#ff6b6b" />
 * 
 * @param {Object} props - 组件属性
 * @param {Object} props.node - 节点定义对象
 * @param {string} props.color - 节点颜色
 */
function NodeItem({ node, color }) {

  /**
   * handleDragStart - 拖拽开始事件
   * 
   * 将节点opcode存入拖拽数据，用于在蓝图中创建节点
   */
  const handleDragStart = (e) => {                                  // 拖拽开始事件处理
    e.dataTransfer.setData('opcode', node.opcode)                  // 设置拖拽数据为节点opcode
    e.dataTransfer.effectAllowed = 'copy'                          // 设置拖拽效果为复制
  }

  return (                                                          // 返回节点项元素
    <Tooltip delay={1000} closeDelay={200}>
      <Tooltip.Trigger>
        <div                                                            /* 节点项容器 */
          className="node-item"                                         /* 样式类名 */
          style={{ '--node-color': color }}                             /* 内联样式，传入颜色变量 */
          draggable                                                     /* 允许拖拽 */
          onDragStart={handleDragStart}                                 /* 绑定拖拽开始事件 */
        >
          {node.label || node.opcode}                                   {/* 显示节点标签或opcode */}
        </div>
        </Tooltip.Trigger>
      <Tooltip.Content placement="right">
        <p>{node.tip || node.description || node.desc || "无描述"}</p>
      </Tooltip.Content>
    </Tooltip>
  )
}

/**
 * NodeGroup - 节点分组组件
 * 
 * 用法示例：
 *   <NodeGroup category="neural" label="神经网络" color="#ff6b6b" nodes={nodeList} />
 * 
 * @param {Object} props - 组件属性
 * @param {string} props.label - 分组显示名称
 * @param {string} props.color - 分组颜色
 * @param {Array} props.nodes - 该分组的节点数组
 */
function NodeGroup({ label, color, nodes }) {
  if (!nodes || nodes.length === 0) return null                     // 如果没有节点，不渲染

  return (                                                          // 返回节点分组元素
    <div className="node-group">                                    {/* 节点分组容器 */}

      <div                                                          /* 分组标题 */
        className="group-title"                                     /* 样式类名 */
        style={{ '--group-color': color }}                          /* 内联样式，传入颜色变量 */
      >
        {label}                                                     {/* 显示分组名称 */}
      </div>

      {nodes.map(node => (                                          /* 遍历该分组的所有节点 */
        <NodeItem                                                   /* 节点项 */
          key={node.opcode}                                         /* React key */
          node={node}                                               /* 节点数据 */
          color={color}                                             /* 节点颜色 */
        />
      ))}

    </div>
  )
}

/**
 * NodeList - 节点列表组件
 * 
 * 根据选中的分类显示对应的节点
 */
function NodeList() {
  const registry = useStore(s => s.registry)                        // 从store获取节点注册表
  const selected = useStore(s => s.selectedCategory)                // 从store获取选中的分类

  const groupedNodes = getGroupedNodes(registry, selected)          // 按分类分组节点

  return (                                                          // 返回节点列表元素
    <div className="node-list">                                     {/* 节点列表容器 */}

      {groupedNodes.map(group => (                                  /* 遍历所有分组 */
        <NodeGroup                                                  /* 节点分组 */
          key={group.category}                                      /* React key */
          label={group.label}                                       /* 分组名称 */
          color={group.color}                                       /* 分组颜色 */
          nodes={group.nodes}                                       /* 分组内的节点 */
        />
      ))}

    </div>
  )
}

/**
 * getGroupedNodes - 按分类分组节点
 *
 * 支持两种数据结构:
 *   结构A（分类包含节点列表）: { categories: { id: { label, color, nodes: ["opcode1", ...] } }, nodes: { opcode: {...} } }
 *   结构B（节点包含分类字段）: { categories: { id: { label, color } }, nodes: { opcode: { category: "id", ... } } }
 *
 * 用法示例:
 *   getGroupedNodes(registry, 'all')        // 获取所有分组
 *   getGroupedNodes(registry, 'basic')      // 获取basic分类的节点
 *
 * @param {Object} registry - 节点注册表对象
 * @param {string} selectedCategory - 选中的分类
 * @returns {Array} - 分组后的节点数组 [{ category, label, color, nodes }, ...]
 */
function getGroupedNodes(registry, selectedCategory) {
  if (!registry || !registry.categories || !registry.nodes) return [] // 如果注册表无效，返回空数组

  const categories = registry.categories                            // 获取分类对象
  const nodes = registry.nodes                                      // 获取节点对象

  if (typeof categories !== 'object' || typeof nodes !== 'object') return [] // 如果不是对象，返回空数组

  const categoryMap = new Map()                                     // 用Map存储分类信息，方便查找
  const nodeToCategory = new Map()                                  // 用Map存储节点opcode到分类id的映射

  Object.entries(categories).forEach(([catId, catData]) => {        // 遍历分类对象
    categoryMap.set(catId, {                                        // 以id为键存储分类信息
      id: catId,                                                    // 分类id
      label: catData.label || catId,                                // 分类名称
      color: catData.color || '#8b92e5',                            // 分类颜色
      nodes: []                                                     // 该分类的节点数组（待填充）
    })

    const nodeList = catData.nodes                                  // 获取分类中的节点列表
    if (Array.isArray(nodeList)) {                                  // 如果是数组（结构A）
      nodeList.forEach(opcode => {                                  // 遍历节点opcode列表
        nodeToCategory.set(opcode, catId)                           // 建立节点到分类的映射
      })
    }
  })

  categoryMap.set('', {                                             // 添加默认分类（空字符串）
    id: '',                                                         // 分类id
    label: '未分类',                                                // 分类名称
    color: '#8b92e5',                                               // 分类颜色
    nodes: []                                                       // 该分类的节点数组
  })

  Object.values(nodes).forEach(node => {                            // 遍历所有节点
    let catId = node.category                                       // 尝试从节点获取分类id（结构B）
    if (catId === undefined || catId === null) {                    // 如果节点没有category字段
      catId = nodeToCategory.get(node.opcode)                       // 从映射中查找（结构A）
    }
    catId = catId || ''                                             // 如果还是没有，归入未分类

    const cat = categoryMap.get(catId)                              // 查找对应的分类
    if (cat) {                                                      // 如果分类存在
      cat.nodes.push(node)                                          // 将节点添加到该分类
    } else {                                                        // 如果分类不存在
      categoryMap.get('').nodes.push(node)                          // 添加到未分类
    }
  })

  const groups = []                                                 // 存储分组结果

  categoryMap.forEach((catData, catId) => {                         // 遍历所有分类
    if (selectedCategory !== 'all' && selectedCategory !== catId) { // 如果不是选中的分类
      return                                                        // 跳过该分类
    }

    if (catData.nodes.length > 0) {                                 // 如果有节点
      groups.push({                                                 // 添加分组
        category: catId,                                            // 分类id
        label: catData.label,                                       // 分类名称
        color: catData.color,                                       // 分类颜色
        nodes: catData.nodes                                        // 节点数组
      })
    }
  })

  return groups                                                     // 返回分组数组
}

/**
 * Sidebar - 侧边栏主组件
 * 
 * 用法示例：
 *   <Sidebar />                                                   // 在App中使用
 */
function Sidebar() {
  // 只运行一次await ws.getRegistry()，后续使用store中的数据
  useEffect(() => {
    ws.getRegistry()
  }, [])
  return (                                                          // 返回侧边栏元素
    <div className="side-bar">                                      {/* 侧边栏容器 */}
      <CategoryBar />                                               {/* 分类栏 */}
      <NodeList />                                                  {/* 节点列表 */}
    </div>
  )
}

export default Sidebar                                              // 导出侧边栏组件
