/**
 * Blueprint.jsx - 蓝图画布组件
 * 
 * 主画布区域，包含：
 * - React Flow 画布
 * - 节点渲染
 * - 连线渲染
 * - 事件处理
 * 
 * 注意：使用 Zustand 直接管理 nodes/edges 状态
 * 避免使用 useNodesState/useEdgesState 导致双重状态管理
 */

import { useMemo, useCallback } from 'react';
import { 
  ReactFlow, 
  useReactFlow,
  addEdge,
  reconnectEdge,
  applyNodeChanges,
  applyEdgeChanges
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import useStore from '../store';
import Node from './Node';
import ToolBar from './ToolBar';
import NodeMenu from './NodeMenu';
import { PropertyPanel, RenameModal } from './NodePanel';
import { createNode } from '../utils/createNode';
import { checkShouldSaveHistory, checkEdgesShouldSaveHistory } from '../utils/core/history';
import { getTargetNodeIds, checkIsSingleSelect } from '../utils/core/actions';

import '../styles/Blueprint.css';

// React Flow 配置
const FLOW_CONFIG = {
  panOnDrag: [1, 2],
  selectionOnDrag: true,
  selectionMode: 'partial',
  deleteKeyCode: 'Delete',
  nodeOrigin: [0.5, 0.5],
  colorMode: 'light',
  fitView: true,
  defaultEdgeOptions: {
    style: { strokeWidth: 3, stroke: '#fff' }
  },
  connectionLineStyle: { strokeWidth: 3, stroke: '#fff' }
};

function Blueprint() {
  const { screenToFlowPosition } = useReactFlow();
  
  // 从 store 获取状态 - 直接使用 store 中的 nodes/edges
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const setNodes = useStore((state) => state.setNodes);
  const setEdges = useStore((state) => state.setEdges);
  const getNextNodeId = useStore((state) => state.getNextNodeId);
  const saveToHistory = useStore((state) => state.saveToHistory);
  const isUndoing = useStore((state) => state.isUndoing);
  const openContextMenu = useStore((state) => state.openContextMenu);
  const closeContextMenu = useStore((state) => state.closeContextMenu);
  const openPropertyPanel = useStore((state) => state.openPropertyPanel);
  const closePropertyPanel = useStore((state) => state.closePropertyPanel);
  const setMousePosition = useStore((state) => state.setMousePosition);

  // 注册节点类型
  const nodeTypes = useMemo(() => ({ baseNode: Node }), []);

  // ========== 节点变化 ==========

  const handleNodesChange = useCallback((changes) => {
    const shouldSave = checkShouldSaveHistory(changes, isUndoing);
    if (shouldSave) saveToHistory();
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, [setNodes, saveToHistory, isUndoing]);

  const handleEdgesChange = useCallback((changes) => {
    const shouldSave = checkEdgesShouldSaveHistory(changes, isUndoing);
    if (shouldSave) saveToHistory();
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, [setEdges, saveToHistory, isUndoing]);

  // ========== 连线事件 ==========

  const handleConnect = useCallback((params) => {
    saveToHistory();
    setEdges((eds) => {
      const filtered = eds.filter(
        (edge) => !(edge.target === params.target && edge.targetHandle === params.targetHandle)
      );
      return addEdge(params, filtered);
    });
  }, [setEdges, saveToHistory]);

  const handleReconnect = useCallback((oldEdge, newConnection) => {
    saveToHistory();
    setEdges((eds) => reconnectEdge(oldEdge, newConnection, eds));
  }, [setEdges, saveToHistory]);

  const handleReconnectEnd = useCallback((_, edge, handleType) => {
    if (handleType === 'source' || handleType === 'target') {
      return;
    }
    saveToHistory();
    setEdges((eds) => eds.filter((e) => e.id !== edge.id));
  }, [setEdges, saveToHistory]);

  // ========== 拖拽创建节点 ==========

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const nodeKey = event.dataTransfer.getData('application/reactflow');
    if (!nodeKey) return;

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY
    });

    saveToHistory();
    const newId = getNextNodeId();
    const newNode = createNode(newId, nodeKey, position);
    setNodes((nds) => nds.concat(newNode));
  }, [screenToFlowPosition, setNodes, saveToHistory, getNextNodeId]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // ========== 右键菜单 ==========

  const handleNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
    const targetNodeIds = getTargetNodeIds(nodes, node);
    openContextMenu(node.id, targetNodeIds);
    
    const isSingleSelect = checkIsSingleSelect(nodes, node);
    if (isSingleSelect) {
      openPropertyPanel(node.id);
    } else {
      closePropertyPanel();
    }
  }, [nodes, openContextMenu, openPropertyPanel, closePropertyPanel]);

  const handlePaneContextMenu = useCallback((event) => {
    event.preventDefault();
    closeContextMenu();
  }, [closeContextMenu]);

  const handlePaneClick = useCallback(() => {
    closeContextMenu();
  }, [closeContextMenu]);

  const handleNodeClick = useCallback(() => {
    closeContextMenu();
  }, [closeContextMenu]);

  // ========== 鼠标追踪 ==========

  const handleMouseMove = useCallback((event) => {
    setMousePosition(event.clientX, event.clientY);
  }, [setMousePosition]);

  return (
    <div className="blueprint-container">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        onReconnect={handleReconnect}
        onReconnectEnd={handleReconnectEnd}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onMouseMove={handleMouseMove}
        onNodeContextMenu={handleNodeContextMenu}
        onPaneContextMenu={handlePaneContextMenu}
        onPaneClick={handlePaneClick}
        onNodeClick={handleNodeClick}
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
