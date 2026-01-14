/**
 * useFlowEvents.js - 画布事件处理
 * 
 * 处理 React Flow 画布上的各种事件
 * 每个事件处理函数都是独立的，逻辑清晰
 */

import { useCallback, useRef } from "react";                                     // React hooks
import { addEdge, reconnectEdge, useReactFlow } from "@xyflow/react";            // React Flow 工具函数
import { createNode } from "../utils/createNode";                                // 创建节点的工具函数


const useFlowEvents = (
  setNodes,                                                                      // 设置节点的函数
  setEdges,                                                                      // 设置连线的函数
  onNodesChange,                                                                 // React Flow 的节点变化处理
  onEdgesChange,                                                                 // React Flow 的连线变化处理
  saveToHistory,                                                                 // 保存历史记录的函数
  isUndoingRef,                                                                  // 是否正在撤销的标记
  nodeIdCounterRef                                                               // 节点ID计数器
) => {
  
  const { screenToFlowPosition } = useReactFlow();                               // 屏幕坐标转画布坐标
  const reconnectSuccessRef = useRef(true);                                      // 重连是否成功的标记


  // ========== 连线事件 ==========

  /** 新建连线（从输出端口拖到输入端口） */
  const handleConnect = useCallback((params) => {
    saveToHistory();                                                             // 第1步：保存当前状态到历史
    setEdges((currentEdges) => {                                                 // 第2步：更新连线
      const filteredEdges = removeOldConnection(currentEdges, params);           // 第2.1步：删除目标端口的旧连接（输入端口只能有一个连接）
      const newEdges = addEdge(params, filteredEdges);                           // 第2.2步：添加新连接
      return newEdges;                                                           // 第2.3步：返回新的连线数组
    });
  }, [setEdges, saveToHistory]);

  /** 开始重连（用户拔出连线） */
  const handleReconnectStart = useCallback(() => {
    reconnectSuccessRef.current = false;                                         // 标记：假设重连会失败
  }, []);

  /** 重连成功（连线连到了新端口） */
  const handleReconnect = useCallback((oldEdge, newConnection) => {
    reconnectSuccessRef.current = true;                                          // 第1步：标记重连成功
    saveToHistory();                                                             // 第2步：保存历史
    setEdges((edges) => reconnectEdge(oldEdge, newConnection, edges));           // 第3步：更新连线
  }, [setEdges, saveToHistory]);

  /** 重连结束（检查是否需要删除连线） */
  const handleReconnectEnd = useCallback((_, edge) => {
    if (reconnectSuccessRef.current) return;                                     // 如果重连成功，不做处理
    saveToHistory();                                                             // 第1步：保存历史
    setEdges((edges) => edges.filter((e) => e.id !== edge.id));                  // 第2步：删除这条线（因为没连到新端口）
    reconnectSuccessRef.current = true;                                          // 第3步：重置标记
  }, [setEdges, saveToHistory]);


  // ========== 状态变化事件 ==========

  /** 节点变化（移动、删除等） */
  const handleNodesChange = useCallback((changes) => {
    const shouldSave = checkShouldSaveHistory(changes, isUndoingRef.current);    // 第1步：判断是否需要保存历史
    if (shouldSave) saveToHistory();                                             // 第2步：如果需要就保存
    onNodesChange(changes);                                                      // 第3步：执行原本的变化处理
  }, [onNodesChange, saveToHistory, isUndoingRef]);

  /** 连线变化（删除等） */
  const handleEdgesChange = useCallback((changes) => {
    const hasRemove = changes.some((c) => c.type === "remove");                  // 第1步：检查是否有删除操作
    const shouldSave = hasRemove && !isUndoingRef.current;                       // 第2步：判断是否需要保存历史
    if (shouldSave) saveToHistory();                                             // 第3步：如果需要就保存
    onEdgesChange(changes);                                                      // 第4步：执行原本的变化处理
  }, [onEdgesChange, saveToHistory, isUndoingRef]);


  // ========== 拖拽创建节点 ==========

  /** 拖拽放置（从节点面板拖拽节点到画布） */
  const handleDrop = useCallback((event) => {
    event.preventDefault();                                                      // 第1步：阻止默认行为
    const nodeKey = event.dataTransfer.getData("application/reactflow");         // 第2步：获取拖拽的节点类型
    if (!nodeKey) return;                                                        // 第3步：如果没有节点类型，不处理
    const position = screenToFlowPosition({                                      // 第4步：把屏幕坐标转换成画布坐标
      x: event.clientX,
      y: event.clientY,
    });
    saveToHistory();                                                             // 第5步：保存历史
    const newId = `node-${nodeIdCounterRef.current++}`;                          // 第6步：生成新节点ID
    const newNode = createNode(newId, nodeKey, position);                        // 第7步：创建新节点
    setNodes((nodes) => nodes.concat(newNode));                                  // 第8步：添加到画布
  }, [screenToFlowPosition, setNodes, saveToHistory, nodeIdCounterRef]);

  /** 允许拖拽放置（必须阻止默认行为，否则 onDrop 不会触发） */
  const handleDragOver = useCallback((event) => {
    event.preventDefault();                                                      // 阻止默认行为
    event.dataTransfer.dropEffect = "move";                                      // 设置拖拽效果为"移动"
  }, []);


  // ========== 返回所有事件处理函数 ==========

  return {
    handleConnect,                                                               // 新建连线
    handleReconnectStart,                                                        // 开始重连
    handleReconnect,                                                             // 重连成功
    handleReconnectEnd,                                                          // 重连结束
    handleNodesChange,                                                           // 节点变化
    handleEdgesChange,                                                           // 连线变化
    handleDrop,                                                                  // 拖拽放置
    handleDragOver,                                                              // 允许拖拽
  };
};


// ========== 辅助函数（纯逻辑，无副作用） ==========

/** 删除目标端口的旧连接（因为输入端口只能有一个连接） */
function removeOldConnection(edges, params) {
  const targetPort = params.targetHandle;                                        // 目标端口ID
  const targetNode = params.target;                                              // 目标节点ID
  return edges.filter((edge) =>                                                  // 过滤掉旧连接
    !(edge.target === targetNode && edge.targetHandle === targetPort)
  );
}

/** 判断是否需要保存历史记录 */
function checkShouldSaveHistory(changes, isUndoing) {
  if (isUndoing) return false;                                                   // 正在撤销/重做时不保存
  const hasPositionEnd = changes.some((c) =>                                     // 检查是否有节点停止拖拽
    c.type === "position" && c.dragging === false
  );
  const hasRemove = changes.some((c) => c.type === "remove");                    // 检查是否有节点被删除
  return hasPositionEnd || hasRemove;                                            // 有任一情况就需要保存
}


export default useFlowEvents;
