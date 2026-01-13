/**
 * NodeBox - 节点面板组件
 *
 * 这是画布左边的那个面板，类似 Scratch 编辑器的积木盒
 * 用户可以从这里拖拽节点到画布上
 */

import { Panel } from "@xyflow/react";
import { getNodeConfig, getAllCategories } from "../constants/nodeRegistry";
import "./NodeBox.css";

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
 * 使用 React Flow 的 Panel 组件，固定在画布左上角
 * 遍历所有分类，渲染出完整的节点列表
 */
const NodeBox = () => {
  // 获取所有分类数据
  const categories = getAllCategories();

  return (
    <Panel position="top-left" className="node-box">
      {categories.map(([groupKey, groupData]) => (
        <NodeGroup key={groupKey} groupData={groupData} />
      ))}
    </Panel>
  );
};

export default NodeBox;
