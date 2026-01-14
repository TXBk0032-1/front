/**
 * NodeBox.jsx - 节点面板组件
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


// ========== 分类栏组件 ==========

/**
 * CategoryBar - 分类筛选栏
 * 竖向排列的色块，点击切换筛选
 */
const CategoryBar = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="category-bar">
      {/* "全部"按钮 */}
      <CategoryItem
        label="全部"
        color="#666"
        isSelected={selectedCategory === null}
        onClick={() => onSelectCategory(null)}
      />

      {/* 各分类按钮 */}
      {categories.map(([key, data]) => (
        <CategoryItem
          key={key}
          label={data.label}
          color={data.color}
          isSelected={selectedCategory === key}
          onClick={() => onSelectCategory(key)}
        />
      ))}
    </div>
  );
};

/** 单个分类按钮 */
const CategoryItem = ({ label, color, isSelected, onClick }) => (
  <div
    className={`category-item ${isSelected ? "active" : ""}`}                    // 选中时添加 active 类
    style={{
      "--category-color": color,                                                 // CSS变量：分类颜色
      color: isSelected ? "#fff" : color,                                        // 文字颜色
    }}
    onClick={onClick}
  >
    {label}
  </div>
);


// ========== 节点项组件 ==========

/**
 * NodeItem - 单个节点按钮
 * 拖拽这个按钮到画布上，就会创建一个新节点
 */
const NodeItem = ({ nodeId, color }) => {
  const config = getNodeConfig(nodeId);                                          // 获取节点配置

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


// ========== 节点分组组件 ==========

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


// ========== 主组件 ==========

/**
 * NodeBox - 节点面板主体
 */
const NodeBox = () => {
  const categories = getAllCategories();                                         // 第1步：获取所有分类
  const [selectedCategory, setSelectedCategory] = useState(null);                // 第2步：初始化选中状态（null=全部）
  const filteredCategories = filterCategories(categories, selectedCategory);     // 第3步：根据选中状态筛选分类

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


// ========== 辅助函数 ==========

/** 根据选中的分类筛选要显示的分类 */
function filterCategories(categories, selectedCategory) {
  if (selectedCategory === null) return categories;                              // 选中"全部"，显示所有分类
  return categories.filter(([key]) => key === selectedCategory);                 // 否则只显示选中的分类
}


export default NodeBox;
