/**
 * Blueprint.jsx - 蓝图画布组件
 * 
 * 主画布区域，包含：
 * - React Flow 画布
 * - 节点渲染
 * - 连线渲染
 */
import { useStore } from '../store';
import { useMemo } from 'react';
import { ReactFlow } from '@xyflow/react';
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
  const { nodes, edges } = useStore();
  const nodeTypes = useMemo(() => ({ baseNode: Node }), []);

  return (
    <div className="blueprint">
      <ReactFlow
        nodeTypes={nodeTypes}
        proOptions={{ hideAttribution: true }} // 隐藏水印
        nodes={nodes}
        edges={edges}
        {...FLOW_CONFIG}
      />

      <ToolBar />
      <NodeMenu />
      <PropertyPanel />
      <RenameModal />
    </div>
  );
}

export default Blueprint;
