/**
 * NodeBox - 节点面板组件
 * 
 * 画布左边的侧边栏，类似 Scratch 编辑器的积木盒
 * 用户可以从这里拖拽节点到画布上
 * 
 * 结构：
 * - 左边是分类栏（竖向色块，点击筛选）
 * - 右边是节点列表（根据选中分类显示）
 */

import { useState } from "react";                                                // React hooks
import { getNodeConfig, getAllCategories } from "../constants/nodeRegistry";     // 节点注册表工具函数
import "./NodeBox.css";                                                          // 样式


// ==================== 分类栏组件 ====================

/**
 * CategoryBar - 分类筛选栏
 * 竖向排列的色块，点击切换筛选
 */
const CategoryBar = ({ categories, selectedCategory, onSelectCategory }) => {
  const allColor = "#666";                                                       // "全部"按钮的颜色

  return (
    <div className="category-bar">
      {/* "全部"按钮 */}
      <div
        className={`category-item ${selectedCategory === null ? "active" : ""}`} // 选中时添加 active 类
        style={{
          "--category-color": allColor,                                          // CSS变量：分类颜色
          color: selectedCategory === null ? "#fff" : allColor,                  // 文字颜色
        }}
        onClick={() => onSelectCategory(null)}                                   // 点击选中"全部"
      >
        全部
      </div>

      {/* 各分类按钮 */}
      {categories.map(([key, data]) => (
        <div
          key={key}
          className={`category-item ${selectedCategory === key ? "active" : ""}`}
          style={{
            "--category-color": data.color,                                      // CSS变量：分类颜色
            color: selectedCategory === key ? "#fff" : data.color,               // 文字颜色
          }}
          onClick={() => onSelectCategory(key)}                                  // 点击选中该分类
        >
          {data.label}                                                           {/* 分类名称 */}
        </div>
      ))}
    </div>
  );
};


// ==================== 节点项组件 ====================

/**
 * NodeItem - 单个节点按钮
 * 拖拽这个按钮到画布上，就会创建一个新节点
 */
const NodeItem = ({ nodeId, color }) => {
  const config = getNodeConfig(nodeId);                                          // 获取节点配置

  /**
   * 拖拽开始
   * 把节点ID存到 dataTransfer，画布放下时会读取
   */
  const handleDragStart = (event) => {
    event.dataTransfer.setData("application/reactflow", nodeId);                 // 存储节点ID
    event.dataTransfer.effectAllowed = "move";                                   // 设置拖拽效果
  };

  return (
    <div
      className="node-item"
      style={{ background: color }}                                              // 背景色
      draggable                                                                  // 可拖拽
      onDragStart={handleDragStart}                                              // 拖拽开始事件
    >
      {config.label || nodeId}                                                   {/* 节点名称 */}
    </div>
  );
};


// ==================== 节点分组组件 ====================

/**
 * NodeGroup - 一组同类型的节点
 * 每个分组有自己的标题和颜色
 */
const NodeGroup = ({ groupData }) => {
  const { label, color, nodes = [] } = groupData;                                // 解构分组数据

  return (
    <div className="node-group">
      <div className="group-title" style={{ color }}>{label}</div>               {/* 分组标题 */}
      {nodes.map((nodeId) => (                                                   // 遍历该分组的节点
        <NodeItem key={nodeId} nodeId={nodeId} color={color} />
      ))}
    </div>
  );
};


// ==================== 主组件 ====================

/**
 * NodeBox - 节点面板主体
 */
const NodeBox = () => {
  const categories = getAllCategories();                                         // 获取所有分类
  const [selectedCategory, setSelectedCategory] = useState(null);                // 当前选中的分类（null=全部）

  // 根据选中的分类筛选要显示的分类
  const filteredCategories = selectedCategory === null                           // 如果选中"全部"
    ? categories                                                                 // 显示所有分类
    : categories.filter(([key]) => key === selectedCategory);                    // 否则只显示选中的分类

  return (
    <div className="node-box">
      {/* 分类筛选栏 */}
      <CategoryBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* 节点列表区域 */}
      <div className="node-list">
        {filteredCategories.map(([groupKey, groupData]) => (
          <NodeGroup key={groupKey} groupData={groupData} />
        ))}
      </div>
    </div>
  );
};

export default NodeBox;
