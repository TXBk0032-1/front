import { getState, setState } from "../../store";

export function deleteNode(nodeId) {
    const { nodes, edges } = getState();
    // 如果nodeId有就删除，如果没有就删除所有选中的节点
    if (nodeId) {
        // 过滤掉要删除的节点
        const newNodes = nodes.filter(node => node.id !== nodeId);

        // 过滤掉与该节点相关的所有连接线
        const newEdges = edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId);

        // 纯外部调用 setState 更新数组
        setState({
            nodes: newNodes,
            edges: newEdges
        });

        return { nodes: newNodes, edges: newEdges };
    }
    else {
        const selectedNodes = nodes.filter(node => node.selected);

        const newNodes = nodes.filter(node => !node.selected);
        const newEdges = edges.filter(edge => !selectedNodes.includes(edge.source) && !selectedNodes.includes(edge.target));

        setState({
            nodes: newNodes,
            edges: newEdges
        });

        return { nodes: newNodes, edges: newEdges };
    }

}
