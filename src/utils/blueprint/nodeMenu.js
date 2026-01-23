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

export function updateNodeMenuPosition(x, y) {
    const { nodeMenu } = getState();

    if (!nodeMenu.visible) {
        return;
    }

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