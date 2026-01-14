/**
 * useFlowEvents - 画布事件处理 Hook
 * 
 * 处理 React Flow 画布上的各种事件：
 * - 连线相关：新建连线、重连连线（拔出插头效果）
 * - 拖拽相关：从节点面板拖拽节点到画布
 * - 状态变化：节点移动、删除等变化时保存历史
 * 
 * 把这些事件处理逻辑从主组件抽出来，让主组件更清爽
 */

import { useCallback, useRef } from "react";
import { addEdge, reconnectEdge, useReactFlow } from "@xyflow/react";
import { createNode } from "../utils/createNode";

/**
 * @param {Function} setNodes - 设置节点的函数
 * @param {Function} setEdges - 设置连线的函数
 * @param {Function} onNodesChange - React Flow 的节点变化处理函数
 * @param {Function} onEdgesChange - React Flow 的连线变化处理函数
 * @param {Function} saveToHistory - 保存历史记录的函数
 * @param {Object} isUndoingRef - 是否正在撤销的标记
 * @param {Object} nodeIdCounterRef - 节点ID计数器的 ref
 * @returns {Object} 事件处理函数集合
 */
const useFlowEvents = (
  setNodes,
  setEdges,
  onNodesChange,
  onEdgesChange,
  saveToHistory,
  isUndoingRef,
  nodeIdCounterRef
) => {
  // 获取坐标转换函数
  const { screenToFlowPosition } = useReactFlow();
  
  // 标记重连是否成功（用于判断是否要删除连线）
  const edgeReconnectSuccessful = useRef(true);

  // ========== 连线事件 ==========

  /**
   * 处理新建连线
   * 
   * 规则：输入端口只能接受一个连接
   * 如果目标端口已有连接，先断开旧的，再建立新的
   */
  const handleConnect = useCallback((params) => {
    saveToHistory();
    setEdges((eds) => {
      // 先删掉目标端口的旧连接
      const filtered = eds.filter(
        (e) => !(e.target === params.target && e.targetHandle === params.targetHandle)
      );
      // 再添加新连接
      return addEdge(params, filtered);
    });
  }, [setEdges, saveToHistory]);

  /**
   * 开始重连（拔出连线）
   * 标记重连开始，假设会失败
   */
  const handleReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, []);

  /**
   * 重连成功
   * 把连线从旧端口移到新端口
   */
  const handleReconnect = useCallback((oldEdge, newConnection) => {
    edgeReconnectSuccessful.current = true;
    saveToHistory();
    setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
  }, [setEdges, saveToHistory]);

  /**
   * 重连结束
   * 如果没成功连到新端口，就删除这条线（相当于拔掉了）
   */
  const handleReconnectEnd = useCallback((_, edge) => {
    if (!edgeReconnectSuccessful.current) {
      saveToHistory();
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }
    edgeReconnectSuccessful.current = true;
  }, [setEdges, saveToHistory]);

  // ========== 状态变化事件 ==========

  /**
   * 处理节点变化
   * 在适当的时机保存历史记录
   */
  const handleNodesChange = useCallback((changes) => {
    // 检查是否有需要记录的变化
    const hasPositionChange = changes.some(
      (c) => c.type === "position" && c.dragging === false
    );
    const hasRemove = changes.some((c) => c.type === "remove");

    // 有实质性变化时保存历史（但撤销/重做时不保存）
    if ((hasPositionChange || hasRemove) && !isUndoingRef.current) {
      saveToHistory();
    }

    onNodesChange(changes);
  }, [onNodesChange, saveToHistory, isUndoingRef]);

  /**
   * 处理连线变化
   */
  const handleEdgesChange = useCallback((changes) => {
    const hasRemove = changes.some((c) => c.type === "remove");

    if (hasRemove && !isUndoingRef.current) {
      saveToHistory();
    }

    onEdgesChange(changes);
  }, [onEdgesChange, saveToHistory, isUndoingRef]);

  // ========== 拖拽创建节点 ==========

  /**
   * 处理拖拽放置
   * 用户从节点面板拖拽节点到画布时触发
   */
  const handleDrop = useCallback((event) => {
    event.preventDefault();

    // 获取拖拽的节点类型
    const nodeKey = event.dataTransfer.getData("application/reactflow");
    if (!nodeKey) return;

    // 把屏幕坐标转换成画布坐标
    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    // 创建新节点
    saveToHistory();
    const newId = `node-${nodeIdCounterRef.current++}`;
    const newNode = createNode(newId, nodeKey, position);
    setNodes((nds) => nds.concat(newNode));
  }, [screenToFlowPosition, setNodes, saveToHistory, nodeIdCounterRef]);

  /**
   * 允许拖拽放置
   * 必须阻止默认行为，否则 onDrop 不会触发
   */
  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return {
    // 连线事件
    handleConnect,         // 新建连线
    handleReconnectStart,  // 开始重连
    handleReconnect,       // 重连成功
    handleReconnectEnd,    // 重连结束
    
    // 状态变化
    handleNodesChange,     // 节点变化
    handleEdgesChange,     // 连线变化
    
    // 拖拽创建
    handleDrop,            // 放置节点
    handleDragOver,        // 允许放置
  };
};

export default useFlowEvents;
