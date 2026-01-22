import { getState, setState } from "../../store";
import { generateId } from "../data/generateId";
import { findCategoryByNodeOpcode } from "../data/findCategoryByNodeOpcode";

export function addNode(nodeOpcode, position, customProps = {}) {
    const { registry, nodes } = getState();

    const nodeTemplate = registry.nodes[nodeOpcode];
    if (!nodeTemplate) {
        console.error(`找不到 opcode 为 ${nodeOpcode} 的模板`);
        return;
    }

    // 查找节点所在分组，获取分组颜色
    const category = findCategoryByNodeOpcode(nodeOpcode);
    const categoryColor = category ? category.color : 'rgb(137, 146, 235)';

    // 拼装符合 React Flow 规范的节点结构
    const newNode = {
        id: generateId(),
        type: 'baseNode',
        position,
        data: {
            ...nodeTemplate,
            color: categoryColor,
            ...customProps
        },
    };

    // 纯外部调用 setState 更新数组
    setState({
        nodes: [...nodes, newNode]
    });

    return newNode;
}
