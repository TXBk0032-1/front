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

    // 纯外部调用 setState 更新数组
    setState({
        edges: [...edges, newEdge]
    });

    return newEdge;
}
