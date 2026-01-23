import { getState, setState } from "../../store";

export function updateNodeParam(nodeId, paramKey, paramValue) {
    const { nodes } = getState();

    const newNodes = nodes.map(node => {
        if (node.id === nodeId) {
            return {
                ...node,
                data: {
                    ...node.data,
                    params: {
                        ...node.data.params,
                        [paramKey]: {
                            ...node.data.params[paramKey],
                            default: paramValue
                        }
                    }
                }
            };
        }
        return node;
    });

    setState({
        nodes: newNodes
    });
}
