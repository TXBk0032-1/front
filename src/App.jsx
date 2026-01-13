/**
 * App.jsx - 应用主入口
 *
 * 这是整个蓝图编辑器的核心文件
 * 但它本身不包含太多逻辑，主要是"组装"各个模块
 *
 * 架构说明：
 * - hooks/ 目录：各种功能的 Hook（历史记录、剪贴板、快捷键）
 * - utils/ 目录：工具函数（节点工厂）
 * - config/ 目录：配置文件（初始数据、Flow配置）
 * - components/ 目录：UI组件（节点、面板）
 */

import { useCallback, useMemo, useRef } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
  reconnectEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// ========== 自定义模块 ==========

// 组件
import BaseNode from "./components/BaseNode";
import NodeBox from "./components/NodeBox";

// Hooks
import useHistory from "./hooks/useHistory";
import useClipboard from "./hooks/useClipboard";
import useKeyboardShortcuts from "./hooks/useKeyboardShortcuts";

// 工具函数
import { createNode } from "./utils/createNode";

// 配置
import {
  initialNodes,
  initialEdges,
  INITIAL_NODE_ID,
} from "./config/initialData";
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
 * 这是一个内部组件，必须放在 ReactFlowProvider 里面
 * 因为它用到了 useReactFlow 这个 hook
 *
 * 主要职责：
 * 1. 管理节点和连线的状态
 * 2. 处理各种交互事件
 * 3. 渲染 React Flow 画布
 */
function FlowCanvas() {
  // ---------- 基础设置 ----------

  // 注册自定义节点类型（useMemo 确保只创建一次）
  const nodeTypes = useMemo(() => ({ baseNode: BaseNode }), []);

  // 节点和连线的状态管理
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // React Flow API
  const { screenToFlowPosition } = useReactFlow();

  // 节点ID计数器
  const nodeIdCounter = useRef(INITIAL_NODE_ID);

  // ---------- 功能模块 ----------

  // 历史记录（撤销/重做）
  const { saveToHistory, undo, redo, isUndoingRef } = useHistory(
    nodes,
    edges,
    setNodes,
    setEdges
  );

  // 剪贴板（复制/粘贴）
  const { copy, paste, trackMousePosition } = useClipboard(
    nodes,
    setNodes,
    createNode,
    nodeIdCounter,
    saveToHistory
  );

  // 键盘快捷键
  useKeyboardShortcuts({ undo, redo, copy, paste });

  // ---------- 连线处理 ----------

  /**
   * 处理新建连线
   *
   * 规则：输入端口只能接受一个连接
   * 如果目标端口已有连接，先断开旧连接，再建立新连接
   */
  const onConnect = useCallback(
    (params) => {
      saveToHistory();
      setEdges((eds) => {
        // 先删除目标端口的旧连接
        const filtered = eds.filter(
          (e) =>
            !(
              e.target === params.target &&
              e.targetHandle === params.targetHandle
            )
        );
        // 再添加新连接
        return addEdge(params, filtered);
      });
    },
    [setEdges, saveToHistory]
  );

  // ---------- 连线重连（拔出连接线效果） ----------

  // 标记重连是否成功
  const edgeReconnectSuccessful = useRef(true);

  // 开始重连
  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, []);

  // 重连成功
  const onReconnect = useCallback(
    (oldEdge, newConnection) => {
      edgeReconnectSuccessful.current = true;
      saveToHistory();
      setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
    },
    [setEdges, saveToHistory]
  );

  // 重连结束（如果没成功连到新端口，就删除这条线）
  const onReconnectEnd = useCallback(
    (_, edge) => {
      if (!edgeReconnectSuccessful.current) {
        saveToHistory();
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }
      edgeReconnectSuccessful.current = true;
    },
    [setEdges, saveToHistory]
  );

  // ---------- 状态变化处理 ----------

  /**
   * 处理节点变化
   * 在适当的时机保存历史记录
   */
  const handleNodesChange = useCallback(
    (changes) => {
      // 检查是否有需要记录的变化
      const hasPositionChange = changes.some(
        (c) => c.type === "position" && c.dragging === false
      );
      const hasRemove = changes.some((c) => c.type === "remove");

      // 有实质性变化时保存历史
      if ((hasPositionChange || hasRemove) && !isUndoingRef.current) {
        saveToHistory();
      }

      onNodesChange(changes);
    },
    [onNodesChange, saveToHistory, isUndoingRef]
  );

  /**
   * 处理连线变化
   */
  const handleEdgesChange = useCallback(
    (changes) => {
      const hasRemove = changes.some((c) => c.type === "remove");

      if (hasRemove && !isUndoingRef.current) {
        saveToHistory();
      }

      onEdgesChange(changes);
    },
    [onEdgesChange, saveToHistory, isUndoingRef]
  );

  // ---------- 拖拽创建节点 ----------

  /**
   * 处理拖拽放置
   * 用户从节点面板拖拽节点到画布时触发
   */
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      // 获取拖拽的节点类型
      const nodeKey = event.dataTransfer.getData("application/reactflow");
      if (!nodeKey) return;

      // 转换坐标
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // 创建新节点
      saveToHistory();
      const newId = `node-${nodeIdCounter.current++}`;
      const newNode = createNode(newId, nodeKey, position);
      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes, saveToHistory]
  );

  /**
   * 允许拖拽放置
   * 必须阻止默认行为，否则 onDrop 不会触发
   */
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // ---------- 其他事件 ----------

  // 禁用右键菜单（因为右键用于移动画布）
  const onContextMenu = useCallback((event) => {
    event.preventDefault();
  }, []);

  // ---------- 渲染 ----------

  return (
    <ReactFlow
      // 数据
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      // 状态变化
      onNodesChange={handleNodesChange}
      onEdgesChange={handleEdgesChange}
      onConnect={onConnect}
      // 拖拽创建
      onDrop={onDrop}
      onDragOver={onDragOver}
      // 鼠标追踪（用于粘贴定位）
      onMouseMove={trackMousePosition}
      // 右键菜单
      onContextMenu={onContextMenu}
      // 连线重连
      onReconnect={onReconnect}
      onReconnectStart={onReconnectStart}
      onReconnectEnd={onReconnectEnd}
      // 交互配置
      panOnDrag={panOnDrag}
      selectionOnDrag
      selectionMode={selectionMode}
      deleteKeyCode={deleteKeyCode}
      // 外观配置
      nodeOrigin={nodeOrigin}
      colorMode={colorMode}
      fitView
      defaultEdgeOptions={defaultEdgeOptions} // 创建后的边缘样式
      connectionLineStyle={defaultEdgeOptions.style} // 拖拽时的连接线
    >
      {/* 左侧节点面板 */}
      <NodeBox />
    </ReactFlow>
  );
}

// ========== 主组件 ==========

/**
 * App - 应用入口
 *
 * ReactFlowProvider 是必须的，它提供了 React Flow 的上下文
 * 所有使用 useReactFlow 的组件都必须在它里面
 */
function App() {
  return (
    <div style={containerStyle}>
      <ReactFlowProvider>
        <FlowCanvas />
      </ReactFlowProvider>
    </div>
  );
}

export default App;
