import { getState } from "../../store";

export function getNodeNameById(nodeId) {
    const { nodes } = getState(); // 从全局状态中获取所有节点

    const node = nodes.find(n => n.id === nodeId); // 根据 id 查找对应的节点

    if (!node) return ''; // 如果找不到节点，返回空字符串

    return node.data.label || ''; // 返回节点的名称，如果没有名称则返回空字符串
}
