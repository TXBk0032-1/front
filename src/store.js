/**
 * store.js - Zustand 全局状态管理
 *
 * 存储全局信息，所有组件绑定这个 store，所有组件都可以直接从 store 中获取信息，也可以直接修改信息，实现全局信息共享和任意修改
 * 所有组件相关信息全部绑定在这个 store 中，store 信息被修改就对应智能更新，不用让程序员操心react的更新渲染问题
 *
 */
import nodeRegistry from "./constants/节点格式示例.json";
import { createStore } from "zustand/vanilla";
import { useStore as useZustandStore } from "zustand";

export const store = createStore((set, get) => ({
  // ========== 蓝图基础数据 ==========
  name: "我的架构",
  nodes: [],
  edges: [],

  // ========== 选择状态 ==========
  selectedIds: [],
  selectedCategory: "all",

  // ========== UI 状态 ==========
  viewport: { x: 0, y: 0, zoom: 1 },

  // ========== 悬浮组件 ==========
  nodeMenu: { visible: false, x: 0, y: 0, nodeId: null },
  nodePanel: { visible: false, x: 0, y: 0, nodeId: null },
  renameModal: { visible: false, nodeId: null },

  // ========== 历史记录 ==========
  history: [],
  historyIndex: -1,

  // ========== 剪贴板 ==========
  clipboard: [],

  // ========== 节点定义（后端提供）==========
  registry: nodeRegistry,
}));

export function useStore(selector) {
  return useZustandStore(store, selector);
}

export function getState() {
  return store.getState();
}

export function setState(partial) {
  store.setState(partial);
}
