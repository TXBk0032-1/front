/**
 * Blueprint.jsx - 蓝图画布组件
 * 
 * 主画布区域，包含：
 * - React Flow 画布
 * - 节点渲染
 * - 连线渲染
 */
import { useStore, setState } from '../store';
import { useMemo } from 'react';
import { ReactFlowProvider, ReactFlow, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import Node from './Node';
import ToolBar from './ToolBar';
import NodeMenu from './NodeMenu';
import PropertyPanel from './NodePanel';
import RenameModal from './RenameModal';

import '../styles/Blueprint.css';

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

  const nodeTypes = useMemo(() => ({ baseNode: Node }), []);

  return (
    <div className="blueprint">
      <ReactFlowProvider>
        <ReactFlow
          nodeTypes={nodeTypes}
          proOptions={{ hideAttribution: true }} // 隐藏水印
          nodes={nodes}
          edges={edges}
          viewport={viewport}
          onViewportChange={(newViewport) => setState({ viewport: newViewport })}
          {...FLOW_CONFIG}
        >
          <Background />
        </ReactFlow>
      </ReactFlowProvider>

      <ToolBar />
      <NodeMenu />
      <PropertyPanel />
      <RenameModal />
    </div>
  );
}

export default Blueprint;
