/**
 * uiActions.js - UI状态操作方法
 */

export const uiActions = (set, get) => ({
  /** 打开右键菜单 */
  openContextMenu: (targetNodeId, nodeIds) => {
    set({ contextMenu: { targetNodeId, nodeIds } });
  },

  /** 关闭右键菜单 */
  closeContextMenu: () => {
    set({ contextMenu: null });
  },

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
        [paramKey]: newValue,
      },
    }));

    saveToHistory();
  },

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
            customLabel: newName,
          },
        };
      }),
    );

    set({ renameModal: null });
  },
});
