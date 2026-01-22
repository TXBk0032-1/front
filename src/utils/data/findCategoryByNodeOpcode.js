import { getState } from "../../store";

export function findCategoryByNodeOpcode(nodeOpcode) {
    const { registry } = getState();
    const { categories } = registry;

    // 遍历所有分组，查找包含该节点 opcode 的分组
    for (const categoryId in categories) {
        const category = categories[categoryId];
        if (category.nodes && category.nodes.includes(nodeOpcode)) {
            return {
                id: categoryId,
                label: category.label,
                color: category.color
            };
        }
    }

    // 如果没找到，返回 null
    return null;
}
