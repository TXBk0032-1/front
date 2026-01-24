import { getState, setState } from "../../store";
import { generateId } from "../data/generateId";

export function pasteNodes(e,screenToFlowPosition) {
    const { clipboard } = getState();

    // 如果 clipboard 为空，直接返回
    if (!clipboard || !clipboard.nodes || clipboard.nodes.length === 0) {
        return;
    }

    const { nodes: clipboardNodes, edges: clipboardEdges, center } = clipboard;

    // 获取当前鼠标位置
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // 使用 screenToFlowPosition 将屏幕坐标转换为画布坐标
    const canvasPosition = screenToFlowPosition({ x: mouseX, y: mouseY });

    // 计算偏移量
    const offsetX = canvasPosition.x - center.x;
    const offsetY = canvasPosition.y - center.y;

    // 创建旧 ID 到新 ID 的映射
    const idMap = {};

    // 添加所有节点
    const newNodes = [];
    clipboardNodes.forEach(node => {
        const newNodeId = generateId();
        idMap[node.id] = newNodeId;

        // 计算新位置
        const newPosition = {
            x: node.position.x + offsetX,
            y: node.position.y + offsetY
        };

        // 手动创建节点结构
        const newNode = {
            id: newNodeId,
            type: node.type,
            position: newPosition,
            data: { ...node.data }
        };

        newNodes.push(newNode);
    });

    // 添加所有连接线
    const newEdges = [];
    clipboardEdges.forEach(edge => {
        const newSourceId = idMap[edge.source];
        const newTargetId = idMap[edge.target];

        // 只有当两个端点都存在于新节点中时才添加连接线
        if (newSourceId && newTargetId) {
            newEdges.push({
                id: generateId(),
                source: newSourceId,
                target: newTargetId,
                sourceHandle: edge.sourceHandle,
                targetHandle: edge.targetHandle,
                type: edge.type || 'default'
            });
        }
    });

    // 更新全局状态
    const { nodes: currentNodes, edges: currentEdges } = getState();
    setState({
        nodes: [...currentNodes, ...newNodes],
        edges: [...currentEdges, ...newEdges]
    });

    return { nodes: newNodes, edges: newEdges };
}
