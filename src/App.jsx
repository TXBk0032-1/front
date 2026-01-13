/**
 * App.jsx - 应用主入口
 * 
 * 这是整个蓝图编辑器的核心文件
 * 主要功能：
 * 1. 渲染 React Flow 画布
 * 2. 管理节点和连线的状态
 * 3. 处理从节点面板拖拽创建新节点
 * 4. 实现各种交互操作（删除、框选、撤销重做、复制粘贴等）
 */

import { useCallback, useMemo, useRef, useEffect, useState } from "react";
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
      nodeKey, // 保存节点类型，用于复制粘贴
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

// ========== 历史记录 Hook ==========

/**
 * useHistory - 管理撤销/重做的历史记录
 * 
 * 这个 hook 用来追踪节点和连线的变化历史
 * 支持 Ctrl+Z 撤销和 Ctrl+Y 重做
 */
const useHistory = (nodes, edges, setNodes, setEdges) => {
  // 历史记录栈：存储过去的状态
  const pastRef = useRef([]);
  // 未来记录栈：存储被撤销的状态（用于重做）
  const futureRef = useRef([]);
  // 标记是否正在执行撤销/重做操作（避免重复记录）
  const isUndoingRef = useRef(false);

  // 保存当前状态到历史记录
  const saveToHistory = useCallback(() => {
    // 如果正在撤销/重做，不要记录
    if (isUndoingRef.current) return;
    
    // 把当前状态推入历史栈
    pastRef.current.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    });
    
    // 限制历史记录数量，防止内存爆炸
    if (pastRef.current.length > 50) {
      pastRef.current.shift();
    }
    
    // 有新操作时，清空未来栈（不能重做了）
    futureRef.current = [];
  }, [nodes, edges]);

  // 撤销操作
  const undo = useCallback(() => {
    if (pastRef.current.length === 0) return;
    
    isUndoingRef.current = true;
    
    // 把当前状态推入未来栈
    futureRef.current.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    });
    
    // 从历史栈弹出上一个状态
    const previous = pastRef.current.pop();
    setNodes(previous.nodes);
    setEdges(previous.edges);
    
    // 延迟重置标记，确保状态更新完成
    setTimeout(() => {
      isUndoingRef.current = false;
    }, 0);
  }, [nodes, edges, setNodes, setEdges]);

  // 重做操作
  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return;
    
    isUndoingRef.current = true;
    
    // 把当前状态推入历史栈
    pastRef.current.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    });
    
    // 从未来栈弹出下一个状态
    const next = futureRef.current.pop();
    setNodes(next.nodes);
    setEdges(next.edges);
    
    setTimeout(() => {
      isUndoingRef.current = false;
    }, 0);
  }, [nodes, edges, setNodes, setEdges]);

  return { saveToHistory, undo, redo, isUndoingRef };
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

  // 获取 React Flow 实例 API
  const { screenToFlowPosition } = useReactFlow();

  // 节点ID计数器，用于生成唯一ID
  const nodeIdCounter = useRef(5);

  // 历史记录管理
  const { saveToHistory, undo, redo, isUndoingRef } = useHistory(nodes, edges, setNodes, setEdges);

  // 复制粘贴相关状态
  const [clipboard, setClipboard] = useState(null); // 剪贴板
  const mousePositionRef = useRef({ x: 0, y: 0 }); // 鼠标位置

  // 连线重连相关（用于实现"拔出连接线"效果）
  const edgeReconnectSuccessful = useRef(true);

  // ---------- 事件处理 ----------

  /**
   * 处理连线：用户拖拽连接两个节点时触发
   *
   * 规则：输入端口只能接受一个连接
   * 如果目标端口已有连接，先断开旧连接，再建立新连接
   */
  const onConnect = useCallback(
    (params) => {
      saveToHistory();
      setEdges((eds) => {
        // 先删除目标端口的旧连接（输入端口只能有一个连接）
        const filteredEdges = eds.filter(
          (edge) =>
            !(edge.target === params.target && edge.targetHandle === params.targetHandle)
        );
        // 再添加新连接
        return addEdge(params, filteredEdges);
      });
    },
    [setEdges, saveToHistory]
  );

  // 处理节点变化（移动、选择等）
  const handleNodesChange = useCallback(
    (changes) => {
      // 检查是否有位置变化（拖拽结束）
      const hasPositionChange = changes.some(
        (change) => change.type === "position" && change.dragging === false
      );
      // 检查是否有删除操作
      const hasRemove = changes.some((change) => change.type === "remove");
      
      // 如果有实质性变化，保存历史
      if ((hasPositionChange || hasRemove) && !isUndoingRef.current) {
        saveToHistory();
      }
      
      onNodesChange(changes);
    },
    [onNodesChange, saveToHistory, isUndoingRef]
  );

  // 处理连线变化
  const handleEdgesChange = useCallback(
    (changes) => {
      // 检查是否有删除操作
      const hasRemove = changes.some((change) => change.type === "remove");
      
      if (hasRemove && !isUndoingRef.current) {
        saveToHistory();
      }
      
      onEdgesChange(changes);
    },
    [onEdgesChange, saveToHistory, isUndoingRef]
  );

  // ---------- 连线重连（拔出连接线效果） ----------

  // 开始重连：标记为未成功
  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, []);

  // 重连成功：更新连线
  const onReconnect = useCallback(
    (oldEdge, newConnection) => {
      edgeReconnectSuccessful.current = true;
      saveToHistory();
      setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
    },
    [setEdges, saveToHistory]
  );

  // 重连结束：如果没成功连接到新端口，就删除这条线
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

  // ---------- 拖拽创建节点 ----------

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

      // 保存历史并创建新节点
      saveToHistory();
      const newId = `node-${nodeIdCounter.current++}`;
      const newNode = createNode(newId, nodeKey, position);
      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes, saveToHistory]
  );

  // 允许拖拽放置（必须阻止默认行为，否则 onDrop 不会触发）
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // ---------- 键盘快捷键 ----------

  // 追踪鼠标位置（用于粘贴时定位）
  const onMouseMove = useCallback(
    (event) => {
      mousePositionRef.current = {
        x: event.clientX,
        y: event.clientY,
      };
    },
    []
  );

  // 复制选中的节点
  const copySelectedNodes = useCallback(() => {
    const selectedNodes = nodes.filter((node) => node.selected);
    if (selectedNodes.length === 0) return;

    // 计算选中节点的中心点
    const centerX =
      selectedNodes.reduce((sum, node) => sum + node.position.x, 0) /
      selectedNodes.length;
    const centerY =
      selectedNodes.reduce((sum, node) => sum + node.position.y, 0) /
      selectedNodes.length;

    // 保存到剪贴板（相对于中心点的位置）
    setClipboard({
      nodes: selectedNodes.map((node) => ({
        ...node,
        relativePosition: {
          x: node.position.x - centerX,
          y: node.position.y - centerY,
        },
      })),
    });
  }, [nodes]);

  // 粘贴节点
  const pasteNodes = useCallback(() => {
    if (!clipboard || clipboard.nodes.length === 0) return;

    // 获取鼠标位置对应的画布坐标
    const pastePosition = screenToFlowPosition(mousePositionRef.current);

    saveToHistory();

    // 创建新节点
    const newNodes = clipboard.nodes.map((node) => {
      const newId = `node-${nodeIdCounter.current++}`;
      return {
        ...node,
        id: newId,
        selected: false,
        position: {
          x: pastePosition.x + node.relativePosition.x,
          y: pastePosition.y + node.relativePosition.y,
        },
      };
    });

    // 清理临时属性
    newNodes.forEach((node) => delete node.relativePosition);

    setNodes((nds) => nds.concat(newNodes));
  }, [clipboard, screenToFlowPosition, setNodes, saveToHistory]);

  // 监听键盘事件
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl+Z 撤销
      if (event.ctrlKey && event.key === "z" && !event.shiftKey) {
        event.preventDefault();
        undo();
      }
      // Ctrl+Y 或 Ctrl+Shift+Z 重做
      if (
        (event.ctrlKey && event.key === "y") ||
        (event.ctrlKey && event.shiftKey && event.key === "z")
      ) {
        event.preventDefault();
        redo();
      }
      // Ctrl+C 复制
      if (event.ctrlKey && event.key === "c") {
        event.preventDefault();
        copySelectedNodes();
      }
      // Ctrl+V 粘贴
      if (event.ctrlKey && event.key === "v") {
        event.preventDefault();
        pasteNodes();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, copySelectedNodes, pasteNodes]);

  // 禁用右键菜单（用于右键框选）
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
      // 事件
      onNodesChange={handleNodesChange}
      onEdgesChange={handleEdgesChange}
      onConnect={onConnect}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onMouseMove={onMouseMove}
      onContextMenu={onContextMenu} // 禁用右键菜单
      // 连线重连（从连接线端点拖拽重连）
      onReconnect={onReconnect}
      onReconnectStart={onReconnectStart}
      onReconnectEnd={onReconnectEnd}
      // 框选配置：左键框选，右键拖动画布
      // panOnDrag 指定哪些鼠标按键用于移动画布（0=左键, 1=中键, 2=右键）
      // 不在 panOnDrag 中的按键会用于框选（当 selectionOnDrag 为 true 时）
      panOnDrag={[1, 2]} // 中键(1)和右键(2)移动画布
      selectionOnDrag // 启用拖拽框选（左键触发）
      selectionMode="partial" // 部分选中也算选中
      // 删除功能：React Flow 默认支持 Delete 键删除
      deleteKeyCode="Delete"
      // 其他配置
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
