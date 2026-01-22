import { getState, setState } from "../../store";

export function selectNode(nodeId, append = false) {
    const { selectedIds, nodes } = getState();

    let newSelectedIds;

    if (append) {
        if (selectedIds.includes(nodeId)) {
            newSelectedIds = selectedIds.filter(id => id !== nodeId);
        } else {
            newSelectedIds = [...selectedIds, nodeId];
        }
    } else {
        newSelectedIds = [nodeId];
    }

    const newNodes = nodes.map(node => ({
        ...node,
        selected: newSelectedIds.includes(node.id)
    }));

    setState({
        selectedIds: newSelectedIds,
        nodes: newNodes
    });

    return newSelectedIds;
}

export function selectNodes(nodeIds) {
    const { nodes } = getState();

    const newNodes = nodes.map(node => ({
        ...node,
        selected: nodeIds.includes(node.id)
    }));

    setState({
        selectedIds: [...nodeIds],
        nodes: newNodes
    });

    return nodeIds;
}

export function deselectNode(nodeId) {
    const { selectedIds, nodes } = getState();

    const newSelectedIds = selectedIds.filter(id => id !== nodeId);

    const newNodes = nodes.map(node => ({
        ...node,
        selected: newSelectedIds.includes(node.id)
    }));

    setState({
        selectedIds: newSelectedIds,
        nodes: newNodes
    });

    return newSelectedIds;
}

export function clearSelection() {
    const { nodes } = getState();

    const newNodes = nodes.map(node => ({
        ...node,
        selected: false
    }));

    setState({
        selectedIds: [],
        nodes: newNodes
    });

    return [];
}

export function getSelectedNodes() {
    const { selectedIds, nodes } = getState();

    return nodes.filter(node => selectedIds.includes(node.id));
}
