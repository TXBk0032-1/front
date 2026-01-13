/**
 * App.jsx - 应用主入口
 *
 * 这是整个蓝图编辑器的核心文件
 * 但它本身不包含太多逻辑，主要是"组装"各个模块
 *
 * 架构说明：
 * - hooks/ 目录：各种功能的 Hook（历史记录、剪贴板、快捷键）
 * - utils/ 目录：工具函数（创建节点）
 * - config/ 目录：配置文件（初始数据、Flow配置）
 * - components/ 目录：UI组件（节点、面板）
 */

import { useCallback, useMemo, useRef, useState, useEffect } from "react";
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

// 组件
import BaseNode from "./components/BaseNode";
import NodeBox from "./components/NodeBox";
import NodeContextMenu from "./components/NodeContextMenu";
import RenameModal from "./components/RenameModal";

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

  // ---------- 右键菜单状态 ----------
  
  // 右键菜单状态：null 表示关闭，否则包含位置和目标节点信息
  const [contextMenu, setContextMenu] = useState(null);
  
  // ---------- 重命名弹窗状态 ----------
  
  // 重命名弹窗状态：null 表示关闭，否则包含目标节点信息
  const [renameTarget, setRenameTarget] = useState(null);

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

  // ---------- 右键菜单处理 ----------

  /**
   * 处理节点右键点击
   * 显示右键菜单
   */
  const onNodeContextMenu = useCallback((event, node) => {
    // 阻止默认右键菜单
    event.preventDefault();
    
    // 设置右键菜单状态
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      nodeId: node.id,
    });
  }, []);

  /**
   * 关闭右键菜单
   */
  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  /**
   * 处理画布右键点击（非节点区域）
   * 关闭右键菜单，不显示浏览器默认菜单
   */
  const onPaneContextMenu = useCallback((event) => {
    event.preventDefault();
    closeContextMenu();
  }, [closeContextMenu]);

  /**
   * 处理画布左键点击（非节点区域）
   * 关闭右键菜单
   */
  const onPaneClick = useCallback(() => {
    closeContextMenu();
  }, [closeContextMenu]);

  /**
   * 处理节点左键点击
   * 关闭右键菜单
   */
  const onNodeClick = useCallback(() => {
    closeContextMenu();
  }, [closeContextMenu]);

  // 监听 document 的点击事件，点击菜单外部时关闭菜单
  useEffect(() => {
    // 只有菜单打开时才需要监听
    if (!contextMenu) return;

    const handleClickOutside = (event) => {
      // 检查点击是否在菜单内部
      const menuElement = document.querySelector(".context-menu");
      if (menuElement && !menuElement.contains(event.target)) {
        closeContextMenu();
      }
    };

    // 使用捕获阶段监听，这样即使子元素阻止了事件冒泡也能捕获到
    // 同时监听 mousedown 和 click，确保能捕获到所有点击
    document.addEventListener("mousedown", handleClickOutside, true);
    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [contextMenu, closeContextMenu]);

  // ---------- 右键菜单操作 ----------

  /**
   * 复制并粘贴节点
   * 复制当前右键点击的节点，并立即粘贴到鼠标位置
   */
  const handleCopyPaste = useCallback(() => {
    if (!contextMenu) return;
    
    // 找到目标节点
    const targetNode = nodes.find((n) => n.id === contextMenu.nodeId);
    if (!targetNode) return;
    
    // 保存历史
    saveToHistory();
    
    // 创建新节点（在原节点右下方偏移一点）
    const newId = `node-${nodeIdCounter.current++}`;
    const newPosition = {
      x: targetNode.position.x + 50,
      y: targetNode.position.y + 50,
    };
    const newNode = createNode(newId, targetNode.data.nodeKey, newPosition);
    
    // 如果原节点有自定义名称，也复制过来
    if (targetNode.data.customLabel) {
      newNode.data.customLabel = targetNode.data.customLabel;
      newNode.data.label = targetNode.data.customLabel;
    }
    
    setNodes((nds) => nds.concat(newNode));
  }, [contextMenu, nodes, saveToHistory, setNodes]);

  /**
   * 删除节点
   * 删除当前右键点击的节点
   */
  const handleDeleteNode = useCallback(() => {
    if (!contextMenu) return;
    
    saveToHistory();
    setNodes((nds) => nds.filter((n) => n.id !== contextMenu.nodeId));
    // 同时删除相关的连线
    setEdges((eds) =>
      eds.filter(
        (e) => e.source !== contextMenu.nodeId && e.target !== contextMenu.nodeId
      )
    );
  }, [contextMenu, saveToHistory, setNodes, setEdges]);

  /**
   * 打开重命名弹窗
   */
  const handleOpenRename = useCallback(() => {
    if (!contextMenu) return;
    
    // 找到目标节点
    const targetNode = nodes.find((n) => n.id === contextMenu.nodeId);
    if (!targetNode) return;
    
    // 设置重命名目标
    setRenameTarget({
      nodeId: targetNode.id,
      currentName: targetNode.data.customLabel || targetNode.data.label,
    });
  }, [contextMenu, nodes]);

  // ---------- 重命名处理 ----------

  /**
   * 关闭重命名弹窗
   */
  const closeRenameModal = useCallback(() => {
    setRenameTarget(null);
  }, []);

  /**
   * 确认重命名
   * 更新节点的显示名称
   */
  const handleRenameConfirm = useCallback(
    (newName) => {
      if (!renameTarget) return;
      
      saveToHistory();
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === renameTarget.nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                label: newName,
                customLabel: newName, // 标记为自定义名称
              },
            };
          }
          return node;
        })
      );
    },
    [renameTarget, saveToHistory, setNodes]
  );

  /**
   * 通过节点ID打开重命名弹窗
   * 供 BaseNode 双击时调用
   */
  const openRenameByNodeId = useCallback(
    (nodeId) => {
      const targetNode = nodes.find((n) => n.id === nodeId);
      if (!targetNode) return;
      
      setRenameTarget({
        nodeId: targetNode.id,
        currentName: targetNode.data.customLabel || targetNode.data.label,
      });
    },
    [nodes]
  );

  // ---------- 传递给节点的数据 ----------

  // 把 openRenameByNodeId 函数注入到每个节点的 data 中
  // 这样节点组件就可以调用它来打开重命名弹窗
  const nodesWithRename = useMemo(() => {
    return nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        onDoubleClick: openRenameByNodeId,
      },
    }));
  }, [nodes, openRenameByNodeId]);

  // ---------- 渲染 ----------

  return (
    <>
      <ReactFlow
        // 数据
        nodes={nodesWithRename}
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
        onNodeContextMenu={onNodeContextMenu}
        onPaneContextMenu={onPaneContextMenu}
        // 左键点击关闭菜单
        onPaneClick={onPaneClick}
        onNodeClick={onNodeClick}
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
      />

      {/* 节点右键菜单 */}
      {contextMenu && (
        <NodeContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onCopyPaste={handleCopyPaste}
          onDelete={handleDeleteNode}
          onRename={handleOpenRename}
          onClose={closeContextMenu}
        />
      )}

      {/* 重命名弹窗 */}
      <RenameModal
        isOpen={renameTarget !== null}
        onClose={closeRenameModal}
        currentName={renameTarget?.currentName || ""}
        onConfirm={handleRenameConfirm}
      />
    </>
  );
}

// ========== 主组件 ==========

// 画布容器样式：占据剩余空间
const canvasContainerStyle = {
  flex: 1, // 占据剩余空间
  height: "100%",
};

/**
 * App - 应用入口
 *
 * 布局结构：左边是节点面板，右边是画布
 * 两者左右并列，互不重叠
 *
 * ReactFlowProvider 是必须的，它提供了 React Flow 的上下文
 * 所有使用 useReactFlow 的组件都必须在它里面
 */
function App() {
  return (
    <div style={containerStyle}>
      {/* 左侧：节点面板 */}
      <NodeBox />

      {/* 右侧：画布（占据剩余空间） */}
      <div style={canvasContainerStyle}>
        <ReactFlowProvider>
          <FlowCanvas />
        </ReactFlowProvider>
      </div>
    </div>
  );
}

export default App;
