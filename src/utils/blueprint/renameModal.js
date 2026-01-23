import { getState, setState } from "../../store";
import { getNodeNameById } from "../data/getNodeNameById";
export function showRenameModal() {


    setSelectedNodesToRename();
    updateRenameModalValue();
    const { renameModal } = getState(); // 从全局状态中获取重命名弹窗数据

    setState({
        renameModal: {
            ...renameModal, // 保留原有数据
            visible: true // 设置弹窗可见
        }
    });

}

export function hideRenameModal() {
    const { renameModal } = getState(); // 从全局状态中获取重命名弹窗数据

    setState({
        renameModal: {
            ...renameModal, // 保留原有数据
            visible: false // 设置弹窗不可见
        }
    });
}

export function setSelectedNodesToRename() {
    const { nodes, renameModal } = getState(); // 从全局状态中获取所有节点和重命名弹窗数据

    const selectedNodeIds = nodes // 遍历所有节点
        .filter(node => node.selected) // 筛选出被选中的节点
        .map(node => node.id); // 提取这些节点的id

    setState({
        renameModal: {
            ...renameModal, // 保留原有数据
            nodeIds: selectedNodeIds // 将选中的节点id存入重命名弹窗的nodeIds数组
        }
    });
}
// 更新重命名弹窗的输入框值
export function updateRenameModalValue() {
    const { renameModal } = getState(); // 从全局状态中获取重命名弹窗数据
    const value = renameModal.nodeIds.length === 1 ? getNodeNameById(renameModal.nodeIds[0]) : '';
    const placeholder = renameModal.nodeIds.length === 1 ? getNodeNameById(renameModal.nodeIds[0]) : '多值';

    setState({
        renameModal: {
            ...renameModal, // 保留原有数据
            value, // 更新输入框的值
            placeholder // 更新占位符
        }
    });
}
