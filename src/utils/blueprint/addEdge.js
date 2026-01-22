import { getState, setState } from "../../store";
import { generateId } from "../data/generateId";

export function addEdge(sourceNodeId, sourceHandleId, targetNodeId, targetHandleId, customProps = {}) {
    const { edges } = getState();

    // 拼装符合 React Flow 规范的连线结构
    const newEdge = {
        id: generateId(),
        source: sourceNodeId,
        target: targetNodeId,
        sourceHandle: sourceHandleId,
        targetHandle: targetHandleId,
        type: 'default',
        ...customProps
    };

    // 过滤掉所有连接到目标输入端口的旧连接线，然后添加新连接线
    const newEdges = edges.filter(
        edge => !(edge.target === targetNodeId && edge.targetHandle === targetHandleId)
    );

    // 纯外部调用 setState 更新数组
    setState({
        edges: [...newEdges, newEdge]
    });

    return newEdge;
}
