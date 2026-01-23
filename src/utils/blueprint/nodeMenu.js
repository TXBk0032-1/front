import { getState, setState} from "../../store";

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

export function bindNodeMenuToNode(nodeId) {
    const { nodeMenu } = getState();

    setState({
        nodeMenu: {
            ...nodeMenu,
            nodeId
        }
    });
}