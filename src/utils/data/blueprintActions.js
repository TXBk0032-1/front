/**
 * blueprintActions.js - 蓝图全局操作方法
 */

export const blueprintActions = (set, get) => ({
  /** 获取蓝图数据（用于导出） */
  getBlueprint: () => {
    const { nodes, edges, nodeIdCounter } = get();
    return {
      nodes: nodes.map((n) => ({
        ...n,
        data: { ...n.data, onDoubleClick: undefined },
      })),
      edges,
      nodeIdCounter,
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
      renameModal: null,
    });
  },
});
