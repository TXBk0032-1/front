/**
 * edgeActions.js - 连线操作方法
 */
import { addEdge, reconnectEdge } from "@xyflow/react";

export const edgeActions = (set, get) => ({
  /** 设置连线 */
  setEdges: (edgesOrUpdater) => {
    set((state) => ({
      edges:
        typeof edgesOrUpdater === "function"
          ? edgesOrUpdater(state.edges)
          : edgesOrUpdater,
    }));
  },

  /** 新建连线 */
  onConnect: (params) => {
    const { saveToHistory, setEdges } = get();
    saveToHistory();
    setEdges((edges) => {
      // 删除目标端口的旧连接
      const filtered = edges.filter(
        (edge) =>
          !(
            edge.target === params.target &&
            edge.targetHandle === params.targetHandle
          ),
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
});
