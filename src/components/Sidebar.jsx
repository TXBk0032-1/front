/**
 * Sidebar.jsx - 侧边栏组件（节点面板）
 * 
 * 包含：
 * - 分类栏：筛选节点类别
 * - 节点列表：显示可拖拽的节点
 */

import { useState, useMemo } from 'react';
import useStore from '@/store';
import { getNodeConfig, getAllCategories, getNodeRegistry } from '@/constants/nodeRegistry';
import '@/styles/SideBar.css';

// ========== 分类项组件 ==========

const CategoryItem = ({ label, color, isSelected, onClick }) => (
  <div
    className={`category-item ${isSelected ? 'active' : ''}`}
    style={{
      '--category-color': color,
      color: isSelected ? '#fff' : color
    }}
    onClick={onClick}
  >
    {label}
  </div>
);

// ========== 分类栏组件 ==========

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

// ========== 节点项组件 ==========

const NodeItem = ({ nodeId, color, registry }) => {
  const config = getNodeConfig(nodeId, registry);

  const handleDragStart = (event) => {
    event.dataTransfer.setData('application/reactflow', nodeId);
    event.dataTransfer.effectAllowed = 'move';
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

// ========== 节点分组组件 ==========

const NodeGroup = ({ groupData, registry }) => {
  const { label, color, nodes = [] } = groupData;

  return (
    <div className="node-group">
      <div className="group-title" style={{ color }}>{label}</div>
      {nodes.map((nodeId) => (
        <NodeItem key={nodeId} nodeId={nodeId} color={color} registry={registry} />
      ))}
    </div>
  );
};

// ========== 主组件 ==========

function Sidebar() {
  const storeRegistry = useStore((state) => state.registry);
  
  // 使用外部传入的注册表，或使用默认注册表
  const registry = useMemo(() => {
    return storeRegistry || getNodeRegistry();
  }, [storeRegistry]);

  const categories = useMemo(() => getAllCategories(registry), [registry]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // 根据选中状态筛选分类
  const filteredCategories = useMemo(() => {
    if (selectedCategory === null) return categories;
    return categories.filter(([key]) => key === selectedCategory);
  }, [categories, selectedCategory]);

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
          <NodeGroup key={groupKey} groupData={groupData} registry={registry} />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
