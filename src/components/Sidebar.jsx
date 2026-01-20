/**
 * Sidebar.jsx - 侧边栏组件（节点面板）
 * 
 * 包含：
 * - 分类栏：筛选节点类别
 * - 节点列表：显示可拖拽的节点
 */

import '../styles/SideBar.css';


// ========== 分类项组件 ==========

const CategoryItem = ({ label, color, isSelected, onClick }) => (
  <div
    className={`category-item ${isSelected ? 'active' : ''}`}
    style={{
      '--category-color': color,
      '--category-text-color': isSelected ? '#fff' : color
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

  const handleDragStart = (event) => {
    event.dataTransfer.setData('application/reactflow', nodeId);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="node-item"
      style={{ '--node-color': color }}
      draggable
      onDragStart={handleDragStart}
    >
      label
    </div>
  );
};

// ========== 节点分组组件 ==========

const NodeGroup = ({ groupData, registry }) => {
  const { label, color, nodes = [] } = groupData;

  return (
    <div className="node-group">
      <div className="group-title" style={{ '--group-color': color }}>{label}</div>
      {nodes.map((nodeId) => (
        <NodeItem key={nodeId} nodeId={nodeId} color={color} registry={registry} />
      ))}
    </div>
  );
};

// ========== 主组件 ==========

function Sidebar() {
  return (
    <div className="side-bar">
      {/* 分类筛选栏 */}
      <CategoryBar/>

      {/* 节点列表区域 */}
      <div className="node-list">
      </div>
    </div>
  );
}

export default Sidebar;
