/**
 * NodeBox - 节点面板组件
 *
 * 这是画布左边的侧边栏，类似 Scratch 编辑器的积木盒
 * 用户可以从这里拖拽节点到画布上
 *
 * 结构（类似Scratch）：
 * - 左边是分类栏（CategoryBar），竖向排列的色块，点击可以筛选节点
 * - 右边是节点列表，根据选中的分类显示对应的节点
 */

import { useState } from "react";
import { getNodeConfig, getAllCategories } from "../constants/nodeRegistry";
import "./NodeBox.css";

// ========== 分类栏 ==========

/**
 * CategoryBar - 分类筛选栏（竖向色块）
 *
 * 类似Scratch左侧的分类色块，点击可以切换筛选
 * 选中"全部"时显示所有节点，选中某个分类时只显示该分类的节点
 *
 * @param {Array} categories - 所有分类数据 [[key, data], ...]
 * @param {string|null} selectedCategory - 当前选中的分类key，null表示全部
 * @param {Function} onSelectCategory - 选中分类时的回调
 */
const CategoryBar = ({ categories, selectedCategory, onSelectCategory }) => {
  // "全部"按钮的默认颜色
  const allColor = "#666";

  return (
    <div className="category-bar">
      {/* "全部"按钮 */}
      <div
        className={`category-item ${selectedCategory === null ? "active" : ""}`}
        style={{
          "--category-color": allColor,
          color: selectedCategory === null ? "#fff" : allColor,
        }}
        onClick={() => onSelectCategory(null)}
      >
        全部
      </div>

      {/* 各分类按钮 - 用CSS变量设置分类颜色 */}
      {categories.map(([key, data]) => (
        <div
          key={key}
          className={`category-item ${selectedCategory === key ? "active" : ""}`}
          style={{
            "--category-color": data.color,
            color: selectedCategory === key ? "#fff" : data.color,
          }}
          onClick={() => onSelectCategory(key)}
        >
          {data.label}
        </div>
      ))}
    </div>
  );
};

// ========== 单个节点项 ==========

/**
 * NodeItem - 面板里的单个节点按钮
 *
 * 用户拖拽这个按钮到画布上，就会创建一个新节点
 *
 * @param {string} nodeId - 节点在注册表中的ID
 * @param {string} color - 节点的主题色（从分类继承）
 */
const NodeItem = ({ nodeId, color }) => {
  // 从注册表获取节点配置
  const config = getNodeConfig(nodeId);

  // 拖拽开始时，把节点ID存到 dataTransfer 里
  // 这样放下的时候，画布就知道要创建哪种节点
  const handleDragStart = (event) => {
    event.dataTransfer.setData("application/reactflow", nodeId);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className="node-item"
      style={{ background: color }}
      draggable
      onDragStart={handleDragStart}
    >
      {config.label || nodeId}
    </div>
  );
};

// ========== 节点分组 ==========

/**
 * NodeGroup - 一组同类型的节点
 *
 * 比如"输入层"、"卷积层"这种分类
 * 每个分组有自己的标题和颜色
 *
 * @param {Object} groupData - 分组数据（包含 label、color、nodes）
 */
const NodeGroup = ({ groupData }) => {
  const { label, color, nodes = [] } = groupData;

  return (
    <div className="node-group">
      {/* 分组标题 */}
      <div className="group-title" style={{ color }}>
        {label}
      </div>

      {/* 该分组下的所有节点 */}
      {nodes.map((nodeId) => (
        <NodeItem key={nodeId} nodeId={nodeId} color={color} />
      ))}
    </div>
  );
};

// ========== 主组件 ==========

/**
 * NodeBox - 节点面板主体
 *
 * 独立的侧边栏组件，和画布左右并列
 * 包含分类栏和节点列表两部分
 */
const NodeBox = () => {
  // 获取所有分类数据
  const categories = getAllCategories();

  // 当前选中的分类，null 表示显示全部
  const [selectedCategory, setSelectedCategory] = useState(null);

  // 根据选中的分类筛选要显示的分类
  // 如果选中了某个分类，只显示那一个；否则显示全部
  const filteredCategories =
    selectedCategory === null
      ? categories
      : categories.filter(([key]) => key === selectedCategory);

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
