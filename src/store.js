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

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

// 导入按意义分类的操作方法
import { nodeActions } from "./utils/canvas/nodeActions";
import { edgeActions } from "./utils/canvas/edgeActions";
import { historyActions } from "./utils/core/historyActions";
import { clipboardActions } from "./utils/core/clipboardActions";
import { blueprintActions } from "./utils/data/blueprintActions";
import { uiActions } from "./utils/ui/uiActions";
import { wsActions } from "./utils/ws/wsActions";

// ========== Zustand Store ==========
const useStore = create(
  subscribeWithSelector((set, get) => ({
    // ==================== 蓝图数据 ====================
    nodes: [
      {
        id: "1",
        type: "baseNode",
        position: { x: 0, y: 0 },
        data: {
          label: "输入",
          opcode: "input",
          inputs: [],
          outputs: [
            {
              id: "out",
              label: "out",
            },
          ],
          params: {
            输出维度: {
              label: "输出维度",
              type: "array",
              default: [1, 10],
            },
          },
          nodeKey: "input",
          color: "#8B92E5",
        },
      },
    ],
    edges: [{ id: "e1-2", source: "1", target: "2" }],
    nodeIdCounter: 1,

    // ==================== 历史记录 ====================
    past: [],
    future: [],
    isUndoing: false,

    // ==================== 剪贴板 ====================
    clipboard: null,
    mousePosition: { x: 0, y: 0 },

    // ==================== 右键菜单 ====================
    contextMenu: null, // { targetNodeId, nodeIds }

    // ==================== 属性面板 ====================
    propertyPanel: null, // { targetNodeId }

    // ==================== 重命名弹窗 ====================
    renameModal: null, // { nodeIds, currentName }

    // ==================== WebSocket ====================
    wsConnected: false,
    wsConnecting: false,
    registry: null,

    // ==================== 缩放 ====================
    zoom: 1,

    // ==================== 组合操作方法 ====================
    ...nodeActions(set, get),
    ...edgeActions(set, get),
    ...historyActions(set, get),
    ...clipboardActions(set, get),
    ...blueprintActions(set, get),
    ...uiActions(set, get),
    ...wsActions(set, get),
  })),
);

export default useStore;
