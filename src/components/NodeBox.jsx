import { NODE_REGISTRY } from "../constants/nodeRegistry";
import { Panel } from "@xyflow/react";
import "./NodeBox.css";

const NodeItem = ({ nodeId, color }) => {
  const node = NODE_REGISTRY.nodes[nodeId] || {};
  
  // 拖拽开始时，将节点ID存储到dataTransfer中
  const onDragStart = (event) => {
    event.dataTransfer.setData("application/reactflow", nodeId);
    event.dataTransfer.effectAllowed = "move";
  };
  
  return (
    <div
      className="node-item"
      style={{ background: color }}
      draggable
      onDragStart={onDragStart}
    >
      {node.label || nodeId}
    </div>
  );
};

const NodeGroup = ({ groupKey, groupData }) => (
  <div key={groupKey} className="node-group">
    <div className="group-title" style={{ color: groupData.color }}>
      {groupData.label}
    </div>
    {groupData.nodes?.map((nodeId) => (
      <NodeItem key={nodeId} nodeId={nodeId} color={groupData.color} />
    ))}
  </div>
);

const NodeBox = () => (
  <Panel position="top-left" className="node-box">
    {Object.entries(NODE_REGISTRY.categories || {}).map(
      ([groupKey, groupData]) => (
        <NodeGroup key={groupKey} groupKey={groupKey} groupData={groupData} />
      )
    )}
  </Panel>
);

export default NodeBox;
