/**
 * historyActions.js - 历史记录操作方法
 */

const MAX_HISTORY = 50;

export const historyActions = (set, get) => ({
  /** 保存当前状态到历史 */
  saveToHistory: () => {
    const { isUndoing, nodes, edges, past } = get();
    if (isUndoing) return;

    const snapshot = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
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
      edges: JSON.parse(JSON.stringify(edges)),
    };

    const previousSnapshot = past[past.length - 1];

    set({
      nodes: previousSnapshot.nodes,
      edges: previousSnapshot.edges,
      past: past.slice(0, -1),
      future: [...future, currentSnapshot],
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
      edges: JSON.parse(JSON.stringify(edges)),
    };

    const nextSnapshot = future[future.length - 1];

    set({
      nodes: nextSnapshot.nodes,
      edges: nextSnapshot.edges,
      past: [...past, currentSnapshot],
      future: future.slice(0, -1),
    });

    setTimeout(() => set({ isUndoing: false }), 0);
  },
});
