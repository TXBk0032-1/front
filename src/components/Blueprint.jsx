import { useStore, setState } from '../store';
import { useMemo } from 'react';
import { ReactFlow, Background, useReactFlow, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { FLOW_CONFIG } from '../constants/config';
import { setViewport } from '../utils/blueprint/viewport';

import Node from './Node';
import ToolBar from './ToolBar';
import NodeMenu from './NodeMenu';
import NodePanel from './NodePanel';
import { addNode } from '../utils/blueprint/addNode';
import { addEdge } from '../utils/blueprint/addEdge';

import { hideNodeMenuAndPanel } from '../utils/index';

import '../styles/Blueprint.css'

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

const onConnect = (connection) => {
  addEdge(
    connection.source,
    connection.sourceHandle,
    connection.target,
    connection.targetHandle
  );
};

const onDragOver = (e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
};

const onClick = (e) => {
  hideNodeMenuAndPanel();
}
const onContextMenu = (e) => {
  e.preventDefault();
  e.stopPropagation();
}


function Blueprint() {
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);
  const viewport = useStore((s) => s.viewport);
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
      viewport={viewport}
      onViewportChange={setViewport}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      onClick={onClick}
      onContextMenu={onContextMenu}
      proOptions={{ hideAttribution: true }}
      {...FLOW_CONFIG}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <ToolBar />
      <NodeMenu />
      <NodePanel />
      <Background />

    </ReactFlow>
  );
}

export default Blueprint;
