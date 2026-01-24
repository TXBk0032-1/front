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
        color="#666"                                                /* 颜色 */
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
 * @param {Array} registry - 节点注册表数组
 * @returns {Array} - 分类信息数组
 */
function getCategoriesFromRegistry(registry) {
  if (!registry || !Array.isArray(registry)) return []              // 如果注册表无效，返回空数组

  const categoryMap = new Map()                                     // 用Map存储分类信息，去重

  registry.forEach(node => {                                        // 遍历所有节点
    const cat = node.category || 'default'                         // 获取节点分类，默认'default'
    if (!categoryMap.has(cat)) {                                   // 如果分类不存在
      categoryMap.set(cat, {                                       // 添加分类信息
        key: cat,                                                  // 分类键名
        label: getCategoryLabel(cat),                              // 分类显示名称
        color: getCategoryColor(cat)                               // 分类颜色
      })
    }
  })

  return Array.from(categoryMap.values())                           // 返回分类数组
}

/**
 * getCategoryLabel - 获取分类显示名称
 * 
 * @param {string} category - 分类键名
 * @returns {string} - 分类显示名称
 */
function getCategoryLabel(category) {
  const labels = {                                                  // 分类名称映射表
    'default': '默认',
    'neural': '神经网络',
    'math': '数学运算',
    'basic': '基础',
    'function': '函数',
    'io': '输入输出',
    'data': '数据处理'
  }
  return labels[category] || category                               // 返回名称，未知分类返回键名
}

/**
 * getCategoryColor - 获取分类颜色
 * 
 * @param {string} category - 分类键名
 * @returns {string} - 分类颜色
 */
function getCategoryColor(category) {
  const colors = {                                                  // 分类颜色映射表
    'default': '#666666',
    'neural': '#ff6b6b',
    'math': '#4ecdc4',
    'basic': '#45b7d1',
    'function': '#96ceb4',
    'io': '#ffeaa7',
    'data': '#dfe6e9'
  }
  return colors[category] || '#666666'                              // 返回颜色，未知分类返回默认灰色
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
    <div                                                            /* 节点项容器 */
      className="node-item"                                         /* 样式类名 */
      style={{ '--node-color': color }}                             /* 内联样式，传入颜色变量 */
      draggable                                                     /* 允许拖拽 */
      onDragStart={handleDragStart}                                 /* 绑定拖拽开始事件 */
    >
      {node.name || node.opcode}                                    {/* 显示节点名称或opcode */}
    </div>
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
 * @param {Array} registry - 节点注册表数组
 * @param {string} selectedCategory - 选中的分类
 * @returns {Array} - 分组后的节点数组
 */
function getGroupedNodes(registry, selectedCategory) {
  if (!registry || !Array.isArray(registry)) return []              // 如果注册表无效，返回空数组

  const groups = new Map()                                          // 用Map存储分组信息

  registry.forEach(node => {                                        // 遍历所有节点
    const cat = node.category || 'default'                         // 获取节点分类

    if (selectedCategory !== 'all' && selectedCategory !== cat) {  // 如果不是选中的分类
      return                                                       // 跳过该节点
    }

    if (!groups.has(cat)) {                                        // 如果分组不存在
      groups.set(cat, {                                            // 创建分组
        category: cat,                                             // 分类键名
        label: getCategoryLabel(cat),                              // 分类名称
        color: getCategoryColor(cat),                              // 分类颜色
        nodes: []                                                  // 节点数组
      })
    }

    groups.get(cat).nodes.push(node)                               // 将节点添加到分组
  })

  return Array.from(groups.values())                                // 返回分组数组
}

/**
 * Sidebar - 侧边栏主组件
 * 
 * 用法示例：
 *   <Sidebar />                                                   // 在App中使用
 */
function Sidebar() {
  return (                                                          // 返回侧边栏元素
    <div className="side-bar">                                      {/* 侧边栏容器 */}
      <CategoryBar />                                               {/* 分类栏 */}
      <NodeList />                                                  {/* 节点列表 */}
    </div>
  )
}

export default Sidebar                                              // 导出侧边栏组件
