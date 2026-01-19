/**
 * clipboardActions.js - 剪贴板操作方法
 */

export const clipboardActions = (set, get) => ({
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
    const center = {
      x: sumX / selectedNodes.length,
      y: sumY / selectedNodes.length,
    };

    // 添加相对位置
    const nodesWithRelativePos = selectedNodes.map((node) => ({
      ...node,
      relativePosition: {
        x: node.position.x - center.x,
        y: node.position.y - center.y,
      },
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
        y: pasteCenter.y + node.relativePosition.y,
      };
      return createNodeFn(newId, node.data.nodeKey, newPosition);
    });

    set((state) => ({
      nodes: [...state.nodes, ...newNodes],
    }));
  },
});
