import { useStore, setState } from '../store';
import { useMemo } from 'react';
import { ReactFlow, Background, useReactFlow, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { FLOW_CONFIG } from '../constants/config';

import Node from './Node';
import ToolBar from './ToolBar';
import { addNode } from '../utils/blueprint/addNode';

const onNodesChange = (changes) => {
  setState((state) => ({
    nodes: applyNodeChanges(changes, state.nodes)
  }));
};

const onEdgesChange = (changes) => {
  setState((state) => ({
    edges: applyEdgeChanges(changes, state.edges)
  }));
};

const onDragOver = (e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
};


function Blueprint() {
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);
  const nodeTypes = useMemo(() => ({ baseNode: Node }), []);
  const { screenToFlowPosition } = useReactFlow();

  const onDrop = (e) => {
    e.preventDefault();
    const nodeOpcode = e.dataTransfer.getData('opcode');
    if (nodeOpcode) {
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      addNode(nodeOpcode, position);
    }
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      proOptions={{ hideAttribution: true }} // 隐藏水印
      {...FLOW_CONFIG}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <ToolBar />
      <Background />

    </ReactFlow>
  );
}

export default Blueprint;
