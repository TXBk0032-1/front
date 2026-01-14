/**
 * App.jsx - 应用主入口
 *
 * 这是整个蓝图编辑器的"总装车间"
 * 它本身不干活，只负责把各个零件组装起来
 * 
 * 代码结构：
 * - hooks/ 目录：各种功能模块（历史记录、剪贴板、右键菜单等）
 * - utils/ 目录：工具函数（创建节点）
 * - config/ 目录：配置文件（初始数据、样式配置）
 * - components/ 目录：UI组件（节点、面板、弹窗）
 */

import { useMemo, useRef } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// ========== 组件 ==========
import BaseNode from "./components/BaseNode";
import NodeBox from "./components/NodeBox";
import NodeContextMenu from "./components/NodeContextMenu";
import RenameModal from "./components/RenameModal";

// ========== Hooks ==========
import useHistory from "./hooks/useHistory";
import useClipboard from "./hooks/useClipboard";
import useKeyboardShortcuts from "./hooks/useKeyboardShortcuts";
import useContextMenu from "./hooks/useContextMenu";
import useRename from "./hooks/useRename";
import useNodeActions from "./hooks/useNodeActions";
import useFlowEvents from "./hooks/useFlowEvents";

// ========== 工具和配置 ==========
import { createNode } from "./utils/createNode";
import { initialNodes, initialEdges, INITIAL_NODE_ID } from "./config/initialData";
import {
  defaultEdgeOptions,
  panOnDrag,
  selectionMode,
  deleteKeyCode,
  nodeOrigin,
  colorMode,
  containerStyle,
} from "./config/flowConfig";

// ========== 画布组件 ==========

/**
 * FlowCanvas - React Flow 画布
 *
 * 这是核心组件，但它只做"组装"工作：
 * 1. 初始化各个功能模块（hooks）
 * 2. 把模块提供的方法绑定到 ReactFlow 的事件上
 * 3. 渲染画布和弹窗
 * 
 * 所有具体逻辑都在各个 hooks 里，这里只是"接线"
 */
function FlowCanvas() {
  // ---------- 基础数据 ----------
  
  // 注册自定义节点类型（只创建一次）
  const nodeTypes = useMemo(() => ({ baseNode: BaseNode }), []);
  
  // 节点和连线的状态
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  // 节点ID计数器（用于生成唯一ID）
  const nodeIdCounter = useRef(INITIAL_NODE_ID);

  // ---------- 功能模块 ----------
  
  // 历史记录（撤销/重做）
  const { saveToHistory, undo, redo, isUndoingRef } = useHistory(
    nodes, edges, setNodes, setEdges
  );
  
  // 剪贴板（Ctrl+C/V）
  const { copy, paste, trackMousePosition } = useClipboard(
    nodes, setNodes, createNode, nodeIdCounter, saveToHistory
  );
  
  // 键盘快捷键
  useKeyboardShortcuts({ undo, redo, copy, paste });
  
  // 右键菜单（传入 nodes 用于判断多选）
  const {
    contextMenu,
    openContextMenu,
    closeContextMenu,
    handlePaneContextMenu,
    handlePaneClick,
    handleNodeClick,
  } = useContextMenu(nodes);
  
  // 重命名弹窗
  const {
    renameTarget,
    isRenameOpen,
    openRenameModal,
    closeRenameModal,
    confirmRename,
  } = useRename(nodes, setNodes, saveToHistory);
  
  // 节点操作（复制粘贴、删除，支持批量）
  const { duplicateNodes, deleteNodes } = useNodeActions(
    nodes, setNodes, setEdges, nodeIdCounter, saveToHistory
  );
  
  // 画布事件（连线、拖拽等）
  const {
    handleConnect,
    handleReconnectStart,
    handleReconnect,
    handleReconnectEnd,
    handleNodesChange,
    handleEdgesChange,
    handleDrop,
    handleDragOver,
  } = useFlowEvents(
    setNodes, setEdges, onNodesChange, onEdgesChange,
    saveToHistory, isUndoingRef, nodeIdCounter
  );

  // ---------- 右键菜单操作 ----------
  
  // 这几个函数是"桥接"作用，把右键菜单的点击事件连接到具体操作
  const handleMenuCopyPaste = () => {
    if (contextMenu) {
      duplicateNodes(contextMenu.nodeIds);
      closeContextMenu();
    }
  };
  
  const handleMenuDelete = () => {
    if (contextMenu) {
      deleteNodes(contextMenu.nodeIds);
      closeContextMenu();
    }
  };
  
  const handleMenuRename = () => {
    if (contextMenu) {
      // 重命名只能操作单个节点，取第一个
      openRenameModal(contextMenu.nodeIds[0]);
      closeContextMenu();
    }
  };

  // ---------- 节点数据注入 ----------
  
  // 把双击重命名功能注入到每个节点
  // 这样节点组件就可以调用 onDoubleClick 来打开重命名弹窗
  const nodesWithCallbacks = useMemo(() => {
    return nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        onDoubleClick: openRenameModal,
      },
    }));
  }, [nodes, openRenameModal]);

  // ---------- 渲染 ----------
  
  return (
    <>
      <ReactFlow
        // 数据
        nodes={nodesWithCallbacks}
        edges={edges}
        nodeTypes={nodeTypes}
        
        // 状态变化
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        
        // 拖拽创建节点
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        
        // 鼠标追踪（用于粘贴定位）
        onMouseMove={trackMousePosition}
        
        // 右键菜单
        onNodeContextMenu={openContextMenu}
        onPaneContextMenu={handlePaneContextMenu}
        
        // 左键点击关闭菜单
        onPaneClick={handlePaneClick}
        onNodeClick={handleNodeClick}
        
        // 连线重连（拔出插头效果）
        onReconnect={handleReconnect}
        onReconnectStart={handleReconnectStart}
        onReconnectEnd={handleReconnectEnd}
        
        // 交互配置
        panOnDrag={panOnDrag}
        selectionOnDrag
        selectionMode={selectionMode}
        deleteKeyCode={deleteKeyCode}
        
        // 外观配置
        nodeOrigin={nodeOrigin}
        colorMode={colorMode}
        fitView
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineStyle={defaultEdgeOptions.style}
      />

      {/* 右键菜单 */}
      {contextMenu && (
        <NodeContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          nodeCount={contextMenu.nodeIds.length}
          onCopyPaste={handleMenuCopyPaste}
          onDelete={handleMenuDelete}
          onRename={handleMenuRename}
          onClose={closeContextMenu}
        />
      )}

      {/* 重命名弹窗 */}
      <RenameModal
        isOpen={isRenameOpen}
        onClose={closeRenameModal}
        currentName={renameTarget?.currentName || ""}
        onConfirm={confirmRename}
      />
    </>
  );
}

// ========== 主组件 ==========

// 画布容器样式
const canvasContainerStyle = {
  flex: 1,
  height: "100%",
};

/**
 * App - 应用入口
 *
 * 布局：左边节点面板，右边画布，左右并列
 * 
 * ReactFlowProvider 是必须的，它提供 React Flow 的上下文
 * 所有用到 useReactFlow 的组件都要放在它里面
 */
function App() {
  return (
    <div style={containerStyle}>
      {/* 左侧：节点面板 */}
      <NodeBox />

      {/* 右侧：画布 */}
      <div style={canvasContainerStyle}>
        <ReactFlowProvider>
          <FlowCanvas />
        </ReactFlowProvider>
      </div>
    </div>
  );
}

export default App;
