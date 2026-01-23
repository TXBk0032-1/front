import { getState, setState } from "../../store";

export function renameNode(newName) {
    const { nodes } = getState();

    const newNodes = nodes.map(node => {
        if (node.selected) {
            return {
                ...node,
                data: {
                    ...node.data,
                    name: newName
                }
            };
        }
        return node;
    });

    setState({
        nodes: newNodes
    });
}
