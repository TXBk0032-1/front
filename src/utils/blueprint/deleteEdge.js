import { getState, setState } from "../../store";

export function deleteEdge(edgeId) {
    const { edges } = getState();

    // 过滤掉要删除的连接线
    const newEdges = edges.filter(edge => edge.id !== edgeId);

    // 纯外部调用 setState 更新数组
    setState({
        edges: newEdges
    });

    return newEdges;
}
