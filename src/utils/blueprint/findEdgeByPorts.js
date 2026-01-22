import { getState } from "../../store";

export function findEdgeByPorts(sourceNodeId, sourceHandleId, targetNodeId, targetHandleId) {
    const { edges } = getState();

    // 查找匹配的连接线
    const edge = edges.find(
        edge => edge.source === sourceNodeId && 
               edge.sourceHandle === sourceHandleId && 
               edge.target === targetNodeId && 
               edge.targetHandle === targetHandleId
    );

    return edge || null;
}
