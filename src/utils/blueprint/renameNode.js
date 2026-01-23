import { getState, setState } from "../../store";

export function renameNode(newName) {
    
    const { nodes } = getState();
    // 如果是空值，就不进行重命名
    if (!newName) {
        return;
    }
    const newNodes = nodes.map(node => {
        if (node.selected) {
            return {
                ...node,
                data: {
                    ...node.data,
                    label: newName
                }
            };
        }
        return node;
    });
    

    setState({
        nodes: newNodes
    });
}
