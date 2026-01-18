/**
 * store.js - Zustand 全局状态管理
 * 
 * 集中管理应用所有状态，解耦组件间的依赖
 * 
 * 状态分类：
 * - 蓝图数据：nodes, edges, nodeIdCounter
 * - UI状态：contextMenu, propertyPanel, renameModal
 * - 历史记录：past, future
 * - 剪贴板：clipboard, mousePosition
 * - WebSocket：连接状态、注册表
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { addEdge, reconnectEdge } from '@xyflow/react';

// ========== 常量 ==========
const MAX_HISTORY = 50;
const DUPLICATE_OFFSET = 50;

// ========== Zustand Store ==========
const useStore = create(
  subscribeWithSelector((set, get) => ({

    // ==================== 蓝图数据 ====================
    
    nodes: [],
    edges: [],
    nodeIdCounter: 1,

    /** 设置节点 */
    setNodes: (nodesOrUpdater) => {
      set((state) => ({
        nodes: typeof nodesOrUpdater === 'function' 
          ? nodesOrUpdater(state.nodes) 
          : nodesOrUpdater
      }));
    },

    /** 设置连线 */
    setEdges: (edgesOrUpdater) => {
      set((state) => ({
        edges: typeof edgesOrUpdater === 'function' 
          ? edgesOrUpdater(state.edges) 
          : edgesOrUpdater
      }));
    },

    /** 获取下一个节点ID */
    getNextNodeId: () => {
      const { nodeIdCounter } = get();
      set({ nodeIdCounter: nodeIdCounter + 1 });
      return `node-${nodeIdCounter}`;
    },

    /** 添加节点 */
    addNode: (node) => {
      set((state) => ({
        nodes: [...state.nodes, node]
      }));
    },

    /** 删除节点 */
    deleteNodes: (nodeIds) => {
      const ids = Array.isArray(nodeIds) ? nodeIds : [nodeIds];
      get().saveToHistory();
      set((state) => ({
        nodes: state.nodes.filter((n) => !ids.includes(n.id)),
        edges: state.edges.filter((e) => !ids.includes(e.source) && !ids.includes(e.target))
      }));
    },

    /** 更新节点数据 */
    updateNodeData: (nodeId, dataUpdater) => {
      set((state) => ({
        nodes: state.nodes.map((node) => {
          if (node.id !== nodeId) return node;
          return {
            ...node,
            data: typeof dataUpdater === 'function' 
              ? dataUpdater(node.data) 
              : { ...node.data, ...dataUpdater }
          };
        })
      }));
    },


    // ==================== 历史记录 ====================
    
    past: [],
    future: [],
    isUndoing: false,

    /** 保存当前状态到历史 */
    saveToHistory: () => {
      const { isUndoing, nodes, edges, past } = get();
      if (isUndoing) return;
      
      const snapshot = {
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges))
      };
      
      const newPast = [...past, snapshot];
      if (newPast.length > MAX_HISTORY) newPast.shift();
      
      set({ past: newPast, future: [] });
    },

    /** 撤销 */
    undo: () => {
      const { past, nodes, edges, future } = get();
      if (past.length === 0) return;
      
      set({ isUndoing: true });
      
      const currentSnapshot = {
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges))
      };
      
      const previousSnapshot = past[past.length - 1];
      
      set({
        nodes: previousSnapshot.nodes,
        edges: previousSnapshot.edges,
        past: past.slice(0, -1),
        future: [...future, currentSnapshot]
      });
      
      setTimeout(() => set({ isUndoing: false }), 0);
    },

    /** 重做 */
    redo: () => {
      const { future, nodes, edges, past } = get();
      if (future.length === 0) return;
      
      set({ isUndoing: true });
      
      const currentSnapshot = {
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges))
      };
      
      const nextSnapshot = future[future.length - 1];
      
      set({
        nodes: nextSnapshot.nodes,
        edges: nextSnapshot.edges,
        past: [...past, currentSnapshot],
        future: future.slice(0, -1)
      });
      
      setTimeout(() => set({ isUndoing: false }), 0);
    },


    // ==================== 剪贴板 ====================
    
    clipboard: null,
    mousePosition: { x: 0, y: 0 },

    /** 追踪鼠标位置 */
    setMousePosition: (x, y) => {
      set({ mousePosition: { x, y } });
    },

    /** 复制选中的节点 */
    copySelectedNodes: () => {
      const { nodes } = get();
      const selectedNodes = nodes.filter((node) => node.selected);
      if (selectedNodes.length === 0) return;
      
      // 计算中心点
      const sumX = selectedNodes.reduce((sum, n) => sum + n.position.x, 0);
      const sumY = selectedNodes.reduce((sum, n) => sum + n.position.y, 0);
      const center = { x: sumX / selectedNodes.length, y: sumY / selectedNodes.length };
      
      // 添加相对位置
      const nodesWithRelativePos = selectedNodes.map((node) => ({
        ...node,
        relativePosition: {
          x: node.position.x - center.x,
          y: node.position.y - center.y
        }
      }));
      
      set({ clipboard: { nodes: nodesWithRelativePos } });
    },

    /** 粘贴节点 */
    pasteNodes: (pasteCenter, createNodeFn) => {
      const { clipboard, getNextNodeId, saveToHistory } = get();
      if (!clipboard || clipboard.nodes.length === 0) return;
      
      saveToHistory();
      
      const newNodes = clipboard.nodes.map((node) => {
        const newId = getNextNodeId();
        const newPosition = {
          x: pasteCenter.x + node.relativePosition.x,
          y: pasteCenter.y + node.relativePosition.y
        };
        return createNodeFn(newId, node.data.nodeKey, newPosition);
      });
      
      set((state) => ({
        nodes: [...state.nodes, ...newNodes]
      }));
    },


    // ==================== 右键菜单 ====================
    
    contextMenu: null,  // { targetNodeId, nodeIds }

    /** 打开右键菜单 */
    openContextMenu: (targetNodeId, nodeIds) => {
      set({ contextMenu: { targetNodeId, nodeIds } });
    },

    /** 关闭右键菜单 */
    closeContextMenu: () => {
      set({ contextMenu: null });
    },


    // ==================== 属性面板 ====================
    
    propertyPanel: null,  // { targetNodeId }

    /** 打开属性面板 */
    openPropertyPanel: (nodeId) => {
      set({ propertyPanel: { targetNodeId: nodeId } });
    },

    /** 关闭属性面板 */
    closePropertyPanel: () => {
      set({ propertyPanel: null });
    },

    /** 更新节点参数 */
    updateNodeParam: (paramKey, newValue) => {
      const { propertyPanel, saveToHistory, updateNodeData } = get();
      if (!propertyPanel) return;
      
      updateNodeData(propertyPanel.targetNodeId, (data) => ({
        ...data,
        paramValues: {
          ...data.paramValues,
          [paramKey]: newValue
        }
      }));
      
      saveToHistory();
    },


    // ==================== 重命名弹窗 ====================
    
    renameModal: null,  // { nodeIds, currentName }

    /** 打开重命名弹窗 */
    openRenameModal: (nodeIdOrIds) => {
      const { nodes } = get();
      const nodeIds = Array.isArray(nodeIdOrIds) ? nodeIdOrIds : [nodeIdOrIds];
      if (nodeIds.length === 0) return;
      
      const firstNode = nodes.find((n) => n.id === nodeIds[0]);
      if (!firstNode) return;
      
      const currentName = firstNode.data.customLabel || firstNode.data.label;
      set({ renameModal: { nodeIds, currentName } });
    },

    /** 关闭重命名弹窗 */
    closeRenameModal: () => {
      set({ renameModal: null });
    },

    /** 确认重命名 */
    confirmRename: (newName) => {
      const { renameModal, saveToHistory, setNodes } = get();
      if (!renameModal || renameModal.nodeIds.length === 0) return;
      
      saveToHistory();
      
      const targetIds = new Set(renameModal.nodeIds);
      setNodes((nodes) =>
        nodes.map((node) => {
          if (!targetIds.has(node.id)) return node;
          return {
            ...node,
            data: {
              ...node.data,
              label: newName,
              customLabel: newName
            }
          };
        })
      );
      
      set({ renameModal: null });
    },


    // ==================== 节点操作 ====================

    /** 复制并粘贴节点（在原位置偏移） */
    duplicateNodes: (nodeIds, createNodeFn) => {
      const { nodes, getNextNodeId, saveToHistory } = get();
      const ids = Array.isArray(nodeIds) ? nodeIds : [nodeIds];
      const targetNodes = nodes.filter((n) => ids.includes(n.id));
      if (targetNodes.length === 0) return;
      
      saveToHistory();
      
      const newNodes = targetNodes.map((targetNode) => {
        const newId = getNextNodeId();
        const newPosition = {
          x: targetNode.position.x + DUPLICATE_OFFSET,
          y: targetNode.position.y + DUPLICATE_OFFSET
        };
        const newNode = createNodeFn(newId, targetNode.data.nodeKey, newPosition);
        if (targetNode.data.customLabel) {
          newNode.data.customLabel = targetNode.data.customLabel;
          newNode.data.label = targetNode.data.customLabel;
        }
        return newNode;
      });
      
      set((state) => ({
        nodes: [...state.nodes, ...newNodes]
      }));
    },


    // ==================== 连线事件 ====================

    /** 新建连线 */
    onConnect: (params) => {
      const { saveToHistory, setEdges } = get();
      saveToHistory();
      setEdges((edges) => {
        // 删除目标端口的旧连接
        const filtered = edges.filter(
          (edge) => !(edge.target === params.target && edge.targetHandle === params.targetHandle)
        );
        return addEdge(params, filtered);
      });
    },

    /** 重连线 */
    onReconnect: (oldEdge, newConnection) => {
      const { saveToHistory, setEdges } = get();
      saveToHistory();
      setEdges((edges) => reconnectEdge(oldEdge, newConnection, edges));
    },

    /** 删除连线 */
    deleteEdge: (edgeId) => {
      const { saveToHistory, setEdges } = get();
      saveToHistory();
      setEdges((edges) => edges.filter((e) => e.id !== edgeId));
    },


    // ==================== 蓝图操作 ====================

    /** 获取蓝图数据（用于导出） */
    getBlueprint: () => {
      const { nodes, edges, nodeIdCounter } = get();
      return {
        nodes: nodes.map(n => ({ 
          ...n, 
          data: { ...n.data, onDoubleClick: undefined } 
        })),
        edges,
        nodeIdCounter
      };
    },

    /** 设置蓝图数据（用于导入） */
    setBlueprint: (data) => {
      if (data.nodes) set({ nodes: data.nodes });
      if (data.edges) set({ edges: data.edges });
      if (data.nodeIdCounter) set({ nodeIdCounter: data.nodeIdCounter });
    },

    /** 重置状态 */
    resetStore: () => {
      set({
        nodes: [],
        edges: [],
        nodeIdCounter: 1,
        past: [],
        future: [],
        clipboard: null,
        contextMenu: null,
        propertyPanel: null,
        renameModal: null
      });
    },


    // ==================== WebSocket ====================
    
    wsConnected: false,
    wsConnecting: false,
    registry: null,

    setWsConnected: (connected) => set({ wsConnected: connected }),
    setWsConnecting: (connecting) => set({ wsConnecting: connecting }),
    setRegistry: (registry) => set({ registry }),


    // ==================== 缩放 ====================
    
    zoom: 1,
    setZoom: (zoom) => set({ zoom }),

  }))
);

export default useStore;
