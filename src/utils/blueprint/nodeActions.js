/**
 * nodeActions.js - 节点及画布缩放操作方法
 */

export const nodeActions = (set, get) => ({
  /** 设置节点 */
  setNodes: (nodesOrUpdater) => {
    set((state) => ({
      nodes:
        typeof nodesOrUpdater === "function"
          ? nodesOrUpdater(state.nodes)
          : nodesOrUpdater,
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
      nodes: [...state.nodes, node],
    }));
  },

  /** 删除节点 */
  deleteNodes: (nodeIds) => {
    const ids = Array.isArray(nodeIds) ? nodeIds : [nodeIds];
    get().saveToHistory();
    set((state) => ({
      nodes: state.nodes.filter((n) => !ids.includes(n.id)),
      edges: state.edges.filter(
        (e) => !ids.includes(e.source) && !ids.includes(e.target),
      ),
    }));
  },

  /** 更新节点数据 */
  updateNodeData: (nodeId, dataUpdater) => {
    set((state) => ({
      nodes: state.nodes.map((node) => {
        if (node.id !== nodeId) return node;
        return {
          ...node,
          data:
            typeof dataUpdater === "function"
              ? dataUpdater(node.data)
              : { ...node.data, ...dataUpdater },
        };
      }),
    }));
  },

  /** 复制并粘贴节点（在原位置偏移） */
  duplicateNodes: (nodeIds, createNodeFn) => {
    const { nodes, getNextNodeId, saveToHistory } = get();
    const DUPLICATE_OFFSET = 50;
    const ids = Array.isArray(nodeIds) ? nodeIds : [nodeIds];
    const targetNodes = nodes.filter((n) => ids.includes(n.id));
    if (targetNodes.length === 0) return;

    saveToHistory();

    const newNodes = targetNodes.map((targetNode) => {
      const newId = getNextNodeId();
      const newPosition = {
        x: targetNode.position.x + DUPLICATE_OFFSET,
        y: targetNode.position.y + DUPLICATE_OFFSET,
      };
      const newNode = createNodeFn(
        newId,
        targetNode.data.nodeKey,
        newPosition,
      );
      if (targetNode.data.customLabel) {
        newNode.data.customLabel = targetNode.data.customLabel;
        newNode.data.label = targetNode.data.customLabel;
      }
      return newNode;
    });

    set((state) => ({
      nodes: [...state.nodes, ...newNodes],
    }));
  },

  /** 设置缩放 */
  setZoom: (zoom) => set({ zoom }),
});
