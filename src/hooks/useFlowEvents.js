/**
 * useFlowEvents - 画布事件处理
 * 
 * 处理 React Flow 画布上的各种事件：
 * - 连线事件：新建连线、重连连线
 * - 状态变化：节点移动、删除时保存历史
 * - 拖拽创建：从节点面板拖拽节点到画布
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
  
  const { screenToFlowPosition } = useReactFlow();                               // 获取坐标转换函数
  const reconnectSuccessRef = useRef(true);                                      // 标记重连是否成功

  // ==================== 连线事件 ====================

  /**
   * 新建连线
   * 规则：输入端口只能接受一个连接，如果已有连接则先断开
   */
  const handleConnect = useCallback((params) => {
    saveToHistory();                                                             // 保存当前状态到历史
    setEdges((currentEdges) => {                                                 // 更新连线
      const targetPort = params.targetHandle;                                    // 目标端口ID
      const targetNode = params.target;                                          // 目标节点ID
      const withoutOldConnection = currentEdges.filter((edge) =>                 // 过滤掉目标端口的旧连接
        !(edge.target === targetNode && edge.targetHandle === targetPort)
      );
      return addEdge(params, withoutOldConnection);                              // 添加新连接
    });
  }, [setEdges, saveToHistory]);

  /**
   * 开始重连（用户拔出连线）
   */
  const handleReconnectStart = useCallback(() => {
    reconnectSuccessRef.current = false;                                         // 假设重连会失败
  }, []);

  /**
   * 重连成功（连线连到了新端口）
   */
  const handleReconnect = useCallback((oldEdge, newConnection) => {
    reconnectSuccessRef.current = true;                                          // 标记重连成功
    saveToHistory();                                                             // 保存历史
    setEdges((edges) => reconnectEdge(oldEdge, newConnection, edges));           // 更新连线
  }, [setEdges, saveToHistory]);

  /**
   * 重连结束
   * 如果重连失败（没连到新端口），就删除这条线
   */
  const handleReconnectEnd = useCallback((_, edge) => {
    if (reconnectSuccessRef.current) return;                                     // 如果重连成功，不做处理
    saveToHistory();                                                             // 保存历史
    setEdges((edges) => edges.filter((e) => e.id !== edge.id));                  // 删除这条线
    reconnectSuccessRef.current = true;                                          // 重置标记
  }, [setEdges, saveToHistory]);

  // ==================== 状态变化事件 ====================

  /**
   * 节点变化（移动、删除等）
   * 在适当时机保存历史记录
   */
  const handleNodesChange = useCallback((changes) => {
    const isUndoing = isUndoingRef.current;                                      // 是否正在撤销/重做
    const hasPositionEnd = changes.some((c) =>                                   // 是否有节点停止拖拽
      c.type === "position" && c.dragging === false
    );
    const hasRemove = changes.some((c) => c.type === "remove");                  // 是否有节点被删除
    const shouldSave = (hasPositionEnd || hasRemove) && !isUndoing;              // 判断是否需要保存历史
    if (shouldSave) saveToHistory();                                             // 保存历史
    onNodesChange(changes);                                                      // 执行原本的变化处理
  }, [onNodesChange, saveToHistory, isUndoingRef]);

  /**
   * 连线变化（删除等）
   */
  const handleEdgesChange = useCallback((changes) => {
    const isUndoing = isUndoingRef.current;                                      // 是否正在撤销/重做
    const hasRemove = changes.some((c) => c.type === "remove");                  // 是否有连线被删除
    const shouldSave = hasRemove && !isUndoing;                                  // 判断是否需要保存历史
    if (shouldSave) saveToHistory();                                             // 保存历史
    onEdgesChange(changes);                                                      // 执行原本的变化处理
  }, [onEdgesChange, saveToHistory, isUndoingRef]);

  // ==================== 拖拽创建节点 ====================

  /**
   * 拖拽放置（从节点面板拖拽节点到画布）
   */
  const handleDrop = useCallback((event) => {
    event.preventDefault();                                                      // 阻止默认行为
    const nodeKey = event.dataTransfer.getData("application/reactflow");         // 获取拖拽的节点类型
    if (!nodeKey) return;                                                        // 如果没有节点类型，不处理
    const position = screenToFlowPosition({                                      // 把屏幕坐标转换成画布坐标
      x: event.clientX,
      y: event.clientY,
    });
    saveToHistory();                                                             // 保存历史
    const newId = `node-${nodeIdCounterRef.current++}`;                          // 生成新节点ID
    const newNode = createNode(newId, nodeKey, position);                        // 创建新节点
    setNodes((nodes) => nodes.concat(newNode));                                  // 添加到画布
  }, [screenToFlowPosition, setNodes, saveToHistory, nodeIdCounterRef]);

  /**
   * 允许拖拽放置
   * 必须阻止默认行为，否则 onDrop 不会触发
   */
  const handleDragOver = useCallback((event) => {
    event.preventDefault();                                                      // 阻止默认行为
    event.dataTransfer.dropEffect = "move";                                      // 设置拖拽效果
  }, []);

  // ==================== 返回所有事件处理函数 ====================

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

export default useFlowEvents;
