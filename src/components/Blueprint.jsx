import { useStore, setState } from '../store';
import { useMemo } from 'react';
import { ReactFlow, Background, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import Node from './Node';
import ToolBar from './ToolBar';
import NodeMenu from './NodeMenu';
import PropertyPanel from './NodePanel';
import RenameModal from './RenameModal';

import '../styles/Blueprint.css';

import { addNode } from '../utils/blueprint/addNode';

// React Flow 配置
const FLOW_CONFIG = {
  selectionOnDrag: true,
  selectionMode: 'partial',
  nodeOrigin: [0.5, 0.5],
  colorMode: 'light',
  fitView: true,
  defaultEdgeOptions: {
    style: { strokeWidth: 3, stroke: '#fff' }
  },
  connectionLineStyle: { strokeWidth: 3, stroke: '#fff' }
};

function Blueprint() {
  // 从 store 获取状态
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const viewport = useStore((state) => state.viewport);
  const { screenToFlowPosition } = useReactFlow();

  const nodeTypes = useMemo(() => ({ baseNode: Node }), []);

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  };

  const onDrop = (event) => {
    event.preventDefault();

    // 获取拖拽源设置的数据
    const nodeOpcode = event.dataTransfer.getData('opcode');

    if (nodeOpcode) {
      // 计算节点在画布中的位置
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      
      // 调用添加节点的逻辑
      addNode(nodeOpcode, position);
    }
  };

  return (
    <div className="blueprint">
      <ReactFlow
        nodeTypes={nodeTypes}
        proOptions={{ hideAttribution: true }}
        nodes={nodes}
        edges={edges}
        viewport={viewport}
        onViewportChange={(newViewport) => setState({ viewport: newViewport })}
        {...FLOW_CONFIG}
        
        // 分别绑定拖拽和放置事件
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <Background />
      </ReactFlow>

      <ToolBar />
      <NodeMenu />
      <PropertyPanel />
      <RenameModal />
    </div>
  );
}

export default Blueprint;
