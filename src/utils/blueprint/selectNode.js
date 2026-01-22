import { getState, setState } from "../../store";

export function selectNode(nodeId, append = false) {
    const { selectedIds } = getState();

    let newSelectedIds;

    if (append) {
        // 追加模式：如果已选中则取消选中，未选中则添加
        if (selectedIds.includes(nodeId)) {
            newSelectedIds = selectedIds.filter(id => id !== nodeId);
        } else {
            newSelectedIds = [...selectedIds, nodeId];
        }
    } else {
        // 非追加模式：只选中当前节点
        newSelectedIds = [nodeId];
    }

    setState({
        selectedIds: newSelectedIds
    });

    return newSelectedIds;
}

export function selectNodes(nodeIds) {
    setState({
        selectedIds: [...nodeIds]
    });

    return nodeIds;
}

export function deselectNode(nodeId) {
    const { selectedIds } = getState();

    const newSelectedIds = selectedIds.filter(id => id !== nodeId);

    setState({
        selectedIds: newSelectedIds
    });

    return newSelectedIds;
}

export function clearSelection() {
    setState({
        selectedIds: []
    });

    return [];
}

export function getSelectedNodes() {
    const { selectedIds, nodes } = getState();

    return nodes.filter(node => selectedIds.includes(node.id));
}
