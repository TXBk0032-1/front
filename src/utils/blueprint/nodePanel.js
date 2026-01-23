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

export function updateNodePanelPosition(x, y) {
    const { nodePanel } = getState();

    if (!nodePanel.visible) {
        return;
    }

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
