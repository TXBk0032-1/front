/**
 * Sidebar.jsx - 侧边栏组件（节点面板）
 * 
 * 包含：
 * - 分类栏：筛选节点类别
 * - 节点列表：显示可拖拽的节点
 */

import '../styles/SideBar.css';
import { useStore, setState } from '../store';


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

const CategoryBar = ({registry}) => {
  const selectedCategory = useStore((state) => state.selectedCategory);
  return (
    <div className="category-bar">
      {/* "全部"按钮 */}
      <CategoryItem
        label="全部"
        color="#666"
        isSelected={selectedCategory === 'all'}
        onClick={() => setState({ selectedCategory: 'all' })}
      />

      {/* 各分类按钮 */}
      {Object.entries(registry.categories).map(([key, data]) => (
        <CategoryItem
          key={key}
          label={data.label}
          color={data.color}
          isSelected={selectedCategory === key}
          onClick={() => setState({ selectedCategory: key })}
        />
      ))}
    </div>
  );
};

// ========== 节点项组件 ==========

const NodeItem = ({ nodeOpcode, color }) => {
  const registry = useStore((state) => state.registry.nodes);
  const nodeData = registry[nodeOpcode];
  const handleDragStart = (event) => {
    event.dataTransfer.setData('application/reactflow', nodeOpcode);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="node-item"
      style={{ '--node-color': color }}
      draggable
      onDragStart={handleDragStart}
    >
      {nodeData.label}
    </div>
  );
};

// ========== 节点分组组件 ==========

const NodeGroup = ({ groupData }) => {
  const { label, color, nodes = [] } = groupData;
  return (
    <div className="node-group">
      <div className="group-title" style={{ '--group-color': color }}>{label}</div>
      {nodes.map((nodeOpcode) => (
        <NodeItem key={nodeOpcode} nodeOpcode={nodeOpcode} color={color} />
      ))}
    </div>
  );
};

// ========== 节点列表组件 ==========

const NodeList = ({ registry }) => {
  const selectedCategory = useStore((state) => state.selectedCategory);
  return (
    <div className="node-list">
      {/* registry.categories 是一个对象，每个键值对是一个分类组 */}
      {Object.entries(registry.categories).map(([key, data]) => (
        selectedCategory === 'all' || selectedCategory === key ? (
          <NodeGroup key={key} groupData={data} />
        ) : null
      ))}
    </div>
  );
}
// ========== 主组件 ==========

function Sidebar() {
  const registry = useStore((state) => state.registry);
  return (
    <div className="side-bar">
      <CategoryBar registry={registry} />
      <NodeList registry={registry} />
    </div>
  );
}

export default Sidebar;
