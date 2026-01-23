import { getState, setState } from "../../store";

export function showNodeMenu() {
    const { nodeMenu } = getState();

    setState({
        nodeMenu: {
            ...nodeMenu,
            visible: true
        }
    });
}

export function hideNodeMenu() {
    const { nodeMenu } = getState();

    setState({
        nodeMenu: {
            ...nodeMenu,
            visible: false
        }
    });
}

export function updateNodeMenuPosition() {
    const { nodeMenu } = getState();

    if (!nodeMenu.visible) {
        return;
    }
    // 根据id查找节点位置
    const { nodes } = getState();
    const node = nodes.find(n => n.id === nodeMenu.nodeId);
    if (!node) {
        return;
    }
    const { x, y } = node;

    setState({
        nodeMenu: {
            ...nodeMenu,
            x,
            y
        }
    });
}

export function bindNodeMenuToNode(nodeId) {
    const { nodeMenu } = getState();

    setState({
        nodeMenu: {
            ...nodeMenu,
            nodeId
        }
    });
}