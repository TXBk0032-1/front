/**
 * App.jsx - 应用主入口
 * 
 * 这是整个蓝图编辑器的核心文件
 * 主要功能：
 * 1. 渲染 React Flow 画布
 * 2. 管理节点和连线的状态
 * 3. 处理从节点面板拖拽创建新节点
 */

import { useCallback, useMemo, useRef } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// 自定义组件
import BaseNode from "./components/BaseNode";
import NodeBox from "./components/NodeBox";

// 节点注册表的辅助函数
import { getNodeConfig, getNodeColor } from "./constants/nodeRegistry";


/**
 * 根据节点ID创建一个完整的节点对象
 * 
 * 这个函数负责：
 * 1. 从注册表获取节点配置
 * 2. 查找节点的主题色
 * 3. 组装成 React Flow 需要的节点格式
 * 
 * @param {string} id - 节点的唯一标识（如 "node-1"）
 * @param {string} nodeKey - 节点在注册表中的类型（如 "node1"）
 * @param {Object} position - 节点位置 { x, y }
 */
const createNode = (id, nodeKey, position) => {
  // 获取节点配置
  const config = getNodeConfig(nodeKey);
  
  // 获取节点颜色（从所属分类继承）
  const color = getNodeColor(nodeKey);

  return {
    id,
    type: config.type || "baseNode", // 默认使用 baseNode 类型
    position,
    data: {
      ...config,
      color,
    },
  };
};

// ========== 初始数据 ==========

// 画布上默认显示的节点（演示用）
const initialNodes = [
  createNode("node-1", "node1", { x: 100, y: 100 }),
  createNode("node-2", "node2", { x: 350, y: 100 }),
  createNode("node-3", "node3", { x: 600, y: 100 }),
  createNode("node-4", "node4", { x: 850, y: 100 }),
];

// 默认的连线（把上面4个节点串起来）
const initialEdges = [
  { id: "e1-2", source: "node-1", sourceHandle: "out", target: "node-2", targetHandle: "in" },
  { id: "e2-3", source: "node-2", sourceHandle: "out", target: "node-3", targetHandle: "in" },
  { id: "e3-4", source: "node-3", sourceHandle: "out", target: "node-4", targetHandle: "in" },
];

// 连线的默认样式
const defaultEdgeStyle = {
  style: { strokeWidth: 3, stroke: "#fff" },
};

// ========== 画布组件 ==========

/**
 * FlowCanvas - React Flow 画布
 * 
 * 这是一个内部组件，必须放在 ReactFlowProvider 里面
 * 因为它用到了 useReactFlow 这个 hook
 */
function FlowCanvas() {
  // 注册自定义节点类型
  // useMemo 确保只创建一次，避免重复渲染
  const nodeTypes = useMemo(() => ({ baseNode: BaseNode }), []);

  // 节点和连线的状态管理
  // React Flow 提供的 hook，自带增删改的处理逻辑
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // 获取坐标转换 API（把屏幕坐标转成画布坐标）
  const { screenToFlowPosition } = useReactFlow();

  // 节点ID计数器，用于生成唯一ID
  const nodeIdCounter = useRef(5);

  // ---------- 事件处理 ----------

  // 处理连线：用户拖拽连接两个节点时触发
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // 处理拖拽放置：用户从节点面板拖拽节点到画布时触发
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      // 从 dataTransfer 获取节点类型
      const nodeKey = event.dataTransfer.getData("application/reactflow");
      if (!nodeKey) return;

      // 把鼠标位置转换成画布坐标
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // 创建新节点并添加到画布
      const newId = `node-${nodeIdCounter.current++}`;
      const newNode = createNode(newId, nodeKey, position);
      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes]
  );

  // 允许拖拽放置（必须阻止默认行为，否则 onDrop 不会触发）
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // ---------- 渲染 ----------

  return (
    <ReactFlow
      // 数据
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      // 事件
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onDrop={onDrop}
      onDragOver={onDragOver}
      // 配置
      nodeOrigin={[0.5, 0.5]} // 节点原点在中心（拖拽时更自然）
      colorMode="light"
      fitView // 自动缩放以显示所有节点
      defaultEdgeOptions={defaultEdgeStyle}
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
    <div style={styles.container}>
      <ReactFlowProvider>
        <FlowCanvas />
      </ReactFlowProvider>
    </div>
  );
}

// 容器样式：撑满整个屏幕
const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    background: "#e2e9faff",
  },
};

export default App;
