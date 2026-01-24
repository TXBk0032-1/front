import { getState, setState } from "../../store";

export function copyNodes() {
    const { selectedIds, nodes, edges } = getState();

    // 获取选中的节点
    const selectedNodes = nodes.filter(node => selectedIds.includes(node.id));

    // 如果没有选中节点，直接返回
    if (selectedNodes.length === 0) {
        return;
    }

    // 获取这些节点之间的所有连接线
    const selectedNodeIds = new Set(selectedIds);
    const relatedEdges = edges.filter(edge => 
        selectedNodeIds.has(edge.source) && selectedNodeIds.has(edge.target)
    );

    // 计算节点的空间中心位置
    let totalX = 0;
    let totalY = 0;
    selectedNodes.forEach(node => {
        totalX += node.position.x;
        totalY += node.position.y;
    });
    const centerX = totalX / selectedNodes.length;
    const centerY = totalY / selectedNodes.length;

    // 将节点、连接线、中心位置存储到 clipboard
    setState({
        clipboard: {
            nodes: selectedNodes,
            edges: relatedEdges,
            center: { x: centerX, y: centerY }
        }
    });

    return { nodes: selectedNodes, edges: relatedEdges, center: { x: centerX, y: centerY } };
}
