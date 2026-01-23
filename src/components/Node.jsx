/**
 * Node.jsx - 节点组件
 * 
 * 通用蓝图节点，包含：
 * - 左侧输入端口
 * - 中间标题
 * - 右侧输出端口
 */

import { Handle, Position, useEdges, useReactFlow } from '@xyflow/react';
import { Button } from '@heroui/react';
import { selectNode } from '../utils/blueprint/selectNode';
import { showNodePanel, bindNodePanelToNode } from '../utils/blueprint/nodePanel';
import { showNodeMenu, bindNodeMenuToNode } from '../utils/blueprint/nodeMenu';
import '../styles/Node.css';

const DRAG_THRESHOLD = 5;

// ========== 输入端口组件 ==========

const InputPort = ({ id, label, nodeId }) => {
  const edges = useEdges();
  const { setEdges } = useReactFlow();

  const handleMouseDown = (event) => {
    const connectedEdge = findConnectedEdge(edges, nodeId, id);
    if (!connectedEdge) return;
    event.stopPropagation();
    startDragDetection(event, connectedEdge, setEdges);
  };

  return (
    <div className="port-item">
      <Handle
        type="target"
        position={Position.Left}
        id={id}
        className="handle"
        onMouseDown={handleMouseDown}
      />
      <span className="input-label">{label}</span>
    </div>
  );
};

// ========== 输出端口组件 ==========

const OutputPort = ({ id, label }) => (
  <div className="port-item">
    <span className="output-label">{label}</span>
    <Handle
      type="source"
      position={Position.Right}
      id={id}
      className="handle"
    />
  </div>
);

// ========== 节点主体组件 ==========

const Node = ({ data, id }) => {

  const color = data.color || 'rgb(137, 146, 235)';
  const label = data.label || '未命名节点';
  const inputs = data.inputs || [];
  const outputs = data.outputs || [];

  const handleClick = (event) => {
    event.stopPropagation();
    const isCtrlPressed = event.ctrlKey || event.metaKey;
    selectNode(id, isCtrlPressed);
  };
  const handleContextMenu = (event) => {
    event.preventDefault();
    event.stopPropagation();
    bindNodeMenuToNode(id);
    showNodeMenu();
    console.log('右键点击节点');
  };

  return (
    <Button
      className="container"
      style={{ background: color }}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      {/* 左侧：输入端口区域 */}
      <div className="port-container">
        {inputs.map((port, index) => (
          <InputPort key={`in-${index}`} id={port.id} label={port.label} nodeId={id} />
        ))}
      </div>

      {/* 中间：标题区域 */}
      <div className="title-container">
        <div className="title">{label}</div>
      </div>

      {/* 右侧：输出端口区域 */}
      <div className="port-container">
        {outputs.map((port, index) => (
          <OutputPort key={`out-${index}`} id={port.id} label={port.label} />
        ))}
      </div>
    </Button>
  );
};

// ========== 辅助函数 ==========

function findConnectedEdge(edges, nodeId, handleId) {
  return edges.find(
    (edge) => edge.target === nodeId && edge.targetHandle === handleId
  );
}

function startDragDetection(event, connectedEdge, setEdges) {
  const startX = event.clientX;
  const startY = event.clientY;
  let hasDragged = false;

  const handleMouseMove = (moveEvent) => {
    const deltaX = Math.abs(moveEvent.clientX - startX);
    const deltaY = Math.abs(moveEvent.clientY - startY);
    const isDragging = deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD;

    if (!hasDragged && isDragging) {
      hasDragged = true;
      setEdges((eds) => eds.filter((e) => e.id !== connectedEdge.id));
      simulateMouseDownOnSourcePort(connectedEdge, moveEvent);
      cleanup();
    }
  };

  const handleMouseUp = () => cleanup();

  const cleanup = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
}

function simulateMouseDownOnSourcePort(connectedEdge, moveEvent) {
  const sourceSelector = `[data-nodeid="${connectedEdge.source}"][data-handleid="${connectedEdge.sourceHandle}"]`;
  const sourceHandle = document.querySelector(sourceSelector);
  if (!sourceHandle) return;

  const fakeMouseDown = new MouseEvent('mousedown', {
    bubbles: true,
    cancelable: true,
    clientX: moveEvent.clientX,
    clientY: moveEvent.clientY,
    button: 0
  });
  sourceHandle.dispatchEvent(fakeMouseDown);
}

export default Node;
