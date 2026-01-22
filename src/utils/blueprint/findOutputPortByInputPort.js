import { getState } from "../../store";

export function findOutputPortByInputPort(nodeId, inputHandleId) {
    const { edges } = getState();

    // 查找连接到该输入端口的连接线
    const connectedEdge = edges.find(
        edge => edge.target === nodeId && edge.targetHandle === inputHandleId
    );

    // 如果没有连接线，返回 null
    if (!connectedEdge) {
        return null;
    }

    // 返回输出端口的节点 ID 和端口 ID
    return {
        nodeId: connectedEdge.source,
        handleId: connectedEdge.sourceHandle
    };
}
