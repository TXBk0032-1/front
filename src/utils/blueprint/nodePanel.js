import { getState, setState } from "../../store";

export function showNodePanel() {
    const { nodePanel } = getState();

    setState({
        nodePanel: {
            ...nodePanel,
            visible: true
        }
    });
}

export function hideNodePanel() {
    const { nodePanel } = getState();

    setState({
        nodePanel: {
            ...nodePanel,
            visible: false
        }
    });
}

export function updateNodePanelPosition() {
    const { nodePanel } = getState();

    if (!nodePanel.visible) {
        return;
    }
    // 根据id查找节点位置
    const { nodes } = getState();
    const node = nodes.find(n => n.id === nodePanel.nodeId);
    if (!node) {
        return;
    }
    const { x, y } = node;

    setState({
        nodePanel: {
            ...nodePanel,
            x,
            y
        }
    });
}

export function bindNodePanelToNode(nodeId) {
    const { nodePanel } = getState();

    setState({
        nodePanel: {
            ...nodePanel,
            nodeId
        }
    });
}
